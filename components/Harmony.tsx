import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Note } from '../types';
import { HARMONY_PROGRESSIONS, NOTES, CHORDS, getChordNotesWithOctaves, getScaleNotesWithOctaves, SCALES } from '../constants';
import Card from './ui/Card';
import PianoKeyboard from './PianoKeyboard';
import GuitarFretboard from './GuitarFretboard';
import Select from './ui/Select';
import { useInstrument } from '../contexts/InstrumentContext';

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
  rootNote: Note;
}

const Harmony: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('C');
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [highlightedRoot, setHighlightedRoot] = useState<Note | undefined>();
  const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(null);
  const [currentProgressionIndex, setCurrentProgressionIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { instrument } = useInstrument();
  
  const sampler = useRef<Tone.Sampler | null>(null);
  const reverb = useRef<Tone.Reverb | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    setIsLoaded(false);
    if (isPlaying) {
        stopProgression();
    }
    
    const soundfont = instrument === 'piano'
        ? 'acoustic_grand_piano-mp3'
        : 'acoustic_guitar_nylon-mp3';

    // Se configura una cadena de audio con Reverb para un sonido más sostenido y profesional.
    reverb.current = new Tone.Reverb({ decay: 4, wet: 0.3 }).toDestination();
    sampler.current = new Tone.Sampler({
      urls,
      release: 1, // Añade una "cola" de 1 segundo a cada nota para evitar cortes abruptos.
      baseUrl: `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/${soundfont}/`,
      onload: () => setIsLoaded(true)
    }).connect(reverb.current);

    // La función de limpieza se ejecuta cuando el instrumento cambia o el componente se desmonta.
    return () => {
      sampler.current?.dispose();
      reverb.current?.dispose();
    }
  }, [instrument]);
  
  const transposeProgression = useCallback((progression: string[], key: Note): TransposedChord[] => {
    const scaleNotesWithOctaves = getScaleNotesWithOctaves(key, SCALES.major, 3);
    
    return progression.map(numeral => {
      const mapEntry = romanNumeralMap[numeral];
      if (!mapEntry) return { name: '?', notes: [], rootNote: key };

      const chordRootWithOctave = scaleNotesWithOctaves[mapEntry.degree];
      const rootNoteName = chordRootWithOctave.replace(/[0-9]/g, '') as Note;
      const rootOctave = parseInt(chordRootWithOctave.replace(/[^0-9]/g, ''), 10);
      const chord = CHORDS[mapEntry.chordKey];

      if (!rootNoteName || !chord || isNaN(rootOctave)) {
        return { name: '?', notes: [], rootNote: key };
      }

      const chordNotes = getChordNotesWithOctaves(rootNoteName, chord, rootOctave);
      const chordDisplayName = `${rootNoteName}${mapEntry.suffix}`;

      return { name: chordDisplayName, notes: chordNotes, rootNote: rootNoteName };
    });
  }, []);

  const stopProgression = useCallback(() => {
     if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    if (Tone.Transport.state !== 'stopped') {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    Tone.Transport.bpm.value = 120;

    setIsPlaying(false);
    setCurrentProgressionIndex(null);
    setCurrentChordIndex(null);
    setHighlightedNotes([]);
    setHighlightedRoot(undefined);
  }, []);

  const playProgression = useCallback(async (progression: TransposedChord[], progIndex: number) => {
    if (isPlaying || !isLoaded || !sampler.current) return;

    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }
    if (Tone.Transport.state !== 'stopped') {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    Tone.Transport.bpm.value = 60;

    setIsPlaying(true);
    setCurrentProgressionIndex(progIndex);

    const sequenceEvents = progression.map((chord, index) => ({
      time: `${index}m`, // Cada acorde comienza en un nuevo compás.
      chord,
      index,
    }));

    sequenceRef.current = new Tone.Sequence((time, { chord, index }) => {
      // Tocar cada acorde durante un compás completo. La reverb y el release se encargarán del sustain.
      sampler.current?.triggerAttackRelease(chord.notes, '1m', time);
      Tone.Draw.schedule(() => {
        setHighlightedNotes(chord.notes);
        setHighlightedRoot(chord.rootNote);
        setCurrentChordIndex(index);
      }, time);
    }, sequenceEvents).start(0);

    sequenceRef.current.loop = false;
    
    const duration = Tone.Transport.toSeconds(`${progression.length}m`);
    Tone.Transport.scheduleOnce((time) => {
      Tone.Draw.schedule(() => {
        stopProgression();
      }, time)
    }, duration);
    
    Tone.Transport.start();

  }, [isPlaying, isLoaded, stopProgression]);
  
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
          const isThisPlaying = isPlaying && currentProgressionIndex === progIndex;
          
          return (
            <Card key={prog.name} className="bg-gray-700">
              <h3 className="text-lg font-bold text-white">{prog.name} en {rootNote}</h3>
              <p className="text-sm text-gray-400 mb-4">{prog.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {transposedChords.map((chord, chordIdx) => (
                  <span key={chord.name + chordIdx} className={`px-2 py-1 rounded text-sm font-mono transition-colors ${isThisPlaying && currentChordIndex === chordIdx ? 'bg-sky-500 text-white' : 'bg-gray-600'}`}>{chord.name}</span>
                ))}
              </div>
              <button
                onClick={() => isThisPlaying ? stopProgression() : playProgression(transposedChords, progIndex)}
                disabled={!isLoaded || (isPlaying && !isThisPlaying)}
                className={`w-full font-bold py-2 px-4 rounded transition flex items-center justify-center ${isThisPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-sky-600 hover:bg-sky-700'} text-white disabled:bg-gray-500 disabled:cursor-not-allowed`}
              >
                 {isThisPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 8a2 2 0 012-2h0a2 2 0 012 2v4a2 2 0 01-2 2h0a2 2 0 01-2-2V8z" clipRule="evenodd" /></svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
                {isLoaded ? (isThisPlaying ? 'Detener' : 'Reproducir') : 'Cargando...'}
              </button>
            </Card>
          );
        })}
      </div>
       {instrument === 'piano' ? (
          <PianoKeyboard highlightedNotes={highlightedNotes} />
        ) : (
          <GuitarFretboard highlightedNotes={highlightedNotes} rootNote={highlightedRoot} />
        )}
    </Card>
  );
};

export default Harmony;