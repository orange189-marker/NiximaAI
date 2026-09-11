import { ModelOption, SearchGrounding, DeepThinkingTelemetry, SearchMode, ThinkingMode } from '../types/chat';
import { isCjkRequested, sanitizeModelOutput } from './textSanitizer';
import { generateDefaultGrounding, computeDeepThinkingTelemetry } from './openrouter';

interface GenerateResponseOptions {
  prompt: string;
  model: ModelOption;
  deepThink: boolean;
  thinkingMode?: ThinkingMode;
  webSearch?: boolean;
  searchMode?: SearchMode;
  history: { role: string; content: string }[];
}

interface AIResponseResult {
  thinking: string;
  response: string;
  searchGrounding?: SearchGrounding;
  deepThinkingTelemetry?: DeepThinkingTelemetry;
}

export function generateNiximaResponse(options: GenerateResponseOptions): AIResponseResult {
  const allowCjk = isCjkRequested(options.prompt);
  const effectiveMode: ThinkingMode = options.thinkingMode || (options.deepThink ? 'deep' : 'none');
  const allowThinking = effectiveMode !== 'none';

  const raw = generateRawNiximaResponse({ ...options, thinkingMode: effectiveMode });
  const sanitizedThinking = allowThinking ? sanitizeModelOutput(raw.thinking, { allowCjk }) : '';
  const sanitizedResponse = sanitizeModelOutput(raw.response, { allowCjk });

  const deepThinkingTelemetry = (allowThinking && sanitizedThinking.length > 20)
    ? computeDeepThinkingTelemetry(sanitizedThinking, undefined, effectiveMode)
    : undefined;

  const searchGrounding = options.webSearch
    ? generateDefaultGrounding(options.prompt, options.searchMode)
    : raw.searchGrounding;

  return {
    thinking: sanitizedThinking,
    response: sanitizedResponse,
    deepThinkingTelemetry,
    searchGrounding,
  };
}

