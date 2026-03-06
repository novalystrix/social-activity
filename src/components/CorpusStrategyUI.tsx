'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface Item {
  id: string;
  filename: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface Props {
  accountId: string;
  type: 'corpus' | 'strategy';
  initialItems: Item[];
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export default function CorpusStrategyUI({ accountId, type, initialItems }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [selected, setSelected] = useState<Item | null>(initialItems[0] || null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  function selectItem(item: Item) {
    setSelected(item);
    setEditing(false);
  }

  function startEdit() {
    if (!selected) return;
    setEditContent(selected.content);
    setEditing(true);
  }

  const save = useCallback(async () => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/app/${accountId}/${type}/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      if (r.ok) {
        const updated = await r.json();
        const newItems = items.map((i) => (i.id === selected.id ? { ...i, content: editContent, updatedAt: updated.updatedAt } : i));
        setItems(newItems);
        setSelected({ ...selected, content: editContent, updatedAt: updated.updatedAt });
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }, [selected, saving, editContent, accountId, type, items]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      setEditing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
        No {type === 'corpus' ? 'corpus files' : 'strategy files'} yet.
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      {/* Sidebar list */}
      <aside className="w-56 shrink-0 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => selectItem(item)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
              selected?.id === item.id
                ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <p className="text-sm font-medium truncate">{item.title}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{formatDate(item.updatedAt)}</p>
          </button>
        ))}
      </aside>

      {/* Content panel */}
      <div className="flex-1 flex flex-col rounded-xl border border-zinc-800 bg-[#1a1a2e] overflow-hidden">
        {selected ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 shrink-0">
              <div>
                <p className="font-semibold text-white">{selected.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{selected.filename} &middot; Updated {formatDate(selected.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={save}
                      disabled={saving}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#4FC3F7] text-black font-medium hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startEdit}
                    className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={save}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full px-5 py-4 bg-transparent text-sm text-zinc-200 font-mono resize-none focus:outline-none"
                  placeholder="Content..."
                  autoFocus
                />
              ) : (
                <div className="px-5 py-4 prose prose-invert prose-sm max-w-none prose-zinc">
                  <ReactMarkdown>{selected.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {editing && (
              <div className="px-5 py-2 border-t border-zinc-800 text-xs text-zinc-600 shrink-0">
                Cmd+Enter to save &middot; Esc to cancel &middot; Auto-saves on blur
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600">Select a file</div>
        )}
      </div>
    </div>
  );
}
