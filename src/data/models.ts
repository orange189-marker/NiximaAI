import { ModelOption } from '../types/chat';

export const NIXIMA_MODELS: ModelOption[] = [
  {
    id: 'nixima-0.1',
    name: 'Nixima-0.1',
    shortName: '0.1 Default',
    badge: 'FLAGSHIP',
    description: 'Frontier reasoning and general synthetic intelligence, dynamically routed to top-tier free intelligence clusters.',
    contextWindow: '200,000 tokens',
    latency: '~35 ms / token',
    strengths: ['General Intelligence', 'High-Order Logic', 'Multi-turn Memory', 'Agentic Workflows'],
    parameters: 'Auto-Routing Ensemble',
    isFlagship: true,
    openRouterModel: 'openrouter/free',
    fallbackModels: [
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'nvidia/nemotron-3.5-lightning:free'
    ],
    creditMultiplier: 1.0,
    baseCreditCost: 5,
  },
  {
    id: 'nixima-0.1-reasoning',
    name: 'Nixima-0.1 Reasoning',
    shortName: '0.1 Reason',
    badge: 'CHAIN-OF-THOUGHT',
    description: 'Extended step-by-step chain-of-thought problem solver, powered by NVIDIA Nemotron Nano Omni Reasoning.',
    contextWindow: '256,000 tokens',
    latency: '~45 ms / token',
    strengths: ['Math & Physics', 'Formal Logic', 'Deep Deduction', 'Verification'],
    parameters: '30B Omni Reasoning',
    openRouterModel: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    fallbackModels: [
      'openrouter/free',
      'nvidia/nemotron-3.5-lightning:free'
    ],
    creditMultiplier: 2.5,
    baseCreditCost: 12,
  },
  {
    id: 'nixima-0.1-coder',
    name: 'Nixima-0.1 Coder',
    shortName: '0.1 Coder',
    badge: 'DEV',
    description: 'Specialized code generation, debugging, and systems engineering powered by Cohere North Mini Code.',
    contextWindow: '256,000 tokens',
    latency: '~30 ms / token',
    strengths: ['Full-stack App Gen', 'Refactoring', 'Bug Hunting', 'CLI & DevOps'],
    parameters: 'Specialized Code Engine',
    openRouterModel: 'cohere/north-mini-code:free',
    fallbackModels: [
      'openrouter/free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
    ],
    creditMultiplier: 1.5,
    baseCreditCost: 8,
  },
  {
    id: 'nixima-0.1-flash',
    name: 'Nixima-0.1 Flash',
    shortName: '0.1 Flash',
    badge: 'FAST',
    description: 'Sub-millisecond latency for ultra-fast conversation and document parsing, powered by NVIDIA Nemotron Lightning.',
    contextWindow: '1,000,000 tokens',
    latency: '~15 ms / token',
    strengths: ['Instant Responses', 'Document Scanning', 'Rapid Brainstorming'],
    parameters: 'Lightning High-Throughput',
    openRouterModel: 'nvidia/nemotron-3.5-lightning:free',
    fallbackModels: [
      'openrouter/free',
      'cohere/north-mini-code:free'
    ],
    creditMultiplier: 0.5,
    baseCreditCost: 2,
  }
];

export const DEFAULT_MODEL = NIXIMA_MODELS[0];
export const MODELS = NIXIMA_MODELS;