function generateRawNiximaResponse({
  prompt,
  model,
  deepThink,
  thinkingMode,
}: GenerateResponseOptions): AIResponseResult {
  const lower = prompt.toLowerCase();
  const effectiveMode: ThinkingMode = thinkingMode || (deepThink ? 'deep' : 'none');

  // Thinking trace generation gated by thinkingMode
  let thinking = '';
  if (effectiveMode === 'deep') {
    if (model.id === 'nixima-0.3-coder') {
      thinking = `### 1. Game Mechanics & State Machine Invariants
- Semantic parsing of requirements: "${prompt.slice(0, 60)}..."
- Establishing core game loop (60 FPS requestAnimationFrame), grid coordinate systems, and entity state transitions.
- Defining strict boundary invariants, collision detection algorithms, and deterministic score progression.

### 2. High-End Visual Aesthetics & Web Audio Engineering
- Designing modern dark neon palette (#0b0f19 / #10b981 / #06b6d4) with glowing drop shadows and ambient particle bursts.
- Architecting pure Web Audio API synthesizer (sound effects for movement, pickups, game over) with zero external audio assets.
- Implementing dual control interfaces: responsive keyboard event listeners (WASD / Arrows) + touch-friendly on-screen D-pad controls.

### 3. Zero-Laziness Verification & Full Implementation Audit
- Auditing codebase for zero placeholders: NO "// code goes here", NO missing functions.
- 100% complete, self-contained, runnable code verified for immediate execution in Nixima Canvas Studio.`;
    } else {
      thinking = `### 1. Problem Space Decomposition & Invariants
- Semantic decomposition of prompt: "${prompt.slice(0, 60)}..."
- Identified domain boundary conditions, operator clearance, and temporal context (Year 2026).
- Ensuring zero lexical cross-contamination and strict linguistic purity in user language.

### 2. Neural Candidate Synthesis & Counterfactual Testing
- Exploring candidate synthesis pathways across ${model.name} neural weights.
- Stress-testing edge cases, exception boundaries, and potential hallucinations.
- Validated epistemic confidence: 99.85%.

### 3. Epistemic Synthesis & Definitive Delivery
- Assembling structured, authoritative response with maximal engineering rigor.`;
    }
  } else if (effectiveMode === 'basic') {
    if (model.id === 'nixima-0.3-coder') {
      thinking = `### 1. Component Architecture & Data Contracts
- Dissecting query requirements: "${prompt.slice(0, 50)}..."
- Defining data flow, state machine, and interface constraints.

### 2. Implementation Checklist & Zero-Laziness Verification
- Pre-execution plan verifying all components will be written completely without placeholders.`;
    } else {
      thinking = `### 1. Intent Analysis & Core Objective
- Dissecting query requirements: "${prompt.slice(0, 50)}..."
- Outlining key constraints, operator context, and pragmatic execution path.

### 2. Rapid Solution Blueprint
- Formulating direct, structured synthesis with immediate technical clarity.`;
    }
  } else {
    thinking = '';
  }

  // Response generation logic

  // 0A. Knowledge Cutoff & Temporal Baseline Inquiry
  if (
    lower.includes('cutoff') ||
    lower.includes('cut off') ||
    (lower.includes('knowledge') && (lower.includes('date') || lower.includes('limit') || lower.includes('year') || lower.includes('2023') || lower.includes('2024') || lower.includes('до якого'))) ||
    lower.includes('дата знань') ||
    lower.includes('зріз знань') ||
    lower.includes('до якого року') ||
    lower.includes('який зараз рік') ||
    lower.includes('what year is it')
  ) {
    const isUk = /[а-яіїєґ]/i.test(prompt);
    const now = new Date();
    const dateStr = now.toLocaleDateString(isUk ? 'uk-UA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (isUk) {
      return {
        thinking: `1. Аналіз запиту оператора щодо часового горизонту та зрізу знань.
2. Підтвердження сучасної архітектури Nixima 0.2 (${now.getFullYear()} рік) без застарілих обмежень 2023 року.
3. Огляд інтеграції інструменту Search V2 для живого огляду веб-ресурсів та новинних стрічок у реальному часі.`,
        response: `### Часова архітектура та актуальність знань Nixima AI

**Nixima AI не має застарілого зрізу знань 2023 чи 2024 року.** Модель функціонує на базі суверенної архітектури покоління **0.2**, синхронізована з реальним часом (**${dateStr}**) та має прямий доступ до світової мережі через систему **Search V2**.

| Параметр | Стан системи |
| :--- | :--- |
| **Поточна дата** | **${dateStr}** (${now.getFullYear()} рік) |
| **Базова архітектура** | \`${model.name}\` (Покоління 0.2) |
| **Живий веб-пошук** | **Search V2** (Standard, Fast, Mega Swarm) |
| **Оперативні стрічки новин** | Світові та українські новинні агентства у реальному часі |

#### Як працює пошук актуальної інформації:
1. **Інструмент Search V2**: Коли ви запитуєте про сьогоднішні події чи свіжі новини, Nixima в реальному часі сканує глобальні новинні стрічки (Google News Wire, Reuters, BBC, AP, Укрінформ, Суспільне).
2. **Верифікація джерел**: Кожне повідомлення перевіряється через кілька незалежних джерел із прямими посиланнями.
3. **Без штучних обмежень**: Модель не відповідає шаблонними відмовами щодо 2023 року, а формує чіткий та актуальний звіт на сьогодні.`
      };
    }

    return {
      thinking: `1. Analyzing operator inquiry regarding knowledge cutoff and temporal baseline.
2. Confirming modern 0.2 generation architecture operating in ${now.getFullYear()} with zero legacy 2023 cutoff constraints.
3. Outlining Search V2 live web mesh integration for real-time news wires and verifiable citations.`,
      response: `### Temporal Architecture & Knowledge Grounding in Nixima AI

**Nixima AI does not operate on a legacy 2023 or 2024 knowledge cutoff.** Operating on the sovereign **${model.name}** (0.2 Generation), Nixima is anchored in the present (**${dateStr}**) and equipped with **Search V2 Real-Time Web Grounding**.

| Parameter | Platform Specification |
| :--- | :--- |
| **Current Date** | **${dateStr}** (${now.getFullYear()}) |
| **Knowledge Baseline** | 0.2 Generation (Continuously ground-referenced) |
| **Live Web Browsing** | **Search V2** (Standard, Fast, Mega Swarm) |
| **News Wire Retrieval** | Real-time international news wire feeds |

#### How Real-Time Web Grounding Works:
1. **Search V2 Web Mesh**: When asking about breaking developments or today's events, Nixima queries live news wires and indexes in real time.
2. **Direct Source Verification**: Results are multi-sourced across authoritative global newsrooms (Reuters, AP, BBC, Bloomberg, and technical repositories) with interactive verified source cards.
3. **Zero-Cutoff Guarantee**: Nixima does not refuse contemporary inquiries with generic legacy AI disclaimers, delivering structured, up-to-date briefings directly.`
    };
  }

  // 0B. Live News & Today's World Events Synthesis
  if (
    lower.includes('news') ||
    lower.includes('новин') ||
    lower.includes('сьогодні') ||
    lower.includes('today') ||
    lower.includes('headlines') ||
    lower.includes('breaking') ||
    lower.includes('world events') ||
    lower.includes('що сталось') ||
    lower.includes('що відбувається') ||
    lower.includes('що нового') ||
    lower.includes('current events')
  ) {
    const isUk = /[а-яіїєґ]/i.test(prompt);
    const isUsa = /\b(?:usa|u\.s\.a\.|u\.s\.|united states|america|states)\b|сша|штат[иа]?|америк[аи]/i.test(lower);
    const now = new Date();
    const dateStr = now.toLocaleDateString(isUk ? 'uk-UA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (isUsa) {
      if (isUk) {
        return {
          thinking: `1. Синтез актуальних новин та аналітики щодо США на ${dateStr}.
2. Огляд ключових сфер: внутрішня політика Вашингтона, вибори та Конгрес, рішення ФРС, стан економіки та національні роковини.
3. Формування перевіреного звіту з посиланнями на провідні американські джерела.`,
          response: `### 🇺🇸 Огляд головних подій та новин США — ${dateStr}

*Оперативне зведення ключових національних, економічних та суспільно-політичних подій у Сполучених Штатах Америки:*

---

#### 1. 🏛️ Внутрішня політика, Конгрес та Вашингтон
- **Законодавчі ініціативи та бюджетні дебати**: На Капітолійському пагорбі тривають активні консультації щодо бюджетних видатків на новий фіскальний рік, узгодження програм внутрішніх інвестицій та податкових ініціатив.
- **Меморіальні заходи 11 вересня**: По всій країні проходять національні пам'ятні заходи у 25-ті роковини терактів 11 вересня 2001 року за участі сімей загиблих біля меморіалів World Trade Center у Нью-Йорку, Пентагону та в Шанксвіллі.
- *Джерела:* [Associated Press](https://apnews.com) • [Reuters US](https://reuters.com) • [NPR](https://npr.org)

#### 2. 📈 Економіка США, Федеральна резервна система та ринки
- **Монетарна політика та інфляція**: Фінансові ринки аналізують свіжі звіти Міністерства праці щодо зайнятості та індексу споживчих цін. Федеральна резервна система оцінює баланс між охолодженням інфляційного тиску та збереженням стабільності ринку праці.
- **Енергетичний ринок та споживчий сектор**: Відзначаються коливання цін на пальне в окремих штатах на тлі змін у внутрішній логістиці нафтопродуктів та глобальних ринкових котирувань.
- *Джерела:* [Bloomberg US](https://bloomberg.com) • [USA Today](https://usatoday.com) • [The Wall Street Journal](https://wsj.com)

#### 3. 🌐 Зовнішня політика та безпека
- **Міжнародні партнерства та безпека**: Державний департамент та Пентагон продовжують координацію із союзниками по НАТО та індо-тихоокеанськими партнерами щодо безпеки морських шляхів, кіберзахисту критичної інфраструктури та підтримки міжнародного правопорядку.
- *Джерела:* [The Washington Post](https://washingtonpost.com) • [Голос Америки](https://holosameryky.com)

---

> 💡 **Search V2:** Для дослідження конкретної новини, законопроєкту чи заяви, активуйте інструмент **Search V2**.`
        };
      }

      return {
        thinking: `1. Synthesizing authoritative US national news wire telemetry for ${dateStr}.
2. Structuring verified developments across Federal policy, Congressional debates, Federal Reserve economic updates, and national commemorations.
3. Cross-verifying citations across Associated Press, Reuters US, USA Today, and Bloomberg.`,
        response: `### 🇺🇸 United States National News Briefing — ${dateStr}

*An authoritative, multi-source digest of top domestic developments, federal policy, economy, and national events across the United States:*

---

#### 1. 🏛️ Capitol Hill & Federal Governance
- **Congressional Deliberations & Legislative Agenda**: Bipartisan committee negotiations proceed on Capitol Hill regarding fiscal spending allocations, regulatory oversight, and economic policy measures.
- **National 9/11 Commemorations**: Nationwide ceremonies mark the 25th anniversary of September 11, with solemn gatherings honoring victims at the National September 11 Memorial in New York, the Pentagon, and Shanksville, Pennsylvania.
- *Primary Sources:* [Associated Press](https://apnews.com/us-news) • [Reuters US](https://reuters.com/world/us) • [NPR](https://npr.org)

#### 2. 📈 US Economy, Federal Reserve & Labor Markets
- **Interest Rate Outlook & Inflation Telemetry**: Market analysts and policymakers are evaluating latest Bureau of Labor Statistics indices and consumer sentiment data as the Federal Reserve weighs baseline rate adjustments.
- **Energy & Consumer Indices**: Regional transportation and fuel indices reflect late-summer dynamics, while domestic corporate earnings demonstrate resilience across manufacturing and cloud computing sectors.
- *Primary Sources:* [USA Today](https://usatoday.com) • [Bloomberg US](https://bloomberg.com) • [The Wall Street Journal](https://wsj.com)

#### 3. 🌐 National Security & International Alliances
- **Defense Coordination & Strategic Alliances**: The Department of Defense and State Department continue high-level strategic alignment with NATO, European, and Indo-Pacific allies to fortify maritime trade corridors and strengthen defense industrial cooperation.
- *Primary Sources:* [The Washington Post](https://washingtonpost.com) • [Axios](https://axios.com)

---

> 💡 **Tip:** To inspect any specific US news event or bill in real time, submit your query with **Search V2** enabled for live web verification.`
      };
    }

    if (isUk) {
      return {
        thinking: `1. Збір та синтез актуальної новинної картини світу на ${dateStr}.
2. Структурування за ключовими напрямками: геополітика, технологічний фронтир ШІ, світова економіка та наука.
3. Формування чітких тез із зазначенням верифікованих джерел.`,
        response: `### 🌐 Світове інформаційне зведення — ${dateStr}

*Оперативний огляд ключових глобальних подій та трендів, верифікованих через міжнародні та українські новинні стрічки:*

---

#### 1. 🏛️ Геополітика та міжнародна безпека
- **Міжнародна коаліція та безпека**: Відбулися чергові раунди консультацій між лідерами країн ЄС, Великої Британії та США щодо посилення протиповітряної оборони, стабільності Чорноморського коридору та довгострокової фінансової підтримки України.
- **Дипломатичний трек**: Дипломатичні відомства узгоджують додаткові пакети санкцій проти обходу експортного контролю та постачання технологій подвійного призначення.
- *Джерела:* [Укрінформ](https://ukrinform.ua) • [Суспільне Новини](https://suspilne.media) • [BBC News](https://bbc.com/ukrainian)

#### 2. ⚡ Технології та штучний інтелект
- **Нове покоління мультимодальних моделей**: Провідні лабораторії розгортають моделі з динамічним міркуванням і латентним пошуком, що значно знижують рівень галюцинацій та оптимізують енергоспоживання ЦОД.
- **Напівпровідникова індустрія**: Анонсовано розширення виробничих потужностей передових літографічних заводів для задоволення попиту на спеціалізовані нейроприскорювачі.
- *Джерела:* [Reuters Tech](https://reuters.com) • [Bloomberg](https://bloomberg.com)

#### 3. 📈 Світова економіка та фінансові ринки
- **Монетарна політика**: Провідні центральні банки відзначають поступову стабілізацію базової інфляції, коригуючи прогнози щодо процентних ставок на наступні квартали.
- **Енергетичний сектор**: Зростає частка відновлюваної генерації в енергобалансі європейських країн, водночас нафта й скраплений газ демонструють помірну волатильність.
- *Джерела:* [Bloomberg Markets](https://bloomberg.com) • [Financial Times](https://ft.com)

---

> 💡 **Search V2:** Для детального дослідження конкретної теми, задайте уточнююче запитання з активним інструментом **Search V2**.`
      };
    }

    return {
      thinking: `1. Aggregating multi-source global news wire telemetry for ${dateStr}.
2. Categorizing high-impact world events across Geopolitics, Frontier AI, Macroeconomics, and Space/Science.
3. Structuring objective, factual briefing with cross-verified citations.`,
      response: `### 🌐 Global News Briefing — ${dateStr}

*A curated, multi-source overview of key international developments verified across global news wires:*

---

#### 1. 🏛️ Geopolitics & International Security
- **Diplomatic Summits & Strategic Alliances**: Multilateral discussions continue across Europe and North America focusing on regional deterrence, supply chain autonomy, and maritime transit security.
- **Global Aid & Reconstruction**: New bilateral agreements were formalized to fortify energy infrastructure and critical communications grids against cyber and physical disruption.
- *Primary Sources:* [Reuters World](https://reuters.com) • [Associated Press](https://apnews.com) • [BBC News](https://bbc.com/news)

#### 2. ⚡ Frontier AI & Technological Advances
- **Autonomous Reasoning Architectures**: AI labs are rolling out hybrid models integrating test-time compute with real-time epistemic search, drastically improving factual grounding and verifiable code generation.
- **Semiconductor Fabrication**: Major chipmakers reported progress on sub-2nm node mass production, accompanied by expanded packaging facilities to ease AI inference bottlenecks.
- *Primary Sources:* [Bloomberg Tech](https://bloomberg.com) • [Reuters Technology](https://reuters.com)

#### 3. 📈 Global Economy & Capital Markets
- **Central Bank Policy Trajectories**: Global economic indicators signal a steadying of core inflation, with market participants adjusting expectations for policy rates into upcoming fiscal quarters.
- **Energy Transition & Commodities**: Clean energy capacity additions hit record quarterly highs in major industrial hubs, while global crude and LNG indices remain within balanced ranges.
- *Primary Sources:* [Bloomberg Markets](https://bloomberg.com) • [Financial Times](https://ft.com)

---

> 💡 **Tip:** To explore any specific breaking event, country, or technology in greater depth, submit a query with **Search V2** enabled for exhaustive, live website inspection.`
    };
  }

  // 0B. Nixima-0.2O Omni Inquiries
  if (lower.includes('omni') || lower.includes('0.2o') || lower.includes('0.2-omni')) {
    const isUk = /[а-яіїєґ]/i.test(prompt);
    if (isUk) {
      return {
        thinking: `1. Аналіз запиту оператора щодо моделі Nixima-0.2O (Omni).
2. Опис суверенної все-в-одному архітектури: поєднання міркувань (DeepThinking), системного кодування та пошуку (Search V2).
3. Підкреслення відсутності потреби в ручних перемикачах: автономне прийняття рішень та динамічна активація.`,
        response: `### 🔮 Nixima-0.2O (Omni) — Суверенна модель «Все-в-одному»

**Nixima-0.2O (Omni)** — це флагманська суверенна мультимодальна модель нового покоління, створена для повного циклу інтелектуальних завдань без компромісів між швидкістю, глибиною міркувань та актуальністю даних.

#### 🌟 Ключові інновації 0.2O:
1. **Повна автономність (Zero Manual Toggles)**:
   - Вам більше не потрібно вручну перемикати режими **DeepThinking V2** або **Search V2**.
   - **Nixima-0.2O** самостійно визначає, коли потрібен глибокий математичний ланцюжок думок або коли запит вимагає перевірки фактів у живому інтернеті.
2. **Уніфікований інтелект**:
   - Поєднує високу логіку \`0.2 Pro\`, системну інженерію \`0.2 Coder\` та надшвидку генерацію \`0.2 Flash\`.
3. **Гігантський контекст**:
   - Робоче вікно в **1 000 000 токенів** для аналізу великих репозиторіїв коду, наукових статей та складної документації.

| Характеристика | Параметри Nixima-0.2O |
| :--- | :--- |
| **Клас моделі** | Суверенний мультимодальний Omni-рушій |
| **Контекст** | **1,000,000 токенів** |
| **Швидкість** | ~18 мс / токен (адаптивна) |
| **Автономні інструменти** | Dynamic DeepThinking & Live Search V2 Grounding |
| **Кредитний множник** | 1.8x |`
      };
    }

    return {
      thinking: `1. Analyzing user query regarding the Nixima-0.2O (Omni) model architecture.
2. Formulating comprehensive briefing on all-in-one capabilities: reasoning, coding, and live web search.
3. Highlighting the toggle-free autonomous decision engine for DeepThinking and WebSearch.`,
      response: `### 🔮 Nixima-0.2O (Omni) — Sovereign All-In-One Intelligence

**Nixima-0.2O (Omni)** is our sovereign flagship multimodal model designed to eliminate the trade-off between reasoning depth, programming precision, and live web grounding.

#### 🌟 Key Breakthroughs of 0.2O:
1. **Autonomous Intelligence (Zero Manual Toggles)**:
   - Eliminates the need to manually toggle **DeepThinking** or **WebSearch**.
   - **Nixima-0.2O** autonomously detects when a problem demands formal multi-step epistemic reasoning or when live web grounding is required to fetch today's data.
2. **Unified Neural Backbone**:
   - Integrates the epistemic rigor of \`0.2 Pro\`, the production code precision of \`0.2 Coder\`, and the throughput of \`0.2 Flash\`.
3. **Massive Context Window**:
   - **1,000,000 tokens** of active context for full codebase ingest, complex multi-document synthesis, and long-horizon reasoning.

| Metric | Nixima-0.2O Profile |
| :--- | :--- |
| **Model Classification** | Sovereign Multimodal Omni Engine |
| **Context Window** | **1,000,000 tokens** |
| **Token Latency** | ~18 ms / token (adaptive) |
| **Autonomous Capabilities** | Self-directing DeepThinking & Live Web Search V2 |
| **Credit Multiplier** | 1.8x |`
    };
  }

  if (lower.includes('who are you') || lower.includes('what is nixima') || lower.includes('about')) {
    return {
      thinking,
      response: `I am **Nixima AI**, an autonomous synthetic intelligence powered by the **${model.name}** architecture.

### About Nixima AI
Nixima AI is a next-generation frontier intelligence lab developing hyper-efficient neural architectures, autonomous agent swarms, and high-precision reasoning engines.

- **Current Active Model**: \`${model.name}\` (${model.parameters})
- **Effective Context Window**: ${model.contextWindow}
- **Latency**: ${model.latency}
- **Core Specialization**: ${model.strengths.join(' • ')}

How can I assist your engineering, research, or creative tasks today?`
    };
  }

  if (lower.includes('model') || lower.includes('nixima-0.1') || lower.includes('version')) {
    return {
      thinking,
      response: `You are currently connected to **${model.name}** (${model.badge}).

### Model Specifications
| Parameter | Value |
| :--- | :--- |
| **Architecture** | Mixture-of-Experts (Sparse MoE) |
| **Context Window** | ${model.contextWindow} |
| **Token Throughput** | ${model.latency} |
| **Inference Host** | \`nixima.ai / Cloud Mesh\` |
| **Safety Alignment** | Nixima Constitutional Layer v4 |

> **Tip:** You can switch between **Nixima-0.2O (Omni)**, **Nixima-0.2**, **Nixima-0.2 Pro**, **Nixima-0.2 Coder**, and **Nixima-0.2 Flash** anytime using the model selector in the top navigation bar.`
    };
  }

  // --- CONVERSATIONAL CHART CUSTOMIZATION & ADJUSTMENT TRIGGERS ---

  // Customization: Line to Orange / Orange Theme
  if (lower.includes('orange') || lower.includes('помаранч') || lower.includes('оранжев')) {
    const isLinearOrChart = lower.includes('linear') || lower.includes('line') || lower.includes('ліні') || 
                           lower.includes('графік') || lower.includes('graph') || lower.includes('plot') ||
                           lower.includes('chart') || lower.includes('color') || lower.includes('колір') || lower.includes('змін');
    if (isLinearOrChart) {
      return {
        thinking: `1. Parsing conversational request to restyle visualization with signature Orange theme (#f97316).
2. Setting accentColor to "orange" to match Nixima brand styling and high-contrast dark mode optics.
3. Recalculating vector line gradients and coordinate root highlighting in Cartesian space.`,
        response: `I have updated the visualization with the signature **Nixima Orange** theme (\`#f97316\`), accentuating the vector slope trajectory and coordinate intercepts:

\`\`\`chart
{
  "type": "function",
  "title": "Mathematical Linear Graph f(x) = 2x + 1 (Orange Theme)",
  "subtitle": "Cartesian coordinate plotting with dynamic slope & root telemetry in Nixima Orange",
  "equation": "f(x) = 2x + 1",
  "slope": 2,
  "intercept": 1,
  "xRange": [-10, 10],
  "yRange": [-10, 10],
  "accentColor": "orange",
  "chartSize": "normal"
}
\`\`\`

### Stylistic & Mathematical Telemetry:
- **Vector Theme**: **Nixima Orange** (\`#f97316\`) with luminous gradient glow.
- **Slope ($m = +2$)**: Gradient reflects steep positive ascent.
- **Root**: Real root at $x = -0.5$, crossing the horizontal axis at $(-0.5, 0)$.
- **Y-Intercept**: Point $(0, 1)$ highlighted on the vertical axis.

> **Interactive Customization:** Click the **Tune** (sliders) button above the chart to adjust the slope and intercept in real time, or choose from 6 instant color palettes!`
      };
    }
  }

  // Customization: Make Demographic Pyramid Bigger / Larger
  if ((lower.includes('pyramid') || lower.includes('пірамід')) && 
      (lower.includes('big') || lower.includes('larg') || lower.includes('більш') || lower.includes('expand') || lower.includes('збільш') || lower.includes('розшир'))) {
    return {
      thinking: `1. Receiving operator request to expand demographic pyramid scale and resolution.
2. Setting chartSize to "large" (rendering with taller cohort bars, expanded max-width of 270px, and larger typography).
3. Providing deep 11-cohort demographic breakdown including centenary bracket (90+).
4. Applying vibrant purple/orange high-definition palette.`,
      response: `Here is the **Expanded Large-Scale Demographic Population Pyramid**, rendered with higher resolution, taller cohort bars, and an expanded 11-tier age breakdown:

\`\`\`chart
{
  "type": "pyramid",
  "title": "Expanded Demographic Age Pyramid (High Resolution)",
  "subtitle": "Bilateral male vs. female population cohort distribution (%) at expanded scale",
  "chartSize": "large",
  "accentColor": "purple",
  "pyramidData": [
    { "ageCohort": "90+", "male": 0.6, "female": 1.2 },
    { "ageCohort": "80-89", "male": 2.1, "female": 3.4 },
    { "ageCohort": "70-79", "male": 4.5, "female": 5.8 },
    { "ageCohort": "60-69", "male": 6.8, "female": 7.4 },
    { "ageCohort": "50-59", "male": 8.5, "female": 8.7 },
    { "ageCohort": "40-49", "male": 9.4, "female": 9.2 },
    { "ageCohort": "30-39", "male": 10.1, "female": 9.8 },
    { "ageCohort": "20-29", "male": 10.5, "female": 10.1 },
    { "ageCohort": "10-19", "male": 9.6, "female": 9.1 },
    { "ageCohort": "5-9", "male": 8.9, "female": 8.4 },
    { "ageCohort": "0-4", "male": 8.5, "female": 8.1 }
  ]
}
\`\`\`

### Deep Cohort Structural Analysis:
- **Expanded Scale**: Taller row bars and wider horizontal span allow effortless comparison between adjacent brackets.
- **Top Inversion (Centenary & 80+)**: Female longevity advantage is starkly visible in the $90+$ and $80-89$ cohorts (2:1 female-to-male ratio).
- **Core Productive Bulge**: Age brackets $20-49$ comprise the demographic spine, providing high economic productivity with manageable dependency load.`
    };
  }

  // Customization: Make Demographic Pyramid Smaller / Compact
  if ((lower.includes('pyramid') || lower.includes('пірамід')) && 
      (lower.includes('small') || lower.includes('compact') || lower.includes('менш') || lower.includes('зменш'))) {
    return {
      thinking: `1. Formatting demographic pyramid into compact presentation profile.
2. Setting chartSize to "compact" for space-efficient embedding.`,
      response: `Here is the demographic pyramid rendered in **Compact Mode** for streamlined visual inspection:

\`\`\`chart
{
  "type": "pyramid",
  "title": "Demographic Age Pyramid (Compact)",
  "subtitle": "Male vs. Female cohort balance (%)",
  "chartSize": "compact",
  "accentColor": "cyan",
  "pyramidData": [
    { "ageCohort": "80+", "male": 1.8, "female": 2.5 },
    { "ageCohort": "70-79", "male": 3.2, "female": 4.1 },
    { "ageCohort": "60-69", "male": 5.6, "female": 6.2 },
    { "ageCohort": "50-59", "male": 7.8, "female": 8.1 },
    { "ageCohort": "40-49", "male": 8.9, "female": 8.8 },
    { "ageCohort": "30-39", "male": 9.7, "female": 9.4 },
    { "ageCohort": "20-29", "male": 10.2, "female": 9.8 },
    { "ageCohort": "10-19", "male": 9.8, "female": 9.3 },
    { "ageCohort": "0-9", "male": 9.4, "female": 8.9 }
  ]
}
\`\`\`

The compact profile optimizes screen real estate while retaining cohort symmetry.`
    };
  }

  // Customization: Project Population Forward 10 Years
  if (lower.includes('project forward') || lower.includes('10 years') || lower.includes('прогноз на 10') || 
      lower.includes('forward projection') || (lower.includes('прогноз') && (lower.includes('населенн') || lower.includes('population') || lower.includes('років')))) {
    return {
      thinking: `1. Loading UN Population medium-fertility projection models for 2026–2036.
2. Extending time-series data with milestone projections: 2026 (8.15B), 2030 (8.52B), and 2035 (8.88B).
3. Highlighting deceleration in global net growth rate.`,
      response: `Here is the extended **World Population Trajectory with a 10-Year Forward Projection** through 2035, based on UN medium-fertility forecast models:

\`\`\`chart
{
  "type": "area",
  "title": "World Population Trajectory & 10-Year Forward Projection",
  "subtitle": "Historical census data extended with UN demographic forecasts (in Billions)",
  "unit": "B",
  "xAxisLabel": "Year",
  "yAxisLabel": "Total Population (Billions)",
  "accentColor": "emerald",
  "labels": ["1960", "1975", "1990", "2005", "2020", "2026 (Now)", "2030 (Proj.)", "2035 (Proj.)"],
  "data": [3.03, 4.07, 5.33, 6.54, 7.84, 8.15, 8.52, 8.88]
}
\`\`\`

### 10-Year Forward Projections Analysis:
- **2030 Milestone ($8.52\\text{ B}$)**: Global population is projected to cross 8.5 billion by 2030, driven primarily by growth in Sub-Saharan Africa and Central Asia.
- **2035 Projection ($8.88\\text{ B}$)**: Approaching 8.9 billion mid-decade, though global annual growth rates will have compressed below $0.75\\%$ annually.
- **Peak Demographics**: Current projections suggest peak human population (~$10.3\\text{ B}$) will occur in the late 2080s before stabilizing.`
    };
  }

  // Customization: Rank Highest to Lowest
  if (lower.includes('rank highest') || lower.includes('descending order') || lower.includes('highest to lowest') || 
      lower.includes('відсортуй') || lower.includes('за спаданням')) {
    return {
      thinking: `1. Re-sorting dataset elements in descending order.
2. Recalculating rank indexing and bar distribution.`,
      response: `Here is the data sorted in **strict descending order from highest to lowest**:

\`\`\`chart
{
  "type": "horizontal-bar",
  "title": "Global GDP Rankings (Strict Descending Order)",
  "subtitle": "Ranked from largest to smallest nominal GDP (Trillions USD)",
  "unit": "$T",
  "accentColor": "amber",
  "labels": [
    "United States 🇺🇸",
    "China 🇨🇳",
    "Germany 🇩🇪",
    "Japan 🇯🇵",
    "India 🇮🇳",
    "United Kingdom 🇬🇧",
    "France 🇫🇷",
    "Italy 🇮🇹",
    "Brazil 🇧🇷",
    "Canada 🇨🇦"
  ],
  "data": [28.78, 18.53, 4.59, 4.11, 3.94, 3.50, 3.13, 2.33, 2.33, 2.24]
}
\`\`\`

The dataset has been ordered from highest ($28.78T) to lowest ($2.24T) with rank indices preserved.`
    };
  }

  // 1. GDP Economic Rankings Chart
  if (lower.includes('gdp') || lower.includes('ввп')) {
    return {
      thinking: `1. Aggregating nominal GDP figures from the International Monetary Fund (IMF) and World Bank benchmarks.
2. Formulating high-definition ranked bar visualization with trillions USD metrics.
3. Structuring economic breakdown across North America, Asia, Europe, and emerging economies.`,
      response: `Here is the official ranking and comparison of the world's largest economies by **Nominal Gross Domestic Product (GDP)**:

\`\`\`chart
{
  "type": "horizontal-bar",
  "title": "Top 10 Global Economies by Nominal GDP (2024–2025)",
  "subtitle": "Gross Domestic Product in Trillions USD (IMF & World Bank Benchmarks)",
  "unit": "$T",
  "labels": [
    "United States 🇺🇸",
    "China 🇨🇳",
    "Germany 🇩🇪",
    "Japan 🇯🇵",
    "India 🇮🇳",
    "United Kingdom 🇬🇧",
    "France 🇫🇷",
    "Italy 🇮🇹",
    "Brazil 🇧🇷",
    "Canada 🇨🇦"
  ],
  "data": [28.78, 18.53, 4.59, 4.11, 3.94, 3.50, 3.13, 2.33, 2.33, 2.24]
}
\`\`\`

### Economic Synthesis:
1. **The $20T+ Club**: The United States ($28.78T) and China ($18.53T) together account for over **43% of total global economic output**.
2. **European Engine**: Germany ($4.59T) remains Europe's largest economy, recently surpassing Japan in nominal USD valuation.
3. **Emerging Velocity**: India ($3.94T) is the fastest-growing major economy, currently challenging Japan for the #4 global position.

> **Tip:** You can click **Table** in the chart header above to inspect raw figures, or click **Download SVG** to export this chart.`
    };
  }

  // 2. Population 1960–2020 Area Chart
  if (lower.includes('population') || lower.includes('населенн') || lower.includes('1960')) {
    return {
      thinking: `1. Compiling United Nations Population Division census series from 1960 to 2020.
2. Generating smooth Bézier area trajectory with decade inflection points.
3. Synthesizing demographic transition dynamics and doubling time analysis.`,
      response: `Here is the comprehensive trajectory of **World Population Growth from 1960 to 2020**, based on UN Population Division census data:

\`\`\`chart
{
  "type": "area",
  "title": "World Population Expansion (1960–2020)",
  "subtitle": "Global human population milestones by decade (in Billions)",
  "unit": "B",
  "xAxisLabel": "Decade",
  "yAxisLabel": "Total Population (Billions)",
  "labels": ["1960", "1970", "1980", "1990", "2000", "2010", "2020", "2026 (Est.)"],
  "data": [3.03, 3.70, 4.46, 5.33, 6.14, 6.96, 7.84, 8.12]
}
\`\`\`

### Demographic Trajectory Highlights:
- **Doubling Epoch**: Global population more than doubled in just 40 years, soaring from **3.03 Billion** in 1960 to **6.14 Billion** in 2000.
- **Current Milestone**: Reached **7.84 Billion** in 2020, and currently exceeds **8.12 Billion** in 2026.
- **Growth Rate Curve**: Peak annual percentage growth occurred around 1968 (~2.1% per year) and has since gradually decelerated toward ~0.8% annually.`
    };
  }

  // 3. Demographic Population Age Pyramid
  if (lower.includes('pyramid') || lower.includes('пірамід')) {
    return {
      thinking: `1. Loading bilateral demographic cohort data across 9 age brackets (0-9 to 80+).
2. Generating symmetrical back-to-back horizontal bar visualization (Male left vs. Female right).
3. Analyzing age dependency ratio and structural population distribution.`,
      response: `Here is the demographic **Population Age Pyramid**, illustrating sex and age cohort distribution:

\`\`\`chart
{
  "type": "pyramid",
  "title": "Demographic Population Age Pyramid",
  "subtitle": "Symmetrical male vs. female population distribution across age cohorts (%)",
  "pyramidData": [
    { "ageCohort": "80+", "male": 1.8, "female": 2.5 },
    { "ageCohort": "70-79", "male": 3.2, "female": 4.1 },
    { "ageCohort": "60-69", "male": 5.6, "female": 6.2 },
    { "ageCohort": "50-59", "male": 7.8, "female": 8.1 },
    { "ageCohort": "40-49", "male": 8.9, "female": 8.8 },
    { "ageCohort": "30-39", "male": 9.7, "female": 9.4 },
    { "ageCohort": "20-29", "male": 10.2, "female": 9.8 },
    { "ageCohort": "10-19", "male": 9.8, "female": 9.3 },
    { "ageCohort": "0-9", "male": 9.4, "female": 8.9 }
  ]
}
\`\`\`

### Demographic Pyramid Interpretation:
- **Base vs. Peak**: The broad workforce middle (20–49) indicates high productive capacity with low youth dependency.
- **Sex Ratio Balance**: Near parity throughout childhood and working ages, with greater female longevity in older cohorts ($70+$ and $80+$).
- **Classification**: Displays the classic profile of an economically mature population transitioning into longevity expansion.`
    };
  }

  // 4. Mathematical Linear Function Plotter
  if (lower.includes('linear') || lower.includes('лінійн') || lower.includes('graph') || lower.includes('графік') || lower.includes('plot') || lower.includes('функці') || lower.includes('chart') || lower.includes('діаграм')) {
    return {
      thinking: `1. Initializing Cartesian 2D coordinate system with origin (0, 0).
2. Formulating linear equation f(x) = 2x + 1 with slope m = 2 and y-intercept b = 1.
3. Calculating critical points: Root at x = -0.5, Y-intercept at (0, 1).
4. Generating interactive vector coordinate canvas.`,
      response: `Here is the interactive mathematical visualization of the linear equation **$f(x) = 2x + 1$** plotted across a 2D Cartesian plane:

\`\`\`chart
{
  "type": "function",
  "title": "Mathematical Linear Graph f(x) = 2x + 1",
  "subtitle": "Cartesian coordinate plotting with dynamic slope & root calculation",
  "equation": "f(x) = 2x + 1",
  "slope": 2,
  "intercept": 1,
  "xRange": [-10, 10],
  "yRange": [-10, 10]
}
\`\`\`

### Mathematical Analysis:
- **Slope-Intercept Form**:
  $$f(x) = mx + b \implies f(x) = 2x + 1$$
- **Slope ($m = +2$)**: For every $1$ unit increase in $x$, $y$ increases by $2$ units (steep positive gradient).
- **Y-Intercept ($b = 1$)**: The graph crosses the vertical axis at point **$(0, 1)$**.
- **Root ($x$-intercept)**: Setting $f(x) = 0$:
  $$2x + 1 = 0 \implies 2x = -1 \implies x = -0.5$$
  The graph crosses the horizontal axis at **$(-0.5, 0)$**.

> **Interactive Feature:** Move your cursor across the graph canvas above to inspect exact $(x, y)$ coordinates in real-time!`
    };
  }

  // Specialized Game & Interactive Canvas Architecture (CyberSnake Neon & Arcade)
  if (
    lower.includes('snake') ||
    lower.includes('змійк') ||
    ((lower.includes('game') || lower.includes('гру') || lower.includes('гра')) &&
      (lower.includes('html') || lower.includes('canvas') || lower.includes('канвас') || lower.includes('створи') || lower.includes('make') || lower.includes('build') || lower.includes('код') || lower.includes('code') || lower.includes('напиши')))
  ) {
    const isUk = /[а-яіїєґ]/i.test(prompt);
    return {
      thinking: `### 1. Game Mechanics & State Machine Architecture
- Grid Coordinates & Frame Budget: 20x20 cell topology on a 400x400 display canvas. 60 FPS requestAnimationFrame loop with a 105ms step accumulator.
- Invariants & Collision Geometry: Wall boundary wrapping option / barrier collision, self-intersecting tail check via Array.some(), and deterministic random food generation excluding active snake body coordinates.
- State Machine: States: 'MENU', 'PLAYING', 'PAUSED', 'GAMEOVER' with smooth state transitions.

### 2. Modern Visual Aesthetics & Web Audio Engineering
- Dark Neon Cyberpunk Palette: Deep obsidian backdrop (#0b0f19), emerald glowing snake (#10b981 / #34d399), pulsing cyan plasma food (#06b6d4), and particle explosion system on pickup.
- Web Audio API Synthesizer: Pure procedural sound synthesis with zero external dependencies:
  * Food pickup: dual-stage sine oscillator frequency ramp (440Hz -> 880Hz).
  * Direction change: subtle mechanical click (140Hz triangle chirp).
  * Game Over: descending low-pass pitch slide (320Hz -> 60Hz).
- Dual Control Matrix: Responsive keyboard bindings (WASD + Arrow keys + Space for pause) and integrated touch D-pad for mobile/tablet sandboxes.

### 3. Zero-Laziness Verification & Full Implementation Audit
- 100% complete, runnable, production-grade code written without omissions or placeholders.
- Verified for immediate interactive execution inside Nixima Canvas Studio.`,
      response: isUk ? `Ось повністю реалізована, сучасна гра **CyberSnake Neon 2026**, створена на базі **Nixima-0.3 Coder** за стандартами **DeepThinking V2.1**:

### Особливості гри:
1. **Неонова естетика та партикли**: Світіння змійки (\`#10b981\`), пульсуюча енергетична їжа (\`#06b6d4\`) та система спалахів частинок (particles) при поїданні.
2. **Синтез звуку через Web Audio API**: Процедурні аудіоефекти (збір їжі, кроки, Game Over) без зовнішніх файлів.
3. **Подвійне керування**: Клавіатура (Стрілки / \`WASD\` / \`Space\` для паузи) + зручний сенсорний D-pad для телефонів.
4. **Повна реалізація (Zero-Laziness)**: Жодних плейсхолдерів чи скорочень — код на 100% робочий та готовий до запуску.

\`\`\`html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberSnake Neon 2026</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }
    body {
      background: radial-gradient(circle at center, #111827 0%, #030712 100%);
      color: #f3f4f6;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
      overflow-x: hidden;
    }
    .game-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 35px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 20px;
      backdrop-filter: blur(12px);
      max-width: 440px;
      width: 100%;
    }
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .title-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-badge {
      background: #10b981;
      color: #030712;
      font-weight: 900;
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 6px;
      letter-spacing: 1px;
    }
    .title {
      font-size: 18px;
      font-weight: 800;
      background: linear-gradient(135deg, #34d399, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .scoreboard {
      display: flex;
      gap: 12px;
    }
    .score-chip {
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 10px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 12px;
      text-align: right;
    }
    .score-chip span {
      color: #9ca3af;
      font-size: 10px;
      display: block;
    }
    .score-chip b {
      color: #10b981;
      font-size: 14px;
    }
    .canvas-wrapper {
      position: relative;
      width: 400px;
      height: 400px;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(16, 185, 129, 0.25);
      background: #060913;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(4px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 10;
      transition: opacity 0.2s ease;
    }
    .overlay.hidden {
      display: none;
    }
    .overlay h2 {
      font-size: 24px;
      font-weight: 800;
      color: #34d399;
      text-shadow: 0 0 12px rgba(52, 211, 153, 0.5);
    }
    .overlay p {
      font-size: 13px;
      color: #9ca3af;
      text-align: center;
      max-width: 260px;
    }
    .btn {
      background: #10b981;
      color: #04100b;
      border: none;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: #34d399;
      transform: translateY(-1px);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
    }
    .btn:active {
      transform: translateY(1px);
    }
    .controls-hint {
      margin-top: 14px;
      font-size: 11px;
      color: #6b7280;
      font-family: monospace;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .d-pad {
      display: grid;
      grid-template-columns: repeat(3, 44px);
      grid-template-rows: repeat(3, 44px);
      gap: 6px;
      margin-top: 14px;
    }
    .d-btn {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.1s ease;
    }
    .d-btn:active {
      background: #10b981;
      color: #030712;
      box-shadow: 0 0 10px #10b981;
    }
    .d-up { grid-column: 2; grid-row: 1; }
    .d-left { grid-column: 1; grid-row: 2; }
    .d-down { grid-column: 2; grid-row: 2; }
    .d-right { grid-column: 3; grid-row: 2; }
  </style>
</head>
<body>

  <div class="game-container">
    <div class="header">
      <div class="title-box">
        <span class="logo-badge">0.3</span>
        <span class="title">CYBERSNAKE</span>
      </div>
      <div class="scoreboard">
        <div class="score-chip">
          <span>SCORE</span>
          <b id="scoreVal">0</b>
        </div>
        <div class="score-chip">
          <span>BEST</span>
          <b id="bestVal">0</b>
        </div>
      </div>
    </div>

    <div class="canvas-wrapper">
      <canvas id="gameCanvas" width="400" height="400"></canvas>
      
      <div id="startOverlay" class="overlay">
        <h2>CYBERSNAKE</h2>
        <p>Керуйте неоновою змійкою за допомогою Стрілок, WASD або кнопок на екрані.</p>
        <button id="startBtn" class="btn">ПОЧАТИ ГРУ</button>
      </div>

      <div id="gameOverOverlay" class="overlay hidden">
        <h2 style="color: #ef4444; text-shadow: 0 0 12px rgba(239, 68, 68, 0.5);">GAME OVER</h2>
        <p id="finalScoreText">Рахунок: 0</p>
        <button id="restartBtn" class="btn">СПРОБУВАТИ ЗНОВУ</button>
      </div>
    </div>

    <div class="controls-hint">
      <span>WASD / Стрілки: Рух</span>
      <span>•</span>
      <span>Пробіл: Пауза</span>
    </div>

    <!-- On-screen touch D-Pad for mobile & Canvas interactions -->
    <div class="d-pad">
      <button class="d-btn d-up" id="btnUp">▲</button>
      <button class="d-btn d-left" id="btnLeft">◀</button>
      <button class="d-btn d-down" id="btnDown">▼</button>
      <button class="d-btn d-right" id="btnRight">▶</button>
    </div>
  </div>

  <script>
    // Audio Synthesizer via Web Audio API (Zero External Assets)
    class SoundEngine {
      constructor() {
        this.ctx = null;
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      playEat() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
      playMove() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
      playCrash() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    }

    const sound = new SoundEngine();

    // Particle System
    class ParticleSystem {
      constructor() {
        this.particles = [];
      }
      burst(x, y, color = '#34d399') {
        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1.5;
          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            size: Math.random() * 3.5 + 1.5,
            color
          });
        }
      }
      update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.03;
          p.size *= 0.96;
          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          }
        }
      }
      draw(ctx) {
        ctx.save();
        for (const p of this.particles) {
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const particles = new ParticleSystem();

    const GRID_SIZE = 20;
    const CELL_COUNT = 20; // 400 / 20 = 20
    const STEP_INTERVAL = 105; // ms per move

    let snake = [];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = { x: 15, y: 10 };
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('cybersnake_best') || '0', 10);
    let state = 'MENU'; // 'MENU' | 'PLAYING' | 'GAMEOVER' | 'PAUSED'
    let lastStepTime = 0;

    document.getElementById('bestVal').innerText = bestScore;

    function spawnFood() {
      let valid = false;
      while (!valid) {
        food = {
          x: Math.floor(Math.random() * CELL_COUNT),
          y: Math.floor(Math.random() * CELL_COUNT)
        };
        valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
      }
    }

    function initGame() {
      snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      document.getElementById('scoreVal').innerText = score;
      spawnFood();
      state = 'PLAYING';
      document.getElementById('startOverlay').classList.add('hidden');
      document.getElementById('gameOverOverlay').classList.add('hidden');
      lastStepTime = performance.now();
    }

    function setDirection(x, y) {
      if (state !== 'PLAYING') return;
      if (x !== 0 && dir.x !== 0) return; // Prevent 180 reverse
      if (y !== 0 && dir.y !== 0) return;
      nextDir = { x, y };
      sound.playMove();
    }

    // Keyboard bindings
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        setDirection(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        setDirection(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        setDirection(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        setDirection(1, 0);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (state === 'PLAYING') state = 'PAUSED';
        else if (state === 'PAUSED') state = 'PLAYING';
      }
    });

    // Touch D-Pad bindings
    document.getElementById('btnUp').onclick = () => setDirection(0, -1);
    document.getElementById('btnDown').onclick = () => setDirection(0, 1);
    document.getElementById('btnLeft').onclick = () => setDirection(-1, 0);
    document.getElementById('btnRight').onclick = () => setDirection(1, 0);

    document.getElementById('startBtn').onclick = initGame;
    document.getElementById('restartBtn').onclick = initGame;

    function update() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
        handleGameOver();
        return;
      }

      // Self collision
      if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        handleGameOver();
        return;
      }

      snake.unshift(head);

      // Food collection
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('scoreVal').innerText = score;
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem('cybersnake_best', bestScore);
          document.getElementById('bestVal').innerText = bestScore;
        }
        sound.playEat();
        particles.burst(food.x * GRID_SIZE + 10, food.y * GRID_SIZE + 10, '#06b6d4');
        spawnFood();
      } else {
        snake.pop();
      }
    }

    function handleGameOver() {
      state = 'GAMEOVER';
      sound.playCrash();
      document.getElementById('finalScoreText').innerText = 'Підсумковий рахунок: ' + score;
      document.getElementById('gameOverOverlay').classList.remove('hidden');
    }

    function draw() {
      // Clear background with soft gradient
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Food (Pulsing glowing orb)
      const now = performance.now();
      const pulse = Math.sin(now / 180) * 2;
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14 + pulse;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2.6 + pulse * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Draw Snake
      snake.forEach((seg, i) => {
        ctx.save();
        const isHead = i === 0;
        ctx.shadowColor = isHead ? '#10b981' : '#059669';
        ctx.shadowBlur = isHead ? 16 : 8;
        ctx.fillStyle = isHead ? '#34d399' : '#10b981';

        const radius = isHead ? 6 : 4;
        const x = seg.x * GRID_SIZE + 1.5;
        const y = seg.y * GRID_SIZE + 1.5;
        const w = GRID_SIZE - 3;
        const h = GRID_SIZE - 3;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();

        // Eyes for the head
        if (isHead) {
          ctx.fillStyle = '#022c22';
          const eyeOffset = 4;
          const eyeSize = 2.5;
          let eyeX1 = x + 5, eyeY1 = y + 5;
          let eyeX2 = x + 11, eyeY2 = y + 5;
          if (dir.y === 1) { eyeY1 = y + 11; eyeY2 = y + 11; }
          if (dir.x === 1) { eyeX1 = x + 11; eyeX2 = x + 11; eyeY1 = y + 5; eyeY2 = y + 11; }
          if (dir.x === -1) { eyeX1 = x + 5; eyeX2 = x + 5; eyeY1 = y + 5; eyeY2 = y + 11; }
          ctx.beginPath();
          ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
          ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Update & Draw particles
      particles.update();
      particles.draw(ctx);
    }

    function gameLoop(time) {
      if (state === 'PLAYING' && time - lastStepTime > STEP_INTERVAL) {
        update();
        lastStepTime = time;
      }
      draw();
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  </script>
</body>
</html>
\`\`\`

> **Nixima Canvas**: Ви можете натиснути кнопку **[ ⛶ Відкрити у Canvas ]** над блоком коду, щоб миттєво запустити та грати у гру в інтерактивній пісочниці поруч із чатом!` : `Here is the complete, high-fidelity **CyberSnake Neon 2026** interactive web application engineered by **Nixima-0.3 Coder** under the **DeepThinking V2.1** standard:

### Architectural Highlights:
1. **Modern Neon Aesthetics & Particle System**: Emerald snake body (\`#10b981\`), pulsing cyan plasma food (\`#06b6d4\`), and real-time particle emitter on eating.
2. **Pure Web Audio API Sound Engine**: Procedural sound synthesis (food pickup chirp, subtle direction change tick, crash distortion) with zero external asset dependencies.
3. **Dual-Control Matrix**: Smooth keyboard bindings (WASD / Arrows / Space to pause) + on-screen touch D-pad for mobile and tablet testing.
4. **Strict Zero-Laziness Implementation**: 100% complete, production-ready, runnable code block with zero placeholders.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberSnake Neon 2026</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }
    body {
      background: radial-gradient(circle at center, #111827 0%, #030712 100%);
      color: #f3f4f6;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
      overflow-x: hidden;
    }
    .game-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 35px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 20px;
      backdrop-filter: blur(12px);
      max-width: 440px;
      width: 100%;
    }
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .title-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-badge {
      background: #10b981;
      color: #030712;
      font-weight: 900;
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 6px;
      letter-spacing: 1px;
    }
    .title {
      font-size: 18px;
      font-weight: 800;
      background: linear-gradient(135deg, #34d399, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .scoreboard {
      display: flex;
      gap: 12px;
    }
    .score-chip {
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 10px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 12px;
      text-align: right;
    }
    .score-chip span {
      color: #9ca3af;
      font-size: 10px;
      display: block;
    }
    .score-chip b {
      color: #10b981;
      font-size: 14px;
    }
    .canvas-wrapper {
      position: relative;
      width: 400px;
      height: 400px;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(16, 185, 129, 0.25);
      background: #060913;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(4px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 10;
      transition: opacity 0.2s ease;
    }
    .overlay.hidden {
      display: none;
    }
    .overlay h2 {
      font-size: 24px;
      font-weight: 800;
      color: #34d399;
      text-shadow: 0 0 12px rgba(52, 211, 153, 0.5);
    }
    .overlay p {
      font-size: 13px;
      color: #9ca3af;
      text-align: center;
      max-width: 260px;
    }
    .btn {
      background: #10b981;
      color: #04100b;
      border: none;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: #34d399;
      transform: translateY(-1px);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
    }
    .btn:active {
      transform: translateY(1px);
    }
    .controls-hint {
      margin-top: 14px;
      font-size: 11px;
      color: #6b7280;
      font-family: monospace;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .d-pad {
      display: grid;
      grid-template-columns: repeat(3, 44px);
      grid-template-rows: repeat(3, 44px);
      gap: 6px;
      margin-top: 14px;
    }
    .d-btn {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.1s ease;
    }
    .d-btn:active {
      background: #10b981;
      color: #030712;
      box-shadow: 0 0 10px #10b981;
    }
    .d-up { grid-column: 2; grid-row: 1; }
    .d-left { grid-column: 1; grid-row: 2; }
    .d-down { grid-column: 2; grid-row: 2; }
    .d-right { grid-column: 3; grid-row: 2; }
  </style>
</head>
<body>

  <div class="game-container">
    <div class="header">
      <div class="title-box">
        <span class="logo-badge">0.3</span>
        <span class="title">CYBERSNAKE</span>
      </div>
      <div class="scoreboard">
        <div class="score-chip">
          <span>SCORE</span>
          <b id="scoreVal">0</b>
        </div>
        <div class="score-chip">
          <span>BEST</span>
          <b id="bestVal">0</b>
        </div>
      </div>
    </div>

    <div class="canvas-wrapper">
      <canvas id="gameCanvas" width="400" height="400"></canvas>
      
      <div id="startOverlay" class="overlay">
        <h2>CYBERSNAKE</h2>
        <p>Control the neon snake using Arrow keys, WASD, or on-screen touch buttons.</p>
        <button id="startBtn" class="btn">START GAME</button>
      </div>

      <div id="gameOverOverlay" class="overlay hidden">
        <h2 style="color: #ef4444; text-shadow: 0 0 12px rgba(239, 68, 68, 0.5);">GAME OVER</h2>
        <p id="finalScoreText">Final Score: 0</p>
        <button id="restartBtn" class="btn">PLAY AGAIN</button>
      </div>
    </div>

    <div class="controls-hint">
      <span>WASD / Arrows: Move</span>
      <span>•</span>
      <span>Space: Pause</span>
    </div>

    <!-- On-screen touch D-Pad for mobile & Canvas interactions -->
    <div class="d-pad">
      <button class="d-btn d-up" id="btnUp">▲</button>
      <button class="d-btn d-left" id="btnLeft">◀</button>
      <button class="d-btn d-down" id="btnDown">▼</button>
      <button class="d-btn d-right" id="btnRight">▶</button>
    </div>
  </div>

  <script>
    // Audio Synthesizer via Web Audio API (Zero External Assets)
    class SoundEngine {
      constructor() {
        this.ctx = null;
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      playEat() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
      playMove() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
      playCrash() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    }

    const sound = new SoundEngine();

    // Particle System
    class ParticleSystem {
      constructor() {
        this.particles = [];
      }
      burst(x, y, color = '#34d399') {
        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1.5;
          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            size: Math.random() * 3.5 + 1.5,
            color
          });
        }
      }
      update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.03;
          p.size *= 0.96;
          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          }
        }
      }
      draw(ctx) {
        ctx.save();
        for (const p of this.particles) {
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const particles = new ParticleSystem();

    const GRID_SIZE = 20;
    const CELL_COUNT = 20;
    const STEP_INTERVAL = 105;

    let snake = [];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = { x: 15, y: 10 };
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('cybersnake_best') || '0', 10);
    let state = 'MENU';
    let lastStepTime = 0;

    document.getElementById('bestVal').innerText = bestScore;

    function spawnFood() {
      let valid = false;
      while (!valid) {
        food = {
          x: Math.floor(Math.random() * CELL_COUNT),
          y: Math.floor(Math.random() * CELL_COUNT)
        };
        valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
      }
    }

    function initGame() {
      snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      document.getElementById('scoreVal').innerText = score;
      spawnFood();
      state = 'PLAYING';
      document.getElementById('startOverlay').classList.add('hidden');
      document.getElementById('gameOverOverlay').classList.add('hidden');
      lastStepTime = performance.now();
    }

    function setDirection(x, y) {
      if (state !== 'PLAYING') return;
      if (x !== 0 && dir.x !== 0) return;
      if (y !== 0 && dir.y !== 0) return;
      nextDir = { x, y };
      sound.playMove();
    }

    // Keyboard bindings
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        setDirection(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        setDirection(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        setDirection(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        setDirection(1, 0);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (state === 'PLAYING') state = 'PAUSED';
        else if (state === 'PAUSED') state = 'PLAYING';
      }
    });

    // Touch D-Pad bindings
    document.getElementById('btnUp').onclick = () => setDirection(0, -1);
    document.getElementById('btnDown').onclick = () => setDirection(0, 1);
    document.getElementById('btnLeft').onclick = () => setDirection(-1, 0);
    document.getElementById('btnRight').onclick = () => setDirection(1, 0);

    document.getElementById('startBtn').onclick = initGame;
    document.getElementById('restartBtn').onclick = initGame;

    function update() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
        handleGameOver();
        return;
      }

      // Self collision
      if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        handleGameOver();
        return;
      }

      snake.unshift(head);

      // Food collection
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('scoreVal').innerText = score;
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem('cybersnake_best', bestScore);
          document.getElementById('bestVal').innerText = bestScore;
        }
        sound.playEat();
        particles.burst(food.x * GRID_SIZE + 10, food.y * GRID_SIZE + 10, '#06b6d4');
        spawnFood();
      } else {
        snake.pop();
      }
    }

    function handleGameOver() {
      state = 'GAMEOVER';
      sound.playCrash();
      document.getElementById('finalScoreText').innerText = 'Final Score: ' + score;
      document.getElementById('gameOverOverlay').classList.remove('hidden');
    }

    function draw() {
      // Clear background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Food (Pulsing glowing orb)
      const now = performance.now();
      const pulse = Math.sin(now / 180) * 2;
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14 + pulse;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2.6 + pulse * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Draw Snake
      snake.forEach((seg, i) => {
        ctx.save();
        const isHead = i === 0;
        ctx.shadowColor = isHead ? '#10b981' : '#059669';
        ctx.shadowBlur = isHead ? 16 : 8;
        ctx.fillStyle = isHead ? '#34d399' : '#10b981';

        const radius = isHead ? 6 : 4;
        const x = seg.x * GRID_SIZE + 1.5;
        const y = seg.y * GRID_SIZE + 1.5;
        const w = GRID_SIZE - 3;
        const h = GRID_SIZE - 3;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();

        // Eyes for the head
        if (isHead) {
          ctx.fillStyle = '#022c22';
          const eyeOffset = 4;
          const eyeSize = 2.5;
          let eyeX1 = x + 5, eyeY1 = y + 5;
          let eyeX2 = x + 11, eyeY2 = y + 5;
          if (dir.y === 1) { eyeY1 = y + 11; eyeY2 = y + 11; }
          if (dir.x === 1) { eyeX1 = x + 11; eyeX2 = x + 11; eyeY1 = y + 5; eyeY2 = y + 11; }
          if (dir.x === -1) { eyeX1 = x + 5; eyeX2 = x + 5; eyeY1 = y + 5; eyeY2 = y + 11; }
          ctx.beginPath();
          ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
          ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Update & Draw particles
      particles.update();
      particles.draw(ctx);
    }

    function gameLoop(time) {
      if (state === 'PLAYING' && time - lastStepTime > STEP_INTERVAL) {
        update();
        lastStepTime = time;
      }
      draw();
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  </script>
</body>
</html>
\`\`\`

> **Nixima Canvas**: You can click the **[ ⛶ Open in Canvas ]** button on top of the code block above to instantly launch and play this game in the interactive sandbox next to the chat!`
    };
  }

  if (lower.includes('code') || lower.includes('python') || lower.includes('react') || lower.includes('rust') || lower.includes('function') || lower.includes('script')) {
    return {
      thinking,
      response: `Here is a high-performance implementation designed according to **Nixima AI** production standards:

\`\`\`typescript
/**
 * Nixima AI Streaming Mesh Client
 * Low-latency concurrent pipeline runner
 */
interface MeshNode {
  id: string;
  weight: number;
  active: boolean;
}

export class NiximaMesh {
  private nodes: Map<string, MeshNode> = new Map();

  constructor(public readonly model: string = "${model.id}") {
    console.log(\`[Nixima Mesh] Initialized with model: \${this.model}\`);
  }

  public register(nodeId: string, weight: number = 1.0): void {
    this.nodes.set(nodeId, { id: nodeId, weight, active: true });
  }

  public async dispatch<T, R>(payload: T, transform: (data: T) => Promise<R>): Promise<R> {
    const startTime = performance.now();
    const result = await transform(payload);
    const latency = performance.now() - startTime;
    console.log(\`[Nixima Core] Executed in \${latency.toFixed(2)}ms\`);
    return result;
  }
}
\`\`\`

### Key Architectural Highlights:
1. **Zero-overhead allocation**: Keeps hot execution paths lean.
2. **Deterministic dispatch**: Benchmarked for multi-million token continuous streams.
3. **Telemetry native**: Integrated with Nixima's real-time diagnostic mesh.

Would you like me to tailor this for a specific runtime or add distributed worker support?`
    };
  }

  if (lower.includes('math') || lower.includes('latex') || lower.includes('formula') || lower.includes('equation') || lower.includes('integral') || lower.includes('calculus') || lower.includes('euler') || lower.includes('bayes') || lower.includes('формул') || lower.includes('математ')) {
    return {
      thinking: `1. Parsing mathematical syntax and symbolic ontology.
2. Formulating closed-form expressions across classical analysis, quantum mechanics, and neural information theory.
3. Verifying LaTeX typesetting compliance with KaTeX standards.
4. Synthesizing step-by-step mathematical rationale with dual display ($$...$$) and inline ($...$) notation.`,
      response: `Here are foundational mathematical formulations rendered with high-precision **LaTeX** typesetting:

### 1. Euler's Identity (The Most Beautiful Equation)
Euler's identity connects five of the most fundamental constants in mathematics ($e$, $i$, $\pi$, $1$, and $0$):

$$e^{i\pi} + 1 = 0$$

Derived from Euler's general formula for any angle $\theta \in \mathbb{R}$:

$$e^{i\theta} = \cos \theta + i \sin \theta$$

---

### 2. Gaussian Probability Integral
In probability theory and statistical physics, the continuous normalization integral across the entire real line is:

$$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$$

For a general normal distribution $\mathcal{N}(\mu, \sigma^2)$ with probability density function $f(x)$:

$$f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)$$

---

### 3. Time-Dependent Schrödinger Equation
In quantum mechanics, the dynamical evolution of a quantum state wavefunction $\Psi(\mathbf{r}, t)$ governed by the Hamiltonian operator $\hat{H}$ is:

$$i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \left[ -\frac{\hbar^2}{2m} \nabla^2 + V(\mathbf{r}, t) \right] \Psi(\mathbf{r}, t)$$

---

### 4. Machine Learning: Cross-Entropy Loss & Softmax
In deep neural networks, given true label distributions $y \in \{0, 1\}^K$ and logit activations $z \in \mathbb{R}^K$:

$$\hat{y}_k = \frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}, \quad \mathcal{L}_{\text{CE}} = -\sum_{k=1}^K y_k \ln \hat{y}_k$$

---

### Mathematical Specifications Matrix
| Domain | Theorem / Law | Governing Equation | Convergence / Bound |
| :--- | :--- | :--- | :---: |
| **Complex Analysis** | Euler's Formula | $e^{i\theta} = \cos\theta + i\sin\theta$ | Exact |
| **Probability** | Bayes' Rule | $P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}$ | $P(B) > 0$ |
| **Electrodynamics** | Gauss's Law | $\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$ | Continuous |
| **Information** | Shannon Entropy | $H(X) = -\sum_{x} P(x) \log_2 P(x)$ | $H(X) \ge 0$ |

> **Tip:** You can click the **Copy LaTeX** button on the top right of any formula card above to copy the raw LaTeX source directly to your clipboard!`
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      thinking,
      response: `Hello! I am **Nixima AI**, operating on **${model.name}**. 

I am ready to help you with:
- **Architecture & System Design**: Scalable infrastructure, algorithms, and distributed systems.
- **Full-Stack Development**: Modern React, TypeScript, Rust, Python, and API development.
- **Deep Scientific & Mathematical Reasoning**: Research breakdown, papers, and complex logic.
- **Strategic Ideation**: Company strategy, technical roadmaps, and execution plans.

What would you like to explore today?`
    };
  }

  // Fallback rich dynamic response
  return {
    thinking,
    response: `### Response from ${model.name}

Regarding your query:
> *"${prompt}"*

Here is the breakdown analyzed through the **Nixima AI** reasoning matrix:

1. **Core Premise & Architecture**:
   Addressing this effectively requires structuring the problem into decoupled, verifiable components. With \`${model.name}\`, context integrity is preserved across deep execution steps.

2. **Synthesis & Strategic Direction**:
   - **Precision**: Focus on deterministic outcomes and edge-case mitigation.
   - **Scalability**: Design for elastic growth without introducing unnecessary cognitive overhead.
   - **Execution**: Iterate rapidly with tight feedback loops.

\`\`\`bash
# Run validation via Nixima CLI
$ nixima-cli evaluate --model ${model.id} --target ./workspace
[OK] Latency: 22ms | Memory: 412MB | Status: OPTIMAL
\`\`\`

Let me know if you would like me to drill down further into any specific aspect!`
  };
}
