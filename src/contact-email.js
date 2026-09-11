import { readFileSync } from 'node:fs';
import { escape } from './views.js';

export const CONTACT_ADDRESS = 'contact@thermidor-agence-web.fr';
const logo = readFileSync(new URL('../public/media/email-logo.png', import.meta.url));
const logoCid = 'thermidor-logo@thermidor-agence-web.fr';
const translations = {
  fr: {
    subject: 'Merci pour votre message', heading: 'Merci pour<br>votre message.',
    hello: 'Bonjour', thanks: 'Merci de nous avoir contactés. Nous vous répondrons dès que possible.',
    intro: 'En attendant, retrouvez ci-dessous une copie de votre demande.',
    copy: 'Copie de votre message', name: 'Nom', email: 'Email', company: 'Entreprise', topic: 'Sujet',
    closing: 'Une précision à ajouter ?', write: 'Écrivez-nous',
    signature: 'À bientôt,', team: 'Thermidor', tagline: 'Du sens dans les idées. Du soin dans le digital.',
    note: 'Cet email fait suite à une demande envoyée depuis le formulaire de contact Thermidor. Une copie est adressée à l’email renseigné dans le formulaire.'
  },
  en: {
    subject: 'Thank you for your message', heading: 'Thank you for<br>your message.',
    hello: 'Hello', thanks: 'Thank you for getting in touch. We will get back to you as soon as possible.',
    intro: 'In the meantime, you will find a copy of your enquiry below.',
    copy: 'A copy of your message', name: 'Name', email: 'Email', company: 'Company', topic: 'Subject',
    closing: 'Anything you would like to add?', write: 'Email us',
    signature: 'Speak soon,', team: 'Thermidor', tagline: 'Purpose in every idea. Care in every detail.',
    note: 'This email follows an enquiry submitted through the Thermidor contact form. A copy is sent to the email address provided in the form.'
  }
};

export function contactEmail({ name, email, company = '', message, topic, lang = 'fr', from }) {
  const language = lang === 'en' ? 'en' : 'fr', c = translations[language];
  const visitor = { name: name.trim(), address: email.trim() };
  const details = [[c.name, visitor.name], [c.email, visitor.address], ...(company.trim() ? [[c.company, company.trim()]] : []), [c.topic, topic]];
  const body = message.trim();
  const text = `${c.hello} ${visitor.name},\n\n${c.thanks}\n${c.intro}\n\n${c.copy}\n${'—'.repeat(24)}\n${details.map(([key, value]) => `${key} : ${value}`).join('\n')}\n\n${body}\n\n${c.signature}\n${c.team}\n${CONTACT_ADDRESS}\n\n${c.closing} ${CONTACT_ADDRESS}\n\n${c.note}`;
  const rows = details.map(([key, value]) => `<tr><td valign="top" width="100" style="padding:6px 12px 6px 0;font-size:12px;line-height:20px;color:#666a60;">${escape(key)}</td><td valign="top" style="padding:6px 0;font-size:13px;line-height:20px;color:#242820;word-break:break-word;overflow-wrap:anywhere;">${escape(value)}</td></tr>`).join('');
  const html = `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${c.subject} — Thermidor</title></head>
<body style="margin:0;padding:0;background-color:#edf0e7;color:#242820;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${c.thanks} ${c.intro}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#edf0e7"><tr><td align="center" style="padding:28px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f7f2" style="width:100%;max-width:600px;table-layout:fixed;background-color:#f7f7f2;border:1px solid #d9dbd1;">
<tr><td style="padding:28px 28px 24px;border-bottom:1px solid #d9dbd1;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="42" valign="middle"><img src="cid:${logoCid}" alt="" width="32" height="32" style="display:block;width:32px;height:32px;border:0;"></td><td valign="middle" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:27px;line-height:34px;font-weight:700;letter-spacing:-1px;color:#242820;">thermidor<span style="color:#64743e;">.</span></td></tr></table>
</td></tr>
<tr><td style="padding:34px 28px 28px;">
<h1 style="margin:0 0 26px;font-size:36px;line-height:41px;font-weight:400;letter-spacing:-1.5px;color:#242820;">${c.heading}</h1>
<p style="margin:0 0 16px;font-size:15px;line-height:25px;word-break:break-word;overflow-wrap:anywhere;">${c.hello} ${escape(visitor.name)},</p>
<p style="margin:0 0 12px;font-size:15px;line-height:25px;">${c.thanks}</p>
<p style="margin:0;font-size:14px;line-height:24px;color:#666a60;">${c.intro}</p>
</td></tr>
<tr><td style="padding:0 28px 30px;">
<h2 style="margin:0 0 18px;padding-top:24px;border-top:1px solid #d9dbd1;font-size:19px;line-height:26px;font-weight:500;color:#242820;">${c.copy}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;">${rows}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;margin-top:18px;"><tr><td bgcolor="#e9ecdf" style="padding:20px;background-color:#e9ecdf;font-size:14px;line-height:24px;color:#242820;word-break:break-word;overflow-wrap:anywhere;">${escape(body).replace(/\r\n|\r|\n/g, '<br>')}</td></tr></table>
<p style="margin:26px 0 0;font-size:14px;line-height:23px;">${c.signature}<br><strong>${c.team}</strong></p>
</td></tr>
<tr><td bgcolor="#282e24" style="padding:24px 28px;background-color:#282e24;color:#f7f7f2;"><p style="margin:0 0 8px;font-size:14px;line-height:22px;">${c.closing}</p><a href="mailto:${CONTACT_ADDRESS}" style="color:#f7f7f2;font-size:14px;line-height:22px;text-decoration:underline;text-underline-offset:3px;">${c.write} →</a><p style="margin:18px 0 0;font-size:11px;line-height:18px;color:#c1c7b9;">${c.tagline}</p></td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="padding:20px 16px 0;text-align:center;font-size:11px;line-height:18px;color:#666a60;">${c.note}</td></tr></table>
</td></tr></table></body></html>`;
  return {
    from, to: CONTACT_ADDRESS, cc: visitor,
    replyTo: visitor.address.toLowerCase() === CONTACT_ADDRESS ? [CONTACT_ADDRESS] : [CONTACT_ADDRESS, visitor],
    subject: `[Thermidor] ${c.subject} — ${topic}`, text, html,
    attachments: [{ filename: 'thermidor.png', content: logo, contentType: 'image/png', contentDisposition: 'inline', cid: logoCid }],
    disableFileAccess: true, disableUrlAccess: true
  };
}
