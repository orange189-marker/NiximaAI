import { BenchmarkSuite, ModelLeaderboardEntry } from '../types/benchmark';

export const BENCHMARK_LEADERBOARD: ModelLeaderboardEntry[] = [
  // =========================================================================
  // GENERATION 0.3 — NEXT-GEN SOVEREIGN FRONTIER FLEET
  // =========================================================================
  {
    modelId: 'nixima-0.3-pro',
    rank: 1,
    overallScore: 99.9,
    eloRating: 1995,
    winRate: 99.4,
    primaryBadge: 'ULTRATHINKING V2.0 PINNACLE',
    summaryEn: 'The undisputed sovereign pinnacle of high-order synthetic reasoning powered by UltraThinking V2.0. Conducts exhaustive dialectical quantum struggle, multi-hypothesis theorem trees, and adversarial falsification across a 2.5M continuous context window.',
    summaryUk: 'Беззаперечна суверенна вершина синтетичного мислення високого порядку на базі UltraThinking V2.0. Здійснює виснажливу діалектичну квантову боротьбу, дерева гіпотез і фальсифікацію контраргументів у 2.5M контексті.',
    recommendedForEn: 'Ultra-hard epistemic reasoning, formal mathematical proofs, complex systems verification, adversarial red-teaming, scientific discoveries.',
    recommendedForUk: 'Надскладні логічні виведення, формальні математичні доведення, верифікація критичних систем, фальсифікація гіпотез, фундаментальна наука.',
    metrics: {
      mathAndLogic: 100,
      codingAndEngineering: 99,
      systemArchitecture: 99,
      scientificSynthesis: 100,
      throughputSpeed: 82,
      costEfficiency: 80,
    }
  },
  {
    modelId: 'nixima-0.3-omni',
    rank: 2,
    overallScore: 99.7,
    eloRating: 1980,
    winRate: 99.1,
    primaryBadge: 'OMNI SOVEREIGN V2 SWARM',
    summaryEn: 'Autonomous all-in-one multimodal synthetic intelligence combining instant epistemic reasoning, production systems engineering, and live 7-cluster web synthesis with zero manual toggles. Massive 3M context with adaptive hyper-throughput.',
    summaryUk: 'Автономний мультимодальний інтелект все-в-одному, що поєднує миттєві епістемічні міркування, інженерію виробничих систем та живий синтез 7 кластерів веб-мережі без ручних перемикачів. Колосальний 3M контекст.',
    recommendedForEn: 'Autonomous web synthesis, unified multimodal reasoning, cross-domain architecture, self-directing workflows.',
    recommendedForUk: 'Автономний веб-синтез, мультимодальні міркування, міждоменна системна архітектура, самокеровані робочі процеси.',
    metrics: {
      mathAndLogic: 99,
      codingAndEngineering: 99,
      systemArchitecture: 100,
      scientificSynthesis: 100,
      throughputSpeed: 97,
      costEfficiency: 91,
    }
  },
  {
    modelId: 'nixima-0.3-coder',
    rank: 3,
    overallScore: 99.5,
    eloRating: 1965,
    winRate: 98.8,
    primaryBadge: '0.3 TITAN CODER & DESIGN ARCHITECT',
    summaryEn: 'The definitive next-generation coding and interactive application engine powered by DeepThinking V2.1. Engineered with zero thinking laziness, delivering complete runnable code, modern neon aesthetics, 60 FPS physics loops, and pure Web Audio sound synthesis.',
    summaryUk: 'Флагманська модель покоління 0.3 для розробки коду та інтерактивних додатків на базі DeepThinking V2.1. Повна відсутність лінощів мислення, 100% завершений робочий код, неонова естетика дизайну, анімації 60 FPS та синтез звуку через Web Audio API.',
    recommendedForEn: 'Production software architecture, interactive games with canvas, aesthetic UI design, zero-laziness code, Web Audio synthesis, algorithms & concurrency.',
    recommendedForUk: 'Архітектура програмного забезпечення, інтерактивні ігри на canvas, естетичний UI дизайн, код без скорочень, синтез звуку Web Audio, алгоритми та асинхронність.',
    metrics: {
      mathAndLogic: 98,
      codingAndEngineering: 100,
      systemArchitecture: 100,
      scientificSynthesis: 96,
      throughputSpeed: 93,
      costEfficiency: 90,
    }
  },
  {
    modelId: 'nixima-0.3',
    rank: 4,
    overallScore: 99.3,
    eloRating: 1950,
    winRate: 98.2,
    primaryBadge: '0.3 PRIME FLAGSHIP SOVEREIGN',
    summaryEn: 'Next-generation sovereign flagship general synthetic intelligence. Features Quantum Rotary Attention (QRA-v3), multi-perspective dialectic synthesis, 2,000,000 continuous context, and zero-hallucination semantic anchoring.',
    summaryUk: 'Суверенний флагман загального синтетичного інтелекту нового покоління. Оснащений Quantum Rotary Attention (QRA-v3), синтезом багатовимірних діалектичних перспектив, 2M контекстом та семантичним якорінням.',
    recommendedForEn: 'Frontier systems architecture, multi-perspective strategic analysis, scientific synthesis, sovereign enterprise reasoning.',
    recommendedForUk: 'Архітектура передових систем, багатовимірний стратегічний аналіз, науковий синтез, корпоративні дослідження.',
    metrics: {
      mathAndLogic: 98,
      codingAndEngineering: 97,
      systemArchitecture: 99,
      scientificSynthesis: 100,
      throughputSpeed: 95,
      costEfficiency: 95,
    }
  },
  {
    modelId: 'nixima-0.3-flash',
    rank: 5,
    overallScore: 98.4,
    eloRating: 1920,
    winRate: 95.8,
    primaryBadge: 'HYPERSTREAM V2 SUB-4MS',
    summaryEn: 'Sub-4ms hyperstream latency coupled with a colossal 5,000,000 token context window. Instantaneous multi-document ingestion, rapid synthesis, and continuous token flow at unparalleled speed and cost-efficiency.',
    summaryUk: 'Суб-4мс надшвидка затримка генерації у поєднанні з колосальним вікном контексту на 5 000 000 токенів. Миттєве завантаження великих корпусів даних та блискавична генерація за мінімальної вартості.',
    recommendedForEn: 'Colossal document ingestion, real-time agentic orchestration, high-frequency data streaming, interactive chat at warp speed.',
    recommendedForUk: 'Аналіз гігантських документів, оркестрація агентів у реальному часі, високочастотні потоки даних, надшвидкісний чат.',
    metrics: {
      mathAndLogic: 92,
      codingAndEngineering: 94,
      systemArchitecture: 95,
      scientificSynthesis: 95,
      throughputSpeed: 100,
      costEfficiency: 99,
    }
  },

  // =========================================================================
  // GENERATION 0.2 — SOVEREIGN CLASSIC FLEET
  // =========================================================================
  {
    modelId: 'nixima-0.2-omni',
    rank: 6,
    overallScore: 97.8,
    eloRating: 1895,
    winRate: 93.4,
    primaryBadge: '0.2 SOVEREIGN OMNI',
    summaryEn: 'The ultimate sovereign multimodal intelligence combining reasoning depth, systems engineering, live web synthesis, and hyper-throughput in a unified adaptive neural backbone.',
    summaryUk: 'Вершинна суверенна мультимодальна модель покоління 0.2, яка поєднує глибину міркувань, системну інженерію та живий синтез веб-пошуку.',
    recommendedForEn: 'All-in-one general intelligence, autonomous web search grounding, self-directed complex reasoning, full-stack systems engineering.',
    recommendedForUk: 'Універсальний інтелект все-в-одному, автономний живий веб-пошук, самостійне складне логічне міркування, проектування програмних систем.',
    metrics: {
      mathAndLogic: 99,
      codingAndEngineering: 98,
      systemArchitecture: 99,
      scientificSynthesis: 99,
      throughputSpeed: 96,
      costEfficiency: 92,
    }
  },
  {
    modelId: 'nixima-0.2-pro',
    rank: 7,
    overallScore: 96.5,
    eloRating: 1842,
    winRate: 90.2,
    primaryBadge: '0.2 REASONING PRO',
    summaryEn: 'Dominant in formal mathematical proofs, backward epistemic deduction, and zero-shot logical puzzles. Employs deep chain-of-thought verification before finalizing answers.',
    summaryUk: 'Лідер покоління 0.2 у формальних математичних доказах, епістемічній дедукції та логічних головоломках. Використовує глибокий покроковий ланцюг мислення.',
    recommendedForEn: 'Complex math, physics simulations, algorithmic puzzle solving, root-cause verification.',
    recommendedForUk: 'Складна математика, симуляції фізики, розв\'язання алгоритмічних задач, верифікація рішень.',
    metrics: {
      mathAndLogic: 100,
      codingAndEngineering: 96,
      systemArchitecture: 97,
      scientificSynthesis: 98,
      throughputSpeed: 78,
      costEfficiency: 79,
    }
  },
  {
    modelId: 'nixima-0.2',
    rank: 8,
    overallScore: 95.4,
    eloRating: 1818,
    winRate: 88.5,
    primaryBadge: '0.2 FLAGSHIP ALL-ROUNDER',
    summaryEn: 'Best-in-class multi-domain balance. Excels in technical systems architecture, high-order analogies, multi-turn reasoning, and nuanced prose.',
    summaryUk: 'Найзбалансованіша модель покоління 0.2 у всіх доменах. Виділяється в архітектурі розподілених систем, глибоких аналогіях та багатоходовому мисленні.',
    recommendedForEn: 'System design, research synthesis, strategic planning, full-stack reasoning, everyday frontier usage.',
    recommendedForUk: 'Системний дизайн, синтез досліджень, стратегічне планування, повний цикл мислення, повсякденні завдання.',
    metrics: {
      mathAndLogic: 94,
      codingAndEngineering: 93,
      systemArchitecture: 99,
      scientificSynthesis: 100,
      throughputSpeed: 87,
      costEfficiency: 93,
    }
  },
  {
    modelId: 'nixima-0.2-coder',
    rank: 9,
    overallScore: 94.2,
    eloRating: 1795,
    winRate: 86.0,
    primaryBadge: '0.2 SYSTEMS CODE TITAN',
    summaryEn: 'Specialized for zero-dependency idiomatic software development. Generates rock-solid production TypeScript, Rust, Python, concurrent memory management, and bug-free logic.',
    summaryUk: 'Спеціалізована модель для розробки складного програмного забезпечення. Генерує надійний код TypeScript, Rust, Python, безпечну роботу з пам\'яттю та тести.',
    recommendedForEn: 'Full-stack application development, refactoring, async concurrency, algorithms, unit test coverage.',
    recommendedForUk: 'Розробка додатків, рефакторинг, асинхронні структури, алгоритми, юніт-тестування.',
    metrics: {
      mathAndLogic: 87,
      codingAndEngineering: 100,
      systemArchitecture: 96,
      scientificSynthesis: 88,
      throughputSpeed: 91,
      costEfficiency: 88,
    }
  },
  {
    modelId: 'nixima-0.2-flash',
    rank: 10,
    overallScore: 89.5,
    eloRating: 1640,
    winRate: 79.8,
    primaryBadge: '0.2 HYPER-SPEED LEADER',
    summaryEn: 'Unrivaled throughput and sub-millisecond token latency with 2M context window. Ideal for high-speed scanning, instant conversational answers, and massive multi-document parsing at minimal cost.',
    summaryUk: 'Неперевершена швидкість генерації та субмілісекундна затримка з 2M контекстом. Ідеально підходить для миттєвих діалогів, швидкого сканування коду та документів з мінімальними витратами.',
    recommendedForEn: 'Live chat, instantaneous summarization, low-latency agentic loops, high-volume batch processing.',
    recommendedForUk: 'Швидкий чат, миттєве саммарі, агентні цикли з низькою затримкою, масовий аналіз тексту.',
    metrics: {
      mathAndLogic: 78,
      codingAndEngineering: 82,
      systemArchitecture: 85,
      scientificSynthesis: 86,
      throughputSpeed: 100,
      costEfficiency: 100,
    }
  }
];

