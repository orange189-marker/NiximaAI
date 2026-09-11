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
  creditMultiplier?: number;
  baseCreditCost?: number;
}

export interface MessageTelemetry {
  tokens: number;
  durationMs: number;
  tokensPerSec: number;
  model: string;
  creditsSpent?: number;
}

export interface SearchSource {
  title: string;
  url: string;
  domain?: string;
  snippet?: string;
  cluster?: string; // e.g. "Academic", "Code", "Financial", "News", "Deep Web"
  relevanceScore?: number;
}

export interface SearchGrounding {
  query: string;
  sources: SearchSource[];
  searchTimeMs?: number;
  indexedResultsCount?: number;
  searchMode?: 'standard' | 'mega';
  clusters?: { name: string; count: number }[];
  pagesCrawled?: number;
  browserInputs?: string[];
}

export interface DynamicThinkingStep {
  stepNumber: number;
  title: string;
  explanation: string;
  bullets?: string[];
}

export interface DeepThinkingTelemetry {
  stepsCount?: number;
  durationMs?: number;
  epistemicDepth?: string; // e.g. "Frontier L3 Epistemic Proof"
  dynamicSteps?: DynamicThinkingStep[];
  phases?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  deepThinkingTelemetry?: DeepThinkingTelemetry;
  searchGrounding?: SearchGrounding;
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
  searchMode?: 'standard' | 'mega';
  soundEnabled: boolean;
  streamSpeed: 'fast' | 'cinematic' | 'instant';
  themeContrast: 'titanium' | 'pure-black';
  antiGlitchFilter?: boolean;
}
