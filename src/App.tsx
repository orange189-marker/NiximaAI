import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyChat } from './components/EmptyChat';
import { SettingsModal, SettingsTab } from './components/SettingsModal';
import { CompanyModal } from './components/CompanyModal';
import { VipWelcomeModal } from './components/VipWelcomeModal';
import { AuthPortal } from './components/AuthPortal';
import { Conversation, Message, ModelOption, UserSettings, MessageTelemetry } from './types/chat';
import { NiximaUser } from './types/user';
import { NIXIMA_MODELS, DEFAULT_MODEL } from './data/models';
import { INITIAL_CONVERSATIONS } from './data/initialChats';
import { streamOpenRouterChat } from './utils/openrouter';
import { playTypingTick, playCompletionChime } from './utils/sound';
import { getActiveUser, logoutUser, syncAccountsWithServer } from './utils/auth';
import { getSavedHotkey, matchesHotkey } from './utils/hotkeys';
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
    if (active) {
      const saved = localStorage.getItem(getSettingsKey(active.id));
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
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

  // VIP Welcome letter & presentation check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview_vip') === 'true' || params.get('vip_preview') === 'true') {
      setIsVipPreview(true);
      setIsVipModalOpen(true);
      return;
    }

    if (currentUser && isVipAccount(currentUser)) {
      const seenKey = `nixima_vip_welcome_seen_${currentUser.id}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        setIsVipPreview(false);
        setIsVipModalOpen(true);
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

  // Load user data on authentication change
  const handleAuthenticated = (user: NiximaUser) => {
    setCurrentUser(user);
    if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
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
        modelId: 'nixima-0.1',
        pinned: true,
        messages: [
          {
            id: 'wm-1',
            role: 'assistant',
            content: isUk ? `### Ласкаво просимо до Nixima AI, **${user.name}**!

Вашу суверенну ідентичність Nixima успішно активовано:
- **Nixima Email**: \`${user.email}\`
- **Роль**: \`${user.role}\`
- **Нейрорушій**: \`Nixima-0.1\` Активний

Усі діалоги та налаштування моделі в цьому робочому просторі є приватними та захищеними для вашого Nixima ID. Задайте питання нижче або оберіть підказку для дослідження.` : `### Welcome to Nixima AI, **${user.name}**!

Your Sovereign Nixima Identity has been provisioned:
- **Nixima Email**: \`${user.email}\`
- **Role**: \`${user.role}\`
- **Inference Engine**: \`Nixima-0.1\` Active

All conversations and model preferences in this workspace are private to your Nixima ID. Ask a question below or pick a research prompt to begin.`,
            timestamp: Date.now(),
            model: 'Nixima-0.1',
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
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      thinking: '',
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

    try {
      const historyForApi = [
        ...currentConv.messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userText }
      ];

      const { fullContent, fullThinking } = await streamOpenRouterChat({
        model: currentModel,
        messages: historyForApi,
        systemPrompt: settings.systemPrompt,
        temperature: settings.temperature,
        topP: settings.topP,
        maxTokens: settings.maxTokens,
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
            setConversations(prev => prev.map(c => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map(m => m.id === aiMessageId ? { ...m, thinking: thinkingChunk } : m)
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
        settings.deepThinkEnabled
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

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === aiMessageId ? { 
              ...m, 
              content: fullContent,
              thinking: fullThinking || undefined,
              isStreaming: false,
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
        console.error('OpenRouter streaming error:', err);
        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMessageId ? {
                ...m,
                content: `Error connecting to ${currentModel.name} cluster: ${err.message || 'Check connection'}.`,
                isStreaming: false,
              } : m)
            };
          }
          return c;
        }));
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
      />

      {/* Main Chat Canvas */}
      <div className={`flex-1 flex flex-col h-full min-w-0 relative ${isPureBlack ? 'bg-black' : 'bg-[#09090b]'}`}>
        {/* Header with Model Selector */}
        <Header
          currentModel={currentModel}
          onSelectModel={setCurrentModel}
          onOpenSettings={() => handleOpenSettings('general')}
          onOpenCompanyInfo={() => setIsCompanyModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onNewChat={handleNewChat}
          credits={getUserCredits(currentUser)}
          onOpenCredits={handleOpenCredits}
        />

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto min-w-0 bg-grid-pattern">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <EmptyChat
              currentModel={currentModel}
              onSelectPrompt={handleSendMessage}
            />
          ) : (
            <div className="pb-8">
              {activeConversation.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onRegenerate={msg.role === 'assistant' ? handleRegenerate : undefined}
                  onEditMessage={msg.role === 'user' ? (newContent) => handleEditUserMessage(msg.id, newContent) : undefined}
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
          deepThink={settings.deepThinkEnabled}
          onToggleDeepThink={() => setSettings(s => ({ ...s, deepThinkEnabled: !s.deepThinkEnabled }))}
          webSearch={settings.webSearchEnabled}
          onToggleWebSearch={() => setSettings(s => ({ ...s, webSearchEnabled: !s.webSearchEnabled }))}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
          userCredits={getUserCredits(currentUser)}
          onOpenCredits={handleOpenCredits}
        />
      </div>

      {/* Expanded Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => setSettings(s => ({ ...s, ...updated }))}
        onClearAllChats={handleClearAllChats}
        conversations={conversations}
        onImportConversations={handleImportConversations}
        currentUser={currentUser}
        onLogout={handleLogout}
        initialTab={settingsTab}
        onUserUpdated={(updated) => setCurrentUser(updated)}
        onPreviewVipWelcome={() => {
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
        user={isVipPreview ? (currentUser || { id: 'usr-vip-warexxq', name: 'warexxq', handle: 'warexxq', email: 'warexxq@nixima.ai', isVip: true, credits: 999999999, unlimitedCredits: true } as NiximaUser) : currentUser}
        isPreview={isVipPreview}
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
