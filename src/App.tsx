import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyChat } from './components/EmptyChat';
import { SettingsModal, SettingsTab } from './components/SettingsModal';
import { CompanyModal } from './components/CompanyModal';
import { VipWelcomeModal } from './components/VipWelcomeModal';
import { BenchmarksModal } from './components/BenchmarksModal';
import { ReleaseAnnouncementModal } from './components/ReleaseAnnouncementModal';
import { AuthPortal } from './components/AuthPortal';
import { NiximaCanvas } from './components/NiximaCanvas';
import { Conversation, Message, ModelOption, UserSettings, MessageTelemetry, SearchMode, ThinkingMode, NiximaArtifact, SearchGrounding } from './types/chat';
import { NiximaUser } from './types/user';
import { NIXIMA_MODELS, DEFAULT_MODEL } from './data/models';
import { INITIAL_CONVERSATIONS } from './data/initialChats';
import { streamOpenRouterChat, fetchLiveWebGrounding, cleanUserSearchQuery } from './utils/openrouter';
import { extractArtifactsFromMessage } from './utils/artifactDetector';
import { playTypingTick, playCompletionChime } from './utils/sound';
import { getActiveUser, logoutUser, syncAccountsWithServer, isDadAccount, isStrictCreator } from './utils/auth';
import { getSavedHotkey, matchesHotkey } from './utils/hotkeys';
import { buildNiximaSystemPrompt } from './utils/promptContext';
import { generateNiximaResponse } from './utils/aiResponse';
import { 
  getUserCredits, 
  calculateActualCost, 
  deductUserCredits, 
  hasSufficientCredits, 
  NIXIMA_CREDITS_EVENT,
  isVipAccount
} from './utils/credits';

import { LanguageProvider, useLanguage } from './context/LanguageContext';

const STORAGE_KEY_MODEL = 'nixima_active_model_v4';

/**
 * Evaluates whether Nixima-0.2O (Omni) should autonomously invoke live web grounding
 */
