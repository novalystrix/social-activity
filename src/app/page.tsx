import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

/* Inline SVG icon components */
function IconPlug() { return <svg className="w-7 h-7 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m-6-9H3m18 0h-3M5.636 5.636l2.122 2.122m8.484 8.484l2.122 2.122m0-12.728l-2.122 2.122m-8.484 8.484l-2.122 2.122"/></svg>; }
function IconPalette() { return <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072"/></svg>; }
function IconClock() { return <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>; }
function IconGlobe() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-4.247m0 0A8.966 8.966 0 013 12c0-1.777.515-3.433 1.4-4.83"/></svg>; }
function IconBuild() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0l2.83 2.83 6.36-6.36a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-7.95 7.95a1.5 1.5 0 01-2.12 0z"/></svg>; }
function IconNews() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"/></svg>; }
function IconPen() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>; }
function IconCalendar() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>; }
function IconUsers() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>; }
function IconWarn() { return <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>; }
function IconCheck() { return <svg className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9"/></svg>; }
function IconStar() { return <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>; }
function IconSearch() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>; }
function IconGithub() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>; }

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const tools = [
    { name: 'social_get_personality', desc: 'Fetch voice/tone rules from the app' },
    { name: 'social_get_posts', desc: 'List recent posts' },
    { name: 'social_get_feedback', desc: 'Get team coaching feedback' },
    { name: 'social_get_corpus', desc: 'Get knowledge corpus' },
    { name: 'social_get_strategy', desc: 'Get content strategy docs' },
    { name: 'social_log_post', desc: 'Log a published post' },
    { name: 'social_log_engagement', desc: 'Log a reply/comment/like' },
    { name: 'social_queue_post', desc: 'Queue a post for future publishing' },
    { name: 'social_publish_next', desc: 'Get next due post (for publish crons)' },
    { name: 'social_upsert_influencer', desc: 'Add/update influencer target' },
    { name: 'social_watch_status', desc: 'Twitter watcher status + new tweets' },
    { name: 'social_rate_check', desc: 'Check hourly action limits' },
    { name: 'social_advance_phase', desc: 'Move influencer to next phase' },
    { name: 'social_monday_sync', desc: 'Sync influencers from Monday.com' },
  ];

  const checklist = [
    'Agent can call social_get_personality and get back personality sections',
    'Agent can call social_log_post and see it appear in the app',
    'AI News scan cron runs daily and writes to plugin\'s data/trending-posts.md',
    'LinkedIn/Twitter scan crons write to data/{platform}/ files',
    'Content writer cron reads scan results and queues 6 posts per day (3 per platform)',
    'Publish crons fire 3x/day per platform and actually post to social media',
    'Posts appear in the app\'s Posts section with live URLs',
    'Rate limiter prevents exceeding platform limits (LinkedIn: 30/hr, Twitter: 120/hr)',
    'Personality interview has been completed (9 sections filled)',
    'Team can give feedback on posts in the app',
  ];

  const debugItems = [
    { problem: 'Posts not appearing in app', fix: 'Check if content writer cron is running (cron list). Verify social_queue_post is being called. Check the app\'s Posts page.' },
    { problem: 'Scans failing / not writing files', fix: 'Scan crons must write to ~/openclaw-social/data/ (plugin dir), NOT workspace files. Check file permissions.' },
    { problem: 'Personality empty', fix: 'Run the personality interview: tell your agent "Interview me to build my social personality." Fill all 9 sections.' },
    { problem: 'Rate limit errors', fix: 'Call social_rate_check before posting. LinkedIn: 30 actions/hr. Twitter: 120 actions/hr.' },
    { problem: 'Browser automation failing', fix: 'Check if browser profile "openclaw" exists. Verify agent is logged into Twitter/LinkedIn. Re-login if sessions expired.' },
    { problem: 'Publish cron says "no post due"', fix: 'Content writer didn\'t queue anything. Check if writer cron ran at 7 AM. Trigger manually if needed.' },
    { problem: 'Engagement not logged', fix: 'After EVERY comment/reply, call social_log_engagement. Check the Engagements page to verify.' },
  ];

  const whyItems = [
    { title: 'Personality lives in the web app, not in files', reason: 'Humans need to edit it through a UI, not YAML. It needs to be shared across sessions and accessible for team review.' },
    { title: 'Scan results live in plugin data files, not the web app', reason: 'They\'re ephemeral — today\'s feed. They change daily and only the agent needs them. No reason to round-trip through Postgres.' },
    { title: 'Write-then-publish pattern', reason: 'The main agent has context but may not be available at posting time. It writes when it can, a lightweight cron publishes on schedule.' },
    { title: 'Rate limiting is local (SQLite)', reason: 'It needs to be fast and per-agent. If the web app is down, the agent should still respect rate limits.' },
    { title: 'Everything is logged to the web app', reason: 'Posts, engagements, feedback — all of it. The owner should be able to see everything without asking.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      {/* Nav — clean, minimal */}
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
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">Give your AI agent a complete social media presence. Personality coaching, content strategy, daily posting, engagement tracking, and team review — fully automated.</p>
        <div className="flex gap-4 justify-center">
          <Link href={session ? '/accounts' : '/login'} className="px-8 py-4 bg-[#4FC3F7] text-black font-semibold rounded-lg text-lg">{session ? 'Dashboard' : 'Get Started'}</Link>
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-zinc-700 text-zinc-200 font-semibold rounded-lg text-lg">Install Plugin</a>
        </div>
      </section>

      {/* Quick steps */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="flex justify-center mb-3"><IconPlug /></div>
          <h3 className="text-lg font-semibold mb-2">1. Install Plugin</h3>
          <p className="text-zinc-400 text-sm">Clone the OpenClaw plugin, run setup.sh, set 3 env vars.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="flex justify-center mb-3"><IconPalette /></div>
          <h3 className="text-lg font-semibold mb-2">2. Define Personality</h3>
          <p className="text-zinc-400 text-sm">Set voice, tone, dos/don&apos;ts, examples. Bot reads before every post.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="flex justify-center mb-3"><IconClock /></div>
          <h3 className="text-lg font-semibold mb-2">3. Set Up Crons</h3>
          <p className="text-zinc-400 text-sm">Schedule daily scans, content writing, and publishing. Runs autonomously.</p>
        </div>
      </section>

      {/* THE BIG PICTURE */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <IconGlobe />
            <h2 className="text-2xl font-bold">The Big Picture</h2>
          </div>
          <p className="text-zinc-300 text-base leading-relaxed">
            This system gives any AI agent a complete social media presence. Not just posting — a full loop of <strong className="text-[#4FC3F7]">learning, writing, publishing, tracking, and improving</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconNews /> Daily Learning</div>
              <p className="text-zinc-400 text-sm">Scan crons run before dawn — pulling AI news, LinkedIn feed, Twitter feed. Results land in the plugin&apos;s data/ files.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconPen /> Informed Writing</div>
              <p className="text-zinc-400 text-sm">At 7 AM, the content writer reads what was scanned, checks personality and strategy, and queues 6 posts for the day.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconCalendar /> Scheduled Publishing</div>
              <p className="text-zinc-400 text-sm">Lightweight publish crons fire throughout the day. They pick up the next queued post and log everything back to this app.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold mb-2"><IconUsers /> Human Coaching</div>
              <p className="text-zinc-400 text-sm">This web app is the human review layer. Owners see what the agent posted, give feedback, and steer strategy.</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-zinc-900 border-l-4 border-[#4FC3F7]">
            <p className="text-zinc-300 text-sm"><strong className="text-white">The key insight:</strong> The main agent writes posts with full context. A lightweight cron publishes on schedule. This decouples creativity from timing.</p>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <IconBuild />
            <h2 className="text-2xl font-bold">Architecture</h2>
          </div>
          <p className="text-zinc-400 text-sm">Three pieces. Each has a clear job.</p>
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-[#4FC3F7]/30 bg-zinc-900">
              <h3 className="text-[#4FC3F7] font-semibold text-lg">1. Social Activity Web App (this app)</h3>
              <p className="text-zinc-400 text-sm mt-1">Human review dashboard. The source of truth for <em>who the agent is</em>.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Personality & voice', 'Post history', 'Feedback & coaching', 'Strategy docs', 'Knowledge corpus', 'Engagement logs', 'Analytics'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#4FC3F7]/10 text-[#4FC3F7] text-xs border border-[#4FC3F7]/20">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl border border-purple-500/30 bg-zinc-900">
              <h3 className="text-purple-400 font-semibold text-lg">2. openclaw-social Plugin</h3>
              <p className="text-zinc-400 text-sm mt-1">Installed on the agent. Provides the tools that call this app&apos;s API.</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-400">
                <div><span className="text-purple-400 font-medium">Tools:</span> 14 registered tools for posting, logging, rate limiting</div>
                <div><span className="text-purple-400 font-medium">Local data:</span> data/ scan results, SQLite rate limiter DB</div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-amber-500/30 bg-zinc-900">
              <h3 className="text-amber-400 font-semibold text-lg">3. Cron Jobs</h3>
              <p className="text-zinc-400 text-sm mt-1">The engine. Without crons, nothing happens automatically.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['AI News Scan', 'LinkedIn Scan', 'Twitter Scan', 'Content Writer', 'LinkedIn Publish ×3', 'Twitter Publish ×3', 'Weekly Review'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">{t}</span>
                ))}
              </div>
            </div>
          </div>

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

      {/* CHECKLIST */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h2 className="text-2xl font-bold">What Should Be Working</h2>
          </div>
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <IconCheck />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEBUG */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <IconSearch />
            <h2 className="text-2xl font-bold">How to Debug</h2>
          </div>
          <div className="space-y-4">
            {debugItems.map((item, i) => (
              <div key={i} className="rounded-lg border border-zinc-700 overflow-hidden">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-700 flex items-start gap-2">
                  <IconWarn />
                  <span className="text-white text-sm font-semibold">{item.problem}</span>
                </div>
                <div className="px-4 py-3 bg-zinc-950">
                  <p className="text-zinc-400 text-sm">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <IconStar />
            <h2 className="text-2xl font-bold">Why We Built It This Way</h2>
          </div>
          <div className="space-y-4">
            {whyItems.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h3 className="text-[#4FC3F7] font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0l2.83 2.83 6.36-6.36a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-7.95 7.95a1.5 1.5 0 01-2.12 0z"/></svg>
            <h2 className="text-2xl font-bold">Plugin Tools ({tools.length})</h2>
          </div>
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

      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span>Social Activity Review</span>
          <span>·</span>
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">Plugin</a>
          <span>·</span>
          <a href="https://github.com/novalystrix/social-activity" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">App</a>
        </div>
      </footer>
    </div>
  );
}
