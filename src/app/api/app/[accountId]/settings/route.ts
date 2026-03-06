import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/apiAuth';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ accountId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      members: {
        include: { user: { select: { id: true, email: true, name: true, image: true } } },
      },
    },
  });

  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(account);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error, role } = await getAuthContext(accountId);
  if (error) return error;
  if (role === 'viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, botName, botAvatar, webhookUrl } = body;

  const account = await prisma.account.update({
    where: { id: accountId },
    data: {
      ...(name ? { name } : {}),
      ...(botName !== undefined ? { botName } : {}),
      ...(botAvatar !== undefined ? { botAvatar } : {}),
      ...(webhookUrl !== undefined ? { webhookUrl } : {}),
    },
  });

  return NextResponse.json(account);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error, role } = await getAuthContext(accountId);
  if (error) return error;
  if (role === 'viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { action, email, memberId, newRole } = body;

  if (action === 'addMember') {
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    const member = await prisma.accountMember.upsert({
      where: { accountId_userId: { accountId, userId: user.id } },
      update: {},
      create: { accountId, userId: user.id, role: 'viewer' },
      include: { user: { select: { id: true, email: true, name: true, image: true } } },
    });
    return NextResponse.json(member, { status: 201 });
  }

  if (action === 'changeRole') {
    if (!memberId || !newRole) return NextResponse.json({ error: 'memberId and newRole required' }, { status: 400 });
    const member = await prisma.accountMember.update({
      where: { id: memberId },
      data: { role: newRole },
      include: { user: { select: { id: true, email: true, name: true, image: true } } },
    });
    return NextResponse.json(member);
  }

  if (action === 'removeMember') {
    if (!memberId) return NextResponse.json({ error: 'memberId required' }, { status: 400 });
    await prisma.accountMember.delete({ where: { id: memberId } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
