export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext { params: Promise<{ accountId: string }> }

async function verifyBotKey(req: NextRequest, accountId: string) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return prisma.apiKey.findFirst({ where: { key: auth.slice(7), accountId, active: true } });
}

/** GET — fetch all enabled guardrails for pre-publish checks */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const apiKey = await verifyBotKey(req, accountId);
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const guardrails = await prisma.guardrail.findMany({
    where: { accountId, enabled: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ guardrails });
}
