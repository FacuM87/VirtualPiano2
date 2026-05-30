import type { Waveform } from '@/types'
import { PIANO_CONFIG } from '@/lib/constants/pianoConfig'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Tone: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let synth: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sampler: any = null
let samplerLoaded = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let chorus: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let reverb: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let masterVolume: any = null

let initialized = false
let initPromise: Promise<void> | null = null
let preloading = false
let currentWaveform: Waveform = PIANO_CONFIG.DEFAULT_WAVEFORM

async function loadTone() {
  if (Tone) return
  Tone = await import('tone')
  // Lower lookahead: 20ms instead of default 100ms. Better real-time feel for
  // Transport-based loop playback; still safe for modern hardware.
  Tone.getContext().lookAhead = 0.02
  Tone.getContext().updateInterval = 0.01
}

// Salamander Grand Piano — free 48-velocity stereo grand piano samples
const SALAMANDER_BASE = 'https://tonejs.github.io/audio/salamander/'
const SALAMANDER_URLS: Record<string, string> = {
  A0: 'A0.mp3',  C1: 'C1.mp3',  'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
  A1: 'A1.mp3',  C2: 'C2.mp3',  'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
  A2: 'A2.mp3',  C3: 'C3.mp3',  'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
  A3: 'A3.mp3',  C4: 'C4.mp3',  'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
  A4: 'A4.mp3',  C5: 'C5.mp3',  'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
  A5: 'A5.mp3',  C6: 'C6.mp3',  'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
  A6: 'A6.mp3',  C7: 'C7.mp3',  'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
  A7: 'A7.mp3',  C8: 'C8.mp3',
}

async function buildGraph() {
  // depth=0.5 for audible modulation; wet is user-controlled starting at 0
  chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination()
  chorus.wet.value = PIANO_CONFIG.DEFAULT_CHORUS_WET
  chorus.start()

  reverb = new Tone.Reverb({ decay: 2.5, wet: PIANO_CONFIG.DEFAULT_REVERB_WET })
  await reverb.ready

  masterVolume = new Tone.Volume(Tone.gainToDb(PIANO_CONFIG.DEFAULT_VOLUME))

  // Shared effects tail: reverb → volume → chorus → Destination
  reverb.connect(masterVolume)
  masterVolume.connect(chorus)

  // Reuse sampler if preloadSampler() already started fetching
  if (!sampler) {
    sampler = new Tone.Sampler({
      urls: SALAMANDER_URLS,
      baseUrl: SALAMANDER_BASE,
      release: 1.2,
      onload: () => { samplerLoaded = true },
    })
  }
  sampler.connect(reverb)

  // PolySynth for all non-piano waveforms
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.5 },
  })
  synth.connect(reverb)

  currentWaveform = PIANO_CONFIG.DEFAULT_WAVEFORM
}

async function ensureInitialized() {
  if (initialized) return
  if (!initPromise) {
    initPromise = (async () => {
      await loadTone()
      await Tone.start()
      await buildGraph()
      initialized = true
    })()
  }
  await initPromise
}

function activeInstrument() {
  return currentWaveform === 'piano' ? sampler : synth
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function initEngine(): Promise<void> {
  await ensureInitialized()
}

export async function playNote(note: string, velocity = 0.8): Promise<void> {
  await ensureInitialized()
  if (currentWaveform === 'piano' && !samplerLoaded) return
  activeInstrument().triggerAttack(note, Tone.now(), velocity)
}

export async function stopNote(note: string): Promise<void> {
  await ensureInitialized()
  if (currentWaveform === 'piano' && !samplerLoaded) return
  activeInstrument().triggerRelease(note, Tone.now())
}

export async function stopAllNotes(): Promise<void> {
  await ensureInitialized()
  if (samplerLoaded) sampler.releaseAll()
  synth.releaseAll()
}

export async function setVolume(value: number): Promise<void> {
  await ensureInitialized()
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
  // Release stuck notes from the outgoing instrument before switching
  if (currentWaveform === 'piano') { if (samplerLoaded) sampler.releaseAll() }
  else { synth.releaseAll() }

  currentWaveform = waveform

  if (waveform !== 'piano') {
    synth.set({
      oscillator: { type: waveform },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.5 },
    })
  }
}

/** Call on component mount to fetch and decode piano samples before first user gesture. */
export async function preloadSampler(): Promise<void> {
  if (preloading || sampler) return
  preloading = true
  await loadTone()
  sampler = new Tone.Sampler({
    urls: SALAMANDER_URLS,
    baseUrl: SALAMANDER_BASE,
    release: 1.2,
    onload: () => { samplerLoaded = true },
  })
}

export function isReady(): boolean {
  return initialized
}

export function isSamplerLoaded(): boolean {
  return samplerLoaded
}

export async function getTone() {
  await loadTone()
  return Tone
}

export function getToneInstance(): any {
  return Tone
}

export function getToneNow(): number {
  return Tone ? Tone.now() : 0
}

/** Synchronous fast path — only call when isReady() is true. */
export function playNoteSync(note: string, velocity = 0.8): void {
  if (currentWaveform === 'piano' && !samplerLoaded) return
  activeInstrument().triggerAttack(note, Tone.now(), velocity)
}

/** Synchronous fast path — only call when isReady() is true. */
export function stopNoteSync(note: string): void {
  if (currentWaveform === 'piano' && !samplerLoaded) return
  activeInstrument().triggerRelease(note, Tone.now())
}

export function scheduleNote(note: string, duration: number, time: number, velocity: number): void {
  if (!initialized) return
  if (currentWaveform === 'piano' && !samplerLoaded) return
  activeInstrument().triggerAttackRelease(note, duration, time, velocity)
}
