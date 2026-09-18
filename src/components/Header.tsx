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
  BarChart3,
  Globe
} from 'lucide-react';
import { ModelOption, SearchMode, NiximaProduct } from '../types/chat';
import { NIXIMA_MODELS, getRecommendedModelForSearchMode } from '../data/models';
import { NiximaIdLogo } from './NiximaIdLogo';
import { ModelIcon } from './ModelIcon';
import { getSavedHotkey, HotkeyConfig, HOTKEY_CHANGE_EVENT } from '../utils/hotkeys';
import { useLanguage } from '../context/LanguageContext';
import { CountryFlag } from './CountryFlag';
import { CreditBalanceChip } from './AnimatedCredits';
import { NiximaWordmark, renderWithNiximaBrand } from './NiximaWordmark';

interface HeaderProps {
  currentModel: ModelOption;
  onSelectModel: (model: ModelOption, options?: { fromTab?: string }) => void;
  onOpenSettings: () => void;
  onOpenCompanyInfo: () => void;
  onOpenBenchmarks?: () => void;
  onOpenReleaseModal?: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat?: () => void;
  credits?: number;
  onOpenCredits?: () => void;
  webSearchEnabled?: boolean;
  searchMode?: SearchMode;
  activeProduct?: NiximaProduct;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onSelectModel,
  onOpenSettings,
  onOpenCompanyInfo,
  onOpenBenchmarks,
  onOpenReleaseModal,
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  credits = 1000,
  onOpenCredits,
  webSearchEnabled = false,
  searchMode = 'standard',
  activeProduct = 'chat',
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'0.4' | '0.3' | '0.2' | 'thinking' | 'search' | 'code' | 'all'>('0.4');
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

  // Always reset to Generation 0.4 (new unified omni flagship) whenever dropdown opens
  useEffect(() => {
    if (isModelDropdownOpen) {
      setFilterTab('0.4');
    }
  }, [isModelDropdownOpen]);

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

  const getModelIcon = (id: string, size: 'xs' | 'sm' | 'md' = 'sm') => {
    return <ModelIcon modelId={id} size={size} />;
  };

