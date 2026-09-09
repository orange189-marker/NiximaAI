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
  systemPrompt: string;
  deepThinkEnabled: boolean;
  webSearchEnabled: boolean;
  streamResponse: boolean;
}
