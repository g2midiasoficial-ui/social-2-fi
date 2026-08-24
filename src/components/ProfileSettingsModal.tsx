import React, { useState } from "react";
import { 
  User, 
  Settings, 
  Key, 
  Download, 
  Upload, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  Cable, 
  Mail, 
  Instagram, 
  Globe, 
  Trash2,
  Bell,
  Check,
  Zap,
  HardDrive
} from "lucide-react";
import { SocialPost, SocialChannel } from "../types";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { username: string; email?: string; avatar: string };
  onUpdateProfile: (updated: { username: string; email?: string; avatar: string }) => void;
  posts: SocialPost[];
  channels: SocialChannel[];
  onImportPosts: (importedPosts: SocialPost[]) => void;
  showNotification: (msg: string, type: 'success' | 'info') => void;
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  posts,
  channels,
  onImportPosts,
  showNotification
}: ProfileSettingsModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'data' | 'preferences'>('profile');

  // Profile Form States
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "g2midiasoficial@gmail.com");
  const [avatar, setAvatar] = useState(currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop");

  // API Config States
  const [metaToken, setMetaToken] = useState(() => localStorage.getItem("socialflow_meta_token") || "EAAQZAZCV7kZCQ...[Ativo]");
  const [instaId, setInstaId] = useState(() => localStorage.getItem("socialflow_insta_id") || "17841405829283721");
  const [n8nUrl, setN8nUrl] = useState(() => localStorage.getItem("socialflow_n8n_url") || "https://primary-production-45d4.up.railway.app/webhook/social-post");

  // Preferences
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [enableAutoBestTimes, setEnableAutoBestTimes] = useState(true);
  const [enableAiEnhance, setEnableAiEnhance] = useState(true);

  const avatarsList = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop"
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ username, email, avatar });
    showNotification("Perfil atualizado com sucesso!", "success");
  };

  const handleSaveApi = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("socialflow_meta_token", metaToken);
    localStorage.setItem("socialflow_insta_id", instaId);
    localStorage.setItem("socialflow_n8n_url", n8nUrl);
    showNotification("Credenciais de API e Webhook salvas!", "success");
  };

  const handleExportBackup = () => {
    const backupData = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      user: { username, email },
      posts,
      channels
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `socialflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification("Backup completo exportado com sucesso!", "success");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.posts)) {
          onImportPosts(parsed.posts);
          showNotification(`${parsed.posts.length} posts restaurados com sucesso!`, "success");
        } else {
          showNotification("Formato de backup inválido.", "info");
        }
      } catch (err) {
        showNotification("Erro ao ler o arquivo JSON.", "info");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#190d1f] text-white p-6 border-b border-[#2d1838] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Painel de Configurações da Conta</h2>
              <p className="text-xs text-gray-400">Gerencie seu perfil, integrações e dados salvos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 px-6 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile' 
                ? 'border-pink-600 text-pink-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil & Avatar</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'api' 
                ? 'border-pink-600 text-pink-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Cable className="w-4 h-4" />
            <span>APIs & Webhooks</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'data' 
                ? 'border-pink-600 text-pink-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Backup & Dados</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'preferences' 
                ? 'border-pink-600 text-pink-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Preferências</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
                <img 
                  src={avatar} 
                  alt="Avatar Atual" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{username}</h4>
                  <p className="text-xs text-gray-500">{email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-pink-600" />
                    Plano Pro Ilimitado
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700 block mb-2">
                  Escolha um Avatar Rápido
                </label>
                <div className="flex gap-2">
                  {avatarsList.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(av)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === av ? 'border-pink-500 scale-110 ring-2 ring-pink-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700">Nome de Usuário</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700">E-mail Principal</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700">URL Personalizada do Avatar</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-pink-500 font-mono text-gray-600"
                />
              </div>

              <button
                type="submit"
                className="py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Salvar Alterações do Perfil
              </button>
            </form>
          )}

          {/* API & WEBHOOKS TAB */}
          {activeTab === 'api' && (
            <form onSubmit={handleSaveApi} className="flex flex-col gap-5">
              <div className="bg-pink-50 border border-pink-200 p-4 rounded-2xl text-xs text-pink-900 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Cable className="w-4 h-4 text-pink-600" />
                  <span>Conexão com Meta Graph API & Webhook n8n</span>
                </div>
                Configure as chaves e rotas para publicação automatizada direta nos servidores oficiais do Instagram, Facebook e n8n.
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700">Meta Access Token (Graph API)</label>
                <input
                  type="password"
                  value={metaToken}
                  onChange={e => setMetaToken(e.target.value)}
                  placeholder="EAAG..."
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700">Instagram Business Account ID</label>
                <input
                  type="text"
                  value={instaId}
                  onChange={e => setInstaId(e.target.value)}
                  placeholder="17841..."
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-700">Webhook n8n de Publicação Automática</label>
                <input
                  type="url"
                  value={n8nUrl}
                  onChange={e => setN8nUrl(e.target.value)}
                  placeholder="https://seu-n8n.com/webhook/post"
                  className="w-full mt-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono focus:outline-pink-500"
                />
              </div>

              <button
                type="submit"
                className="py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Salvar Credenciais de Integração
              </button>
            </form>
          )}

          {/* BACKUP & DATA TAB */}
          {activeTab === 'data' && (
            <div className="flex flex-col gap-5">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <h4 className="text-xs font-bold uppercase text-gray-700 mb-1">Status do Armazenamento</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Seus dados estão sincronizados com <strong>Google Cloud Firestore</strong> e cache de alta velocidade.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Posts Cadastrados</span>
                    <span className="text-base font-extrabold text-gray-900">{posts.length} publicações</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Canais Conectados</span>
                    <span className="text-base font-extrabold text-gray-900">{channels.filter(c => c.connected).length} contas</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase text-gray-700">Exportar & Importar</h4>
                
                <button
                  onClick={handleExportBackup}
                  className="py-3 px-4 bg-[#201224] hover:bg-[#2d1833] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-pink-400" />
                  <span>Baixar Backup Completo em JSON</span>
                </button>

                <label className="py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span>Importar e Restaurar Posts de Arquivo JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div>
                  <h5 className="text-xs font-bold text-gray-900">Notificações de Publicação</h5>
                  <p className="text-[11px] text-gray-500">Receber confirmação visual e alerta quando um post for publicado</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableEmailAlerts}
                  onChange={e => setEnableEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div>
                  <h5 className="text-xs font-bold text-gray-900">Destaque de Melhores Horários (Heatmap)</h5>
                  <p className="text-[11px] text-gray-500">Exibir indicador de calor dos horários com maior probabilidade de alcance</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableAutoBestTimes}
                  onChange={e => setEnableAutoBestTimes(e.target.checked)}
                  className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div>
                  <h5 className="text-xs font-bold text-gray-900">Assistente de IA Integrado (Gemini)</h5>
                  <p className="text-[11px] text-gray-500">Sugestões automáticas de ganchos virais e hashtags em alta</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableAiEnhance}
                  onChange={e => setEnableAiEnhance(e.target.checked)}
                  className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  showNotification("Preferências salvas com sucesso!", "success");
                  onClose();
                }}
                className="py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Concluir Configurações
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
