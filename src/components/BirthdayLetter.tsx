'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const LETTER_TEXT = `Dear Meenu,

Twenty years ago, the universe decided the world needed a little more magic,
a little more light, a little more you.

And what a gift that decision turned out to be.

In these two decades, you've grown from a tiny wonder into someone who makes
every room brighter just by walking in. Your laughter is contagious, your heart
is pure gold, and your spirit is absolutely unstoppable.

You've faced every challenge with grace, every joy with full presence,
and every person you've met with genuine warmth.

As you step into your 20s, know that you carry within you the strength of
twenty years of beautiful moments, lessons learned, and love received.

The best chapters of your story are yet to be written, and every single one
of them will be magnificent — because you are magnificent.

Happy 20th Birthday, Meenu.
May all your dreams take flight and your heart always dance.

With all the love in the universe,
The Stars Above 🌟`;

const HEARTS = [
  { size: 18, top: '10%', left: '5%', duration: 6, delay: 0 },
  { size: 12, top: '20%', left: '88%', duration: 8, delay: 1 },
  { size: 22, top: '35%', left: '92%', duration: 7, delay: 2 },
  { size: 14, top: '55%', left: '3%', duration: 9, delay: 0.5 },
  { size: 10, top: '70%', left: '80%', duration: 6, delay: 1.5 },
  { size: 20, top: '80%', left: '12%', duration: 8, delay: 3 },
  { size: 16, top: '15%', left: '50%', duration: 7, delay: 2.5 },
  { size: 8,  top: '90%', left: '60%', duration: 5, delay: 1 },
];

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
}));

function FloatingHeart({ size, top, left, duration, delay }: {
  size: number; top: string; left: string; duration: number; delay: number;
}) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{ top, left, fontSize: size, animationDelay: `${delay}s` }}
    >
      <div
        style={{
          animation: `floatHeart ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        ♥
      </div>
    </div>
  );
}

function Particle({ top, left, size, duration, delay }: {
  top: string; left: string; size: number; duration: number; delay: number;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        top,
        left,
        width: size,
        height: size,
        background: 'rgba(192, 132, 252, 0.6)',
        animation: `twinkle ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function BirthdayLetter() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isInView) return;

    // Start typewriter after entrance animation settles
    const startDelay = setTimeout(() => {
      setIsTyping(true);
    }, 800);

    return () => clearTimeout(startDelay);
  }, [isInView]);

  useEffect(() => {
    if (!isTyping) return;

    indexRef.current = 0;
    setDisplayedText('');

    function typeNext() {
      if (indexRef.current < LETTER_TEXT.length) {
        const char = LETTER_TEXT[indexRef.current];
        setDisplayedText(LETTER_TEXT.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        // Slow down at punctuation for dramatic effect
        const delay =
          char === '.' || char === ',' || char === '\n'
            ? 60
            : char === '!'
            ? 80
            : 18;
        typingRef.current = setTimeout(typeNext, delay);
      } else {
        setIsTyping(false);
      }
    }

    typingRef.current = setTimeout(typeNext, 0);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [isTyping]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        @keyframes floatHeart {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes auroraShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .aurora-bg {
          background: linear-gradient(
            135deg,
            #0a0015 0%,
            #0d001a 20%,
            #1a003d 40%,
            #0a0022 60%,
            #12001f 80%,
            #0a0015 100%
          );
          position: relative;
        }
        .aurora-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(236, 72, 153, 0.1) 25%,
            rgba(59, 130, 246, 0.08) 50%,
            rgba(16, 185, 129, 0.06) 75%,
            rgba(139, 92, 246, 0.12) 100%
          );
          background-size: 400% 400%;
          animation: auroraShift 12s ease infinite;
          pointer-events: none;
        }
        .parchment-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(192, 132, 252, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(192, 132, 252, 0.25);
          box-shadow:
            0 0 60px rgba(139, 92, 246, 0.15),
            0 0 120px rgba(236, 72, 153, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .heart-color {
          color: rgba(236, 72, 153, 0.5);
        }
        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: rgba(192, 132, 252, 0.9);
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: cursorBlink 0.8s step-end infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="aurora-bg relative min-h-screen py-24 px-4 overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Aurora overlay */}
        <div className="aurora-overlay" />

        {/* Floating hearts */}
        {HEARTS.map((h, i) => (
          <FloatingHeart key={i} {...h} />
        ))}

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <Particle key={p.id} {...p} />
        ))}

        <div className="relative z-10 max-w-3xl w-full mx-auto">
          {/* Section title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-3 font-light">
              — written with love —
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
            >
              A Letter From The Heart
            </h2>
            <div className="mt-4 flex justify-center gap-2">
              {['♥', '✦', '♥'].map((sym, i) => (
                <span key={i} className="text-pink-400 opacity-70 text-lg">
                  {sym}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Letter card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="parchment-card rounded-3xl p-8 md:p-12"
          >
            {/* Decorative top line */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40" />
              <span className="text-pink-400 text-xl">♥</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40" />
            </div>

            {/* Letter body */}
            <div
              className="font-mono text-base md:text-lg leading-8 text-purple-100 whitespace-pre-wrap"
              style={{ minHeight: '200px' }}
            >
              {displayedText}
              {isTyping && <span className="cursor-blink" />}
            </div>

            {/* Decorative bottom line */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40" />
              <span className="text-pink-400 text-xl">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40" />
            </div>

            {/* Signature */}
            {!isTyping && displayedText.length === LETTER_TEXT.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-6 text-right"
              >
                <p
                  className="text-2xl md:text-3xl text-pink-300"
                  style={{ fontFamily: '"Dancing Script", cursive' }}
                >
                  With love, always ♥
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
