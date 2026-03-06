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
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  const posts = await prisma.post.findMany({
    where: {
      accountId,
      ...(platform ? { platform } : {}),
      ...(status ? { status } : {}),
      ...(type ? { postType: type } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { platform, postType, status, text, url, likes, comments, reposts, impressions, publishedAt } = body;

  if (!platform || !postType || !text) {
    return NextResponse.json({ error: 'platform, postType, text are required' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      accountId,
      platform,
      postType,
      status: status || 'published',
      text,
      url: url || null,
      likes: likes || 0,
      comments: comments || 0,
      reposts: reposts || 0,
      impressions: impressions || 0,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
