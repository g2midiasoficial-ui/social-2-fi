import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Video, 
  Link as LinkIcon, 
  Layers, 
  Copy, 
  Check, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw, 
  FolderHeart, 
  ArrowRight, 
  Zap, 
  Eye, 
  Flame, 
  RefreshCw, 
  Clock, 
  Hash, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Save, 
  Download, 
  Share2, 
  Maximize2, 
  Sliders, 
  ExternalLink,
  Plus,
  CheckCircle2,
  FileText,
  Smartphone,
  Volume2,
  Tv,
  ListTodo
} from "lucide-react";
import { MultipliedVideoVariation, ViralMultiplierProject, SocialPost } from "../types";

interface ViralVideoMultiplierProps {
  onSchedulePost: (postData: {
    caption: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    platforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
    date?: string;
    time?: string;
  }) => void;
  onBatchSchedulePosts?: (newPosts: SocialPost[]) => void;
  onSendToTrello?: (cardData: {
    title: string;
    description: string;
    caption: string;
    tag: string;
  }) => void;
  showNotification: (msg: string, type: 'success' | 'info') => void;
  initialTopic?: string;
}

const PRESET_TOPICS = [
  {
    title: "Vendas no Direct sem Gastar em Anúncios",
    niche: "Marketing & Vendas",
    category: "Vendas",
    description: "Estratégia prática para transformar comentários e directs em clientes pagantes."
  },
  {
    title: "O Segredo da Retenção nos Primeiros 3 Segundos",
    niche: "Criação de Conteúdo",
    category: "Vídeos Virais",
    description: "Ganchos e quebras de padrão visuais que impedem o seguidor de rolar o feed."
  },
  {
    title: "Rotina de Produtividade Sem Sobrecarga",
    niche: "Produtividade & Hábitos",
    category: "Estilo de Vida",
    description: "Método de blocos de tempo para produzir em 4 horas o trabalho de uma semana."
  },
  {
    title: "Finanças Pessoais: Os 3 Erros dos 20 aos 40 Anos",
    niche: "Finanças & Investimentos",
    category: "Dinheiro",
    description: "Erros ocultos que impedem a criação de patrimônio e como corrigi-los hoje."
  },
  {
    title: "IA no Trabalho: Ferramentas que Substituem 10 Horas",
    niche: "Tecnologia & IA",
    category: "Inovação",
    description: "Prompts e fluxos práticos para acelerar entregas profissionais no dia a dia."
  }
];

