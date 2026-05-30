'use client'

import { useState } from 'react'
import { PianoKeyboard } from '@/components/piano/PianoKeyboard'
import { OctaveSelector } from '@/components/piano/OctaveSelector'
import { ControlPanel } from '@/components/controls/ControlPanel'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

export default function Home() {
  const [octaveCount, setOctaveCount] = useState<number>(PIANO_CONFIG.DEFAULT_OCTAVES)
  const [startOctave, setStartOctave] = useState<number>(PIANO_CONFIG.DEFAULT_START_OCTAVE)
  const { activeNotes, noteOn, noteOff, controls, setVolume, setReverbWet, setChorusWet, setWaveform } = useAudioEngine()

  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-primary)',
        gap: '1.5rem',
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

      <ControlPanel
        controls={controls}
        onVolumeChange={setVolume}
        onReverbChange={setReverbWet}
        onChorusChange={setChorusWet}
        onWaveformChange={setWaveform}
      />

      <OctaveSelector
        octaveCount={octaveCount}
        startOctave={startOctave}
        onOctaveCountChange={setOctaveCount}
        onStartOctaveChange={setStartOctave}
      />

      <PianoKeyboard
        octaveCount={octaveCount}
        startOctave={startOctave}
        onNoteOn={noteOn}
        onNoteOff={noteOff}
        activeNotes={activeNotes}
      />
    </main>
  )
}
