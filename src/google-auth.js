import { OAuth2Client, CodeChallengeMethod } from 'google-auth-library';
import { randomToken, digest, limiter } from './security.js';

export const googleCallbackPath = '/admin/auth/google/callback';
export function googleAuthConfig(env, baseUrl) {
  const clientId = (env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (env.GOOGLE_CLIENT_SECRET || '').trim();
  const allowedEmail = (env.GOOGLE_ADMIN_EMAIL || env.ADMIN_EMAIL || '').trim().toLowerCase();
  return { clientId, clientSecret, allowedEmail, redirectUri: `${baseUrl}${googleCallbackPath}`, enabled: Boolean(clientId && clientSecret && allowedEmail) };
}

export function mountGoogleAuth(app, { config, store, production, readCookie, startSession, client }) {
  const cookieName = 'thermidor_google';
  // Google returns by cross-site GET. Lax lets the browser return this binding cookie.
  const cookieOptions = { httpOnly: true, secure: production, sameSite: 'lax', path: '/admin/auth/google' };
  const oauth = config.enabled ? (client || new OAuth2Client({
    clientId: config.clientId, clientSecret: config.clientSecret, redirectUri: config.redirectUri,
    transporterOptions: { timeout: 10000, retry: false }
  })) : null;
  const fail = res => res.redirect(303, '/admin/login?error=google');
  app.get('/admin/auth/google', limiter({ windowMs: 15 * 60 * 1000, max: 20 }), (req, res) => {
    if (!oauth) return res.redirect(303, '/admin/login?error=google_unavailable');
    const previous = readCookie(req, cookieName);
    store.db.prepare('DELETE FROM oauth_attempts WHERE expires <= ? OR browser = ?').run(Date.now(), digest(previous));
    const state = randomToken(), browser = randomToken(), nonce = randomToken(), codeVerifier = randomToken();
    store.db.prepare('INSERT INTO oauth_attempts (state, browser, nonce, code_verifier, expires) VALUES (?, ?, ?, ?, ?)')
      .run(digest(state), digest(browser), nonce, codeVerifier, Date.now() + 10 * 60 * 1000);
    res.cookie(cookieName, browser, { ...cookieOptions, maxAge: 10 * 60 * 1000 });
    const url = oauth.generateAuthUrl({
      scope: ['openid', 'email'], response_type: 'code', access_type: 'online', prompt: 'select_account',
      state, nonce, code_challenge: Buffer.from(digest(codeVerifier), 'hex').toString('base64url'),
      code_challenge_method: CodeChallengeMethod.S256
    });
    res.redirect(303, url);
  });
  app.get(googleCallbackPath, async (req, res) => {
    res.set('Referrer-Policy', 'no-referrer');
    res.clearCookie(cookieName, cookieOptions);
    if (!oauth) return res.redirect(303, '/admin/login?error=google_unavailable');
    const { state, code, error } = req.query;
    const browser = readCookie(req, cookieName);
    if (typeof state !== 'string' || !/^[a-f0-9]{64}$/.test(state) || !/^[a-f0-9]{64}$/.test(browser)) return fail(res);
    // Atomically consume the attempt before making any network request, preventing replay.
    const attempt = store.db.prepare('DELETE FROM oauth_attempts WHERE state = ? AND browser = ? AND expires > ? RETURNING *')
      .get(digest(state), digest(browser), Date.now());
    if (!attempt || error || typeof code !== 'string' || !code || code.length > 4096) return fail(res);
    try {
      const { tokens } = await oauth.getToken({ code, codeVerifier: attempt.code_verifier, redirect_uri: config.redirectUri });
      if (!tokens.id_token) return fail(res);
      const ticket = await oauth.verifyIdToken({ idToken: tokens.id_token, audience: config.clientId });
      const identity = ticket.getPayload();
      if (!identity || identity.nonce !== attempt.nonce || !identity.sub || identity.email_verified !== true ||
        typeof identity.email !== 'string' || identity.email.toLowerCase() !== config.allowedEmail) return fail(res);
      // No Google access or refresh token is persisted: only the local admin session.
      startSession(req, res, 'lax');
      res.redirect(303, '/admin');
    } catch {
      // Never expose authorization codes, credentials or token responses in logs or HTML.
      return fail(res);
    }
  });
}
