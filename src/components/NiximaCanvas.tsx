import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Eye,
  Code2,
  Terminal,
  Play,
  RotateCw,
  Copy,
  Check,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
  History,
  Sparkles,
  ChevronDown,
  Layers,
  FileCode,
  Sliders,
  Trash2,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  GitCompare,
  Send,
  Share2,
  AlertCircle,
  FileDown,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { NiximaArtifact, ArtifactType } from '../types/chat';
import { generateSandboxHtml } from '../utils/artifactDetector';
import { playCompletionChime } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

/**
 * High-performance line-by-line diff calculator using Longest Common Subsequence (LCS)
 */
export function computeSimpleDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const m = oldLines.length;
  const n = newLines.length;

  // Safeguard against unbounded memory in huge files
  if (m * n > 400000) {
    const fallback: DiffLine[] = [];
    const max = Math.max(m, n);
    for (let i = 0; i < max; i++) {
      if (i < m && i < n) {
        if (oldLines[i] === newLines[i]) {
          fallback.push({ type: 'unchanged', text: oldLines[i], oldLineNumber: i + 1, newLineNumber: i + 1 });
        } else {
          fallback.push({ type: 'removed', text: oldLines[i], oldLineNumber: i + 1 });
          fallback.push({ type: 'added', text: newLines[i], newLineNumber: i + 1 });
        }
      } else if (i < m) {
        fallback.push({ type: 'removed', text: oldLines[i], oldLineNumber: i + 1 });
      } else {
        fallback.push({ type: 'added', text: newLines[i], newLineNumber: i + 1 });
      }
    }
    return fallback;
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1) as any);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (oldLines[i] === newLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const diff: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.unshift({
        type: 'unchanged',
        text: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({
        type: 'added',
        text: newLines[j - 1],
        newLineNumber: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({
        type: 'removed',
        text: oldLines[i - 1],
        oldLineNumber: i,
      });
      i--;
    }
  }
  return diff;
}


interface NiximaCanvasProps {
  artifact: NiximaArtifact;
  onClose: () => void;
  onUpdateArtifactContent?: (newContent: string) => void;
  onSelectVersion?: (version: number) => void;
  onActionPrompt?: (prompt: string) => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

export const NiximaCanvas: React.FC<NiximaCanvasProps> = ({
  artifact,
  onClose,
  onUpdateArtifactContent,
  onSelectVersion,
  onActionPrompt,
  isMaximized,
  onToggleMaximize,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'diff' | 'console'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [editableCode, setEditableCode] = useState(artifact.content);
  const [copied, setCopied] = useState(false);
  const [copiedStandalone, setCopiedStandalone] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: string; message: string; timestamp: number }>>([]);
  const [consoleFilter, setConsoleFilter] = useState<'all' | 'log' | 'warn' | 'error'>('all');
  const [replInput, setReplInput] = useState('');
  const [replHistory, setReplHistory] = useState<string[]>([]);
  const [directiveInput, setDirectiveInput] = useState('');

  // Code Editor V2 States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Diff comparison target version
  const versionsList = artifact.versions || [];
  const currentVer = artifact.currentVersion || 1;
  const [selectedDiffVersion, setSelectedDiffVersion] = useState<number>(() => {
    if (versionsList.length > 1) {
      const prev = versionsList.find(v => v.version === currentVer - 1);
      return prev ? prev.version : versionsList[0].version;
    }
    return currentVer;
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const versionMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineGutterRef = useRef<HTMLDivElement>(null);

  // Sync editable code when artifact content changes
  useEffect(() => {
    setEditableCode(artifact.content);
  }, [artifact.content, artifact.currentVersion]);

  // Update selected diff version when version changes
  useEffect(() => {
    if (versionsList.length > 1) {
      const prev = versionsList.find(v => v.version === currentVer - 1);
      setSelectedDiffVersion(prev ? prev.version : versionsList[0].version);
    } else {
      setSelectedDiffVersion(currentVer);
    }
  }, [currentVer, versionsList.length]);

  // Close version dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (versionMenuRef.current && !versionMenuRef.current.contains(e.target as Node)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for console logs emitted from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NIXIMA_CANVAS_CONSOLE' && event.data.payload) {
        setConsoleLogs(prev => [...prev.slice(-150), event.data.payload]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const hasUnsavedChanges = editableCode !== artifact.content;

  const handleApplyChanges = () => {
    if (onUpdateArtifactContent) {
      onUpdateArtifactContent(editableCode);
    }
    handleRefresh();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setConsoleLogs([]);
    if (iframeRef.current) {
      // Force reload of iframe content
      const htmlPayload = generateSandboxHtml({
        ...artifact,
        content: editableCode,
      });
      iframeRef.current.srcdoc = htmlPayload;
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    playCompletionChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyStandaloneHtml = () => {
    const htmlPayload = generateSandboxHtml({
      ...artifact,
      content: editableCode,
    });
    navigator.clipboard.writeText(htmlPayload);
    setCopiedStandalone(true);
    playCompletionChime();
    setTimeout(() => setCopiedStandalone(false), 2000);
  };

  const getFileExtension = (lang: string, type: ArtifactType): string => {
    if (type === 'svg') return 'svg';
    if (type === 'html') return 'html';
    if (type === 'react') return 'tsx';
    if (type === 'markdown') return 'md';
    const map: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      rust: 'rs',
      css: 'css',
      json: 'json',
      bash: 'sh',
    };
    return map[lang.toLowerCase()] || 'txt';
  };

  const handleDownload = () => {
    const ext = getFileExtension(artifact.language, artifact.type);
    const mimeType = artifact.type === 'svg' ? 'image/svg+xml' : 'text/plain;charset=utf-8';
    const blob = new Blob([editableCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewWindow = () => {
    const htmlPayload = generateSandboxHtml({
      ...artifact,
      content: editableCode,
    });
    const blob = new Blob([htmlPayload], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Synchronize line gutter scrolling with code textarea
  const handleScrollSync = () => {
    if (textareaRef.current && lineGutterRef.current) {
      lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Cursor position tracking
  const updateCursorPosition = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const textBefore = textarea.value.substring(0, textarea.selectionStart);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  // Handle Tab key 2-space indentation and Ctrl+F Search shortcut
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = editableCode;
      const updated = val.substring(0, start) + '  ' + val.substring(end);
      setEditableCode(updated);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          updateCursorPosition({ currentTarget: textareaRef.current } as any);
        }
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setIsSearchOpen(prev => !prev);
    } else if (e.key === 'Escape' && isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  // Search and replace functionality
  const handleFindNext = () => {
    if (!searchTerm || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const currentPos = textarea.selectionEnd;
    const text = editableCode;
    let nextIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase(), currentPos);
    if (nextIndex === -1) {
      // Loop around
      nextIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase(), 0);
    }
    if (nextIndex !== -1) {
      textarea.focus();
      textarea.setSelectionRange(nextIndex, nextIndex + searchTerm.length);
      updateCursorPosition({ currentTarget: textarea } as any);
    }
  };

  const handleFindPrev = () => {
    if (!searchTerm || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const currentPos = textarea.selectionStart;
    const text = editableCode;
    let prevIndex = text.toLowerCase().lastIndexOf(searchTerm.toLowerCase(), Math.max(0, currentPos - 1));
    if (prevIndex === -1) {
      prevIndex = text.toLowerCase().lastIndexOf(searchTerm.toLowerCase());
    }
    if (prevIndex !== -1) {
      textarea.focus();
      textarea.setSelectionRange(prevIndex, prevIndex + searchTerm.length);
      updateCursorPosition({ currentTarget: textarea } as any);
    }
  };

  const handleReplaceCurrent = () => {
    if (!searchTerm || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editableCode.substring(start, end);
    if (selected.toLowerCase() === searchTerm.toLowerCase()) {
      const newCode = editableCode.substring(0, start) + replaceTerm + editableCode.substring(end);
      setEditableCode(newCode);
      setTimeout(() => {
        handleFindNext();
      }, 0);
    } else {
      handleFindNext();
    }
  };

  const handleReplaceAll = () => {
    if (!searchTerm) return;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const newCode = editableCode.replace(regex, replaceTerm);
    setEditableCode(newCode);
  };

  const searchMatchesCount = useMemo(() => {
    if (!searchTerm.trim()) return 0;
    try {
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      const matches = editableCode.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [editableCode, searchTerm]);

  // Diff comparison calculation
  const baseDiffContent = useMemo(() => {
    if (!versionsList.length) return artifact.content;
    const found = versionsList.find(v => v.version === selectedDiffVersion);
    return found ? found.content : artifact.content;
  }, [versionsList, selectedDiffVersion, artifact.content]);

  const diffResult = useMemo(() => {
    return computeSimpleDiff(baseDiffContent, editableCode);
  }, [baseDiffContent, editableCode]);

  const diffStats = useMemo(() => {
    let adds = 0;
    let dels = 0;
    diffResult.forEach(item => {
      if (item.type === 'added') adds++;
      if (item.type === 'removed') dels++;
    });
    return { adds, dels };
  }, [diffResult]);

  // Console REPL evaluation
  const handleExecuteRepl = () => {
    if (!replInput.trim()) return;
    const codeToEval = replInput.trim();
    setConsoleLogs(prev => [
      ...prev,
      { type: 'input', message: '> ' + codeToEval, timestamp: Date.now() }
    ]);
    setReplHistory(prev => [...prev, codeToEval]);
    setReplInput('');

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'NIXIMA_CANVAS_EVAL_REQUEST',
        code: codeToEval,
      }, '*');
    }
  };

  const filteredConsoleLogs = useMemo(() => {
    if (consoleFilter === 'all') return consoleLogs;
    return consoleLogs.filter(log => log.type === consoleFilter);
  }, [consoleLogs, consoleFilter]);

  const handleExportConsole = () => {
    const formatted = consoleLogs.map(log =>
      `[${new Date(log.timestamp).toLocaleTimeString()}] [${log.type.toUpperCase()}] ${log.message}`
    ).join('\n');
    navigator.clipboard.writeText(formatted);
    playCompletionChime();
  };

  // AI Directives
  const handleTriggerDirective = (customPrompt?: string) => {
    const promptToSend = (customPrompt || directiveInput).trim();
    if (!promptToSend) return;
    onActionPrompt?.(promptToSend);
    setDirectiveInput('');
  };

  // Auto-debug trigger using recent errors if any
  const handleAutoDebug = () => {
    const errorLogs = consoleLogs.filter(l => l.type === 'error');
    if (errorLogs.length > 0) {
      const errorSummary = errorLogs.map(e => e.message).slice(-5).join('\n');
      onActionPrompt?.(`[Auto-Debug] The artifact encountered the following runtime console errors. Please diagnose and fix the implementation cleanly:\n${errorSummary}`);
    } else {
      onActionPrompt?.(`[Auto-Debug] Perform a zero-defect audit on this ${artifact.title}. Fix any subtle boundary conditions, unhandled exceptions, and runtime edge cases.`);
    }
  };

  const getTypeBadge = (type: ArtifactType) => {
    switch (type) {
      case 'html':
        return { label: t.canvas.htmlApp, color: 'text-zinc-200 bg-zinc-850 border-zinc-700' };
      case 'react':
        return { label: t.canvas.reactComponent, color: 'text-zinc-200 bg-zinc-850 border-zinc-700' };
      case 'svg':
        return { label: t.canvas.svgGraphic, color: 'text-zinc-200 bg-zinc-850 border-zinc-700' };
      case 'markdown':
        return { label: t.canvas.markdownDoc, color: 'text-zinc-200 bg-zinc-850 border-zinc-700' };
      case 'code':
      default:
        return { label: t.canvas.scriptCode, color: 'text-zinc-300 bg-zinc-850 border-zinc-700' };
    }
  };

  const typeBadge = getTypeBadge(artifact.type);

  return (
    <div className={`flex flex-col h-full bg-[#0b0b0e] border-l border-zinc-800/90 shadow-2xl transition-all duration-200 select-none ${
      isMaximized ? 'fixed inset-0 z-[150]' : 'relative'
    }`}>
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#101014] border-b border-zinc-800/80 text-zinc-300 gap-2 min-w-0">
        {/* Left: V2 Badge & Type Pill & Artifact Title & Version Dropdown */}
        <div className="flex items-center gap-2 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-[9px] font-mono font-bold text-white tracking-wider flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {t.canvas.v2Badge || 'CANVAS V2.0'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border truncate max-w-[100px] sm:max-w-none ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
          </div>

          <h3 className="font-mono text-xs font-semibold text-white truncate max-w-[120px] sm:max-w-[220px]" title={artifact.title}>
            {artifact.title}
          </h3>

          {/* Version Picker */}
          {versionsList.length > 1 && (
            <div className="relative flex-shrink-0" ref={versionMenuRef}>
              <button
                type="button"
                onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/90 hover:bg-zinc-750 text-[10px] font-mono font-medium text-zinc-300 border border-zinc-700 transition-colors"
                title={t.canvas.versionHistory}
              >
                <History className="w-2.5 h-2.5 text-zinc-400" />
                <span>v{currentVer}</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>

              {isVersionDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 rounded-xl bg-[#141418] border border-zinc-700/80 shadow-2xl p-1.5 z-50 animate-fade-in font-mono text-xs">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 px-2 py-1 border-b border-zinc-800">
                    {t.canvas.versionHistory}
                  </div>
                  <div className="py-1 space-y-0.5 max-h-48 overflow-y-auto">
                    {versionsList.map((ver) => (
                      <button
                        key={ver.version}
                        type="button"
                        onClick={() => {
                          onSelectVersion?.(ver.version);
                          setIsVersionDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                          ver.version === currentVer
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>v{ver.version}</span>
                          {ver.version === versionsList.length && (
                            <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                              {t.canvas.latest}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Mode Tabs (Preview, Code, Diff, Console) */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={t.canvas.previewTab}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.previewTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={t.canvas.codeTab}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.codeTab}</span>
            {hasUnsavedChanges && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
              activeTab === 'diff'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={t.canvas.diff.compareBtn}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.diff.compareBtn}</span>
            {(diffStats.adds > 0 || diffStats.dels > 0) && (
              <span className="hidden md:inline-flex text-[9px] font-mono px-1 rounded bg-zinc-850 text-zinc-300 border border-zinc-800">
                <span className="text-emerald-400">+{diffStats.adds}</span>
                <span className="text-rose-400 ml-1">-{diffStats.dels}</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
              activeTab === 'console'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={t.canvas.consoleTab}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.consoleTab}</span>
            {consoleLogs.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                consoleLogs.some(l => l.type === 'error')
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-zinc-700 text-zinc-300'
              }`}>
                {consoleLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Right: Actions (Refresh, Copy Code, Copy Standalone HTML, Download, Popout, Maximize, Close) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {hasUnsavedChanges ? (
            <button
              type="button"
              onClick={handleApplyChanges}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold shadow-sm transition-all active:scale-95"
              title={t.canvas.applyAndRefresh}
            >
              <Play className="w-3 h-3 fill-black text-black" />
              <span className="hidden md:inline">{t.canvas.applyAndRefresh}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all ${
                isRefreshing ? 'animate-spin text-white' : ''
              }`}
              title={t.canvas.runCode}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyCode}
            className={`p-1.5 rounded-lg transition-all ${
              copied
                ? 'text-white bg-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
            title={copied ? t.canvas.copiedCode : t.common.copy}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleCopyStandaloneHtml}
            className={`p-1.5 rounded-lg transition-all ${
              copiedStandalone
                ? 'text-white bg-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
            title={copiedStandalone ? t.canvas.exportSuite.standaloneCopied : t.canvas.exportSuite.copyStandaloneHtml}
          >
            {copiedStandalone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title={t.canvas.exportFile}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenInNewWindow}
            className="hidden sm:inline-flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title={t.canvas.openInNewTab}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleMaximize}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title={isMaximized ? t.canvas.restore : t.canvas.maximize}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors"
            title={t.canvas.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Content Canvas Body */}
      <div className="flex-1 relative overflow-hidden bg-[#09090b] flex flex-col">
        {/* TAB A: Live Preview Sandbox with Device Viewports & Zoom */}
        <div className={`w-full h-full flex-col ${activeTab === 'preview' ? 'flex' : 'hidden'}`}>
          {/* Sub-toolbar: Device Viewports & Zoom Scaling */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121216] border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={t.canvas.devices.desktop}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                  deviceMode === 'tablet'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={t.canvas.devices.tablet}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet (768px)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={t.canvas.devices.mobile}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (375px)</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[10px] hidden sm:inline">{t.canvas.devices.zoom}:</span>
              <div className="flex items-center bg-zinc-900/80 rounded-md border border-zinc-800 p-0.5">
                {[1, 0.75, 0.5].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setZoomScale(scale)}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${
                      zoomScale === scale
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {Math.round(scale * 100)}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Viewport Render Frame */}
          <div className="flex-1 relative overflow-auto bg-[#070709] flex items-center justify-center p-2 sm:p-4">
            <div
              className={`transition-all duration-300 flex flex-col items-center justify-center ${
                deviceMode === 'desktop'
                  ? 'w-full h-full'
                  : deviceMode === 'tablet'
                  ? 'w-[768px] h-[98%] max-h-[920px] rounded-2xl border-2 border-zinc-700/80 shadow-2xl bg-[#0b0b0e] overflow-hidden'
                  : 'w-[375px] h-[720px] max-h-[98%] rounded-[40px] border-4 border-zinc-700/90 shadow-2xl bg-[#0b0b0e] overflow-hidden relative'
              }`}
              style={{
                transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
                transformOrigin: 'center center',
              }}
            >
              {/* Smartphone Top Notch & Dynamic Island Bezel */}
              {deviceMode === 'mobile' && (
                <div className="w-full flex justify-center pt-2.5 pb-1 bg-black select-none z-10 flex-shrink-0">
                  <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-center gap-2 border border-zinc-800/80 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-zinc-800" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </div>
                </div>
              )}

              {/* Tablet Header Bezel */}
              {deviceMode === 'tablet' && (
                <div className="w-full h-2 bg-zinc-900 border-b border-zinc-800 select-none flex-shrink-0" />
              )}

              {/* Sandboxed Live Render Iframe */}
              <iframe
                ref={iframeRef}
                srcDoc={generateSandboxHtml({
                  ...artifact,
                  content: editableCode,
                })}
                title={artifact.title}
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                className="w-full h-full flex-1 border-0 bg-transparent"
              />

              {/* Smartphone Home Indicator Bar */}
              {deviceMode === 'mobile' && (
                <div className="w-full py-1.5 bg-black flex justify-center select-none z-10 flex-shrink-0">
                  <div className="w-28 h-1 bg-zinc-700 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAB B: Live Code Editor V2 (Gutter, Scroll Sync, Search & Replace, Indentation) */}
        <div className={`w-full h-full flex flex-col font-mono text-xs ${activeTab === 'code' ? 'flex' : 'hidden'}`}>
          {/* Sub-toolbar: Search Toggle & Metadata & Cursor Position */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121216] border-b border-zinc-800 text-[11px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="uppercase text-zinc-300 font-semibold">{artifact.language}</span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                  isSearchOpen
                    ? 'bg-zinc-800 text-white border-zinc-600'
                    : 'hover:bg-zinc-800/80 text-zinc-400 border-transparent hover:border-zinc-700'
                }`}
                title="Search & Replace (Ctrl+F)"
              >
                <Search className="w-3 h-3" />
                <span>Search</span>
              </button>
            </div>

            <div className="flex items-center gap-3 font-mono text-zinc-400">
              <span className="text-zinc-300">
                Ln {cursorPos.line}, Col {cursorPos.col}
              </span>
              <span>•</span>
              <span>{editableCode.split('\n').length} {t.canvas.editor.lineCount}</span>
              <span>•</span>
              <span>{editableCode.length} {t.canvas.editor.charCount}</span>
            </div>
          </div>

          {/* Collapsible Search & Replace Bar */}
          {isSearchOpen && (
            <div className="flex flex-wrap items-center gap-2 p-2 bg-[#16161b] border-b border-zinc-800 text-[11px] animate-fade-in font-mono">
              <div className="relative flex items-center flex-1 min-w-[160px] max-w-xs">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFindNext()}
                  placeholder={t.canvas.editor.searchPlaceholder}
                  className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
                />
                {searchMatchesCount > 0 && (
                  <span className="absolute right-2 text-[10px] text-zinc-400">
                    {searchMatchesCount} {t.canvas.editor.matchCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleFindPrev}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 text-xs"
                >
                  {t.canvas.editor.findPrev}
                </button>
                <button
                  type="button"
                  onClick={handleFindNext}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 text-xs"
                >
                  {t.canvas.editor.findNext}
                </button>
              </div>

              <div className="flex items-center flex-1 min-w-[160px] max-w-xs">
                <input
                  type="text"
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReplaceCurrent()}
                  placeholder={t.canvas.editor.replacePlaceholder}
                  className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReplaceCurrent}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 text-xs"
                >
                  {t.canvas.editor.replace}
                </button>
                <button
                  type="button"
                  onClick={handleReplaceAll}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 text-xs"
                >
                  {t.canvas.editor.replaceAll}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Editor Core: Synchronized Line Gutter + Code Area */}
          <div className="flex-1 flex overflow-hidden bg-[#09090b]">
            {/* Line Numbers Gutter */}
            <div
              ref={lineGutterRef}
              className="overflow-hidden select-none py-3 px-2 text-right text-zinc-600 font-mono text-xs leading-[1.625rem] bg-[#0c0c0f] border-r border-zinc-800/80 min-w-[3.2rem]"
            >
              {editableCode.split('\n').map((_, index) => (
                <div key={index} className="h-[1.625rem]">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea with Tab Key Intercept */}
            <div className="flex-1 relative overflow-hidden bg-[#09090b]">
              <textarea
                ref={textareaRef}
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                onScroll={handleScrollSync}
                onKeyDown={handleEditorKeyDown}
                onKeyUp={updateCursorPosition}
                onClick={updateCursorPosition}
                onSelect={updateCursorPosition}
                spellCheck={false}
                className="w-full h-full p-3 bg-transparent text-zinc-200 font-mono text-xs leading-[1.625rem] resize-none focus:outline-none selection:bg-zinc-700/70 selection:text-white scrollbar-thin scrollbar-thumb-zinc-700"
                placeholder="Enter or edit code here..."
              />
            </div>
          </div>
        </div>

        {/* TAB C: Visual Line-by-Line Version Diff Viewer */}
        <div className={`w-full h-full flex flex-col font-mono text-xs ${activeTab === 'diff' ? 'flex' : 'hidden'}`}>
          {/* Sub-toolbar: Version Selector & Stats */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121216] border-b border-zinc-800 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <GitCompare className="w-3.5 h-3.5 text-zinc-400" />
              <span>Comparing against:</span>
              <select
                value={selectedDiffVersion}
                onChange={(e) => setSelectedDiffVersion(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-zinc-200 text-[11px] focus:outline-none"
              >
                {versionsList.map((ver) => (
                  <option key={ver.version} value={ver.version}>
                    v{ver.version} {ver.version === currentVer ? '(Current Base)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-semibold">+{diffStats.adds} {t.canvas.diff.additions}</span>
              <span className="text-rose-400 font-semibold">-{diffStats.dels} {t.canvas.diff.deletions}</span>
            </div>
          </div>

          {/* Diff Content View */}
          <div className="flex-1 p-2 overflow-y-auto bg-[#070709] space-y-0.5 font-mono text-xs">
            {diffResult.length === 0 ? (
              <div className="text-zinc-500 italic p-6 text-center">
                No differences detected between selected versions.
              </div>
            ) : (
              diffResult.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 px-2.5 py-0.5 rounded font-mono text-[11px] leading-[1.4rem] ${
                    line.type === 'added'
                      ? 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500'
                      : line.type === 'removed'
                      ? 'bg-rose-950/30 text-rose-300 border-l-2 border-rose-500'
                      : 'text-zinc-400 hover:bg-zinc-900/40'
                  }`}
                >
                  <span className="w-10 text-right select-none text-zinc-600 flex-shrink-0 text-[10px]">
                    {line.newLineNumber || line.oldLineNumber || ''}
                  </span>
                  <span className="w-4 select-none font-bold flex-shrink-0">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <pre className="whitespace-pre-wrap break-all flex-1 font-mono m-0">
                    {line.text}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TAB D: Console Output & Interactive REPL */}
        <div className={`w-full h-full flex flex-col font-mono text-xs ${activeTab === 'console' ? 'flex' : 'hidden'}`}>
          {/* Sub-toolbar: Filter Pills & Action Buttons */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121216] border-b border-zinc-800 text-[11px] text-zinc-400">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setConsoleFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                  consoleFilter === 'all'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.canvas.console.filterAll} ({consoleLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setConsoleFilter('log')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                  consoleFilter === 'log'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.canvas.console.filterLogs} ({consoleLogs.filter(l => l.type === 'log').length})
              </button>
              <button
                type="button"
                onClick={() => setConsoleFilter('warn')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                  consoleFilter === 'warn'
                    ? 'bg-amber-950/60 text-amber-300 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.canvas.console.filterWarns} ({consoleLogs.filter(l => l.type === 'warn').length})
              </button>
              <button
                type="button"
                onClick={() => setConsoleFilter('error')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                  consoleFilter === 'error'
                    ? 'bg-rose-950/60 text-rose-300 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.canvas.console.filterErrors} ({consoleLogs.filter(l => l.type === 'error').length})
              </button>
            </div>

            {/* Console Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportConsole}
                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors"
                title={t.canvas.console.exportLogs}
              >
                <FileDown className="w-3 h-3" />
                <span className="hidden sm:inline">{t.canvas.console.exportLogs}</span>
              </button>
              <button
                type="button"
                onClick={() => setConsoleLogs([])}
                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors"
                title={t.canvas.clearConsole}
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">{t.canvas.clearConsole}</span>
              </button>
            </div>
          </div>

          {/* Console Log List */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#070709] space-y-1.5 font-mono text-xs">
            {filteredConsoleLogs.length === 0 ? (
              <div className="text-zinc-500 italic p-6 text-center">
                {t.canvas.consoleEmpty}
              </div>
            ) : (
              filteredConsoleLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border font-mono text-[11px] leading-relaxed break-all ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : log.type === 'warn'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : log.type === 'input'
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-0.5 uppercase">
                    <span>{log.type}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono m-0">{log.message}</pre>
                </div>
              ))
            )}
          </div>

          {/* Interactive REPL Evaluator Bar */}
          <div className="p-2 bg-[#101014] border-t border-zinc-800/80 flex items-center gap-2">
            <span className="text-zinc-500 font-mono text-sm px-1">&gt;</span>
            <input
              type="text"
              value={replInput}
              onChange={(e) => setReplInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteRepl()}
              placeholder={t.canvas.console.replPlaceholder}
              className="flex-1 px-3 py-1.5 bg-[#141418] border border-zinc-750 rounded-lg text-zinc-200 placeholder-zinc-500 font-mono text-xs focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <button
              type="button"
              onClick={handleExecuteRepl}
              disabled={!replInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-mono text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title={t.canvas.console.runRepl}
            >
              {t.canvas.console.runRepl}
            </button>
          </div>
        </div>
      </div>

      {/* 3. In-Canvas AI Directive Bar & Quick Action Chips */}
      <div className="p-2 sm:p-2.5 bg-[#101014] border-t border-zinc-800/80 flex flex-col gap-2">
        {/* Natural Language AI Directive Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={directiveInput}
              onChange={(e) => setDirectiveInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTriggerDirective()}
              placeholder={t.canvas.aiDirective.placeholder}
              className="w-full pl-9 pr-3 py-1.5 bg-[#141418] border border-zinc-750 hover:border-zinc-700 focus:border-zinc-500 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => handleTriggerDirective()}
            disabled={!directiveInput.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-white text-black font-mono text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 flex-shrink-0"
            title={t.canvas.aiDirective.send}
          >
            <Send className="w-3 h-3 text-black" />
            <span className="hidden sm:inline">{t.canvas.aiDirective.send}</span>
          </button>
        </div>

        {/* Quick Directive Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {/* Auto Debug Chip */}
          <button
            type="button"
            onClick={handleAutoDebug}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-mono whitespace-nowrap transition-all ${
              consoleLogs.some(l => l.type === 'error')
                ? 'bg-rose-950/50 border-rose-700 text-rose-300 hover:bg-rose-900/60 shadow-sm animate-pulse'
                : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>{t.canvas.aiDirective.autoDebug}</span>
          </button>

          {/* Web Audio FX */}
          <button
            type="button"
            onClick={() => handleTriggerDirective(`Enhance this ${artifact.title} by generating and integrating procedural interactive audio sound effects using the standard HTML5 Web Audio API (synthesizer chimes on clicks, state changes, or game actions).`)}
            className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] font-mono text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {t.canvas.aiDirective.soundEffects}
          </button>

          {/* Dark Neon Polish */}
          <button
            type="button"
            onClick={() => handleTriggerDirective(`Polish this ${artifact.title} with a top-tier obsidian titanium dark theme: use deep zinc/black backgrounds, crisp specular borders, subtle glowing highlights, and micro-interactions.`)}
            className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] font-mono text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {t.canvas.aiDirective.darkNeon}
          </button>

          {/* Mobile Touch */}
          <button
            type="button"
            onClick={() => handleTriggerDirective(`Make this ${artifact.title} fully responsive and touch-optimized for mobile devices, with fluid flex/grid layouts and generous tap targets.`)}
            className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] font-mono text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {t.canvas.aiDirective.mobileFriendly}
          </button>

          {/* Zero-Defect Refactor */}
          <button
            type="button"
            onClick={() => handleTriggerDirective(`Perform a comprehensive zero-defect refactoring of this ${artifact.title}: optimize state management, add defensive error boundaries, and streamline rendering performance.`)}
            className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] font-mono text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {t.canvas.aiDirective.refactor}
          </button>
        </div>
      </div>
    </div>
  );
};
