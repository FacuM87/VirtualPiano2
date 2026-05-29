'use client'

import { PianoKeyboard } from '@/components/piano/PianoKeyboard'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

export default function Home() {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-primary)',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: '1.25rem',
          letterSpacing: '0.3em',
          color: 'var(--color-accent-cyan)',
          margin: 0,
          textShadow: '0 0 20px var(--color-accent-cyan)',
        }}
      >
        VIRTUAL PIANO
      </h1>

      <PianoKeyboard
        octaveCount={PIANO_CONFIG.DEFAULT_OCTAVES}
        startOctave={PIANO_CONFIG.DEFAULT_START_OCTAVE}
        onNoteOn={() => {}}
        onNoteOff={() => {}}
      />
    </main>
  )
}
