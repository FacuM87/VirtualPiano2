'use client'

import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'
import type { PianoNote } from '@/types'

interface PianoKeyProps {
  pianoNote: PianoNote
  isActive: boolean
  onPointerDown: (note: string) => void
  onPointerUp: (note: string) => void
}

const W = PIANO_CONFIG.WHITE_KEY_WIDTH
const WH = PIANO_CONFIG.WHITE_KEY_HEIGHT
const BW = Math.round(W * PIANO_CONFIG.BLACK_KEY_WIDTH_RATIO)
const BH = Math.round(WH * PIANO_CONFIG.BLACK_KEY_HEIGHT_RATIO)

export function PianoKey({ pianoNote, isActive, onPointerDown, onPointerUp }: PianoKeyProps) {
  const { note, isBlack, whiteIndex } = pianoNote

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    onPointerDown(note)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    onPointerUp(note)
  }

  if (isBlack) {
    const left = whiteIndex * W + W - BW / 2
    return (
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'absolute',
          left,
          top: 0,
          width: BW,
          height: BH,
          zIndex: 2,
          borderRadius: '0 0 4px 4px',
          cursor: 'pointer',
          userSelect: 'none',
          backgroundColor: isActive ? 'var(--color-key-black-active)' : 'var(--color-key-black)',
          boxShadow: isActive
            ? '0 0 8px var(--color-accent-cyan), inset 0 -2px 4px rgba(0,229,255,0.3)'
            : '2px 4px 6px rgba(0,0,0,0.6)',
          transition: 'background-color 0.05s',
        }}
      />
    )
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        position: 'absolute',
        left: whiteIndex * W,
        top: 0,
        width: W - 1,
        height: WH,
        zIndex: 1,
        borderRadius: '0 0 6px 6px',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: isActive ? 'var(--color-key-white-active)' : 'var(--color-key-white)',
        boxShadow: isActive
          ? '0 0 10px var(--color-accent-cyan), inset 0 -3px 6px rgba(0,229,255,0.4)'
          : '1px 2px 4px rgba(0,0,0,0.3)',
        borderLeft: '1px solid rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        transition: 'background-color 0.05s',
      }}
    />
  )
}
