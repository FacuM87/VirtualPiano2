'use client'

import type { Waveform } from '@/types'

const WAVEFORMS: { value: Waveform; label: string }[] = [
  { value: 'piano',    label: 'PIANO' },
  { value: 'sine',     label: 'SINE'  },
  { value: 'square',   label: 'SQR'   },
  { value: 'triangle', label: 'TRI'   },
  { value: 'sawtooth', label: 'SAW'   },
]

interface WaveformSelectorProps {
  value: Waveform
  onChange: (waveform: Waveform) => void
}

export function WaveformSelector({ value, onChange }: WaveformSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[0.55rem] tracking-[0.15em] text-text-dim uppercase">
        WAVEFORM
      </span>
      <div className="flex gap-1">
        {WAVEFORMS.map((w) => {
          const isActive = w.value === value
          return (
            <button
              key={w.value}
              onClick={() => onChange(w.value)}
              className={`font-mono text-[0.6rem] tracking-[0.1em] py-[5px] px-2 rounded border cursor-pointer transition-all ${
                isActive
                  ? 'border-accent-cyan bg-accent-cyan text-bg-primary shadow-[0_0_8px_var(--color-accent-cyan)]'
                  : 'border-border-subtle bg-bg-panel-dark text-text-dim'
              }`}
            >
              {w.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
