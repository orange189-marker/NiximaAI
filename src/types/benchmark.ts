export interface BenchmarkScore {
  overall: number; // 0 - 100
  accuracy: number; // 0 - 100
  reasoningDepth: number; // 0 - 100
  codeQuality?: number; // 0 - 100
  speedTokensPerSec: number;
  timeToFirstTokenMs: number;
  totalDurationSec: number;
  grade: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B';
  costFactor: string;
}

export interface ModelBenchmarkResult {
  modelId: string;
  score: BenchmarkScore;
  thinking?: string;
  response: string;
  judgeVerdict: string;
  judgeVerdictUk?: string;
  keyStrengths: string[];
  keyStrengthsUk?: string[];
  keyTradeoffs: string[];
  keyTradeoffsUk?: string[];
}

export interface BenchmarkSuite {
  id: string;
  title: string;
  titleUk: string;
  category: 'logic' | 'coding' | 'architecture' | 'science' | 'speed';
  domain: string;
  difficulty: 'Frontier Extreme' | 'Hard' | 'Complex' | 'Standard';
  prompt: string;
  promptUk: string;
  contextDesc: string;
  contextDescUk: string;
  evaluationCriteria: string[];
  evaluationCriteriaUk: string[];
  winnerModelId: string;
  results: Record<string, ModelBenchmarkResult>;
}

export interface ModelLeaderboardEntry {
  modelId: string;
  rank: number;
  overallScore: number;
  eloRating: number;
  winRate: number; // e.g. 92%
  primaryBadge: string;
  summaryEn: string;
  summaryUk: string;
  recommendedForEn: string;
  recommendedForUk: string;
  metrics: {
    mathAndLogic: number;
    codingAndEngineering: number;
    systemArchitecture: number;
    scientificSynthesis: number;
    throughputSpeed: number;
    costEfficiency: number;
  };
}
