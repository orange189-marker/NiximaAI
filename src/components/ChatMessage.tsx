import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown, 
  ChevronRight, 
  BrainCircuit, 
  User, 
  Download, 
  Cpu, 
  Activity, 
  Edit3 
} from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  onEditMessage?: (newContent: string) => void;
  activeModelName?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRegenerate,
  onEditMessage,
  activeModelName = 'Nixima-0.1'
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEditMessage) {
      onEditMessage(editText.trim());
      setIsEditing(false);
    }
  };

  // Helper function to render text with code blocks and basic markdown
  const renderFormattedContent = (content: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const textBefore = content.substring(lastIndex, match.index);
      if (textBefore) {
        parts.push({ type: 'text', content: textBefore });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        code: match[2].trimEnd()
      });

      lastIndex = match.index + match[0].length;
    }

    const textAfter = content.substring(lastIndex);
    if (textAfter) {
      parts.push({ type: 'text', content: textAfter });
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <CodeBlock 
            key={idx} 
            language={part.language!} 
            code={part.code!} 
          />
        );
      }

      return (
        <div key={idx} className="space-y-2.5 text-[14px] leading-relaxed text-zinc-200">
          {renderTextWithMarkdown(part.content)}
        </div>
      );
    });
  };

  // Basic inline markdown parser
  const renderTextWithMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }

      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={lIdx} className="text-base font-bold text-white pt-2 pb-1 font-mono tracking-tight">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={lIdx} className="text-lg font-bold text-white pt-3 pb-1 tracking-tight">{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={lIdx} className="text-xl font-black text-white pt-3 pb-1 tracking-tight">{line.slice(2)}</h1>;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lIdx} className="border-l-2 border-white/60 pl-3.5 py-1 text-zinc-300 italic my-2 bg-zinc-900/40 rounded-r">
            {formatInline(line.slice(2))}
          </blockquote>
        );
      }

      // Lists
      if (line.match(/^[-*]\s+/)) {
        return (
          <div key={lIdx} className="flex items-start gap-2 pl-2">
            <span className="text-zinc-500 font-bold">•</span>
            <div className="flex-1">{formatInline(line.replace(/^[-*]\s+/, ''))}</div>
          </div>
        );
      }

      // Numbered lists
      if (line.match(/^\d+\.\s+/)) {
        const num = line.match(/^(\d+)\.\s+/)?.[1];
        return (
          <div key={lIdx} className="flex items-start gap-2 pl-2">
            <span className="text-zinc-400 font-mono text-xs pt-0.5">{num}.</span>
            <div className="flex-1">{formatInline(line.replace(/^\d+\.\s+/, ''))}</div>
          </div>
        );
      }

      return <p key={lIdx}>{formatInline(line)}</p>;
    });
  };

  const formatInline = (str: string) => {
    const tokens = str.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return tokens.map((t, i) => {
      if (t.startsWith('**') && t.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{t.slice(2, -2)}</strong>;
      }
      if (t.startsWith('`') && t.endsWith('`')) {
        return (
          <code key={i} className="font-mono text-[12.5px] bg-zinc-800 text-zinc-100 px-1.5 py-0.5 rounded border border-zinc-700/60">
            {t.slice(1, -1)}
          </code>
        );
      }
      if (t.startsWith('*') && t.endsWith('*')) {
        return <em key={i} className="text-zinc-300 italic">{t.slice(1, -1)}</em>;
      }
      return t;
    });
  };

  return (
    <div className={`py-6 px-4 md:px-6 transition-colors ${isUser ? 'bg-transparent' : 'bg-zinc-950/60 border-y border-zinc-900/60'}`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-300 flex items-center justify-center text-black font-black text-sm tracking-tighter shadow-glow-subtle font-mono">
              N
            </div>
          )}
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-tight">
                {isUser ? 'You' : (message.model || activeModelName)}
              </span>
              {!isUser && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  AI
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              {isUser && onEditMessage && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="hover:text-zinc-300 transition-colors p-1"
                  title="Edit prompt"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* User message edit mode */}
          {isUser && isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-white font-sans"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded bg-white text-black text-xs font-semibold hover:bg-zinc-200 font-mono shadow-glow-subtle"
                >
                  Save & Resend
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Optional Thinking Process (for AI messages) */}
              {!isUser && message.thinking && (
                <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden text-xs">
                  <button
                    onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                    className="w-full px-3 py-2 flex items-center justify-between text-zinc-400 hover:text-zinc-200 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-mono text-[11px] font-medium text-zinc-300">
                        Reasoning Process
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        (Chain-of-thought)
                      </span>
                    </div>
                    {isThinkingOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </button>

                  {isThinkingOpen && (
                    <div className="px-3.5 py-2.5 border-t border-zinc-800/60 bg-black/40 font-mono text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {message.thinking}
                    </div>
                  )}
                </div>
              )}

              {/* Main content */}
              <div className="text-zinc-200">
                {renderFormattedContent(message.content)}
                {message.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-white animate-pulse align-middle" />
                )}
              </div>

              {/* Telemetry metrics bar for AI responses */}
              {!isUser && !message.isStreaming && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-zinc-500 text-xs border-t border-zinc-900/60 mt-3">
                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {onRegenerate && (
                      <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors flex items-center gap-1 text-[11px]"
                        title="Regenerate"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    )}
                  </div>

                  {/* Telemetry pill */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                      <Activity className="w-2.5 h-2.5 text-zinc-400" />
                      {message.telemetry?.tokens || Math.round(message.content.length / 4)} tok
                      {message.telemetry?.durationMs && ` • ${(message.telemetry.durationMs / 1000).toFixed(1)}s`}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                        className={`p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors ${
                          feedback === 'up' ? 'text-white bg-zinc-800' : ''
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                        className={`p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors ${
                          feedback === 'down' ? 'text-white bg-zinc-800' : ''
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Subcomponent: High-contrast Code Block with Copy & Download File
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const getExtension = (lang: string) => {
    const map: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      rust: 'rs',
      python: 'py',
      json: 'json',
      bash: 'sh',
      html: 'html',
      css: 'css',
      sql: 'sql',
      markdown: 'md',
    };
    return map[lang.toLowerCase()] || 'txt';
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSnippet = () => {
    const ext = getExtension(language);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nixima_snippet.${ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#0c0c0e] shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/80 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
        <span className="uppercase text-zinc-400 font-semibold">{language}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadSnippet}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Download snippet"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy code'}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto text-zinc-200 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
