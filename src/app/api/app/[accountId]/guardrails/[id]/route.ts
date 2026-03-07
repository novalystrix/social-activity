export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/apiAuth";
import prisma from "@/lib/prisma";

interface RouteContext { params: Promise<{ accountId: string; id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { accountId, id } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.type !== undefined) data.type = body.type;
  if (body.pattern !== undefined) data.pattern = body.pattern;
  if (body.severity !== undefined) data.severity = body.severity;
  if (body.enabled !== undefined) data.enabled = body.enabled;

  const guardrail = await prisma.guardrail.update({ where: { id, accountId }, data });
  return NextResponse.json(guardrail);
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { accountId, id } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  await prisma.guardrail.delete({ where: { id, accountId } });
  return NextResponse.json({ ok: true });
}
