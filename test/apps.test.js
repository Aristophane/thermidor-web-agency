import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createApp } from '../src/server.js';
import { createStore } from '../src/store.js';
import { hashPassword } from '../src/security.js';

let server, store, base, cookie, csrf;
const origin = 'http://localhost:3000';
const post = (path, body, authenticated = true, source = origin) => fetch(base + path, {
  method: 'POST', redirect: 'manual', headers: { Origin: source, 'Content-Type': 'application/x-www-form-urlencoded', ...(authenticated ? { Cookie: cookie } : {}) }, body: new URLSearchParams(body)
});
const get = path => fetch(base + path, { headers: { Cookie: cookie }, redirect: 'manual' });
before(async () => {
  store = createStore(':memory:');
  const { app } = createApp({ store, env: { NODE_ENV: 'test', BASE_URL: origin, ADMIN_EMAIL: 'apps@example.com', ADMIN_PASSWORD_HASH: await hashPassword('apps-test-password-123'), SESSION_SECRET: 'apps-tests-secret-at-least-32-characters', UPLOAD_DIR: resolve('artifacts/test-uploads') } });
  server = app.listen(0, '127.0.0.1'); await once(server, 'listening'); base = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(base + '/admin/login'); cookie = login.headers.getSetCookie()[0].split(';')[0];
  const token = (await login.text()).match(/name="csrf" value="([^"]+)"/)[1];
  const response = await post('/admin/login', { csrf: token, email: 'apps@example.com', password: 'apps-test-password-123' });
  assert.equal(response.status, 303);
  cookie = response.headers.getSetCookie().find(c => c.startsWith('thermidor_session=')).split(';')[0];
  csrf = (await (await get('/admin/apps')).text()).match(/name="csrf" value="([^"]+)"/)[1];
});
after(async () => { await new Promise(resolve => server.close(resolve)); store.close(); });

test('Clients and Apps navigation, empty states and separate admin editors', async () => {
  for (const [path, prefix] of [['/', ''], ['/en', '/en']]) {
    const html = await (await fetch(base + path)).text();
    for (const nav of [html.match(/<nav class="desktop-nav"[^>]*>(.*?)<\/nav>/s)[1], html.match(/<nav class="mobile-nav"[^>]*>(.*?)<\/nav>/s)[1], html.match(/<footer.*?<\/footer>/s)[0]]) {
      assert.match(nav, new RegExp(`href="${prefix}/clients"[^>]*>Clients`));
      assert.match(nav, new RegExp(`href="${prefix}/apps"[^>]*>Apps`));
      assert.doesNotMatch(nav, />Projets<|>Projects</);
    }
  }
  assert.match(await (await fetch(base + '/apps')).text(), /Nos applications seront bientôt présentées ici/);
  assert.match(await (await get('/admin/apps')).text(), /Aucune app pour le moment/);
  assert.match(await (await get('/admin/clients')).text(), /SNV/);
  const editor = await (await get('/admin/apps/new')).text();
  assert.match(editor, /Nouvelle app/); assert.match(editor, /action="\/admin\/apps\/new"/);
  assert.match(editor, /href="\/admin\/apps" aria-current="page"/);
  for (const name of ['title', 'slug', 'url', 'sector_fr', 'sector_en', 'subtitle_fr', 'subtitle_en', 'description_fr', 'description_en', 'published', 'position', 'image']) assert.ok(editor.includes(`name="${name}"`), name);
});

