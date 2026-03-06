export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getBotContext } from '@/lib/botAuth';
import prisma from '@/lib/prisma';

interface Ctx { params: Promise<{ accountId: string }> }

// GET /api/bot/:accountId/posts/next?platform=twitter
// Returns the next scheduled post that's due (scheduledFor <= now, status = "scheduled")
export async function GET(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const url = new URL(req.url);
  const platform = url.searchParams.get('platform') || undefined;

  const post = await prisma.post.findFirst({
    where: {
      accountId,
      status: 'scheduled',
      scheduledFor: { lte: new Date() },
      ...(platform ? { platform } : {}),
    },
    orderBy: { scheduledFor: 'asc' },
  });

  if (!post) return NextResponse.json(null);
  return NextResponse.json(post);
}

// PATCH /api/bot/:accountId/posts/next — mark a scheduled post as published
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const post = await prisma.post.update({
    where: { id: body.id },
    data: {
      status: 'published',
      url: body.url || undefined,
      publishedAt: new Date(),
    },
  });
  return NextResponse.json(post);
}
