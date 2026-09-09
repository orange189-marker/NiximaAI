import { ModelOption } from '../types/chat';

export const NIXIMA_MODELS: ModelOption[] = [
  {
    id: 'nixima-0.1',
    name: 'Nixima-0.1',
    shortName: '0.1 Default',
    badge: 'FLAGSHIP',
    description: 'Nixima AI core frontier model. Balanced for deep reasoning, mathematical deduction, complex coding, and nuanced conversation.',
    contextWindow: '2,048,000 tokens',
    latency: '~45 ms / token',
    strengths: ['General Intelligence', 'High-Order Logic', 'Multi-turn Memory', 'Agentic Workflows'],
    parameters: '480B Mixture-of-Experts',
    isFlagship: true,
  },
  {
    id: 'nixima-0.1-reasoning',
    name: 'Nixima-0.1 Reasoning',
    shortName: '0.1 Reason',
    badge: 'CHAIN-OF-THOUGHT',
    description: 'Reinforcement learning enhanced for autonomous step-by-step verification, formal proofs, and rigorous analysis.',
    contextWindow: '1,000,000 tokens',
    latency: '~65 ms / token',
    strengths: ['Math & Physics', 'Algorithmic Puzzles', 'Deep Deduction', 'Code Auditing'],
    parameters: '480B MoE (Think Enabled)',
  },
  {
    id: 'nixima-0.1-coder',
    name: 'Nixima-0.1 Coder',
    shortName: '0.1 Coder',
    badge: 'DEV',
    description: 'Fine-tuned on trillions of syntax trees, full-stack architectures, and zero-defect systems programming.',
    contextWindow: '1,000,000 tokens',
    latency: '~38 ms / token',
    strengths: ['Full-stack App Gen', 'Refactoring', 'Bug Hunting', 'CLI & DevOps'],
    parameters: '128B Dense',
  },
  {
    id: 'nixima-0.1-flash',
    name: 'Nixima-0.1 Flash',
    shortName: '0.1 Flash',
    badge: 'FAST',
    description: 'Sub-millisecond latency for instant chat, high-throughput parsing, and rapid summaries.',
    contextWindow: '512,000 tokens',
    latency: '~12 ms / token',
    strengths: ['Instant Responses', 'Document Scanning', 'Rapid Brainstorming'],
    parameters: '32B Dense',
  }
];

export const DEFAULT_MODEL = NIXIMA_MODELS[0];
