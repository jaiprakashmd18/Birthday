'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, Variants } from 'framer-motion'
import SpaceScene from './SpaceScene'

// -------------------------------------------------------------------
// Shooting star (pure CSS/SVG)
// -------------------------------------------------------------------
function ShootingStar({
  style,
}: {
  style: React.CSSProperties
}) {
  return (
    <div
      className="shooting-star"
      style={{
        position: 'absolute',
        width: '120px',
        height: '1px',
        background:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(249,168,212,0.9) 60%, rgba(255,255,255,1) 100%)',
        borderRadius: '999px',
        ...style,
      }}
    />
  )
}

// -------------------------------------------------------------------
// Animated age counter  0 → 20
// -------------------------------------------------------------------
function AgeCounter() {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let frame: number
    const start = performance.now()
    const duration = 2000 // ms

    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * 20))
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      } else {
        setCount(20)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [started])

  return (
    <div ref={ref} className="flex items-center justify-center gap-3 my-6">
      <div className="text-center">
        <div
          className="text-7xl md:text-8xl font-bold tabular-nums leading-none"
          style={{
            fontFamily: 'Cinzel, serif',
            background:
              'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))',
          }}
        >
          {count}
        </div>
        <div
          className="text-sm uppercase tracking-[0.35em] mt-1"
          style={{ color: '#c084fc' }}
        >
          Years Young
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------
// Scroll indicator
// -------------------------------------------------------------------
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
    >
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: 'rgba(192,132,252,0.7)' }}
      >
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
        style={{ borderColor: 'rgba(192,132,252,0.4)' }}
      >
        <div
          className="w-1 h-2 rounded-full"
          style={{
            background:
              'linear-gradient(180deg, #c084fc 0%, transparent 100%)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// -------------------------------------------------------------------
// Stagger variants
// -------------------------------------------------------------------
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

// -------------------------------------------------------------------
// Gold shimmer keyframes injected once
// -------------------------------------------------------------------
const shimmerCSS = `
@keyframes shimmer {
  0%   { background-position: -400% center; }
  100% { background-position: 400% center; }
}
@keyframes shootLeft {
  0%   { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 1; }
  100% { transform: translateX(300px) translateY(120px) rotate(-35deg); opacity: 0; }
}
@keyframes shootRight {
  0%   { transform: translateX(0) translateY(0) rotate(35deg); opacity: 1; }
  100% { transform: translateX(-300px) translateY(120px) rotate(35deg); opacity: 0; }
}
.shooting-star-left  { animation: shootLeft  3.5s linear infinite; }
.shooting-star-right { animation: shootRight 4.2s linear infinite 1.8s; }
`

// -------------------------------------------------------------------
// Main hero component
// -------------------------------------------------------------------
export default function HeroSection() {
  return (
    <>
      {/* Inject shimmer + shooting star keyframes */}
      <style dangerouslySetInnerHTML={{ __html: shimmerCSS }} />

      <section
        className="relative min-h-screen overflow-hidden"
        style={{ background: '#030014' }}
      >
        {/* ---- 3D Space Background ---- */}
        <SpaceScene />

        {/* ---- Shooting Stars ---- */}
        <ShootingStar
          style={{
            top: '18%',
            left: '5%',
            animationName: 'shootLeft',
            animationDuration: '3.5s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
        <ShootingStar
          style={{
            top: '30%',
            right: '8%',
            animationName: 'shootRight',
            animationDuration: '4.2s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: '1.8s',
          }}
        />

        {/* ---- Gradient overlay – bottom fade to black ---- */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 50%, rgba(3,0,20,0.7) 80%, #030014 100%)',
            zIndex: 1,
          }}
        />

        {/* ---- Radial glow behind text ---- */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)',
            zIndex: 1,
          }}
        />

        {/* ---- Main content ---- */}
        <div
          className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center"
          style={{ zIndex: 2 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4 max-w-4xl mx-auto"
          >
            {/* Date / tag badge */}
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-widest uppercase"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#e879f9',
                  letterSpacing: '0.2em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#e879f9',
                    boxShadow: '0 0 8px #e879f9',
                  }}
                />
                August 9, 2026 · 20 Years of Magic
              </div>
            </motion.div>

            {/* Happy 20th Birthday */}
            <motion.div variants={itemVariants}>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                style={{
                  fontFamily: 'Cinzel, "Times New Roman", serif',
                  background:
                    'linear-gradient(135deg, #a855f7 0%, #ec4899 45%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.5))',
                }}
              >
                Happy 20th Birthday
              </h1>
            </motion.div>

            {/* Name – Meenu */}
            <motion.div variants={itemVariants}>
              <div
                style={{
                  fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                  fontSize: 'clamp(5rem, 15vw, 11rem)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  backgroundImage:
                    'linear-gradient(90deg, #f59e0b 0%, #fde68a 20%, #f59e0b 40%, #fbbf24 60%, #fde68a 80%, #f59e0b 100%)',
                  backgroundSize: '400% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 4s linear infinite',
                  filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.55))',
                }}
              >
                Meenu
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants}>
              <p
                className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
                style={{ color: 'rgba(216,180,254,0.8)', letterSpacing: '0.04em' }}
              >
                Two decades of brilliance, beauty, and boundless dreams
              </p>
            </motion.div>

            {/* Decorative divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 my-2"
            >
              <div
                className="h-px w-20"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(168,85,247,0.6))',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#a855f7',
                  boxShadow: '0 0 12px #a855f7',
                }}
              />
              <div
                className="h-px w-20"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(168,85,247,0.6), transparent)',
                }}
              />
            </motion.div>

            {/* Age counter */}
            <motion.div variants={itemVariants} className="w-full">
              <AgeCounter />
            </motion.div>

            {/* Glass morphism CTA badge */}
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(249,168,212,0.2)',
                  color: 'rgba(249,168,212,0.85)',
                  letterSpacing: '0.08em',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                A journey worth celebrating
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---- Scroll indicator ---- */}
        <ScrollIndicator />
      </section>
    </>
  )
}
