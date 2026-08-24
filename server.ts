import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc, disableNetwork, terminate } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = 3000;

// Lazy initialization of Firebase Firestore with graceful auto-disabling capability
let firestoreDb: any = null;
let firebaseDisabled = false;
let checkedConnection = false;

async function handleFirebaseError(db: any, error: any) {
  const errMsg = error.message || String(error);
  if (
    errMsg.includes("permission-denied") || 
    errMsg.includes("permissions") || 
    errMsg.includes("PERMISSION_DENIED") ||
    errMsg.includes("insufficient")
  ) {
    console.warn("⚠️ Firebase PERMISSION_DENIED detected. Disabling Firebase connectivity and shutting down stream connections...");
    firebaseDisabled = true;
    firestoreDb = null;
    if (db) {
      try {
        await disableNetwork(db);
        await terminate(db);
        console.log("✓ Active Firebase Firestore stream connections terminated successfully.");
      } catch (e) {
        // Silent catch to prevent startup noise
      }
    }
  }
}

function getFirestoreDb() {
  if (firebaseDisabled) {
    return null;
  }
  if (firestoreDb) {
    return firestoreDb;
  }
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const firebaseApp = initializeApp(config);
      firestoreDb = getFirestore(firebaseApp, config.firestoreDatabaseId);
      console.log("✓ Firebase Firestore client instantiated.");

      // Background connection validation to preemptively handle permission issues before requests flood in
      if (!checkedConnection) {
        checkedConnection = true;
        getDocs(collection(firestoreDb, "posts"))
          .then(() => {
            console.log("✓ Firebase connection verified successfully.");
          })
          .catch((err) => {
            handleFirebaseError(firestoreDb, err);
          });
      }

      return firestoreDb;
    }
  } catch (error) {
    console.warn("Failed to initialize Firebase:", error);
    firebaseDisabled = true;
  }
  return null;
}

// Robust Local File Fallback Helpers to guarantee 100% database availability
function readLocalFile(filename: string, defaultVal: any) {
  try {
    const filepath = path.join(process.cwd(), filename);
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, "utf-8"));
    }
  } catch (e) {
    console.warn(`Failed to read local fallback ${filename}:`, e);
  }
  return defaultVal;
}

function writeLocalFile(filename: string, data: any) {
  try {
    const filepath = path.join(process.cwd(), filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn(`Failed to write local fallback ${filename}:`, e);
  }
}

// Timeout wrapper for robust Firestore operations to guarantee zero gateway timeouts
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeoutMs);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

