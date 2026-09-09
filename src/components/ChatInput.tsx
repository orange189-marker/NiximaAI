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
  Sparkles,
  CornerDownLeft,
  X
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { NiximaIdLogo } from './NiximaIdLogo';

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
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    let finalMessage = input.trim();
    if (attachedFiles.length > 0) {
      const attachmentsHeader = attachedFiles.map(f => `[Attached Document: ${f}]`).join('\n');
      finalMessage = finalMessage ? `${attachmentsHeader}\n\n${finalMessage}` : attachmentsHeader;
      setAttachedFiles([]);
    }

    onSendMessage(finalMessage);
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

  const handleAttachMockFile = () => {
    const fileName = `dataset_${Math.floor(Math.random() * 899 + 100)}.json`;
    if (!attachedFiles.includes(fileName)) {
      setAttachedFiles(prev => [...prev, fileName]);
    }
  };

  const removeAttachment = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(f => f !== fileName));
  };

  const modifiers = [
    { label: 'Concise', icon: <Zap className="w-3 h-3 text-amber-400" />, prompt: '[Be concise and direct]' },
    { label: 'Code Only', icon: <Code2 className="w-3 h-3 text-emerald-400" />, prompt: '[Provide production-ready code with minimal explanation]' },
    { label: 'Deep Proof', icon: <BrainCircuit className="w-3 h-3 text-cyan-400" />, prompt: '[Formulate rigorous mathematical or logical derivation]' },
    { label: 'Comparison Table', icon: <Table className="w-3 h-3 text-violet-400" />, prompt: '[Format output into structured markdown comparison tables]' },
  ];

  const canSubmit = (input.trim().length > 0 || attachedFiles.length > 0) && !isLoading;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      {/* Quick Prompt Modifiers Rail */}
      <div className="flex items-center gap-1.5 pb-2 overflow-x-auto text-[11px] font-mono select-none scrollbar-none">
        <span className="text-zinc-500 pl-1 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-zinc-500" />
          <span>Modifier:</span>
        </span>
        {modifiers.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyModifier(m.prompt)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all duration-150 whitespace-nowrap active:scale-95 shadow-sm"
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Elevated Input Dock */}
      <div className="relative group">
        {/* Ambient Glow Halo when focused */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-white/[0.04] rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#131317]/95 via-[#0e0e12]/98 to-[#0a0a0d]/98 border border-zinc-800/90 hover:border-zinc-700/80 focus-within:border-zinc-500/90 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300">
          
          {/* Active Attached Files Chip Strip */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 px-5 sm:px-6 pt-3.5 pb-1 flex-wrap">
              {attachedFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-700 text-xs font-mono text-zinc-200 shadow-inner-light animate-fade-in"
                >
                  <Paperclip className="w-3 h-3 text-zinc-400" />
                  <span>{file}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file)}
                    className="hover:text-red-400 ml-0.5"
                    title="Remove attachment"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Primary Textarea Field */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nixima anything..."
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 text-sm sm:text-base px-5 sm:px-6 pt-3.5 sm:pt-4 pb-2.5 resize-none focus:outline-none max-h-48 overflow-y-auto leading-relaxed font-sans select-text scrollbar-thin scrollbar-thumb-zinc-700"
          />

          {/* High-Tech Capability Toolbar (Bottom Dock) */}
          <div className="flex items-center justify-between px-3.5 pb-3 pt-1 border-t border-white/[0.04]">
            {/* Left Controls: Brain & Capability Switches */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Active Model Indicator Chip */}
              <div 
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 shadow-inner-light select-none mr-1"
                title={`Active Inference Engine: ${currentModel.name}`}
              >
                <NiximaIdLogo size={13} glow={false} />
                <span className="font-medium truncate max-w-[130px]">{currentModel.name}</span>
              </div>

              <div className="hidden sm:block h-3.5 w-[1px] bg-zinc-800 mx-0.5" />

              {/* Deep Think Mode Toggle */}
              <button
                type="button"
                onClick={onToggleDeepThink}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-150 border ${
                  deepThink 
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.35)] scale-[1.02]' 
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
                }`}
                title="Activate extended multi-step reasoning"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Deep Think</span>
                {deepThink && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />}
              </button>

              {/* Web Search Telemetry Toggle */}
              <button
                type="button"
                onClick={onToggleWebSearch}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-150 border ${
                  webSearch 
                    ? 'bg-zinc-200 text-black font-bold border-zinc-200 shadow-glow-subtle' 
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
                }`}
                title="Search live web data"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              {/* Audio Keystroke Sound Toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className={`p-1.5 rounded-lg border transition-all duration-150 ${
                  soundEnabled
                    ? 'bg-zinc-850 border-zinc-700 text-white shadow-inner-light'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
                title={soundEnabled ? "Mute typing audio" : "Enable typing audio"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-zinc-200" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Context Attachment Button */}
              <button
                type="button"
                onClick={handleAttachMockFile}
                className="p-1.5 rounded-lg border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-150"
                title="Attach document context"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Controls: Telemetry & Send/Stop Beacon */}
            <div className="flex items-center gap-2.5">
              {input.length > 0 && (
                <span className="hidden md:inline text-[10.5px] font-mono text-zinc-500 select-none">
                  {input.length} chars
                </span>
              )}

              {isLoading ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className="relative group w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center transition-all duration-150 shadow-[0_0_24px_rgba(255,255,255,0.4)] hover:bg-zinc-200 hover:scale-105 active:scale-95 cursor-pointer"
                  title="Stop generation (Esc)"
                >
                  <span className="absolute -inset-0.5 rounded-xl bg-white/40 animate-pulse pointer-events-none" />
                  <Square className="w-3.5 h-3.5 fill-black text-black" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!canSubmit}
                  className={`relative group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    canSubmit
                      ? 'bg-white text-black hover:bg-zinc-100 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.45)] ring-1 ring-white/60 cursor-pointer'
                      : 'bg-zinc-900/90 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title={canSubmit ? "Send message (Enter)" : "Type a prompt to send"}
                >
                  <ArrowUp className={`w-4 h-4 stroke-[2.5] transition-transform duration-150 ${
                    canSubmit ? 'group-hover:-translate-y-0.5 text-black' : 'text-zinc-600'
                  }`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle Telemetry & Keyboard Hint */}
      <div className="mt-2 text-center text-[10.5px] text-zinc-500 font-mono tracking-tight flex items-center justify-center gap-2 select-none">
        <span>Nixima AI Mesh</span>
        <span>•</span>
        <span>Online</span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline">
          Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Enter ↵</kbd> to send
          <span className="mx-1 text-zinc-600">·</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Shift + Enter</kbd> for newline
        </span>
      </div>
    </div>
  );
};
