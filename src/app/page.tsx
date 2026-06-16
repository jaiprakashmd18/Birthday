'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ErrorBoundary from '@/components/ErrorBoundary'

// Minimal section fallback
const SectionFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="flex gap-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: 'rgba(168,85,247,0.6)',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
)

// Heavy 3D/canvas components — load client-side only
const LoadingScreen   = dynamic(() => import('@/components/LoadingScreen'),   { ssr: false, loading: () => <div className="fixed inset-0 bg-[#030014]" /> })
const CustomCursor    = dynamic(() => import('@/components/CustomCursor'),    { ssr: false })
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const Navigation      = dynamic(() => import('@/components/Navigation'),      { ssr: false })
const AudioController = dynamic(() => import('@/components/AudioController'), { ssr: false })
const HeroSection     = dynamic(() => import('@/components/HeroSection'),     { ssr: false, loading: SectionFallback })
const MemoryUniverse  = dynamic(() => import('@/components/MemoryUniverse'),  { ssr: false, loading: SectionFallback })
const TimelineSection = dynamic(() => import('@/components/TimelineSection'), { ssr: false, loading: SectionFallback })
const PhotoGallery    = dynamic(() => import('@/components/PhotoGallery'),    { ssr: false, loading: SectionFallback })
const BirthdayLetter  = dynamic(() => import('@/components/BirthdayLetter'),  { ssr: false, loading: SectionFallback })
const WishesSection   = dynamic(() => import('@/components/WishesSection'),   { ssr: false, loading: SectionFallback })
const SurprisePortal  = dynamic(() => import('@/components/SurprisePortal'),  { ssr: false, loading: SectionFallback })
const BirthdayCake    = dynamic(() => import('@/components/BirthdayCake'),    { ssr: false, loading: SectionFallback })
const FireworksShow   = dynamic(() => import('@/components/FireworksShow'),   { ssr: false, loading: SectionFallback })

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleLoadComplete = () => {
    setLoading(false)
    document.body.style.overflow = ''
  }

  if (!mounted) return <div className="fixed inset-0 bg-[#030014]" />

  return (
    <>
      <ErrorBoundary name="CustomCursor">
        <CustomCursor />
      </ErrorBoundary>

      <ErrorBoundary name="ParticleBackground">
        <ParticleBackground />
      </ErrorBoundary>

      <AnimatePresence>
        {loading && (
          <ErrorBoundary name="LoadingScreen" fallback={
            <div className="fixed inset-0 bg-[#030014] flex items-center justify-center z-[100000]">
              <button
                onClick={handleLoadComplete}
                className="text-purple-400 text-lg"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Enter ✨
              </button>
            </div>
          }>
            <LoadingScreen onComplete={handleLoadComplete} />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <ErrorBoundary name="Navigation"><Navigation /></ErrorBoundary>
            <ErrorBoundary name="AudioController"><AudioController /></ErrorBoundary>

            <main>
              <section id="hero">
                <ErrorBoundary name="HeroSection"><HeroSection /></ErrorBoundary>
              </section>

              <section id="memories">
                <ErrorBoundary name="MemoryUniverse"><MemoryUniverse /></ErrorBoundary>
              </section>

              <section id="timeline">
                <ErrorBoundary name="TimelineSection"><TimelineSection /></ErrorBoundary>
              </section>

              <section id="gallery">
                <ErrorBoundary name="PhotoGallery"><PhotoGallery /></ErrorBoundary>
              </section>

              <section id="letter">
                <ErrorBoundary name="BirthdayLetter"><BirthdayLetter /></ErrorBoundary>
              </section>

              <section id="wishes">
                <ErrorBoundary name="WishesSection"><WishesSection /></ErrorBoundary>
              </section>

              <section id="surprise">
                <ErrorBoundary name="SurprisePortal"><SurprisePortal /></ErrorBoundary>
              </section>

              <section id="cake">
                <ErrorBoundary name="BirthdayCake"><BirthdayCake /></ErrorBoundary>
              </section>

              <section id="fireworks">
                <ErrorBoundary name="FireworksShow"><FireworksShow /></ErrorBoundary>
              </section>

              {/* Footer */}
              <footer className="relative py-16 text-center overflow-hidden"
                style={{ background: 'linear-gradient(to top, #030014, #0a0020)' }}
              >
                <div className="relative z-10">
                  <div
                    className="text-5xl font-black mb-4"
                    style={{
                      fontFamily: 'Cinzel, serif',
                      background: 'linear-gradient(135deg, #A855F7, #EC4899, #F59E0B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    M20
                  </div>
                  <p
                    className="text-2xl mb-2"
                    style={{
                      fontFamily: 'Dancing Script, cursive',
                      background: 'linear-gradient(135deg, #EC4899, #F59E0B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Happy 20th Birthday, Meenu
                  </p>
                  <p className="text-white/40 text-sm mt-4">August 9, 2006 — August 9, 2026</p>
                  <p className="text-white/30 text-xs mt-2">Made with ✨ and infinite love</p>
                  <div className="flex justify-center gap-3 mt-6 text-2xl">
                    {['💜', '🌟', '💗', '✨', '🎂'].map((emoji, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.15) 0%, transparent 60%)' }}
                />
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
