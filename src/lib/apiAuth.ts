import { getServerSession } from 'next-auth';
import { authOptions } from './next-auth-options';
import prisma from './prisma';
import { NextResponse } from 'next/server';

export async function getAuthContext(accountId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null, userId: null, role: null };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }), session, userId: null, role: null };
  }

  const member = await prisma.accountMember.findUnique({
    where: { accountId_userId: { accountId, userId: user.id } },
  });

  if (!member) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session, userId: user.id, role: null };
  }

  return { error: null, session, userId: user.id, role: member.role };
}
