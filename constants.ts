import { Note, Scale, Chord } from './types';

export const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const PIANO_KEYS: { note: string; type: 'white' | 'black' }[] = [
  { note: 'C', type: 'white' }, { note: 'C#', type: 'black' },
  { note: 'D', type: 'white' }, { note: 'D#', type: 'black' },
  { note: 'E', type: 'white' },
  { note: 'F', type: 'white' }, { note: 'F#', type: 'black' },
  { note: 'G', type: 'white' }, { note: 'G#', type: 'black' },
  { note: 'A', type: 'white' }, { note: 'A#', type: 'black' },
  { note: 'B', type: 'white' },
];

export const SCALES: { [key: string]: Scale } = {
  major: { name: 'Mayor', intervals: [2, 2, 1, 2, 2, 2, 1] },
  naturalMinor: { name: 'Menor Natural', intervals: [2, 1, 2, 2, 1, 2, 2] },
  harmonicMinor: { name: 'Menor Armónica', intervals: [2, 1, 2, 2, 1, 3, 1] },
  melodicMinor: { name: 'Menor Melódica', intervals: [2, 1, 2, 2, 2, 2, 1] },
  dorian: { name: 'Dórica', intervals: [2, 1, 2, 2, 2, 1, 2] },
  phrygian: { name: 'Frigia', intervals: [1, 2, 2, 2, 1, 2, 2] },
  lydian: { name: 'Lidia', intervals: [2, 2, 2, 1, 2, 2, 1] },
  mixolydian: { name: 'Mixolidia', intervals: [2, 2, 1, 2, 2, 1, 2] },
  locrian: { name: 'Locria', intervals: [1, 2, 2, 1, 2, 2, 2] },
  pentatonicMajor: { name: 'Pentatónica Mayor', intervals: [2, 2, 3, 2, 3] },
  pentatonicMinor: { name: 'Pentatónica Menor', intervals: [3, 2, 2, 3, 2] },
  blues: { name: 'Blues', intervals: [3, 2, 1, 1, 3, 2] },
};

export const CHORDS: { [key: string]: Chord } = {
  major: { name: 'Mayor', intervals: [0, 4, 7] },
  minor: { name: 'Menor', intervals: [0, 3, 7] },
  diminished: { name: 'Disminuido', intervals: [0, 3, 6] },
  augmented: { name: 'Aumentado', intervals: [0, 4, 8] },
  sus2: { name: 'Suspendido 2ª', intervals: [0, 2, 7] },
  sus4: { name: 'Suspendido 4ª', intervals: [0, 5, 7] },
  major7: { name: 'Mayor 7ª', intervals: [0, 4, 7, 11] },
  minor7: { name: 'Menor 7ª', intervals: [0, 3, 7, 10] },
  dominant7: { name: 'Dominante 7ª', intervals: [0, 4, 7, 10] },
  diminished7: { name: 'Disminuido 7ª', intervals: [0, 3, 6, 9] },
  halfDiminished7: { name: 'Semidisminuido 7ª', intervals: [0, 3, 6, 10] },
  minorMajor7: { name: 'Menor-Mayor 7ª', intervals: [0, 3, 7, 11] },
};

export const CIRCLE_OF_FIFTHS_MAJOR: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
export const CIRCLE_OF_FIFTHS_MINOR: Note[] = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];

export const KEY_DISPLAY_NAMES: { [key in Note]: { major: string; minor: string; signature: string } } = {
    'C': { major: 'C Major', minor: 'A Minor', signature: 'No sharps or flats' },
    'G': { major: 'G Major', minor: 'E Minor', signature: '1 Sharp (F♯)' },
    'D': { major: 'D Major', minor: 'B Minor', signature: '2 Sharps (F♯, C♯)' },
    'A': { major: 'A Major', minor: 'F♯ Minor', signature: '3 Sharps (F♯, C♯, G♯)' },
    'E': { major: 'E Major', minor: 'C♯ Minor', signature: '4 Sharps (F♯, C♯, G♯, D♯)' },
    'B': { major: 'B Major', minor: 'G♯ Minor', signature: '5 Sharps (F♯, C♯, G♯, D♯, A♯)' },
    'F#': { major: 'F♯ Major', minor: 'D♯ Minor', signature: '6 Sharps (F♯, C♯, G♯, D♯, A♯, E♯)' },
    'C#': { major: 'D♭ Major', minor: 'B♭ Minor', signature: '5 Flats (B♭, E♭, A♭, D♭, G♭)' },
    'G#': { major: 'A♭ Major', minor: 'F Minor', signature: '4 Flats (B♭, E♭, A♭, D♭)' },
    'D#': { major: 'E♭ Major', minor: 'C Minor', signature: '3 Flats (B♭, E♭, A♭)' },
    'A#': { major: 'B♭ Major', minor: 'G Minor', signature: '2 Flats (B♭, E♭)' },
    'F': { major: 'F Major', minor: 'D Minor', signature: '1 Flat (B♭)' },
};

export const DIATONIC_CHORD_QUALITIES: {
  major: (keyof typeof CHORDS)[];
  minor: (keyof typeof CHORDS)[];
} = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'] // Natural minor
};

export const ROMAN_NUMERALS: {
  major: string[];
  minor: string[];
} = {
    major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
};


export const HARMONY_PROGRESSIONS: { name: string, description: string, chords: string[] }[] = [
  { name: 'I - V - vi - IV', description: 'La progresión más común en la música pop.', chords: ['I', 'V', 'vi', 'IV'] },
  { name: 'I - IV - V', description: 'Una progresión fundamental en blues, rock y country.', chords: ['I', 'IV', 'V'] },
  { name: 'ii - V - I', description: 'La piedra angular de la armonía del jazz.', chords: ['ii', 'V', 'I'] },
  { name: 'Canon de Pachelbel', description: 'La famosa progresión de acordes del Canon en D.', chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'] },
];

/**
 * Genera las notas de una escala con sus octavas correctas.
 * Esta implementación robusta calcula cada nota basándose en su distancia absoluta desde la tónica,
 * evitando errores de estado en tonalidades complejas.
 * @param rootNote La nota fundamental de la escala.
 * @param scale El objeto de escala que contiene los intervalos.
 * @param startOctave La octava inicial para la nota fundamental.
 * @returns Un array de strings con las notas de la escala (ej: ['C3', 'D3', 'E3', ...]).
 */
export function getScaleNotesWithOctaves(rootNote: Note, scale: Scale, startOctave: number = 3): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  const scaleNotes: string[] = [];
  let accumulatedInterval = 0;

  // Añade la nota fundamental
  scaleNotes.push(`${rootNote}${startOctave}`);
  
  // Añade las notas restantes de la escala
  for (const interval of scale.intervals) {
    accumulatedInterval += interval;
    const absoluteNoteIndex = rootIndex + accumulatedInterval;
    const noteIndex = absoluteNoteIndex % 12;
    const octaveOffset = Math.floor(absoluteNoteIndex / 12);
    scaleNotes.push(`${NOTES[noteIndex]}${startOctave + octaveOffset}`);
  }
  
  return scaleNotes;
}

export function getChordNotesWithOctaves(rootNote: Note, chord: Chord, startOctave: number = 3): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  return chord.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    const octave = startOctave + Math.floor((rootIndex + interval) / 12);
    return `${NOTES[noteIndex]}${octave}`;
  });
}