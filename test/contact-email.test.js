import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import nodemailer from 'nodemailer';
import { contactEmail, CONTACT_ADDRESS } from '../src/contact-email.js';
import { createApp } from '../src/server.js';
import { createStore } from '../src/store.js';
import { formToken } from '../src/security.js';

const enquiry = { name: 'Camille Dupont', email: 'camille@example.com', company: 'Atelier & Co', message: 'Bonjour,\nJe souhaite vous parler de mon projet.', topic: 'Développement web', lang: 'fr', from: 'Thermidor <contact@thermidor-agence-web.fr>' };

for (const audience of ['agency', 'visitor']) test(`Real MIME composition embeds the logo and addresses only the ${audience}`, async () => {
  const mail = contactEmail({ ...enquiry, audience });
  const result = await nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' }).sendMail(mail);
  const mime = result.message.toString();
  assert.deepEqual(result.envelope.to, [audience === 'agency' ? CONTACT_ADDRESS : enquiry.email]);
  assert.doesNotMatch(mime, /^Cc:/m);
  assert.deepEqual(mail.replyTo, audience === 'agency' ? { name: enquiry.name, address: enquiry.email } : CONTACT_ADDRESS);
  assert.match(mime, /multipart\/alternative/); assert.match(mime, /multipart\/related/);
  assert.match(mime, /Content-Type: text\/plain/); assert.match(mime, /Content-Type: text\/html/);
  assert.match(mime, /Content-ID: <thermidor-logo@thermidor-agence-web.fr>/);
  assert.match(mime, /Content-Type: image\/png/);
  assert.ok(mail.attachments[0].content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
});

for (const audience of ['agency', 'visitor']) test(`The ${audience} HTML escapes submitted text and preserves the plain-text copy`, () => {
  const mail = contactEmail({ ...enquiry, audience, name: '<b>Camille</b>', company: '<img src=x onerror=alert(1)>', message: '<script>alert(1)</script>\r\nDeuxième ligne & détails', topic: '<a href="https://evil.example">Sujet</a>' });
  assert.doesNotMatch(mail.html, /<script>|<img src=x|<b>Camille|href="https:\/\/evil/);
  assert.match(mail.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>Deuxième ligne &amp; détails/);
  assert.match(mail.text, audience === 'agency' ? /Détails de la demande/ : /Copie de votre message/);
  assert.ok(mail.text.includes('<script>alert(1)</script>\r\nDeuxième ligne & détails'));
  assert.doesNotMatch(mail.html, /<img[^>]+src="https?:/);
});

test('The agency receives a French notification without the visitor acknowledgement', () => {
  const mail = contactEmail({ ...enquiry, lang: 'en', audience: 'agency' });
  assert.equal(mail.subject, 'Vous avez reçu une demande de contact sur Thermidor — Développement web');
  assert.match(mail.html, /<html lang="fr">/);
  assert.match(mail.text, /Vous avez reçu une demande de contact sur Thermidor/);
  assert.match(mail.html, /Répondre à cette demande/);
  assert.match(mail.html, /mailto:camille%40example.com/);
  assert.doesNotMatch(mail.html + mail.text, /Merci pour|Merci de nous avoir contactés|Nous vous répondrons|Copie de votre message|Thank you/);
});

test('English enquiries receive an English acknowledgement without an empty company row', () => {
  const mail = contactEmail({ ...enquiry, lang: 'en', topic: 'Web development', company: '' });
  assert.match(mail.subject, /Thank you for your message/);
  assert.match(mail.html, /<html lang="en">/);
  assert.match(mail.html, /A copy of your message/);
  assert.match(mail.text, /We will get back to you as soon as possible/);
  assert.doesNotMatch(mail.text, /Company :|Entreprise :/);
});

for (const scenario of [
  { name: 'both messages accepted', agency: [CONTACT_ADDRESS], visitor: [enquiry.email], status: 200, message: /votre message a bien été envoyé/, calls: 2 },
  { name: 'visitor rejected after agency accepts', agency: [CONTACT_ADDRESS], visitor: [], status: 200, message: /copie n’a pas pu être envoyée/, calls: 2 },
  { name: 'visitor transport throws after agency accepts', agency: [CONTACT_ADDRESS], failAt: 2, status: 200, message: /copie n’a pas pu être envoyée/, calls: 2 },
  { name: 'agency rejected so no acknowledgement is sent', agency: [], status: 502, message: /n’a pas pu être envoyé/, calls: 1 },
  { name: 'agency transport throws so no acknowledgement is sent', failAt: 1, status: 502, message: /n’a pas pu être envoyé/, calls: 1 },
  { name: 'recipient list is rejected before sending', email: 'camille@example.com,extra', status: 400, message: /Vérifiez/, calls: 0 }
]) test(`SMTP outcome: ${scenario.name}`, async () => {
  const secret = 'contact-email-test-secret-not-production';
  const store = createStore(':memory:'); let calls = 0;
  const { app } = createApp({ store, env: { NODE_ENV: 'test', BASE_URL: 'http://localhost:3000', SESSION_SECRET: secret, UPLOAD_DIR: 'artifacts/test-uploads' }, mailer: { sendMail: async mail => {
    calls++;
    assert.equal(typeof mail.to === 'string' ? mail.to : mail.to.address, calls === 1 ? CONTACT_ADDRESS : enquiry.email);
    if (calls === scenario.failAt) throw new Error('Simulated SMTP failure');
    return { accepted: calls === 1 ? scenario.agency : scenario.visitor };
  } } });
  const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
  try {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/contact`, { method: 'POST', headers: { Origin: 'http://localhost:3000', Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...enquiry, email: scenario.email || enquiry.email, need: 'developpement-web', token: formToken(secret) }) });
    assert.equal(r.status, scenario.status); assert.match((await r.json()).message, scenario.message); assert.equal(calls, scenario.calls);
  } finally { await new Promise(resolve => server.close(resolve)); store.close(); }
});
