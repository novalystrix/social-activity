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
