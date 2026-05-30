'use client'

import { useState, useCallback, useEffect } from 'react'
import * as engine from '@/lib/audio/engine'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'
import type { AudioEngineControls, Waveform } from '@/types'

export function useAudioEngine() {
  useEffect(() => { engine.preloadSampler() }, [])

  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set())
  const [controls, setControls] = useState<AudioEngineControls>({
    volume: PIANO_CONFIG.DEFAULT_VOLUME,
    reverbWet: PIANO_CONFIG.DEFAULT_REVERB_WET,
    chorusWet: PIANO_CONFIG.DEFAULT_CHORUS_WET,
    waveform: PIANO_CONFIG.DEFAULT_WAVEFORM,
  })

  const noteOn = useCallback(async (note: string) => {
    await engine.playNote(note)
    setActiveNotes((prev) => new Set(prev).add(note))
  }, [])

  const noteOff = useCallback(async (note: string) => {
    await engine.stopNote(note)
    setActiveNotes((prev) => {
      const next = new Set(prev)
      next.delete(note)
      return next
    })
  }, [])

  const setVolume = useCallback(async (value: number) => {
    await engine.setVolume(value)
    setControls((prev) => ({ ...prev, volume: value }))
  }, [])

  const setReverbWet = useCallback(async (value: number) => {
    await engine.setReverbWet(value)
    setControls((prev) => ({ ...prev, reverbWet: value }))
  }, [])

  const setChorusWet = useCallback(async (value: number) => {
    await engine.setChorusWet(value)
    setControls((prev) => ({ ...prev, chorusWet: value }))
  }, [])

  const setWaveform = useCallback(async (waveform: Waveform) => {
    await engine.setWaveform(waveform)
    setControls((prev) => ({ ...prev, waveform }))
  }, [])

  return { activeNotes, noteOn, noteOff, controls, setVolume, setReverbWet, setChorusWet, setWaveform }
}
