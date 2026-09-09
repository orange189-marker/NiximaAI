import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  ringRadius?: number;
  ringAlpha?: number;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulse: number;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export const DynamicWallpaper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupDimensions = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    setupDimensions();
    window.addEventListener('resize', setupDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ==============================================================
    // 1. BACKGROUND DEEP STARFIELD (Distant 3D Particles)
    // ==============================================================
    const starCount = Math.min(Math.floor((width * height) / 9000), 110);
    const stars: StarParticle[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // Depth factor
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.15, // Slow upward ambient drift
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // ==============================================================
    // 2. NEURAL CONSTELLATION NODES
    // ==============================================================
    const nodeCount = Math.min(Math.floor((width * height) / 14000), 75);
    const nodes: Particle[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.35,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
        ringRadius: 0,
        ringAlpha: 0,
      });
    }

    // Dynamic data packets gliding through connections
    const packets: DataPacket[] = [];
    let tick = 0;

    // ==============================================================
    // 3. ANIMATION RENDER LOOP (60 FPS)
    // ==============================================================
    const render = () => {
      tick += 0.02;

      // Smooth mouse interpolation (spring feel)
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      }

      // Clear canvas with deep void tone
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // --- Ambient Radial Glow in the center/card area ---
      const ambientGlow = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.45,
        Math.max(width, height) * 0.65
      );
      ambientGlow.addColorStop(0, 'rgba(28, 28, 36, 0.45)');
      ambientGlow.addColorStop(0.5, 'rgba(14, 14, 18, 0.25)');
      ambientGlow.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // --- Draw Distant Ambient Starfield ---
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += star.vx * star.z;
        star.y += star.vy * star.z;
        star.pulse += 0.02;

        // Wrap around boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const currentAlpha = star.alpha + Math.sin(star.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * star.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 225, 240, ${Math.max(0.05, currentAlpha)})`;
        ctx.fill();
      }

      // --- Draw Neural Constellation Connections & Nodes ---
      const maxConnectDist = 145;
      const mouseRadius = 180;

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Particle movement
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Soft screen bounds bounce
        if (n1.x < 20) {
          n1.x = 20;
          n1.vx = Math.abs(n1.vx);
        } else if (n1.x > width - 20) {
          n1.x = width - 20;
          n1.vx = -Math.abs(n1.vx);
        }
        if (n1.y < 20) {
          n1.y = 20;
          n1.vy = Math.abs(n1.vy);
        } else if (n1.y > height - 20) {
          n1.y = height - 20;
          n1.vy = -Math.abs(n1.vy);
        }

        // Connection lines between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const factor = 1 - dist / maxConnectDist;
            const lineAlpha = factor * factor * 0.22; // Smooth quadratic falloff

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Randomly spawn data packet pulse between active links
            if (Math.random() < 0.0008 && packets.length < 18) {
              packets.push({
                fromIdx: i,
                toIdx: j,
                progress: 0,
                speed: 0.012 + Math.random() * 0.018,
              });
            }
          }
        }

        // Interaction with Cursor
        if (mouse.active) {
          const mdx = n1.x - mouse.x;
          const mdy = n1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouseRadius) {
            const mFactor = 1 - mdist / mouseRadius;
            const mAlpha = mFactor * 0.45;

            // Tether line to mouse
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Subtle magnetic gravitational influence
            n1.x -= (mdx / mdist) * 0.45;
            n1.y -= (mdy / mdist) * 0.45;
          }
        }

        // Node Glow & Pulsing Core
        n1.phase += n1.pulseSpeed;
        const pulseRatio = Math.sin(n1.phase);
        const nodeAlpha = Math.min(1, Math.max(0.2, n1.baseAlpha + pulseRatio * 0.25));

        // Node inner core
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius + pulseRatio * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render expanding ripple wave if triggered
        if (n1.ringAlpha && n1.ringAlpha > 0.01) {
          ctx.beginPath();
          ctx.arc(n1.x, n1.y, n1.ringRadius || 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${n1.ringAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          n1.ringRadius = (n1.ringRadius || 0) + 0.7;
          n1.ringAlpha *= 0.94;
        }
      }

      // --- Draw Traveling Data Packets ---
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.progress += p.speed;

        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];

        if (p.progress >= 1 || !from || !to) {
          if (to) {
            // Trigger target node ping ripple
            to.ringRadius = 3;
            to.ringAlpha = 0.6;
          }
          packets.splice(k, 1);
          continue;
        }

        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;

        // Packet core with intense white glow
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Mini trail spark
        const trailX = from.x + (to.x - from.x) * Math.max(0, p.progress - 0.05);
        const trailY = from.y + (to.y - from.y) * Math.max(0, p.progress - 0.05);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(trailX, trailY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // --- Mouse Beacon Glow & Target Rings ---
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        // Soft aura around cursor
        const mouseAura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        mouseAura.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        mouseAura.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        mouseAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mouseAura;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();

        // Delicate pulsing reticle ring around cursor
        const ringSize = 18 + Math.sin(tick * 3) * 3;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, ringSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- Cinematic Vignette Overlay ---
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.4,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'rgba(6, 6, 8, 0)');
      vignette.addColorStop(1, 'rgba(6, 6, 8, 0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none w-full h-full block"
    />
  );
};
