'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  emoji: string;
  side: 'left' | 'right';
  gradient: string;
  textGradient: string;
}

const events: TimelineEvent[] = [
  {
    year: 2006,
    title: 'Where It All Began',
    description:
      'On August 9, 2006, the world became a brighter place. A star was born — curious, radiant, and full of infinite potential. The universe smiled when you arrived, Meenu.',
    emoji: '🌟',
    side: 'left',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    textGradient: 'from-rose-400 to-pink-500',
  },
  {
    year: 2010,
    title: 'Little Explorer',
    description:
      'At 4 years old, curiosity was your superpower. Every day was a new adventure — every puddle, every butterfly, every bedtime story a doorway into the extraordinary.',
    emoji: '🦋',
    side: 'right',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    textGradient: 'from-cyan-400 to-blue-500',
  },
  {
    year: 2015,
    title: 'Growing Brilliance',
    description:
      'At 9, your talents began to shine like diamonds. School, friends, dreams — you embraced them all with a grace beyond your years, collecting memories that would last a lifetime.',
    emoji: '💎',
    side: 'left',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    textGradient: 'from-violet-400 to-purple-500',
  },
  {
    year: 2020,
    title: 'Teenage Dreams',
    description:
      'At 14, you bloomed into someone truly special. Through challenges, you remained fearless. Through change, you stayed beautifully, authentically you.',
    emoji: '🌺',
    side: 'right',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    textGradient: 'from-amber-400 to-orange-500',
  },
  {
    year: 2026,
    title: 'The Magnificent 20',
    description:
      'Two decades of amazingness complete. You stand at the threshold of endless possibilities, armed with wisdom, laughter, and a heart full of dreams. The best is yet to come.',
    emoji: '🚀',
    side: 'left',
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    textGradient: 'from-teal-400 to-emerald-500',
  },
];

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const isLeft = event.side === 'left';

  return (
    <div
      ref={ref}
      className={`relative flex items-center w-full mb-12 md:mb-16 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col`}
    >
      {/* Card — takes up ~45% width on desktop */}
      <motion.div
        className={`w-full md:w-[45%] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
      >
        <div
          className={`relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-br ${event.gradient}`}
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Subtle gradient overlay per event */}
          <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-40 pointer-events-none`} />

          <div className="relative z-10">
            {/* Emoji */}
            <motion.div
              className="text-4xl mb-3"
              animate={inView ? { rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {event.emoji}
            </motion.div>

            {/* Year */}
            <motion.span
              className="block text-5xl md:text-6xl font-black mb-1 leading-none"
              style={{
                background: `linear-gradient(135deg, ${
                  event.textGradient.includes('rose')
                    ? '#fb7185, #ec4899'
                    : event.textGradient.includes('cyan')
                    ? '#22d3ee, #3b82f6'
                    : event.textGradient.includes('violet')
                    ? '#a78bfa, #8b5cf6'
                    : event.textGradient.includes('amber')
                    ? '#fbbf24, #f97316'
                    : '#2dd4bf, #10b981'
                })`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {event.year}
            </motion.span>

            {/* Title */}
            <h3 className="text-white font-bold text-xl mb-3">{event.title}</h3>

            {/* Description */}
            <p className="text-white/65 text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Center dot — hidden on mobile, shown on md+ */}
      <motion.div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full items-center justify-center z-20"
        style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          boxShadow: '0 0 20px rgba(168,85,247,0.8)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.div>

      {/* Mobile dot — visible only below md */}
      <motion.div
        className="flex md:hidden w-5 h-5 rounded-full my-3 items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          boxShadow: '0 0 16px rgba(168,85,247,0.8)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.div>

      {/* Spacer on the other side (desktop) */}
      <div className="hidden md:block w-[45%]" />
    </div>
  );
}

export default function TimelineSection() {
  const { ref: titleRef, inView: titleInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      className="relative min-h-screen py-24 px-4 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0a0015 0%, #0d0020 40%, #080018 70%, #030014 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-pink-900/15 blur-3xl pointer-events-none" />

      {/* Subtle stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.05,
            }}
            animate={{ opacity: [0.05, 0.5, 0.05] }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <motion.div
          ref={titleRef}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <h2
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background:
                'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Journey Through Time
          </h2>
          <p className="text-white/50 text-lg">
            Twenty years of a life beautifully lived
          </p>
        </motion.div>

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, #a855f7 20%, #ec4899 80%, transparent 100%)',
            }}
          />

          {/* Mobile vertical line */}
          <div
            className="md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, #a855f7 20%, #ec4899 80%, transparent 100%)',
            }}
          />

          {/* Events */}
          {events.map((event, index) => (
            <TimelineCard key={event.year} event={event} index={index} />
          ))}
        </div>

        {/* Bottom flourish */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
          >
            <span className="text-2xl">🎂</span>
            <span className="text-white/80 font-semibold tracking-wide">
              Happy 20th Birthday, Meenu!
            </span>
            <span className="text-2xl">🎂</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
