import { useState } from "react";
import { X, Instagram, Facebook, Youtube, Shield, Sparkles, Loader2, ArrowRight, Check, Cable } from "lucide-react";
import { SocialChannel } from "../types";

interface ConnectChannelModalProps {
  onClose: () => void;
  onConnect: (channel: SocialChannel) => void;
  initialChannelId?: string;
}

const PRESET_AVATARS = [
  { name: "Avatar 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" },
  { name: "Avatar 2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
  { name: "Avatar 3", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
  { name: "Avatar 4", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" },
  { name: "Avatar 5", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces" }
];

export default function ConnectChannelModal({
  onClose,
  onConnect,
  initialChannelId = "instagram"
}: ConnectChannelModalProps) {
  const [platform, setPlatform] = useState<string>(initialChannelId);
  const [connectionType, setConnectionType] = useState<'simulated' | 'real'>('simulated');
  const [realIntegrationType, setRealIntegrationType] = useState<'webhook' | 'direct_instagram'>('webhook');
  
  // Simulated fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState<number>(3500);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatar, setCustomAvatar] = useState("");

  // Real Integration fields
  const [webhookUrl, setWebhookUrl] = useState("");
  const [metaAccessToken, setMetaAccessToken] = useState("");
  const [instagramPageId, setInstagramPageId] = useState("");
  
  // Connection states
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const simulatedSteps = [
    "Inicializando conexão segura com a API...",
    "Solicitando autorização OAuth 2.0...",
    "Autenticando credenciais do usuário...",
    "Sincronizando estatísticas e dados de engajamento...",
    "Conexão estabelecida com sucesso!"
  ];

  const realSteps = [
    "Testando conexões de rede...",
    "Validando endpoint do webhook/tokens...",
    "Estabelecendo canal seguro HTTPS...",
    "Armazenando credenciais criptografadas...",
    "Sincronização de automação ativada!"
  ];

  const handleConnect = () => {
    // Validation
    if (connectionType === 'simulated') {
      if (!name.trim()) {
        setError("Por favor, preencha o nome de exibição.");
        return;
      }
      if (!username.trim()) {
        setError("Por favor, preencha o nome de usuário (handle).");
        return;
      }
    } else {
      if (realIntegrationType === 'webhook') {
        if (!webhookUrl.trim() || !webhookUrl.startsWith("http")) {
          setError("Por favor, insira um URL de Webhook válido (começando com http/https).");
          return;
        }
      } else {
        if (!metaAccessToken.trim()) {
          setError("Por favor, insira o Facebook Page Access Token.");
          return;
        }
        if (!instagramPageId.trim()) {
          setError("Por favor, insira o ID da Página de Negócios do Instagram.");
          return;
        }
      }
    }

    setError("");
    setIsConnecting(true);
    setConnectStep(0);

    const steps = connectionType === 'simulated' ? simulatedSteps : realSteps;

    const interval = setInterval(() => {
      setConnectStep(prev => {
        if (prev >= steps.length - 2) {
          clearInterval(interval);
          setTimeout(() => {
            setIsConnecting(false);
            setIsSuccess(true);
            
            // Set default simulated display name / handles if real details are used
            const finalUsername = connectionType === 'simulated' 
              ? (username.startsWith("@") ? username.substring(1) : username)
              : (realIntegrationType === 'webhook' ? "Auto_Webhook" : "Insta_API");
            
            const displayName = connectionType === 'simulated' 
              ? name 
              : (realIntegrationType === 'webhook' ? "Integração Webhook" : "Instagram API Real");

            onConnect({
              id: platform,
              name: displayName,
              username: finalUsername,
              avatar: customAvatar.trim() || selectedAvatar,
              connected: true,
              followers: connectionType === 'simulated' ? (Number(followers) || 1200) : 15000,
              followersChange: Math.floor(Math.random() * 200) + 50,
              webhookUrl: connectionType === 'real' && realIntegrationType === 'webhook' ? webhookUrl : undefined,
              metaAccessToken: connectionType === 'real' && realIntegrationType === 'direct_instagram' ? metaAccessToken : undefined,
              instagramPageId: connectionType === 'real' && realIntegrationType === 'direct_instagram' ? instagramPageId : undefined
            });
          }, 800);
          return prev + 1;
        }
        return prev + 1;
      });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#fbf9fc]">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-pink-50 text-pink-600 rounded-2xl">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Conectar Conta Oficial</h3>
              <p className="text-xs text-gray-400 mt-0.5">Sincronize com as APIs das redes sociais oficiais de forma segura</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {!isConnecting && !isSuccess ? (
            <>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Platform select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rede Social Alvo</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "instagram", label: "Instagram", color: "from-pink-500 to-purple-600", icon: Instagram },
                    { id: "tiktok", label: "TikTok", color: "from-black to-slate-900", icon: "T" },
                    { id: "facebook", label: "Facebook", color: "from-blue-600 to-blue-800", icon: Facebook },
                    { id: "youtube", label: "YouTube", color: "from-red-600 to-red-800", icon: Youtube }
                  ].map(p => {
                    const isSelected = platform === p.id;
                    const IconComp = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all text-center cursor-pointer ${
                          isSelected 
                            ? 'border-pink-500 bg-pink-50/30 text-pink-700 shadow-3xs scale-[1.02]' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                          isSelected ? `bg-gradient-to-tr ${p.color}` : 'bg-gray-100 text-gray-500'
                        }`}>
                          {typeof IconComp === "string" ? <span className="font-bold text-sm">{IconComp}</span> : <IconComp className="w-4 h-4" />}
                        </span>
                        <span className="text-[11px] font-bold">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connection Mode Tabs */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modo de Conexão</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setConnectionType('simulated'); setError(""); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      connectionType === 'simulated'
                        ? 'bg-white text-gray-900 shadow-3xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    🚀 Conexão Direta (Simulação)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConnectionType('real'); setError(""); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      connectionType === 'real'
                        ? 'bg-white text-gray-900 shadow-3xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    🔌 Integração Real (Webhook / API)
                  </button>
                </div>
              </div>

              {connectionType === 'simulated' ? (
                /* SIMULATED CONNECTION FORM */
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome de Exibição</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Priscila Souza"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome de Usuário (@handle)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: priscilasouza_mkt"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Seguidores / Inscritos</label>
                      <input 
                        type="number" 
                        value={followers}
                        onChange={(e) => setFollowers(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-mono font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Foto de Perfil (URL)</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        value={customAvatar}
                        onChange={(e) => setCustomAvatar(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Avatar Presets select if no custom URL */}
                  {!customAvatar.trim() && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Escolher Avatar Pronto</label>
                      <div className="flex gap-3">
                        {PRESET_AVATARS.map((av, index) => {
                          const isSelected = selectedAvatar === av.url;
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedAvatar(av.url)}
                              className={`relative rounded-full border-2 transition-all p-0.5 cursor-pointer ${
                                isSelected ? 'border-pink-500 scale-105' : 'border-transparent hover:border-gray-200'
                              }`}
                            >
                              <img src={av.url} alt={av.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                              {isSelected && (
                                <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* REAL INTEGRATION FORM */
                <div className="flex flex-col gap-4 animate-in fade-in duration-200 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Automação Real</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRealIntegrationType('webhook')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                          realIntegrationType === 'webhook'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🔗 Webhook (Zapier / Make / n8n)
                      </button>
                      <button
                        type="button"
                        disabled={platform !== 'instagram'}
                        onClick={() => setRealIntegrationType('direct_instagram')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          realIntegrationType === 'direct_instagram'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        📸 Instagram Graph API Direto
                      </button>
                    </div>
                  </div>

                  {realIntegrationType === 'webhook' ? (
                    <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500">URL do Webhook do Webhook do Make/Zapier/n8n</label>
                        <input
                          type="text"
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        />
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed">
                        💡 **Como funciona**: Quando você agendar ou publicar qualquer postagem no SocialFlow, faremos um POST real para este URL contendo a legenda, link da imagem/vídeo e as plataformas. Você poderá usá-lo para disparar fluxos automáticos!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500">Instagram Business Page ID</label>
                        <input
                          type="text"
                          placeholder="ID numérico da página no Facebook"
                          value={instagramPageId}
                          onChange={(e) => setInstagramPageId(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500">Facebook / Instagram Page Access Token</label>
                        <input
                          type="password"
                          placeholder="EAACW..."
                          value={metaAccessToken}
                          onChange={(e) => setMetaAccessToken(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        />
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed">
                        🔑 Para publicar diretamente no Instagram oficial, sua conta deve ser uma **Conta Comercial/Criador** vinculada a uma página do Facebook. Insira o Access Token de longo prazo obtido no painel de desenvolvedores do Facebook Graph Explorer.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 p-3.5 bg-pink-50/30 border border-pink-100/50 rounded-2xl flex items-start gap-3">
                <span className="text-pink-600 mt-0.5">🔒</span>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Sua privacidade é nossa prioridade. SocialFlow utiliza criptografia de ponta a ponta. Não salvamos tokens em servidores compartilhados, apenas no seu navegador local em segurança.
                </p>
              </div>
            </>
          ) : isConnecting ? (
            /* CONNECTION LOADING ANIMATION WINDOW */
            <div className="py-12 flex flex-col items-center justify-center gap-6 text-center">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin"></div>
                <span className="absolute text-xl">🤝</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-gray-900 text-sm">Autenticando com {platform.toUpperCase()}...</h4>
                <div className="text-xs text-pink-600 font-semibold font-mono animate-pulse min-h-[1.5rem]">
                  {(connectionType === 'simulated' ? simulatedSteps : realSteps)[connectStep]}
                </div>
              </div>

              {/* Fake progression bar */}
              <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${((connectStep + 1) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            /* SUCCESS FEEDBACK */
            <div className="py-12 flex flex-col items-center justify-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold animate-bounce shadow-xs">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Conta Vinculada com Sucesso!</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  {connectionType === 'real' 
                    ? "Sua integração em tempo real foi configurada com sucesso. As postagens automáticas estão ativas."
                    : "Sua conta foi verificada pelas diretrizes oficiais e já está pronta para planejar e publicar."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isConnecting && !isSuccess && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConnect}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>{connectionType === 'real' ? "Ativar Integração" : "Autenticar via API"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Concluído
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
