import React from 'react';
import { X, Sliders, Server, User, Sparkles, Trash2, Check } from 'lucide-react';
import { UserSettings } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearAllChats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllChats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#121215] border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Nixima AI Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* User Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              Operator Name
            </label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => onUpdateSettings({ userName: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Sampling Temperature
              </label>
              <span className="text-xs font-mono text-white bg-zinc-800 px-2 py-0.5 rounded">
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
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Deterministic (0.0)</span>
              <span>Balanced (0.7)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              System Persona Directive
            </label>
            <textarea
              rows={3}
              value={settings.systemPrompt}
              onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-zinc-500 resize-none font-mono"
              placeholder="Custom system instructions..."
            />
          </div>

          {/* Server Info */}
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/90 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="font-mono">Local Host Binding:</span>
            </div>
            <span className="font-mono text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">
              http://localhost:6001
            </span>
          </div>

          {/* Clear conversations danger zone */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all conversation history?')) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="w-full py-2 px-3 rounded-lg border border-red-900/60 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset & Clear All Conversations
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-glow-subtle"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
