'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Planet {
  id: number;
  name: string;
  emoji: string;
  gradient: string;
  glow: string;
  ring: string;
  label: string;
  description: string;
}

const planets: Planet[] = [
  {
    id: 1,
    name: 'childhood',
    label: 'Childhood Memories',
    emoji: '🌸',
    gradient: 'from-rose-400 via-pink-500 to-rose-600',
    glow: 'shadow-[0_0_40px_rgba(244,63,94,0.6)]',
    ring: 'border-rose-400',
    description:
      'Every giggle, every wonder-filled moment of your early years shaped the amazing person you\'ve become. Those bright eyes that saw magic everywhere, that laughter that lit up every room — those moments are the foundation of your beautiful story, Meenu.',
  },
  {
    id: 2,
    name: 'school',
    label: 'School Journey',
    emoji: '📚',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
    ring: 'border-cyan-400',
    description:
      'From first days to final bells, your school journey was filled with learning, growing, and making memories. Every lesson, every exam, every friendship forged in those hallways contributed to the brilliant mind and warm heart you carry today.',
  },
  {
    id: 3,
    name: 'friendship',
    label: 'Friendship Moments',
    emoji: '💜',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
    ring: 'border-violet-400',
    description:
      'The friends who laughed with you, cried with you, and made every day brighter. These bonds are the constellations of your universe — each one a star that has guided you, supported you, and celebrated every version of you.',
  },
  {
    id: 4,
    name: 'special',
    label: 'Special Memories',
    emoji: '✨',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.6)]',
    ring: 'border-amber-400',
    description:
      'Those precious moments that made time stand still and your heart sing. The sunsets, the surprises, the quiet afternoons and loud celebrations — each one a golden thread woven into the tapestry of your extraordinary life.',
  },
  {
    id: 5,
    name: 'future',
    label: 'Future Dreams',
    emoji: '🌌',
    gradient: 'from-teal-400 via-emerald-500 to-cyan-600',
    glow: 'shadow-[0_0_40px_rgba(20,184,166,0.6)]',
    ring: 'border-teal-400',
    description:
      'The world awaits you, Meenu. Your dreams are the universe\'s greatest gift — vast, luminous, and infinite. At 20, you stand at the edge of the most breathtaking chapter yet. The stars you\'ll reach have been waiting just for you.',
  },
];

const floatVariants = [
  { y: [0, -18, 0], duration: 4.5 },
  { y: [0, -14, 0], duration: 5.2 },
  { y: [0, -20, 0], duration: 3.8 },
  { y: [0, -12, 0], duration: 6.1 },
  { y: [0, -16, 0], duration: 4.9 },
];

const planetPositions = [
  'col-start-1 col-end-2 row-start-1',
  'col-start-3 col-end-4 row-start-1',
  'col-start-2 col-end-3 row-start-2',
  'col-start-1 col-end-2 row-start-3',
  'col-start-3 col-end-4 row-start-3',
];

function Particles() {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function PlanetModal({
  planet,
  onClose,
}: {
  planet: Planet;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal content */}
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      >
        {/* Particle background inside modal */}
        <Particles />

        <div className="relative p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Planet icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${planet.gradient} flex items-center justify-center text-4xl ${planet.glow}`}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {planet.emoji}
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-center text-2xl font-bold text-white mb-4">
            {planet.label}
          </h3>

          {/* Description */}
          <p className="text-center text-white/80 text-sm leading-relaxed mb-6">
            {planet.description}
          </p>

          {/* Photo placeholder */}
          <div className="rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center py-10 gap-2">
            <span className="text-3xl">📷</span>
            <span className="text-white/40 text-sm font-medium tracking-wide">
              Your Photos Here
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MemoryUniverse() {
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);

  return (
    <section className="relative min-h-screen bg-[#030014] py-24 px-4 overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
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
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-900/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background:
                'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Memory Universe
          </h2>
          <p className="text-white/50 text-lg">
            Every moment is a planet in your story
          </p>
        </motion.div>

        {/* Planet grid — desktop: custom grid, mobile: single column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
          {planets.map((planet, index) => {
            const float = floatVariants[index];
            return (
              <motion.div
                key={planet.id}
                className="flex flex-col items-center gap-4 cursor-pointer group"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                onClick={() => setActivePlanet(planet)}
              >
                {/* Floating planet */}
                <motion.div
                  animate={{ y: float.y }}
                  transition={{
                    duration: float.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  {/* Outer ring */}
                  <motion.div
                    className={`absolute -inset-3 rounded-full border-2 ${planet.ring} opacity-40`}
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                    transition={{
                      rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    style={{ borderStyle: 'dashed' }}
                  />

                  {/* Planet body */}
                  <motion.div
                    className={`w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${planet.gradient} flex items-center justify-center text-4xl md:text-5xl ${planet.glow} transition-shadow duration-300`}
                    whileHover={{ scale: 1.18 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    {planet.emoji}
                  </motion.div>

                  {/* Hover description popup */}
                  <motion.div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 rounded-2xl p-3 text-xs text-white/90 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {planet.description.slice(0, 80)}…
                    <div className="mt-1 text-white/50 font-medium">
                      Click to explore
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10" />
                  </motion.div>
                </motion.div>

                {/* Planet label */}
                <span className="text-white/80 text-sm font-semibold tracking-wide text-center">
                  {planet.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activePlanet && (
          <PlanetModal
            planet={activePlanet}
            onClose={() => setActivePlanet(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
