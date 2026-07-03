import React, { useState, useEffect } from "react";
import { 
  Database, 
  Lock, 
  User, 
  Mail, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: { username: string; email: string; avatar: string }) => void;
  onBackToLanding: () => void;
  onGuestLogin: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBackToLanding, onGuestLogin }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Database verification state
  const [dbStatus, setDbStatus] = useState<{
    status: 'checking' | 'connected' | 'disconnected' | 'offline_fallback';
    projectId?: string;
    database?: string;
    mode?: string;
    error?: string;
  }>({ status: 'checking' });

  // Verify database existence on mount
  const checkDatabase = async () => {
    setDbStatus({ status: 'checking' });
    try {
      const res = await fetch("/api/db-status");
      const responseText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.warn("Non-JSON response in checkDatabase:", responseText);
      }
      
      if (data && data.status) {
        setDbStatus(data);
      } else {
        setDbStatus({ status: 'offline_fallback', projectId: "Desconhecido" });
      }
    } catch (e: any) {
      setDbStatus({ 
        status: 'offline_fallback', 
        projectId: "Desconhecido", 
        error: e.message 
      });
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  // Handle Login or Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Por favor, preencha o nome de usuário e a senha.");
      return;
    }

    if (isRegister && !email.trim()) {
      setErrorMsg("O email é obrigatório para cadastro.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const body = isRegister 
        ? { username, password, email, avatar }
        : { username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const responseText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Non-JSON response received:", responseText);
        throw new Error(`Erro do Servidor (${res.status}): O servidor está iniciando, atualizando ou temporariamente indisponível. Por favor, aguarde alguns segundos e tente novamente.`);
      }

      if (!res.ok) {
        throw new Error(data.error || `Erro ${res.status}: Ocorreu um erro ao processar a solicitação.`);
      }

      if (isRegister) {
        setSuccessMsg("Conta criada com sucesso! Redirecionando para login...");
        setTimeout(() => {
          setIsRegister(false);
          setPassword("");
          setSuccessMsg(null);
          setLoading(false);
        }, 1500);
      } else {
        setSuccessMsg("Login realizado com sucesso!");
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão com o servidor.");
      setLoading(false);
    }
  };

  // Pre-selected avatar list for creative user experience
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-[#140b18] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Dynamic Background glowing meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#1e1124]/90 backdrop-blur-xl border border-[#3e2746]/70 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-violet-600 rounded-2xl shadow-lg shadow-pink-500/15 mb-3 animate-pulse">
            <span className="text-white font-bold font-mono text-2xl">∞</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans">
            social<span className="text-pink-500">flow</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-medium">
            {isRegister 
              ? "Crie sua conta para começar a planejar e automatizar suas mídias!" 
              : "Faça login para gerenciar suas publicações de forma inteligente."}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-2xl text-xs font-semibold text-red-300 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs font-semibold text-emerald-300 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">Nome de Usuário</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="priscila.souzafc"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full bg-[#150a1a] border border-[#3e2746] text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Email Input (only for registration) */}
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#150a1a] border border-[#3e2746] text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-[#150a1a] border border-[#3e2746] text-white text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Avatar selector (only for registration) */}
          {isRegister && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">Escolha um Avatar</label>
              <div className="flex items-center gap-2">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === av ? 'border-pink-500 scale-108 ring-2 ring-pink-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-violet-700 hover:from-pink-500 hover:to-violet-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer transform active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isRegister ? "Criar Minha Conta" : "Entrar no Painel"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Form Type */}
        <div className="mt-5 text-center flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-gray-300 hover:text-pink-400 transition-colors font-semibold cursor-pointer"
          >
            {isRegister 
              ? "Já possui uma conta? Faça login aqui" 
              : "Não tem uma conta? Crie uma agora gratuitamente"}
          </button>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#3e2746] to-transparent my-1"></div>

          <button
            type="button"
            onClick={onGuestLogin}
            className="text-xs text-pink-400 hover:text-pink-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mx-auto py-1 px-3 bg-pink-500/10 hover:bg-pink-500/15 rounded-full border border-pink-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Entrar como Convidado (Acesso Rápido)</span>
          </button>

          <button
            type="button"
            onClick={onBackToLanding}
            className="text-xs text-gray-400 hover:text-white transition-colors mt-2 cursor-pointer font-medium"
          >
            ← Voltar para a Página Inicial
          </button>
        </div>

      </div>
    </div>
  );
}
