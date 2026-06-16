'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [showVolume, setShowVolume] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate ambient cinematic music using Web Audio API
  const createAmbientMusic = useCallback(() => {
    if (audioCtxRef.current) return

    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2)
    masterGain.connect(ctx.destination)
    gainNodeRef.current = masterGain

    // Create reverb convolver for space-like reverb
    const reverb = ctx.createConvolver()
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.3
    reverbGain.connect(masterGain)

    // Base drone
    const drone = ctx.createOscillator()
    const droneGain = ctx.createGain()
    drone.type = 'sine'
    drone.frequency.setValueAtTime(55, ctx.currentTime)
    droneGain.gain.value = 0.15
    drone.connect(droneGain)
    droneGain.connect(masterGain)
    drone.start()
    oscillatorsRef.current.push(drone)

    // Second harmonic
    const drone2 = ctx.createOscillator()
    const drone2Gain = ctx.createGain()
    drone2.type = 'sine'
    drone2.frequency.setValueAtTime(82.5, ctx.currentTime)
    drone2Gain.gain.value = 0.1
    drone2.connect(drone2Gain)
    drone2Gain.connect(masterGain)
    drone2.start()
    oscillatorsRef.current.push(drone2)

    // Sparkle melody notes
    const melodyNotes = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25]
    let noteIndex = 0

    const playMelodyNote = () => {
      if (!audioCtxRef.current || !gainNodeRef.current) return
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      const now = ctx.currentTime

      osc.type = 'sine'
      osc.frequency.setValueAtTime(melodyNotes[noteIndex % melodyNotes.length], now)
      oscGain.gain.setValueAtTime(0, now)
      oscGain.gain.linearRampToValueAtTime(0.08, now + 0.1)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

      osc.connect(oscGain)
      oscGain.connect(masterGain)
      osc.start(now)
      osc.stop(now + 1.5)

      noteIndex++
    }

    intervalRef.current = setInterval(playMelodyNote, 800)

    // Pad chords
    const chordFreqs = [[130.81, 164.81, 196], [146.83, 184.99, 220], [174.61, 220, 261.63]]
    let chordIndex = 0

    const playChord = () => {
      if (!audioCtxRef.current) return
      const now = ctx.currentTime
      chordFreqs[chordIndex % chordFreqs.length].forEach(freq => {
        const osc = ctx.createOscillator()
        const oscGain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        oscGain.gain.setValueAtTime(0, now)
        oscGain.gain.linearRampToValueAtTime(0.04, now + 0.5)
        oscGain.gain.linearRampToValueAtTime(0.02, now + 3)
        oscGain.gain.linearRampToValueAtTime(0, now + 4)
        osc.connect(oscGain)
        oscGain.connect(masterGain)
        osc.start(now)
        osc.stop(now + 4)
      })
      chordIndex++
    }

    playChord()
    const chordInterval = setInterval(playChord, 4000)
    oscillatorsRef.current.push({ stop: () => clearInterval(chordInterval) } as unknown as OscillatorNode)
  }, [volume])

  const togglePlay = useCallback(() => {
    setHasInteracted(true)
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        createAmbientMusic()
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
        gainNodeRef.current?.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.5)
      }
      setIsPlaying(true)
    } else {
      gainNodeRef.current?.gain.linearRampToValueAtTime(0, (audioCtxRef.current?.currentTime ?? 0) + 0.5)
      setTimeout(() => audioCtxRef.current?.suspend(), 600)
      setIsPlaying(false)
    }
  }, [isPlaying, createAmbientMusic, volume])

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1)
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      oscillatorsRef.current.forEach(osc => { try { osc.stop() } catch {} })
      audioCtxRef.current?.close()
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[9500] flex flex-col items-end gap-3">
      {/* Volume slider */}
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl"
            style={{
              background: 'rgba(3,0,20,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
          >
            <span className="text-xs text-white/60 font-medium">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-purple-500"
              style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '80px', width: '4px' }}
            />
            <span className="text-xs text-purple-400">{Math.round(volume * 100)}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music info tooltip */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 3 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white/70"
            style={{
              background: 'rgba(3,0,20,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168,85,247,0.2)',
            }}
          >
            <span>🎵</span>
            <span>Click to play ambient music</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Volume button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowVolume(!showVolume)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          style={{
            background: 'rgba(3,0,20,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-12 h-12 rounded-full flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #7B2FBE, #EC4899)',
            boxShadow: isPlaying
              ? '0 0 20px rgba(168,85,247,0.6), 0 0 40px rgba(168,85,247,0.3)'
              : '0 0 10px rgba(168,85,247,0.3)',
          }}
        >
          {isPlaying ? (
            <>
              {/* Pause icon */}
              <div className="flex gap-1">
                <span className="w-1 h-4 bg-white rounded-sm" />
                <span className="w-1 h-4 bg-white rounded-sm" />
              </div>
              {/* Ripple */}
              <motion.span
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-purple-400"
              />
            </>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </motion.button>
      </div>

      {/* Equalizer bars */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-4">
          {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [1, Math.random() * 2 + 0.5, 1] }}
              transition={{ duration: 0.4 + i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
              className="w-1 rounded-full"
              style={{
                height: `${h * 2}px`,
                background: `linear-gradient(to top, #A855F7, #EC4899)`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
