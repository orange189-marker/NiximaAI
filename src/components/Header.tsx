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
import { ModelOption, SearchMode } from '../types/chat';
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
  onSelectModel: (model: ModelOption) => void;
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
  searchMode = 'standard'
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | '0.3' | '0.2' | 'search' | 'code'>('all');
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

  const getModelIcon = (id: string, size: 'xs' | 'sm' | 'md' = 'sm') => {
    return <ModelIcon modelId={id} size={size} />;
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
            <NiximaWordmark
              size="md"
              variant="sheen"
              withAi
              aiStyle="pill"
            />
            <button
              type="button"
              onClick={onOpenReleaseModal}
              className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 transition-all cursor-pointer shadow-sm group"
              title={t.releaseAnnouncement.detailsBtn}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>v0.2</span>
              <span className="text-[9px] px-1 rounded bg-white text-black font-bold uppercase ml-0.5">
                NEW
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Center: Model Selector Dropdown */}
      <div className="relative flex-1 flex justify-center min-w-0 px-1 sm:px-2 max-w-xs md:max-w-md mx-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/70 hover:border-zinc-500 transition-all duration-150 shadow-inner-light select-none cursor-pointer max-w-[150px] sm:max-w-[240px] md:max-w-none min-w-0"
          title={`${t.common.active}: ${currentModel.name}`}
        >
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="flex-shrink-0">{getModelIcon(currentModel.id)}</span>
            <span className="font-semibold text-xs sm:text-sm text-white tracking-tight whitespace-nowrap truncate">
              {renderWithNiximaBrand(t.models[currentModel.id]?.name || currentModel.name)}
            </span>
          </div>

          <span className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-black font-bold tracking-wider uppercase flex-shrink-0">
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

            {/* Dynamic Search Recommendation Banner */}
            {webSearchEnabled && (() => {
              const rec = getRecommendedModelForSearchMode(searchMode);
              const isRec = currentModel.id === rec.id;
              const modeLabel = searchMode === 'fast' ? 'Search V3 Fast' : searchMode === 'mega' ? 'Search V3 Mega' : 'Search V3';
              return (
                <div className={`mx-1 mt-2 mb-1.5 p-2 rounded-xl border flex items-center justify-between gap-2 text-xs font-mono animate-fade-in ${
                  isRec 
                    ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300'
                    : searchMode === 'fast'
                    ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                    : 'bg-zinc-900/90 border-zinc-600 text-zinc-200'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {searchMode === 'fast' ? (
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    )}
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
              const count03 = NIXIMA_MODELS.filter(m => m.generation === '0.3' || m.id.includes('0.3')).length;
              const count02 = NIXIMA_MODELS.filter(m => (m.generation === '0.2' || m.id.includes('0.2')) && !m.id.includes('0.3')).length;
              const countSearch = NIXIMA_MODELS.filter(m => Boolean(m.searchOptimization)).length;
              const countCode = NIXIMA_MODELS.filter(m => m.id.includes('coder') || m.id.includes('omni')).length;

              const filteredModels = NIXIMA_MODELS.filter((model) => {
                if (filterTab === '0.3') return model.generation === '0.3' || model.id.includes('0.3');
                if (filterTab === '0.2') return (model.generation === '0.2' || model.id.includes('0.2')) && !model.id.includes('0.3');
                if (filterTab === 'search') return Boolean(model.searchOptimization);
                if (filterTab === 'code') return model.id.includes('coder') || model.id.includes('omni');
                return true;
              });

              return (
                <>
                  <div className="flex items-center gap-1 p-1 mt-1 mb-2 bg-zinc-900/90 rounded-xl border border-zinc-800/80 text-[11px] font-mono overflow-x-auto no-scrollbar scroll-smooth">
                    <button
                      type="button"
                      onClick={() => setFilterTab('all')}
                      className={`px-2.5 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === 'all' 
                          ? 'bg-zinc-800 text-white shadow-inner-light border border-zinc-700' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <span>{t.header.allModelsTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'all' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countAll}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab('0.3')}
                      className={`px-2.5 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === '0.3' 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                          : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-transparent'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{t.header.gen03Tab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === '0.3' ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-700/50' : 'bg-zinc-800 text-zinc-400'}`}>
                        {count03}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab('0.2')}
                      className={`px-2.5 py-1 rounded-lg text-center font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterTab === '0.2' 
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
                          : 'text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/30 border border-transparent'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{t.header.gen02Tab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === '0.2' ? 'bg-cyan-900/90 text-cyan-200 border border-cyan-700/50' : 'bg-zinc-800 text-zinc-400'}`}>
                        {count02}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab('search')}
                      className={`px-2.5 py-1 rounded-lg text-center font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        filterTab === 'search' 
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.25)]' 
                          : 'text-zinc-400 hover:text-sky-300 hover:bg-sky-950/30 border border-transparent'
                      }`}
                    >
                      <Globe className="w-3 h-3 text-sky-400" />
                      <span>{t.header.searchOptimizedTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'search' ? 'bg-sky-900/90 text-sky-200 border border-sky-700/50' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countSearch}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab('code')}
                      className={`px-2.5 py-1 rounded-lg text-center font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        filterTab === 'code' 
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]' 
                          : 'text-zinc-400 hover:text-purple-300 hover:bg-purple-950/30 border border-transparent'
                      }`}
                    >
                      <Terminal className="w-3 h-3 text-purple-400" />
                      <span>{t.header.codingTab}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === 'code' ? 'bg-purple-900/90 text-purple-200 border border-purple-700/50' : 'bg-zinc-800 text-zinc-400'}`}>
                        {countCode}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1 max-h-[60vh] sm:max-h-none overflow-y-auto">
                    {filteredModels.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <p className="text-xs text-zinc-400 font-mono mb-2">{t.header.noModelsFound}</p>
                        <button
                          type="button"
                          onClick={() => setFilterTab('all')}
                          className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
                        >
                          {t.header.allModelsTab}
                        </button>
                      </div>
                    ) : (
                      filteredModels.map((model) => {
                        const isSelected = currentModel.id === model.id;
                        const modelTr = t.models[model.id];
                        const searchOpt = model.searchOptimization;
                        const is03 = model.generation === '0.3' || model.id.includes('0.3');

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
                            <div className="space-y-1 flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="flex-shrink-0">{getModelIcon(model.id)}</span>
                                <span className="font-semibold text-sm text-white group-hover:text-white truncate">
                                  {renderWithNiximaBrand(modelTr?.name || model.name)}
                                </span>

                                {/* Generation badge */}
                                {is03 ? (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-bold flex-shrink-0">
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

                              {filterTab === 'search' && searchOpt ? (
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

            <div className="mt-2 pt-2 border-t border-zinc-800/80 px-2 flex items-center justify-between text-xs text-zinc-400">
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
          className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono select-none cursor-pointer shadow-inner-light flex-shrink-0"
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
            className="hidden sm:flex p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer flex-shrink-0"
            title={language === 'uk' ? 'Офіційні бенчмарки 4 моделей' : 'Official Benchmarks (4 Models)'}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenCompanyInfo}
          className="hidden md:flex p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer flex-shrink-0"
          title={t.header.aboutTooltip}
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer flex-shrink-0"
          title={t.header.settingsTooltip}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

