import { db } from './db';

export function isAllowedUser(email: string): boolean {
  const row = db().prepare('SELECT id FROM allowed_users WHERE email = ?').get(email);
  return !!row;
}

export function getUserRole(email: string): string | null {
  const row = db().prepare('SELECT role FROM allowed_users WHERE email = ?').get(email) as { role: string } | undefined;
  return row?.role || null;
}

export function getAllowedUsers() {
  return db().prepare('SELECT * FROM allowed_users ORDER BY created_at DESC').all() as {
    id: number;
    email: string;
    name: string | null;
    role: string;
    created_at: string;
  }[];
}

export function addAllowedUser(email: string, name: string | null, role: string) {
  db().prepare('INSERT OR IGNORE INTO allowed_users (email, name, role) VALUES (?, ?, ?)').run(email, name, role);
}

export function removeAllowedUser(id: number) {
  db().prepare('DELETE FROM allowed_users WHERE id = ?').run(id);
}
