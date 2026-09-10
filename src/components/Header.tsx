import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Cpu, 
  Sparkles, 
  Settings, 
  Info, 
  Menu, 
  Check, 
  Zap, 
  Terminal, 
  BrainCircuit,
  Sliders,
  Plus,
  X,
  Coins
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { NIXIMA_MODELS } from '../data/models';
import { NiximaIdLogo } from './NiximaIdLogo';
import { getSavedHotkey, HotkeyConfig, HOTKEY_CHANGE_EVENT } from '../utils/hotkeys';
import { useLanguage } from '../context/LanguageContext';
import { CountryFlag } from './CountryFlag';
import { CreditBalanceChip } from './AnimatedCredits';

interface HeaderProps {
  currentModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onOpenSettings: () => void;
  onOpenCompanyInfo: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat?: () => void;
  credits?: number;
  onOpenCredits?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onSelectModel,
  onOpenSettings,
  onOpenCompanyInfo,
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  credits = 1000,
  onOpenCredits
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [hotkeyConfig, setHotkeyConfig] = useState<HotkeyConfig>(() => getSavedHotkey());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModelIcon = (id: string) => {
    if (id.includes('reasoning')) return <BrainCircuit className="w-4 h-4 text-white" />;
    if (id.includes('coder')) return <Terminal className="w-4 h-4 text-zinc-300" />;
    if (id.includes('flash')) return <Zap className="w-4 h-4 text-zinc-300" />;
    return <Sparkles className="w-4 h-4 text-white" />;
  };

  return (
    <header className="h-14 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md px-2.5 sm:px-4 flex items-center justify-between z-30 select-none gap-2">
      {/* Left section: Sidebar toggle & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          title={isSidebarOpen ? t.header.collapseSidebarTooltip : t.header.expandSidebarTooltip}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop / Tablet New Chat Button */}
        {onNewChat && !isSidebarOpen && (
          <button
            onClick={onNewChat}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 group cursor-pointer flex-shrink-0"
            title={`${t.header.newChatTooltip} (${hotkeyConfig.label})`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            <span>{t.header.newChatMobile}</span>
            <span className="text-[10px] font-mono text-zinc-600 hidden md:inline ml-0.5">
              {hotkeyConfig.label}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Logo mark */}
          <div className="p-1 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-glow-subtle flex-shrink-0">
            <NiximaIdLogo size={18} glow={false} />
          </div>
          <div className="hidden min-[400px]:flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white font-mono">
              NIXIMA<span className="text-zinc-500 ml-0.5 font-normal">AI</span>
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              v0.1
            </span>
          </div>
        </div>
      </div>

      {/* Center: Model Selector Dropdown */}
      <div className="relative flex-shrink min-w-0 mx-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/70 hover:border-zinc-500 transition-all duration-150 shadow-inner-light select-none cursor-pointer max-w-[170px] sm:max-w-none"
          title={`${t.common.active}: ${currentModel.name}`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex-shrink-0">{getModelIcon(currentModel.id)}</span>
            <span className="font-semibold text-xs sm:text-sm text-white tracking-tight whitespace-nowrap truncate">
              {t.models[currentModel.id]?.name || currentModel.name}
            </span>
          </div>

          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-black font-bold tracking-wider uppercase flex-shrink-0">
            {t.models[currentModel.id]?.badge || currentModel.badge}
          </span>

          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Mobile Backdrop Scrim */}
        {isModelDropdownOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden animate-fade-in"
            onClick={() => setIsModelDropdownOpen(false)} 
          />
        )}

        {/* Dropdown Menu (Centered modal card on mobile, right-aligned popover on desktop) */}
        {isModelDropdownOpen && (
          <div className="fixed left-3 right-3 top-16 z-50 max-w-sm mx-auto sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-w-none rounded-2xl bg-[#121215] border border-zinc-700/90 shadow-[0_10px_40px_rgba(0,0,0,0.9)] p-2.5 animate-fade-in backdrop-blur-2xl">
            <div className="px-3 py-2 border-b border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                {t.header.selectModel}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  {t.header.sovereignEngine}
                </span>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(false)}
                  className="p-1 rounded-md text-zinc-400 hover:text-white sm:hidden cursor-pointer"
                  title={t.header.closeMenu}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-1 space-y-1 max-h-[60vh] sm:max-h-none overflow-y-auto">
              {NIXIMA_MODELS.map((model) => {
                const isSelected = currentModel.id === model.id;
                const modelTr = t.models[model.id];
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(model);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between group cursor-pointer ${
                      isSelected 
                        ? 'bg-zinc-800/90 border border-zinc-600 shadow-glow-subtle' 
                        : 'hover:bg-zinc-800/50 border border-transparent'
                    }`}
                  >
                    <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0">{getModelIcon(model.id)}</span>
                        <span className="font-semibold text-sm text-white group-hover:text-white truncate">
                          {modelTr?.name || model.name}
                        </span>
                        {model.isFlagship && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white text-black font-bold flex-shrink-0">
                            {t.header.defaultBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {modelTr?.description || model.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                          {model.contextWindow}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {model.latency}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center text-black flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800/80 px-2 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-[11px] font-mono truncate mr-2">
                <Cpu className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                <span className="truncate">{t.header.sovereignEngine}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsModelDropdownOpen(false);
                  onOpenSettings();
                }}
                className="text-[11px] text-white hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>{t.header.tuning}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right section: Mobile New Chat + System status & Modals */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Mobile compact New Chat button */}
        {onNewChat && !isSidebarOpen && (
          <button
            onClick={onNewChat}
            className="sm:hidden p-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer flex items-center justify-center"
            title={`${t.header.newChatTooltip} (${hotkeyConfig.label})`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t.header.meshActive}</span>
        </div>

        {/* Animated Nixima Credits Balance Chip */}
        <CreditBalanceChip
          credits={credits}
          unit={t.credits.unit || 'CR'}
          onClick={onOpenCredits || onOpenSettings}
          title={`${t.credits.balance}: ${credits.toLocaleString()} ${t.credits.unit}`}
        />

        {/* Quick Language Toggle Button with SVG Flag */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono select-none cursor-pointer shadow-inner-light"
          title={language === 'uk' ? 'Мова: Українська (Натисніть щоб змінити на English)' : 'Language: English (Click to switch to Ukrainian)'}
        >
          <CountryFlag country={language === 'uk' ? 'ua' : 'us'} size="xs" glow />
          <span className="text-[10px] font-bold tracking-wider">{language === 'uk' ? 'UA' : 'EN'}</span>
        </button>

        <button
          onClick={onOpenCompanyInfo}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          title={t.header.aboutTooltip}
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          title={t.header.settingsTooltip}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

