import React, { useState, useRef } from 'react';
import { 
  X, 
  Sliders, 
  Server, 
  User, 
  Sparkles, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Key, 
  Check, 
  Copy, 
  Cpu, 
  Flame, 
  FileText,
  ShieldAlert,
  Zap,
  Keyboard,
  Globe,
  Gift
} from 'lucide-react';
import { UserSettings, Conversation } from '../types/chat';
import { NiximaUser } from '../types/user';
import { playTypingTick } from '../utils/sound';
import { NiximaIdLogo } from './NiximaIdLogo';
import { getSavedHotkey, HotkeyConfig, HOTKEY_CHANGE_EVENT } from '../utils/hotkeys';
import { HotkeyCustomizerModal } from './HotkeyCustomizerModal';
import { useLanguage } from '../context/LanguageContext';
import { CountryFlag } from './CountryFlag';
import { claimDailyGrant, getDailyGrantStatus, getUserCredits, isCreatorAccount } from '../utils/credits';
import { MODELS } from '../data/models';
import { CreditHeroCounter } from './AnimatedCredits';
import { NiximaCreditLogo } from './NiximaCreditLogo';
import { InfinitySymbol } from './InfinitySymbol';

export type SettingsTab = 'general' | 'inference' | 'persona' | 'data' | 'api' | 'credits';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearAllChats: () => void;
  conversations: Conversation[];
  onImportConversations: (imported: Conversation[]) => void;
  currentUser: NiximaUser | null;
  onLogout: () => void;
  initialTab?: SettingsTab;
  onUserUpdated?: (user: NiximaUser) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllChats,
  conversations,
  onImportConversations,
  currentUser,
  onLogout,
  initialTab = 'general',
  onUserUpdated,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [dailyClaimSuccess, setDailyClaimSuccess] = useState(false);
  const [dailyGrantStatus, setDailyGrantStatus] = useState(() => getDailyGrantStatus(currentUser));
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [hotkeyConfig, setHotkeyConfig] = useState<HotkeyConfig>(() => getSavedHotkey());
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDailyGrantStatus(getDailyGrantStatus(currentUser));
    }
  }, [isOpen, currentUser]);

  const handleClaimDailyGrant = () => {
    if (!currentUser) return;
    const res = claimDailyGrant(currentUser);
    if (res.success) {
      onUserUpdated?.(res.updatedUser);
      setDailyGrantStatus(getDailyGrantStatus(res.updatedUser));
      playTypingTick();
      setDailyClaimSuccess(true);
      setTimeout(() => setDailyClaimSuccess(false), 3000);
    } else {
      setDailyGrantStatus(getDailyGrantStatus(currentUser));
    }
  };

  React.useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setHotkeyConfig(e.detail);
      } else {
        setHotkeyConfig(getSavedHotkey());
      }
    };
    window.addEventListener(HOTKEY_CHANGE_EVENT, handleUpdate);
    return () => window.removeEventListener(HOTKEY_CHANGE_EVENT, handleUpdate);
  }, []);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const mockApiKey = 'nxm-frontier-99a4e21b88e1467df83c921';

  const copyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  // Export all conversations to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nixima_export_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export all conversations to Markdown
  const handleExportMarkdown = () => {
    let md = `# Nixima AI Conversation Archive\n\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
    conversations.forEach((conv, idx) => {
      md += `## ${idx + 1}. ${conv.title}\n`;
      md += `*Model: ${conv.model} | Created: ${new Date(conv.createdAt).toLocaleString()}*\n\n`;
      conv.messages.forEach((msg) => {
        const role = msg.sender === 'user' ? 'Operator' : 'Nixima AI';
        md += `### [${role}] - ${new Date(msg.timestamp).toLocaleTimeString()}\n\n${msg.content}\n\n`;
      });
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `nixima_archive_${new Date().toISOString().slice(0,10)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].messages) {
          onImportConversations(parsed);
          setImportStatus('success');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err) {
        setImportStatus('error');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const tones = t.settings.tones;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#0e0e11]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-white" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              {t.settings.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-zinc-800 bg-[#0e0e11] px-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {t.settings.tabs.general}
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'credits' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <NiximaCreditLogo size={13} />
            {t.settings.tabs.credits}
          </button>
          <button
            onClick={() => setActiveTab('inference')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inference' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {t.settings.tabs.inference}
          </button>
          <button
            onClick={() => setActiveTab('persona')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'persona' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.settings.tabs.persona}
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            {t.settings.tabs.data}
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'api' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {t.settings.tabs.api}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Language Preference Selector */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/80 shadow-inner-light space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {t.settings.languageSectionTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {language === 'uk' ? 'UA • 100% Локалізовано' : 'EN • Native Interface'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {t.settings.languageSectionDesc}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('uk')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      language === 'uk'
                        ? 'bg-zinc-800 border-white text-white shadow-glow-subtle'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CountryFlag country="ua" size="sm" glow={language === 'uk'} />
                        <span>{t.settings.languageUkTitle}</span>
                      </span>
                      {language === 'uk' && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">{t.settings.languageUkDesc}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      language === 'en'
                        ? 'bg-zinc-800 border-white text-white shadow-glow-subtle'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CountryFlag country="us" size="sm" glow={language === 'en'} />
                        <span>{t.settings.languageEnTitle}</span>
                      </span>
                      {language === 'en' && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">{t.settings.languageEnDesc}</div>
                  </button>
                </div>
              </div>

              {/* Nixima Account Identity Card */}
              {currentUser && (
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/80 shadow-inner-light space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center shadow-glow-subtle flex-shrink-0">
                        <NiximaIdLogo size={24} glow />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{currentUser.name}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            <NiximaIdLogo size={10} glow={false} />
                            <span>Nixima ID</span>
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/30 hover:bg-red-900/50 text-red-300 text-xs font-mono transition-colors"
                    >
                      {language === 'uk' ? 'Вийти' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              )}

              {/* Operator Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {language === 'uk' ? 'Відображуваний нікнейм' : 'Display Nickname'}
                </label>
                <input
                  type="text"
                  value={settings.userName}
                  onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-zinc-500 font-mono"
                  placeholder="e.g. Bogdan"
                />
              </div>

              {/* Sound Synthesizer Keystrokes */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {t.settings.audioEffectsTitle}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {t.settings.audioEffectsDesc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playTypingTick()}
                    className="px-2 py-1 text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-800 rounded border border-zinc-700"
                    title={language === 'uk' ? 'Тестувати звук' : 'Test audio tick'}
                  >
                    {language === 'uk' ? 'Тест' : 'Test'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                      settings.soundEnabled ? 'bg-white' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Theme Contrast Mode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {t.settings.wallpaperTitle}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeContrast: 'titanium' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.themeContrast === 'titanium'
                        ? 'bg-zinc-800 border-white text-white shadow-glow-subtle'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{language === 'uk' ? 'Титановий сланець' : 'Titanium Slate'}</div>
                    <div className="text-[11px] text-zinc-400 mt-1">{language === 'uk' ? 'Глибокий цинк з матовими шарами (#09090b)' : 'Deep zinc with frosted layers (#09090b)'}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeContrast: 'pure-black' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.themeContrast === 'pure-black'
                        ? 'bg-black border-white text-white shadow-glow-subtle'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{language === 'uk' ? 'Глибокий OLED чорний' : 'Pitch OLED Black'}</div>
                    <div className="text-[11px] text-zinc-400 mt-1">{language === 'uk' ? 'Справжній нульовий чорний (#000000)' : 'True zero-light black (#000000)'}</div>
                  </button>
                </div>
              </div>

              {/* Adaptive Hotkey & Gesture Customizer */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {t.settings.hotkeySectionTitle}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {t.settings.hotkeySectionDesc}: <span className="text-white font-mono font-bold">{hotkeyConfig.label}</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHotkeyModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold transition-all shadow-glow-subtle flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t.settings.btnCustomizeHotkey}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INFERENCE */}
          {activeTab === 'inference' && (
            <div className="space-y-5">
              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                    Sampling Temperature
                  </label>
                  <span className="text-xs font-mono text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                    {settings.temperature.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>{language === 'uk' ? 'Точний (0.0)' : 'Deterministic (0.0)'}</span>
                  <span>{language === 'uk' ? 'Збалансований (0.7)' : 'Balanced (0.7)'}</span>
                  <span>{language === 'uk' ? 'Творчий (1.0)' : 'Creative (1.0)'}</span>
                </div>
              </div>

              {/* Top-P Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                    {t.settings.topPTitle}
                  </label>
                  <span className="text-xs font-mono text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                    {(settings.topP || 0.95).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.topP || 0.95}
                  onChange={(e) => onUpdateSettings({ topP: parseFloat(e.target.value) })}
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>{language === 'uk' ? 'Фокусований (0.1)' : 'Focused (0.1)'}</span>
                  <span>{language === 'uk' ? 'Стандартний (0.95)' : 'Standard (0.95)'}</span>
                  <span>{language === 'uk' ? 'Широкий (1.0)' : 'Broad (1.0)'}</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {t.settings.contextLimitTitle}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1024, 2048, 4096, 8192].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onUpdateSettings({ maxTokens: num })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                        settings.maxTokens === num
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream Speed */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {language === 'uk' ? 'Швидкість стрімінгу генерації' : 'Streaming Throughput Emulation'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cinematic', label: language === 'uk' ? 'Кінематографічна' : 'Cinematic', desc: language === 'uk' ? 'Повільний друк' : 'Slow typewriter' },
                    { id: 'fast', label: language === 'uk' ? 'Швидка (Стандарт)' : 'Fast (Default)', desc: language === 'uk' ? 'Фронтирна швидкість' : 'Frontier speed' },
                    { id: 'instant', label: language === 'uk' ? 'Миттєва' : 'Instant', desc: language === 'uk' ? 'Нульова затримка' : 'Zero latency' },
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() => onUpdateSettings({ streamSpeed: spd.id as any })}
                      className={`p-2 rounded-lg text-left border transition-all ${
                        settings.streamSpeed === spd.id
                          ? 'bg-white text-black font-semibold border-white'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-mono">{spd.label}</div>
                      <div className="text-[10px] opacity-75">{spd.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERSONA & TONE */}
          {activeTab === 'persona' && (
            <div className="space-y-5">
              {/* Tone Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {t.settings.personaToneTitle}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tones.map((toneItem) => {
                    const isSelected = settings.personaTone === toneItem.id;
                    return (
                      <button
                        key={toneItem.id}
                        type="button"
                        onClick={() => onUpdateSettings({ personaTone: toneItem.id as any })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-zinc-800 border-white text-white shadow-glow-subtle'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{toneItem.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{toneItem.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Directive */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {t.settings.systemPromptTitle}
                </label>
                <textarea
                  rows={4}
                  value={settings.systemPrompt}
                  onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-zinc-500 resize-none font-mono leading-relaxed"
                  placeholder="You are Nixima AI..."
                />
              </div>
            </div>
          )}

          {/* TAB 4: DATA & BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              {importStatus && (
                <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {importStatus}
                </div>
              )}

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {t.settings.exportDataTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {t.settings.exportDataDesc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t.settings.btnExportJson} ({conversations.length})
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white font-medium text-xs hover:bg-zinc-700 transition-colors flex items-center gap-2 border border-zinc-700"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {t.settings.btnImportJson}
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/10 space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    {t.settings.dangerZoneTitle}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {t.settings.dangerZoneDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(language === 'uk' ? 'Ви впевнені, що хочете назавжди очистити всю історію діалогів?' : 'Are you sure you want to permanently clear all conversation history?')) {
                      onClearAllChats();
                      onClose();
                    }
                  }}
                  className="mt-2 py-2 px-3 rounded-lg border border-red-800/80 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.settings.btnClearAll}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AI ENGINE STATUS */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  <span>{language === 'uk' ? 'Реальний AI рушій: Активний та налаштований' : 'Real AI Engine: Active & Pre-configured'}</span>
                </div>
                <p className="text-xs text-zinc-300">
                  {language === 'uk' ? 'Ваші моделі безпосередньо підключені та працюють на високопродуктивних безкоштовних кластерах AI. Ручне налаштування ключів API не потрібне.' : 'Your models are directly connected and powered by high-performance free AI clusters. No API key setup or manual configuration is required.'}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'uk' ? 'Статус: Готовий • Необмежений рівень' : 'Status: Ready • Unlimited Free Tier'}</span>
                </div>
              </div>

              {/* Underlying Free Model Architecture Mapping */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  {language === 'uk' ? 'Матриця нейронної маршрутизації Nixima' : 'Nixima Neural Routing Matrix'}
                </label>
                <div className="rounded-xl border border-zinc-800 overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-2 p-2.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold">
                    <span>{language === 'uk' ? 'Модель Nixima' : 'Nixima Model'}</span>
                    <span>{language === 'uk' ? 'Активний AI рушій' : 'Active Free AI Engine'}</span>
                  </div>
                  <div className="divide-y divide-zinc-800/60 bg-zinc-950/50">
                    <div className="grid grid-cols-2 p-2.5 items-center">
                      <span className="text-white font-medium">Nixima-0.1 (Flagship)</span>
                      <span className="text-zinc-400 text-[11px]">openrouter/free (Auto-Router)</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 items-center">
                      <span className="text-white font-medium">Nixima-0.1 Reasoning</span>
                      <span className="text-zinc-400 text-[11px]">nvidia/nemotron-nano-reasoning</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 items-center">
                      <span className="text-white font-medium">Nixima-0.1 Coder</span>
                      <span className="text-zinc-400 text-[11px]">cohere/north-mini-code</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 items-center">
                      <span className="text-white font-medium">Nixima-0.1 Flash</span>
                      <span className="text-zinc-400 text-[11px]">nvidia/nemotron-3.5-lightning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NIXIMA CREDITS */}
          {activeTab === 'credits' && (
            <div className="space-y-5">
              {/* Balance Hero Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-inner-light space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <NiximaCreditLogo size={18} />
                    </span>
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                        {t.credits.badge}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {t.credits.balance}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-medium">
                    {language === 'uk' ? 'Активний статус' : 'Active Status'}
                  </span>
                </div>

                <CreditHeroCounter
                  credits={getUserCredits(currentUser)}
                  unit={t.credits.unit}
                />

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.credits.initialBonusNotice}
                </p>
              </div>

              {/* Daily Grant Recharge Card */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/70 shadow-inner-light space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-zinc-300" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        {t.credits.dailyGrantTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {t.credits.dailyGrantDesc}
                    </p>
                  </div>
                  {isCreatorAccount(currentUser) ? (
                    <div
                      className="px-3 py-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/80 text-zinc-300 text-xs font-mono flex items-center gap-1.5 select-none flex-shrink-0"
                      title="Creator Sovereign Clearance"
                    >
                      <InfinitySymbol size={11} className="text-zinc-200" />
                      <span>{language === 'uk' ? 'Безлімітний доступ' : 'Unlimited Clearance'}</span>
                    </div>
                  ) : dailyGrantStatus.canClaim ? (
                    <button
                      onClick={handleClaimDailyGrant}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-all flex items-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black text-black" />
                      <span>{dailyClaimSuccess ? t.credits.dailyGrantClaimed : t.credits.claimDailyGrant}</span>
                    </button>
                  ) : (
                    <div
                      className="px-3 py-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/80 text-zinc-400 text-xs font-mono flex items-center gap-1.5 select-none flex-shrink-0"
                      title={language === 'uk' ? 'Доступно раз на добу' : 'Available once every 24 hours'}
                    >
                      <Check className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        {language === 'uk'
                          ? `Отримано • ${dailyGrantStatus.formattedCountdown}`
                          : `Claimed • In ${dailyGrantStatus.formattedCountdown}`}
                      </span>
                    </div>
                  )}
                </div>
                {dailyClaimSuccess && (
                  <div className="p-2 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 animate-in fade-in duration-200">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'uk' ? 'Успішно нараховано +500 Nixima Credits на ваш баланс!' : 'Successfully claimed +500 Nixima Credits to your balance!'}</span>
                  </div>
                )}
              </div>

              {/* Model Pricing Rates Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                    {t.credits.ratesTitle}
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {t.credits.ratesDesc}
                  </span>
                </div>
                <div className="rounded-xl border border-zinc-800 overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-4 p-2.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold">
                    <span>{language === 'uk' ? 'Модель' : 'Model'}</span>
                    <span>{language === 'uk' ? 'База' : 'Base Cost'}</span>
                    <span>{language === 'uk' ? 'Множник' : 'Multiplier'}</span>
                    <span>{language === 'uk' ? 'Призначення' : 'Target Use'}</span>
                  </div>
                  <div className="divide-y divide-zinc-800/60 bg-zinc-950/50">
                    {MODELS.map((m) => (
                      <div key={m.id} className="grid grid-cols-4 p-2.5 items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          <span className="text-white font-medium truncate">{m.name}</span>
                        </div>
                        <span className="text-zinc-100 font-bold">{m.baseCreditCost ?? 5} CR</span>
                        <span className="text-zinc-300">{(m.creditMultiplier ?? 1.0).toFixed(1)}x</span>
                        <span className="text-zinc-400 text-[11px] truncate">
                          {m.id.includes('flash')
                            ? (language === 'uk' ? 'Швидкі запити' : 'Fast & Efficient')
                            : m.id.includes('reasoning')
                            ? (language === 'uk' ? 'Глибоке мислення' : 'Deep Reasoning')
                            : m.id.includes('coder')
                            ? (language === 'uk' ? 'Програмування' : 'Code Synthesizing')
                            : (language === 'uk' ? 'Універсальний' : 'General Tasks')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Difficulty Regulation Notice */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5 text-zinc-300 font-mono font-semibold text-[11px] uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{t.credits.hardPromptNotice}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {language === 'uk'
                    ? 'Система Nixima автоматично аналізує довжину тексту, наявність коду, формул LaTeX та активований режим DeepThink. Прості короткі запити коштують мінімально, тоді як масивні технічні обчислення списують кредити пропорційно навантаженню AI кластера.'
                    : 'The Nixima runtime automatically analyzes prompt length, presence of code blocks, LaTeX formulas, and active DeepThink reasoning depth. Simple queries consume minimal credits, whereas intensive technical computations dynamically scale credit deductions to reflect neural cluster workload.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-[#0e0e11] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">
            Nixima AI v0.1 • Production Mesh
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-glow-subtle"
          >
            {t.settings.btnDone}
          </button>
        </div>
      </div>

      {/* Embedded Hotkey & Gesture Customizer */}
      <HotkeyCustomizerModal
        isOpen={isHotkeyModalOpen}
        onClose={() => setIsHotkeyModalOpen(false)}
        onHotkeyChange={(cfg) => setHotkeyConfig(cfg)}
      />
    </div>
  );
};
