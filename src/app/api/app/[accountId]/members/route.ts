export const dynamic = "force-dynamic";
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

  const members = await prisma.accountMember.findMany({
    where: { accountId },
    include: { user: { select: { id: true, email: true, name: true, image: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(members);
}
