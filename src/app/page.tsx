'use client'

import { useState } from 'react'
import { PianoKeyboard } from '@/components/piano/PianoKeyboard'
import { OctaveSelector } from '@/components/piano/OctaveSelector'
import { ControlPanel } from '@/components/controls/ControlPanel'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useLooper } from '@/hooks/useLooper'
import { LoopStation } from '@/components/looper/LoopStation'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

export default function Home() {
  const [octaveCount, setOctaveCount] = useState<number>(PIANO_CONFIG.DEFAULT_OCTAVES)
  const [startOctave, setStartOctave] = useState<number>(PIANO_CONFIG.DEFAULT_START_OCTAVE)
  const { activeNotes, noteOn, noteOff, controls, setVolume, setReverbWet, setChorusWet, setWaveform } = useAudioEngine()
  const { slots, wrappedNoteOn, wrappedNoteOff, pressSlot, clearSlot } = useLooper(noteOn, noteOff)
  useKeyboard(wrappedNoteOn, wrappedNoteOff, startOctave)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-primary gap-6 p-8">
      <h1 className="font-mono text-xl tracking-[0.3em] text-accent-cyan m-0 [text-shadow:0_0_20px_var(--color-accent-cyan)]">
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
        onNoteOn={wrappedNoteOn}
        onNoteOff={wrappedNoteOff}
        activeNotes={activeNotes}
      />

      <LoopStation
        slots={slots}
        onPressSlot={pressSlot}
        onClearSlot={clearSlot}
      />
    </main>
  )
}
