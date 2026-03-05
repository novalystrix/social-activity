'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: '\u25C8' },
  { href: '/posts', label: 'Posts', icon: '\u270E' },
  { href: '/queue', label: 'Queue', icon: '\u23F1' },
  { href: '/engagement', label: 'Engagement', icon: '\u2194' },
  { href: '/corpus', label: 'Corpus', icon: '\u2630' },
  { href: '/strategy', label: 'Strategy', icon: '\u2699' },
  { href: '/feedback', label: 'Feedback', icon: '\u2709' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-[#0f0f1a] border-r border-zinc-800 flex flex-col z-50">
      <div className="p-5 border-b border-zinc-800">
        <span className="text-lg font-bold text-white tracking-tight">
          <span className="text-[#4FC3F7]">Nova</span>lystrix
        </span>
        <p className="text-xs text-zinc-500 mt-0.5">Social Activity</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
