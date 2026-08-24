import React, { useState } from "react";
import { SocialPost } from "../types";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Clock, 
  Calendar, 
  Instagram, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Sliders, 
  Edit3,
  RefreshCw,
  Info
} from "lucide-react";

export interface AutoListQueueItem {
  id: string;
  caption: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  platforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  category: string;
}

export interface AutoList {
  id: string;
  name: string;
  description: string;
  active: boolean;
  color: string;
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  timeSlots: string[]; // e.g. ["10:00", "18:00"]
  platforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  queue: AutoListQueueItem[];
  postsPublishedCount: number;
}

interface AutoListsManagerProps {
  onSchedulePost: (post: SocialPost) => void;
  showNotification: (msg: string, type: 'success' | 'info') => void;
}

const INITIAL_AUTOLISTS: AutoList[] = [
  {
    id: "al-1",
    name: "🚀 Reels Virais & Retenção",
    description: "Vídeos curtos de alto impacto para crescimento orgânico no Instagram e TikTok.",
    active: true,
    color: "from-pink-500 to-rose-600",
    daysOfWeek: [1, 3, 5], // Seg, Qua, Sex
    timeSlots: ["10:00", "18:30"],
    platforms: ["instagram", "tiktok"],
    postsPublishedCount: 28,
    queue: [
      {
        id: "q-1",
        caption: "Os 3 maiores erros que impedem seus vídeos de bater 100k views no Reels e TikTok. O número 2 é o que mais você comete! 🤯 Salva para aplicar hoje!",
        mediaUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=800&fit=crop",
        mediaType: "video",
        platforms: ["instagram", "tiktok"],
        category: "Crescimento & Dicas"
      },
      {
        id: "q-2",
        caption: "Como hackear o algoritmo em 2026: Pare de focar em likes e foque 100% em retenção dos primeiros 3 segundos. Assista até o final para o checklist completo! 🔥",
        mediaUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop",
        mediaType: "video",
        platforms: ["instagram", "tiktok"],
        category: "Estratégia Digital"
      },
      {
        id: "q-3",
        caption: "Minha rotina de gravação de 10 conteúdos em apenas 2 horas. Produtividade máxima sem perder a autenticidade! 🎬💡",
        mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop",
        mediaType: "video",
        platforms: ["instagram"],
        category: "Bastidores"
      }
    ]
  },
  {
    id: "al-2",
    name: "💡 Dicas & Tutoriais Educativos",
    description: "Carrosséis e posts com passo a passo prático para nutrir a audiência.",
    active: true,
    color: "from-violet-500 to-indigo-600",
    daysOfWeek: [2, 4], // Ter, Qui
    timeSlots: ["14:00"],
    platforms: ["instagram", "facebook"],
    postsPublishedCount: 14,
    queue: [
      {
        id: "q-4",
        caption: "Guia definitivo: Como escolher a paleta de cores perfeita para o perfil da sua marca sem complicar. Arraste para o lado 👉🎨",
        mediaUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=800&fit=crop",
        mediaType: "image",
        platforms: ["instagram", "facebook"],
        category: "Design & Branding"
      },
      {
        id: "q-5",
        caption: "Ferramentas secretas de IA que todo social media profissional deveria usar neste ano. Testadas e aprovadas! 🤖⚡",
        mediaUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop",
        mediaType: "image",
        platforms: ["instagram"],
        category: "Tecnologia & IA"
      }
    ]
  },
  {
    id: "al-3",
    name: "☕ Inspiração & Mentalidade",
    description: "Quotes e reflexões de início de semana para gerar conexão e compartilhamentos.",
    active: false,
    color: "from-amber-500 to-orange-600",
    daysOfWeek: [0, 1], // Dom, Seg
    timeSlots: ["08:30"],
    platforms: ["instagram"],
    postsPublishedCount: 9,
    queue: [
      {
        id: "q-6",
        caption: "A disciplina é a ponte entre seus objetivos e a realização. Uma semana abençoada e muito produtiva a todos! ✨☕",
        mediaUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop",
        mediaType: "image",
        platforms: ["instagram"],
        category: "Motivacional"
      }
    ]
  }
];

