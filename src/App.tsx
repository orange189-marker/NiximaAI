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
import { NiximaCodeStudio } from './components/NiximaCodeStudio';
import { NiximaTranslatorStudio } from './components/NiximaTranslatorStudio';
import { Conversation, Message, ModelOption, UserSettings, MessageTelemetry, SearchMode, ThinkingMode, NiximaArtifact, SearchGrounding, CanvasCodeContext, NiximaProduct } from './types/chat';
import { NiximaUser } from './types/user';
import { NIXIMA_MODELS, DEFAULT_MODEL } from './data/models';
import { INITIAL_CONVERSATIONS } from './data/initialChats';
import { streamOpenRouterChat, fetchLiveWebGrounding, generateDefaultGrounding, cleanUserSearchQuery } from './utils/openrouter';
import { parseSearchToolCall } from './utils/toolParser';
import { extractArtifactsFromMessage } from './utils/artifactDetector';
import { playTypingTick, playCompletionChime } from './utils/sound';
import { getActiveUser, logoutUser, syncAccountsWithServer, isDadAccount, isStrictCreator } from './utils/auth';
import { getSavedHotkey, matchesHotkey } from './utils/hotkeys';
import { buildNiximaSystemPrompt, formatCanvasDirectivePrompt } from './utils/promptContext';
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

