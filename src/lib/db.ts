import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'social.db');

function getDb(): Database.Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter')),
      post_type TEXT NOT NULL CHECK (post_type IN ('original', 'reaction', 'philosophy', 'story', 'advancement')),
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'needs-revision', 'rejected')),
      text TEXT NOT NULL,
      url TEXT,
      likes INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      reposts INTEGER DEFAULT 0,
      scheduled_for TEXT,
      published_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS engagements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter')),
      engagement_type TEXT NOT NULL CHECK (engagement_type IN ('comment', 'connection', 'reply', 'follow', 'like')),
      target_author TEXT,
      target_post_snippet TEXT,
      target_url TEXT,
      my_text TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'addressed')),
      nova_response TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS corpus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source_path TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS strategy (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source_path TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS personality (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT 'all',
      content TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(section, platform)
    );

        CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      author TEXT,
      author_email TEXT,
      author_name TEXT,
      author_image TEXT,
      message TEXT NOT NULL,
      pinned_items TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS allowed_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Migrate existing tables to add new columns if they don't exist
  const migrations = [
    'ALTER TABLE chat_messages ADD COLUMN author_email TEXT',
    'ALTER TABLE chat_messages ADD COLUMN author_name TEXT',
    'ALTER TABLE chat_messages ADD COLUMN author_image TEXT',
    'ALTER TABLE feedback ADD COLUMN author_image TEXT',
  ];
  for (const sql of migrations) {
    try { db.exec(sql); } catch { /* column already exists */ }
  }

  // Seed default admin users
  const seedUsers = [
    { email: 'vaselin@gmail.com', name: 'Roy', role: 'admin' },
    { email: 'novalystrix@gmail.com', name: 'Novalystrix', role: 'admin' },
    { email: 'guyre@monday.com', name: 'Guy Regev', role: 'viewer' },
    { email: 'bridieca@monday.com', name: 'Bridie Castiel', role: 'viewer' },
    { email: 'oran@monday.com', name: 'Oran', role: 'viewer' },
  ];
  const insertUser = db.prepare(
    'INSERT OR REPLACE INTO allowed_users (email, name, role) VALUES (?, ?, ?)'
  );
  for (const u of seedUsers) {
    insertUser.run(u.email, u.name, u.role);
  }
}

let _db: Database.Database | null = null;

export function db(): Database.Database {
  if (!_db) {
    _db = getDb();
  }
  return _db;
}
