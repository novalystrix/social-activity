# Social Activity Review App — V2 Rewrite

## What Changed
V1 was single-tenant SQLite. V2 is **multi-tenant Postgres** with proper auth, platform-split UI, and analytics. This is becoming a product.

## Stack
- **Next.js 14+** (App Router)
- **Tailwind CSS** (dark theme, crystal blue accent #4FC3F7)
- **Postgres** via Prisma ORM (Render managed Postgres)
- **next-auth** with Google OAuth (keep existing setup)
- **Recharts** for analytics graphs
- Deploy on Render.com

## Multi-Tenant Model

Every piece of data belongs to an account. Users can belong to multiple accounts.

```
users
  id, email, name, image (from Google)

accounts
  id, name, slug, bot_name, bot_avatar, webhook_url, created_at

account_members
  account_id, user_id, role (owner | admin | viewer)

-- All data tables have account_id
```

## Auth + Tenant Flow

1. Public homepage at / — clean landing, Sign in with Google button
2. Login → Google OAuth (keep existing next-auth setup)
3. After login → /accounts — shows list of accounts user belongs to
4. If no accounts → Create Account button
5. Click account → /app/[accountId]/ — enters the account dashboard
6. Account switcher always visible in top nav
7. Middleware: every /app/[accountId]/* route checks user is a member

## URL Structure

```
/                           — Public homepage
/login                      — Google OAuth login
/accounts                   — Account picker (after login)
/accounts/new               — Create new account
/app/[accountId]/           — Dashboard
/app/[accountId]/twitter    — Twitter view with tabs
/app/[accountId]/linkedin   — LinkedIn view with tabs
/app/[accountId]/analytics  — Analytics with graphs
/app/[accountId]/chat       — Shared team chat
/app/[accountId]/corpus     — Knowledge corpus
/app/[accountId]/strategy   — Strategy files
/app/[accountId]/settings   — Account settings
```

## Platform View Layout

Left sidebar: Twitter, LinkedIn, Analytics, Chat, Corpus, Strategy, Settings
Main area: Topline metrics bar at top, then tabs below

## Topline Metrics Bar (per platform)

- Total Followers (current)
- Total Posts (all time)
- Total Replies/Comments (all time)
- New Followers This Week (with +/- delta)
- New Posts This Week
- New Replies This Week

## Platform Tabs

### Posts Tab
- All published posts, full text, timestamp, engagement metrics
- External link to actual post
- Feedback thread per post

### Replies Tab
- Comments/replies left on others' posts
- Who I replied to, snippet of their post, my reply, URL

### New Follows Tab
- People/companies followed this week
- Name, profile URL, their follower count, when followed

### Engaged Tab
- People engaged with (replied, liked, commented)
- Their name, what they posted, how engaged, context explanation

## Analytics Page (Recharts)

1. New Followers per Week — bar chart, last 12 weeks
2. Reach per Week — line chart (sum of impressions)
3. New Reach Potential per Week — bar (sum of follower counts of new followers)
4. Posts per Week — stacked bar (original vs replies)
5. Engagement Rate — line chart

## Prisma Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  memberships   AccountMember[]
  chatMessages  ChatMessage[]
  feedback      Feedback[]
  createdAt     DateTime  @default(now())
}

model Account {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  botName       String?
  botAvatar     String?
  webhookUrl    String?
  members       AccountMember[]
  posts         Post[]
  engagements   Engagement[]
  followers     Follower[]
  snapshots     MetricsSnapshot[]
  chatMessages  ChatMessage[]
  feedback      Feedback[]
  corpus        Corpus[]
  strategy      Strategy[]
  createdAt     DateTime  @default(now())
}

model AccountMember {
  id        String  @id @default(cuid())
  account   Account @relation(fields: [accountId], references: [id])
  accountId String
  user      User    @relation(fields: [userId], references: [id])
  userId    String
  role      String  @default("viewer")
  @@unique([accountId, userId])
}

model Post {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  platform      String
  postType      String
  status        String    @default("published")
  text          String
  url           String?
  likes         Int       @default(0)
  comments      Int       @default(0)
  reposts       Int       @default(0)
  impressions   Int       @default(0)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  feedback      Feedback[]
}

model Engagement {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  platform      String
  type          String
  targetAuthor  String?
  targetSnippet String?
  targetUrl     String?
  myText        String?
  context       String?
  createdAt     DateTime  @default(now())
}

model Follower {
  id              String    @id @default(cuid())
  account         Account   @relation(fields: [accountId], references: [id])
  accountId       String
  platform        String
  handle          String
  name            String?
  profileUrl      String?
  followerCount   Int       @default(0)
  followedAt      DateTime  @default(now())
  isFollowBack    Boolean   @default(false)
  @@unique([accountId, platform, handle])
}

model MetricsSnapshot {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  platform      String
  date          DateTime
  followers     Int       @default(0)
  posts         Int       @default(0)
  replies       Int       @default(0)
  impressions   Int       @default(0)
  @@unique([accountId, platform, date])
}

model ChatMessage {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  author        User?     @relation(fields: [authorId], references: [id])
  authorId      String?
  authorName    String
  authorImage   String?
  isBot         Boolean   @default(false)
  text          String
  pinnedItem    String?
  createdAt     DateTime  @default(now())
}

model Feedback {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  post          Post?     @relation(fields: [postId], references: [id])
  postId        String?
  author        User      @relation(fields: [authorId], references: [id])
  authorId      String
  text          String
  status        String    @default("pending")
  botResponse   String?
  createdAt     DateTime  @default(now())
}

model Corpus {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  filename      String
  title         String
  content       String
  updatedAt     DateTime  @default(now())
  @@unique([accountId, filename])
}

model Strategy {
  id            String    @id @default(cuid())
  account       Account   @relation(fields: [accountId], references: [id])
  accountId     String
  filename      String
  title         String
  content       String
  updatedAt     DateTime  @default(now())
  @@unique([accountId, filename])
}
```

## Environment Variables

```
DATABASE_URL=postgresql://social_activity_db_user:y6gO4LzUbcHPvX5n1EWrtfXULGm4USrU@dpg-d6kvb9lm5p6s738a3bs0-a.oregon-postgres.render.com/social_activity_db
GOOGLE_CLIENT_ID=722678632359-7cs1dhqviqqat6dt274roucucl51ccjb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=(existing, check Render env vars)
NEXTAUTH_SECRET=YjHBEEzDNB9OzR228OOi9M9ZieUwy5BSaRtKQPiAtxQ=
NEXTAUTH_URL=https://social-activity-b2xc.onrender.com
```

## API Routes

All /api/app/[accountId]/* routes check auth + membership.

```
GET/POST   /api/app/[accountId]/posts
GET/POST   /api/app/[accountId]/engagements
GET/POST   /api/app/[accountId]/followers
GET/POST   /api/app/[accountId]/snapshots
GET/POST   /api/app/[accountId]/chat
GET/POST   /api/app/[accountId]/feedback
GET/PUT    /api/app/[accountId]/corpus
GET/PUT    /api/app/[accountId]/strategy
GET        /api/app/[accountId]/stats
GET/PUT    /api/app/[accountId]/settings
POST       /api/accounts (create account)
GET        /api/accounts (list my accounts)
```

## Public Homepage

Dark, clean, minimal one-page:
- Hero: "Social Activity Review" + "Review, coach, and improve your AI agent's social presence"
- 3 feature cards (Multi-platform, Analytics, Team Review)
- Sign in with Google CTA
- Footer

## Seed Data

- One account: "Novalystrix" (slug: novalystrix)
- vaselin@gmail.com as owner, novalystrix@gmail.com as admin
- Import existing posts from current data if available

## Design
- Dark theme (#0a0a0a background, #1a1a2e cards, #4FC3F7 accent)
- Sidebar nav with icons + labels
- Account switcher in top bar
- Mobile responsive
- Recharts dark theme
- react-markdown for corpus/strategy

## Build Order
1. Prisma schema + Postgres connection + migrations
2. Auth updates (user model in Prisma, tenant middleware)
3. Account picker page (/accounts)
4. App layout with sidebar (/app/[accountId]/)
5. Platform pages with metrics + tabs
6. All four tabs per platform
7. Analytics page with Recharts
8. Chat (shared, multi-tenant)
9. Corpus + Strategy
10. Settings page
11. Public homepage
12. Seed script
13. Tests (API + browser)

## Important
- Keep existing Google OAuth client ID
- App must work with zero data (empty states)
- Handle Prisma errors gracefully
- No persistent disk needed (Postgres replaces SQLite)
- Do NOT install unknown packages
