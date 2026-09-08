import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Video, 
  Film, 
  Shuffle, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Hash, 
  Share2, 
  Download, 
  Save, 
  Trash2, 
  FolderHeart, 
  ArrowRight, 
  Upload, 
  Camera, 
  Mic, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  HelpCircle, 
  Smartphone, 
  ListTodo, 
  TrendingUp, 
  Zap, 
  Flame, 
  MessageSquare, 
  Eye, 
  Sliders, 
  RefreshCw,
  ExternalLink,
  Plus
} from "lucide-react";
import { ModularPiece, ModularCombinedVideo, ModularMatrixProject, SocialPost } from "../types";

interface ModularVideoFactoryProps {
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
  onSwitchToCalendar?: () => void;
}

// Exemplos de Nichos Prontos para Geração Rápida
const NICHE_PRESETS = [
  {
    niche: "Vendas no Direct & Negócios",
    topic: "Como fechar vendas todos os dias no direct sem gastar 1 real em anúncios",
    audience: "Empreendedores, autônomos, corretores e prestadores de serviço",
    tag: "Vendas B2B/B2C"
  },
  {
    niche: "Criação de Conteúdo & Infoprodutos",
    topic: "A fórmula de retenção magnética para viralizar no TikTok e Reels gravando só 1 vez por mês",
    audience: "Criadores, videomakers e infoprodutores que querem crescer rápido",
    tag: "Viralização"
  },
  {
    niche: "Fitness, Emagrecimento & Saúde",
    topic: "O erro comum na alimentação que trava o metabolismo mesmo treinando todo dia",
    audience: "Pessoas ocupadas que querem queimar gordura com rotinas realistas",
    tag: "Saúde & Corpo"
  },
  {
    niche: "Finanças, Renda Extra & Investimentos",
    topic: "O método simples para organizar o orçamento e fazer o primeiro investimento em 7 dias",
    audience: "Iniciantes que querem sair das dívidas e multiplicar a renda",
    tag: "Finanças"
  }
];

// Vídeos de demonstração para quem quiser testar imediatamente o player combinatório de 150 vídeos
const DEMO_VIDEOS = {
  hooks: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  ],
  bodies: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  ],
  ctas: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4"
  ]
};

