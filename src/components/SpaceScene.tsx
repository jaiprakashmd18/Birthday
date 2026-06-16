'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, Sparkles, OrbitControls } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// -------------------------------------------------------------------
// Animated camera – gentle bob and drift
// -------------------------------------------------------------------
function CameraRig() {
  const { camera } = useThree()
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta * 0.3
    camera.position.x = Math.sin(t.current * 0.4) * 0.6
    camera.position.y = Math.sin(t.current * 0.25) * 0.4
    camera.lookAt(0, 0, 0)
  })

  return null
}

// -------------------------------------------------------------------
// Rotating star field (separate from drei <Stars>)
// -------------------------------------------------------------------
function StarField() {
  const mesh = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 3000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#f9a8d4'),
      new THREE.Color('#818cf8'),
    ]

    for (let i = 0; i < count; i++) {
      // Scatter in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 20 + Math.random() * 60

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return { positions: pos, colors: col }
  }, [])

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.012
      mesh.current.rotation.x += delta * 0.005
    }
  })

  // Build geometry imperatively to avoid JSX bufferAttribute API changes across three.js versions
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [positions, colors])

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  )
}

// -------------------------------------------------------------------
// Floating geometric shapes (icosahedra + octahedra)
// -------------------------------------------------------------------
type ShapeConfig = {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  color: string
  type: 'ico' | 'oct'
  speed: number
}

function FloatingShape({ cfg }: { cfg: ShapeConfig }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * cfg.speed * 0.4
      mesh.current.rotation.y += delta * cfg.speed * 0.6
    }
  })

  const geo = useMemo(
    () =>
      cfg.type === 'ico'
        ? new THREE.IcosahedronGeometry(1, 0)
        : new THREE.OctahedronGeometry(1, 0),
    [cfg.type]
  )

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh
        ref={mesh}
        position={cfg.position}
        rotation={cfg.rotation}
        scale={cfg.scale}
        geometry={geo}
      >
        <meshStandardMaterial
          color={cfg.color}
          emissive={cfg.color}
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  )
}

function FloatingShapes() {
  const shapes = useMemo<ShapeConfig[]>(
    () => [
      { position: [-4, 2, -3],  rotation: [0.5, 0.3, 0],   scale: 0.7, color: '#a855f7', type: 'ico', speed: 0.5 },
      { position: [4, -1.5, -4], rotation: [0.2, 0.8, 0.1], scale: 0.9, color: '#ec4899', type: 'oct', speed: 0.4 },
      { position: [-3, -2, -2], rotation: [1.0, 0.1, 0.4], scale: 0.5, color: '#818cf8', type: 'ico', speed: 0.7 },
      { position: [3, 3, -5],   rotation: [0.3, 0.6, 0.2], scale: 1.1, color: '#f472b6', type: 'oct', speed: 0.3 },
      { position: [0, -3, -4],  rotation: [0.7, 0.2, 0.5], scale: 0.6, color: '#c084fc', type: 'ico', speed: 0.6 },
      { position: [-5, 0.5, -6],rotation: [0.1, 0.9, 0.3], scale: 0.8, color: '#e879f9', type: 'oct', speed: 0.35 },
    ],
    []
  )

  return (
    <>
      {shapes.map((cfg, i) => (
        <FloatingShape key={i} cfg={cfg} />
      ))}
    </>
  )
}

// -------------------------------------------------------------------
// Glowing orb / planet
// -------------------------------------------------------------------
function GlowingOrb() {
  const mesh = useRef<THREE.Mesh>(null)
  const wireMesh = useRef<THREE.Mesh>(null)

  const geo = useMemo(() => new THREE.SphereGeometry(1.4, 64, 64), [])
  const wireGeo = useMemo(() => new THREE.SphereGeometry(1.42, 24, 24), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.08
    }
    if (wireMesh.current) {
      wireMesh.current.rotation.y = -t * 0.05
      wireMesh.current.rotation.x = t * 0.03
    }
  })

  return (
    <Float speed={0.8} floatIntensity={0.4} rotationIntensity={0.1}>
      <group position={[0, 0, -3]}>
        {/* Core sphere */}
        <mesh ref={mesh} geometry={geo}>
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#4c1d95"
            emissiveIntensity={0.4}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        {/* Wireframe shell */}
        <mesh ref={wireMesh} geometry={wireGeo}>
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
        {/* Glow halo via point light */}
        <pointLight color="#7c3aed" intensity={3} distance={8} decay={2} />
      </group>
    </Float>
  )
}

// -------------------------------------------------------------------
// Upward-drifting particles
// -------------------------------------------------------------------
function DriftParticles() {
  const mesh = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const count = 200
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      spd[i] = 0.008 + Math.random() * 0.018
    }

    return { positions: pos, speeds: spd }
  }, [])

  useFrame(() => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position
      .array as Float32Array

    for (let i = 0; i < speeds.length; i++) {
      pos[i * 3 + 1] += speeds[i]
      // Reset to bottom when above ceiling
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = -8
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#f9a8d4"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

// -------------------------------------------------------------------
// Main exported component
// -------------------------------------------------------------------
export default function SpaceScene() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 5], near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#030014' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#030014')
        }}
      >
        {/* Fog / nebula atmosphere */}
        <fog attach="fog" args={['#0d0221', 30, 90]} />

        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]}   color="#c084fc" intensity={2}  />
        <pointLight position={[-5, -5, 3]} color="#ec4899" intensity={1.5} />
        <pointLight position={[0, 8, -2]}  color="#818cf8" intensity={1.2} />

        {/* Background star field from drei (distant layer) */}
        <Stars
          radius={120}
          depth={60}
          count={2000}
          factor={4}
          saturation={0.6}
          fade
          speed={0.4}
        />

        {/* Custom rotating star field (foreground layer) */}
        <StarField />

        {/* Sparkle dust */}
        <Sparkles
          count={120}
          scale={10}
          size={1.2}
          speed={0.3}
          color="#f9a8d4"
          opacity={0.6}
        />

        {/* 3D elements */}
        <GlowingOrb />
        <FloatingShapes />
        <DriftParticles />

        {/* Animated camera rig */}
        <CameraRig />
      </Canvas>
    </div>
  )
}
