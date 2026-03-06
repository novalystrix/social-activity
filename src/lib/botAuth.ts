import prisma from './prisma';
import { NextResponse } from 'next/server';

export async function getBotContext(accountId: string, request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'Missing API key. Use Authorization: Bearer <key>' }, { status: 401 }) };
  }

  const key = authHeader.slice(7);
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });

  if (!apiKey || apiKey.accountId !== accountId) {
    return { error: NextResponse.json({ error: 'Invalid API key' }, { status: 403 }) };
  }

  return { error: null, accountId };
}
