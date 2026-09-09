import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyChat } from './components/EmptyChat';
import { SettingsModal } from './components/SettingsModal';
import { CompanyModal } from './components/CompanyModal';
import { Conversation, Message, ModelOption, UserSettings } from './types/chat';
import { NIXIMA_MODELS, DEFAULT_MODEL } from './data/models';
import { INITIAL_CONVERSATIONS } from './data/initialChats';
import { generateNiximaResponse } from './utils/aiResponse';

const STORAGE_KEY_CONVS = 'nixima_conversations_v1';
const STORAGE_KEY_SETTINGS = 'nixima_settings_v1';
const STORAGE_KEY_MODEL = 'nixima_active_model_v1';

export const App: React.FC = () => {
  // 1. Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      userName: 'Bogdan',
      temperature: 0.7,
      systemPrompt: 'You are Nixima AI, a cutting-edge synthetic intelligence built on Nixima-0.1.',
      deepThinkEnabled: false,
      webSearchEnabled: false,
      streamResponse: true,
    };
  });

  // 2. Active Model (defaults to Nixima-0.1)
  const [currentModel, setCurrentModel] = useState<ModelOption>(() => {
    const savedModelId = localStorage.getItem(STORAGE_KEY_MODEL);
    if (savedModelId) {
      const match = NIXIMA_MODELS.find(m => m.id === savedModelId);
      if (match) return match;
    }
    return DEFAULT_MODEL; // Nixima-0.1
  });

  // 3. Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONVS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CONVERSATIONS;
  });

  // 4. Active conversation ID
  const [activeId, setActiveId] = useState<string>(() => {
    if (conversations.length > 0) return conversations[0].id;
    return 'new-chat';
  });

  // 5. Sidebar and Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // 6. Streaming & generation state
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<boolean>(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODEL, currentModel.id);
  }, [currentModel]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId);

  // Scroll to bottom when messages update
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
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentModel.id,
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
          title: 'New conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: currentModel.id,
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

  // Handler: Clear All
  const handleClearAllChats = () => {
    const freshId = 'chat-' + Date.now();
    const freshConv: Conversation = {
      id: freshId,
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentModel.id,
    };
    setConversations([freshConv]);
    setActiveId(freshId);
  };

  // Handler: Send Message
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    let targetConvId = activeId;
    let currentConv = conversations.find(c => c.id === targetConvId);

    // If conversation doesn't exist yet, create it
    if (!currentConv) {
      targetConvId = 'chat-' + Date.now();
      currentConv = {
        id: targetConvId,
        title: userText.slice(0, 32),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: currentModel.id,
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

    // Auto title if first message
    const isFirstMessage = currentConv.messages.length === 0;
    const newTitle = isFirstMessage ? (userText.length > 28 ? userText.slice(0, 28) + '...' : userText) : currentConv.title;

    // AI message placeholder
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

    // Update state with user message and placeholder
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
    abortControllerRef.current = false;
    setTimeout(() => scrollToBottom(), 50);

    // Generate response
    const generated = generateNiximaResponse({
      prompt: userText,
      model: currentModel,
      deepThink: settings.deepThinkEnabled,
      history: currentConv.messages.map(m => ({ role: m.role, content: m.content }))
    });

    // Simulate streaming
    const fullContent = generated.response;
    const fullThinking = generated.thinking;
    let streamIndex = 0;
    const chunkSize = 3;

    // First assign thinking trace
    setConversations(prev => prev.map(c => {
      if (c.id === targetConvId) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === aiMessageId ? { ...m, thinking: fullThinking } : m)
        };
      }
      return c;
    }));

    const streamInterval = setInterval(() => {
      if (abortControllerRef.current) {
        clearInterval(streamInterval);
        setIsLoading(false);
        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMessageId ? { ...m, isStreaming: false } : m)
            };
          }
          return c;
        }));
        return;
      }

      streamIndex += chunkSize;
      const currentChunk = fullContent.slice(0, streamIndex);

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: currentChunk } : m)
          };
        }
        return c;
      }));

      scrollToBottom();

      if (streamIndex >= fullContent.length) {
        clearInterval(streamInterval);
        setIsLoading(false);
        setConversations(prev => prev.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: fullContent, isStreaming: false } : m)
            };
          }
          return c;
        }));
      }
    }, 20);
  };

  const handleStopGeneration = () => {
    abortControllerRef.current = true;
    setIsLoading(false);
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length < 2) return;
    const lastUserMessage = [...activeConversation.messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-[#f4f4f5] overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={setActiveId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={settings.userName}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCompanyInfo={() => setIsCompanyModalOpen(true)}
      />

      {/* Main Chat Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#09090b] relative">
        {/* Header with Model Selector */}
        <Header
          currentModel={currentModel}
          onSelectModel={setCurrentModel}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCompanyInfo={() => setIsCompanyModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
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
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => setSettings(s => ({ ...s, ...updated }))}
        onClearAllChats={handleClearAllChats}
      />

      {/* Company Overview Modal */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
};

export default App;
