import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, Activity } from 'lucide-react';

export type WallpaperStyle = 'neural' | 'matrix' | 'waves';

interface DynamicWallpaperProps {
  currentStyle?: WallpaperStyle;
  onStyleChange?: (style: WallpaperStyle) => void;
}

export const DynamicWallpaper: React.FC<DynamicWallpaperProps> = ({
  currentStyle = 'neural',
  onStyleChange,
}) => {
  const [style, setStyle] = useState<WallpaperStyle>(currentStyle);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; radius: number }>({ x: -1000, y: -1000, radius: 160 });

  const handleSelectStyle = (newStyle: WallpaperStyle) => {
    setStyle(newStyle);
    if (onStyleChange) onStyleChange(newStyle);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ==========================================
    // 1. NEURAL MESH MODE SETUP
    // ==========================================
    const particleCount = Math.min(Math.floor((width * height) / 12000), 90);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Packet pulses traveling along connection lines
    const pulses: Array<{
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }> = [];

    // ==========================================
    // 2. CYBER MATRIX MODE SETUP
    // ==========================================
    const chars = '01NIXIMA01AI789XYZ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    // ==========================================
    // 3. QUANTUM WAVES MODE SETUP
    // ==========================================
    let waveTick = 0;

    // ==========================================
    // MAIN RENDER LOOP
    // ==========================================
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- STYLE 1: NEURAL MESH ---
      if (style === 'neural') {
        // Draw connection lines
        const maxDist = 130;
        const mouseDist = mouseRef.current.radius;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];

          // Update position
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;

          // Connect with other particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.18;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();

              // Spawn dynamic data packet occasionally
              if (Math.random() < 0.0006 && pulses.length < 15) {
                pulses.push({
                  fromIdx: i,
                  toIdx: j,
                  progress: 0,
                  speed: 0.015 + Math.random() * 0.02,
                });
              }
            }
          }

          // Connect with mouse cursor
          const mdx = p1.x - mouseRef.current.x;
          const mdy = p1.y - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouseDist) {
            const mAlpha = (1 - mdist / mouseDist) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Gentle repulsion away from mouse
            p1.x += (mdx / mdist) * 0.5;
            p1.y += (mdy / mdist) * 0.5;
          }

          // Draw node particle
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p1.alpha})`;
          ctx.fill();

          // Subtle glow on node
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 0;
        }

        // Draw and update active data packet pulses
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pulse = pulses[k];
          pulse.progress += pulse.speed;

          if (pulse.progress >= 1 || !particles[pulse.fromIdx] || !particles[pulse.toIdx]) {
            pulses.splice(k, 1);
            continue;
          }

          const fromP = particles[pulse.fromIdx];
          const toP = particles[pulse.toIdx];
          const curX = fromP.x + (toP.x - fromP.x) * pulse.progress;
          const curY = fromP.y + (toP.y - fromP.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // --- STYLE 2: CYBER MATRIX STREAM ---
      else if (style === 'matrix') {
        ctx.fillStyle = 'rgba(7, 7, 9, 0.2)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Head of the stream is pure bright white
          ctx.fillStyle = '#ffffff';
          ctx.fillText(char, x, y);

          // Trail text is silver/zinc
          ctx.fillStyle = 'rgba(180, 180, 190, 0.4)';
          const prevChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(prevChar, x, y - fontSize);

          if (y > height && Math.random() > 0.985) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      // --- STYLE 3: QUANTUM WAVES ---
      else if (style === 'waves') {
        waveTick += 0.015;
        const waveCount = 5;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseHeight = height * 0.5 + Math.sin(waveTick + w) * 80;
          const amplitude = 50 + w * 25;
          const frequency = 0.002 + w * 0.001;

          ctx.moveTo(0, baseHeight);
          for (let x = 0; x <= width; x += 10) {
            const y = baseHeight + Math.sin(x * frequency + waveTick + w) * amplitude;
            ctx.lineTo(x, y);
          }

          const alpha = 0.08 + w * 0.03;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [style]);

  return (
    <>
      {/* Background HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Floating Theme / Wallpaper Style Switcher Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 bg-zinc-950/80 border border-zinc-800/80 rounded-full backdrop-blur-xl shadow-2xl text-[11px] font-mono select-none">
        <span className="px-2 text-zinc-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
          <Activity className="w-3 h-3 text-zinc-400" />
          <span>Wallpaper:</span>
        </span>

        <button
          type="button"
          onClick={() => handleSelectStyle('neural')}
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            style === 'neural'
              ? 'bg-white text-black font-bold shadow-glow-subtle'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Neural Mesh</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectStyle('matrix')}
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            style === 'matrix'
              ? 'bg-white text-black font-bold shadow-glow-subtle'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Cyber Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectStyle('waves')}
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            style === 'waves'
              ? 'bg-white text-black font-bold shadow-glow-subtle'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>Quantum Waves</span>
        </button>
      </div>
    </>
  );
};