export default function AutoListsManager({ onSchedulePost, showNotification }: AutoListsManagerProps) {
  const [autolists, setAutolists] = useState<AutoList[]>(() => {
    const saved = localStorage.getItem("socialflow_autolists");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_AUTOLISTS;
  });

  const [selectedListId, setSelectedListId] = useState<string>(autolists[0]?.id || "al-1");
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [isAddingItemModal, setIsAddingItemModal] = useState(false);

  // Form states for creating new Autolist
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListDays, setNewListDays] = useState<number[]>([1, 3, 5]);
  const [newListTime, setNewListTime] = useState("10:00");
  const [newListPlatforms, setNewListPlatforms] = useState<('instagram' | 'tiktok' | 'facebook' | 'youtube')[]>(['instagram', 'tiktok']);

  // Form states for adding item to queue
  const [itemCaption, setItemCaption] = useState("");
  const [itemMediaUrl, setItemMediaUrl] = useState("https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=800&fit=crop");
  const [itemMediaType, setItemMediaType] = useState<'image' | 'video'>('video');
  const [itemCategory, setItemCategory] = useState("Geral");

  const saveLists = (updated: AutoList[]) => {
    setAutolists(updated);
    localStorage.setItem("socialflow_autolists", JSON.stringify(updated));
  };

  const currentList = autolists.find(l => l.id === selectedListId) || autolists[0];

  const toggleListActive = (id: string) => {
    const updated = autolists.map(l => {
      if (l.id === id) {
        const nextState = !l.active;
        showNotification(`Autolista "${l.name}" ${nextState ? 'ativada' : 'pausada'}.`, 'info');
        return { ...l, active: nextState };
      }
      return l;
    });
    saveLists(updated);
  };

  const handleDeleteList = (id: string) => {
    if (autolists.length <= 1) {
      showNotification("Você precisa manter pelo menos uma Autolista ativa.", "info");
      return;
    }
    const updated = autolists.filter(l => l.id !== id);
    saveLists(updated);
    setSelectedListId(updated[0].id);
    showNotification("Autolista excluída com sucesso.", "info");
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList: AutoList = {
      id: `al-${Date.now()}`,
      name: newListName,
      description: newListDesc || "Fila de agendamento automático recorrente.",
      active: true,
      color: "from-pink-500 to-violet-600",
      daysOfWeek: newListDays,
      timeSlots: [newListTime],
      platforms: newListPlatforms,
      postsPublishedCount: 0,
      queue: []
    };

    const updated = [...autolists, newList];
    saveLists(updated);
    setSelectedListId(newList.id);
    setIsCreatingModal(false);
    setNewListName("");
    setNewListDesc("");
    showNotification(`Autolista "${newList.name}" criada com sucesso!`, "success");
  };

  const handleAddItemToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemCaption.trim() || !currentList) return;

    const newItem: AutoListQueueItem = {
      id: `q-${Date.now()}`,
      caption: itemCaption,
      mediaUrl: itemMediaUrl,
      mediaType: itemMediaType,
      platforms: currentList.platforms,
      category: itemCategory
    };

    const updated = autolists.map(l => {
      if (l.id === currentList.id) {
        return {
          ...l,
          queue: [...l.queue, newItem]
        };
      }
      return l;
    });

    saveLists(updated);
    setIsAddingItemModal(false);
    setItemCaption("");
    showNotification("Novo post adicionado à fila da Autolista!", "success");
  };

  const handleDeleteQueueItem = (itemId: string) => {
    if (!currentList) return;
    const updated = autolists.map(l => {
      if (l.id === currentList.id) {
        return {
          ...l,
          queue: l.queue.filter(q => q.id !== itemId)
        };
      }
      return l;
    });
    saveLists(updated);
    showNotification("Item removido da fila.", "info");
  };

  const handleDispatchNextPost = (item: AutoListQueueItem) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const timeSlot = currentList?.timeSlots[0] || "10:00";

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      caption: item.caption,
      platforms: item.platforms,
      destinations: ['feed', 'story'],
      date: formattedDate,
      time: timeSlot,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      status: 'scheduled',
      bestTimeScore: 94,
      analytics: { likes: 0, comments: 0, views: 0, shares: 0, clicks: 0 }
    };

    onSchedulePost(newPost);
    handleDeleteQueueItem(item.id);
    showNotification("Post da Autolista programado no Calendário para hoje!", "success");
  };

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="p-4 md:p-8 flex-1 bg-gray-50 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1f1025] via-[#2d1637] to-[#1a0f20] text-white p-6 md:p-8 rounded-3xl border border-[#3e2746] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 shrink-0">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">Autolistas Recorrentes</h2>
              <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                Automação Inteligente
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
              Crie filas automatizadas que publicam seus conteúdos continuamente nos melhores horários de cada semana sem necessidade de agendamento individual.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Autolista</span>
        </button>
      </div>

      {/* Main Grid: Left Autolist Selector & Right Queue Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: List of Autolists */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 px-1">
            Suas Filas de Autolistas ({autolists.length})
          </h3>

          <div className="flex flex-col gap-3">
            {autolists.map(list => {
              const isSelected = list.id === selectedListId;
              return (
                <div
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 relative ${
                    isSelected 
                      ? 'bg-white border-pink-500 shadow-md shadow-pink-500/5 ring-2 ring-pink-500/20' 
                      : 'bg-white hover:bg-gray-50/80 border-gray-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{list.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{list.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleListActive(list.id);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        list.active 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={list.active ? 'Pausar Autolista' : 'Ativar Autolista'}
                    >
                      {list.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-pink-500" />
                        {list.queue.length} {list.queue.length === 1 ? 'post na fila' : 'posts na fila'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{list.timeSlots.join(", ")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Queue Manager for Selected Autolist */}
        {currentList && (
          <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            
            {/* Header of Active List */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-gray-900">{currentList.name}</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    currentList.active 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {currentList.active ? '● Ativa' : '○ Pausada'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{currentList.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingItemModal(true)}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar à Fila</span>
                </button>

                <button
                  onClick={() => handleDeleteList(currentList.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Excluir esta Autolista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recurrence Settings Summary Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Dias de Publicação
                </span>
                <div className="flex gap-1 flex-wrap">
                  {dayNames.map((name, idx) => {
                    const isSelected = currentList.daysOfWeek.includes(idx);
                    return (
                      <span 
                        key={idx} 
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected 
                            ? 'bg-pink-100 text-pink-700 border border-pink-200' 
                            : 'bg-gray-200/50 text-gray-400'
                        }`}
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Horários Programados
                </span>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold font-mono">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  <span>{currentList.timeSlots.join(" | ")}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Total Publicados
                </span>
                <span className="font-extrabold text-gray-900 text-sm">
                  {currentList.postsPublishedCount} posts despachados
                </span>
              </div>
            </div>

            {/* Posts Queue Listing */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-pink-500" />
                  <span>Fila de Conteúdos ({currentList.queue.length})</span>
                </h4>
                <span className="text-[11px] text-gray-400">Despacho automático na ordem da fila</span>
              </div>

              {currentList.queue.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-800">A fila desta Autolista está vazia</h5>
                    <p className="text-xs text-gray-400 max-w-sm mt-1">
                      Adicione novos conteúdos para que o sistema continue publicando automaticamente nos dias programados.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingItemModal(true)}
                    className="px-4 py-2 bg-pink-50 text-pink-700 hover:bg-pink-100 font-bold text-xs rounded-xl transition-all"
                  >
                    + Adicionar primeiro post à fila
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentList.queue.map((item, index) => (
                    <div 
                      key={item.id}
                      className="bg-white border border-gray-200/80 hover:border-pink-300 p-4 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>

                      {item.mediaUrl && (
                        <img 
                          src={item.mediaUrl} 
                          alt="Thumbnail" 
                          className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-pink-600 uppercase">
                            {item.mediaType === 'video' ? '🎬 Vídeo / Reels' : '📷 Imagem'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleDispatchNextPost(item)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1 transition-all cursor-pointer"
                          title="Agendar este item imediatamente no Calendário"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Despachar Hoje</span>
                        </button>

                        <button
                          onClick={() => handleDeleteQueueItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Remover da fila"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Modal: Create New Autolist */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-pink-600" />
                <span>Nova Autolista Recorrente</span>
              </h3>
              <button 
                onClick={() => setIsCreatingModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateList} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Nome da Autolista</label>
                <input 
                  type="text" 
                  placeholder="ex: 🚀 Reels de Alto Impacto" 
                  value={newListName} 
                  onChange={e => setNewListName(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Descrição / Objetivo</label>
                <input 
                  type="text" 
                  placeholder="ex: Vídeos de topo de funil para o público explorar." 
                  value={newListDesc} 
                  onChange={e => setNewListDesc(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1.5">Dias da Semana</label>
                <div className="flex gap-1.5">
                  {dayNames.map((name, idx) => {
                    const isSelected = newListDays.includes(idx);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (isSelected) {
                            setNewListDays(newListDays.filter(d => d !== idx));
                          } else {
                            setNewListDays([...newListDays, idx]);
                          }
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-pink-600 text-white border-pink-600' 
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Horário de Publicação</label>
                <input 
                  type="time" 
                  value={newListTime} 
                  onChange={e => setNewListTime(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Salvar e Ativar Autolista
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Item to Selected Autolist Queue */}
      {isAddingItemModal && currentList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-600" />
                <span>Adicionar Post à Fila</span>
              </h3>
              <button 
                onClick={() => setIsAddingItemModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItemToQueue} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Legenda do Post / Roteiro</label>
                <textarea 
                  rows={4}
                  placeholder="Escreva a legenda completa do conteúdo..." 
                  value={itemCaption} 
                  onChange={e => setItemCaption(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-pink-500 leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Categoria</label>
                <input 
                  type="text" 
                  placeholder="ex: Dicas de Reels, Promoção, Tutorial" 
                  value={itemCategory} 
                  onChange={e => setItemCategory(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Tipo de Mídia</label>
                  <select 
                    value={itemMediaType} 
                    onChange={e => setItemMediaType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-pink-500"
                  >
                    <option value="video">🎬 Vídeo / Reels</option>
                    <option value="image">📷 Imagem / Foto</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">URL da Imagem/Vídeo</label>
                  <input 
                    type="url" 
                    value={itemMediaUrl} 
                    onChange={e => setItemMediaUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Adicionar à Fila de Publicação
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
