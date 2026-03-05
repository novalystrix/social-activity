import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Post } from '@/types';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    for (const [key, val] of Object.entries(body)) {
      if (['platform', 'post_type', 'status', 'text', 'url', 'likes', 'comments_count', 'reposts', 'scheduled_for', 'published_at'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(val as string | number | null);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    db().prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    const post = db().prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post;
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    console.error('PUT /api/posts/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = db().prepare('DELETE FROM posts WHERE id = ?').run(id);
    if (result.changes === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/posts/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
