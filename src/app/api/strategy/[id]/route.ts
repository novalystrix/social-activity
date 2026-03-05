import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { StrategyFile } from '@/types';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const file = db().prepare('SELECT * FROM strategy WHERE id = ?').get(id) as StrategyFile | undefined;
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ file });
  } catch (error) {
    console.error('GET /api/strategy/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    db().prepare("UPDATE strategy SET content = ?, updated_at = datetime('now') WHERE id = ?").run(content, id);
    const file = db().prepare('SELECT * FROM strategy WHERE id = ?').get(id) as StrategyFile | undefined;
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ file });
  } catch (error) {
    console.error('PUT /api/strategy/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
