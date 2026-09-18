import React from 'react';
import { Check } from 'lucide-react';
import { NiximaProduct } from '../types/chat';

export type ConversationStatus = 
  | 'thinking' 
  | 'deep_thinking' 
  | 'completed' 
  | 'error' 
  | 'active' 
  | 'idle' 
  | 'new';

export interface ConversationStatusDotProps {
  status: ConversationStatus;
  product?: NiximaProduct;
  tooltip?: string;
  className?: string;
}

export const ConversationStatusDot: React.FC<ConversationStatusDotProps> = ({
  status,
  product = 'chat',
  tooltip,
  className = '',
}) => {
  // Fixed slot container (16x16px) to maintain rigid text alignment for conversation titles
  return (
    <div
      className={`relative flex items-center justify-center w-4 h-4 flex-shrink-0 select-none ${className}`}
      title={tooltip}
    >
      {/* 1. Standard Neural Thinking / Streaming */}
      {status === 'thinking' && (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Expanding Radar Wave */}
          <span className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400/35 animate-dot-ripple pointer-events-none" />
          {/* Pulsating Core with Cyan Halo */}
          <span className="relative w-2 h-2 rounded-full bg-cyan-400 animate-dot-thinking shadow-[0_0_8px_rgba(34,211,238,0.95)]" />
        </div>
      )}

      {/* 2. DeepThinking V3.0 / Frontier Epistemic Dialectic */}
      {status === 'deep_thinking' && (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Dual-frequency violet radar wave */}
          <span className="absolute w-3.5 h-3.5 rounded-full bg-purple-500/40 animate-dot-ripple pointer-events-none" />
          {/* Violet/Fuchsia glowing neural core */}
          <span className="relative w-2 h-2 rounded-full bg-gradient-to-tr from-purple-400 to-fuchsia-400 animate-dot-deepthink shadow-[0_0_10px_rgba(192,132,252,1)]" />
        </div>
      )}

      {/* 3. Task Just Completed (Glowing Emerald Check Capsule) */}
      {status === 'completed' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/25 border border-emerald-400/80 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-completed-tick animate-completed-glow">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        </div>
      )}

      {/* 4. Generation Error / Interrupted */}
      {status === 'error' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_7px_rgba(244,63,94,0.85)] animate-dot-error" />
        </div>
      )}

      {/* 5. Currently Active / Focused Conversation */}
      {status === 'active' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              product === 'code'
                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                : product === 'translator'
                ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]'
                : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]'
            }`}
          />
        </div>
      )}

      {/* 6. Settled / Idle Conversation */}
      {status === 'idle' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600/50 group-hover:bg-zinc-400/80 transition-colors duration-200" />
        </div>
      )}

      {/* 7. Brand New / Empty Conversation */}
      {status === 'new' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <span className="w-1.5 h-1.5 rounded-full border border-zinc-600/60 group-hover:border-zinc-400/80 transition-colors" />
        </div>
      )}
    </div>
  );
};
