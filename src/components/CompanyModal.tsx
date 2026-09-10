import React from 'react';
import { X, Shield, Cpu, Zap, Globe, Sparkles, Terminal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#121215] border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white text-black font-black text-xs flex items-center justify-center font-mono">
              N
            </div>
            <h2 className="text-base font-bold text-white tracking-tight font-mono">
              NIXIMA AI
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-zinc-300">
          <div>
            <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">
              {t.company.overviewBadge}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {t.company.heroHeading}
            </h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              {t.company.heroDescription}
            </p>
          </div>

          {/* Core Tenets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Cpu className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">{t.company.pillars.engineTitle}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                {t.company.pillars.engineDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">{t.company.pillars.logicTitle}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                {t.company.pillars.logicDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Terminal className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">{t.company.pillars.developerTitle}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                {t.company.pillars.developerDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Globe className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">{t.company.pillars.edgeTitle}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                {t.company.pillars.edgeDesc}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">{t.company.hqLabel}</span>
            <span className="text-white">{t.company.hqValue}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/40 flex justify-between items-center text-xs text-zinc-500 font-mono">
          <span>{t.company.copyright}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-glow-subtle"
          >
            {t.company.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
