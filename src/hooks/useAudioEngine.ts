'use client'

import { useState, useCallback } from 'react'
import * as engine from '@/lib/audio/engine'

export function useAudioEngine() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set())

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

  return { activeNotes, noteOn, noteOff }
}
