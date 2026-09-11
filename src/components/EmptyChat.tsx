import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  ArrowRight,
  Shield,
  Zap,
  Code2,
  BarChart3,
  TrendingUp,
  LineChart,
  ArrowUpRight
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { useLanguage } from '../context/LanguageContext';
import { ReleaseAnnouncementCard } from './ReleaseAnnouncementCard';
import { NiximaWordmark, renderWithNiximaBrand } from './NiximaWordmark';
import { NiximaIdLogo } from './NiximaIdLogo';
import { ModelIcon } from './ModelIcon';

interface EmptyChatProps {
  currentModel: ModelOption;
  onSelectPrompt: (prompt: string) => void;
  onSelectModel?: (model: ModelOption) => void;
  onOpenReleaseModal?: () => void;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({
  currentModel,
  onSelectPrompt,
  onSelectModel,
  onOpenReleaseModal
}) => {
  const { t } = useLanguage();

  const promptIcons = [
    <Terminal className="w-4 h-4 text-zinc-300" />,
    <Cpu className="w-4 h-4 text-zinc-300" />,
    <Code2 className="w-4 h-4 text-zinc-300" />,
    <Zap className="w-4 h-4 text-zinc-300" />,
  ];

  const promptSuggestions = t.emptyChat.promptCards.map((card, idx) => ({
    icon: promptIcons[idx % promptIcons.length],
    title: card.title,
    prompt: card.prompt,
    category: card.category,
  }));

  const getChartChipMeta = (chartType?: string, index?: number) => {
    const type = chartType || (index === 0 ? 'bar' : index === 1 ? 'area' : index === 2 ? 'line' : 'pyramid');
    switch (type) {
      case 'bar':
        return {
          icon: <BarChart3 className="w-3.5 h-3.5" />,
          badgeBg: 'bg-cyan-950/80',
          badgeBorder: 'border-cyan-500/50',
          badgeColor: 'text-cyan-300',
          badgeShadow: 'shadow-[0_0_10px_rgba(6,182,212,0.25)]',
          tagStyle: 'bg-cyan-950/60 text-cyan-300 border-cyan-600/40',
          cardHover: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
        };
      case 'area':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5" />,
          badgeBg: 'bg-purple-950/80',
          badgeBorder: 'border-purple-500/50',
          badgeColor: 'text-purple-300',
          badgeShadow: 'shadow-[0_0_10px_rgba(168,85,247,0.25)]',
          tagStyle: 'bg-purple-950/60 text-purple-300 border-purple-600/40',
          cardHover: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
        };
      case 'line':
        return {
          icon: <LineChart className="w-3.5 h-3.5" />,
          badgeBg: 'bg-emerald-950/80',
          badgeBorder: 'border-emerald-500/50',
          badgeColor: 'text-emerald-300',
          badgeShadow: 'shadow-[0_0_10px_rgba(16,185,129,0.25)]',
          tagStyle: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40',
          cardHover: 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        };
      case 'pyramid':
      default:
        return {
          icon: <Layers className="w-3.5 h-3.5" />,
          badgeBg: 'bg-amber-950/80',
          badgeBorder: 'border-amber-500/50',
          badgeColor: 'text-amber-300',
          badgeShadow: 'shadow-[0_0_10px_rgba(245,158,11,0.25)]',
          tagStyle: 'bg-amber-950/60 text-amber-300 border-amber-600/40',
          cardHover: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full text-center select-none animate-fade-in">
      {/* Nixima 0.2 Generation Release Announcement Card */}
      {onSelectModel && onOpenReleaseModal && (
        <ReleaseAnnouncementCard
          currentModel={currentModel}
          onSelectModel={onSelectModel}
          onOpenReleaseModal={onOpenReleaseModal}
        />
      )}

      {/* Brand Hero Signature Wordmark */}
      <div className="mb-5 flex items-center justify-center gap-3">
        <NiximaIdLogo size={36} glow animated />
        <NiximaWordmark
          size="hero"
          variant="sheen"
          glow
          withAi
          aiStyle="pill"
        />
      </div>

      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/60 mb-6 shadow-inner-light">
        <ModelIcon modelId={currentModel.id} size="xs" />
        <span className="text-xs font-mono text-zinc-300">
          {renderWithNiximaBrand(t.emptyChat.brandBadge(currentModel.name))}
        </span>
      </div>

      {/* Hero Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-sans">
        {t.emptyChat.heroTitle}
      </h1>

      <p className="text-sm text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed">
        {renderWithNiximaBrand(t.emptyChat.heroSubtitle(currentModel.name))}
      </p>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 rounded-xl bg-[#121215] hover:bg-[#18181d] border border-zinc-800 hover:border-zinc-600 transition-all duration-200 flex flex-col justify-between text-left shadow-lg hover:shadow-glow-subtle"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                {item.category}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white flex items-center gap-1.5">
                {item.title}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Visualizations & Graphs Quick Launch */}
      {t.emptyChat.graphChips && (
        <div className="mt-8 w-full space-y-3 text-left animate-fade-in">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                <BarChart3 className="w-3 h-3" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                {t.emptyChat.graphSectionTitle}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                NEW
              </span>
            </div>
            {t.emptyChat.graphSectionSubtitle && (
              <span className="hidden sm:inline-block text-[11px] font-sans text-zinc-500">
                {t.emptyChat.graphSectionSubtitle}
              </span>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {t.emptyChat.graphChips.map((chip, cIdx) => {
              const meta = getChartChipMeta(chip.chartType, cIdx);
              const cleanTitle = (chip.title || '').replace(/^[\p{Emoji}\s]+/u, '').trim();

              return (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => onSelectPrompt(chip.prompt)}
                  className={`p-3.5 rounded-2xl bg-gradient-to-b from-[#131318]/90 via-[#0e0e13]/95 to-[#09090c]/98 border border-zinc-800/80 ${meta.cardHover} transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 min-h-[120px]`}
                >
                  {/* Top Bar: Glowing Micro Icon Badge + Category Tag + Arrow */}
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className={`p-1.5 rounded-lg border flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeColor} ${meta.badgeShadow}`}>
                      {meta.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {chip.tag && (
                        <span className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border uppercase ${meta.tagStyle}`}>
                          {chip.tag}
                        </span>
                      )}
                      <div className="w-5 h-5 rounded-md bg-zinc-850/80 group-hover:bg-zinc-800 border border-zinc-750/70 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title and Prompt */}
                  <div className="space-y-1 w-full flex-1 flex flex-col justify-between">
                    <h4 className="font-semibold text-xs text-zinc-100 group-hover:text-white leading-snug tracking-tight font-sans transition-colors line-clamp-1">
                      {cleanTitle}
                    </h4>
                    <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 line-clamp-2 leading-relaxed font-sans transition-colors">
                      {chip.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature stats footer */}
      <div className="mt-12 pt-6 border-t border-zinc-800/80 w-full grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold font-mono text-white">
            {currentModel.contextWindow.split(' ')[0]}
          </div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">{t.emptyChat.contextWindowLabel}</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-white">
            {currentModel.latency}
          </div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">{t.emptyChat.throughputLabel}</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-white">
            99.98%
          </div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">{t.emptyChat.precisionSlaLabel}</div>
        </div>
      </div>
    </div>
  );
};
