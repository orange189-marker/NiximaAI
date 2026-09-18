import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Languages, 
  ArrowLeftRight, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX,
  Upload, 
  Download, 
  Star, 
  Clock, 
  Trash2, 
  X, 
  Search, 
  MessageSquare, 
  Code2, 
  Globe2, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  CheckCircle2,
  BookOpen,
  Send,
  Zap,
  RotateCcw
} from 'lucide-react';
import { ModelOption, TranslationTone, LinguisticInsight, TranslationRecord } from '../types/chat';
import { useLanguage } from '../context/LanguageContext';
import { 
  WORLD_LANGUAGES, 
  POPULAR_LANGUAGES, 
  AUTO_DETECT_LANGUAGE, 
  getLanguageByCode, 
  detectLanguageFromText, 
  searchLanguages,
  Language 
} from '../data/languages';
import { 
  translateTextWithAI, 
  getStoredTranslationHistory, 
  saveTranslationToHistory, 
  toggleFavoriteTranslation, 
  deleteTranslationFromHistory, 
  clearTranslationHistory 
} from '../utils/translator';
import { playCompletionChime } from '../utils/sound';

interface NiximaTranslatorStudioProps {
  currentModel: ModelOption;
  userCredits?: number;
  onOpenCredits?: () => void;
  onSendToChat?: (text: string) => void;
  onSendToCode?: (code: string) => void;
  onSwitchToChat?: () => void;
  onSwitchToCode?: () => void;
}

