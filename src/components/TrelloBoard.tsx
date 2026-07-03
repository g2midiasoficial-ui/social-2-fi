import React, { useState } from "react";
import { SocialPost } from "../types";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Edit3,
  Instagram,
  Check,
  FolderOpen,
  Sparkles,
  HelpCircle,
  Video,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "motion/react";

interface TrelloBoardProps {
  posts: SocialPost[];
  onEditPost: (post: SocialPost) => void;
  onOpenCreateModal: (defaultTime?: string, defaultDate?: string) => void;
  onDeletePost: (postId: string) => void;
  onUpdatePostStatus: (postId: string, newStatus: 'draft' | 'scheduled' | 'published') => void;
}

interface Column {
  id: 'draft' | 'scheduled' | 'published';
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  icon: string;
}

export default function TrelloBoard({
  posts,
  onEditPost,
  onOpenCreateModal,
  onDeletePost,
  onUpdatePostStatus
}: TrelloBoardProps) {
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  const columns: Column[] = [
    {
      id: 'draft',
      title: 'Ideias / Rascunhos',
      description: 'Publicações em fase de criação ou ideias de conteúdo',
      colorClass: 'bg-amber-500',
      bgClass: 'bg-amber-50/40',
      borderClass: 'border-amber-200/50',
      textClass: 'text-amber-800',
      icon: '💡'
    },
    {
      id: 'scheduled',
      title: 'Planeadas / Agendadas',
      description: 'Conteúdos agendados e prontos para publicação',
      colorClass: 'bg-pink-500',
      bgClass: 'bg-pink-50/40',
      borderClass: 'border-pink-200/50',
      textClass: 'text-pink-800',
      icon: '📅'
    },
    {
      id: 'published',
      title: 'Publicadas / Concluídas',
      description: 'Posts que já foram publicados nas redes',
      colorClass: 'bg-green-500',
      bgClass: 'bg-green-50/40',
      borderClass: 'border-green-200/50',
      textClass: 'text-green-800',
      icon: '✅'
    }
  ];

  // Drag and Drop handlers
  const handleDragStart = (postId: string) => {
    setDraggedPostId(postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: 'draft' | 'scheduled' | 'published') => {
    if (draggedPostId) {
      onUpdatePostStatus(draggedPostId, status);
      setDraggedPostId(null);
    }
  };

  // Helper to move posts using clickable controls (for accessibility & non-drag inputs)
  const moveCard = (postId: string, currentStatus: string, direction: 'left' | 'right') => {
    const statusOrder: ('draft' | 'scheduled' | 'published')[] = ['draft', 'scheduled', 'published'];
    const index = statusOrder.indexOf(currentStatus as any);
    if (index === -1) return;

    let targetIndex = index;
    if (direction === 'left' && index > 0) targetIndex = index - 1;
    if (direction === 'right' && index < statusOrder.length - 1) targetIndex = index + 1;

    if (targetIndex !== index) {
      onUpdatePostStatus(postId, statusOrder[targetIndex]);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 flex flex-col gap-6 font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-3xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
            <span className="p-2 bg-pink-100/60 rounded-xl text-pink-600">📋</span>
            <span>Fluxo de Conteúdo (Quadro Trello)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Organize seu funil de redes sociais. Arraste os cartões entre as colunas para mudar o estado de agendamento de forma prática.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateModal('10:00')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2a1b15] hover:bg-[#3d271f] text-amber-100 border border-amber-900/20 font-semibold text-xs md:text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Nova Ideia</span>
        </button>
      </div>

      {/* Trello Board Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-start">
        {columns.map((col) => {
          const columnPosts = posts.filter(post => post.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="flex flex-col rounded-xl bg-[#f1f2f4] border border-[#e3e6eb] p-3 min-h-[480px] transition-all relative"
            >
              {/* Header of Column */}
              <div className="flex items-center justify-between pb-2 mb-3 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-base">{col.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#172b4d] text-sm flex items-center gap-1.5">
                      <span>{col.title}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#dfe1e6] rounded-md text-[#42526e] font-bold">
                        {columnPosts.length}
                      </span>
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const statusToDate: Record<string, string> = {
                      draft: '',
                      scheduled: new Date().toISOString().split('T')[0],
                      published: new Date().toISOString().split('T')[0]
                    };
                    onOpenCreateModal('10:00', statusToDate[col.id]);
                  }}
                  className="p-1 hover:bg-[#dfe1e6] text-[#42526e] rounded-md transition-all cursor-pointer"
                  title="Adicionar à coluna"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards Loop inside Columns */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[580px] pr-0.5">
                {columnPosts.length === 0 ? (
                  <div className="flex-1 border border-dashed border-[#dfe1e6] rounded-lg flex flex-col items-center justify-center p-4 text-center text-gray-400 my-2 bg-white/40">
                    <FolderOpen className="w-6 h-6 text-gray-400 stroke-[1.5] mb-1" />
                    <p className="text-[11px] font-semibold">Sem publicações</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 max-w-[130px]">
                      Arraste um cartão ou clique em "+" para adicionar.
                    </p>
                  </div>
                ) : (
                  columnPosts.map((post) => {
                    return (
                      <motion.div
                        key={post.id}
                        layoutId={`post-${post.id}`}
                        draggable
                        onDragStart={() => handleDragStart(post.id)}
                        className="bg-white border border-[#dfe1e6] rounded-lg p-2.5 shadow-[0_1px_1px_rgba(9,30,66,0.25),_0_0_1px_rgba(9,30,66,0.31)] hover:shadow-[0_4px_8px_-2px_rgba(9,30,66,0.25),_0_0_1px_rgba(9,30,66,0.31)] hover:border-pink-400 transition-all cursor-grab active:cursor-grabbing relative group"
                      >
                        {/* Header card info */}
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <div className="flex items-center gap-1">
                            {post.platforms.map(platform => (
                              <span 
                                key={platform} 
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] ${
                                  platform === 'instagram' ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600' :
                                  platform === 'tiktok' ? 'bg-black' :
                                  platform === 'facebook' ? 'bg-blue-600' : 'bg-red-600'
                                }`}
                              >
                                {platform === 'instagram' && <Instagram className="w-2.5 h-2.5" />}
                                {platform === 'tiktok' && <span className="font-bold">T</span>}
                                {platform === 'facebook' && <span className="font-bold">f</span>}
                                {platform === 'youtube' && <span className="font-bold">Y</span>}
                              </span>
                            ))}
                            {/* Destinations mini badges */}
                            {post.destinations && post.destinations.length > 0 && (
                              <div className="flex gap-1 ml-1">
                                {post.destinations.map(dest => (
                                  <span key={dest} className="text-[7px] bg-pink-50 text-pink-600 border border-pink-100 font-extrabold px-1 py-0.2 rounded uppercase tracking-wider">
                                    {dest === 'feed' ? 'Feed' : 'Story'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#42526e]">
                            {post.status !== 'draft' && (
                              <span className="bg-[#f4f5f7] px-1 py-0.5 rounded-sm flex items-center gap-0.5">
                                <Calendar className="w-2.5 h-2.5 text-gray-400" />
                                {post.date.substring(5)}
                              </span>
                            )}
                            <span className="bg-[#f4f5f7] px-1 py-0.5 rounded-sm flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5 text-gray-400" />
                              {post.time}
                            </span>
                          </div>
                        </div>

                        {/* Image / Video preview thumbnail */}
                        {post.mediaUrl && (
                          <div className="w-full h-16 rounded-md overflow-hidden mb-1.5 border border-[#dfe1e6] relative group/media">
                            <img 
                              src={post.mediaUrl} 
                              alt="Preview thumbnail" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1 right-1 px-1 py-0.5 bg-black/70 text-[8px] text-white rounded-md flex items-center gap-0.5 backdrop-blur-xs">
                              {post.mediaType === 'video' ? <Video className="w-2 h-2" /> : <ImageIcon className="w-2 h-2" />}
                              <span className="capitalize font-semibold">{post.mediaType === 'video' ? 'Video' : 'Imagem'}</span>
                            </div>
                          </div>
                        )}

                        {/* Caption snippet text */}
                        <p className="text-[11px] text-[#172b4d] leading-snug font-medium line-clamp-3 mb-2">
                          {post.caption}
                        </p>

                        {/* Action controllers footer */}
                        <div className="flex items-center justify-between border-t border-[#dfe1e6]/60 pt-1.5">
                          {/* Left column shift arrow */}
                          <div className="flex items-center gap-0.5">
                            {col.id !== 'draft' && (
                              <button
                                onClick={() => moveCard(post.id, col.id, 'left')}
                                className="p-0.5 bg-gray-50 hover:bg-[#ebecf0] text-[#42526e] rounded-sm border border-[#dfe1e6] transition-colors cursor-pointer"
                                title="Mover para esquerda"
                              >
                                <ArrowLeft className="w-2.5 h-2.5" />
                              </button>
                            )}
                            
                            {col.id !== 'published' && (
                              <button
                                onClick={() => moveCard(post.id, col.id, 'right')}
                                className="p-0.5 bg-gray-50 hover:bg-[#ebecf0] text-[#42526e] rounded-sm border border-[#dfe1e6] transition-colors cursor-pointer"
                                title="Mover para direita"
                              >
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>

                          {/* Options to Edit & Delete */}
                          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditPost(post)}
                              className="p-1 hover:bg-[#ebecf0] text-[#42526e] rounded-sm transition-colors cursor-pointer"
                              title="Editar publicação"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Deseja realmente remover esta publicação do seu quadro?")) {
                                  onDeletePost(post.id);
                                }
                              }}
                              className="p-1 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-sm transition-colors cursor-pointer"
                              title="Deletar publicação"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
