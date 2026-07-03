import { MainTab, SubTabCalendar, SubTabAnalytics } from "../types";
import { 
  BarChart3, 
  FileText, 
  Inbox, 
  Calendar, 
  Link2, 
  Megaphone, 
  ChevronDown, 
  Menu, 
  Sparkles, 
  Clock, 
  Layers, 
  Trash2, 
  Grid, 
  Compass,
  ArrowUpRight,
  TrendingUp,
  User,
  Settings,
  LogOut,
  HelpCircle,
  FolderHeart,
  Cable,
  Database
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  activeSubTabCalendar: SubTabCalendar;
  setActiveSubTabCalendar: (tab: SubTabCalendar) => void;
  activeSubTabAnalytics: SubTabAnalytics;
  setActiveSubTabAnalytics: (tab: SubTabAnalytics) => void;
  currentProfile: { username: string; avatar: string; email?: string };
  onOpenN8NModal?: () => void;
  onLogout?: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  activeSubTabCalendar,
  setActiveSubTabCalendar,
  activeSubTabAnalytics,
  setActiveSubTabAnalytics,
  currentProfile,
  onOpenN8NModal,
  onLogout
}: NavigationProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState<'connected' | 'checking' | 'failed'>('checking');

  useEffect(() => {
    fetch("/api/db-status")
      .then(res => res.json())
      .then(data => {
        if (data.status === 'connected') {
          setDbConnected('connected');
        } else {
          setDbConnected('failed');
        }
      })
      .catch(() => {
        setDbConnected('failed');
      });
  }, []);

  return (
    <header className="w-full flex flex-col z-40 bg-[#1e1322] text-white select-none shadow-md">
      {/* Top Navbar */}
      <div className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-[#2d1e32]">
        {/* Left Side: Logo & Tabs */}
        <div className="flex items-center gap-6">
          {/* Infinity-like logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('planeamento')}>
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-violet-600 rounded-lg shadow-md group-hover:scale-105 transition-all duration-200">
              <span className="text-white font-bold font-mono text-base">∞</span>
            </div>
            <span className="hidden sm:inline font-sans font-semibold tracking-tight text-lg text-white">
              social<span className="text-pink-400">flow</span>
            </span>
          </div>

          {/* Main Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-tab-planeamento"
              onClick={() => setActiveTab('planeamento')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-150 ${
                activeTab === 'planeamento'
                  ? 'bg-[#2f1c35] text-pink-400 font-semibold'
                  : 'text-gray-300 hover:bg-[#27172c] hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Planeamento</span>
            </button>

            <button
              id="nav-tab-analitica"
              onClick={() => setActiveTab('analitica')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-150 ${
                activeTab === 'analitica'
                  ? 'bg-[#2f1c35] text-pink-400 font-semibold'
                  : 'text-gray-300 hover:bg-[#27172c] hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analítica</span>
            </button>
          </nav>
        </div>

        {/* Right Side: Upgrade, Account Profile & Menu */}
        <div className="flex items-center gap-3">
          {/* Dynamic DB Status Indicator Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25172a] border border-[#3e2746] rounded-lg text-[10px] font-bold text-gray-300">
            <Database className={`w-3.5 h-3.5 ${
              dbConnected === 'connected' 
                ? 'text-emerald-400' 
                : dbConnected === 'checking' 
                  ? 'text-pink-400 animate-spin' 
                  : 'text-amber-500'
            }`} />
            <span>BD: </span>
            <span className={
              dbConnected === 'connected' 
                ? 'text-emerald-400' 
                : dbConnected === 'checking' 
                  ? 'text-pink-400 font-bold' 
                  : 'text-amber-500 font-bold'
            }>
              {dbConnected === 'connected' ? 'FIRESTORE' : dbConnected === 'checking' ? 'CONECTANDO' : 'LOCAL/OFFLINE'}
            </span>
          </div>

          {onOpenN8NModal && (
            <button 
              onClick={onOpenN8NModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#2d1e32] hover:bg-[#3d2a44] text-[#ea4c89] hover:text-white border border-[#4d3255] font-bold text-xs rounded-lg shadow-xs transition-all duration-150 transform active:scale-95 cursor-pointer"
            >
              <Cable className="w-3.5 h-3.5" />
              <span>Automação n8n</span>
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              id="profile-dropdown-button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-[#2d1e32] rounded-lg transition-all duration-150"
            >
              <img
                src={currentProfile.avatar}
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full border border-pink-400/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="hidden md:inline text-sm font-medium text-gray-200">
                {currentProfile.username}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {profileDropdownOpen && (
              <div 
                id="profile-menu-container"
                className="absolute right-0 mt-2 w-56 bg-[#25172a] border border-[#3e2746] rounded-xl shadow-xl overflow-hidden py-1.5 text-gray-200 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-4 py-2.5 border-b border-[#3e2746]">
                  <p className="text-xs text-pink-400 font-semibold uppercase">Logado como</p>
                  <p className="font-semibold truncate">{currentProfile.username}</p>
                </div>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-[#341f3b] transition-colors">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Meu Perfil</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-[#341f3b] transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Configurações</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-[#341f3b] transition-colors">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span>Suporte & Ajuda</span>
                </button>
                <div className="border-t border-[#3e2746] my-1"></div>
                <button 
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Aplicativo</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <button 
            id="mobile-menu-button"
            className="lg:hidden p-2 hover:bg-[#2d1e32] rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar - Planning Section */}
      {activeTab === 'planeamento' && (
        <div className="bg-[#fcfafc] border-b border-gray-200 px-4 md:px-8 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between text-gray-700 font-medium text-sm">
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <button
              id="sub-tab-calendar"
              onClick={() => setActiveSubTabCalendar('calendario')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabCalendar === 'calendario'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              calendário
            </button>
            <button
              id="sub-tab-trello"
              onClick={() => setActiveSubTabCalendar('trello')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeSubTabCalendar === 'trello'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>Quadro (Estilo Trello)</span>
              <span className="px-1 py-0.5 text-[9px] bg-pink-100 text-pink-700 rounded-sm font-bold uppercase">Novo</span>
            </button>
            <button
              id="sub-tab-list"
              onClick={() => setActiveSubTabCalendar('lista')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabCalendar === 'lista'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Lista
            </button>
            <button
              id="sub-tab-library"
              onClick={() => setActiveSubTabCalendar('biblioteca')}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabCalendar === 'biblioteca'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>Biblioteca de publicações</span>
              <FolderHeart className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
            </button>
            <button
              id="sub-tab-autolistas"
              onClick={() => setActiveSubTabCalendar('autolistas')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabCalendar === 'autolistas'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Autolistas
            </button>
            <button
              id="sub-tab-deleted"
              className="px-4 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Postagens excluídas
            </button>
          </div>

          <div className="mt-2 md:mt-0 flex items-center gap-2 self-end text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700">01:55 - America/Sao_Paulo</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      )}

      {/* Sub Navigation Bar - Analytics Section */}
      {activeTab === 'analitica' && (
        <div className="bg-[#fcfafc] border-b border-gray-200 px-4 md:px-8 py-2.5 flex items-center justify-between text-gray-700 font-medium text-sm">
          <div className="flex items-center gap-2">
            <button
              id="analytics-tab-resumo"
              onClick={() => setActiveSubTabAnalytics('resumo')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabAnalytics === 'resumo'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Resumo Geral
            </button>
            <button
              id="analytics-tab-comunidade"
              onClick={() => setActiveSubTabAnalytics('comunidade')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabAnalytics === 'comunidade'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Comunidade & Crescimento
            </button>
            <button
              id="analytics-tab-demograficos"
              onClick={() => setActiveSubTabAnalytics('demograficos')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabAnalytics === 'demograficos'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Público & Demografia
            </button>
            <button
              id="analytics-tab-publicacoes"
              onClick={() => setActiveSubTabAnalytics('publicacoes')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeSubTabAnalytics === 'publicacoes'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Desempenho dos Posts
            </button>
          </div>
          <div className="text-xs text-pink-600 font-semibold flex items-center gap-1.5 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dados de 18 de jun de 2026 a 24 de jun de 2026</span>
          </div>
        </div>
      )}
    </header>
  );
}
