import React, { useState, useEffect } from "react";
import { SocialPost } from "../types";
import { 
  X, 
  Instagram, 
  Plus, 
  Sparkles, 
  Smile, 
  Hash, 
  MapPin, 
  Link2, 
  Eye, 
  Calendar, 
  Clock, 
  ChevronDown, 
  AlertTriangle, 
  Check, 
  Smartphone, 
  Monitor, 
  Video, 
  Image as ImageIcon,
  Flame,
  Wand2,
  ThumbsUp,
  MessageCircle,
  Send,
  MoreHorizontal,
  Music,
  Info,
  ChevronUp,
  AlertCircle
} from "lucide-react";

interface PostCreatorModalProps {
  post: SocialPost | null; // null if creating new post
  onClose: () => void;
  onSave: (post: SocialPost) => void;
  defaultTime?: string;
  defaultDate?: string;
}

const PRESET_MEDIAS = [
  { id: 'm1', name: 'Trabalho Criativo', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=800&fit=crop', type: 'video' },
  { id: 'm2', name: 'Sucesso nos Negócios', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop', type: 'video' },
  { id: 'm3', name: 'Espaço de Criação', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop', type: 'video' },
  { id: 'm4', name: 'Planejamento Semanal', url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=800&fit=crop', type: 'image' },
  { id: 'm5', name: 'Foco e Café', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop', type: 'image' }
];

export default function PostCreatorModal({
  post,
  onClose,
  onSave,
  defaultTime = "10:00",
  defaultDate = new Date().toISOString().split('T')[0]
}: PostCreatorModalProps) {
  // Post States
  const [caption, setCaption] = useState(post ? post.caption : "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<('instagram' | 'tiktok' | 'facebook' | 'youtube')[]>(
    post ? post.platforms : ['instagram', 'tiktok']
  );
  const [postDate, setPostDate] = useState(post ? post.date : defaultDate);
  const [postTime, setPostTime] = useState(post ? post.time : defaultTime);
  const [mediaUrl, setMediaUrl] = useState(post ? post.mediaUrl || PRESET_MEDIAS[0].url : PRESET_MEDIAS[0].url);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(post ? post.mediaType || 'video' : 'video');
  const [postStatus, setPostStatus] = useState<'scheduled' | 'draft'>(post ? (post.status as any) : 'scheduled');
  const [destinations, setDestinations] = useState<('feed' | 'story')[]>(
    post && post.destinations ? post.destinations : ['feed', 'story']
  );

  // Custom uploaded media state
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'image' | 'video'; name: string } | null>(() => {
    if (post && post.mediaUrl && !PRESET_MEDIAS.some(p => p.url === post.mediaUrl)) {
      return {
        url: post.mediaUrl,
        type: post.mediaType || 'video',
        name: 'Mídia Customizada'
      };
    }
    return null;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const fileType = isVideo ? 'video' : 'image';
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      setUploadedMedia({
        url: resultUrl,
        type: fileType,
        name: file.name
      });
      setMediaUrl(resultUrl);
      setMediaType(fileType);
    };
    reader.readAsDataURL(file);
  };

  // Preview States
  const [previewPlatform, setPreviewPlatform] = useState<'instagram' | 'tiktok'>('instagram');
  const [previewMode, setPreviewMode] = useState<'phone' | 'desktop'>('phone');

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("Engajado e Criativo");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ hashtags: string[]; hooks: string[] } | null>(null);
  const [aiError, setAiError] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Errors / Warnings
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showErrorPanel, setShowErrorPanel] = useState(true);

  // Live Publishing Console States
  const [publishingLogs, setPublishingLogs] = useState<string[] | null>(null);
  const [isPublishingNow, setIsPublishingNow] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean | null>(null);

  // Character Limit validation
  const charLimit = previewPlatform === 'tiktok' ? 2000 : 2200;

  useEffect(() => {
    // Validate rules
    const tempErrors = [];
    const tempWarnings = [];

    if (selectedPlatforms.length === 0) {
      tempErrors.push("Selecione pelo menos uma rede social para publicar.");
    }
    if (!caption.trim()) {
      tempWarnings.push("A legenda está vazia. Adicionar texto melhora o engajamento.");
    }
    if (caption.length > charLimit) {
      tempErrors.push(`A legenda excede o limite de caracteres para ${previewPlatform === 'tiktok' ? 'TikTok' : 'Instagram'} (${charLimit}).`);
    }
    if (!mediaUrl) {
      tempErrors.push("Adicione pelo menos imagem ou vídeo para publicar no Reels/TikTok.");
    }

    setErrors(tempErrors);
    setWarnings(tempWarnings);
  }, [caption, selectedPlatforms, mediaUrl, previewPlatform]);

  // Handle caption updates from inputs
  const handleCaptionChange = (val: string) => {
    if (val.length <= 2200) {
      setCaption(val);
    }
  };

  // Toggle platform select
  const togglePlatform = (p: 'instagram' | 'tiktok' | 'facebook' | 'youtube') => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  // call fullstack AI assistant route
  const handleGenerateAiCaption = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Por favor, digite um tema ou palavra-chave para a IA.");
      return;
    }

    setAiGenerating(true);
    setAiError("");
    setAiSuggestions(null);

    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          tone: aiTone,
          networks: selectedPlatforms
        })
      });

      if (!res.ok) {
        throw new Error("Não foi possível gerar conteúdo com a inteligência artificial.");
      }

      const data = await res.json();
      setCaption(data.caption);
      setAiSuggestions({
        hashtags: data.hashtags || [],
        hooks: data.hooks || []
      });
    } catch (err: any) {
      setAiError(err.message || "Ocorreu um erro ao chamar o assistente do Gemini.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyHashtag = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!caption.includes(cleanTag)) {
      setCaption(prev => `${prev} ${cleanTag}`);
    }
  };

  const handleApplyHook = (hook: string) => {
    setCaption(prev => `${hook}\n\n${prev}`);
  };

  const handlePublishNow = async () => {
    if (errors.length > 0) {
      alert("Por favor, corrija os erros pendentes antes de publicar.");
      return;
    }

    setIsPublishingNow(true);
    setPublishingLogs(["[" + new Date().toLocaleTimeString('pt-BR') + "] Conectando ao canal de publicação SocialFlow..."]);
    setPublishSuccess(null);

    // Retrieve active channels credentials
    let webhookUrl = "";
    let metaAccessToken = "";
    let instagramPageId = "";

    try {
      const saved = localStorage.getItem("socialflow_channels");
      if (saved) {
        const channels = JSON.parse(saved);
        // Find credentials for any of our selected platforms
        const activeCh = channels.find((c: any) => c.connected && selectedPlatforms.includes(c.id));
        if (activeCh) {
          if (activeCh.webhookUrl) webhookUrl = activeCh.webhookUrl;
          if (activeCh.metaAccessToken) metaAccessToken = activeCh.metaAccessToken;
          if (activeCh.instagramPageId) instagramPageId = activeCh.instagramPageId;
        }
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await fetch("/api/social/publish-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          mediaUrl,
          platforms: selectedPlatforms,
          webhookUrl,
          metaAccessToken,
          instagramPageId
        })
      });

      const data = await res.json();
      setPublishingLogs(data.logs || ["Erro ao recuperar logs do servidor."]);
      setPublishSuccess(data.success);

      if (data.success) {
        // Also save the post state locally as published
        const savedPost: SocialPost = {
          id: post ? post.id : `post-${Date.now()}`,
          caption,
          platforms: selectedPlatforms,
          date: postDate,
          time: postTime,
          mediaUrl,
          mediaType,
          status: 'published',
          bestTimeScore: post ? post.bestTimeScore : 98
        };
        // wait 3 seconds before closing or saving
        setTimeout(() => {
          onSave(savedPost);
        }, 3000);
      }
    } catch (err: any) {
      setPublishingLogs(prev => [...(prev || []), `[Erro] Falha de comunicação: ${err.message}`]);
      setPublishSuccess(false);
    } finally {
      setIsPublishingNow(false);
    }
  };

  const handleSubmit = () => {
    if (errors.length > 0) {
      alert("Por favor, corrija os erros pendentes antes de salvar.");
      return;
    }

    const savedPost: SocialPost = {
      id: post ? post.id : `post-${Date.now()}`,
      caption,
      platforms: selectedPlatforms,
      destinations: destinations,
      date: postDate,
      time: postTime,
      mediaUrl,
      mediaType,
      status: postStatus === 'draft' ? 'draft' : 'scheduled',
      bestTimeScore: post ? post.bestTimeScore : 85
    };

    onSave(savedPost);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-[#f8f9fa] w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl flex flex-col xl:flex-row max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Creation Form (Scrollable) */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto flex flex-col gap-6 max-h-[96vh] xl:max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {post ? "Editar publicação agendada" : "Criar nova publicação"}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-900 font-semibold text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>

          {/* Social Platform Selectors */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Publicar em:</label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => togglePlatform('instagram')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all shadow-2xs ${
                  selectedPlatforms.includes('instagram')
                    ? 'bg-gradient-to-tr from-yellow-500/10 via-pink-500/10 to-purple-600/10 border-pink-400 text-pink-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram Reels</span>
              </button>

              <button
                type="button"
                onClick={() => togglePlatform('tiktok')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all shadow-2xs ${
                  selectedPlatforms.includes('tiktok')
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-mono text-xs font-bold">TikTok</span>
                <span>TikTok Video</span>
              </button>

              <button
                type="button"
                onClick={() => togglePlatform('facebook')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all shadow-2xs ${
                  selectedPlatforms.includes('facebook')
                    ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-sans font-bold text-blue-600 text-xs">f</span>
                <span>Facebook Pages</span>
              </button>

              <button
                type="button"
                onClick={() => togglePlatform('youtube')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all shadow-2xs ${
                  selectedPlatforms.includes('youtube')
                    ? 'bg-red-50 border-red-400 text-red-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-sans font-bold text-red-600 text-xs">Y</span>
                <span>YouTube Shorts</span>
              </button>
            </div>
          </div>

          {/* Formatos de Publicação (Feed & Story) */}
          <div className="flex flex-col gap-2 bg-pink-50/20 p-4 rounded-2xl border border-pink-100/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>📍 Formatos de Destino:</span>
              </label>
              <span className="text-[10px] text-pink-600 font-bold bg-white px-2 py-0.5 rounded-full border border-pink-100">Configuração de canais</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => {
                  if (destinations.includes('feed')) {
                    if (destinations.length > 1) {
                      setDestinations(destinations.filter(d => d !== 'feed'));
                    }
                  } else {
                    setDestinations([...destinations, 'feed']);
                  }
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs md:text-sm font-semibold transition-all shadow-3xs cursor-pointer ${
                  destinations.includes('feed')
                    ? 'bg-pink-600 border-pink-600 text-white font-bold'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  destinations.includes('feed') ? 'border-white bg-white text-pink-600' : 'border-gray-300 bg-white'
                }`}>
                  {destinations.includes('feed') && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>Publicar no Feed</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (destinations.includes('story')) {
                    if (destinations.length > 1) {
                      setDestinations(destinations.filter(d => d !== 'story'));
                    }
                  } else {
                    setDestinations([...destinations, 'story']);
                  }
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs md:text-sm font-semibold transition-all shadow-3xs cursor-pointer ${
                  destinations.includes('story')
                    ? 'bg-pink-600 border-pink-600 text-white font-bold'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  destinations.includes('story') ? 'border-white bg-white text-pink-600' : 'border-gray-300 bg-white'
                }`}>
                  {destinations.includes('story') && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>Publicar nos Stories</span>
              </button>
            </div>
          </div>

          {/* Media selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mídia do Post (Vídeo ou Imagem):</label>
              <span className="text-[10px] text-pink-600 font-semibold bg-pink-50 px-2 py-0.5 rounded-md">Suporta MP4, WebM, PNG, JPG</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {/* Local File Upload Box */}
              <label
                htmlFor="media-upload-input"
                className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 hover:border-pink-500 bg-white hover:bg-pink-50/20 rounded-2xl h-24 p-2 cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center">
                  <Plus className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[10px] font-bold text-gray-700 group-hover:text-pink-600 text-center">Fazer Upload</span>
                  <span className="text-[8px] text-gray-400 text-center mt-0.5">Imagem ou Vídeo</span>
                </div>
                <input
                  type="file"
                  id="media-upload-input"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Custom File Preview Card if active */}
              {uploadedMedia && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl(uploadedMedia.url);
                    setMediaType(uploadedMedia.type);
                  }}
                  className={`group relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    mediaUrl === uploadedMedia.url ? 'border-pink-500 ring-2 ring-pink-500/15 scale-[0.98]' : 'border-transparent opacity-80 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  {uploadedMedia.type === 'video' ? (
                    <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                      <video src={uploadedMedia.url} className="w-full h-full object-cover" muted playsInline />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  ) : (
                    <img src={uploadedMedia.url} alt="Uploaded preview" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-pink-600/95 py-1 px-1.5 text-center">
                    <p className="text-[9px] text-white font-extrabold truncate">Sua Mídia</p>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/60 p-1 rounded-md">
                    {uploadedMedia.type === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                  </div>
                </button>
              )}

              {PRESET_MEDIAS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => {
                    setMediaUrl(preset.url);
                    setMediaType(preset.type as any);
                  }}
                  className={`group relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    mediaUrl === preset.url ? 'border-pink-500 ring-2 ring-pink-500/15 scale-[0.98]' : 'border-transparent opacity-80 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 px-1.5 text-center">
                    <p className="text-[10px] text-white font-medium truncate">{preset.name}</p>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/40 p-1 rounded-md">
                    {preset.type === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Caption Editor */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Legenda da publicação</label>
              <button
                type="button"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-xs font-semibold hover:from-pink-600 hover:to-purple-700 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assistente de Copywriting IA</span>
              </button>
            </div>

            {/* AI Generation Extended Panel */}
            {showAiPanel && (
              <div className="bg-gradient-to-r from-purple-50/70 via-pink-50/50 to-white border border-purple-100 p-4 rounded-2xl shadow-inner flex flex-col gap-3 animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-purple-600" />
                      <span>Gerador de Legenda Inteligente (Gemini AI)</span>
                    </h4>
                    <p className="text-xs text-gray-500">Crie copys profissionais otimizadas para engajamento em poucos segundos.</p>
                  </div>
                  <button type="button" onClick={() => setShowAiPanel(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Como planejar conteúdo semanal em 1 hora e vender mais..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-2xs"
                  />
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden text-gray-700"
                  >
                    <option>Engajado e Criativo</option>
                    <option>Profissional e Autoritário</option>
                    <option>Divertido e Humorado</option>
                    <option>Curto e Direto (Storytelling)</option>
                    <option>Educativo e Técnico</option>
                  </select>

                  <button
                    type="button"
                    disabled={aiGenerating}
                    onClick={handleGenerateAiCaption}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    {aiGenerating ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Gerar Legenda</span>
                  </button>
                </div>

                {aiError && <p className="text-xs text-red-500 font-semibold">{aiError}</p>}

                {/* AI Suggestions Hooks & Hashtags */}
                {aiSuggestions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 border-t border-purple-100 pt-3">
                    <div>
                      <p className="text-xs font-bold text-purple-700 mb-1.5 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Ganchos Sugeridos (Insira no topo do post):</span>
                      </p>
                      <div className="flex flex-col gap-1">
                        {aiSuggestions.hooks.map((hook, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplyHook(hook)}
                            className="text-left text-xs bg-white hover:bg-purple-50 p-2 border border-purple-50 hover:border-purple-200 rounded-lg text-gray-700 font-medium transition-colors line-clamp-1 truncate"
                          >
                            ⚡ {hook}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-pink-700 mb-1.5 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5" />
                        <span>Hashtags Recomendadas (Toque para inserir):</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {aiSuggestions.hashtags.map((tag, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplyHashtag(tag)}
                            className="text-xs bg-white hover:bg-pink-50 px-2 py-1 border border-pink-100 rounded-lg text-pink-700 font-semibold transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Textarea caption editor */}
            <div className="border border-gray-200 rounded-2xl bg-white shadow-xs focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 overflow-hidden">
              <textarea
                value={caption}
                onChange={(e) => handleCaptionChange(e.target.value)}
                placeholder="Escreva a legenda da publicação..."
                rows={6}
                className="w-full p-4 border-0 text-sm focus:outline-hidden text-gray-800 resize-y"
              />

              {/* Textarea Footer Controls */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-gray-500">
                <div className="flex items-center gap-3">
                  <button type="button" className="p-1 hover:text-gray-900 transition-colors" title="Adicionar Emoji">
                    <Smile className="w-4.5 h-4.5" />
                  </button>
                  <button type="button" className="p-1 hover:text-gray-900 transition-colors" title="Inserir Hashtag">
                    <Hash className="w-4.5 h-4.5" />
                  </button>
                  <button type="button" className="p-1 hover:text-gray-900 transition-colors" title="Inserir Localização">
                    <MapPin className="w-4.5 h-4.5" />
                  </button>
                  <button type="button" className="p-1 hover:text-gray-900 transition-colors" title="SmartLinks">
                    <Link2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold font-mono">
                  <span>{caption.split('#').length - 1} / 30 #</span>
                  <span className={caption.length > charLimit ? "text-red-500" : "text-gray-400"}>
                    {caption.length} / {charLimit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Presets Toggle Panel Accordions */}
          <div className="flex flex-col gap-2">
            <div className="border border-gray-200 rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-pink-50 text-pink-600 rounded-lg">
                    <Instagram className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Predefinições do Instagram</h4>
                    <p className="text-xs text-gray-500">Configurações para Reels e feed.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-gray-100 text-gray-900 rounded-lg">
                    <Video className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">TikTok presets</h4>
                    <p className="text-xs text-gray-500">Autorizar dueto, costura e comentários.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Alerts / Error Panel */}
          {(errors.length > 0 || warnings.length > 0) && (
            <div className="border border-red-200 bg-red-50/50 rounded-2xl p-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowErrorPanel(!showErrorPanel)}
                className="flex items-center justify-between w-full text-red-800 font-bold text-sm"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
                  <span>{errors.length} erro & {warnings.length} avisos</span>
                </div>
                <ChevronUp className={`w-4 h-4 text-red-600 transition-transform ${showErrorPanel ? "" : "rotate-180"}`} />
              </button>

              {showErrorPanel && (
                <div className="flex flex-col gap-1.5 pl-6.5 mt-1.5 text-xs text-red-700">
                  {errors.map((err, i) => (
                    <div key={`err-${i}`} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      <span>{err}</span>
                    </div>
                  ))}
                  {warnings.map((warn, i) => (
                    <div key={`warn-${i}`} className="flex items-center gap-1.5 text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scheduling Date Time Controls Footer */}
          <div className="border-t border-gray-100 pt-5 mt-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Pickers */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={postDate}
                  onChange={(e) => setPostDate(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-hidden"
                />
              </div>

              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={postTime}
                  onChange={(e) => setPostTime(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-hidden"
                />
              </div>

              <select
                value={postStatus}
                onChange={(e) => setPostStatus(e.target.value as any)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-hidden"
              >
                <option value="scheduled">Agendar publicação</option>
                <option value="draft">Salvar como rascunho</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm rounded-xl transition-colors bg-white shadow-2xs"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isPublishingNow}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>🚀 Publicar Agora</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-[#1f1323] hover:bg-[#2d1e32] text-white font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 text-pink-400" />
                <span>{post ? "Salvar alterações" : "Confirmar Agendamento"}</span>
              </button>
            </div>
          </div>

          {/* Live Publishing Terminal Overlay */}
          {publishingLogs !== null && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-950 text-emerald-400 w-full max-w-lg rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-4 font-mono select-none">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-xs font-bold text-slate-400 ml-2">Console de Publicação Real-Time</span>
                  </div>
                  {(!isPublishingNow || publishSuccess !== null) && (
                    <button 
                      onClick={() => setPublishingLogs(null)}
                      className="text-xs text-slate-400 hover:text-white border border-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Fechar Console
                    </button>
                  )}
                </div>

                <div className="bg-black/40 p-4 rounded-xl flex-1 min-h-[160px] max-h-[300px] overflow-y-auto text-[11px] leading-relaxed flex flex-col gap-1.5 scrollbar-thin text-left">
                  {publishingLogs.map((log, index) => (
                    <div key={index} className={log.includes("❌") ? "text-red-400" : log.includes("✓") ? "text-emerald-300 font-bold" : "text-slate-300"}>
                      {log}
                    </div>
                  ))}
                  {isPublishingNow && (
                    <div className="text-yellow-400 font-semibold animate-pulse flex items-center gap-2 mt-1">
                      <span className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
                      <span>Processando publicação de forma segura...</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
                  {publishSuccess === true && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-400 text-xs flex items-start gap-2.5 text-left">
                      <span className="text-base">🎉</span>
                      <div>
                        <p className="font-bold">Publicação Concluída!</p>
                        <p className="text-[10px] text-emerald-500/80 mt-0.5">Seus webhooks e disparadores foram acionados. Redirecionando em 3s...</p>
                      </div>
                    </div>
                  )}

                  {publishSuccess === false && (
                    <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs flex items-start gap-2.5 text-left">
                      <span className="text-base">⚠️</span>
                      <div>
                        <p className="font-bold">Falha na Publicação Direta</p>
                        <p className="text-[10px] text-red-500/80 mt-0.5">Verifique se o seu URL de Webhook ou chaves de acesso do Facebook Graph estão corretos.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {(!isPublishingNow || publishSuccess !== null) && (
                      <button
                        onClick={() => setPublishingLogs(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Concluído
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Smartphone Live Preview Simulator Panel */}
        <div className="w-full xl:w-[460px] bg-[#eceeef] border-l border-gray-200 p-6 flex flex-col gap-4 items-center justify-center max-h-[96vh] select-none">
          
          {/* Preview Header controls */}
          <div className="flex items-center justify-between w-full pb-2">
            {/* Tabs Platform selectors */}
            <div className="flex items-center bg-gray-200 border border-gray-200/50 rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => setPreviewPlatform('instagram')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  previewPlatform === 'instagram'
                    ? 'bg-white text-pink-600 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram</span>
              </button>
              <button
                onClick={() => setPreviewPlatform('tiktok')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  previewPlatform === 'tiktok'
                    ? 'bg-black text-white shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>TikTok</span>
              </button>
            </div>

            {/* Layout device frame togglers */}
            <div className="flex items-center bg-gray-200 rounded-xl p-0.5 border border-gray-200/50">
              <button
                onClick={() => setPreviewMode('phone')}
                className={`p-1.5 rounded-lg transition-all ${previewMode === 'phone' ? 'bg-white text-gray-800 shadow-3xs' : 'text-gray-400'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white text-gray-800 shadow-3xs' : 'text-gray-400'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smartphone Shell Frame Frame */}
          <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-black rounded-[48px] p-3 shadow-2xl border-[6px] border-gray-800 ring-10 ring-gray-900/10 flex flex-col overflow-hidden">
            {/* Notch Speaker */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
              <div className="w-10 h-1 bg-gray-800 rounded-full mb-1"></div>
            </div>

            {/* Simulator Inner Content viewport */}
            <div className="w-full h-full bg-[#111] rounded-[38px] overflow-hidden relative flex flex-col justify-between text-white">
              
              {/* Simulator Post Media Backdrop layer */}
              {mediaUrl ? (
                mediaType === 'video' ? (
                  <video 
                    src={mediaUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] select-none pointer-events-none"
                  />
                ) : (
                  <img 
                    src={mediaUrl} 
                    alt="Post preview frame" 
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-black flex items-center justify-center">
                  <span className="text-xs text-gray-400 font-semibold uppercase">Sem mídia</span>
                </div>
              )}

              {/* Viewport UI - Top Bar header overlay */}
              <div className="w-full px-5 pt-8 pb-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10 text-[11px] font-semibold text-gray-100 select-none">
                <span>01:56</span>
                <div className="flex flex-col items-center gap-1">
                  {previewPlatform === 'instagram' ? (
                    <span className="font-bold tracking-tight text-[12px]">Reels</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 font-bold border-b-2 border-white pb-0.5">Seguindo</span>
                      <span className="font-bold pb-0.5">Para Você</span>
                    </div>
                  )}
                  {/* Destinations mini badges */}
                  <div className="flex gap-1.5 justify-center">
                    {destinations.map(dest => (
                      <span key={dest} className="text-[7px] bg-pink-600 text-white font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                        {dest === 'feed' ? 'Feed' : 'Story'}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-5 h-2.5 bg-white/20 rounded-xs flex items-center justify-end px-0.5">
                  <div className="w-3.5 h-1.5 bg-white rounded-xs"></div>
                </div>
              </div>

              {/* Viewport UI - Right Floating Social interaction indicators */}
              <div className="absolute right-3.5 bottom-28 flex flex-col items-center gap-4 z-20 text-white select-none">
                {previewPlatform === 'tiktok' && (
                  <div className="relative mb-1">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop"
                      className="w-9 h-9 rounded-full border border-white"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">+</span>
                  </div>
                )}

                <div className="flex flex-col items-center gap-0.5 group">
                  <div className="w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer">
                    <ThumbsUp className="w-5 h-5 text-white fill-white/10" />
                  </div>
                  <span className="text-[10px] font-bold font-mono">2.4k</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold font-mono">480</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer">
                    <Send className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold font-mono">120</span>
                </div>

                <div className="w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </div>

                {/* Spinning audio disc widget */}
                <div className="w-8 h-8 rounded-full border-[3px] border-zinc-800 bg-zinc-950 flex items-center justify-center animate-spin duration-3000">
                  <div className="w-4 h-4 bg-gradient-to-tr from-pink-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <Music className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Viewport UI - Bottom Caption Text scrolling overlays */}
              <div className="w-full px-4 pb-8 pt-6 bg-gradient-to-t from-black via-black/50 to-transparent z-10 flex flex-col gap-1.5 select-none text-left">
                
                {/* Username */}
                <div className="flex items-center gap-1.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop"
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[11px] font-bold tracking-tight">alberth.borges</span>
                  <span className="text-[9px] bg-white/20 text-white font-semibold px-1.5 py-0.5 rounded-[4px] scale-90">Seguir</span>
                </div>

                {/* Real-time description stream */}
                <div className="max-h-[70px] overflow-hidden text-[11px] leading-relaxed pr-10 text-gray-100">
                  <p className="line-clamp-3">
                    {caption || "Sua legenda de alta performance aparecerá aqui em tempo real. Adicione hashtags e ganchos para simular..."}
                  </p>
                </div>

                {/* Audio track detail bar */}
                <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-300">
                  <Music className="w-3 h-3 text-cyan-300 shrink-0" />
                  <span className="font-semibold tracking-wide truncate max-w-[140px] animate-pulse">
                    alberth.borges • Áudio Original
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Info Disclaimer bar */}
          <div className="flex items-start gap-2 max-w-[340px] bg-blue-50/80 border border-blue-100 p-3 rounded-2xl text-[11px] text-blue-700 leading-normal font-medium">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Prê-visualizações são uma aproximação de como será a sua publicação quando for publicada. A publicação final pode parecer um pouco diferente.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
