import { Conversation } from '../types/chat';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'chat-1',
    title: 'Architecture of Nixima-0.1',
    createdAt: Date.now() - 3600 * 1000 * 4,
    updatedAt: Date.now() - 3600 * 1000 * 4,
    modelId: 'nixima-0.1',
    messages: [
      {
        id: 'm-1',
        role: 'user',
        content: 'Can you summarize how Nixima-0.1 handles ultra-long context reasoning?',
        timestamp: Date.now() - 3600 * 1000 * 4,
      },
      {
        id: 'm-2',
        role: 'assistant',
        content: `**Nixima-0.1** employs a proprietary **Sparse Rotary Attention (SRA)** mesh coupled with dynamic hierarchical memory caches.

### Key Architectural Pillars:
1. **Dynamic Sparse Routing**: Routes queries across 480B parameters, activating only the most pertinent expert sub-networks (64B active per token).
2. **Infinite KV Cache Compression**: Compresses distant context blocks by up to 12x with near-zero loss of semantic retrieval fidelity.
3. **Hardware Acceleration**: Optimized for tensor parallelism across clustered accelerators, achieving **45ms/token** even at 1M+ tokens depth.`,
        thinking: `Identified user inquiry regarding long-context handling in Nixima-0.1. Retrieved SRA architecture whitepaper details. Formulated 3-pillar breakdown.`,
        timestamp: Date.now() - 3600 * 1000 * 4 + 1200,
        model: 'Nixima-0.1',
      }
    ]
  },
  {
    id: 'chat-2',
    title: 'High-Performance Vector Cache',
    createdAt: Date.now() - 3600 * 1000 * 24,
    updatedAt: Date.now() - 3600 * 1000 * 24,
    modelId: 'nixima-0.1-coder',
    messages: [
      {
        id: 'm-3',
        role: 'user',
        content: 'Write an in-memory cosine similarity search snippet in Rust.',
        timestamp: Date.now() - 3600 * 1000 * 24,
      },
      {
        id: 'm-4',
        role: 'assistant',
        content: `Here is a SIMD-friendly implementation in Rust for computing cosine similarity over dense embedding vectors:

\`\`\`rust
pub fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len(), "Vectors must have matching dimensions");
    
    let mut dot_prod = 0.0f32;
    let mut norm_a = 0.0f32;
    let mut norm_b = 0.0f32;

    for (x, y) in a.iter().zip(b.iter()) {
        dot_prod += x * y;
        norm_a += x * x;
        norm_b += y * y;
    }

    if norm_a == 0.0 || norm_b == 0.0 {
        return 0.0;
    }

    dot_prod / (norm_a.sqrt() * norm_b.sqrt())
}
\`\`\`

Compile with \`-C target-cpu=native\` to enable auto-vectorization across AVX-512 or NEON instructions.`,
        thinking: `Loaded Rust code template for vector math. Validated zero-division check and vector length assertion.`,
        timestamp: Date.now() - 3600 * 1000 * 24 + 800,
        model: 'Nixima-0.1 Coder',
      }
    ]
  },
  {
    id: 'chat-3',
    title: 'Global Megacity Demographics',
    createdAt: Date.now() - 3600 * 1000 * 2,
    updatedAt: Date.now() - 3600 * 1000 * 2,
    modelId: 'nixima-0.1',
    messages: [
      {
        id: 'm-5',
        role: 'user',
        content: 'Show me the top 10 most populated metropolitan areas in the world in a table.',
        timestamp: Date.now() - 3600 * 1000 * 2,
      },
      {
        id: 'm-6',
        role: 'assistant',
        content: `Here is the verified demographic ranking of the top 10 most populated metropolitan areas globally:

| Rank | City (Metropolitan Area) | Country | Population (Millions) |
|:---:|---|---|---:|
| 1 | Tokyo | Japan | 37.8 |
| 2 | Delhi | India | 32.3 |
| 3 | Shanghai | China | 29.9 |
| 4 | São Paulo | Brazil | 22.6 |
| 5 | Mexico City | Mexico | 22.5 |
| 6 | Beijing | China | 21.5 |
| 7 | Cairo | Egypt | 20.9 |
| 8 | Mumbai | India | 20.7 |
| 9 | Dhaka | Bangladesh | 20.5 |
| 10 | Osaka | Japan | 19.3 |

You can sort any column by clicking its header, filter by keyword, or export the data matrix directly to CSV.`,
        thinking: `Retrieved latest UN World Urbanization Prospects database. Formatted top 10 agglomerations into structured markdown table.`,
        timestamp: Date.now() - 3600 * 1000 * 2 + 950,
        model: 'Nixima-0.1',
      }
    ]
  }
];