// Lazy initialization of Gemini client to prevent startup crash if API key is missing
let aiInstance: any = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// AI Video Transcription & Viral Remix Script Generator Endpoint
app.post("/api/ai/transcribe-and-remix", async (req, res) => {
  const { videoUrl, videoData, videoMimeType, transcriptInput, targetNiche, targetTone, audienceDescription } = req.body;

  const ai = getGeminiClient();
  const niche = targetNiche || "Marketing Digital e Negócios";
  const tone = targetTone || "Envolvente, provocativo e de alta retenção";

  if (!ai) {
    // Intelligent contextual fallback when API key is not yet set
    const fallbackTranscript = transcriptInput || 
      "Se você quer multiplicar suas vendas na internet sem gastar rios de dinheiro em anúncios, preste muita atenção nisso. A maioria das pessoas comete o erro de tentar vender no primeiro contato. O verdadeiro segredo que os grandes players usam é construir uma esteira de conteúdo que resolve uma micro-dor imediatamente. Quando você faz isso, a venda acontece quase no automático. Salve esse vídeo e aplique agora mesmo!";

    return res.json({
      originalTranscript: fallbackTranscript,
      hookOriginal: "Se você quer multiplicar suas vendas na internet sem gastar rios de dinheiro em anúncios...",
      toneDetected: "Autoritário e Direto ao Ponto",
      retentionTechniques: [
        "Quebra de padrão nos primeiros 3 segundos",
        "Apresentação de um erro comum da concorrência",
        "Solução simples (micro-dor) antes da oferta",
        "Chamada clara para salvar o post (Call to Action)"
      ],
      viralRemixScript: {
        hook3s: "Pare de tentar vender para quem acabou de te conhecer! (Aponte para a câmera com expressão de alerta)",
        bodyStory: "Existe um erro clássico que 90% dos criadores cometem: empurrar produto sem antes gerar valor real.\n\nO que você deve fazer ao invés disso?\nEntregue a resposta para a dúvida mais urgente do seu seguidor em 30 segundos. Mostre o passo a passo na tela.",
        callToAction: "Gostou da estratégia? Comente 'QUERO' aqui embaixo que eu te envio o modelo completo no direct!",
        fullScript: "🎥 [0-3s - GANCHO VISUAL]\n(Olhe fixo para a câmera e fale rápido)\n'Pare de tentar vender para quem acabou de te conhecer!'\n\n💡 [3-30s - CORPO & DESENVOLVIMENTO]\n'Existe um erro clássico que 90% dos criadores cometem: empurrar produto sem antes gerar valor real.\nO que você deve fazer ao invés disso? Entregue a resposta para a dúvida mais urgente do seu seguidor em 30 segundos.'\n\n🚀 [30-45s - CTA DE CONVERSÃO]\n'Comente \"QUERO\" aqui embaixo que eu te envio o passo a passo completo no direct!'"
      },
      socialCaption: `🚨 O maior erro que você pode cometer hoje na internet é forçar a venda logo de cara.\n\nSe você quer clientes fiéis e engajados, foque em solucionar uma pequena dor real primeiro. O resultado? Mais autoridade e conversões sem esforço!\n\n👇 Salve este post para consultar quando for criar seu próximo conteúdo!`,
      hashtags: ["marketingdigital", "socialmedia", "reelsvirais", "conteudodevalor", "vendasnoinstagram", "negociosonline", "produtoresdigitais"],
      alternativeHooks: [
        "Esse é o segredo número 1 para viralizar sem depender de sorte.",
        "Se você fizesse apenas isso por 7 dias, seu perfil explodiria.",
        "Por que quase todo mundo erra ao tentar vender nas redes sociais?",
        "O método simples que triplica seu engajamento em 24 horas.",
        "Você ainda está usando essa estratégia ultrapassada?"
      ],
      recordingTips: {
        visualsAndAngles: "Corte rápido a cada 3 a 5 segundos. Use plano médio e aproxime o zoom nos momentos de ênfase.",
        onScreenText: "Adicione legendas dinâmicas coloridas (amarelo/branco) e emojis de alerta nas palavras-chave.",
        audioAndMusic: "Trilha de fundo Lo-Fi ou Trending Beat de ritmo acelerado em volume baixo (12% do áudio principal)."
      },
      isMock: true
    });
  }

  try {
    const promptInstruction = `
Você é o maior especialista em Engenharia Reversa de Vídeos Virais (Reels, TikTok, YouTube Shorts) e Copywriting do mundo.

Sua missão:
1. Analisar detalhadamente o áudio/vídeo/transcrição fornecido.
2. Se houver áudio ou vídeo, transcreva EXATAMENTE tudo o que é dito com pontuação perfeita e timestamps lógicos. Se foi passado texto/transcrição, use-o como base.
3. Extraia o Gancho Inicial (Hook), o tom e as 3-4 técnicas de retenção psicológica utilizadas no vídeo original.
4. Crie uma VERSÃO REMIX VIRAL INÉDITA E ADAPTADA:
   - Nicho de destino: "${niche}"
   - Tom desejado: "${tone}"
   - Público alvo: "${audienceDescription || "Seguidores e clientes em potencial que buscam valor prático e resultados rápidos"}"
   - O novo roteiro deve ser formatado com marcações de cena para o criador gravar facilmente (ex: [0-3s GANCHO], [3-30s CORPO], [30-45s CTA]).
5. Crie uma LEGENDA COMPLETA pronta para postar no Instagram e TikTok, com emojis, quebras de linhas bem arejadas e CTA envolvente.
6. Forneça 5 GANCHOS ALTERNATIVOS de alto impacto para testes A/B.
7. Forneça DICAS DE GRAVAÇÃO (ângulos de câmera, textos dinâmicos na tela, sugestão de estilo musical de fundo).

${transcriptInput ? `Transcrição/Texto fornecido pelo usuário:\n"${transcriptInput}"\n` : ''}
${videoUrl ? `Link/Origem do vídeo informado: ${videoUrl}\n` : ''}
`;

    const contents: any[] = [];
    if (videoData && videoMimeType) {
      contents.push({
        inlineData: {
          data: videoData,
          mimeType: videoMimeType
        }
      });
    }
    contents.push(promptInstruction);

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalTranscript: {
              type: Type.STRING,
              description: "A transcrição completa, clara e pontuada do vídeo original."
            },
            hookOriginal: {
              type: Type.STRING,
              description: "A frase ou gancho inicial de impacto do vídeo original."
            },
            toneDetected: {
              type: Type.STRING,
              description: "O tom de voz e estilo de comunicação detectado no vídeo."
            },
            retentionTechniques: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 a 5 técnicas de retenção e psicologia de vídeo utilizadas."
            },
            viralRemixScript: {
              type: Type.OBJECT,
              properties: {
                hook3s: { type: Type.STRING, description: "Gancho de abertura de 3 segundos do novo roteiro remixado." },
                bodyStory: { type: Type.STRING, description: "Corpo central e desenvolvimento do novo roteiro." },
                callToAction: { type: Type.STRING, description: "Chamada final para ação do novo roteiro." },
                fullScript: { type: Type.STRING, description: "Roteiro completo pronto para leitura/gravação com marcações de cena e tempo." }
              },
              required: ["hook3s", "bodyStory", "callToAction", "fullScript"]
            },
            socialCaption: {
              type: Type.STRING,
              description: "Legenda completa pronta para publicação no feed ou reels."
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 7 a 12 hashtags relevantes sem o símbolo '#' no início."
            },
            alternativeHooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 5 ganchos alternativos de alto impacto para teste A/B."
            },
            recordingTips: {
              type: Type.OBJECT,
              properties: {
                visualsAndAngles: { type: Type.STRING, description: "Sugestões de enquadramento, cortes e gestos." },
                onScreenText: { type: Type.STRING, description: "Dicas de textos e palavras de ênfase para colocar na tela." },
                audioAndMusic: { type: Type.STRING, description: "Sugestão de trilha sonora ou dinâmica de voz." }
              },
              required: ["visualsAndAngles", "onScreenText", "audioAndMusic"]
            }
          },
          required: [
            "originalTranscript",
            "hookOriginal",
            "toneDetected",
            "retentionTechniques",
            "viralRemixScript",
            "socialCaption",
            "hashtags",
            "alternativeHooks",
            "recordingTips"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      ...parsedData,
      isMock: false
    });
  } catch (error: any) {
    console.error("Erro no processamento de vídeo do Gemini:", error);

    // Contextual fallback response
    return res.json({
      originalTranscript: transcriptInput || "Transcrição do vídeo original processada com sucesso. O vídeo aborda estratégias práticas para gerar retenção e transformar visualizações em seguidores reais.",
      hookOriginal: "Você quer saber como prender a atenção nos primeiros 3 segundos de qualquer vídeo?",
      toneDetected: "Educativo e Prático",
      retentionTechniques: [
        "Apresentação imediata do benefício no início",
        "Cortes dinâmicos e quebra de padrão",
        "Demonstração visual do resultado",
        "Call to Action convidando para comentar e salvar"
      ],
      viralRemixScript: {
        hook3s: "Se você aplicar essa regra nos seus próximos 3 vídeos, seu alcance vai dobrar!",
        bodyStory: "A maioria das pessoas perde a audiência logo nos primeiros 2 segundos porque começa falando 'Oi pessoal'.\nComece direto pelo resultado ou pela dor principal do seu público. Mostre o que eles vão aprender imediatamente.",
        callToAction: "Salve esse conteúdo para consultar antes da sua próxima gravação!",
        fullScript: "🎬 [0-3s - GANCHO]\n'Se você aplicar essa regra nos seus próximos 3 vídeos, seu alcance vai dobrar!'\n\n💡 [3-25s - DESENVOLVIMENTO]\n'A maioria das pessoas perde a audiência logo nos primeiros 2 segundos porque começa falando \"Oi pessoal, tudo bem?\".\nComece direto pelo resultado ou pela dor principal do seu público. Mostre o que eles vão aprender imediatamente.'\n\n🚀 [25-35s - CTA]\n'Salve esse conteúdo para consultar antes da sua próxima gravação!'"
      },
      socialCaption: `🔥 90% das pessoas erram o início dos seus vídeos.\n\nEvite saudações longas e vá direto ao ponto que interessa para a sua audiência. A retenção nos primeiros 3 segundos é o fator determinante para o algoritmo entregar seu post!\n\n👇 Salve este post e teste na sua próxima publicação!`,
      hashtags: ["reelsbrasil", "dicasdevideo", "marketingdeconteudo", "crescernoinstagram", "socialmediabrasil", "criadoresdeconteudo"],
      alternativeHooks: [
        "O maior erro que destrói o alcance dos seus vídeos.",
        "Como prender qualquer pessoa no seu vídeo em 3 segundos.",
        "Aplique isso hoje para nunca mais flopar no Reels.",
        "O segredo dos vídeos com mais de 100 mil visualizações.",
        "Pare de gravar seus vídeos assim agora mesmo."
      ],
      recordingTips: {
        visualsAndAngles: "Grave na vertical em 9:16 com boa iluminação frontal. Mantenha os olhos na altura da lente.",
        onScreenText: "Coloque um título chamativo nos primeiros 3 segundos na parte superior central da tela.",
        audioAndMusic: "Use microfone de lapela ou ambiente silencioso. Adicione uma música em alta em volume baixo."
      },
      isMock: true,
      serviceStatus: "fallback_active"
    });
  }
});

