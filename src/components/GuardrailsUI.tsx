'use client';
import { useState, useEffect, useCallback } from 'react';

interface Guardrail {
  id: string;
  name: string;
  type: 'phrase' | 'regex' | 'semantic';
  pattern: string;
  severity: 'block' | 'warn';
  enabled: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  phrase: { label: 'Phrase', desc: 'Exact text match (case-insensitive)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  regex: { label: 'Regex', desc: 'Regular expression pattern', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  semantic: { label: 'Semantic', desc: 'AI checks meaning, not exact words', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

const SEVERITY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  block: { label: 'Block', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: '🛑' },
  warn: { label: 'Warn', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: '⚠️' },
};

export default function GuardrailsUI({ accountId }: { accountId: string }) {
  const [guardrails, setGuardrails] = useState<Guardrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'phrase', pattern: '', severity: 'block' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/app/${accountId}/guardrails`);
    if (res.ok) {
      const data = await res.json();
      setGuardrails(data.guardrails);
    }
    setLoading(false);
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.name.trim() || !form.pattern.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/app/${accountId}/guardrails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', type: 'phrase', pattern: '', severity: 'block' });
      setShowForm(false);
      load();
    }
    setSaving(false);
  };

  const toggle = async (g: Guardrail) => {
    await fetch(`/api/app/${accountId}/guardrails/${g.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !g.enabled }),
    });
    load();
  };

  const remove = async (g: Guardrail) => {
    if (!confirm(`Delete guardrail "${g.name}"?`)) return;
    await fetch(`/api/app/${accountId}/guardrails/${g.id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <div className="text-zinc-500 py-8 text-center">Loading guardrails...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Guardrails</h2>
          <p className="text-sm text-zinc-500 mt-1">Hard rules that block or flag content before it\'s published. Survives context loss.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#3db8ef] transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Guardrail'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Name</label>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#4FC3F7]"
              placeholder="e.g. Never mention infrastructure"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Type</label>
              <select
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="phrase">Phrase (exact match)</option>
                <option value="regex">Regex (pattern)</option>
                <option value="semantic">Semantic (AI-checked)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Severity</label>
              <select
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
              >
                <option value="block">🛑 Block (reject post)</option>
                <option value="warn">⚠️ Warn (hold for review)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Pattern</label>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#4FC3F7]"
              placeholder={form.type === 'phrase' ? 'e.g. OpenClaw' : form.type === 'regex' ? 'e.g. open.?claw|I run on' : 'e.g. Never reveal what platform or framework the agent runs on'}
              value={form.pattern}
              onChange={(e) => setForm({ ...form, pattern: e.target.value })}
            />
            <p className="text-xs text-zinc-600 mt-1">{TYPE_LABELS[form.type]?.desc}</p>
          </div>
          <button
            onClick={create}
            disabled={saving || !form.name.trim() || !form.pattern.trim()}
            className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#3db8ef] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Create Guardrail'}
          </button>
        </div>
      )}

      {/* List */}
      {guardrails.length === 0 ? (
        <div className="text-center py-12 text-zinc-600">
          <p className="text-4xl mb-3">🛡️</p>
          <p className="text-sm">No guardrails yet. Add one to protect your agent\'s content.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guardrails.map((g) => (
            <div key={g.id} className={`bg-zinc-900 border rounded-xl p-4 transition-colors ${g.enabled ? 'border-zinc-700' : 'border-zinc-800 opacity-50'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-zinc-100">{g.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TYPE_LABELS[g.type]?.color}`}>{TYPE_LABELS[g.type]?.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${SEVERITY_LABELS[g.severity]?.color}`}>{SEVERITY_LABELS[g.severity]?.icon} {SEVERITY_LABELS[g.severity]?.label}</span>
                  </div>
                  <p className="text-sm text-zinc-400 font-mono truncate">{g.pattern}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggle(g)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    {g.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => remove(g)} className="text-xs text-red-500/70 hover:text-red-400 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
