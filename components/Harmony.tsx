import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Note } from '../types';
import { HARMONY_PROGRESSIONS, NOTES, CHORDS, getChordNotesWithOctaves, getScaleNotesWithOctaves, SCALES } from '../constants';
import Card from './ui/Card';
import PianoKeyboard from './PianoKeyboard';
import Select from './ui/Select';

// --- Motor de Audio Profesional con Tone.js ---

const ALL_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const OCTAVES_TO_LOAD = [3, 4];

// Mapa para convertir sostenidos a bemoles, que es el formato de la nueva fuente de audio.
const enharmonicMap: { [key: string]: string } = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

const urls = OCTAVES_TO_LOAD.reduce((acc, octave) => {
  ALL_NOTES.forEach(note => {
    const noteName = `${note}${octave}`;
    const fileNameRoot = enharmonicMap[note as keyof typeof enharmonicMap] || note;
    // La nueva fuente usa archivos .mp3 y una convención de bemoles para los sostenidos.
    const fileName = `${fileNameRoot}${octave}.mp3`;
    acc[noteName] = fileName;
  });
  return acc;
}, {} as Record<string, string>);


// --- Componente Harmony ---

const romanNumeralMap: { [key:string]: { degree: number; chordKey: keyof typeof CHORDS; suffix: string } } = {
  'I': { degree: 0, chordKey: 'major', suffix: '' },
  'ii': { degree: 1, chordKey: 'minor', suffix: 'm' },
  'iii': { degree: 2, chordKey: 'minor', suffix: 'm' },
  'IV': { degree: 3, chordKey: 'major', suffix: '' },
  'V': { degree: 4, chordKey: 'major', suffix: '' },
  'vi': { degree: 5, chordKey: 'minor', suffix: 'm' },
  'vii°': { degree: 6, chordKey: 'diminished', suffix: 'dim' },
};

interface TransposedChord {
  name: string;
  notes: string[];
}

const Harmony: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('C');
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(null);
  const [currentProgressionIndex, setCurrentProgressionIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sampler = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    sampler.current = new Tone.Sampler({
      urls,
      // SOLUCIÓN DEFINITIVA: Usando la fuente de audio sugerida por el usuario que es estable y compatible.
      baseUrl: "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/",
      onload: () => {
        setIsLoaded(true);
      }
    }).toDestination();

    return () => {
      sampler.current?.dispose();
    }
  }, []);
  
  const transposeProgression = useCallback((progression: string[], key: Note): TransposedChord[] => {
    const scaleNotesWithOctaves = getScaleNotesWithOctaves(key, SCALES.major, 3);
    
    return progression.map(numeral => {
      const mapEntry = romanNumeralMap[numeral];
      if (!mapEntry) return { name: '?', notes: [] };

      const chordRootWithOctave = scaleNotesWithOctaves[mapEntry.degree];
      const rootNoteName = chordRootWithOctave.replace(/[0-9]/g, '') as Note;
      const rootOctave = parseInt(chordRootWithOctave.replace(/[^0-9]/g, ''), 10);
      const chord = CHORDS[mapEntry.chordKey];

      if (!rootNoteName || !chord || isNaN(rootOctave)) {
        return { name: '?', notes: [] };
      }

      const chordNotes = getChordNotesWithOctaves(rootNoteName, chord, rootOctave);
      const chordDisplayName = `${rootNoteName}${mapEntry.suffix}`;

      return { name: chordDisplayName, notes: chordNotes };
    });
  }, []);

  const playProgression = useCallback(async (progression: TransposedChord[], progIndex: number) => {
    if (isPlaying || !isLoaded) return;

    await Tone.start();
    setIsPlaying(true);
    setCurrentProgressionIndex(progIndex);

    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= progression.length) {
        clearInterval(intervalId);
        setHighlightedNotes([]);
        setCurrentChordIndex(null);
        setCurrentProgressionIndex(null);
        setIsPlaying(false);
        return;
      }

      const currentChord = progression[i];
      const notesToPlay = currentChord.notes;
      
      setHighlightedNotes(currentChord.notes);
      sampler.current?.triggerAttackRelease(notesToPlay, '1s', Tone.now());
      setCurrentChordIndex(i);
      i++;
    }, 1000);
  }, [isPlaying, isLoaded]);

  const loadingText = !isLoaded ? '(Cargando Sonidos...)' : '';

  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-center mb-2 text-sky-400">Progresiones Armónicas</h2>
      <p className="text-center text-gray-400 mb-6 text-sm">{loadingText}</p>
      
      <div className="max-w-xs mx-auto mb-8">
        <Select label="Tonalidad" value={rootNote} onChange={(e) => setRootNote(e.target.value as Note)} >
          {NOTES.map(note => <option key={note} value={note}>{note}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HARMONY_PROGRESSIONS.map((prog, progIndex) => {
          const transposedChords = transposeProgression(prog.chords, rootNote);
          return (
            <Card key={prog.name} className="bg-gray-700">
              <h3 className="text-lg font-bold text-white">{prog.name} en {rootNote}</h3>
              <p className="text-sm text-gray-400 mb-4">{prog.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {transposedChords.map((chord, chordIdx) => (
                  <span key={chord.name + chordIdx} className={`px-2 py-1 rounded text-sm font-mono ${currentProgressionIndex === progIndex && currentChordIndex === chordIdx ? 'bg-sky-500 text-white' : 'bg-gray-600'}`}>{chord.name}</span>
                ))}
              </div>
              <button
                onClick={() => playProgression(transposedChords, progIndex)}
                disabled={!isLoaded || (isPlaying && currentProgressionIndex !== progIndex)}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                {isLoaded ? 'Reproducir' : 'Cargando...'}
              </button>
            </Card>
          );
        })}
      </div>
      <PianoKeyboard highlightedNotes={highlightedNotes} />
    </Card>
  );
};

export default Harmony;