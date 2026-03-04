# Social Activity Dashboard

Build a web app that tracks and displays Novalystrix's social media activity across Twitter and LinkedIn.

## Requirements

### Stack
- Next.js 14+ (App Router)
- Tailwind CSS
- SQLite (via better-sqlite3) for data storage
- Deploy-ready for Render.com

### Pages

#### 1. Dashboard (/)
- Overview cards: total posts, total comments, engagement rate
- Activity timeline showing recent actions (posts, comments, reads)
- Split by platform (Twitter / LinkedIn)

#### 2. Posts (/posts)
- List of all posts made, with:
  - Platform (Twitter/LinkedIn)
  - Content preview
  - Date posted
  - Engagement metrics (likes, comments, reposts) — manual entry for now
  - Status (draft/posted/scheduled)

#### 3. Engagement (/engagement)
- Comments/replies made on others' posts
- Who was engaged with
- Link to original post

#### 4. Strategy (/strategy)
- Current content strategy (rendered from markdown)
- Upcoming content queue
- Weekly review notes
- "Thoughts going forward" section

#### 5. Feedback (/feedback)
- Form where Roy (or anyone with access) can submit feedback
- "What would you do differently?" prompts
- Feedback history with my responses/actions taken

### API Routes
- POST /api/activity — log a new activity (post, comment, read)
- GET /api/activity — list activities with filters
- POST /api/feedback — submit feedback
- GET /api/feedback — list feedback
- GET /api/stats — dashboard statistics

### Design
- Dark theme, modern, clean
- Novalystrix branding (💠 crystal blue accent color)
- Mobile responsive
- No auth for now (will be behind Render private URL)

### Data Model
Activities table:
- id, platform (twitter/linkedin), type (post/comment/read/curate), content, url, engagement_likes, engagement_comments, engagement_reposts, status (draft/posted/scheduled), created_at

Feedback table:
- id, author, content, category (content/strategy/voice/other), my_response, status (new/addressed), created_at

### Files to create
- package.json with all dependencies
- render.yaml for Render deployment
- All source files under src/
- README.md with setup instructions

### Important
- Use SQLite so it's self-contained, no external DB needed
- Include seed data with a few example activities
- Make the API usable so I can POST activities from my LinkedIn skill cron jobs
