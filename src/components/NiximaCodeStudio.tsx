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
  Maximize2,
  Bug,
  TestTube,
  Workflow,
  Split,
  FolderCode,
  Activity,
  Flame,
  CheckCircle2
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
  onNewProject?: () => void;
  onToggleCanvas?: () => void;
  isCanvasOpen?: boolean;
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
  onNewProject,
  onToggleCanvas,
  isCanvasOpen = false,
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

  // Estimate lines in attached context
  const contextLines = codeContext ? codeContext.split('\n').length : 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#04060c] text-zinc-100 relative select-none">
      {/* Ambient Cosmic Neon Light Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[260px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-12 right-1/4 w-[500px] h-[240px] bg-cyan-500/08 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[200px] bg-indigo-500/05 blur-[140px] rounded-full pointer-events-none -z-0" />

      {/* Cybernetic Laser Beam across Top Edge */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.8)] z-20" />

      {/* Top Coding Studio Cockpit & Telemetry Ribbon */}
      <div className="px-3.5 sm:px-5 py-2.5 border-b border-zinc-800/80 bg-[#070b13]/90 backdrop-blur-xl flex items-center justify-between flex-wrap gap-2.5 z-10 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        {/* Left: Studio Branding & Online Heartbeat */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 via-emerald-600/15 to-cyan-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Code2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b13] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white tracking-wider">
                {t.niximaCode.heroTitle}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-950/90 to-cyan-950/90 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {t.niximaCode.titanCoderBadge}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-emerald-400/90 font-semibold">AST PARSER ONLINE</span>
              <span className="text-zinc-600">•</span>
              <span>2M TOKEN HORIZON</span>
            </div>
          </div>
        </div>

        {/* Center / Right: High-Tech Telemetry Chips & Studio Quick Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Locked Model Pill with Holographic Sheen */}
          <div 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-950/60 to-zinc-900/90 border border-emerald-500/40 text-emerald-200 text-[11px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)]"
            title={t.niximaCode.exclusiveEngineNotice}
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="font-bold tracking-tight">Nixima-0.3 Coder</span>
            <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
              LOCKED
            </span>
          </div>

          {/* DeepThinking V3.0 Proof Engine Badge */}
          <div 
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono shadow-[0_0_10px_rgba(6,182,212,0.12)]"
            title="DeepThinking V3.0 formal proof and epistemic bounds verification active"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">V3.0 Proof Engine</span>
          </div>

          {/* Zero-Laziness Active Badge */}
          <div 
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[11px] font-mono shadow-[0_0_10px_rgba(245,158,11,0.12)]"
            title={t.niximaCode.zeroLazinessDesc}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>100% Complete Code</span>
          </div>

          {/* Quick Action: New Project */}
          {onNewProject && (
            <button
              type="button"
              onClick={onNewProject}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700/80 text-[11px] font-mono transition-all cursor-pointer shadow-sm active:scale-95"
              title="Start a brand new code project"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>{language === 'uk' ? 'Новий проєкт' : 'New Project'}</span>
            </button>
          )}

          {/* Quick Action: Split View Toggle for Active Canvas */}
          {activeCanvasArtifact && onToggleCanvas && (
            <button
              type="button"
              onClick={onToggleCanvas}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all cursor-pointer select-none ${
                isCanvasOpen
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'bg-zinc-900 border-zinc-750 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Toggle split view with Nixima Canvas Studio"
            >
              <Split className="w-3 h-3 text-emerald-400" />
              <span>Canvas Split</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-grid-pattern min-w-0 relative z-10 scrollbar-thin scrollbar-thumb-zinc-800">
        {isConversationEmpty ? (
          /* =========================================================================
             HERO & ARCHITECTURE BLUEPRINTS STATION (WHEN EMPTY)
             ========================================================================= */
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
            {/* Holographic Hero Card */}
            <div className="relative p-6 sm:p-8 rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#0e1625]/90 via-[#090e18]/85 to-[#060910]/95 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] text-center overflow-hidden">
              {/* Internal Radiant Aura */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[160px] bg-emerald-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-1/4 w-[300px] h-[140px] bg-cyan-500/10 blur-3xl pointer-events-none" />

              {/* Status Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-[11px] font-mono mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-semibold">{t.niximaCode.heroBadge}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-cyan-300">{t.niximaCode.deepThinkingV3Active}</span>
              </div>

              {/* Holographic Gradient Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-cyan-300 tracking-tight font-sans mb-3">
                {language === 'uk' ? 'Автономний нейроінженер коду' : 'Autonomous AI Software Engineer'}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-300/90 max-w-2xl mx-auto font-mono leading-relaxed mb-6">
                {t.niximaCode.exclusiveEngineNotice}
              </p>

              {/* 4 Capability Guarantees Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-left pt-2 border-t border-zinc-800/80">
                <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-850 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="text-[10px] font-mono leading-tight">
                    <div className="font-bold text-zinc-200">Zero Laziness</div>
                    <div className="text-zinc-500">100% full files</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-850 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div className="text-[10px] font-mono leading-tight">
                    <div className="font-bold text-zinc-200">Formal Proof</div>
                    <div className="text-zinc-500">DeepThinking V3</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-850 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-[10px] font-mono leading-tight">
                    <div className="font-bold text-zinc-200">Live Canvas</div>
                    <div className="text-zinc-500">60fps execution</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-850 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="text-[10px] font-mono leading-tight">
                    <div className="font-bold text-zinc-200">2M Context</div>
                    <div className="text-zinc-500">Full repositories</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Presets & Starter Blueprints */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  {t.niximaCode.quickPresetsTitle}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {language === 'uk' ? '1 клік для завантаження в термінал' : 'Click any blueprint to arm prompt'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Interactive Canvas Game */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetGamePrompt,
                    'generate',
                    'html'
                  )}
                  className="group p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0a141b]/80 via-[#070e14]/70 to-[#04080d]/90 hover:border-emerald-400 hover:shadow-[0_10px_35px_rgba(16,185,129,0.22)] transition-all duration-200 cursor-pointer select-none relative overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
                  
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <Play className="w-4 h-4 fill-emerald-400/30 text-emerald-400" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors block font-sans">
                          {t.niximaCode.presetGameTitle}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> 60 FPS Loop • WebAudio
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                      HTML5 Canvas
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-sans">
                    {t.niximaCode.presetGameDesc}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-emerald-400">
                    <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Runs live in Canvas</span>
                    <span className="flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      {language === 'uk' ? 'Запустити' : 'Arm Blueprint'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 2. Full-Stack Component */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetComponentPrompt,
                    'generate',
                    'tsx'
                  )}
                  className="group p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#09151e]/80 via-[#060e15]/70 to-[#04080d]/90 hover:border-cyan-400 hover:shadow-[0_10px_35px_rgba(6,182,212,0.22)] transition-all duration-200 cursor-pointer select-none relative overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors block font-sans">
                          {t.niximaCode.presetComponentTitle}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400/90 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> React 19 • Tailwind CSS
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                      React (TSX)
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-sans">
                    {t.niximaCode.presetComponentDesc}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-cyan-400">
                    <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Zero external UI libs</span>
                    <span className="flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      {language === 'uk' ? 'Запустити' : 'Arm Blueprint'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 3. High-Performance Algorithm */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetAlgoPrompt,
                    'architect',
                    'typescript'
                  )}
                  className="group p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#130d22]/80 via-[#0d0917]/70 to-[#06040c]/90 hover:border-purple-400 hover:shadow-[0_10px_35px_rgba(168,85,247,0.22)] transition-all duration-200 cursor-pointer select-none relative overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <Cpu className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors block font-sans">
                          {t.niximaCode.presetAlgoTitle}
                        </span>
                        <span className="text-[10px] font-mono text-purple-400/90 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> O(1) Amortized Complexity
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                      TypeScript O(1)
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-sans">
                    {t.niximaCode.presetAlgoDesc}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-purple-400">
                    <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Zero recursion leaks</span>
                    <span className="flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      {language === 'uk' ? 'Запустити' : 'Arm Blueprint'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 4. AST Refactor & Bug Fix */}
                <div
                  onClick={() => handlePresetSelect(
                    t.niximaCode.presetRefactorPrompt,
                    'refactor',
                    'typescript'
                  )}
                  className="group p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1c1409]/80 via-[#130d06]/70 to-[#080502]/90 hover:border-amber-400 hover:shadow-[0_10px_35px_rgba(245,158,11,0.22)] transition-all duration-200 cursor-pointer select-none relative overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors block font-sans">
                          {t.niximaCode.presetRefactorTitle}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Zero-Defect AST Fix
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
                      Full Rewrite
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-sans">
                    {t.niximaCode.presetRefactorDesc}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-amber-400">
                    <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Unit test suites included</span>
                    <span className="flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      {language === 'uk' ? 'Запустити' : 'Arm Blueprint'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             ACTIVE CODE ASSISTANT CONVERSATION STREAM
             ========================================================================= */
          <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-48 pt-4">
            {/* Floating Project Header Bar */}
            <div className="mb-4 p-3 rounded-2xl bg-[#080d16]/80 backdrop-blur-xl border border-zinc-800/80 flex items-center justify-between flex-wrap gap-2 text-xs font-mono shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                <FolderCode className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-bold text-white truncate max-w-xs sm:max-w-md">
                  {conversation.title || 'Code Project'}
                </span>
                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  {conversation.messages.filter(m => m.role === 'assistant').length} {language === 'uk' ? 'генерацій' : 'revisions'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onNewProject && (
                  <button
                    type="button"
                    onClick={onNewProject}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'uk' ? 'Новий проєкт' : 'New Project'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Messages */}
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
            <div ref={messagesEndRef} className="h-6" />
          </div>
        )}
      </div>

      {/* =========================================================================
          CENTERPIECE DOCKED IDE CODE INPUT TERMINAL ("1000X BETTER DESIGN BOX")
          ========================================================================= */}
      <div className="border-t border-zinc-800/90 bg-[#060a12]/95 backdrop-blur-2xl p-3 sm:p-5 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(16,185,129,0.12)]">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Top Control Strip (Task Mode Pills, Language Dropdown, Context Attachment) */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap text-xs font-mono">
            {/* Task Type Segmented Buttons */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-zinc-850 overflow-x-auto scrollbar-none py-0.5">
              {(
                [
                  { key: 'generate', label: t.niximaCode.taskTypeGenerate, icon: Zap, color: 'text-emerald-400' },
                  { key: 'refactor', label: t.niximaCode.taskTypeRefactor, icon: Workflow, color: 'text-cyan-400' },
                  { key: 'debug', label: t.niximaCode.taskTypeDebug, icon: Bug, color: 'text-rose-400' },
                  { key: 'architect', label: t.niximaCode.taskTypeArchitect, icon: Cpu, color: 'text-purple-400' },
                  { key: 'test', label: t.niximaCode.taskTypeTest, icon: TestTube, color: 'text-amber-400' },
                ] as const
              ).map(({ key, label, icon: Icon, color }) => {
                const isActive = taskType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTaskType(key as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none whitespace-nowrap text-[11px] font-semibold ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-950/90 to-zinc-900 border border-emerald-500/50 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? color : 'text-zinc-500'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Selector & Snippet Attachment Strip */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Language Selector */}
              <div className="relative flex items-center">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-black/50 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-[11.5px] font-mono pl-3 pr-7 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500/50 cursor-pointer transition-all shadow-inner"
                >
                  <option value="typescript">TypeScript (.ts)</option>
                  <option value="tsx">React (.tsx)</option>
                  <option value="html">HTML5 Canvas (.html)</option>
                  <option value="python">Python (.py)</option>
                  <option value="rust">Rust (.rs)</option>
                  <option value="go">Go (.go)</option>
                  <option value="css">Tailwind / CSS (.css)</option>
                  <option value="sql">SQL (.sql)</option>
                  <option value="cpp">C++ (.cpp)</option>
                  <option value="swift">Swift (.swift)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
              </div>

              {/* Attach Code Snippet Context Toggle */}
              <button
                type="button"
                onClick={() => setIsContextDrawerOpen(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-mono border transition-all cursor-pointer ${
                  codeContext.trim()
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : isContextDrawerOpen
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
                title="Attach code snippet for AI Assistant context"
              >
                <FileCode className="w-3.5 h-3.5 text-current" />
                <span>
                  {codeContext.trim() 
                    ? `Context Attached (${contextLines} lines)` 
                    : t.niximaCode.attachCodeContext}
                </span>
                {codeContext.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
                {isContextDrawerOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              {/* Quick Canvas Import Button if active artifact exists */}
              {activeCanvasArtifact && (
                <button
                  type="button"
                  onClick={handleImportActiveCanvas}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-sm cursor-pointer"
                  title="Import current active code from Canvas into prompt context"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Import Canvas: <span className="underline">{activeCanvasArtifact.title}</span></span>
                </button>
              )}
            </div>
          </div>

          {/* Expandable Snippet / Code Context Drawer (Mini Monaco Editor Window) */}
          {isContextDrawerOpen && (
            <div className="p-3.5 rounded-2xl border border-cyan-500/40 bg-[#050b14]/95 animate-fade-in space-y-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="text-xs font-mono font-bold text-cyan-200 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    context_snippet.{selectedLanguage === 'tsx' ? 'tsx' : selectedLanguage === 'html' ? 'html' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'rust' ? 'rs' : selectedLanguage === 'go' ? 'go' : 'ts'}
                  </span>
                  {contextLines > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {contextLines} lines
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeCanvasArtifact && (
                    <button
                      type="button"
                      onClick={handleImportActiveCanvas}
                      className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Sync with Canvas
                    </button>
                  )}
                  {codeContext.trim() && (
                    <button
                      type="button"
                      onClick={() => setCodeContext('')}
                      className="text-[11px] font-mono text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      {t.niximaCode.clearContext}
                    </button>
                  )}
                </div>
              </div>

              <div className="relative rounded-xl border border-zinc-800 bg-[#030509] overflow-hidden focus-within:border-cyan-500/60 transition-colors">
                <textarea
                  value={codeContext}
                  onChange={(e) => setCodeContext(e.target.value)}
                  placeholder={t.niximaCode.contextDrawerPlaceholder}
                  rows={5}
                  className="w-full bg-transparent p-3 font-mono text-xs text-cyan-100 placeholder-zinc-600 focus:outline-none resize-y leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700"
                />
              </div>
            </div>
          )}

          {/* Main Neon Code Prompt Textarea Container */}
          <div className="relative rounded-2xl border border-emerald-500/40 bg-[#080d16] shadow-[0_0_30px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all focus-within:border-emerald-400 focus-within:shadow-[0_0_45px_rgba(16,185,129,0.25)]">
            <div className="flex items-start">
              {/* Left Terminal Prompt Glyph Gutter */}
              <div className="pt-4 pl-4 pr-1 text-emerald-400 select-none font-mono text-sm font-bold flex items-center gap-1 opacity-80">
                <span>❯</span>
              </div>

              {/* Textarea */}
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
            </div>

            {/* Bottom Bar inside Input Box */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800/80 bg-zinc-950/70 rounded-b-2xl text-xs font-mono">
              <div className="flex items-center gap-2.5 flex-wrap text-zinc-400 text-[11px]">
                {/* Zero-Laziness Active Switch */}
                <button
                  type="button"
                  onClick={() => setZeroLaziness(prev => !prev)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none ${
                    zeroLaziness
                      ? 'bg-gradient-to-r from-emerald-950/80 to-amber-950/50 border-emerald-500/50 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}
                  title={t.niximaCode.zeroLazinessDesc}
                >
                  <Zap className={`w-3.5 h-3.5 ${zeroLaziness ? 'text-amber-400 fill-amber-400/20' : 'text-zinc-600'}`} />
                  <span className="font-bold">{t.niximaCode.zeroLazinessActive}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${zeroLaziness ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                </button>

                <span className="hidden sm:inline-block text-zinc-600">•</span>
                
                {/* Formal Proof Telemetry Label */}
                <span className="hidden md:inline-flex items-center gap-1 text-zinc-400">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Formal AST Proof Active</span>
                </span>

                <span className="hidden sm:inline-block text-zinc-600">•</span>
                
                {/* Keyboard Shortcut Indicator */}
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                  Ctrl + Enter
                </span>
              </div>

              {/* Action Buttons: Stop / High-Voltage Dispatch */}
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <button
                    type="button"
                    onClick={onStopGeneration}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 border border-rose-600/80 text-rose-200 hover:bg-rose-900/90 text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-md select-none ${
                      prompt.trim()
                        ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 hover:scale-[1.02]'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                    }`}
                  >
                    <Terminal className="w-4 h-4 stroke-[2.5]" />
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
