'use client'

import type { Waveform } from '@/types'

const WAVEFORMS: { value: Waveform; label: string }[] = [
  { value: 'piano', label: 'PIANO' },
  { value: 'sine', label: 'SINE' },
  { value: 'square', label: 'SQR' },
  { value: 'triangle', label: 'TRI' },
  { value: 'sawtooth', label: 'SAW' },
]

interface WaveformSelectorProps {
  value: Waveform
  onChange: (waveform: Waveform) => void
}

export function WaveformSelector({ value, onChange }: WaveformSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
        WAVEFORM
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {WAVEFORMS.map((w) => {
          const isActive = w.value === value
          return (
            <button
              key={w.value}
              onClick={() => onChange(w.value)}
              style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                padding: '5px 8px',
                borderRadius: 4,
                border: `1px solid ${isActive ? 'var(--color-accent-cyan)' : 'var(--color-border-subtle)'}`,
                backgroundColor: isActive ? 'var(--color-accent-cyan)' : 'var(--color-bg-panel-dark)',
                color: isActive ? 'var(--color-bg-primary)' : 'var(--color-text-dim)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 0 8px var(--color-accent-cyan)' : 'none',
              }}
            >
              {w.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
