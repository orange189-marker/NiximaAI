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
  Zap
} from 'lucide-react';
import { UserSettings, Conversation } from '../types/chat';
import { NiximaUser } from '../types/user';
import { playTypingTick } from '../utils/sound';
import { NiximaIdLogo } from './NiximaIdLogo';

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
}

type SettingsTab = 'general' | 'inference' | 'persona' | 'data' | 'api';

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
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    downloadAnchor.setAttribute("download", `nixima_ai_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import conversations from JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportConversations(json);
          setImportStatus(`Successfully imported ${json.length} conversations!`);
          setTimeout(() => setImportStatus(null), 3500);
        } else {
          setImportStatus('Error: Invalid JSON format.');
        }
      } catch (err) {
        setImportStatus('Error: Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tones = [
    {
      id: 'architect',
      name: 'Frontier Architect',
      desc: 'Rigorous, highly technical, precise systems design.'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Hacker',
      desc: 'Direct, sharp, minimal fluff, maximum execution speed.'
    },
    {
      id: 'academic',
      name: 'Academic Researcher',
      desc: 'Theoretical rigor, mathematical deduction, citations.'
    },
    {
      id: 'executive',
      name: 'Executive Strategist',
      desc: 'High-level synthesis, product vision, commercial impact.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#121216] border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white text-black font-black text-xs flex items-center justify-center font-mono">
              N
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Nixima AI Control Panel
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
            General
          </button>
          <button
            onClick={() => setActiveTab('inference')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inference' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Inference
          </button>
          <button
            onClick={() => setActiveTab('persona')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'persona' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Persona
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Data & Backup
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3.5 py-2.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'api' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Mesh API
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
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
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Operator Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  Display Nickname
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
                      Synthetic Typing Audio
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Play real-time mechanical keystrokes generated via Web Audio API during token streaming.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playTypingTick()}
                    className="px-2 py-1 text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-800 rounded border border-zinc-700"
                    title="Test audio tick"
                  >
                    Test
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
                  Contrast Atmosphere
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
                    <div className="text-xs font-bold font-mono">Titanium Slate</div>
                    <div className="text-[11px] text-zinc-400 mt-1">Deep zinc with frosted layers (#09090b)</div>
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
                    <div className="text-xs font-bold font-mono">Pitch OLED Black</div>
                    <div className="text-[11px] text-zinc-400 mt-1">True zero-light black (#000000)</div>
                  </button>
                </div>
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
                  <span>Deterministic (0.0)</span>
                  <span>Balanced (0.7)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Top-P Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                    Top-P Nucleus Cutoff
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
                  <span>Focused (0.1)</span>
                  <span>Standard (0.95)</span>
                  <span>Broad (1.0)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  Max Output Tokens
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
                  Streaming Throughput Emulation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cinematic', label: 'Cinematic', desc: 'Slow typewriter' },
                    { id: 'fast', label: 'Fast (Default)', desc: 'Frontier speed' },
                    { id: 'instant', label: 'Instant', desc: 'Zero latency' },
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
                  Frontier Persona Archetype
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tones.map((t) => {
                    const isSelected = settings.personaTone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onUpdateSettings({ personaTone: t.id as any })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-zinc-800 border-white text-white shadow-glow-subtle'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{t.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Directive */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  Custom System Instructions
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
                    Conversation Vault Backup
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Export your full conversation sessions as a JSON file or restore from a backup.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export All Chats ({conversations.length})
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
                    Import From Backup
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/10 space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Danger Zone
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Permanently erase all stored conversations and reset local preferences.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to permanently clear all conversation history?')) {
                      onClearAllChats();
                      onClose();
                    }
                  }}
                  className="mt-2 py-2 px-3 rounded-lg border border-red-800/80 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Entire Vault
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
                  <span>Real AI Engine: Active & Pre-configured</span>
                </div>
                <p className="text-xs text-zinc-300">
                  Your models are directly connected and powered by high-performance free AI clusters. No API key setup or manual configuration is required.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Status: Ready • Unlimited Free Tier</span>
                </div>
              </div>

              {/* Underlying Free Model Architecture Mapping */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  Nixima Neural Routing Matrix
                </label>
                <div className="rounded-xl border border-zinc-800 overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-2 p-2.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold">
                    <span>Nixima Model</span>
                    <span>Active Free AI Engine</span>
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
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
