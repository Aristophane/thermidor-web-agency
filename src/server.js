import express from 'express';
import nodemailer from 'nodemailer';
import sharp from 'sharp';
import { resolve, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.js';
import { renderPage, escape } from './views.js';
import { adminPage } from './admin-views.js';
import { services, paths } from './content.js';
import { randomToken, digest, verifyPassword, formToken, checkFormToken, limiter } from './security.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
export function createApp(overrides = {}) {
  const env = { ...process.env, ...overrides.env }, production = env.NODE_ENV === 'production';
  const baseUrl = (env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  if (production && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32 || !env.ADMIN_PASSWORD_HASH || !env.ADMIN_EMAIL || !baseUrl.startsWith('https://'))) throw new Error('Production requires HTTPS BASE_URL, SESSION_SECRET (32+ characters), ADMIN_EMAIL and ADMIN_PASSWORD_HASH.');
  const secret = env.SESSION_SECRET || randomToken();
  const store = overrides.store || createStore(resolve(env.DATABASE_PATH || join(root, 'data/thermidor.sqlite')));
  const uploadDir = resolve(env.UPLOAD_DIR || join(root, 'public/uploads'));
  mkdirSync(uploadDir, { recursive: true });
  const smtpReady = Boolean(overrides.mailer || (env.SMTP_HOST && env.SMTP_FROM));
  const mailer = overrides.mailer || (smtpReady ? nodemailer.createTransport({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true', requireTLS: env.SMTP_SECURE !== 'true', auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000 }) : null);
  const app = express();
  app.disable('x-powered-by');
  if (env.TRUST_PROXY === 'loopback') app.set('trust proxy', 'loopback');
  if (env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'" });
    if (production) res.set('Strict-Transport-Security', 'max-age=31536000');
    next();
  });
  app.use('/uploads', express.static(uploadDir, { maxAge: '30d', immutable: true, dotfiles: 'deny', index: false }));
  app.use(express.static(join(root, 'public'), { maxAge: '1h', dotfiles: 'deny', index: false }));
  app.use(express.urlencoded({ extended: false, limit: '40kb', parameterLimit: 30 }));
  const readCookie = (req, name) => req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='))?.slice(name.length + 1) || '';
  const sameOrigin = (req, res, next) => {
    let source = req.get('origin');
    if (!source && req.get('referer')) { try { source = new URL(req.get('referer')).origin; } catch {} }
    if (source !== new URL(baseUrl).origin) return res.status(403).send({ message: 'Origine de la requête refusée. Rechargez la page.' });
    next();
  };
  const loadSession = (req, res, next) => {
    const raw = readCookie(req, 'thermidor_session');
    if (!/^[a-f0-9]{64}$/.test(raw)) return res.redirect(303, '/admin/login');
    const session = store.db.prepare('SELECT * FROM sessions WHERE id = ? AND expires > ?').get(digest(raw), Date.now());
    if (!session) return res.redirect(303, '/admin/login');
    req.adminSession = session; next();
  };
  const csrfGuard = (req, res, next) => {
    if ((req.body?.csrf || req.get('X-CSRF-Token')) !== req.adminSession.csrf) return res.status(403).send({ message: 'Session expirée ou formulaire invalide. Rechargez la page.' });
    next();
  };
  const cookieOptions = { httpOnly: true, secure: production, sameSite: 'strict', path: '/admin' };
  const adminRender = (req, res, options) => res.send(adminPage({ csrf: req.adminSession?.csrf, smtpReady, ...options }));
  app.use('/admin', (req, res, next) => { res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }); next(); });
  app.get('/admin/login', (req, res) => {
    const csrf = formToken(secret); res.cookie('thermidor_login', csrf, { ...cookieOptions, maxAge: 3600000 });
    adminRender(req, res, { page: 'login', csrf, configured: Boolean(env.ADMIN_PASSWORD_HASH), error: req.query.error ? 'Identifiants incorrects ou formulaire expiré.' : '' });
  });
  app.post('/admin/login', sameOrigin, limiter({ windowMs: 15 * 60 * 1000, max: 8 }), async (req, res) => {
    const validCsrf = checkFormToken(req.body.csrf, secret) && req.body.csrf === readCookie(req, 'thermidor_login');
    const validPassword = validCsrf && await verifyPassword(req.body.password, env.ADMIN_PASSWORD_HASH);
    if (!validPassword || typeof req.body.email !== 'string' || req.body.email.toLowerCase() !== (env.ADMIN_EMAIL || '').toLowerCase()) return res.redirect(303, '/admin/login?error=1');
    const token = randomToken();
    store.db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
    store.db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(token), randomToken(), Date.now() + 8 * 60 * 60 * 1000);
    res.cookie('thermidor_session', token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });
    res.clearCookie('thermidor_login', cookieOptions); res.redirect(303, '/admin');
  });
  app.get('/admin', loadSession, (req, res) => adminRender(req, res, { projects: store.all(), saved: req.query.saved === '1' }));
  app.post('/admin/logout', sameOrigin, loadSession, csrfGuard, (req, res) => { store.db.prepare('DELETE FROM sessions WHERE id = ?').run(req.adminSession.id); res.clearCookie('thermidor_session', cookieOptions); res.redirect(303, '/admin/login'); });
  app.get('/admin/projects/new', loadSession, (req, res) => adminRender(req, res, { page: 'edit' }));
  app.get('/admin/projects/:id', loadSession, (req, res) => {
    const project = store.byId(req.params.id); if (!project) return res.status(404).send('Projet introuvable.');
    adminRender(req, res, { page: 'edit', project });
  });
  app.post('/admin/projects/:id', sameOrigin, loadSession, csrfGuard, (req, res) => {
    const id = req.params.id === 'new' ? null : req.params.id;
    if (id && !store.byId(id)) return res.status(404).send('Projet introuvable.');
    try { const project = validateProject(req.body, uploadDir); store.save(project, id); res.redirect(303, '/admin?saved=1'); }
    catch (error) { res.status(400); adminRender(req, res, { page: 'edit', project: { ...req.body, id }, error: error.message.includes('UNIQUE') ? 'Cette adresse de page existe déjà. Choisissez-en une autre.' : error.message }); }
  });
  app.post('/admin/projects/:id/delete', sameOrigin, loadSession, csrfGuard, (req, res) => { store.remove(req.params.id); res.redirect(303, '/admin?saved=1'); });
  app.post('/admin/upload', sameOrigin, loadSession, csrfGuard, limiter({ windowMs: 60000, max: 12 }), express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '8mb' }), async (req, res) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ message: 'Choisissez un fichier JPG, PNG ou WebP.' });
    try {
      const image = sharp(req.body, { limitInputPixels: 40000000, failOn: 'warning' });
      const info = await image.metadata();
      if (!['jpeg', 'png', 'webp'].includes(info.format) || (info.pages || 1) > 1) throw new Error('Format non pris en charge.');
      const filename = randomToken().slice(0, 32) + '.webp';
      await image.rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(uploadDir, filename));
      res.json({ path: '/uploads/' + filename });
    } catch { res.status(400).json({ message: 'Image illisible ou trop grande. Essayez un autre fichier JPG, PNG ou WebP.' }); }
  });
  app.post('/api/contact', sameOrigin, limiter({ windowMs: 15 * 60 * 1000, max: 5 }), async (req, res) => {
    const lang = req.body.lang === 'en' ? 'en' : 'fr';
    const respond = (code, message) => {
      res.status(code);
      if (req.get('accept')?.includes('application/json')) return res.json({ message });
      return res.send(renderPage({ lang, page: 'contact', token: formToken(secret), baseUrl, status: message }));
    };
    const failure = lang === 'fr' ? 'Le message n’a pas pu être envoyé. Écrivez-nous à contact@thermidor-agence-web.fr.' : 'Your message could not be sent. Please email contact@thermidor-agence-web.fr.';
    if (!checkFormToken(req.body.token, secret)) return respond(400, lang === 'fr' ? 'Ce formulaire a expiré. Rechargez la page avant de réessayer.' : 'This form has expired. Please reload the page and try again.');
    if (req.body.website) return respond(400, failure);
    const { name, email, company = '', message, need = '' } = req.body;
    if (typeof name !== 'string' || !name.trim() || name.length > 120 || /[\r\n]/.test(name) || typeof email !== 'string' || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || typeof company !== 'string' || company.length > 160 || typeof message !== 'string' || message.trim().length < 20 || message.length > 5000 || typeof need !== 'string' || (need && need !== 'other' && !services.some(s => s.slug === need))) return respond(400, lang === 'fr' ? 'Vérifiez votre nom, votre email et votre message (20 caractères minimum).' : 'Please check your name, email and message (at least 20 characters).');
    if (!smtpReady) return respond(503, failure);
    try {
      const topic = services.find(s => s.slug === need)?.title[lang === 'fr' ? 0 : 1] || (lang === 'fr' ? 'Prise de contact' : 'Enquiry');
      const result = await mailer.sendMail({ from: env.SMTP_FROM, to: 'contact@thermidor-agence-web.fr', replyTo: { name: name.trim(), address: email.trim() }, subject: `[Thermidor] ${topic}`, text: `Nom : ${name.trim()}\nEmail : ${email.trim()}\nEntreprise : ${company.trim()}\nSujet : ${topic}\nLangue : ${lang}\n\n${message.trim()}`, disableFileAccess: true, disableUrlAccess: true });
      if (!result.accepted?.length) throw new Error('SMTP recipient not accepted');
      return respond(200, lang === 'fr' ? 'Merci, votre message a bien été envoyé. Nous reviendrons vers vous par email.' : 'Thank you, your message has been sent. We will get back to you by email.');
    } catch { console.error('Contact: SMTP delivery failed.'); return respond(502, failure); }
  });
  const legacy = { '/service': '/expertises', '/services': '/expertises', '/index.html': '/en', '/index-fr.html': '/', '/services-fr.html': '/expertises', '/services.html': '/en/expertise', '/work.html': '/en/projects', '/projets-web-seo.html': '/projets' };
  for (const [from, to] of Object.entries(legacy)) app.get(from, (req, res) => res.redirect(301, to));
  app.get('/healthz', (req, res) => { store.db.prepare('SELECT 1').get(); res.json({ status: 'ok' }); });
  app.get('/robots.txt', (req, res) => res.type('text').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${baseUrl}/sitemap.xml\n`));
  app.get('/sitemap.xml', (req, res) => {
    const pairs = Object.keys(paths.fr).map(key => ({ fr: paths.fr[key], en: paths.en[key] }));
    for (const s of services) pairs.push({ fr: `${paths.fr.services}/${s.slug}`, en: `${paths.en.services}/${s.enSlug}` });
    for (const p of store.all(true)) pairs.push({ fr: `${paths.fr.projects}/${p.slug}`, en: `${paths.en.projects}/${p.slug}` });
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pairs.flatMap(pair => ['fr', 'en'].map(lang => `<url><loc>${escape(baseUrl + pair[lang])}</loc><xhtml:link rel="alternate" hreflang="fr" href="${escape(baseUrl + pair.fr)}"/><xhtml:link rel="alternate" hreflang="en" href="${escape(baseUrl + pair.en)}"/></url>`)).join('')}</urlset>`);
  });
  app.use((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).send('Method not allowed');
    const pathname = req.path.replace(/\/$/, '') || '/';
    if (req.path !== pathname) return res.redirect(301, pathname);
    const lang = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
    let page = Object.entries(paths[lang]).find(([, path]) => path === pathname)?.[0], project, service;
    if (!page && pathname.startsWith(paths[lang].projects + '/')) { project = store.bySlug(pathname.slice(paths[lang].projects.length + 1)); if (project) page = 'project'; }
    if (!page && pathname.startsWith(paths[lang].services + '/')) { service = services.find(s => (lang === 'fr' ? s.slug : s.enSlug) === pathname.slice(paths[lang].services.length + 1)); if (service) page = 'service'; }
    if (!page) res.status(404);
    res.set('Cache-Control', 'no-cache');
    res.send(renderPage({ lang, page: page || '404', project, service, projects: store.all(true), token: formToken(secret), baseUrl, legal: { company: env.LEGAL_COMPANY, address: env.LEGAL_ADDRESS, registration: env.LEGAL_REGISTRATION, director: env.LEGAL_DIRECTOR, host: env.LEGAL_HOST } }));
  });
  app.use((error, req, res, next) => {
    console.error('Request failed:', error.type || error.code || 'internal_error');
    if (res.headersSent) return next(error);
    res.status(error.status === 413 ? 413 : 500).json({ message: error.status === 413 ? 'Le fichier ou le formulaire dépasse la taille autorisée.' : 'Une erreur est survenue. Merci de réessayer.' });
  });
  return { app, store };
}

