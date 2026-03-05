import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Feedback } from '@/types';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
    if (body.nova_response !== undefined) { updates.push('nova_response = ?'); values.push(body.nova_response); }
    if (body.text !== undefined) { updates.push('text = ?'); values.push(body.text); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    db().prepare(`UPDATE feedback SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    const feedback = db().prepare('SELECT * FROM feedback WHERE id = ?').get(id) as Feedback;
    if (!feedback) return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('PUT /api/feedback/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
