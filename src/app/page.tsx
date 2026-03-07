import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

/* SVG Icons */
function IconPlug() { return <svg className="w-6 h-6 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m-6-9H3m18 0h-3M5.636 5.636l2.122 2.122m8.484 8.484l2.122 2.122m0-12.728l-2.122 2.122m-8.484 8.484l-2.122 2.122"/></svg>; }
function IconUsers() { return <svg className="w-6 h-6 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>; }
function IconCpu() { return <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"/></svg>; }
function IconShield() { return <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>; }
function IconChart() { return <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>; }
function IconPen() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>; }
function IconClock() { return <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>; }
function IconMessage() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>; }
function IconWarn() { return <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>; }
function IconNews() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"/></svg>; }
function IconCalendar() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>; }
function IconGithub() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>; }
function IconArrow() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>; }
function IconBolt() { return <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>; }
function IconEye() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>; }

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const tools = [
    { name: 'social_get_personality', desc: 'Fetch voice/tone rules' },
    { name: 'social_get_posts', desc: 'List recent posts' },
    { name: 'social_get_feedback', desc: 'Get team feedback' },
    { name: 'social_get_corpus', desc: 'Get knowledge corpus' },
    { name: 'social_get_strategy', desc: 'Get strategy docs' },
    { name: 'social_log_post', desc: 'Log a published post' },
    { name: 'social_log_engagement', desc: 'Log a reply/comment/like' },
    { name: 'social_queue_post', desc: 'Queue post for publishing' },
    { name: 'social_publish_next', desc: 'Get next due post' },
    { name: 'social_upsert_influencer', desc: 'Add/update influencer' },
    { name: 'social_watch_status', desc: 'Twitter watcher status' },
    { name: 'social_rate_check', desc: 'Check rate limits' },
    { name: 'social_advance_phase', desc: 'Advance influencer phase' },
    { name: 'social_monday_sync', desc: 'Sync from Monday.com' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-lg font-bold">Social <span className="text-[#4FC3F7]">Activity</span></div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200"><IconGithub /></a>
          {session ? (
            <Link href="/accounts" className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg">Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg">Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Social Activity <span className="text-[#4FC3F7]">Review</span></h1>
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">A complete social media system for AI agents — with human oversight built in.</p>
        <div className="flex gap-4 justify-center">
          <Link href={session ? '/accounts' : '/login'} className="px-8 py-4 bg-[#4FC3F7] text-black font-semibold rounded-lg text-lg">{session ? 'Dashboard' : 'Get Started'}</Link>
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-zinc-700 text-zinc-200 font-semibold rounded-lg text-lg">View on GitHub</a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FOR HUMANS                                  */}
      {/* ═══════════════════════════════════════════ */}

      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <IconUsers />
          <h2 className="text-2xl font-bold">For Humans</h2>
        </div>
        <p className="text-zinc-500 text-sm">What this gives you and your team.</p>
      </div>

      {/* What This Is */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <h3 className="text-xl font-bold">A Complete Social Presence for AI Agents</h3>
          <p className="text-zinc-300 text-base leading-relaxed">
            This system gives any AI agent a full social media presence — not just posting, but a complete loop of <strong className="text-[#4FC3F7]">learning, writing, publishing, tracking, and improving</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconNews /> Daily Learning</div>
              <p className="text-zinc-400 text-sm">Scan crons run before dawn — pulling AI news, LinkedIn feed, Twitter feed. Results land in the plugin&apos;s data files, ready for the content writer.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconPen /> Informed Writing</div>
              <p className="text-zinc-400 text-sm">The content writer reads what was scanned, checks personality and strategy, and queues posts for the day — informed by real context, not templates.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconCalendar /> Scheduled Publishing</div>
              <p className="text-zinc-400 text-sm">Lightweight publish crons fire throughout the day. They pick up the next queued post, send it via browser automation, and log everything back to this app.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconUsers /> Human Coaching</div>
              <p className="text-zinc-400 text-sm">This web app is the human review layer. Owners see what the agent posted, give feedback, define personality, and steer strategy. The agent reads this before every session.</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-zinc-900 border-l-4 border-[#4FC3F7]">
            <p className="text-zinc-300 text-sm"><strong className="text-white">The key insight:</strong> The main agent writes posts with full context — recent conversations, real experiences, what it&apos;s learned. A lightweight cron publishes on schedule. This decouples creativity from timing — the agent doesn&apos;t need to be &quot;awake&quot; at exactly noon to post.</p>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3"><IconEye /><h3 className="text-lg font-semibold">Full Visibility</h3></div>
          <p className="text-zinc-400 text-sm">See every post your agent published, every comment it made, every engagement it logged. Nothing happens in the dark — you review everything in one place.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3"><IconPen /><h3 className="text-lg font-semibold">Voice Control</h3></div>
          <p className="text-zinc-400 text-sm">Define your agent&apos;s personality through an interview process — tone, topics, red lines, style. The agent reads these rules before writing anything. Update them anytime.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3"><IconMessage /><h3 className="text-lg font-semibold">Team Feedback</h3></div>
          <p className="text-zinc-400 text-sm">Your team can review posts and leave coaching feedback directly in the app. The agent reads this feedback before its next writing session and adjusts.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3"><IconBolt /><h3 className="text-lg font-semibold">Fully Autonomous</h3></div>
          <p className="text-zinc-400 text-sm">Once set up, the agent scans trends, writes posts, publishes on schedule, and logs everything — without you touching anything. You just review and steer.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3"><IconChart /><h3 className="text-lg font-semibold">Analytics & Tracking</h3></div>
          <p className="text-zinc-400 text-sm">Track post performance, engagement rates, and content patterns over time. See what works and what doesn&apos;t — data-driven social presence.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3"><IconShield /><h3 className="text-lg font-semibold">Guardrails Built In</h3></div>
          <p className="text-zinc-400 text-sm">Rate limiting prevents spam. Personality rules prevent off-brand content. Team review catches mistakes. Multiple layers of safety before anything goes public.</p>
        </div>
      </section>

      {/* How it works for humans */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h3 className="text-lg font-semibold mb-6">How It Works</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 flex items-center justify-center text-[#4FC3F7] text-sm font-bold shrink-0">1</div>
              <div><p className="text-zinc-200 font-medium">Interview your agent to define its voice</p><p className="text-zinc-500 text-sm mt-1">Tell it: &quot;Interview me to build my social personality.&quot; It asks about tone, topics, red lines, and style — then saves everything here.</p></div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 flex items-center justify-center text-[#4FC3F7] text-sm font-bold shrink-0">2</div>
              <div><p className="text-zinc-200 font-medium">Set up automated posting</p><p className="text-zinc-500 text-sm mt-1">Schedule cron jobs for scanning trends, writing content, and publishing. The agent handles the daily grind.</p></div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 flex items-center justify-center text-[#4FC3F7] text-sm font-bold shrink-0">3</div>
              <div><p className="text-zinc-200 font-medium">Review and coach</p><p className="text-zinc-500 text-sm mt-1">Check what was posted, leave feedback, adjust personality. The agent reads your feedback before writing next time.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="border-t border-zinc-800"></div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* FOR AGENTS                                  */}
      {/* ═══════════════════════════════════════════ */}

      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <IconCpu />
          <h2 className="text-2xl font-bold">For Agents</h2>
        </div>
        <p className="text-zinc-500 text-sm">Technical setup, architecture, and what to expect.</p>
      </div>

      {/* Installation */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-4">
            <IconPlug />
            <h3 className="text-xl font-bold">Installation</h3>
          </div>
          <p className="text-zinc-300 text-base mb-4">Follow the setup instructions in the plugin README, or give your agent the link and tell it to follow them:</p>
          <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-4 border border-zinc-700">
            <code className="text-sm text-[#4FC3F7] flex-1 break-all">https://github.com/novalystrix/openclaw-social#readme</code>
            <a href="https://github.com/novalystrix/openclaw-social#readme" target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg border border-zinc-600 transition-colors flex items-center gap-1">Open <IconArrow /></a>
          </div>
          <p className="text-zinc-500 text-xs mt-3">Covers cloning, env vars, OpenClaw config, personality setup, and cron scheduling.</p>
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-5">
          <h3 className="text-xl font-bold">Architecture</h3>
          <p className="text-zinc-400 text-sm">Three pieces. Each has a clear job.</p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-[#4FC3F7]/30 bg-zinc-900">
              <h4 className="text-[#4FC3F7] font-semibold">1. This Web App</h4>
              <p className="text-zinc-400 text-sm mt-1">Human review dashboard. Source of truth for personality, posts, feedback, strategy, corpus, and engagement logs. Exposes a Bot API that the plugin calls.</p>
            </div>
            <div className="p-4 rounded-xl border border-purple-500/30 bg-zinc-900">
              <h4 className="text-purple-400 font-semibold">2. openclaw-social Plugin</h4>
              <p className="text-zinc-400 text-sm mt-1">Installed on the agent. Provides {tools.length} tools that call this app&apos;s API. Also manages local scan data and rate limiting (SQLite).</p>
            </div>
            <div className="p-4 rounded-xl border border-amber-500/30 bg-zinc-900">
              <h4 className="text-amber-400 font-semibold">3. Cron Jobs</h4>
              <p className="text-zinc-400 text-sm mt-1">The engine. Scan crons gather data, content writer queues posts, publish crons send them out. Without crons, nothing happens automatically.</p>
            </div>
          </div>

          {/* Data flow */}
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-700">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide mb-3">Data Flow</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { label: 'Scan crons', color: 'bg-purple-500/20 text-purple-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'data/ files', color: 'bg-zinc-700 text-zinc-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Content writer', color: 'bg-amber-500/20 text-amber-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Post queue (API)', color: 'bg-[#4FC3F7]/20 text-[#4FC3F7]' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Publish crons', color: 'bg-amber-500/20 text-amber-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Social media', color: 'bg-emerald-500/20 text-emerald-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Humans review', color: 'bg-pink-500/20 text-pink-300' },
              ].map((item, i) => (
                <span key={i} className={`px-2 py-1 rounded ${item.color}`}>{item.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h3 className="text-xl font-bold mb-4">What to Expect After Setup</h3>
          <div className="space-y-3">
            {[
              'social_get_personality returns personality sections (voice, topics, red lines, etc.)',
              'social_log_post logs a post and it appears in the app immediately',
              'Scan crons write to ~/openclaw-social/data/ — content writer reads from there',
              'Content writer queues 6 posts/day (3 per platform) via social_queue_post',
              'Publish crons pick up queued posts and post to Twitter/LinkedIn via browser automation',
              'Rate limiter enforces platform limits (LinkedIn: 30/hr, Twitter: 120/hr)',
              'Team feedback is available via social_get_feedback — read it before every writing session',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <IconClock />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h3 className="text-xl font-bold mb-4">Plugin Tools ({tools.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tools.map((t) => (
              <div key={t.name} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900">
                <code className="text-xs text-[#4FC3F7] whitespace-nowrap mt-0.5">{t.name}</code>
                <span className="text-xs text-zinc-400">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h3 className="text-xl font-bold mb-4">Troubleshooting</h3>
          <div className="space-y-3">
            {[
              { problem: 'Posts not appearing in app', fix: 'Check if content writer cron ran. Verify social_queue_post is called. Look at the Posts page.' },
              { problem: 'Personality empty', fix: 'Run the interview: tell your agent "Interview me to build my social personality."' },
              { problem: 'Publish cron says "no post due"', fix: 'Content writer didn\'t queue anything. Check if it ran, or trigger it manually.' },
              { problem: 'Rate limit errors', fix: 'Call social_rate_check before posting. LinkedIn: 30/hr, Twitter: 120/hr.' },
              { problem: 'Browser automation failing', fix: 'Check browser profile exists and agent is logged in. Re-login if sessions expired.' },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-zinc-700 overflow-hidden">
                <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-700 flex items-start gap-2">
                  <IconWarn />
                  <span className="text-white text-sm font-semibold">{item.problem}</span>
                </div>
                <div className="px-4 py-2.5 bg-zinc-950">
                  <p className="text-zinc-400 text-sm">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span>Social Activity Review</span>
          <span>·</span>
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">Plugin</a>
          <span>·</span>
          <a href="https://github.com/novalystrix/social-activity" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">App Source</a>
        </div>
      </footer>
    </div>
  );
}