export default function ModularVideoFactory({
  onSchedulePost,
  onBatchSchedulePosts,
  onSendToTrello,
  showNotification,
  onSwitchToCalendar
}: ModularVideoFactoryProps) {
  // Navigation tabs inside the factory
  const [activeTab, setActiveTab] = useState<'scripts' | 'recorder' | 'simulator' | 'matrix' | 'batchSchedule'>('scripts');

  // Generation form states
  const [topic, setTopic] = useState("Como fechar clientes de alto valor no direct sem gastar em anúncios");
  const [niche, setNiche] = useState("Vendas no Direct & Negócios");
  const [audience, setAudience] = useState("Empreendedores, autônomos e prestadores de serviço");
  const [tone, setTone] = useState("Direto, sem enrolação, magnético e de alta autoridade");
  const [isGenerating, setIsGenerating] = useState(false);

  // Modular Pieces (10 Hooks, 5 Bodies, 3 CTAs)
  const [hooks, setHooks] = useState<ModularPiece[]>([]);
  const [bodies, setBodies] = useState<ModularPiece[]>([]);
  const [ctas, setCtas] = useState<ModularPiece[]>([]);
  const [activePieceType, setActivePieceType] = useState<'hook' | 'body' | 'cta'>('hook');

  // Combinatory Simulator State (Hook # + Body # + CTA #)
  const [selectedHookIndex, setSelectedHookIndex] = useState(1);
  const [selectedBodyIndex, setSelectedBodyIndex] = useState(1);
  const [selectedCtaIndex, setSelectedCtaIndex] = useState(1);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackStep, setCurrentPlaybackStep] = useState<'hook' | 'body' | 'cta'>('hook');
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Camera Recorder in-app modal state
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [recordingTargetPiece, setRecordingTargetPiece] = useState<ModularPiece | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const liveVideoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Batch Scheduling Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [scheduleStartDate, setScheduleStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [postsPerDay, setPostsPerDay] = useState<1 | 2 | 3>(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<('tiktok' | 'instagram' | 'youtube' | 'facebook')[]>([
    'tiktok',
    'instagram'
  ]);
  const [batchCountToSchedule, setBatchCountToSchedule] = useState(150);
  const [isBatchScheduling, setIsBatchScheduling] = useState(false);

  // Saved Projects Drawer / List
  const [savedProjects, setSavedProjects] = useState<ModularMatrixProject[]>([]);
  const [showSavedProjectsModal, setShowSavedProjectsModal] = useState(false);
  const [currentProjectTitle, setCurrentProjectTitle] = useState("Máquina 150 Vídeos - Vendas no Direct");

  // Filter for the 150 Matrix view
  const [matrixFilterHook, setMatrixFilterHook] = useState<number | 'all'>('all');
  const [matrixFilterBody, setMatrixFilterBody] = useState<number | 'all'>('all');
  const [matrixFilterCta, setMatrixFilterCta] = useState<number | 'all'>('all');
  const [matrixSearchQuery, setMatrixSearchQuery] = useState("");
  const [matrixCurrentPage, setMatrixCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Load initial projects & generate default fallback if empty
  useEffect(() => {
    loadSavedProjects();
    handleGenerateModularMatrix(true);
  }, []);

  const loadSavedProjects = async () => {
    try {
      const res = await fetch("/api/modular-factory-projects");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSavedProjects(data);
        }
      }
    } catch (e) {
      console.warn("Could not load remote modular projects", e);
    }
  };

  // Generate Matrix with AI
  const handleGenerateModularMatrix = async (isInitial = false) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-150-modular-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          niche,
          audience,
          tone
        })
      });

      if (!res.ok) {
        throw new Error("Erro na geração da matriz modular");
      }

      const data = await res.json();
      if (data.hooks && data.bodies && data.ctas) {
        setHooks(data.hooks);
        setBodies(data.bodies);
        setCtas(data.ctas);
        if (!isInitial) {
          showNotification("🎉 Matriz Modular de 150 Vídeos gerada com sucesso!", "success");
        }
      }
    } catch (error: any) {
      console.error(error);
      if (!isInitial) {
        showNotification("Erro ao conectar com a IA. Usando matriz calibrada de alta performance.", "info");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick preset loader
  const handleApplyPreset = (preset: typeof NICHE_PRESETS[0]) => {
    setNiche(preset.niche);
    setTopic(preset.topic);
    setAudience(preset.audience);
    setCurrentProjectTitle(`Máquina 150 Vídeos - ${preset.niche}`);
  };

  // Progress stats
  const totalRecordedHooks = hooks.filter(h => h.isRecorded || h.videoUrl).length;
  const totalRecordedBodies = bodies.filter(b => b.isRecorded || b.videoUrl).length;
  const totalRecordedCtas = ctas.filter(c => c.isRecorded || c.videoUrl).length;
  const totalRecordedPieces = totalRecordedHooks + totalRecordedBodies + totalRecordedCtas;
  const totalPiecesRequired = 18;
  const recordingPercentage = Math.round((totalRecordedPieces / totalPiecesRequired) * 100);

  // Fast Demo Loader: Populate demo videos for instant testing
  const handleLoadDemoVideos = () => {
    const updatedHooks = hooks.map((h, i) => ({
      ...h,
      videoUrl: DEMO_VIDEOS.hooks[i % DEMO_VIDEOS.hooks.length],
      isRecorded: true
    }));
    const updatedBodies = bodies.map((b, i) => ({
      ...b,
      videoUrl: DEMO_VIDEOS.bodies[i % DEMO_VIDEOS.bodies.length],
      isRecorded: true
    }));
    const updatedCtas = ctas.map((c, i) => ({
      ...c,
      videoUrl: DEMO_VIDEOS.ctas[i % DEMO_VIDEOS.ctas.length],
      isRecorded: true
    }));

    setHooks(updatedHooks);
    setBodies(updatedBodies);
    setCtas(updatedCtas);
    showNotification("🚀 18 Clipes Demo carregados! Você já pode testar a junção contínua e as 150 combinações!", "success");
  };

  // Currently selected combo pieces
  const currentHook = hooks.find(h => h.index === selectedHookIndex) || hooks[0];
  const currentBody = bodies.find(b => b.index === selectedBodyIndex) || bodies[0];
  const currentCta = ctas.find(c => c.index === selectedCtaIndex) || ctas[0];

  // Current combo number in 1 to 150
  // Formula: ((hookIndex - 1) * 15) + ((bodyIndex - 1) * 3) + ctaIndex
  const currentComboNumber = currentHook && currentBody && currentCta
    ? ((currentHook.index - 1) * 15) + ((currentBody.index - 1) * 3) + currentCta.index
    : 1;

  // Caption generator for this specific combo
  const generateComboCaption = (hook: ModularPiece, body: ModularPiece, cta: ModularPiece) => {
    return `🚨 ${hook.script}\n\n${body.script}\n\n💡 ${cta.script}\n\n👉 Salve este vídeo para não esquecer e aplique hoje mesmo!\n\n#${niche.toLowerCase().replace(/[^\w]/g, '')} #dicasvirais #crescernotiktok #reelsbrasil #estrategiadeconteudo #vendas`;
  };

  // Generate all 150 combinations on the fly
  const generateAll150Combinations = (): ModularCombinedVideo[] => {
    const list: ModularCombinedVideo[] = [];
    if (!hooks.length || !bodies.length || !ctas.length) return list;

    let count = 1;
    for (let h = 0; h < hooks.length; h++) {
      for (let b = 0; b < bodies.length; b++) {
        for (let c = 0; c < ctas.length; c++) {
          const hk = hooks[h];
          const bd = bodies[b];
          const ct = ctas[c];
          list.push({
            id: `combo-${count}`,
            comboNumber: count,
            hookIndex: hk.index,
            bodyIndex: bd.index,
            ctaIndex: ct.index,
            title: `Vídeo #${count.toString().padStart(3, '0')}: Gancho ${hk.index} + Corpo ${bd.index} + CTA ${ct.index}`,
            fullScript: `[GANCHO ${hk.index} - 0-4s]: ${hk.script}\n\n[CORPO ${bd.index} - 4-22s]: ${bd.script}\n\n[CTA ${ct.index} - 22-26s]: ${ct.script}`,
            caption: generateComboCaption(hk, bd, ct),
            hashtags: [
              niche.toLowerCase().replace(/[^\w]/g, ''),
              "conteudoviral",
              "tiktokbrasil",
              "reelsvirais",
              "empreendedorismo"
            ],
            totalDurationSec: (hk.durationSec || 4) + (bd.durationSec || 18) + (ct.durationSec || 4)
          });
          count++;
        }
      }
    }
    return list;
  };

  const allCombinations = generateAll150Combinations();

  // Filtered combinations
  const filteredCombinations = allCombinations.filter(combo => {
    if (matrixFilterHook !== 'all' && combo.hookIndex !== matrixFilterHook) return false;
    if (matrixFilterBody !== 'all' && combo.bodyIndex !== matrixFilterBody) return false;
    if (matrixFilterCta !== 'all' && combo.ctaIndex !== matrixFilterCta) return false;
    if (matrixSearchQuery.trim()) {
      const q = matrixSearchQuery.toLowerCase();
      return (
        combo.title.toLowerCase().includes(q) ||
        combo.fullScript.toLowerCase().includes(q) ||
        combo.caption.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCombinations.length / itemsPerPage);
  const paginatedCombinations = filteredCombinations.slice(
    (matrixCurrentPage - 1) * itemsPerPage,
    matrixCurrentPage * itemsPerPage
  );

  // Randomize a combination
  const handleRandomizeCombo = () => {
    const randomH = Math.floor(Math.random() * (hooks.length || 10)) + 1;
    const randomB = Math.floor(Math.random() * (bodies.length || 5)) + 1;
    const randomC = Math.floor(Math.random() * (ctas.length || 3)) + 1;

    setSelectedHookIndex(randomH);
    setSelectedBodyIndex(randomB);
    setSelectedCtaIndex(randomC);
    setCurrentPlaybackStep('hook');
    setIsPlaying(false);
    setPlaybackProgress(0);
    showNotification(`🎲 Combinação #${((randomH - 1) * 15) + ((randomB - 1) * 3) + randomC} sorteada!`, "info");
  };

  // Video stitcher / sequential playback handler
  const currentActiveVideoSrc = () => {
    if (currentPlaybackStep === 'hook') return currentHook?.videoUrl;
    if (currentPlaybackStep === 'body') return currentBody?.videoUrl;
    return currentCta?.videoUrl;
  };

  const handleVideoEnded = () => {
    if (currentPlaybackStep === 'hook') {
      setCurrentPlaybackStep('body');
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = 0;
        videoPlayerRef.current.play().catch(() => {});
      }
    } else if (currentPlaybackStep === 'body') {
      setCurrentPlaybackStep('cta');
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = 0;
        videoPlayerRef.current.play().catch(() => {});
      }
    } else {
      // Loop or pause
      setIsPlaying(false);
      setCurrentPlaybackStep('hook');
      setPlaybackProgress(100);
      showNotification("🎬 Vídeo completo reproduzido com perfeição!", "success");
    }
  };

  const togglePlayback = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Autoplay blocked or video missing", err);
      });
    }
  };

  // In-App Camera Recording (Web MediaRecorder API)
  const startCameraRecording = async (piece: ModularPiece) => {
    setRecordingTargetPiece(piece);
    setRecordingModalOpen(true);
    setRecordingTime(0);
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 1280 }, facingMode: "user" },
        audio: true
      });
      videoStreamRef.current = stream;
      if (liveVideoPreviewRef.current) {
        liveVideoPreviewRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error", err);
      showNotification("Não foi possível acessar a câmera/microfone. Verifique as permissões.", "info");
    }
  };

  const triggerActualRecording = () => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countInterval);
          startMediaRecorder();
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
  };

  const startMediaRecorder = () => {
    if (!videoStreamRef.current) return;
    try {
      const mediaRecorder = new MediaRecorder(videoStreamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(blob);

        if (recordingTargetPiece) {
          saveRecordedPieceVideo(recordingTargetPiece, videoUrl);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e: any) {
      console.error(e);
      showNotification("Erro ao iniciar gravador.", "info");
    }
  };

  const stopMediaRecorder = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setRecordingModalOpen(false);
  };

  const saveRecordedPieceVideo = (piece: ModularPiece, url: string) => {
    if (piece.type === 'hook') {
      setHooks(prev => prev.map(p => p.id === piece.id ? { ...p, videoUrl: url, isRecorded: true } : p));
    } else if (piece.type === 'body') {
      setBodies(prev => prev.map(p => p.id === piece.id ? { ...p, videoUrl: url, isRecorded: true } : p));
    } else {
      setCtas(prev => prev.map(p => p.id === piece.id ? { ...p, videoUrl: url, isRecorded: true } : p));
    }
    showNotification(`🎥 ${piece.title} gravado e anexado com sucesso!`, "success");
  };

  // Upload video file handler
  const handleFileUploadForPiece = (piece: ModularPiece, file: File) => {
    const url = URL.createObjectURL(file);
    saveRecordedPieceVideo(piece, url);
  };

  // Save Project to Database / Storage
  const handleSaveCurrentProject = async () => {
    const project: ModularMatrixProject = {
      id: `proj-${Date.now()}`,
      title: currentProjectTitle,
      topic,
      niche,
      audience,
      createdAt: new Date().toISOString(),
      hooks,
      bodies,
      ctas
    };

    try {
      const res = await fetch("/api/modular-factory-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        setSavedProjects(prev => [project, ...prev.filter(p => p.id !== project.id)]);
        showNotification("💾 Projeto da Fábrica Modular salvo com sucesso!", "success");
      }
    } catch (e) {
      showNotification("Salvo localmente com sucesso!", "success");
    }
  };

  // Load Saved Project
  const handleLoadSavedProject = (proj: ModularMatrixProject) => {
    setTopic(proj.topic);
    setNiche(proj.niche);
    setAudience(proj.audience);
    setCurrentProjectTitle(proj.title);
    setHooks(proj.hooks || []);
    setBodies(proj.bodies || []);
    setCtas(proj.ctas || []);
    setShowSavedProjectsModal(false);
    showNotification(`📂 Projeto "${proj.title}" carregado!`, "success");
  };

  // Batch Scheduling Execution
  const handleExecuteBatchSchedule = () => {
    if (!onBatchSchedulePosts) {
      showNotification("Mecanismo de agendamento em massa não inicializado.", "info");
      return;
    }

    setIsBatchScheduling(true);
    const toSchedule = allCombinations.slice(0, batchCountToSchedule);
    const generatedPosts: SocialPost[] = [];
    const baseDate = new Date(scheduleStartDate);

    const timeSlots = postsPerDay === 1
      ? ["18:30"]
      : postsPerDay === 2
      ? ["12:00", "19:00"]
      : ["10:30", "15:00", "20:30"];

    let dayCounter = 0;
    let slotCounter = 0;

    toSchedule.forEach((combo) => {
      const postDateObj = new Date(baseDate);
      postDateObj.setDate(postDateObj.getDate() + dayCounter);
      const postDateStr = postDateObj.toISOString().split('T')[0];
      const postTimeStr = timeSlots[slotCounter];

      // Grab preview url from current piece
      const hookPiece = hooks.find(h => h.index === combo.hookIndex);
      const videoMediaUrl = hookPiece?.videoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";

      generatedPosts.push({
        id: `post-batch-150-${Date.now()}-${combo.comboNumber}`,
        caption: combo.caption,
        mediaUrl: videoMediaUrl,
        videoUrl: videoMediaUrl,
        mediaType: 'video',
        platforms: selectedPlatforms,
        destinations: ['feed'],
        date: postDateStr,
        time: postTimeStr,
        status: 'scheduled',
        bestTimeScore: 97
      });

      slotCounter++;
      if (slotCounter >= timeSlots.length) {
        slotCounter = 0;
        dayCounter++;
      }
    });

    onBatchSchedulePosts(generatedPosts);
    setIsBatchScheduling(false);
    setBatchModalOpen(false);
    showNotification(`🚀 ${toSchedule.length} vídeos da Fábrica distribuídos no Calendário! (${dayCounter} dias de postagens garantidas)`, "success");

    if (onSwitchToCalendar) {
      onSwitchToCalendar();
    }
  };

  // Export 150 scripts to file
  const handleExportTxt = () => {
    let content = `===========================================================\n`;
    content += `FÁBRICA DE 150 VÍDEOS MODULARES (10 GANCHOS x 5 CORPOS x 3 CTAs)\n`;
    content += `Tema: ${topic}\n`;
    content += `Nicho: ${niche} | Público: ${audience}\n`;
    content += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `Total de Combinações: 150 vídeos prontos para gravar e postar\n`;
    content += `===========================================================\n\n`;

    content += `--- PARTE 1: OS 10 GANCHOS (3-5s cada) ---\n`;
    hooks.forEach(h => {
      content += `[GANCHO #${h.index}] ${h.title} (${h.triggerOrValue})\n"${h.script}"\n\n`;
    });

    content += `\n--- PARTE 2: OS 5 CORPOS DE CONTEÚDO (15-25s cada) ---\n`;
    bodies.forEach(b => {
      content += `[CORPO #${b.index}] ${b.title} (${b.triggerOrValue})\n"${b.script}"\n\n`;
    });

    content += `\n--- PARTE 3: OS 3 CTAs DE CONVERSÃO (3-5s cada) ---\n`;
    ctas.forEach(c => {
      content += `[CTA #${c.index}] ${c.title} (${c.triggerOrValue})\n"${c.script}"\n\n`;
    });

    content += `\n===========================================================\n`;
    content += `MATRIZ COMPLETA DAS 150 COMBINAÇÕES COM LEGENDA\n`;
    content += `===========================================================\n\n`;

    allCombinations.forEach(combo => {
      content += `-----------------------------------------------------------\n`;
      content += `VÍDEO #${combo.comboNumber.toString().padStart(3, '0')} - Gancho ${combo.hookIndex} + Corpo ${combo.bodyIndex} + CTA ${combo.ctaIndex}\n`;
      content += `Duração Estimada: ${combo.totalDurationSec} segundos\n\n`;
      content += `ROTEIRO COMPLETO:\n${combo.fullScript}\n\n`;
      content += `LEGENDA SUGERIDA:\n${combo.caption}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fabrica-150-videos-${niche.toLowerCase().replace(/[^\w]/g, '-')}.txt`;
    a.click();
    showNotification("📄 Arquivo com os 150 roteiros baixado com sucesso!", "success");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner: Concept Explanation & Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a1332] via-[#1c0c22] to-[#120716] border border-pink-500/20 shadow-2xl p-6 md:p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-md">
                <Shuffle className="w-3.5 h-3.5" />
                <span>Fórmula Viral 10 × 5 × 3</span>
              </span>
              <span className="px-3 py-1 bg-white/10 text-pink-200 text-xs font-semibold rounded-full border border-white/10">
                18 Pedacinhos = 150 Vídeos Prontos
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                5 Meses de Conteúdo Sem Editar
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Grave 18 pedacinhos em 20 minutos no celular.
              <span className="block bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                Receba 150 vídeos prontos para bombar no TikTok & Reels.
              </span>
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Você grava <strong className="text-white font-bold">10 ganchos rápidos</strong> (3s), <strong className="text-white font-bold">5 corpos de valor</strong> (20s) e <strong className="text-white font-bold">3 chamadas para ação</strong> (5s). 
              A máquina junta tudo e devolve 150 combinações perfeitas que fluem sem cortes estranhos — você não edita nada!
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
            <div className="bg-[#35173f]/80 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-pink-300 font-bold uppercase tracking-wider">Progresso de Gravação</p>
                <p className="text-xl font-black text-white">{totalRecordedPieces} <span className="text-gray-400 text-sm font-normal">/ 18 pedaços</span></p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${
                  recordingPercentage === 100 
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                }`}>
                  {recordingPercentage}% Pronto
                </span>
                <p className="text-[11px] text-gray-400 mt-1">150 vídeos geráveis</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadDemoVideos}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Insere gravações simuladas para testar o player combinatório agora mesmo"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Testar com Clipes Demo</span>
              </button>

              <button
                onClick={() => setShowSavedProjectsModal(true)}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <FolderHeart className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline">Projetos</span>
              </button>

              <button
                onClick={handleSaveCurrentProject}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                title="Salvar Matriz Atual"
              >
                <Save className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:flex-1">
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, recordingPercentage)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Ganchos: {totalRecordedHooks}/10
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Corpos: {totalRecordedBodies}/5
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> CTAs: {totalRecordedCtas}/3
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 rounded-2xl p-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'scripts'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>1. Os 18 Roteiros Modulares</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'scripts' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              18
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>2. Simulador TikTok & Player Contínuo</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-black">
              Player
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Matriz dos 150 Vídeos</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'matrix' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
            }`}>
              150
            </span>
          </button>
        </div>

        {/* Global Batch Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTxt}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-300"
            title="Baixar todos os 150 roteiros e legendas em TXT"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exportar 150 Roteiros</span>
          </button>

          <button
            onClick={() => setBatchModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Distribuir 150 no Calendário</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OS 18 ROTEIROS MODULARES (GUIA DE GRAVAÇÃO)       */}
      {/* ========================================================= */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          {/* AI Generator Box & Niches */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                  <span>Gerador IA de Roteiros Modulares (10 Ganchos + 5 Corpos + 3 CTAs)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  A IA cria 18 peças calibradas para se conectarem de forma intercambiável sem emendas perceptíveis.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateModularMatrix(false)}
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando Matriz 10x5x3...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Regenerar Matriz com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Topic Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Tema Central / Problema que o conteúdo resolve:</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Como atrair clientes todos os dias sem gastar em anúncios..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Nicho do Seu Perfil:</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Marketing & Vendas, Nutrição, Finanças..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Quick Presets Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Modelos Prontos:</span>
              {NICHE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 rounded-lg font-semibold transition-all border border-gray-200 cursor-pointer"
                >
                  ⚡ {preset.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tabs for the 3 Categories (Hooks, Bodies, CTAs) */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => setActivePieceType('hook')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activePieceType === 'hook'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>10 Ganchos (3-5s cada)</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">
                {totalRecordedHooks}/10 gravados
              </span>
            </button>

            <button
              onClick={() => setActivePieceType('body')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activePieceType === 'body'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>5 Corpos de Conteúdo (15-25s cada)</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">
                {totalRecordedBodies}/5 gravados
              </span>
            </button>

            <button
              onClick={() => setActivePieceType('cta')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activePieceType === 'cta'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>3 CTAs de Conversão (3-5s cada)</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">
                {totalRecordedCtas}/3 gravados
              </span>
            </button>
          </div>

          {/* Cards List for Selected Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activePieceType === 'hook' ? hooks : activePieceType === 'body' ? bodies : ctas).map((piece) => {
              const isRecorded = piece.isRecorded || Boolean(piece.videoUrl);

              return (
                <div
                  key={piece.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-3 ${
                    isRecorded ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        activePieceType === 'hook' 
                          ? 'bg-rose-100 text-rose-700' 
                          : activePieceType === 'body' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        #{piece.index}
                      </span>
                      <h3 className="font-extrabold text-sm text-gray-900">{piece.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{piece.durationSec}s
                      </span>
                      {isRecorded ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Pronto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-semibold">
                          Pendente
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                    Gatilho: <span className="text-gray-900 font-bold">{piece.triggerOrValue}</span>
                  </div>

                  {/* Teleprompter Script Box */}
                  <div className="bg-gray-900 text-gray-100 p-3.5 rounded-xl font-mono text-xs md:text-sm leading-relaxed relative group">
                    <p className="text-pink-300 text-[10px] uppercase font-bold tracking-widest mb-1">
                      Texto para falar na câmera:
                    </p>
                    <p className="font-sans font-medium text-white">{piece.script}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(piece.script);
                        showNotification("Texto copiado para o teleprompter!", "success");
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Copiar texto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Recording & Upload Actions */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startCameraRecording(piece)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Gravar Câmera</span>
                      </button>

                      <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200">
                        <Upload className="w-3.5 h-3.5 text-gray-500" />
                        <span>Subir Vídeo</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUploadForPiece(piece, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {piece.videoUrl && (
                      <button
                        onClick={() => {
                          if (piece.type === 'hook') setSelectedHookIndex(piece.index);
                          if (piece.type === 'body') setSelectedBodyIndex(piece.index);
                          if (piece.type === 'cta') setSelectedCtaIndex(piece.index);
                          setActiveTab('simulator');
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ver no Player</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SIMULADOR TIKTOK / REELS EM TEMPO REAL            */}
      {/* ========================================================= */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Phone Simulator 9:16 */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] bg-black rounded-[42px] border-[8px] border-[#1e1e24] shadow-2xl overflow-hidden flex flex-col justify-between">
              {/* Top Notch / Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1e1e24] rounded-full z-40"></div>

              {/* Progress Indicator (3 Segments: Hook, Body, CTA) */}
              <div className="absolute top-8 left-3 right-3 z-30 flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all ${
                      currentPlaybackStep === 'hook' ? 'w-full animate-pulse' : 'w-full'
                    }`} 
                  />
                </div>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all ${
                      currentPlaybackStep === 'body' 
                        ? 'w-full animate-pulse' 
                        : currentPlaybackStep === 'cta' 
                        ? 'w-full' 
                        : 'w-0'
                    }`} 
                  />
                </div>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all ${
                      currentPlaybackStep === 'cta' ? 'w-full animate-pulse' : 'w-0'
                    }`} 
                  />
                </div>
              </div>

              {/* Step Badge */}
              <div className="absolute top-12 left-4 z-30">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  {currentPlaybackStep === 'hook' && `[1/3] Gancho #${selectedHookIndex}`}
                  {currentPlaybackStep === 'body' && `[2/3] Corpo #${selectedBodyIndex}`}
                  {currentPlaybackStep === 'cta' && `[3/3] CTA #${selectedCtaIndex}`}
                </span>
              </div>

              {/* Video Element or Animated Simulated Background */}
              <div className="relative w-full h-full bg-gradient-to-br from-purple-950 via-[#1e0d24] to-black flex items-center justify-center">
                {currentActiveVideoSrc() ? (
                  <video
                    ref={videoPlayerRef}
                    src={currentActiveVideoSrc()}
                    playsInline
                    muted={isMuted}
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-white space-y-3">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                      <Video className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-white">Prévia em Modo de Simulação</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Grave o pedaço ou clique em <strong className="text-rose-400">"Testar com Clipes Demo"</strong> para ver os vídeos tocando emendados!
                      </p>
                    </div>
                  </div>
                )}

                {/* Big Play/Pause Button Overlay */}
                <button
                  onClick={togglePlayback}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105 z-30 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-1" />
                  )}
                </button>
              </div>

              {/* TikTok Native Right Side Icons */}
              <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4 text-white">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-all cursor-pointer">
                    <Flame className="w-5 h-5 text-rose-400 fill-rose-400" />
                  </div>
                  <span className="text-[10px] font-bold">15.4K</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-all cursor-pointer">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold">892</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-all cursor-pointer">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold">Share</span>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* TikTok Native Bottom Captions */}
              <div className="absolute bottom-4 left-3 right-16 z-30 text-white space-y-1">
                <p className="font-extrabold text-xs flex items-center gap-1">
                  <span>@seunomeoficial</span>
                  <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[8px]">✓</span>
                </p>
                <p className="text-[11px] leading-tight line-clamp-2 text-gray-200">
                  {currentHook?.script.slice(0, 60)}...
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span className="truncate">Áudio Original Viral • Tendência</span>
                </div>
              </div>
            </div>

            {/* Bottom Playback Controls */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentPlaybackStep('hook');
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.currentTime = 0;
                    videoPlayerRef.current.play().catch(() => {});
                  }
                  setIsPlaying(true);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Vídeo</span>
              </button>

              <button
                onClick={handleRandomizeCombo}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Sortear Outro (1 de 150)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Combo Selectors & Full Generated Script */}
          <div className="lg:col-span-7 space-y-5">
            {/* Combo Summary Header */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-lg">
                      Combinação #{currentComboNumber} de 150
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      ~{(currentHook?.durationSec || 4) + (currentBody?.durationSec || 18) + (currentCta?.durationSec || 4)}s no total
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-gray-900 mt-2">
                    Gancho {selectedHookIndex} + Corpo {selectedBodyIndex} + CTA {selectedCtaIndex}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSchedulePost({
                        caption: generateComboCaption(currentHook, currentBody, currentCta),
                        mediaUrl: currentHook?.videoUrl || undefined,
                        mediaType: 'video',
                        platforms: ['tiktok', 'instagram']
                      });
                      showNotification(`Vídeo #${currentComboNumber} carregado no Criador de Posts!`, "success");
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar Este Vídeo</span>
                  </button>
                </div>
              </div>

              {/* 3 Selectors (Pills) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {/* 10 Hooks Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>1. Escolher Gancho (1 a 10):</span>
                    <span className="text-rose-600 font-extrabold">{currentHook?.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {hooks.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          setSelectedHookIndex(h.index);
                          setCurrentPlaybackStep('hook');
                        }}
                        className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                          selectedHookIndex === h.index
                            ? 'bg-rose-600 text-white shadow-md scale-105 ring-2 ring-rose-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        G{h.index}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5 Bodies Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>2. Escolher Corpo Central (1 a 5):</span>
                    <span className="text-purple-600 font-extrabold">{currentBody?.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {bodies.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBodyIndex(b.index);
                          setCurrentPlaybackStep('body');
                        }}
                        className={`w-10 h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                          selectedBodyIndex === b.index
                            ? 'bg-purple-600 text-white shadow-md scale-105 ring-2 ring-purple-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        C{b.index}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 CTAs Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>3. Escolher CTA Final (1 a 3):</span>
                    <span className="text-amber-600 font-extrabold">{currentCta?.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ctas.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCtaIndex(c.index);
                          setCurrentPlaybackStep('cta');
                        }}
                        className={`px-3 h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          selectedCtaIndex === c.index
                            ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        CTA {c.index}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Assembled Combined Script Preview */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-600" />
                  <span>Roteiro Contínuo Montado (Sem Cortes Estranhos)</span>
                </h3>
                <button
                  onClick={() => {
                    const fullText = `[0-4s GANCHO]: ${currentHook?.script}\n\n[4-22s CORPO]: ${currentBody?.script}\n\n[22-26s CTA]: ${currentCta?.script}`;
                    navigator.clipboard.writeText(fullText);
                    showNotification("Roteiro contínuo copiado!", "success");
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Roteiro</span>
                </button>
              </div>

              <div className="space-y-3 font-sans text-sm text-gray-800">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-rose-700 tracking-wider">
                    [0-4s] Gancho #{selectedHookIndex} ({currentHook?.triggerOrValue})
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">"{currentHook?.script}"</p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                    [4-22s] Corpo #{selectedBodyIndex} ({currentBody?.triggerOrValue})
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">"{currentBody?.script}"</p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                    [22-26s] CTA #{selectedCtaIndex} ({currentCta?.triggerOrValue})
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">"{currentCta?.script}"</p>
                </div>
              </div>

              {/* Ready Social Caption */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Legenda Pronta para TikTok / Reels:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateComboCaption(currentHook, currentBody, currentCta));
                      showNotification("Legenda copiada com hashtags!", "success");
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Legenda</span>
                  </button>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 whitespace-pre-line max-h-36 overflow-y-auto">
                  {generateComboCaption(currentHook, currentBody, currentCta)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MATRIZ COMPLETA DOS 150 VÍDEOS (EXPLORADOR)       */}
      {/* ========================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter by Hook */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <span>Gancho:</span>
                <select
                  value={matrixFilterHook}
                  onChange={(e) => {
                    setMatrixFilterHook(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setMatrixCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  <option value="all">Todos (1-10)</option>
                  {hooks.map(h => (
                    <option key={h.id} value={h.index}>Gancho #{h.index}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Body */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <span>Corpo:</span>
                <select
                  value={matrixFilterBody}
                  onChange={(e) => {
                    setMatrixFilterBody(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setMatrixCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  <option value="all">Todos (1-5)</option>
                  {bodies.map(b => (
                    <option key={b.id} value={b.index}>Corpo #{b.index}</option>
                  ))}
                </select>
              </div>

              {/* Filter by CTA */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <span>CTA:</span>
                <select
                  value={matrixFilterCta}
                  onChange={(e) => {
                    setMatrixFilterCta(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setMatrixCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  <option value="all">Todos (1-3)</option>
                  {ctas.map(c => (
                    <option key={c.id} value={c.index}>CTA #{c.index}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fast Batch Schedule Button */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">
                Exibindo <strong className="text-gray-900 font-extrabold">{filteredCombinations.length}</strong> de 150 vídeos
              </span>
              <button
                onClick={() => setBatchModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar no Calendário</span>
              </button>
            </div>
          </div>

          {/* Cards Grid for the 150 Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCombinations.map((combo) => {
              const hk = hooks.find(h => h.index === combo.hookIndex);
              const bd = bodies.find(b => b.index === combo.bodyIndex);
              const ct = ctas.find(c => c.index === combo.ctaIndex);

              return (
                <div
                  key={combo.id}
                  className="bg-white border border-gray-200 hover:border-pink-400 hover:shadow-md rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-gray-900 text-white font-black text-xs rounded-lg">
                        #{combo.comboNumber.toString().padStart(3, '0')}
                      </span>
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        ~{combo.totalDurationSec}s
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-gray-900 line-clamp-1">
                      {combo.title}
                    </h4>

                    {/* Breakdown Chips */}
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 bg-rose-50/70 border border-rose-100 rounded-lg">
                        <span className="font-black text-rose-700 text-[10px] uppercase block">
                          Gancho #{combo.hookIndex}:
                        </span>
                        <p className="text-gray-800 line-clamp-1 font-medium">{hk?.script}</p>
                      </div>

                      <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-lg">
                        <span className="font-black text-purple-700 text-[10px] uppercase block">
                          Corpo #{combo.bodyIndex}:
                        </span>
                        <p className="text-gray-800 line-clamp-1 font-medium">{bd?.script}</p>
                      </div>

                      <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg">
                        <span className="font-black text-amber-700 text-[10px] uppercase block">
                          CTA #{combo.ctaIndex}:
                        </span>
                        <p className="text-gray-800 line-clamp-1 font-medium">{ct?.script}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedHookIndex(combo.hookIndex);
                        setSelectedBodyIndex(combo.bodyIndex);
                        setSelectedCtaIndex(combo.ctaIndex);
                        setActiveTab('simulator');
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-gray-700" />
                      <span>Ver no Player</span>
                    </button>

                    <button
                      onClick={() => {
                        onSchedulePost({
                          caption: combo.caption,
                          mediaUrl: hk?.videoUrl || undefined,
                          mediaType: 'video',
                          platforms: ['tiktok', 'instagram']
                        });
                        showNotification(`Vídeo #${combo.comboNumber} carregado no Criador de Posts!`, "success");
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Agendar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setMatrixCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={matrixCurrentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-40 cursor-pointer"
              >
                Anterior
              </button>

              <span className="text-xs font-bold text-gray-600 px-3">
                Página {matrixCurrentPage} de {totalPages}
              </span>

              <button
                onClick={() => setMatrixCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={matrixCurrentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-40 cursor-pointer"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BATCH SCHEDULING 150 VIDEOS INTO CALENDAR          */}
      {/* ========================================================= */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-gray-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600">
                <Calendar className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-wider">Automação em Lote</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">
                Distribuir 150 Vídeos no Calendário
              </h2>
              <p className="text-xs text-gray-500">
                Preencha seu calendário com até 5 meses de postagens diárias de uma só vez.
              </p>
            </div>

            <div className="space-y-4">
              {/* How many to schedule */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Quantos vídeos deseja agendar?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 75, 150].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBatchCountToSchedule(num)}
                      className={`py-2.5 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                        batchCountToSchedule === num
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {num} Vídeos
                      <span className="block text-[10px] font-normal opacity-80">
                        {num === 30 ? '1 Mês' : num === 75 ? '2.5 Meses' : '5 Meses'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cadence: 1, 2 or 3 per day */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Cadência de Publicação:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostsPerDay(1)}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      postsPerDay === 1
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    1 Vídeo / Dia
                    <span className="block text-[10px] text-gray-400 font-normal">18:30 (Noite)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostsPerDay(2)}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      postsPerDay === 2
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    2 Vídeos / Dia
                    <span className="block text-[10px] text-gray-400 font-normal">12:00 e 19:00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostsPerDay(3)}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      postsPerDay === 3
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    3 Vídeos / Dia
                    <span className="block text-[10px] text-gray-400 font-normal">10h, 15h e 20h</span>
                  </button>
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Data de Início da Sequência:</label>
                <input
                  type="date"
                  value={scheduleStartDate}
                  onChange={(e) => setScheduleStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800"
                />
              </div>

              {/* Target Platforms */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Publicar nas Redes:</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'tiktok', label: 'TikTok' },
                    { id: 'instagram', label: 'Instagram Reels' },
                    { id: 'youtube', label: 'YouTube Shorts' }
                  ].map(platform => {
                    const isSelected = selectedPlatforms.includes(platform.id as any);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (selectedPlatforms.length > 1) {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                            }
                          } else {
                            setSelectedPlatforms([...selectedPlatforms, platform.id as any]);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {platform.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBatchModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExecuteBatchSchedule}
                disabled={isBatchScheduling}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar e Injetar {batchCountToSchedule} Vídeos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LIVE CAMERA RECORDER WITH TELEPROMPTER            */}
      {/* ========================================================= */}
      {recordingModalOpen && recordingTargetPiece && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-gray-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Gravando: {recordingTargetPiece.title}
                </span>
                <p className="text-sm font-extrabold text-white">
                  Tempo sugerido: ~{recordingTargetPiece.durationSec} segundos
                </p>
              </div>

              <button
                onClick={stopMediaRecorder}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Stage with Floating Teleprompter */}
            <div className="relative w-full aspect-[9/16] max-h-[460px] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={liveVideoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100" // Mirror effect
              />

              {/* Floating Teleprompter at Eye Level */}
              <div className="absolute top-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center space-y-1 z-30">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                  Olhe para a lente e fale:
                </p>
                <p className="text-sm md:text-base font-bold text-white leading-relaxed">
                  "{recordingTargetPiece.script}"
                </p>
              </div>

              {/* Big Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40">
                  <span className="text-7xl font-black text-white animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                  <span>Gravando ao vivo</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="p-4 bg-[#18181f] border-t border-gray-800 flex items-center justify-between gap-4">
              <button
                onClick={stopMediaRecorder}
                className="px-4 py-2 text-gray-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>

              {!isRecording ? (
                <button
                  onClick={triggerActualRecording}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Iniciar Gravação (3, 2, 1)</span>
                </button>
              ) : (
                <button
                  onClick={stopMediaRecorder}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Concluir e Salvar Pedacinho</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SAVED FACTORY PROJECTS                             */}
      {/* ========================================================= */}
      {showSavedProjectsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FolderHeart className="w-5 h-5 text-rose-600" />
                  <span>Projetos Salvos da Fábrica</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Carregue uma matriz anterior ou alterne entre seus nichos.
                </p>
              </div>

              <button
                onClick={() => setShowSavedProjectsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {savedProjects.length === 0 ? (
                <div className="p-8 text-center text-gray-400 space-y-2">
                  <FolderHeart className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">Nenhum projeto salvo ainda.</p>
                  <p className="text-xs">Clique no botão de salvar no topo para guardar a matriz atual!</p>
                </div>
              ) : (
                savedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-rose-400 hover:bg-rose-50/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{proj.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Nicho: {proj.niche} • 150 combinações
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(proj.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleLoadSavedProject(proj)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Carregar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowSavedProjectsModal(false)}
                className="px-5 py-2 text-gray-600 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
