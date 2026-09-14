import React, { useEffect, useState } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  Terminal, 
  Zap, 
  Cpu, 
  Gauge, 
  Check, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Coins,
  Activity,
  BarChart3,
  Globe,
  Eye,
  Workflow
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { NIXIMA_MODELS } from '../data/models';
import { useLanguage } from '../context/LanguageContext';
import { NiximaIdLogo } from './NiximaIdLogo';
import { ModelIcon } from './ModelIcon';
import { renderWithNiximaBrand } from './NiximaWordmark';

interface ReleaseAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onOpenBenchmarks?: () => void;
}

export const ReleaseAnnouncementModal: React.FC<ReleaseAnnouncementModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
  onOpenBenchmarks,
}) => {
  const { language, t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'0.4' | '0.3' | '0.2'>('0.4');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getModelIcon = (id: string, size: 'xs' | 'sm' | 'md' = 'sm') => {
    return <ModelIcon modelId={id} size={size} />;
  };

  const model04 = NIXIMA_MODELS.find(m => m.id === 'nixima-0.4') || NIXIMA_MODELS[0];
  const displayedModels = NIXIMA_MODELS.filter(m => m.generation === selectedTab);

  const is04Selected = currentModel.id === 'nixima-0.4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 select-none animate-fade-in">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#0d0d12] border border-zinc-700/90 shadow-[0_16px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden text-zinc-100 z-10">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/90 bg-gradient-to-r from-zinc-950 via-[#121217] to-zinc-950 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <ModelIcon modelId="nixima-0.4" size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 text-black uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                  {renderWithNiximaBrand(t.releaseAnnouncement.badge)}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {language === 'uk' ? 'Офіційний реліз' : 'Official Release'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {renderWithNiximaBrand(t.releaseAnnouncement.modalTitle)}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            title={t.releaseAnnouncement.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Subtitle / Intro */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            <p>
              {renderWithNiximaBrand(t.releaseAnnouncement.modalSubtitle)}
            </p>
          </div>

          {/* Featured Nixima-0.4 Spotlight Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-zinc-900/90 to-emerald-950/25 p-5 sm:p-6 shadow-[0_8px_32px_rgba(245,158,11,0.12),inset_0_1px_0_rgba(245,158,11,0.2)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                    {language === 'uk' ? 'Нова парадигма: Все-в-одному' : 'New Paradigm: All-in-One'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    #1 Sovereign Rank • 2048 Elo
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/60 border border-amber-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                    <ModelIcon modelId="nixima-0.4" size="sm" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Nixima-0.4</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white text-black font-extrabold uppercase">
                      OMNI FLAGSHIP
                    </span>
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {language === 'uk' 
                    ? 'У поколінні 0.4 ми змінили нашу політику: Nixima-0.4 є базовою і єдиною моделлю лінійки. Базове ім’я вже є omni-моделлю — немає потреби створювати окремі варіанти чи додавати суфікси (-Pro, -Coder, -Flash). Глибокі формальні доведення DeepThinking V3.0, інженерія системного коду, мультимодальний зір, 7-кластерний пошуковий рій та 4M контекст об’єднані в єдиному суверенному інтелекті.'
                    : 'In Generation 0.4, we changed our architecture policy: Nixima-0.4 is the base and sole model of this generation. The base name is already an omni model — there is no need to append "-O" or fragment into separate models (-Pro, -Coder, -Flash). Formal DeepThinking V3.0 proof reasoning, production systems engineering, multimodal vision, 7-cluster live search swarm, and a 4M continuous context window are natively united in one sovereign engine.'}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-900/80 border border-amber-500/30 text-amber-300 font-semibold">
                    4,000,000 Tokens
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 font-semibold">
                    DeepThinking V3.0
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-900/80 border border-cyan-500/30 text-cyan-300 font-semibold">
                    7-Cluster Dual-Tool Swarm
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-900/80 border border-zinc-700 text-zinc-300">
                    Zero Fragmentation
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onSelectModel(model04);
                    onClose();
                  }}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.25)] ${
                    is04Selected
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 cursor-default'
                      : 'bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 text-black hover:opacity-90 active:scale-95'
                  }`}
                >
                  {is04Selected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{t.releaseAnnouncement.activeNow}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>{language === 'uk' ? 'Активувати Nixima-0.4' : 'Activate Nixima-0.4'}</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <span>10 CR / msg</span>
                  <span>•</span>
                  <span>1.0x Rate</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">100.0 Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key Architectural Breakthroughs */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">
              {t.releaseAnnouncement.keyHighlightsTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>{t.releaseAnnouncement.highlight1Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {renderWithNiximaBrand(t.releaseAnnouncement.highlight1Desc)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>{t.releaseAnnouncement.highlight2Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {renderWithNiximaBrand(t.releaseAnnouncement.highlight2Desc)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>{t.releaseAnnouncement.highlight3Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {renderWithNiximaBrand(t.releaseAnnouncement.highlight3Desc)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>{t.releaseAnnouncement.highlight4Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {renderWithNiximaBrand(t.releaseAnnouncement.highlight4Desc)}
                </p>
              </div>
            </div>
          </div>

          {/* Model Fleet Explorer with Generation Tabs */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">
                {language === 'uk' ? 'Модельний ряд Nixima Intelligence' : 'Nixima Intelligence Model Fleet'}
              </h3>

              {/* Generation filter tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSelectedTab('0.4')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTab === '0.4'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>0.4 Omni</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('0.3')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTab === '0.3'
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>0.3 Frontier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('0.2')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTab === '0.2'
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>0.2 Sovereign</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {displayedModels.map((model) => {
                const isSelected = currentModel.id === model.id;
                const modelTr = t.models[model.id] || model;

                return (
                  <div
                    key={model.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? model.generation === '0.4'
                          ? 'bg-amber-950/20 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                          : 'bg-zinc-800/90 border-white/70 shadow-[0_0_25px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      {/* Top bar */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          {getModelIcon(model.id, 'md')}
                          <div>
                            <div className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                              <span>{renderWithNiximaBrand(modelTr.name || model.name)}</span>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />}
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {model.parameters}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isSelected 
                            ? model.generation === '0.4' ? 'bg-amber-400 text-black' : 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {modelTr.badge || model.badge}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {renderWithNiximaBrand(modelTr.description || model.description)}
                      </p>

                      {/* Strengths Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(modelTr.strengths || model.strengths).map((str, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                          >
                            {str}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Specs & Activation CTA */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-3">
                        <span>{model.contextWindow}</span>
                        <span>•</span>
                        <span>{model.latency}</span>
                        <span>•</span>
                        <span className="text-zinc-300">{model.baseCreditCost} CR</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectModel(model);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-zinc-700/80 text-zinc-300 cursor-default'
                            : model.generation === '0.4'
                              ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 text-black hover:opacity-90 active:scale-95 shadow-sm'
                              : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-sm'
                        }`}
                      >
                        {isSelected ? t.releaseAnnouncement.activeNow : t.releaseAnnouncement.activateModel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/90 bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
          {onOpenBenchmarks && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBenchmarks();
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{language === 'uk' ? 'Відкрити Офіційну Студію Бенчмарків' : 'Open Official Benchmarks Studio'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              {t.releaseAnnouncement.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
