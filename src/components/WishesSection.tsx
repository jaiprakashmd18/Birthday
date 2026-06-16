'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Wish {
  icon: string;
  text: string;
  gradient: string;
  border: string;
  glow: string;
}

const WISHES: Wish[] = [
  {
    icon: '🌟',
    text: 'May your 20s be filled with adventures that take your breath away',
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    border: 'rgba(251, 191, 36, 0.4)',
    glow: 'rgba(251, 191, 36, 0.2)',
  },
  {
    icon: '✨',
    text: 'May every dream you hold dear come true, one by one',
    gradient: 'linear-gradient(135deg, #c084fc, #a855f7)',
    border: 'rgba(192, 132, 252, 0.4)',
    glow: 'rgba(192, 132, 252, 0.2)',
  },
  {
    icon: '💜',
    text: 'May you always find strength in your struggles and beauty in your journey',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    border: 'rgba(139, 92, 246, 0.4)',
    glow: 'rgba(139, 92, 246, 0.2)',
  },
  {
    icon: '🌙',
    text: 'May your path be lit with love, laughter, and endless possibilities',
    gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    border: 'rgba(56, 189, 248, 0.4)',
    glow: 'rgba(56, 189, 248, 0.2)',
  },
  {
    icon: '🌸',
    text: 'May you bloom into the most spectacular version of yourself',
    gradient: 'linear-gradient(135deg, #f9a8d4, #ec4899)',
    border: 'rgba(249, 168, 212, 0.4)',
    glow: 'rgba(236, 72, 153, 0.2)',
  },
  {
    icon: '🎂',
    text: 'May happiness follow you everywhere you go, today and always',
    gradient: 'linear-gradient(135deg, #6ee7b7, #10b981)',
    border: 'rgba(110, 231, 183, 0.4)',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function WishCard({ wish, index }: { wish: Wish; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  }

  return (
    <motion.div variants={cardVariants}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="wish-card group relative h-full cursor-default"
        style={
          {
            '--border-color': wish.border,
            '--glow-color': wish.glow,
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          } as React.CSSProperties
        }
      >
        {/* Gradient border wrapper */}
        <div
          className="absolute inset-0 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${wish.border}, transparent, ${wish.border})`,
            padding: '1px',
            borderRadius: '1rem',
          }}
        />

        {/* Card body */}
        <div
          className="relative h-full rounded-2xl p-6 flex flex-col items-center text-center gap-4"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(139,92,246,0.05) 100%)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${wish.border}`,
            boxShadow: `0 4px 30px ${wish.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* Icon circle */}
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full text-3xl flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${wish.glow} 0%, transparent 70%)`,
              border: `1px solid ${wish.border}`,
              boxShadow: `0 0 20px ${wish.glow}, 0 0 40px ${wish.glow}`,
            }}
          >
            {wish.icon}
          </div>

          {/* Wish text with gradient */}
          <p
            className="text-base md:text-lg font-medium leading-relaxed"
            style={{
              background: wish.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {wish.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .wishes-bg {
          background: linear-gradient(
            180deg,
            #0a0015 0%,
            #0f0025 40%,
            #0d001e 70%,
            #0a0015 100%
          );
        }
      `}</style>

      <section
        ref={sectionRef}
        className="wishes-bg relative py-24 px-4 overflow-hidden"
      >
        {/* Subtle background glow blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-3 font-light">
              — for Meenu —
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Birthday Wishes
            </h2>
            <div className="mt-4 flex justify-center gap-3">
              {['✦', '♥', '✦', '♥', '✦'].map((s, i) => (
                <span key={i} className="text-pink-400 opacity-60 text-sm">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4 text-purple-300 text-sm opacity-70">
              Six wishes for your magnificent journey ahead
            </p>
          </motion.div>

          {/* Wish cards grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
          >
            {WISHES.map((wish, i) => (
              <WishCard key={i} wish={wish} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