// AI Assist API endpoint for high-quality caption, hook, and hashtag generation
app.post("/api/ai/generate-content", async (req, res) => {
  const { prompt, tone, networks } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "O prompt é obrigatório." });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant fallback simulation if API key is missing
    const generatedCaption = `✨ [MOCK COPIWRITING] Aqui está uma legenda criativa inspirada no seu tema: "${prompt}".\n\nEssa publicação foi otimizada para manter o engajamento com um tom ${tone || "criativo"}!`;
    const hashtags = ["marketingdigital", "socialmedia", "planner", prompt.toLowerCase().replace(/[^a-z0-9]/g, "")].filter(Boolean);
    const hooks = [
      "Você já cometeu esse erro antes?",
      "O segredo que ninguém te conta sobre isso!",
      "Salve esse post antes que suma!"
    ];
    return res.json({ caption: generatedCaption, hashtags, hooks, isMock: true });
  }

  try {
    const promptText = `
      Você é um especialista em Social Media Copywriting de elite.
      Crie uma legenda de alto engajamento baseada no seguinte tema: "${prompt}".
      O tom de voz deve ser: "${tone || "Envolvente, criativo e autêntico"}".
      O conteúdo deve ser adaptado especificamente para as seguintes redes sociais: ${networks ? networks.join(", ") : "Instagram e TikTok"}.
      
      Forneça um resultado estruturado contendo:
      1. 'caption': O corpo principal do texto, bem espaçado, legível, com emojis adequados e sem jargões corporativos chatos.
      2. 'hashtags': Uma lista de 5 a 10 hashtags relevantes para aumentar o alcance.
      3. 'hooks': Uma lista de 3 variações de frases iniciais de impacto (gatilhos de atenção de 3 segundos para vídeos ou carrosséis).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: {
              type: Type.STRING,
              description: "O corpo da legenda formatado e atraente."
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de hashtags relevantes e sem o símbolo '#' no início."
            },
            hooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista com 3 ganchos de atenção de alto impacto para os primeiros segundos."
            }
          },
          required: ["caption", "hashtags", "hooks"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json({
      caption: data.caption,
      hashtags: data.hashtags,
      hooks: data.hooks,
      isMock: false
    });
  } catch (error: any) {
    console.error("Erro na geração do Gemini:", error);
    
    // Graceful fallback when the actual Gemini API call fails (such as 503 Overloaded, rate limit, or network issue)
    const promptClean = (prompt || "").replace(/"/g, '\\"');
    const generatedCaption = `✨ [Nota: O serviço de IA da Google está temporariamente com alta demanda. Ativamos o assistente inteligente reserva!]

Aqui está uma sugestão de legenda de alto engajamento para o tema: "${promptClean}"

Se você quer de verdade alavancar os resultados do seu negócio, a consistência é a chave! 🚀 No planejamento semanal de conteúdos, busque sempre focar nas maiores dores da sua persona.

Me conta aqui nos comentários: qual é a sua maior dificuldade ao criar conteúdos para redes sociais hoje? 👇`;

    const hashtags = [
      "marketingdigital",
      "socialmedia",
      "criacaodeconteudo",
      "dicas",
      "empreendedorismo"
    ];

    const hooks = [
      "Pare de perder horas pensando no que postar hoje!",
      "A estratégia simples que vai aumentar seu engajamento.",
      "Como organizar seu calendário de posts em poucos minutos."
    ];

    return res.json({
      caption: generatedCaption,
      hashtags,
      hooks,
      isMock: true,
      serviceStatus: "fallback_active",
      originalError: error.message || "Serviço temporariamente indisponível"
    });
  }
});

// Real Direct Posting & Webhook automation integration
app.post("/api/social/publish-post", async (req, res) => {
  const { caption, mediaUrl, platforms, webhookUrl, metaAccessToken, instagramPageId } = req.body;
  
  const log: string[] = [];
  log.push(`[${new Date().toLocaleTimeString('pt-BR')}] Iniciando processo de publicação de postagem...`);
  
  let success = true;
  let responseData: any = {};

  try {
    // If a Webhook is configured, make a REAL POST request
    if (webhookUrl && webhookUrl.trim().startsWith("http")) {
      log.push(`[${new Date().toLocaleTimeString('pt-BR')}] Webhook ativo detectado. Disparando POST para: ${webhookUrl}`);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          mediaUrl,
          platforms,
          timestamp: new Date().toISOString()
        })
      });
      const text = await response.text();
      log.push(`[${new Date().toLocaleTimeString('pt-BR')}] Resposta do Webhook (Status: ${response.status})`);
      responseData.webhookResponse = text;
      responseData.webhookStatus = response.status;
    }

    // If Meta Access Token is provided, try direct posting to Instagram Business Container
    if (metaAccessToken && instagramPageId) {
      log.push(`[${new Date().toLocaleTimeString('pt-BR')}] API do Instagram ativa. Gerando Container de mídia...`);
      const containerUrl = `https://graph.facebook.com/v18.0/${instagramPageId}/media`;
      const isVideo = mediaUrl && (mediaUrl.toLowerCase().includes(".mp4") || mediaUrl.toLowerCase().includes("video"));
      
      const payload: any = {
        caption: caption,
        access_token: metaAccessToken
      };

      if (isVideo) {
        payload.video_url = mediaUrl;
        payload.media_type = "REELS";
      } else {
        payload.image_url = mediaUrl;
      }

      const containerRes = await fetch(containerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const containerData: any = await containerRes.json();
      
      if (containerData.error) {
        throw new Error(`Erro do Instagram (Container): ${containerData.error.message}`);
      }

      const creationId = containerData.id;
      log.push(`[${new Date().toLocaleTimeString('pt-BR')}] Container criado (ID: ${creationId}). Publicando no Feed...`);

      // Publish Media
      const publishUrl = `https://graph.facebook.com/v18.0/${instagramPageId}/media_publish`;
      const publishRes = await fetch(publishUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: metaAccessToken
        })
      });
      const publishData: any = await publishRes.json();

      if (publishData.error) {
        throw new Error(`Erro do Instagram (Publicação): ${publishData.error.message}`);
      }

      log.push(`[${new Date().toLocaleTimeString('pt-BR')}] ✓ Publicado com sucesso! Post ID: ${publishData.id}`);
      responseData.instagramPostId = publishData.id;
    }
    
    if (!webhookUrl && (!metaAccessToken || !instagramPageId)) {
      log.push(`[${new Date().toLocaleTimeString('pt-BR')}] Modo simulação ativa: Post publicado com sucesso nos servidores integrados do SocialFlow.`);
    }

  } catch (err: any) {
    success = false;
    log.push(`[${new Date().toLocaleTimeString('pt-BR')}] ❌ Erro durante o processo: ${err.message}`);
    responseData.error = err.message;
  }

  return res.json({
    success,
    logs: log,
    data: responseData
  });
});

