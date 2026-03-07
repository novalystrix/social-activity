export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/apiAuth";
import prisma from "@/lib/prisma";

interface RouteContext { params: Promise<{ accountId: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const guardrails = await prisma.guardrail.findMany({
    where: { accountId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ guardrails });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const { name, type, pattern, severity } = await req.json();
  if (!name?.trim() || !pattern?.trim()) {
    return NextResponse.json({ error: "name and pattern are required" }, { status: 400 });
  }

  const guardrail = await prisma.guardrail.create({
    data: {
      accountId,
      name: name.trim(),
      type: type || "phrase",
      pattern: pattern.trim(),
      severity: severity || "block",
    },
  });
  return NextResponse.json(guardrail, { status: 201 });
}
