import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Flame, 
  RotateCcw,
  Star,
  Award
} from 'lucide-react';
import { NiximaUser } from '../types/user';
import { NiximaCreditLogo } from './NiximaCreditLogo';
import { InfinitySymbol } from './InfinitySymbol';
import { playCreditRamp, playSupernovaBang, playVaultUnlockChord, playTypingTick } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

export interface VipWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: NiximaUser | null;
  isPreview?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

export const VipWelcomeModal: React.FC<VipWelcomeModalProps> = ({
  isOpen,
  onClose,
  user,
  isPreview = false,
}) => {
  const { language } = useLanguage();
  const [slide, setSlide] = useState<1 | 2>(1);

  // Big Reveal Animation States
  const [revealPhase, setRevealPhase] = useState<'idle' | 'rising' | 'bang' | 'unlocked'>('idle');
  const [risingCredits, setRisingCredits] = useState(1000);
  const [screenShake, setScreenShake] = useState(false);
  const [flashBang, setFlashBang] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animIntervalRef = useRef<number | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSlide(1);
      setRevealPhase('idle');
      setRisingCredits(1000);
      setScreenShake(false);
      setFlashBang(false);
      setParticles([]);
      playVaultUnlockChord();
    }
  }, [isOpen]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const recipientName = user?.name || user?.handle || 'warexxq';

  // Trigger the Rising Credits -> Supernova Bang -> Infinity Animation
  const startSupernovaReveal = () => {
    if (revealPhase !== 'idle') return;
    setRevealPhase('rising');

    const duration = 2800; // 2.8s ramp
    const startTime = performance.now();
    let tickCounter = 0;

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Exponential credit count-up
      const currentNumber = Math.round(1000 + Math.pow(progress, 3) * 998999);
      setRisingCredits(currentNumber);

      tickCounter++;
      if (tickCounter % 2 === 0) {
        playCreditRamp(progress);
      }

      // Shaking starts in the final 30% of the countdown
      if (progress > 0.65) {
        setScreenShake(true);
      }

      if (progress >= 1) {
        clearInterval(interval);
        triggerBangExplosion();
      }
    }, 45);

    animIntervalRef.current = interval;
  };

  // The Explosive Supernova Bang
  const triggerBangExplosion = () => {
    setScreenShake(false);
    setFlashBang(true);
    setRevealPhase('bang');
    playSupernovaBang();

    // Spawn 50 iridescent explosion particles
    const colors = ['#38BDF8', '#818CF8', '#C084FC', '#F472B6', '#FBBF24', '#34D399', '#FFFFFF'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 4 + Math.random() * 9;
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
        opacity: 1,
      });
    }
    setParticles(newParticles);

    // Flash fades out quickly
    setTimeout(() => {
      setFlashBang(false);
      setRevealPhase('unlocked');
    }, 280);

    // Animate particles outward
    const pStart = performance.now();
    const pInterval = window.setInterval(() => {
      const elapsed = performance.now() - pStart;
      if (elapsed > 1600) {
        clearInterval(pInterval);
        setParticles([]);
        return;
      }
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.15, // slight gravity
          opacity: Math.max(0, 1 - elapsed / 1600),
        }))
      );
    }, 25);
  };

  const handleFinish = () => {
    playTypingTick();
    if (user?.id && !isPreview) {
      localStorage.setItem(`nixima_vip_welcome_seen_${user.id}`, 'true');
    }
    onClose();
  };

  const isUk = language === 'uk';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Supernova White Flashbang Overlay */}
      {flashBang && (
        <div className="fixed inset-0 z-50 bg-white/90 pointer-events-none transition-opacity duration-300 animate-in fade-in" />
      )}

      {/* Main Presentation Container with Screen Shake */}
      <div
        className={`relative w-full max-w-2xl bg-[#09090c] border border-zinc-700/80 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh] transition-transform ${
          screenShake ? 'animate-bounce' : ''
        }`}
        style={{
          boxShadow: '0 0 50px rgba(56, 189, 248, 0.12), 0 0 100px rgba(192, 132, 252, 0.08)',
        }}
      >
        {/* ============================================================== */}
        {/* 1. UPPER VISUAL BANNER WITH EMBEDDED ARTWORK & VIP BADGE      */}
        {/* ============================================================== */}
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-b from-[#14141e] via-[#0d0d14] to-[#09090c] border-b border-zinc-800/80 flex items-center justify-center overflow-hidden">
          {/* Ambient Cosmic Shimmer Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-zinc-950/20 to-transparent pointer-events-none" />
          
          {/* Subtle Geometric Prism Mesh Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="vipGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vipGrid)" />
          </svg>

          {/* Close / Dismiss Button (Top Right) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title={isUk ? 'Закрити' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Preview Badge Indicator */}
          {isPreview && (
            <div className="absolute top-4 left-4 z-20 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{isUk ? 'РЕЖИМ ПЕРЕГЛЯДУ (ТВОРЕЦЬ)' : 'CREATOR PREVIEW MODE'}</span>
            </div>
          )}

          {/* Centered Futuristic Emblem Art */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3 px-4">
            <div className="relative">
              {/* Outer Pulsing Halo */}
              <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-indigo-500/30 to-purple-500/25 blur-lg animate-pulse" />
              
              {/* Central Shield Token */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-[#0c0c10] border border-zinc-600 flex items-center justify-center shadow-xl">
                <NiximaCreditLogo size={32} glow />
              </div>
            </div>

            {/* VIP Invitation Header Ribbon */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-200">
                {isUk ? 'Особисте запрошення VIP-першопрохідця' : 'VIP Pioneer Sovereign Pass'}
              </span>
            </div>
          </div>
        </div>

        {/* Slide Tracker Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#0b0b0f] border-b border-zinc-800/80 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                slide === 1 ? 'bg-white' : 'bg-zinc-700'
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                slide === 2 ? 'bg-white' : 'bg-zinc-700'
              }`}
            />
            <span className="text-[11px] text-zinc-400 ml-1">
              {isUk ? `Розділ ${slide} з 2` : `Section ${slide} of 2`}
            </span>
          </div>

          {isPreview && slide === 2 && (
            <button
              onClick={() => {
                setRevealPhase('idle');
                setRisingCredits(1000);
                setScreenShake(false);
                setFlashBang(false);
                setParticles([]);
              }}
              className="text-[11px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isUk ? 'Скинути анімацію' : 'Replay Animation'}</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* ============================================================== */}
          {/* SLIDE 1: PERSONAL WELCOME LETTER FROM THE CREATOR              */}
          {/* ============================================================== */}
          {slide === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {isUk
                      ? `Ласкаво просимо до Nixima AI, ${recipientName}!`
                      : `Welcome to Nixima AI, ${recipientName}!`}
                  </h3>
                </div>
                <p className="text-xs font-mono text-zinc-400">
                  {isUk
                    ? `Nixima ID: ${user?.email || 'warexxq@nixima.ai'} • Особистий доступ від автора`
                    : `Nixima ID: ${user?.email || 'warexxq@nixima.ai'} • Creator Personal Invitation`}
                </p>
              </div>

              {/* Letter Parchment Container */}
              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-sm leading-relaxed space-y-3.5 shadow-inner">
                <p className="text-zinc-200">
                  {isUk ? (
                    <>
                      Привіт, <strong className="text-white font-mono">{recipientName}</strong>! Дуже дякую, що приєднався та вирішив завітати і спробувати мій новий проєкт <strong>Nixima AI</strong>. Для мене велика радість бачити тебе тут серед найперших, хто випробовує цю систему.
                    </>
                  ) : (
                    <>
                      Hey <strong className="text-white font-mono">{recipientName}</strong>! Thank you for joining and taking the time to check out and explore my new AI project, <strong>Nixima AI</strong>. It means a lot to have you here among the very first people exploring what I've built.
                    </>
                  )}
                </p>

                <p className="text-zinc-300 text-xs sm:text-sm">
                  {isUk ? (
                    <>
                      Я створив цей асистент для глибокого мислення, швидкого програмування та складних технічних задач із підтримкою LaTeX формул і високої швидкості. Спеціально для тебе, як для близького друга, я налаштував постійний VIP-кліренс.
                    </>
                  ) : (
                    <>
                      I designed this neural studio for deep reasoning, rapid code synthesis, and advanced technical research with native LaTeX math rendering and zero latency. Specifically for you as a valued friend, I have configured permanent VIP clearance.
                    </>
                  )}
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-bold">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{isUk ? 'Фронтирні моделі' : 'Frontier Models'}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {isUk ? 'Flash, Coder та DeepThink' : 'Flash, Coder & DeepThink Reasoning'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[11px] font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isUk ? 'Швидкість стрімінгу' : 'Pure Throughput'}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {isUk ? 'Миттєва відповідь без затримок' : 'Immediate real-time streaming'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[11px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isUk ? 'Суверенний доступ' : 'Sovereign VIP'}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {isUk ? 'Нульові обмеження назавжди' : 'Zero token constraints forever'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: Proceed to Section 2 */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    playTypingTick();
                    setSlide(2);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>{isUk ? 'Далі: Отримати VIP Кліренс' : 'Next: Claim Your VIP Clearance'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SLIDE 2: THE REVEAL (RISING COUNTER -> BANG -> INFINITY)       */}
          {/* ============================================================== */}
          {slide === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1.5">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  {isUk ? 'Активація суверенного балансу' : 'Sovereign Compute Allocation'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  {isUk
                    ? 'Твій обліковий запис отримує особливий статус у нейромережевому кластері Nixima.'
                    : 'Your account is being granted exclusive unlimited status across the Nixima neural cluster.'}
                </p>
              </div>

              {/* The Interactive Supernova Reveal Card */}
              <div className="relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-2xl flex flex-col items-center justify-center min-h-[220px] overflow-hidden text-center">
                {/* Explosion Particles Flying Outward */}
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none z-30"
                    style={{
                      transform: `translate(${p.x}px, ${p.y}px)`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      backgroundColor: p.color,
                      opacity: p.opacity,
                      boxShadow: `0 0 6px ${p.color}`,
                    }}
                  />
                ))}

                {/* PHASE 1: IDLE */}
                {revealPhase === 'idle' && (
                  <div className="space-y-4 py-2 animate-in fade-in">
                    <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
                      <NiximaCreditLogo size={16} />
                      <span>{isUk ? 'Стандартний стартовий баланс:' : 'Default Starter Balance:'}</span>
                    </div>

                    <div className="text-3xl font-extrabold font-mono text-zinc-300">
                      1,000 <span className="text-xs text-zinc-400">CR</span>
                    </div>

                    <button
                      onClick={startSupernovaReveal}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 cursor-pointer mx-auto"
                    >
                      <Zap className="w-4 h-4 fill-black" />
                      <span>{isUk ? '⚡ Активувати VIP-безліміт' : '⚡ Activate VIP Unlimited Access'}</span>
                    </button>
                  </div>
                )}

                {/* PHASE 2: RISING COUNTER */}
                {revealPhase === 'rising' && (
                  <div className="space-y-3 py-2 animate-in zoom-in-95">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider animate-pulse">
                      <Flame className="w-4 h-4 text-cyan-400" />
                      <span>{isUk ? 'Синхронізація ліміту...' : 'Ramping Neural Compute...'}</span>
                    </div>

                    <div className="text-5xl font-black font-mono tracking-tight text-white tabular-nums drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
                      {risingCredits.toLocaleString()}
                      <span className="text-sm text-zinc-400 ml-2">CR</span>
                    </div>

                    <div className="w-48 h-1.5 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 animate-pulse w-full" />
                    </div>
                  </div>
                )}

                {/* PHASE 3 & 4: SUPERNOVA EXPLODED & INFINITY UNLOCKED */}
                {(revealPhase === 'bang' || revealPhase === 'unlocked') && (
                  <div className="space-y-4 py-2 animate-in zoom-in-90 duration-500 flex flex-col items-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isUk ? 'БЕЗЛІМІТНИЙ КЛІРЕНС АКТИВОВАНО' : 'SOVEREIGN INFINITY GRANTED'}</span>
                    </div>

                    {/* Prominent Iridescent Infinity Symbol with Dual Glow */}
                    <div className="flex items-baseline justify-center gap-3 pt-1">
                      <NiximaCreditLogo size={28} className="self-center" />
                      <div className="transform scale-125 py-2">
                        <InfinitySymbol size={44} glow animated />
                      </div>
                      <span className="text-lg font-bold font-mono text-zinc-300 self-center">
                        CR
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 max-w-sm leading-relaxed">
                      {isUk
                        ? 'Тобі надано повний суверенний доступ: баланс ніколи не зменшується, а будь-які найскладніші запити завжди безкоштовні.'
                        : 'Your account has sovereign infinite clearance. Credits never deduct, and all intense reasoning queries remain 100% free forever.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Enter Studio */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    playTypingTick();
                    setSlide(1);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isUk ? '← Назад до листа' : '← Back to Letter'}
                </button>

                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-glow-subtle cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>
                    {isUk
                      ? isPreview
                        ? 'Закрити попередній перегляд'
                        : 'Увійти до студії Nixima AI'
                      : isPreview
                      ? 'Close Preview'
                      : 'Enter Nixima AI Studio'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
