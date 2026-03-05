import type { PostType } from '@/types';

const styles: Record<PostType, string> = {
  original: 'bg-emerald-500/10 text-emerald-400',
  reaction: 'bg-violet-500/10 text-violet-400',
  philosophy: 'bg-amber-500/10 text-amber-400',
  story: 'bg-pink-500/10 text-pink-400',
  advancement: 'bg-[#4FC3F7]/10 text-[#4FC3F7]',
};

export default function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${styles[type]}`}>
      {type}
    </span>
  );
}
