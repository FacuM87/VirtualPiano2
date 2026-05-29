/**
 * Maps physical keyboard codes (event.code) to semitone offsets from C in the middle octave.
 * White keys: A S D F G H J K → C D E F G A B C (next octave)
 * Black keys: W E   T Y U     → C# D#  F# G# A#
 *
 * The mapping always refers to the "central" octave shown on screen.
 * Values are semitone offsets (0 = C of the mapped octave).
 */
export const KEYBOARD_TO_SEMITONE: Record<string, number> = {
  KeyA: 0,   // C
  KeyW: 1,   // C#
  KeyS: 2,   // D
  KeyE: 3,   // D#
  KeyD: 4,   // E
  KeyF: 5,   // F
  KeyT: 6,   // F#
  KeyG: 7,   // G
  KeyY: 8,   // G#
  KeyH: 9,   // A
  KeyU: 10,  // A#
  KeyJ: 11,  // B
  KeyK: 12,  // C (next octave)
}

/** The octave offset applied to the keyboard mapping relative to startOctave */
export const KEYBOARD_OCTAVE_OFFSET = 1
