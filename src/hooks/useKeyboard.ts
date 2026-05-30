'use client'

import { useEffect, useRef } from 'react'
import { KEYBOARD_TO_SEMITONE, KEYBOARD_OCTAVE_OFFSET } from '@/lib/constants/keyboardMap'
import { semitoneToNote } from '@/lib/audio/noteMap'

export function useKeyboard(
  noteOn: (note: string) => void,
  noteOff: (note: string) => void,
  startOctave: number,
): void {
  const activeKeys = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    activeKeys.current.forEach((note) => noteOff(note))
    activeKeys.current.clear()
  }, [startOctave, noteOff])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const semitone = KEYBOARD_TO_SEMITONE[e.code]
      if (semitone === undefined) return

      const note = semitoneToNote(semitone, startOctave + KEYBOARD_OCTAVE_OFFSET)
      activeKeys.current.set(e.code, note)
      noteOn(note)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = activeKeys.current.get(e.code)
      if (note === undefined) return
      activeKeys.current.delete(e.code)
      noteOff(note)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [noteOn, noteOff, startOctave])
}
