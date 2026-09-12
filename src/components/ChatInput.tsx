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
import { ModelIcon } from './ModelIcon';
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
  const { t, language } = useLanguage();
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
      <div className="flex items-center gap-1.5 pb-2.5 overflow-x-auto text-[11px] font-mono select-none scrollbar-none">
        <span className="text-zinc-500 pl-1 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-zinc-400" />
          <span>{t.chatInput.modifierLabel}</span>
        </span>
        {modifiers.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyModifier(m.prompt)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-200 whitespace-nowrap active:scale-95 shadow-sm backdrop-blur-sm"
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Elevated Input Dock */}
      <div className="relative group">
        {/* Ambient Atmospheric Radiance on Focus */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-amber-500/10 to-purple-500/10 rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-700 pointer-events-none" />

        <div className="relative rounded-2xl sm:rounded-[24px] bg-[#0c0c11]/92 border border-white/[0.09] hover:border-white/[0.15] focus-within:!border-white/35 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.02),inset_0_1px_0_0_rgba(255,255,255,0.1)] focus-within:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl transition-all duration-300 overflow-hidden">
          {/* Subtle Top Specular Glass Highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Active Attached Files Chip Strip */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 px-5 sm:px-6 pt-3.5 pb-1 flex-wrap">
              {attachedFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-850/90 border border-zinc-700/90 text-xs font-mono text-zinc-200 shadow-sm animate-fade-in"
                >
                  <Paperclip className="w-3 h-3 text-zinc-400" />
                  <span>{file}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file)}
                    className="hover:text-red-400 p-0.5 rounded transition-colors ml-0.5 cursor-pointer"
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
            className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500/75 text-[15px] sm:text-base px-5 sm:px-6 pt-4 pb-3 resize-none focus:outline-none max-h-52 overflow-y-auto leading-[1.65] font-sans select-text scrollbar-thin scrollbar-thumb-zinc-700"
          />

          {/* High-Tech Capability Toolbar (Bottom Dock) */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-black/30 border-t border-white/[0.06] gap-2 min-w-0">
            {/* Left Controls: Brain & Capability Switches */}
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 py-0.5">
              {/* Context Attachment Button */}
              <button
                type="button"
                onClick={handleAttachMockFile}
                className="p-2 rounded-xl border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.08] transition-all duration-150 flex-shrink-0 cursor-pointer active:scale-95"
                title={t.chatInput.attachTooltip}
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {!isOmni && (
                <>
                  <div className="hidden sm:block h-3.5 w-[1px] bg-zinc-800 mx-0.5 flex-shrink-0" />

                  {/* Thinking Engine Control (Basic Thinking vs DeepThinking V2/V2.1 vs UltraThinking V1.0) */}
                  <div className="relative flex items-center flex-shrink-0 z-30" ref={thinkingMenuRef}>
                    <div
                      className={`flex items-center rounded-full text-xs font-mono transition-all duration-200 border select-none ${
                        thinkingMode === 'ultra'
                          ? 'bg-purple-950/40 text-purple-200 font-semibold border-purple-500/50 shadow-[0_0_14px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/20'
                          : thinkingMode === 'basic'
                          ? 'bg-cyan-950/40 text-cyan-200 font-semibold border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/20'
                          : thinkingMode === 'deep' || deepThink
                          ? (is03Coder
                              ? 'bg-emerald-950/40 text-emerald-200 font-semibold border-emerald-500/50 shadow-[0_0_14px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20'
                              : 'bg-zinc-800/90 text-white font-semibold border-zinc-500 shadow-inner-light')
                          : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={onToggleDeepThink}
                        className="flex items-center gap-1.5 pl-2.5 sm:pl-3 pr-1 py-1.5 cursor-pointer"
                        title={
                          thinkingMode === 'ultra'
                            ? t.chatInput.ultraThinkingTooltip
                            : thinkingMode === 'basic'
                            ? t.chatInput.basicThinkingTooltip
                            : thinkingMode === 'deep' || deepThink
                            ? (is03Coder ? t.chatInput.deepThinkingV21Desc : t.chatInput.deepThinkTooltip)
                            : t.chatInput.thinkingEngineTitle
                        }
                      >
                        <BrainCircuit className={`w-3.5 h-3.5 flex-shrink-0 ${
                          thinkingMode === 'ultra'
                            ? 'text-purple-400 animate-pulse'
                            : thinkingMode === 'basic'
                            ? 'text-cyan-400'
                            : thinkingMode === 'deep' || deepThink
                            ? (is03Coder ? 'text-emerald-400' : 'text-zinc-200')
                            : 'text-zinc-400'
                        }`} />
                        <span className="tracking-tight whitespace-nowrap hidden sm:inline">
                          {thinkingMode === 'ultra'
                            ? 'UltraThinking'
                            : thinkingMode === 'basic' 
                            ? t.chatInput.basicThinking 
                            : (is03Coder && (thinkingMode === 'deep' || deepThink) ? 'DeepThinking' : t.chatInput.deepThink)
                          }
                        </span>
                        <span className="tracking-tight whitespace-nowrap sm:hidden">
                          {thinkingMode === 'ultra' ? 'Ultra' : thinkingMode === 'basic' ? 'Think' : 'Deep'}
                        </span>
                        {thinkingMode === 'ultra' && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-950/90 text-[9px] font-mono font-bold tracking-wider text-purple-300 border border-purple-500/60 whitespace-nowrap flex-shrink-0">
                            V1.0
                          </span>
                        )}
                        {thinkingMode === 'basic' && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 text-[9px] font-mono font-bold tracking-wider text-cyan-300 border border-cyan-600/50 whitespace-nowrap flex-shrink-0">
                            BASIC
                          </span>
                        )}
                        {(thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic' && thinkingMode !== 'ultra')) && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-wider border whitespace-nowrap flex-shrink-0 ${
                            is03Coder
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                              : 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                          }`}>
                            {is03Coder ? 'V2.1' : 'DEEP'}
                          </span>
                        )}
                        {(thinkingMode === 'basic' || thinkingMode === 'deep' || thinkingMode === 'ultra' || deepThink) && (
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ml-0.5 flex-shrink-0 ${
                            thinkingMode === 'ultra' ? 'bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.9)]' : thinkingMode === 'basic' ? 'bg-cyan-400' : is03Coder ? 'bg-emerald-400' : 'bg-white'
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
                      <div className="absolute bottom-full mb-3 left-0 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#101014]/98 border border-zinc-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] p-3.5 z-[100] animate-fade-in backdrop-blur-2xl overflow-hidden">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
                              thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic' && thinkingMode !== 'ultra')
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
                              {(thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic' && thinkingMode !== 'ultra')) && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {is03Coder ? t.chatInput.deepThinkingV21Desc : t.chatInput.deepThinkingDesc}
                            </p>
                          </div>

                          {/* 3. UltraThinking V2.0 / V1.0 (Pinnacle Epistemic Struggle for Nixima Pro) */}
                          <div 
                            onClick={() => {
                              onChangeThinkingMode?.('ultra');
                              const isProModel = currentModel.id === 'nixima-0.3-pro' || currentModel.id === 'nixima-0.2-pro';
                              if (!isProModel && onSelectModel) {
                                const proModel = NIXIMA_MODELS.find(m => m.id === 'nixima-0.3-pro') || NIXIMA_MODELS.find(m => m.id === 'nixima-0.2-pro');
                                if (proModel) onSelectModel(proModel);
                              }
                              setIsThinkingPopoverOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              thinkingMode === 'ultra'
                                ? 'bg-purple-950/40 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-purple-700/60 hover:bg-zinc-850/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-purple-950/80 border border-purple-700/60 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                                  <BrainCircuit className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                                </div>
                                <span className="font-semibold text-xs text-white font-mono">
                                  {currentModel.id === 'nixima-0.3-pro' ? 'UltraThinking V2.0' : t.chatInput.ultraThinkingV1}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-purple-950/90 text-[9px] font-mono font-bold text-purple-300 border border-purple-500/60">
                                  {currentModel.id === 'nixima-0.3-pro' ? 'ULTRA V2.0' : 'ULTRA V1.0'}
                                </span>
                              </div>
                              {thinkingMode === 'ultra' && (
                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {t.chatInput.ultraThinkingDesc}
                            </p>
                            {currentModel.id !== 'nixima-0.2-pro' && (
                              <div className="mt-1.5 text-[10px] font-mono text-purple-300/90 flex items-center gap-1">
                                <span>⚡ {language === 'uk' ? 'Підключає та оптимізує Nixima-0.2 Pro' : 'Auto-pairs with Nixima-0.2 Pro'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

              {/* Search V3 Engine Control (Fast, Standard, Mega + Model Pairing) */}
              <div className="relative flex items-center flex-shrink-0 z-30" ref={searchMenuRef}>
                <div
                  className={`flex items-center rounded-full text-xs font-mono transition-all duration-200 border select-none ${
                    webSearch 
                      ? searchMode === 'fast'
                        ? 'bg-amber-950/40 text-amber-200 font-semibold border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/20'
                        : (searchMode === 'mega' && isCreator)
                        ? 'bg-gradient-to-r from-amber-950/50 via-zinc-850 to-zinc-900 text-amber-200 font-semibold border-amber-500/60 shadow-[0_0_16px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/25'
                        : 'bg-zinc-800/90 text-white font-semibold border-zinc-500 shadow-inner-light' 
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={onToggleWebSearch}
                    className="flex items-center gap-1.5 pl-2.5 sm:pl-3 pr-1 py-1.5 cursor-pointer"
                    title={
                      webSearch
                        ? `Search V3 ${searchMode.toUpperCase()} active • Click to cycle`
                        : t.chatInput.searchTooltip
                    }
                  >
                    {webSearch && searchMode === 'fast' ? (
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <Globe className={`w-3.5 h-3.5 flex-shrink-0 ${webSearch ? (searchMode === 'mega' && isCreator ? 'text-amber-300' : 'text-zinc-200') : 'text-zinc-400'}`} />
                    )}
                    <span className="tracking-tight whitespace-nowrap hidden sm:inline">{t.chatInput.search}</span>
                    <span className="tracking-tight whitespace-nowrap sm:hidden">Search</span>
                    {webSearch && searchMode === 'fast' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-[9px] font-mono font-bold tracking-wider text-amber-300 border border-amber-600/50 whitespace-nowrap flex-shrink-0">
                        FAST
                      </span>
                    )}
                    {webSearch && isCreator && searchMode === 'mega' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[9px] font-mono font-bold tracking-wider text-amber-300 border border-amber-500/40 whitespace-nowrap flex-shrink-0">
                        MEGA
                      </span>
                    )}
                    {webSearch && (
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ml-0.5 flex-shrink-0 ${
                        searchMode === 'fast' ? 'bg-amber-400' : searchMode === 'mega' && isCreator ? 'bg-amber-300' : 'bg-zinc-300'
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
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#101014]/98 border border-zinc-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] p-3.5 z-[100] animate-fade-in backdrop-blur-2xl overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
                      {/* 1. Search V3 Fast */}
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
                                <span className="font-semibold text-xs text-white font-mono">Search V3 Fast</span>
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
                              <span className="text-zinc-500">20 Websites Rapid</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 2. Search V3 Standard */}
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
                                <span className="font-semibold text-xs text-white font-mono">Search V3 Standard</span>
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
                              <span className="text-zinc-500">20+ Websites Deep Grounding</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 3. Search V3 Mega (Creator Clearance) */}
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
                                <span className="font-semibold text-xs text-white font-mono">Search V3 Mega</span>
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
                              <span className="text-zinc-400">50-80 Websites • 7 Clusters</span>
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
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border select-none cursor-pointer flex-shrink-0 active:scale-95 ${
                      infiniteOutput
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border-amber-500/60 shadow-[0_0_18px_rgba(245,158,11,0.28)] hover:bg-amber-500/25 scale-[1.02] animate-infinity-ignite'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-amber-200/90 hover:border-amber-600/40 hover:bg-zinc-850/80'
                    }`}
                    title={infiniteOutput ? t.chatInput.infiniteOutputActiveTooltip : t.chatInput.infiniteOutputInactiveTooltip}
                  >
                    <InfinitySymbol
                      size={13}
                      active={infiniteOutput}
                      theme="amber"
                      glow={infiniteOutput}
                      className={`flex-shrink-0 transition-all duration-300 ${infiniteOutput ? 'scale-110' : 'scale-100 opacity-75'}`}
                    />
                    <span className="tracking-tight whitespace-nowrap hidden sm:inline">
                      {language === 'uk' ? 'Безліміт' : (t.chatInput.infiniteOutputShort || 'Infinite')}
                    </span>
                    {infiniteOutput ? (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-[9px] font-mono font-bold tracking-wider text-amber-300 border border-amber-500/50 whitespace-nowrap flex-shrink-0 transition-all duration-300 animate-check-pop">
                        {t.chatInput.infiniteOutputBadge || 'MAX'}
                      </span>
                    ) : (
                      <span className="px-1 py-0.2 rounded bg-zinc-800/80 text-[8.5px] font-mono font-semibold text-zinc-500 whitespace-nowrap flex-shrink-0 transition-all duration-300">
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
                className={`p-2 rounded-xl border transition-all duration-200 flex-shrink-0 cursor-pointer active:scale-95 ${
                  soundEnabled
                    ? 'bg-white/10 border-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                    : 'bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] hover:bg-white/[0.06]'
                }`}
                title={soundEnabled ? t.chatInput.audioMute : t.chatInput.audioEnable}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-zinc-200" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Live Cost Estimation Indicator with Smooth Transition */}
              <button
                type="button"
                onClick={onOpenCredits}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono border backdrop-blur-sm transition-all duration-200 select-none cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95 ${
                  !hasCredits
                    ? 'bg-red-500/15 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
                    : userCredits === Infinity
                    ? 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/30 hover:border-amber-500/50 text-amber-200/90 shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                    : estimated.isHardPrompt
                    ? 'bg-white/[0.05] border-white/[0.14] text-zinc-200 hover:border-white/30'
                    : 'bg-white/[0.03] border-white/[0.07] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.16] hover:bg-white/[0.06]'
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
                      <span className="font-semibold text-amber-200">Creator</span>
                      <InfinitySymbol size={10} className="inline-block text-amber-300" />
                    </>
                  ) : (
                    t.credits.estCost(estimated.minCost, estimated.maxCost)
                  )}
                </span>
                {userCredits !== Infinity && estimated.isHardPrompt && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-zinc-300 px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 whitespace-nowrap flex-shrink-0">
                    <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400/30" />
                    <span>DIFFICULT</span>
                  </span>
                )}
              </button>

              {input.length > 0 && (
                <span className="hidden xl:inline-flex items-center px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10.5px] font-mono text-zinc-500 select-none whitespace-nowrap flex-shrink-0 tabular-nums">
                  {input.length} {t.chatInput.chars}
                </span>
              )}

              {isLoading ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className="relative group w-9 h-9 rounded-xl bg-gradient-to-b from-red-500 to-rose-600 text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_24px_rgba(244,63,94,0.45)] hover:shadow-[0_0_30px_rgba(244,63,94,0.65)] hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 border border-red-400/40"
                  title={t.chatInput.stopTooltip}
                >
                  <span className="absolute -inset-0.5 rounded-xl bg-rose-500/40 animate-ping opacity-60 pointer-events-none" />
                  <Square className="w-3.5 h-3.5 fill-white text-white relative z-10" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!canSubmit}
                  className={`relative group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    canSubmit
                      ? 'bg-gradient-to-b from-white to-zinc-200 text-black hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.45)] hover:shadow-[0_0_32px_rgba(255,255,255,0.7)] ring-1 ring-white/80 cursor-pointer overflow-hidden'
                      : 'bg-white/[0.03] text-zinc-600 border border-white/[0.06] cursor-not-allowed'
                  }`}
                  title={canSubmit ? t.chatInput.sendTooltip : t.chatInput.placeholder}
                >
                  {canSubmit && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  )}
                  <ArrowUp className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 relative z-10 ${
                    canSubmit ? 'group-hover:-translate-y-0.5 text-black' : 'text-zinc-600'
                  }`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle Telemetry & Keyboard Hint */}
      <div className="mt-2.5 text-center text-[10.5px] text-zinc-500 font-mono tracking-tight flex items-center justify-center gap-2 select-none">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-400">Nixima AI Mesh</span>
        </span>
        <span className="text-zinc-700">•</span>
        <span className="text-emerald-400/90 font-medium">{t.chatInput.meshOnline}</span>
        <span className="hidden sm:inline text-zinc-700">•</span>
        <span className="hidden sm:inline text-zinc-500">
          {t.chatInput.enterToSend}
          <span className="mx-1.5 text-zinc-700">·</span>
          {t.chatInput.shiftEnterNewline}
        </span>
      </div>
    </div>
  );
};
