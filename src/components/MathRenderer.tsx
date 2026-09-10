import React, { useState, useMemo } from 'react';
import katex from 'katex';
import { Copy, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { playCompletionChime } from '../utils/sound';

export interface MathRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  displayMode = false,
  className = '',
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const cleanFormula = useMemo(() => {
    let raw = math.trim();
    // Strip redundant outer display wrappers if present
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      raw = raw.slice(2, -2).trim();
    } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
      raw = raw.slice(2, -2).trim();
    } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
      raw = raw.slice(2, -2).trim();
    } else if (raw.startsWith('$') && raw.endsWith('$')) {
      raw = raw.slice(1, -1).trim();
    }
    return raw;
  }, [math]);

  const { html, isError } = useMemo(() => {
    try {
      const rendered = katex.renderToString(cleanFormula, {
        displayMode,
        throwOnError: false,
        errorColor: '#f87171',
        strict: false,
        trust: true,
      });
      return { html: rendered, isError: false };
    } catch (err: any) {
      return {
        html: `<span class="katex-error">${cleanFormula}</span>`,
        isError: true,
      };
    }
  }, [cleanFormula, displayMode]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(cleanFormula);
      setCopied(true);
      playCompletionChime();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!displayMode) {
    return (
      <span
        className={`inline-block px-1 py-0.5 mx-0.5 rounded bg-zinc-900/70 border border-zinc-800/60 text-zinc-100 font-serif align-middle transition-colors hover:bg-zinc-800/80 select-text ${className}`}
        title={`LaTeX: ${cleanFormula}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={`group/math relative my-3 rounded-2xl bg-[#0f0f13]/95 border border-zinc-800/90 hover:border-zinc-700/90 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
    >
      {/* Top Header Strip */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-zinc-800/80 bg-zinc-950/70 text-[10px] font-mono select-none">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse" />
          <span className="font-semibold text-zinc-300 uppercase tracking-wider">
            {t.chatMessage.formulaBadge}
          </span>
          <span className="hidden sm:inline-block text-[9px] text-zinc-600">
            • KaTeX
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-zinc-800/90 text-zinc-400 hover:text-white transition-all cursor-pointer text-[10px]"
          title={copied ? t.chatMessage.copiedLatex : t.chatMessage.copyLatex}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
              <span className="text-emerald-400 font-semibold">{t.chatMessage.copiedLatex}</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>{t.chatMessage.copyLatex}</span>
            </>
          )}
        </button>
      </div>

      {/* Rendered Equation Area with horizontal smooth scrolling */}
      <div className="p-4 sm:p-5 overflow-x-auto text-center font-serif text-zinc-100 flex items-center justify-center min-h-[50px] scrollbar-thin">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};