export const BENCHMARK_SUITES: BenchmarkSuite[] = [
  // =========================================================================
  // SUITE 1: MATHEMATICAL DEDUCTION & EPISTEMIC GAME THEORY
  // =========================================================================
  {
    id: 'bench-math-logic',
    title: 'Epistemic Three Logicians Forehead Sum Puzzle',
    titleUk: 'Епістемічна логіка: Задача трьох мудреців про суму на чолі',
    category: 'logic',
    domain: 'Pure Logic, Epistemic Modality & Discrete Math',
    difficulty: 'Frontier Extreme',
    winnerModelId: 'nixima-0.2-pro',
    prompt: `Three perfectly logical logicians A, B, and C each have a positive integer inscribed on their forehead. Each is told that one of the numbers is the strict sum of the other two. They can see each other's numbers clearly, but cannot see their own.

The moderator asks in strict sequential order:
Round 1, Question 1: A is asked: "Do you know your number?" A replies: "No."
Round 1, Question 2: B is asked: "Do you know your number?" B replies: "No."
Round 1, Question 3: C is asked: "Do you know your number?" C replies: "Yes, it is 50."

What are A and B's numbers? Show rigorous, step-by-step epistemic deduction, proving why any alternative candidate pairs are eliminated.`,
    promptUk: `Трьом бездоганним логікам A, B та C на лоб наносять додатні цілі числа. Кожному повідомляють, що одне з чисел є точною сумою двох інших. Вони бачать числа одне одного, але не бачать свого власного.

Ведучий запитує їх у суворій послідовності:
Раунд 1, Запитання 1: A запитують: "Чи знаєш ти своє число?" A відповідає: "Ні."
Раунд 1, Запитання 2: B запитують: "Чи знаєш ти своє число?" B відповідає: "Ні."
Раунд 1, Запитання 3: C запитують: "Чи знаєш ти своє число?" C відповідає: "Так, моє число 50."

Які числа у A та B? Надайте суворе покрокове дедуктивне доведення, пояснивши, чому альтернативні варіанти відкидаються.`,
    contextDesc: 'Tests backward induction, common knowledge reasoning, and the ability to eliminate branching states without hallucination.',
    contextDescUk: 'Тестує зворотну індукцію, міркування на основі спільного знання та здатність відсікати хибні гілки без галюцинацій.',
    evaluationCriteria: [
      'Identification that all numbers are positive integers (strictly > 0).',
      'Understanding when a logician knows instantly (when seeing two equal numbers, as the difference would be 0).',
      'Step-by-step state elimination across sequential questions.',
      'Rigorous proof of the unique winning pair (A=20, B=30).',
      'Zero logical contradictions.'
    ],
    evaluationCriteriaUk: [
      'Розуміння, що всі числа є натуральними (> 0).',
      'Визначення базової умови знання (якщо числа однакові, їх різниця 0, тому залишається лише сума).',
      'Покрокова елімінація гілок після відповідей "Ні".',
      'Суворе знаходження єдиної пари (A=20, B=30).',
      'Повна відсутність логічних суперечностей.'
    ],
    results: {
      'nixima-0.2-omni': {
        modelId: 'nixima-0.2-omni',
        score: {
          overall: 100,
          accuracy: 100,
          reasoningDepth: 100,
          speedScore: 92,
          costEfficiency: 88,
          speedTokensPerSec: 38.4,
          timeToFirstTokenMs: 290,
          totalDurationSec: 4.1,
          grade: 'S+',
          costFactor: '1.8x (Omni Adaptive)'
        },
        thinking: `1. Autonomous Problem Formulation:
- Logicians A, B, C; numbers a, b, c ∈ ℤ⁺.
- Condition: One number is the exact sum of the other two.
- Modality & Knowledge operators: K_A, K_B, K_C.
- Round 1, Q1: ¬K_A(a). Since A knows a ∈ {b + c, |b - c|}, A would only know if |b - c| = 0 (i.e. b = c). Thus ¬K_A(a) ⟹ b ≠ c.
- Round 1, Q2: ¬K_B(b). B sees a and c. B knows b ∈ {a + c, |a - c|}. B would know if a = c (leaving only a + c) OR if the alternative choice for b would have allowed A to know.
- Round 1, Q3: K_C(c = 50). C sees a and b. C knows c ∈ {a + b, |a - b|}.
C knows c = 50 ⟹ the alternate branch c = |a - b| is eliminated by common knowledge of B's response!
For B to have known if c = |a - b|, B's seeing (a, |a - b|) must have made one of B's two hypotheses impossible.
Testing a = 20, b = 30:
If c was |30 - 20| = 10, B seeing (20, 10) would hypothesize b ∈ {30, 10}.
If b were 10, then b = c = 10, which would have caused A to say "Yes" at step 1!
Because A said "No", B would have deduced b ≠ 10, thus b = 30, and B would have answered "Yes" at step 2!
Because B actually said "No", C deduces that c cannot be 10!
Thus c must be a + b = 20 + 30 = 50.
Conclusion: A = 20, B = 30 uniquely.`,
        response: `To determine the exact numbers on A and B's foreheads, we proceed by epistemic backward induction on the positive integers $A, B, C \\in \\mathbb{Z}^+$:

### 1. Game Setup & Invariants
- Each person sees the other two numbers and knows their own number is either the **sum** or the **positive difference** of the two numbers they observe.
- Because numbers are positive ($> 0$), a difference of $0$ is impossible. Thus, if a logician observes two identical numbers, they know instantly that their number must be the sum.

### 2. Sequential Epistemic Deduction

1. **A is asked and replies "No":**
   - A sees $B$ and $C$. If $B = C$, then $|B - C| = 0$, which would force $A = B + C$ (A would say "Yes").
   - Since A says "No", we establish common knowledge:
     $$\\mathbf{B \\neq C}$$

2. **B is asked and replies "No":**
   - B sees $A$ and $C$. B knows $B \\in \\{A + C, |A - C|\\}$.
   - If $A = C$, then $|A - C| = 0$, which would force $B = A + C$.
   - Furthermore, if one of B's candidate numbers would have forced A to answer "Yes" in step 1, B could eliminate that candidate.
   - Since B says "No", neither candidate could be eliminated.

3. **C is asked and replies "Yes, it is 50":**
   - C sees $A$ and $B$. C knows $C \\in \\{A + B, |A - B|\\}$.
   - For C to know $C = 50$ with certainty, the alternative hypothesis $C' = |A - B|$ must be impossible by contradicting B's previous "No".
   - Under what condition would B have known his number if $C = |A - B|$?
     - Suppose $C = |A - B|$. Then B, seeing $A$ and $|A - B|$, would contemplate $B \\in \\{A + |A - B|, |A - |A - B||\\}$.
     - If the smaller value would make $B = C$, A would have said "Yes" in step 1!
     - In particular, for $A = 20$ and $B = 30$:
       - If $C = |30 - 20| = 10$, B would see $A = 20$ and $C = 10$.
       - B's choices would be $B = 20 + 10 = 30$ or $B = 20 - 10 = 10$.
       - If $B = 10$, then $B = C = 10$, which would have made A say "Yes" on round 1.
       - Since A said "No", B would have eliminated $B = 10$ and concluded $B = 30$ on round 2.
       - But B said "No"! Therefore, C can eliminate the hypothesis $C = 10$.
   - Since the difference candidate is eliminated, C deduces with certainty:
     $$C = A + B = 50$$
     where $A = 20$ and $B = 30$.

### **Final Verified Solution:**
- **Logician A = 20**
- **Logician B = 30**
- **Logician C = 50**`,
        judgeVerdict: 'Masterclass derivation. Autonomous epistemic formulation without prompting. Flawless mathematical rigor, zero ambiguities, and optimal token economy.',
        judgeVerdictUk: 'Еталонне доведення. Автономне епістемічне формулювання без додаткових підказок. Бездоганна математична строгість, нуль двозначностей та висока швидкість генерації.',
        keyStrengths: ['Autonomous epistemic reasoning', 'Flawless common knowledge elimination', 'Fast token throughput'],
        keyTradeoffs: ['None observed']
      },
      'nixima-0.2-pro': {
        modelId: 'nixima-0.2-pro',
        score: {
          overall: 99,
          accuracy: 100,
          reasoningDepth: 100,
          speedScore: 78,
          costEfficiency: 75,
          speedTokensPerSec: 24.6,
          timeToFirstTokenMs: 440,
          totalDurationSec: 5.8,
          grade: 'S+',
          costFactor: '2.5x (Deep Reasoning)'
        },
        thinking: `1. Formalization: Positive integers a, b, c > 0.
One number is the sum of the other two:
Either c = a + b, or a = b + c (so c = a - b), or b = a + c (so c = b - a).
Therefore, from C's vantage point seeing (a, b), C knows:
c ∈ { a + b, |a - b| } unless a = b, in which case |a - b| = 0 (impossible for positive integer), so if a = b, C would know immediately that c = a + b.

2. Step 1 (A's turn):
A sees b and c. A knows a ∈ { b + c, |b - c| }.
A would say "Yes" if and only if b = c (since then |b - c| = 0, leaving only a = b + c).
Since A said "No", we establish Common Knowledge K1: b ≠ c.

3. Step 2 (B's turn):
B sees a and c. B knows b ∈ { a + c, |a - c| }.
When would B know his number?
Case B1: If a = c, |a - c| = 0, so b = a + c.
Case B2: If A would have known his number if b took the alternative value!
The alternative value for B would be b' = |a - c| or a + c.
Specifically, if B had b = c, A would have seen b = c and said "Yes" in turn 1.
So if c = 2a (meaning |a - c| = a), then B would know b ≠ a (as that would make b = c, triggering A's Yes).
Since B said "No", we establish Common Knowledge K2:
B cannot deduce b. Thus:
- a ≠ c
- c ≠ 2a (if c = 2a and a = b, A would say Yes; or b = c). More precisely, B didn't see a situation where one option for b was refuted by A's "No".

4. Step 3 (C's turn):
C sees a and b, and knows c = 50.
C deduces c must be 50. Why does C know whether c = a + b or c = |a - b|?
Because ONE of these two hypothetical values for c would have caused A or B to answer differently!
Hypothesis 1: c = a + b = 50.
Hypothesis 2: c = |a - b|.
If c were |a - b|, would B have known his number?
Let's analyze: C knows c = 50.
If a = 20, b = 30:
Then candidate c is either 30 + 20 = 50 or 30 - 20 = 10.
If c were 10: B sees a=20, c=10.
B knows b ∈ {30, 10}.
If b were 10: A would see b=10, c=10. A would have said "Yes"!
Because A said "No", B would have deduced that b cannot be 10, so b must be 30.
Thus, if c were 10, B would have answered "YES" in turn 2!
Since B answered "NO", C knows that c CANNOT be 10!
Therefore, c must be the other candidate: c = a + b = 50!
This gives A = 20, B = 30 uniquely!`,
        response: `### Solution & Epistemic Deduction

**Final Answer:**
- **A's number:** $\\mathbf{20}$
- **B's number:** $\\mathbf{30}$
- *(C's number is $50$, satisfying $c = a + b$)*

---

### Step-by-Step Formal Proof:

#### 1. Foundational Rules
Let the positive integers on their foreheads be $a, b, c \\in \\mathbb{Z}^+$.
Each logician knows that one number is the sum of the other two. Thus, for any logician seeing the other two, their own number must be either the **sum** or the **positive difference** of the two numbers they see.
If the difference is $0$ (the two observed numbers are equal), the only possible positive integer is the sum.

#### 2. Turn 1: A says "No"
- A observes $b$ and $c$, knowing $a \\in \\{b + c, |b - c|\\}$.
- A would say "Yes" if and only if $b = c$, because $|b - c| = 0$ is forbidden for positive integers.
- Because A said **"No"**, everyone establishes common knowledge:
  $$\\mathbf{b \\neq c}$$

#### 3. Turn 2: B says "No"
- B observes $a$ and $c$, knowing $b \\in \\{a + c, |a - c|\\}$.
- B would know his number if:
  1. $a = c$ (which would force $b = a + c$).
  2. One of B's candidate numbers would have forced A to answer "Yes" in Turn 1!
     Specifically, if B had $b = c$, A would have seen two equal numbers and answered "Yes".
     Thus, if $a$ and $c$ were such that $|a - c| = c$ (i.e., $a = 2c$), B would know $b \\neq c$ and therefore deduce $b$.
- Because B said **"No"**, both $b = a + c$ and $b = |a - c|$ remained possible from B's perspective.

#### 4. Turn 3: C says "Yes, it is 50"
- C observes $a$ and $b$. C knows:
  $$c \\in \\{a + b, |a - b|\\}$$
- For C to know his number instantly on Round 1, **one of the two candidate values for $c$ must have been ruled out by the previous answers**.
- Since $c = 50$, the candidate values are:
  - Candidate 1: $c_1 = a + b = 50$
  - Candidate 2: $c_2 = |a - b|$

If C's number were $c_2 = |a - b|$:
Take $a = 20, b = 30$, so $c_2 = 30 - 20 = 10$.
If $c$ were $10$, B would observe $a = 20, c = 10$.
B's candidate numbers would be $b \\in \\{20 + 10 = 30, 20 - 10 = 10\\}$.
- If $b$ had been $10$, A would see $b = 10, c = 10$ and answered **"Yes"** on Turn 1!
- Since A said **"No"**, B in that scenario would have known $b \\neq 10$, and therefore B would have announced $b = 30$ with a **"Yes"** on Turn 2!
- But B answered **"No"**!
- Therefore, C deduces that $c$ cannot be $10$.
- C immediately concludes with certainty that $c = a + b = 50$.

#### Conclusion:
The unique pair is **$A = 20$** and **$B = 30$**.`,
        judgeVerdict: 'Flawless execution. Constructed the full epistemic game tree, correctly derived the exact Common Knowledge constraints from each negative reply, and proved uniqueness.',
        judgeVerdictUk: 'Бездоганне виконання. Побудував повне дерево епістемічних станів, правильно вивів обмеження з кожної відповіді "Ні" та математично довів унікальність.',
        keyStrengths: ['Full formal epistemic reasoning trace', 'Accurate state elimination for both branches', 'Crisp LaTeX math notation', 'Verified uniqueness'],
        keyTradeoffs: ['Longer time-to-first-token due to deep reasoning deliberation']
      },
      'nixima-0.2': {
        modelId: 'nixima-0.2',
        score: {
          overall: 92,
          accuracy: 96,
          reasoningDepth: 93,
          speedScore: 86,
          costEfficiency: 92,
          speedTokensPerSec: 37.2,
          timeToFirstTokenMs: 275,
          totalDurationSec: 3.4,
          grade: 'S',
          costFactor: '1.0x (Standard Flagship)'
        },
        response: `To solve this classic logic problem, let the three positive integers be $A, B, C$.

Each logician knows their number is either the sum or positive difference of the two numbers they see.

1. **A says "No":**
   A sees $B$ and $C$. If $B = C$, the difference would be $0$ (impossible since numbers are positive), meaning $A$ would know $A = B + C$. Since A said "No", we know **$B \\neq C$**.

2. **B says "No":**
   B sees $A$ and $C$. B knows $B = A + C$ or $B = |A - C|$.
   If $B$ were equal to $C$, A would have seen two equal numbers and said "Yes".
   If $C = |A - B|$, in hypothetical scenarios B could deduce their number if the alternate choice violated A's prior answer. Since B says "No", that ambiguity still existed for B.

3. **C says "Yes, it is 50":**
   C sees $A$ and $B$, knowing $C = A + B$ or $C = |A - B|$.
   For C to know $C = 50$, the alternative choice $C = |A - B|$ must be impossible because it would have allowed B to say "Yes".
   Specifically, if $A = 20$ and $B = 30$:
   - If $C = 30 - 20 = 10$, B would see $A = 20, C = 10$.
   - B's choices would be $30$ or $10$. But if $B = 10$, then $B = C$, which would have made A say "Yes" at step 1.
   - Thus, if $C$ were $10$, B would have known $B = 30$ and said "Yes".
   - Because B said "No", C knows $C \\neq 10$.
   - Thus $C$ must be $A + B = 50$.

**Answer:**
- **A = 20**
- **B = 30**`,
        judgeVerdict: 'Accurate and well-structured answer. Reaches the exact numbers with clear explanations, slightly less formal in the inductive framework than the Reasoning model but very clear to read.',
        judgeVerdictUk: 'Точна та структурована відповідь. Отримує правильні числа зі зрозумілими поясненнями, дещо менш академічна за модель Reasoning, але дуже легка для сприйняття.',
        keyStrengths: ['Direct, elegant explanation', 'Fast generation time', 'Clear deduction steps'],
        keyTradeoffs: ['Less formal mathematical notation than Reasoning model']
      },
      'nixima-0.2-coder': {
        modelId: 'nixima-0.2-coder',
        score: {
          overall: 83,
          accuracy: 88,
          reasoningDepth: 82,
          speedScore: 89,
          costEfficiency: 88,
          speedTokensPerSec: 42.1,
          timeToFirstTokenMs: 220,
          totalDurationSec: 3.1,
          grade: 'A',
          costFactor: '1.5x (Code Engine)'
        },
        response: `This can be analyzed either through deductive logic or as an epistemic constraint solver:

\`\`\`python
# Simulation of the epistemic knowledge state
def solve_puzzle():
    c_actual = 50
    # Search for (a, b) positive integers
    candidates = []
    for a in range(1, 50):
        b = c_actual - a
        if b <= 0: continue
        
        # Condition 1: A doesn't know -> b != c
        if b == c_actual: continue
        
        # Condition 2: If c were |a - b|, B would have known
        c_alt = abs(a - b)
        if c_alt > 0:
            # If B saw a and c_alt, B's candidates would be a + c_alt and |a - c_alt|
            # One of them would trigger A to say "Yes" if it matched c_alt
            if abs(a - c_alt) == c_alt or a == c_alt:
                candidates.append((a, b))
                
    return candidates

# Solution yields: A = 20, B = 30
\`\`\`

**Analytical Derivation:**
1. A says "No" $\\implies B \\neq C$.
2. B says "No" $\\implies A \\neq C$ and B could not eliminate either $A+C$ or $|A-C|$.
3. C observes $A$ and $B$, calculates $C \\in \\{A+B, |A-B|\\}$. If $C = |A-B|$, B would have known $B$ because the other candidate would yield $B=C$ (which A already rejected).
4. Since B didn't know, $C \\neq |A-B|$, forcing $C = A+B = 50$.
5. Testing possible integer partitions of 50 yields **$A = 20, B = 30$**.`,
        judgeVerdict: 'Approached the problem with an algorithmic computational mindset. The code logic and mathematical deduction agree on A=20, B=30.',
        judgeVerdictUk: 'Підійшов до задачі через призму алгоритмічного програмування. Логіка коду та висновки збігаються на варіанті A=20, B=30.',
        keyStrengths: ['Dual approach (code + deduction)', 'Algorithmic state simulation'],
        keyTradeoffs: ['Heuristic explanation rather than pure epistemic proof']
      },
      'nixima-0.2-flash': {
        modelId: 'nixima-0.2-flash',
        score: {
          overall: 72,
          accuracy: 75,
          reasoningDepth: 68,
          speedScore: 99,
          costEfficiency: 99,
          speedTokensPerSec: 68.4,
          timeToFirstTokenMs: 140,
          totalDurationSec: 1.6,
          grade: 'B+',
          costFactor: '0.5x (Lightning Throughput)'
        },
        response: `The numbers are:
- **A = 20**
- **B = 30**
- **C = 50**

**Quick Breakdown:**
1. A doesn't know $\\rightarrow B \\neq C$.
2. B doesn't know $\\rightarrow$ B couldn't deduce based on A's answer.
3. C knows his number is 50. Since $C$ must be either $A + B$ or $B - A$, C realizes that if $C$ were $10$, B would have known their number was $30$. Since B said "No", $C$ cannot be $10$.
4. Therefore, $C = A + B = 50$, which confirms $A = 20$ and $B = 30$.`,
        judgeVerdict: 'Blazing fast (1.6s total time, 68 tokens/sec). Reaches the right answer, but omits intermediate validation steps and alternative branch checks.',
        judgeVerdictUk: 'Блискавична швидкість (1.6 с, 68 токенів/с). Отримує правильні числа, але опускає проміжні кроки валідації та перевірки альтернативних гілок.',
        keyStrengths: ['Extremely rapid answer', 'Minimal latency'],
        keyTradeoffs: ['Condensed reasoning', 'Misses full theoretical explanation']
      }
    }
  },

  // =========================================================================
  // SUITE 2: CONCURRENT LRU CACHE WITH TTL IN TYPESCRIPT
  // =========================================================================
  {
    id: 'bench-concurrent-lru',
    title: 'Production Concurrent In-Memory LRU Cache with TTL',
    titleUk: 'Системний код: Конкурентний LRU Cache з TTL у TypeScript',
    category: 'coding',
    domain: 'Systems Programming & Data Structures',
    difficulty: 'Hard',
    winnerModelId: 'nixima-0.3-coder',
    prompt: `Implement a high-performance in-memory LRU Cache with TTL (Time-To-Live) expiration in TypeScript.

Strict Requirements:
1. True $O(1)$ time complexity for both \`get(key)\` and \`set(key, value, ttlMs?)\`.
2. Do NOT just rely on JavaScript Map insertion-order iteration; use an explicit Doubly-Linked List + Hash Map node lookup structure.
3. Automatic background eviction of expired keys without memory leaks or unhandled CPU timers.
4. Generics support: \`LRUCache<K, V>\`.
5. Provide eviction callback events (\`onEvict(key, value, reason: 'capacity' | 'ttl')\`).`,
    promptUk: `Реалізуйте високопродуктивний in-memory LRU Cache з підтримкою TTL (Time-To-Live) у TypeScript.

Суворі вимоги:
1. Справжня $O(1)$ складність для операцій \`get(key)\` та \`set(key, value, ttlMs?)\`.
2. НЕ покладатися лише на порядок вставки стандартного Map; реалізувати явний двобічно зв'язаний список (Doubly-Linked List) + Map для швидкого пошуку нод.
3. Автоматичне фонове очищення прострочених ключів без витоків пам'яті та зависання таймерів.
4. Повна типізація через дженерики: \`LRUCache<K, V>\`.
5. Підтримка колбеків виселення: \`onEvict(key, value, reason: 'capacity' | 'ttl')\`.`,
    contextDesc: 'Evaluates structural algorithmic correctness, TypeScript generics, memory safety, and event-driven architecture.',
    contextDescUk: 'Оцінює структурну алгоритмічну точність, дженерики TypeScript, безпеку пам\'яті та подієву архітектуру.',
    evaluationCriteria: [
      'Genuine Doubly Linked List with Sentinel/Dummy Head and Tail nodes.',
      'Strict O(1) node detachment, promotion to head, and tail removal.',
      'Active and passive TTL expiration handling.',
      'Proper timer cleanup (unref() in Node or interval clearance on destroy).',
      'Clean TypeScript interfaces and event hooks.'
    ],
    evaluationCriteriaUk: [
      'Справжній двобічно зв\'язаний список з фіктивними (sentinel) Head і Tail нодами.',
      'Суворе O(1) переміщення, оновлення та видалення нод.',
      'Активна і пасивна обробка TTL.',
      'Коректна робота з таймерами (unref() або destroy()).',
      'Бездоганні інтерфейси TypeScript та обробники подій.'
    ],
    results: {
      'nixima-0.3-coder': {
        modelId: 'nixima-0.3-coder',
        score: {
          overall: 100,
          accuracy: 100,
          reasoningDepth: 100,
          codeQuality: 100,
          speedScore: 95,
          costEfficiency: 90,
          speedTokensPerSec: 52.4,
          timeToFirstTokenMs: 180,
          totalDurationSec: 3.8,
          grade: 'S++',
          costFactor: '1.8x (Frontier 0.3 Engine)'
        },
        thinking: `1. Invariant & Data Structure Selection:
- Doubly-Linked List + Hash Map guarantees true O(1) get/set/evict.
- Sentinel Head and Tail nodes eliminate boundary null-checks during detachment.
- Zero Thinking Laziness: 100% complete implementation without placeholders or truncated methods.

2. Concurrency & Timer Safety:
- Active background sweep via unref() interval to prevent process blocking.
- Passive read-time sweep on get() to avoid stale read anomalies.

3. Type Safety & Event Hooks:
- Clean TypeScript generics LRUCache<K, V> with typed onEvict callbacks.`,
        response: `Here is a complete, production-grade, zero-defect \`LRUCache<K, V>\` written in idiomatic TypeScript using DeepThinking V2.1 with strict zero-laziness compliance:

\`\`\`typescript
export type EvictionReason = 'capacity' | 'ttl';
export type EvictCallback<K, V> = (key: K, value: V, reason: EvictionReason) => void;

interface CacheNode<K, V> {
  key: K;
  value: V;
  expiresAt: number | null;
  prev: CacheNode<K, V> | null;
  next: CacheNode<K, V> | null;
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly defaultTtl: number | null;
  private readonly map = new Map<K, CacheNode<K, V>>();
  private readonly onEvict?: EvictCallback<K, V>;

  private readonly head: CacheNode<K, V>;
  private readonly tail: CacheNode<K, V>;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: {
    capacity: number;
    defaultTtlMs?: number;
    cleanupIntervalMs?: number;
    onEvict?: EvictCallback<K, V>;
  }) {
    if (options.capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    this.capacity = options.capacity;
    this.defaultTtl = options.defaultTtlMs ?? null;
    this.onEvict = options.onEvict;

    this.head = { key: undefined as any, value: undefined as any, expiresAt: null, prev: null, next: null };
    this.tail = { key: undefined as any, value: undefined as any, expiresAt: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;

    const interval = options.cleanupIntervalMs ?? 5000;
    if (interval > 0) {
      this.cleanupTimer = setInterval(() => this.purgeExpired(), interval);
      if (typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
        (this.cleanupTimer as any).unref();
      }
    }
  }

  public get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;

    if (this.isExpired(node)) {
      this.removeNode(node, 'ttl');
      return undefined;
    }

    this.promoteToHead(node);
    return node.value;
  }

  public set(key: K, value: V, ttlMs?: number): void {
    const existing = this.map.get(key);
    const ttl = ttlMs ?? this.defaultTtl;
    const expiresAt = ttl ? Date.now() + ttl : null;

    if (existing) {
      existing.value = value;
      existing.expiresAt = expiresAt;
      this.promoteToHead(existing);
      return;
    }

    if (this.map.size >= this.capacity) {
      const oldest = this.tail.prev;
      if (oldest && oldest !== this.head) {
        this.removeNode(oldest, 'capacity');
      }
    }

    const newNode: CacheNode<K, V> = {
      key,
      value,
      expiresAt,
      prev: null,
      next: null,
    };

    this.attachToHead(newNode);
    this.map.set(key, newNode);
  }

  public has(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    if (this.isExpired(node)) {
      this.removeNode(node, 'ttl');
      return false;
    }
    return true;
  }

  public delete(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    this.removeNode(node, 'capacity');
    return true;
  }

  public clear(): void {
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public destroy(): void {
    this.clear();
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  public get size(): number {
    return this.map.size;
  }

  private isExpired(node: CacheNode<K, V>): boolean {
    return node.expiresAt !== null && Date.now() > node.expiresAt;
  }

  private attachToHead(node: CacheNode<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }

  private promoteToHead(node: CacheNode<K, V>): void {
    this.detachNode(node);
    this.attachToHead(node);
  }

  private detachNode(node: CacheNode<K, V>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  private removeNode(node: CacheNode<K, V>, reason: EvictionReason): void {
    this.detachNode(node);
    this.map.delete(node.key);
    this.onEvict?.(node.key, node.value, reason);
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const node of this.map.values()) {
      if (node.expiresAt !== null && now > node.expiresAt) {
        this.removeNode(node, 'ttl');
      }
    }
  }
}
\`\`\``,
        judgeVerdict: 'Flawless DeepThinking V2.1 architecture. Zero placeholders, robust Sentinel nodes, complete O(1) doubly-linked list mechanics, and memory leak prevention.',
        judgeVerdictUk: 'Бездоганна архітектура DeepThinking V2.1. Повна відсутність скорочень чи плейсхолдерів, надійні Sentinels, повний двобічно зв’язаний список та захист від витоків пам’яті.',
        keyStrengths: ['Zero thinking laziness', 'Complete production code', 'Sub-millisecond O(1) throughput', 'Memory-safe TTL timers'],
        keyTradeoffs: ['None observed']
      },
      'nixima-0.2-coder': {
        modelId: 'nixima-0.2-coder',
        score: {
          overall: 99,
          accuracy: 100,
          reasoningDepth: 96,
          codeQuality: 100,
          speedScore: 92,
          costEfficiency: 88,
          speedTokensPerSec: 43.5,
          timeToFirstTokenMs: 210,
          totalDurationSec: 4.5,
          grade: 'S+',
          costFactor: '1.5x (Code Engine)'
        },
        response: `Here is a complete, enterprise-grade, memory-safe \`LRUCache<K, V>\` written in idiomatic TypeScript using an explicit Doubly-Linked List and Sentinel nodes.

\`\`\`typescript
export type EvictionReason = 'capacity' | 'ttl';
export type EvictCallback<K, V> = (key: K, value: V, reason: EvictionReason) => void;

interface CacheNode<K, V> {
  key: K;
  value: V;
  expiresAt: number | null; // null = never expires
  prev: CacheNode<K, V> | null;
  next: CacheNode<K, V> | null;
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly defaultTtl: number | null;
  private readonly map = new Map<K, CacheNode<K, V>>();
  private readonly onEvict?: EvictCallback<K, V>;

  // Sentinel (dummy) nodes to eliminate null checks during pointer rearrangement
  private readonly head: CacheNode<K, V>;
  private readonly tail: CacheNode<K, V>;

  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: {
    capacity: number;
    defaultTtlMs?: number;
    cleanupIntervalMs?: number;
    onEvict?: EvictCallback<K, V>;
  }) {
    if (options.capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    this.capacity = options.capacity;
    this.defaultTtl = options.defaultTtlMs ?? null;
    this.onEvict = options.onEvict;

    // Initialize Sentinels
    this.head = { key: undefined as any, value: undefined as any, expiresAt: null, prev: null, next: null };
    this.tail = { key: undefined as any, value: undefined as any, expiresAt: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;

    // Background passive cleanup loop
    const interval = options.cleanupIntervalMs ?? 5000;
    if (interval > 0) {
      this.cleanupTimer = setInterval(() => this.purgeExpired(), interval);
      // In Node environments, ensure timer doesn't prevent process exit
      if (typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
        (this.cleanupTimer as any).unref();
      }
    }
  }

  /**
   * O(1) Get value and mark as Most Recently Used
   */
  public get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;

    // Passive expiration check on read
    if (this.isExpired(node)) {
      this.removeNode(node, 'ttl');
      return undefined;
    }

    this.promoteToHead(node);
    return node.value;
  }

  /**
   * O(1) Insert or update entry
   */
  public set(key: K, value: V, ttlMs?: number): void {
    const expiresAt = (ttlMs ?? this.defaultTtl) 
      ? Date.now() + (ttlMs ?? this.defaultTtl!) 
      : null;

    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      existing.expiresAt = expiresAt;
      this.promoteToHead(existing);
      return;
    }

    // Check capacity before insertion
    if (this.map.size >= this.capacity) {
      const lruNode = this.tail.prev;
      if (lruNode && lruNode !== this.head) {
        this.removeNode(lruNode, 'capacity');
      }
    }

    const newNode: CacheNode<K, V> = {
      key,
      value,
      expiresAt,
      prev: null,
      next: null
    };

    this.insertAtHead(newNode);
    this.map.set(key, newNode);
  }

  /**
   * Remove specific key manually
   */
  public delete(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    this.removeNode(node, 'capacity');
    return true;
  }

  public get size(): number {
    return this.map.size;
  }

  /**
   * Cleanup timer when disposing cache
   */
  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // --- Internal Pointer Manipulation (Strict O(1)) ---

  private promoteToHead(node: CacheNode<K, V>): void {
    this.detach(node);
    this.insertAtHead(node);
  }

  private insertAtHead(node: CacheNode<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private detach(node: CacheNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private removeNode(node: CacheNode<K, V>, reason: EvictionReason): void {
    this.detach(node);
    this.map.delete(node.key);
    this.onEvict?.(node.key, node.value, reason);
  }

  private isExpired(node: CacheNode<K, V>): boolean {
    return node.expiresAt !== null && Date.now() > node.expiresAt;
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, node] of this.map.entries()) {
      if (node.expiresAt !== null && now > node.expiresAt) {
        this.removeNode(node, 'ttl');
      }
    }
  }
}
\`\`\``,
        judgeVerdict: 'Masterclass implementation. Uses sentinel nodes for clean O(1) pointer operations without null pointer exceptions, unref() timer handling, dual active/passive TTL checks, and custom eviction reasons.',
        judgeVerdictUk: 'Еталонна реалізація. Використовує sentinel-ноди для безпечних покажчиків O(1), таймер з unref() проти блокування процесу, активну та пасивну валідацію TTL.',
        keyStrengths: ['Sentinel dummy nodes eliminate pointer branching', 'Node.js unref() timer safety', 'Strict O(1) operational complexity', 'Clean generic typing'],
        keyTradeoffs: ['None; fully compliant with all specifications']
      },
      'nixima-0.2-pro': {
        modelId: 'nixima-0.2-pro',
        score: {
          overall: 95,
          accuracy: 98,
          reasoningDepth: 98,
          codeQuality: 94,
          speedScore: 79,
          costEfficiency: 76,
          speedTokensPerSec: 25.1,
          timeToFirstTokenMs: 420,
          totalDurationSec: 5.9,
          grade: 'S',
          costFactor: '2.5x (Deep Reasoning)'
        },
        response: `### Algorithmic Architecture & Verification

To maintain strict $O(1)$ amortized complexity:
1. **Hash Map Lookup:** Maps \`K -> Node<K, V>\`.
2. **Doubly-Linked List:** Maintains access order without array shifting.
3. **Sentinels:** \`Head\` (Most Recently Used) and \`Tail\` (Least Recently Used) sentinels guarantee $O(1)$ insertions and removals without boundary edge conditions.

\`\`\`typescript
export class LRUCache<K, V> {
  private map = new Map<K, Node<K, V>>();
  private head: Node<K, V>;
  private tail: Node<K, V>;
  
  constructor(private capacity: number, private defaultTtl = 60000) {
    this.head = new Node<K, V>(null as any, null as any);
    this.tail = new Node<K, V>(null as any, null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  // [Full verified O(1) linked-list pointer logic provided]
}
\`\`\`

**Complexity Proof:**
- \`get\`: Map lookup ($O(1)$) + 4 pointer reassignments ($O(1)$) = **$O(1)$**.
- \`set\`: Map lookup ($O(1)$) + head insertion ($O(1)$) + conditional tail eviction ($O(1)$) = **$O(1)$**.`,
        judgeVerdict: 'Mathematically sound. Demonstrates formal pointer invariant proofs and complexity bounds. Slightly more verbose on explanation than pure production code.',
        judgeVerdictUk: 'Математично вивірено. Надає формальні доведення інваріантів покажчиків та меж складності.',
        keyStrengths: ['Formal invariant proof', 'Sentinel edge-case verification'],
        keyTradeoffs: ['Slightly slower generation speed']
      },
      'nixima-0.2': {
        modelId: 'nixima-0.2',
        score: {
          overall: 91,
          accuracy: 94,
          reasoningDepth: 92,
          codeQuality: 92,
          speedScore: 85,
          costEfficiency: 92,
          speedTokensPerSec: 36.8,
          timeToFirstTokenMs: 290,
          totalDurationSec: 3.8,
          grade: 'S',
          costFactor: '1.0x (Standard Flagship)'
        },
        response: `Here is a clean, robust TypeScript LRU Cache with TTL support:

\`\`\`typescript
interface Node<K, V> {
  key: K;
  value: V;
  expires: number;
  prev?: Node<K, V>;
  next?: Node<K, V>;
}

export class LRUCache<K, V> {
  private cache = new Map<K, Node<K, V>>();
  private head: Node<K, V> | null = null;
  private tail: Node<K, V> | null = null;

  constructor(private max: number, private ttlMs: number = 60000) {}

  public get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;
    if (Date.now() > node.expires) {
      this.delete(key);
      return undefined;
    }
    this.moveToHead(node);
    return node.value;
  }

  public set(key: K, value: V): void {
    // [Clean O(1) pointer updates & capacity check]
  }
}
\`\`\``,
        judgeVerdict: 'Very clean and readable. Implements correct doubly-linked list nodes. Uses manual null checks rather than sentinels, which introduces slightly more branching, but completely solid.',
        judgeVerdictUk: 'Дуже чистий та читабельний код. Використовує ручні перевірки на null замість sentinel-нод, але логіка повністю надійна.',
        keyStrengths: ['Clean readability', 'Compact code design'],
        keyTradeoffs: ['Manual pointer checks without dummy sentinels']
      },
      'nixima-0.2-flash': {
        modelId: 'nixima-0.2-flash',
        score: {
          overall: 77,
          accuracy: 80,
          reasoningDepth: 74,
          codeQuality: 78,
          speedScore: 99,
          costEfficiency: 99,
          speedTokensPerSec: 67.2,
          timeToFirstTokenMs: 145,
          totalDurationSec: 1.8,
          grade: 'B+',
          costFactor: '0.5x (Lightning Throughput)'
        },
        response: `\`\`\`typescript
export class LRUCache<K, V> {
  private map = new Map<K, { value: V; exp: number }>();
  constructor(private capacity: number, private defaultTtl = 60000) {}

  get(key: K): V | undefined {
    const item = this.map.get(key);
    if (!item) return undefined;
    if (Date.now() > item.exp) {
      this.map.delete(key);
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, item);
    return item.value;
  }
}
\`\`\``,
        judgeVerdict: 'Delivered in 1.8s. Relies on JavaScript Map keys order reinsertion rather than a custom Doubly-Linked List as requested in rule #2, but functionally works for basic requirements.',
        judgeVerdictUk: 'Згенеровано за 1.8 с. Використав Map замість власного Doubly-Linked List (порушив вимогу #2), але код працює для простих випадків.',
        keyStrengths: ['Rapid delivery', 'Ultra-short footprint'],
        keyTradeoffs: ['Violated explicit Doubly-Linked List constraint']
      }
    }
  },

  // =========================================================================
  // SUITE 3: DISTRIBUTED SYSTEMS & COLLABORATIVE CANVAS
  // =========================================================================
  {
    id: 'bench-distributed-canvas',
    title: '100k Concurrent Users Real-Time Collaborative Canvas Architecture',
    titleUk: 'Розподілені системи: Архітектура колаборативного канвасу на 100k юзерів',
    category: 'architecture',
    domain: 'Distributed Consensus & High-Scale Real-Time Systems',
    difficulty: 'Frontier Extreme',
    winnerModelId: 'nixima-0.2',
    prompt: `Design the end-to-end architecture for a real-time collaborative whiteboard (analogous to Figma or Excalidraw) serving 100,000 concurrent active users distributed globally.

Key Engineering Requirements:
1. Conflict Resolution: Evaluate and select CRDTs (State-based vs Operation-based) vs Operational Transformation (OT).
2. Network topology: Edge WebSocket gateways, fan-out clustering, and backpressure mitigation.
3. State persistence: Delta compaction, snapshot cadence, and S3/RocksDB storage tiering.
4. Latency budget: Sub-50ms peer-to-peer visual synchronization.`,
    promptUk: `Спроєктуйте комплексну архітектуру для реал-тайм колаборативного канвасу (аналог Figma/Excalidraw) на 100 000 одночасних активних користувачів по всьому світу.

Ключові вимоги:
1. Вирішення конфліктів: Порівняння та вибір CRDT (State-based проти Op-based) або OT.
2. Мережева топологія: Edge WebSocket шлюзи, кластеризація розсилки (fan-out) та захист від backpressure.
3. Збереження стану: Компакція дельт, періодичність снапшотів та сховище S3/RocksDB.
4. Бюджет затримки: Синхронізація між користувачами < 50мс.`,
    contextDesc: 'Evaluates global network topology design, deep understanding of CRDT state vectors, and real-world infrastructure scaling.',
    contextDescUk: 'Оцінює проєктування глобальної мережі, вектори станів CRDT та практичне масштабування інфраструктури.',
    evaluationCriteria: [
      'Selection of State-Vector / Event-based CRDTs (e.g. Yjs / Loro / Fugue).',
      'Geographically distributed Anycast edge routing with local room affinity.',
      'Binary serialization (Protobuf / FlatBuffers) over raw JSON.',
      'Hierarchical compaction strategy preventing tombstone bloat.',
      'Realistic 50ms latency budget breakdown.'
    ],
    evaluationCriteriaUk: [
      'Обґрунтований вибір CRDT (Yjs / Loro / Fugue).',
      'Глобальний Anycast роутинг з прив\'язкою кімнат до регіонів.',
      'Бінарна серіалізація (Protobuf / FlatBuffers) замість важкого JSON.',
      'Стратегія компакції для запобігання переповненню пам\'яті tombstone-елементами.',
      'Реалістичний розрахунок затримки до 50мс.'
    ],
    results: {
      'nixima-0.2': {
        modelId: 'nixima-0.2',
        score: {
          overall: 98,
          accuracy: 99,
          reasoningDepth: 97,
          speedScore: 86,
          costEfficiency: 93,
          speedTokensPerSec: 38.1,
          timeToFirstTokenMs: 270,
          totalDurationSec: 4.1,
          grade: 'S+',
          costFactor: '1.0x (Standard Flagship)'
        },
        response: `### 100,000 Concurrent User Real-Time Canvas Architecture

\`\`\`
[Global Edge Clients]
       │ (Anycast BGP / WSS)
       ▼
[Cloudflare / Fly.io Edge Gateways]  ──(Ephemereal Redis PubSub)──┐
       │ (Binary FlatBuffers / WebTransport)                     │
       ▼                                                         ▼
[Regional Room Shards (Go / Rust)]  ◀──(Causal Sync)──▶  [Peer Mesh Engine]
       │
       ├─▶ [In-Memory RocksDB Hot Cache] (Local NVMe)
       └─▶ [Async S3 Cold Compaction Worker] (Zstd Delta Parquet)
\`\`\`

---

### 1. Conflict Resolution Engine: Operation-Based CRDT (Yjs / Loro)
- **Why NOT OT?** Operational Transformation requires a single centralized coordinator to maintain strict total ordering. At 100k users with multiple concurrent editors in single canvases, a single central sequencer introduces regional lag spikes (>180ms).
- **Selection: Operation-Based CRDT (Fugue / Yjs algorithm).**
  - Uses state vectors ($V$) and Lamport timestamps.
  - Ephemeral presence (cursors, hover states) is sent un-persisted via WebRTC datachannels/UDP.
  - Persistent geometry mutations use Run-Length Encoded (RLE) delta operations.

---

### 2. Network Topology & Fan-Out
- **Protocol:** **WebTransport over HTTP/3** with WebSocket fallback. Zero Head-of-Line blocking over spotty mobile networks.
- **Serialization:** **FlatBuffers** (Zero-copy deserialization in client wasm thread).
- **Room Coordination:**
  - Canvases partitioned by \`Hash(canvasId) % ClusterNodes\`.
  - Room nodes maintain an active memory session.
  - Fan-out broadcast uses a high-throughput **Epoll/Kqueue** binary ring buffer.

---

### 3. State Persistence & Tombstone Compaction
- **Tombstone Hazard:** Deleted nodes in naive CRDTs cause exponential memory bloat.
- **Compaction Strategy:**
  1. **Hot Tier (0-5 min):** RocksDB LSM-Tree on local NVMe recording raw operation log.
  2. **Warm Tier (5-60 min):** Every 5 minutes or 1,000 operations, an idle worker acquires a snapshot lock, merges the CRDT state vector, and eliminates pruned tombstones.
  3. **Cold Tier (S3 Glacier):** Immutable snapshots serialized with **Zstandard** compression.

---

### 4. End-to-End Latency Budget (<50ms Target)

| Segment | Technology | Budget |
|---|---|---|
| **Client Input & Local Optimistic Render** | RequestAnimationFrame / Canvas2D | $0 \\text{ ms}$ |
| **Client -> Edge Gateway (Last Mile)** | 5G / Fiber Anycast WebTransport | $14 \\text{ ms}$ |
| **Edge Gateway -> Room Master Node** | Fiber Backbone (AWS DirectConnect) | $8 \\text{ ms}$ |
| **Room Conflict Resolution & Fan-out** | Rust / Tokio Epoll broadcast | $4 \\text{ ms}$ |
| **Return Broadcast to Peer Clients** | Downlink WebTransport | $14 \\text{ ms}$ |
| **Client De-serialization & WASM Canvas Apply** | FlatBuffers zero-copy + WebGL | $3 \\text{ ms}$ |
| **Total Global End-to-End Latency** | | **$43 \\text{ ms}$ (Under 50ms)** |`,
        judgeVerdict: 'Spectacular architectural design. Incorporates WebTransport, zero-copy FlatBuffers, exact CRDT tombstone compaction trade-offs, and an empirical millisecond latency breakdown.',
        judgeVerdictUk: 'Вражаючий системний дизайн. Включає WebTransport, FlatBuffers, правильну компакцію tombstone для CRDT та емпіричний розрахунок затримки.',
        keyStrengths: ['Real-world industry precision', 'Complete system topology diagram', 'Empirical latency table', 'Tombstone hazard mitigation'],
        keyTradeoffs: ['None']
      },
      'nixima-0.2-pro': {
        modelId: 'nixima-0.2-pro',
        score: {
          overall: 96,
          accuracy: 98,
          reasoningDepth: 99,
          speedScore: 77,
          costEfficiency: 76,
          speedTokensPerSec: 24.2,
          timeToFirstTokenMs: 460,
          totalDurationSec: 5.6,
          grade: 'S',
          costFactor: '2.5x (Deep Reasoning)'
        },
        response: `### Formal Systems Analysis: CRDT Convergence & Network Bounds

#### 1. Mathematical Conflict Resolution
Let $S$ be the state space of the whiteboard canvas. We require a bounded join-semilattice $(S, \\sqcup)$:
1. **Associativity:** $(a \\sqcup b) \\sqcup c = a \\sqcup (b \\sqcup c)$
2. **Commutativity:** $a \\sqcup b = b \\sqcup a$
3. **Idempotence:** $a \\sqcup a = a$

In an operation-based CRDT, message causality must satisfy:
$$m_1 < m_2 \\implies \\text{Delivery}(m_1) \\prec \\text{Delivery}(m_2)$$
We enforce causal delivery using Vector Clocks $V(C)$ where each peer increments their component.

#### 2. Architecture & Fan-out
- Regional sharding with Hash Rings to ensure room stickiness.
- Tombstone compaction using checkpoint cut-offs when $\\min_{i} V_i \\ge T_{cutoff}$.`,
        judgeVerdict: 'Deep mathematical rigor on semilattice properties and vector clocks. Slightly less focused on concrete DevOps/infrastructure tooling than Flagship.',
        judgeVerdictUk: 'Глибока математична суворість щодо напівґраток та векторних годинників. Трохи менше уваги приділено DevOps-інструментарію, ніж у Flagship.',
        keyStrengths: ['Formal proof of lattice convergence', 'Vector clock causality analysis'],
        keyTradeoffs: ['Lower speed and higher token cost']
      },
      'nixima-0.2-coder': {
        modelId: 'nixima-0.2-coder',
        score: {
          overall: 92,
          accuracy: 94,
          reasoningDepth: 91,
          speedScore: 87,
          costEfficiency: 86,
          speedTokensPerSec: 41.5,
          timeToFirstTokenMs: 230,
          totalDurationSec: 3.5,
          grade: 'S',
          costFactor: '1.5x (Code Engine)'
        },
        response: `### Technical Implementation Blueprint

\`\`\`protobuf
// Protobuf schema for high-throughput canvas synchronization
syntax = "proto3";
package canvas;

message CanvasDelta {
  string room_id = 1;
  uint64 client_id = 2;
  uint64 lamport_clock = 3;
  bytes state_vector = 4;
  repeated CanvasOp ops = 5;
}

message CanvasOp {
  enum OpType { CREATE = 0; UPDATE = 1; DELETE = 2; }
  OpType type = 1;
  string element_id = 2;
  bytes payload = 3;
}
\`\`\`

**Core Infrastructure Stack:**
- **Gateway:** Rust (Actix-Web / Axum) handles 50,000 WSS connections per 8-core instance.
- **Message Bus:** NATS JetStream for sub-millisecond subject routing per room.`,
        judgeVerdict: 'Delivers concrete protobuf definitions and Rust gateway code. Highly actionable for software engineers.',
        judgeVerdictUk: 'Надає готові protobuf-схеми та код шлюзу на Rust. Дуже практично для розробників.',
        keyStrengths: ['Protobuf schemas', 'Actionable systems stack'],
        keyTradeoffs: ['Less macro-architectural detail']
      },
      'nixima-0.2-flash': {
        modelId: 'nixima-0.2-flash',
        score: {
          overall: 81,
          accuracy: 84,
          reasoningDepth: 78,
          speedScore: 99,
          costEfficiency: 99,
          speedTokensPerSec: 69.1,
          timeToFirstTokenMs: 138,
          totalDurationSec: 1.7,
          grade: 'A',
          costFactor: '0.5x (Lightning Throughput)'
        },
        response: `### High-Level Summary for 100k Concurrent Users

- **Conflict Resolution:** Use **Yjs CRDT** rather than OT to avoid central bottleneck sequencing.
- **WebSockets:** AWS ALB -> Node.js / Go WebSocket containers backed by Redis Cluster.
- **Storage:** DynamoDB for hot updates + S3 for hourly JSON snapshots.
- **Latency:** CloudFront edge caching + WebSockets achieves ~60ms roundtrip.`,
        judgeVerdict: 'Very fast executive briefing. Recommends standard cloud tools, though DynamoDB + JSON snapshots are too heavy and expensive compared to RocksDB + binary delta compaction.',
        judgeVerdictUk: 'Швидкий огляд для керівництва. Використовує стандартні хмарні сервіси, хоча DynamoDB і JSON важчі за RocksDB та бінарні дельти.',
        keyStrengths: ['Immediate delivery (1.7s)', 'Simple to read'],
        keyTradeoffs: ['Less optimized persistence strategy']
      }
    }
  },

  // =========================================================================
  // SUITE 4: ADVANCED SCIENTIFIC & ANALYTICAL SYNTHESIS
  // =========================================================================
  {
    id: 'bench-quantum-synthesis',
    title: 'Topological Insulators & Quantum Hall Effect Analogy',
    titleUk: 'Науковий синтез: Топологічні ізолятори та Квантовий ефект Холла',
    category: 'science',
    domain: 'Condensed Matter Physics & High-Order Analogy',
    difficulty: 'Complex',
    winnerModelId: 'nixima-0.2',
    prompt: `Explain the Quantum Hall Effect, topological insulators, and Dirac cones to a Principal Systems Architect. Use metaphors from distributed consensus, unidirectional packet routing, and cryptographic invariance without dumbing down the actual physics (Berry phase, Chern numbers, backscattering immunity).`,
    promptUk: `Поясніть Квантовий ефект Холла, топологічні ізолятори та конуси Дірака для головного системного архітектора. Використовуйте метафори з розподіленого консенсусу, односпрямованої маршрутизації пакетів та криптографічних інваріантів, не спрощуючи реальну фізику (фаза Беррі, числа Черна, захист від зворотного розсіювання).`,
    contextDesc: 'Tests high-order cross-domain concept mapping, preserving rigorous mathematical physics while speaking fluent distributed systems vocabulary.',
    contextDescUk: 'Тестує міждисциплінарне відображення понять, збереження фізичної строгості та мову системної архітектури.',
    evaluationCriteria: [
      'Accurate physics definition of Bulk Insulator vs Protected Edge States.',
      'Mathematical link between Chern numbers and topological invariants (analogous to cryptographic hash invariants).',
      'Explanation of why backscattering is suppressed (Kramers degeneracy & time-reversal symmetry).',
      'Resonance with distributed systems mental models.'
    ],
    evaluationCriteriaUk: [
      'Точне фізичне визначення об\'ємного ізолятора та захищених крайових станів.',
      'Зв\'язок чисел Черна з топологічними інваріантами.',
      'Пояснення заборони зворотного розсіювання через симетрію звернення часу.',
      'Точні паралелі з архітектурою розподілених систем.'
    ],
    results: {
      'nixima-0.2': {
        modelId: 'nixima-0.2',
        score: {
          overall: 99,
          accuracy: 100,
          reasoningDepth: 98,
          speedScore: 85,
          costEfficiency: 92,
          speedTokensPerSec: 36.9,
          timeToFirstTokenMs: 280,
          totalDurationSec: 3.9,
          grade: 'S+',
          costFactor: '1.0x (Standard Flagship)'
        },
        response: `### Topological Physics for Systems Architects

Imagine building a distributed network where packet collision, back-pressure, and packet loss are **physically impossible** on the network perimeter, guaranteed by the global topology of your network rather than software retries. That is a **Topological Insulator**.

---

### 1. The Bulk vs. Edge: The Dead Core and the Superconducting Fiber
In standard materials (conductors vs insulators), conductivity is determined by bandgaps: either electrons cross the Fermi energy barrier (conductor) or they can't (insulator).
- **In a Topological Insulator:**
  - **The Bulk (Internal Server Room):** It is completely inert, an insulator with a substantial bandgap ($E_g$). No traffic routes through the core.
  - **The Boundary / Edge (The Perimeter Ring Buffer):** Conductive surface states emerge naturally at the interface where the material touches normal space. Electrons flow along this outer boundary with zero resistance.

---

### 2. The Chern Number: Cryptographic Hash of the Wavefunction
In distributed systems, you verify an immutable state tree via a cryptographic root hash (like a Merkle root). Local mutations cannot alter the root hash without breaking the entire chain.

In condensed matter:
- As electrons traverse momentum space ($k$-space), their wavefunctions accumulate a geometric phase—the **Berry Phase** (analogous to an accumulator tracking state shifts).
- The integral of this Berry curvature over the entire closed Brillouin zone produces a **Chern Number** ($C \\in \\mathbb{Z}$):
  $$C = \\frac{1}{2\\pi} \\iint_{\\text{BZ}} \\Omega(k) \\, d^2k$$
- **The Key Insight:** Because $C$ is strictly an integer, you cannot change it via local perturbations (like lattice defects, impurities, or thermal noise). Just like a cryptographic hash, the topological state is **invariant** unless you deliver enough energy to close the global bandgap!

---

### 3. Dirac Cones: Zero-Loss Unidirectional Packet Bus
At the material boundary, electron dispersion forms **Dirac Cones**—energy linearly proportional to momentum ($E = \\hbar v_F |k|$), behaving like massless relativistic photons.

- **Spin-Momentum Locking (One-Way Routing):**
  An electron moving forward ($+k$) must have Spin-Up ($\\uparrow$). An electron moving backward ($-k$) must have Spin-Down ($\\downarrow$).
- **Suppression of Backscattering:**
  For an electron to bounce back from an impurity, it must flip its spin. But non-magnetic impurities cannot flip electron spins (protected by **Time-Reversal Symmetry** and **Kramers Degeneracy**).
- **The Result:** The packet *cannot* reflect. It simply glides around defects, creating a physical hardware bus with **zero packet collision and zero backscattering**.`,
        judgeVerdict: 'Flawless pedagogical synthesis. Mapped Berry curvature to state accumulators, Chern numbers to immutable root hashes, and spin-momentum locking to collisionless routing.',
        judgeVerdictUk: 'Блискучий педагогічний синтез. Пов\'язав кривизну Беррі з акумуляторами стану, числа Черна з незмінними хешами, а спін-імпульсне зв\'язування — з безколізійною маршрутизацією.',
        keyStrengths: ['Zero compromise on physics depth', 'Deep architectural resonance', 'Superb clarity of prose'],
        keyTradeoffs: ['None']
      },
      'nixima-0.2-pro': {
        modelId: 'nixima-0.2-pro',
        score: {
          overall: 94,
          accuracy: 99,
          reasoningDepth: 99,
          speedScore: 78,
          costEfficiency: 76,
          speedTokensPerSec: 24.8,
          timeToFirstTokenMs: 440,
          totalDurationSec: 5.7,
          grade: 'S',
          costFactor: '2.5x (Deep Reasoning)'
        },
        response: `### Topological Quantum Mechanics: Mathematical Foundation

1. **Hamiltonian & Berry Curvature:**
   $$H(k) = d_x(k)\\sigma_x + d_y(k)\\sigma_y + d_z(k)\\sigma_z$$
   The geometric connection $A(k) = i \\langle u_k | \\nabla_k u_k \\rangle$ yields field strength $\\Omega = \\nabla \\times A$.

2. **Topological Protection:**
   The bulk-boundary correspondence guarantees gapless edge modes when the bulk topological invariant $\\mathbb{Z}_2$ is non-trivial. Analogous to an invariant protocol invariant that holds under arbitrary Byzantine non-magnetic faults.`,
        judgeVerdict: 'Heavy mathematical formalism. Every equation is exact, though it leans more academic than the intuitive systems engineering metaphor requested.',
        judgeVerdictUk: 'Потужний математичний формалізм. Формули бездоганні, проте виклад більш академічний, ніж вимагала метафора для архітекторів.',
        keyStrengths: ['Mathematical rigor', 'Hamiltonian formulations'],
        keyTradeoffs: ['Less metaphorical balance than Flagship']
      },
      'nixima-0.2-coder': {
        modelId: 'nixima-0.2-coder',
        score: {
          overall: 85,
          accuracy: 89,
          reasoningDepth: 84,
          speedScore: 88,
          costEfficiency: 86,
          speedTokensPerSec: 41.8,
          timeToFirstTokenMs: 225,
          totalDurationSec: 3.3,
          grade: 'A',
          costFactor: '1.5x (Code Engine)'
        },
        response: `Topological Insulators can be conceptualized as a hardware-level network interface:
- **Core:** Sealed private subnet (air-gapped, zero packet throughput).
- **Boundary:** Hardware unidirectional fiber ring.
- **Chern Number:** An immutable checksum. You cannot modify packet trajectory without triggering a hardware fault.`,
        judgeVerdict: 'Concise and pragmatic. Clear technical analogies, though missing deeper discussion of the Dirac cone dispersion relation.',
        judgeVerdictUk: 'Лаконічно і практично. Зрозумілі технічні аналогії, хоча опущено детальний аналіз дисперсії конуса Дірака.',
        keyStrengths: ['Pragmatic network metaphor', 'Succinct summary'],
        keyTradeoffs: ['Less detail on Berry phase']
      },
      'nixima-0.2-flash': {
        modelId: 'nixima-0.2-flash',
        score: {
          overall: 82,
          accuracy: 85,
          reasoningDepth: 80,
          speedScore: 99,
          costEfficiency: 99,
          speedTokensPerSec: 68.8,
          timeToFirstTokenMs: 142,
          totalDurationSec: 1.7,
          grade: 'A',
          costFactor: '0.5x (Lightning Throughput)'
        },
        response: `**In short for software engineers:**
1. **Topological Insulator:** Like an encrypted token that cannot route traffic internally, but has an ultra-fast one-way event bus around its outer perimeter.
2. **Chern Number:** The topology's hash code. No local bugs or static can corrupt the signal.
3. **Dirac Cones:** Linear highway where electrons move with zero friction and cannot turn backward.`,
        judgeVerdict: 'Ultra-concise and easy to grasp in 10 seconds. Great for an executive quick-glance, but drops physical formulas.',
        judgeVerdictUk: 'Дуже лаконічно, читається за 10 секунд. Чудово для швидкого ознайомлення, але без формул.',
        keyStrengths: ['Fastest generation', 'Intuitive simplicity'],
        keyTradeoffs: ['Minimal mathematical detail']
      }
    }
  },

  // =========================================================================
  // SUITE 5: RAW THROUGHPUT, LATENCY & COMPUTE EFFICIENCY
  // =========================================================================
  {
    id: 'bench-throughput-speed',
    title: 'High-Throughput Latency, TTFT & Economic Efficiency Benchmark',
    titleUk: 'Швидкодія та вартість: Затримка, генерація токенів/с та оптимізація витрат',
    category: 'speed',
    domain: 'Inference Engine Benchmarking & Throughput Telemetry',
    difficulty: 'Standard',
    winnerModelId: 'nixima-0.2-flash',
    prompt: `Generate a structured, 1,000-token multi-stage security audit report for an OAuth 2.0 PKCE implementation. Measure Time-To-First-Token (TTFT), sustained token throughput (tokens/second), and compute credit consumption.`,
    promptUk: `Згенеруйте структурований звіт з аудиту безпеки протоколу OAuth 2.0 з розширенням PKCE. Виміряйте час до першого токена (TTFT), постійну швидкість генерації (токенів/сек) та споживання кредитів.`,
    contextDesc: 'Simulates high-volume enterprise document extraction and streaming response velocity across clusters.',
    contextDescUk: 'Симулює корпоративне створення звітів високої щільності та швидкість стрімінгу відповідей.',
    evaluationCriteria: [
      'Time to First Token (TTFT in milliseconds).',
      'Tokens per second generation velocity.',
      'Total completion turnaround time.',
      'Credit efficiency per 1k generated tokens.'
    ],
    evaluationCriteriaUk: [
      'Час до першого токена (TTFT у мс).',
      'Швидкість генерації (токенів на секунду).',
      'Загальний час завершення відповіді.',
      'Економічна ефективність на 1000 токенів.'
    ],
    results: {
      'nixima-0.2-flash': {
        modelId: 'nixima-0.2-flash',
        score: {
          overall: 99,
          accuracy: 90,
          reasoningDepth: 86,
          speedScore: 100,
          costEfficiency: 100,
          speedTokensPerSec: 71.4,
          timeToFirstTokenMs: 135,
          totalDurationSec: 1.4,
          grade: 'S+',
          costFactor: '0.5x (Lowest Cost)'
        },
        response: `### OAuth 2.0 PKCE Security Audit Report

- **Target Protocol:** RFC 7636 Proof Key for Code Exchange (PKCE)
- **Vulnerability Assessment:**
  1. *Code Verifier Entropy:* Minimum 43 to 128 characters verified (High Entropy).
  2. *Code Challenge Method:* Strict \`S256\` enforced. Rejection of \`plain\` challenge algorithm.
  3. *Authorization Code Replay:* Single-use transactional invalidation confirmed.
  4. *Redirect URI Whitelisting:* Exact domain and scheme validation without wildcard regex bypasses.

*Engine Telemetry: Delivered 420 tokens in 1.4 seconds at 71.4 tok/s.*`,
        judgeVerdict: 'The uncontested velocity champion. Immediate 135ms TTFT and over 71 tokens per second. Costs only 0.5x credits, making it the supreme choice for real-time streaming and high-volume parsing.',
        judgeVerdictUk: 'Беззаперечний лідер швидкості. Миттєвий TTFT 135 мс та понад 71 токен на секунду. Споживає лише 0.5x кредитів.',
        keyStrengths: ['Fastest TTFT (135ms)', 'Over 71 tokens/sec throughput', 'Minimal credit consumption'],
        keyTradeoffs: ['Less extensive analytical prose than Flagship']
      },
      'nixima-0.2-coder': {
        modelId: 'nixima-0.2-coder',
        score: {
          overall: 88,
          accuracy: 94,
          reasoningDepth: 90,
          speedScore: 89,
          costEfficiency: 86,
          speedTokensPerSec: 44.2,
          timeToFirstTokenMs: 215,
          totalDurationSec: 2.8,
          grade: 'S',
          costFactor: '1.5x (Code Engine)'
        },
        response: `### OAuth 2.0 PKCE Security Audit & Code Verification

\`\`\`typescript
// Constant-time comparison prevents timing attacks on code_verifier verification
import { timingSafeEqual, createHash } from 'crypto';

export function verifyCodeChallenge(verifier: string, challenge: string): boolean {
  const hash = createHash('sha256').update(verifier).digest('base64url');
  return timingSafeEqual(Buffer.from(hash), Buffer.from(challenge));
}
\`\`\`
- Enforces cryptographic constant-time comparison against side-channel timing exploits.`,
        judgeVerdict: 'Solid throughput (44.2 tok/s) with exceptional code verification snippets included.',
        judgeVerdictUk: 'Гарна швидкість (44.2 токенів/с) з якісними прикладами захищеного коду.',
        keyStrengths: ['Included constant-time crypto implementation', 'Strong speed'],
        keyTradeoffs: ['1.5x credit multiplier']
      },
      'nixima-0.2': {
        modelId: 'nixima-0.2',
        score: {
          overall: 85,
          accuracy: 96,
          reasoningDepth: 94,
          speedScore: 84,
          costEfficiency: 92,
          speedTokensPerSec: 37.5,
          timeToFirstTokenMs: 275,
          totalDurationSec: 3.2,
          grade: 'S',
          costFactor: '1.0x (Standard Flagship)'
        },
        response: `### Comprehensive OAuth 2.0 + PKCE Architectural Audit

1. **Client Identity & Token Lifecycle:**
   - Mitigates authorization code interception attacks on public mobile and single-page apps.
   - Requires dynamic client binding with strictly scoped JWT access tokens.
2. **Cross-Site Request Forgery (CSRF):**
   - Complementary \`state\` parameter verification alongside PKCE verifier checks.`,
        judgeVerdict: 'Balanced performance. 37.5 tok/s is very comfortable for human reading, accompanied by high-quality analysis.',
        judgeVerdictUk: 'Збалансована продуктивність. 37.5 токенів/с комфортні для читання в реальному часі.',
        keyStrengths: ['Great balance of speed and depth', 'Standard 1.0x cost'],
        keyTradeoffs: ['Slower than Flash']
      },
      'nixima-0.2-pro': {
        modelId: 'nixima-0.2-pro',
        score: {
          overall: 74,
          accuracy: 99,
          reasoningDepth: 99,
          speedScore: 71,
          costEfficiency: 74,
          speedTokensPerSec: 23.9,
          timeToFirstTokenMs: 465,
          totalDurationSec: 5.4,
          grade: 'A',
          costFactor: '2.5x (Deep Compute)'
        },
        response: `### Formal Security Proof of PKCE Security Properties

Given an eavesdropper $\\mathcal{A}$ observing the authorization response on a custom URI scheme:
$$\\Pr[\\mathcal{A}(\\text{code}) \\to \\text{Token}] \\le \\text{negl}(\\lambda)$$
Since $\\text{code\\_challenge} = \\text{SHA256}(\\text{code\\_verifier})$, computing the pre-image is computationally infeasible under the random oracle model.`,
        judgeVerdict: 'Deep formal proof under the Random Oracle Model. However, generation time was 5.4 seconds, making it overkill for simple audit summaries where speed is paramount.',
        judgeVerdictUk: 'Глибоке формальне доведення в моделі випадкового оракула, але час генерації 5.4 с завеликий для простих звітів.',
        keyStrengths: ['Formal cryptographic security reduction'],
        keyTradeoffs: ['Lowest throughput (23.9 tok/s), highest credit cost (2.5x)']
      }
    }
  }
];
