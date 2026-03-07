export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getBotContext } from '@/lib/botAuth';
import prisma from '@/lib/prisma';

interface Ctx { params: Promise<{ accountId: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const types = ['daily', 'weekly', 'monthly', 'quarterly'];
  const result: Record<string, { date: string; content: string } | null> = {
    daily: null,
    weekly: null,
    monthly: null,
    quarterly: null,
  };

  await Promise.all(
    types.map(async (type) => {
      const entry = await prisma.journalEntry.findFirst({
        where: { accountId, type },
        orderBy: { date: 'desc' },
      });
      if (entry) {
        result[type] = { date: entry.date, content: entry.content };
      }
    })
  );

  return NextResponse.json(result);
}
