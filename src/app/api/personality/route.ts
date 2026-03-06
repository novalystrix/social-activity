import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const entries = db().prepare('SELECT * FROM personality ORDER BY section, platform').all();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('GET /api/personality error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { section, platform = 'all', content } = await req.json();
    if (!section || content === undefined) {
      return NextResponse.json({ error: 'section and content are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    db().prepare(`
      INSERT INTO personality (section, platform, content, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(section, platform) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at
    `).run(section, platform, content, now);

    const entry = db().prepare('SELECT * FROM personality WHERE section = ? AND platform = ?').get(section, platform);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error('POST /api/personality error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
