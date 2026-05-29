import type { NoteName, PianoNote } from '@/types'

const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const BLACK_NOTES = new Set<NoteName>(['C#', 'D#', 'F#', 'G#', 'A#'])

/**
 * Generates the full list of PianoNote objects for a given range of octaves.
 * @param startOctave - lowest octave number (e.g. 2)
 * @param octaveCount - number of octaves to include (1–7)
 */
export function generateKeys(startOctave: number, octaveCount: number): PianoNote[] {
  const keys: PianoNote[] = []
  let whiteIndex = 0

  for (let octave = startOctave; octave < startOctave + octaveCount; octave++) {
    for (const name of NOTE_NAMES) {
      const isBlack = BLACK_NOTES.has(name)
      keys.push({
        note: `${name}${octave}`,
        name,
        octave,
        isBlack,
        whiteIndex: isBlack ? whiteIndex - 1 : whiteIndex,
      })
      if (!isBlack) whiteIndex++
    }
  }

  return keys
}

/**
 * Converts a semitone offset from C to a note string.
 * @param semitone - 0 = C, 1 = C#, ... 11 = B, 12 = C next octave
 * @param baseOctave - the octave of C (semitone 0)
 */
export function semitoneToNote(semitone: number, baseOctave: number): string {
  const octaveOffset = Math.floor(semitone / 12)
  const noteIndex = semitone % 12
  return `${NOTE_NAMES[noteIndex]}${baseOctave + octaveOffset}`
}
