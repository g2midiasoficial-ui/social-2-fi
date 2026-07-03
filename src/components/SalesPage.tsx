import React, { useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  Trello, 
  BarChart3, 
  ArrowRight, 
  Check, 
  CheckCircle, 
  HelpCircle, 
  Zap, 
  Users, 
  MessageSquare, 
  Share2, 
  Play, 
  Send, 
  Globe,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Tv,
  Coins
} from "lucide-react";

interface SalesPageProps {
  onEnterPlatform: (guest?: boolean) => void;
  isLoggedIn: boolean;
}

export default function SalesPage({ onEnterPlatform, isLoggedIn }: SalesPageProps) {
  // AI Demo States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("criativo");
  const [aiLoading, setAiLoading] = useState(false);
  const [demoOutput, setDemoOutput] = useState<{
    caption: string;
    hashtags: string[];
    hooks: string[];
  } | null>(null);

  // FAQ Expanded States
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Pricing Toggle State (Monthly/Annual)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Live AI Generator Demo trigger using real backend route
  const handleGenerateDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setDemoOutput(null);

    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          tone: aiTone,
          networks: ["instagram", "tiktok"]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDemoOutput({
          caption: data.caption || "",
          hashtags: data.hashtags || [],
          hooks: data.hooks || []
        });
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      // High-quality simulated fallback if request fails or offline
      setTimeout(() => {
        setDemoOutput({
          caption: `🚀 Quer saber como decolar seu negócio usando ${aiPrompt}? O segredo é ter constância e usar inteligência artificial de forma estratégica.\n\nCom o SocialFlow, você planeja um mês inteiro de posts em minutos e nunca mais fica sem ideias de conteúdo!`,
          hashtags: ["marketingdigital", "socialmedia", aiPrompt.toLowerCase().replace(/\s+/g, ""), "produtividade", "sucesso"],
          hooks: [
            `O segredo que ninguém te conta sobre ${aiPrompt}!`,
            `Como dominar ${aiPrompt} sem gastar horas por dia...`,
            `Se você trabalha com ${aiPrompt}, pare tudo o que está fazendo!`
          ]
        });
      }, 1200);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Como funciona a automação com o n8n?",
      a: "O SocialFlow se conecta nativamente aos seus workflows do n8n. Sempre que um post é agendado, modificado ou publicado, nós enviamos um webhook em tempo real com todos os dados da publicação, permitindo que você envie mensagens automáticas para o WhatsApp, Slack, crie planilhas no Google Sheets ou conecte mais de 500 outras ferramentas!"
    },
    {
      q: "Preciso cadastrar cartão de crédito para testar?",
      a: "Não! Você pode experimentar a plataforma inteira gratuitamente usando o nosso 'Modo de Convidado' de acesso rápido ou registrando uma conta local sem qualquer compromisso financeiro."
    },
    {
      q: "A IA gera imagens ou apenas textos e copies?",
      a: "A IA do SocialFlow (alimentada pelo Gemini 3.5 Flash) é uma assistente completa. Ela gera copies altamente persuasivas, títulos impactantes (hooks de 3 segundos), hashtags otimizadas e também gera imagens exclusivas e sob demanda para ilustrar seus posts com apenas um clique."
    },
    {
      q: "Posso agendar publicações em múltiplas redes sociais?",
      a: "Sim! Você pode conectar Instagram, TikTok, Facebook e YouTube. Planeje e customize a sua publicação de acordo com cada rede, visualizando como ela ficará em cada feed de forma simultânea e integrada."
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased overflow-x-hidden selection:bg-pink-500 selection:text-white" id="landing-container">
      
      {/* Decolorative background radial highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/10 via-pink-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-[1200px] right-[-10%] w-[400px] h-[400px] bg-pink-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-[2400px] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80" id="sales-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-violet-600 rounded-xl shadow-md shadow-pink-500/10">
              <span className="text-white font-bold font-mono text-xl">∞</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white font-sans">
              social<span className="text-pink-500">flow</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#recursos" className="hover:text-pink-400 transition-colors">Recursos</a>
            <a href="#demo-ia" className="hover:text-pink-400 transition-colors">Testar Copiloto</a>
            <a href="#precos" className="hover:text-pink-400 transition-colors">Planos</a>
            <a href="#faq" className="hover:text-pink-400 transition-colors">Dúvidas</a>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => onEnterPlatform(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-violet-700 hover:from-pink-500 hover:to-violet-600 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Acessar Painel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onEnterPlatform(true)}
                  className="hidden sm:inline-block text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Modo de Teste
                </button>
                <button
                  onClick={() => onEnterPlatform(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-violet-700 hover:from-pink-500 hover:to-violet-600 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-pink-500/10 hover:shadow-pink-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Entrar na Plataforma</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center" id="hero-section">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs font-semibold text-pink-400 mb-8 animate-fade-in shadow-xs">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Plataforma Tudo-Em-Um de Social Media</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6 font-sans">
          Planeje, Agende e Automatize <br className="hidden sm:block" />
          Mídias com <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Inteligência Artificial</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          O SocialFlow une um organizador visual de calendário, um quadro Kanban interativo, assistente de escrita do Gemini, automação de webhooks com n8n e relatórios detalhados de audiência.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => onEnterPlatform(false)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-violet-700 hover:from-pink-500 hover:to-violet-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-pink-500/10 hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Criar Conta Gratuita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEnterPlatform(true)}
            className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Experimentar sem Cadastro</span>
          </button>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-2xl backdrop-blur-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-3 text-slate-500 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-500/30" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
            <span className="w-3 h-3 rounded-full bg-green-500/30" />
            <span className="ml-2 font-mono text-[10px] text-slate-500">app.socialflow.com/planeamento</span>
          </div>
          
          {/* Mock Dashboard Representation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="md:col-span-2 bg-slate-900/90 border border-slate-800/80 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  Calendário Semanal
                </span>
                <span className="text-[10px] bg-pink-500/10 text-pink-400 font-bold px-2.5 py-0.5 rounded-full">
                  Julho 2026
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {['Segunda', 'Terça', 'Quarta'].map((day, i) => (
                  <div key={i} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 flex flex-col gap-2 min-h-[120px]">
                    <span className="font-semibold text-[10px] text-slate-500 uppercase">{day}</span>
                    <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/20 text-indigo-300 text-[10px] p-2 rounded-md text-left font-medium leading-normal">
                      <span className="block font-bold text-[9px] text-pink-400">10:00 - IG</span>
                      Lançamento da nova coleção de outono...
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-xl flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-pink-500" />
                Métricas Rápidas
              </span>
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-500">Seguidores Totais</span>
                    <span className="font-extrabold text-white text-base">48.2K</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">+12.4%</span>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-500">Canais Ativos</span>
                    <div className="flex gap-1.5 mt-1">
                      <span className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center text-[8px] font-bold text-pink-400">IG</span>
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] font-bold text-indigo-400">TK</span>
                      <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-[8px] font-bold text-red-400">YT</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-semibold">Integrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="bg-slate-950/40 border-y border-slate-800/60 py-24" id="recursos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-4 font-sans">
              Tudo o que você precisa para dominar o mercado
            </h2>
            <p className="text-slate-400">
              Chega de usar uma ferramenta para criar texto, outra para agendar e planilhas confusas para acompanhar métricas. Nós unificamos todo o ecossistema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-pink-500/30 transition-all group">
              <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center mb-5 text-pink-500 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Planeamento Visual</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Organize sua grade semanal ou mensal em uma visualização de calendário limpa e intuitiva. Arraste e solte para redefinir datas e horários de publicação.
              </p>
            </div>

            {/* Kanban / Trello */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-pink-500/30 transition-all group">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5 text-indigo-500 group-hover:scale-110 transition-transform">
                <Trello className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quadro Kanban</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fluxo de trabalho estilo Trello para monitorar postagens: mova rascunhos, aguardando aprovação, agendados e publicados de forma fluida e organizada.
              </p>
            </div>

            {/* AI Assistant */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-pink-500/30 transition-all group">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center mb-5 text-violet-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Assistente de Escrita IA</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Legendas completas, ideias de conteúdo viral, hashtags otimizadas por nicho e frases de impacto (hooks) geradas instantaneamente por Inteligência Artificial.
              </p>
            </div>

            {/* Automations */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-pink-500/30 transition-all group">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 text-emerald-500 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automação com n8n</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dispare webhooks e integre com canais n8n e webhooks externos. Sincronize suas publicações para disparar automações incríveis instantaneamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Sandbox Demo */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="demo-ia">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 rounded-full text-xs font-bold text-violet-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experimente Agora</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-6 leading-tight font-sans">
              Veja a Inteligência Artificial agindo em tempo real!
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Digite um assunto do seu negócio, escolha um tom de voz e veja a nossa assistente alimentada pela tecnologia Gemini 3.5 Flash estruturar a legenda de conversão perfeita com hashtags e títulos magnéticos de forma imediata.
            </p>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Adaptável ao nicho do seu negócio de forma orgânica.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gera de forma estratégica hooks para reter atenção.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sugerido com conjuntos ideais de hashtags do nicho.</span>
              </li>
            </ul>
          </div>

          {/* Interactive AI Generator Sandbox form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative">
            <h3 className="text-lg font-extrabold text-white mb-4">Gerador de Conteúdo Express</h3>
            <form onSubmit={handleGenerateDemo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Qual o tema ou tópico?</label>
                <input
                  type="text"
                  placeholder="Ex: 5 dicas para impulsionar vendas no ecommerce"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Tom de Voz</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all font-medium"
                  >
                    <option value="criativo">✨ Criativo / Inspirador</option>
                    <option value="profissional">👔 Profissional / Sério</option>
                    <option value="humoristico">😜 Engraçado / Amigável</option>
                    <option value="persuasivo">🔥 Persuasivo / Vendas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-violet-700 hover:from-pink-500 hover:to-violet-600 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Gerar Copy</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* AI Result Container */}
            {demoOutput && (
              <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-left max-h-[300px] overflow-y-auto">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Legenda Sugerida
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(demoOutput.caption);
                      alert("Copiado com sucesso!");
                    }}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded-md transition-all font-semibold"
                  >
                    Copiar
                  </button>
                </div>

                {/* Hooks */}
                {demoOutput.hooks.length > 0 && (
                  <div className="mb-3">
                    <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Gatilhos de Atenção (Hooks de Vídeo):</span>
                    <ul className="list-disc pl-4 text-xs text-indigo-300 space-y-1">
                      {demoOutput.hooks.map((hook, idx) => (
                        <li key={idx}>"{hook}"</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Caption text */}
                <p className="text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">{demoOutput.caption}</p>

                {/* Hashtags */}
                {demoOutput.hashtags.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-900/60 flex flex-wrap gap-1">
                    {demoOutput.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-pink-400/90 bg-pink-500/5 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-slate-950/40 border-y border-slate-800/60 py-24" id="precos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-4 font-sans">
              Planos Justos e Transparentes
            </h2>
            <p className="text-slate-400">
              Selecione o plano ideal para as suas necessidades de agendamento e comece a escalar suas redes sociais imediatamente. Cancelamento sem burocracia.
            </p>
          </div>

          {/* Billing Toggle (Monthly/Annual) */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white font-bold' : 'text-slate-400'}`}>Mensal</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-pink-600 rounded-full p-1 transition-all duration-200 focus:outline-none flex items-center justify-start cursor-pointer"
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200 transform ${billingPeriod === 'annual' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-white font-bold' : 'text-slate-400'}`}>
              Anual <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full">Economize 20%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-left hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">Iniciante</span>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-extrabold text-white">R$ {billingPeriod === 'monthly' ? '49' : '39'}</span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
                <p className="text-slate-400 text-xs mb-6">Perfeito para empreendedores individuais e pequenos canais que estão começando.</p>
                <div className="h-[1px] bg-slate-800 mb-6" />
                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Até 3 canais sociais conectados</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Planeamento em Calendário</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Limites normais de escrita com IA</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPlatform(false)}
                className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Começar Teste Grátis
              </button>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-pink-500 rounded-3xl p-8 text-left relative flex flex-col justify-between shadow-xl shadow-pink-500/5">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                Mais Popular
              </span>
              <div>
                <span className="text-sm font-bold text-pink-400 uppercase tracking-wider block mb-2">Profissional</span>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black text-white">R$ {billingPeriod === 'monthly' ? '99' : '79'}</span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
                <p className="text-slate-300 text-xs mb-6">Ideal para criadores, agências e negócios focados em escala e alta automação.</p>
                <div className="h-[1px] bg-slate-800 mb-6" />
                <ul className="space-y-4 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-pink-400 font-bold" />
                    <span>Até 10 canais sociais conectados</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-pink-400 font-bold" />
                    <span>Calendário + Quadro Kanban (Trello)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-pink-400 font-bold" />
                    <span>Assistente IA do Gemini ilimitado</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-pink-400 font-bold" />
                    <span>Automação nativa com n8n & webhooks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-pink-400 font-bold" />
                    <span>Relatório detalhado de Analytics</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPlatform(false)}
                className="w-full mt-8 py-3 bg-gradient-to-r from-pink-600 to-violet-700 hover:from-pink-500 hover:to-violet-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/10 transition-all cursor-pointer text-center hover:scale-102"
              >
                Garantir Plano Profissional
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-left hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">Agência / Corporativo</span>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-extrabold text-white">R$ {billingPeriod === 'monthly' ? '199' : '159'}</span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
                <p className="text-slate-400 text-xs mb-6">Projetado para agências de publicidade e grandes equipes com múltiplos clientes.</p>
                <div className="h-[1px] bg-slate-800 mb-6" />
                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Canais sociais ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Equipe de até 15 colaboradores</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Suporte VIP eWhite Label opcional</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPlatform(false)}
                className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" id="depoimentos">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-4 font-sans">
          Aprovado por profissionais de marketing de elite
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-sm">
          Veja a opinião de quem já otimizou o seu fluxo semanal de publicações e economizou centenas de horas de trabalho operacional manual.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left flex flex-col justify-between">
            <p className="text-slate-300 text-xs leading-relaxed italic mb-6">
              "Antes eu usava trello, docs, planilhas e o estúdio de criação separados. O SocialFlow uniu tudo em um fluxo lindo e muito rápido. A IA realmente economiza metade do meu tempo na criação de copies de alta qualidade."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full object-cover border border-slate-800" />
              <div>
                <span className="block font-bold text-white text-xs">Clara Menezes</span>
                <span className="block text-[10px] text-slate-500">Social Media & Designer Freelancer</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left flex flex-col justify-between">
            <p className="text-slate-300 text-xs leading-relaxed italic mb-6">
              "A integração com o n8n mudou meu jogo. Quando finalizo o post no Kanban do SocialFlow, ele dispara imediatamente um alerta para aprovação do cliente no WhatsApp. Incrível!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full object-cover border border-slate-800" />
              <div>
                <span className="block font-bold text-white text-xs">Rodrigo Albuquerque</span>
                <span className="block text-[10px] text-slate-500">Fundador da Agência Scale</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left flex flex-col justify-between">
            <p className="text-slate-300 text-xs leading-relaxed italic mb-6">
              "Gerenciar 6 contas de clientes diferentes se tornou uma tarefa simples. A visão de calendário é excelente e a simulação de feed me mostra exatamente o que melhorar antes de publicar."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full object-cover border border-slate-800" />
              <div>
                <span className="block font-bold text-white text-xs">Priscila Souza</span>
                <span className="block text-[10px] text-slate-500">Gestora de Tráfego e Redes Sociais</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 border-t border-slate-800/60 max-w-4xl mx-auto px-4 sm:px-6" id="faq">
        <h2 className="text-3xl font-black tracking-tight text-white text-center mb-4 font-sans">
          Perguntas Frequentes (FAQ)
        </h2>
        <p className="text-slate-400 text-center mb-12 text-sm">
          Tem alguma dúvida sobre o SocialFlow? Aqui estão as respostas para as perguntas mais comuns.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-pink-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-pink-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Instant Action CTA Bottom */}
      <section className="bg-gradient-to-r from-pink-900/30 to-violet-900/30 border-y border-pink-500/10 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Pronto para impulsionar suas mídias sociais?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Economize tempo na criação de posts, conecte seus canais favoritos e tenha relatórios automatizados hoje mesmo.
          </p>
          <button
            onClick={() => onEnterPlatform(false)}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/15 cursor-pointer hover:scale-103 transition-transform"
          >
            Acessar Plataforma Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-pink-500 font-bold">
              <span>∞</span>
            </div>
            <span className="text-sm font-extrabold text-white">SocialFlow</span>
          </div>

          <p className="text-slate-600 text-[11px]">
            &copy; {new Date().getFullYear()} SocialFlow SaaS - Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-medium">Servidor Online • Cloud Run Sandbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
