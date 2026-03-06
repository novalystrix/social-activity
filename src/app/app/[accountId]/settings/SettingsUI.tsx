'use client';

import { useState } from 'react';

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
}

interface AccountInfo {
  id: string;
  name: string;
  slug: string;
  botName: string | null;
  botAvatar: string | null;
  webhookUrl: string | null;
}

interface Props {
  accountId: string;
  initialAccount: AccountInfo;
  initialMembers: Member[];
}

export default function SettingsUI({ accountId, initialAccount, initialMembers }: Props) {
  const [account, setAccount] = useState(initialAccount);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  async function saveAccount() {
    setSaving(true);
    setSaved(false);
    try {
      const r = await fetch(`/api/app/${accountId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: account.name,
          botName: account.botName || null,
          botAvatar: account.botAvatar || null,
          webhookUrl: account.webhookUrl || null,
        }),
      });
      if (r.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function inviteMember() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const r = await fetch(`/api/app/${accountId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addMember', email: inviteEmail.trim() }),
      });
      if (r.ok) {
        const newMember = await r.json();
        setMembers((prev) => [...prev, newMember]);
        setInviteEmail('');
      }
    } finally {
      setInviting(false);
    }
  }

  async function changeRole(memberId: string, newRole: string) {
    const r = await fetch(`/api/app/${accountId}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'changeRole', memberId, newRole }),
    });
    if (r.ok) {
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    }
  }

  async function removeMember(memberId: string) {
    const r = await fetch(`/api/app/${accountId}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeMember', memberId }),
    });
    if (r.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  }

  return (
    <div className="space-y-8">
      {/* Account Settings */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] space-y-4">
        <h2 className="text-lg font-semibold text-white">Account</h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-zinc-500 mb-1 block">Account Name</span>
            <input
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs text-zinc-500 mb-1 block">Slug (read-only)</span>
            <input
              value={account.slug}
              readOnly
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-xs text-zinc-500 mb-1 block">Bot Name</span>
            <input
              value={account.botName || ''}
              onChange={(e) => setAccount({ ...account, botName: e.target.value })}
              placeholder="e.g. Nova"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs text-zinc-500 mb-1 block">Bot Avatar URL</span>
            <input
              value={account.botAvatar || ''}
              onChange={(e) => setAccount({ ...account, botAvatar: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs text-zinc-500 mb-1 block">Webhook URL</span>
            <input
              value={account.webhookUrl || ''}
              onChange={(e) => setAccount({ ...account, webhookUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveAccount}
            disabled={saving}
            className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-emerald-400">Saved!</span>}
        </div>
      </section>

      {/* Members */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] space-y-4">
        <h2 className="text-lg font-semibold text-white">Members</h2>

        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400 shrink-0">
                {m.user.image ? (
                  <img src={m.user.image} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  (m.user.name?.[0] || m.user.email[0]).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{m.user.name || m.user.email}</p>
                <p className="text-xs text-zinc-500 truncate">{m.user.email}</p>
              </div>
              <select
                value={m.role}
                onChange={(e) => changeRole(m.id, e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="viewer">viewer</option>
              </select>
              <button
                onClick={() => removeMember(m.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div className="flex gap-2 pt-2">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && inviteMember()}
            placeholder="Email address..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
          />
          <button
            onClick={inviteMember}
            disabled={inviting || !inviteEmail.trim()}
            className="px-4 py-2 bg-zinc-800 text-zinc-200 text-sm rounded-lg hover:bg-zinc-700 disabled:opacity-40 transition-colors"
          >
            {inviting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </section>
    </div>
  );
}
