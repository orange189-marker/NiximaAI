import { ModelOption, SearchMode } from '../types/chat';

export const NIXIMA_MODELS: ModelOption[] = [
  // =========================================================================
  // GENERATION 0.3 — NEXT-GEN SOVEREIGN FRONTIER FLEET
  // =========================================================================
  {
    id: 'nixima-0.3',
    name: 'Nixima-0.3',
    shortName: '0.3 Prime',
    badge: '0.3 PRIME FLAGSHIP',
    description: 'Next-generation sovereign flagship general synthetic intelligence. Features Quantum Rotary Attention (QRA-v3), multi-perspective dialectic synthesis, 2,000,000 continuous context, and zero-hallucination semantic anchoring.',
    contextWindow: '2,000,000 tokens',
    latency: '~12 ms / token',
    strengths: [
      'Quantum Rotary Attention (QRA-v3)',
      'Multi-Perspective Dialectic Synthesis',
      'Zero-Hallucination Semantic Grounding',
      '2M Token Continuous Coherence'
    ],
    parameters: 'Frontier 0.3 Prime Sovereign Core (QRA-v3)',
    generation: '0.3',
    isFlagship: true,
    openRouterModel: 'openrouter/free',
    fallbackModels: [
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'cohere/north-mini-code:free',
      'poolside/laguna-s-2.1:free'
    ],
    creditMultiplier: 1.2,
    baseCreditCost: 6,
    searchOptimization: {
      recommendedMode: 'standard',
      badge: 'PRIME SEARCH GROUNDING',
      role: 'Optimal for Search V3 Standard (30+ Sources Multi-Consensus)',
      searchThroughput: 'Prime Swarm (~95ms)',
      searchStrengths: ['Multi-domain cross-verification', 'Autonomous fact distillation', 'Near-zero hallucination index'],
      searchRating: '99.6%'
    }
  },
  {
    id: 'nixima-0.3-pro',
    name: 'Nixima-0.3 UltraPro',
    shortName: '0.3 UltraPro',
    badge: 'ULTRATHINKING V2.0',
    description: 'The pinnacle of high-order synthetic reasoning powered by UltraThinking V2.0. Relentless dialectical quantum struggle, multi-hypothesis theorem trees, counter-example falsification, and rigorous mathematical proofs across a 2.5M context window.',
    contextWindow: '2,500,000 tokens',
    latency: '~22 ms / token',
    strengths: [
      'UltraThinking V2.0 Quantum Dialectic',
      'Multi-Branch Hypothesis Falsification Trees',
      'Adversarial Counter-Example Proofs',
      'Formal Epistemic Logic & Theorems'
    ],
    parameters: 'Frontier 0.3 UltraPro Sovereign Engine (UltraThinking V2.0)',
    generation: '0.3',
    openRouterModel: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    fallbackModels: [
      'openrouter/free',
      'cohere/north-mini-code:free',
      'poolside/laguna-s-2.1:free'
    ],
    creditMultiplier: 2.8,
    baseCreditCost: 14,
    searchOptimization: {
      recommendedMode: 'mega',
      badge: 'QUANTUM SWARM DEDUCTION',
      role: 'Optimal for Search V3 Mega (50-80 Websites Sovereign Swarm)',
      searchThroughput: 'Deep Epistemic Synthesis (~180ms)',
      searchStrengths: ['Cross-cluster academic & news proofs', 'Resolves conflicting source discrepancies', 'Exhaustive 7-cluster synthesis'],
      searchRating: '99.9%'
    }
  },
  {
    id: 'nixima-0.3-omni',
    name: 'Nixima-0.3O',
    shortName: '0.3O Omni',
    badge: 'OMNI SOVEREIGN V2',
    description: 'Autonomous all-in-one multimodal synthetic intelligence combining instant epistemic reasoning, production systems engineering, and live 7-cluster web synthesis with zero manual toggles. Massive 3M context with adaptive hyper-throughput.',
    contextWindow: '3,000,000 tokens',
    latency: '~10 ms / token',
    strengths: [
      'Omni Sovereign Swarm Core V2',
      'Autonomous Zero-Toggle Adaptation',
      'Instantaneous 7-Cluster Web Synthesis',
      '3M Massive Context Window'
    ],
    parameters: 'Frontier 0.3O Omni Sovereign Core (3M Context)',
    generation: '0.3',
    isOmni: true,
    openRouterModel: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    fallbackModels: [
      'openrouter/free',
      'cohere/north-mini-code:free',
      'poolside/laguna-s-2.1:free'
    ],
    creditMultiplier: 2.0,
    baseCreditCost: 10,
    searchOptimization: {
      recommendedMode: 'standard',
      badge: 'AUTONOMOUS OMNI SWARM',
      role: 'Self-directing web synthesis across news, academic, and code registries',
      searchThroughput: 'Adaptive (~70ms)',
      searchStrengths: ['Autonomous triggering on demand', 'Unified reasoning & web grounding', 'Instantaneous source distillation'],
      searchRating: '99.8%'
    }
  },
  {
    id: 'nixima-0.3-coder',
    name: 'Nixima-0.3 Coder',
    shortName: '0.3 Coder',
    badge: '0.3 TITAN CODER',
    description: 'Frontier next-generation software architect & interactive game engineer. Powered by DeepThinking V2.1 with zero thinking laziness, complete runnable code, modern neon aesthetics, 60fps loops, and pure Web Audio sound synthesis.',
    contextWindow: '2,000,000 tokens',
    latency: '~16 ms / token',
    strengths: [
      'DeepThinking V2.1 Code & UI Architecture',
      'Zero Thinking Laziness (Complete Code Only)',
      'Polished Game Mechanics & Web Audio',
      'High-Performance Concurrent Systems'
    ],
    parameters: 'Frontier 0.3 Code & Design Engine (DeepThinking V2.1)',
    generation: '0.3',
    openRouterModel: 'cohere/north-mini-code:free',
    fallbackModels: [
      'openrouter/free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'poolside/laguna-s-2.1:free'
    ],
    creditMultiplier: 1.8,
    baseCreditCost: 8,
    searchOptimization: {
      recommendedMode: 'standard',
      badge: 'ARCH & CODE SEARCH',
      role: 'Optimal for Systems Architecture, Game Design & API Registries',
      searchThroughput: 'High-Precision Code (~85ms)',
      searchStrengths: ['Real-time API specifications & packages', 'Game loops & canvas optimization', 'Clean zero-defect refactoring'],
      searchRating: '99.8%'
    }
  },
  {
    id: 'nixima-0.3-flash',
    name: 'Nixima-0.3 HyperFlash',
    shortName: '0.3 HyperFlash',
    badge: 'SUB-4MS HYPERSTREAM',
    description: 'The fastest synthetic intelligence on Earth. Hyper-stream sub-4ms latency with a colossal 5,000,000 token context window. Instantaneous vector document ingest, zero-latency code completions, and lightning Search V3 Fast lookups.',
    contextWindow: '5,000,000 tokens',
    latency: '~4 ms / token',
    strengths: [
      'Sub-4ms Instantaneous TTFT',
      'Colossal 5,000,000 Token Context',
      'Hyper-Speed Multi-Document Ingest',
      'Zero-Latency Real-Time Streaming'
    ],
    parameters: 'Frontier 0.3 Hyper-Stream Core (5M Context)',
    generation: '0.3',
    openRouterModel: 'poolside/laguna-s-2.1:free',
    fallbackModels: [
      'openrouter/free',
      'cohere/north-mini-code:free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
    ],
    creditMultiplier: 0.6,
    baseCreditCost: 3,
    searchOptimization: {
      recommendedMode: 'fast',
      badge: 'HYPER-SPEED SEARCH ENGINE',
      role: 'Optimal for Search V3 Fast (20 Websites Rapid Lookups)',
      searchThroughput: 'Lightning (<30ms)',
      searchStrengths: ['Instantaneous facts & live data', 'Sub-millisecond token streaming', 'Concise zero-fluff extraction'],
      searchRating: '99.5%'
    }
  },

  // =========================================================================
  // GENERATION 0.2 — BATTLE-TESTED SOVEREIGN ENGINES
  // =========================================================================
  {
    id: 'nixima-0.2-omni',
    name: 'Nixima-0.2O',
    shortName: '0.2O Omni',
    badge: 'OMNI ALL-IN-ONE',
    description: 'Sovereign frontier all-in-one multimodal intelligence combining deep epistemic reasoning, production systems engineering, live web search synthesis, and ultra-high throughput with zero manual toggles required.',
    contextWindow: '1,000,000 tokens',
    latency: '~18 ms / token',
    strengths: ['Omni Sovereign Intelligence', 'Autonomous Reasoning & Web Grounding', 'Zero Manual Toggles Required', '1M Context Adaptive Throughput'],
    parameters: 'Omni Sovereign Multi-Expert Core',
    generation: '0.2',
    isOmni: true,
    openRouterModel: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    fallbackModels: [
      'openrouter/free',
      'nvidia/nemotron-3.5-lightning:free',
      'cohere/north-mini-code:free'
    ],
    creditMultiplier: 1.8,
    baseCreditCost: 8,
    searchOptimization: {
      recommendedMode: 'standard',
      badge: 'AUTONOMOUS OMNI SEARCH',
      role: 'Self-directing web synthesis across news, academic, and code registries',
      searchThroughput: 'Adaptive (~90ms)',
      searchStrengths: ['Autonomous triggering on demand', 'Unified reasoning & web grounding', 'Instantaneous source distillation'],
      searchRating: '99.5%'
    }
  },
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
    generation: '0.2',
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
      role: 'Optimal for Search V3 Standard (20+ Websites Deep Grounding)',
      searchThroughput: 'Standard (~120ms)',
      searchStrengths: ['Multi-domain news & facts', 'Balanced synthesis & accuracy', 'Low hallucination index'],
      searchRating: '96%'
    }
  },
  {
    id: 'nixima-0.2-pro',
    name: 'Nixima-0.2 Pro',
    shortName: '0.2 Pro',
    badge: 'ULTRA REASONING PRO',
    description: 'Autonomous high-order reasoning powerhouse powered by UltraThinking V1.0. Relentless dialectical struggle, multi-hypothesis stress-testing, counter-example verification, and formal mathematical proofs.',
    contextWindow: '500,000 tokens',
    latency: '~35 ms / token',
    strengths: ['UltraThinking V1.0 Dialectical Struggle', 'Multi-Branch Hypotheses & Falsification', 'Epistemic Logic & Proofs', 'Exhaustive Deep Deduction'],
    parameters: 'High-Capacity Sovereign Reasoning Engine (UltraThinking V1.0)',
    generation: '0.2',
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
      role: 'Optimal for Search V3 Mega (50-80 Websites Sovereign Swarm)',
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
    generation: '0.2',
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
    generation: '0.2',
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
      role: 'Optimal for Search V3 Fast (20 Websites Rapid Lookups)',
      searchThroughput: 'Hyper-Fast (<50ms)',
      searchStrengths: ['Instantaneous facts & live data', 'Sub-millisecond token streaming', 'Concise zero-fluff extraction'],
      searchRating: '99%'
    }
  }
];

