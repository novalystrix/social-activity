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
  const status = url.searchParams.get('status') || undefined;
  const limit = parseInt(url.searchParams.get('limit') || '50');

  const posts = await prisma.post.findMany({
    where: { accountId, ...(platform ? { platform } : {}), ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const body = await req.json();
  const post = await prisma.post.create({
    data: {
      accountId,
      platform: body.platform,
      postType: body.postType || 'original',
      status: body.status || 'published',
      text: body.text,
      url: body.url || null,
      likes: body.likes || 0,
      comments: body.comments || 0,
      reposts: body.reposts || 0,
      impressions: body.impressions || 0,
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
      publishedAt: body.scheduledFor ? null : (body.publishedAt ? new Date(body.publishedAt) : new Date()),
    },
  });
  return NextResponse.json(post, { status: 201 });
}
