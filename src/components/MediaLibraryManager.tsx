import React, { useState, useEffect, useRef } from "react";
import { SocialPost } from "../types";
import { 
  FolderOpen, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ExternalLink,
  Bookmark,
  Trash2,
  Play,
  X,
  Link as LinkIcon,
  RefreshCw,
  Eye,
  Flame,
  Layers,
  Wand2,
  Film,
  Save,
  CheckCircle2,
  Upload,
  Download,
  Maximize2,
  Edit3,
  Share2
} from "lucide-react";

export interface MediaTemplate {
  id: string;
  title: string;
  category: 'reels' | 'carrossel' | 'copy' | 'quote' | 'oferta' | 'minhas_publicacoes' | string;
  categoryLabel: string;
  caption: string;
  mediaUrl?: string; // Direct media or video link
  thumbnailUrl?: string; // Extracted or custom cover image
  videoUrl?: string; // Video URL if available
  mediaType: 'image' | 'video';
  tags: string[];
  engagementTip: string;
  originalPostId?: string;
  status?: string;
  postDate?: string;
  postTime?: string;
}

interface MediaLibraryManagerProps {
  onUseTemplate: (postData: Partial<SocialPost>) => void;
  showNotification: (msg: string, type: 'success' | 'info') => void;
  savedPosts?: SocialPost[];
  onEditPost?: (post: SocialPost) => void;
  onDeletePost?: (postId: string) => void;
}

// SVG Cover Generators for Instagram, TikTok and Direct Video when hosted on Vercel/production
export function createInstagramCoverSvg(shortcode: string = '', title: string = 'Instagram Reels'): string {
  const safeTitle = (title || 'Instagram Reels').slice(0, 32).replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <defs>
    <linearGradient id="igGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c1d95" />
      <stop offset="25%" stop-color="#833ab4" />
      <stop offset="50%" stop-color="#c13584" />
      <stop offset="75%" stop-color="#e1306c" />
      <stop offset="90%" stop-color="#fd1d1d" />
      <stop offset="100%" stop-color="#f56040" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#igGrad)" />
  <circle cx="600" cy="200" r="300" fill="#ffffff" opacity="0.08" />
  <circle cx="100" cy="1100" r="250" fill="#000000" opacity="0.15" />
  <g transform="translate(260, 440)">
    <rect width="200" height="200" rx="55" fill="none" stroke="#ffffff" stroke-width="16" />
    <circle cx="100" cy="100" r="48" fill="none" stroke="#ffffff" stroke-width="16" />
    <circle cx="150" cy="50" r="12" fill="#ffffff" />
  </g>
  <g transform="translate(235, 680)">
    <rect width="250" height="50" rx="25" fill="#000000" opacity="0.4" />
    <text x="125" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">INSTAGRAM REELS</text>
  </g>
  <text x="360" y="780" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
  ${shortcode ? `<text x="360" y="830" font-family="monospace" font-size="20" fill="#ffdfba" text-anchor="middle" opacity="0.9">@reel/${shortcode}</text>` : ''}
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createTikTokCoverSvg(title: string = 'TikTok Vídeo'): string {
  const safeTitle = (title || 'TikTok Vídeo').slice(0, 32).replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <defs>
    <linearGradient id="ttGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f051d" />
      <stop offset="50%" stop-color="#000000" />
      <stop offset="100%" stop-color="#120320" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#ttGrad)" />
  <circle cx="360" cy="520" r="160" fill="#fe2c55" opacity="0.15" />
  <circle cx="360" cy="520" r="130" fill="#00f2fe" opacity="0.15" />
  <g transform="translate(300, 420)">
    <path d="M70,0 C78,25 98,40 120,42 L120,72 C104,71 88,62 76,50 L76,140 C76,173 49,200 16,200 C-17,200 -44,173 -44,140 C-44,107 -17,80 16,80 C24,80 32,82 38,85 L38,122 C32,118 24,116 16,116 C3,116 -8,127 -8,140 C-8,153 3,164 16,164 C29,164 40,153 40,140 L40,0 L70,0 Z" fill="#ffffff" />
  </g>
  <g transform="translate(250, 700)">
    <rect width="220" height="48" rx="24" fill="#fe2c55" opacity="0.9" />
    <text x="110" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">TIKTOK VIRAL</text>
  </g>
  <text x="360" y="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
  <text x="360" y="850" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="#00f2fe" text-anchor="middle">♪ Som Original / Vídeo</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createVideoCoverSvg(title: string = 'Vídeo'): string {
  const safeTitle = (title || 'Vídeo').slice(0, 32).replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <defs>
    <linearGradient id="vidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180b22" />
      <stop offset="50%" stop-color="#2d1339" />
      <stop offset="100%" stop-color="#0a050f" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#vidGrad)" />
  <circle cx="360" cy="540" r="90" fill="#db2777" opacity="0.3" />
  <polygon points="335,490 415,540 335,590" fill="#ffffff" />
  <g transform="translate(260, 680)">
    <rect width="200" height="44" rx="22" fill="#db2777" opacity="0.85" />
    <text x="100" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">VÍDEO HD</text>
  </g>
  <text x="360" y="780" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Master cover resolver guaranteeing valid image on Vercel and production
export function resolveCoverImage(tpl: { thumbnailUrl?: string; mediaUrl?: string; videoUrl?: string; title?: string }): string {
  const thumb = (tpl.thumbnailUrl || '').trim();
  
  // 1. Direct valid image (data URL, blob, proxy, or any remote image URL)
  if (thumb && (thumb.startsWith('data:image') || thumb.startsWith('blob:') || thumb.startsWith('http://') || thumb.startsWith('https://') || thumb.startsWith('/api/'))) {
    return thumb;
  }

  // 2. YouTube
  const ytMatch = (tpl.videoUrl || tpl.mediaUrl || thumb).match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // 3. Vimeo
  const vimeoMatch = (tpl.videoUrl || tpl.mediaUrl || thumb).match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }

  // 4. Instagram Fallback only when no real thumb is available
  const instaMatch = (tpl.videoUrl || tpl.mediaUrl || thumb).match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (instaMatch || /instagram\.com/i.test(tpl.videoUrl || tpl.mediaUrl || '')) {
    const shortcode = instaMatch ? instaMatch[1] : '';
    return createInstagramCoverSvg(shortcode, tpl.title || 'Instagram Reels');
  }

  // 5. TikTok Fallback only when no real thumb is available
  if (/tiktok\.com/i.test(tpl.videoUrl || tpl.mediaUrl || thumb)) {
    return createTikTokCoverSvg(tpl.title || 'TikTok Vídeo');
  }

  // 6. Direct image file in mediaUrl
  const mUrl = (tpl.mediaUrl || '').trim();
  if (mUrl && (mUrl.startsWith('data:image') || mUrl.startsWith('blob:') || mUrl.startsWith('http://') || mUrl.startsWith('https://'))) {
    return mUrl;
  }

  return createVideoCoverSvg(tpl.title || 'Vídeo');
}

// Helper to parse video / social link and extract embed & identifiers
export function parseMediaUrl(inputUrl: string): {
  thumbnailUrl: string;
  videoUrl: string;
  mediaType: 'image' | 'video';
  source: 'youtube' | 'vimeo' | 'tiktok' | 'instagram' | 'direct_video' | 'image' | 'unknown';
  sourceLabel: string;
  embedUrl?: string;
  shortcode?: string;
} {
  const trimmed = (inputUrl || '').trim();
  if (!trimmed) {
    return {
      thumbnailUrl: '',
      videoUrl: '',
      mediaType: 'video',
      source: 'unknown',
      sourceLabel: 'Nenhum link inserido'
    };
  }

  // 1. YouTube & Shorts
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoUrl: trimmed,
      mediaType: 'video',
      source: 'youtube',
      sourceLabel: 'YouTube / Shorts',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      thumbnailUrl: `https://vumbnail.com/${vimeoId}.jpg`,
      videoUrl: trimmed,
      mediaType: 'video',
      source: 'vimeo',
      sourceLabel: 'Vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
    };
  }

  // 3. Instagram (Reels / Post / TV)
  const instaMatch = trimmed.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (instaMatch && instaMatch[1]) {
    const shortcode = instaMatch[1];
    return {
      thumbnailUrl: '',
      videoUrl: trimmed,
      mediaType: 'video',
      source: 'instagram',
      sourceLabel: 'Instagram Reels',
      embedUrl: `https://www.instagram.com/reel/${shortcode}/embed`,
      shortcode
    };
  }

  // 4. TikTok
  if (/tiktok\.com/i.test(trimmed)) {
    return {
      thumbnailUrl: '',
      videoUrl: trimmed,
      mediaType: 'video',
      source: 'tiktok',
      sourceLabel: 'TikTok Vídeo'
    };
  }

  // 5. Direct Video File (.mp4, .webm, .mov, mixkit, pexels, blob/data)
  if (/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(trimmed) || /mixkit\.co/i.test(trimmed) || /pexels\.com\/video/i.test(trimmed) || trimmed.startsWith('blob:') || trimmed.startsWith('data:video')) {
    return {
      thumbnailUrl: '',
      videoUrl: trimmed,
      mediaType: 'video',
      source: 'direct_video',
      sourceLabel: 'Vídeo Direto MP4'
    };
  }

  // 6. Direct Image File
  if (/\.(jpeg|jpg|gif|png|webp|svg|avif)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('data:image')) {
    return {
      thumbnailUrl: trimmed,
      videoUrl: '',
      mediaType: 'image',
      source: 'image',
      sourceLabel: 'Imagem'
    };
  }

  return {
    thumbnailUrl: createVideoCoverSvg('Link de Vídeo'),
    videoUrl: trimmed,
    mediaType: 'video',
    source: 'unknown',
    sourceLabel: 'Link Externo'
  };
}

