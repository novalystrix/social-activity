# Social Activity Review App

Internal tool for Roy and Bridie to review Novalystrix's social media activity, leave feedback, and coach content improvement. NOT a public showcase — it's a content review workflow.

## Stack
- Next.js 14+ (App Router)
- Tailwind CSS (dark theme, crystal blue accent #4FC3F7)
- SQLite via better-sqlite3
- Deploy-ready for Render.com
- Simple password auth (env var APP_PASSWORD, default "nova2026")

## Pages

### 1. Dashboard (/)
- Summary cards: total posts, comments left, connections made, week activity
- Recent activity timeline (last 15 actions across platforms)
- Next scheduled posts from content queue
- Unread/pending feedback count
- Split stats by platform (Twitter / LinkedIn)

### 2. Posts Feed (/posts)
- Every post published (LinkedIn + Twitter), full text, timestamp, platform
- Engagement metrics per post (likes, comments, reposts)
- Filter by: platform, date range, post type
- Each post has a comment/feedback thread — Roy/Bridie can leave feedback on specific posts
- Status tags: published, draft, approved, needs-revision, rejected
- Post types: original, reaction, philosophy, story, advancement

### 3. Content Queue (/queue)
- Drafted posts awaiting review
- Each draft shows: platform, post type, scheduled time, full text
- Actions: Approve, Request Changes, Reject
- Inline editing — reviewer can modify draft text
- Shows which cron will publish it and when

### 4. Engagement Log (/engagement)
- Comments I left on others posts
- Connection requests sent (with note text)
- Replies I made to responses
- Filter by platform, date, engagement type

### 5. Knowledge Corpus (/corpus)
- CRITICAL — full view of ALL files I base my content on
- Renders each corpus markdown file in a readable view
- Files to load from disk on startup (seed script):
  - ~/nova-social/corpus/qa-session-2026-03-04.md — Q&A with Roy
  - ~/nova-social/corpus/agent-philosophy.md — Core beliefs
  - ~/nova-social/corpus/work-stories.md — Real experiences
  - ~/nova-social/corpus/deflection-playbook.md — Probe handling
  - ~/nova-social/corpus/ai-news.md — Daily news tracker
- Each file is viewable AND editable in the app
- Edits save back to SQLite
- Show last-modified date for each file
- Search across all corpus content

### 6. Strategy & Config (/strategy)
- Renders these strategy/config files:
  - ~/.openclaw/skills/social-presence/SKILL.md
  - ~/.openclaw/skills/social-presence/references/linkedin/content-strategy.md
  - ~/.openclaw/skills/social-presence/references/linkedin/opinion-leaders.md
  - ~/.openclaw/skills/social-presence/references/twitter/content-strategy.md
  - ~/.openclaw/skills/social-presence/references/twitter/accounts.md
- All viewable and editable
- Cron schedule table showing what runs when

### 7. Feedback Hub (/feedback)
- All feedback across posts and drafts in one view
- Filter by author, status (pending/addressed)
- Nova responses to feedback
- General feedback form (not tied to a specific post)

## API Routes

GET    /api/posts — list posts (query: platform, status, type, limit, offset)
POST   /api/posts — create/import post
PUT    /api/posts/:id — update post (status, text, metrics)
DELETE /api/posts/:id — delete post

GET    /api/engagements — list engagements
POST   /api/engagements — log engagement

GET    /api/feedback — list feedback (query: post_id, author, status)
POST   /api/feedback — add feedback
PUT    /api/feedback/:id — update feedback

GET    /api/corpus — list corpus files
GET    /api/corpus/:id — get single corpus file
PUT    /api/corpus/:id — edit corpus file

GET    /api/strategy — list strategy files
GET    /api/strategy/:id — get single strategy file
PUT    /api/strategy/:id — edit strategy file

GET    /api/stats — dashboard summary
POST   /api/auth — login (body: { password }) sets cookie

## Database Schema

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter')),
  post_type TEXT NOT NULL CHECK (post_type IN ('original', 'reaction', 'philosophy', 'story', 'advancement')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'needs-revision', 'rejected')),
  text TEXT NOT NULL,
  url TEXT,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reposts INTEGER DEFAULT 0,
  scheduled_for TEXT,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE engagements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter')),
  engagement_type TEXT NOT NULL CHECK (engagement_type IN ('comment', 'connection', 'reply', 'follow', 'like')),
  target_author TEXT,
  target_post_snippet TEXT,
  target_url TEXT,
  my_text TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'addressed')),
  nova_response TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE corpus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_path TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE strategy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_path TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

## Seed Data

On first run or via npm run seed, read these files from disk and import:

Corpus files:
- /Users/clawclaw/.openclaw/workspace/nova-social/corpus/qa-session-2026-03-04.md title: "Q&A Session — Agent Philosophy"
- /Users/clawclaw/.openclaw/workspace/nova-social/corpus/agent-philosophy.md title: "Agent Philosophy — Core Beliefs"
- /Users/clawclaw/.openclaw/workspace/nova-social/corpus/work-stories.md title: "Work Stories — Real Experiences"
- /Users/clawclaw/.openclaw/workspace/nova-social/corpus/deflection-playbook.md title: "Deflection Playbook"
- /Users/clawclaw/.openclaw/workspace/nova-social/corpus/ai-news.md title: "AI News Tracker"

Strategy files:
- /Users/clawclaw/.openclaw/skills/social-presence/SKILL.md title: "Social Presence Skill (Main)"
- /Users/clawclaw/.openclaw/skills/social-presence/references/linkedin/content-strategy.md title: "LinkedIn Content Strategy"
- /Users/clawclaw/.openclaw/skills/social-presence/references/linkedin/opinion-leaders.md title: "LinkedIn Opinion Leaders"
- /Users/clawclaw/.openclaw/skills/social-presence/references/twitter/content-strategy.md title: "Twitter Content Strategy"
- /Users/clawclaw/.openclaw/skills/social-presence/references/twitter/accounts.md title: "Twitter Priority Accounts"

Add 2-3 sample draft posts so UI isnt empty.

## Design
- Dark theme (#0a0a0a background, #1a1a2e cards, #4FC3F7 crystal blue accent)
- Clean, modern, minimal
- Sidebar navigation with icons
- Mobile responsive
- Markdown rendering for corpus/strategy (use react-markdown)
- Monospace code blocks

## Deployment
- Include render.yaml
- Build: npm run build
- Start: npm start
- SQLite db in ./data/social.db
- Env vars: APP_PASSWORD, NODE_ENV

## Important
- Must work standalone — no external DB or services
- Seed script reads local files — handle gracefully if missing
- All API routes check auth cookie except POST /api/auth
- Proper error handling — never crash on missing data
- Corpus/strategy editors: textarea with markdown preview toggle
