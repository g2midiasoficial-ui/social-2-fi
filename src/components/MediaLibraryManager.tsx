import React, { useState } from "react";
import { SocialPost } from "../types";
import { 
  FolderOpen, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  Tag, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ExternalLink,
  BookOpen,
  TrendingUp,
  Bookmark,
  Trash2
} from "lucide-react";

export interface MediaTemplate {
  id: string;
  title: string;
  category: 'reels' | 'carrossel' | 'copy' | 'quote' | 'oferta';
  categoryLabel: string;
  caption: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  tags: string[];
  engagementTip: string;
}

interface MediaLibraryManagerProps {
  onUseTemplate: (postData: Partial<SocialPost>) => void;
  showNotification: (msg: string, type: 'success' | 'info') => void;
}

const INITIAL_TEMPLATES: MediaTemplate[] = [
  {
    id: "tpl-1",
    title: "🔥 Roteiro Viral: 'Os 3 Maiores Erros'",
    category: "reels",
    categoryLabel: "Reels / Vídeo",
    caption: "A maioria das pessoas falha nisso logo no começo: ❌ Erro 1: Querer perfeição antes da consistência. ❌ Erro 2: Ignorar os 3 primeiros segundos de retenção. ❌ Erro 3: Não ter uma chamada clara para ação. Qual desses você mais comete hoje? Comenta aqui embaixo! 👇🎯",
    mediaUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=800&fit=crop",
    mediaType: "video",
    tags: ["viral", "reels", "dicas", "crescimento"],
    engagementTip: "Use cortes rápidos a cada 2.5 segundos para maximizar a taxa de retenção do algoritmo."
  },
  {
    id: "tpl-2",
    title: "📊 Carrossel Educativo: 'Passo a Passo Prático'",
    category: "carrossel",
    categoryLabel: "Carrossel",
    caption: "Como estruturar um funil de conteúdo que vende no automático: 1️⃣ Topo: Atração com curiosidade e novidade. 2️⃣ Meio: Autoridade e quebra de objeções. 3️⃣ Fundo: Oferta direta com prova social. Salve este post para consultar quando for criar seu próximo lançamento! 💾✨",
    mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop",
    mediaType: "image",
    tags: ["carrossel", "educativo", "vendas", "marketing"],
    engagementTip: "Adicione uma seta indicativa no canto inferior direito para estimular o arrastar para o lado."
  },
  {
    id: "tpl-3",
    title: "⚡ Quebra de Padrão: 'Pare de Fazer Isso'",
    category: "copy",
    categoryLabel: "Modelo de Copy",
    caption: "Pare de perder tempo com estratégias que funcionavam em 2021! 🛑 O digital mudou e hoje quem não investe em storytelling e conexão humana é simplesmente ignorado no feed. Você concorda ou discorda? Deixe sua visão sincera nos comentários. 💬",
    mediaUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop",
    mediaType: "video",
    tags: ["polêmica", "opinião", "storytelling", "autoridade"],
    engagementTip: "Perguntas de 'concorda ou discorda' geram até 3x mais comentários de debate."
  },
  {
    id: "tpl-4",
    title: "🎯 Oferta Direta: 'Últimas Vagas / Lançamento'",
    category: "oferta",
    categoryLabel: "Oferta & Lançamento",
    caption: "As inscrições para a nova turma estão oficialmente ABERTAS! 🚀 Mas atenção: restam apenas algumas vagas com a condição especial de lançamento. Se você quer transformar seus resultados e ter meu acompanhamento de perto, digite 'EU QUERO' no direct ou acesse o link da bio agora mesmo! ⏳🔥",
    mediaUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=800&fit=crop",
    mediaType: "image",
    tags: ["lançamento", "vendas", "conversão", "urgência"],
    engagementTip: "Use palavras-chave automáticas como 'EU QUERO' para integrar com o n8n ou ManyChat."
  },
  {
    id: "tpl-5",
    title: "☕ Conexão & Mentalidade de Segunda-Feira",
    category: "quote",
    categoryLabel: "Inspiração / Quote",
    caption: "Não espere a motivação chegar para agir. É a ação disciplinada que gera o entusiasmo e os resultados que você procura. Que sua semana seja de foco inabalável e muitas conquistas! Bom dia! ☀️☕",
    mediaUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop",
    mediaType: "image",
    tags: ["motivação", "lifestyle", "segunda-feira", "conexão"],
    engagementTip: "Ideal para publicar cedo (entre 07:30 e 09:00) para pegar a rotina matinal da sua audiência."
  },
  {
    id: "tpl-6",
    title: "🎬 Bastidores: 'O Processo por Trás do Resultado'",
    category: "reels",
    categoryLabel: "Reels / Vídeo",
    caption: "Ninguém vê os rascunhos apagados, as noites de estudo e os testes que deram errado antes do sucesso. O processo é real e desafiador, mas cada etapa vale a pena. Mostrando um pouco dos bastidores de hoje! 💻🎥",
    mediaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    mediaType: "video",
    tags: ["bastidores", "vulnerabilidade", "autenticidade"],
    engagementTip: "Vídeos sem muita edição com áudio em alta transmitem maior sensação de proximidade e verdade."
  }
];

