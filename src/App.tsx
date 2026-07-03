import { useState, useEffect } from "react";
import { MainTab, SubTabCalendar, SubTabAnalytics, SocialPost, SocialChannel } from "./types";
import { initialPosts, initialChannels, getWeekdayDate } from "./data";
import Navigation from "./components/Navigation";
import CalendarPlanner from "./components/CalendarPlanner";
import TrelloBoard from "./components/TrelloBoard";
import PostCreatorModal from "./components/PostCreatorModal";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ConnectChannelModal from "./components/ConnectChannelModal";
import N8NWorkflowModal from "./components/N8NWorkflowModal";
import SalesPage from "./components/SalesPage";
import LoginScreen from "./components/LoginScreen";
import { 
  Send, 
  MessageSquare, 
  User, 
  Mail, 
  Check, 
  Settings, 
  Bell, 
  Sparkles,
  Inbox as InboxIcon,
  ChevronRight,
  TrendingUp,
  FileText,
  DollarSign,
  Briefcase,
  Play,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function App() {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<MainTab>('planeamento');
  const [activeSubTabCalendar, setActiveSubTabCalendar] = useState<SubTabCalendar>('calendario');
  const [activeSubTabAnalytics, setActiveSubTabAnalytics] = useState<SubTabAnalytics>('resumo');

  // Core Data States (synchronized with localStorage)
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [channels, setChannels] = useState<SocialChannel[]>(initialChannels);

  // Connect Channel Modal Controller
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectModalInitialId, setConnectModalInitialId] = useState("instagram");
  const [isN8NModalOpen, setIsN8NModalOpen] = useState(false);

  // Modal Controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [defaultTime, setDefaultTime] = useState("10:00");
  const [defaultDate, setDefaultDate] = useState("");

  // Feedback notifications
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Active profile info with default auto-logged user
  const defaultUser = {
    username: "g2midias",
    email: "g2midiasoficial@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  };

  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; avatar: string } | null>(() => {
    const savedUser = localStorage.getItem("socialflow_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {}
    }
    return null;
  });

  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'platform'>(() => {
    const savedUser = localStorage.getItem("socialflow_user");
    return savedUser ? 'platform' : 'landing';
  });

  const handleLogout = () => {
    localStorage.removeItem("socialflow_user");
    setCurrentUser(null);
    setViewMode('landing');
    showNotification("Você saiu da plataforma. Até logo!", "info");
  };

  // Load initial posts and channels from Firebase Firestore (via backend API), falling back to localStorage or initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const postsRes = await fetch("/api/posts");
        const postsData = await postsRes.json();
        if (postsData && Array.isArray(postsData) && postsData.length > 0) {
          setPosts(postsData);
        } else {
          // If Firestore is empty, initialize it with initialPosts
          const savedLocal = localStorage.getItem("socialflow_posts");
          const postsToUse = savedLocal ? JSON.parse(savedLocal) : initialPosts;
          setPosts(postsToUse);
          // Upload to Firestore in the background
          for (const post of postsToUse) {
            await fetch("/api/posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(post)
            });
          }
        }
      } catch (error) {
        console.warn("Failed to load posts from server, falling back to local storage:", error);
        const saved = localStorage.getItem("socialflow_posts");
        setPosts(saved ? JSON.parse(saved) : initialPosts);
      }

      try {
        const channelsRes = await fetch("/api/channels");
        const channelsData = await channelsRes.json();
        if (channelsData && Array.isArray(channelsData) && channelsData.length > 0) {
          setChannels(channelsData);
        } else {
          // Initialize Firestore with initialChannels
          const savedLocal = localStorage.getItem("socialflow_channels");
          const channelsToUse = savedLocal ? JSON.parse(savedLocal) : initialChannels;
          setChannels(channelsToUse);
          // Upload to Firestore in background
          for (const channel of channelsToUse) {
            await fetch("/api/channels", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(channel)
            });
          }
        }
      } catch (error) {
        console.warn("Failed to load channels from server, falling back to local storage:", error);
        const saved = localStorage.getItem("socialflow_channels");
        setChannels(saved ? JSON.parse(saved) : initialChannels);
      }
    };

    loadData();
  }, []);

  // Save channels to localStorage and Firestore
  const saveChannels = async (newChannels: SocialChannel[]) => {
    setChannels(newChannels);
    localStorage.setItem("socialflow_channels", JSON.stringify(newChannels));
    try {
      for (const channel of newChannels) {
        await fetch("/api/channels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(channel)
        });
      }
    } catch (err) {
      console.warn("Failed to sync channels with Firebase:", err);
    }
  };

  // Save to localStorage when state updates
  const savePosts = (newPosts: SocialPost[]) => {
    setPosts(newPosts);
    localStorage.setItem("socialflow_posts", JSON.stringify(newPosts));
  };

  // Create post modal launcher
  const handleOpenCreateModal = (time = "10:00", date = "") => {
    setEditingPost(null);
    setDefaultTime(time);
    setDefaultDate(date || getWeekdayDate(1)); // Default Monday
    setIsModalOpen(true);
  };

  // Edit post launcher
  const handleEditPost = (post: SocialPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  // Delete post handler
  const handleDeletePost = async (postId: string) => {
    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
    localStorage.setItem("socialflow_posts", JSON.stringify(updated));
    showNotification("Publicação removida com sucesso!", "info");
    try {
      await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete post from Firebase:", err);
    }
  };

  // Save / Update post in list
  const handleSavePost = async (savedPost: SocialPost) => {
    const exists = posts.some(p => p.id === savedPost.id);
    let updated: SocialPost[];
    
    if (exists) {
      updated = posts.map(p => p.id === savedPost.id ? savedPost : p);
      showNotification("Publicação atualizada com sucesso!", "success");
    } else {
      updated = [savedPost, ...posts];
      showNotification("Nova publicação agendada com sucesso!", "success");
    }

    setPosts(updated);
    localStorage.setItem("socialflow_posts", JSON.stringify(updated));
    setIsModalOpen(false);

    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedPost)
      });
    } catch (err) {
      console.warn("Failed to save post to Firebase:", err);
    }
  };

  const handleUpdatePostStatus = async (postId: string, newStatus: 'draft' | 'scheduled' | 'published') => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("socialflow_posts", JSON.stringify(updated));
    showNotification(`Status atualizado para ${newStatus === 'draft' ? 'Rascunho' : newStatus === 'scheduled' ? 'Agendado' : 'Publicado'}!`, "success");

    const modifiedPost = updated.find(p => p.id === postId);
    if (modifiedPost) {
      try {
        await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modifiedPost)
        });
      } catch (err) {
        console.warn("Failed to update post status in Firebase:", err);
      }
    }
  };

  // Toggle API connect status
  const handleConnectChannel = (channelId: string) => {
    setConnectModalInitialId(channelId);
    setIsConnectModalOpen(true);
  };

  const handleDisconnectChannel = (channelId: string) => {
    const updated = channels.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          connected: false,
          followers: 0,
          followersChange: 0
        };
      }
      return c;
    });
    saveChannels(updated);
    showNotification(`Canal ${channelId === 'instagram' ? 'Instagram' : channelId === 'tiktok' ? 'TikTok' : channelId === 'facebook' ? 'Facebook' : 'YouTube'} desconectado.`, "info");
  };

  const handleSaveConnectedChannel = (newChannel: SocialChannel) => {
    const exists = channels.some(c => c.id === newChannel.id);
    let updated: SocialChannel[];
    if (exists) {
      updated = channels.map(c => c.id === newChannel.id ? newChannel : c);
    } else {
      updated = [...channels, newChannel];
    }
    saveChannels(updated);
    showNotification(`Canal ${newChannel.name} (@${newChannel.username}) conectado!`, "success");
  };

  const showNotification = (text: string, type: 'success' | 'info') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (viewMode === 'landing') {
    return (
      <>
        {/* Visual Floating State Toast notifications */}
        {notification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-4 duration-200">
            <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}>
              <span className="text-base">{notification.type === 'success' ? '✨' : 'ℹ️'}</span>
              <span>{notification.text}</span>
            </div>
          </div>
        )}
        <SalesPage 
          isLoggedIn={!!currentUser}
          onEnterPlatform={(guest) => {
            if (guest) {
              setCurrentUser(defaultUser);
              localStorage.setItem("socialflow_user", JSON.stringify(defaultUser));
              setViewMode('platform');
              showNotification(`Entrou como Convidado! Bem-vindo, ${defaultUser.username}!`, "success");
            } else {
              if (currentUser) {
                setViewMode('platform');
              } else {
                setViewMode('login');
              }
            }
          }}
        />
      </>
    );
  }

  if (viewMode === 'login') {
    return (
      <>
        {/* Visual Floating State Toast notifications */}
        {notification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-4 duration-200">
            <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}>
              <span className="text-base">{notification.type === 'success' ? '✨' : 'ℹ️'}</span>
              <span>{notification.text}</span>
            </div>
          </div>
        )}
        <LoginScreen 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            localStorage.setItem("socialflow_user", JSON.stringify(user));
            setViewMode('platform');
            showNotification(`Bem-vindo de volta, ${user.username}!`, "success");
          }} 
          onBackToLanding={() => setViewMode('landing')}
          onGuestLogin={() => {
            setCurrentUser(defaultUser);
            localStorage.setItem("socialflow_user", JSON.stringify(defaultUser));
            setViewMode('platform');
            showNotification(`Acesso Rápido Ativado! Bem-vindo, ${defaultUser.username}!`, "success");
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col antialiased">
      
      {/* Visual Floating State Toast notifications */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-4 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}>
            <span className="text-base">{notification.type === 'success' ? '✨' : 'ℹ️'}</span>
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Top and Sub navigation headers */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTabCalendar={activeSubTabCalendar}
        setActiveSubTabCalendar={setActiveSubTabCalendar}
        activeSubTabAnalytics={activeSubTabAnalytics}
        setActiveSubTabAnalytics={setActiveSubTabAnalytics}
        currentProfile={currentUser || { username: '', avatar: '', email: '' }}
        onOpenN8NModal={() => setIsN8NModalOpen(true)}
        onLogout={handleLogout}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* App Tab views body orchestrator */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'planeamento' && (
          <>
            {activeSubTabCalendar === 'calendario' && (
              <CalendarPlanner
                posts={posts}
                onEditPost={handleEditPost}
                onOpenCreateModal={handleOpenCreateModal}
                onDeletePost={handleDeletePost}
              />
            )}

            {activeSubTabCalendar === 'trello' && (
              <TrelloBoard
                posts={posts}
                onEditPost={handleEditPost}
                onOpenCreateModal={handleOpenCreateModal}
                onDeletePost={handleDeletePost}
                onUpdatePostStatus={handleUpdatePostStatus}
              />
            )}

            {activeSubTabCalendar === 'lista' && (
              <div className="p-4 md:p-8 flex-1 bg-gray-50 flex flex-col gap-4 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-900">Lista Geral de Publicações Agendadas</h3>
                  <button
                    onClick={() => handleOpenCreateModal()}
                    className="px-4 py-2 bg-[#2a1b15] text-amber-100 text-xs font-bold rounded-xl shadow hover:bg-gray-800"
                  >
                    + Criar publicação
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 items-center shadow-xs">
                      {post.mediaUrl && (
                        <img src={post.mediaUrl} className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.platforms.map(p => (
                            <span key={p} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md uppercase">
                              {p}
                            </span>
                          ))}
                          
                          {/* Destinations mini badges */}
                          {post.destinations && post.destinations.length > 0 && (
                            <div className="flex gap-1">
                              {post.destinations.map(dest => (
                                <span key={dest} className="text-[9px] bg-pink-50 text-pink-600 border border-pink-100 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {dest === 'feed' ? 'Feed' : 'Story'}
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="text-xs font-semibold text-gray-400 font-mono">
                            {post.date} às {post.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium line-clamp-2">{post.caption}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-xs font-semibold text-red-600"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTabCalendar === 'biblioteca' && (
              <div className="p-4 md:p-8 flex-1 bg-gray-50 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-900">Biblioteca de Mídias e Modelos</h3>
                  <p className="text-xs text-gray-400 mt-1">Armazene criativos e reutilize legendas e roteiros de reels populares.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {initialPosts.map((p, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs flex flex-col">
                      {p.mediaUrl && <img src={p.mediaUrl} className="h-44 w-full object-cover" referrerPolicy="no-referrer" />}
                      <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-medium">"{p.caption}"</p>
                        <button
                          onClick={() => {
                            setEditingPost({
                              id: `post-${Date.now()}`,
                              caption: p.caption,
                              platforms: ['instagram', 'tiktok'],
                              date: getWeekdayDate(1),
                              time: '10:00',
                              mediaUrl: p.mediaUrl,
                              mediaType: p.mediaType || 'video',
                              status: 'draft'
                            });
                            setIsModalOpen(true);
                          }}
                          className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl transition-all"
                        >
                          Usar este modelo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTabCalendar === 'autolistas' && (
              <div className="p-4 md:p-8 flex-1 bg-gray-50 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-200">
                <div className="max-w-md text-center p-6 bg-white border border-gray-100 rounded-3xl shadow-xs flex flex-col items-center gap-4">
                  <span className="p-3 bg-gradient-to-tr from-pink-500/10 to-purple-600/10 text-pink-500 rounded-2xl text-xl">🚀</span>
                  <h3 className="text-base font-bold text-gray-900">Autolistas Recorrentes</h3>
                  <p className="text-xs text-gray-500 leading-normal">
                    As autolistas permitem criar filas automáticas de postagens semanais ou diárias sem precisar agendar manualmente cada horário no calendário.
                  </p>
                  <button className="px-4 py-2 bg-pink-600 text-white font-semibold text-xs rounded-xl shadow hover:bg-pink-700">
                    Criar primeira Autolista
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'analitica' && (
          <AnalyticsDashboard
            channels={channels}
            posts={posts}
            onConnectChannel={handleConnectChannel}
            onDisconnectChannel={handleDisconnectChannel}
            activeSubTabAnalytics={activeSubTabAnalytics}
            setActiveSubTabAnalytics={setActiveSubTabAnalytics}
          />
        )}


      </div>

      {/* Post Creator / Editor Dynamic Overlay modal */}
      {isModalOpen && (
        <PostCreatorModal
          post={editingPost}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePost}
          defaultTime={defaultTime}
          defaultDate={defaultDate}
        />
      )}

      {/* Connect Channel Modal */}
      {isConnectModalOpen && (
        <ConnectChannelModal
          initialChannelId={connectModalInitialId}
          onClose={() => setIsConnectModalOpen(false)}
          onConnect={handleSaveConnectedChannel}
        />
      )}

      {/* n8n Integration Modal */}
      {isN8NModalOpen && (
        <N8NWorkflowModal
          onClose={() => setIsN8NModalOpen(false)}
        />
      )}

    </div>
  );
}
