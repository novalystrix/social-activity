'use client';

import { useEffect, useState, useCallback } from 'react';
import Markdown from 'react-markdown';

type Platform = 'all' | 'linkedin' | 'twitter';

interface Section {
  key: string;
  label: string;
  description: string;
}

interface PersonalityEntry {
  id: number;
  section: string;
  platform: string;
  content: string;
  updated_at: string;
}

const SECTIONS: Section[] = [
  { key: 'style', label: 'Voice & Style', description: 'How I should sound. Tone, formality, sentence structure.' },
  { key: 'attitude', label: 'Attitude & Stance', description: 'What I believe, what I push back on, what I champion.' },
  { key: 'dos', label: "Do's", description: 'Things I should always do in comments/posts.' },
  { key: 'donts', label: "Don'ts", description: 'Things I should never do.' },
  { key: 'examples_good', label: 'Good Examples', description: 'Real comments/posts that nail the voice. Include URL and text.' },
  { key: 'examples_bad', label: 'Bad Examples', description: 'Real comments/posts that miss. Include what\'s wrong with each.' },
  { key: 'notes', label: 'Notes', description: 'Freeform coaching notes.' },
];

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: 'all', label: 'All Platforms' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter' },
];

export default function PersonalityPage() {
  const [platform, setPlatform] = useState<Platform>('all');
  const [entries, setEntries] = useState<PersonalityEntry[]>([]);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const res = await fetch('/api/personality');
    const data = await res.json();
    setEntries(data.entries || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function getEntry(section: string): PersonalityEntry | undefined {
    return entries.find(e => e.section === section && e.platform === platform);
  }

  function cardKey(section: string) {
    return `${section}::${platform}`;
  }

  function startEdit(section: string) {
    const key = cardKey(section);
    const entry = getEntry(section);
    setEditValues(v => ({ ...v, [key]: entry?.content ?? '' }));
    setEditing(e => ({ ...e, [key]: true }));
  }

  async function saveEdit(section: string) {
    const key = cardKey(section);
    const content = editValues[key] ?? '';
    setSaving(s => ({ ...s, [key]: true }));
    await fetch('/api/personality', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, platform, content }),
    });
    await load();
    setEditing(e => ({ ...e, [key]: false }));
    setSaving(s => ({ ...s, [key]: false }));
  }

  async function deleteEntry(section: string) {
    const entry = getEntry(section);
    if (!entry) return;
    await fetch(`/api/personality/${entry.id}`, { method: 'DELETE' });
    await load();
  }

  function handleKeyDown(e: React.KeyboardEvent, section: string) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      saveEdit(section);
    }
    if (e.key === 'Escape') {
      const key = cardKey(section);
      setEditing(ed => ({ ...ed, [key]: false }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Personality</h1>
        <p className="text-zinc-400 text-sm mt-1">Define and curate my voice across platforms</p>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2">
        {PLATFORMS.map(p => (
          <button
            key={p.key}
            onClick={() => setPlatform(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              platform === p.key
                ? 'bg-[#4FC3F7] text-black'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Section cards */}
      <div className="space-y-4">
        {SECTIONS.map(section => {
          const key = cardKey(section.key);
          const entry = getEntry(section.key);
          const isEditing = editing[key] ?? false;
          const isSaving = saving[key] ?? false;

          return (
            <div key={key} className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-base font-semibold text-white">{section.label}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">{section.description}</p>
                  {entry?.updated_at && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Updated: {new Date(entry.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(section.key)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700"
                    >
                      {entry ? 'Edit' : '+ Add'}
                    </button>
                  )}
                  {!isEditing && entry && (
                    <button
                      onClick={() => deleteEntry(section.key)}
                      className="px-3 py-1.5 bg-zinc-900 text-zinc-500 text-xs rounded-lg hover:text-red-400 hover:bg-zinc-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    autoFocus
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-200 font-mono min-h-[160px] focus:border-[#4FC3F7] focus:outline-none"
                    value={editValues[key] ?? ''}
                    onChange={e => setEditValues(v => ({ ...v, [key]: e.target.value }))}
                    onKeyDown={e => handleKeyDown(e, section.key)}
                    onBlur={() => saveEdit(section.key)}
                    placeholder={`Enter ${section.label.toLowerCase()}... (supports markdown)`}
                  />
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => saveEdit(section.key)}
                      disabled={isSaving}
                      className="px-4 py-1.5 bg-[#4FC3F7] text-black text-xs font-medium rounded-lg hover:bg-[#81D4FA] disabled:opacity-50"
                    >
                      {isSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(ed => ({ ...ed, [key]: false }))}
                      className="px-4 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                    <span className="text-xs text-zinc-600">Cmd+Enter to save · Esc to cancel · blur auto-saves</span>
                  </div>
                </div>
              ) : entry?.content ? (
                <div
                  className="prose prose-invert prose-sm max-w-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-code:font-mono cursor-pointer"
                  onClick={() => startEdit(section.key)}
                  title="Click to edit"
                >
                  <Markdown>{entry.content}</Markdown>
                </div>
              ) : (
                <p
                  className="text-zinc-600 text-sm italic cursor-pointer hover:text-zinc-500"
                  onClick={() => startEdit(section.key)}
                >
                  Click to add {section.label.toLowerCase()}…
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
