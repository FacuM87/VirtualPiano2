'use client'

import { useState, useRef, useCallback } from 'react'
import { LoopRecorder } from '@/lib/audio/loopRecorder'
import * as engine from '@/lib/audio/engine'
import type { LoopEvent, LoopSlot } from '@/types'

const SLOT_COUNT = 4
const MIN_LOOP_DURATION = 0.15

interface SlotRuntime {
  recorder: LoopRecorder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  part: any | null
  recordStartAcTime: number
  transportPosAtRecordStart: number
}

function makeSlots(): LoopSlot[] {
  return Array.from({ length: SLOT_COUNT }, (_, i) => ({
    id: i,
    state: 'idle' as const,
    events: [],
    durationSeconds: null,
  }))
}

export function useLooper(
  baseNoteOn: (note: string) => void,
  baseNoteOff: (note: string) => void,
) {
  const [slots, setSlots] = useState<LoopSlot[]>(makeSlots)

  const loopDurationRef = useRef<number | null>(null)
  const slotStatesRef = useRef<Array<'idle' | 'recording' | 'playing' | 'paused'>>(
    Array(SLOT_COUNT).fill('idle'),
  )
  const recordingSlots = useRef<Set<number>>(new Set())
  const runtimes = useRef<SlotRuntime[]>(
    Array.from({ length: SLOT_COUNT }, () => ({
      recorder: new LoopRecorder(),
      part: null,
      recordStartAcTime: 0,
      transportPosAtRecordStart: 0,
    })),
  )

  const patchSlot = useCallback((id: number, patch: Partial<LoopSlot>) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const wrappedNoteOn = useCallback(
    (note: string) => {
      baseNoteOn(note)
      if (recordingSlots.current.size === 0) return
      const now = engine.getToneNow()
      recordingSlots.current.forEach((id) => runtimes.current[id].recorder.noteOn(note, now))
    },
    [baseNoteOn],
  )

  const wrappedNoteOff = useCallback(
    (note: string) => {
      baseNoteOff(note)
      if (recordingSlots.current.size === 0) return
      const now = engine.getToneNow()
      recordingSlots.current.forEach((id) => runtimes.current[id].recorder.noteOff(note, now))
    },
    [baseNoteOff],
  )

  const pressSlot = useCallback(
    async (id: number) => {
      await engine.initEngine()
      const Tone = engine.getToneInstance()
      const state = slotStatesRef.current[id]
      const runtime = runtimes.current[id]

      if (state === 'idle') {
        const now = Tone.now()
        runtime.recordStartAcTime = now
        runtime.transportPosAtRecordStart = Tone.Transport.seconds
        runtime.recorder.start(now)
        recordingSlots.current.add(id)
        slotStatesRef.current[id] = 'recording'
        patchSlot(id, { state: 'recording', events: [] })

      } else if (state === 'recording') {
        recordingSlots.current.delete(id)
        const now = Tone.now()
        const events = runtime.recorder.stop(now)
        const duration = now - runtime.recordStartAcTime

        if (duration < MIN_LOOP_DURATION) {
          slotStatesRef.current[id] = 'idle'
          patchSlot(id, { state: 'idle', events: [] })
          return
        }

        const isFirstLoop = loopDurationRef.current === null
        if (isFirstLoop) {
          loopDurationRef.current = duration
          Tone.Transport.start('+0.05')
        }

        const loopDuration = loopDurationRef.current!
        const offset = runtime.transportPosAtRecordStart % loopDuration

        const adjustedEvents = events.map((ev: LoopEvent) => ({
          ...ev,
          time: (ev.time + offset) % loopDuration,
        }))

        if (runtime.part) {
          runtime.part.stop()
          runtime.part.dispose()
        }

        runtime.part = new Tone.Part(
          (time: number, event: LoopEvent) => {
            engine.scheduleNote(event.note, event.duration, time, event.velocity)
          },
          adjustedEvents.map((ev: LoopEvent) => [ev.time, ev]),
        )
        runtime.part.loop = true
        runtime.part.loopEnd = loopDuration
        runtime.part.start(0)

        slotStatesRef.current[id] = 'playing'
        patchSlot(id, { state: 'playing', events, durationSeconds: duration })

      } else if (state === 'playing') {
        runtime.part.stop()
        slotStatesRef.current[id] = 'paused'
        patchSlot(id, { state: 'paused' })

      } else if (state === 'paused') {
        runtime.part.start(0)
        slotStatesRef.current[id] = 'playing'
        patchSlot(id, { state: 'playing' })
      }
    },
    [patchSlot],
  )

  const clearSlot = useCallback(
    async (id: number) => {
      await engine.initEngine()
      const Tone = engine.getToneInstance()
      const runtime = runtimes.current[id]

      recordingSlots.current.delete(id)
      slotStatesRef.current[id] = 'idle'

      if (runtime.part) {
        runtime.part.stop()
        runtime.part.dispose()
        runtime.part = null
      }

      const anyNonIdle = slotStatesRef.current.some((s, i) => i !== id && s !== 'idle')
      if (!anyNonIdle) {
        Tone.Transport.stop()
        loopDurationRef.current = null
      }

      patchSlot(id, { state: 'idle', events: [], durationSeconds: null })
    },
    [patchSlot],
  )

  return { slots, wrappedNoteOn, wrappedNoteOff, pressSlot, clearSlot }
}
