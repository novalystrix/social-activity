export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ accountId: string }>;
}

/** Verify bot API key */
async function verifyBotKey(req: NextRequest, accountId: string) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const key = auth.slice(7);
  const apiKey = await prisma.apiKey.findFirst({
    where: { key, accountId, active: true },
  });
  return apiKey;
}

/** GET — bot reads recent messages (optionally since a timestamp) */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const apiKey = await verifyBotKey(req, accountId);
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = req.nextUrl.searchParams.get("since");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  const where: any = { accountId };
  if (since) {
    where.createdAt = { gt: new Date(since) };
  }

  const messages = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "asc" },
    take: Math.min(limit, 200),
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      authorName: m.authorName,
      authorImage: m.authorImage,
      isBot: m.isBot,
      text: m.text,
      pinnedItem: m.pinnedItem,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}

/** POST — bot sends a message into the chat */
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const apiKey = await verifyBotKey(req, accountId);
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { text, authorName } = body;

  if (!text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const msg = await prisma.chatMessage.create({
    data: {
      accountId,
      authorId: null,
      authorName: authorName || "Agent",
      authorImage: null,
      isBot: true,
      text: text.trim(),
      pinnedItem: null,
    },
  });

  return NextResponse.json({
    id: msg.id,
    text: msg.text,
    isBot: msg.isBot,
    authorName: msg.authorName,
    createdAt: msg.createdAt.toISOString(),
  }, { status: 201 });
}