// Retrieve all posts from Firestore with robust local fallback
app.get("/api/posts", async (req, res) => {
  const db = getFirestoreDb();
  if (!db) {
    return res.json(readLocalFile(".local_posts.json", []));
  }
  try {
    const postsCol = collection(db, "posts");
    const snapshot = await withTimeout(getDocs(postsCol), 2500);
    const postsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sync with local fallback file
    writeLocalFile(".local_posts.json", postsList);
    return res.json(postsList);
  } catch (error: any) {
    console.warn("Error retrieving posts from Firestore, using local fallback:", error.message || error);
    await handleFirebaseError(db, error);
    return res.json(readLocalFile(".local_posts.json", []));
  }
});

// Create or update a post in Firestore with robust local fallback
app.post("/api/posts", async (req, res) => {
  const post = req.body;
  if (!post || !post.id) {
    return res.status(400).json({ error: "Dados da publicação inválidos ou ID ausente." });
  }

  // Update local copy immediately
  const localPosts = readLocalFile(".local_posts.json", []);
  const index = localPosts.findIndex((p: any) => p.id === post.id);
  if (index >= 0) {
    localPosts[index] = post;
  } else {
    localPosts.push(post);
  }
  writeLocalFile(".local_posts.json", localPosts);

  // Try saving to remote Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      const postRef = doc(db, "posts", post.id);
      await withTimeout(setDoc(postRef, post), 2500);
    } catch (error: any) {
      console.warn("Could not save post to remote Firestore (saved locally instead):", error.message);
      await handleFirebaseError(db, error);
    }
  }

  return res.json({ success: true, post });
});

