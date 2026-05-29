export const PIANO_CONFIG = {
  MIN_OCTAVES: 1,
  MAX_OCTAVES: 7,
  DEFAULT_OCTAVES: 3,
  /** Starting octave for the leftmost visible octave */
  DEFAULT_START_OCTAVE: 2,
  DEFAULT_VOLUME: 0.8,
  DEFAULT_REVERB_WET: 0.2,
  DEFAULT_CHORUS_WET: 0.0,
  DEFAULT_WAVEFORM: 'piano' as const,
  NOTES_PER_OCTAVE: 12,
  WHITE_NOTES_PER_OCTAVE: 7,
  BLACK_NOTES_PER_OCTAVE: 5,
  /** White key dimensions (px) */
  WHITE_KEY_WIDTH: 48,
  WHITE_KEY_HEIGHT: 180,
  /** Black key dimensions relative to white key */
  BLACK_KEY_WIDTH_RATIO: 0.6,
  BLACK_KEY_HEIGHT_RATIO: 0.62,
} as const
