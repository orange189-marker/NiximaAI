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
  Plus
} from 'lucide-react';
import { ModelOption } from '../types/chat';
import { NIXIMA_MODELS } from '../data/models';
import { NiximaIdLogo } from './NiximaIdLogo';

interface HeaderProps {
  currentModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onOpenSettings: () => void;
  onOpenCompanyInfo: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onSelectModel,
  onOpenSettings,
  onOpenCompanyInfo,
  isSidebarOpen,
  onToggleSidebar,
  onNewChat
}) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="h-14 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Left section: Sidebar toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {onNewChat && !isSidebarOpen && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 group cursor-pointer"
            title="New conversation (Ctrl+N)"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="p-1 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-glow-subtle">
            <NiximaIdLogo size={18} glow={false} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white font-mono">
              NIXIMA<span className="text-zinc-500 ml-1 font-normal">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              v0.1
            </span>
          </div>
        </div>
      </div>

      {/* Center: Model Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500 transition-all duration-150 shadow-inner-light"
        >
          <div className="flex items-center gap-1.5">
            {getModelIcon(currentModel.id)}
            <span className="font-medium text-sm text-white tracking-tight">
              {currentModel.name}
            </span>
          </div>

          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-black font-bold tracking-wider uppercase">
            {currentModel.badge}
          </span>

          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isModelDropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 rounded-xl bg-[#121215] border border-zinc-700/80 shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
            <div className="px-3 py-2 border-b border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Select Nixima Model
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Sovereign Engine
              </span>
            </div>

            <div className="mt-1 space-y-1">
              {NIXIMA_MODELS.map((model) => {
                const isSelected = currentModel.id === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start justify-between group ${
                      isSelected 
                        ? 'bg-zinc-800/90 border border-zinc-600' 
                        : 'hover:bg-zinc-800/50 border border-transparent'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {getModelIcon(model.id)}
                        <span className="font-semibold text-sm text-white group-hover:text-white">
                          {model.name}
                        </span>
                        {model.isFlagship && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white text-black font-bold">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {model.description}
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
                      <div className="mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800/80 px-2 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-[11px] font-mono">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                Inference: Neural Sovereign Mesh
              </span>
              <button
                onClick={() => {
                  setIsModelDropdownOpen(false);
                  onOpenSettings();
                }}
                className="text-[11px] text-white hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                Tuning
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right section: System status & Modals */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Mesh Active</span>
        </div>

        <button
          onClick={onOpenCompanyInfo}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          title="About Nixima AI"
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          title="Model & System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