const PSYCHOLOGICAL_ANGLES = [
  { id: "myth_bust", label: "⚡ Quebra de Mito & Erro", icon: "⚡", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "curiosity", label: "🔍 Curiosidade & Revelação", icon: "🔍", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "step_by_step", label: "🛠️ Passo a Passo (Save-Magnet)", icon: "🛠️", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "storytelling", label: "📖 Storytelling & Caso Real", icon: "📖", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "fomo", label: "⚠️ Medo de Ficar Para Trás", icon: "⚠️", color: "text-red-600 bg-red-50 border-red-200" },
  { id: "contrarian", label: "💡 Opinião Impopular / Contrarian", icon: "💡", color: "text-pink-600 bg-pink-50 border-pink-200" },
  { id: "challenge", label: "🧪 Desafio 7 Dias", icon: "🧪", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { id: "before_after", label: "🔄 Antes vs Depois", icon: "🔄", color: "text-cyan-600 bg-cyan-50 border-cyan-200" }
];

export default function ViralVideoMultiplier({
  onSchedulePost,
  onBatchSchedulePosts,
  onSendToTrello,
  showNotification,
  initialTopic = ""
}: ViralVideoMultiplierProps) {
  // Input State
  const [inputMode, setInputMode] = useState<'topic' | 'link' | 'transcript' | 'presets'>('topic');
  const [topicInput, setTopicInput] = useState(initialTopic || "Como criar conteúdos que convertem seguidores em clientes no direct");
  const [videoLinkInput, setVideoLinkInput] = useState("");
  const [transcriptInput, setTranscriptInput] = useState("");
  const [nicheInput, setNicheInput] = useState("Marketing Digital & Vendas");
  const [audienceInput, setAudienceInput] = useState("Criadores de conteúdo, autônomos e empreendedores");
  const [multiplierCount, setMultiplierCount] = useState<number>(5);
  const [selectedAngles, setSelectedAngles] = useState<string[]>(PSYCHOLOGICAL_ANGLES.map(a => a.id));
  
  // Generation & Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [currentVariations, setCurrentVariations] = useState<MultipliedVideoVariation[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [activeViewMode, setActiveViewMode] = useState<'cards' | 'table'>('cards');

  // Teleprompter Modal State
  const [teleprompterModalOpen, setTeleprompterModalOpen] = useState(false);
  const [teleprompterVariation, setTeleprompterVariation] = useState<MultipliedVideoVariation | null>(null);
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(1.5);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState(32);
  const [teleprompterMirror, setTeleprompterMirror] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const teleprompterScrollRef = useRef<HTMLDivElement>(null);

  // Expanded Script View Modal
  const [expandedVariation, setExpandedVariation] = useState<MultipliedVideoVariation | null>(null);

  // Batch Multi-Schedule Modal
  const [isBatchScheduleModalOpen, setIsBatchScheduleModalOpen] = useState(false);
  const [batchStartDate, setBatchStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [batchCadence, setBatchCadence] = useState<'1_per_day' | '2_per_day' | 'weekdays'>('1_per_day');
  const [batchTime, setBatchTime] = useState("18:30");
  const [batchPlatforms, setBatchPlatforms] = useState<('instagram' | 'tiktok' | 'facebook' | 'youtube')[]>(['instagram', 'tiktok']);

  // Saved Projects History
  const [savedProjects, setSavedProjects] = useState<ViralMultiplierProject[]>([]);
  const [isSavedProjectsDrawerOpen, setIsSavedProjectsDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Saved Projects on mount
  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = async () => {
    try {
      const res = await fetch("/api/viral-multiplier-projects");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSavedProjects(data);
          return;
        }
      }
    } catch (e) {}

    // Fallback to localStorage
    const saved = localStorage.getItem("socialflow_viral_multiplier_projects");
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {}
    }
  };

  const handleSaveProject = async () => {
    if (currentVariations.length === 0) return;

    const newProject: ViralMultiplierProject = {
      id: `proj-${Date.now()}`,
      title: projectTitle || `Multiplicação: ${topicInput.slice(0, 35)}...`,
      topic: topicInput,
      niche: nicheInput,
      sourceUrl: videoLinkInput || undefined,
      multiplierCount: currentVariations.length,
      createdAt: new Date().toLocaleDateString("pt-BR"),
      variations: currentVariations
    };

    const updated = [newProject, ...savedProjects];
    setSavedProjects(updated);
    localStorage.setItem("socialflow_viral_multiplier_projects", JSON.stringify(updated));

    try {
      await fetch("/api/viral-multiplier-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
    } catch (e) {}

    showNotification("✓ Projeto de Multiplicação Viral salvo no histórico!", "success");
  };

  const handleDeleteProject = async (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem("socialflow_viral_multiplier_projects", JSON.stringify(updated));

    try {
      await fetch(`/api/viral-multiplier-projects/${id}`, { method: "DELETE" });
    } catch (e) {}

    showNotification("Projeto excluído do histórico.", "info");
  };

  const handleLoadProject = (project: ViralMultiplierProject) => {
    setTopicInput(project.topic);
    setNicheInput(project.niche);
    setCurrentVariations(project.variations);
    setProjectTitle(project.title);
    setMultiplierCount(project.multiplierCount);
    setIsSavedProjectsDrawerOpen(false);
    showNotification(`Projeto "${project.title}" carregado com sucesso!`, "success");
  };

  // Toggle psychological angles filter
  const toggleAngle = (id: string) => {
    if (selectedAngles.includes(id)) {
      if (selectedAngles.length > 1) {
        setSelectedAngles(selectedAngles.filter(a => a !== id));
      }
    } else {
      setSelectedAngles([...selectedAngles, id]);
    }
  };

  // Run AI Video Multiplier
  const handleGenerateMultiplier = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const effectiveTopic = inputMode === 'link' ? videoLinkInput : inputMode === 'transcript' ? transcriptInput : topicInput;

    if (!effectiveTopic.trim()) {
      showNotification("Por favor, digite um tema, cole um link ou adicione um roteiro para multiplicar.", "info");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Analisando premissa central e ganchos de retenção...");

    try {
      setTimeout(() => setGenerationStep("Criando 8 ângulos de ataque psicológico (Mito, Curiosidade, FOMO)..."), 1000);
      setTimeout(() => setGenerationStep("Formatando roteiros com marcação de cena e teleprompter..."), 2200);

      const resp = await fetch("/api/ai/multiply-viral-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: effectiveTopic,
          videoUrl: inputMode === 'link' ? videoLinkInput : undefined,
          transcriptInput: inputMode === 'transcript' ? transcriptInput : undefined,
          niche: nicheInput,
          targetAudience: audienceInput,
          multiplierCount: multiplierCount,
          selectedAngles
        })
      });

      if (!resp.ok) throw new Error("Erro na requisição ao servidor");

      const data = await resp.json();
      if (data.variations && Array.isArray(data.variations)) {
        setCurrentVariations(data.variations);
        setProjectTitle(`Lote de ${data.variations.length} Vídeos Virais: ${effectiveTopic.slice(0, 35)}...`);
        showNotification(`⚡ Multiplicação concluída! ${data.variations.length} roteiros virais gerados com sucesso!`, "success");
      }
    } catch (err) {
      console.error(err);
      showNotification("Houve uma instabilidade ao gerar. Tente novamente.", "info");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Teleprompter Loop
  useEffect(() => {
    let interval: any = null;
    if (isTeleprompterPlaying && teleprompterScrollRef.current) {
      interval = setInterval(() => {
        if (teleprompterScrollRef.current) {
          teleprompterScrollRef.current.scrollTop += teleprompterSpeed;
          // Check if reached bottom
          if (
            teleprompterScrollRef.current.scrollTop + teleprompterScrollRef.current.clientHeight >=
            teleprompterScrollRef.current.scrollHeight - 20
          ) {
            setIsTeleprompterPlaying(false);
          }
        }
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isTeleprompterPlaying, teleprompterSpeed]);

  const startTeleprompterWithCountdown = (variation: MultipliedVideoVariation) => {
    setTeleprompterVariation(variation);
    setTeleprompterModalOpen(true);
    setIsTeleprompterPlaying(false);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setIsTeleprompterPlaying(true);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  // Copy full script or caption
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification("Copiado para a área de transferência!", "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export all scripts to TXT
  const handleExportAllTxt = () => {
    if (currentVariations.length === 0) return;

    let content = `===========================================================\n`;
    content += `LOTE DE MULTIPLICAÇÃO DE VÍDEOS VIRAIS\n`;
    content += `Tema Base: ${topicInput}\n`;
    content += `Nicho: ${nicheInput}\n`;
    content += `Total de Variações: ${currentVariations.length}\n`;
    content += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `===========================================================\n\n`;

    currentVariations.forEach((v, index) => {
      content += `-----------------------------------------------------------\n`;
      content += `VÍDEO #${index + 1}: ${v.title.toUpperCase()}\n`;
      content += `Ângulo: ${v.angle} | Emoção-Alvo: ${v.targetEmotion}\n`;
      content += `Duração Estimada: ${v.estimatedDuration} | Melhor Horário: ${v.bestTimeToPost}\n`;
      content += `-----------------------------------------------------------\n\n`;
      content += `GANCHO DOS PRIMEIROS 3 SEGUNDOS:\n`;
      content += `"${v.hook3s}"\n`;
      content += `Direção Visual: ${v.visualOpening}\n\n`;
      content += `ROTEIRO COMPLETO DE GRAVAÇÃO:\n`;
      content += `${v.fullScript}\n\n`;
      content += `TEXTOS PARA A TELA (ON-SCREEN):\n`;
      v.onScreenCaptions.forEach(c => (content += `- ${c}\n`));
      content += `\nSUGESTÃO DE B-ROLL:\n${v.brollSuggestions}\n\n`;
      content += `LEGENDA PARA POSTAGEM:\n${v.socialCaption}\n\n`;
      content += `HASHTAGS:\n#${v.hashtags.join(' #')}\n\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `multiplicacao-videos-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Arquivo TXT com todos os roteiros baixado!", "success");
  };

  // Batch Multi-Schedule to Calendar
  const handleExecuteBatchSchedule = () => {
    if (currentVariations.length === 0) return;

    const newPosts: SocialPost[] = [];
    const startDateObj = new Date(batchStartDate + "T00:00:00");

    currentVariations.forEach((v, idx) => {
      const postDate = new Date(startDateObj);

      if (batchCadence === '1_per_day') {
        postDate.setDate(postDate.getDate() + idx);
      } else if (batchCadence === '2_per_day') {
        postDate.setDate(postDate.getDate() + Math.floor(idx / 2));
      } else if (batchCadence === 'weekdays') {
        let addedDays = 0;
        let daysToMove = idx;
        while (daysToMove > 0) {
          addedDays++;
          const checkDate = new Date(startDateObj);
          checkDate.setDate(checkDate.getDate() + addedDays);
          if (checkDate.getDay() !== 0 && checkDate.getDay() !== 6) {
            daysToMove--;
          }
        }
        postDate.setDate(postDate.getDate() + addedDays);
      }

      const yyyy = postDate.getFullYear();
      const mm = String(postDate.getMonth() + 1).padStart(2, '0');
      const dd = String(postDate.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      // Alternate time if 2 per day
      let timeStr = batchTime;
      if (batchCadence === '2_per_day' && idx % 2 === 1) {
        timeStr = "12:30";
      }

      const post: SocialPost = {
        id: `post-batch-${Date.now()}-${idx}`,
        caption: `${v.socialCaption}\n\n#${v.hashtags.slice(0, 5).join(' #')}`,
        platforms: batchPlatforms,
        destinations: ['feed', 'story'],
        date: dateStr,
        time: timeStr,
        mediaUrl: v.coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        mediaType: 'video',
        status: 'scheduled',
        bestTimeScore: 98
      };

      newPosts.push(post);
    });

    if (onBatchSchedulePosts) {
      onBatchSchedulePosts(newPosts);
    } else {
      newPosts.forEach(p => onSchedulePost(p));
    }

    // Mark variations as scheduled
    setCurrentVariations(prev => prev.map(v => ({ ...v, status: 'scheduled' })));
    setIsBatchScheduleModalOpen(false);
    showNotification(`✓ ${newPosts.length} vídeos distribuídos e agendados no Calendário com sucesso!`, "success");
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#faf7fb] to-[#f4eff6] p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#201324] via-[#2f1936] to-[#451e46] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-pink-900/30 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-white" />
              Multiplicador Viral 10x
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-pink-200 text-[11px] font-bold rounded-full border border-white/10">
              IA Gemini 3.8 + Engenharia de Retenção
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Multiplicador de Vídeos Virais
          </h2>

          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed font-normal">
            Transforme <strong>1 única ideia, link ou roteiro</strong> em <strong>3x, 5x, 10x ou 20x roteiros virais completos</strong>, cada um atacando um ângulo psicológico diferente (Mito, Curiosidade, FOMO, Passo a Passo) com teleprompter e agendamento em massa.
          </p>
        </div>

        {/* Action badges right */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => setIsSavedProjectsDrawerOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FolderHeart className="w-4 h-4 text-pink-400" />
            <span>Projetos Salvos ({savedProjects.length})</span>
          </button>

          {currentVariations.length > 0 && (
            <button
              onClick={handleSaveProject}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Projeto</span>
            </button>
          )}
        </div>
      </div>

      {/* Input & Configuration Card */}
      <div className="bg-white rounded-3xl p-6 md:p-7 border border-gray-200/80 shadow-sm flex flex-col gap-5">
        
        {/* Step 1: Input Type Tabs */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-[11px] font-black">1</span>
            Escolha o Ponto de Partida da Multiplicação:
          </span>

          <div className="flex items-center p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setInputMode('topic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'topic' ? 'bg-white text-pink-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tema ou Ideia</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('link')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'link' ? 'bg-white text-pink-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link de Vídeo (Reels/TikTok)</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('transcript')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'transcript' ? 'bg-white text-pink-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Roteiro Existente</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('presets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'presets' ? 'bg-white text-pink-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Ideias em Alta</span>
            </button>
          </div>
        </div>

        {/* Input Bodies */}
        {inputMode === 'topic' && (
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase">Qual é a ideia, tema ou dor que você quer multiplicar?</label>
            <div className="relative mt-1.5">
              <input
                type="text"
                placeholder="Ex: Como fechar clientes de R$ 5.000 no direct do Instagram sem anúncios..."
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-sm font-medium text-gray-800 focus:outline-hidden transition-all shadow-2xs"
              />
              <Sparkles className="w-4 h-4 text-pink-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase">Cole o link do Reels, TikTok ou Shorts de referência:</label>
            <div className="relative mt-1.5">
              <input
                type="url"
                placeholder="https://www.instagram.com/reel/... ou https://www.tiktok.com/@user/video/..."
                value={videoLinkInput}
                onChange={e => setVideoLinkInput(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-sm font-mono text-gray-800 focus:outline-hidden transition-all shadow-2xs"
              />
              <LinkIcon className="w-4 h-4 text-pink-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">A IA fará a engenharia reversa do conteúdo deste link e multiplicará nos ângulos selecionados abaixo.</p>
          </div>
        )}

        {inputMode === 'transcript' && (
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase">Cole a transcrição ou rascunho do vídeo base:</label>
            <textarea
              rows={4}
              placeholder="Cole aqui o que é dito no vídeo ou o seu roteiro atual para que a IA multiplique em 10 novas versões..."
              value={transcriptInput}
              onChange={e => setTranscriptInput(e.target.value)}
              className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-xs font-mono text-gray-800 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>
        )}

        {inputMode === 'presets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_TOPICS.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setTopicInput(preset.title);
                  setNicheInput(preset.niche);
                  setInputMode('topic');
                  showNotification(`Tema "${preset.title}" selecionado!`, "info");
                }}
                className="p-3.5 bg-pink-50/40 hover:bg-pink-50 border border-pink-100 hover:border-pink-300 rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-2 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-pink-600 px-2 py-0.5 bg-white rounded-md border border-pink-200">
                      {preset.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{preset.niche}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{preset.description}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600">
                  <span>Usar este tema</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase">Nicho / Segmento:</label>
            <input
              type="text"
              value={nicheInput}
              onChange={e => setNicheInput(e.target.value)}
              placeholder="Ex: Marketing, Finanças, Saúde..."
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-pink-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase">Público-Alvo:</label>
            <input
              type="text"
              value={audienceInput}
              onChange={e => setAudienceInput(e.target.value)}
              placeholder="Ex: Pessoas ocupadas, jovens profissionais..."
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-pink-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase">Fator de Multiplicação:</label>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {[3, 5, 10, 20].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMultiplierCount(num)}
                  className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer border ${
                    multiplierCount === num
                      ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {num}x {num === 20 ? '🔥' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Active Psychological Angles */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-600 uppercase">Ângulos Psicológicos Ativos (Gatilhos):</span>
            <button
              type="button"
              onClick={() => setSelectedAngles(PSYCHOLOGICAL_ANGLES.map(a => a.id))}
              className="text-[11px] font-bold text-pink-600 hover:underline cursor-pointer"
            >
              Ativar Todos
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PSYCHOLOGICAL_ANGLES.map(ang => {
              const isSelected = selectedAngles.includes(ang.id);
              return (
                <button
                  key={ang.id}
                  type="button"
                  onClick={() => toggleAngle(ang.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected ? ang.color + ' shadow-2xs font-black' : 'bg-gray-50 text-gray-400 border-gray-200 line-through opacity-60'
                  }`}
                >
                  <span>{ang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Primary Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerateMultiplier()}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white text-sm font-black rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-60 transform active:scale-98"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{generationStep || "Multiplicando Roteiros com IA..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-white" />
                <span>MULTIPLICAR EM {multiplierCount} VÍDEOS VIRAIS AGORA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Multiplied Variations Hub */}
      {currentVariations.length > 0 && (
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header & Batch Actions Toolbar */}
          <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full">
                  ✓ {currentVariations.length} Roteiros Prontos
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Nicho: <strong>{nicheInput}</strong>
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mt-1">
                {projectTitle || "Variações Multiplicadas"}
              </h3>
            </div>

            {/* Batch Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBatchScheduleModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Multi-Agendar Todos no Calendário</span>
              </button>

              <button
                type="button"
                onClick={handleExportAllTxt}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar TXT</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const allScripts = currentVariations.map((v, i) => `#${i + 1} - ${v.title}\nGANCHO: ${v.hook3s}\nROTEIRO:\n${v.fullScript}`).join("\n\n---\n\n");
                  handleCopyText(allScripts, 'all-scripts');
                }}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'all-scripts' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>Copiar Todos</span>
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

              {/* View mode toggle */}
              <div className="flex items-center p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setActiveViewMode('cards')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    activeViewMode === 'cards' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="Visão em Cards"
                >
                  <Tv className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    activeViewMode === 'table' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="Visão em Lista / Tabela"
                >
                  <ListTodo className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid Mode */}
          {activeViewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentVariations.map((variation, index) => (
                <div
                  key={variation.id}
                  className="bg-white rounded-3xl border border-gray-200/90 hover:border-pink-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-black uppercase rounded-lg">
                        {variation.angle}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                        #{index + 1} • {variation.estimatedDuration}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-pink-700 transition-colors">
                      {variation.title}
                    </h4>

                    {/* Hook Callout Box */}
                    <div className="mt-3 p-3 bg-gradient-to-br from-amber-50/70 to-pink-50/40 border border-amber-200/60 rounded-2xl flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        Gancho 0-3 Segundos:
                      </span>
                      <p className="text-xs font-extrabold text-gray-900 leading-snug">
                        "{variation.hook3s}"
                      </p>
                      {variation.visualOpening && (
                        <span className="text-[10px] font-semibold text-gray-500 italic mt-0.5">
                          Visual: {variation.visualOpening}
                        </span>
                      )}
                    </div>

                    {/* Dynamic On-Screen Text Pills */}
                    {variation.onScreenCaptions && variation.onScreenCaptions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {variation.onScreenCaptions.slice(0, 3).map((captionText, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md"
                          >
                            {captionText}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 pt-3 bg-gray-50/80 border-t border-gray-100 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {variation.bestTimeToPost}
                      </span>
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                        {variation.targetEmotion}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => startTeleprompterWithCountdown(variation)}
                        className="py-2.5 px-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Tv className="w-3.5 h-3.5 text-pink-400" />
                        <span>Teleprompter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedVariation(variation)}
                        className="py-2.5 px-3 bg-white hover:bg-pink-50 border border-gray-200 text-gray-800 hover:text-pink-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Ver Roteiro</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200/60">
                      <button
                        type="button"
                        onClick={() => {
                          onSchedulePost({
                            caption: `${variation.socialCaption}\n\n#${variation.hashtags.slice(0, 6).join(' #')}`,
                            mediaUrl: variation.coverUrl,
                            mediaType: 'video',
                            platforms: ['instagram', 'tiktok'],
                            time: variation.bestTimeToPost.split(" ")[0]
                          });
                        }}
                        className="text-[11px] font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Agendar Este</span>
                      </button>

                      {onSendToTrello && (
                        <button
                          type="button"
                          onClick={() => {
                            onSendToTrello({
                              title: variation.title,
                              description: `GANCHO: ${variation.hook3s}\n\nROTEIRO:\n${variation.fullScript}`,
                              caption: variation.socialCaption,
                              tag: variation.angle
                            });
                            showNotification("Card criado no Quadro Trello!", "success");
                          }}
                          className="text-[11px] font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                        >
                          <ListTodo className="w-3.5 h-3.5" />
                          <span>+ Trello</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyText(variation.fullScript, variation.id)}
                        className="text-[11px] font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                        title="Copiar Roteiro"
                      >
                        {copiedId === variation.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === variation.id ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table / Production Sheet View Mode */}
          {activeViewMode === 'table' && (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Ângulo & Emoção</th>
                      <th className="py-3.5 px-4">Gancho dos 3s</th>
                      <th className="py-3.5 px-4">Duração</th>
                      <th className="py-3.5 px-4">Melhor Horário</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    {currentVariations.map((v, i) => (
                      <tr key={v.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-400">#{i + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-pink-700 block">{v.angle}</span>
                          <span className="text-[10px] text-gray-400">{v.targetEmotion}</span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-bold text-gray-900 truncate">"{v.hook3s}"</p>
                          <span className="text-[10px] text-gray-500 italic block">{v.visualOpening}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">{v.estimatedDuration}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">{v.bestTimeToPost}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startTeleprompterWithCountdown(v)}
                              className="p-1.5 bg-gray-900 text-white rounded-lg hover:bg-black cursor-pointer"
                              title="Abrir Teleprompter"
                            >
                              <Tv className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setExpandedVariation(v)}
                              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg cursor-pointer"
                            >
                              Ver Roteiro
                            </button>
                            <button
                              onClick={() => {
                                onSchedulePost({
                                  caption: `${v.socialCaption}\n\n#${v.hashtags.slice(0, 6).join(' #')}`,
                                  mediaUrl: v.coverUrl,
                                  mediaType: 'video',
                                  platforms: ['instagram', 'tiktok']
                                });
                              }}
                              className="px-2.5 py-1.5 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 cursor-pointer"
                            >
                              Agendar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded Script Detail Modal */}
      {expandedVariation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-pink-100 text-pink-700 text-xs font-black uppercase rounded-lg">
                  {expandedVariation.angle}
                </span>
                <span className="text-xs text-gray-500 font-bold">
                  {expandedVariation.estimatedDuration} • {expandedVariation.bestTimeToPost}
                </span>
              </div>
              <button
                onClick={() => setExpandedVariation(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-sm">
              <h3 className="text-lg font-black text-gray-900 leading-snug">
                {expandedVariation.title}
              </h3>

              {/* 3s Hook Box */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200 rounded-2xl flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase text-amber-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  Gancho de 3 Segundos:
                </span>
                <p className="text-base font-extrabold text-gray-900">
                  "{expandedVariation.hook3s}"
                </p>
                <p className="text-xs text-gray-600 italic">
                  Direção visual: {expandedVariation.visualOpening}
                </p>
              </div>

              {/* Full Script with Cues */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Roteiro Completo com Cenas:</label>
                  <button
                    onClick={() => handleCopyText(expandedVariation.fullScript, 'exp-script')}
                    className="text-xs font-bold text-pink-600 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'exp-script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Roteiro</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                  {expandedVariation.fullScript}
                </div>
              </div>

              {/* On Screen Texts & B-Roll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-[11px] font-bold text-gray-700 uppercase block mb-1.5">Textos na Tela (On-Screen):</span>
                  <div className="flex flex-col gap-1">
                    {expandedVariation.onScreenCaptions.map((txt, idx) => (
                      <span key={idx} className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                        {txt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-[11px] font-bold text-gray-700 uppercase block mb-1.5">Sugestão de B-Roll / Áudio:</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{expandedVariation.brollSuggestions}</p>
                  <p className="text-[11px] font-bold text-violet-600 mt-1.5">Trilha: {expandedVariation.recommendedAudioType}</p>
                </div>
              </div>

              {/* Caption & Hashtags */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Legenda Pronta para Publicar:</label>
                  <button
                    onClick={() => handleCopyText(expandedVariation.socialCaption, 'exp-caption')}
                    className="text-xs font-bold text-pink-600 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'exp-caption' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Legenda</span>
                  </button>
                </div>
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                  {expandedVariation.socialCaption}
                  <div className="mt-2 text-pink-600 font-bold">
                    #{expandedVariation.hashtags.join(' #')}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setExpandedVariation(null);
                  startTeleprompterWithCountdown(expandedVariation);
                }}
                className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Tv className="w-4 h-4 text-pink-400" />
                <span>Gravar com Teleprompter</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedVariation(null)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSchedulePost({
                      caption: `${expandedVariation.socialCaption}\n\n#${expandedVariation.hashtags.slice(0, 6).join(' #')}`,
                      mediaUrl: expandedVariation.coverUrl,
                      mediaType: 'video',
                      platforms: ['instagram', 'tiktok']
                    });
                    setExpandedVariation(null);
                  }}
                  className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Publicação</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Fullscreen Teleprompter Modal */}
      {teleprompterModalOpen && teleprompterVariation && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col text-white animate-in fade-in duration-200 select-none">
          {/* Teleprompter Top Bar */}
          <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between shrink-0 bg-black/40">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-pink-600 text-white text-xs font-black uppercase rounded-lg">
                Teleprompter
              </span>
              <span className="text-sm font-bold text-gray-200 truncate max-w-md hidden sm:inline">
                {teleprompterVariation.title}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Font Size Adjusters */}
              <div className="flex items-center gap-1 bg-gray-800/80 px-2 py-1 rounded-xl border border-gray-700">
                <button
                  onClick={() => setTeleprompterFontSize(prev => Math.max(prev - 4, 18))}
                  className="px-2 py-0.5 hover:text-pink-400 font-bold text-xs cursor-pointer"
                  title="Diminuir Fonte"
                >
                  A-
                </button>
                <span className="text-xs font-mono text-gray-400">{teleprompterFontSize}px</span>
                <button
                  onClick={() => setTeleprompterFontSize(prev => Math.min(prev + 4, 64))}
                  className="px-2 py-0.5 hover:text-pink-400 font-bold text-xs cursor-pointer"
                  title="Aumentar Fonte"
                >
                  A+
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1 bg-gray-800/80 px-2 py-1 rounded-xl border border-gray-700">
                <span className="text-[10px] uppercase font-bold text-gray-400">Vel:</span>
                {[1, 1.5, 2, 3].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setTeleprompterSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                      teleprompterSpeed === spd ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Mirror mode */}
              <button
                onClick={() => setTeleprompterMirror(!teleprompterMirror)}
                className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                  teleprompterMirror ? 'bg-pink-600 border-pink-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
                title="Modo Espelho (para tripé com espelho)"
              >
                Espelho
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  setTeleprompterModalOpen(false);
                  setIsTeleprompterPlaying(false);
                }}
                className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Teleprompter Scrolling Body */}
          <div
            ref={teleprompterScrollRef}
            className={`flex-1 overflow-y-auto px-6 md:px-24 py-20 flex flex-col items-center justify-start text-center font-sans tracking-wide leading-relaxed scroll-smooth ${
              teleprompterMirror ? '-scale-x-100' : ''
            }`}
            style={{ fontSize: `${teleprompterFontSize}px` }}
          >
            {/* Reading guideline */}
            <div className="fixed top-1/2 left-0 right-0 h-1 bg-pink-500/30 pointer-events-none z-10" />

            <div className="max-w-4xl w-full flex flex-col gap-12 pb-60 text-gray-100 font-semibold">
              
              {/* Hook with distinct visual color */}
              <div className="p-6 bg-pink-950/40 border border-pink-700/50 rounded-3xl text-pink-300 font-extrabold">
                <span className="text-sm font-bold uppercase tracking-widest text-pink-400 block mb-2">
                  [ 0-3s GANCHO DE ABERTURA ]
                </span>
                "{teleprompterVariation.hook3s}"
              </div>

              {/* Teleprompter Reading Text in paragraphs */}
              <div className="whitespace-pre-line flex flex-col gap-6 text-gray-100">
                {teleprompterVariation.teleprompterScript}
              </div>

              <div className="text-base text-gray-500 uppercase tracking-widest font-mono pt-12">
                --- FIM DO VÍDEO (PARE DE GRAVAR) ---
              </div>
            </div>
          </div>

          {/* Teleprompter Bottom Controls Bar */}
          <div className="h-20 px-6 border-t border-gray-800 bg-black/60 flex items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => {
                if (teleprompterScrollRef.current) teleprompterScrollRef.current.scrollTop = 0;
              }}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 cursor-pointer"
              title="Voltar ao início"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsTeleprompterPlaying(!isTeleprompterPlaying)}
              className="px-8 py-3.5 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white rounded-full font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer transform active:scale-95"
            >
              {isTeleprompterPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pausar Leitura (Espaço)</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Rolar Texto</span>
                </>
              )}
            </button>
          </div>

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-100">
              <span className="text-9xl font-black text-pink-500 animate-ping">
                {countdown}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Batch Schedule Modal */}
      {isBatchScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                  Multi-Agendar {currentVariations.length} Vídeos no Calendário
                </h3>
              </div>
              <button
                onClick={() => setIsBatchScheduleModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                Este recurso distribuirá automaticamente todos os <strong>{currentVariations.length} vídeos</strong> ao longo dos dias selecionados com data e horário definidos no seu Calendário oficial.
              </p>

              <div>
                <label className="font-bold text-gray-700 uppercase">Data de Início da Primeira Publicação:</label>
                <input
                  type="date"
                  value={batchStartDate}
                  onChange={e => setBatchStartDate(e.target.value)}
                  className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 uppercase">Frequência de Postagem:</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setBatchCadence('1_per_day')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      batchCadence === '1_per_day' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    1 Vídeo / dia
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchCadence('2_per_day')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      batchCadence === '2_per_day' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    2 Vídeos / dia
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchCadence('weekdays')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      batchCadence === 'weekdays' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Dias Úteis
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 uppercase">Horário Padrão de Postagem:</label>
                <input
                  type="time"
                  value={batchTime}
                  onChange={e => setBatchTime(e.target.value)}
                  className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 uppercase">Redes Sociais:</label>
                <div className="flex gap-2 mt-1.5">
                  {(['instagram', 'tiktok', 'youtube'] as const).map(net => {
                    const isChecked = batchPlatforms.includes(net);
                    return (
                      <button
                        key={net}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            if (batchPlatforms.length > 1) {
                              setBatchPlatforms(batchPlatforms.filter(p => p !== net));
                            }
                          } else {
                            setBatchPlatforms([...batchPlatforms, net]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] border transition-all cursor-pointer ${
                          isChecked ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        {net}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBatchScheduleModalOpen(false)}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteBatchSchedule}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar e Agendar {currentVariations.length} Posts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Projects Drawer */}
      {isSavedProjectsDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <FolderHeart className="w-5 h-5 text-pink-600" />
                  Projetos Salvos ({savedProjects.length})
                </h3>
                <button
                  onClick={() => setIsSavedProjectsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {savedProjects.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FolderHeart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">Nenhum projeto salvo ainda.</p>
                  <p className="text-[11px] text-gray-400 mt-1">Multiplique um vídeo e clique em "Salvar Projeto" para armazenar aqui.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedProjects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-4 bg-gray-50 hover:bg-pink-50/50 border border-gray-200 rounded-2xl flex flex-col gap-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-pink-600 bg-white px-2 py-0.5 rounded border border-pink-200">
                          {proj.multiplierCount} Vídeos
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{proj.createdAt}</span>
                      </div>

                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                        {proj.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 mt-1">
                        <button
                          type="button"
                          onClick={() => handleLoadProject(proj)}
                          className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Abrir Projeto</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer"
                          title="Excluir Projeto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSavedProjectsDrawerOpen(false)}
              className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs cursor-pointer"
            >
              Fechar Histórico
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
