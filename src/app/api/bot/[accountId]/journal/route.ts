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
  const type = url.searchParams.get('type') || undefined;
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const from = url.searchParams.get('from') || undefined;

  const entries = await prisma.journalEntry.findMany({
    where: {
      accountId,
      ...(type ? { type } : {}),
      ...(from ? { date: { gte: from } } : {}),
    },
    orderBy: { date: 'desc' },
    take: limit,
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { accountId } = await params;
  const { error } = await getBotContext(accountId, req);
  if (error) return error;

  const body = await req.json();
  const { type, date, content } = body;

  if (!type || !date || !content) {
    return NextResponse.json({ error: 'type, date, and content are required' }, { status: 400 });
  }

  const entry = await prisma.journalEntry.upsert({
    where: { accountId_type_date: { accountId, type, date } },
    create: { accountId, type, date, content },
    update: { content },
  });

  return NextResponse.json(entry, { status: 201 });
}
