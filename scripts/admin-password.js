import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { hashPassword } from '../src/security.js';
const hiddenOutput = new Writable({ write(chunk, encoding, callback) { callback(); } });
const rl = createInterface({ input: process.stdin, output: hiddenOutput, terminal: Boolean(process.stdin.isTTY) });
process.stdout.write('Nouveau mot de passe administrateur (16 caractères minimum, saisie masquée) : ');
const password = await new Promise(resolve => rl.question('', resolve));
rl.close();
if (password.length < 16 || password.length > 1024) { console.error('\nUtilisez entre 16 et 1024 caractères.'); process.exit(1); }
console.log('\nAjoutez cette ligne dans votre .env :\nADMIN_PASSWORD_HASH=' + await hashPassword(password));
