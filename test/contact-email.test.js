import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import nodemailer from 'nodemailer';
import { contactEmail, CONTACT_ADDRESS } from '../src/contact-email.js';
import { createApp } from '../src/server.js';
import { createStore } from '../src/store.js';
import { formToken } from '../src/security.js';

const enquiry = { name: 'Camille Dupont', email: 'camille@example.com', company: 'Atelier & Co', message: 'Bonjour,\nJe souhaite vous parler de mon projet.', topic: 'Développement web', lang: 'fr', from: 'Thermidor <contact@thermidor-agence-web.fr>' };

test('Real MIME composition embeds the logo and includes the visitor in the CC envelope', async () => {
  const mail = contactEmail(enquiry);
  const result = await nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' }).sendMail(mail);
  const mime = result.message.toString();
  assert.deepEqual(result.envelope.to.sort(), [CONTACT_ADDRESS, enquiry.email].sort());
  assert.match(mime, /Cc: Camille Dupont <camille@example.com>/);
  assert.match(mime, /multipart\/alternative/); assert.match(mime, /multipart\/related/);
  assert.match(mime, /Content-Type: text\/plain/); assert.match(mime, /Content-Type: text\/html/);
  assert.match(mime, /Content-ID: <thermidor-logo@thermidor-agence-web.fr>/);
  assert.match(mime, /Content-Type: image\/png/);
  assert.ok(mail.attachments[0].content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
});

test('HTML escapes all submitted text, preserves newlines and provides a readable plain-text copy', () => {
  const mail = contactEmail({ ...enquiry, name: '<b>Camille</b>', company: '<img src=x onerror=alert(1)>', message: '<script>alert(1)</script>\r\nDeuxième ligne & détails', topic: '<a href="https://evil.example">Sujet</a>' });
  assert.doesNotMatch(mail.html, /<script>|<img src=x|<b>Camille|href="https:\/\/evil/);
  assert.match(mail.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>Deuxième ligne &amp; détails/);
  assert.match(mail.text, /Copie de votre message/);
  assert.ok(mail.text.includes('<script>alert(1)</script>\r\nDeuxième ligne & détails'));
  assert.doesNotMatch(mail.html, /<img[^>]+src="https?:/);
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
  { name: 'both recipients accepted', accepted: [CONTACT_ADDRESS, enquiry.email], status: 200, message: /votre message a bien été envoyé/ },
  { name: 'visitor CC rejected after agency accepts', accepted: [CONTACT_ADDRESS], status: 200, message: /copie n’a pas pu être envoyée/ },
  { name: 'agency rejected even though visitor CC accepts', accepted: [enquiry.email], status: 502, message: /n’a pas pu être envoyé/ },
  { name: 'no recipients accepted', accepted: [], status: 502, message: /n’a pas pu être envoyé/ },
  { name: 'recipient list is rejected before sending', email: 'camille@example.com,extra', accepted: [], status: 400, message: /Vérifiez/, calls: 0 }
]) test(`SMTP outcome: ${scenario.name}`, async () => {
  const secret = 'contact-email-test-secret-not-production';
  const store = createStore(':memory:'); let calls = 0;
  const { app } = createApp({ store, env: { NODE_ENV: 'test', BASE_URL: 'http://localhost:3000', SESSION_SECRET: secret, UPLOAD_DIR: 'artifacts/test-uploads' }, mailer: { sendMail: async () => { calls++; return { accepted: scenario.accepted }; } } });
  const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
  try {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/contact`, { method: 'POST', headers: { Origin: 'http://localhost:3000', Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...enquiry, email: scenario.email || enquiry.email, need: 'developpement-web', token: formToken(secret) }) });
    assert.equal(r.status, scenario.status); assert.match((await r.json()).message, scenario.message); assert.equal(calls, scenario.calls ?? 1);
  } finally { await new Promise(resolve => server.close(resolve)); store.close(); }
});