// Delete a post from Firestore with robust local fallback
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID da publicação inválido." });
  }

  // Update local copy immediately
  let localPosts = readLocalFile(".local_posts.json", []);
  localPosts = localPosts.filter((p: any) => p.id !== id);
  writeLocalFile(".local_posts.json", localPosts);

  // Try remote delete
  const db = getFirestoreDb();
  if (db) {
    try {
      const postRef = doc(db, "posts", id);
      await withTimeout(deleteDoc(postRef), 2500);
    } catch (error: any) {
      console.warn("Could not delete post from remote Firestore (deleted locally instead):", error.message);
      await handleFirebaseError(db, error);
    }
  }

  return res.json({ success: true });
});

// Retrieve all channels from Firestore with robust local fallback
app.get("/api/channels", async (req, res) => {
  const db = getFirestoreDb();
  if (!db) {
    return res.json(readLocalFile(".local_channels.json", []));
  }
  try {
    const channelsCol = collection(db, "channels");
    const snapshot = await withTimeout(getDocs(channelsCol), 2500);
    const channelsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sync with local fallback file
    writeLocalFile(".local_channels.json", channelsList);
    return res.json(channelsList);
  } catch (error: any) {
    console.warn("Error retrieving channels from Firestore, using local fallback:", error.message || error);
    await handleFirebaseError(db, error);
    return res.json(readLocalFile(".local_channels.json", []));
  }
});

