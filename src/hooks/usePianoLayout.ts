import { useMemo } from 'react'
import { generateKeys } from '@/lib/audio/noteMap'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'
import type { PianoNote } from '@/types'

export interface PianoLayout {
  keys: PianoNote[]
  whiteKeyCount: number
  totalWidthPx: number
}

export function usePianoLayout(octaveCount: number, startOctave: number): PianoLayout {
  return useMemo(() => {
    const clampedOctaves = Math.min(Math.max(octaveCount, PIANO_CONFIG.MIN_OCTAVES), PIANO_CONFIG.MAX_OCTAVES)
    const keys = generateKeys(startOctave, clampedOctaves)
    const whiteKeyCount = keys.filter((k) => !k.isBlack).length
    const totalWidthPx = whiteKeyCount * PIANO_CONFIG.WHITE_KEY_WIDTH
    return { keys, whiteKeyCount, totalWidthPx }
  }, [octaveCount, startOctave])
}
