import { mkdir, writeFile } from 'node:fs/promises';
import nodemailer from 'nodemailer';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { contactEmail } from '../src/contact-email.js';

await mkdir('artifacts/email', { recursive: true });
const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const lang of ['fr', 'en']) {
    const email = contactEmail({ lang, name: 'Camille Dupont', email: 'camille@example.com', company: 'Atelier & Co', topic: lang === 'fr' ? 'Développement web' : 'Web development', from: 'Thermidor <contact@thermidor-agence-web.fr>', message: lang === 'fr' ? 'Bonjour,\n\nNous aimerions repenser le site de notre entreprise pour mieux présenter nos services et nos réalisations.\n\nSeriez-vous disponibles pour en discuter ?\n\nMerci et à bientôt,\nCamille' : 'Hello,\n\nWe would like to redesign our company website to better showcase our services and projects.\n\nWould you be available to discuss it?\n\nThank you,\nCamille' });
    const composed = await transport.sendMail(email);
    await writeFile(`artifacts/email/contact-${lang}.eml`, composed.message);
    const preview = email.html.replace('cid:' + email.attachments[0].cid, 'data:image/png;base64,' + email.attachments[0].content.toString('base64'));
    await writeFile(`artifacts/email/contact-${lang}.html`, preview);
    const page = await browser.newPage();
    for (const [name, width] of [['desktop', 760], ['mobile', 390]]) {
      await page.setViewportSize({ width, height: 900 });
      await page.setContent(preview);
      await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.screenshot({ path: `artifacts/email/contact-${lang}-${name}.png`, fullPage: true });
    }
    await page.close();
  }
  console.log('FR/EN email previews and MIME files generated; desktop and mobile overflow checks passed. No email sent.');
} finally { await browser.close(); }
