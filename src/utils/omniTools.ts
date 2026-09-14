import { ModelOption, ThinkingMode, SearchMode } from '../types/chat';
import { cleanUserSearchQuery } from './openrouter';

/**
 * Checks whether a given model is a Nixima Omni sovereign model (e.g. Nixima-0.3O or Nixima-0.2O).
 */
export function isOmniModel(model?: ModelOption | { id?: string; isOmni?: boolean; generation?: string } | null): boolean {
  if (!model) return false;
  return Boolean(
    model.isOmni ||
    model.id === 'nixima-0.4' ||
    (model.id && model.id.startsWith('nixima-0.4')) ||
    (model as any).generation === '0.4' ||
    model.id === 'nixima-0.3-omni' ||
    model.id === 'nixima-0.2-omni' ||
    model.id === 'nixima-0.3-o' ||
    model.id === 'nixima-0.2-o' ||
    (model.id && model.id.includes('omni'))
  );
}

/**
 * Evaluates whether an Omni model should autonomously invoke live web grounding (Tool 1: Search V3).
 */
export function shouldOmniSearch(query: string): boolean {
  const trimmed = query.trim().toLowerCase();

  // 1. News, breaking events, current updates
  const searchAnalysis = cleanUserSearchQuery(query);
  if (searchAnalysis.isNewsQuery) return true;

  // 2. Explicit search requests
  if (
    /(?:search(?:\s+for|\s+web|\s+the\s+web|\s+google|\s+online)?|google\s+this|find(?:\s+online|\s+on\s+the\s+web|\s+in\s+web)?|lookup|look\s+up|browse(?:\s+web)?|check\s+online|live\s+data|weather\s+in|stock\s+price|market\s+price|exchange\s+rate|latest\s+version|release\s+date|documentation\s+for)/i.test(trimmed) ||
    /(?:пошукай(?:те)?|знайди(?:те)?(?:\s+в\s+інтернеті|\s+в\s+мережі|\s+в\s+гуглі|\s+онлайн)?|пошук|погугли|глянь\s+в\s+інтернеті|яка\s+погода|курс\s+валют|ціна\s+акцій|свіжі\s+дані|остання\s+версія)/i.test(trimmed)
  ) {
    return true;
  }

  // 3. URLs, domains, or web links
  if (/https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}|[a-z0-9-]+\.(?:com|org|io|ai|net|ua|gov|edu)\b/i.test(trimmed)) {
    return true;
  }

  // 4. Temporal anchors indicating need for up-to-date data
  if (
    /\b(?:2025|2026|today|tonight|this month|this year|right now|currently|current|recent|newest|latest)\b/i.test(trimmed) ||
    /(?:сьогодні|зараз|цього року|актуальн|останні|найновіш|свіж)/i.test(trimmed)
  ) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether an Omni model should autonomously invoke Basic Thinking, DeepThinking, or no thinking (Tool 2: DeepThinking).
 * Supports dual-tool concurrent execution when both live grounding and deep analytical reasoning are required.
 */
