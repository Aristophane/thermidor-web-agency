import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { createApp } from '../src/server.js';
import { createStore } from '../src/store.js';
import { hashPassword, formToken, checkFormToken } from '../src/security.js';

let server, base, store, sessionCookie, csrf, sent = [], newProjectId;
const secret = 'test-secret-only-at-least-32-characters';
const origin = 'http://localhost:3000';
const uploadDir = resolve('artifacts/test-uploads');
const post = (path, data, headers = {}) => fetch(base + path, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded', ...headers }, body: new URLSearchParams(data), redirect: 'manual' });
const validContact = () => ({ token: formToken(secret), lang: 'fr', name: 'Camille', email: 'camille@example.com', message: 'Bonjour, je souhaite discuter de mon projet web.', company: '', need: 'developpement-web', website: '' });
before(async () => {
  store = createStore(':memory:'); mkdirSync(uploadDir, { recursive: true });
  const { app } = createApp({ store, env: { NODE_ENV: 'test', BASE_URL: origin, ADMIN_EMAIL: 'admin@example.com', ADMIN_PASSWORD_HASH: await hashPassword('a-long-test-password-123'), SESSION_SECRET: secret, UPLOAD_DIR: uploadDir, SMTP_FROM: 'test@example.com' }, mailer: { sendMail: async message => { sent.push(message); return { accepted: [typeof message.to === 'string' ? message.to : message.to.address] }; } } });
  server = app.listen(0, '127.0.0.1'); await once(server, 'listening'); base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); store.close(); });

