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

// Standard guitar tuning from high E (string 0) to low E (string 5)
export const GUITAR_TUNING_STANDARD: Note[] = ['E', 'B', 'G', 'D', 'A', 'E'];

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

export function getScaleNotesWithOctaves(rootNote: Note, scale: Scale, startOctave: number = 3): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  const scaleNotes: string[] = [];
  let accumulatedInterval = 0;
  scaleNotes.push(`${rootNote}${startOctave}`);
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

// --- GUITAR VOICING GENERATION LOGIC ---

type VoicingNote = { stringIndex: number; fret: number; note: Note };
type Voicing = VoicingNote[];

// Base de datos de acordes abiertos comunes y cejillas estándar para la "Posición 1".
const COMMON_GUITAR_VOICINGS: { [key: string]: Voicing } = {
    'C-major': [ { stringIndex: 4, fret: 3, note: 'C' }, { stringIndex: 3, fret: 2, note: 'E' }, { stringIndex: 2, fret: 0, note: 'G' }, { stringIndex: 1, fret: 1, note: 'C' }, { stringIndex: 0, fret: 0, note: 'E' } ],
    'A-major': [ { stringIndex: 4, fret: 0, note: 'A' }, { stringIndex: 3, fret: 2, note: 'E' }, { stringIndex: 2, fret: 2, note: 'A' }, { stringIndex: 1, fret: 2, note: 'C#' }, { stringIndex: 0, fret: 0, note: 'E' } ],
    'G-major': [ { stringIndex: 5, fret: 3, note: 'G' }, { stringIndex: 4, fret: 2, note: 'B' }, { stringIndex: 3, fret: 0, note: 'D' }, { stringIndex: 2, fret: 0, note: 'G' }, { stringIndex: 0, fret: 3, note: 'G' } ],
    'E-major': [ { stringIndex: 5, fret: 0, note: 'E' }, { stringIndex: 4, fret: 2, note: 'B' }, { stringIndex: 3, fret: 2, note: 'E' }, { stringIndex: 2, fret: 1, note: 'G#' }, { stringIndex: 1, fret: 0, note: 'B' }, { stringIndex: 0, fret: 0, note: 'E' } ],
    'D-major': [ { stringIndex: 3, fret: 0, note: 'D' }, { stringIndex: 2, fret: 2, note: 'A' }, { stringIndex: 1, fret: 3, note: 'D' }, { stringIndex: 0, fret: 2, note: 'F#' } ],
    'A-minor': [ { stringIndex: 4, fret: 0, note: 'A' }, { stringIndex: 3, fret: 2, note: 'E' }, { stringIndex: 2, fret: 2, note: 'A' }, { stringIndex: 1, fret: 1, note: 'C' }, { stringIndex: 0, fret: 0, note: 'E' } ],
    'E-minor': [ { stringIndex: 5, fret: 0, note: 'E' }, { stringIndex: 4, fret: 2, note: 'B' }, { stringIndex: 3, fret: 2, note: 'E' }, { stringIndex: 2, fret: 0, note: 'G' }, { stringIndex: 1, fret: 0, note: 'B' }, { stringIndex: 0, fret: 0, note: 'E' } ],
    'D-minor': [ { stringIndex: 3, fret: 0, note: 'D' }, { stringIndex: 2, fret: 2, note: 'A' }, { stringIndex: 1, fret: 3, note: 'D' }, { stringIndex: 0, fret: 1, note: 'F' } ],
    'F-major': [ { stringIndex: 5, fret: 1, note: 'F' }, { stringIndex: 4, fret: 3, note: 'C' }, { stringIndex: 3, fret: 3, note: 'F' }, { stringIndex: 2, fret: 2, note: 'A' }, { stringIndex: 1, fret: 1, note: 'C' }, { stringIndex: 0, fret: 1, note: 'E' } ]
};

