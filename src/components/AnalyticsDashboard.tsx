import { useState, useMemo } from "react";
import { 
  initialAnalyticsGrowth, 
  demographicsAgeData, 
  demographicsGenderData, 
  demographicsCountryData 
} from "../data";
import { SocialChannel, SocialPost, SubTabAnalytics } from "../types";
import { 
  TrendingUp, 
  Users, 
  Plus, 
  X,
  Instagram, 
  Video, 
  Facebook, 
  Youtube, 
  SlidersHorizontal, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Share2,
  ExternalLink,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from "recharts";

interface AnalyticsDashboardProps {
  channels: SocialChannel[];
  posts: SocialPost[];
  onConnectChannel: (channelId: string) => void;
  onDisconnectChannel?: (channelId: string) => void;
  activeSubTabAnalytics: SubTabAnalytics;
  setActiveSubTabAnalytics: (tab: SubTabAnalytics) => void;
}

export default function AnalyticsDashboard({
  channels,
  posts,
  onConnectChannel,
  onDisconnectChannel,
  activeSubTabAnalytics,
  setActiveSubTabAnalytics
}: AnalyticsDashboardProps) {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('instagram');
  const [dateRange, setDateRange] = useState("18 Jun 2026 - 24 Jun 2026");

  // Filter connected channels
  const activeChannel = useMemo(() => {
    return channels.find(c => c.id === selectedChannelId) || channels.find(c => c.connected) || channels[0];
  }, [channels, selectedChannelId]);

  // Published posts performance data for the posts table
  const publishedPosts = useMemo(() => {
    return posts.filter(post => post.status === 'scheduled' || post.status === 'published');
  }, [posts]);

  // Calculate high-level summary KPIs dynamically based on the connected account
  const kpis = useMemo(() => {
    const totalFollowers = activeChannel?.followers || 0;
    const followersChange = activeChannel?.followersChange || 0;
    
    return {
      totalFollowers: totalFollowers,
      followersChange: followersChange,
      followersChangePercent: totalFollowers > 0 ? Number(((followersChange / totalFollowers) * 100).toFixed(1)) : 0,
      followersDaily: Number((followersChange / 7).toFixed(1)),
      followersPerPost: Number((followersChange / 3).toFixed(1)),
      following: selectedChannelId === 'instagram' ? 262 : selectedChannelId === 'tiktok' ? 110 : selectedChannelId === 'facebook' ? 450 : 180,
      followingChange: selectedChannelId === 'instagram' ? 2 : selectedChannelId === 'tiktok' ? 5 : selectedChannelId === 'facebook' ? 12 : 3,
      dailyPosts: selectedChannelId === 'instagram' ? 0.14 : selectedChannelId === 'tiktok' ? 0.28 : selectedChannelId === 'facebook' ? 0.42 : 0.2,
      weeklyViews: selectedChannelId === 'instagram' ? 1 : selectedChannelId === 'tiktok' ? 4 : selectedChannelId === 'facebook' ? 3 : 5
    };
  }, [activeChannel, selectedChannelId]);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col xl:flex-row font-sans">
      
      {/* Left Vertical Social Accounts Sidebar Selector */}
      <aside className="w-full xl:w-72 bg-[#1e1322] border-r border-[#2d1e32] p-5 flex flex-col gap-5 text-white select-none">
        
        <div className="pb-3 border-b border-[#2d1e32]">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Canais conectados</h4>
        </div>

        {/* Sidebar Channel Accounts Loop */}
        <div className="flex flex-col gap-2">
          {channels.map((channel) => {
            const isSelected = selectedChannelId === channel.id;
            
            return (
              <button
                key={channel.id}
                onClick={() => {
                  if (channel.connected) {
                    setSelectedChannelId(channel.id);
                  } else {
                    onConnectChannel(channel.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border text-left cursor-pointer ${
                  isSelected 
                    ? 'bg-[#311d36] border-[#ea4c89]/50 text-white shadow-md' 
                    : 'bg-[#150a17] border-transparent hover:bg-[#231526] text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {channel.connected ? (
                      <img 
                        src={channel.avatar} 
                        alt={channel.name} 
                        className="w-9 h-9 rounded-full object-cover border border-[#ea4c89]/30"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#27152b] flex items-center justify-center">
                        {channel.id === 'instagram' && <Instagram className="w-4 h-4 text-gray-500" />}
                        {channel.id === 'tiktok' && <span className="text-gray-500 text-xs font-bold">T</span>}
                        {channel.id === 'facebook' && <Facebook className="w-4 h-4 text-gray-500" />}
                        {channel.id === 'youtube' && <Youtube className="w-4 h-4 text-gray-500" />}
                      </div>
                    )}

                    <span className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] text-white ${
                      channel.id === 'instagram' ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600' :
                      channel.id === 'tiktok' ? 'bg-black' :
                      channel.id === 'facebook' ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {channel.id === 'instagram' && <Instagram className="w-2.5 h-2.5" />}
                      {channel.id === 'tiktok' && <span className="font-bold">T</span>}
                      {channel.id === 'facebook' && <span className="font-bold">f</span>}
                      {channel.id === 'youtube' && <span className="font-bold">Y</span>}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-100">{channel.name}</span>
                    <span className="text-[11px] text-gray-400 truncate max-w-[130px]">
                      {channel.connected ? `@${channel.username}` : 'Não conectado'}
                    </span>
                  </div>
                </div>

                {channel.connected ? (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-bold text-pink-400 font-mono">
                        {channel.followers.toLocaleString()}
                      </span>
                      <span className={`text-[9px] font-semibold flex items-center gap-0.5 ${channel.followersChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {channel.followersChange >= 0 ? '+' : ''}{channel.followersChange}
                      </span>
                    </div>
                    {onDisconnectChannel && (
                      <span
                        title="Desconectar Conta"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Tem certeza que deseja desconectar a conta do ${channel.name}?`)) {
                            onDisconnectChannel(channel.id);
                          }
                        }}
                        className="p-1 hover:bg-[#48224d] text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="p-1 hover:bg-[#321a36] text-[#ea4c89] hover:text-white rounded-lg transition-colors">
                    <Plus className="w-4.5 h-4.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => onConnectChannel('instagram')}
          className="w-full mt-3 py-2.5 bg-gradient-to-r from-pink-500/10 to-purple-600/10 hover:from-pink-500/20 hover:to-purple-600/20 border border-pink-500/20 text-pink-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-pink-400" />
          <span>+ Mais conexões sociais</span>
        </button>

      </aside>

      {/* Right side primary workspace content */}
      <main className="flex-1 p-5 md:p-8 flex flex-col gap-6 overflow-y-auto">
        
        {/* Workspace Toolbar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-2xs border border-gray-100/60">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="p-1.5 bg-pink-50 text-pink-600 rounded-lg">
                {activeChannel.id === 'instagram' && <Instagram className="w-5 h-5" />}
                {activeChannel.id === 'tiktok' && <Video className="w-5 h-5" />}
                {activeChannel.id === 'facebook' && <Facebook className="w-5 h-5" />}
                {activeChannel.id === 'youtube' && <Youtube className="w-5 h-5" />}
              </span>
              <span>Análise de Desempenho — {activeChannel.name} (@{activeChannel.username})</span>
            </h2>
          </div>

          {/* Date Picker trigger */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtrar período:</span>
            <button className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl bg-white shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{dateRange}</span>
            </button>
          </div>
        </div>

        {/* Dynamic sub tab layout views depending on sub-navigation tabs */}
        {activeSubTabAnalytics === 'resumo' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Chart: Growth (Crescimento) Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Evolução da Comunidade (Crescimento)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Visão detalhada do saldo de seguidores e engajamento geral.</p>
                </div>

                {/* Legend KPIs selectors */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-pink-50 border border-pink-100/50 px-3.5 py-2 rounded-xl">
                    <Users className="w-4 h-4 text-pink-600" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wide">Seguidores</span>
                      <span className="text-xs font-bold text-pink-700 font-mono">
                        {kpis.totalFollowers.toLocaleString()}
                        <span className="text-[10px] text-red-500 font-semibold ml-1">↓ {Math.abs(kpis.followersChange)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/50 px-3.5 py-2 rounded-xl">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Seguindo</span>
                      <span className="text-xs font-bold text-gray-800 font-mono">
                        {kpis.following.toLocaleString()}
                        <span className="text-[10px] text-green-600 font-semibold ml-1">↑ {kpis.followingChange}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recharts responsive growth line curves */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={initialAnalyticsGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#221326", borderRadius: "12px", border: "none", color: "#fff" }}
                      labelStyle={{ fontWeight: "bold", fontSize: "11px", color: "#f472b6" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="followers" 
                      stroke="#ec4899" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                      name="Seguidores"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="following" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Seguindo"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visual KPI Grid cards below line charts */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seguidores</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-gray-800">{kpis.followersChange}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{Math.abs(kpis.followersChange)}</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Saldo total</span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seguidores diários</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-gray-800">{kpis.followersDaily}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{Math.abs(kpis.followersDaily)}</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Média por dia</span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seguidores p/ Post</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-gray-800">{kpis.followersPerPost}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{Math.abs(kpis.followersPerPost)}</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Conversão média</span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">A seguir</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-gray-800">+{kpis.followingChange}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{kpis.followingChange}</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Perfís seguidos</span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Publicações diárias</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-gray-800">{kpis.dailyPosts}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    <span>8.2%</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Frequência ativa</span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visualizações p/ Semana</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-gray-800">{kpis.weeklyViews}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    <span>14%</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Alcance estimado</span>
              </div>
            </div>

            {/* Follower balance bar graph section (Saldo de Seguidores) */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Saldo Líquido de Seguidores (Por Dia)</h3>
                <p className="text-xs text-gray-400">Variação líquida diária de novos seguidores vs. unfollows.</p>
              </div>

              <div className="h-60 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={initialAnalyticsGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#221326", borderRadius: "12px", border: "none", color: "#fff" }}
                    />
                    <Bar dataKey="followersChange" radius={[4, 4, 0, 0]}>
                      {initialAnalyticsGrowth.map((entry, index) => {
                        // Color code bar: positive green, negative pink/red
                        const val = index % 3 === 0 ? -1 : (index % 5 === 0 ? -2 : 3);
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={val >= 0 ? '#10b981' : '#ec4899'} 
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeSubTabAnalytics === 'comunidade' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-gray-900">Visão Expandida de Seguidores</h3>
            <p className="text-sm text-gray-500">Mapeamento dinâmico de interações e fidelização de audiência.</p>
            <div className="h-80 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50/50">
              <div className="text-center p-6 max-w-sm flex flex-col items-center gap-3">
                <BarChart3 className="w-8 h-8 text-pink-500" />
                <p className="font-semibold text-gray-800 text-sm">Integração em tempo real ativada</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Os dados estão sincronizados localmente com o calendário. Agende mais publicações para ver novas projeções de crescimento estimadas pela inteligência artificial.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTabAnalytics === 'demograficos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Age groups card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Distribuição por Faixa Etária</h3>
                <p className="text-xs text-gray-400 mt-0.5">Idade média do público de seguidores ativos.</p>
              </div>

              <div className="h-64 w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicsAgeData} layout="vertical" margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis dataKey="group" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#221326", borderRadius: "10px", border: "none", color: "#fff" }} />
                    <Bar dataKey="percentage" fill="#a78bfa" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Countries card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Principais Países</h3>
                <p className="text-xs text-gray-400 mt-0.5">Origem geográfica de seus seguidores.</p>
              </div>

              <div className="flex flex-col gap-3.5 my-4">
                {demographicsCountryData.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700">{item.country}</span>
                      <span className="text-gray-900 font-mono">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-gray-400">Total calculado com base em 2.515 perfis.</p>
            </div>
          </div>
        )}

        {/* Performances posts table list view tab */}
        {activeSubTabAnalytics === 'publicacoes' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Histórico de Publicações e Métricas</h3>
                <p className="text-xs text-gray-400">Ordene por curtidas, engajamento ou alcance estimado.</p>
              </div>
              <span className="text-xs font-bold bg-pink-50 text-pink-600 px-3 py-1 rounded-lg">
                {publishedPosts.length} postagens encontradas
              </span>
            </div>

            {/* Table layout of items */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase font-bold">
                    <th className="py-3 px-2">Publicação</th>
                    <th className="py-3 px-2">Data / Hora</th>
                    <th className="py-3 px-2 text-center">Curtidas</th>
                    <th className="py-3 px-2 text-center">Comentários</th>
                    <th className="py-3 px-2 text-center">Cliques</th>
                    <th className="py-3 px-2 text-center">Alcance</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {publishedPosts.map((post) => {
                    const likes = post.analytics?.likes || 0;
                    const comments = post.analytics?.comments || 0;
                    const clicks = post.analytics?.clicks || 0;
                    const views = post.analytics?.views || 0;

                    return (
                      <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-2 max-w-sm">
                          <div className="flex items-center gap-3">
                            {post.mediaUrl ? (
                              <img 
                                src={post.mediaUrl} 
                                alt="Thumb" 
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div className="flex flex-col gap-0.5">
                              <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
                                {post.caption}
                              </p>
                              {/* Network tags */}
                              <div className="flex gap-1 mt-1">
                                {post.platforms.map(platform => (
                                  <span key={platform} className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                    {platform}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-2 text-xs font-semibold text-gray-500 font-mono">
                          {post.date}<br/>{post.time}
                        </td>

                        <td className="py-4 px-2 text-center font-bold text-gray-700 font-mono">
                          {likes}
                        </td>

                        <td className="py-4 px-2 text-center text-gray-700 font-mono">
                          {comments}
                        </td>

                        <td className="py-4 px-2 text-center text-gray-600 font-mono">
                          {clicks}
                        </td>

                        <td className="py-4 px-2 text-center font-bold text-gray-800 font-mono">
                          {views ? views.toLocaleString() : "-"}
                        </td>

                        <td className="py-4 px-2 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            post.status === 'published' ? 'bg-green-50 text-green-700' :
                            post.status === 'scheduled' ? 'bg-pink-50 text-pink-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {post.status === 'published' ? 'Publicado' : 'Agendado'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
