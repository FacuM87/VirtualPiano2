'use client'

import { useCallback } from 'react'
import { usePianoLayout } from '@/hooks/usePianoLayout'
import { PianoKey } from './PianoKey'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

interface PianoKeyboardProps {
  octaveCount: number
  startOctave: number
  onNoteOn: (note: string) => void
  onNoteOff: (note: string) => void
  activeNotes?: Set<string>
}

export function PianoKeyboard({
  octaveCount,
  startOctave,
  onNoteOn,
  onNoteOff,
  activeNotes = new Set(),
}: PianoKeyboardProps) {
  const { keys, totalWidthPx } = usePianoLayout(octaveCount, startOctave)

  const handlePointerDown = useCallback((note: string) => onNoteOn(note), [onNoteOn])
  const handlePointerUp = useCallback((note: string) => onNoteOff(note), [onNoteOff])

  return (
    <div className="overflow-x-auto overflow-y-hidden w-full px-4 pb-4">
      <div
        className="relative mx-auto bg-bg-panel-dark rounded-b-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        style={{ width: totalWidthPx, height: PIANO_CONFIG.WHITE_KEY_HEIGHT }}
      >
        {keys.map((pianoNote) => (
          <PianoKey
            key={pianoNote.note}
            pianoNote={pianoNote}
            isActive={activeNotes.has(pianoNote.note)}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          />
        ))}
      </div>
    </div>
  )
}
