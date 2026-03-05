import type { Platform } from '@/types';

export default function PlatformBadge({ platform }: { platform: Platform }) {
  const isTwitter = platform === 'twitter';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      isTwitter
        ? 'bg-sky-500/10 text-sky-400'
        : 'bg-blue-600/10 text-blue-400'
    }`}>
      {isTwitter ? '𝕏' : 'in'} {isTwitter ? 'Twitter' : 'LinkedIn'}
    </span>
  );
}
