import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { initialProjects } from './content.js';

export function createStore(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      url TEXT NOT NULL, image TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'web',
      subtitle_fr TEXT NOT NULL, subtitle_en TEXT NOT NULL, sector_fr TEXT NOT NULL, sector_en TEXT NOT NULL,
      description_fr TEXT NOT NULL, description_en TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `);
  const fields = ['slug', 'title', 'url', 'image', 'category', 'subtitle_fr', 'subtitle_en', 'sector_fr', 'sector_en', 'description_fr', 'description_en', 'position', 'published'];
  const insert = db.prepare(`INSERT INTO projects (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`);
  if (!db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get()) {
    db.exec('BEGIN');
    try { for (const p of initialProjects) insert.run(...fields.map(f => p[f])); db.prepare('INSERT INTO settings VALUES (?, ?)').run('seeded', '1'); db.exec('COMMIT'); }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  return {
    db,
    all: (published = false) => db.prepare(`SELECT * FROM projects ${published ? 'WHERE published = 1' : ''} ORDER BY position, id`).all(),
    byId: id => db.prepare('SELECT * FROM projects WHERE id = ?').get(id),
    bySlug: slug => db.prepare('SELECT * FROM projects WHERE slug = ? AND published = 1').get(slug),
    save(p, id) {
      if (id) { db.prepare(`UPDATE projects SET ${fields.map(f => f + ' = ?').join(',')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...fields.map(f => p[f]), id); return Number(id); }
      return Number(insert.run(...fields.map(f => p[f])).lastInsertRowid);
    },
    remove: id => db.prepare('DELETE FROM projects WHERE id = ?').run(id),
    close: () => db.close()
  };
}
