import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { randomToken, hashPassword } from '../src/security.js';
if (existsSync('.env')) throw new Error('.env already exists; refusing to overwrite it.');
const password = randomToken().slice(0, 24);
const hash = await hashPassword(password);
writeFileSync('.env', `NODE_ENV=development\nHOST=127.0.0.1\nPORT=3000\nBASE_URL=http://localhost:3000\nADMIN_EMAIL=contact@thermidor-agence-web.fr\nADMIN_PASSWORD_HASH=${hash}\nSESSION_SECRET=${randomToken()}\n`, { mode: 0o600 });
mkdirSync('.local', { recursive: true });
writeFileSync('.local/admin-access.txt', `Accès à l’administration locale Thermidor\n\nURL : http://localhost:3000/admin\nEmail : contact@thermidor-agence-web.fr\nMot de passe : ${password}\n\nCes identifiants servent uniquement à la version locale.\nGénérez un nouveau mot de passe pour le VPS avec npm run admin:password.\n`, { mode: 0o600 });
console.log('Local configuration created. Credentials saved in .local/admin-access.txt.');
