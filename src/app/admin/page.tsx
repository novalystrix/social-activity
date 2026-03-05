'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AllowedUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AllowedUser[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');

  async function loadUsers() {
    const r = await fetch('/api/admin/users');
    if (r.ok) {
      const d = await r.json();
      setUsers(d.users || []);
    } else {
      setError('Access denied — admin only');
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), name: name.trim() || null, role }),
    });
    setEmail('');
    setName('');
    setRole('viewer');
    loadUsers();
  }

  async function removeUser(id: number) {
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin — Allowed Users</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage who can access this dashboard</p>
        {session?.user?.email && (
          <p className="text-xs text-zinc-500 mt-1">Signed in as {session.user.email}</p>
        )}
      </div>

      <form onSubmit={addUser} className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Add User</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#81D4FA]">
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{u.email}</p>
              {u.name && <p className="text-xs text-zinc-500">{u.name}</p>}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]' : 'bg-zinc-700/50 text-zinc-400'}`}>
              {u.role}
            </span>
            <span className="text-xs text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</span>
            <button
              onClick={() => removeUser(u.id)}
              className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
