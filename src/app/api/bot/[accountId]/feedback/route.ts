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
  const status = url.searchParams.get('status') || undefined;

  const items = await prisma.feedback.findMany({
    where: { accountId, ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { text: true, platform: true } } },
  });
  return NextResponse.json(items);
}
