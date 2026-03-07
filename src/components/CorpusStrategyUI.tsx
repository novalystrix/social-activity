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

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.md';
}

export default function CorpusStrategyUI({ accountId, type, initialItems }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [selected, setSelected] = useState<Item | null>(initialItems[0] || null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  function selectItem(item: Item) {
    setSelected(item);
    setEditing(false);
    setCreating(false);
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

  async function createFile() {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const filename = slugify(newTitle);
      const r = await fetch(`/api/app/${accountId}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, title: newTitle.trim(), content: '' }),
      });
      if (r.ok) {
        const created = await r.json();
        const newItem: Item = {
          id: created.id,
          filename: created.filename,
          title: created.title,
          content: created.content || '',
          updatedAt: created.updatedAt,
        };
        setItems((prev) => [newItem, ...prev]);
        setSelected(newItem);
        setCreating(false);
        setNewTitle('');
        setEditContent('');
        setEditing(true);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteFile(id: string) {
    try {
      const r = await fetch(`/api/app/${accountId}/${type}/${id}`, { method: 'DELETE' });
      if (r.ok) {
        const newItems = items.filter((i) => i.id !== id);
        setItems(newItems);
        if (selected?.id === id) {
          setSelected(newItems[0] || null);
          setEditing(false);
        }
      }
    } catch {}
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      setEditing(false);
    }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      {/* Sidebar list */}
      <aside className="w-56 shrink-0 flex flex-col overflow-hidden">
        <div className="space-y-1 overflow-y-auto flex-1">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <button
                onClick={() => selectItem(item)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  selected?.id === item.id
                    ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <p className="text-sm font-medium truncate pr-6">{item.title}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{formatDate(item.updatedAt)}</p>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${item.title}"?`)) deleteFile(item.id); }}
                className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add new file */}
        {creating ? (
          <div className="pt-2 border-t border-zinc-800 mt-2 space-y-2 px-1">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') createFile(); if (e.key === 'Escape') setCreating(false); }}
              placeholder="File title..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={createFile} disabled={saving || !newTitle.trim()} className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-[#4FC3F7] text-black font-medium hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors">
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button onClick={() => { setCreating(false); setNewTitle(''); }} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="mt-2 pt-2 border-t border-zinc-800 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-[#4FC3F7] hover:bg-zinc-800/50 transition-colors w-full"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add file
          </button>
        )}
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
          <div className="flex-1 flex items-center justify-center text-zinc-600">
            {items.length === 0 ? 'No files yet. Click "Add file" to create one.' : 'Select a file'}
          </div>
        )}
      </div>
    </div>
  );
}
