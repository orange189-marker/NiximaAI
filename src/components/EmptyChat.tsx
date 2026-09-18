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
    let icon = <BarChart3 className="w-3.5 h-3.5" />;
    if (type === 'area') icon = <TrendingUp className="w-3.5 h-3.5" />;
    if (type === 'line') icon = <LineChart className="w-3.5 h-3.5" />;
    if (type === 'pyramid') icon = <Layers className="w-3.5 h-3.5" />;

    return {
      icon,
      badgeBg: 'bg-zinc-850/90',
      badgeBorder: 'border-zinc-700/80',
      badgeColor: 'text-zinc-300 group-hover:text-white',
      badgeShadow: 'shadow-inner-light',
      tagStyle: 'bg-zinc-800/90 text-zinc-300 border-zinc-700/70',
      cardHover: 'hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.6)]',
    };
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

      {/* Brand Hero Signature Wordmark with Atmospheric Radial Halo */}
      <div className="relative mb-6 flex flex-col items-center justify-center">
        <div className="absolute -inset-8 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-center gap-3">
          <NiximaIdLogo size={38} glow animated />
          <NiximaWordmark
            size="hero"
            variant="sheen"
            glow
            withAi
            aiStyle="pill"
          />
        </div>
      </div>

      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.1] mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <ModelIcon modelId={currentModel.id} size="xs" />
        <span className="text-xs font-mono text-zinc-300">
          {renderWithNiximaBrand(t.emptyChat.brandBadge(currentModel.name))}
        </span>
      </div>

      {/* Hero Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 font-sans bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
        {t.emptyChat.heroTitle}
      </h1>

      <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed font-sans">
        {renderWithNiximaBrand(t.emptyChat.heroSubtitle(currentModel.name))}
      </p>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 rounded-2xl bg-gradient-to-b from-[#14141a]/85 to-[#0e0e13]/90 hover:from-[#1c1c24] hover:to-[#121218] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-200 flex flex-col justify-between text-left shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.14)] hover:-translate-y-0.5 cursor-pointer select-none"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-zinc-800/80 border border-white/[0.08] text-zinc-300 group-hover:text-white transition-all group-hover:scale-105 shadow-inner-light">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                {item.category}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white flex items-center gap-1.5 transition-colors">
                {item.title}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
              </h3>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-300 line-clamp-2 leading-relaxed transition-colors">
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
              <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-750 flex items-center justify-center text-zinc-300 shadow-inner-light">
                <BarChart3 className="w-3 h-3" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                {t.emptyChat.graphSectionTitle}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-white text-black">
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
      <div className="mt-12 pt-6 border-t border-white/[0.08] w-full grid grid-cols-3 gap-3.5 text-center">
        <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
            {currentModel.contextWindow.split(' ')[0]}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wider font-mono mt-0.5">{t.emptyChat.contextWindowLabel}</div>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
            {currentModel.latency}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wider font-mono mt-0.5">{t.emptyChat.throughputLabel}</div>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 tracking-tight">
            99.98%
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wider font-mono mt-0.5">{t.emptyChat.precisionSlaLabel}</div>
        </div>
      </div>
    </div>
  );
};
