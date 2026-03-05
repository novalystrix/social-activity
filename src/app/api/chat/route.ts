import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ChatMessage {
  id: number;
  role: string;
  author: string | null;
  message: string;
  pinned_items: string | null;
  created_at: string;
}

export async function GET() {
  try {
    const messages = db().prepare(
      'SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50'
    ).all() as ChatMessage[];
    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('GET /api/chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author, message, pinned_items } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const pinnedJson = pinned_items ? JSON.stringify(pinned_items) : null;

    const result = db().prepare(
      'INSERT INTO chat_messages (role, author, message, pinned_items) VALUES (?, ?, ?, ?)'
    ).run('user', author || 'Roy', message, pinnedJson);

    const userMsg = db().prepare('SELECT * FROM chat_messages WHERE id = ?').get(result.lastInsertRowid) as ChatMessage;

    // Store canned Nova response
    const replyResult = db().prepare(
      'INSERT INTO chat_messages (role, author, message, pinned_items) VALUES (?, ?, ?, ?)'
    ).run('assistant', 'Nova', 'Message received. Nova will respond shortly.', null);

    const replyMsg = db().prepare('SELECT * FROM chat_messages WHERE id = ?').get(replyResult.lastInsertRowid) as ChatMessage;

    return NextResponse.json({
      message: userMsg,
      reply: replyMsg,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
