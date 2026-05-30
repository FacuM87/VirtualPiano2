'use client'

import type { LoopSlot } from '@/types'
import { LoopSlot as LoopSlotCard } from './LoopSlot'

interface LoopStationProps {
  slots: LoopSlot[]
  onPressSlot: (id: number) => void
  onClearSlot: (id: number) => void
}

export function LoopStation({ slots, onPressSlot, onClearSlot }: LoopStationProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-mono text-[0.55rem] tracking-[0.15em] text-text-dim uppercase">
        LOOP STATION
      </span>
      <div className="flex gap-2">
        {slots.map((slot) => (
          <LoopSlotCard
            key={slot.id}
            slot={slot}
            onPress={onPressSlot}
            onClear={onClearSlot}
          />
        ))}
      </div>
    </div>
  )
}
