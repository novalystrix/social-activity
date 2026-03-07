'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type JournalType = 'daily' | 'weekly' | 'monthly' | 'quarterly';

interface Entry {
  id: string;
  type: string;
  date: string;
  content: string;
  updatedAt: string;
}

interface Props {
  accountId: string;
  initialEntries: Entry[];
}

const TABS: { key: JournalType; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
];

export default function JournalUI({ accountId, initialEntries }: Props) {
  const [activeTab, setActiveTab] = useState<JournalType>('daily');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = initialEntries.filter((e) => e.type === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setExpandedId(null); }}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
              activeTab === tab.key
                ? 'bg-[#1a1a2e] text-[#4FC3F7] border-b-2 border-[#4FC3F7]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-2">No journal entries yet.</p>
          <p className="text-sm">Enable journaling in your plugin config to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="border border-zinc-800 rounded-lg bg-[#0d0d1a] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <span className="font-mono text-[#4FC3F7] font-semibold text-base">{entry.date}</span>
                <span className="text-zinc-500 text-xs">
                  {expandedId === entry.id ? '▲ collapse' : '▼ expand'}
                </span>
              </button>

              {expandedId === entry.id && (
                <div className="px-5 pb-5 border-t border-zinc-800">
                  <div className="prose prose-invert prose-sm max-w-none mt-4
                    prose-headings:text-[#4FC3F7] prose-headings:font-semibold
                    prose-p:text-zinc-300 prose-li:text-zinc-300
                    prose-strong:text-white prose-code:text-[#4FC3F7]
                    prose-blockquote:border-l-[#4FC3F7] prose-blockquote:text-zinc-400">
                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                  </div>
                  <p className="text-xs text-zinc-600 mt-4">
                    Last updated: {new Date(entry.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
