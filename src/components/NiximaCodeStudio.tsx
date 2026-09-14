import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Code2, 
  Cpu, 
  Play, 
  Check, 
  Copy, 
  Download, 
  Layers, 
  Zap, 
  ShieldCheck, 
  FileCode, 
  Sliders, 
  Plus, 
  RotateCw, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Volume2,
  Lock,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { Conversation, Message, ModelOption, NiximaArtifact } from '../types/chat';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage } from './ChatMessage';
import { NiximaIdLogo } from './NiximaIdLogo';
import { ModelIcon } from './ModelIcon';
import { playCompletionChime } from '../utils/sound';

interface NiximaCodeStudioProps {
  conversation: Conversation;
  onSendPrompt: (prompt: string, codeContext?: string, options?: { taskType?: string; language?: string }) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  onRegenerate?: () => void;
  onOpenArtifact?: (artifact: NiximaArtifact) => void;
  currentModel: ModelOption;
  userCredits?: number;
  activeCanvasArtifact?: {
    title: string;
    version: number;
    language: string;
    lineCount: number;
    content?: string;
  } | null;
}

export const NiximaCodeStudio: React.FC<NiximaCodeStudioProps> = ({
  conversation,
  onSendPrompt,
  isLoading,
  onStopGeneration,
  onRegenerate,
  onOpenArtifact,
  currentModel,
  userCredits = 1000,
  activeCanvasArtifact,
}) => {
  const { language, t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);
  const [taskType, setTaskType] = useState<'generate' | 'refactor' | 'debug' | 'architect' | 'test'>('generate');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('typescript');
  const [zeroLaziness, setZeroLaziness] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isConversationEmpty = conversation.messages.length === 0;

  // Auto-scroll when messages change or while streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 280)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return;
    onSendPrompt(prompt.trim(), codeContext.trim() || undefined, {
      taskType,
      language: selectedLanguage,
    });
    setPrompt('');
  };

  const handlePresetSelect = (presetPrompt: string, pType: 'generate' | 'refactor' | 'debug' | 'architect' | 'test', pLang: string) => {
    setPrompt(presetPrompt);
    setTaskType(pType);
    setSelectedLanguage(pLang);
    textareaRef.current?.focus();
  };

  const handleImportActiveCanvas = () => {
    if (activeCanvasArtifact?.content) {
      setCodeContext(activeCanvasArtifact.content);
      setIsContextDrawerOpen(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090e] text-zinc-200">
      {/* Top Coding Studio Banner & Telemetry Ribbon */}
      <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-[#0a0f16]/95 backdrop-blur-md flex items-center justify-between flex-wrap gap-2 z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0f16] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white tracking-wide">
                {t.niximaCode.heroTitle}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                {t.niximaCode.titanCoderBadge}
              </span>
            </div>
            <div className="text-[10.5px] text-zinc-400 font-mono hidden sm:block">
              {t.niximaCode.heroSubtitle}
            </div>
          </div>
        </div>

        {/* Locked Model & Telemetry Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Locked Model Pill */}
          <div 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-[10.5px] font-mono shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            title={t.niximaCode.exclusiveEngineNotice}
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="font-bold">Nixima-0.3 Coder</span>
            <span className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LOCKED
            </span>
          </div>

          {/* DeepThinking V3.0 Proof Engine Badge */}
          <div className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-[10.5px] font-mono">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>V3.0 Proof Engine</span>
          </div>

          {/* Zero-Laziness Active Badge */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-750 text-zinc-300 text-[10.5px] font-mono">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>100% Complete Code</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Prompt Station if Empty, otherwise Conversation Stream */}
      <div className="flex-1 overflow-y-auto bg-grid-pattern min-w-0">
        {isConversationEmpty ? (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
            {/* Hero Banner */}
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#0e1622] via-[#090e15] to-[#070a10] shadow-[0_4px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-emerald-500/10 blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[11px] font-mono mb-3">
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{t.niximaCode.heroBadge} • {t.niximaCode.deepThinkingV3Active}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-2">
                {t.niximaCode.heroTitle}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-mono leading-relaxed">
                {t.niximaCode.exclusiveEngineNotice}
              </p>
            </div>

            {/* Architecture Presets & Starter Blueprints */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  {t.niximaCode.quickPresetsTitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Interactive Canvas Game */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetGamePrompt,
                    'generate',
                    'html'
                  )}
                  className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-emerald-500/50 transition-all cursor-pointer select-none relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-emerald-400/20" />
                      </div>
                      <span className="font-semibold text-xs text-zinc-100 group-hover:text-emerald-300 transition-colors">
                        {t.niximaCode.presetGameTitle}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                      HTML5 Canvas
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {t.niximaCode.presetGameDesc}
                  </p>
                </div>

                {/* 2. Full-Stack Component */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetComponentPrompt,
                    'generate',
                    'tsx'
                  )}
                  className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-cyan-500/50 transition-all cursor-pointer select-none relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs text-zinc-100 group-hover:text-cyan-300 transition-colors">
                        {t.niximaCode.presetComponentTitle}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                      React (TSX)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {t.niximaCode.presetComponentDesc}
                  </p>
                </div>

                {/* 3. High-Performance Algorithm */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetAlgoPrompt,
                    'architect',
                    'typescript'
                  )}
                  className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-purple-500/50 transition-all cursor-pointer select-none relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs text-zinc-100 group-hover:text-purple-300 transition-colors">
                        {t.niximaCode.presetAlgoTitle}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300">
                      TypeScript O(1)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {t.niximaCode.presetAlgoDesc}
                  </p>
                </div>

                {/* 4. AST Refactor & Bug Fix */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetRefactorPrompt,
                    'refactor',
                    'typescript'
                  )}
                  className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-amber-500/50 transition-all cursor-pointer select-none relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {t.niximaCode.presetRefactorTitle}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
                      Zero-Defect AST
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {t.niximaCode.presetRefactorDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Code Assistant Conversation Stream */
          <div className="pb-36 pt-2">
            {conversation.messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={msg.role === 'assistant' ? onRegenerate : undefined}
                onActionPrompt={(p) => onSendPrompt(p)}
                onOpenArtifact={onOpenArtifact}
                activeModelName="Nixima-0.3 Coder"
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Docked IDE Code Input Terminal ("Good Design Input Box") */}
      <div className="border-t border-zinc-800/80 bg-[#090d14]/95 backdrop-blur-xl p-3 sm:p-4 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Top Control Strip (Task Type, Target Language, Context Attachment) */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
            {/* Task Type selector pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {(['generate', 'refactor', 'debug', 'architect', 'test'] as const).map((typeKey) => {
                const label = 
                  typeKey === 'generate' ? t.niximaCode.taskTypeGenerate :
                  typeKey === 'refactor' ? t.niximaCode.taskTypeRefactor :
                  typeKey === 'debug' ? t.niximaCode.taskTypeDebug :
                  typeKey === 'architect' ? t.niximaCode.taskTypeArchitect :
                  t.niximaCode.taskTypeTest;

                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setTaskType(typeKey)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none whitespace-nowrap text-[11px] ${
                      taskType === typeKey
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Language Selector & Context Attachment Button */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-zinc-900 border border-zinc-750 text-zinc-200 text-[11px] font-mono px-2 py-1 rounded-lg focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value="typescript">TypeScript</option>
                <option value="tsx">React (TSX)</option>
                <option value="html">HTML5 Canvas</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="css">Tailwind / CSS</option>
              </select>

              {/* Attach Code Snippet Context Toggle */}
              <button
                type="button"
                onClick={() => setIsContextDrawerOpen(prev => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                  codeContext.trim()
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : isContextDrawerOpen
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
                title="Attach or inspect code snippet for the AI Assistant"
              >
                <FileCode className="w-3.5 h-3.5 text-current" />
                <span>{t.niximaCode.attachCodeContext}</span>
                {codeContext.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
                {isContextDrawerOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>

              {/* Quick Canvas Import Button if active artifact exists */}
              {activeCanvasArtifact && (
                <button
                  type="button"
                  onClick={handleImportActiveCanvas}
                  className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-colors"
                  title="Import current active code from Canvas into prompt context"
                >
                  <Plus className="w-3 h-3" />
                  <span>Import Canvas: {activeCanvasArtifact.title}</span>
                </button>
              )}
            </div>
          </div>

          {/* Expandable Snippet / Code Context Drawer */}
          {isContextDrawerOpen && (
            <div className="p-3 rounded-xl border border-cyan-500/30 bg-[#060c14]/90 animate-fade-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  {t.niximaCode.contextDrawerTitle}
                </span>
                {codeContext.trim() && (
                  <button
                    type="button"
                    onClick={() => setCodeContext('')}
                    className="text-[10px] font-mono text-zinc-400 hover:text-rose-300 transition-colors"
                  >
                    {t.niximaCode.clearContext}
                  </button>
                )}
              </div>
              <textarea
                value={codeContext}
                onChange={(e) => setCodeContext(e.target.value)}
                placeholder={t.niximaCode.contextDrawerPlaceholder}
                rows={4}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg p-2.5 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-y leading-relaxed"
              />
            </div>
          )}

          {/* Main Neon Code Prompt Textarea Container */}
          <div className="relative rounded-2xl border border-emerald-500/40 bg-[#0a0f16] shadow-[0_0_25px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all focus-within:border-emerald-400 focus-within:shadow-[0_0_35px_rgba(16,185,129,0.22)]">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.niximaCode.promptInputPlaceholder}
              rows={2}
              disabled={isLoading}
              className="w-full bg-transparent p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none font-sans leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700"
            />

            {/* Bottom Bar inside Input Box */}
            <div className="flex items-center justify-between px-3.5 py-2 border-t border-zinc-800/80 bg-zinc-950/60 rounded-b-2xl text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap text-zinc-400 text-[11px]">
                {/* Zero-Laziness Toggle */}
                <button
                  type="button"
                  onClick={() => setZeroLaziness(prev => !prev)}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    zeroLaziness
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}
                  title={t.niximaCode.zeroLazinessDesc}
                >
                  <Zap className={`w-3 h-3 ${zeroLaziness ? 'text-amber-400' : 'text-zinc-600'}`} />
                  <span className="font-semibold">{t.niximaCode.zeroLazinessActive}</span>
                </button>

                <span className="hidden sm:inline-block text-zinc-600">•</span>
                <span className="hidden sm:inline-block text-zinc-400">
                  Ctrl + Enter
                </span>
              </div>

              {/* Action Buttons: Stop / Generate */}
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <button
                    type="button"
                    onClick={onStopGeneration}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-600/70 text-rose-200 hover:bg-rose-900/80 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-md select-none ${
                      prompt.trim()
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{t.niximaCode.generateButton}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
