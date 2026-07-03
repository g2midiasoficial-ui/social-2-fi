export interface SocialPost {
  id: string;
  caption: string;
  platforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  destinations?: ('feed' | 'story')[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  status: 'scheduled' | 'published' | 'draft';
  bestTimeScore?: number; // 0-100 score for best times visual highlights
  analytics?: {
    likes: number;
    comments: number;
    views: number;
    shares: number;
    clicks: number;
  };
}

export interface SocialChannel {
  id: string; // Can be instagram, tiktok, facebook, youtube
  name: string;
  username: string;
  avatar: string;
  connected: boolean;
  followers: number;
  followersChange: number;
  webhookUrl?: string;
  metaAccessToken?: string;
  instagramPageId?: string;
}

export interface AnalyticsMetric {
  date: string;
  followers: number;
  following: number;
  posts: number;
  likes: number;
  views: number;
  comments: number;
}

export type MainTab = 'analitica' | 'planeamento';
export type SubTabCalendar = 'calendario' | 'trello' | 'lista' | 'biblioteca' | 'autolistas';
export type SubTabAnalytics = 'resumo' | 'comunidade' | 'demograficos' | 'publicacoes';
