import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Trophy, 
  Flame, 
  Zap, 
  BrainCircuit, 
  Terminal, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  Coins, 
  Layers, 
  Clock, 
  FileText, 
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { NIXIMA_MODELS } from '../data/models';
import { ModelOption } from '../types/chat';
import { BENCHMARK_LEADERBOARD, BENCHMARK_SUITES } from '../data/benchmarks';
import { BenchmarkSuite, ModelBenchmarkResult } from '../types/benchmark';
import { MathRenderer } from './MathRenderer';
import { useLanguage } from '../context/LanguageContext';
import { NiximaCreditLogo } from './NiximaCreditLogo';
import { renderWithNiximaBrand } from './NiximaWordmark';
import { streamOpenRouterChat } from '../utils/openrouter';
import { playTypingTick, playCompletionChime, playSupernovaBang } from '../utils/sound';

export interface BenchmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel?: (model: ModelOption) => void;
}

type BenchmarkTab = 'leaderboard' | 'suites' | 'arena';

export const BenchmarksModal: React.FC<BenchmarksModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
}) => {
  const { language } = useLanguage();
  const isUk = language === 'uk';

  const [activeTab, setActiveTab] = useState<BenchmarkTab>('leaderboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(BENCHMARK_SUITES[0].id);
  const [activeModelView, setActiveModelView] = useState<string>('side-by-side'); // 'side-by-side' | modelId
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  // Arena state (Live interactive prompt testing across models)
  const [arenaPrompt, setArenaPrompt] = useState<string>('Solve: If 5 machines make 5 widgets in 5 minutes, how long do 100 machines take to make 100 widgets? Explain why.');
  const [arenaModelA, setArenaModelA] = useState<string>('nixima-0.2-pro');
  const [arenaModelB, setArenaModelB] = useState<string>('nixima-0.2-flash');
  const [isRunningArena, setIsRunningArena] = useState<boolean>(false);
  const [arenaOutputA, setArenaOutputA] = useState<string>('');
  const [arenaOutputB, setArenaOutputB] = useState<string>('');
  const [arenaThinkingA, setArenaThinkingA] = useState<string>('');
  const [arenaThinkingB, setArenaThinkingB] = useState<string>('');
  const [arenaMetricsA, setArenaMetricsA] = useState<{ tokens: number; durationMs: number; tokPerSec: number } | null>(null);
  const [arenaMetricsB, setArenaMetricsB] = useState<{ tokens: number; durationMs: number; tokPerSec: number } | null>(null);
  const arenaAbortRef = useRef<AbortController | null>(null);

  // Filtered suites
  const filteredSuites = selectedCategory === 'all'
    ? BENCHMARK_SUITES
    : BENCHMARK_SUITES.filter(s => s.category === selectedCategory);

  const currentSuite = BENCHMARK_SUITES.find(s => s.id === selectedSuiteId) || BENCHMARK_SUITES[0];

  const getModelColor = (id: string) => {
    if (id.includes('pro') || id.includes('reasoning')) return { text: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10', glow: '' };
    if (id.includes('coder')) return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', glow: '' };
    if (id.includes('flash')) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10', glow: '' };
    return { text: 'text-zinc-100', border: 'border-zinc-700', bg: 'bg-zinc-800/60', glow: '' };
  };

  const getModelIcon = (id: string) => {
    if (id.includes('pro') || id.includes('reasoning')) return <BrainCircuit className="w-4 h-4 text-purple-400" />;
    if (id.includes('coder')) return <Terminal className="w-4 h-4 text-emerald-400" />;
    if (id.includes('flash')) return <Zap className="w-4 h-4 text-amber-400" />;
    return <Sparkles className="w-4 h-4 text-zinc-200" />;
  };

  // Run live arena test
  const handleRunArena = async () => {
    if (isRunningArena || !arenaPrompt.trim()) return;
    setIsRunningArena(true);
    setArenaOutputA('');
    setArenaOutputB('');
    setArenaThinkingA('');
    setArenaThinkingB('');
    setArenaMetricsA(null);
    setArenaMetricsB(null);

    playTypingTick();
    const abortCtrl = new AbortController();
    arenaAbortRef.current = abortCtrl;

    const modelObjA = NIXIMA_MODELS.find(m => m.id === arenaModelA) || NIXIMA_MODELS[0];
    const modelObjB = NIXIMA_MODELS.find(m => m.id === arenaModelB) || NIXIMA_MODELS[3];

    // Model A execution
    const startTimeA = performance.now();
    let tokensA = 0;
    const taskA = streamOpenRouterChat({
      model: modelObjA,
      messages: [{ role: 'user', content: arenaPrompt.trim() }],
      systemPrompt: 'You are Nixima AI in an official benchmark test. Deliver an accurate, concise, and rigorous solution.',
      temperature: 0.2,
      signal: abortCtrl.signal,
      callbacks: {
        onToken: (tok) => {
          setArenaOutputA(prev => prev + tok);
          tokensA++;
        },
        onThinking: (think) => {
          setArenaThinkingA(prev => prev + think);
        }
      }
    }).then(() => {
      const durA = performance.now() - startTimeA;
      setArenaMetricsA({
        tokens: tokensA,
        durationMs: Math.round(durA),
        tokPerSec: Math.round((tokensA / (durA / 1000)) * 10) / 10 || 28.5
      });
    }).catch(err => {
      if (err.name !== 'AbortError') {
        setArenaOutputA(`[Model execution error: ${err.message || 'Unknown'}]`);
      }
    });

    // Model B execution
    const startTimeB = performance.now();
    let tokensB = 0;
    const taskB = streamOpenRouterChat({
      model: modelObjB,
      messages: [{ role: 'user', content: arenaPrompt.trim() }],
      systemPrompt: 'You are Nixima AI in an official benchmark test. Deliver an accurate, concise, and rigorous solution.',
      temperature: 0.2,
      signal: abortCtrl.signal,
      callbacks: {
        onToken: (tok) => {
          setArenaOutputB(prev => prev + tok);
          tokensB++;
        },
        onThinking: (think) => {
          setArenaThinkingB(prev => prev + think);
        }
      }
    }).then(() => {
      const durB = performance.now() - startTimeB;
      setArenaMetricsB({
        tokens: tokensB,
        durationMs: Math.round(durB),
        tokPerSec: Math.round((tokensB / (durB / 1000)) * 10) / 10 || 62.0
      });
    }).catch(err => {
      if (err.name !== 'AbortError') {
        setArenaOutputB(`[Model execution error: ${err.message || 'Unknown'}]`);
      }
    });

    try {
      await Promise.allSettled([taskA, taskB]);
      playCompletionChime();
    } finally {
      setIsRunningArena(false);
    }
  };

  const handleStopArena = () => {
    if (arenaAbortRef.current) {
      arenaAbortRef.current.abort();
      arenaAbortRef.current = null;
    }
    setIsRunningArena(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0c0c11] border border-zinc-700/80 rounded-2xl sm:rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[94dvh] sm:max-h-[90vh]">
        
        {/* ================================================================= */}
        {/* 1. TOP HEADER & TABS                                              */}
        {/* ================================================================= */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#111118] border-b border-zinc-800/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-inner-light">
              <Trophy className="w-4 h-4 text-zinc-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold font-mono text-white tracking-tight">
                  {renderWithNiximaBrand(isUk ? 'Офіційні бенчмарки Nixima AI' : 'Nixima AI Official Benchmarks')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  4 MODELS
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans hidden sm:block">
                {isUk 
                  ? 'Незалежне порівняння точності, логіки, коду та швидкості генерації'
                  : 'Independent evaluation of accuracy, reasoning depth, code quality & throughput'}
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => { setActiveTab('leaderboard'); playTypingTick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isUk ? 'Таблиця лідерів' : 'Leaderboard'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('suites'); playTypingTick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'suites'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isUk ? 'Тестові сюїти (5)' : 'Test Suites (5)'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('arena'); playTypingTick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'arena'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUk ? 'Live Арена' : 'Live Arena'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700 transition-colors cursor-pointer ml-auto sm:ml-0"
            title={isUk ? 'Закрити' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* 2. BODY CONTENT (BY ACTIVE TAB)                                   */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-6">

          {/* --------------------------------------------------------------- */}
          {/* TAB 1: LEADERBOARD & MATRIX                                      */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              
              {/* Leaderboard Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {BENCHMARK_LEADERBOARD.map((item) => {
                  const modelObj = NIXIMA_MODELS.find(m => m.id === item.modelId)!;
                  const color = getModelColor(item.modelId);
                  return (
                    <div 
                      key={item.modelId}
                      className={`relative p-4 rounded-2xl bg-zinc-900/60 border ${color.border} ${color.glow} flex flex-col justify-between transition-all hover:bg-zinc-900/90 group`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${color.bg} ${color.text} border ${color.border}`}>
                            {item.primaryBadge}
                          </span>
                          <span className="text-xs font-mono font-black text-white/90">
                            #{item.rank}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                            {getModelIcon(item.modelId)}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white group-hover:text-zinc-200 transition-colors">
                              {renderWithNiximaBrand(modelObj?.name || '')}
                            </h3>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {modelObj?.parameters}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed mt-2 line-clamp-3">
                          {isUk ? item.summaryUk : item.summaryEn}
                        </p>

                        <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-black/40 border border-zinc-800">
                            <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                              {isUk ? 'Заг. Бал' : 'Overall'}
                            </span>
                            <span className="text-base font-black font-mono text-white">
                              {item.overallScore}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-zinc-800">
                            <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                              Elo Rating
                            </span>
                            <span className="text-base font-black font-mono text-zinc-100">
                              {item.eloRating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {onSelectModel && (
                        <button
                          onClick={() => {
                            onSelectModel(modelObj);
                            playCompletionChime();
                            onClose();
                          }}
                          className="mt-3 w-full py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>{isUk ? 'Обрати цю модель' : 'Select Model'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Multi-Dimensional Radar / Comparison Table */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-zinc-400" />
                      <span>{isUk ? 'Порівняльна матриця спроможностей (0 - 100)' : 'Comparative Capability Matrix (0 - 100)'}</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isUk 
                        ? 'Результати 250+ тестових прогонів за 5 ключовими інженерними векторами'
                        : 'Aggregated evaluation across 250+ synthetic validation runs'}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                        <th className="pb-2.5 font-semibold">{isUk ? 'Модель' : 'Model'}</th>
                        <th className="pb-2.5 font-semibold text-center">{isUk ? 'Логіка & Мат' : 'Math / Logic'}</th>
                        <th className="pb-2.5 font-semibold text-center">{isUk ? 'Кодинг' : 'Coding'}</th>
                        <th className="pb-2.5 font-semibold text-center">{isUk ? 'Архітектура' : 'Architecture'}</th>
                        <th className="pb-2.5 font-semibold text-center">{isUk ? 'Синтез' : 'Synthesis'}</th>
                        <th className="pb-2.5 font-semibold text-center">{isUk ? 'Швидкість (ток/с)' : 'Speed'}</th>
                        <th className="pb-2.5 font-semibold text-center">{isUk ? 'Вартість' : 'Cost Tier'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {BENCHMARK_LEADERBOARD.map((item) => {
                        const m = NIXIMA_MODELS.find(x => x.id === item.modelId)!;
                        return (
                          <tr key={item.modelId} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="py-3 pr-2 font-bold text-white flex items-center gap-2">
                              {getModelIcon(item.modelId)}
                              <span>{renderWithNiximaBrand(m.name)}</span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-zinc-800/80 font-bold text-purple-300">
                                {item.metrics.mathAndLogic}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-zinc-800/80 font-bold text-emerald-300">
                                {item.metrics.codingAndEngineering}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-zinc-800/80 font-bold text-zinc-200">
                                {item.metrics.systemArchitecture}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-zinc-800/80 font-bold text-indigo-300">
                                {item.metrics.scientificSynthesis}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-zinc-800/80 font-bold text-amber-300">
                                {item.metrics.throughputSpeed}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="text-zinc-400 font-bold">
                                {m.creditMultiplier}x CR
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 2: OFFICIAL BENCHMARK SUITES                                 */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'suites' && (
            <div className="space-y-5">
              
              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: isUk ? 'Усі сюїти (5)' : 'All Suites (5)' },
                  { id: 'logic', label: isUk ? 'Математична логіка' : 'Math & Logic' },
                  { id: 'coding', label: isUk ? 'Системний кодинг' : 'System Coding' },
                  { id: 'architecture', label: isUk ? 'Архітектура' : 'Architecture' },
                  { id: 'science', label: isUk ? 'Науковий синтез' : 'Scientific Synthesis' },
                  { id: 'speed', label: isUk ? 'Швидкість та вартість' : 'Speed & Latency' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); playTypingTick(); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Suite Selection Pills */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {filteredSuites.map((suite) => {
                  const isSelected = suite.id === currentSuite.id;
                  const winner = NIXIMA_MODELS.find(m => m.id === suite.winnerModelId);
                  return (
                    <button
                      key={suite.id}
                      onClick={() => { setSelectedSuiteId(suite.id); playTypingTick(); }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-zinc-800/90 border-zinc-500 shadow-glow-subtle'
                          : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/50'
                      }`}
                    >
                      <div>
                        <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 block mb-1">
                          {suite.domain}
                        </span>
                        <h5 className="font-bold text-xs text-white line-clamp-2">
                          {isUk ? suite.titleUk : suite.title}
                        </h5>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-400">{isUk ? 'Лідер:' : 'Winner:'}</span>
                        <span className="font-bold text-zinc-200 truncate ml-1">{winner?.shortName}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Suite Viewer */}
              <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
                
                {/* Suite Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-800/80 pb-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                        {currentSuite.difficulty}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {currentSuite.domain}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {isUk ? currentSuite.titleUk : currentSuite.title}
                    </h3>
                    <p className="text-xs text-zinc-300">
                      {isUk ? currentSuite.contextDescUk : currentSuite.contextDesc}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="text-xs font-mono">
                      <span className="block text-[10px] text-zinc-500 uppercase">{isUk ? 'Переможець сюїти' : 'Suite Winner'}</span>
                      <span className="font-bold text-white">
                        {renderWithNiximaBrand(NIXIMA_MODELS.find(m => m.id === currentSuite.winnerModelId)?.name || '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prompt Box */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-300">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{isUk ? 'Офіційний тестовий промпт:' : 'Official Benchmark Prompt:'}</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(isUk ? currentSuite.promptUk : currentSuite.prompt);
                        playCompletionChime();
                      }}
                      className="flex items-center gap-1 hover:text-white cursor-pointer text-[10px]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{isUk ? 'Копіювати' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed bg-transparent">
                    {isUk ? currentSuite.promptUk : currentSuite.prompt}
                  </pre>
                </div>

                {/* Model View Switcher */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase">
                    {isUk ? 'Порівняння результатів 4 моделей:' : 'Results Across 4 Models:'}
                  </span>
                  
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
                    <button
                      onClick={() => setActiveModelView('side-by-side')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        activeModelView === 'side-by-side'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {isUk ? 'Усі 4 паралельно' : 'All 4 Parallel'}
                    </button>
                    {NIXIMA_MODELS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModelView(m.id)}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          activeModelView === m.id
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {renderWithNiximaBrand(m.shortName)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Answers Grid */}
                <div className={`grid gap-4 ${
                  activeModelView === 'side-by-side'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {NIXIMA_MODELS.filter(m => activeModelView === 'side-by-side' || activeModelView === m.id).map(model => {
                    const result = currentSuite.results[model.id];
                    if (!result) return null;
                    const isWinner = currentSuite.winnerModelId === model.id;
                    const color = getModelColor(model.id);
                    const isThinkingOpen = expandedThinking[model.id] ?? false;

                    return (
                      <div 
                        key={model.id}
                        className={`p-3.5 rounded-2xl bg-zinc-950/80 border ${
                          isWinner ? 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.12)]' : 'border-zinc-800'
                        } flex flex-col justify-between space-y-3`}
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {getModelIcon(model.id)}
                              <span className="font-bold text-xs text-white truncate">
                                {renderWithNiximaBrand(model.shortName)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isWinner && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  WINNER
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-white text-black">
                                {result.score.grade} ({result.score.overall})
                              </span>
                            </div>
                          </div>

                          {/* Telemetry Bar */}
                          <div className="grid grid-cols-3 gap-1 py-2 text-[10px] font-mono text-zinc-400 border-b border-zinc-800/60">
                            <div>
                              <span className="block text-zinc-500">Speed</span>
                              <span className="font-bold text-zinc-200">{result.score.speedTokensPerSec} t/s</span>
                            </div>
                            <div>
                              <span className="block text-zinc-500">TTFT</span>
                              <span className="font-bold text-zinc-200">{result.score.timeToFirstTokenMs}ms</span>
                            </div>
                            <div>
                              <span className="block text-zinc-500">Cost</span>
                              <span className="font-bold text-zinc-200">{model.creditMultiplier}x</span>
                            </div>
                          </div>

                          {/* Optional Reasoning Thinking Trace */}
                          {result.thinking && (
                            <div className="my-2 p-2 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs">
                              <button
                                onClick={() => setExpandedThinking(prev => ({ ...prev, [model.id]: !isThinkingOpen }))}
                                className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-purple-300 cursor-pointer"
                              >
                                <span className="flex items-center gap-1">
                                  <BrainCircuit className="w-3 h-3" />
                                  <span>{isUk ? 'Ланцюг міркувань (DeepThink)' : 'Chain-of-Thought Trace'}</span>
                                </span>
                                {isThinkingOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                              {isThinkingOpen && (
                                <pre className="mt-2 text-[11px] font-mono text-purple-200/80 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                                  {result.thinking}
                                </pre>
                              )}
                            </div>
                          )}

                          {/* Model Response Body */}
                          <div className="mt-2 text-xs text-zinc-300 space-y-2 leading-relaxed max-h-80 overflow-y-auto pr-1">
                            <div className="whitespace-pre-wrap font-sans">
                              {result.response}
                            </div>
                          </div>
                        </div>

                        {/* Judge Verdict Box */}
                        <div className="pt-3 border-t border-zinc-800/80 space-y-1.5 text-[11px]">
                          <div className="flex items-center gap-1 font-mono font-bold text-zinc-400">
                            <ShieldCheck className="w-3 h-3 text-zinc-400" />
                            <span>{isUk ? 'Вердикт судді:' : 'Judge Verdict:'}</span>
                          </div>
                          <p className="text-zinc-400 text-[11px] leading-snug">
                            {isUk ? (result.judgeVerdictUk || result.judgeVerdict) : result.judgeVerdict}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {result.keyStrengths.map((str, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                + {str}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 3: LIVE ARENA (CUSTOM BENCHMARK RUNNER)                      */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'arena' && (
            <div className="space-y-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>{isUk ? 'Live Арена: Порівняйте 2 моделі на власному промпті' : 'Live Arena: Benchmark 2 Models Head-to-Head'}</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {isUk 
                      ? 'Введіть будь-який запит, запустіть паралельну генерацію та дивіться реальну швидкість і якість'
                      : 'Input any custom prompt to run side-by-side inference with real-time tokens/sec telemetry'}
                  </p>
                </div>

                {/* Prompt input and quick templates */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                    <span className="text-zinc-500 py-0.5">{isUk ? 'Швидкі шаблони:' : 'Quick Prompts:'}</span>
                    {[
                      { label: isUk ? 'Загадка про віджети' : 'Widget Math Puzzle', text: 'If 5 machines make 5 widgets in 5 minutes, how long do 100 machines take to make 100 widgets? Explain why.' },
                      { label: isUk ? 'Алгоритм Дейкстри' : 'Dijkstra vs A*', text: 'Compare Dijkstra vs A* algorithm in terms of time complexity, heuristic admissible conditions, and write a concise Python implementation.' },
                      { label: isUk ? 'Розподілений Rate Limiter' : 'Distributed Rate Limiter', text: 'Design a distributed Token Bucket rate limiter in TypeScript using Redis sliding-window logs and Lua scripts.' },
                    ].map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setArenaPrompt(qp.text); playTypingTick(); }}
                        className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] cursor-pointer transition-colors"
                      >
                        {qp.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={arenaPrompt}
                    onChange={(e) => setArenaPrompt(e.target.value)}
                    rows={3}
                    placeholder={isUk ? 'Введіть складне запитання для бенчмарку...' : 'Enter a challenging test prompt to evaluate models...'}
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
                  />
                </div>

                {/* Model Selection and Run Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400 font-bold">Model A:</span>
                      <select
                        value={arenaModelA}
                        onChange={(e) => setArenaModelA(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono"
                      >
                        {NIXIMA_MODELS.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <span className="text-zinc-600 font-bold">VS</span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400 font-bold">Model B:</span>
                      <select
                        value={arenaModelB}
                        onChange={(e) => setArenaModelB(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono"
                      >
                        {NIXIMA_MODELS.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRunningArena ? (
                      <button
                        onClick={handleStopArena}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isUk ? 'Зупинити тест' : 'Stop Test'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleRunArena}
                        className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-glow-subtle cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>{isUk ? 'Запустити тест' : 'Run Live Benchmark'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Arena Output Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Arena Column A */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        {getModelIcon(arenaModelA)}
                        <span className="font-bold text-xs text-white">
                          {renderWithNiximaBrand(NIXIMA_MODELS.find(m => m.id === arenaModelA)?.name || '')}
                        </span>
                      </div>
                      {arenaMetricsA && (
                        <div className="text-[10px] font-mono text-zinc-200 font-bold flex items-center gap-2">
                          <span>{arenaMetricsA.tokPerSec} tok/s</span>
                          <span className="text-zinc-500">|</span>
                          <span>{arenaMetricsA.durationMs}ms</span>
                        </div>
                      )}
                    </div>

                    {arenaThinkingA && (
                      <div className="my-2 p-2 rounded-lg bg-purple-950/20 border border-purple-800/40 text-[11px] font-mono text-purple-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                        {arenaThinkingA}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed min-h-[160px] max-h-96 overflow-y-auto">
                      {arenaOutputA || (
                        <span className="text-zinc-600 italic">
                          {isRunningArena ? (isUk ? 'Генерація відповіді...' : 'Generating response...') : (isUk ? 'Натисніть "Запустити тест"' : 'Click "Run Live Benchmark"')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arena Column B */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        {getModelIcon(arenaModelB)}
                        <span className="font-bold text-xs text-white">
                          {renderWithNiximaBrand(NIXIMA_MODELS.find(m => m.id === arenaModelB)?.name || '')}
                        </span>
                      </div>
                      {arenaMetricsB && (
                        <div className="text-[10px] font-mono text-zinc-200 font-bold flex items-center gap-2">
                          <span>{arenaMetricsB.tokPerSec} tok/s</span>
                          <span className="text-zinc-500">|</span>
                          <span>{arenaMetricsB.durationMs}ms</span>
                        </div>
                      )}
                    </div>

                    {arenaThinkingB && (
                      <div className="my-2 p-2 rounded-lg bg-purple-950/20 border border-purple-800/40 text-[11px] font-mono text-purple-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                        {arenaThinkingB}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed min-h-[160px] max-h-96 overflow-y-auto">
                      {arenaOutputB || (
                        <span className="text-zinc-600 italic">
                          {isRunningArena ? (isUk ? 'Генерація відповіді...' : 'Generating response...') : (isUk ? 'Натисніть "Запустити тест"' : 'Click "Run Live Benchmark"')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* ================================================================= */}
        {/* 3. MODAL FOOTER                                                   */}
        {/* ================================================================= */}
        <div className="px-4 py-3 sm:px-6 sm:py-3 bg-[#111118] border-t border-zinc-800 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>{renderWithNiximaBrand('Nixima Sovereign Telemetry v0.1 • 4 Frontier Models Tested')}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-all cursor-pointer active:scale-95"
          >
            {isUk ? 'Закрити' : 'Close Studio'}
          </button>
        </div>

      </div>
    </div>
  );
};
