import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { initialProjects } from './content.js';

export function createStore(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS oauth_attempts (
      state TEXT PRIMARY KEY, browser TEXT NOT NULL, nonce TEXT NOT NULL,
      code_verifier TEXT NOT NULL, expires INTEGER NOT NULL
    );
  `);
  const fields = ['slug', 'title', 'url', 'image', 'category', 'subtitle_fr', 'subtitle_en', 'sector_fr', 'sector_en', 'description_fr', 'description_en', 'position', 'published'];
  // Fixed internal table names keep the existing client records intact.
  function collection(table) {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table} (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      url TEXT NOT NULL, image TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'web',
      subtitle_fr TEXT NOT NULL, subtitle_en TEXT NOT NULL, sector_fr TEXT NOT NULL, sector_en TEXT NOT NULL,
      description_fr TEXT NOT NULL, description_en TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `);
    const insert = db.prepare(`INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`);
    return {
      all: (published = false) => db.prepare(`SELECT * FROM ${table} ${published ? 'WHERE published = 1' : ''} ORDER BY position, id`).all(),
      byId: id => db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id),
      bySlug: slug => db.prepare(`SELECT * FROM ${table} WHERE slug = ? AND published = 1`).get(slug),
      save(p, id) {
        if (id) { db.prepare(`UPDATE ${table} SET ${fields.map(f => f + ' = ?').join(',')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...fields.map(f => p[f]), id); return Number(id); }
        return Number(insert.run(...fields.map(f => p[f])).lastInsertRowid);
      },
      remove: id => db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id)
    };
  }
  const clients = collection('projects'), apps = collection('apps');
  if (!db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get()) {
    db.exec('BEGIN');
    try { for (const p of initialProjects) clients.save(p); db.prepare('INSERT INTO settings VALUES (?, ?)').run('seeded', '1'); db.exec('COMMIT'); }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  return {
    db,
    ...clients,
    apps,
    close: () => db.close()
  };
}
