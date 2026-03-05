'use client';

import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import PinButton from '@/components/PinButton';

interface StrategyFile {
  id: number;
  filename: string;
  title: string;
  content: string;
  source_path: string;
  updated_at: string;
}

export default function StrategyPage() {
  const [files, setFiles] = useState<StrategyFile[]>([]);
  const [selected, setSelected] = useState<StrategyFile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetch('/api/strategy').then(r => r.json()).then(d => setFiles(d.files || []));
  }, []);

  async function selectFile(id: number) {
    const r = await fetch(`/api/strategy/${id}`);
    const d = await r.json();
    setSelected(d.file);
    setEditing(false);
  }

  async function saveEdit() {
    if (!selected) return;
    const r = await fetch(`/api/strategy/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    const d = await r.json();
    setSelected(d.file);
    setEditing(false);
    fetch('/api/strategy').then(r => r.json()).then(d => setFiles(d.files || []));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Strategy & Config</h1>
        <p className="text-zinc-400 text-sm mt-1">Content strategy and configuration files</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="group relative">
              <button
                onClick={() => selectFile(file.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?.id === file.id
                    ? 'border-[#4FC3F7]/50 bg-[#4FC3F7]/5'
                    : 'border-zinc-800 bg-[#1a1a2e] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{file.title}</p>
                  <PinButton item={{ type: 'strategy', id: file.id, snippet: file.title }} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{file.filename}</p>
                <p className="text-xs text-zinc-600 mt-0.5">Updated: {new Date(file.updated_at).toLocaleDateString()}</p>
              </button>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {selected ? (
            <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selected.title}</h2>
                  <p className="text-xs text-zinc-500">{selected.source_path}</p>
                  <p className="text-xs text-zinc-600">Last modified: {new Date(selected.updated_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => { setEditing(!editing); setEditContent(selected.content); }}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700"
                >
                  {editing ? 'Preview' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <textarea
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-200 font-mono min-h-[500px] focus:border-[#4FC3F7] focus:outline-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#81D4FA]">Save</button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-code:font-mono">
                  <Markdown>{selected.content}</Markdown>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
              Select a strategy file to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
