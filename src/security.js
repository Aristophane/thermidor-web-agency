import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHmac, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export const randomToken = () => randomBytes(32).toString('hex');
export const digest = value => createHash('sha256').update(value).digest('hex');
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || password.length > 1024 || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(encoded || '')) return false;
  const [salt, expected] = encoded.split(':');
  return timingSafeEqual(await scrypt(password, salt, 64), Buffer.from(expected, 'hex'));
}
export function formToken(secret, now = Date.now()) {
  const timestamp = String(now);
  return timestamp + '.' + createHmac('sha256', secret).update(timestamp).digest('hex');
}
export function checkFormToken(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || !/^\d{13}\.[a-f0-9]{64}$/.test(token)) return false;
  const timestamp = Number(token.split('.')[0]);
  if (now < timestamp || now - timestamp > 24 * 60 * 60 * 1000) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(formToken(secret, timestamp)));
}
export function limiter({ windowMs, max }) {
  const buckets = new Map();
  let calls = 0;
  return (req, res, next) => {
    const now = Date.now();
    if (++calls % 100 === 0 || buckets.size > 10000) for (const [key, value] of buckets) if (value.until <= now) buckets.delete(key);
    const key = req.ip, old = buckets.get(key), bucket = old?.until > now ? old : { count: 0, until: now + windowMs };
    bucket.count++; buckets.set(key, bucket);
    if (bucket.count > max) { res.set('Retry-After', String(Math.ceil((bucket.until - now) / 1000))); return res.status(429).send({ message: req.body?.lang === 'en' ? 'Too many attempts. Please try again later.' : 'Trop de tentatives. Merci de réessayer dans quelques minutes.' }); }
    next();
  };
}
