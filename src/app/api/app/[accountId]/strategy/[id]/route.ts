export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/apiAuth';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ accountId: string; id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId, id } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const item = await prisma.strategy.findFirst({ where: { id, accountId } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { accountId, id } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { content, title } = body;

  const result = await prisma.strategy.updateMany({
    where: { id, accountId },
    data: {
      ...(content !== undefined ? { content } : {}),
      ...(title ? { title } : {}),
      updatedAt: new Date(),
    },
  });

  if (result.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = await prisma.strategy.findFirst({ where: { id, accountId } });
  return NextResponse.json(updated);
}
