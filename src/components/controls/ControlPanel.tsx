'use client'

import { Knob } from './Knob'
import { WaveformSelector } from './WaveformSelector'
import type { AudioEngineControls, Waveform } from '@/types'

interface ControlPanelProps {
  controls: AudioEngineControls
  onVolumeChange: (v: number) => void
  onReverbChange: (v: number) => void
  onChorusChange: (v: number) => void
  onWaveformChange: (w: Waveform) => void
}

const pct = (v: number) => `${Math.round(v * 100)}%`

export function ControlPanel({
  controls,
  onVolumeChange,
  onReverbChange,
  onChorusChange,
  onWaveformChange,
}: ControlPanelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        backgroundColor: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 10,
        padding: '16px 28px',
      }}
    >
      <Knob value={controls.volume} onChange={onVolumeChange} label="VOLUME" formatValue={pct} color="var(--color-accent-cyan)" />
      <Knob value={controls.reverbWet} onChange={onReverbChange} label="REVERB" formatValue={pct} color="var(--color-accent-purple)" />
      <Knob value={controls.chorusWet} onChange={onChorusChange} label="CHORUS" formatValue={pct} color="var(--color-accent-green)" />

      <div style={{ width: 1, height: 64, backgroundColor: 'var(--color-border-subtle)', margin: '0 4px' }} />

      <WaveformSelector value={controls.waveform} onChange={onWaveformChange} />
    </div>
  )
}
