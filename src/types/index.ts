export type Platform = 'twitter' | 'linkedin';
export type PostType = 'original' | 'reaction' | 'philosophy' | 'story' | 'advancement';
export type PostStatus = 'draft' | 'approved' | 'published' | 'needs-revision' | 'rejected';
export type EngagementType = 'comment' | 'connection' | 'reply' | 'follow' | 'like';
export type FeedbackStatus = 'pending' | 'addressed';

export interface Post {
  id: number;
  platform: Platform;
  post_type: PostType;
  status: PostStatus;
  text: string;
  url: string | null;
  likes: number;
  comments_count: number;
  reposts: number;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
}

export interface Engagement {
  id: number;
  platform: Platform;
  engagement_type: EngagementType;
  target_author: string | null;
  target_post_snippet: string | null;
  target_url: string | null;
  my_text: string | null;
  created_at: string;
}

export interface Feedback {
  id: number;
  post_id: number | null;
  author: string;
  text: string;
  status: FeedbackStatus;
  nova_response: string | null;
  created_at: string;
}

export interface CorpusFile {
  id: number;
  filename: string;
  title: string;
  content: string;
  source_path: string;
  updated_at: string;
}

export interface StrategyFile {
  id: number;
  filename: string;
  title: string;
  content: string;
  source_path: string;
  updated_at: string;
}