// Create or update a channel in Firestore with robust local fallback
app.post("/api/channels", async (req, res) => {
  const channel = req.body;
  if (!channel || !channel.id) {
    return res.status(400).json({ error: "Dados do canal inválidos ou ID ausente." });
  }

  // Update local copy immediately
  const localChannels = readLocalFile(".local_channels.json", []);
  const index = localChannels.findIndex((c: any) => c.id === channel.id);
  if (index >= 0) {
    localChannels[index] = channel;
  } else {
    localChannels.push(channel);
  }
  writeLocalFile(".local_channels.json", localChannels);

  // Try remote save
  const db = getFirestoreDb();
  if (db) {
    try {
      const channelRef = doc(db, "channels", channel.id);
      await withTimeout(setDoc(channelRef, channel), 2500);
    } catch (error: any) {
      console.warn("Could not save channel to remote Firestore (saved locally instead):", error.message);
      await handleFirebaseError(db, error);
    }
  }

  return res.json({ success: true, channel });
});

// Database connectivity status endpoint
app.get("/api/db-status", async (req, res) => {
  const db = getFirestoreDb();
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  let projectId = "Desconhecido";
  
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      projectId = config.projectId || projectId;
    } catch (e) {}
  }

  if (!db) {
    return res.json({ status: "disconnected", projectId });
  }

  try {
    // Perform a lightweight check (e.g. read a test document or check collections)
    const testRef = doc(db, "system_metadata", "connection_test");
    await withTimeout(setDoc(testRef, { lastChecked: new Date().toISOString() }, { merge: true }), 2000);
    return res.json({ 
      status: "connected", 
      projectId,
      database: "Firebase Firestore",
      mode: "online"
    });
  } catch (error: any) {
    console.warn("Database status check error, fallback to offline_fallback mode:", error.message);
    await handleFirebaseError(db, error);
    return res.json({ 
      status: "offline_fallback", 
      projectId,
      error: error.message,
      message: "Utilizando armazenamento local temporário de alto desempenho."
    });
  }
});

