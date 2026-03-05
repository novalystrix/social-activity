import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Post } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM posts WHERE 1=1';
    const params: (string | number)[] = [];

    if (platform) { query += ' AND platform = ?'; params.push(platform); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (type) { query += ' AND post_type = ?'; params.push(type); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const posts = db().prepare(query).all(...params) as Post[];
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, post_type, status = 'draft', text, url, likes, comments_count, reposts, scheduled_for, published_at } = body;

    if (!platform || !post_type || !text) {
      return NextResponse.json({ error: 'platform, post_type, and text are required' }, { status: 400 });
    }

    const result = db().prepare(`
      INSERT INTO posts (platform, post_type, status, text, url, likes, comments_count, reposts, scheduled_for, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(platform, post_type, status, text, url || null, likes || 0, comments_count || 0, reposts || 0, scheduled_for || null, published_at || null);

    const post = db().prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid) as Post;
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