export const NiximaTranslatorStudio: React.FC<NiximaTranslatorStudioProps> = ({
  currentModel,
  userCredits = 1000,
  onOpenCredits,
  onSendToChat,
  onSendToCode,
  onSwitchToChat,
  onSwitchToCode,
}) => {
  const { language, t } = useLanguage();

  // Primary state
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState(() => language === 'uk' ? 'en' : 'uk');
  const [detectedLangCode, setDetectedLangCode] = useState<string | null>(null);
  const [tone, setTone] = useState<TranslationTone>('standard');
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [insights, setInsights] = useState<LinguisticInsight | null>(null);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  // Modals & tabs
  const [activeTab, setActiveTab] = useState<'workbench' | 'history' | 'phrasebook'>('workbench');
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [history, setHistory] = useState<TranslationRecord[]>(() => getStoredTranslationHistory());
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);

  // Feedback states
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const abortCtrlRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoTranslateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Resolved Language Objects
  const sourceLangObj = useMemo(() => getLanguageByCode(sourceLang), [sourceLang]);
  const targetLangObj = useMemo(() => getLanguageByCode(targetLang), [targetLang]);
  const detectedLangObj = useMemo(() => detectedLangCode ? getLanguageByCode(detectedLangCode) : null, [detectedLangCode]);

  // Dynamic automatic language detection
  useEffect(() => {
    if (sourceLang === 'auto' && sourceText.trim().length >= 3) {
      const detected = detectLanguageFromText(sourceText);
      setDetectedLangCode(detected.code);
    } else if (sourceLang !== 'auto') {
      setDetectedLangCode(null);
    }
  }, [sourceText, sourceLang]);

  // Debounced auto-translate
  useEffect(() => {
    if (!autoTranslate || !sourceText.trim()) return;

    if (autoTranslateTimerRef.current) {
      clearTimeout(autoTranslateTimerRef.current);
    }

    autoTranslateTimerRef.current = setTimeout(() => {
      handleTranslate();
    }, 750);

    return () => {
      if (autoTranslateTimerRef.current) {
        clearTimeout(autoTranslateTimerRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang, tone, autoTranslate]);

  // Cancel speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      abortCtrlRef.current?.abort();
    };
  }, []);

  // Primary Translation Dispatcher
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      setInsights(null);
      return;
    }

    abortCtrlRef.current?.abort();
    const abortCtrl = new AbortController();
    abortCtrlRef.current = abortCtrl;

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const result = await translateTextWithAI({
        text: sourceText,
        sourceLang,
        targetLang,
        tone,
        model: currentModel,
        callbacks: {
          onToken: (token) => {
            setTranslatedText(token);
          },
          onInsights: (ins) => {
            setInsights(ins);
            setIsInsightsOpen(true);
          },
        },
        signal: abortCtrl.signal,
      });

      setTranslatedText(result.translatedText);
      if (result.detectedSourceLang) {
        setDetectedLangCode(result.detectedSourceLang);
      }
      if (result.insights) {
        setInsights(result.insights);
      }

      playCompletionChime();

      // Save to History Record
      const newRecord: TranslationRecord = {
        id: 'trans-' + Date.now(),
        sourceLang: result.detectedSourceLang || sourceLang,
        targetLang,
        sourceText,
        translatedText: result.translatedText,
        tone,
        timestamp: Date.now(),
        isFavorite: false,
        modelId: currentModel.id,
        insights: result.insights,
      };
      const updatedHistory = saveTranslationToHistory(newRecord);
      setHistory(updatedHistory);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('[Nixima Translator] Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      const currentDetected = detectedLangCode || 'en';
      setSourceLang(targetLang);
      setTargetLang(currentDetected);
    } else {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }

    // Also swap text if both exist
    if (translatedText.trim()) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Copy with sound
  const handleCopy = (text: string, isTarget: boolean) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isTarget) {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    } else {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    }
    playCompletionChime();
  };

  // Text to Speech
  const handleSpeak = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const resolved = langCode === 'auto' ? (detectedLangCode || 'en') : langCode;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = resolved;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSourceText(text);
      }
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
  };

  // Download Translation
  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${targetLang}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSourceText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Star / Favorite
  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteTranslation(id);
    setHistory(updated);
  };

  // Delete from history
  const handleDeleteHistory = (id: string) => {
    const updated = deleteTranslationFromHistory(id);
    setHistory(updated);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    clearTranslationHistory();
    setHistory([]);
  };

  // Restore from history
  const handleRestoreRecord = (rec: TranslationRecord) => {
    setSourceText(rec.sourceText);
    setTranslatedText(rec.translatedText);
    setSourceLang(rec.sourceLang);
    setTargetLang(rec.targetLang);
    setTone(rec.tone);
    if (rec.insights) {
      setInsights(rec.insights);
      setIsInsightsOpen(true);
    }
    setActiveTab('workbench');
  };

  // Filtered languages for modal search
  const filteredLanguages = useMemo(() => searchLanguages(langSearch), [langSearch]);

  const toneConfig: Record<TranslationTone, { label: string; desc: string }> = {
    standard: { label: t.niximaTranslator.toneStandard, desc: t.niximaTranslator.toneStandardDesc },
    formal: { label: t.niximaTranslator.toneFormal, desc: t.niximaTranslator.toneFormalDesc },
    casual: { label: t.niximaTranslator.toneCasual, desc: t.niximaTranslator.toneCasualDesc },
    technical: { label: t.niximaTranslator.toneTechnical, desc: t.niximaTranslator.toneTechnicalDesc },
    literary: { label: t.niximaTranslator.toneLiterary, desc: t.niximaTranslator.toneLiteraryDesc },
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-[#07090e] overflow-y-auto text-zinc-100 font-sans select-none relative">
      {/* Background ambient lighting glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Telemetry Ribbon */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.35)] flex-shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Languages className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  {t.niximaTranslator.heroTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 tracking-wider uppercase">
                  {t.niximaTranslator.heroBadge}
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                  {currentModel.name}
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                {t.niximaTranslator.heroSubtitle}
              </p>
            </div>
          </div>

          {/* Top Control Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Tone Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-750 hover:border-zinc-600 text-xs font-mono text-zinc-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title={t.niximaTranslator.toneLabel}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="capitalize">{toneConfig[tone].label}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isToneDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 p-1.5 bg-zinc-900/95 border border-zinc-750 rounded-xl shadow-2xl z-30 space-y-1 backdrop-blur-xl animate-fade-in font-mono text-xs">
                  {(['standard', 'formal', 'casual', 'technical', 'literary'] as TranslationTone[]).map((tKey) => (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => {
                        setTone(tKey);
                        setIsToneDropdownOpen(false);
                        if (sourceText.trim() && autoTranslate) handleTranslate();
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer flex flex-col ${
                        tone === tKey ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40' : 'hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <span className="font-bold flex items-center justify-between">
                        {toneConfig[tKey].label}
                        {tone === tKey && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                        {toneConfig[tKey].desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Instant auto-translate toggle */}
            <button
              type="button"
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                autoTranslate 
                  ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title={t.niximaTranslator.autoTranslateToggle}
            >
              <Zap className={`w-3.5 h-3.5 ${autoTranslate ? 'text-cyan-400 fill-cyan-400 animate-pulse' : 'text-zinc-500'}`} />
              <span className="hidden sm:inline">{t.niximaTranslator.autoTranslateActive}</span>
            </button>

            {/* View tabs (Workbench vs History vs Phrasebook) */}
            <div className="flex items-center gap-1 p-0.5 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('workbench')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'workbench' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Workbench
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'history' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span className="hidden sm:inline">{t.niximaTranslator.historyTab}</span>
                <span>({history.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('phrasebook')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'phrasebook' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="hidden sm:inline">{t.niximaTranslator.phrasebookTab}</span>
                <span>({history.filter(h => h.isFavorite).length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6">
        {activeTab === 'workbench' ? (
          <>
            {/* Dual Pane Translator Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative">
              {/* SOURCE CARD */}
              <div className="flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                {/* Source Language Bar */}
                <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                    {/* Source Auto-Detect button */}
                    <button
                      type="button"
                      onClick={() => setSourceLang('auto')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                        sourceLang === 'auto'
                          ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/50 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span>✨</span>
                      <span>{t.niximaTranslator.autoDetectLabel}</span>
                      {detectedLangObj && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-500/30 text-cyan-200">
                          {detectedLangObj.flag} {detectedLangObj.name}
                        </span>
                      )}
                    </button>

                    {/* Popular quick pills */}
                    {POPULAR_LANGUAGES.slice(0, 4).map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSourceLang(lang.code)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                          sourceLang === lang.code
                            ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/50 font-bold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}

                    {/* All languages modal opener */}
                    <button
                      type="button"
                      onClick={() => {
                        setLangSearch('');
                        setIsSourceModalOpen(true);
                      }}
                      className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>+100</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Character count */}
                  <div className="text-[10px] font-mono text-zinc-500 flex-shrink-0 pl-2">
                    {sourceText.length} {t.niximaTranslator.characters}
                  </div>
                </div>

                {/* Source Input Text Area */}
                <div className="flex-1 p-4 min-h-[220px] sm:min-h-[260px] flex flex-col">
                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleTranslate();
                      }
                    }}
                    placeholder={t.niximaTranslator.sourcePlaceholder}
                    dir={sourceLangObj.direction || 'ltr'}
                    className="w-full flex-1 bg-transparent resize-none focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm sm:text-base leading-relaxed font-sans"
                  />
                </div>

                {/* Source Toolbar */}
                <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1">
                    {/* Paste */}
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      title={t.niximaTranslator.pasteSource}
                    >
                      <Copy className="w-4 h-4 rotate-180" />
                    </button>

                    {/* Listen */}
                    {sourceText.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(sourceText, sourceLang)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSpeaking ? 'text-cyan-400 bg-cyan-950/40' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                        title={t.niximaTranslator.listenText}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Upload Document */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".txt,.md,.json,.csv,.js,.ts" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      title={t.niximaTranslator.uploadDocumentHint}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Clear text */}
                    {sourceText && (
                      <button
                        type="button"
                        onClick={() => {
                          setSourceText('');
                          setTranslatedText('');
                          setInsights(null);
                        }}
                        className="px-2 py-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 transition-colors cursor-pointer flex items-center gap-1"
                        title={t.niximaTranslator.clearSource}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t.niximaTranslator.clearSource}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CENTER SWAP BUTTON (Overlay in center on desktop) */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <button
                  type="button"
                  onClick={handleSwapLanguages}
                  className="pointer-events-auto p-2.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer group active:scale-95 shadow-xl"
                  title={t.niximaTranslator.swapLanguagesTooltip}
                >
                  <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>

              {/* TARGET CARD */}
              <div className="flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all focus-within:border-cyan-500/50">
                {/* Target Language Bar */}
                <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                    {/* Mobile swap button */}
                    <button
                      type="button"
                      onClick={handleSwapLanguages}
                      className="lg:hidden p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer mr-1"
                      title={t.niximaTranslator.swapLanguagesTooltip}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Popular quick pills */}
                    {POPULAR_LANGUAGES.slice(0, 5).map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setTargetLang(lang.code)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                          targetLang === lang.code
                            ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 font-bold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}

                    {/* All languages modal opener */}
                    <button
                      type="button"
                      onClick={() => {
                        setLangSearch('');
                        setIsTargetModalOpen(true);
                      }}
                      className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>+100</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Active target badge */}
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800/90 text-cyan-300 border border-zinc-700/80 flex items-center gap-1 flex-shrink-0">
                    <span>{targetLangObj.flag}</span>
                    <span>{targetLangObj.name}</span>
                  </span>
                </div>

                {/* Target Output Area */}
                <div className="flex-1 p-4 min-h-[220px] sm:min-h-[260px] flex flex-col relative">
                  {translatedText ? (
                    <div 
                      dir={targetLangObj.direction || 'ltr'}
                      className="text-zinc-100 text-sm sm:text-base leading-relaxed select-text font-sans whitespace-pre-wrap break-words"
                    >
                      {translatedText}
                      {isTranslating && (
                        <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-sm">
                      {isTranslating ? (
                        <div className="flex flex-col items-center gap-2 text-cyan-400 animate-pulse font-mono text-xs">
                          <RotateCcw className="w-5 h-5 animate-spin" />
                          <span>{t.niximaTranslator.translatingButton}</span>
                        </div>
                      ) : (
                        <div className="space-y-1 font-sans">
                          <p>{t.niximaTranslator.targetPlaceholder}</p>
                          <p className="text-xs text-zinc-600 font-mono">
                            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">Ctrl + Enter</kbd> to translate
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Toolbar */}
                <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1">
                    {/* Copy */}
                    <button
                      type="button"
                      onClick={() => handleCopy(translatedText, true)}
                      disabled={!translatedText}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title={t.niximaTranslator.copyTranslation}
                    >
                      {copiedTarget ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Listen */}
                    {translatedText && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(translatedText, targetLang)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSpeaking ? 'text-cyan-400 bg-cyan-950/40' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                        title={t.niximaTranslator.listenText}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Download */}
                    {translatedText && (
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                        title={t.niximaTranslator.downloadTranslation}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    {/* Star / Bookmark */}
                    {translatedText && (
                      <button
                        type="button"
                        onClick={() => {
                          if (history.length > 0) {
                            handleToggleFavorite(history[0].id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                        title={t.niximaTranslator.saveToPhrasebook}
                      >
                        <Star className={`w-4 h-4 ${history[0]?.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Send to Chat or Code buttons */}
                    {translatedText && (
                      <div className="flex items-center gap-1">
                        {onSendToChat && (
                          <button
                            type="button"
                            onClick={() => {
                              onSendToChat(translatedText);
                              onSwitchToChat?.();
                            }}
                            className="px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.niximaTranslator.sendToChat}
                          >
                            <MessageSquare className="w-3 h-3 text-zinc-400" />
                            <span className="hidden sm:inline">Chat</span>
                          </button>
                        )}
                        {onSendToCode && (
                          <button
                            type="button"
                            onClick={() => {
                              onSendToCode(translatedText);
                              onSwitchToCode?.();
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.niximaTranslator.sendToCode}
                          >
                            <Code2 className="w-3 h-3 text-emerald-400" />
                            <span className="hidden sm:inline">Code</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PRIMARY TRANSLATE ACTION BAR */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Globe2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="hidden sm:inline">{t.niximaTranslator.globalMeshNotice}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-[0_4px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_30px_rgba(6,182,212,0.45)] transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 font-mono"
                >
                  {isTranslating ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>{t.niximaTranslator.translatingButton}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white/20" />
                      <span>{t.niximaTranslator.translateButton}</span>
                      <span className="hidden sm:inline text-[10px] opacity-70 bg-black/20 px-1.5 py-0.5 rounded">Ctrl+↵</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* DEEP LINGUISTIC NUANCES & INSIGHTS DRAWER */}
            {insights && (
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c0f1d]/90 via-zinc-950/80 to-[#071318]/90 backdrop-blur-xl p-4 sm:p-5 space-y-4 shadow-[0_10px_35px_rgba(99,102,241,0.1)] animate-fade-in">
                <div 
                  onClick={() => setIsInsightsOpen(!isInsightsOpen)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-indigo-200">
                      {t.niximaTranslator.insightsTab}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      AI LINGUISTICS
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isInsightsOpen ? 'rotate-180' : ''}`} />
                </div>

                {isInsightsOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80 text-xs font-sans">
                    {/* Alternative Synonyms & Phrasings */}
                    {insights.synonyms && insights.synonyms.length > 0 && (
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                        <span className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {t.niximaTranslator.synonymsTitle}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {insights.synonyms.map((syn, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setTranslatedText(syn);
                                playCompletionChime();
                              }}
                              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans border border-zinc-750 transition-colors cursor-pointer"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transliteration / Romanization */}
                    {insights.transliteration && (
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                        <span className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {t.niximaTranslator.transliterationTitle}
                        </span>
                        <p className="font-mono text-cyan-300 text-xs tracking-wide">
                          {insights.transliteration}
                        </p>
                      </div>
                    )}

                    {/* Cultural & Contextual Notes */}
                    {insights.culturalContext && (
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                        <span className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {t.niximaTranslator.culturalNotesTitle}
                        </span>
                        <p className="text-zinc-300 leading-relaxed text-xs">
                          {insights.culturalContext}
                        </p>
                      </div>
                    )}

                    {/* Key Vocabulary Breakdown */}
                    {insights.vocabulary && insights.vocabulary.length > 0 && (
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 md:col-span-2">
                        <span className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {t.niximaTranslator.vocabularyTitle}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {insights.vocabulary.map((vocab, vIdx) => (
                            <div key={vIdx} className="p-2 rounded-lg bg-zinc-950/50 border border-zinc-850 flex flex-col">
                              <span className="font-bold text-white text-xs">{vocab.term}</span>
                              {vocab.pos && <span className="text-[10px] font-mono text-cyan-400">{vocab.pos}</span>}
                              <span className="text-[11px] text-zinc-400 mt-0.5">{vocab.meaning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* HISTORY & PHRASEBOOK TAB */
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">
                  {activeTab === 'phrasebook' ? t.niximaTranslator.phrasebookTab : t.niximaTranslator.historyTab}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  ({activeTab === 'phrasebook' ? history.filter(h => h.isFavorite).length : history.length} items)
                </span>
              </div>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/20 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.niximaTranslator.clearHistory}</span>
                </button>
              )}
            </div>

            {/* List of translations */}
            {(() => {
              const displayList = activeTab === 'phrasebook' ? history.filter(h => h.isFavorite) : history;

              if (displayList.length === 0) {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-500 space-y-2">
                    <BookOpen className="w-8 h-8 text-zinc-600" />
                    <p className="text-sm font-sans">
                      {activeTab === 'phrasebook' ? t.niximaTranslator.noSavedPhrasesYet : t.niximaTranslator.noHistoryYet}
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 gap-3 overflow-y-auto">
                  {displayList.map((rec) => {
                    const srcObj = getLanguageByCode(rec.sourceLang);
                    const tgtObj = getLanguageByCode(rec.targetLang);

                    return (
                      <div
                        key={rec.id}
                        className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all flex flex-col gap-2 group"
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                          <div className="flex items-center gap-2">
                            <span>{srcObj.flag} {srcObj.name}</span>
                            <ArrowLeftRight className="w-3 h-3 text-zinc-500" />
                            <span className="text-cyan-300 font-bold">{tgtObj.flag} {tgtObj.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 uppercase">
                              {rec.tone}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-500">
                              {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleFavorite(rec.id)}
                              className="p-1 rounded text-zinc-400 hover:text-amber-400 cursor-pointer"
                              title={t.niximaTranslator.saveToPhrasebook}
                            >
                              <Star className={`w-3.5 h-3.5 ${rec.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHistory(rec.id)}
                              className="p-1 rounded text-zinc-500 hover:text-red-400 cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="p-2 rounded-lg bg-zinc-950/40 border border-zinc-850 text-zinc-400 text-xs line-clamp-3">
                            {rec.sourceText}
                          </div>
                          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-100 text-xs font-medium line-clamp-3">
                            {rec.translatedText}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRestoreRecord(rec)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Restore to Workbench</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* LANGUAGE SELECTOR MODAL (SOURCE) */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0d1017] border border-zinc-750 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>{t.niximaTranslator.sourceLanguageLabel}</span>
              </span>
              <button 
                onClick={() => setIsSourceModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder={t.niximaTranslator.searchLanguagesPlaceholder}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-sans text-xs">
              {/* Auto detect option */}
              <button
                type="button"
                onClick={() => {
                  setSourceLang('auto');
                  setIsSourceModalOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                  sourceLang === 'auto' ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/50' : 'hover:bg-zinc-800/80 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">✨</span>
                  <span className="font-bold">{t.niximaTranslator.autoDetectLabel}</span>
                </div>
                {sourceLang === 'auto' && <Check className="w-4 h-4 text-cyan-400" />}
              </button>

              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSourceLang(lang.code);
                    setIsSourceModalOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                    sourceLang === lang.code ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/50' : 'hover:bg-zinc-800/80 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span className="font-medium text-white">{lang.name}</span>
                    <span className="text-zinc-500 text-[11px]">({lang.nativeName})</span>
                  </div>
                  {sourceLang === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LANGUAGE SELECTOR MODAL (TARGET) */}
      {isTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0d1017] border border-zinc-750 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>{t.niximaTranslator.targetLanguageLabel}</span>
              </span>
              <button 
                onClick={() => setIsTargetModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder={t.niximaTranslator.searchLanguagesPlaceholder}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-sans text-xs">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setTargetLang(lang.code);
                    setIsTargetModalOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                    targetLang === lang.code ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'hover:bg-zinc-800/80 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span className="font-medium text-white">{lang.name}</span>
                    <span className="text-zinc-500 text-[11px]">({lang.nativeName})</span>
                  </div>
                  {targetLang === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
