'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Cylinder, Sphere, Float } from '@react-three/drei'
import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CandleProps {
  position: [number, number, number]
  blown: boolean
  index: number
}

interface FlameProps {
  blown: boolean
  index: number
}

interface CakeSceneProps {
  blown: boolean
}

interface ConfettiPieceProps {
  index: number
}

// ---------------------------------------------------------------------------
// Flame — animated sphere that sits atop each candle
// ---------------------------------------------------------------------------
function Flame({ blown, index }: FlameProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const speed = 0.8 + (index % 5) * 0.12

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.scale.y = blown ? 0.01 : 0.8 + Math.sin(t * 3.1) * 0.2
    meshRef.current.scale.x = blown ? 0.01 : 0.7 + Math.sin(t * 2.4 + 1) * 0.15
    meshRef.current.position.y = blown ? -0.3 : Math.sin(t * 2.0) * 0.03
  })

  const color = blown
    ? '#444444'
    : index % 3 === 0
    ? '#ff9900'
    : index % 3 === 1
    ? '#ffcc00'
    : '#ff6600'

  return (
    <mesh ref={meshRef} position={[0, 0.22, 0]}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={blown ? '#000000' : color}
        emissiveIntensity={blown ? 0 : 2.5}
        transparent
        opacity={blown ? 0 : 0.95}
        roughness={0.2}
        metalness={0}
      />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Single Candle
// ---------------------------------------------------------------------------
function Candle({ position, blown, index }: CandleProps) {
  const candleColors = ['#ff69b4', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa', '#f87171']
  const candleColor = candleColors[index % candleColors.length]

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 10]} />
        <meshStandardMaterial
          color={candleColor}
          roughness={0.4}
          metalness={0.1}
          emissive={candleColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.1, 6]} />
        <meshStandardMaterial color="#2a1a0a" roughness={1} />
      </mesh>

      {/* Wax drip blob */}
      <mesh position={[0.02, 0.1, 0]} scale={[0.6, 0.3, 0.5]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={candleColor} roughness={0.6} opacity={0.8} transparent />
      </mesh>

      {/* Flame */}
      <Flame blown={blown} index={index} />

      {/* Point light per flame — only a subset to keep perf reasonable */}
      {!blown && index % 4 === 0 && (
        <pointLight
          color="#ff9900"
          intensity={1.2}
          distance={1.8}
          decay={2}
          position={[0, 0.45, 0]}
        />
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3-Tier Cake
// ---------------------------------------------------------------------------
function CakeTiers() {
  // Bottom tier
  // Middle tier
  // Top tier
  const chocolateMat = {
    color: '#3b1a08',
    roughness: 0.5,
    metalness: 0.05,
  }
  const creamMat = {
    color: '#f5e0c8',
    roughness: 0.7,
    metalness: 0,
  }
  const frostingColors = ['#e879f9', '#a78bfa', '#f472b6']

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Bottom tier ── */}
      <group position={[0, 0.35, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.3, 0.7, 40]} />
          <meshStandardMaterial {...chocolateMat} />
        </mesh>
        {/* cream ring top */}
        <mesh position={[0, 0.38, 0]}>
          <torusGeometry args={[1.1, 0.12, 12, 40]} />
          <meshStandardMaterial color={frostingColors[0]} roughness={0.6} emissive={frostingColors[0]} emissiveIntensity={0.15} />
        </mesh>
        {/* cream layer sides */}
        <mesh>
          <cylinderGeometry args={[1.32, 1.32, 0.15, 40]} />
          <meshStandardMaterial {...creamMat} />
        </mesh>
      </group>

      {/* ── Middle tier ── */}
      <group position={[0, 1.05, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.6, 40]} />
          <meshStandardMaterial {...chocolateMat} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <torusGeometry args={[0.75, 0.11, 12, 40]} />
          <meshStandardMaterial color={frostingColors[1]} roughness={0.6} emissive={frostingColors[1]} emissiveIntensity={0.15} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.92, 0.92, 0.13, 40]} />
          <meshStandardMaterial {...creamMat} />
        </mesh>
      </group>

      {/* ── Top tier ── */}
      <group position={[0, 1.68, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.5, 40]} />
          <meshStandardMaterial {...chocolateMat} />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <torusGeometry args={[0.46, 0.09, 12, 40]} />
          <meshStandardMaterial color={frostingColors[2]} roughness={0.6} emissive={frostingColors[2]} emissiveIntensity={0.15} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 40]} />
          <meshStandardMaterial {...creamMat} />
        </mesh>
      </group>

      {/* Top cream dome */}
      <mesh position={[0, 2.02, 0]} scale={[1, 0.55, 1]}>
        <sphereGeometry args={[0.58, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...creamMat} />
      </mesh>

      {/* Base plate */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.06, 40]} />
        <meshStandardMaterial color="#fdf0e0" roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 20 Candles arranged in a circle on the top tier