  return (
    <header className="h-14 border-b border-white/[0.07] bg-[#09090c]/85 backdrop-blur-xl px-2.5 sm:px-4 flex items-center justify-between z-30 select-none gap-2 specular-highlight shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Left section: Sidebar toggle & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
          title={isSidebarOpen ? t.header.collapseSidebarTooltip : t.header.expandSidebarTooltip}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop / Tablet New Chat Button */}
        {onNewChat && !isSidebarOpen && (
          <button
            onClick={onNewChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs transition-all shadow-[0_2px_14px_rgba(255,255,255,0.25),inset_0_1px_0_rgba(255,255,255,0.8)] hover:scale-105 active:scale-95 group cursor-pointer flex-shrink-0"
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
            {activeProduct === 'code' ? (
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-sans">
                  Nixima Code
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  STUDIO
                </span>
              </div>
            ) : activeProduct === 'translator' ? (
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent font-sans">
                  Nixima Translator
                </span>
                <span className="px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-500/40 text-[9px] font-mono text-blue-300 font-bold uppercase tracking-wider">
                  OMNI
                </span>
              </div>
            ) : (
              <>
                <NiximaWordmark
                  size="md"
                  variant="sheen"
                  withAi
                  aiStyle="pill"
                />
                <button
                  type="button"
                  onClick={onOpenReleaseModal}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium bg-gradient-to-r from-amber-950/70 via-zinc-900 to-zinc-900 hover:bg-zinc-800 text-amber-200 border border-amber-500/50 transition-all cursor-pointer shadow-sm group"
                  title={t.releaseAnnouncement.detailsBtn}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
                  <span className="font-bold">v0.4 Omni</span>
                  <span className="text-[9px] px-1 rounded bg-amber-400 text-black font-bold uppercase ml-0.5">
                    NEW
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Model Selector Dropdown (Carefully constrained to prevent layout collisions) */}
      <div className="relative flex-1 flex justify-center min-w-0 px-1 sm:px-2 max-w-xs md:max-w-md mx-auto" ref={dropdownRef}>
        {activeProduct === 'code' ? (
          <div
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] select-none max-w-[280px] sm:max-w-[340px] min-w-0"
            title={t.header.niximaCodeLockedModel}
          >
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="flex-shrink-0">{getModelIcon('nixima-0.3-coder')}</span>
              <span className="font-semibold text-xs sm:text-sm text-emerald-200 tracking-tight whitespace-nowrap truncate min-w-0 font-mono">
                Nixima-0.3 Coder
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold tracking-wider uppercase border border-emerald-500/40 flex-shrink-0">
              TITAN CODER
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!isModelDropdownOpen) {
                setFilterTab('0.3');
              }
              setIsModelDropdownOpen(!isModelDropdownOpen);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#18181f] to-[#111116] hover:from-[#20202a] hover:to-[#16161d] border border-white/[0.12] hover:border-white/[0.24] transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.2)] select-none cursor-pointer max-w-[170px] sm:max-w-[240px] md:max-w-[320px] min-w-0 active:scale-98"
            title={`${t.common.active}: ${currentModel.name}`}
          >
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="flex-shrink-0">{getModelIcon(currentModel.id)}</span>
              <span className="font-semibold text-xs sm:text-sm text-white tracking-tight whitespace-nowrap truncate min-w-0">
                {renderWithNiximaBrand(t.models[currentModel.id]?.name || currentModel.name)}
              </span>
            </div>

            <span className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-black font-bold tracking-wider uppercase flex-shrink-0">
              {t.models[currentModel.id]?.badge || currentModel.badge}
            </span>

            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Mobile Backdrop Scrim */}
        {isModelDropdownOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden animate-fade-in"
            onClick={() => setIsModelDropdownOpen(false)} 
          />
        )}

        {/* Dropdown Menu (Centered modal card on mobile, centered popover on desktop with strict viewport bounds) */}
        {isModelDropdownOpen && (
          <div className="fixed inset-x-2 top-16 z-50 max-w-sm mx-auto sm:absolute sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-full sm:mt-2.5 sm:w-[420px] sm:max-w-[calc(100vw-24px)] max-h-[calc(100vh-5rem)] flex flex-col rounded-2xl bg-[#0e0e14]/96 border border-white/[0.14] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.14)] p-2.5 animate-scale-in backdrop-blur-2xl overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800/80 flex items-center justify-between flex-shrink-0">
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

            {/* Dynamic Search Recommendation Banner */}
            {webSearchEnabled && (() => {
              const rec = getRecommendedModelForSearchMode(searchMode);
              const isRec = currentModel.id === rec.id;
              const modeLabel = searchMode === 'fast' ? 'Search V3 Fast' : searchMode === 'mega' ? 'Search V3 Mega' : 'Search V3';
              return (
                <div className={`mx-1 mt-2 mb-1.5 p-2 rounded-xl border flex items-center justify-between gap-2 text-xs font-mono flex-shrink-0 animate-fade-in ${
                  isRec 
                    ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10.5px] truncate">
                        {isRec ? (
                          <span>Optimal Search Model Paired: <strong className="text-white">{rec.shortName}</strong></span>
                        ) : (
                          <span>{t.header.activeSearchBanner(modeLabel, rec.name)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isRec && (
                    <button
                      type="button"
                      onClick={() => onSelectModel(rec)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-zinc-200 text-black text-[10px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer flex-shrink-0 shadow-sm"
                    >
                      {t.header.switchModelBtn}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Category & Generation Filter Tabs */}
            {(() => {
              const countAll = NIXIMA_MODELS.length;
              const count04 = NIXIMA_MODELS.filter(m => m.generation === '0.4' || m.id.includes('0.4')).length;
              const count03 = NIXIMA_MODELS.filter(m => (m.generation === '0.3' || m.id.includes('0.3')) && !m.id.includes('0.4')).length;
              const count02 = NIXIMA_MODELS.filter(m => (m.generation === '0.2' || m.id.includes('0.2')) && !m.id.includes('0.3') && !m.id.includes('0.4')).length;
              const countThinking = NIXIMA_MODELS.filter(m => 
                Boolean(m.badge?.toLowerCase().includes('thinking') || 
                m.badge?.toLowerCase().includes('reasoning') || 
                m.id.includes('pro') || 
                m.id.includes('coder') || 
                m.isOmni)
              ).length;
              const countSearch = NIXIMA_MODELS.filter(m => Boolean(m.searchOptimization)).length;
              const countCode = NIXIMA_MODELS.filter(m => m.id.includes('coder') || m.id.includes('omni')).length;

              const filteredModels = NIXIMA_MODELS.filter((model) => {
                if (filterTab === '0.4') return model.generation === '0.4' || model.id.includes('0.4');
                if (filterTab === '0.3') return (model.generation === '0.3' || model.id.includes('0.3')) && !model.id.includes('0.4');
                if (filterTab === '0.2') return (model.generation === '0.2' || model.id.includes('0.2')) && !model.id.includes('0.3') && !model.id.includes('0.4');
                if (filterTab === 'thinking') return Boolean(
                  model.badge?.toLowerCase().includes('thinking') || 
                  model.badge?.toLowerCase().includes('reasoning') || 
                  model.id.includes('pro') || 
                  model.id.includes('coder') || 
                  model.isOmni
                );
                if (filterTab === 'search') return Boolean(model.searchOptimization);
                if (filterTab === 'code') return model.id.includes('coder') || model.id.includes('omni');
                return true;
              });
              const isCurrentModelInView = filteredModels.some(m => m.id === currentModel.id);

              return (
                <>
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 mt-1 mb-2 bg-zinc-900/90 rounded-xl border border-zinc-800/80 text-[11px] font-mono select-none">
                    {/* 0. Generation 0.4 Unified Omni (Primary Flagship) */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('0.4')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === '0.4' 
                          ? 'bg-gradient-to-r from-amber-950/90 via-emerald-950/80 to-zinc-900 text-white shadow-inner-light border border-amber-500/60' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
                      <span className="font-bold text-amber-200">0.4 Omni</span>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-amber-400 text-black font-bold uppercase tracking-wider">
                        {language === 'uk' ? 'НОВЕ' : 'NEW'}
                      </span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === '0.4' ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'}`}>
                        {count04}
                      </span>
                    </button>

                    {/* 1. Main 0.3 Generation Models */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('0.3')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === '0.3' 
                          ? 'bg-zinc-800 text-white shadow-inner-light border border-zinc-700' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                      <span>{t.header.gen03Tab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === '0.3' ? 'bg-white/10 text-white border border-white/20' : 'bg-zinc-800 text-zinc-400'}`}>
                        {count03}
                      </span>
                    </button>

                    {/* 2. 0.2 Generation Models */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('0.2')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === '0.2' 
                          ? 'bg-zinc-800 text-white shadow-inner-light border border-zinc-700' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span>{t.header.gen02Tab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === '0.2' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {count02}
                      </span>
                    </button>

                    {/* 3. Thinking & Reasoning Models */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('thinking')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        filterTab === 'thinking' 
                          ? 'bg-purple-950/70 text-purple-200 border border-purple-600/70 shadow-sm' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <BrainCircuit className="w-3 h-3 text-purple-400" />
                      <span>{t.header.thinkingTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'thinking' ? 'bg-purple-900 text-purple-200 border border-purple-700' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countThinking}
                      </span>
                    </button>

                    {/* 4. Search V3 Optimized Models */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('search')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        filterTab === 'search' 
                          ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-600/70 shadow-sm' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span>{t.header.searchOptimizedTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'search' ? 'bg-cyan-900 text-cyan-200 border border-cyan-700' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countSearch}
                      </span>
                    </button>

                    {/* 5. Code & Architecture Models */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('code')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        filterTab === 'code' 
                          ? 'bg-zinc-800 text-white shadow-inner-light border border-zinc-700' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <Terminal className="w-3 h-3 text-zinc-300" />
                      <span>{t.header.codingTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'code' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countCode}
                      </span>
                    </button>

                    {/* 6. All Models */}
                    <button
                      type="button"
                      onClick={() => setFilterTab('all')}
                      className={`px-2 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === 'all' 
                          ? 'bg-zinc-800 text-white shadow-inner-light border border-zinc-700' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <span>{t.header.allModelsTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'all' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countAll}
                      </span>
                    </button>
                  </div>

                  {/* Active model location helper if current model belongs to another tab */}
                  {!isCurrentModelInView && (
                    <div className="mx-0.5 mb-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between shadow-sm animate-fade-in">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-zinc-500">{t.common.active}:</span>
                        <span className="text-white font-medium truncate">{currentModel.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentModel.generation === '0.4' || currentModel.id.includes('0.4')) {
                            setFilterTab('0.4');
                          } else if (currentModel.generation === '0.3' || currentModel.id.includes('0.3')) {
                            setFilterTab('0.3');
                          } else if (currentModel.generation === '0.2' || currentModel.id.includes('0.2')) {
                            setFilterTab('0.2');
                          } else {
                            setFilterTab('all');
                          }
                        }}
                        className="text-zinc-300 hover:text-white hover:underline text-[10.5px] whitespace-nowrap ml-2 cursor-pointer"
                      >
                        {language === 'uk' ? 'Показати в списку' : 'View in list'} →
                      </button>
                    </div>
                  )}

                  <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-750">
                    {filteredModels.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <p className="text-xs text-zinc-400 font-mono mb-2">{t.header.noModelsFound}</p>
                        <button
                          type="button"
                          onClick={() => setFilterTab('all')}
                          className="text-[11px] font-mono text-zinc-300 hover:text-white hover:underline cursor-pointer"
                        >
                          {t.header.allModelsTab}
                        </button>
                      </div>
                    ) : (
                      filteredModels.map((model) => {
                        const isSelected = currentModel.id === model.id;
                        const modelTr = t.models[model.id];
                        const searchOpt = model.searchOptimization;
                        const is04 = model.generation === '0.4' || model.id.includes('0.4');
                        const is03 = !is04 && (model.generation === '0.3' || model.id.includes('0.3'));

                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                              onSelectModel(model, { fromTab: filterTab });
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 sm:p-2.5 rounded-xl transition-all flex items-start justify-between group cursor-pointer ${
                              isSelected 
                                ? 'bg-zinc-800/90 border border-zinc-600 shadow-glow-subtle' 
                                : 'hover:bg-zinc-800/50 border border-transparent'
                            }`}
                          >
                            <div className="space-y-1 flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="flex-shrink-0">{getModelIcon(model.id)}</span>
                                <span className="font-semibold text-sm text-white group-hover:text-white truncate">
                                  {renderWithNiximaBrand(modelTr?.name || model.name)}
                                </span>

                                {/* Generation badge */}
                                {is04 ? (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                                    0.4 GEN
                                  </span>
                                ) : is03 ? (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white border border-white/20 font-bold flex-shrink-0">
                                    0.3 GEN
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/90 text-zinc-400 border border-zinc-700/60 font-medium flex-shrink-0">
                                    0.2 GEN
                                  </span>
                                )}

                                {model.isFlagship && (
                                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white text-black font-bold flex-shrink-0">
                                    {t.header.defaultBadge}
                                  </span>
                                )}
                                {filterTab === 'search' && searchOpt && (
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 flex-shrink-0 ml-auto">
                                    {searchOpt.searchRating}
                                  </span>
                                )}
                              </div>

                              {filterTab === 'thinking' ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-200 border border-purple-700/80 flex items-center gap-1">
                                      <BrainCircuit className="w-2.5 h-2.5 text-purple-400" />
                                      <span>{model.badge}</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-400">
                                      • {model.latency}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-300 line-clamp-1">
                                    {modelTr?.description || model.description}
                                  </p>
                                </div>
                              ) : filterTab === 'search' && searchOpt ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-750 text-zinc-200 border border-zinc-600">
                                      {searchOpt.badge}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-400">
                                      • {searchOpt.searchThroughput}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-300 line-clamp-1">
                                    {searchOpt.role}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-zinc-400 line-clamp-1">
                                  {modelTr?.description || model.description}
                                </p>
                              )}

                              <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                  {model.contextWindow}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400">
                                  {model.latency}
                                </span>
                                {model.badge && (model.badge.includes('THINKING') || model.badge.includes('REASONING') || model.id.includes('pro')) && (
                                  <span className="text-[9px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/80 truncate max-w-[140px] flex items-center gap-1">
                                    <BrainCircuit className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" />
                                    <span>{model.badge}</span>
                                  </span>
                                )}
                                {filterTab !== 'search' && searchOpt && (
                                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-800/80 truncate max-w-[130px]">
                                    {searchOpt.badge}
                                  </span>
                                )}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center text-black flex-shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              );
            })()}

            <div className="flex-shrink-0 mt-2 pt-2 border-t border-zinc-800/80 px-2 flex items-center justify-between text-xs text-zinc-400">
              {onOpenBenchmarks ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsModelDropdownOpen(false);
                    onOpenBenchmarks();
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{language === 'uk' ? 'Офіційні бенчмарки' : 'Official Benchmarks'}</span>
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[11px] font-mono truncate mr-2">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                  <span className="truncate">{t.header.sovereignEngine}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsModelDropdownOpen(false);
                  onOpenSettings();
                }}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.header.tuning}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right section: Mobile New Chat + System status & Modals */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Mobile compact New Chat button */}
        {onNewChat && !isSidebarOpen && (
          <button
            onClick={onNewChat}
            className="sm:hidden p-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer flex items-center justify-center flex-shrink-0"
            title={`${t.header.newChatTooltip} (${hotkeyConfig.label})`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-pulse" />
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
          className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 border border-white/[0.08] hover:border-white/[0.2] text-zinc-300 hover:text-white transition-all text-xs font-mono select-none cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex-shrink-0 active:scale-95"
          title={language === 'uk' ? 'Мова: Українська (Натисніть щоб змінити на English)' : 'Language: English (Click to switch to Ukrainian)'}
        >
          <CountryFlag country={language === 'uk' ? 'ua' : 'us'} size="xs" glow />
          <span className="text-[10px] font-bold tracking-wider">{language === 'uk' ? 'UA' : 'EN'}</span>
        </button>

        {/* Official Benchmarks Icon Button */}
        {onOpenBenchmarks && (
          <button
            type="button"
            onClick={onOpenBenchmarks}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer flex-shrink-0 active:scale-95"
            title={language === 'uk' ? 'Офіційні бенчмарки 4 моделей' : 'Official Benchmarks (4 Models)'}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenCompanyInfo}
          className="hidden md:flex p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer flex-shrink-0 active:scale-95"
          title={t.header.aboutTooltip}
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer flex-shrink-0 active:scale-95 group"
          title={t.header.settingsTooltip}
        >
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
        </button>
      </div>
    </header>
  );
};

