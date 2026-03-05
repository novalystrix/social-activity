import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { CorpusFile } from '@/types';

export async function GET() {
  try {
    const files = db().prepare('SELECT id, filename, title, source_path, updated_at FROM corpus ORDER BY title').all() as Omit<CorpusFile, 'content'>[];
    return NextResponse.json({ files });
  } catch (error) {
    console.error('GET /api/corpus error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