export function validateProject(body, uploadDir) {
  const limits = { title: 120, slug: 80, url: 500, sector_fr: 100, sector_en: 100, subtitle_fr: 200, subtitle_en: 200, description_fr: 6000, description_en: 6000, image: 180 };
  const p = {};
  for (const [key, max] of Object.entries(limits)) {
    if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max) throw new Error(`Le champ « ${key} » est obligatoire et limité à ${max} caractères.`);
    p[key] = body[key].trim();
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) throw new Error('L’adresse doit contenir uniquement des lettres minuscules, des chiffres et des tirets.');
  let url; try { url = new URL(p.url); } catch { throw new Error('Le lien du site est invalide.'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Le lien doit commencer par https:// et ne pas contenir d’identifiants.');
  const builtIns = ['/media/snv.webp', '/media/maison-charlet.webp', '/media/junaki.webp', '/media/project-placeholder.svg'];
  if (!builtIns.includes(p.image) && (!/^\/uploads\/[a-f0-9]{32}\.webp$/.test(p.image) || !existsSync(join(uploadDir, p.image.split('/').at(-1))))) throw new Error('Importez une image valide avant d’enregistrer.');
  if (!['0', '1'].includes(String(body.published))) throw new Error('Statut de publication invalide.');
  p.position = Number(body.position); if (!Number.isInteger(p.position) || p.position < 0 || p.position > 9999) throw new Error('L’ordre doit être un entier compris entre 0 et 9999.');
  p.published = Number(body.published); p.category = 'web'; return p;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { app, store } = createApp();
  const server = app.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => console.log(`Thermidor ready: ${process.env.BASE_URL || 'http://localhost:3000'}`));
  const shutdown = () => server.close(() => { store.close(); process.exit(0); });
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}
