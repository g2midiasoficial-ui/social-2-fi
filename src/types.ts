export interface SocialPost {
  id: string;
  caption: string;
  platforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  destinations?: ('feed' | 'story')[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mediaUrl?: string;
  videoUrl?: string;
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
export type SubTabCalendar = 'calendario' | 'trello' | 'lista' | 'biblioteca' | 'autolistas' | 'multiplicador' | 'fabrica150' | 'transcritor';
export type SubTabAnalytics = 'resumo' | 'comunidade' | 'demograficos' | 'publicacoes';

export interface ModularPiece {
  id: string;
  type: 'hook' | 'body' | 'cta';
  index: number; // 1 to 10 for hook, 1 to 5 for body, 1 to 3 for cta
  title: string;
  script: string;
  triggerOrValue: string; // Ex: "Quebra de padrão", "Passo prático", "Chamada Direct"
  durationSec: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  isRecorded?: boolean;
}

export interface ModularCombinedVideo {
  id: string;
  comboNumber: number; // 1 to 150
  hookIndex: number; // 1 to 10
  bodyIndex: number; // 1 to 5
  ctaIndex: number; // 1 to 3
  title: string;
  fullScript: string;
  caption: string;
  hashtags: string[];
  totalDurationSec: number;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface ModularMatrixProject {
  id: string;
  title: string;
  topic: string;
  niche: string;
  audience: string;
  createdAt: string;
  hooks: ModularPiece[]; // 10 items
  bodies: ModularPiece[]; // 5 items
  ctas: ModularPiece[]; // 3 items
}

export interface MultipliedVideoVariation {
  id: string;
  title: string;
  angle: string;
  targetEmotion: string;
  hook3s: string;
  visualOpening: string;
  fullScript: string;
  teleprompterScript: string;
  onScreenCaptions: string[];
  brollSuggestions: string;
  socialCaption: string;
  hashtags: string[];
  estimatedDuration: string;
  bestTimeToPost: string;
  recommendedAudioType: string;
  status: 'draft' | 'script_ready' | 'recorded' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  targetPlatforms?: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  coverUrl?: string;
}

export interface ViralMultiplierProject {
  id: string;
  title: string;
  topic: string;
  niche: string;
  sourceUrl?: string;
  multiplierCount: number;
  createdAt: string;
  variations: MultipliedVideoVariation[];
}

export interface VideoRemixResult {
  originalTranscript: string;
  hookOriginal: string;
  toneDetected: string;
  retentionTechniques: string[];
  viralRemixScript: {
    hook3s: string;
    bodyStory: string;
    callToAction: string;
    fullScript: string;
  };
  socialCaption: string;
  hashtags: string[];
  alternativeHooks: string[];
  recordingTips: {
    visualsAndAngles: string;
    onScreenText: string;
    audioAndMusic: string;
  };
  isMock?: boolean;
}
