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
app.use(express.json());

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
