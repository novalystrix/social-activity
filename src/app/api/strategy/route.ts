import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { StrategyFile } from '@/types';

export async function GET() {
  try {
    const files = db().prepare('SELECT id, filename, title, source_path, updated_at FROM strategy ORDER BY title').all() as Omit<StrategyFile, 'content'>[];
    return NextResponse.json({ files });
  } catch (error) {
    console.error('GET /api/strategy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
