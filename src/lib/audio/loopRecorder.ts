import type { LoopEvent } from '@/types'

/**
 * Loopera
 */
export class LoopRecorder {
  private events: LoopEvent[] = []
  private startTime: number = 0
  private activeNotes = new Map<string, { time: number; velocity: number }>()

  start(currentTime: number) {
    this.events = []
    this.activeNotes.clear()
    this.startTime = currentTime
  }

  noteOn(note: string, currentTime: number, velocity = 0.8) {
    this.activeNotes.set(note, {
      time: currentTime - this.startTime,
      velocity,
    })
  }

  noteOff(note: string, currentTime: number) {
    const onset = this.activeNotes.get(note)
    if (!onset) return

    const duration = currentTime - this.startTime - onset.time
    this.events.push({
      note,
      time: onset.time,
      duration: Math.max(0.05, duration),
      velocity: onset.velocity,
    })

    this.activeNotes.delete(note)
  }

  stop(currentTime: number): LoopEvent[] {
    for (const [note, onset] of this.activeNotes) {
      const duration = currentTime - this.startTime - onset.time
      this.events.push({
        note,
        time: onset.time,
        duration: Math.max(0.05, duration),
        velocity: onset.velocity,
      })
    }
    this.activeNotes.clear()
    return [...this.events]
  }

  getDurationSeconds(stopTime: number): number {
    return stopTime - this.startTime
  }
}
