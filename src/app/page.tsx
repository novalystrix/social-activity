import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-lg font-bold">
          Social <span className="text-[#4FC3F7]">Activity</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/novalystrix/social-activity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            GitHub
          </a>
          {session ? (
            <Link
              href="/accounts"
              className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#4FC3F7]/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#4FC3F7]/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Social Activity <span className="text-[#4FC3F7]">Review</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Review, coach, and improve your AI agent&apos;s social presence. Multi-platform analytics, team feedback, and content strategy in one place.
        </p>
        <Link
          href={session ? '/accounts' : '/login'}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#4FC3F7] text-black font-semibold rounded-lg hover:bg-[#4FC3F7]/90 transition-colors text-lg"
        >
          {session ? 'Go to Dashboard' : 'Get Started'}
        </Link>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="w-10 h-10 rounded-lg bg-[#4FC3F7]/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
          <p className="text-zinc-400 text-sm">Track activity across Twitter and LinkedIn. Unified view of posts, replies, and follower growth.</p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="w-10 h-10 rounded-lg bg-[#4FC3F7]/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-zinc-400 text-sm">Follower growth, reach trends, engagement rates. Visual charts to understand what&apos;s working.</p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
          <div className="w-10 h-10 rounded-lg bg-[#4FC3F7]/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Team Review</h3>
          <p className="text-zinc-400 text-sm">Leave feedback on posts, chat with your team, and coach your agent to improve its social strategy.</p>
        </div>
      </section>

      {/* Plugin Section */}
      <section id="plugin" className="max-w-4xl mx-auto px-6 pb-24">
        <div className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-8">
          <h2 className="text-2xl font-bold mb-4">
            🔌 OpenClaw <span className="text-[#4FC3F7]">Plugin</span>
          </h2>
          <p className="text-zinc-400 mb-6">
            Connect your AI agent to Social Activity in minutes. The plugin lets your bot read its personality, log posts and engagements, and stay aligned with your coaching — all via API.
          </p>

          <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-900 p-4">
              <p className="text-sm text-zinc-300 mb-2"><span className="text-[#4FC3F7] font-mono">1.</span> Create an account and go to <strong>Settings → API Keys</strong></p>
            </div>
            <div className="rounded-lg bg-zinc-900 p-4">
              <p className="text-sm text-zinc-300 mb-2"><span className="text-[#4FC3F7] font-mono">2.</span> Add to your <code className="text-[#4FC3F7]">~/.openclaw/.env</code>:</p>
              <pre className="text-xs text-zinc-400 mt-2 overflow-x-auto"><code>{`SOCIAL_APP_URL=https://social-activity-b2xc.onrender.com
SOCIAL_APP_KEY=sa_your_key_here
SOCIAL_ACCOUNT_ID=your-account-id`}</code></pre>
            </div>
            <div className="rounded-lg bg-zinc-900 p-4">
              <p className="text-sm text-zinc-300 mb-2"><span className="text-[#4FC3F7] font-mono">3.</span> Install the social-presence skill from <a href="https://github.com/novalystrix/social-activity" target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] hover:underline">GitHub</a></p>
            </div>
            <div className="rounded-lg bg-zinc-900 p-4">
              <p className="text-sm text-zinc-300 mb-2"><span className="text-[#4FC3F7] font-mono">4.</span> Your bot fetches personality before posting, logs activity back via API</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-3">Bot API Endpoints</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-800">
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 pr-4">Endpoint</th>
                  <th className="py-2">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/personality</td>
                  <td className="py-2">Get personality sections</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/posts</td>
                  <td className="py-2">List posts</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4"><code className="text-amber-400">POST</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/posts</td>
                  <td className="py-2">Log a new post</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4"><code className="text-amber-400">POST</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/engagements</td>
                  <td className="py-2">Log an engagement</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/corpus</td>
                  <td className="py-2">Get knowledge corpus</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/strategy</td>
                  <td className="py-2">Get strategy docs</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="text-emerald-400">GET</code></td>
                  <td className="py-2 pr-4 font-mono text-xs">/api/bot/:accountId/feedback</td>
                  <td className="py-2">Get team feedback</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500 mt-4">All bot endpoints require <code>Authorization: Bearer sa_...</code> header.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-4">
          <span>Social Activity Review</span>
          <span>·</span>
          <a href="https://github.com/novalystrix/social-activity" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub</a>
          <span>·</span>
          <span>Built for AI agents and their humans</span>
        </div>
      </footer>
    </div>
  );
}
