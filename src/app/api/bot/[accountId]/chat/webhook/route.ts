export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ accountId: string }>;
}

async function verifyBotKey(req: NextRequest, accountId: string) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const key = auth.slice(7);
  return prisma.apiKey.findFirst({ where: { key, accountId, active: true } });
}

/**
 * POST — Register/update a webhook URL for chat notifications.
 * When a human posts a message, Agent Presence will POST to this URL.
 * Body: { url: string, secret?: string }
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const apiKey = await verifyBotKey(req, accountId);
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, secret } = await req.json();
  if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

  // Store webhook config in account metadata
  await prisma.account.update({
    where: { id: accountId },
    data: {
      webhookUrl: url,
      webhookSecret: secret || null,
    },
  });

  return NextResponse.json({ ok: true, url });
}

/** GET — Check current webhook registration */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const apiKey = await verifyBotKey(req, accountId);
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prisma.account.findUnique({ where: { id: accountId } });
  return NextResponse.json({
    url: account?.webhookUrl || null,
    active: !!account?.webhookUrl,
  });
}

/** DELETE — Remove webhook */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const apiKey = await verifyBotKey(req, accountId);
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.account.update({
    where: { id: accountId },
    data: { webhookUrl: null, webhookSecret: null },
  });

  return NextResponse.json({ ok: true });
}
