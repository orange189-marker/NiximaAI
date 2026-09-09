import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  BrainCircuit, 
  Globe, 
  Paperclip, 
  Square, 
  Volume2,
  VolumeX,
  Code2,
  Zap,
  Table,
  CheckCircle2
} from 'lucide-react';
import { ModelOption } from '../types/chat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  currentModel: ModelOption;
  deepThink: boolean;
  onToggleDeepThink: () => void;
  webSearch: boolean;
  onToggleWebSearch: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  currentModel,
  deepThink,
  onToggleDeepThink,
  webSearch,
  onToggleWebSearch,
  soundEnabled,
  onToggleSound,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && isLoading && onStopGeneration) {
      e.preventDefault();
      onStopGeneration();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applyModifier = (prefix: string) => {
    setInput(prev => {
      if (prev.startsWith(prefix)) return prev;
      return `${prefix} ${prev}`.trim();
    });
    textareaRef.current?.focus();
  };

  const modifiers = [
    { label: 'Concise', icon: <Zap className="w-3 h-3" />, prompt: '[Be concise and direct]' },
    { label: 'Code Only', icon: <Code2 className="w-3 h-3" />, prompt: '[Provide production-ready code with minimal explanation]' },
    { label: 'Deep Proof', icon: <BrainCircuit className="w-3 h-3" />, prompt: '[Formulate rigorous mathematical or logical derivation]' },
    { label: 'Table', icon: <Table className="w-3 h-3" />, prompt: '[Format output into comparison markdown tables]' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      {/* Quick Modifier Pills */}
      <div className="flex items-center gap-1.5 pb-2 overflow-x-auto text-[11px] font-mono select-none scrollbar-none">
        <span className="text-zinc-400 pl-1 text-[10px] uppercase tracking-wider">Modifier:</span>
        {modifiers.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyModifier(m.prompt)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 transition-colors whitespace-nowrap"
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Input Dock */}
      <div className="relative rounded-2xl bg-[#121216] border border-zinc-800 shadow-2xl transition-all focus-within:border-zinc-600 focus-within:shadow-glow-subtle">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${currentModel.name}... (Shift+Enter for newline)`}
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm px-4 pt-3.5 pb-2 resize-none focus:outline-none max-h-48 overflow-y-auto leading-relaxed font-sans"
        />

        {/* Toolbar footer */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Left tools: Mode switches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Deep think mode toggle */}
            <button
              type="button"
              onClick={onToggleDeepThink}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors border ${
                deepThink 
                  ? 'bg-white text-black font-semibold border-white shadow-glow-subtle' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Activate extended chain-of-thought reasoning"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Deep Think</span>
            </button>

            {/* Web search toggle */}
            <button
              type="button"
              onClick={onToggleWebSearch}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors border ${
                webSearch 
                  ? 'bg-zinc-200 text-black font-semibold border-zinc-200' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Query real-time web telemetry"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            {/* Audio Keystroke Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-1.5 rounded-full border transition-colors ${
                soundEnabled
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
              title={soundEnabled ? "Mute synthetic typing audio" : "Enable synthetic typing audio"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Attach button placeholder */}
            <button
              type="button"
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              title="Attach context document"
              onClick={() => {
                setInput(prev => prev + '\n[Attached context: nixima_dataset.json]\n');
              }}
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right action: Send or Stop */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">
              {input.length} chars
            </span>

            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="relative group w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.35)] hover:bg-zinc-200 hover:scale-105 active:scale-95"
                title="Stop generation (Esc)"
              >
                {/* Subtle pulse ring */}
                <span className="absolute -inset-0.5 rounded-xl bg-white/30 animate-pulse pointer-events-none" />
                <Square className="w-3.5 h-3.5 fill-black text-black transition-transform group-hover:scale-90" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className={`relative group h-9 flex items-center justify-center transition-all duration-200 ${
                  input.trim()
                    ? 'w-9 rounded-xl bg-white text-black hover:bg-zinc-100 hover:scale-105 active:scale-95 shadow-[0_0_22px_rgba(255,255,255,0.4)] cursor-pointer ring-1 ring-white/50'
                    : 'w-9 rounded-xl bg-zinc-900/90 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
                title={input.trim() ? "Send message (Enter)" : "Type a message to send"}
              >
                <ArrowUp className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                  input.trim() ? 'group-hover:-translate-y-0.5' : ''
                }`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-[11px] text-zinc-400 font-mono tracking-tight flex items-center justify-center gap-2">
        <span>Nixima AI</span>
        <span>•</span>
        <span>Port 6001</span>
        <span>•</span>
        <span>Active Model: {currentModel.name}</span>
      </div>
    </div>
  );
};
