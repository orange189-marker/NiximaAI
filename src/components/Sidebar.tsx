import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { Conversation } from '../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onOpenSettings: () => void;
  onOpenCompanyInfo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onClose,
  userName,
  onOpenSettings,
  onOpenCompanyInfo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [conversations, searchQuery]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0d10] border-r border-[#27272a] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden'
        }`}
      >
        {/* Top bar: Brand & Close (mobile) */}
        <div className="p-3 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded bg-white text-black font-black text-xs flex items-center justify-center font-mono">
              N
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-200">
              Conversations
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action button: New Chat */}
        <div className="p-3 space-y-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all duration-150 shadow-glow-subtle group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New conversation</span>
            </div>
            <span className="text-[10px] font-mono bg-black/10 px-1.5 py-0.5 rounded text-black font-medium">
              Ctrl+N
            </span>
          </button>

          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-zinc-500">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all text-xs ${
                    isActive
                      ? 'bg-zinc-800/90 text-white font-medium border border-zinc-700/80 shadow-inner-light'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                    <span className="truncate">
                      {conv.title || 'Untitled Conversation'}
                    </span>
                  </div>

                  {/* Actions on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom user & company footer */}
        <div className="p-3 border-t border-[#27272a] bg-[#09090b]/60 space-y-2">
          <div 
            onClick={onOpenSettings}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-200 leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Nixima Pro Plan
                </span>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
          </div>

          <button
            onClick={onOpenCompanyInfo}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              Nixima AI Research
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </aside>
    </>
  );
};
