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
    return (
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`absolute z-2 rounded-b cursor-pointer select-none origin-top transition-[transform,background-color,box-shadow] duration-60 ease-out ${
          isActive ? 'bg-key-black-active' : 'bg-key-black'
        }`}
        style={{
          left: whiteIndex * W + W - BW / 2,
          top: 0,
          width: BW,
          height: BH,
          transform: isActive ? 'translateY(3px) scaleY(0.985)' : 'translateY(0) scaleY(1)',
          boxShadow: isActive
            ? '0 0 10px var(--color-accent-cyan), inset 0 -2px 4px rgba(0,229,255,0.3)'
            : '2px 5px 8px rgba(0,0,0,0.7)',
        }}
      />
    )
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`absolute z-1 rounded-b-[6px] cursor-pointer select-none origin-top transition-[transform,background-color,box-shadow] duration-60 ease-out ${
        isActive ? 'bg-key-white-active' : 'bg-key-white'
      }`}
      style={{
        left: whiteIndex * W,
        top: 0,
        width: W - 1,
        height: WH,
        borderLeft: '1px solid rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        transform: isActive ? 'translateY(4px) scaleY(0.978)' : 'translateY(0) scaleY(1)',
        boxShadow: isActive
          ? '0 0 12px var(--color-accent-cyan), inset 0 -4px 8px rgba(0,229,255,0.35)'
          : '1px 3px 5px rgba(0,0,0,0.35)',
      }}
    />
  )
}
