import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Engagement } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const type = searchParams.get('type');

    let query = 'SELECT * FROM engagements WHERE 1=1';
    const params: string[] = [];

    if (platform) { query += ' AND platform = ?'; params.push(platform); }
    if (type) { query += ' AND engagement_type = ?'; params.push(type); }

    query += ' ORDER BY created_at DESC';

    const engagements = db().prepare(query).all(...params) as Engagement[];
    return NextResponse.json({ engagements });
  } catch (error) {
    console.error('GET /api/engagements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, engagement_type, target_author, target_post_snippet, target_url, my_text } = body;

    if (!platform || !engagement_type) {
      return NextResponse.json({ error: 'platform and engagement_type are required' }, { status: 400 });
    }

    const result = db().prepare(`
      INSERT INTO engagements (platform, engagement_type, target_author, target_post_snippet, target_url, my_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(platform, engagement_type, target_author || null, target_post_snippet || null, target_url || null, my_text || null);

    const engagement = db().prepare('SELECT * FROM engagements WHERE id = ?').get(result.lastInsertRowid) as Engagement;
    return NextResponse.json({ engagement }, { status: 201 });
  } catch (error) {
    console.error('POST /api/engagements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
