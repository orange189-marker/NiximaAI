import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  ArrowRight,
  Shield,
  Zap,
  Code2
} from 'lucide-react';
import { ModelOption } from '../types/chat';

interface EmptyChatProps {
  currentModel: ModelOption;
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({
  currentModel,
  onSelectPrompt
}) => {
  const promptSuggestions = [
    {
      icon: <Terminal className="w-4 h-4 text-zinc-300" />,
      title: 'Distributed Rust Service',
      prompt: 'Write an asynchronous high-throughput event loop in Rust using Tokio with lock-free queues.',
      category: 'SYSTEMS'
    },
    {
      icon: <Cpu className="w-4 h-4 text-zinc-300" />,
      title: 'Nixima-0.1 Architecture',
      prompt: 'Explain the internal Sparse Rotary Attention and Mixture-of-Experts architecture of Nixima-0.1.',
      category: 'DEEP DIVE'
    },
    {
      icon: <Code2 className="w-4 h-4 text-zinc-300" />,
      title: 'Full-Stack React & AI',
      prompt: 'Create a responsive React component that streams token embeddings with real-time audio visualization.',
      category: 'FRONTEND'
    },
    {
      icon: <Zap className="w-4 h-4 text-zinc-300" />,
      title: 'System Optimization',
      prompt: 'Diagnose memory leaks in Node.js event listeners and propose deterministic garbage collection tuning.',
      category: 'PERFORMANCE'
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full text-center select-none animate-fade-in">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/60 mb-6 shadow-inner-light">
        <span className="w-2 h-2 rounded-full bg-white"></span>
        <span className="text-xs font-mono text-zinc-300">
          Nixima Neural Engine • Model: {currentModel.name}
        </span>
      </div>

      {/* Hero Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-sans">
        Where intelligence meets precision.
      </h1>

      <p className="text-sm text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed">
        Autonomous synthetic intelligence powered by the high-throughput <span className="text-white font-medium">{currentModel.name}</span> frontier reasoning engine.
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

      {/* Feature stats footer */}
      <div className="mt-12 pt-6 border-t border-zinc-800/80 w-full grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold font-mono text-white">
            {currentModel.contextWindow.split(' ')[0]}
          </div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">Context Window</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-white">
            {currentModel.latency}
          </div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">Throughput</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-white">
            99.98%
          </div>
          <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">Precision SLA</div>
        </div>
      </div>
    </div>
  );
};
