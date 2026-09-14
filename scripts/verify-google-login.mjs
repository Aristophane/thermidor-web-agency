import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { OAuth2Client } from 'google-auth-library';
import { generateKeyPairSync, sign } from 'node:crypto';
import { once } from 'node:events';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';
import { createStore } from '../src/store.js';
import { hashPassword } from '../src/security.js';

const base = 'http://127.0.0.1:3151', callback = `${base}/admin/auth/google/callback`;
const clientId = 'browser-test.apps.googleusercontent.com';
const output = resolve('artifacts/qa-google-login'); mkdirSync(output, { recursive: true });
const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
const client = new OAuth2Client({ clientId, clientSecret: 'test-secret', redirectUri: callback });
let nonce;
client.getFederatedSignonCertsAsync = async () => ({ certs: { test: keys.publicKey.export({ type: 'spki', format: 'pem' }) } });
client.getToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  const data = [Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'test' })).toString('base64url'), Buffer.from(JSON.stringify({ iss: 'https://accounts.google.com', aud: clientId, sub: 'browser-admin', email: 'browser@gmail.com', email_verified: true, nonce, iat: now, exp: now + 3600 })).toString('base64url')].join('.');
  return { tokens: { id_token: data + '.' + sign('RSA-SHA256', Buffer.from(data), keys.privateKey).toString('base64url') } };
};
const store = createStore(':memory:');
const { app } = createApp({ store, googleClient: client, env: { NODE_ENV: 'test', BASE_URL: base, SESSION_SECRET: 'browser-google-test-secret-at-least-32-characters', ADMIN_EMAIL: 'password@example.com', ADMIN_PASSWORD_HASH: await hashPassword('browser-test-password-123'), GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: 'test-secret', GOOGLE_ADMIN_EMAIL: 'browser@gmail.com', UPLOAD_DIR: resolve('artifacts/test-uploads'), SMTP_HOST: '', SMTP_FROM: '' } });
const server = app.listen(3151, '127.0.0.1'); await once(server, 'listening');
let browser;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10000); page.setDefaultNavigationTimeout(10000);
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await context.route('https://accounts.google.com/**', async route => {
    const url = new URL(route.request().url()); nonce = url.searchParams.get('nonce');
    assert.equal(url.searchParams.get('redirect_uri'), callback);
    await route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<html><head><meta charset="utf-8"></head><body><a href="${callback}?code=test-code&amp;state=${url.searchParams.get('state')}">Retour de test à Thermidor</a></body></html>` });
  });
  await page.goto(base + '/admin/login');
  await page.screenshot({ path: `${output}/login-desktop.png`, fullPage: true });
  assert.equal(await page.getByLabel('Mot de passe').isVisible(), true);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal(await page.getByRole('link', { name: 'Se connecter avec Google' }).isVisible(), true);
  }
  await page.screenshot({ path: `${output}/login-mobile.png`, fullPage: true });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(axe.violations.map(v => v.id), []);
  await page.getByRole('link', { name: 'Se connecter avec Google' }).click();
  await page.waitForURL('https://accounts.google.com/**');
  // Playwright routes only the initial URL of a redirect chain. Reload to serve the provider fixture.
  await page.goto(page.url());
  await page.getByRole('link', { name: 'Retour de test à Thermidor' }).click();
  await page.waitForURL(base + '/admin');
  assert.equal(await page.locator('.admin-tabs').getByRole('link', { name: 'Apps' }).isVisible(), true);
  assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n, 1);
  assert.ok((await context.cookies()).some(cookie => cookie.name === 'thermidor_session' && cookie.httpOnly && cookie.sameSite === 'Lax'));
  await page.getByRole('button', { name: 'Déconnexion' }).click();
  await page.waitForURL(base + '/admin/login');
  assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n, 0);
  assert.deepEqual(errors, []);
  console.log('Google browser checks passed: desktop/mobile login, accessibility, simulated cross-site Google return, real signed-token verification, admin access and logout.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); store.close(); }
