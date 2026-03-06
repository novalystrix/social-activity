import { getServerSession } from 'next-auth';
import { authOptions } from './next-auth-options';
import prisma from './prisma';

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAccountMember(accountId: string) {
  const session = await requireAuth();
  const userId = (session.user as any).id as string;

  const member = await prisma.accountMember.findUnique({
    where: { accountId_userId: { accountId, userId } },
  });

  if (!member) {
    throw new Error('Forbidden');
  }

  return { session, userId, role: member.role };
}

import { db } from './db';

export function getAllowedUsers() {
  return db().prepare('SELECT * FROM allowed_users ORDER BY name').all();
}

export function addAllowedUser(email: string, name: string | null, role: string) {
  db().prepare('INSERT OR REPLACE INTO allowed_users (email, name, role) VALUES (?, ?, ?)').run(email, name, role);
}

export function removeAllowedUser(id: number) {
  db().prepare('DELETE FROM allowed_users WHERE id = ?').run(id);
}

export function getUserRole(email: string): string | null {
  const user = db().prepare('SELECT role FROM allowed_users WHERE email = ?').get(email) as { role: string } | undefined;
  return user?.role ?? null;
}
