import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Pin,
  PinOff,
  Edit2,
  Check,
  Download,
  LogOut,
  Sliders,
  BarChart3
} from 'lucide-react';
import { Conversation } from '../types/chat';
import { NiximaUser } from '../types/user';
import { NiximaIdLogo } from './NiximaIdLogo';
import { getSavedHotkey, HotkeyConfig, HOTKEY_CHANGE_EVENT } from '../utils/hotkeys';
import { HotkeyCustomizerModal } from './HotkeyCustomizerModal';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onTogglePinConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser: NiximaUser | null;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenCompanyInfo: () => void;
  onOpenBenchmarks?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onTogglePinConversation,
  onRenameConversation,
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenSettings,
  onOpenCompanyInfo,
  onOpenBenchmarks,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [hotkeyConfig, setHotkeyConfig] = useState<HotkeyConfig>(() => getSavedHotkey());
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setHotkeyConfig(e.detail);
      } else {
        setHotkeyConfig(getSavedHotkey());
      }
    };
    window.addEventListener(HOTKEY_CHANGE_EVENT, handleUpdate);
    return () => window.removeEventListener(HOTKEY_CHANGE_EVENT, handleUpdate);
  }, []);

  // Start renaming
  const handleStartRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  // Submit rename
  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  // Export single conversation as Markdown
  const handleExportMarkdown = (conv: Conversation) => {
    let md = `# ${conv.title}\n\n*Exported from Nixima AI (Model: ${conv.modelId}) on ${new Date().toLocaleString()}*\n\n---\n\n`;
    conv.messages.forEach(m => {
      const speaker = m.role === 'user' ? '### User' : `### Nixima AI (${m.model || 'Nixima-0.2'})`;
      md += `${speaker}\n\n${m.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${conv.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [conversations, searchQuery]);

  const pinnedConversations = useMemo(() => 
    filteredConversations.filter(c => c.pinned),
    [filteredConversations]
  );

  const regularConversations = useMemo(() => 
    filteredConversations.filter(c => !c.pinned),
    [filteredConversations]
  );

  const renderConversationItem = (conv: Conversation) => {
    const isActive = conv.id === activeConversationId;
    const isEditing = editingId === conv.id;

    return (
      <div
        key={conv.id}
        onClick={() => !isEditing && onSelectConversation(conv.id)}
        className={`group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${
          isActive
            ? 'bg-zinc-800/90 text-white font-medium border border-zinc-700/80 shadow-inner-light'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {conv.pinned ? (
            <Pin className="w-3.5 h-3.5 text-white flex-shrink-0 fill-white" />
          ) : (
            <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
          )}

          {isEditing ? (
            <div className="flex items-center gap-1 flex-1 pr-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(conv.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
                className="w-full bg-zinc-900 text-white px-1.5 py-0.5 rounded text-xs border border-zinc-600 focus:outline-none"
              />
              <button
                onClick={() => handleSaveRename(conv.id)}
                className="p-1 rounded text-zinc-300 hover:text-white"
              >
                <Check className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          ) : (
            <span className="truncate">
              {conv.title || t.sidebar.untitledConversation}
            </span>
          )}
        </div>

        {/* Hover Action buttons */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-1">
            {/* Pin / Unpin */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePinConversation(conv.id);
              }}
              className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
              title={conv.pinned ? t.sidebar.unpinChatTooltip : t.sidebar.pinChatTooltip}
            >
              {conv.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
            </button>

            {/* Rename */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartRename(conv);
              }}
              className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
              title={t.sidebar.renameTooltip}
            >
              <Edit2 className="w-3 h-3" />
            </button>

            {/* Export */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExportMarkdown(conv);
              }}
              className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
              title={t.sidebar.exportMarkdownTooltip}
            >
              <Download className="w-3 h-3" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
              title={t.sidebar.deleteChatTooltip}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

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
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0d10] border-r border-[#27272a] flex flex-col transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden'
        }`}
      >
        {/* Top bar: Brand & Close */}
        <div className="p-3 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2 px-1">
            <NiximaIdLogo size={18} glow={false} />
            <span className="text-sm font-semibold tracking-tight text-zinc-200 font-mono">
              {t.sidebar.conversationsTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 lg:hidden transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action button: New Chat */}
        <div className="p-3 space-y-2.5">
          <div className="relative group">
            {/* Ambient Radiant Glow Aura on Hover */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 pointer-events-none" />

            <button
              onClick={onNewChat}
              className="relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-white via-zinc-100 to-zinc-200 hover:from-white hover:to-white text-black font-semibold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.35)] active:scale-[0.98] cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                {/* High-tech rotating plus tile */}
                <div className="w-6 h-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center border border-zinc-800 shadow-sm transition-transform duration-300 group-hover:rotate-90 group-hover:scale-105">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="font-bold text-xs tracking-tight text-zinc-950 font-sans">
                  {t.sidebar.newChatButton}
                </span>
              </div>

              {/* Tactile Keycap or Adaptive Touch Badge with Quick Customizer */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHotkeyModalOpen(true);
                }}
                title={`Hotkey: ${hotkeyConfig.label} (Click to customize for Windows/Mac/Mobile)`}
                className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-zinc-950/10 hover:bg-zinc-950/20 border border-zinc-950/15 px-2 py-0.5 rounded-md text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all cursor-pointer group/key select-none"
              >
                {hotkeyConfig.isTouchBadge ? (
                  <span className="flex items-center gap-1 text-emerald-800 font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                    <span>{hotkeyConfig.label}</span>
                  </span>
                ) : (
                  <span>{hotkeyConfig.label}</span>
                )}
                <Sliders className="w-2.5 h-2.5 text-zinc-600 opacity-60 group-hover/key:opacity-100 transition-opacity ml-0.5" />
              </div>
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder={t.sidebar.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 bg-zinc-950/80 border border-zinc-800/90 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-white/10 transition-all font-sans shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-zinc-500">
              {searchQuery ? t.sidebar.noMatchingConversations : t.sidebar.noConversations}
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              {pinnedConversations.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                    <Pin className="w-3 h-3 fill-zinc-500" />
                    {t.sidebar.pinnedSection}
                  </div>
                  {pinnedConversations.map(renderConversationItem)}
                </div>
              )}

              {/* Regular Section */}
              <div className="space-y-1">
                {pinnedConversations.length > 0 && (
                  <div className="px-2 pt-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                    {t.sidebar.recentSection}
                  </div>
                )}
                {regularConversations.map(renderConversationItem)}
              </div>
            </>
          )}
        </div>

        {/* Bottom user & company footer */}
        <div className="p-3 border-t border-[#27272a] bg-[#09090b]/60 space-y-2">
          <div 
            onClick={onOpenSettings}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center flex-shrink-0 shadow-inner-light">
                <NiximaIdLogo size={17} glow={false} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-medium text-zinc-200 leading-tight truncate">
                    {currentUser?.name || t.sidebar.defaultOperator}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-mono font-semibold bg-white/10 text-white border border-white/20 flex-shrink-0">
                    <NiximaIdLogo size={9} glow={false} /> ID
                  </span>
                </div>
                <div className="flex items-center text-[10px] text-zinc-500 font-mono mt-0.5">
                  <span className="truncate">{currentUser?.email || 'operator@nixima.ai'}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
              title={t.sidebar.signOutTooltip}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenBenchmarks && (
            <button
              onClick={onOpenBenchmarks}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
                <span>{language === 'uk' ? 'Офіційні бенчмарки' : 'Official Benchmarks'}</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded">
                4
              </span>
            </button>
          )}

          <button
            onClick={onOpenCompanyInfo}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              {t.sidebar.researchLink}
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </button>
        </div>

        {/* Hotkey & Gesture Customizer Modal */}
        <HotkeyCustomizerModal
          isOpen={isHotkeyModalOpen}
          onClose={() => setIsHotkeyModalOpen(false)}
          onHotkeyChange={(cfg) => setHotkeyConfig(cfg)}
        />
      </aside>
    </>
  );
};
