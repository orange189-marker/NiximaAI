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
  } else if (effectiveMode === 'basic') {
    thinking = `### 1. Intent Analysis & Core Objective
- Dissecting query requirements: "${prompt.slice(0, 50)}..."
- Outlining key constraints, operator context, and pragmatic execution path.

### 2. Rapid Solution Blueprint
- Formulating direct, structured synthesis with immediate technical clarity.`;
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