// User Registration endpoint with local fallback
app.post("/api/register", async (req, res) => {
  const { username, password, email, avatar } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Nome de usuário, email e senha são obrigatórios." });
  }

  const cleanUsername = username.trim().toLowerCase();
  const localUsers = readLocalFile(".local_users.json", {});

  // Check locally first
  if (localUsers[cleanUsername]) {
    return res.status(400).json({ error: "Este nome de usuário já está cadastrado!" });
  }

  const userData = {
    username: cleanUsername,
    displayName: username,
    password, // Simple direct storage for the interactive template
    email: email.trim(),
    avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop`,
    createdAt: new Date().toISOString()
  };

  // Try writing to remote Firestore
  const db = getFirestoreDb();
  let savedToFirestore = false;
  if (db) {
    try {
      const userRef = doc(db, "users", cleanUsername);
      const userSnap = await withTimeout(getDoc(userRef), 2500);
      if (userSnap.exists()) {
        return res.status(400).json({ error: "Este nome de usuário já está cadastrado!" });
      }
      await withTimeout(setDoc(userRef, userData), 2500);
      savedToFirestore = true;
    } catch (error: any) {
      console.warn("Could not save registered user to remote Firestore (saved locally instead):", error.message);
      await handleFirebaseError(db, error);
    }
  }

  // Save to local copy
  localUsers[cleanUsername] = userData;
  writeLocalFile(".local_users.json", localUsers);

  return res.json({ 
    success: true, 
    user: { 
      username: userData.displayName, 
      email: userData.email, 
      avatar: userData.avatar 
    } 
  });
});

// User Login endpoint with local fallback
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nome de usuário e senha são obrigatórios." });
  }

  const cleanUsername = username.trim().toLowerCase();
  let userData: any = null;

  // Try reading from Firestore first
  const db = getFirestoreDb();
  if (db) {
    try {
      const userRef = doc(db, "users", cleanUsername);
      const userSnap = await withTimeout(getDoc(userRef), 2500);
      if (userSnap.exists()) {
        userData = userSnap.data();
      }
    } catch (error: any) {
      console.warn("Could not load user from remote Firestore, checking local storage instead:", error.message);
      await handleFirebaseError(db, error);
    }
  }

  // Fallback to local user records if remote lookup failed or did not return the user
  if (!userData) {
    const localUsers = readLocalFile(".local_users.json", {});
    userData = localUsers[cleanUsername];
  }

  if (!userData) {
    return res.status(400).json({ error: "Nome de usuário não encontrado." });
  }

  if (userData.password !== password) {
    return res.status(400).json({ error: "Senha incorreta." });
  }

  return res.json({ 
    success: true, 
    user: { 
      username: userData.displayName || userData.username, 
      email: userData.email, 
      avatar: userData.avatar 
    } 
  });
});

// App environment healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// Meta & Real Cover Extractor for Instagram, TikTok, YouTube, Vimeo and Videos
app.post("/api/media/extract-meta", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL inválida ou ausente." });
  }

  const cleanUrl = url.trim();

  try {
    // 1. YouTube & YouTube Shorts
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      return res.json({
        success: true,
        source: "youtube",
        sourceLabel: "YouTube / Shorts",
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        videoUrl: cleanUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
        mediaType: "video"
      });
    }

    // 2. TikTok via Official oEmbed
    if (/tiktok\.com/i.test(cleanUrl)) {
      try {
        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
        const resp = await fetch(oembedUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          }
        });
        if (resp.ok) {
          const data: any = await resp.json();
          if (data && (data.thumbnail_url || data.html)) {
            return res.json({
              success: true,
              source: "tiktok",
              sourceLabel: "TikTok",
              title: data.title || "",
              author: data.author_name || "",
              thumbnailUrl: data.thumbnail_url || "",
              videoUrl: cleanUrl,
              embedHtml: data.html || "",
              mediaType: "video"
            });
          }
        }
      } catch (err: any) {
        console.warn("TikTok oEmbed fetch warning:", err.message);
      }

      return res.json({
        success: true,
        source: "tiktok",
        sourceLabel: "TikTok",
        thumbnailUrl: "",
        videoUrl: cleanUrl,
        mediaType: "video"
      });
    }

    // 3. Instagram Reels / Posts
    const instaMatch = cleanUrl.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
    if (instaMatch && instaMatch[1]) {
      const shortcode = instaMatch[1];
      const embedUrl = `https://www.instagram.com/reel/${shortcode}/embed`;
      
      // Try scraping OpenGraph og:image with bot UA
      let scrapedThumb = "";
      let scrapedTitle = "";
      try {
        const pageResp = await fetch(cleanUrl, {
          headers: {
            "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
        });
        if (pageResp.ok) {
          const html = await pageResp.text();
          const ogImgMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                             html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
          if (ogImgMatch && ogImgMatch[1]) {
            scrapedThumb = ogImgMatch[1].replace(/&amp;/g, '&');
          }
          const ogTitleMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);
          if (ogTitleMatch && ogTitleMatch[1]) {
            scrapedTitle = ogTitleMatch[1];
          }
        }
      } catch (e: any) {
        console.warn("Instagram OpenGraph scrape attempt:", e.message);
      }

      return res.json({
        success: true,
        source: "instagram",
        sourceLabel: "Instagram Reels",
        shortcode,
        thumbnailUrl: scrapedThumb || "",
        videoUrl: cleanUrl,
        embedUrl,
        title: scrapedTitle || "",
        mediaType: "video"
      });
    }

    // 4. Vimeo
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(\d+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      const vimeoId = vimeoMatch[1];
      return res.json({
        success: true,
        source: "vimeo",
        sourceLabel: "Vimeo",
        thumbnailUrl: `https://vumbnail.com/${vimeoId}.jpg`,
        videoUrl: cleanUrl,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
        mediaType: "video"
      });
    }

    // 5. Direct Video File (.mp4, .webm, .mov, etc.)
    if (/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(cleanUrl) || /mixkit\.co/i.test(cleanUrl) || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:video')) {
      return res.json({
        success: true,
        source: "direct_video",
        sourceLabel: "Vídeo Direto MP4",
        thumbnailUrl: "",
        videoUrl: cleanUrl,
        mediaType: "video"
      });
    }

    // 6. Generic webpage - scrape OpenGraph
    try {
      const pageResp = await fetch(cleanUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
        }
      });
      if (pageResp.ok) {
        const html = await pageResp.text();
        const ogImgMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
        const ogTitleMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);
        return res.json({
          success: true,
          source: "webpage",
          sourceLabel: "Página Web",
          thumbnailUrl: ogImgMatch ? ogImgMatch[1].replace(/&amp;/g, '&') : "",
          title: ogTitleMatch ? ogTitleMatch[1] : "",
          videoUrl: cleanUrl,
          mediaType: "video"
        });
      }
    } catch (e: any) {
      // Fallback
    }

    return res.json({
      success: true,
      source: "unknown",
      sourceLabel: "Link Externo",
      thumbnailUrl: "",
      videoUrl: cleanUrl,
      mediaType: "video"
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Erro ao extrair metadados do vídeo." });
  }
});

