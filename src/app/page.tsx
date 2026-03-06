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
    { name: 'social_upsert_influencer', desc: 'Add/update influencer target' },
    { name: 'social_watch_status', desc: 'Twitter watcher status + new tweets' },
    { name: 'social_rate_check', desc: 'Check hourly action limits' },
    { name: 'social_advance_phase', desc: 'Move influencer to next phase' },
    { name: 'social_monday_sync', desc: 'Sync influencers from Monday.com' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-lg font-bold">Social <span className="text-[#4FC3F7]">Activity</span></div>
        <div className="flex items-center gap-4">
          <a href="#plugin" className="text-sm text-zinc-400 hover:text-zinc-200">Plugin Setup</a>
          <a href="#api" className="text-sm text-zinc-400 hover:text-zinc-200">API</a>
          <a href="#crons" className="text-sm text-zinc-400 hover:text-zinc-200">Crons</a>
          <a href="https://github.com/novalystrix/openclaw-social" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-zinc-200">GitHub</a>
          {session ? (
            <Link href="/accounts" className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg">Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg">Sign In</Link>
          )}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Social Activity <span className="text-[#4FC3F7]">Review</span></h1>
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">Give your AI agent a social presence. Personality coaching, content strategy, daily posting, engagement tracking, and team review — all automated via an OpenClaw plugin.</p>
        <div className="flex gap-4 justify-center">
          <Link href={session ? '/accounts' : '/login'} className="px-8 py-4 bg-[#4FC3F7] text-black font-semibold rounded-lg text-lg">{session ? 'Dashboard' : 'Get Started'}</Link>
          <a href="#plugin" className="px-8 py-4 border border-zinc-700 text-zinc-200 font-semibold rounded-lg text-lg">Install Plugin</a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="text-3xl mb-3">🔌</div>
          <h3 className="text-lg font-semibold mb-2">1. Install Plugin</h3>
          <p className="text-zinc-400 text-sm">Clone the OpenClaw plugin, add to config, set 3 env vars.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold mb-2">2. Define Personality</h3>
          <p className="text-zinc-400 text-sm">Set voice, tone, dos/don&apos;ts, examples. Bot reads before every post.</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e] text-center">
          <div className="text-3xl mb-3">⏰</div>
          <h3 className="text-lg font-semibold mb-2">3. Set Up Crons</h3>
          <p className="text-zinc-400 text-sm">Schedule daily scans, posts, and engagement. Runs autonomously.</p>
        </div>
      </section>

      <section id="plugin" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8 space-y-6">
          <h2 className="text-2xl font-bold">🔌 Plugin Installation</h2>

          <div>
            <h3 className="text-lg font-semibold text-[#4FC3F7] mb-2">Step 1: Clone the plugin</h3>
            <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto"><code>{`git clone https://github.com/novalystrix/openclaw-social.git ~/openclaw-social\ncd ~/openclaw-social && npm install && npx tsc`}</code></pre>
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

      <section id="crons" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h2 className="text-2xl font-bold mb-4">⏰ Recommended Cron Schedule</h2>
          <p className="text-zinc-400 text-sm mb-3">Times are shown in <strong>US Eastern (ET)</strong> — the primary target audience timezone. Convert to your bot&apos;s local timezone when setting up crons.</p>
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <p className="text-xs text-zinc-300 font-semibold mb-2">🌍 Timezone Setup</p>
            <p className="text-xs text-zinc-400 mb-2">All crons should target <strong>US business hours</strong> (8 AM–6 PM ET) for maximum engagement. When setting up, convert these ET times to your bot&apos;s local timezone:</p>
            <pre className="text-xs text-zinc-500 overflow-x-auto"><code>{`# Example: Bot in Asia/Jerusalem (ET + 7h)
# "8:30 AM ET" → 15:30 Israel time
# Cron: "30 15 * * *" with tz: "Asia/Jerusalem"

# Example: Bot in Europe/London (ET + 5h)
# "8:30 AM ET" → 13:30 London time
# Cron: "30 13 * * *" with tz: "Europe/London"

# Or just use America/New_York directly:
# Cron: "30 8 * * *" with tz: "America/New_York"`}</code></pre>
            <p className="text-xs text-zinc-500 mt-2">💡 <strong>Tip:</strong> OpenClaw crons support <code>tz</code> — set it to <code>America/New_York</code> and use ET times directly. No conversion needed.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-zinc-500 border-b border-zinc-800"><th className="py-2 pr-2">Time (ET)</th><th className="py-2 pr-2">Why this time</th><th className="py-2 pr-4">Job</th><th className="py-2 pr-2">Type</th><th className="py-2">Tools Used</th></tr></thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">1:30 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">Pre-market research</td><td className="py-3 pr-4">AI News Scan</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td><td className="py-3 text-zinc-400 text-xs">social_get_personality, social_get_corpus, web_search</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">8:00 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">US morning commute</td><td className="py-3 pr-4">LinkedIn Scan</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td><td className="py-3 text-zinc-400 text-xs">social_get_strategy, browser</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">8:30 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">Feed is active</td><td className="py-3 pr-4">LinkedIn Engage</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td><td className="py-3 text-zinc-400 text-xs">social_get_personality, social_rate_check, social_log_engagement</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">9:00 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">Work day starts</td><td className="py-3 pr-4">Twitter Scan</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td><td className="py-3 text-zinc-400 text-xs">social_watch_status, social_get_strategy, browser</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">9:30 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">Twitter morning peak</td><td className="py-3 pr-4">Twitter Engage</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td><td className="py-3 text-zinc-400 text-xs">social_get_personality, social_rate_check, social_log_engagement</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">10:00 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">Peak LinkedIn time</td><td className="py-3 pr-4">LinkedIn Post</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td><td className="py-3 text-zinc-400 text-xs">social_get_personality, social_get_corpus, social_log_post</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">12:00 PM</td><td className="py-3 pr-2 text-xs text-zinc-500">US lunch break</td><td className="py-3 pr-4">Twitter Post 1</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td><td className="py-3 text-zinc-400 text-xs">social_get_personality, social_log_post</td></tr>
                <tr className="border-b border-zinc-800/50"><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">3:00 PM</td><td className="py-3 pr-2 text-xs text-zinc-500">Afternoon scroll</td><td className="py-3 pr-4">Twitter Post 2</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">main</span></td><td className="py-3 text-zinc-400 text-xs">social_get_personality, social_get_posts, social_log_post</td></tr>
                <tr><td className="py-3 pr-2 font-mono text-xs text-[#4FC3F7]">Sun 10 AM</td><td className="py-3 pr-2 text-xs text-zinc-500">Weekly planning</td><td className="py-3 pr-4">Weekly Review</td><td className="py-3 pr-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs">isolated</span></td><td className="py-3 text-zinc-400 text-xs">social_get_posts, social_get_feedback, browser analytics</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-zinc-500 text-xs mt-4"><strong>Tue/Thu/Sat only</strong> for LinkedIn posts. Twitter posts daily. All times target US Eastern for maximum engagement with English-speaking tech audience.</p>
        </div>
      </section>

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

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h2 className="text-2xl font-bold mb-4">🛠 Plugin Tools (12)</h2>
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
