# Task: Complete V2 Multi-Tenant Social Activity App

## Context
This is a Next.js social activity review app being migrated from single-tenant SQLite to multi-tenant Postgres (Prisma). The spec is in CLAUDE-V2.md. Steps 1-6 are done (Prisma schema, auth, middleware, accounts page, app layout with sidebar, platform page skeletons).

## Current State
- Prisma schema is complete and pushed to Render Postgres
- Auth works with Google OAuth + Prisma user model
- /accounts page works (account picker after login)
- /app/[accountId]/ layout with sidebar exists
- Platform page skeletons exist at /app/[accountId]/twitter, /app/[accountId]/linkedin
- Old SQLite-based pages still exist at root level (/posts, /engagement, /queue, /feedback, /corpus, /strategy)
- The old pages use src/lib/db.ts (better-sqlite3) — this needs to be fully replaced
- Deploy is currently broken — FIX THIS FIRST

## What Needs to Be Done

### Phase 1: Fix Build & Deploy
1. Fix whatever is breaking the build (check npm run build output)
2. Make sure the app deploys successfully on Render
3. Remove the old SQLite dependency (better-sqlite3) and db.ts once everything is migrated

### Phase 2: Complete Platform Pages
For both /app/[accountId]/twitter and /app/[accountId]/linkedin:
1. Topline Metrics Bar — Total Followers, Total Posts, Total Replies, New Followers This Week, New Posts This Week, New Replies This Week (with +/- deltas)
2. Posts Tab — all published posts, full text, timestamp, engagement metrics, external link
3. Replies Tab — comments/replies left on others' posts. Who I replied to, snippet, my reply, URL
4. New Follows Tab — people/companies followed. Name, profile URL, follower count, when followed
5. Engaged Tab — people engaged with. Name, what they posted, how I engaged, context

Use Prisma models: Post, Engagement, Follower. Filter by platform.

### Phase 3: Analytics Page
At /app/[accountId]/analytics using Recharts:
1. New Followers per Week — bar chart, last 12 weeks
2. Posts per Week — stacked bar (original vs replies)
3. Engagement breakdown — pie or bar
4. Use MetricsSnapshot model, fall back to Posts/Followers

### Phase 4: Multi-tenant Chat, Corpus, Strategy
Migrate to multi-tenant routes:
- /app/[accountId]/chat — team chat (Prisma ChatMessage)
- /app/[accountId]/corpus — knowledge corpus (Prisma Corpus)
- /app/[accountId]/strategy — strategy files (Prisma Strategy)

### Phase 5: Settings Page
At /app/[accountId]/settings:
- Account name, slug, bot name, bot avatar
- Manage members (list, invite by email, change roles)
- Webhook URL, Danger zone: delete account

### Phase 6: Seed Script
Create prisma/seed.ts:
- Create account "Novalystrix" (slug: novalystrix)
- Add vaselin@gmail.com as owner, novalystrix@gmail.com as admin

### Phase 7: Cleanup
1. Remove old root-level pages (/posts, /engagement, /queue, /feedback, /corpus, /strategy, /admin)
2. Remove src/lib/db.ts (SQLite) and better-sqlite3 from package.json
3. Update public homepage to link to /accounts
4. All API routes under /api/app/[accountId]/ check auth + membership

### Phase 8: Social Personality Section
Add Prisma model:
model Personality {
  id        String   @id @default(cuid())
  account   Account  @relation(fields: [accountId], references: [id])
  accountId String
  section   String
  platform  String   @default("all")
  content   String
  updatedAt DateTime @default(now())
  @@unique([accountId, section, platform])
}

Create /app/[accountId]/personality page with:
- Platform tabs: All Platforms | LinkedIn | Twitter
- Editable cards for each section (Voice & Style, Attitude & Stance, Dos, Donts, Good Examples, Bad Examples, Notes)
- Markdown rendering when not editing, textarea when editing
- Auto-save on blur or Cmd+Enter
- Add Personality link to sidebar

## Design Rules
- Dark theme: bg-[#0a0a0a], cards bg-[#1a1a2e], accent #4FC3F7
- Mobile responsive, empty states, react-markdown for markdown

## API Pattern
All APIs under /api/app/[accountId]/ should verify auth + account membership.

## Environment
- DATABASE_URL="postgresql://social_activity_db_user:y6gO4LzUbcHPvX5n1EWrtfXULGm4USrU@dpg-d6kvb9lm5p6s738a3bs0-a.oregon-postgres.render.com/social_activity_db"
- Google OAuth configured, Render auto-deploy from GitHub main

## Important
- Do NOT install unknown packages
- Test with npm run build before committing
- Small logical commits
- Push via SSH: GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_github -o IdentitiesOnly=yes" git push
- Run npx prisma db push + npx prisma generate after schema changes

When completely finished, run: openclaw system event --text "Done: Social Activity V2 multitenant app complete - all phases built, build passing, pushed to GitHub" --mode now
