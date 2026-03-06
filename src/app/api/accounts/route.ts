import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { account: true },
        orderBy: { account: { createdAt: 'asc' } },
      },
    },
  });

  const accounts = user?.memberships.map((m) => ({
    id: m.account.id,
    name: m.account.name,
    slug: m.account.slug,
    role: m.role,
  })) || [];

  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { name, slug, botName } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });

  try {
    const account = await prisma.account.create({
      data: {
        name,
        slug,
        botName: botName || null,
        members: {
          create: { userId: user.id, role: 'owner' },
        },
      },
    });
    return NextResponse.json({ id: account.id, name: account.name, slug: account.slug }, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
