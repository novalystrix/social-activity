'use client';

import type { PinnedItem } from './PinButton';

const typeColors: Record<string, string> = {
  post: 'border-blue-500/50 bg-blue-500/10',
  corpus: 'border-emerald-500/50 bg-emerald-500/10',
  feedback: 'border-orange-500/50 bg-orange-500/10',
  engagement: 'border-violet-500/50 bg-violet-500/10',
  strategy: 'border-cyan-500/50 bg-cyan-500/10',
};

export default function PinnedItemCard({
  item,
  onRemove,
}: {
  item: PinnedItem;
  onRemove: () => void;
}) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs ${typeColors[item.type] || 'border-zinc-700 bg-zinc-800'}`}>
      <span className="text-zinc-400 uppercase font-medium">{item.type}</span>
      <span className="text-zinc-200 truncate max-w-[180px]">{item.snippet}</span>
      <button onClick={onRemove} className="text-zinc-500 hover:text-zinc-300 ml-auto shrink-0">&times;</button>
    </div>
  );
}
