import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  BrainCircuit, 
  Globe, 
  Paperclip, 
  Square, 
  Sparkles,
  Zap
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
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
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm px-4 pt-3.5 pb-2 resize-none focus:outline-none max-h-48 overflow-y-auto leading-relaxed"
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

            {/* Attach button placeholder */}
            <button
              type="button"
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              title="Attach code or context document"
              onClick={() => {
                setInput(prev => prev + '\n[Attached context: nixima_config.json]\n');
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
                className="w-8 h-8 rounded-xl bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-all shadow-glow-subtle"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
                  input.trim()
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-glow-subtle cursor-pointer'
                    : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed border border-zinc-800'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
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