const INITIAL_TEMPLATES: MediaTemplate[] = [
  {
    id: "tpl-1",
    title: "🔥 Roteiro Viral: 'Os 3 Maiores Erros'",
    category: "reels",
    categoryLabel: "Reels / Vídeo",
    caption: `🚨 3 ERROS QUE ESTÃO DESTRUINDO SEU ENGAJAMENTO (E como corrigir hoje mesmo!)\n\n1. Começar o vídeo dizendo "Oi pessoal tudo bem" (perde 70% da retenção nos 2 primeiros segundos)\n2. Não legendar seu vídeo (mais de 65% das pessoas assistem sem som)\n3. Esquecer de fazer uma chamada para ação clara (CTA) no final.\n\n👉 Salve este post para consultar quando for gravar seus próximos vídeos! Qual desses erros você mais cometia? Comente aqui embaixo! 👇`,
    mediaUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=1200&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=1200&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1230-large.mp4",
    mediaType: "video",
    tags: ["reels", "viral", "engajamento", "dicas", "crescimento"],
    engagementTip: "Grave olhando direto para a lente e mude o ângulo a cada 4 segundos para reter atenção."
  },
  {
    id: "tpl-2",
    title: "📊 Carrossel Educativo: 'Checklist do Perfil Magnético'",
    category: "carrossel",
    categoryLabel: "Carrossel",
    caption: `Transforme visitantes em seguidores fiéis com este checklist prático:\n\n✅ Foto de perfil com contraste alto e rosto nítido\n✅ Nome de usuário fácil de lembrar e sem símbolos estranhos\n✅ Biografia clara: O que você faz + Para quem + Prova social\n✅ Link na bio direcionado para sua oferta principal\n✅ Destaques organizados com capas padronizadas\n\nArrasta para o lado ➡️ para ver exemplos reais de cada item aplicado!`,
    mediaUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1000&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1000&fit=crop",
    mediaType: "image",
    tags: ["carrossel", "estrategia", "branding", "instagram", "perfil"],
    engagementTip: "Carrosséis de 6 a 8 lâminas geram 3x mais salvamentos e compartilhamentos."
  },
  {
    id: "tpl-3",
    title: "🎯 Oferta Direta: 'A Oportunidade que Você Estava Esperando'",
    category: "oferta",
    categoryLabel: "Oferta & Vendas",
    caption: `💥 AS VAGAS ESTÃO OFICIALMENTE ABERTAS!\n\nSe você quer dominar a criação de conteúdo e multiplicar seu alcance em 30 dias sem passar horas quebrando a cabeça:\n\n🚀 Acesso imediato a todos os módulos práticos\n🎁 Bônus: Pack com +100 roteiros validados e prontos para gravar\n⚡ Suporte direto para tirar dúvidas\n\n⚠️ Condição especial válida apenas para os 20 primeiros. Link no perfil para garantir sua vaga antes que esgote!`,
    mediaUrl: "https://images.unsplash.com/photo-1556742049-0a67e5572263?w=800&h=1000&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0a67e5572263?w=800&h=1000&fit=crop",
    mediaType: "image",
    tags: ["oferta", "vendas", "lancamento", "copywriting", "conversao"],
    engagementTip: "Use senso de urgência real e direcione sempre para um link único e direto."
  },
  {
    id: "tpl-4",
    title: "☕ Frase de Impacto / Storytelling Inspiracional",
    category: "quote",
    categoryLabel: "Inspiração",
    caption: `"Consistência não é sobre nunca falhar. É sobre nunca desistir nos dias em que tudo parece difícil."\n\nLembre-se: quem você vê no topo hoje começou exatamente onde você está agora. Continue postando, continue aprendendo e não pare.\n\nQual frase mais te inspira a continuar todos os dias? Compartilhe com um amigo que precisa ler isso hoje! ❤️`,
    mediaUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
    mediaType: "image",
    tags: ["inspiracao", "mindset", "motivacao", "rotina", "empreendedorismo"],
    engagementTip: "Quotes em imagens clean com fontes elegantes geram altos compartilhamentos nos Stories."
  },
  {
    id: "tpl-5",
    title: "🎬 Reels Dinâmico: 'O Bastidor Que Ninguém Te Mostra'",
    category: "reels",
    categoryLabel: "Reels / Vídeo",
    caption: `👀 A REALIDADE DOS BASTIDORES:\n\nNa internet tudo parece perfeito e fácil, mas a verdade é que por trás de cada resultado existe muito teste, muito erro e muita resiliência.\n\nNeste vídeo te mostro exatamente a rotina de produção e como organizo meu calendário de postagens em 2 horas por semana.\n\nDeixe um 🚀 se você também valoriza o trabalho duro dos bastidores!`,
    mediaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogger-recording-video-content-41315-large.mp4",
    mediaType: "video",
    tags: ["bastidores", "autenticidade", "rotina", "reels", "storytelling"],
    engagementTip: "Vídeos de bastidores humanizam sua marca e geram conexão emocional imediata."
  }
];

