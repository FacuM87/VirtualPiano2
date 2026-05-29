export type NoteName =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export type Waveform = 'piano' | 'sine' | 'square' | 'triangle' | 'sawtooth'

export interface PianoNote {
  note: string
  name: NoteName
  octave: number
  isBlack: boolean
  whiteIndex: number
}

export interface LoopEvent {
  note: string
  time: number
  duration: number
  velocity: number
}

export type LoopSlotState = 'idle' | 'recording' | 'playing' | 'paused'

export interface LoopSlot {
  id: number
  state: LoopSlotState
  events: LoopEvent[]
  durationSeconds: number | null
}

export interface KeyState {
  active: Set<string>
}

export interface AudioEngineControls {
  volume: number
  reverbWet: number
  chorusWet: number
  waveform: Waveform
}
