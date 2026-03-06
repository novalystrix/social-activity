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

  const strategy = await prisma.strategy.findMany({
    where: { accountId },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(strategy);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { filename, title, content } = body;

  if (!filename || !title || !content) {
    return NextResponse.json({ error: 'filename, title, content are required' }, { status: 400 });
  }

  const item = await prisma.strategy.upsert({
    where: { accountId_filename: { accountId, filename } },
    update: { title, content, updatedAt: new Date() },
    create: { accountId, filename, title, content },
  });

  return NextResponse.json(item, { status: 201 });
}