export const DEFAULT_MODEL = NIXIMA_MODELS.find(m => m.id === 'nixima-0.3') || NIXIMA_MODELS.find(m => m.id === 'nixima-0.2') || NIXIMA_MODELS[0];
export const MODELS = NIXIMA_MODELS;

// Helper to look up recommended model for a given search mode
export function getRecommendedModelForSearchMode(mode: SearchMode): ModelOption {
  switch (mode) {
    case 'fast':
      return NIXIMA_MODELS.find(m => m.id === 'nixima-0.3-flash') || NIXIMA_MODELS.find(m => m.id === 'nixima-0.2-flash') || DEFAULT_MODEL;
    case 'mega':
      return NIXIMA_MODELS.find(m => m.id === 'nixima-0.3-pro') || NIXIMA_MODELS.find(m => m.id === 'nixima-0.2-pro') || DEFAULT_MODEL;
    case 'standard':
    default:
      return NIXIMA_MODELS.find(m => m.id === 'nixima-0.3') || NIXIMA_MODELS.find(m => m.id === 'nixima-0.2') || DEFAULT_MODEL;
  }
}

// Helper to look up a model by id, with backwards-compatibility aliases for 0.1 IDs
export function getModelById(id: string): ModelOption {
  const directMatch = NIXIMA_MODELS.find(m => m.id === id);
  if (directMatch) return directMatch;

  // Legacy mappings
  const legacyMap: Record<string, string> = {
    'nixima-0.1': 'nixima-0.2',
    'nixima-0.1-reasoning': 'nixima-0.2-pro',
    'nixima-0.1-coder': 'nixima-0.2-coder',
    'nixima-0.1-flash': 'nixima-0.2-flash',
    'nixima-0.2-o': 'nixima-0.2-omni',
    'nixima-omni': 'nixima-0.2-omni',
    'nixima-0.3-prime': 'nixima-0.3',
    'nixima-0.3-default': 'nixima-0.3',
    'nixima-0.3-o': 'nixima-0.3-omni',
  };

  const mappedId = legacyMap[id];
  if (mappedId) {
    const mapped = NIXIMA_MODELS.find(m => m.id === mappedId);
    if (mapped) return mapped;
  }

  return DEFAULT_MODEL;
}
