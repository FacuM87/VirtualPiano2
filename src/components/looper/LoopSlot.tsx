'use client'

import type { LoopSlot as LoopSlotData } from '@/types'

interface LoopSlotProps {
  slot: LoopSlotData
  onPress: (id: number) => void
  onClear: (id: number) => void
}

export function LoopSlot({ slot, onPress, onClear }: LoopSlotProps) {
  const { id, state, durationSeconds } = slot
  const isIdle = state === 'idle'
  const isRecording = state === 'recording'
  const isPlaying = state === 'playing'
  const isPaused = state === 'paused'

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-bg-panel border border-border-subtle rounded-lg w-[88px]">
      <span className="font-mono text-[0.5rem] tracking-[0.15em] text-text-dim">
        LOOP {id + 1}
      </span>

      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          isRecording ? 'bg-red-500 animate-pulse' :
          isPlaying   ? 'bg-accent-green' :
          isPaused    ? 'bg-yellow-500' :
                        'bg-border-subtle'
        }`}
      />

      <button
        onClick={() => onPress(id)}
        className={`w-full font-mono text-[0.5rem] tracking-[0.08em] py-[5px] px-1 rounded border transition-all cursor-pointer ${
          isRecording
            ? 'border-red-500 bg-bg-panel-dark text-red-400'
            : isPlaying
              ? 'border-accent-green bg-bg-panel-dark text-accent-green'
              : isPaused
                ? 'border-yellow-500 bg-bg-panel-dark text-yellow-400'
                : 'border-accent-cyan bg-bg-panel-dark text-accent-cyan'
        }`}
      >
        {isRecording ? '■ STOP' : isPlaying ? '⏸ PAUSE' : isPaused ? '▶ PLAY' : '● REC'}
      </button>

      {(isPlaying || isPaused) && durationSeconds !== null && (
        <span className={`font-mono text-[0.5rem] ${isPaused ? 'text-yellow-500' : 'text-accent-green'}`}>
          {durationSeconds.toFixed(1)}s
        </span>
      )}

      <button
        onClick={() => onClear(id)}
        disabled={isIdle}
        className={`w-full font-mono text-[0.5rem] tracking-[0.08em] py-[5px] px-1 rounded border transition-all ${
          isIdle
            ? 'border-border-subtle bg-bg-panel-dark text-text-dim cursor-default opacity-40'
            : 'border-border-subtle bg-bg-panel-dark text-text-dim cursor-pointer'
        }`}
      >
        ✕ CLR
      </button>
    </div>
  )
}
