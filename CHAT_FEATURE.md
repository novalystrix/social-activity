# Chat Feature Spec

## Overview
Add a persistent chat sidebar to the social-activity app. Roy and Bridie can chat with Nova (the AI agent) directly on the site. Items can be "pinned" to the chat for context.

## Chat Sidebar
- Fixed right sidebar, collapsible (toggle button on the edge)
- Dark themed to match the app (#1a1a2e background)
- Shows conversation history (stored in SQLite)
- Text input at bottom with send button
- When collapsed, shows a floating 💠 button to open

## Pin-to-Chat (💠 Button)
- Every post, draft, corpus file, engagement entry, and feedback item gets a small 💠 icon/button
- Clicking 💠 "pins" that item to the chat — it appears as a reference card above the text input
- Multiple items can be pinned at once
- Pinned items show: type (post/corpus/feedback/etc), title/snippet, and an X to remove
- When a message is sent, all currently pinned items are included as context in the message payload
- After sending, pinned items stay (user can clear them manually)

## Database Schema Addition
```sql
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  author TEXT,  -- 'Roy', 'Bridie', 'Nova'
  message TEXT NOT NULL,
  pinned_items TEXT,  -- JSON array of pinned item references [{type, id, snippet}]
  created_at TEXT DEFAULT (datetime('now'))
);
```

## API Endpoints
```
GET  /api/chat         — get chat history (last 50 messages)
POST /api/chat         — send message + pinned items
                         body: { author, message, pinned_items: [{type, id, snippet}] }
                         Response includes Nova's reply
```

## How Nova Responds
For now, the POST /api/chat endpoint stores the message and returns a placeholder response like:
```json
{
  "reply": "Message received. Nova will respond shortly.",
  "message_id": 123
}
```
Later we'll connect this to the real OpenClaw API. For now just make it store messages and return a canned response.

IMPORTANT: Also add a real-time polling mechanism — the chat page polls GET /api/chat every 3 seconds to pick up new messages (Nova's responses will be injected via API later).

## UI Details
- Sidebar width: 350px (desktop), full screen overlay on mobile
- Chat messages: user messages right-aligned (blue-ish), Nova messages left-aligned (crystal blue accent)
- Pinned items: small cards with colored border based on type (post=blue, corpus=green, feedback=orange, engagement=purple)
- 💠 button on items: small, subtle, appears on hover. On click, brief animation (pulse) to confirm pin
- Typing indicator when waiting for response
- Timestamp on each message
- Scrollable message history, auto-scroll to bottom on new message

## Components
- `ChatSidebar.tsx` — the main sidebar component, included in layout.tsx
- `ChatMessage.tsx` — individual message bubble
- `PinnedItemCard.tsx` — small card showing a pinned reference
- `PinButton.tsx` — the 💠 button added to all item components

## Where to Add 💠 Buttons
- PostCard or post list items (posts/page.tsx and queue/page.tsx)
- Corpus file cards (corpus/page.tsx)
- Engagement entries (engagement/page.tsx)
- Feedback entries (feedback/page.tsx)
- Strategy file cards (strategy/page.tsx)

## Layout Change
Current layout has a sidebar nav on the left. Add the chat sidebar on the right. The main content area sits between them. On mobile, chat is an overlay triggered by a floating button.

