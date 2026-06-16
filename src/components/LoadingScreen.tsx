'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Star particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = 180;
    type Star = {
      x: number; y: number; r: number;
      opacity: number; speed: number;
      twinkleSpeed: number; twinkleOffset: number;
      color: string;
    };

    const colors = ['#c084fc', '#e879f9', '#a855f7', '#f0abfc', '#818cf8', '#ffffff'];
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      stars.forEach((s) => {
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -5) {
          s.y = canvas.height + 5;
          s.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Progress counter — 3 seconds to reach 100
  useEffect(() => {
    const start = performance.now();
    const DURATION = 3000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        // brief pause then fade out
        setTimeout(() => setIsDone(true), 400);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  // Trigger onComplete after fade-out animation (~0.8s)
  useEffect(() => {
    if (isDone) {
      const t = setTimeout(onComplete, 800);
      return () => clearTimeout(t);
    }
  }, [isDone, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#030014',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Star canvas */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          />

          {/* Radial background glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              padding: '2rem',
            }}
          >
            {/* M20 logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ position: 'relative' }}
            >
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 20px #a855f7, 0 0 40px #a855f7, 0 0 80px #c084fc',
                    '0 0 30px #e879f9, 0 0 60px #e879f9, 0 0 100px #f0abfc',
                    '0 0 20px #a855f7, 0 0 40px #a855f7, 0 0 80px #c084fc',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: 'clamp(5rem, 15vw, 9rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#fff',
                  margin: 0,
                  fontFamily: 'system-ui, sans-serif',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                M20
              </motion.h1>

              {/* Ring glow behind logo */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: '-20px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
            </motion.div>

            {/* "Happy 20th Birthday Meenu" — appears at 70% */}
            <AnimatePresence>
              {progress >= 70 && (
                <motion.div
                  key="birthday-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ textAlign: 'center' }}
                >
                  <p
                    style={{
                      fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                      fontWeight: 600,
                      color: '#f0abfc',
                      margin: 0,
                      letterSpacing: '0.05em',
                      textShadow: '0 0 12px rgba(240,171,252,0.7)',
                    }}
                  >
                    Happy 20th Birthday Meenu
                  </p>
                  <p
                    style={{
                      fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                      color: '#a855f7',
                      margin: '0.4rem 0 0',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    August 9, 2026
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading bar */}
            <div style={{ width: 'clamp(240px, 50vw, 420px)' }}>
              {/* Track */}
              <div
                style={{
                  height: '3px',
                  background: 'rgba(168,85,247,0.15)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                }}
              >
                {/* Fill */}
                <motion.div
                  style={{
                    height: '100%',
                    borderRadius: '999px',
                    background:
                      'linear-gradient(90deg, #7c3aed, #a855f7, #e879f9)',
                    boxShadow: '0 0 10px #a855f7, 0 0 20px #e879f9',
                    width: `${progress}%`,
                  }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Percentage */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(168,85,247,0.6)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  Loading
                </span>
                <motion.span
                  key={progress}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#c084fc',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.05em',
                  }}
                >
                  {progress}%
                </motion.span>
              </div>
            </div>
          </div>

          {/* CSS keyframe styles */}
          <style>{`
            @keyframes ls-drift {
              0%   { transform: translateY(0) scale(1);   opacity: 0.6; }
              50%  { transform: translateY(-8px) scale(1.05); opacity: 1; }
              100% { transform: translateY(0) scale(1);   opacity: 0.6; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
