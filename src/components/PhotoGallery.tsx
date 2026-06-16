'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const PHOTO_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
];

const HOLO_BORDERS = [
  'linear-gradient(135deg, #c084fc, #ec4899, #818cf8)',
  'linear-gradient(135deg, #ec4899, #f59e0b, #c084fc)',
  'linear-gradient(135deg, #38bdf8, #c084fc, #ec4899)',
  'linear-gradient(135deg, #6ee7b7, #38bdf8, #c084fc)',
  'linear-gradient(135deg, #f59e0b, #ec4899, #6ee7b7)',
  'linear-gradient(135deg, #818cf8, #38bdf8, #6ee7b7)',
  'linear-gradient(135deg, #f9a8d4, #c084fc, #38bdf8)',
  'linear-gradient(135deg, #fbbf24, #f9a8d4, #818cf8)',
  'linear-gradient(135deg, #c084fc, #6ee7b7, #fbbf24)',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function PhotoCard({ index }: { index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    setHovered(false);
  }

  const borderGradient = HOLO_BORDERS[index % HOLO_BORDERS.length];
  const photoGradient = PHOTO_GRADIENTS[index % PHOTO_GRADIENTS.length];
  const frameNum = String(index + 1).padStart(2, '0');

  return (
    <motion.div variants={cardVariants} className="relative">
      {/* Animated holographic border */}
      <div
        className="photo-card-wrapper relative rounded-xl"
        style={{
          padding: '2px',
          background: borderGradient,
          borderRadius: '0.75rem',
          boxShadow: hovered
            ? `0 0 30px rgba(192, 132, 252, 0.5), 0 0 60px rgba(236, 72, 153, 0.25)`
            : `0 0 15px rgba(192, 132, 252, 0.2)`,
          transition: 'box-shadow 0.3s ease',
          backgroundSize: '200% 200%',
          animation: 'holoBorderShift 4s linear infinite',
          animationDelay: `${(index * 0.4) % 4}s`,
        }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden rounded-[10px] cursor-pointer"
          style={{
            transition: 'transform 0.2s ease',
            background: '#0a0015',
          }}
        >
          {/* Photo placeholder */}
          <div
            className="aspect-square flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: photoGradient }}
          >
            {/* Overlay shimmer */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
              }}
            />

            {/* Camera icon */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p
                className="text-xs font-medium"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Your Photo
              </p>
            </div>
          </div>

          {/* Bottom bar with frame number */}
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{
              background: 'rgba(10, 0, 21, 0.9)',
              borderTop: '1px solid rgba(192, 132, 252, 0.2)',
            }}
          >
            <span
              className="text-xs font-mono"
              style={{
                background: borderGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              #{frameNum}
            </span>
            <div className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: `rgba(192, 132, 252, ${0.3 + d * 0.2})`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-purple-400 opacity-60">Meenu</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{`
        @keyframes holoBorderShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .gallery-bg {
          background: linear-gradient(
            180deg,
            #0a0015 0%,
            #080012 40%,
            #0c001a 70%,
            #0a0015 100%
          );
        }
      `}</style>

      <section
        ref={sectionRef}
        className="gallery-bg relative py-24 px-4 overflow-hidden"
      >
        {/* Background grid lines — holographic vibe */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(192,132,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Corner glow blobs */}
        <div
          className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 100% 100%, rgba(236,72,153,0.1) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-3 font-light">
              — captured moments —
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Memory Gallery
            </h2>
            <div className="mt-4 flex justify-center gap-3">
              {['◈', '◆', '◈', '◆', '◈'].map((s, i) => (
                <span key={i} className="text-purple-400 opacity-50 text-sm">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4 text-purple-300 text-sm opacity-60">
              Nine frames, nine stories, one beautiful soul
            </p>
          </motion.div>

          {/* Photo grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <PhotoCard key={i} index={i} />
            ))}
          </motion.div>

          {/* Add photos note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            className="mt-12 text-center"
          >
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(192, 132, 252, 0.08)',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-purple-400 text-lg">📸</span>
              <p className="text-purple-300 text-sm">
                Replace placeholders with real photos in{' '}
                <span className="text-purple-200 font-mono text-xs bg-purple-900/30 px-2 py-0.5 rounded">
                  /src/components/PhotoGallery.tsx
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
