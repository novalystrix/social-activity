'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface Props {
  accountId: string;
  accountName: string;
  accounts: { id: string; name: string }[];
  userName?: string | null;
  userImage?: string | null;
}

const navItems = [
  { href: '', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { href: '/twitter', label: 'X', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { href: '/linkedin', label: 'LinkedIn', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  { href: '/analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
  { href: '/settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];


const presenceDataItems = [
  { href: '/corpus', label: 'Corpus', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
  { href: '/journal', label: 'Journal', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .513v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
  { href: '/strategy', label: 'Strategy', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> },
  { href: '/guardrails', label: 'Guardrails', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
  { href: '/personality', label: 'Personality', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

export default function AppSidebar({ accountId, accountName, accounts, userName, userImage }: Props) {
  const pathname = usePathname();
  const base = `/app/${accountId}`;
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [presenceOpen, setPresenceOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setCollapsed(true);
    };
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);


  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? (isMobile ? '0rem' : '3.5rem') : '14rem');
  }, [collapsed, isMobile]);

  useEffect(() => {
    const presencePaths = ['/corpus', '/journal', '/strategy', '/personality'];
    if (presencePaths.some(p => pathname.startsWith(base + p))) setPresenceOpen(true);
  }, [pathname, base]);

  function isActive(href: string) {
    const full = base + href;
    if (href === '') return pathname === base || pathname === base + '/';
    return pathname.startsWith(full);
  }

  const sidebarWidth = collapsed ? 'w-0 md:w-14' : 'w-56';

  return (
    <>
      {/* Hamburger toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`fixed top-3 z-50 w-8 h-8 flex items-center justify-center rounded-lg bg-[#0d0d1a] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all ${
          collapsed ? 'left-1 md:left-[3.75rem]' : 'left-[13rem]'
        }`}
      >
        {collapsed ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        )}
      </button>

      {/* Overlay on mobile when open */}
      {isMobile && !collapsed && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setCollapsed(true)} />
      )}

      <aside className={`fixed top-0 left-0 h-screen bg-[#0d0d1a] border-r border-zinc-800 flex flex-col z-30 transition-all duration-300 overflow-hidden ${sidebarWidth} ${isMobile && collapsed ? '-translate-x-full' : ''}`}>
        {/* Account Switcher */}
        <div className={`px-4 py-4 border-b border-zinc-800 ${collapsed ? 'md:px-2 md:py-3' : ''}`}>
          <Link href="/accounts" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-[#4FC3F7]/20 flex items-center justify-center text-[#4FC3F7] font-bold text-sm shrink-0">
              {accountName[0]?.toUpperCase()}
            </div>
            {!collapsed && <span className="text-sm font-semibold text-white truncate group-hover:text-[#4FC3F7] transition-colors flex-1">{accountName}</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto ${collapsed ? 'px-1.5' : 'px-3'}`}>
{navItems.map((item) => (
            <Link
              key={item.href}
              href={base + item.href}
              title={collapsed ? item.label : undefined}
              onClick={() => { if (isMobile) setCollapsed(true); }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                collapsed ? 'justify-center px-2' : ''
              } ${
                isActive(item.href)
                  ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          ))}

          {/* Presence Data - collapsible group */}
          {!collapsed ? (
            <div>
              <button
                onClick={() => setPresenceOpen(!presenceOpen)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full ${
                  presenceDataItems.some(i => isActive(i.href))
                    ? 'text-[#4FC3F7]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <span className="shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75" /></svg>
                </span>
                <span className="flex-1 text-left">Presence Data</span>
                <svg className={`w-4 h-4 transition-transform ${presenceOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {presenceOpen && (
                <div className="ml-3 space-y-0.5 mt-0.5">
                  {presenceDataItems.map((item) => (
                    <Link
                      key={item.href}
                      href={base + item.href}
                      onClick={() => { if (isMobile) setCollapsed(true); }}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive(item.href)
                          ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div title="Presence Data" className="flex items-center justify-center px-2 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer" onClick={() => { setCollapsed(false); setPresenceOpen(true); }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75" /></svg>
            </div>
          )}
        </nav>

        {/* Pricing */}
        <div className={`py-2 ${collapsed ? 'px-1.5' : 'px-3'}`}>
          <Link
            href="/pricing"
            title={collapsed ? 'Pricing' : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${collapsed ? 'justify-center px-2' : ''} text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50`}
          >
            <span className="shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg></span>
            {!collapsed && 'Pricing'}
          </Link>
        </div>

        {/* User */}
        <div className={`py-4 border-t border-zinc-800 ${collapsed ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center gap-2 mb-2 ${collapsed ? 'justify-center' : ''}`}>
            {userImage ? (
              <img src={userImage} alt="" className="w-7 h-7 rounded-full shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400 shrink-0">
                {userName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            {!collapsed && <span className="text-xs text-zinc-400 truncate flex-1">{userName}</span>}
          </div>
          {!collapsed && (
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Sign out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