const SAMPLE_VIDEO_LINKS = [
  {
    label: "Reels Tendência (Instagram)",
    url: "https://www.instagram.com/reel/C2i9h-rrZlP/",
    title: "Reels Estratégia de Conteúdo",
    category: "reels"
  },
  {
    label: "TikTok Viral Trends",
    url: "https://www.tiktok.com/@tiktok/video/7106594312292453678",
    title: "TikTok Trends & Áudios",
    category: "reels"
  },
  {
    label: "YouTube Shorts Tutorial",
    url: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
    title: "Tutorial Rápido em Shorts",
    category: "reels"
  }
];

export default function MediaLibraryManager({
  onUseTemplate,
  showNotification,
  savedPosts = [],
  onEditPost,
  onDeletePost
}: MediaLibraryManagerProps) {
  const [templates, setTemplates] = useState<MediaTemplate[]>(() => {
    const saved = localStorage.getItem("socialflow_media_library");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    return INITIAL_TEMPLATES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'link' | 'upload'>('link');

  // New Template Inputs
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<'reels' | 'carrossel' | 'copy' | 'quote' | 'oferta' | 'minhas_publicacoes'>('reels');
  const [newCaption, setNewCaption] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newCustomThumbnail, setNewCustomThumbnail] = useState("");
  const [newTags, setNewTags] = useState("viral, reels, tendencias");
  const [newTip, setNewTip] = useState("");
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('video');

  // Video and Image Lightbox Modal States
  const [activeVideoModal, setActiveVideoModal] = useState<MediaTemplate | null>(null);
  const [activeImageLightbox, setActiveImageLightbox] = useState<{ url: string; title: string } | null>(null);

  // Live Extraction States for Video Link
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [serverThumbnail, setServerThumbnail] = useState("");
  const [serverEmbedUrl, setServerEmbedUrl] = useState("");
  const [extractedInfo, setExtractedInfo] = useState<ReturnType<typeof parseMediaUrl>>({
    thumbnailUrl: '',
    videoUrl: '',
    mediaType: 'video',
    source: 'unknown',
    sourceLabel: ''
  });

  // Top Bar Quick Link
  const [quickLink, setQuickLink] = useState("");
  const [isQuickSaving, setIsQuickSaving] = useState(false);

  // Sync templates with Firestore & localStorage
  useEffect(() => {
    fetch("/api/media-templates")
      .then(res => res.json())
      .then(data => {
        if (data && data.templates && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplates(prev => {
            const map = new Map<string, MediaTemplate>();
            data.templates.forEach((t: MediaTemplate) => map.set(t.id, t));
            prev.forEach(t => {
              if (!map.has(t.id)) map.set(t.id, t);
            });
            const merged = Array.from(map.values());
            localStorage.setItem("socialflow_media_library", JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(err => {
        console.warn("Could not sync media templates from server:", err);
      });
  }, []);

  // Sync saved posts from calendar/scheduler into media library
  useEffect(() => {
    if (savedPosts && savedPosts.length > 0) {
      setTemplates(prev => {
        const map = new Map<string, MediaTemplate>();
        prev.forEach(t => map.set(t.id, t));

        savedPosts.forEach(post => {
          const tplId = `post-tpl-${post.id}`;
          if (!map.has(tplId) && (post.mediaUrl || post.caption)) {
            const resolvedThumb = post.mediaUrl || resolveCoverImage({ title: post.caption?.slice(0, 30) || 'Publicação' });
            map.set(tplId, {
              id: tplId,
              originalPostId: post.id,
              title: (post.caption ? post.caption.slice(0, 45) : 'Publicação Criada') + (post.caption && post.caption.length > 45 ? '...' : ''),
              category: 'minhas_publicacoes',
              categoryLabel: 'Minha Publicação',
              caption: post.caption || '',
              mediaUrl: post.mediaUrl || '',
              thumbnailUrl: resolvedThumb,
              videoUrl: post.mediaType === 'video' ? post.mediaUrl : '',
              mediaType: post.mediaType || 'video',
              tags: ['minha-publicacao', ...(post.platforms || [])],
              engagementTip: `Publicação programada para ${post.date} às ${post.time}.`,
              status: post.status,
              postDate: post.date,
              postTime: post.time
            });
          }
        });

        const merged = Array.from(map.values());
        localStorage.setItem("socialflow_media_library", JSON.stringify(merged));
        return merged;
      });
    }
  }, [savedPosts]);

  // Extract real cover from backend for Instagram, TikTok, YouTube etc.
  useEffect(() => {
    const localParsed = parseMediaUrl(newMediaUrl);
    setExtractedInfo(localParsed);
    setServerThumbnail(localParsed.thumbnailUrl || "");
    setServerEmbedUrl(localParsed.embedUrl || "");
    
    if (localParsed.mediaType) {
      setNewMediaType(localParsed.mediaType);
    }

    if (!newMediaUrl.trim()) return;

    let isMounted = true;
    setIsFetchingMeta(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const resp = await fetch("/api/media/extract-meta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: newMediaUrl }),
          signal: controller.signal
        });
        if (resp.ok) {
          const data = await resp.json();
          if (isMounted && data.success) {
            if (data.thumbnailUrl) {
              setServerThumbnail(data.thumbnailUrl);
            }
            if (data.embedUrl) {
              setServerEmbedUrl(data.embedUrl);
            }
            if (data.title && !newTitle) {
              setNewTitle(data.title);
            }
            if (data.sourceLabel) {
              setExtractedInfo(prev => ({ ...prev, sourceLabel: data.sourceLabel, source: data.source || prev.source }));
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Could not extract metadata from server:", err.message);
        }
      } finally {
        if (isMounted) setIsFetchingMeta(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [newMediaUrl]);

  const saveTemplates = (updated: MediaTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem("socialflow_media_library", JSON.stringify(updated));
  };

  const categories = [
    { id: 'all', label: 'Todos os Modelos & Capas' },
    { id: 'minhas_publicacoes', label: '📌 Minhas Publicações' },
    { id: 'reels', label: '🎬 Reels & Vídeos' },
    { id: 'carrossel', label: '📊 Carrosséis & Fotos' },
    { id: 'copy', label: '⚡ Copies Virais' },
    { id: 'oferta', label: '🎯 Ofertas & Vendas' },
    { id: 'quote', label: '☕ Inspiração' }
  ];

  const filteredTemplates = templates.filter(tpl => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'minhas_publicacoes' ? (tpl.category === 'minhas_publicacoes' || tpl.id.startsWith('post-tpl-')) : tpl.category === selectedCategory);
    
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyCaption = (tpl: MediaTemplate) => {
    navigator.clipboard.writeText(tpl.caption);
    setCopiedId(tpl.id);
    showNotification("Legenda copiada para a área de transferência!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyToScheduler = (tpl: MediaTemplate) => {
    const resolvedCover = resolveCoverImage(tpl);
    const finalVideo = tpl.videoUrl || tpl.mediaUrl || '';
    onUseTemplate({
      caption: tpl.caption,
      mediaUrl: resolvedCover,
      mediaType: tpl.mediaType,
      videoUrl: finalVideo,
      platforms: ['instagram', 'tiktok', 'youtube'],
      destinations: ['feed', 'story'],
      status: 'draft'
    });
    showNotification("Modelo e capa carregados no Agendador de Posts!", "success");
  };

  // Manual trigger to sync all scheduled posts into templates
  const handleManualSyncPosts = () => {
    let postsToSync = savedPosts;
    if (!postsToSync || postsToSync.length === 0) {
      try {
        const raw = localStorage.getItem("socialflow_posts");
        if (raw) postsToSync = JSON.parse(raw);
      } catch (_) {}
    }

    if (!postsToSync || postsToSync.length === 0) {
      showNotification("Nenhuma publicação agendada encontrada no momento.", "info");
      return;
    }

    const map = new Map<string, MediaTemplate>();
    templates.forEach(t => map.set(t.id, t));

    let addedCount = 0;
    postsToSync.forEach(post => {
      const tplId = `post-tpl-${post.id}`;
      const resolvedThumb = post.mediaUrl || resolveCoverImage({ title: post.caption?.slice(0, 30) || 'Publicação' });
      const item: MediaTemplate = {
        id: tplId,
        originalPostId: post.id,
        title: (post.caption ? post.caption.slice(0, 45) : 'Publicação Salva') + (post.caption && post.caption.length > 45 ? '...' : ''),
        category: 'minhas_publicacoes',
        categoryLabel: 'Minha Publicação',
        caption: post.caption || '',
        mediaUrl: post.mediaUrl || '',
        thumbnailUrl: resolvedThumb,
        videoUrl: post.mediaType === 'video' ? post.mediaUrl : '',
        mediaType: post.mediaType || 'video',
        tags: ['minha-publicacao', ...(post.platforms || [])],
        engagementTip: `Publicação agendada para ${post.date} às ${post.time}.`,
        status: post.status,
        postDate: post.date,
        postTime: post.time
      };
      if (!map.has(tplId)) addedCount++;
      map.set(tplId, item);

      // Async save to server
      fetch("/api/media-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      }).catch(() => {});
    });

    const merged = Array.from(map.values());
    saveTemplates(merged);
    showNotification(`✓ ${postsToSync.length} capas de publicações sincronizadas com sucesso!`, "success");
  };

  // Quick Save directly from top bar
  const handleQuickSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = quickLink.trim();
    if (!cleanUrl) return;

    setIsQuickSaving(true);
    const parsed = parseMediaUrl(cleanUrl);
    let finalThumb = parsed.thumbnailUrl || "";
    let autoTitle = "";

    try {
      const resp = await fetch("/api/media/extract-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl })
      });
      if (resp.ok) {
        const meta = await resp.json();
        if (meta.thumbnailUrl) finalThumb = meta.thumbnailUrl;
        if (meta.title) autoTitle = meta.title;
      }
    } catch (_) {}

    const isIg = /instagram\.com/i.test(cleanUrl);
    const isTt = /tiktok\.com/i.test(cleanUrl);
    const isYt = /youtube\.com|youtu\.be/i.test(cleanUrl);

    const titleText = autoTitle || (isIg ? "Instagram Reels Salvo" : isTt ? "TikTok Vídeo Salvo" : isYt ? "YouTube Vídeo Salvo" : "Vídeo & Capa Salvo") + ` #${templates.length + 1}`;
    const resolvedThumbnail = finalThumb || resolveCoverImage({ mediaUrl: cleanUrl, videoUrl: cleanUrl, title: titleText });

    const newTpl: MediaTemplate = {
      id: `tpl-${Date.now()}`,
      title: titleText,
      category: 'reels',
      categoryLabel: 'Reels / Vídeo',
      caption: `Vídeo salvo via link rápido.\n\nConfira este conteúdo e aproveite o gancho para criar uma versão autêntica! 🚀\n\n#reels #viral #marketing`,
      mediaUrl: cleanUrl,
      thumbnailUrl: resolvedThumbnail,
      videoUrl: cleanUrl,
      mediaType: 'video',
      tags: ['viral', 'reels', 'link-salvo'],
      engagementTip: "Grave com gancho nos 3 primeiros segundos para maximizar a retenção."
    };

    const updated = [newTpl, ...templates];
    saveTemplates(updated);

    // Save to server asynchronously
    fetch("/api/media-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTpl)
    }).catch(() => {});

    setQuickLink("");
    setIsQuickSaving(false);
    showNotification("Vídeo e capa salvos com sucesso na biblioteca!", "success");
  };

  // Upload custom file in modal
  const handleUploadImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (!dataUrl) return;
      setNewCustomThumbnail(dataUrl);
      setNewMediaUrl(dataUrl);
      setNewMediaType('image');
      if (!newTitle) {
        setNewTitle(`Capa: ${file.name.replace(/\.[^/.]+$/, "")}`);
      }
      showNotification("Imagem de capa carregada com sucesso!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = newMediaUrl.trim();
    const cleanThumb = newCustomThumbnail.trim();

    if (!cleanUrl && !cleanThumb) {
      showNotification("Por favor, selecione uma imagem ou cole um link de vídeo.", "info");
      return;
    }

    const categoryLabels: Record<string, string> = {
      reels: 'Reels / Vídeo',
      carrossel: 'Carrossel / Foto',
      copy: 'Modelo de Copy',
      quote: 'Inspiração / Quote',
      oferta: 'Oferta & Lançamento',
      minhas_publicacoes: 'Minha Publicação'
    };

    const isIg = /instagram\.com/i.test(cleanUrl);
    const isTt = /tiktok\.com/i.test(cleanUrl);
    const isYt = /youtube\.com|youtu\.be/i.test(cleanUrl);

    const autoTitle = newTitle.trim() || (cleanThumb ? "Capa Personalizada Salva" : isIg ? "Instagram Reels Salvo" : isTt ? "TikTok Vídeo Salvo" : isYt ? "YouTube Vídeo Salvo" : "Capa & Vídeo Salvo") + ` #${templates.length + 1}`;
    const autoCaption = newCaption.trim() || `Publicação salva na biblioteca.\n\nUse este formato para engajar seus seguidores com alto valor! 🚀\n\n#${newCategory} #viral #conteudo`;

    const finalThumbnail = cleanThumb || serverThumbnail || extractedInfo.thumbnailUrl || resolveCoverImage({ mediaUrl: cleanUrl, videoUrl: cleanUrl, title: autoTitle });

    const newTpl: MediaTemplate = {
      id: `tpl-${Date.now()}`,
      title: autoTitle,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Geral',
      caption: autoCaption,
      mediaUrl: cleanUrl || finalThumbnail,
      thumbnailUrl: finalThumbnail,
      videoUrl: newMediaType === 'video' ? (extractedInfo.videoUrl || cleanUrl) : '',
      mediaType: newMediaType,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      engagementTip: newTip.trim() || "Grave com gancho nos 3 primeiros segundos para maximizar o algoritmo."
    };

    const updated = [newTpl, ...templates];
    saveTemplates(updated);

    // Save to server asynchronously
    fetch("/api/media-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTpl)
    }).catch(() => {});

    // CLOSE THE MODAL IMMEDIATELY
    setIsAddModalOpen(false);

    // Reset inputs
    setNewTitle("");
    setNewCaption("");
    setNewCustomThumbnail("");
    setNewMediaUrl("");
    setServerThumbnail("");
    setServerEmbedUrl("");

    showNotification("Capa e publicação salvas com sucesso na biblioteca!", "success");
  };

  // Upload custom thumbnail directly to an existing card
  const handleUploadCustomCoverForCard = (tplId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (!dataUrl) return;

      const updated = templates.map(t => {
        if (t.id === tplId) {
          const mod = { ...t, thumbnailUrl: dataUrl, mediaUrl: dataUrl };
          fetch("/api/media-templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mod)
          }).catch(() => {});
          return mod;
        }
        return t;
      });

      saveTemplates(updated);
      showNotification("Capa atualizada com sucesso!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    saveTemplates(updated);
    fetch(`/api/media-templates/${id}`, { method: "DELETE" }).catch(() => {});
    showNotification("Item removido da biblioteca.", "info");
  };

  return (
    <div className="p-4 md:p-8 flex-1 bg-gray-50 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      
      {/* Top Header & Search Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Biblioteca de Publicações, Vídeos & Capas</h2>
            <span className="bg-pink-100 text-pink-700 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
              {templates.length} Capas & Modelos
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Todas as <strong>capas de posts</strong>, vídeos do <strong>Instagram Reels, TikTok, YouTube</strong> ou imagens salvas em um só lugar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar capas ou posts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-pink-500 font-medium"
            />
          </div>

          <button
            onClick={handleManualSyncPosts}
            className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer hover:border-pink-300"
            title="Sincronizar todas as publicações criadas e agendadas para a biblioteca"
          >
            <RefreshCw className="w-3.5 h-3.5 text-pink-600" />
            <span>Sincronizar Posts</span>
          </button>

          <button
            onClick={() => {
              setNewMediaUrl("");
              setNewCustomThumbnail("");
              setNewTitle("");
              setNewCaption("");
              setAddModalTab('link');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0 hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Capa / Vídeo</span>
          </button>
        </div>
      </div>

      {/* Quick Paste & Save Link Bar directly on page */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-5 rounded-3xl border border-pink-100 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
            <LinkIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-gray-900 block">Salvar Link Rápido com Capa</span>
            <span className="text-[10px] text-gray-500">Instagram Reels, TikTok, YouTube Shorts ou MP4</span>
          </div>
        </div>

        <form onSubmit={handleQuickSaveLink} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="Cole o link aqui: https://www.instagram.com/reel/... ou https://www.tiktok.com/@..."
              value={quickLink}
              onChange={e => setQuickLink(e.target.value)}
              className="w-full pl-3.5 pr-4 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-pink-500 shadow-2xs"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isQuickSaving || !quickLink.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 hover:scale-102"
          >
            {isQuickSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Salvar Capa</span>
          </button>
        </form>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#25172a] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            <span>{cat.label}</span>
            {cat.id === 'minhas_publicacoes' && (
              <span className="px-1.5 py-0.2 bg-pink-500 text-white rounded-full text-[9px] font-extrabold">
                {templates.filter(t => t.category === 'minhas_publicacoes' || t.id.startsWith('post-tpl-')).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200/80 rounded-3xl flex flex-col items-center gap-3">
          <FolderOpen className="w-10 h-10 text-gray-300" />
          <h3 className="text-sm font-bold text-gray-800">Nenhuma capa ou publicação encontrada</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Adicione uma imagem de capa ou cole um link de Instagram Reels, TikTok ou YouTube para salvar.
          </p>
          <button
            onClick={() => {
              setNewMediaUrl("");
              setNewCustomThumbnail("");
              setAddModalTab('upload');
              setIsAddModalOpen(true);
            }}
            className="mt-2 px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-pink-700"
          >
            + Enviar Primeira Imagem de Capa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(tpl => {
            const isDirectVideo = tpl.mediaUrl?.endsWith('.mp4') || tpl.videoUrl?.endsWith('.mp4');
            const hasVideo = Boolean(tpl.videoUrl || tpl.mediaType === 'video');
            const coverImage = resolveCoverImage(tpl);
            const isInstagram = Boolean(tpl.videoUrl && /instagram\.com/i.test(tpl.videoUrl));
            const isTikTok = Boolean(tpl.videoUrl && /tiktok\.com/i.test(tpl.videoUrl));
            const isUserPost = tpl.category === 'minhas_publicacoes' || tpl.id.startsWith('post-tpl-');

            return (
              <div 
                key={tpl.id}
                className="bg-white rounded-3xl border border-gray-200/80 hover:border-pink-300 hover:shadow-lg transition-all flex flex-col overflow-hidden group"
              >
                {/* Media Cover Preview Banner */}
                <div className="relative h-60 w-full bg-gray-950 overflow-hidden flex items-center justify-center">
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt={tpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try fetching via server proxy if remote CDN blocked direct access
                        if (coverImage.startsWith('http') && !target.src.includes('/api/media/proxy-image')) {
                          target.src = `/api/media/proxy-image?url=${encodeURIComponent(coverImage)}`;
                          return;
                        }
                        if (isInstagram) {
                          target.src = createInstagramCoverSvg('', tpl.title);
                        } else if (isTikTok) {
                          target.src = createTikTokCoverSvg(tpl.title);
                        } else {
                          target.src = createVideoCoverSvg(tpl.title);
                        }
                      }}
                    />
                  ) : isDirectVideo && tpl.videoUrl ? (
                    <video 
                      src={tpl.videoUrl} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#25172a] via-purple-950 to-pink-950 flex flex-col items-center justify-center text-white p-4 text-center">
                      <Film className="w-8 h-8 opacity-60 text-pink-400" />
                      <span className="text-xs font-bold mt-1">Capa da Publicação</span>
                    </div>
                  )}

                  {/* Zoom Lightbox Trigger Button */}
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setActiveImageLightbox({ url: coverImage, title: tpl.title })}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-20"
                      title="Ver Capa em Alta Resolução"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Play Video Big Overlay Button */}
                  {hasVideo && (
                    <button
                      onClick={() => setActiveVideoModal(tpl)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer z-10 border-2 border-white/40"
                      title="Assistir ao Vídeo"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20">
                    <span className={`px-2.5 py-1 text-white text-[10px] font-black rounded-lg uppercase tracking-wider ${
                      isUserPost ? 'bg-purple-700 shadow-sm' : 'bg-black/70 backdrop-blur-md'
                    }`}>
                      {isUserPost ? '📌 Minha Publicação' : tpl.categoryLabel}
                    </span>
                    <span className={`px-2 py-1 text-white text-[10px] font-bold rounded-lg uppercase flex items-center gap-1 ${
                      isInstagram ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                      isTikTok ? 'bg-black border border-gray-700' : 'bg-pink-600'
                    }`}>
                      {tpl.mediaType === 'video' ? <VideoIcon className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      <span>{isInstagram ? 'Reels' : isTikTok ? 'TikTok' : tpl.mediaType === 'video' ? 'Vídeo' : 'Capa'}</span>
                    </span>
                  </div>

                  {/* Top Right Action Icons (Custom Cover Upload + Delete) */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-all">
                    <label 
                      className="p-1.5 bg-black/70 hover:bg-pink-600 text-white rounded-lg transition-all cursor-pointer shadow-md flex items-center justify-center"
                      title="Enviar/Trocar Imagem de Capa"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleUploadCustomCoverForCard(tpl.id, e)} 
                      />
                    </label>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-lg transition-all cursor-pointer shadow-md flex items-center justify-center"
                      title="Excluir da biblioteca"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom link / date info */}
                  {tpl.postDate && (
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 z-10">
                      <span className="text-[10px] bg-black/80 backdrop-blur-md text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-emerald-300" /> {tpl.postDate} às {tpl.postTime || '10:00'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {tpl.title}
                    </h4>

                    <p className="text-xs text-gray-600 font-medium line-clamp-3 leading-relaxed bg-gray-50/80 p-3 rounded-2xl border border-gray-100 whitespace-pre-line">
                      "{tpl.caption}"
                    </p>

                    {/* Engagement / Date Tip */}
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Dica:</strong> {tpl.engagementTip}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tpl.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Primary & Secondary Actions Bar */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                    
                    {/* Watch Video Button */}
                    {hasVideo && (
                      <button
                        onClick={() => setActiveVideoModal(tpl)}
                        className="w-full py-2.5 px-3 bg-[#1e1022] hover:bg-[#34183d] text-white text-xs font-black rounded-xl border border-pink-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-[1.01]"
                      >
                        <Play className="w-4 h-4 text-pink-400 fill-pink-400" />
                        <span>Ver Vídeo {isInstagram ? '(Instagram)' : isTikTok ? '(TikTok)' : ''}</span>
                        {tpl.videoUrl && <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />}
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleCopyCaption(tpl)}
                        className="py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedId === tpl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                            <span>Copiar Texto</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleApplyToScheduler(tpl)}
                        className="py-2.5 px-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-102"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Usar no Post</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD NEW TEMPLATE OR UPLOAD COVER IMAGE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Salvar Publicação & Capa na Biblioteca</h3>
                  <p className="text-[11px] text-gray-500">Envie uma imagem de capa ou cole link de vídeo.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR: LINK VS UPLOAD DIRECT */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setAddModalTab('link')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addModalTab === 'link' ? 'bg-white text-pink-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link de Vídeo (Reels/TikTok)</span>
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('upload')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addModalTab === 'upload' ? 'bg-white text-pink-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Enviar Imagem de Capa</span>
              </button>
            </div>

            {addModalTab === 'link' && (
              /* Quick Sample Links */
              <div className="bg-pink-50/60 border border-pink-100 p-3 rounded-2xl flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase text-pink-600 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Teste com 1 clique (Exemplos Prontos):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_VIDEO_LINKS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewMediaUrl(sample.url);
                        setNewTitle(sample.title);
                        setNewCategory(sample.category as any);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-pink-600 hover:text-white text-gray-700 text-[11px] font-semibold rounded-lg border border-pink-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleCreateTemplate} className="flex flex-col gap-4">
              
              {addModalTab === 'link' ? (
                /* VIDEO URL INPUT WITH LIVE COVER EXTRACTION */
                <div>
                  <label className="text-[11px] font-extrabold text-gray-800 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-pink-600" /> Link do Instagram / TikTok / YouTube / Vídeo
                    </span>
                    {isFetchingMeta ? (
                      <span className="text-[10px] text-pink-600 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Buscando capa real...
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ✓ Pronto
                      </span>
                    )}
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 focus-within:border-pink-500 rounded-xl px-3 py-2.5 mt-1.5">
                    <input 
                      type="url" 
                      placeholder="https://www.instagram.com/reel/... ou https://www.tiktok.com/@..." 
                      value={newMediaUrl} 
                      onChange={e => setNewMediaUrl(e.target.value)}
                      required={addModalTab === 'link'}
                      className="w-full bg-transparent text-xs font-medium text-gray-900 focus:outline-hidden"
                    />
                    {newMediaUrl && (
                      <button
                        type="button"
                        onClick={() => setNewMediaUrl("")}
                        className="text-gray-400 hover:text-gray-600 text-xs font-bold ml-1 cursor-pointer"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* DIRECT IMAGE UPLOAD BOX */
                <div>
                  <label className="text-[11px] font-extrabold text-gray-800 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-pink-600" /> Selecionar Arquivo de Capa (PNG, JPG, WebP)
                    </span>
                  </label>
                  <label className="mt-1.5 flex flex-col items-center justify-center border-2 border-dashed border-pink-200 hover:border-pink-500 bg-pink-50/30 hover:bg-pink-50/60 p-6 rounded-2xl transition-all cursor-pointer group text-center">
                    <Upload className="w-8 h-8 text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-gray-800">Clique para selecionar imagem do dispositivo</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Suporta imagens em alta definição e capas personalizadas</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUploadImageFile}
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {/* LIVE COVER (THUMBNAIL) PREVIEW BOX */}
              {(newMediaUrl || newCustomThumbnail || serverThumbnail) && (
                <div className="bg-[#180f1e] rounded-2xl p-3 border border-pink-950/60 flex flex-col gap-2.5 text-white">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold flex items-center gap-1.5 text-pink-400">
                      <Eye className="w-3.5 h-3.5" /> Pré-visualização da Capa:
                    </span>
                    <span className="px-2 py-0.5 bg-pink-600 text-white rounded-md text-[10px] font-black uppercase">
                      {extractedInfo.sourceLabel || 'Capa Carregada'}
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-gray-800">
                    {/* Real Extracted Image Cover */}
                    {newCustomThumbnail || serverThumbnail || extractedInfo.thumbnailUrl ? (
                      <img 
                        src={newCustomThumbnail || serverThumbnail || extractedInfo.thumbnailUrl} 
                        alt="Capa"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentSrc = newCustomThumbnail || serverThumbnail || extractedInfo.thumbnailUrl;
                          if (currentSrc.startsWith('http') && !target.src.includes('/api/media/proxy-image')) {
                            target.src = `/api/media/proxy-image?url=${encodeURIComponent(currentSrc)}`;
                          }
                        }}
                      />
                    ) : extractedInfo.source === 'instagram' ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center gap-2">
                        <div className="p-3 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 rounded-2xl shadow-lg">
                          <Film className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-xs font-black text-white">Reels do Instagram Conectado</span>
                      </div>
                    ) : extractedInfo.source === 'direct_video' ? (
                      <video 
                        src={extractedInfo.videoUrl} 
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <ImageIcon className="w-8 h-8 text-pink-400" />
                        <span className="text-xs">Capa pronta para salvar</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> Capa vinculada com sucesso
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Título da Capa / Modelo</label>
                  <input 
                    type="text" 
                    placeholder="ex: Roteiro Viral para Reels / Capa Promocional" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-pink-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Categoria</label>
                  <select 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-pink-500"
                  >
                    <option value="reels">🎬 Reels & Vídeos</option>
                    <option value="carrossel">📊 Carrosséis & Imagens</option>
                    <option value="minhas_publicacoes">📌 Minha Publicação Salva</option>
                    <option value="copy">⚡ Modelos de Copy</option>
                    <option value="oferta">🎯 Oferta & Lançamento</option>
                    <option value="quote">☕ Inspiração & Quote</option>
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center justify-between">
                  <span>Legenda / Texto da Publicação (Opcional)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Preenchimento automático se vazio</span>
                </label>
                <textarea 
                  rows={3}
                  placeholder="Escreva a legenda com ganchos, corpo do texto e hashtags..." 
                  value={newCaption} 
                  onChange={e => setNewCaption(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-xs focus:outline-pink-500 leading-relaxed font-medium"
                />
              </div>

              {/* Engagement Tip & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Dica de Engajamento</label>
                  <input 
                    type="text" 
                    placeholder="ex: Prender atenção nos 3 primeiros segundos..." 
                    value={newTip} 
                    onChange={e => setNewTip(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-pink-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Tags (separadas por vírgula)</label>
                  <input 
                    type="text" 
                    placeholder="viral, dicas, reels, capa" 
                    value={newTags} 
                    onChange={e => setNewTags(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-pink-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer hover:scale-102 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar na Biblioteca de Capas</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FULL RESOLUTION IMAGE LIGHTBOX MODAL */}
      {activeImageLightbox && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveImageLightbox(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white pb-2">
              <span className="text-sm font-bold truncate max-w-md">{activeImageLightbox.title}</span>
              <div className="flex items-center gap-2">
                <a
                  href={activeImageLightbox.url}
                  download="capa-publicacao.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Capa</span>
                </a>
                <button
                  onClick={() => setActiveImageLightbox(null)}
                  className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black flex items-center justify-center max-h-[80vh]">
              <img 
                src={activeImageLightbox.url} 
                alt={activeImageLightbox.title} 
                className="max-h-[80vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1c0f24] text-white rounded-3xl p-5 max-w-2xl w-full shadow-2xl border border-pink-900/40 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#2f1737]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 text-pink-400 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-pink-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">
                    {activeVideoModal.title}
                  </h3>
                  <span className="text-[10px] text-pink-300 uppercase font-mono">
                    {activeVideoModal.categoryLabel}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setActiveVideoModal(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center shadow-inner">
              {(() => {
                const targetUrl = activeVideoModal.videoUrl || activeVideoModal.mediaUrl || '';
                const parsed = parseMediaUrl(targetUrl);
                const isInstagram = /instagram\.com/i.test(targetUrl);
                const isTikTok = /tiktok\.com/i.test(targetUrl);

                if (parsed.source === 'youtube' && parsed.embedUrl) {
                  return (
                    <iframe
                      src={parsed.embedUrl}
                      title={activeVideoModal.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                } else if (isInstagram) {
                  const shortcodeMatch = targetUrl.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
                  const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';
                  const embedSrc = shortcode ? `https://www.instagram.com/reel/${shortcode}/embed` : targetUrl;
                  
                  return (
                    <iframe
                      src={embedSrc}
                      title={activeVideoModal.title}
                      className="w-full h-full border-0 bg-white"
                      allowTransparency={true}
                    />
                  );
                } else if (isTikTok) {
                  return (
                    <div className="flex flex-col items-center justify-center p-6 text-center gap-3 w-full h-full bg-gradient-to-b from-gray-900 to-black">
                      {activeVideoModal.thumbnailUrl ? (
                        <img 
                          src={activeVideoModal.thumbnailUrl} 
                          alt={activeVideoModal.title} 
                          className="absolute inset-0 w-full h-full object-cover opacity-40" 
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="p-3.5 bg-black border border-gray-700 rounded-2xl shadow-xl">
                          <Film className="w-10 h-10 text-cyan-400" />
                        </div>
                        <span className="text-sm font-black text-white">Vídeo do TikTok</span>
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Assistir Vídeo no TikTok</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>
                      </div>
                    </div>
                  );
                } else if (parsed.videoUrl && (parsed.videoUrl.endsWith('.mp4') || parsed.videoUrl.endsWith('.webm') || parsed.source === 'direct_video')) {
                  return (
                    <video
                      src={parsed.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center p-6 text-center gap-3 w-full h-full bg-[#150a1a]">
                      {activeVideoModal.thumbnailUrl && (
                        <img 
                          src={activeVideoModal.thumbnailUrl} 
                          alt={activeVideoModal.title} 
                          className="absolute inset-0 w-full h-full object-cover opacity-50" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Abrir e Assistir Vídeo Original</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Quick Open in Original Platform Link */}
            {activeVideoModal.videoUrl && (
              <div className="flex items-center justify-between bg-black/40 px-4 py-2.5 rounded-xl border border-white/5">
                <span className="text-[11px] text-gray-300 truncate max-w-sm font-mono">
                  {activeVideoModal.videoUrl}
                </span>
                <a
                  href={activeVideoModal.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Abrir no App / Navegador</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Video Caption & Script */}
            <div className="bg-[#150a1a] p-4 rounded-2xl border border-[#2f1737]">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-1.5">
                Roteiro & Legenda do Vídeo
              </span>
              <p className="text-xs text-gray-200 whitespace-pre-line leading-relaxed">
                {activeVideoModal.caption}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeVideoModal.caption);
                  showNotification("Legenda copiada com sucesso!", "success");
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Legenda</span>
              </button>

              <button
                onClick={() => {
                  handleApplyToScheduler(activeVideoModal);
                  setActiveVideoModal(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar com Esta Capa & Roteiro</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
