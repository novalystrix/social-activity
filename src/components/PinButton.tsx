'use client';

import { useState } from 'react';

export interface PinnedItem {
  type: 'post' | 'corpus' | 'feedback' | 'engagement' | 'strategy';
  id: number;
  snippet: string;
}

export function dispatchPin(item: PinnedItem) {
  window.dispatchEvent(new CustomEvent('pin-item', { detail: item }));
}

export default function PinButton({ item }: { item: PinnedItem }) {
  const [pulsing, setPulsing] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    dispatchPin(item);
    setPulsing(true);
    setTimeout(() => setPulsing(false), 600);
  }

  return (
    <button
      onClick={handleClick}
      title="Pin to chat"
      className={`text-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-[#4FC3F7]/10 px-3 py-2 rounded-lg cursor-pointer ${
        pulsing ? 'animate-pulse scale-125' : ''
      }`}
    >
      💠
    </button>
  );
}
