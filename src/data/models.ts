import { ModelOption, SearchMode } from '../types/chat';

export const NIXIMA_MODELS: ModelOption[] = [
  {
    id: 'nixima-0.2',
    name: 'Nixima-0.2',
    shortName: '0.2 Default',
    badge: 'FLAGSHIP',
    description: 'Next-generation frontier general synthetic intelligence with adaptive Sparse Rotary Attention v2 and multi-turn autonomous synthesis.',
    contextWindow: '500,000 tokens',
    latency: '~25 ms / token',
    strengths: ['Frontier General Intelligence', 'Adaptive SRA v2 Architecture', 'Autonomous Synthesis', 'Multi-turn Long Context'],
    parameters: 'Frontier 0.2 Ensemble',
    isFlagship: true,
    openRouterModel: 'openrouter/free',
    fallbackModels: [
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'nvidia/nemotron-3.5-lightning:free'
    ],
    creditMultiplier: 1.0,
    baseCreditCost: 5,
    searchOptimization: {
      recommendedMode: 'standard',
      badge: 'BALANCED WEB SEARCH',
      role: 'Optimal for Search V2 Standard (General Web Research)',
      searchThroughput: 'Standard (~120ms)',
      searchStrengths: ['Multi-domain news & facts', 'Balanced synthesis & accuracy', 'Low hallucination index'],
      searchRating: '96%'
    }
  },
  {
    id: 'nixima-0.2-pro',
    name: 'Nixima-0.2 Pro',
    shortName: '0.2 Pro',
    badge: 'REASONING PRO',
    description: 'Autonomous high-order reasoning powerhouse with deep chain-of-thought, epistemic deduction, and mathematical verification.',
    contextWindow: '500,000 tokens',
    latency: '~35 ms / token',
    strengths: ['Deep Chain-of-Thought', 'Epistemic Logic & Proofs', 'Scientific Deduction', 'Complex System Theory'],
    parameters: 'High-Capacity Reasoning Core',
    openRouterModel: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    fallbackModels: [
      'openrouter/free',
      'nvidia/nemotron-3.5-lightning:free'
    ],
    creditMultiplier: 2.5,
    baseCreditCost: 12,
    searchOptimization: {
      recommendedMode: 'mega',
      badge: 'DEEP SWARM REASONER',
      role: 'Optimal for Search V2 Mega (Sovereign Swarm & Multi-Cluster)',
      searchThroughput: 'Deep Deduction (~210ms)',
      searchStrengths: ['Cross-cluster epistemic proofs', 'Multi-source discrepancy resolution', 'Exhaustive literature synthesis'],
      searchRating: '98%'
    }
  },
  {
    id: 'nixima-0.2-coder',
    name: 'Nixima-0.2 Coder',
    shortName: '0.2 Coder',
    badge: 'SYSTEMS DEV',
    description: 'Specialized production software architect. Unrivaled in full-stack systems engineering, zero-defect algorithms, async concurrency, and deep refactoring.',
    contextWindow: '500,000 tokens',
    latency: '~28 ms / token',
    strengths: ['Production Architecture', 'Zero-defect TypeScript/Rust/Python', 'Concurrent Systems', 'Full-stack Engineering'],
    parameters: 'Specialized 0.2 Code Engine',
    openRouterModel: 'cohere/north-mini-code:free',
    fallbackModels: [
      'openrouter/free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
    ],
    creditMultiplier: 1.5,
    baseCreditCost: 8,
    searchOptimization: {
      recommendedMode: 'standard',
      badge: 'DOCS & REPO SEARCH',
      role: 'Optimal for Technical Documentation, GitHub & API References',
      searchThroughput: 'High-Precision Tech (~110ms)',
      searchStrengths: ['API signatures & package docs', 'RFC & specification tracking', 'Stack trace & error lookup'],
      searchRating: '97%'
    }
  },
  {
    id: 'nixima-0.2-flash',
    name: 'Nixima-0.2 Flash',
    shortName: '0.2 Flash',
    badge: 'HYPER SPEED',
    description: 'Ultra-high throughput sub-millisecond response engine with massive 2,000,000 token context window for instantaneous analysis and streaming.',
    contextWindow: '2,000,000 tokens',
    latency: '~10 ms / token',
    strengths: ['Sub-millisecond Latency', 'Massive 2M Context', 'High-speed Document Processing', 'Real-time Streaming'],
    parameters: 'Hyper-Throughput Engine',
    openRouterModel: 'nvidia/nemotron-3.5-lightning:free',
    fallbackModels: [
      'openrouter/free',
      'cohere/north-mini-code:free'
    ],
    creditMultiplier: 0.5,
    baseCreditCost: 2,
    searchOptimization: {
      recommendedMode: 'fast',
      badge: 'FAST SEARCH ENGINE',
      role: 'Optimal for Search V2 Fast (Instant Live Lookups)',
      searchThroughput: 'Hyper-Fast (<50ms)',
      searchStrengths: ['Instantaneous facts & live data', 'Sub-millisecond token streaming', 'Concise zero-fluff extraction'],
      searchRating: '99%'
    }
  }
];

export const DEFAULT_MODEL = NIXIMA_MODELS[0];
export const MODELS = NIXIMA_MODELS;

// Helper to look up recommended model for a given search mode
export function getRecommendedModelForSearchMode(mode: SearchMode): ModelOption {
  switch (mode) {
    case 'fast':
      return NIXIMA_MODELS.find(m => m.id === 'nixima-0.2-flash') || DEFAULT_MODEL;
    case 'mega':
      return NIXIMA_MODELS.find(m => m.id === 'nixima-0.2-pro') || DEFAULT_MODEL;
    case 'standard':
    default:
      return NIXIMA_MODELS.find(m => m.id === 'nixima-0.2') || DEFAULT_MODEL;
  }
}

// Helper to look up a model by id, with backwards-compatibility aliases for 0.1 IDs
export function getModelById(id: string): ModelOption {
  const directMatch = NIXIMA_MODELS.find(m => m.id === id);
  if (directMatch) return directMatch;

  // Legacy 0.1 mappings
  const legacyMap: Record<string, string> = {
    'nixima-0.1': 'nixima-0.2',
    'nixima-0.1-reasoning': 'nixima-0.2-pro',
    'nixima-0.1-coder': 'nixima-0.2-coder',
    'nixima-0.1-flash': 'nixima-0.2-flash',
  };

  const mappedId = legacyMap[id];
  if (mappedId) {
    const mapped = NIXIMA_MODELS.find(m => m.id === mappedId);
    if (mapped) return mapped;
  }

  return DEFAULT_MODEL;
}