// ---------------------------------------------------------------------------
function Candles({ blown }: { blown: boolean }) {
  const count = 20
  const radius = 0.38
  const yBase = 0.45 // top of top tier relative to cake group

  const candles: React.JSX.Element[] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    candles.push(
      <Candle
        key={i}
        position={[x, yBase, z]}
        blown={blown}
        index={i}
      />
    )
  }
  return <group position={[0, 0.62, 0]}>{candles}</group>
}

// ---------------------------------------------------------------------------
// Slowly auto-rotating group
// ---------------------------------------------------------------------------
function RotatingCake({ blown }: { blown: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.18
  })

  return (
    <group ref={groupRef}>
      <CakeTiers />
      <Candles blown={blown} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Full 3-D scene
// ---------------------------------------------------------------------------
function CakeScene({ blown }: CakeSceneProps) {
  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.25} color="#ffe4c4" />

      {/* Key light from above-front */}
      <directionalLight
        position={[3, 6, 4]}
        intensity={0.8}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Warm fill from side */}
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#ff8844" distance={10} />

      {/* Warm backlight */}
      <pointLight position={[0, 3, -4]} intensity={0.4} color="#cc55ff" distance={10} />

      {/* Global flame-glow when not blown */}
      {!blown && (
        <pointLight position={[0, 2.8, 0]} intensity={1.5} color="#ffaa33" distance={3} decay={2} />
      )}

      {/* Manual environment lighting (no external CDN needed) */}
      <hemisphereLight args={['#1a0533', '#030014', 0.5]} />
      <pointLight position={[3, 5, 3]} color="#c084fc" intensity={1.5} />
      <pointLight position={[-3, 3, -3]} color="#ec4899" intensity={1} />

      <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.15}>
        <RotatingCake blown={blown} />
      </Float>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.3}
        autoRotate={false}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// CSS Confetti pieces
// ---------------------------------------------------------------------------
const CONFETTI_COLORS = [
  '#f472b6', '#a78bfa', '#34d399', '#fbbf24',
  '#60a5fa', '#f87171', '#fb923c', '#e879f9',
  '#4ade80', '#facc15',
]