export function getOmniThinkingDecision(query: string): ThinkingMode {
  const trimmed = query.trim().toLowerCase();

  // 1. Trivial or minimal greetings / short acknowledgements -> 'none' (zero latency overhead)
  if (
    /^(?:hi|hello|hey|greetings|howdy|sup|yo|привіт|вітаю|добрий\s+(?:день|ранок|вечір)|дякую|thanks|thank\s+you|ок|ok|good|bye|бувай)\b/i.test(trimmed) &&
    trimmed.length < 35
  ) {
    return 'none';
  }

  // 2. High-intensity logic, mathematical derivations, algorithmic complexity, or explicit deep reasoning requests -> 'deep'
  if (
    /(?:think\s+deeply|deep\s+think|step\s+by\s+step|formal\s+proof|derive|deduce|rigorous|chain\s+of\s+thought|verify\s+logically|prove\b|break\s+it\s+down\s+deeply)/i.test(trimmed) ||
    /(?:глибоко\s+подумай|подумай\s+глибоко|покроково|ланцюжок\s+думок|доведи|виведи|строге\s+доведення|обґрунтуй\s+детально)/i.test(trimmed)
  ) {
    return 'deep';
  }

  if (
    /(?:algorithm|complexity|o\(n\)|dynamic\s+programming|dijkstra|binary\s+tree|graph\s+traversal|matrix\s+multiplication|eigenvalue|derivative|integral|differential|theorem|axioms?|proof\b|puzzle|riddle|logician)/i.test(trimmed) ||
    /(?:алгоритм|складність|дерево|граф|матриц|похідна|інтеграл|диференціал|теорем|аксіом|доведення|головоломк|загадк|мудрец)/i.test(trimmed)
  ) {
    return 'deep';
  }

  if (
    /(?:architecture|concurrency|mutex|deadlock|race\s+condition|microservices|distributed\s+system|memory\s+leak|kernel|compiler|refactor)/i.test(trimmed) ||
    /(?:архітектур|асинхрон|паралелізм|дедлок|гонка\s+станів|мікросервіс|розподілен|витік\s+пам'яті|компілятор)/i.test(trimmed)
  ) {
    return 'deep';
  }

  // 3. Dual-Tool Co-activation: If search is triggered and inquiry requires reasoning, evaluation, or synthesis -> 'deep' or 'basic'
  if (shouldOmniSearch(query)) {
    if (
      /(?:compare|analyze|evaluation?|implications?|break\s+down|why|detail|explain|difference|summary|pros\s+and\s+cons|recommend|which\s+is\s+better|assess|verify|deeply|spec|benchmark)/i.test(trimmed) ||
      /(?:порівняй|проаналізуй|оціни|наслідки|розбери|чому|детально|поясни|різниця|підсумок|плюси\s+і\s+мінуси|порадь|що\s+краще|верифікуй|глибоко|характеристик|бенчмарк)/i.test(trimmed) ||
      query.length > 80
    ) {
      return 'deep';
    }
    if (query.length > 40 || query.includes('?')) {
      return 'basic';
    }
  }

  // 4. Substantial multi-part analytical queries (>300 chars with multiple questions or structure) -> 'deep'
  if (query.length > 300 && ((query.match(/\?/g) || []).length >= 2 || query.includes('\n-') || query.includes('1.'))) {
    return 'deep';
  }

  // 5. General explanations, coding tasks, comparisons, planning, troubleshooting, non-trivial questions -> 'basic'
  if (
    /(?:think|reason|explain|why|how|what\s+is\s+the\s+difference|compare|plan|analyze|suggest|solve|debug|implement|write|code|create|guide|troubleshoot)/i.test(trimmed) ||
    /(?:подумай|поясни|чому|як|в\s+чому\s+різниця|порівняй|сплануй|проаналізуй|порадь|виріши|задебаж|реалізуй|напиши|код|створи|інструкція)/i.test(trimmed)
  ) {
    return 'basic';
  }

  // If query is moderate length (>60 chars) or asks a question, benefit from basic agile thought process
  if (query.length > 60 || query.includes('?')) {
    return 'basic';
  }

  return 'none';
}

/**
 * Backward-compatible helper to check if any thinking mode is active for Omni
 */
export function shouldOmniThink(query: string): boolean {
  return getOmniThinkingDecision(query) !== 'none';
}

/**
 * Resolves the effective dual-tool execution configuration for a given query and settings.
 * Supports running Tool 1 (Web Search) and Tool 2 (DeepThinking) simultaneously.
 */
export function resolveOmniToolExecution(params: {
  query: string;
  isOmni: boolean;
  is04?: boolean;
  modelId?: string;
  userWebSearch?: boolean;
  userThinkingMode?: ThinkingMode;
  userDeepThink?: boolean;
  searchMode?: SearchMode;
}): {
  runWebSearch: boolean;
  effectiveThinkingMode: ThinkingMode;
  isDeepThink: boolean;
  isThinkingActive: boolean;
  isDualToolActive: boolean;
} {
  const { query, isOmni, is04, modelId, userWebSearch = false, userThinkingMode, userDeepThink = false } = params;

  const isNixima04 = Boolean(
    is04 ||
    modelId === 'nixima-0.4' ||
    (modelId && modelId.startsWith('nixima-0.4'))
  );

  // When Nixima-0.4 is active, it chooses completely on its own whether to use search, deepthink, or rest
  if (isNixima04) {
    const runWebSearch = shouldOmniSearch(query);
    const effectiveThinkingMode = getOmniThinkingDecision(query);
    const isDeepThink = effectiveThinkingMode === 'deep' || effectiveThinkingMode === 'ultra';
    const isThinkingActive = effectiveThinkingMode !== 'none';
    const isDualToolActive = runWebSearch && isThinkingActive;

    return {
      runWebSearch,
      effectiveThinkingMode,
      isDeepThink,
      isThinkingActive,
      isDualToolActive,
    };
  }

  // Search determination: user explicitly enabled, or news query, or autonomous Omni trigger
  const searchAnalysis = cleanUserSearchQuery(query);
  const isNews = searchAnalysis.isNewsQuery;
  const runWebSearch = Boolean(
    userWebSearch ||
    isNews ||
    (isOmni && shouldOmniSearch(query))
  );

  // Thinking determination: user explicitly set mode, or user enabled deepThink, or autonomous Omni trigger
  let effectiveThinkingMode: ThinkingMode = 'none';
  if (userThinkingMode && userThinkingMode !== 'none') {
    effectiveThinkingMode = userThinkingMode;
  } else if (userDeepThink) {
    effectiveThinkingMode = 'deep';
  } else if (isOmni) {
    effectiveThinkingMode = getOmniThinkingDecision(query);
  }

  const isDeepThink = effectiveThinkingMode === 'deep' || effectiveThinkingMode === 'ultra';
  const isThinkingActive = effectiveThinkingMode !== 'none';
  const isDualToolActive = isOmni && runWebSearch && isThinkingActive;

  return {
    runWebSearch,
    effectiveThinkingMode,
    isDeepThink,
    isThinkingActive,
    isDualToolActive,
  };
}
