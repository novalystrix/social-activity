# Auth & Links Feature

## 1. Google OAuth Login + Admin Allowlist

### Requirements
- Replace the simple password auth with Google OAuth (NextAuth.js)
- Only pre-approved emails can access the app
- Admin page to manage allowed emails (add/remove)
- First user (or seeded user) gets admin role
- Non-allowed Google accounts see "Access denied — contact admin"

### Implementation
- Use `next-auth` with Google provider
- Store allowed users in SQLite:
```sql
CREATE TABLE allowed_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TEXT DEFAULT (datetime('now'))
);
```
- Seed with admin emails: roy@monday.com, novalystrix@gmail.com
- Add `/admin` page (admin role only) to add/remove allowed emails
- Middleware checks session email against allowed_users table
- Environment variables needed: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL

### Auth Flow
1. User visits any page → redirected to /login
2. Click "Sign in with Google" → Google OAuth flow
3. On callback, check if email is in allowed_users
4. If yes → create session, redirect to app
5. If no → show "Access denied" page

### Admin Page (/admin)
- List all allowed users (email, role, added date)
- Form to add new email + role (admin/viewer)
- Delete button to remove users
- Only accessible by users with role='admin'

## 2. Links to Actual Posts & Comments

### Requirements
- Every post card in the app should link to the actual LinkedIn/Twitter post
- Every engagement entry (comment/reply) should link to the actual post it was on
- Links open in new tab

### Implementation
- Posts table already has platform field — add `platform_url TEXT` column
- Engagement entries — add `platform_url TEXT` column  
- In the UI: add a small external link icon (↗) next to each post title and engagement entry
- If no URL available, don't show the icon

### Database Changes
```sql
ALTER TABLE posts ADD COLUMN platform_url TEXT;
ALTER TABLE engagements ADD COLUMN platform_url TEXT;
```
(Check actual table names in db.ts first — may be different)

