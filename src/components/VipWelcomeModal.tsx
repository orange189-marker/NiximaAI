import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  Heart
} from 'lucide-react';
import { NiximaUser } from '../types/user';
import { NiximaCreditLogo } from './NiximaCreditLogo';
import { InfinitySymbol } from './InfinitySymbol';
import { CountryFlag } from './CountryFlag';
import { playCreditRamp, playSupernovaBang, playVaultUnlockChord, playTypingTick } from '../utils/sound';
import { isDadAccount } from '../utils/auth';

export interface VipWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: NiximaUser | null;
  isPreview?: boolean;
}

type PresentationLang = 'ru' | 'uk' | 'en';

export const VipWelcomeModal: React.FC<VipWelcomeModalProps> = ({
  isOpen,
  onClose,
  user,
  isPreview = false,
}) => {
  const isDad = 
    isDadAccount(user) ||
    (user?.handle || '').toLowerCase() === 'roman1980' || 
    (user?.email || '').toLowerCase() === 'roman1980@nixima.ai' ||
    (user?.handle || '').toLowerCase().includes('roman') ||
    (user?.handle || '').toLowerCase().includes('tato') ||
    (user?.name || '').toLowerCase().includes('роман') ||
    (user?.name || '').toLowerCase().includes('тато');

  // Language selector: strictly 'uk' for dad, 'ru' by default for others
  const [lang, setLang] = useState<PresentationLang>(() => isDad ? 'uk' : 'ru');

  useEffect(() => {
    if (isDad) {
      setLang('uk');
    }
  }, [isDad, user]);

  // Automatic Credit Ramp & Infinity Reveal States
  const [phase, setPhase] = useState<'starting' | 'counting' | 'burst' | 'infinite'>('starting');
  const [displayCredits, setDisplayCredits] = useState(1000);
  const [isPulsing, setIsPulsing] = useState(false);
  const animTimeoutRef = useRef<number | null>(null);
  const animIntervalRef = useRef<number | null>(null);

  // Auto-run the animation sequence whenever modal opens
  useEffect(() => {
    if (isOpen) {
      playVaultUnlockChord();
      runAnimationSequence();
    } else {
      clearAnimationTimers();
    }
  }, [isOpen]);

  const clearAnimationTimers = () => {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
  };

  const runAnimationSequence = () => {
    clearAnimationTimers();
    setPhase('starting');
    setDisplayCredits(1000);
    setIsPulsing(false);

    // Automatic start after a brief 400ms pause so the user sees the starter 1,000 CR
    animTimeoutRef.current = window.setTimeout(() => {
      setPhase('counting');
      const startTime = performance.now();
      const duration = 2100; // 2.1s smooth acceleration
      let tickCounter = 0;

      animIntervalRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Exponential cubic interpolation: 1,000 -> 999,999
        const currentVal = Math.round(1000 + Math.pow(progress, 3) * 998999);
        setDisplayCredits(currentVal);

        tickCounter++;
        if (tickCounter % 2 === 0) {
          playCreditRamp(progress);
        }

        if (progress >= 1) {
          if (animIntervalRef.current) clearInterval(animIntervalRef.current);
          // Transition directly to burst and infinite reveal
          setPhase('burst');
          setIsPulsing(true);
          playSupernovaBang();

          // Smoothly reveal the Iridescent Infinity symbol
          setTimeout(() => {
            setPhase('infinite');
            setTimeout(() => setIsPulsing(false), 800);
          }, 250);
        }
      }, 40);
    }, 450);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => clearAnimationTimers();
  }, []);

  if (!isOpen) return null;

  const recipientName = user?.name || user?.handle || (isDad ? 'roman1980' : 'warexxq');

  const handleFinish = () => {
    playTypingTick();
    if (user?.id && !isPreview) {
      localStorage.setItem(`nixima_vip_welcome_seen_${user.id}`, 'true');
      if (isDad) {
        localStorage.setItem('nixima_vip_welcome_seen_usr-vip-roman1980', 'true');
      }
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Sleek, solid, non-bouncing dialog window matching Nixima's titanium design */}
      {/* Proportionally tailored for Samsung Galaxy S25 screen and mobile viewports */}
      <div 
        className="relative w-full max-w-xl bg-[#0b0b0f] border border-zinc-700/80 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
        style={{
          boxShadow: isDad 
            ? '0 0 50px rgba(59, 130, 246, 0.18), 0 0 80px rgba(99, 102, 241, 0.12)'
            : '0 0 50px rgba(56, 189, 248, 0.12), 0 0 80px rgba(129, 140, 248, 0.08)'
        }}
      >
        {/* ================================================================= */}
        {/* 1. TOP HEADER WITH CONTROLS & BADGE                              */}
        {/* ================================================================= */}
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-[#101017] border-b border-zinc-800/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shadow-inner shrink-0">
              <NiximaCreditLogo size={13} />
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-zinc-200 truncate">
                {isDad ? 'Nixima Family Clearance' : 'Nixima VIP Sovereign Access'}
              </span>
              {isPreview && (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  PREVIEW
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* For dad: strictly Ukrainian badge. For others: RU/UA/EN switcher */}
            {isDad ? (
              <div className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] sm:text-[11px] font-mono font-semibold text-zinc-200 flex items-center gap-1.5 select-none shadow-sm">
                <CountryFlag country="ua" size="xs" />
                <span>UA • УКРАЇНСЬКА</span>
              </div>
            ) : (
              <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => { setLang('ru'); playTypingTick(); }}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    lang === 'ru'
                      ? 'bg-zinc-700 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Читать на русском"
                >
                  RU
                </button>
                <button
                  type="button"
                  onClick={() => { setLang('uk'); playTypingTick(); }}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    lang === 'uk'
                      ? 'bg-zinc-700 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Читати українською"
                >
                  UA
                </button>
                <button
                  type="button"
                  onClick={() => { setLang('en'); playTypingTick(); }}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-zinc-700 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Read in English"
                >
                  EN
                </button>
              </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={handleFinish}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700 transition-colors cursor-pointer"
              title={isDad ? 'Закрити' : 'Закрыть'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. COMPACT UPPER CREDIT TRANSFORMATION CARD (Tailored for S25)    */}
        {/* ================================================================= */}
        <div className="relative px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-gradient-to-b from-[#13131d] via-[#0d0d14] to-[#0b0b0f] border-b border-zinc-800/80 overflow-hidden shrink-0">
          {/* Subtle Ambient Radial Energy Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

          {/* Smooth vector energy pulse upon reaching infinity */}
          {isPulsing && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-purple-500/20 to-cyan-500/15 animate-pulse pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4">
            {/* Left: Account Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-lg">
                  <NiximaCreditLogo size={18} glow={phase === 'infinite'} />
                </div>
                {phase === 'infinite' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                  <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="uppercase tracking-wider font-semibold text-zinc-300 truncate">
                    {isDad || lang === 'uk' ? 'Баланс:' : lang === 'ru' ? 'Баланс:' : 'Balance:'}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-white truncate">
                  {isDad ? 'roman1980 • Сім\'я Творця' : `${recipientName} • VIP`}
                </div>
              </div>
            </div>

            {/* Right: The Automatic Number Acceleration & Infinity Transform */}
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/90 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-inner shrink-0 relative">
              {phase !== 'infinite' ? (
                /* Dynamic Counting State */
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-base sm:text-xl font-black tracking-tight text-white transition-all">
                    {displayCredits.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-400">CR</span>
                </div>
              ) : (
                /* Revealed Sovereign Iridescent Infinity Symbol */
                <div className="flex items-center gap-2 animate-in fade-in zoom-in-90 duration-300">
                  <div className="transform scale-90 sm:scale-100 py-0.5">
                    <InfinitySymbol size={24} glow animated />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] sm:text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide leading-none">
                      {isDad || lang === 'uk' ? 'Безліміт' : lang === 'ru' ? 'Бесконечно' : 'Infinite'}
                    </span>
                    <span className="block text-[9px] sm:text-[10px] font-mono text-zinc-400 leading-tight">
                      0 CR {isDad || lang === 'uk' ? 'списання' : lang === 'ru' ? 'списание' : 'cost'}
                    </span>
                  </div>
                </div>
              )}

              {/* Replay Button for the animation */}
              <button
                type="button"
                onClick={runAnimationSequence}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-600 text-zinc-400 hover:text-white transition-all shadow-sm cursor-pointer ml-0.5"
                title={isDad || lang === 'uk' ? 'Повторити анімацію' : lang === 'ru' ? 'Повторить анимацию' : 'Replay animation'}
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. PRESENTATION LETTER BODY                                        */}
        {/* ================================================================= */}
        <div 
          className="flex-1 overflow-y-auto px-4 py-3.5 sm:p-6 space-y-3.5 sm:space-y-4 text-[13px] sm:text-sm leading-relaxed text-zinc-300 font-sans"
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Greeting Header */}
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>
                {isDad 
                  ? 'Привіт, тату! Ласкаво просимо до Nixima AI'
                  : lang === 'ru'
                  ? `Привет, ${recipientName}! Добро пожаловать в Nixima AI`
                  : lang === 'uk'
                  ? `Привіт, ${recipientName}! Ласкаво просимо до Nixima AI`
                  : `Hey ${recipientName}! Welcome to Nixima AI`}
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 inline" />
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>
                {isDad
                  ? 'Особистий лист від твого сина Богдана (orange17)'
                  : lang === 'ru'
                  ? 'Личное обращение создателя проекта (orange17)'
                  : lang === 'uk'
                  ? 'Особисте звернення творця проєкту (orange17)'
                  : 'Personal note from the creator (orange17)'}
              </span>
            </div>
          </div>

          {/* DAD SPECIAL VIEW - STRICTLY UKRAINIAN ONLY */}
          {isDad ? (
            <div className="space-y-3 text-zinc-300 text-[13px] sm:text-sm">
              <p>
                Привіт, тату! Щиро дякую тобі за підтримку та за те, що зайшов подивитися на мій штучний інтелект, над створенням якого я зараз працюю! Для мене надзвичайно важливо і приємно показати тобі цей результат.
              </p>

              <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Що вміє Nixima AI:</span>
                </div>
                <ul className="text-xs space-y-1.5 text-zinc-300 list-disc list-inside">
                  <li><strong className="text-white">Відповіді на будь-які питання:</strong> життєві, практичні, побутові чи технічні теми простою і зрозумілою мовою.</li>
                  <li><strong className="text-white">Пошук в інтернеті в реальному часі:</strong> отримання найсвіжіших фактів, новин та інформації.</li>
                  <li><strong className="text-white">Глибоке мислення (DeepThink):</strong> покроковий аналітичний розбір найскладніших питань та розрахунків.</li>
                  <li><strong className="text-white">Математичні формули LaTeX:</strong> чітке і красиве відображення обчислень, таблиць і даних.</li>
                </ul>
              </div>

              <p>
                Спеціально для тебе я підготував цей акаунт із <strong className="text-white">повним сімейним безлімітом: нескінченні кредити (∞ CR)</strong>. Баланс ніколи не списується (0 CR списання) і ніколи не закінчиться, тому ти можеш писати будь-які запити та вільно користуватися всіма можливостями штучного інтелекту без жодних обмежень.
              </p>

              <p className="text-zinc-400">
                Заходь у будь-який зручний час, став будь-які питання і обов'язково кажи мені свої враження або що ще хотілося б покращити — твоя підтримка для мене найдорожча!
              </p>

              {/* Signature */}
              <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Твій син Богдан (orange17)</span>
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 shrink-0 inline" />
                  </div>
                  <div className="text-[11px] text-zinc-500">Творець & Архітектор Nixima AI</div>
                </div>
                <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                  roman1980@nixima.ai
                </div>
              </div>
            </div>
          ) : (
            /* WAREXXQ / GENERAL VIP VIEW */
            <>
              {/* Letter Body - Russian Default */}
              {lang === 'ru' && (
                <div className="space-y-3.5 text-zinc-300 text-[13px] sm:text-sm">
                  <p>
                    Спасибо огромное, что зашел оценить мой проект и посмотреть на искусственный интеллект, над которым я сейчас упорно работаю! Для меня действительно важно и ценно, чтобы ты протестировал платформу лично.
                  </p>

                  <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Что умеет Nixima AI:</span>
                    </div>
                    <ul className="text-xs space-y-1.5 text-zinc-300 list-disc list-inside">
                      <li><strong className="text-white">Кластер нейросетей:</strong> переключение между быстрыми, программными и глубоко мыслящими моделями.</li>
                      <li><strong className="text-white">Режим DeepThink:</strong> пошаговое аналитическое мышление для решения математических и логических задач.</li>
                      <li><strong className="text-white">Поддержка LaTeX:</strong> чистый и красивый рендеринг любых формул и вычислений.</li>
                      <li><strong className="text-white">Веб-поиск в реальном времени:</strong> доступ к актуальной информации из интернета прямо во время генерации.</li>
                    </ul>
                  </div>

                  <p>
                    Специально для тебя я создал этот готовый аккаунт. У тебя активирован <strong className="text-white">полный суверенный безлимит: бесконечные кредиты (∞ CR)</strong>. Кредиты никогда не списываются, поэтому ты можешь свободно слать любые, даже самые тяжелые и длинные запросы, без ограничений.
                  </p>

                  <p className="text-zinc-400">
                    Пробуй всё, что угодно, тестируй в реальных задачах и обязательно делись своими впечатлениями или критикой — твой честный фидбек поможет мне сделать Nixima еще сильнее!
                  </p>

                  {/* Signature */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white">Богдан (orange17)</div>
                      <div className="text-zinc-500">Создатель & Архитектор Nixima AI</div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      warexxq@nixima.ai
                    </div>
                  </div>
                </div>
              )}

              {/* Letter Body - Ukrainian Translation */}
              {lang === 'uk' && (
                <div className="space-y-3.5 text-zinc-300 text-[13px] sm:text-sm">
                  <p>
                    Щиро дякую, що завітав оцінити мій проєкт та поглянути на штучний інтелект, над яким я зараз працюю! Для мене дуже важливо і приємно, що ти вирішив протестувати платформу наживо.
                  </p>

                  <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Можливості платформи Nixima AI:</span>
                    </div>
                    <ul className="text-xs space-y-1.5 text-zinc-300 list-disc list-inside">
                      <li><strong className="text-white">Кластер моделей:</strong> швидкі, спеціалізовані кодерські та глибокі моделі мислення.</li>
                      <li><strong className="text-white">Режим DeepThink:</strong> покроковий аналітичний розбір найскладніших технічних завдань.</li>
                      <li><strong className="text-white">Рендеринг LaTeX:</strong> бездоганне відображення математичних виразів і фізичних формул.</li>
                      <li><strong className="text-white">Веб-пошук у реальному часі:</strong> отримання свіжих даних з мережі безпосередньо у відповіді.</li>
                    </ul>
                  </div>

                  <p>
                    Спеціально для тебе я підготував цей готовий обліковий запис. Тут діє <strong className="text-white">повний суверенний безліміт: нескінченні кредити (∞ CR)</strong>. Баланс ніколи не зменшується (0 CR списування), тому ти можеш відправляти будь-які об'ємні запити та експериментувати без обмежень.
                  </p>

                  <p className="text-zinc-400">
                    Користуйся із задоволенням, перевіряй у роботі та неодмінно ділися своїми думками чи порадами — твій зворотний зв'язок для мене безцінний!
                  </p>

                  {/* Signature */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white">Богдан (orange17)</div>
                      <div className="text-zinc-500">Творець & Архітектор Nixima AI</div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      warexxq@nixima.ai
                    </div>
                  </div>
                </div>
              )}

              {/* Letter Body - English Translation */}
              {lang === 'en' && (
                <div className="space-y-3.5 text-zinc-300 text-[13px] sm:text-sm">
                  <p>
                    Thank you so much for dropping by to check out my project and explore the AI platform I've been actively building! It means a great deal to me that you took the time to test it out firsthand.
                  </p>

                  <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Key Nixima AI Capabilities:</span>
                    </div>
                    <ul className="text-xs space-y-1.5 text-zinc-300 list-disc list-inside">
                      <li><strong className="text-white">Neural Cluster:</strong> Switch seamlessly between lightning-fast, coder, and frontier reasoning models.</li>
                      <li><strong className="text-white">DeepThink Mode:</strong> Multi-step analytical chain-of-thought for mathematical and structural problems.</li>
                      <li><strong className="text-white">Native LaTeX Rendering:</strong> Crisp, publication-grade math formatting.</li>
                      <li><strong className="text-white">Live Web Exploration:</strong> Real-time internet search integrated into reasoning loops.</li>
                    </ul>
                  </div>

                  <p>
                    I set up this ready account for you with <strong className="text-white">permanent sovereign clearance: infinite credits (∞ CR)</strong>. Credits never deduct (0 CR cost), allowing you to freely explore and run heavy computational queries forever.
                  </p>

                  <p className="text-zinc-400">
                    Explore as much as you like, test any real-world tasks, and let me know your thoughts — your honest feedback is super valuable to me!
                  </p>

                  {/* Signature */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white">Bogdan (orange17)</div>
                      <div className="text-zinc-500">Creator & Lead Architect of Nixima AI</div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      warexxq@nixima.ai
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ================================================================= */}
        {/* 4. FOOTER WITH COMFORTABLE ACTION BUTTON (Galaxy S25 Touch Target)*/}
        {/* ================================================================= */}
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-[#101017] border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-[10px] sm:text-[11px] font-mono text-zinc-500 hidden sm:flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Nixima Sovereign Mesh v0.1</span>
          </div>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto h-11 sm:h-10 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-glow-subtle cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>
              {isDad || lang === 'uk' 
                ? 'Увійти до студії Nixima AI' 
                : lang === 'ru' 
                ? 'Перейти к Nixima AI' 
                : 'Enter Nixima AI Studio'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
