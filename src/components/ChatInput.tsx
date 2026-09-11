import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowUp, 
  BrainCircuit, 
  Globe, 
  Paperclip, 
  Square, 
  Volume2,
  VolumeX,
  Code2,
  Zap,
  Table,
  Sparkles,
  CornerDownLeft,
  X,
  Flame,
  ChevronDown,
  Check
} from 'lucide-react';
import { ModelOption, SearchMode, ThinkingMode } from '../types/chat';
import { getRecommendedModelForSearchMode } from '../data/models';
import { NiximaIdLogo } from './NiximaIdLogo';
import { useLanguage } from '../context/LanguageContext';
import { calculateEstimatedCost } from '../utils/credits';
import { NiximaCreditLogo } from './NiximaCreditLogo';
import { InfinitySymbol } from './InfinitySymbol';
import { renderWithNiximaBrand } from './NiximaWordmark';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  currentModel: ModelOption;
  deepThink: boolean;
  thinkingMode?: ThinkingMode;
  onToggleDeepThink: () => void;
  onChangeThinkingMode?: (mode: ThinkingMode) => void;
  webSearch: boolean;
  onToggleWebSearch: () => void;
  onSelectSearchMode?: (mode: SearchMode) => void;
  onSelectModel?: (model: ModelOption) => void;
  searchMode?: SearchMode;
  isCreator?: boolean;
  infiniteOutput?: boolean;
  onToggleInfiniteOutput?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  userCredits?: number;
  onOpenCredits?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  currentModel,
  deepThink,
  thinkingMode = 'none',
  onToggleDeepThink,
  onChangeThinkingMode,
  webSearch,
  onToggleWebSearch,
  onSelectSearchMode,
  onSelectModel,
  searchMode = 'standard',
  isCreator = false,
  infiniteOutput = false,
  onToggleInfiniteOutput,
  soundEnabled,
  onToggleSound,
  userCredits = 1000,
  onOpenCredits,
}) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const [isThinkingPopoverOpen, setIsThinkingPopoverOpen] = useState(false);
  const [autoSyncSearchModel, setAutoSyncSearchModel] = useState(true);
  const searchMenuRef = useRef<HTMLDivElement>(null);
  const thinkingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target as Node)) {
        setIsSearchPopoverOpen(false);
      }
      if (thinkingMenuRef.current && !thinkingMenuRef.current.contains(event.target as Node)) {
        setIsThinkingPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchMode = (mode: SearchMode, shouldPair = autoSyncSearchModel) => {
    if (onSelectSearchMode) {
      onSelectSearchMode(mode);
    }
    if (shouldPair && onSelectModel) {
      const rec = getRecommendedModelForSearchMode(mode);
      onSelectModel(rec);
    }
    setIsSearchPopoverOpen(false);
  };

  // Auto-resize textarea height smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    let finalMessage = input.trim();
    if (attachedFiles.length > 0) {
      const attachmentsHeader = attachedFiles.map(f => `[Attached Document: ${f}]`).join('\n');
      finalMessage = finalMessage ? `${attachmentsHeader}\n\n${finalMessage}` : attachmentsHeader;
      setAttachedFiles([]);
    }

    onSendMessage(finalMessage);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && isLoading && onStopGeneration) {
      e.preventDefault();
      onStopGeneration();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applyModifier = (prefix: string) => {
    setInput(prev => {
      if (prev.startsWith(prefix)) return prev;
      return `${prefix} ${prev}`.trim();
    });
    textareaRef.current?.focus();
  };

  const handleAttachMockFile = () => {
    const fileName = `dataset_${Math.floor(Math.random() * 899 + 100)}.json`;
    if (!attachedFiles.includes(fileName)) {
      setAttachedFiles(prev => [...prev, fileName]);
    }
  };

  const removeAttachment = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(f => f !== fileName));
  };

  const isOmni = currentModel.isOmni || currentModel.id === 'nixima-0.2-omni';
  const is03Coder = currentModel.id === 'nixima-0.3-coder' || currentModel.name.toLowerCase().includes('0.3');

  const modifiers = [
    { label: t.chatInput.modifiers.concise.label, icon: <Zap className="w-3 h-3 text-amber-400" />, prompt: t.chatInput.modifiers.concise.prompt },
    { label: t.chatInput.modifiers.codeOnly.label, icon: <Code2 className="w-3 h-3 text-emerald-400" />, prompt: t.chatInput.modifiers.codeOnly.prompt },
    { label: t.chatInput.modifiers.deepProof.label, icon: <BrainCircuit className="w-3 h-3 text-cyan-400" />, prompt: t.chatInput.modifiers.deepProof.prompt },
    { label: t.chatInput.modifiers.table.label, icon: <Table className="w-3 h-3 text-violet-400" />, prompt: t.chatInput.modifiers.table.prompt },
  ];

  const estimated = useMemo(() => {
    return calculateEstimatedCost(input, currentModel, isOmni ? false : deepThink, isOmni ? undefined : thinkingMode);
  }, [input, currentModel, deepThink, isOmni, thinkingMode]);

  const hasCredits = (userCredits ?? 1000) >= (currentModel.baseCreditCost || 2);
  const canSubmit = (input.trim().length > 0 || attachedFiles.length > 0) && !isLoading && hasCredits;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      {/* Quick Prompt Modifiers Rail */}
      <div className="flex items-center gap-1.5 pb-2 overflow-x-auto text-[11px] font-mono select-none scrollbar-none">
        <span className="text-zinc-500 pl-1 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-zinc-500" />
          <span>{t.chatInput.modifierLabel}</span>
        </span>
        {modifiers.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyModifier(m.prompt)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all duration-150 whitespace-nowrap active:scale-95 shadow-sm"
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Elevated Input Dock */}
      <div className="relative group">
        {/* Ambient Glow Halo when focused */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-white/[0.04] rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#131317]/95 via-[#0e0e12]/98 to-[#0a0a0d]/98 border border-zinc-800/90 hover:border-zinc-700/80 focus-within:border-zinc-500/90 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300">
          
          {/* Active Attached Files Chip Strip */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 px-5 sm:px-6 pt-3.5 pb-1 flex-wrap">
              {attachedFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-700 text-xs font-mono text-zinc-200 shadow-inner-light animate-fade-in"
                >
                  <Paperclip className="w-3 h-3 text-zinc-400" />
                  <span>{file}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file)}
                    className="hover:text-red-400 ml-0.5"
                    title="Remove attachment"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Primary Textarea Field */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chatInput.placeholder}
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 text-sm sm:text-base px-5 sm:px-6 pt-3.5 sm:pt-4 pb-2.5 resize-none focus:outline-none max-h-48 overflow-y-auto leading-relaxed font-sans select-text scrollbar-thin scrollbar-thumb-zinc-700"
          />

          {/* High-Tech Capability Toolbar (Bottom Dock) */}
          <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 pb-2.5 pt-1.5 border-t border-white/[0.04] gap-x-2 gap-y-1.5 min-w-0">
            {/* Left Controls: Brain & Capability Switches */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0 py-0.5">
              {/* Context Attachment Button */}
              <button
                type="button"
                onClick={handleAttachMockFile}
                className="p-1.5 rounded-lg border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-150 flex-shrink-0 cursor-pointer"
                title={t.chatInput.attachTooltip}
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              {/* Active Model Indicator Chip (Desktop) */}
              <div 
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 shadow-inner-light select-none mr-0.5 flex-shrink-0"
                title={`${t.header.sovereignEngine}: ${currentModel.name}`}
              >
                <NiximaIdLogo size={13} glow={false} />
                <span className="font-medium truncate max-w-[110px]">{renderWithNiximaBrand(currentModel.shortName)}</span>
              </div>

              {!isOmni && (
                <>
                  <div className="hidden sm:block h-3.5 w-[1px] bg-zinc-800 mx-0.5 flex-shrink-0" />

                  {/* Thinking Engine Control (Basic Thinking vs DeepThinking V2) */}
                  <div className="relative flex items-center flex-shrink-0 z-30" ref={thinkingMenuRef}>
                    <div
                      className={`flex items-center rounded-full text-xs font-mono transition-all duration-150 border select-none ${
                        thinkingMode === 'basic'
                          ? 'bg-zinc-800 text-white font-semibold border-cyan-600/50 shadow-inner-light scale-[1.02]'
                          : thinkingMode === 'deep' || deepThink
                          ? (is03Coder
                              ? 'bg-zinc-800 text-white font-semibold border-emerald-600/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.02]'
                              : 'bg-zinc-800 text-white font-semibold border-zinc-500 shadow-inner-light scale-[1.02]')
                          : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-850/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={onToggleDeepThink}
                        className="flex items-center gap-1.5 pl-2.5 sm:pl-3 pr-1 py-1.5 cursor-pointer"
                        title={
                          thinkingMode === 'basic'
                            ? t.chatInput.basicThinkingTooltip
                            : thinkingMode === 'deep' || deepThink
                            ? (is03Coder ? t.chatInput.deepThinkingV21Desc : t.chatInput.deepThinkTooltip)
                            : t.chatInput.thinkingEngineTitle
                        }
                      >
                        <BrainCircuit className={`w-3.5 h-3.5 flex-shrink-0 ${
                          thinkingMode === 'basic'
                            ? 'text-cyan-400'
                            : thinkingMode === 'deep' || deepThink
                            ? (is03Coder ? 'text-emerald-400' : 'text-zinc-200')
                            : 'text-zinc-400'
                        }`} />
                        <span className="tracking-tight whitespace-nowrap hidden sm:inline">
                          {thinkingMode === 'basic' 
                            ? t.chatInput.basicThinking 
                            : (is03Coder && (thinkingMode === 'deep' || deepThink) ? 'DeepThinking' : t.chatInput.deepThink)
                          }
                        </span>
                        <span className="tracking-tight whitespace-nowrap sm:hidden">
                          {thinkingMode === 'basic' ? 'Think' : 'Deep'}
                        </span>
                        {thinkingMode === 'basic' && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 text-[9px] font-mono font-bold tracking-wider text-cyan-300 border border-cyan-600/50 whitespace-nowrap flex-shrink-0">
                            BASIC
                          </span>
                        )}
                        {(thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic')) && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-wider border whitespace-nowrap flex-shrink-0 ${
                            is03Coder
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                              : 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                          }`}>
                            {is03Coder ? 'V2.1' : 'DEEP'}
                          </span>
                        )}
                        {(thinkingMode === 'basic' || thinkingMode === 'deep' || deepThink) && (
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ml-0.5 flex-shrink-0 ${
                            thinkingMode === 'basic' ? 'bg-cyan-400' : is03Coder ? 'bg-emerald-400' : 'bg-white'
                          }`} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsThinkingPopoverOpen(!isThinkingPopoverOpen);
                        }}
                        className="pr-2 pl-0.5 py-1.5 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                        title={t.chatInput.thinkingEngineTitle}
                      >
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isThinkingPopoverOpen ? 'rotate-180 text-white' : ''}`} />
                      </button>
                    </div>

                    {/* Thinking Engine Selection Popover Panel */}
                    {isThinkingPopoverOpen && (
                      <div className="absolute bottom-full mb-3 left-0 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#121215] border border-zinc-700/90 shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-3 z-[100] animate-fade-in backdrop-blur-2xl">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                          <div className="flex items-center gap-1.5">
                            <BrainCircuit className="w-4 h-4 text-zinc-300" />
                            <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                              {t.chatInput.thinkingEngineTitle}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsThinkingPopoverOpen(false)}
                            className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
                            title="Close"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-zinc-400 mt-1 mb-2 font-mono">
                          {t.chatInput.thinkingEngineSubtitle}
                        </p>

                        <div className="space-y-1.5">
                          {/* 1. Basic Thinking */}
                          <div 
                            onClick={() => {
                              onChangeThinkingMode?.('basic');
                              setIsThinkingPopoverOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              thinkingMode === 'basic'
                                ? 'bg-zinc-850/90 border-cyan-600/70 shadow-sm' 
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-xs text-white font-mono">{t.chatInput.basicThinking}</span>
                                <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-600/40 text-[9px] font-mono font-bold text-cyan-300">
                                  AGILE
                                </span>
                              </div>
                              {thinkingMode === 'basic' && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {t.chatInput.basicThinkingDesc}
                            </p>
                          </div>

                          {/* 2. DeepThinking V2 / V2.1 */}
                          <div 
                            onClick={() => {
                              onChangeThinkingMode?.('deep');
                              setIsThinkingPopoverOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic')
                                ? (is03Coder ? 'bg-zinc-850/90 border-emerald-600/70 shadow-sm' : 'bg-zinc-850/90 border-zinc-500 shadow-sm')
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded-md border ${
                                  is03Coder 
                                    ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300' 
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                                }`}>
                                  <BrainCircuit className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-xs text-white font-mono">
                                  {is03Coder ? t.chatInput.deepThinkingV21 : t.chatInput.deepThink}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                                  is03Coder 
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' 
                                    : 'bg-zinc-700 text-zinc-200 border border-zinc-600'
                                }`}>
                                  {is03Coder ? 'V2.1 CODER' : 'L3 PROOF'}
                                </span>
                              </div>
                              {(thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic')) && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {is03Coder ? t.chatInput.deepThinkingV21Desc : t.chatInput.deepThinkingDesc}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

              {/* Search V2 Engine Control (Fast, Standard, Mega + Model Pairing) */}
              <div className="relative flex items-center flex-shrink-0 z-30" ref={searchMenuRef}>
                <div
                  className={`flex items-center rounded-full text-xs font-mono transition-all duration-150 border select-none ${
                    webSearch 
                      ? searchMode === 'fast'
                        ? 'bg-zinc-800 text-white font-semibold border-amber-600/50 shadow-inner-light scale-[1.02]'
                        : (searchMode === 'mega' && isCreator)
                        ? 'bg-zinc-800 text-white font-semibold border-zinc-500 shadow-inner-light scale-[1.02]'
                        : 'bg-zinc-800 text-white font-semibold border-zinc-600 shadow-inner-light scale-[1.02]' 
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-850/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={onToggleWebSearch}
                    className="flex items-center gap-1.5 pl-2.5 sm:pl-3 pr-1 py-1.5 cursor-pointer"
                    title={
                      webSearch
                        ? `Search V2 ${searchMode.toUpperCase()} active • Click to cycle`
                        : t.chatInput.searchTooltip
                    }
                  >
                    {webSearch && searchMode === 'fast' ? (
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <Globe className={`w-3.5 h-3.5 flex-shrink-0 ${webSearch ? (searchMode === 'mega' && isCreator ? 'text-white' : 'text-zinc-200') : 'text-zinc-400'}`} />
                    )}
                    <span className="tracking-tight whitespace-nowrap hidden sm:inline">{t.chatInput.search}</span>
                    <span className="tracking-tight whitespace-nowrap sm:hidden">Search</span>
                    {webSearch && searchMode === 'fast' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-[9px] font-mono font-bold tracking-wider text-amber-300 border border-amber-600/50 whitespace-nowrap flex-shrink-0">
                        FAST
                      </span>
                    )}
                    {webSearch && isCreator && searchMode === 'mega' && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-700 text-[9px] font-mono font-bold tracking-wider text-zinc-100 border border-zinc-600 whitespace-nowrap flex-shrink-0">
                        MEGA
                      </span>
                    )}
                    {webSearch && (
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ml-0.5 flex-shrink-0 ${
                        searchMode === 'fast' ? 'bg-amber-400' : searchMode === 'mega' && isCreator ? 'bg-white' : 'bg-zinc-300'
                      }`} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSearchPopoverOpen(!isSearchPopoverOpen);
                    }}
                    className="pr-2 pl-0.5 py-1.5 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                    title={t.chatInput.searchEngineTitle}
                  >
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSearchPopoverOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>
                </div>

                {/* Search Engine Selection Popover Panel */}
                {isSearchPopoverOpen && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#121215] border border-zinc-700/90 shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-3 z-[100] animate-fade-in backdrop-blur-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-zinc-300" />
                        <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                          {t.chatInput.searchEngineTitle}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSearchPopoverOpen(false)}
                        className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
                        title="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-1 mb-2 font-mono">
                      {t.chatInput.searchEngineSubtitle}
                    </p>

                    <div className="space-y-1.5">
                      {/* 1. Search V2 Fast */}
                      {(() => {
                        const recFast = getRecommendedModelForSearchMode('fast');
                        const isModeActive = webSearch && searchMode === 'fast';
                        return (
                          <div 
                            onClick={() => handleSelectSearchMode('fast')}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              isModeActive 
                                ? 'bg-zinc-850/90 border-amber-600/70 shadow-sm' 
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-amber-950/60 border border-amber-800/60 text-amber-300">
                                  <Zap className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-xs text-white font-mono">Search V2 Fast</span>
                                <span className="px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/40 text-[9px] font-mono font-bold text-amber-300">
                                  &lt;50MS
                                </span>
                              </div>
                              {isModeActive && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {t.chatInput.searchFastDesc}
                            </p>
                            <div className="mt-1.5 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <span className="flex items-center gap-1 text-amber-300/90">
                                <span>⚡ Optimal:</span>
                                <strong className="text-zinc-200">{recFast.shortName}</strong>
                              </span>
                              <span className="text-zinc-500">2-3 Sources</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 2. Search V2 Standard */}
                      {(() => {
                        const recStd = getRecommendedModelForSearchMode('standard');
                        const isModeActive = webSearch && searchMode === 'standard';
                        return (
                          <div 
                            onClick={() => handleSelectSearchMode('standard')}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              isModeActive 
                                ? 'bg-zinc-850/90 border-zinc-500 shadow-sm' 
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">
                                  <Globe className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-xs text-white font-mono">Search V2 Standard</span>
                                <span className="px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-[9px] font-mono font-bold text-zinc-300">
                                  BALANCED
                                </span>
                              </div>
                              {isModeActive && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {t.chatInput.searchStandardDesc}
                            </p>
                            <div className="mt-1.5 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <span className="flex items-center gap-1 text-zinc-300">
                                <span>🌐 Optimal:</span>
                                <strong className="text-zinc-100">{recStd.shortName}</strong>
                              </span>
                              <span className="text-zinc-500">4-6 Sources</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 3. Search V2 Mega (Creator Clearance) */}
                      {isCreator && (() => {
                        const recMega = getRecommendedModelForSearchMode('mega');
                        const isModeActive = webSearch && searchMode === 'mega';
                        return (
                          <div 
                            onClick={() => handleSelectSearchMode('mega')}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              isModeActive 
                                ? 'bg-zinc-850/90 border-zinc-400 shadow-sm' 
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-zinc-800 border border-zinc-600 text-white">
                                  <BrainCircuit className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-xs text-white font-mono">Search V2 Mega</span>
                                <span className="px-1.5 py-0.2 rounded bg-zinc-700 border border-zinc-600 text-[9px] font-mono font-bold text-zinc-100">
                                  CREATOR SWARM
                                </span>
                              </div>
                              {isModeActive && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {t.chatInput.searchMegaDesc}
                            </p>
                            <div className="mt-1.5 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <span className="flex items-center gap-1 text-zinc-200">
                                <span>🧠 Optimal:</span>
                                <strong className="text-white">{recMega.shortName}</strong>
                              </span>
                              <span className="text-zinc-400">20+ Sources • 5 Clusters</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Auto-Sync Model with Search Mode Toggle */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-[10.5px] font-mono text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSyncSearchModel}
                          onChange={(e) => setAutoSyncSearchModel(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 w-3.5 h-3.5 accent-white cursor-pointer"
                        />
                        <span>{t.chatInput.autoSyncModel}</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
                </>
              )}

              {/* Sovereign Infinite Output Toggle (Creator Exclusive Clearance) */}
              {isCreator && (
                <>
                  <div className="hidden sm:block h-3.5 w-[1px] bg-zinc-800 mx-0.5 flex-shrink-0" />
                  <button
                    type="button"
                    onClick={onToggleInfiniteOutput}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border select-none cursor-pointer flex-shrink-0 ${
                      infiniteOutput
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border-amber-500/60 shadow-[0_0_16px_rgba(245,158,11,0.25)] hover:bg-amber-500/25 scale-[1.02]'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-amber-200/90 hover:border-amber-600/40 hover:bg-zinc-850/80'
                    }`}
                    title={infiniteOutput ? t.chatInput.infiniteOutputActiveTooltip : t.chatInput.infiniteOutputInactiveTooltip}
                  >
                    <InfinitySymbol size={13} className={`flex-shrink-0 transition-transform duration-200 ${infiniteOutput ? 'text-amber-400 scale-110' : 'text-zinc-400'}`} />
                    <span className="tracking-tight whitespace-nowrap hidden lg:inline">
                      {t.chatInput.infiniteOutput}
                    </span>
                    <span className="tracking-tight whitespace-nowrap lg:hidden">
                      {t.chatInput.infiniteOutputShort || (language === 'uk' ? 'Безліміт' : 'Infinite')}
                    </span>
                    {infiniteOutput ? (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-[9px] font-mono font-bold tracking-wider text-amber-300 border border-amber-500/50 whitespace-nowrap flex-shrink-0">
                        {t.chatInput.infiniteOutputBadge || 'MAX'}
                      </span>
                    ) : (
                      <span className="px-1 py-0.2 rounded bg-zinc-800/80 text-[8.5px] font-mono font-semibold text-zinc-500 whitespace-nowrap flex-shrink-0">
                        OFF
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Right Controls: Audio, Telemetry & Send/Stop Beacon */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">
              {/* Audio Keystroke Sound Toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className={`p-1.5 rounded-lg border transition-all duration-150 flex-shrink-0 cursor-pointer ${
                  soundEnabled
                    ? 'bg-zinc-850 border-zinc-700 text-white shadow-inner-light'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
                title={soundEnabled ? t.chatInput.audioMute : t.chatInput.audioEnable}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-zinc-200" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Live Cost Estimation Indicator with Smooth Transition */}
              <button
                type="button"
                onClick={onOpenCredits}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-mono border transition-all duration-300 select-none cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  !hasCredits
                    ? 'bg-red-950/40 border-red-800 text-red-300 animate-pulse'
                    : userCredits === Infinity
                    ? 'bg-zinc-900/90 border-zinc-700 text-zinc-100 shadow-inner-light hover:border-zinc-500'
                    : estimated.isHardPrompt
                    ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:border-zinc-500'
                    : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
                title={
                  !hasCredits
                    ? t.credits.insufficientTooltip(estimated.minCost, userCredits)
                    : userCredits === Infinity
                    ? 'Creator Account (orange17@nixima.ai) • Unlimited Inferences Granted'
                    : `${t.credits.badge}: ${t.credits.estCost(estimated.minCost, estimated.maxCost)} (${currentModel.shortName})`
                }
              >
                <NiximaCreditLogo size={12} />
                <span className="tabular-nums font-medium whitespace-nowrap inline-flex items-center gap-1">
                  {userCredits === Infinity ? (
                    <>
                      <span>0 CR</span>
                      <span className="hidden xl:inline text-zinc-400 font-normal">Creator</span>
                      <InfinitySymbol size={10} className="inline-block text-zinc-300" />
                    </>
                  ) : (
                    t.credits.estCost(estimated.minCost, estimated.maxCost)
                  )}
                </span>
                {userCredits !== Infinity && estimated.isHardPrompt && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-zinc-300 px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 whitespace-nowrap flex-shrink-0">
                    <Flame className="w-2.5 h-2.5 text-zinc-300 fill-zinc-400" />
                    <span>DIFFICULT</span>
                  </span>
                )}
              </button>

              {input.length > 0 && (
                <span className="hidden lg:inline text-[10.5px] font-mono text-zinc-500 select-none whitespace-nowrap flex-shrink-0">
                  {input.length} {t.chatInput.chars}
                </span>
              )}

              {isLoading ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className="relative group w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center transition-all duration-150 shadow-[0_0_24px_rgba(255,255,255,0.4)] hover:bg-zinc-200 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                  title={t.chatInput.stopTooltip}
                >
                  <span className="absolute -inset-0.5 rounded-xl bg-white/40 animate-pulse pointer-events-none" />
                  <Square className="w-3.5 h-3.5 fill-black text-black" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!canSubmit}
                  className={`relative group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    canSubmit
                      ? 'bg-white text-black hover:bg-zinc-100 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.45)] ring-1 ring-white/60 cursor-pointer'
                      : 'bg-zinc-900/90 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title={canSubmit ? t.chatInput.sendTooltip : t.chatInput.placeholder}
                >
                  <ArrowUp className={`w-4 h-4 stroke-[2.5] transition-transform duration-150 ${
                    canSubmit ? 'group-hover:-translate-y-0.5 text-black' : 'text-zinc-600'
                  }`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle Telemetry & Keyboard Hint */}
      <div className="mt-2 text-center text-[10.5px] text-zinc-500 font-mono tracking-tight flex items-center justify-center gap-2 select-none">
        <span>Nixima AI Mesh</span>
        <span>•</span>
        <span>{t.chatInput.meshOnline}</span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline">
          {t.chatInput.enterToSend}
          <span className="mx-1 text-zinc-600">·</span>
          {t.chatInput.shiftEnterNewline}
        </span>
      </div>
    </div>
  );
};
