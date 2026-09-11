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
  BarChart3
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
        <div className="mt-6 w-full space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.emptyChat.graphSectionTitle}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              NEW
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {t.emptyChat.graphChips.map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                onClick={() => onSelectPrompt(chip.prompt)}
                className="p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 transition-all text-left flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-glow-subtle"
              >
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white flex items-center justify-between">
                  <span>{chip.title}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
                </span>
                <span className="text-[10px] font-mono text-zinc-400 line-clamp-1 mt-1">
                  {chip.prompt}
                </span>
              </button>
            ))}
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
