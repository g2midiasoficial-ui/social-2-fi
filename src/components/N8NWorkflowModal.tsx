import { useState } from "react";
import { X, Copy, Check, Download, ExternalLink, HelpCircle, Terminal, Cable } from "lucide-react";

interface N8NWorkflowModalProps {
  onClose: () => void;
}

export default function N8NWorkflowModal({ onClose }: N8NWorkflowModalProps) {
  const [copied, setCopied] = useState(false);

  const n8nJson = `{
  "name": "SocialFlow Automation Workflow",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "socialflow-publish",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 360],
      "id": "webhook-node",
      "name": "SocialFlow Webhook"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "type": "string"
          },
          "conditions": [
            {
              "id": "check-platform-insta",
              "leftValue": "={{ $json.body.platforms }}",
              "operator": "contains",
              "rightValue": "instagram"
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [470, 360],
      "id": "if-instagram",
      "name": "Filtrar Instagram"
    },
    {
      "parameters": {
        "resource": "media",
        "operation": "create",
        "userId": "me",
        "mediaType": "IMAGE",
        "imageUrl": "={{ $json.body.mediaUrl }}",
        "caption": "={{ $json.body.caption }}"
      },
      "type": "n8n-nodes-base.instagram",
      "typeVersion": 1,
      "position": [720, 280],
      "id": "instagram-publish",
      "name": "Publicar Instagram"
    },
    {
      "parameters": {
        "chatId": "SEU_CHAT_ID",
        "text": "📢 *Novo Post Publicado via SocialFlow!*\\n\\n📝 *Legenda:*\\n{{ $json.body.caption }}\\n\\n🖼️ *Mídia:* {{ $json.body.mediaUrl }}",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [960, 360],
      "id": "telegram-notify",
      "name": "Notificar Telegram/WhatsApp"
    }
  ],
  "connections": {
    "SocialFlow Webhook": {
      "main": [
        [
          {
            "node": "Filtrar Instagram",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filtrar Instagram": {
      "main": [
        [
          {
            "node": "Publicar Instagram",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Notificar Telegram/WhatsApp",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Publicar Instagram": {
      "main": [
        [
          {
            "node": "Notificar Telegram/WhatsApp",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(n8nJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([n8nJson], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "socialflow_n8n_workflow.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#fbf9fc]">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-violet-50 text-violet-600 rounded-2xl">
              <Cable className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Automação Inteligente n8n</h3>
              <p className="text-xs text-gray-400 mt-0.5">Importe o fluxo oficial e conecte com suas ferramentas prediletas</p>
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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* Quick Intro Banner */}
          <div className="p-4 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100/50 flex items-start gap-3.5">
            <span className="text-2xl mt-0.5">🤖</span>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Integre com WordPress, Discord, Telegram, Instagram ou Meta</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                Utilizando nosso conector de Webhooks em tempo real, você pode automatizar a distribuição de mídia gerada de forma 100% gratuita usando a sua própria instância do n8n!
              </p>
            </div>
          </div>

          {/* Quick Steps */}
          <div className="flex flex-col gap-3 text-left">
            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Como Importar e Ativar</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100/60 flex gap-3">
                <span className="w-5.5 h-5.5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <p className="font-bold text-gray-800 text-xs">Copie o JSON Oficial</p>
                  <p className="text-[10.5px] text-gray-400 leading-normal mt-0.5">Use o painel interativo abaixo para copiar ou baixar o arquivo schema oficial do n8n.</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100/60 flex gap-3">
                <span className="w-5.5 h-5.5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <p className="font-bold text-gray-800 text-xs">Importe no Painel n8n</p>
                  <p className="text-[10.5px] text-gray-400 leading-normal mt-0.5">Abra seu n8n, crie um fluxo em branco, clique nos **Três Pontinhos** e selecione **Import from JSON** para colar o código.</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100/60 flex gap-3">
                <span className="w-5.5 h-5.5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <p className="font-bold text-gray-800 text-xs">Pegue o URL do Webhook</p>
                  <p className="text-[10.5px] text-gray-400 leading-normal mt-0.5">No node "SocialFlow Webhook" do n8n, copie a **Production URL** ou **Test URL** do Webhook.</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100/60 flex gap-3">
                <span className="w-5.5 h-5.5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <div>
                  <p className="font-bold text-gray-800 text-xs">Vincule no SocialFlow</p>
                  <p className="text-[10.5px] text-gray-400 leading-normal mt-0.5 font-semibold">Vá em **Analítica** ➔ **Mais conexões** ➔ **Modo Integração Real** ➔ Cole a URL do Webhook e ative.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Code Viewer Header */}
          <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-violet-600" />
                <span>n8n JSON Workflow Schema</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Baixar arquivo</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copiado!" : "Copiar Código"}</span>
                </button>
              </div>
            </div>

            {/* Code editor visualizer */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-3xs bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">socialflow_n8n_workflow.json</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <pre className="p-4 overflow-x-auto text-[10.5px] font-mono text-slate-300 leading-relaxed max-h-[220px] text-left select-text">
                <code>{n8nJson}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <HelpCircle className="w-4 h-4 text-violet-500 animate-bounce" />
            <span>Precisa de ajuda com o n8n? Fale com nosso suporte.</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
}
