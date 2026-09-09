export interface ModelOption {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  contextWindow: string;
  latency: string;
  strengths: string[];
  parameters: string;
  isFlagship?: boolean;
  openRouterModel?: string;
  fallbackModels?: string[];
}

export interface MessageTelemetry {
  tokens: number;
  durationMs: number;
  tokensPerSec: number;
  model: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  isThinkingExpanded?: boolean;
  timestamp: number;
  model?: string;
  isStreaming?: boolean;
  telemetry?: MessageTelemetry;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
  pinned?: boolean;
}

export interface UserSettings {
  userName: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  personaTone: 'architect' | 'cyberpunk' | 'academic' | 'executive';
  deepThinkEnabled: boolean;
  webSearchEnabled: boolean;
  soundEnabled: boolean;
  streamSpeed: 'fast' | 'cinematic' | 'instant';
  themeContrast: 'titanium' | 'pure-black';
}
