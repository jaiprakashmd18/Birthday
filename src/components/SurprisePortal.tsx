'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECRET_MESSAGE = `You Are Someone Truly Special, Meenu 🌟

Your heart lights up every room.
Your smile makes the world brighter.
Never stop being exactly who you are.

The universe is lucky to have you.

Happy 20th Birthday! ✨`;

interface GiftBox {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

function FloatingGift({ gift }: { gift: GiftBox }) {
  return (
    <motion.div
      key={gift.id}
      className="fixed pointer-events-none select-none z-50"
      style={{ left: `${gift.x}%`, bottom: '-80px', fontSize: `${gift.size}px` }}
      initial={{ y: 0, opacity: 0, rotate: 0 }}
      animate={{
        y: -window.innerHeight - 100,
        opacity: [0, 1, 1, 0],
        rotate: [-10, 10, -10, 10],
      }}
      transition={{
        duration: gift.duration,
        delay: gift.delay,
        ease: 'easeInOut',
      }}
    >
      🎁
    </motion.div>
  );
}

function ParticleExplosion({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#06b6d4', '#ffffff', '#f97316'];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particlesRef.current = Array.from({ length: 200 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 200 + Math.random() * 0.3;
      const speed = 4 + Math.random() * 10;
      return {
        id: i,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      };
    });

    let alpha = 1;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alpha -= 0.012;
      if (alpha <= 0) {
        particlesRef.current = [];
        return;
      }
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

export default function SurprisePortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [gifts, setGifts] = useState<GiftBox[]>([]);

  const handleEnter = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      setIsOpen(true);
      setShowExplosion(true);
      setTimeout(() => setShowExplosion(false), 2500);

      const newGifts: GiftBox[] = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 4,
        size: 24 + Math.random() * 28,
      }));
      setGifts(newGifts);
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setGifts([]);
    setShowExplosion(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#05020f] overflow-hidden py-20 px-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-pink-900/15 blur-[100px]" />
      </div>

      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Title */}
      <motion.div
        className="text-center mb-16 z-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b, #a855f7)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          A Magical Surprise Awaits...
        </h2>
        <p className="text-purple-300/70 text-lg mt-2 tracking-widest uppercase text-sm">
          Something special lies beyond
        </p>
      </motion.div>

      {/* Portal */}
      <motion.div
        className="relative z-10 flex items-center justify-center mb-12"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'backOut' }}
        viewport={{ once: true }}
      >
        {/* Outer rotating conic-gradient ring */}
        <motion.div
          className="absolute"
          style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #06b6d4, #a855f7)',
            padding: 4,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full bg-[#05020f]" />
        </motion.div>

        {/* Second counter-rotating ring */}
        <motion.div
          className="absolute"
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg, #f59e0b, #a855f7, #ec4899, #f59e0b)',
            padding: 3,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full bg-[#05020f]" />
        </motion.div>

        {/* Pulsing outer glow */}
        <motion.div
          className="absolute"
          style={{
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Inner aurora swirl */}
        <div
          className="relative"
          style={{
            width: 270,
            height: 270,
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'conic-gradient(from 0deg, #1e0a3c, #3b0764, #701a75, #1e3a5f, #0c4a6e, #1e0a3c)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 40% 40%, rgba(168,85,247,0.6) 0%, transparent 60%)',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 60% 60%, rgba(236,72,153,0.5) 0%, transparent 50%)',
            }}
            animate={{
              rotate: [360, 0],
              scale: [1.2, 0.9, 1.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl select-none"
            >
              ✨
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enter Button */}
      <motion.button
        onClick={handleEnter}
        className="relative z-10 px-10 py-4 rounded-full text-white font-semibold text-lg tracking-wide overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #db2777, #d97706)',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <span className="relative z-10">✨ Enter the Portal</span>
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      {/* Screen flash */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Particle explosion canvas */}
      <ParticleExplosion active={showExplosion} />

      {/* Floating gifts */}
      <AnimatePresence>
        {isOpen && gifts.map((gift) => (
          <FloatingGift key={gift.id} gift={gift} />
        ))}
      </AnimatePresence>

      {/* Portal overlay / secret message */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[55] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Expanding portal backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, #1e0a3c 0%, #0a0118 50%, #05020f 100%)',
              }}
              initial={{ scale: 0, borderRadius: '50%' }}
              animate={{ scale: 3, borderRadius: '0%' }}
              exit={{ scale: 0, borderRadius: '50%' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* Aurora shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(168,85,247,0.15), rgba(236,72,153,0.15), rgba(245,158,11,0.1), rgba(168,85,247,0.15))',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Message card */}
            <motion.div
              className="relative z-10 max-w-lg w-full text-center px-8 py-12 rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(168,85,247,0.3)',
                backdropFilter: 'blur(20px)',
              }}
              initial={{ scale: 0.3, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.3, opacity: 0, y: 60 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'backOut' }}
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 70%)',
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="text-5xl mb-6">🌟</div>
                <div className="whitespace-pre-line text-purple-100 text-lg md:text-xl leading-relaxed font-light"
                  style={{
                    textShadow: '0 0 20px rgba(168,85,247,0.5)',
                  }}
                >
                  {SECRET_MESSAGE}
                </div>
              </motion.div>

              {/* Floating sparkles inside card */}
              {['✨', '💫', '⭐', '🌙'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl pointer-events-none"
                  style={{
                    left: `${10 + i * 25}%`,
                    top: `${Math.random() * 80 + 5}%`,
                  }}
                  animate={{
                    y: [-8, 8, -8],
                    opacity: [0.4, 1, 0.4],
                    rotate: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}

              {/* Close button */}
              <motion.button
                onClick={handleClose}
                className="mt-8 px-8 py-3 rounded-full text-white font-medium text-sm tracking-widest uppercase"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(219,39,119,0.6))',
                  border: '1px solid rgba(168,85,247,0.4)',
                }}
                whileHover={{ scale: 1.05, background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(219,39,119,0.9))' } as any}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Close Portal
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
