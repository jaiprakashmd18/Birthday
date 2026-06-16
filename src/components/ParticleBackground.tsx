'use client';

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  color: string;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
  driftSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  active: boolean;
  tail: { x: number; y: number }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAR_COUNT = 200;
const SHOOTING_STAR_INTERVAL = 2800; // ms between spawns
const PARALLAX_STRENGTH = 24; // max pixel shift

const STAR_COLORS = [
  '#c084fc', // purple-400
  '#e879f9', // fuchsia-400
  '#a855f7', // purple-500
  '#f0abfc', // fuchsia-300
  '#818cf8', // indigo-400 (aurora blue)
  '#fbbf24', // amber/gold
  '#ffffff',
];

const AURORA_COLORS = [
  'rgba(139,92,246,0.08)',
  'rgba(232,121,249,0.06)',
  'rgba(99,102,241,0.07)',
  'rgba(236,72,153,0.05)',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeStar(w: number, h: number): Star {
  const bx = Math.random() * w;
  const by = Math.random() * h;
  return {
    x: bx,
    y: by,
    baseX: bx,
    baseY: by,
    r: randBetween(0.4, 2.2),
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    opacity: randBetween(0.3, 1),
    twinkleSpeed: randBetween(0.006, 0.025),
    twinkleOffset: Math.random() * Math.PI * 2,
    driftX: (Math.random() - 0.5) * 0.12,
    driftY: (Math.random() - 0.5) * 0.08,
    driftSpeed: randBetween(0.002, 0.01),
  };
}

function makeShootingStar(w: number, h: number): ShootingStar {
  const angle = randBetween(-0.4, -0.15);
  const speed = randBetween(14, 22);
  return {
    x: randBetween(w * 0.1, w * 0.9),
    y: randBetween(0, h * 0.4),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    opacity: 1,
    active: true,
    tail: [],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Plain object — lives entirely inside useEffect, no hooks needed
    const mouseNorm = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouseNorm.x = (e.clientX / width - 0.5) * 2;
      mouseNorm.y = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Stars ─────────────────────────────────────────────────────────────────
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => makeStar(width, height));

    // ── Aurora wave params ────────────────────────────────────────────────────
    interface AuroraWave {
      color: string;
      yOffset: number;
      amplitude: number;
      frequency: number;
      phase: number;
      speed: number;
    }
    const auroraWaves: AuroraWave[] = AURORA_COLORS.map((color, i) => ({
      color,
      yOffset: height * (0.25 + i * 0.12),
      amplitude: randBetween(40, 90),
      frequency: randBetween(0.001, 0.003),
      phase: Math.random() * Math.PI * 2,
      speed: randBetween(0.003, 0.009) * (i % 2 === 0 ? 1 : -1),
    }));

    // ── Shooting stars ────────────────────────────────────────────────────────
    const shootingStars: ShootingStar[] = [];
    let lastShoot = 0;

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars.forEach((s) => {
        s.baseX = Math.random() * width;
        s.baseY = Math.random() * height;
        s.x = s.baseX;
        s.y = s.baseY;
      });
      auroraWaves.forEach((w, i) => {
        w.yOffset = height * (0.25 + i * 0.12);
      });
    };
    window.addEventListener('resize', onResize);

    // ── Draw aurora ───────────────────────────────────────────────────────────
    const drawAurora = (t: number) => {
      auroraWaves.forEach((w) => {
        w.phase += w.speed;
        const pts: [number, number][] = [];
        const step = 8;
        for (let x = 0; x <= width + step; x += step) {
          const y =
            w.yOffset +
            Math.sin(x * w.frequency + w.phase + t * 0.0004) * w.amplitude;
          pts.push([x, y]);
        }

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, w.color);
        grad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) / 2;
          const my = (pts[i][1] + pts[i + 1][1]) / 2;
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });
    };

    // ── Draw shooting star ────────────────────────────────────────────────────
    const drawShootingStar = (ss: ShootingStar) => {
      if (!ss.active) return;

      ss.tail.unshift({ x: ss.x, y: ss.y });
      if (ss.tail.length > 18) ss.tail.pop();

      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.opacity -= 0.018;

      if (
        ss.opacity <= 0 ||
        ss.x > width + 50 ||
        ss.y > height + 50 ||
        ss.x < -50
      ) {
        ss.active = false;
        return;
      }

      // Tail
      for (let i = 1; i < ss.tail.length; i++) {
        const alpha = ss.opacity * (1 - i / ss.tail.length) * 0.9;
        ctx.beginPath();
        ctx.moveTo(ss.tail[i - 1].x, ss.tail[i - 1].y);
        ctx.lineTo(ss.tail[i].x, ss.tail[i].y);
        ctx.strokeStyle = `rgba(240,171,252,${alpha})`;
        ctx.lineWidth = (1 - i / ss.tail.length) * 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Bright head
      const headGrad = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
      headGrad.addColorStop(0, `rgba(255,255,255,${ss.opacity})`);
      headGrad.addColorStop(0.5, `rgba(240,171,252,${ss.opacity * 0.6})`);
      headGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = headGrad;
      ctx.fill();
    };

    // ── Main loop ─────────────────────────────────────────────────────────────
    let rafId = 0;
    let t = 0;

    const loop = (timestamp: number) => {
      t++;
      ctx.clearRect(0, 0, width, height);

      // Deep space background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#0d0520');
      bgGrad.addColorStop(0.5, '#070112');
      bgGrad.addColorStop(1, '#030014');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Aurora waves
      drawAurora(t);

      // Parallax offsets
      const px = mouseNorm.x * PARALLAX_STRENGTH;
      const py = mouseNorm.y * PARALLAX_STRENGTH;

      // Stars
      stars.forEach((s) => {
        // Slow organic drift
        s.baseX += s.driftX * Math.sin(t * s.driftSpeed);
        s.baseY += s.driftY * Math.cos(t * s.driftSpeed);
        // Wrap around edges
        if (s.baseX < -10) s.baseX = width + 10;
        if (s.baseX > width + 10) s.baseX = -10;
        if (s.baseY < -10) s.baseY = height + 10;
        if (s.baseY > height + 10) s.baseY = -10;

        // Parallax: larger stars (closer) shift more
        const parallaxFactor = s.r / 2.2;
        s.x = s.baseX + px * parallaxFactor;
        s.y = s.baseY + py * parallaxFactor;

        // Twinkle pulse
        const pulse = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.opacity * (0.55 + 0.45 * pulse);
        const radius = s.r * (0.85 + 0.15 * pulse);

        // Soft glow halo for larger stars
        if (s.r > 1.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha * 0.08;
          ctx.fill();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Shooting stars
      if (timestamp - lastShoot > SHOOTING_STAR_INTERVAL) {
        shootingStars.push(makeShootingStar(width, height));
        lastShoot = timestamp;
      }
      // Draw & prune inactive ones
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (!shootingStars[i].active) {
          shootingStars.splice(i, 1);
        } else {
          drawShootingStar(shootingStars[i]);
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
