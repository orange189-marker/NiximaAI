export type SearchMode = 'fast' | 'standard' | 'mega';

export interface SearchOptimizationProfile {
  recommendedMode: SearchMode;
  badge: string;
  role: string;
  searchThroughput: string;
  searchStrengths: string[];
  searchRating: string;
}

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
  isOmni?: boolean;
  openRouterModel?: string;
  fallbackModels?: string[];
  creditMultiplier?: number;
  baseCreditCost?: number;
  searchOptimization?: SearchOptimizationProfile;
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

export interface SearchActionStep {
  stepNumber: number;
  actionType: 'query' | 'visit' | 'evaluate' | 'extract' | 'synthesize';
  title: string;
  targetUrl?: string;
  targetDomain?: string;
  reasoning: string; // The AI's live observation, thought & reaction on that specific website
  extractedSnippet?: string; // What data was retrieved from the page
  relevanceScore?: number; // e.g. 98 (%)
  status: 'completed' | 'in_progress' | 'verified';
  latencyMs?: number;
}

export interface SearchGrounding {
  query: string;
  sources: SearchSource[];
  searchTimeMs?: number;
  indexedResultsCount?: number;
  searchMode?: SearchMode;
  clusters?: { name: string; count: number }[];
  pagesCrawled?: number;
  browserInputs?: string[];
  searchActions?: SearchActionStep[];
  consensusScore?: number;
}

export type ThinkingMode = 'none' | 'basic' | 'deep';

export type ArtifactType = 'html' | 'react' | 'svg' | 'markdown' | 'code' | 'chart';

export interface ArtifactVersion {
  version: number;
  content: string;
  timestamp: number;
  description?: string;
}

export interface NiximaArtifact {
  id: string;
  title: string;
  type: ArtifactType;
  language: string;
  content: string;
  versions: ArtifactVersion[];
  currentVersion: number;
  messageId?: string;
  sourceCodeBlockIdx?: number;
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
  mode?: ThinkingMode;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  thinkingMode?: ThinkingMode;
  deepThinkingTelemetry?: DeepThinkingTelemetry;
  searchGrounding?: SearchGrounding;
  isThinkingExpanded?: boolean;
  timestamp: number;
  model?: string;
  isStreaming?: boolean;
  telemetry?: MessageTelemetry;
  artifacts?: NiximaArtifact[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
  pinned?: boolean;
  activeArtifactId?: string;
}

export interface UserSettings {
  userName: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  personaTone: 'architect' | 'cyberpunk' | 'academic' | 'executive';
  deepThinkEnabled: boolean;
  thinkingMode?: ThinkingMode;
  webSearchEnabled: boolean;
  searchMode?: SearchMode;
  autoSyncSearchModel?: boolean;
  soundEnabled: boolean;
  streamSpeed: 'fast' | 'cinematic' | 'instant';
  themeContrast: 'titanium' | 'pure-black';
  antiGlitchFilter?: boolean;
}
