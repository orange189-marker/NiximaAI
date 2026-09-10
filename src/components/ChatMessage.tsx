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
import { MarkdownTable, TableBlockData } from './MarkdownTable';
import { NiximaIdLogo } from './NiximaIdLogo';
import { useLanguage } from '../context/LanguageContext';
import { MathRenderer } from './MathRenderer';
import { CreditTelemetryPill } from './AnimatedCredits';

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
  const { t } = useLanguage();
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

  // Helper to detect and extract Markdown tables from normal text
  const parseTablesFromText = (textContent: string): Array<
    | { type: 'text'; content: string }
    | { type: 'table'; data: TableBlockData }
  > => {
    const lines = textContent.split('\n');
    const blocks: Array<
      | { type: 'text'; content: string }
      | { type: 'table'; data: TableBlockData }
    > = [];
    let textBuffer: string[] = [];
    let i = 0;

    const isTableRow = (line: string) => {
      const trimmed = line.trim();
      return trimmed.includes('|') && trimmed.split('|').length >= 2;
    };

    const isTableSeparator = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed.includes('-') || !trimmed.includes('|')) return false;
      const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '');
      const parts = inner.split('|');
      if (parts.length < 2) return false;
      return parts.every(p => /^\s*:?-{2,}:?\s*$/.test(p));
    };

    while (i < lines.length) {
      const currentLine = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : null;

      if (nextLine && isTableRow(currentLine) && isTableSeparator(nextLine)) {
        // Table found: flush preceding text
        if (textBuffer.length > 0) {
          blocks.push({ type: 'text', content: textBuffer.join('\n') });
          textBuffer = [];
        }

        const rawHeaders = currentLine
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(c => c.trim());

        const rawSeparators = nextLine
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(c => c.trim());

        const alignments: ('left' | 'center' | 'right')[] = rawSeparators.map(sep => {
          const hasLeft = sep.startsWith(':');
          const hasRight = sep.endsWith(':');
          if (hasLeft && hasRight) return 'center';
          if (hasRight) return 'right';
          return 'left';
        });

        const rows: string[][] = [];
        const tableLines = [currentLine, nextLine];
        i += 2;

        while (i < lines.length && isTableRow(lines[i])) {
          tableLines.push(lines[i]);
          const rowCells = lines[i]
            .trim()
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map(c => c.trim());

          while (rowCells.length < rawHeaders.length) {
            rowCells.push('');
          }
          rows.push(rowCells.slice(0, Math.max(rawHeaders.length, rowCells.length)));
          i++;
        }

        blocks.push({
          type: 'table',
          data: {
            headers: rawHeaders,
            alignments,
            rows,
            rawMarkdown: tableLines.join('\n'),
          },
        });
      } else {
        textBuffer.push(currentLine);
        i++;
      }
    }

    if (textBuffer.length > 0) {
      blocks.push({ type: 'text', content: textBuffer.join('\n') });
    }

    return blocks;
  };

  // Helper to extract display math blocks ($$...$$ and \[...\])
  const parseDisplayMath = (text: string): Array<
    | { type: 'text'; content: string }
    | { type: 'math-block'; math: string }
  > => {
    const displayMathRegex = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
    const segments: Array<
      | { type: 'text'; content: string }
      | { type: 'math-block'; math: string }
    > = [];
    let lastIndex = 0;
    let match;

    while ((match = displayMathRegex.exec(text)) !== null) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        segments.push({ type: 'text', content: textBefore });
      }

      const mathContent = match[1] || match[2] || '';
      segments.push({
        type: 'math-block',
        math: mathContent.trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      segments.push({ type: 'text', content: textAfter });
    }

    if (segments.length === 0) {
      segments.push({ type: 'text', content: text });
    }

    return segments;
  };

  // Helper function to render text with code blocks, tables, math blocks, and basic markdown
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
        language: (match[1] || 'plaintext').toLowerCase(),
        code: match[2].trimEnd(),
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
        const isLatex = part.language === 'latex' || part.language === 'tex' || part.language === 'math';
        if (isLatex) {
          return (
            <MathRenderer
              key={idx}
              math={part.code!}
              displayMode={true}
            />
          );
        }

        return (
          <CodeBlock 
            key={idx} 
            language={part.language!} 
            code={part.code!} 
          />
        );
      }

      // Step 1: Extract display math blocks ($$...$$ and \[...\])
      const mathSegments = parseDisplayMath(part.content);

      return mathSegments.map((segment, mIdx) => {
        if (segment.type === 'math-block') {
          return (
            <MathRenderer
              key={`${idx}-m-${mIdx}`}
              math={segment.math}
              displayMode={true}
            />
          );
        }

        // Step 2: Extract tables from remaining normal text
        const textBlocks = parseTablesFromText(segment.content);

        return textBlocks.map((block, bIdx) => {
          if (block.type === 'table') {
            return (
              <MarkdownTable
                key={`${idx}-${mIdx}-t-${bIdx}`}
                data={block.data}
              />
            );
          }

          if (!block.content.trim()) return null;

          return (
            <div key={`${idx}-${mIdx}-b-${bIdx}`} className="space-y-2.5 text-[14px] leading-relaxed text-zinc-200">
              {renderTextWithMarkdown(block.content)}
            </div>
          );
        });
      });
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

  // Helper to distinguish valid inline LaTeX math from currency or plain text
  const isValidInlineMath = (inner: string): boolean => {
    const trimmed = inner.trim();
    if (!trimmed) return false;
    // Pure numbers/currency like "50", "100.00", "1,000"
    if (/^\d+(?:,\d{3})*(?:\.\d+)?$/.test(trimmed)) return false;
    // Conjunctions between numbers like "50 and $20" or "50 to 100"
    if (/^\d+.*?\b(and|or|to|for|with)\b.*?\d+$/i.test(trimmed)) return false;
    return true;
  };

  const formatInline = (str: string) => {
    // Regex matching:
    // 1. \( ... \) explicit LaTeX inline math
    // 2. $ ... $ standard inline math
    // 3. ** ... ** bold text
    // 4. ` ... ` inline code
    // 5. * ... * italic text
    const inlineRegex = /(\\\([^\n]+?\\\)|\$(?!\s)[^$\n]+?(?<!\s)\$|\*\*[^*]+?\*\*|`[^`]+?`|\*[^*]+?\*)/g;

    const parts: Array<
      | string
      | { type: 'math' | 'bold' | 'code' | 'italic'; content: string }
    > = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }

      const token = match[0];

      if (token.startsWith('\\(') && token.endsWith('\\)')) {
        parts.push({ type: 'math', content: token.slice(2, -2) });
      } else if (token.startsWith('$') && token.endsWith('$') && token.length > 2) {
        const inner = token.slice(1, -1);
        if (isValidInlineMath(inner)) {
          parts.push({ type: 'math', content: inner });
        } else {
          parts.push(token);
        }
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push({ type: 'bold', content: token.slice(2, -2) });
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push({ type: 'code', content: token.slice(1, -1) });
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push({ type: 'italic', content: token.slice(1, -1) });
      } else {
        parts.push(token);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    if (parts.length === 0) {
      return [str];
    }

    return parts.map((part, i) => {
      if (typeof part === 'string') return part;
      if (part.type === 'math') {
        return <MathRenderer key={i} math={part.content} displayMode={false} />;
      }
      if (part.type === 'bold') {
        return <strong key={i} className="font-semibold text-white">{part.content}</strong>;
      }
      if (part.type === 'code') {
        return (
          <code key={i} className="font-mono text-[12.5px] bg-zinc-800 text-zinc-100 px-1.5 py-0.5 rounded border border-zinc-700/60">
            {part.content}
          </code>
        );
      }
      if (part.type === 'italic') {
        return <em key={i} className="text-zinc-300 italic">{part.content}</em>;
      }
      return null;
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
            <div className={`relative w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-700/80 flex items-center justify-center text-white shadow-glow-subtle transition-all ${
              message.isStreaming ? 'border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.35)] ring-1 ring-white/30' : ''
            }`}>
              <NiximaIdLogo size={18} animated={message.isStreaming} glow={false} />
            </div>
          )}
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-tight">
                {isUser ? t.chatMessage.you : (message.model || activeModelName)}
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
                  title={t.chatMessage.editPrompt}
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
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded bg-white text-black text-xs font-semibold hover:bg-zinc-200 font-mono shadow-glow-subtle"
                >
                  {t.chatMessage.saveAndResend}
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
                        {t.chatMessage.reasoningProcess}
                      </span>
                      {message.isStreaming && !message.content && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-[10px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>{t.chatMessage.generatingTrace}</span>
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {t.chatMessage.chainOfThought}
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
                {!message.content.trim() && message.isStreaming ? (
                  /* Cool Animated Thinking UI with Bouncing Neural Dots */
                  <div className="py-2.5 animate-fade-in select-none">
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0e0e13]/90 border border-zinc-800/90 shadow-[0_4px_25px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                      {/* Animated Multi-Ring Neural Core */}
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <span className="absolute -inset-1 rounded-full bg-white/10 animate-ping opacity-60 pointer-events-none" />
                        <NiximaIdLogo size={16} animated glow={false} />
                      </div>

                      {/* Thinking / Reasoning Label */}
                      <div className="flex items-center gap-2.5 font-mono text-xs">
                        <span className="text-zinc-300 font-medium tracking-tight">
                          {message.thinking ? t.chatMessage.reasoning : t.chatMessage.thinking}
                        </span>

                        {/* 3 Glowing Bouncing Fluid Dots */}
                        <div className="flex items-center gap-1.5 pl-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-bounce"
                            style={{ animationDuration: '0.85s', animationDelay: '0ms' }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-zinc-300 shadow-[0_0_6px_rgba(255,255,255,0.6)] animate-bounce"
                            style={{ animationDuration: '0.85s', animationDelay: '180ms' }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-zinc-500 shadow-[0_0_4px_rgba(255,255,255,0.3)] animate-bounce"
                            style={{ animationDuration: '0.85s', animationDelay: '360ms' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {renderFormattedContent(message.content)}
                    {message.isStreaming && (
                      <span className="inline-flex items-center align-middle ml-1.5 -translate-y-[1px]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                        </span>
                      </span>
                    )}
                  </>
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
                      title={t.chatMessage.copyResponse}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? t.chatMessage.copied : t.chatMessage.copyResponse}</span>
                    </button>

                    {onRegenerate && (
                      <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors flex items-center gap-1 text-[11px]"
                        title={t.chatMessage.regenerate}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>{t.chatMessage.regenerate}</span>
                      </button>
                    )}
                  </div>

                  {/* Telemetry pill */}
                  <div className="flex items-center gap-2">
                    {message.telemetry?.creditsSpent !== undefined && (
                      <CreditTelemetryPill
                        creditsSpent={message.telemetry.creditsSpent}
                        unit={t.credits.unit || 'CR'}
                      />
                    )}

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                      <Activity className="w-2.5 h-2.5 text-zinc-400" />
                      {message.telemetry?.tokens || Math.round(message.content.length / 4)} {t.chatMessage.tokensCount}
                      {message.telemetry?.durationMs && ` • ${(message.telemetry.durationMs / 1000).toFixed(1)}s`}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                        className={`p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors ${
                          feedback === 'up' ? 'text-white bg-zinc-800' : ''
                        }`}
                        title={t.chatMessage.helpful}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                        className={`p-1.5 rounded hover:text-white hover:bg-zinc-800/80 transition-colors ${
                          feedback === 'down' ? 'text-white bg-zinc-800' : ''
                        }`}
                        title={t.chatMessage.notHelpful}
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
  const { t } = useLanguage();
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
            title={t.chatMessage.downloadCode}
          >
            <Download className="w-3 h-3" />
            <span>{t.chatMessage.downloadCode}</span>
          </button>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? t.chatMessage.copied : t.chatMessage.copyCode}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto text-zinc-200 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
