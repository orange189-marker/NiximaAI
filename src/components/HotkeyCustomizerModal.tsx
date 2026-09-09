import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Command, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles,
  Sliders,
  Plus
} from 'lucide-react';
import { 
  HotkeyConfig, 
  PlatformType, 
  detectPlatform, 
  getDefaultHotkey, 
  getSavedHotkey, 
  saveHotkey, 
  resetHotkey, 
  HOTKEY_PRESETS,
  buildCustomHotkeyFromEvent
} from '../utils/hotkeys';
import { playTypingTick, playCompletionChime, playOpticToggle } from '../utils/sound';

interface HotkeyCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHotkeyChange?: (config: HotkeyConfig) => void;
}

export const HotkeyCustomizerModal: React.FC<HotkeyCustomizerModalProps> = ({
  isOpen,
  onClose,
  onHotkeyChange
}) => {
  const [activePlatform, setActivePlatform] = useState<PlatformType>(() => detectPlatform());
  const [currentConfig, setCurrentConfig] = useState<HotkeyConfig>(() => getSavedHotkey());
  const [isRecording, setIsRecording] = useState(false);
  const [recordedKeysMsg, setRecordedKeysMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentConfig(getSavedHotkey());
      setActivePlatform(detectPlatform());
      setIsRecording(false);
      setRecordedKeysMsg(null);
    }
  }, [isOpen]);

  // Key recording listener
  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const isMac = activePlatform === 'macos';
      const custom = buildCustomHotkeyFromEvent(e, isMac);
      if (custom) {
        playTypingTick();
        setCurrentConfig(custom);
        setIsRecording(false);
        setRecordedKeysMsg(`Saved custom combo: ${custom.label}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isRecording, activePlatform]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: HotkeyConfig) => {
    playTypingTick();
    setCurrentConfig(preset);
    setIsRecording(false);
    setRecordedKeysMsg(null);
  };

  const handleReset = () => {
    playOpticToggle(false);
    const def = resetHotkey();
    setCurrentConfig(def);
    setIsRecording(false);
    setRecordedKeysMsg('Reset to platform default');
  };

  const handleSaveAndClose = () => {
    playCompletionChime();
    saveHotkey(currentConfig);
    if (onHotkeyChange) {
      onHotkeyChange(currentConfig);
    }
    onClose();
  };

  const getPlatformIcon = (plat: PlatformType) => {
    switch (plat) {
      case 'macos':
        return <Command className="w-3.5 h-3.5" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'linux':
      case 'windows':
      default:
        return <Laptop className="w-3.5 h-3.5" />;
    }
  };

  const getPlatformName = (plat: PlatformType) => {
    switch (plat) {
      case 'macos': return 'macOS (Apple)';
      case 'tablet': return 'Tablet / iPadOS';
      case 'mobile': return 'Smartphone / Touch';
      case 'linux': return 'Linux Workstation';
      case 'windows': return 'Windows PC';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111116] border border-zinc-700/90 p-6 shadow-[0_0_60px_rgba(0,0,0,0.95)] space-y-5 text-xs text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-glow-subtle">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                <span>New Conversation Hotkey</span>
                <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px] border border-zinc-700">
                  Customizer
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans">
                Tailor keyboard shortcuts and touch badges for Windows, macOS, iPad, and phones.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Switcher & Auto-Detection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>Platform Profile</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-[9px]">
                Detected: {getPlatformName(detectPlatform())}
              </span>
            </span>
          </div>

          {/* Platform Tabs */}
          <div className="grid grid-cols-4 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px]">
            {(['windows', 'macos', 'tablet', 'mobile'] as PlatformType[]).map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => {
                  setActivePlatform(plat);
                  const def = getDefaultHotkey(plat);
                  setCurrentConfig(def);
                  setIsRecording(false);
                }}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
                  activePlatform === plat
                    ? 'bg-white text-black font-bold shadow-glow-subtle'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {getPlatformIcon(plat)}
                <span className="capitalize">{plat === 'macos' ? 'Mac' : plat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Keycap Badge Preview */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-800 space-y-2">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">
            Live Button Preview in Sidebar
          </span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-bold text-xs text-white">
                New conversation
              </span>
            </div>

            {/* Render Keycap or Touch Badge */}
            {currentConfig.isTouchBadge ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950/60 border border-emerald-700/80 px-2 py-0.5 rounded-md text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                <span>{currentConfig.label}</span>
              </span>
            ) : (
              <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-md text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <span>{currentConfig.label}</span>
              </kbd>
            )}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
            Recommended Presets for {getPlatformName(activePlatform)}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(HOTKEY_PRESETS.find(p => p.platform === (activePlatform === 'linux' ? 'windows' : activePlatform))?.presets || []).map((preset) => {
              const isSelected = currentConfig.label === preset.label;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800/90 border-white text-white shadow-glow-subtle'
                      : 'bg-zinc-900/60 hover:bg-zinc-800/50 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {preset.isTouchBadge ? (
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Keyboard className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span className="font-bold text-xs">{preset.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Key Recorder */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-zinc-400" />
              <span>Interactive Custom Key Record</span>
            </span>
            {isRecording && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-700 text-amber-300 animate-pulse">
                Listening...
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsRecording(true);
              setRecordedKeysMsg('Press any key combo on your keyboard now (e.g. Alt+N, Ctrl+J)...');
            }}
            className={`w-full py-2 px-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isRecording
                ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>
              {isRecording 
                ? 'Listening: Press keys on keyboard...' 
                : 'Click to Record Custom Key Combination'}
            </span>
          </button>

          {recordedKeysMsg && (
            <p className="text-[10px] text-zinc-400 italic text-center">
              {recordedKeysMsg}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-glow-subtle cursor-pointer"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
