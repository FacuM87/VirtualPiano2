'use client'

import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

interface OctaveSelectorProps {
  octaveCount: number
  startOctave: number
  onOctaveCountChange: (count: number) => void
  onStartOctaveChange: (octave: number) => void
}

const MAX_START_OCTAVE = 7

function StepButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        border: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-bg-panel)',
        color: disabled ? 'var(--color-text-dim)' : 'var(--color-accent-cyan)',
        fontFamily: 'var(--font-family-mono)',
        fontSize: '1rem',
        cursor: disabled ? 'default' : 'pointer',
        lineHeight: 1,
        transition: 'color 0.15s, border-color 0.15s',
        ...(disabled ? {} : { borderColor: 'var(--color-accent-cyan)' }),
      }}
    >
      {label}
    </button>
  )
}

export function OctaveSelector({
  octaveCount,
  startOctave,
  onOctaveCountChange,
  onStartOctaveChange,
}: OctaveSelectorProps) {
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-family-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: 'var(--color-text-dim)',
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  }

  const valueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-family-mono)',
    fontSize: '1rem',
    color: 'var(--color-accent-cyan)',
    minWidth: 24,
    textAlign: 'center',
  }

  const groupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  }

  const controlRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        alignItems: 'center',
        backgroundColor: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 8,
        padding: '10px 20px',
      }}
    >
      <div style={groupStyle}>
        <span style={labelStyle}>OCTAVAS</span>
        <div style={controlRowStyle}>
          <StepButton
            label="−"
            onClick={() => onOctaveCountChange(octaveCount - 1)}
            disabled={octaveCount <= PIANO_CONFIG.MIN_OCTAVES}
          />
          <span style={valueStyle}>{octaveCount}</span>
          <StepButton
            label="+"
            onClick={() => onOctaveCountChange(octaveCount + 1)}
            disabled={octaveCount >= PIANO_CONFIG.MAX_OCTAVES}
          />
        </div>
      </div>

      <div style={{ width: 1, height: 40, backgroundColor: 'var(--color-border-subtle)' }} />

      <div style={groupStyle}>
        <span style={labelStyle}>INICIO</span>
        <div style={controlRowStyle}>
          <StepButton
            label="◀"
            onClick={() => onStartOctaveChange(startOctave - 1)}
            disabled={startOctave <= 0}
          />
          <span style={valueStyle}>C{startOctave}</span>
          <StepButton
            label="▶"
            onClick={() => onStartOctaveChange(startOctave + 1)}
            disabled={startOctave >= MAX_START_OCTAVE}
          />
        </div>
      </div>
    </div>
  )
}
