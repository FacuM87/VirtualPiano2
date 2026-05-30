'use client'

import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

interface OctaveSelectorProps {
  octaveCount: number
  startOctave: number
  onOctaveCountChange: (count: number) => void
  onStartOctaveChange: (octave: number) => void
}

const MAX_START_OCTAVE = 7

function StepButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 flex items-center justify-center rounded font-mono text-base leading-none transition-colors border ${
        disabled
          ? 'border-border-subtle bg-bg-panel text-text-dim cursor-default'
          : 'border-accent-cyan bg-bg-panel text-accent-cyan cursor-pointer'
      }`}
    >
      {label}
    </button>
  )
}

export function OctaveSelector({ octaveCount, startOctave, onOctaveCountChange, onStartOctaveChange }: OctaveSelectorProps) {
  return (
    <div className="flex gap-8 items-center bg-bg-panel border border-border-subtle rounded-lg px-5 py-[10px]">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-text-dim uppercase">OCTAVAS</span>
        <div className="flex items-center gap-2">
          <StepButton label="−" onClick={() => onOctaveCountChange(octaveCount - 1)} disabled={octaveCount <= PIANO_CONFIG.MIN_OCTAVES} />
          <span className="font-mono text-base text-accent-cyan w-6 text-center">{octaveCount}</span>
          <StepButton label="+" onClick={() => onOctaveCountChange(octaveCount + 1)} disabled={octaveCount >= PIANO_CONFIG.MAX_OCTAVES} />
        </div>
      </div>

      <div className="w-px h-10 bg-border-subtle" />

      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-text-dim uppercase">INICIO</span>
        <div className="flex items-center gap-2">
          <StepButton label="◀" onClick={() => onStartOctaveChange(startOctave - 1)} disabled={startOctave <= 0} />
          <span className="font-mono text-base text-accent-cyan w-6 text-center">C{startOctave}</span>
          <StepButton label="▶" onClick={() => onStartOctaveChange(startOctave + 1)} disabled={startOctave >= MAX_START_OCTAVE} />
        </div>
      </div>
    </div>
  )
}
