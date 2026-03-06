export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/apiAuth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

interface Ctx { params: Promise<{ accountId: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const keys = await prisma.apiKey.findMany({
    where: { accountId },
    select: { id: true, name: true, key: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(keys);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error, role } = await getAuthContext(accountId);
  if (error) return error;
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'Only owners/admins can create API keys' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const name = body.name || 'default';
  const key = `sa_${randomBytes(24).toString('hex')}`;

  const apiKey = await prisma.apiKey.create({
    data: { accountId, name, key },
  });
  return NextResponse.json(apiKey, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error, role } = await getAuthContext(accountId);
  if (error) return error;
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'Only owners/admins can delete API keys' }, { status: 403 });
  }

  const url = new URL(req.url);
  const keyId = url.searchParams.get('id');
  if (!keyId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.apiKey.delete({ where: { id: keyId } });
  return NextResponse.json({ ok: true });
}
