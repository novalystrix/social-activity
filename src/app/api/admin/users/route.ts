import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { getAllowedUsers, addAllowedUser, removeAllowedUser, getUserRole } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const role = getUserRole(session.user.email);
  if (role !== 'admin') return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({ users: getAllowedUsers() });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email, name, role } = await request.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  addAllowedUser(email, name || null, role || 'viewer');
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  removeAllowedUser(id);
  return NextResponse.json({ success: true });
}
