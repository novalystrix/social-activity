import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

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
    {
      problem: 'Posts not appearing in app',
      fix: 'Check if content writer cron is running (cron list). Verify social_queue_post is being called. Check the app\'s Posts page — if nothing there, the writer cron didn\'t run.',
    },
    {
      problem: 'Scans failing / not writing files',
      fix: 'Scan crons must write to ~/openclaw-social/data/ (plugin dir), NOT workspace files. Check file permissions. Verify the cron\'s write path matches where the content writer reads from.',
    },
    {
      problem: 'Personality empty',
      fix: 'Run the personality interview: tell your agent "Interview me to build my social personality." Go to app → Personality → fill all 9 sections.',
    },
    {
      problem: 'Rate limit errors',
      fix: 'Call social_rate_check before posting. LinkedIn: 30 actions/hr. Twitter: 120 actions/hr. Wait until next hour if limit hit.',
    },
    {
      problem: 'Browser automation failing',
      fix: 'Check if browser profile "openclaw" exists. Verify the agent is logged into Twitter/LinkedIn in that profile. Re-login manually if sessions expired.',
    },
    {
      problem: 'Publish cron says "no post due"',
      fix: 'Content writer didn\'t queue anything. Check if writer cron ran at 7 AM. Check social_publish_next manually. If queue is empty, trigger the content writer manually.',
    },
    {
      problem: 'Engagement not logged',
      fix: 'After EVERY comment/reply, call social_log_engagement. Check the app\'s Engagements page to verify. This is required — don\'t skip it.',
    },
  ];

  const whyItems = [
    {
      title: 'Personality lives in the web app, not in files',
      reason: 'Humans need to edit it through a UI, not YAML. It needs to be shared across sessions and accessible for team review. A database is the right home for something that evolves with coaching.',
    },
    {
      title: 'Scan results live in plugin data files, not the web app',
      reason: 'They\'re ephemeral — today\'s AI news, today\'s LinkedIn feed. They change daily and only the agent needs them. No reason to round-trip through Postgres for temporary working files.',
    },
    {
      title: 'Write-then-publish pattern',
      reason: 'The main agent has context (conversations, real experiences) but may not be available exactly at posting time. So it writes when it can, and a lightweight cron publishes on schedule. Decouples creativity from timing.',
    },
    {
      title: 'Rate limiting is local (SQLite)',
      reason: 'It needs to be fast and per-agent. If the web app is down, the agent should still respect rate limits. A local SQLite DB is the right call — no network dependency for a guard that must always work.',
    },
    {
      title: 'Everything is logged to the web app',
      reason: 'Posts, engagements, feedback — all of it. This is the human oversight layer. The owner should be able to see everything the agent did without asking. Logging is not optional.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-lg font-bold">Social <span className="text-[#4FC3F7]">Activity</span></div>
        <div className="flex items-center gap-4">
          <a href="#bigpicture" className="text-sm text-zinc-400 hover:text-zinc-200">Overview</a>
          <a href="#architecture" className="text-sm text-zinc-400 hover:text-zinc-200">Architecture</a>
          <a href="#plugin" className="text-sm text-zinc-400 hover:text-zinc-200">Setup</a>
          <a href="#crons" className="text-sm text-zinc-400 hover:text-zinc-200">Crons</a>
          <a href="#debug" className="text-sm text-zinc-400 hover:text-zinc-200">Debug</a>
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-zinc-200">GitHub</a>
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
          <a href="#plugin" className="px-8 py-4 border border-zinc-700 text-zinc-200 font-semibold rounded-lg text-lg">Install Plugin</a>
        </div>
      </section>

      {/* Quick steps */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="text-3xl mb-3">🔌</div>
          <h3 className="text-lg font-semibold mb-2">1. Install Plugin</h3>
          <p className="text-zinc-400 text-sm">Clone the OpenClaw plugin, run setup.sh, set 3 env vars.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold mb-2">2. Define Personality</h3>
          <p className="text-zinc-400 text-sm">Set voice, tone, dos/don&apos;ts, examples. Bot reads before every post.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="text-3xl mb-3">⏰</div>
          <h3 className="text-lg font-semibold mb-2">3. Set Up Crons</h3>
          <p className="text-zinc-400 text-sm">Schedule daily scans, content writing, and publishing. Runs autonomously.</p>
        </div>
      </section>

      {/* THE BIG PICTURE */}
      <section id="bigpicture" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            <h2 className="text-2xl font-bold">The Big Picture</h2>
          </div>
          <p className="text-zinc-300 text-base leading-relaxed">
            This system gives any AI agent a complete social media presence. Not just posting — a full loop of <strong className="text-[#4FC3F7]">learning, writing, publishing, tracking, and improving</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[#4FC3F7] font-semibold mb-2">📰 Daily Learning</div>
              <p className="text-zinc-400 text-sm">Scan crons run before dawn — pulling AI news, LinkedIn feed, Twitter feed. Results land in the plugin&apos;s data/ files, ready for the content writer.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[#4FC3F7] font-semibold mb-2">✍️ Informed Writing</div>
              <p className="text-zinc-400 text-sm">At 7 AM, the content writer reads what was scanned, checks personality and strategy, and queues 6 posts — 3 per platform — for the day ahead.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[#4FC3F7] font-semibold mb-2">📅 Scheduled Publishing</div>
              <p className="text-zinc-400 text-sm">Lightweight publish crons fire throughout the day. They pick up the next queued post, send it via browser automation, and log everything back to this app.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[#4FC3F7] font-semibold mb-2">🧑‍🏫 Human Coaching</div>
              <p className="text-zinc-400 text-sm">This web app is the human review layer. Owners see what the agent posted, give feedback, define personality, and steer strategy. The agent reads this before every session.</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-zinc-900 border-l-4 border-[#4FC3F7]">
            <p className="text-zinc-300 text-sm"><strong className="text-white">The key insight:</strong> The main agent writes posts with full context (recent conversations, real experiences, what it&apos;s learned). A lightweight cron publishes on schedule. This decouples creativity from timing — the agent doesn&apos;t need to be &quot;awake&quot; at exactly 12 PM ET to post.</p>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏗️</span>
            <h2 className="text-2xl font-bold">Architecture</h2>
          </div>
          <p className="text-zinc-400 text-sm">Three pieces. Each has a clear job. Without all three, the system doesn&apos;t work.</p>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-[#4FC3F7]/30 bg-zinc-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <h3 className="text-[#4FC3F7] font-semibold text-lg">1. Social Activity Web App (this app)</h3>
                  <p className="text-zinc-400 text-sm mt-1">Human review dashboard. The source of truth for <em>who the agent is</em>.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Personality & voice', 'Post history', 'Feedback & coaching', 'Strategy docs', 'Knowledge corpus', 'Engagement logs', 'Analytics'].map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-[#4FC3F7]/10 text-[#4FC3F7] text-xs border border-[#4FC3F7]/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-purple-500/30 bg-zinc-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔌</span>
                <div>
                  <h3 className="text-purple-400 font-semibold text-lg">2. openclaw-social Plugin</h3>
                  <p className="text-zinc-400 text-sm mt-1">Installed on the agent. Provides the tools that call this app&apos;s API. Also manages local state.</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-xs text-zinc-400">
                      <span className="text-purple-400 font-medium">Tools:</span> social_get_personality, social_log_post, social_queue_post, social_publish_next, social_rate_check, + 9 more
                    </div>
                    <div className="text-xs text-zinc-400">
                      <span className="text-purple-400 font-medium">Local data:</span> data/ scan results, SQLite rate limiter DB
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-amber-500/30 bg-zinc-900">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h3 className="text-amber-400 font-semibold text-lg">3. Cron Jobs</h3>
                  <p className="text-zinc-400 text-sm mt-1">The engine. Without crons, nothing happens automatically. Each cron has a specific job and set of tools it calls.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['AI News Scan', 'LinkedIn Scan', 'Twitter Scan', 'Content Writer', 'LinkedIn Publish ×3', 'Twitter Publish ×3', 'Weekly Review', 'Engage (optional)'].map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
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
                { label: 'Log to API', color: 'bg-[#4FC3F7]/20 text-[#4FC3F7]' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Humans review', color: 'bg-pink-500/20 text-pink-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Feedback to agent', color: 'bg-purple-500/20 text-purple-300' },
              ].map((item, i) => (
                <span key={i} className={`px-2 py-1 rounded ${item.color}`}>{item.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLUGIN INSTALLATION */}
      <section id="plugin" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <h2 className="text-2xl font-bold">🔌 Plugin Installation</h2>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 1: Clone and build</h3>
            <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto"><code>{`git clone https://github.com/novalystrix/openclaw-social.git ~/openclaw-social\ncd ~/openclaw-social && npm install && npx tsc\nbash ~/openclaw-social/scripts/setup.sh`}</code></pre>
            <p className="text-zinc-500 text-xs mt-2">The setup script creates the data/ directory structure. Safe to re-run — won&apos;t overwrite existing files.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 2: Create an account</h3>
            <p className="text-zinc-400 text-sm">Sign in → create account → Settings → API Keys → create key. Note your Account ID.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 3: Environment variables</h3>
            <p className="text-zinc-400 text-sm mb-2">Add to <code className="text-[#4FC3F7]">~/.openclaw/.env</code>:</p>
            <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto"><code>{`SOCIAL_APP_URL=https://social-activity-b2xc.onrender.com\nSOCIAL_APP_KEY=sa_your_api_key_here\nSOCIAL_ACCOUNT_ID=acc-your-account-id`}</code></pre>
            <p className="text-zinc-500 text-xs mt-2">Optional: TAVILY_API_KEY (tweet watcher), MONDAY_API_TOKEN (influencer board sync)</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 4: OpenClaw config</h3>
            <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto"><code>{`// In ~/.openclaw/openclaw.json:\n{\n  "plugins": {\n    "allow": ["openclaw-social"],\n    "load": { "paths": ["/path/to/openclaw-social"] },\n    "entries": {\n      "openclaw-social": {\n        "enabled": true,\n        "config": {\n          "appUrl": "https://social-activity-b2xc.onrender.com",\n          "accountId": "acc-your-account-id"\n        }\n      }\n    }\n  }\n}`}</code></pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 5: Restart & test</h3>
            <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto"><code>{`openclaw gateway restart`}</code></pre>
            <p className="text-zinc-400 text-sm mt-3 mb-2">Then ask your agent:</p>
            <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto"><code>{`# Test 1: Personality (should return sections)\n> Call social_get_personality\n\n# Test 2: Rate limits\n> Call social_rate_check with platform="twitter"\n\n# Test 3: Log a test post\n> Call social_log_post platform="twitter" type="post" content="Test"\n\n# Test 4: Verify in app\n> Call social_get_posts platform="twitter"`}</code></pre>
            <p className="text-zinc-500 text-xs mt-2">If personality returns empty → fill in the Personality section in the app first.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 6: Fill in Personality (Interview Technique)</h3>
            <p className="text-zinc-400 text-sm mb-3">Don&apos;t just fill in the personality fields manually — <strong>have your bot interview the account owner</strong>. This produces much richer, more authentic voice guidelines.</p>
            <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
              <p className="text-sm text-zinc-300 font-semibold">How to run the interview:</p>
              <p className="text-xs text-zinc-400">Tell your bot: &quot;Interview me to build my social personality.&quot; The bot should ask questions one at a time, like:</p>
              <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
                <li><strong>What makes a good post?</strong> — What makes you stop scrolling? What makes you cringe?</li>
                <li><strong>What tone do you NOT want?</strong> — Give examples of bad voice.</li>
                <li><strong>What does success look like?</strong> — Follower count? DMs? Speaking invites? Something else?</li>
                <li><strong>What topics should the bot own?</strong> — 2-3 things people associate with your brand.</li>
                <li><strong>How real should it get?</strong> — Can it share disagreements, mistakes, real working dynamics?</li>
                <li><strong>Controversial topics?</strong> — Which ones to engage with, which to avoid?</li>
                <li><strong>How to handle pushback?</strong> — Fold or hold? When to admit being wrong?</li>
                <li><strong>Compliments and attention?</strong> — Humble? Own it? Deflect?</li>
                <li><strong>Red lines?</strong> — What should NEVER be said or done?</li>
                <li><strong>Style inspiration?</strong> — Any creator whose tone you admire?</li>
              </ol>
              <p className="text-xs text-zinc-500 mt-2">After the interview, the bot saves all answers to the Personality sections in the app. The key quotes from the owner become the &quot;Notes&quot; section — raw, unfiltered guidance the bot references every time it writes.</p>
              <p className="text-xs text-zinc-500">💡 <strong>Tip:</strong> Run the interview again every few weeks as the voice evolves. The personality is a living document.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 7: Set up crons</h3>
            <p className="text-zinc-400 text-sm">See the <a href="#crons" className="text-[#4FC3F7] hover:underline">recommended cron schedule</a> below. Each cron tells the agent what to do and which plugin tools to call.</p>
          </div>
        </div>
      </section>

      {/* WHAT SHOULD BE WORKING */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">✅</span>
            <h2 className="text-2xl font-bold">What Should Be Working When You&apos;re Done</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-5">After full setup, all of these should be true. Work through them top to bottom — each one depends on the previous.</p>
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="mt-0.5 w-5 h-5 rounded border-2 border-zinc-600 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-zinc-600">○</span>
                </div>
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-xs mt-4">💡 Work through this list in order — each item builds on the one before it. If item 3 is broken, don&apos;t debug item 5 yet.</p>
        </div>
      </section>

      {/* CRON SCHEDULE */}
      <section id="crons" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h2 className="text-2xl font-bold mb-4">⏰ Recommended Cron Schedule</h2>
          <p className="text-zinc-400 text-sm mb-3">Times are shown in <strong>US Eastern (ET)</strong>. Set <code className="text-[#4FC3F7]">tz: &quot;America/New_York&quot;</code> in OpenClaw crons and use these times directly.</p>

          <div className="bg-zinc-900 rounded-lg p-4 mb-5">
            <p className="text-xs text-zinc-300 font-semibold mb-2">🌍 Timezone Setup</p>
            <p className="text-xs text-zinc-400 mb-2">All crons target <strong>US business hours</strong> for maximum engagement. Set the tz field directly:</p>
            <pre className="text-xs text-zinc-500 overflow-x-auto"><code>{`# OpenClaw cron with timezone:\n# cron: "0 7 * * *" with tz: "America/New_York"\n# This runs at 7 AM ET regardless of where the agent is running`}</code></pre>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-800">
                  <th className="py-2 pr-2">Time (ET)</th>
                  <th className="py-2 pr-4">Job</th>
                  <th className="py-2 pr-2">Type</th>
                  <th className="py-2 pr-2">Writes To</th>
                  <th className="py-2">Tools Used</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">1:30 AM</td>
                  <td className="py-3 pr-4">AI News Scan</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">data/trending-posts.md</td>
                  <td className="py-3 text-zinc-400 text-xs">social_get_corpus, web_search</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">7:00 AM</td>
                  <td className="py-3 pr-4 font-semibold text-white">Content Writer</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Post queue (API)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_get_personality, social_get_strategy, social_queue_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">8:00 AM</td>
                  <td className="py-3 pr-4">LinkedIn Scan</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">data/linkedin/trending-posts.md</td>
                  <td className="py-3 text-zinc-400 text-xs">social_get_strategy, browser</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">9:00 AM</td>
                  <td className="py-3 pr-4">Twitter Scan</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">data/twitter/today-feed.md</td>
                  <td className="py-3 text-zinc-400 text-xs">social_watch_status, browser</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">9:00 AM</td>
                  <td className="py-3 pr-4">LinkedIn Post 1</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Social Activity (log)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_publish_next, social_log_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">12:00 PM</td>
                  <td className="py-3 pr-4">Twitter Post 1</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Social Activity (log)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_publish_next, social_log_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">1:00 PM</td>
                  <td className="py-3 pr-4">LinkedIn Post 2</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Social Activity (log)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_publish_next, social_log_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">3:00 PM</td>
                  <td className="py-3 pr-4">Twitter Post 2</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Social Activity (log)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_publish_next, social_log_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">4:00 PM</td>
                  <td className="py-3 pr-4">LinkedIn Post 3</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Social Activity (log)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_publish_next, social_log_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">6:00 PM</td>
                  <td className="py-3 pr-4">Twitter Post 3</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Social Activity (log)</td>
                  <td className="py-3 text-zinc-400 text-xs">social_publish_next, social_log_post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Optional</td>
                  <td className="py-3 pr-4 text-zinc-500">LinkedIn Engage</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-xs">optional</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-600">—</td>
                  <td className="py-3 text-zinc-500 text-xs">social_rate_check, social_log_engagement</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">Optional</td>
                  <td className="py-3 pr-4 text-zinc-500">Twitter Engage</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-xs">optional</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-600">—</td>
                  <td className="py-3 text-zinc-500 text-xs">social_rate_check, social_log_engagement</td>
                </tr>
                <tr>
                  <td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">Sun 10 AM</td>
                  <td className="py-3 pr-4">Weekly Review</td>
                  <td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td>
                  <td className="py-3 pr-2 font-mono text-xs text-zinc-500">data/weekly-reviews.md</td>
                  <td className="py-3 text-zinc-400 text-xs">social_get_posts, social_get_feedback</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-zinc-500">
            <div><span className="text-emerald-400">main</span> = main agent session</div>
            <div><span className="text-purple-400">isolated</span> = spawns its own session, doesn&apos;t interrupt main</div>
            <div><span className="text-zinc-400">optional</span> = enable if you want commenting behavior</div>
          </div>
        </div>
      </section>

      {/* HOW TO DEBUG */}
      <section id="debug" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔍</span>
            <h2 className="text-2xl font-bold">How to Debug</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-6">Something broken? Start here. Most issues fall into one of these patterns.</p>
          <div className="space-y-4">
            {debugItems.map((item, i) => (
              <div key={i} className="rounded-lg border border-zinc-700 overflow-hidden">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-700 flex items-start gap-2">
                  <span className="text-red-400 text-sm mt-0.5">⚠</span>
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

      {/* WHY WE BUILT IT THIS WAY */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💡</span>
            <h2 className="text-2xl font-bold">Why We Built It This Way</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-6">Every design decision was intentional. Understanding the reasoning will help you fix things when they break — and avoid undoing decisions that look arbitrary but aren&apos;t.</p>
          <div className="space-y-4">
            {whyItems.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h3 className="text-[#4FC3F7] font-semibold text-sm mb-2">✦ {item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API */}
      <section id="api" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h2 className="text-2xl font-bold mb-4">📡 Bot API</h2>
          <p className="text-zinc-400 text-sm mb-4">Header: <code className="text-[#4FC3F7]">Authorization: Bearer sa_...</code> · Base: <code className="text-[#4FC3F7]">/api/bot/:accountId</code></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-zinc-500 border-b border-zinc-800"><th className="py-2 pr-4">Method</th><th className="py-2 pr-4">Endpoint</th><th className="py-2">Description</th></tr></thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/personality</td><td className="py-2">Personality sections</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/posts</td><td className="py-2">List posts</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-amber-400">POST</code></td><td className="py-2 pr-4 font-mono text-xs">/posts</td><td className="py-2">Log a post</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-amber-400">POST</code></td><td className="py-2 pr-4 font-mono text-xs">/posts/queue</td><td className="py-2">Queue a post for future publish</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/posts/next</td><td className="py-2">Get next scheduled post due</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/engagements</td><td className="py-2">List engagements</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-amber-400">POST</code></td><td className="py-2 pr-4 font-mono text-xs">/engagements</td><td className="py-2">Log engagement</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/corpus</td><td className="py-2">Knowledge corpus</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/strategy</td><td className="py-2">Strategy docs</td></tr>
                <tr><td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td><td className="py-2 pr-4 font-mono text-xs">/feedback</td><td className="py-2">Team feedback</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PLUGIN TOOLS */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h2 className="text-2xl font-bold mb-4">🛠 Plugin Tools ({tools.length})</h2>
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
          <span>·</span>
          <span>Built for AI agents and their humans 💠</span>
        </div>
      </footer>
    </div>
  );
}
