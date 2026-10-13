import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from '../src/store.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const apps = [
  {
    slug: 'kandiskey', title: 'Kandiskey',
    url: 'https://kandiskey.thermidor-agence-web.fr/tooltovisualisemusic.html',
    image: '/media/kandiskey.webp', category: 'web', published: 1,
    sector_fr: 'Musique · Visualisation', sector_en: 'Music · Visualisation',
    subtitle_fr: 'Voir la musique, explorer les sons.',
    subtitle_en: 'See music, explore sound.',
    description_fr: 'Kandiskey est un atelier musical interactif pour visualiser les gammes, les intervalles et les accords. Explorez les modes et les tempéraments, repérez les notes sur un manche de guitare et composez avec le séquenceur et la boîte à rythmes. Le mixeur et ses effets permettent de façonner le son directement dans le navigateur.',
    description_en: 'Kandiskey is an interactive music workspace for visualising scales, intervals and chords. Explore modes and tuning systems, find notes on a guitar fretboard and compose with the sequencer and drum machine. The mixer and its effects let you shape sound directly in your browser.'
  },
  {
    slug: 'chords', title: 'Chords',
    url: 'https://chords.thermidor-agence-web.fr/',
    image: '/media/chords.webp', category: 'web', published: 1,
    sector_fr: 'Musique · Accords', sector_en: 'Music · Chords',
    subtitle_fr: 'Comprendre et jouer vos accords.',
    subtitle_en: 'Understand and play your chords.',
    description_fr: 'Chords, présenté dans l’application sous le nom ChordsMaster, est un atelier pour explorer les accords à la guitare et au piano. Sélectionnez des notes pour reconnaître un accord, visualisez sa composition sur les deux instruments, transposez-le et écoutez-le. Les accordages alternatifs et le carnet d’accords accompagnent la pratique et la composition.',
    description_en: 'Chords, presented in the app as ChordsMaster, is a workspace for exploring guitar and piano chords. Select notes to identify a chord, see its composition on both instruments, transpose it and listen to it. Alternative tunings and a chord notebook support practice and composition.'
  }
];

const store = createStore(resolve(process.env.DATABASE_PATH || resolve(root, 'data/thermidor.sqlite')));
try {
  store.db.exec('BEGIN IMMEDIATE');
  const existing = store.apps.all();
  let position = existing.reduce((max, app) => Math.max(max, app.position), -1) + 1;
  for (const app of apps) {
    // Include drafts: rerunning the import must preserve administrative changes.
    if (existing.some(record => record.slug === app.slug || record.url === app.url)) {
      console.log(`${app.title} : déjà présente, fiche conservée.`);
      continue;
    }
    store.apps.save({ ...app, position: Math.min(position++, 9999) });
    console.log(`${app.title} : ajoutée et publiée.`);
  }
  store.db.exec('COMMIT');
} catch (error) {
  store.db.exec('ROLLBACK');
  throw error;
} finally {
  store.close();
}
