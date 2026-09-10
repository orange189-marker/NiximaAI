/**
 * Web Audio API synthesizer for futuristic subtle mechanical ticks and completion chimes.
 * Zero external audio files required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a subtle, crisp synthetic mechanical keystroke sound (10-15ms duration)
 */
export function playTypingTick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Randomize pitch slightly for organic mechanical feel
    const baseFreq = 800 + Math.random() * 200;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {
    // Ignore audio errors if blocked by browser policy
  }
}

/**
 * Play a subtle completion chime when the stream completes
 */
export function playCompletionChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Ignore
  }
}

/**
 * Play a high-tech optic shutter micro-tick for eye visibility toggle
 */
export function playOpticToggle(isRevealing: boolean): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (isRevealing) {
      // Ascending crisp chirping focus sound (opening eye)
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1350, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } else {
      // Descending crisp lock sound (crossing eye)
      osc.frequency.setValueAtTime(1150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    }
  } catch (e) {
    // Ignore
  }
}

/**
 * Play a cinematic cybernetic vault unlock chord when successfully authenticating / entering workspace
 */
export function playVaultUnlockChord(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Harmonic frequencies for majestic high-tech chord: A4, E5, A5
    const freqs = [440, 659.25, 880];
    const startTime = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.8, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.08);

      const delay = idx * 0.04;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.setValueAtTime(0.03, startTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35 + delay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + delay);
      osc.stop(startTime + 0.35 + delay);
    });
  } catch (e) {
    // Ignore
  }
}

/**
 * Play a futuristic subtle soft laser/coin spend micro-tone when credits are deducted
 */
export function playCreditSpendSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(780, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {
    // Ignore
  }
}

/**
 * Play an ascending crystal sparkle chime when credits are granted
 */
export function playCreditGrantSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [650, 980, 1320];
    const startTime = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.035);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.setValueAtTime(0.03, startTime + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.035 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.035);
      osc.stop(startTime + idx * 0.035 + 0.12);
    });
  } catch (e) {
    // Ignore
  }
}

/**
 * Play progressive pitch-rising tick as credit counter ramps up
 */
export function playCreditRamp(progress: number): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const clamped = Math.max(0, Math.min(1, progress));
    const freq = 420 + Math.pow(clamped, 2) * 1400;

    osc.type = clamped > 0.8 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.08, ctx.currentTime + 0.025);

    const volume = 0.02 + clamped * 0.035;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  } catch (e) {
    // Ignore
  }
}

/**
 * Play powerful synthesized supernova explosion impact with celestial harmonic resonance
 */
export function playSupernovaBang(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Heavy sub-bass impact drop
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.6);
    subGain.gain.setValueAtTime(0.22, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // 2. Punchy noise-like burst
    const burstOsc = ctx.createOscillator();
    const burstGain = ctx.createGain();
    burstOsc.type = 'sawtooth';
    burstOsc.frequency.setValueAtTime(450, now);
    burstOsc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
    burstGain.gain.setValueAtTime(0.12, now);
    burstGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    burstOsc.connect(burstGain);
    burstGain.connect(ctx.destination);
    burstOsc.start(now);
    burstOsc.stop(now + 0.22);

    // 3. Ethereal ascending celestial chime chord (C5, E5, G5, C6)
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.02);

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.setValueAtTime(0.06, now + 0.06 + idx * 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc.start(now + 0.06 + idx * 0.02);
      chimeOsc.stop(now + 1.6);
    });
  } catch (e) {
    // Ignore
  }
}



