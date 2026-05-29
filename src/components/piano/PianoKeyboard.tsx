'use client'

import { useState, useCallback } from 'react'
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
    <div
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        width: '100%',
        padding: '0 16px 16px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: totalWidthPx,
          height: PIANO_CONFIG.WHITE_KEY_HEIGHT,
          margin: '0 auto',
          backgroundColor: 'var(--color-bg-panel-dark)',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
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
