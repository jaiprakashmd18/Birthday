'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  decay: number;
  gravity: number;
  sparkle: boolean;
  sparklePhase: number;
}

interface Firework {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
  exploded: boolean;
}

const COLORS = [
  '#a855f7', // purple
  '#ec4899', // pink
  '#f59e0b', // gold
  '#3b82f6', // blue
  '#ffffff', // white
  '#06b6d4', // cyan
  '#f97316', // orange
  '#10b981', // emerald
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createExplosion(x: number, y: number, color: string): Particle[] {
  const count = 80 + Math.floor(Math.random() * 41); // 80–120
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 1.5 + Math.random() * 5;
    // Mix primary color with white for sparkles
    const isSparkle = Math.random() < 0.25;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: isSparkle ? '#ffffff' : color,
      radius: isSparkle ? 1.5 : 1.5 + Math.random() * 2.5,
      decay: 0.013 + Math.random() * 0.012,
      gravity: 0.06 + Math.random() * 0.04,
      sparkle: isSparkle,
      sparklePhase: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

export default function FireworksShow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastLaunchRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function launchFirework(xOverride?: number, yOverride?: number) {
      if (!canvas) return;
      const x = xOverride ?? (canvas.width * 0.15 + Math.random() * canvas.width * 0.7);
      const targetY = yOverride ?? (canvas.height * 0.1 + Math.random() * canvas.height * 0.45);
      const color = randomColor();
      fireworksRef.current.push({
        x,
        y: canvas.height,
        vy: -(canvas.height - targetY) / 38,
        targetY,
        color,
        trail: [],
        exploded: false,
      });
    }

    function animate(timestamp: number) {
      if (!ctx || !canvas) return;
      frameRef.current++;

      // Auto-launch every 1.5 s
      if (timestamp - lastLaunchRef.current > 1500) {
        launchFirework();
        if (Math.random() < 0.4) launchFirework(); // sometimes double
        lastLaunchRef.current = timestamp;
      }

      // Fade trail
      ctx.fillStyle = 'rgba(5, 2, 15, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw & update fireworks (ascending rockets)
      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (fw.exploded) return false;

        fw.trail.push({ x: fw.x, y: fw.y, alpha: 1 });
        if (fw.trail.length > 12) fw.trail.shift();

        // Draw trail
        fw.trail.forEach((t, i) => {
          const a = (i / fw.trail.length) * 0.8;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = fw.color;
          ctx.shadowColor = fw.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw rocket head
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = fw.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        fw.y += fw.vy;

        // Explode when reaching target
        if (fw.y <= fw.targetY) {
          const newParticles = createExplosion(fw.x, fw.y, fw.color);
          particlesRef.current.push(...newParticles);
          fw.exploded = true;
          return false;
        }
        return true;
      });

      // Draw & update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.save();
        // Sparkle flicker
        const displayAlpha = p.sparkle
          ? p.alpha * (0.5 + 0.5 * Math.sin(frameRef.current * 0.4 + p.sparklePhase))
          : p.alpha;
        ctx.globalAlpha = Math.max(0, displayAlpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.sparkle ? 6 : 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHasInteracted(true);

    // Launch 2–3 fireworks at click position
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const color = randomColor();
      particlesRef.current.push(
        ...createExplosion(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, color)
      );
    }
  }

  function handleCanvasTouch(e: React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    Array.from(e.touches).forEach((touch) => {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const color = randomColor();
      particlesRef.current.push(...createExplosion(x, y, color));
    });
    setHasInteracted(true);
  }

  return (
    <section className="relative min-h-screen flex flex-col bg-[#05020f] overflow-hidden">
      {/* Title */}
      <motion.div
        className="text-center pt-16 pb-4 px-4 z-10 relative"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
      >
        <h2
          className="text-5xl md:text-7xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b, #06b6d4, #a855f7)',
            backgroundSize: '300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'rainbowShift 4s linear infinite',
          }}
        >
          Celebrate!
        </h2>
      </motion.div>

      {/* Canvas */}
      <div className="relative flex-1 min-h-[420px] md:min-h-[560px] w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onTouchStart={handleCanvasTouch}
        />

        {/* Click hint */}
        <AnimateHint shown={!hasInteracted} />
      </div>

      {/* Bottom content */}
      <motion.div
        className="relative z-10 text-center py-12 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.h3
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Happy 20th Birthday Meenu! 🎉
        </motion.h3>

        {/* Pulsing hearts */}
        <div className="flex items-center justify-center gap-4 my-6">
          {['💜', '💗', '💫'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-3xl md:text-4xl select-none"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="text-purple-200/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          Here's to 20 amazing years and a lifetime of wonder ahead!
        </motion.p>

        {/* Decorative sparkling dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: i === 3 ? 10 : 6,
                height: i === 3 ? 10 : 6,
                background: COLORS[i % COLORS.length],
                boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}`,
              }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.18,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Inline keyframes for rainbow gradient animation */}
      <style>{`
        @keyframes rainbowShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}

function AnimateHint({ shown }: { shown: boolean }) {
  if (!shown) return null;
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
      transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 2 }}
    >
      <span className="text-purple-300/60 text-sm tracking-widest uppercase">
        Click anywhere to ignite ✨
      </span>
    </motion.div>
  );
}