// Plantillas de formas de acordes movibles (basado en CAGED)
const MOVABLE_CHORD_TEMPLATES: { [shape: string]: { rootOnString: number; quality: 'major' | 'minor'; frets: Array<{s: number, f: number}> } } = {
    E_MAJOR: { rootOnString: 5, quality: 'major', frets: [ {s:5, f:0}, {s:4, f:2}, {s:3, f:2}, {s:2, f:1}, {s:1, f:0}, {s:0, f:0} ] },
    E_MINOR: { rootOnString: 5, quality: 'minor', frets: [ {s:5, f:0}, {s:4, f:2}, {s:3, f:2}, {s:2, f:0}, {s:1, f:0}, {s:0, f:0} ] },
    A_MAJOR: { rootOnString: 4, quality: 'major', frets: [ {s:4, f:0}, {s:3, f:2}, {s:2, f:2}, {s:1, f:2}, {s:0, f:0} ] },
    A_MINOR: { rootOnString: 4, quality: 'minor', frets: [ {s:4, f:0}, {s:3, f:2}, {s:2, f:2}, {s:1, f:1}, {s:0, f:0} ] },
    D_MAJOR: { rootOnString: 3, quality: 'major', frets: [ {s:3, f:0}, {s:2, f:2}, {s:1, f:3}, {s:0, f:2} ] },
    D_MINOR: { rootOnString: 3, quality: 'minor', frets: [ {s:3, f:0}, {s:2, f:2}, {s:1, f:3}, {s:0, f:1} ] },
    G_MAJOR: { rootOnString: 5, quality: 'major', frets: [ {s:5, f:3}, {s:4, f:2}, {s:3, f:0}, {s:2, f:0}, {s:1, f:0}, {s:0, f:3} ] }, // Note: G shape is tricky to move, less common as barre
    C_MAJOR: { rootOnString: 4, quality: 'major', frets: [ {s:4, f:3}, {s:3, f:2}, {s:2, f:0}, {s:1, f:1}, {s:0, f:0} ] }  // Note: C shape is also tricky
};

// Fix: Export the 'getNoteOnString' function so it can be used in other components.
export function getNoteOnString(stringIndex: number, fret: number): Note {
    const openNoteIndex = NOTES.indexOf(GUITAR_TUNING_STANDARD[stringIndex]);
    const noteIndex = (openNoteIndex + fret) % 12;
    return NOTES[noteIndex];
}

export function getGuitarVoicings(rootNote: Note, chord: Chord): Voicing[] {
    const quality = chord.name === 'Menor' ? 'minor' : 'major';
    const voicings: Voicing[] = [];
    const foundVoicingSignatures = new Set<string>();

    // 1. Añadir la forma común/abierta si existe
    const commonVoicingKey = `${rootNote}-${quality}`;
    if (COMMON_GUITAR_VOICINGS[commonVoicingKey]) {
        const commonVoicing = COMMON_GUITAR_VOICINGS[commonVoicingKey];
        voicings.push(commonVoicing);
        const signature = commonVoicing.map(v => `${v.stringIndex}:${v.fret}`).sort().join(',');
        foundVoicingSignatures.add(signature);
    }

    // 2. Generar voicings a partir de plantillas movibles
    for (const shapeKey in MOVABLE_CHORD_TEMPLATES) {
        const template = MOVABLE_CHORD_TEMPLATES[shapeKey];
        if (template.quality !== quality) continue;

        const { rootOnString, frets: templateFrets } = template;
        const openRootStringNoteIndex = NOTES.indexOf(GUITAR_TUNING_STANDARD[rootOnString]);
        const targetRootNoteIndex = NOTES.indexOf(rootNote);

        for (let baseFret = 0; baseFret < 12; baseFret++) {
            if ((openRootStringNoteIndex + baseFret) % 12 === targetRootNoteIndex) {
                // Si la tónica está en una cuerda al aire, la plantilla ya es un acorde abierto (manejado por COMMON_GUITAR_VOICINGS)
                if (baseFret === 0) continue; 
                
                const newVoicing: Voicing = [];
                let isValid = true;
                
                for (const { s, f } of templateFrets) {
                    // Cuerdas al aire en la plantilla se convierten en cejilla en el traste base
                    const finalFret = f === 0 ? baseFret : f + baseFret;

                    if (finalFret > 15) {
                        isValid = false;
                        break;
                    }
                    
                    newVoicing.push({
                        stringIndex: s,
                        fret: finalFret,
                        note: getNoteOnString(s, finalFret),
                    });
                }
                
                if (isValid && newVoicing.length > 0) {
                     const signature = newVoicing.map(v => `${v.stringIndex}:${v.fret}`).sort().join(',');
                     if (!foundVoicingSignatures.has(signature)) {
                         voicings.push(newVoicing);
                         foundVoicingSignatures.add(signature);
                     }
                }
            }
        }
    }

    // 3. Ordenar las posiciones encontradas por el traste más bajo
    voicings.sort((a, b) => {
        const minFretA = Math.min(...a.map(n => n.fret === 0 ? Infinity : n.fret));
        const minFretB = Math.min(...b.map(n => n.fret === 0 ? Infinity : n.fret));
        return minFretA - minFretB;
    });

    return voicings.slice(0, 5);
}