export function shouldOmniSearch(query: string): boolean {
  const trimmed = query.trim().toLowerCase();

  // 1. News, breaking events, current updates
  const searchAnalysis = cleanUserSearchQuery(query);
  if (searchAnalysis.isNewsQuery) return true;

  // 2. Explicit search requests
  if (
    /(?:search(?:\s+for|\s+web|\s+the\s+web|\s+google|\s+online)?|google\s+this|find(?:\s+online|\s+on\s+the\s+web|\s+in\s+web)?|lookup|look\s+up|browse(?:\s+web)?|check\s+online|live\s+data|weather\s+in|stock\s+price|market\s+price|exchange\s+rate|latest\s+version|release\s+date|documentation\s+for)/i.test(trimmed) ||
    /(?:пошукай(?:те)?|знайди(?:те)?(?:\s+в\s+інтернеті|\s+в\s+мережі|\s+в\s+гуглі|\s+онлайн)?|пошук|погугли|глянь\s+в\s+інтернеті|яка\s+погода|курс\s+валют|ціна\s+акцій|свіжі\s+дані|остання\s+версія)/i.test(trimmed)
  ) {
    return true;
  }

  // 3. URLs, domains, or web links
  if (/https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}|[a-z0-9-]+\.(?:com|org|io|ai|net|ua|gov|edu)\b/i.test(trimmed)) {
    return true;
  }

  // 4. Temporal anchors indicating need for up-to-date data
  if (/\b(?:2025|2026|today|tonight|this month|this year|right now|currently|current)\b/i.test(trimmed) ||
      /(?:сьогодні|зараз|цього року|актуальн)/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether Nixima-0.2O (Omni) should autonomously invoke Basic Thinking, DeepThinking, or no thinking.
 * Prevents always triggering heavy DeepThinking overhead for everyday inquiries.
 */
export function getOmniThinkingDecision(query: string): ThinkingMode {
  const trimmed = query.trim().toLowerCase();

  // 1. Trivial or minimal greetings / short acknowledgements -> 'none' (zero latency overhead)
  if (
    /^(?:hi|hello|hey|greetings|howdy|sup|yo|привіт|вітаю|добрий\s+(?:день|ранок|вечір)|дякую|thanks|thank\s+you|ок|ok|good|bye|бувай)\b/i.test(trimmed) &&
    trimmed.length < 35
  ) {
    return 'none';
  }

  // 2. High-intensity logic, mathematical derivations, algorithmic complexity, or explicit deep reasoning requests -> 'deep'
  if (
    /(?:think\s+deeply|deep\s+think|step\s+by\s+step|formal\s+proof|derive|deduce|rigorous|chain\s+of\s+thought|verify\s+logically|prove\b|break\s+it\s+down\s+deeply)/i.test(trimmed) ||
    /(?:глибоко\s+подумай|подумай\s+глибоко|покроково|ланцюжок\s+думок|доведи|виведи|строге\s+доведення|обґрунтуй\s+детально)/i.test(trimmed)
  ) {
    return 'deep';
  }

  if (
    /(?:algorithm|complexity|o\(n\)|dynamic\s+programming|dijkstra|binary\s+tree|graph\s+traversal|matrix\s+multiplication|eigenvalue|derivative|integral|differential|theorem|axioms?|proof\b|puzzle|riddle|logician)/i.test(trimmed) ||
    /(?:алгоритм|складність|дерево|граф|матриц|похідна|інтеграл|диференціал|теорем|аксіом|доведення|головоломк|загадк|мудрец)/i.test(trimmed)
  ) {
    return 'deep';
  }

  if (
    /(?:architecture|concurrency|mutex|deadlock|race\s+condition|microservices|distributed\s+system|memory\s+leak|kernel|compiler|refactor)/i.test(trimmed) ||
    /(?:архітектур|асинхрон|паралелізм|дедлок|гонка\s+станів|мікросервіс|розподілен|витік\s+пам'яті|компілятор)/i.test(trimmed)
  ) {
    return 'deep';
  }

  // 3. Substantial multi-part analytical queries (>300 chars with multiple questions or structure) -> 'deep'
  if (query.length > 300 && ((query.match(/\?/g) || []).length >= 2 || query.includes('\n-') || query.includes('1.'))) {
    return 'deep';
  }

  // 4. General explanations, coding tasks, comparisons, planning, troubleshooting, non-trivial questions -> 'basic'
  if (
    /(?:think|reason|explain|why|how|what\s+is\s+the\s+difference|compare|plan|analyze|suggest|solve|debug|implement|write|code|create|guide|troubleshoot)/i.test(trimmed) ||
    /(?:подумай|поясни|чому|як|в\s+чому\s+різниця|порівняй|сплануй|проаналізуй|порадь|виріши|задебаж|реалізуй|напиши|код|створи|інструкція)/i.test(trimmed)
  ) {
    return 'basic';
  }

  // If query is moderate length (>60 chars) or asks a question, benefit from basic agile thought process
  if (query.length > 60 || query.includes('?')) {
    return 'basic';
  }

  return 'none';
}

/**
 * Backward-compatible helper to check if any thinking mode is active for Omni
 */
export function shouldOmniThink(query: string): boolean {
  return getOmniThinkingDecision(query) !== 'none';
}

const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  // 1. Authentication state
  const [currentUser, setCurrentUser] = useState<NiximaUser | null>(() => getActiveUser());

  // Background accounts synchronization across devices
  useEffect(() => {
    syncAccountsWithServer().catch(() => {});
  }, []);

  // Helper key generators for user isolation
  const getConvKey = (uid: string) => `nixima_user_${uid}_convs_v1`;
  const getSettingsKey = (uid: string) => `nixima_user_${uid}_settings_v1`;

  // 2. Settings state (isolated per user)
  const [settings, setSettings] = useState<UserSettings>(() => {
    const active = getActiveUser();
    const storedApiKey = typeof window !== 'undefined' ? (localStorage.getItem('nixima_openrouter_key') || '') : '';
    if (active) {
      const saved = localStorage.getItem(getSettingsKey(active.id));
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            openRouterApiKey: parsed.openRouterApiKey || storedApiKey || undefined,
          };
        } catch (e) { /* ignore */ }
      }
    }
    return {
      userName: active?.name || 'Bogdan',
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 4096,
      systemPrompt: 'You are Nixima AI, a high-performance frontier reasoning intelligence. Provide clean, well-formatted, intelligent, and accurate responses.',
      personaTone: 'architect',
      deepThinkEnabled: false,
      webSearchEnabled: false,
      soundEnabled: true,
      streamSpeed: 'fast',
      themeContrast: 'titanium',
      antiGlitchFilter: true,
      openRouterApiKey: storedApiKey || undefined,
    };
  });

  // 3. Active Model
  const [currentModel, setCurrentModel] = useState<ModelOption>(() => {
    const savedModelId = localStorage.getItem(STORAGE_KEY_MODEL);
    if (savedModelId) {
      const match = NIXIMA_MODELS.find(m => m.id === savedModelId);
      if (match) return match;
    }
    return DEFAULT_MODEL; // Nixima-0.1
  });

  // 4. Conversations state (isolated per user)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const active = getActiveUser();
    if (active) {
      const saved = localStorage.getItem(getConvKey(active.id));
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  // 5. Active conversation ID
  const [activeId, setActiveId] = useState<string>(() => {
    if (conversations.length > 0) return conversations[0].id;
    return 'new-chat';
  });

  // 6. UI & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isVipPreview, setIsVipPreview] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<'warexxq' | 'roman1980'>('warexxq');
  const [isBenchmarksOpen, setIsBenchmarksOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  // VIP Welcome letter & presentation check, URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const benchParam = params.get('benchmarks') || params.get('benchmark');
    if (benchParam) {
      setIsBenchmarksOpen(true);
    }

    const releaseParam = params.get('release') || params.get('announcement');
    if (releaseParam) {
      setIsReleaseModalOpen(true);
    }

    const previewParam = params.get('preview_vip') || params.get('vip_preview');
    if (previewParam) {
      if (previewParam.toLowerCase().includes('roman') || previewParam.toLowerCase().includes('dad')) {
        setPreviewTarget('roman1980');
      } else {
        setPreviewTarget('warexxq');
      }
      setIsVipPreview(true);
      setIsVipModalOpen(true);
      return;
    }

    if (currentUser) {
      if (isDadAccount(currentUser)) {
        setLanguage('uk');
      }

      if (isVipAccount(currentUser) || isDadAccount(currentUser)) {
        const seenKey = `nixima_vip_welcome_seen_${currentUser.id}`;
        const hasSeen = localStorage.getItem(seenKey);
        const forceOpen = sessionStorage.getItem('nixima_force_vip_welcome') === 'true';
        if (!hasSeen || forceOpen) {
          sessionStorage.removeItem('nixima_force_vip_welcome');
          setIsVipPreview(false);
          setIsVipModalOpen(true);
        }
      }
    }
  }, [currentUser]);

  // Sync user credits on event
  useEffect(() => {
    const handleCreditsChange = (e: any) => {
      if (e.detail && e.detail.credits !== undefined) {
        setCurrentUser(prev => prev ? { ...prev, credits: e.detail.credits } : prev);
      }
    };
    window.addEventListener(NIXIMA_CREDITS_EVENT, handleCreditsChange);
    return () => window.removeEventListener(NIXIMA_CREDITS_EVENT, handleCreditsChange);
  }, []);

  const handleOpenCredits = () => {
    setSettingsTab('credits');
    setIsSettingsOpen(true);
  };

  const handleOpenSettings = (tab: SettingsTab = 'general') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  // 7. Streaming & generation state
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 8. Nixima Canvas & Artifacts Workspace state
  const [activeArtifact, setActiveArtifact] = useState<NiximaArtifact | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isCanvasMaximized, setIsCanvasMaximized] = useState(false);

  const handleOpenArtifact = (artifact: NiximaArtifact) => {
    setActiveArtifact(prev => {
      // If the same artifact is already loaded, preserve its version stack
      if (prev && prev.id === artifact.id) {
        return prev;
      }
      return artifact;
    });
    setIsCanvasOpen(true);
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
    setIsCanvasMaximized(false);
  };

  const handleUpdateArtifactContent = (newContent: string) => {
    setActiveArtifact(prev => {
      if (!prev) return null;
      const nextVer = (prev.currentVersion || 1) + 1;
      return {
        ...prev,
        content: newContent,
        versions: [
          ...(prev.versions || []),
          {
            version: nextVer,
            content: newContent,
            timestamp: Date.now(),
            description: `Manual edit in Canvas (v${nextVer})`,
          },
        ],
        currentVersion: nextVer,
      };
    });
  };

  const handleSelectArtifactVersion = (verNumber: number) => {
    setActiveArtifact(prev => {
      if (!prev) return null;
      const targetVer = prev.versions?.find(v => v.version === verNumber);
      if (!targetVer) return prev;
      return {
        ...prev,
        content: targetVer.content,
        currentVersion: verNumber,
      };
    });
  };

  // Global listener for opening artifacts from anywhere in the app
  useEffect(() => {
    const handleArtifactEvent = (e: any) => {
      if (e.detail) {
        handleOpenArtifact(e.detail);
      }
    };
    window.addEventListener('NIXIMA_OPEN_ARTIFACT', handleArtifactEvent);
    return () => window.removeEventListener('NIXIMA_OPEN_ARTIFACT', handleArtifactEvent);
  }, []);

  // Load user data on authentication change
  const handleAuthenticated = (user: NiximaUser) => {
    setCurrentUser(user);
    if (isDadAccount(user)) {
      setLanguage('uk');
    } else if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }

    // Explicitly trigger VIP welcome presentation when logging into a VIP account
    if (isVipAccount(user) || isDadAccount(user)) {
      setIsVipPreview(false);
      setIsVipModalOpen(true);
    }

    const isUk = (user.preferredLanguage || language) === 'uk';

    // Load user's conversations
    const userConvRaw = localStorage.getItem(getConvKey(user.id));
    if (userConvRaw) {
      try {
        const parsed = JSON.parse(userConvRaw);
        setConversations(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
        else handleNewChat();
      } catch (e) {
        setConversations(INITIAL_CONVERSATIONS);
        setActiveId(INITIAL_CONVERSATIONS[0].id);
      }
    } else {
      // Seed welcome conversation for new user
      const welcomeChat: Conversation = {
        id: 'chat-welcome-' + Date.now(),
        title: isUk ? `Вітаємо в Nixima, ${user.name}` : `Welcome to Nixima, ${user.name}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: 'nixima-0.2',
        pinned: true,
        messages: [
          {
            id: 'wm-1',
            role: 'assistant',
            content: isUk ? `### Ласкаво просимо до Nixima AI, **${user.name}**!

Вашу суверенну ідентичність Nixima успішно активовано:
- **Nixima Email**: \`${user.email}\`
- **Роль**: \`${user.role}\`
- **Нейрорушій**: \`Nixima-0.2\` Активний (Нове покоління 0.2)

Усі діалоги та налаштування моделі в цьому робочому просторі є приватними та захищеними для вашого Nixima ID. Задайте питання нижче або оберіть підказку для дослідження.` : `### Welcome to Nixima AI, **${user.name}**!

Your Sovereign Nixima Identity has been provisioned:
- **Nixima Email**: \`${user.email}\`
- **Role**: \`${user.role}\`
- **Inference Engine**: \`Nixima-0.2\` Active (0.2 Generation)

All conversations and model preferences in this workspace are private to your Nixima ID. Ask a question below or pick a research prompt to begin.`,
            timestamp: Date.now(),
            model: 'Nixima-0.2',
          }
        ]
      };
      setConversations([welcomeChat]);
      setActiveId(welcomeChat.id);
    }

    // Load user's settings
    const userSettingsRaw = localStorage.getItem(getSettingsKey(user.id));
    if (userSettingsRaw) {
      try {
        setSettings(JSON.parse(userSettingsRaw));
      } catch (e) { /* ignore */ }
    } else {
      setSettings(prev => ({ ...prev, userName: user.name }));
    }
  };

  // Sign out handler
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Persistence effects for active user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getConvKey(currentUser.id), JSON.stringify(conversations));
    }
  }, [conversations, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getSettingsKey(currentUser.id), JSON.stringify(settings));
    }
  }, [settings, currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODEL, currentModel.id);
  }, [currentModel]);

  // Keyboard shortcuts (Adaptive & Customized)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const config = getSavedHotkey();
      if (matchesHotkey(e, config)) {
        e.preventDefault();
        handleNewChat();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentModel.id]);

  const activeConversation = conversations.find(c => c.id === activeId);

  // Scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeId]);

  // Handler: New Chat
  const handleNewChat = () => {
    const newId = 'chat-' + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: t.sidebar.newChatButton,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentModel.id,
      pinned: false,
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newId);
  };

  // Handler: Delete Chat
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== id);
      if (remaining.length === 0) {
        const freshId = 'chat-' + Date.now();
        const freshConv: Conversation = {
          id: freshId,
          title: t.sidebar.newChatButton,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: currentModel.id,
          pinned: false,
        };
        setActiveId(freshId);
        return [freshConv];
      }
      if (activeId === id) {
        setActiveId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Handler: Toggle Pin
  const handleTogglePinConversation = (id: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, pinned: !c.pinned } : c
    ));
  };

  // Handler: Rename
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c
    ));
  };

  // Handler: Branch Conversation from specific message
  const handleBranchConversation = (fromMessageId: string) => {
    if (!activeConversation) return;
    const msgIndex = activeConversation.messages.findIndex(m => m.id === fromMessageId);
    if (msgIndex === -1) return;

    const branchedMessages = activeConversation.messages.slice(0, msgIndex + 1).map(m => ({
      ...m,
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
    }));

    const newId = 'chat-branch-' + Date.now();
    const branchTitle = `${activeConversation.title} (${language === 'uk' ? 'Гілка' : 'Branch'})`;
    const newConv: Conversation = {
      id: newId,
      title: branchTitle,
      messages: branchedMessages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: activeConversation.modelId || currentModel.id,
      pinned: false,
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveId(newId);
  };

  // Handler: Import
  const handleImportConversations = (imported: Conversation[]) => {
    if (imported.length > 0) {
      setConversations(imported);
      setActiveId(imported[0].id);
    }
  };

  // Handler: Clear All
  const handleClearAllChats = () => {
    const freshId = 'chat-' + Date.now();
    const freshConv: Conversation = {
      id: freshId,
      title: t.sidebar.newChatButton,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentModel.id,
      pinned: false,
    };
    setConversations([freshConv]);
    setActiveId(freshId);
  };

  // Handler: Send Message with Real OpenRouter Streaming
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    if (!hasSufficientCredits(currentUser, currentModel)) {
      handleOpenCredits();
      return;
    }

    let targetConvId = activeId;
    let currentConv = conversations.find(c => c.id === targetConvId);

    if (!currentConv) {
      targetConvId = 'chat-' + Date.now();
      currentConv = {
        id: targetConvId,
        title: userText.slice(0, 32),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: currentModel.id,
        pinned: false,
      };
      setConversations(prev => [currentConv!, ...prev]);
      setActiveId(targetConvId);
    }

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    const isFirstMessage = currentConv.messages.length === 0;
    const newTitle = isFirstMessage ? (userText.length > 28 ? userText.slice(0, 28) + '...' : userText) : currentConv.title;

    const aiMessageId = 'ai-' + Date.now();
    const initialGrounding: SearchGrounding | undefined = settings.webSearchEnabled
      ? {
          query: userText,
          sources: [],
          searchMode: settings.searchMode || 'standard',
          searchTimeMs: 0,
          indexedResultsCount: 0,
          consensusScore: 99,
          searchActions: [
            {
              stepNumber: 1,
              actionType: 'query',
              title: settings.searchMode === 'fast'
                ? (language === 'uk' ? 'Швидкий запит до вебіндексу' : 'Dispatching Rapid Vector Query')
                : settings.searchMode === 'mega'
                ? (language === 'uk' ? 'Мультикластерний пошуковий запит' : 'Multi-Cluster Swarm Query Dispatch')
                : (language === 'uk' ? 'Ініціалізація пошуку у вебі' : 'Dispatching Neural Search Queries'),
              reasoning: language === 'uk'
                ? `Опитування реального пошукового індексу за запитом «${userText.slice(0, 60)}»...`
                : `Querying real-time web index for "${userText.slice(0, 60)}"...`,
              status: 'in_progress',
            }
          ]
        }
      : undefined;

    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      thinking: '',
      searchGrounding: initialGrounding,
      timestamp: Date.now(),
      model: currentModel.name,
      isStreaming: true,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === targetConvId) {
        return {
          ...c,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...c.messages, userMessage, aiMessagePlaceholder]
        };
      }
      return c;
    }));

    setIsLoading(true);
    const abortCtrl = new AbortController();
    abortControllerRef.current = abortCtrl;
    setTimeout(() => scrollToBottom(), 50);

    const startTime = performance.now();
    let tokenTickCount = 0;
    let liveGrounding: SearchGrounding | undefined;

    const isOmni = Boolean(currentModel.isOmni || currentModel.id === 'nixima-0.2-omni' || currentModel.id === 'nixima-0.3-omni');

    // Determine whether web search should run: explicitly enabled, current news/events, or Omni autonomous
    const searchAnalysis = cleanUserSearchQuery(userText);
    const isNewsQuery = searchAnalysis.isNewsQuery;
    const shouldRunWebSearch = isOmni
      ? shouldOmniSearch(userText)
      : (settings.webSearchEnabled || isNewsQuery);

    // Determine thinking mode: Omni autonomous (none, basic, deep) or user settings
    const omniThinkingDecision = isOmni ? getOmniThinkingDecision(userText) : 'none';
    const effectiveThinkingMode: ThinkingMode = isOmni
      ? omniThinkingDecision
      : (settings.thinkingMode || (settings.deepThinkEnabled ? 'deep' : 'none'));
    const effectiveDeepThink = effectiveThinkingMode === 'deep' || effectiveThinkingMode === 'ultra';
    const isThinkingActive = effectiveThinkingMode !== 'none';

    let historyForApi: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
      ...currentConv.messages
        .filter(m => m.content && m.content.trim().length > 0)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content.trim() })),
      { role: 'user', content: userText }
    ];

    try {
      if (shouldRunWebSearch) {
        try {
          liveGrounding = await fetchLiveWebGrounding(userText, language, settings.searchMode || 'standard');

          // Immediately reflect genuine retrieved sources & step actions in the UI
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === aiMessageId ? {
                  ...m,
                  searchGrounding: liveGrounding
                } : m)
              };
            }
            return c;
          }));
        } catch (searchErr) {
          console.warn('[Nixima Search] Live web fetch failed:', searchErr);
        }
      }

      const isCreatorUser = isStrictCreator(currentUser);
      const isInfiniteOutputActive = Boolean(isCreatorUser && settings.infiniteOutputEnabled);

      let dynamicSystemPrompt = buildNiximaSystemPrompt({
        user: currentUser,
        credits: getUserCredits(currentUser),
        language: language,
        model: currentModel,
        customSystemPrompt: settings.systemPrompt,
        deepThink: effectiveDeepThink,
        thinkingMode: effectiveThinkingMode,
        webSearch: shouldRunWebSearch,
        searchMode: settings.searchMode || 'standard',
        infiniteOutput: isInfiniteOutputActive,
      });

      // Prepare final user prompt with live grounding injected into immediate context
      let finalUserPrompt = userText;
      if (liveGrounding && liveGrounding.sources.length > 0) {
        const isLiveNews = liveGrounding.sources.some(s => s.cluster === 'Live News Wire');
        const nowStr = new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        if (isLiveNews) {
          dynamicSystemPrompt += `\n\n[REAL-TIME LIVE BREAKING NEWS WIRE - VERIFIED TODAY: ${nowStr}]\n` +
            `Query: "${userText}"\n` +
            `Active Breaking Headlines:\n` +
            liveGrounding.sources.map((src, i) =>
              `[${i + 1}] Headline: ${src.title}\n    Publisher: ${src.domain}\n    Direct Link: ${src.url}\n    Report: ${src.snippet}`
            ).join('\n\n') +
            `\n\nInstructions: Deliver a comprehensive, well-structured, and timely live news briefing based on these verified breaking developments. Group by topic or region, highlight key details, and cite sources using [1], [2] where appropriate. Do not output unrelated historical or encyclopedic definitions.`;

          finalUserPrompt = `[LIVE BREAKING NEWS WIRE GROUNDING — TODAY: ${nowStr}]\n` +
            liveGrounding.sources.map((src, i) =>
              `[Source ${i + 1}] ${src.title} (${src.domain})\nURL: ${src.url}\nSummary: ${src.snippet}`
            ).join('\n\n') +
            `\n\n[USER INQUIRY]\n${userText}\n\n` +
            `(MANDATORY TEMPORAL INSTRUCTION: You are Nixima AI in ${new Date().getFullYear()}. Using the live news wire reports above for today (${nowStr}), provide a comprehensive, structured briefing. Under NO circumstances refuse by claiming a 2023 knowledge cutoff or lack of live internet access. Cite sources [1], [2] where appropriate.)`;
        } else {
          dynamicSystemPrompt += `\n\n[REAL-TIME LIVE WEB SEARCH GROUNDING — TODAY: ${nowStr}]\n` +
            `Query: "${userText}"\n` +
            `Verified Real-World Web Findings:\n` +
            liveGrounding.sources.map((src, i) =>
              `[${i + 1}] Title: ${src.title}\n    URL: ${src.url}\n    Excerpt: ${src.snippet || 'Authoritative reference'}`
            ).join('\n\n') +
            `\n\nInstructions: Ground your response in these verified real-world findings. Answer the user's question directly, accurately, and authoritatively. Cite sources with [1], [2] where appropriate.`;

          finalUserPrompt =
            `[SEARCH V3 REAL-TIME GROUNDED WEB FINDINGS — ${liveGrounding.sources.length} WEBSITES CRAWLED]\n` +
            liveGrounding.sources.map((src, i) =>
              `[Source ${i + 1}] ${src.title} (${src.domain})\nURL: ${src.url}\nSummary: ${src.snippet || 'Authoritative reference'}`
            ).join('\n\n') +
            `\n\n[USER INQUIRY]\n${userText}\n\n` +
            `(MANDATORY TEMPORAL INSTRUCTION: Answer using the verified real-world findings above. Do NOT claim a 2023 knowledge cutoff. Cite sources [1], [2] where appropriate.)`;
        }
      }

      historyForApi = [
        ...currentConv.messages
          .filter(m => m.content && m.content.trim().length > 0)
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content.trim() })),
        { role: 'user', content: finalUserPrompt }
      ];

      const { fullContent, fullThinking, searchGrounding, deepThinkingTelemetry } = await streamOpenRouterChat({
        apiKey: settings.openRouterApiKey,
        model: currentModel,
        messages: historyForApi,
        systemPrompt: dynamicSystemPrompt,
        temperature: settings.temperature,
        topP: settings.topP,
        maxTokens: settings.maxTokens,
        antiGlitchFilter: settings.antiGlitchFilter !== false,
        deepThink: effectiveDeepThink,
        thinkingMode: effectiveThinkingMode,
        webSearch: shouldRunWebSearch,
        searchMode: settings.searchMode || 'standard',
        initialSearchGrounding: liveGrounding,
        infiniteOutput: isInfiniteOutputActive,
        callbacks: {
          onToken: (contentChunk) => {
            tokenTickCount++;
            if (settings.soundEnabled && tokenTickCount % 3 === 0) {
              playTypingTick();
            }
            setConversations(prev => prev.map(c => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: contentChunk } : m)
                };
              }
              return c;
            }));
            scrollToBottom();
          },
          onThinking: (thinkingChunk) => {
            if (!isThinkingActive && !isOmni) return;
            setConversations(prev => prev.map(c => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map(m => m.id === aiMessageId ? { 
                    ...m, 
                    thinking: thinkingChunk,
                    thinkingMode: effectiveThinkingMode,
                  } : m)
                };
              }
              return c;
            }));
          }
        },
        signal: abortCtrl.signal,
      });

      const durationMs = Math.round(performance.now() - startTime);
      const estTokens = Math.round(fullContent.length / 4);

      // Deduct credits based on prompt difficulty, response tokens, and reasoning trace
      const costResult = calculateActualCost(
        userText,
        fullContent,
        fullThinking,
        currentModel,
        effectiveDeepThink,
        effectiveThinkingMode
      );

      const isCreator = currentUser && (
        (currentUser.email || '').toLowerCase() === 'orange17@nixima.ai' ||
        (currentUser.handle || '').toLowerCase() === 'orange17' ||
        currentUser.isCreator ||
        currentUser.unlimitedCredits
      );

      const actualSpent = isCreator ? 0 : costResult.credits;

      if (currentUser && !isCreator) {
        const { updatedUser } = deductUserCredits(currentUser, costResult.credits);
        setCurrentUser(updatedUser);
      }

      const telemetry: MessageTelemetry = {
        tokens: estTokens,
        durationMs,
        tokensPerSec: Math.round((estTokens / (durationMs / 1000 || 1))),
        model: currentModel.name,
        creditsSpent: actualSpent,
      };

      const hasThinkingToDisplay = (isThinkingActive || isOmni) && fullThinking.trim().length > 0;
      const detectedArtifacts = extractArtifactsFromMessage(fullContent, aiMessageId);

      // If Canvas is currently active and model generated an artifact update, auto-stack version
      if (detectedArtifacts.length > 0) {
        setActiveArtifact(prev => {
          if (!prev) return detectedArtifacts[0];
          const matching = detectedArtifacts.find(a => a.type === prev.type) || detectedArtifacts[0];
          const nextVersion = (prev.currentVersion || 1) + 1;
          return {
            ...prev,
            content: matching.content,
            versions: [
              ...(prev.versions || []),
              {
                version: nextVersion,
                content: matching.content,
                timestamp: Date.now(),
                description: `Model update (v${nextVersion})`,
              }
            ],
            currentVersion: nextVersion,
          };
        });
      }

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === aiMessageId ? { 
              ...m, 
              content: fullContent,
              thinking: hasThinkingToDisplay ? (fullThinking || undefined) : undefined,
              thinkingMode: hasThinkingToDisplay ? effectiveThinkingMode : undefined,
              searchGrounding,
              deepThinkingTelemetry: hasThinkingToDisplay ? deepThinkingTelemetry : undefined,
              isStreaming: false,
              artifacts: detectedArtifacts.length > 0 ? detectedArtifacts : undefined,
              telemetry 
            } : m)
          };
        }
        return c;
      }));

      if (settings.soundEnabled) {
        playCompletionChime();
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMessageId ? { ...m, isStreaming: false } : m)
            };
          }
          return c;
        }));
      } else {
        console.warn('OpenRouter streaming error, failing over to local Nixima engine:', err);
        const isRateLimit = Boolean(
          err?.message?.includes('RATE_LIMIT') ||
          err?.message?.includes('Rate limit exceeded') ||
          err?.message?.includes('429')
        );

        if (isRateLimit) {
          const rateLimitNotice = language === 'uk'
            ? `⚠️ **Вичерпано добовий ліміт спільного безкоштовного ключа (50 запитів/день)**\n\nСпільний демо-ключ вичерпав добову квоту безкоштовних запитів OpenRouter, через що реальний AI тимчасово недоступний.\n\n### Як повернути справжній AI просто зараз:\n1. Отримайте власний безкоштовний ключ на [openrouter.ai/keys](https://openrouter.ai/keys) (створюється за 10 секунд, 100% безкоштовно, без карток).\n2. Натисніть **Налаштування ⚙️ → AI Рушій / API** та вставте його.\n3. Всі моделі Nixima 0.3 та 0.2 одразу почнуть відповідати наживо з персональним лімітом 1,000+ запитів на добу!`
            : `⚠️ **OpenRouter Free Tier Daily Allocation Reached (50/50 requests for shared demo key)**\n\nThe shared demo API key has exhausted its daily free allocation on OpenRouter, causing the system to fallback to local mock responses.\n\n### How to restore real AI responses immediately:\n1. Visit [openrouter.ai/keys](https://openrouter.ai/keys) and create your free API key (takes 10 seconds, 100% free, no credit card required).\n2. Open **Settings ⚙️ → Neural Engine / API** and paste your key into the Dedicated OpenRouter Key field.\n3. All Nixima 0.3 & 0.2 models will immediately resume real inference with your own dedicated 1,000+ free daily requests!`;

          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === aiMessageId ? {
                  ...m,
                  content: rateLimitNotice,
                  isStreaming: false,
                } : m)
              };
            }
            return c;
          }));
        } else {
          try {
            const fallback = generateNiximaResponse({
              prompt: userText,
              model: currentModel,
              deepThink: effectiveDeepThink,
              thinkingMode: effectiveThinkingMode,
              webSearch: shouldRunWebSearch,
              searchMode: settings.searchMode || 'standard',
              history: historyForApi
            });
          const hasFallbackThinking = (isThinkingActive || isOmni) && (fallback.thinking || '').trim().length > 0;
          const estTokens = Math.round(fallback.response.length / 4);
          const durationMs = Math.round(performance.now() - startTime);
          const fallbackTelemetry: MessageTelemetry = {
            tokens: estTokens,
            durationMs,
            tokensPerSec: Math.round((estTokens / (durationMs / 1000 || 1))) || 40,
            model: currentModel.name,
            creditsSpent: 0,
          };

          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === aiMessageId ? {
                  ...m,
                  content: fallback.response,
                  thinking: hasFallbackThinking ? fallback.thinking : undefined,
                  thinkingMode: hasFallbackThinking ? effectiveThinkingMode : undefined,
                  searchGrounding: liveGrounding || fallback.searchGrounding,
                  deepThinkingTelemetry: hasFallbackThinking ? fallback.deepThinkingTelemetry : undefined,
                  isStreaming: false,
                  telemetry: fallbackTelemetry
                } : m)
              };
            }
            return c;
          }));
        } catch (fallbackErr) {
          console.error('[Nixima Core] Fallback generation error:', fallbackErr);
          setConversations(prev => prev.map(c => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === aiMessageId ? {
                  ...m,
                  content: language === 'uk'
                    ? 'Вибачте, виникла тимчасова помилка з’єднання з моделлю. Будь ласка, спробуйте ще раз.'
                    : 'A temporary connection error occurred with the model service. Please try again.',
                  isStreaming: false
                } : m)
              };
            }
            return c;
          }));
        }
      }
    }
  } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length < 2) return;
    const lastUserMessage = [...activeConversation.messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleEditUserMessage = (msgId: string, newContent: string) => {
    if (!activeConversation) return;
    const msgIdx = activeConversation.messages.findIndex(m => m.id === msgId);
    if (msgIdx === -1) return;

    const truncated = activeConversation.messages.slice(0, msgIdx);
    setConversations(prev => prev.map(c => 
      c.id === activeConversation.id ? { ...c, messages: truncated } : c
    ));
    handleSendMessage(newContent);
  };

  const isPureBlack = settings.themeContrast === 'pure-black';

  // If no user session is active, render the Nixima Auth Portal
  if (!currentUser) {
    return <AuthPortal onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className={`flex h-screen w-full text-[#f4f4f5] overflow-hidden font-sans transition-colors duration-300 animate-fade-in ${isPureBlack ? 'bg-black' : 'bg-[#09090b]'}`}>
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={setActiveId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onTogglePinConversation={handleTogglePinConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => handleOpenSettings('general')}
        onOpenCompanyInfo={() => setIsCompanyModalOpen(true)}
        onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
      />

      {/* Main Content Area: Global Header + Split-Screen Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Global Application Header */}
        <Header
          currentModel={currentModel}
          onSelectModel={setCurrentModel}
          onOpenSettings={() => handleOpenSettings('general')}
          onOpenCompanyInfo={() => setIsCompanyModalOpen(true)}
          onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
          onOpenReleaseModal={() => setIsReleaseModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onNewChat={handleNewChat}
          credits={getUserCredits(currentUser)}
          onOpenCredits={handleOpenCredits}
          webSearchEnabled={settings.webSearchEnabled}
          searchMode={settings.searchMode || 'standard'}
        />

        {/* Workspace Area: Chat + Nixima Canvas Split Screen */}
        <div className="flex-1 flex overflow-hidden min-w-0 relative h-full">
          {/* Main Chat Column */}
          <div className={`flex flex-col h-full min-w-0 relative transition-all duration-200 ${isPureBlack ? 'bg-black' : 'bg-[#09090b]'} ${
            isCanvasOpen && !isCanvasMaximized
              ? 'hidden lg:flex lg:w-1/2 xl:w-[48%] border-r border-zinc-800/80'
              : isCanvasMaximized
              ? 'hidden'
              : 'w-full flex-1'
          }`}>
            {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto min-w-0 bg-grid-pattern">
            {!activeConversation || activeConversation.messages.length === 0 ? (
              <EmptyChat
                currentModel={currentModel}
                onSelectPrompt={handleSendMessage}
                onSelectModel={setCurrentModel}
                onOpenReleaseModal={() => setIsReleaseModalOpen(true)}
              />
            ) : (
              <div className="pb-8">
                {activeConversation.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onRegenerate={msg.role === 'assistant' ? handleRegenerate : undefined}
                    onEditMessage={msg.role === 'user' ? (newContent) => handleEditUserMessage(msg.id, newContent) : undefined}
                    onActionPrompt={handleSendMessage}
                    onBranchMessage={handleBranchConversation}
                    onOpenArtifact={handleOpenArtifact}
                    activeModelName={currentModel.name}
                  />
                ))}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>

          {/* Input Bar Dock */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopGeneration={handleStopGeneration}
            currentModel={currentModel}
            deepThink={settings.thinkingMode === 'deep' || settings.thinkingMode === 'ultra' || settings.deepThinkEnabled}
            thinkingMode={settings.thinkingMode || (settings.deepThinkEnabled ? 'deep' : 'none')}
            onToggleDeepThink={() => {
              setSettings(prev => {
                const current = prev.thinkingMode || (prev.deepThinkEnabled ? 'deep' : 'none');
                const next: ThinkingMode =
                  current === 'none' ? 'basic' :
                  current === 'basic' ? 'deep' :
                  current === 'deep' ? 'ultra' : 'none';
                return {
                  ...prev,
                  thinkingMode: next,
                  deepThinkEnabled: next === 'deep' || next === 'ultra',
                };
              });
            }}
            onChangeThinkingMode={(mode: ThinkingMode) => {
              setSettings(prev => ({
                ...prev,
                thinkingMode: mode,
                deepThinkEnabled: mode === 'deep' || mode === 'ultra',
              }));
            }}
            webSearch={settings.webSearchEnabled}
            onToggleWebSearch={() => {
              setSettings(prev => {
                const isCreator = isStrictCreator(currentUser);
                if (isCreator) {
                  // Creator exclusive cycle: Off -> Fast -> Standard -> Mega -> Off
                  if (!prev.webSearchEnabled) {
                    return { ...prev, webSearchEnabled: true, searchMode: 'fast' };
                  } else if (prev.searchMode === 'fast') {
                    return { ...prev, webSearchEnabled: true, searchMode: 'standard' };
                  } else if (prev.searchMode === 'standard') {
                    return { ...prev, webSearchEnabled: true, searchMode: 'mega' };
                  } else {
                    return { ...prev, webSearchEnabled: false, searchMode: 'fast' };
                  }
                } else {
                  // Regular user cycle: Off -> Fast -> Standard -> Off
                  if (!prev.webSearchEnabled) {
                    return { ...prev, webSearchEnabled: true, searchMode: 'fast' };
                  } else if (prev.searchMode === 'fast') {
                    return { ...prev, webSearchEnabled: true, searchMode: 'standard' };
                  } else {
                    return { ...prev, webSearchEnabled: false, searchMode: 'fast' };
                  }
                }
              });
            }}
            onSelectSearchMode={(mode: SearchMode) => {
              setSettings(prev => ({
                ...prev,
                webSearchEnabled: true,
                searchMode: mode
              }));
            }}
            onSelectModel={(model: ModelOption) => {
              setCurrentModel(model);
            }}
            searchMode={settings.searchMode || 'standard'}
            isCreator={isStrictCreator(currentUser)}
            infiniteOutput={Boolean(isStrictCreator(currentUser) && settings.infiniteOutputEnabled)}
            onToggleInfiniteOutput={() => setSettings(s => ({ ...s, infiniteOutputEnabled: !s.infiniteOutputEnabled }))}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
            userCredits={getUserCredits(currentUser)}
            onOpenCredits={handleOpenCredits}
          />
        </div>

        {/* Nixima Canvas Studio Drawer / Split Pane */}
        {isCanvasOpen && activeArtifact && (
          <div className={`h-full min-w-0 transition-all duration-200 ${
            isCanvasMaximized ? 'w-full flex-1 z-50' : 'w-full lg:w-1/2 xl:w-[52%]'
          }`}>
            <NiximaCanvas
              artifact={activeArtifact}
              onClose={handleCloseCanvas}
              onUpdateArtifactContent={handleUpdateArtifactContent}
              onSelectVersion={handleSelectArtifactVersion}
              onActionPrompt={handleSendMessage}
              isMaximized={isCanvasMaximized}
              onToggleMaximize={() => setIsCanvasMaximized(!isCanvasMaximized)}
            />
          </div>
        )}
      </div>
    </div>

      {/* Expanded Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => {
          setSettings(s => {
            const next = { ...s, ...updated };
            if (currentUser) {
              localStorage.setItem(getSettingsKey(currentUser.id), JSON.stringify(next));
            }
            if (updated.openRouterApiKey !== undefined) {
              localStorage.setItem('nixima_openrouter_key', updated.openRouterApiKey.trim());
            }
            return next;
          });
        }}
        onClearAllChats={handleClearAllChats}
        conversations={conversations}
        onImportConversations={handleImportConversations}
        currentUser={currentUser}
        onLogout={handleLogout}
        initialTab={settingsTab}
        onUserUpdated={(updated) => setCurrentUser(updated)}
        onPreviewVipWelcome={(target = 'warexxq') => {
          setPreviewTarget(target);
          setIsVipPreview(true);
          setIsVipModalOpen(true);
        }}
      />

      {/* Company Overview Modal */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

      {/* VIP Welcome Presentation Modal */}
      <VipWelcomeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        user={
          isVipPreview
            ? (previewTarget === 'roman1980'
                ? ({ id: 'usr-vip-roman1980', name: 'roman1980', handle: 'roman1980', email: 'roman1980@nixima.ai', isVip: true, credits: 999999999, unlimitedCredits: true, preferredLanguage: 'uk' } as NiximaUser)
                : ({ id: 'usr-vip-warexxq', name: 'warexxq', handle: 'warexxq', email: 'warexxq@nixima.ai', isVip: true, credits: 999999999, unlimitedCredits: true } as NiximaUser))
            : currentUser
        }
        isPreview={isVipPreview}
      />

      {/* Official Benchmarks & Leaderboard Modal */}
      <BenchmarksModal
        isOpen={isBenchmarksOpen}
        onClose={() => setIsBenchmarksOpen(false)}
        onSelectModel={(model) => setCurrentModel(model)}
      />

      {/* Nixima 0.2 Generation Release Briefing Modal */}
      <ReleaseAnnouncementModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        currentModel={currentModel}
        onSelectModel={(model) => setCurrentModel(model)}
        onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