test('App lifecycle stays isolated from clients, escapes content, and updates bilingual pages and sitemap', async () => {
  const clients = store.all();
  // Identical slugs may exist in the two independent sections.
  const app = { ...clients[0], csrf, title: 'App <script>alert(1)</script>', subtitle_fr: 'Une app française', subtitle_en: 'An English app', published: 0 };
  let response = await post('/admin/apps/new', app); assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/admin/apps?saved=1');
  const saved = store.apps.all()[0];
  for (const prefix of ['', '/en']) assert.equal((await fetch(`${base}${prefix}/apps/${app.slug}`)).status, 404);
  assert.doesNotMatch(await (await fetch(base + '/sitemap.xml')).text(), new RegExp(`/apps/${app.slug}`));
  response = await post(`/admin/apps/${saved.id}`, { ...app, published: 1 }); assert.equal(response.status, 303);
  for (const [prefix, subtitle] of [['', app.subtitle_fr], ['/en', app.subtitle_en]]) {
    const html = await (await fetch(`${base}${prefix}/apps/${app.slug}`)).text();
    assert.match(html, /App &lt;script&gt;alert\(1\)&lt;\/script&gt;/); assert.doesNotMatch(html, /<script>alert/);
    assert.ok(html.includes(subtitle));
    assert.ok(html.includes(`rel="canonical" href="${origin}${prefix}/apps/${app.slug}"`));
    assert.ok(html.includes(`hreflang="fr" href="${origin}/apps/${app.slug}"`));
    assert.ok(html.includes(`hreflang="en" href="${origin}/en/apps/${app.slug}"`));
    assert.ok(html.includes(`href="${prefix}/apps" aria-current="page"`));
    assert.ok((await (await fetch(`${base}${prefix}/apps`)).text()).includes(`href="${prefix}/apps/${app.slug}"`));
  }
  assert.match(await (await fetch(base + '/sitemap.xml')).text(), new RegExp(`/en/apps/${app.slug}`));
  assert.match(await (await get(`/admin/apps/${saved.id}`)).text(), new RegExp(`href="/apps/${app.slug}"`));
  assert.doesNotMatch(await (await get('/admin/clients')).text(), /App &lt;script/);
  assert.deepEqual(store.all(), clients);
  assert.equal((await post(`/admin/apps/${saved.id}`, { ...app, published: 0 })).status, 303);
  assert.equal((await fetch(`${base}/apps/${app.slug}`)).status, 404);
  assert.equal((await post(`/admin/apps/${saved.id}/delete`, { csrf })).status, 303);
  assert.equal(store.apps.all().length, 0); assert.deepEqual(store.all(), clients);
  assert.equal((await get(`/admin/apps/${saved.id}`)).status, 404);
});

test('Apps enforce authentication, CSRF, origin, validation, unique slugs and missing-record checks', async () => {
  const app = { ...store.all()[0], csrf, slug: 'validation-app' };
  assert.equal((await fetch(base + '/admin/apps', { redirect: 'manual' })).status, 303);
  assert.equal((await post('/admin/apps/new', app, false)).status, 303);
  assert.equal((await post('/admin/apps/new', { ...app, csrf: 'bad' })).status, 403);
  assert.equal((await post('/admin/apps/new', app, true, 'https://other.example')).status, 403);
  for (const invalid of [{ url: 'javascript:alert(1)' }, { image: '/uploads/../../.env' }, { description_en: '' }, { published: 'yes' }, { position: -1 }]) {
    const response = await post('/admin/apps/new', { ...app, ...invalid }); assert.equal(response.status, 400);
    assert.match(await response.text(), /action="\/admin\/apps\/new"/);
  }
  assert.equal((await post('/admin/apps/new', app)).status, 303);
  assert.equal((await post('/admin/apps/new', app)).status, 400);
  assert.equal((await post('/admin/apps/999999', app)).status, 404);
  assert.equal((await post('/admin/apps/999999/delete', { csrf })).status, 404);
  assert.equal((await post(`/admin/apps/${store.apps.all()[0].id}/delete`, { csrf })).status, 303);
});

test('An existing database gains Apps without reseeding or changing clients, and both collections persist', () => {
  const directory = mkdtempSync(join(tmpdir(), 'thermidor-apps-'));
  let persistent;
  try {
    const filename = join(directory, 'site.sqlite');
    persistent = createStore(filename);
    const client = { ...persistent.all()[0], title: 'Existing customised client' };
    persistent.save(client, client.id);
    const originalClients = persistent.all();
    // Reproduce the pre-Apps database schema.
    persistent.db.exec('DROP TABLE apps'); persistent.close(); persistent = createStore(filename);
    assert.deepEqual(persistent.all(), originalClients); assert.equal(persistent.all().length, 3); assert.equal(persistent.apps.all().length, 0);
    persistent.apps.save({ ...client, title: 'Persisted app', position: 2 });
    persistent.apps.save({ ...client, slug: 'first-app', title: 'First app', position: 1 });
    persistent.close(); persistent = createStore(filename);
    assert.deepEqual(persistent.apps.all().map(p => p.title), ['First app', 'Persisted app']);
    assert.equal(persistent.byId(client.id).title, client.title);
  } finally { persistent?.close(); rmSync(directory, { recursive: true, force: true }); }
});
