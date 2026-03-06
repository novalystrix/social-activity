import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    db().prepare('DELETE FROM personality WHERE id = ?').run(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/personality/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
