import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { generateKeyPairSync, sign, createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { createApp } from '../src/server.js';
import { createStore } from '../src/store.js';
import { googleAuthConfig } from '../src/google-auth.js';
import { digest } from '../src/security.js';

const origin = 'https://thermidor-agence-web.fr';
const callback = '/admin/auth/google/callback';
const clientId = 'test-client.apps.googleusercontent.com';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwt = payload => {
  const data = [Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'test-key' })).toString('base64url'), Buffer.from(JSON.stringify(payload)).toString('base64url')].join('.');
  return data + '.' + sign('RSA-SHA256', Buffer.from(data), privateKey).toString('base64url');
};
async function fixture(run, envOverrides = {}) {
  const store = createStore(':memory:');
  const client = new OAuth2Client({ clientId, clientSecret: 'test-secret', redirectUri: origin + callback });
  // Only Google's HTTP responses are substituted; the real library verifies signed JWTs.
  client.getFederatedSignonCertsAsync = async () => ({ certs: { 'test-key': publicKey.export({ type: 'spki', format: 'pem' }) } });
  let nonce, exchanges = 0, tokenOptions;
  client.getToken = async options => {
    exchanges++; tokenOptions = options;
    const now = Math.floor(Date.now() / 1000);
    return { tokens: { id_token: jwt({ iss: 'https://accounts.google.com', aud: clientId, sub: 'google-admin-subject', email: 'admin@gmail.com', email_verified: true, nonce, iat: now, exp: now + 3600 }) } };
  };
  const { app } = createApp({ store, googleClient: client, env: {
    NODE_ENV: 'production', BASE_URL: origin, SESSION_SECRET: 'google-test-session-secret-at-least-32-characters',
    ADMIN_EMAIL: 'password@example.com', ADMIN_PASSWORD_HASH: '', GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: 'test-secret', GOOGLE_ADMIN_EMAIL: 'admin@gmail.com', UPLOAD_DIR: resolve('artifacts/test-uploads'), ...envOverrides
  } });
  const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = (path, cookie = '') => fetch(base + path, { redirect: 'manual', headers: { Cookie: cookie } });
  const start = async () => {
    const response = await get('/admin/auth/google'); assert.equal(response.status, 303);
    const auth = new URL(response.headers.get('location'));
    const state = auth.searchParams.get('state'); nonce = auth.searchParams.get('nonce');
    const cookie = response.headers.getSetCookie()[0].split(';')[0];
    return { response, auth, state, nonce, cookie, path: `${callback}?code=authorization-code&state=${state}` };
  };
  try { await run({ store, client, get, start, base, exchanges: () => exchanges, tokenOptions: () => tokenOptions }); }
  finally { await new Promise(resolve => server.close(resolve)); store.close(); }
}

test('Google login uses the exact production callback, minimal scope, PKCE and a browser-bound state', async () => {
  await fixture(async ({ start, store, get }) => {
    const html = await (await get('/admin/login')).text();
    assert.match(html, /Se connecter avec Google/); assert.doesNotMatch(html, /name="password"|test-secret|admin@gmail.com/);
    const flow = await start();
    assert.equal(flow.auth.origin, 'https://accounts.google.com');
    assert.equal(flow.auth.searchParams.get('redirect_uri'), origin + callback);
    assert.equal(flow.auth.searchParams.get('scope'), 'openid email');
    assert.equal(flow.auth.searchParams.get('response_type'), 'code');
    assert.equal(flow.auth.searchParams.get('access_type'), 'online');
    assert.equal(flow.auth.searchParams.get('code_challenge_method'), 'S256');
    const attempt = store.db.prepare('SELECT * FROM oauth_attempts WHERE state = ?').get(digest(flow.state));
    assert.equal(attempt.browser, digest(flow.cookie.split('=')[1]));
    assert.equal(attempt.nonce, flow.nonce);
    assert.equal(flow.auth.searchParams.get('code_challenge'), createHash('sha256').update(attempt.code_verifier).digest('base64url'));
    assert.match(flow.response.headers.getSetCookie().join(';'), /HttpOnly; Secure; SameSite=Lax/);
  });
});

