'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Heavy 3D/canvas components — load client-side only
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false })
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const Navigation = dynamic(() => import('@/components/Navigation'), { ssr: false })
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false })
const MemoryUniverse = dynamic(() => import('@/components/MemoryUniverse'), { ssr: false })
const TimelineSection = dynamic(() => import('@/components/TimelineSection'), { ssr: false })
const PhotoGallery = dynamic(() => import('@/components/PhotoGallery'), { ssr: false })
const BirthdayLetter = dynamic(() => import('@/components/BirthdayLetter'), { ssr: false })
const WishesSection = dynamic(() => import('@/components/WishesSection'), { ssr: false })
const SurprisePortal = dynamic(() => import('@/components/SurprisePortal'), { ssr: false })
const BirthdayCake = dynamic(() => import('@/components/BirthdayCake'), { ssr: false })
const FireworksShow = dynamic(() => import('@/components/FireworksShow'), { ssr: false })
const AudioController = dynamic(() => import('@/components/AudioController'), { ssr: false })

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleLoadComplete = () => {
    setLoading(false)
    document.body.style.overflow = ''
  }

  if (!mounted) return null

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Global ambient particles */}
      <ParticleBackground />

      {/* Loading sequence */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={handleLoadComplete} />
        )}
      </AnimatePresence>

      {/* Main experience */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navigation />
            <AudioController />

            <main>
              <section id="hero">
                <HeroSection />
              </section>

              <section id="memories">
                <MemoryUniverse />
              </section>

              <section id="timeline">
                <TimelineSection />
              </section>

              <section id="gallery">
                <PhotoGallery />
              </section>

              <section id="letter">
                <BirthdayLetter />
              </section>

              <section id="wishes">
                <WishesSection />
              </section>

              <section id="surprise">
                <SurprisePortal />
              </section>

              <section id="cake">
                <BirthdayCake />
              </section>

              <section id="fireworks">
                <FireworksShow />
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
                  <p className="text-white/40 text-sm mt-4">
                    August 9, 2006 — August 9, 2026
                  </p>
                  <p className="text-white/30 text-xs mt-2">
                    Made with ✨ and infinite love
                  </p>
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

                {/* Footer glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.15) 0%, transparent 60%)',
                  }}
                />
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
