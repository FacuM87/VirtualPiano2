# Virtual Piano

A browser-based synthesizer and loop station built with Next.js, Tone.js, and Tailwind CSS.

## Features

- **Piano keyboard** — playable via mouse/touch with configurable octave range and starting octave
- **QWERTY input** — play notes from the keyboard without touching the mouse
- **Multiple waveforms** — real piano samples (Salamander Grand Piano) or synthesized sine, square, triangle, and sawtooth. More to come.
- **Effects chain** — independent reverb, chorus, and master volume knobs
- **Loop station** — 4 slots to record, play, pause, and layer loops
  - **MIDI mode**: records note events and replays them.
  - **Audio mode**: records microphone input as audio and loops it in sync

## QWERTY Keyboard Mapping

```
W  E     T  Y  U
A  S  D  F  G  H  J  K
C  D  E  F  G  A  B  C
```

Keys map to the middle octave of the visible range. Use the octave selector to shift up or down.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 6 |
| Styles | Tailwind CSS v4 (CSS-based config) |
| Audio | Tone.js 15 |

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
```

Other commands:

```bash
npm run build     # production build
npm run lint      # ESLint
npx tsc --noEmit  # type-check
```

## Architecture

### Audio engine (`src/lib/audio/engine.ts`)

Module-level singleton, initialized lazily on the first user gesture via `Tone.start()`. All public functions call `ensureInitialized()` internally.

Signal chain:

```
PolySynth / Sampler → Reverb → MasterVolume → Chorus → MediaStreamDestination → <audio>
```

Audio is routed through a `MediaStreamAudioDestinationNode` rather than `Tone.Destination` to allow `setSinkId()` — this keeps piano audio on the multimedia speaker even when Windows Communications Mode reroutes the "default" output device (triggered by opening the microphone).

### Loop station (`src/hooks/useLooper.ts`)

Four slots, each independently switchable between MIDI and MIC mode.

- **MIDI**: records `noteOn`/`noteOff` events via `LoopRecorder`, replays with `Tone.Part` locked to `Tone.Transport`. The first loop that completes recording sets the master loop duration; subsequent slots align to it.
- **Audio**: captures microphone input via `MediaRecorder`, decodes the resulting blob with `decodeAudioData`, and plays it back with a `Tone.Player` looped to the master duration.

### Key layout (`src/lib/audio/noteMap.ts`)

`generateKeys(startOctave, octaveCount)` produces a flat array of `PianoNote` objects. Each note carries a `whiteIndex` used to position black keys absolutely over white keys in CSS.

## Project Structure

```
src/
  app/              # Next.js app router (layout, page, globals.css)
  components/
    piano/          # PianoKeyboard, PianoKey, OctaveSelector
    controls/       # ControlPanel, Knob, WaveformSelector
    looper/         # LoopStation, LoopSlot
  hooks/            # useAudioEngine, usePianoLayout, useKeyboard, useLooper
  lib/
    audio/          # engine.ts, loopRecorder.ts, noteMap.ts
    constants/      # pianoConfig.ts, keyboardMap.ts
  types/            # index.ts — all shared domain types
```