test('A verified allowed Google account receives an admin session; logout revokes it and state cannot replay', async () => {
  await fixture(async ({ start, get, store, exchanges, tokenOptions, base }) => {
    const flow = await start();
    const verifier = store.db.prepare('SELECT code_verifier FROM oauth_attempts').get().code_verifier;
    const response = await get(flow.path, flow.cookie);
    assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/admin');
    assert.deepEqual(tokenOptions(), { code: 'authorization-code', codeVerifier: verifier, redirect_uri: origin + callback });
    const cookie = response.headers.getSetCookie().find(c => c.startsWith('thermidor_session=')).split(';')[0];
    assert.match(response.headers.getSetCookie().join(';'), /HttpOnly; Secure; SameSite=Lax/);
    const admin = await get('/admin/apps', cookie); assert.equal(admin.status, 200);
    const csrf = (await admin.text()).match(/name="csrf" value="([^"]+)"/)[1];
    assert.equal((await get(flow.path, flow.cookie)).headers.get('location'), '/admin/login?error=google');
    assert.equal(exchanges(), 1);
    assert.equal(store.db.prepare('SELECT count(*) AS n FROM oauth_attempts').get().n, 0);
    let logout = await fetch(base + '/admin/logout', { method: 'POST', redirect: 'manual', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ csrf: 'invalid' }) });
    assert.equal(logout.status, 403);
    logout = await fetch(base + '/admin/logout', { method: 'POST', redirect: 'manual', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ csrf }) });
    assert.equal(logout.status, 303); assert.equal((await get('/admin', cookie)).headers.get('location'), '/admin/login');
  });
});

test('Missing, wrong, expired or cancelled OAuth attempts cannot exchange tokens or create sessions', async () => {
  await fixture(async ({ start, get, store, exchanges }) => {
    const flow = await start();
    for (const [path, cookie] of [[flow.path, ''], [flow.path, 'thermidor_google=' + 'a'.repeat(64)], [`${callback}?code=x&state=${'b'.repeat(64)}`, flow.cookie], [`${callback}?code=x&state=${flow.state}&state=another`, flow.cookie]]) {
      assert.equal((await get(path, cookie)).headers.get('location'), '/admin/login?error=google');
    }
    store.db.prepare('UPDATE oauth_attempts SET expires = ?').run(Date.now() - 1000);
    assert.equal((await get(flow.path, flow.cookie)).headers.get('location'), '/admin/login?error=google');
    const cancelled = await start();
    assert.equal((await get(`${callback}?error=access_denied&state=${cancelled.state}`, cancelled.cookie)).headers.get('location'), '/admin/login?error=google');
    assert.equal(exchanges(), 0); assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n, 0);
  });
});

test('Real token verification rejects wrong email, unverified email, nonce, audience, issuer, expiry and signature', async () => {
  await fixture(async ({ start, get, store, client }) => {
    const now = Math.floor(Date.now() / 1000);
    for (const changes of [{ email: 'other@gmail.com' }, { email_verified: false }, { nonce: 'wrong' }, { aud: 'another-client' }, { iss: 'https://attacker.example' }, { iat: now - 7200, exp: now - 3600 }, { sub: '' }, { badSignature: true }]) {
      const flow = await start();
      client.getToken = async () => {
        const token = jwt({ iss: 'https://accounts.google.com', aud: clientId, sub: 'admin-sub', email: 'admin@gmail.com', email_verified: true, nonce: flow.nonce, iat: now, exp: now + 3600, ...changes });
        return { tokens: { id_token: changes.badSignature ? token.slice(0, token.lastIndexOf('.') + 1) + Buffer.alloc(256).toString('base64url') : token } };
      };
      const response = await get(flow.path, flow.cookie);
      assert.equal(response.headers.get('location'), '/admin/login?error=google', JSON.stringify(changes));
      assert.ok(!response.headers.getSetCookie().some(c => c.startsWith('thermidor_session=')));
    }
    assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n, 0);
  });
});

test('Provider failure is recoverable, exposes no secrets, and consumes the OAuth attempt', async () => {
  await fixture(async ({ start, get, client, store }) => {
    const flow = await start();
    client.getToken = async () => { throw new Error('sensitive-token-response'); };
    const response = await get(flow.path, flow.cookie);
    assert.equal(response.headers.get('location'), '/admin/login?error=google');
    const login = await (await get(response.headers.get('location'))).text();
    assert.match(login, /Connexion Google refusée ou expirée/); assert.doesNotMatch(login, /sensitive-token-response/);
    assert.equal(store.db.prepare('SELECT count(*) AS n FROM oauth_attempts').get().n, 0);
  });
});

test('Incomplete Google config is disabled, with an explicit error and the password login retained', async () => {
  assert.equal(googleAuthConfig({ GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret', ADMIN_EMAIL: 'ADMIN@EXAMPLE.COM' }, origin).allowedEmail, 'admin@example.com');
  await fixture(async ({ get }) => {
    const html = await (await get('/admin/login')).text();
    assert.doesNotMatch(html, /Se connecter avec Google/); assert.match(html, /name="password"/);
    assert.equal((await get('/admin/auth/google')).headers.get('location'), '/admin/login?error=google_unavailable');
    assert.equal((await get(callback)).headers.get('location'), '/admin/login?error=google_unavailable');
  }, { GOOGLE_CLIENT_SECRET: '', ADMIN_PASSWORD_HASH: 'configured-password' });
  assert.throws(() => createApp({ env: { NODE_ENV: 'production', BASE_URL: origin, SESSION_SECRET: 'secret-with-at-least-32-characters', ADMIN_PASSWORD_HASH: '', GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '' } }), /configured password or Google/);
});
