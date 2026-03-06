export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getBotContext } from '@/lib/botAuth';
import prisma from '@/lib/prisma';

interface Ctx { params: Promise<{ accountId: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const url = new URL(req.url);
  const platform = url.searchParams.get('platform') || undefined;
  const limit = parseInt(url.searchParams.get('limit') || '50');

  const items = await prisma.engagement.findMany({
    where: { accountId, ...(platform ? { platform } : {}) },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const body = await req.json();
  const engagement = await prisma.engagement.create({
    data: {
      accountId,
      platform: body.platform,
      type: body.type,
      targetAuthor: body.targetAuthor || null,
      targetSnippet: body.targetSnippet || null,
      targetUrl: body.targetUrl || null,
      myText: body.myText || null,
      context: body.context || null,
    },
  });
  return NextResponse.json(engagement, { status: 201 });
}
