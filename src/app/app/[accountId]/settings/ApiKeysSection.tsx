'use client';

import { useState, useEffect } from 'react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export default function ApiKeysSection({ accountId }: { accountId: string }) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/app/${accountId}/api-keys`).then(r => r.json()).then(setKeys).catch(() => {});
  }, [accountId]);

  async function createKey() {
    setCreating(true);
    try {
      const r = await fetch(`/api/app/${accountId}/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() || 'default' }),
      });
      if (r.ok) {
        const key = await r.json();
        setKeys(prev => [key, ...prev]);
        setNewName('');
      }
    } finally {
      setCreating(false);
    }
  }

  async function deleteKey(id: string) {
    const r = await fetch(`/api/app/${accountId}/api-keys?id=${id}`, { method: 'DELETE' });
    if (r.ok) setKeys(prev => prev.filter(k => k.id !== id));
  }

  function copyKey(key: ApiKey) {
    navigator.clipboard.writeText(key.key);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <section className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">API Keys</h2>
        <p className="text-xs text-zinc-500 mt-1">Use these to connect your AI agent via the Bot API. See the <a href="/#plugin" className="text-[#4FC3F7] hover:underline">plugin docs</a> for setup instructions.</p>
      </div>

      {keys.length > 0 && (
        <div className="space-y-2">
          {keys.map(k => (
            <div key={k.id} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200">{k.name}</p>
                <p className="text-xs text-zinc-500 font-mono truncate">{k.key.slice(0, 12)}...{k.key.slice(-6)}</p>
              </div>
              <button
                onClick={() => copyKey(k)}
                className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {copiedId === k.id ? '✓ Copied' : 'Copy'}
              </button>
              <button
                onClick={() => deleteKey(k.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createKey()}
          placeholder="Key name (optional)..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
        />
        <button
          onClick={createKey}
          disabled={creating}
          className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors"
        >
          {creating ? 'Creating...' : 'Create Key'}
        </button>
      </div>

      <div className="rounded-lg bg-zinc-900 p-3 mt-2">
        <p className="text-xs text-zinc-500 mb-1">Account ID (for plugin config):</p>
        <code className="text-xs text-[#4FC3F7] select-all">{accountId}</code>
      </div>
    </section>
  );
}
