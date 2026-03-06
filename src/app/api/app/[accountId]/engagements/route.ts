export const dynamic = "force-dynamic";
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
  const platform = url.searchParams.get('platform');
  const type = url.searchParams.get('type');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  const engagements = await prisma.engagement.findMany({
    where: {
      accountId,
      ...(platform ? { platform } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json(engagements);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { platform, type, targetAuthor, targetSnippet, targetUrl, myText, context } = body;

  if (!platform || !type) {
    return NextResponse.json({ error: 'platform and type are required' }, { status: 400 });
  }

  const engagement = await prisma.engagement.create({
    data: { accountId, platform, type, targetAuthor, targetSnippet, targetUrl, myText, context },
  });

  return NextResponse.json(engagement, { status: 201 });
}
