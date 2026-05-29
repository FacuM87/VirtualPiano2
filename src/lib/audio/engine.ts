import type { Waveform } from '@/types'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

/**
 * Motor de audio de Tone JS, cargado con lazy loading.
 * Adaptado a partir de la documentación directamente.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Tone: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let synth: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let chorus: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let reverb: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let masterVolume: any = null

let initialized = false
let initializing = false

async function loadTone() {
  if (Tone) return
  Tone = await import('tone')
}

/**
 * Builds the audio graph:
 * PolySynth → Chorus → Reverb → Volume → Destination
 */
async function buildGraph() {
  chorus = new Tone.Chorus(4, 2.5, PIANO_CONFIG.DEFAULT_CHORUS_WET).toDestination()
  chorus.start()

  reverb = new Tone.Reverb({ decay: 2.5, wet: PIANO_CONFIG.DEFAULT_REVERB_WET })

  masterVolume = new Tone.Volume(
    Tone.gainToDb(PIANO_CONFIG.DEFAULT_VOLUME)
  )

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.4,
      release: 1.2,
    },
  })

  synth.connect(reverb)
  reverb.connect(masterVolume)
  masterVolume.connect(chorus)
}

async function ensureInitialized() {
  if (initialized) return
  if (initializing) {
    await new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (initialized) {
          clearInterval(id)
          resolve()
        }
      }, 50)
    })
    return
  }

  initializing = true
  await loadTone()
  await Tone.start()
  await buildGraph()
  initialized = true
  initializing = false
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Must be called from a user gesture (click/keydown) to unlock AudioContext. */
export async function initEngine(): Promise<void> {
  await ensureInitialized()
}

export async function playNote(note: string, velocity = 0.8): Promise<void> {
  await ensureInitialized()
  synth.triggerAttack(note, Tone.now(), velocity)
}

export async function stopNote(note: string): Promise<void> {
  await ensureInitialized()
  synth.triggerRelease(note, Tone.now())
}

export async function stopAllNotes(): Promise<void> {
  await ensureInitialized()
  synth.releaseAll()
}

export async function setVolume(value: number): Promise<void> {
  await ensureInitialized()
  // value: 0–1
  masterVolume.volume.value = Tone.gainToDb(Math.max(0.0001, value))
}

export async function setReverbWet(value: number): Promise<void> {
  await ensureInitialized()
  reverb.wet.value = value
}

export async function setChorusWet(value: number): Promise<void> {
  await ensureInitialized()
  chorus.wet.value = value
}

export async function setWaveform(waveform: Waveform): Promise<void> {
  await ensureInitialized()
  if (waveform === 'piano') {
    synth.set({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.4, release: 1.2 },
    })
  } else {
    synth.set({
      oscillator: { type: waveform },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.5 },
    })
  }
}

export function isReady(): boolean {
  return initialized
}

/** Returns the Tone module for direct use in loop/transport logic. */
export async function getTone() {
  await loadTone()
  return Tone
}