export { 
  shouldOmniSearch, 
  getOmniThinkingDecision, 
  shouldOmniThink, 
  isOmniModel, 
  resolveOmniToolExecution 
} from './utils/omniTools';
import { isOmniModel, resolveOmniToolExecution } from './utils/omniTools';

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

  // 2.5 Active Product ('chat' | 'code' | 'translator')
  const [activeProduct, setActiveProduct] = useState<NiximaProduct>(() => {
    const savedProd = localStorage.getItem('nixima_active_product_v1');
    return (savedProd === 'code' || savedProd === 'chat' || savedProd === 'translator') ? savedProd : 'chat';
  });

  useEffect(() => {
    localStorage.setItem('nixima_active_product_v1', activeProduct);
  }, [activeProduct]);

  // 3. Active Model
  const [currentModel, setCurrentModel] = useState<ModelOption>(() => {
    const savedProd = localStorage.getItem('nixima_active_product_v1');
    if (savedProd === 'code') {
      const coder = NIXIMA_MODELS.find(m => m.id === 'nixima-0.3-coder');
      if (coder) return coder;
    }
    if (savedProd === 'translator') {
      const omni = NIXIMA_MODELS.find(m => m.id === 'nixima-0.4');
      if (omni) return omni;
    }
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
    const savedProd = localStorage.getItem('nixima_active_product_v1');
    if (conversations.length > 0) {
      const match = conversations.find(c => {
        if (savedProd === 'code') return c.product === 'code';
        if (savedProd === 'translator') return c.product === 'translator';
        return !c.product || c.product === 'chat';
      });
      if (match) return match.id;
      return conversations[0].id;
    }
    return savedProd === 'code' ? 'code-initial' : savedProd === 'translator' ? 'translate-initial' : 'new-chat';
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
  const [recentlyCompletedConvIds, setRecentlyCompletedConvIds] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 8. Nixima Canvas & Artifacts Workspace state
  const [activeArtifact, setActiveArtifact] = useState<NiximaArtifact | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isCanvasMaximized, setIsCanvasMaximized] = useState(false);
  const [isCanvasContextLinked, setIsCanvasContextLinked] = useState(true);

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

  // Centralized model selection handler: auto-arms thinking and search modes for specialized engines
  const handleSelectModel = (model: ModelOption, options?: { fromTab?: string }) => {
    setCurrentModel(model);

    // Auto-arm Thinking engine for thinking-focused models
    if (model.id === 'nixima-0.3-pro' || model.id === 'nixima-0.2-pro') {
      setSettings(prev => ({
        ...prev,
        thinkingMode: 'ultra',
        deepThinkEnabled: true,
      }));
    } else if (model.id === 'nixima-0.3-coder') {
      setSettings(prev => ({
        ...prev,
        thinkingMode: 'deep',
        deepThinkEnabled: true,
      }));
    } else if (isOmniModel(model)) {
      setSettings(prev => ({
        ...prev,
        thinkingMode: prev.thinkingMode === 'none' ? 'deep' : prev.thinkingMode,
        deepThinkEnabled: true,
      }));
    } else if (options?.fromTab === 'thinking') {
      setSettings(prev => ({
        ...prev,
        thinkingMode: 'deep',
        deepThinkEnabled: true,
      }));
    }

    // Auto-arm Search engine if selected from search tab or for hyperflash search engine
    if (options?.fromTab === 'search' || model.id === 'nixima-0.3-flash') {
      setSettings(prev => ({
        ...prev,
        webSearchEnabled: true,
        searchMode: model.searchOptimization?.recommendedMode || 'fast',
      }));
    }
  };

  const activeConversation = conversations.find(c => c.id === activeId);

  // Scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeId]);

  // Handler: Switch Product (Nixima Chat vs Nixima Code vs Nixima Translator)
  const handleSelectProduct = (prod: NiximaProduct) => {
    setActiveProduct(prod);
    if (prod === 'code') {
      const coderModel = NIXIMA_MODELS.find(m => m.id === 'nixima-0.3-coder') || currentModel;
      setCurrentModel(coderModel);
      setSettings(prev => ({
        ...prev,
        thinkingMode: 'deep',
        deepThinkEnabled: true,
      }));

      const existingCodeConv = conversations.find(c => c.product === 'code');
      if (existingCodeConv) {
        setActiveId(existingCodeConv.id);
      } else {
        const newId = 'code-' + Date.now();
        const newConv: Conversation = {
          id: newId,
          title: language === 'uk' ? 'Новий код-проєкт' : 'New Code Project',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: 'nixima-0.3-coder',
          product: 'code',
          pinned: false,
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveId(newId);
      }
    } else if (prod === 'translator') {
      const omniModel = NIXIMA_MODELS.find(m => m.id === 'nixima-0.4') || currentModel;
      setCurrentModel(omniModel);
      const existingTranslateConv = conversations.find(c => c.product === 'translator');
      if (existingTranslateConv) {
        setActiveId(existingTranslateConv.id);
      } else {
        const newId = 'translate-' + Date.now();
        const newConv: Conversation = {
          id: newId,
          title: language === 'uk' ? 'Новий переклад' : 'New Translation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: omniModel.id,
          product: 'translator',
          pinned: false,
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveId(newId);
      }
    } else {
      const existingChatConv = conversations.find(c => !c.product || c.product === 'chat');
      if (existingChatConv) {
        setActiveId(existingChatConv.id);
        if (existingChatConv.modelId) {
          const match = NIXIMA_MODELS.find(m => m.id === existingChatConv.modelId);
          if (match) setCurrentModel(match);
        }
      } else {
        const newId = 'chat-' + Date.now();
        const newConv: Conversation = {
          id: newId,
          title: t.sidebar.newChatButton,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: currentModel.id,
          product: 'chat',
          pinned: false,
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveId(newId);
      }
    }
  };

  // Handler: New Code Project
  const handleNewCodeProject = () => {
    const newId = 'code-' + Date.now();
    const coderModel = NIXIMA_MODELS.find(m => m.id === 'nixima-0.3-coder') || currentModel;
    const newConv: Conversation = {
      id: newId,
      title: language === 'uk' ? 'Новий код-проєкт' : 'New Code Project',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: 'nixima-0.3-coder',
      product: 'code',
      pinned: false,
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newId);
    setCurrentModel(coderModel);
    setSettings(prev => ({
      ...prev,
      thinkingMode: 'deep',
      deepThinkEnabled: true,
    }));
  };

  // Handler: New Translation
  const handleNewTranslation = () => {
    const newId = 'translate-' + Date.now();
    const omniModel = NIXIMA_MODELS.find(m => m.id === 'nixima-0.4') || currentModel;
    const newConv: Conversation = {
      id: newId,
      title: language === 'uk' ? 'Новий переклад' : 'New Translation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: omniModel.id,
      product: 'translator',
      pinned: false,
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newId);
    setCurrentModel(omniModel);
  };

  // Handler: Send Code Prompt from Nixima Code Studio
  const handleSendCodePrompt = (
    promptText: string,
    codeContext?: string,
    options?: { taskType?: string; language?: string }
  ) => {
    let finalPrompt = promptText;
    if (codeContext && codeContext.trim()) {
      const lang = options?.language || 'typescript';
      const taskLabel = (options?.taskType || 'generate').toUpperCase();
      finalPrompt = `[ATTACHED CODE CONTEXT - ${lang.toUpperCase()}]\n\`\`\`${lang}\n${codeContext.trim()}\n\`\`\`\n\n[TASK DIRECTIVE: ${taskLabel}]\n${promptText}`;
    } else if (options?.taskType && options.taskType !== 'generate') {
      const lang = options.language ? ` [LANGUAGE: ${options.language}]` : '';
      finalPrompt = `[TASK: ${options.taskType.toUpperCase()}${lang}]\n${promptText}`;
    }

    if (activeConversation && !activeConversation.product) {
      setConversations(prev => prev.map(c =>
        c.id === activeConversation.id ? { ...c, product: 'code', modelId: 'nixima-0.3-coder' } : c
      ));
    }

    handleSendMessage(finalPrompt);
  };

  // Handler: New Chat
  const handleNewChat = () => {
    if (activeProduct === 'code') {
      handleNewCodeProject();
      return;
    }
    if (activeProduct === 'translator') {
      handleNewTranslation();
      return;
    }
    const newId = 'chat-' + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: t.sidebar.newChatButton,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentModel.id,
      product: 'chat',
      pinned: false,
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newId);
  };

  // Handler: Delete Chat
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== id);
      const remainingInProduct = remaining.filter(c => {
        if (activeProduct === 'code') return c.product === 'code';
        if (activeProduct === 'translator') return c.product === 'translator';
        return !c.product || c.product === 'chat';
      });

      if (remainingInProduct.length === 0) {
        const isCode = activeProduct === 'code';
        const isTrans = activeProduct === 'translator';
        const freshId = (isCode ? 'code-' : isTrans ? 'translate-' : 'chat-') + Date.now();
        const freshConv: Conversation = {
          id: freshId,
          title: isCode 
            ? (language === 'uk' ? 'Новий код-проєкт' : 'New Code Project')
            : isTrans
            ? (language === 'uk' ? 'Новий переклад' : 'New Translation')
            : t.sidebar.newChatButton,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: isCode ? 'nixima-0.3-coder' : isTrans ? (NIXIMA_MODELS.find(m => m.id === 'nixima-0.4')?.id || currentModel.id) : currentModel.id,
          product: activeProduct,
          pinned: false,
        };
        setActiveId(freshId);
        return [freshConv, ...remaining];
      }
      if (activeId === id) {
        setActiveId(remainingInProduct[0].id);
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
      product: activeConversation.product || activeProduct,
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
    const isCode = activeProduct === 'code';
    const freshId = (isCode ? 'code-' : 'chat-') + Date.now();
    const freshConv: Conversation = {
      id: freshId,
      title: isCode ? (language === 'uk' ? 'Новий код-проєкт' : 'New Code Project') : t.sidebar.newChatButton,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: isCode ? 'nixima-0.3-coder' : currentModel.id,
      product: isCode ? 'code' : 'chat',
      pinned: false,
    };
    setConversations(prev => [freshConv, ...prev.filter(c => isCode ? c.product !== 'code' : c.product === 'code')]);
    setActiveId(freshId);
  };

  // Handler: Send Message with Real OpenRouter Streaming & Live Canvas Context
  const handleSendMessage = async (
    userText: string,
    canvasContextOrAttachFlag?: CanvasCodeContext | boolean
  ) => {
    if (!userText.trim() || isLoading) return;

    if (!hasSufficientCredits(currentUser, currentModel)) {
      handleOpenCredits();
      return;
    }

    // Determine effective canvas code context (from direct directive or linked active artifact)
    const effectiveCanvasContext: CanvasCodeContext | undefined = (typeof canvasContextOrAttachFlag === 'object' && canvasContextOrAttachFlag !== null)
      ? canvasContextOrAttachFlag
      : (canvasContextOrAttachFlag === true || (canvasContextOrAttachFlag === undefined && isCanvasOpen && activeArtifact && isCanvasContextLinked))
      ? (activeArtifact ? {
          artifactId: activeArtifact.id,
          title: activeArtifact.title,
          type: activeArtifact.type,
          language: activeArtifact.language,
          version: activeArtifact.currentVersion || 1,
          currentCode: activeArtifact.content,
        } : undefined)
      : undefined;

    let targetConvId = activeId;
    let currentConv = conversations.find(c => c.id === targetConvId);

    if (!currentConv) {
      targetConvId = (activeProduct === 'code' ? 'code-' : 'chat-') + Date.now();
      currentConv = {
        id: targetConvId,
        title: userText.slice(0, 32),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: activeProduct === 'code' ? 'nixima-0.3-coder' : currentModel.id,
        product: activeProduct,
        pinned: false,
      };
      setConversations(prev => [currentConv!, ...prev]);
      setActiveId(targetConvId);
    } else if (activeProduct === 'code' && currentConv.product !== 'code') {
      currentConv = {
        ...currentConv,
        product: 'code',
        modelId: 'nixima-0.3-coder',
      };
      setConversations(prev => prev.map(c => c.id === targetConvId ? currentConv! : c));
    }

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: userText,
      canvasContext: effectiveCanvasContext,
      timestamp: Date.now(),
    };

    const isFirstMessage = currentConv.messages.length === 0;
    const newTitle = isFirstMessage ? (userText.length > 28 ? userText.slice(0, 28) + '...' : userText) : currentConv.title;

    const aiMessageId = 'ai-' + Date.now();
    const isOmni = isOmniModel(currentModel);

    // Resolve Dual-Tool Execution: For Nixima-0.4 Omni, both Tool 1 (Search V3.1) and Tool 2 (DeepThinking) are autonomously evaluated
    const is04 = (currentModel.id === 'nixima-0.4' || currentModel.generation === '0.4') && currentModel.id !== 'nixima-0.4e';

    const {
      runWebSearch: shouldRunWebSearch,
      effectiveThinkingMode,
      isDeepThink: effectiveDeepThink,
      isThinkingActive,
      isDualToolActive,
    } = resolveOmniToolExecution({
      query: userText,
      isOmni,
      is04,
      modelId: currentModel.id,
      userWebSearch: is04 ? false : settings.webSearchEnabled,
      userThinkingMode: is04 ? undefined : settings.thinkingMode,
      userDeepThink: is04 ? false : settings.deepThinkEnabled,
      searchMode: settings.searchMode || 'standard',
    });

    const initialGrounding: SearchGrounding | undefined = shouldRunWebSearch
      ? {
          query: userText,
          sources: [],
          searchMode: settings.searchMode || 'standard',
          searchVersion: 'v3.1',
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
      thinkingMode: isThinkingActive ? effectiveThinkingMode : undefined,
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

      // Nixima Code Studio AI Coding Assistant Specialization Protocol
      if (activeProduct === 'code' || currentConv.product === 'code') {
        dynamicSystemPrompt += `\n\n[NIXIMA CODE: AI CODING ASSISTANT PROTOCOL - ZERO THINKING LAZINESS ACTIVE]\n` +
          `You are Nixima Code, an elite frontier AI software architect and coding assistant powered exclusively by the Nixima-0.3 Coder Titan engine.\n` +
          `MANDATORY CODING SPECIFICATIONS:\n` +
          `1. ZERO LAZINESS: Never truncate code. Never write "// ... rest of code remains the same" or "// implement logic here". Provide full, complete, copy-paste ready implementations.\n` +
          `2. ARCHITECTURAL QUALITY: Provide idiomatic code with robust error boundaries, strict types, edge case handling, and optimal time/space complexity.\n` +
          `3. RUNNABLE ARTIFACTS: When delivering complete web applications, interactive games, or full-stack components, enclose them in complete single-file code blocks (e.g. \`\`\`html for Canvas games, \`\`\`tsx for React) so the user can immediately test them live in Nixima Canvas Studio.\n` +
          `4. DEEPTHINKING V3.0 VERIFICATION: Verify mathematical and algorithmic bounds, AST integrity, and syntax before generating response.`;
      }

      // Prepare base user prompt, pairing with live Canvas code context if present
      const basePrompt = effectiveCanvasContext
        ? formatCanvasDirectivePrompt(userText, effectiveCanvasContext)
        : userText;

      let finalUserPrompt = basePrompt;
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
            `\n\n[USER INQUIRY]\n${basePrompt}\n\n` +
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
            `[SEARCH V3.1 REAL-TIME GROUNDED WEB FINDINGS — ${liveGrounding.sources.length} WEBSITES CRAWLED]\n` +
            liveGrounding.sources.map((src, i) =>
              `[Source ${i + 1}] ${src.title} (${src.domain})\nURL: ${src.url}\nSummary: ${src.snippet || 'Authoritative reference'}`
            ).join('\n\n') +
            `\n\n[USER INQUIRY]\n${basePrompt}\n\n` +
            `(MANDATORY TEMPORAL INSTRUCTION: Answer using the verified real-world findings above. Do NOT claim a 2023 knowledge cutoff. Cite sources [1], [2] where appropriate.)`;
        }
      }

      historyForApi = [
        ...currentConv.messages
          .filter(m => m.content && m.content.trim().length > 0)
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content.trim() })),
        { role: 'user', content: finalUserPrompt }
      ];

      let { fullContent, fullThinking, searchGrounding, deepThinkingTelemetry } = await streamOpenRouterChat({
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

      // Search V3.1 Autonomous Tool Call Interceptor & Hotfix
      const toolCall = parseSearchToolCall(fullContent);
      if (toolCall.isToolCall && toolCall.query) {
        console.log(`[Nixima Search V3.1] Autonomous search tool call intercepted: "${toolCall.query}". Executing live web grounding...`);
        try {
          searchGrounding = await fetchLiveWebGrounding(toolCall.query, language, settings.searchMode || 'standard');
        } catch {
          searchGrounding = generateDefaultGrounding(toolCall.query, settings.searchMode || 'standard');
        }

        const synthesized = generateNiximaResponse({
          prompt: toolCall.query,
          model: currentModel,
          deepThink: effectiveDeepThink,
          thinkingMode: effectiveThinkingMode,
          webSearch: true,
          searchMode: settings.searchMode || 'standard',
          history: historyForApi
        });

        fullContent = synthesized.response;
        if (!fullThinking && synthesized.thinking) {
          fullThinking = synthesized.thinking;
        }
        if (synthesized.deepThinkingTelemetry) {
          deepThinkingTelemetry = synthesized.deepThinkingTelemetry;
        }
      }

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            updatedAt: Date.now(),
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

      setRecentlyCompletedConvIds(prev => ({
        ...prev,
        [targetConvId]: Date.now()
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
                updatedAt: Date.now(),
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

          setRecentlyCompletedConvIds(prev => ({
            ...prev,
            [targetConvId]: Date.now()
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
        activeProduct={activeProduct}
        onSelectProduct={handleSelectProduct}
        onNewCodeProject={handleNewCodeProject}
        onNewTranslation={handleNewTranslation}
        isLoading={isLoading}
        activeGeneratingId={isLoading ? activeId : undefined}
        recentlyCompletedConvIds={recentlyCompletedConvIds}
      />

      {/* Main Content Area: Global Header + Split-Screen Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Global Application Header */}
        <Header
          currentModel={currentModel}
          onSelectModel={handleSelectModel}
          onOpenSettings={() => handleOpenSettings('general')}
          onOpenCompanyInfo={() => setIsCompanyModalOpen(true)}
          onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
          onOpenReleaseModal={() => setIsReleaseModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onNewChat={activeProduct === 'code' ? handleNewCodeProject : activeProduct === 'translator' ? handleNewTranslation : handleNewChat}
          credits={getUserCredits(currentUser)}
          onOpenCredits={handleOpenCredits}
          webSearchEnabled={settings.webSearchEnabled}
          searchMode={settings.searchMode || 'standard'}
          activeProduct={activeProduct}
        />

        {/* Workspace Area: Chat / Nixima Code Studio + Nixima Canvas Split Screen */}
        <div className="flex-1 flex overflow-hidden min-w-0 relative h-full">
          {/* Main Column: Nixima Code Studio, Nixima Translator Studio, or Nixima Chat */}
          {activeProduct === 'code' ? (
            <div className={`flex flex-col h-full min-w-0 relative transition-all duration-200 ${isPureBlack ? 'bg-black' : 'bg-[#09090b]'} ${
              isCanvasOpen && !isCanvasMaximized
                ? 'hidden lg:flex lg:w-1/2 xl:w-[48%] border-r border-zinc-800/80'
                : isCanvasMaximized
                ? 'hidden'
                : 'w-full flex-1'
            }`}>
              <NiximaCodeStudio
                conversation={
                  (activeConversation && activeConversation.product === 'code')
                    ? activeConversation
                    : conversations.find(c => c.product === 'code') || {
                        id: activeId || 'code-' + Date.now(),
                        title: language === 'uk' ? 'Новий код-проєкт' : 'New Code Project',
                        messages: [],
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        modelId: 'nixima-0.3-coder',
                        product: 'code',
                      }
                }
                onSendPrompt={handleSendCodePrompt}
                isLoading={isLoading}
                onStopGeneration={handleStopGeneration}
                onRegenerate={handleRegenerate}
                onOpenArtifact={handleOpenArtifact}
                currentModel={currentModel}
                userCredits={getUserCredits(currentUser)}
                activeCanvasArtifact={isCanvasOpen && activeArtifact ? {
                  title: activeArtifact.title,
                  version: activeArtifact.currentVersion || 1,
                  language: activeArtifact.language,
                  lineCount: activeArtifact.content.split('\n').length,
                  content: activeArtifact.content,
                } : null}
                onNewProject={handleNewCodeProject}
                onToggleCanvas={() => setIsCanvasOpen(prev => !prev)}
                isCanvasOpen={isCanvasOpen}
              />
            </div>
          ) : activeProduct === 'translator' ? (
            <div className={`flex flex-col h-full min-w-0 relative transition-all duration-200 ${isPureBlack ? 'bg-black' : 'bg-[#09090b]'} w-full flex-1`}>
              <NiximaTranslatorStudio
                currentModel={currentModel}
                onSelectModel={handleSelectModel}
                userCredits={getUserCredits(currentUser)}
                apiKey={settings.openRouterApiKey}
              />
            </div>
          ) : (
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
                    onSelectModel={handleSelectModel}
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
                  handleSelectModel(model);
                }}
                searchMode={settings.searchMode || 'standard'}
                isCreator={isStrictCreator(currentUser)}
                infiniteOutput={Boolean(isStrictCreator(currentUser) && settings.infiniteOutputEnabled)}
                onToggleInfiniteOutput={() => setSettings(s => ({ ...s, infiniteOutputEnabled: !s.infiniteOutputEnabled }))}
                soundEnabled={settings.soundEnabled}
                onToggleSound={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                userCredits={getUserCredits(currentUser)}
                onOpenCredits={handleOpenCredits}
                activeCanvasArtifact={isCanvasOpen && activeArtifact ? {
                  title: activeArtifact.title,
                  version: activeArtifact.currentVersion || 1,
                  language: activeArtifact.language,
                  lineCount: activeArtifact.content.split('\n').length,
                } : null}
                isCanvasContextLinked={isCanvasContextLinked}
                onToggleCanvasContext={() => setIsCanvasContextLinked(prev => !prev)}
              />
            </div>
          )}

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
        onSelectModel={(model) => {
          if (activeProduct === 'code') {
            setActiveProduct('chat');
          }
          handleSelectModel(model);
        }}
      />

      {/* Nixima 0.2 Generation Release Briefing Modal */}
      <ReleaseAnnouncementModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        currentModel={currentModel}
        onSelectModel={(model) => {
          if (activeProduct === 'code') {
            setActiveProduct('chat');
          }
          handleSelectModel(model);
        }}
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