test('French and English pages render complete content with SEO and no external assets', async () => {
  for (const path of ['/', '/en', '/expertises', '/en/expertise', '/clients', '/en/clients', '/apps', '/en/apps', '/agence', '/en/about', '/contact', '/en/contact', '/confidentialite', '/en/privacy', '/mentions-legales', '/en/legal', '/expertises/integration-intelligence-artificielle', '/en/expertise/ai-integration', '/clients/snv', '/en/clients/snv']) {
    const r = await fetch(base + path), html = await r.text();
    assert.equal(r.status, 200, path); assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
    assert.match(html, /rel="canonical"/); assert.match(html, /hreflang="fr"/); assert.match(html, /hreflang="en"/);
    assert.doesNotMatch(html, /<script[^>]+src="https?:/); assert.doesNotMatch(html, /<link[^>]+href="https?:[^>]+rel="stylesheet"/);
    assert.match(r.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  }
});
test('Legacy URLs redirect and missing routes return real 404 status', async () => {
  const old = await fetch(base + '/service', { redirect: 'manual' }); assert.equal(old.status, 301); assert.equal(old.headers.get('location'), '/expertises');
  for (const [from, to] of [['/projets', '/clients'], ['/en/projects', '/en/clients'], ['/projets/snv', '/clients/snv'], ['/en/projects/snv', '/en/clients/snv']]) {
    const response = await fetch(base + from, { redirect: 'manual' });
    assert.equal(response.status, 301); assert.equal(response.headers.get('location'), to);
  }
  assert.equal((await fetch(base + '/not-a-page')).status, 404);
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await fetch(base + '/src/server.js')).status, 404);
});
test('Contact validates token, origin and fields before passing a message to SMTP', async () => {
  let r = await post('/api/contact', validContact(), { Accept: 'application/json' }); assert.equal(r.status, 200); assert.equal(sent.length, 2);
  assert.equal(sent[0].to, 'contact@thermidor-agence-web.fr'); assert.equal(sent[1].to.address, 'camille@example.com');
  assert.deepEqual(sent[0].replyTo, { name: 'Camille', address: 'camille@example.com' });
  assert.equal(sent[1].replyTo, 'contact@thermidor-agence-web.fr');
  assert.match(sent[0].subject, /^Vous avez reçu une demande de contact sur Thermidor/);
  assert.doesNotMatch(sent[0].html, /Merci pour|Nous vous répondrons/);
  assert.match(sent[1].html, /Copie de votre message/); assert.match(sent[1].html, /Nous vous répondrons dès que possible/);
  r = await post('/api/contact', { ...validContact(), token: 'forged' }, { Accept: 'application/json' }); assert.equal(r.status, 400);
  r = await post('/api/contact', { ...validContact(), email: 'user@example.com\r\nBcc:bad@example.com' }, { Accept: 'application/json' }); assert.equal(r.status, 400);
  r = await post('/api/contact', validContact(), { Origin: 'https://evil.example', Accept: 'application/json' }); assert.equal(r.status, 403);
  assert.equal(sent.length, 2);
});
test('Contact is usable without client JavaScript and rate limits repeated requests', async () => {
  let r = await post('/api/contact', { ...validContact(), lang: 'en' }); assert.equal(r.status, 200); assert.match(await r.text(), /Thank you, your message has been sent/);
  await post('/api/contact', validContact()); r = await post('/api/contact', validContact(), { Accept: 'application/json' }); assert.equal(r.status, 429); assert.ok(r.headers.get('retry-after'));
});
test('Admin requires authentication; valid login establishes a private session', async () => {
  let r = await fetch(base + '/admin', { redirect: 'manual' }); assert.equal(r.status, 303); assert.equal(r.headers.get('location'), '/admin/login');
  r = await fetch(base + '/admin/login'); const cookie = r.headers.getSetCookie()[0].split(';')[0]; const html = await r.text(); const token = html.match(/name="csrf" value="([^"]+)"/)[1];
  r = await post('/admin/login', { csrf: token, email: 'admin@example.com', password: 'a-long-test-password-123' }, { Cookie: cookie });
  assert.equal(r.status, 303); assert.equal(r.headers.get('location'), '/admin');
  sessionCookie = r.headers.getSetCookie().find(c => c.startsWith('thermidor_session=')).split(';')[0];
  assert.match(r.headers.getSetCookie().join(' '), /HttpOnly/); assert.match(r.headers.getSetCookie().join(' '), /SameSite=Strict/);
  r = await fetch(base + '/admin', { headers: { Cookie: sessionCookie } }); assert.equal(r.headers.get('cache-control'), 'no-store');
  csrf = (await r.text()).match(/name="csrf" value="([^"]+)"/)[1];
});
test('Drafts stay private; publishing updates both language pages and sitemap; content is escaped', async () => {
  const project = { ...store.all()[0], slug: 'test-project', title: '<script>alert(1)</script>', sector_fr: '<img src=x onerror=alert(1)>', published: 0, csrf };
  let r = await post('/admin/projects/new', project, { Cookie: sessionCookie }); assert.equal(r.status, 303);
  newProjectId = store.all().find(p => p.slug === 'test-project').id;
  assert.equal((await fetch(base + '/projets/test-project')).status, 404);
  assert.doesNotMatch(await (await fetch(base + '/sitemap.xml')).text(), /test-project/);
  r = await post(`/admin/projects/${newProjectId}`, { ...project, published: 1 }, { Cookie: sessionCookie }); assert.equal(r.status, 303);
  for (const path of ['/projets/test-project', '/en/projects/test-project']) { r = await fetch(base + path); assert.equal(r.status, 200); const html = await r.text(); assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/); assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/); assert.doesNotMatch(html, /<img src=x onerror/); }
  assert.match(await (await fetch(base + '/sitemap.xml')).text(), /en\/clients\/test-project/);
});
test('Admin rejects missing CSRF, unsafe URLs, duplicate slugs and invalid image paths', async () => {
  const p = { ...store.all()[0], csrf };
  assert.equal((await post('/admin/projects/new', { ...p, csrf: 'bad' }, { Cookie: sessionCookie })).status, 403);
  assert.equal((await post('/admin/projects/new', { ...p, url: 'javascript:alert(1)' }, { Cookie: sessionCookie })).status, 400);
  assert.equal((await post('/admin/projects/new', p, { Cookie: sessionCookie })).status, 400);
  assert.equal((await post('/admin/projects/new', { ...p, image: '/uploads/../../.env' }, { Cookie: sessionCookie })).status, 400);
});
test('Image upload validates actual file contents and produces an optimised local image', async () => {
  let r = await fetch(base + '/admin/upload', { method: 'POST', headers: { Origin: origin, Cookie: sessionCookie, 'X-CSRF-Token': csrf, 'Content-Type': 'image/png' }, body: '<svg onload="alert(1)"></svg>' });
  assert.equal(r.status, 400);
  const png = await sharp({ create: { width: 64, height: 64, channels: 3, background: '#64743e' } }).png().toBuffer();
  r = await fetch(base + '/admin/upload', { method: 'POST', headers: { Origin: origin, Cookie: sessionCookie, 'X-CSRF-Token': csrf, 'Content-Type': 'image/png' }, body: png });
  assert.equal(r.status, 200); const { path } = await r.json(); assert.match(path, /^\/uploads\/[a-f0-9]{32}\.webp$/);
  const asset = await fetch(base + path); assert.equal(asset.status, 200); assert.match(asset.headers.get('content-type'), /image\/webp/);
});
test('Deleting a project removes public pages and logging out revokes access', async () => {
  let r = await post(`/admin/projects/${newProjectId}/delete`, { csrf }, { Cookie: sessionCookie }); assert.equal(r.status, 303);
  assert.equal((await fetch(base + '/projets/test-project')).status, 404);
  r = await post('/admin/logout', { csrf }, { Cookie: sessionCookie }); assert.equal(r.status, 303);
  r = await fetch(base + '/admin', { headers: { Cookie: sessionCookie }, redirect: 'manual' }); assert.equal(r.status, 303);
});
test('Signed forms reject tampering, expired tokens and future timestamps', () => {
  assert.equal(checkFormToken(formToken(secret), secret), true);
  assert.equal(checkFormToken(formToken(secret, Date.now() - 25 * 3600000), secret), false);
  assert.equal(checkFormToken(formToken(secret, Date.now() + 60000), secret), false);
  assert.equal(checkFormToken(formToken(secret), 'wrong-secret'), false);
});
test('Missing SMTP never returns a false delivery confirmation', async () => {
  const isolated = createApp({ store: createStore(':memory:'), env: { NODE_ENV: 'test', BASE_URL: origin, SESSION_SECRET: secret, SMTP_HOST: '', SMTP_FROM: '', UPLOAD_DIR: uploadDir } });
  const listener = isolated.app.listen(0, '127.0.0.1'); await once(listener, 'listening');
  try { const r = await fetch(`http://127.0.0.1:${listener.address().port}/api/contact`, { method: 'POST', headers: { Origin: origin, Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(validContact()) }); assert.equal(r.status, 503); assert.match((await r.json()).message, /n’a pas pu être envoyé/); }
  finally { await new Promise(resolve => listener.close(resolve)); isolated.store.close(); }
});
