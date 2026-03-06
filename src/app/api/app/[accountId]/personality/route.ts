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

  const url = new URL(req.url);
  const platform = url.searchParams.get('platform') || undefined;

  const items = await prisma.personality.findMany({
    where: { accountId, ...(platform ? { platform } : {}) },
    orderBy: [{ platform: 'asc' }, { section: 'asc' }],
  });

  return NextResponse.json(items);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { section, platform = 'all', content } = body;

  if (!section || content === undefined) {
    return NextResponse.json({ error: 'section and content are required' }, { status: 400 });
  }

  const item = await prisma.personality.upsert({
    where: { accountId_section_platform: { accountId, section, platform } },
    update: { content, updatedAt: new Date() },
    create: { accountId, section, platform, content },
  });

  return NextResponse.json(item);
}
