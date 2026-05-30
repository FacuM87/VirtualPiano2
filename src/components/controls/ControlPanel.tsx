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

export function ControlPanel({ controls, onVolumeChange, onReverbChange, onChorusChange, onWaveformChange }: ControlPanelProps) {
  return (
    <div className="flex items-center gap-6 bg-bg-panel border border-border-subtle rounded-[10px] px-7 py-4">
      <Knob value={controls.volume}    onChange={onVolumeChange} label="VOLUME" formatValue={pct} color="var(--color-accent-cyan)"   />
      <Knob value={controls.reverbWet} onChange={onReverbChange} label="REVERB" formatValue={pct} color="var(--color-accent-purple)" />
      <Knob value={controls.chorusWet} onChange={onChorusChange} label="CHORUS" formatValue={pct} color="var(--color-accent-green)"  />

      <div className="w-px h-16 bg-border-subtle mx-1" />

      <WaveformSelector value={controls.waveform} onChange={onWaveformChange} />
    </div>
  )
}
