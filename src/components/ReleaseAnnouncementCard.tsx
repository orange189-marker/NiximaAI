import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Terminal, 
  Zap, 
  ArrowRight, 
  X, 
  Check, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { NIXIMA_MODELS } from '../data/models';
import { useLanguage } from '../context/LanguageContext';
import { renderWithNiximaBrand } from './NiximaWordmark';

interface ReleaseAnnouncementCardProps {
  currentModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onOpenReleaseModal: () => void;
}

const DISMISS_KEY = 'nixima_release_0_2_card_dismissed';

export const ReleaseAnnouncementCard: React.FC<ReleaseAnnouncementCardProps> = ({
  currentModel,
  onSelectModel,
  onOpenReleaseModal,
}) => {
  const { t } = useLanguage();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem(DISMISS_KEY) === 'true';
  });

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  const handleRestore = () => {
    setIsDismissed(false);
    localStorage.removeItem(DISMISS_KEY);
  };

  const getModelIcon = (id: string) => {
    if (id.includes('pro') || id.includes('reasoning')) {
      return <BrainCircuit className="w-4 h-4 text-purple-400" />;
    }
    if (id.includes('coder')) {
      return <Terminal className="w-4 h-4 text-emerald-400" />;
    }
    if (id.includes('flash')) {
      return <Zap className="w-4 h-4 text-amber-400" />;
    }
    return <Sparkles className="w-4 h-4 text-white" />;
  };

  // If dismissed, render a subtle compact teaser pill that can be clicked to restore
  if (isDismissed) {
    return (
      <div className="mb-6 animate-fade-in">
        <button
          type="button"
          onClick={handleRestore}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer shadow-sm group"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          </span>
          <span className="font-semibold text-zinc-200">{t.releaseAnnouncement.badge}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
            {t.releaseAnnouncement.detailsBtn}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>
    );
  }

  // Active 0.2 models
  const primaryModels = NIXIMA_MODELS.filter(m => m.id.startsWith('nixima-0.2'));

  return (
    <div className="relative w-full mb-8 rounded-2xl overflow-hidden border border-zinc-700/80 bg-gradient-to-b from-[#14141a]/95 via-[#0e0e13]/95 to-[#09090c]/98 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl animate-fade-in text-left">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-white/[0.03] blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-64 h-24 bg-purple-500/[0.03] blur-2xl pointer-events-none rounded-full" />

      {/* Top row: Badge + Dismiss button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/80 shadow-inner-light">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-white">
            {renderWithNiximaBrand(t.releaseAnnouncement.badge)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer"
          title={t.releaseAnnouncement.dismiss}
          aria-label={t.releaseAnnouncement.dismiss}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Headline & Subheadline */}
      <div className="max-w-2xl mb-5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 font-sans flex items-center gap-2">
          <span>{t.releaseAnnouncement.headline}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-white text-black hidden sm:inline-block">
            v0.2
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {t.releaseAnnouncement.subheadline}
        </p>
      </div>

      {/* 4 Model Quick-Switch Showcase Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
        {primaryModels.map((model) => {
          const isSelected = currentModel.id === model.id;
          const modelTr = t.models[model.id] || model;

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectModel(model)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-zinc-800/90 border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                  : 'bg-zinc-900/60 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center">
                    {getModelIcon(model.id)}
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isSelected ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {modelTr.badge || model.badge}
                  </span>
                </div>

                <div className="font-semibold text-xs sm:text-sm text-white tracking-tight mb-1 flex items-center gap-1.5">
                  <span>{renderWithNiximaBrand(modelTr.name || model.name)}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />}
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-snug mb-2 font-sans">
                  {modelTr.description || model.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{model.contextWindow}</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">
                  {isSelected ? t.releaseAnnouncement.activeNow : model.latency}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenReleaseModal}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_2px_12px_rgba(255,255,255,0.15)] active:scale-95"
          >
            <span>{t.releaseAnnouncement.detailsBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              const flagship = NIXIMA_MODELS.find(m => m.id === 'nixima-0.2');
              if (flagship) onSelectModel(flagship);
            }}
            className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/70 text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            {t.releaseAnnouncement.exploreBtn}
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
          <span>SRA v2 Mesh</span>
          <span>•</span>
          <span>500k-2M Tokens</span>
          <span>•</span>
          <span>Sub-10ms Latency</span>
        </div>
      </div>
    </div>
  );
};
