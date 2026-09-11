import React, { useState, useEffect, useRef } from 'react';
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
  Trash2
} from 'lucide-react';
import { NiximaArtifact, ArtifactType } from '../types/chat';
import { generateSandboxHtml } from '../utils/artifactDetector';
import { playCompletionChime } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

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
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'console'>('preview');
  const [editableCode, setEditableCode] = useState(artifact.content);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: string; message: string; timestamp: number }>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const versionMenuRef = useRef<HTMLDivElement>(null);

  // Sync editable code when artifact content changes
  useEffect(() => {
    setEditableCode(artifact.content);
  }, [artifact.content, artifact.currentVersion]);

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
        setConsoleLogs(prev => [...prev.slice(-100), event.data.payload]);
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

  const getTypeBadge = (type: ArtifactType) => {
    switch (type) {
      case 'html':
        return { label: t.canvas.htmlApp, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
      case 'react':
        return { label: t.canvas.reactComponent, color: 'text-cyan-300 bg-blue-950/60 border-blue-800/60' };
      case 'svg':
        return { label: t.canvas.svgGraphic, color: 'text-purple-300 bg-purple-950/60 border-purple-800/60' };
      case 'markdown':
        return { label: t.canvas.markdownDoc, color: 'text-amber-300 bg-amber-950/60 border-amber-800/60' };
      case 'code':
      default:
        return { label: t.canvas.scriptCode, color: 'text-zinc-300 bg-zinc-800/80 border-zinc-700' };
    }
  };

  const typeBadge = getTypeBadge(artifact.type);
  const versionsList = artifact.versions || [];
  const currentVer = artifact.currentVersion || 1;

  return (
    <div className={`flex flex-col h-full bg-[#0b0b0e] border-l border-zinc-800/90 shadow-2xl transition-all duration-200 select-none ${
      isMaximized ? 'fixed inset-0 z-[150]' : 'relative'
    }`}>
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#101014] border-b border-zinc-800/80 text-zinc-300 gap-2 min-w-0">
        {/* Left: Type Pill & Artifact Title & Version Dropdown */}
        <div className="flex items-center gap-2 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="p-1 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border truncate max-w-[120px] sm:max-w-none ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
          </div>

          <h3 className="font-mono text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[240px]" title={artifact.title}>
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
                            ? 'bg-cyan-950/60 text-cyan-300 font-semibold'
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

        {/* Center: Mode Tabs */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={t.canvas.codeTab}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.codeTab}</span>
            {hasUnsavedChanges && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              activeTab === 'console'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={t.canvas.consoleTab}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.consoleTab}</span>
            {consoleLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-700 text-[9px] font-mono text-zinc-300">
                {consoleLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Right: Actions (Refresh, Copy, Download, Popout, Maximize, Close) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {hasUnsavedChanges ? (
            <button
              type="button"
              onClick={handleApplyChanges}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium shadow-md transition-all active:scale-95"
              title={t.canvas.applyAndRefresh}
            >
              <Play className="w-3 h-3 fill-white" />
              <span className="hidden md:inline">{t.canvas.applyAndRefresh}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all ${
                isRefreshing ? 'animate-spin text-cyan-400' : ''
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
                ? 'text-emerald-400 bg-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
            title={copied ? t.canvas.copiedCode : t.common.copy}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
      <div className="flex-1 relative overflow-hidden bg-[#09090b]">
        {/* TAB A: Live Preview Sandbox */}
        <div className={`w-full h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
          <iframe
            ref={iframeRef}
            srcDoc={generateSandboxHtml({
              ...artifact,
              content: editableCode,
            })}
            title={artifact.title}
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            className="w-full h-full border-0 bg-transparent"
          />
        </div>

        {/* TAB B: Code Editor */}
        <div className={`w-full h-full flex flex-col font-mono text-xs ${activeTab === 'code' ? 'flex' : 'hidden'}`}>
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121216] border-b border-zinc-800 text-[11px] text-zinc-400">
            <span className="uppercase text-zinc-400 font-semibold">{artifact.language}</span>
            <div className="flex items-center gap-3">
              <span>{editableCode.split('\n').length} lines</span>
              <span>{editableCode.length} characters</span>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-[#0a0a0d]">
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-zinc-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-cyan-900/60 selection:text-white scrollbar-thin scrollbar-thumb-zinc-700"
              placeholder="Enter or edit code here..."
            />
          </div>
        </div>

        {/* TAB C: Console Logs */}
        <div className={`w-full h-full flex flex-col font-mono text-xs ${activeTab === 'console' ? 'flex' : 'hidden'}`}>
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121216] border-b border-zinc-800 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Canvas Console Output</span>
            </span>
            <button
              type="button"
              onClick={() => setConsoleLogs([])}
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors"
              title={t.canvas.clearConsole}
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.canvas.clearConsole}</span>
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-[#070709] space-y-1.5 font-mono text-xs">
            {consoleLogs.length === 0 ? (
              <div className="text-zinc-500 italic p-4 text-center">
                {t.canvas.consoleEmpty}
              </div>
            ) : (
              consoleLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border font-mono text-[11px] leading-relaxed break-all ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : log.type === 'warn'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-0.5 uppercase">
                    <span>{log.type}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono">{log.message}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Follow-up Quick Action Chips */}
      <div className="p-2.5 bg-[#101014] border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">Iterate:</span>
        </span>

        <button
          type="button"
          onClick={() => onActionPrompt?.(`Please enhance this ${artifact.title}: make it responsive with fluid grid layouts and mobile optimization.`)}
          className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
        >
          {t.canvas.promptSuggestions.makeResponsive}
        </button>

        <button
          type="button"
          onClick={() => onActionPrompt?.(`Please update this ${artifact.title}: add sleek dark mode styling with neon glowing highlights.`)}
          className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
        >
          {t.canvas.promptSuggestions.darkMode}
        </button>

        <button
          type="button"
          onClick={() => onActionPrompt?.(`Please add interactive animations, hover effects, and sound feedback to this ${artifact.title}.`)}
          className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
        >
          {t.canvas.promptSuggestions.addInteractivity}
        </button>

        <button
          type="button"
          onClick={() => onActionPrompt?.(`Please refactor and optimize the code of this ${artifact.title} for maximum production performance.`)}
          className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
        >
          {t.canvas.promptSuggestions.refactorCode}
        </button>
      </div>
    </div>
  );
};