export default function MediaLibraryManager({ onUseTemplate, showNotification }: MediaLibraryManagerProps) {
  const [templates, setTemplates] = useState<MediaTemplate[]>(() => {
    const saved = localStorage.getItem("socialflow_media_library");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TEMPLATES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new template
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<'reels' | 'carrossel' | 'copy' | 'quote' | 'oferta'>('reels');
  const [newCaption, setNewCaption] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=800&fit=crop");
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('video');
  const [newTags, setNewTags] = useState("viral, reels, dica");
  const [newTip, setNewTip] = useState("");

  const saveTemplates = (updated: MediaTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem("socialflow_media_library", JSON.stringify(updated));
  };

  const categories = [
    { id: 'all', label: 'Todos os Modelos' },
    { id: 'reels', label: '🎬 Reels & Vídeos' },
    { id: 'carrossel', label: '📊 Carrosséis' },
    { id: 'copy', label: '⚡ Copies Virais' },
    { id: 'oferta', label: '🎯 Ofertas & Vendas' },
    { id: 'quote', label: '☕ Inspiração' }
  ];

  const filteredTemplates = templates.filter(tpl => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
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
    onUseTemplate({
      caption: tpl.caption,
      mediaUrl: tpl.mediaUrl,
      mediaType: tpl.mediaType,
      platforms: ['instagram', 'tiktok'],
      destinations: ['feed', 'story'],
      status: 'draft'
    });
    showNotification("Modelo carregado no Agendador de Posts!", "success");
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCaption.trim()) return;

    const categoryLabels: Record<string, string> = {
      reels: 'Reels / Vídeo',
      carrossel: 'Carrossel',
      copy: 'Modelo de Copy',
      quote: 'Inspiração / Quote',
      oferta: 'Oferta & Lançamento'
    };

    const newTpl: MediaTemplate = {
      id: `tpl-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Geral',
      caption: newCaption,
      mediaUrl: newMediaUrl,
      mediaType: newMediaType,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      engagementTip: newTip || "Poste nos melhores horários de maior engajamento da sua audiência."
    };

    const updated = [newTpl, ...templates];
    saveTemplates(updated);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewCaption("");
    showNotification("Novo modelo salvo na biblioteca com sucesso!", "success");
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    saveTemplates(updated);
    showNotification("Modelo removido da biblioteca.", "info");
  };

  return (
    <div className="p-4 md:p-8 flex-1 bg-gray-50 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      
      {/* Top Header & Search Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Biblioteca de Mídias & Modelos</h2>
            <span className="bg-pink-100 text-pink-700 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
              {templates.length} Modelos
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Reutilize roteiros de alta retenção, copys testadas para Reels e carrosséis com apenas um clique.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar modelos ou tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-pink-500 font-medium"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Salvar Modelo</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#25172a] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200/80 rounded-3xl flex flex-col items-center gap-3">
          <FolderOpen className="w-10 h-10 text-gray-300" />
          <h3 className="text-sm font-bold text-gray-800">Nenhum modelo encontrado</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Tente mudar o termo de busca ou adicione um novo modelo personalizado à sua biblioteca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(tpl => (
            <div 
              key={tpl.id}
              className="bg-white rounded-3xl border border-gray-200/80 hover:border-pink-300 hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Media Preview / Banner */}
              <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
                {tpl.mediaUrl ? (
                  <img 
                    src={tpl.mediaUrl} 
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-purple-900 to-pink-900 flex items-center justify-center text-white">
                    <Sparkles className="w-10 h-10 opacity-40" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {tpl.categoryLabel}
                  </span>
                  <span className="px-2 py-1 bg-pink-500 text-white text-[10px] font-bold rounded-lg uppercase">
                    {tpl.mediaType === 'video' ? '🎬 Vídeo' : '📷 Foto'}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteTemplate(tpl.id)}
                  className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Excluir modelo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">
                    {tpl.title}
                  </h4>

                  <p className="text-xs text-gray-600 font-medium line-clamp-3 leading-relaxed bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                    "{tpl.caption}"
                  </p>

                  {/* Growth & Engagement Tip */}
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/70 border border-amber-200/50 p-2 rounded-xl">
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

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleCopyCaption(tpl)}
                    className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
                    className="py-2 px-3 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Usar no Post</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create New Media / Copy Template */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-pink-600" />
                <span>Salvar Novo Modelo na Biblioteca</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Título do Modelo</label>
                <input 
                  type="text" 
                  placeholder="ex: Roteiro Viral de Curiosidade para Reels" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Categoria</label>
                  <select 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-pink-500"
                  >
                    <option value="reels">🎬 Reels & Vídeos</option>
                    <option value="carrossel">📊 Carrosséis</option>
                    <option value="copy">⚡ Modelos de Copy</option>
                    <option value="oferta">🎯 Oferta & Lançamento</option>
                    <option value="quote">☕ Inspiração & Quote</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase">Tipo de Mídia</label>
                  <select 
                    value={newMediaType} 
                    onChange={e => setNewMediaType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-pink-500"
                  >
                    <option value="video">🎬 Vídeo / Reels</option>
                    <option value="image">📷 Imagem / Carrossel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Legenda / Roteiro Completo</label>
                <textarea 
                  rows={4}
                  placeholder="Escreva a legenda com ganchos, corpo do texto e chamada para ação..." 
                  value={newCaption} 
                  onChange={e => setNewCaption(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-pink-500 leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">URL da Imagem ou Vídeo de Capa</label>
                <input 
                  type="url" 
                  value={newMediaUrl} 
                  onChange={e => setNewMediaUrl(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Dica de Engajamento / Aplicação</label>
                <input 
                  type="text" 
                  placeholder="ex: Grave com áudio em alta para dobrar o alcance" 
                  value={newTip} 
                  onChange={e => setNewTip(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase">Tags (separadas por vírgula)</label>
                <input 
                  type="text" 
                  placeholder="viral, dicas, marketing, reels" 
                  value={newTags} 
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Salvar Modelo na Biblioteca
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
