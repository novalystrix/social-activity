'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const SECTIONS = [
  'Voice & Style',
  'Attitude & Stance',
  'Dos',
  'Donts',
  'Good Examples',
  'Bad Examples',
  'Notes',
] as const;

const PLATFORMS = ['all', 'linkedin', 'twitter'] as const;
type Platform = typeof PLATFORMS[number];

interface PersonalityItem {
  id: string;
  section: string;
  platform: Platform;
  content: string;
  updatedAt: string;
}

interface Props {
  accountId: string;
  initialItems: PersonalityItem[];
}

export default function PersonalityUI({ accountId, initialItems }: Props) {
  const [platform, setPlatform] = useState<Platform>('all');
  const [items, setItems] = useState<PersonalityItem[]>(initialItems);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  function getKey(section: string, p: Platform) {
    return `${section}::${p}`;
  }

  function getContent(section: string, p: Platform): string {
    return items.find((i) => i.section === section && i.platform === p)?.content || '';
  }

  function startEdit(section: string, p: Platform) {
    const key = getKey(section, p);
    setEditValues((prev) => ({ ...prev, [key]: getContent(section, p) }));
    setEditing((prev) => ({ ...prev, [key]: true }));
  }

  const save = useCallback(
    async (section: string, p: Platform) => {
      const key = getKey(section, p);
      if (saving[key]) return;
      setSaving((prev) => ({ ...prev, [key]: true }));
      const content = editValues[key] ?? '';
      try {
        const r = await fetch(`/api/app/${accountId}/personality`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, platform: p, content }),
        });
        if (r.ok) {
          const updated = await r.json();
          setItems((prev) => {
            const exists = prev.find((i) => i.section === section && i.platform === p);
            if (exists) {
              return prev.map((i) => (i.section === section && i.platform === p ? updated : i));
            }
            return [...prev, updated];
          });
          setEditing((prev) => ({ ...prev, [key]: false }));
        }
      } finally {
        setSaving((prev) => ({ ...prev, [key]: false }));
      }
    },
    [accountId, editValues, saving]
  );

  function handleKeyDown(e: React.KeyboardEvent, section: string, p: Platform) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      save(section, p);
    }
    if (e.key === 'Escape') {
      const key = getKey(section, p);
      setEditing((prev) => ({ ...prev, [key]: false }));
    }
  }

  const platformLabels: Record<Platform, string> = {
    all: 'All Platforms',
    linkedin: 'LinkedIn',
    twitter: 'X',
  };

  const platformColors: Record<Platform, string> = {
    all: 'text-[#4FC3F7] border-[#4FC3F7]',
    linkedin: 'text-blue-400 border-blue-400',
    twitter: 'text-sky-400 border-sky-400',
  };

  return (
    <div className="space-y-6">
      {/* Platform Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              platform === p
                ? `${platformColors[p]} border-b-2`
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {platformLabels[p]}
          </button>
        ))}
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-4">
        {SECTIONS.map((section) => {
          const key = getKey(section, platform);
          const isEditing = editing[key];
          const isSaving = saving[key];
          const content = isEditing ? (editValues[key] ?? '') : getContent(section, platform);
          const hasContent = getContent(section, platform).trim().length > 0;

          return (
            <div key={section} className="rounded-xl border border-zinc-800 bg-[#1a1a2e] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-200">{section}</h3>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditing((prev) => ({ ...prev, [key]: false }))}
                        className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => save(section, platform)}
                        disabled={isSaving}
                        className="text-xs px-2 py-1 rounded bg-[#4FC3F7] text-black font-medium hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(section, platform)}
                      className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="min-h-[80px]">
                {isEditing ? (
                  <div className="flex flex-col">
                    <textarea
                      value={content}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                      onBlur={() => save(section, platform)}
                      onKeyDown={(e) => handleKeyDown(e, section, platform)}
                      rows={6}
                      className="w-full px-4 py-3 bg-transparent text-sm text-zinc-200 font-mono resize-y focus:outline-none"
                      placeholder={`${section} for ${platformLabels[platform]}...`}
                      autoFocus
                    />
                    <p className="px-4 pb-2 text-xs text-zinc-700">Cmd+Enter to save &middot; Esc to cancel &middot; Auto-saves on blur</p>
                  </div>
                ) : hasContent ? (
                  <div className="px-4 py-3 prose prose-invert prose-sm max-w-none prose-zinc">
                    <ReactMarkdown>{getContent(section, platform)}</ReactMarkdown>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(section, platform)}
                    className="w-full h-full px-4 py-3 text-sm text-zinc-600 text-left hover:text-zinc-400 transition-colors"
                  >
                    Click to add {section.toLowerCase()} for {platformLabels[platform]}...
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
