'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0–1
  size: number;
  color: string;
}

const TRAIL_COLORS = ['#a855f7', '#c084fc', '#e879f9', '#f0abfc', '#818cf8'];

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const isHovering = useRef(false);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastPos = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ringEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Keep canvas full-screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Spawn trail particles when mouse moves
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 4) {
        for (let i = 0; i < 2; i++) {
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 4,
            y: e.clientY + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            life: 1,
            size: Math.random() * 3 + 1,
            color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
          });
        }
        // Cap particle count
        if (particles.current.length > 120) {
          particles.current.splice(0, particles.current.length - 120);
        }
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Detect hoverable elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]')
      ) {
        isHovering.current = true;
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]')
      ) {
        isHovering.current = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // Animation loop
    const loop = () => {
      // Dot: snaps directly to mouse
      dot.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;

      // Ring: lerp toward mouse
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      ringEl.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;

      // Hover state
      const hoverScale = isHovering.current ? 2.2 : 1;
      ringEl.style.scale = String(hoverScale);
      dot.style.scale = isHovering.current ? '0.4' : '1';

      // Particle canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.life > 0);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;
        const alpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.8;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Particle canvas — sits above everything but pointer-events none */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          pointerEvents: 'none',
        }}
      />

      {/* Cursor dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#a855f7',
          boxShadow: '0 0 6px #a855f7, 0 0 12px #c084fc',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'scale 0.15s ease',
        }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(168, 85, 247, 0.7)',
          boxShadow: '0 0 8px rgba(168,85,247,0.4) inset, 0 0 8px rgba(168,85,247,0.4)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'scale 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />

      <style>{`
        * { cursor: none !important; }
      `}</style>
    </>
  );
}
