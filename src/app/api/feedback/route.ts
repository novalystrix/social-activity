import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Feedback } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');
    const author = searchParams.get('author');
    const status = searchParams.get('status');

    let query = 'SELECT * FROM feedback WHERE 1=1';
    const params: (string | number)[] = [];

    if (post_id) { query += ' AND post_id = ?'; params.push(parseInt(post_id)); }
    if (author) { query += ' AND author = ?'; params.push(author); }
    if (status) { query += ' AND status = ?'; params.push(status); }

    query += ' ORDER BY created_at DESC';

    const feedbackList = db().prepare(query).all(...params) as Feedback[];
    return NextResponse.json({ feedback: feedbackList });
  } catch (error) {
    console.error('GET /api/feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, author, author_image, text } = body;

    if (!author || !text) {
      return NextResponse.json({ error: 'author and text are required' }, { status: 400 });
    }

    const result = db().prepare(`
      INSERT INTO feedback (post_id, author, author_image, text, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(post_id || null, author, author_image || null, text);

    const feedback = db().prepare('SELECT * FROM feedback WHERE id = ?').get(result.lastInsertRowid) as Feedback;
    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
