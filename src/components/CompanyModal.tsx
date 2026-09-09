import React from 'react';
import { X, Shield, Cpu, Zap, Globe, Sparkles, Terminal } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose }) => {
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
              Company Overview
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Architecting Sovereign Synthetic Intelligence
            </h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Nixima AI is an artificial intelligence research and frontier technology company. We build sparse mixture-of-experts architectures that deliver radical inference efficiency, extended reasoning horizons, and verified mathematical correctness.
            </p>
          </div>

          {/* Core Tenets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Cpu className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">Nixima-0.1 Engine</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                480B parameter MoE flagship with dynamic token routing and 2M token context window.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">Deterministic Logic</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Autonomous step-by-step verification pipeline minimizing hallucinations to near-zero.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Terminal className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">Developer First</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Native code synthesis, terminal tooling, and zero-latency streaming pipelines.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Globe className="w-4 h-4 text-white" />
                <span className="font-semibold text-xs text-white">Edge Deployment</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                High-performance local bindings running on host port 6001 with sub-50ms latency.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Headquarters</span>
            <span className="text-white">Zurich • San Francisco</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/40 flex justify-between items-center text-xs text-zinc-500 font-mono">
          <span>Nixima AI © 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-glow-subtle"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
