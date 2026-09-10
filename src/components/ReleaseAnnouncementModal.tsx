import React, { useEffect } from 'react';
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
  BarChart3
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { NIXIMA_MODELS } from '../data/models';
import { useLanguage } from '../context/LanguageContext';
import { NiximaIdLogo } from './NiximaIdLogo';

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

  const getModelIcon = (id: string) => {
    if (id.includes('pro') || id.includes('reasoning')) {
      return <BrainCircuit className="w-5 h-5 text-purple-400" />;
    }
    if (id.includes('coder')) {
      return <Terminal className="w-5 h-5 text-emerald-400" />;
    }
    if (id.includes('flash')) {
      return <Zap className="w-5 h-5 text-amber-400" />;
    }
    return <Sparkles className="w-5 h-5 text-white" />;
  };

  const primaryModels = NIXIMA_MODELS.filter(m => m.id.startsWith('nixima-0.2'));

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
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-inner-light">
              <NiximaIdLogo size={24} glow={false} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-black uppercase tracking-wider">
                  NIXIMA 0.2 GENERATION
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {language === 'uk' ? 'Офіційний реліз' : 'Official Release'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t.releaseAnnouncement.modalTitle}
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
              {t.releaseAnnouncement.modalSubtitle}
            </p>
          </div>

          {/* 3 Key Architectural Breakthroughs */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">
              {t.releaseAnnouncement.keyHighlightsTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{t.releaseAnnouncement.highlight1Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t.releaseAnnouncement.highlight1Desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{t.releaseAnnouncement.highlight2Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t.releaseAnnouncement.highlight2Desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>{t.releaseAnnouncement.highlight3Title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t.releaseAnnouncement.highlight3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Model Specification Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">
              {language === 'uk' ? 'Чотири суверенні моделі лінійки Nixima 0.2' : 'The Four Sovereign Nixima 0.2 Engines'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {primaryModels.map((model) => {
                const isSelected = currentModel.id === model.id;
                const modelTr = t.models[model.id] || model;

                return (
                  <div
                    key={model.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-800/90 border-white/70 shadow-[0_0_25px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      {/* Top bar */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700">
                            {getModelIcon(model.id)}
                          </div>
                          <div>
                            <div className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                              <span>{modelTr.name || model.name}</span>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />}
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {model.parameters}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isSelected ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {modelTr.badge || model.badge}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {modelTr.description || model.description}
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
