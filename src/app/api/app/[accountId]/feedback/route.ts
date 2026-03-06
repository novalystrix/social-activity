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
  const postId = url.searchParams.get('postId');
  const status = url.searchParams.get('status');

  const feedback = await prisma.feedback.findMany({
    where: {
      accountId,
      ...(postId ? { postId } : {}),
      ...(status ? { status } : {}),
    },
    include: { author: { select: { name: true, image: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(feedback);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error, userId } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { text, postId } = body;

  if (!text?.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      accountId,
      authorId: userId!,
      text: text.trim(),
      postId: postId || null,
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}
