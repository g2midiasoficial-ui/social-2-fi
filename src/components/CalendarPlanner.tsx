import { useState, useMemo } from "react";
import { SocialPost } from "../types";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Clock, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Plus, 
  Check, 
  Instagram, 
  Eye, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { getWeekdayDate } from "../data";

interface CalendarPlannerProps {
  posts: SocialPost[];
  onEditPost: (post: SocialPost) => void;
  onOpenCreateModal: (defaultTime?: string, defaultDate?: string) => void;
  onDeletePost: (postId: string) => void;
}

export default function CalendarPlanner({
  posts,
  onEditPost,
  onOpenCreateModal,
  onDeletePost
}: CalendarPlannerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBestTimeFilter, setActiveBestTimeFilter] = useState<'all' | 'instagram' | 'tiktok'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'best'>('grid');

  // Derive current week dates
  const weekDays = useMemo(() => {
    const days = [];
    const weekdaysNames = [
      'Domingo',
      'Segunda-Feira',
      'Terça-Feira',
      'Quarta-Feira',
      'Quinta-Feira',
      'Sexta-Feira',
      'Sábado'
    ];
    
    for (let i = 0; i < 7; i++) {
      const fullDate = getWeekdayDate(i);
      const parts = fullDate.split('-');
      const dayNum = parseInt(parts[2], 10);
      days.push({
        name: weekdaysNames[i],
        dayNum: dayNum,
        fullDate: fullDate
      });
    }
    return days;
  }, []);

  const weekRangeText = useMemo(() => {
    if (weekDays.length === 0) return "";
    const first = weekDays[0];
    const last = weekDays[6];
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + "T00:00:00");
      const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
      return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
    };

    return `${formatDate(first.fullDate)} - ${formatDate(last.fullDate)}`;
  }, [weekDays]);

  // Standard hours list from 08:00 to 20:00 for planning
  const hoursList = useMemo(() => {
    const hours = [];
    for (let i = 8; i <= 20; i++) {
      hours.push(`${i < 10 ? '0' + i : i}:00`);
    }
    return hours;
  }, []);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [posts, searchQuery]);

  // Map posts to a lookup object by [date_time] for easy cell placement
  const postsLookup = useMemo(() => {
    const map: Record<string, SocialPost[]> = {};
    filteredPosts.forEach(post => {
      // Clean post time to match exact hour block e.g. "10:00" or near
      const hourPart = post.time.split(':')[0] + ':00';
      const key = `${post.date}_${hourPart}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(post);
    });
    return map;
  }, [filteredPosts]);

  // Simulated best active times scores (0 to 100) for visual heatmap overlays
  // (June/July 2026 data heatmap overlay matches pink aesthetic from screenshot)
  const getBestTimeHeat = (dayIndex: number, hourStr: string) => {
    const hr = parseInt(hourStr.split(':')[0], 10);
    // Higher score means busier time (heat values are higher on sunday/monday mornings and evenings)
    let score = 30;
    if (hr === 10 || hr === 11) score = 90;
    else if (hr === 18 || hr === 19) score = 95;
    else if (hr >= 12 && hr <= 16) score = 70;
    else if (hr >= 8 && hr <= 9) score = 55;

    // Shift heat slightly based on platform selection
    if (activeBestTimeFilter === 'instagram') {
      if (dayIndex % 2 === 0) score += 5;
    } else if (activeBestTimeFilter === 'tiktok') {
      if (dayIndex % 2 !== 0) score += 5;
    }

    return Math.min(score, 100);
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 flex flex-col gap-6 font-sans">

      {/* Toolbar controls */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-gray-100">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar publicações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-gray-50/50"
          />
        </div>

        {/* Navigation & Date Picker */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700 bg-white shadow-2xs">
            Esta semana
          </button>
          
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <button className="p-2 hover:bg-gray-50 border-r border-gray-100 text-gray-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-xs md:text-sm font-semibold text-gray-700 min-w-[200px] text-center select-all">
              {weekRangeText}
            </span>
            <button className="p-2 hover:bg-gray-50 border-l border-gray-100 text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Best Time Filter Dropdown */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5">
            <button 
              onClick={() => setActiveBestTimeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBestTimeFilter === 'all' 
                  ? 'bg-white text-pink-600 shadow-2xs border border-pink-100/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Melhores Tempos
            </button>
            <button 
              onClick={() => setActiveBestTimeFilter('instagram')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBestTimeFilter === 'instagram' 
                  ? 'bg-pink-50 text-pink-600 shadow-2xs border border-pink-100/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Instagram
            </button>
            <button 
              onClick={() => setActiveBestTimeFilter('tiktok')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBestTimeFilter === 'tiktok' 
                  ? 'bg-violet-50 text-violet-600 shadow-2xs border-violet-100/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              TikTok
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs md:text-sm rounded-xl shadow-2xs bg-white">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span>Gerar visualização</span>
          </button>

          {/* Create Post Button */}
          <button
            id="create-post-calendar-button"
            onClick={() => onOpenCreateModal('10:00', getWeekdayDate(1))}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2a1b15] hover:bg-[#3d271f] text-amber-100 border border-amber-900/20 font-semibold text-xs md:text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4.5 h-4.5 text-amber-400" />
            <span>Criar publicação</span>
          </button>
        </div>
      </div>

      {/* Main Weekly Schedule Grid */}
      <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs flex flex-col min-h-[550px]">
        {/* Grid Header Days */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 bg-gray-50/70 py-3.5 sticky top-0 z-10 text-center select-none">
          <div className="flex items-center justify-center font-semibold text-xs text-gray-400 font-mono">
            GMT-3
          </div>
          {weekDays.map((day, i) => (
            <div key={day.fullDate} className="flex flex-col items-center justify-center px-1 border-l border-gray-100/80">
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                {day.name.split('-')[0]}
              </span>
              <span className="text-lg font-bold text-gray-800 mt-0.5 tracking-tight">
                {day.dayNum}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable grid area */}
        <div className="flex-1 overflow-y-auto">
          {hoursList.map(hour => (
            <div key={hour} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] min-h-[110px] border-b border-gray-100/70 hover:bg-gray-50/10 transition-colors">
              {/* Hour Column */}
              <div className="flex items-start justify-center pt-2 font-mono text-xs font-semibold text-gray-400 select-none">
                {hour}
              </div>

              {/* Day cells */}
              {weekDays.map((day, dayIndex) => {
                const cellKey = `${day.fullDate}_${hour}`;
                const cellPosts = postsLookup[cellKey] || [];
                const heatScore = getBestTimeHeat(dayIndex, hour);
                
                // Color mapping matching Metricool's smooth pink/purple gradient heatmap
                // higher engagement scores mean warmer pink overlays
                let heatClass = 'bg-white';
                if (heatScore >= 90) heatClass = 'bg-pink-100/70';
                else if (heatScore >= 70) heatClass = 'bg-pink-50/55';
                else if (heatScore >= 50) heatClass = 'bg-purple-50/20';

                return (
                  <div
                    key={cellKey}
                    id={`cell-${cellKey}`}
                    onClick={(e) => {
                      // Avoid opening modal if we click inside a post card
                      if (e.target === e.currentTarget) {
                        onOpenCreateModal(hour, day.fullDate);
                      }
                    }}
                    className={`relative p-1.5 border-l border-gray-100 flex flex-col gap-1.5 transition-all group cursor-pointer ${heatClass}`}
                  >
                    {/* Hover subtle create grid action icon */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-100 text-pink-600 p-0.5 rounded-md text-[10px] pointer-events-none flex items-center justify-center shadow-xs">
                      <Plus className="w-3 h-3" />
                    </div>

                    {/* Rendered post card loops */}
                    {cellPosts.map(post => {
                      const isMultiPlatform = post.platforms.length > 1;
                      return (
                        <div
                          key={post.id}
                          id={`post-card-${post.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPost(post);
                          }}
                          className="w-full bg-white rounded-xl border border-gray-200 p-2 shadow-xs hover:shadow-md hover:border-pink-300 transition-all cursor-pointer relative overflow-hidden group/card animate-in zoom-in-95 duration-150 flex flex-col justify-between"
                        >
                          {/* Post Card Header */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            {/* Platform Badge Icons */}
                            <div className="flex items-center gap-0.5">
                              {post.platforms.map(platform => (
                                <span 
                                  key={platform} 
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                                    platform === 'instagram' ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600' :
                                    platform === 'tiktok' ? 'bg-black' :
                                    platform === 'facebook' ? 'bg-blue-600' : 'bg-red-600'
                                  }`}
                                >
                                  {platform === 'instagram' && <Instagram className="w-2.5 h-2.5" />}
                                  {platform === 'tiktok' && <span className="text-[7px] font-bold font-mono">T</span>}
                                  {platform === 'facebook' && <span className="text-[8px] font-bold">f</span>}
                                  {platform === 'youtube' && <span className="text-[7px] font-bold">Y</span>}
                                </span>
                              ))}
                            </div>
                            
                            {/* Destinations mini badges */}
                            {post.destinations && post.destinations.length > 0 && (
                              <div className="flex gap-1 ml-1 overflow-hidden shrink-0">
                                {post.destinations.map(dest => (
                                  <span key={dest} className="text-[7px] bg-pink-50 text-pink-600 border border-pink-100 font-extrabold px-1 py-0.2 rounded uppercase tracking-wider">
                                    {dest === 'feed' ? 'Feed' : 'Story'}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Time */}
                            <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
                              {post.time}
                            </span>
                          </div>

                          {/* Caption Snippet */}
                          <p className="text-[11px] text-gray-700 leading-tight font-medium line-clamp-3 mb-1.5 select-none">
                            {post.caption}
                          </p>

                          {/* Bottom Info / Status bar */}
                          <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-gray-100">
                            {post.mediaUrl ? (
                              <div className="relative w-7 h-7 rounded-md bg-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                                <img 
                                  src={post.mediaUrl} 
                                  alt="Preview Thumb" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute bottom-0 right-0 bg-black/60 p-0.5 text-white rounded-tl-[3px] scale-75 flex items-center justify-center">
                                  {post.mediaType === 'video' ? <VideoIcon className="w-2 h-2" /> : <ImageIcon className="w-2 h-2" />}
                                </span>
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-md bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center shrink-0">
                                <Plus className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                            )}

                            {/* Actions / Metrics overlay on hover */}
                            <div className="flex items-center gap-1.5">
                              {/* Quick delete on hover */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm("Deseja realmente remover esta publicação agendada?")) {
                                    onDeletePost(post.id);
                                  }
                                }}
                                className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-400 transition-all shrink-0"
                                title="Deletar publicação"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              <span className={`w-1.5 h-1.5 rounded-full ${
                                post.status === 'published' ? 'bg-green-500' :
                                post.status === 'scheduled' ? 'bg-pink-500' : 'bg-amber-400'
                              }`} title={`Status: ${post.status}`}></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
