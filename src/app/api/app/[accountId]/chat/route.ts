export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/apiAuth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

interface RouteContext {
  params: Promise<{ accountId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const messages = await prisma.chatMessage.findMany({
    where: { accountId },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error, userId } = await getAuthContext(accountId);
  if (error) return error;

  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { text, pinnedItem } = body;

  if (!text?.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const msg = await prisma.chatMessage.create({
    data: {
      accountId,
      authorId: userId || null,
      authorName: session?.user?.name || session?.user?.email || 'User',
      authorImage: session?.user?.image || null,
      isBot: false,
      text: text.trim(),
      pinnedItem: pinnedItem || null,
    },
  });

  return NextResponse.json({
    ...msg,
    createdAt: msg.createdAt.toISOString(),
  }, { status: 201 });
}
