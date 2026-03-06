export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getBotContext } from '@/lib/botAuth';
import prisma from '@/lib/prisma';

interface Ctx { params: Promise<{ accountId: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const platform = new URL(req.url).searchParams.get('platform') || undefined;
  const items = await prisma.personality.findMany({
    where: { accountId, ...(platform ? { platform } : {}) },
    orderBy: [{ platform: 'asc' }, { section: 'asc' }],
  });
  return NextResponse.json(items);
}