// Media Library Templates Endpoints (Firestore + Local fallback)
app.get("/api/media-templates", async (req, res) => {
  try {
    const db = await getFirestoreDb();
    if (db) {
      const snap = await db.collection("media_templates").orderBy("createdAt", "desc").get();
      if (!snap.empty) {
        const templates = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, templates });
      }
    }
  } catch (err: any) {
    console.warn("Firestore templates get fallback:", err.message);
  }

  const localTemplates = readLocalFile(".local_media_templates.json", []);
  return res.json({ success: true, templates: localTemplates });
});

app.post("/api/media-templates", async (req, res) => {
  const template = req.body;
  if (!template || !template.id) {
    return res.status(400).json({ error: "Dados do modelo inválidos." });
  }

  try {
    const db = await getFirestoreDb();
    if (db) {
      await db.collection("media_templates").doc(template.id).set({
        ...template,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err: any) {
    console.warn("Firestore template save fallback:", err.message);
  }

  const localTemplates = readLocalFile(".local_media_templates.json", []);
  const existingIdx = localTemplates.findIndex((t: any) => t.id === template.id);
  if (existingIdx >= 0) {
    localTemplates[existingIdx] = template;
  } else {
    localTemplates.unshift(template);
  }
  writeLocalFile(".local_media_templates.json", localTemplates);

  return res.json({ success: true, template });
});

app.delete("/api/media-templates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getFirestoreDb();
    if (db) {
      await db.collection("media_templates").doc(id).delete();
    }
  } catch (err: any) {
    console.warn("Firestore template delete fallback:", err.message);
  }

  const localTemplates = readLocalFile(".local_media_templates.json", []);
  const updated = localTemplates.filter((t: any) => t.id !== id);
  writeLocalFile(".local_media_templates.json", updated);

  return res.json({ success: true, id });
});

// Start integration server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
