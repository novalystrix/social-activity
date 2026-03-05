import type { PostStatus } from '@/types';

const styles: Record<PostStatus, string> = {
  published: 'bg-emerald-500/10 text-emerald-400',
  draft: 'bg-zinc-700/50 text-zinc-400',
  approved: 'bg-[#4FC3F7]/10 text-[#4FC3F7]',
  'needs-revision': 'bg-amber-500/10 text-amber-400',
  rejected: 'bg-red-500/10 text-red-400',
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