function ConfettiPiece({ index }: ConfettiPieceProps) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
  const left = `${(index * 4.7 + 3) % 100}%`
  const delay = `${(index * 0.13) % 3}s`
  const duration = `${2.4 + (index % 5) * 0.4}s`
  const size = `${6 + (index % 5) * 3}px`
  const isCircle = index % 3 === 0
  const isRect = index % 3 === 1

  return (
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        left,
        width: isCircle ? size : isRect ? `${parseInt(size) * 2}px` : size,
        height: size,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : isRect ? '2px' : '1px',
        animation: `confettiFall ${duration} ${delay} ease-in infinite`,
        opacity: 0.9,
        transform: `rotate(${(index * 47) % 360}deg)`,
        willChange: 'transform, opacity',
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Confetti overlay
// ---------------------------------------------------------------------------
function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 80 }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CSS Firework burst (pure CSS, no canvas)
// ---------------------------------------------------------------------------
function Fireworks({ active }: { active: boolean }) {
  if (!active) return null

  const bursts = [
    { top: '18%', left: '12%', color: '#f472b6', delay: '0s' },
    { top: '10%', left: '50%', color: '#fbbf24', delay: '0.3s' },
    { top: '22%', left: '80%', color: '#a78bfa', delay: '0.6s' },
    { top: '55%', left: '6%',  color: '#34d399', delay: '0.9s' },
    { top: '60%', left: '88%', color: '#60a5fa', delay: '1.1s' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 55, overflow: 'hidden' }}>
      {bursts.map((b, bi) => (
        <div
          key={bi}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: 0,
            height: 0,
          }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 360
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: b.color,
                  boxShadow: `0 0 6px 2px ${b.color}`,
                  animation: `fireworkRay 1.2s ${b.delay} ease-out infinite`,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 0',
                  willChange: 'transform, opacity',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Celebration overlay card
// ---------------------------------------------------------------------------
function CelebrationOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="celebration"
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          style={{
            position: 'relative',
            zIndex: 10,
            marginTop: '2rem',
            padding: '2.5rem 3rem',
            borderRadius: '2rem',
            background:
              'linear-gradient(135deg, rgba(167,139,250,0.18) 0%, rgba(244,114,182,0.18) 100%)',
            border: '1.5px solid rgba(244,114,182,0.35)',
            backdropFilter: 'blur(16px)',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '2rem auto 0',
          }}
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: '3.5rem', marginBottom: '0.5rem', display: 'block' }}
          >
            🎂
          </motion.div>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #f472b6, #a78bfa, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
              lineHeight: 1.15,
            }}
          >
            Happy 20th Birthday!
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            Your twenties are going to be&nbsp;
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>absolutely magical</span>,&nbsp;
            Meenu. ✨
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {['🎉', '🎊', '💜', '🌟', '🎈', '💫', '🥂'].map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 + i * 0.15, delay: i * 0.1 }}
                style={{ fontSize: '1.5rem', display: 'inline-block' }}
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Wish text animation
// ---------------------------------------------------------------------------
function WishText({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.p
          key="wish"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{
            marginTop: '1.25rem',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: 'rgba(255,255,255,0.9)',
            fontStyle: 'italic',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          Make a Wish,{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #f472b6, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}
          >
            Meenu!
          </span>{' '}
          ✨
        </motion.p>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------
export default function BirthdayCake() {
  const [blown, setBlown] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [fireworks, setFireworks] = useState(false)

  const handleBlow = useCallback(() => {
    if (blown) return
    setBlown(true)
    setConfetti(true)
    setFireworks(true)

    // Stop confetti after 8 s so it doesn't run forever
    setTimeout(() => setConfetti(false), 8000)
    setTimeout(() => setFireworks(false), 8000)
  }, [blown])

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fireworkRay {
          0%   { transform: rotate(var(--angle, 0deg)) translateX(0)   scale(1);   opacity: 1; }
          70%  { opacity: 0.7; }
          100% { transform: rotate(var(--angle, 0deg)) translateX(90px) scale(0.2); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 24px 6px rgba(168,85,247,0.55), 0 0 48px 12px rgba(244,114,182,0.3); }
          50%       { box-shadow: 0 0 40px 12px rgba(168,85,247,0.8), 0 0 72px 20px rgba(244,114,182,0.5); }
        }
      `}</style>

      {/* Confetti + Fireworks — fixed, above everything */}
      <Confetti active={confetti} />
      <Fireworks active={fireworks} />

      {/* Section */}
      <section
        id="birthday-cake"
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.35) 0%, rgba(10,5,20,1) 65%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background stars */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #fbbf24 0%, #f472b6 40%, #a78bfa 80%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Make A Wish!
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{
              color: 'rgba(255,255,255,0.55)',
              marginTop: '0.6rem',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            20 candles for 20 wonderful years
          </motion.p>
        </motion.div>

        {/* 3-D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9 }}
          style={{
            width: '100%',
            maxWidth: '560px',
            height: 'clamp(340px, 55vw, 500px)',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2,
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(88,28,135,0.25) 0%, rgba(10,5,20,0.8) 100%)',
            boxShadow:
              '0 0 0 1px rgba(167,139,250,0.15), 0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 3.5, 5.5], fov: 42, near: 0.1, far: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <CakeScene blown={blown} />
          </Canvas>
        </motion.div>

        {/* Controls area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0',
            position: 'relative',
            zIndex: 2,
            width: '100%',
          }}
        >
          {/* Blow button */}
          <motion.button
            onClick={handleBlow}
            disabled={blown}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={!blown ? { scale: 1.08, y: -3 } : {}}
            whileTap={!blown ? { scale: 0.96 } : {}}
            style={{
              marginTop: '2.5rem',
              padding: '1rem 2.8rem',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontWeight: 800,
              borderRadius: '9999px',
              border: 'none',
              cursor: blown ? 'default' : 'pointer',
              background: blown
                ? 'linear-gradient(135deg, #6b21a8 0%, #831843 100%)'
                : 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f59e0b 100%)',
              backgroundSize: '200% 200%',
              color: '#ffffff',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              animation: blown ? 'none' : 'glowPulse 2s ease-in-out infinite',
              transition: 'background 0.5s, opacity 0.3s',
              opacity: blown ? 0.6 : 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {blown ? '🎉 Candles Blown Out!' : '💨 Blow Out the Candles!'}

            {/* Shimmer overlay on hover */}
            {!blown && (
              <motion.span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  borderRadius: 'inherit',
                  pointerEvents: 'none',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.button>

          {/* Wish text */}
          <WishText active={blown} />
        </div>

        {/* Celebration overlay card */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '560px' }}>
          <CelebrationOverlay active={blown} />
        </div>
      </section>
    </>
  )
}
