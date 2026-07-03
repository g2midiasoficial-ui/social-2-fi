import { SocialPost, SocialChannel, AnalyticsMetric } from "./types";

// Helper to get dates relative to today
export function getDateWithOffset(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}

// Find the date of the nearest weekday
export function getWeekdayDate(dayOfWeek: number): string {
  // 0 = Sunday, 1 = Monday, etc.
  const today = new Date();
  const currentDay = today.getDay();
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  return targetDate.toISOString().split('T')[0];
}

export const initialChannels: SocialChannel[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    username: 'alberth.borges',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    connected: true,
    followers: 2515,
    followersChange: -5,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    username: 'alberth.borges',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    connected: true,
    followers: 1420,
    followersChange: 35,
  },
  {
    id: 'facebook',
    name: 'Facebook Pages',
    username: 'alberth.oficial',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    connected: false,
    followers: 0,
    followersChange: 0,
  },
  {
    id: 'youtube',
    name: 'YouTube Channel',
    username: 'Alberth Borges Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    connected: false,
    followers: 0,
    followersChange: 0,
  }
];

export const initialPosts: SocialPost[] = [
  {
    id: 'post-1',
    caption: 'A pergunta que vale milhões: Você prefere consistência ou perfeição? No Reels de hoje respondo por que a frequência supera a produção cinematográfica para crescer no digital! 🎯 Comenta aqui sua opinião 👇',
    platforms: ['instagram', 'tiktok'],
    date: getWeekdayDate(0), // Sunday of current week
    time: '10:00',
    mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=800&fit=crop',
    mediaType: 'video',
    status: 'scheduled',
    bestTimeScore: 92,
    analytics: { likes: 142, comments: 28, views: 2450, shares: 14, clicks: 8 }
  },
  {
    id: 'post-2',
    caption: 'Pare de queimar sua energia com estratégias ultrapassadas. O algoritmo valoriza retenção de público! Focar nos primeiros 3 segundos do vídeo é o que vai te levar para o explorar. 🔥',
    platforms: ['tiktok'],
    date: getWeekdayDate(0), // Sunday of current week
    time: '10:00',
    mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop',
    mediaType: 'video',
    status: 'scheduled',
    bestTimeScore: 88,
    analytics: { likes: 98, comments: 12, views: 1820, shares: 5, clicks: 3 }
  },
  {
    id: 'post-3',
    caption: 'Sua oferta é o coração do seu negócio! ❤️ Nesse post mostro o passo a passo de como estruturar um produto irresistível que se vende sozinho, sem precisar parecer chato ou insistente.',
    platforms: ['instagram', 'tiktok'],
    date: getWeekdayDate(1), // Monday of current week
    time: '10:00',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop',
    mediaType: 'video',
    status: 'scheduled',
    bestTimeScore: 95,
    analytics: { likes: 215, comments: 42, views: 3200, shares: 35, clicks: 19 }
  },
  {
    id: 'post-4',
    caption: 'Dica rápida de produtividade para criadores: Planeje sua semana inteira de posts em apenas 1 dia usando um planner visual. Menos ansiedade, mais resultados! 📅✨',
    platforms: ['instagram'],
    date: getWeekdayDate(1), // Monday
    time: '18:00',
    mediaUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=800&fit=crop',
    mediaType: 'image',
    status: 'scheduled',
    bestTimeScore: 81,
    analytics: { likes: 75, comments: 8, views: 950, shares: 3, clicks: 1 }
  },
  {
    id: 'post-5',
    caption: 'Estes 3 livros mudaram completamente minha mentalidade de negócios em 2025. Se você quer decolar em 2026, comece por aqui. Leitura obrigatória para qualquer profissional digital.',
    platforms: ['instagram', 'facebook'],
    date: getWeekdayDate(3), // Wednesday
    time: '14:30',
    mediaUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop',
    mediaType: 'image',
    status: 'draft',
    bestTimeScore: 78,
    analytics: { likes: 0, comments: 0, views: 0, shares: 0, clicks: 0 }
  }
];

export const initialAnalyticsGrowth: AnalyticsMetric[] = [
  { date: '18 jun', followers: 2520, following: 260, posts: 12, likes: 450, views: 12200, comments: 98 },
  { date: '19 jun', followers: 2520, following: 260, posts: 13, likes: 480, views: 12800, comments: 104 },
  { date: '20 jun', followers: 2520, following: 260, posts: 13, likes: 495, views: 13100, comments: 110 },
  { date: '21 jun', followers: 2522, following: 261, posts: 14, likes: 520, views: 14200, comments: 122 },
  { date: '22 jun', followers: 2520, following: 261, posts: 14, likes: 542, views: 14900, comments: 125 },
  { date: '23 jun', followers: 2517, following: 261, posts: 15, likes: 580, views: 16100, comments: 138 },
  { date: '24 jun', followers: 2515, following: 262, posts: 16, likes: 610, views: 17400, comments: 145 },
];

export const demographicsAgeData = [
  { group: '13-17', percentage: 2.4 },
  { group: '18-24', percentage: 24.8 },
  { group: '25-34', percentage: 48.2 },
  { group: '35-44', percentage: 18.6 },
  { group: '45-54', percentage: 4.5 },
  { group: '55+', percentage: 1.5 },
];

export const demographicsGenderData = [
  { name: 'Feminino', value: 58, color: '#f472b6' },
  { name: 'Masculino', value: 39, color: '#3b82f6' },
  { name: 'Não Binário / Outros', value: 3, color: '#a78bfa' },
];

export const demographicsCountryData = [
  { country: 'Brasil 🇧🇷', percentage: 84.5 },
  { country: 'Portugal 🇵🇹', percentage: 8.2 },
  { country: 'Estados Unidos 🇺🇸', percentage: 3.1 },
  { country: 'Angola 🇦🇴', percentage: 1.8 },
  { country: 'Outros', percentage: 2.4 },
];
