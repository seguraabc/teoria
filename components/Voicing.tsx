import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Note } from '../types';
import { NOTES, CHORDS, getChordNotesWithOctaves, getGuitarVoicings } from '../constants';
import Card from './ui/Card';
import Select from './ui/Select';
import PianoKeyboard from './PianoKeyboard';
import GuitarFretboard from './GuitarFretboard';
import { useInstrument } from '../contexts/InstrumentContext';


const CHORD_COLORS = ['#38bdf8', '#34d399', '#f59e0b', '#f472b6'];
const NUM_CHORDS = 4;
const PIANO_START_OCTAVE = 2;
const PIANO_NUM_OCTAVES = 5;

// --- Interfaz para el estado del acorde ---
interface VoicingChord {
  root: Note;
  key: string;
  inversion: number; // Para piano: inversión, Para guitarra: índice de posición
  octave: number;    // Solo para piano
}

// --- Lógica de Inversión de Acordes (para Piano) ---
const applyInversion = (notes: string[], inv: number): string[] => {
  if (inv === 0 || notes.length === 0) {
    return notes;
  }
  const numInversions = inv % notes.length;
  if (numInversions === 0) return notes;

  const notesToMove = notes.slice(0, numInversions);
  const remainingNotes = notes.slice(numInversions);
  
  const movedNotesWithOctaveUp = notesToMove.map(noteStr => {
    const noteName = noteStr.replace(/[0-9]/g, '');
    const octave = parseInt(noteStr.replace(/[^0-9]/g, ''), 10);
    return `${noteName}${octave + 1}`;
  });
  
  return [...remainingNotes, ...movedNotesWithOctaveUp];
};

// --- Componente React ---
const Voicing: React.FC = () => {
  const { instrument } = useInstrument();
  const [selectedChords, setSelectedChords] = useState<(VoicingChord | null)[]>(
    [
      { root: 'C', key: 'major', inversion: 0, octave: 3 },
      { root: 'G', key: 'major', inversion: 0, octave: 3 },
      null,
      null
    ]
  );
  const pianoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Centra el teclado en C3 solo si es piano
    if (instrument === 'piano') {
      const keyElement = pianoContainerRef.current?.querySelector('[data-note-id="C3"]');
      if (keyElement && pianoContainerRef.current) {
          const containerWidth = pianoContainerRef.current.offsetWidth;
          const keyLeft = (keyElement as HTMLElement).offsetLeft;
          const keyWidth = (keyElement as HTMLElement).offsetWidth;
          pianoContainerRef.current.scrollLeft = keyLeft - (containerWidth / 2) + (keyWidth / 2);
      }
    }
  }, [instrument]);

   useEffect(() => {
    // Resetea las posiciones/inversiones al cambiar de instrumento para evitar estados inválidos
    setSelectedChords(currentChords => 
      currentChords.map(c => c ? { ...c, inversion: 0 } : null)
    );
  }, [instrument]);


  const handleChordChange = (index: number, part: keyof VoicingChord | 'key', value: string | number) => {
    const newChords = [...selectedChords];
    let current = newChords[index];

    if (part === 'key' && value === 'none') {
      newChords[index] = null;
      setSelectedChords(newChords);
      return;
    }
    
    if (current === null) {
      current = { root: 'C', key: 'major', inversion: 0, octave: 3 };
    }

    const updatedChord = { ...current };

    if (part === 'key') {
      updatedChord.inversion = 0; // Resetea la inversión/posición si el tipo de acorde cambia
      updatedChord.key = value as string;
    } else if (part === 'root') {
      updatedChord.root = value as Note;
    } else if (part === 'inversion' || part === 'octave') {
      updatedChord[part] = parseInt(value as string, 10);
    }

    newChords[index] = updatedChord;
    setSelectedChords(newChords);
  };
  
  const processedPianoVoicings = useMemo(() => {
    if (instrument !== 'piano') return [];
    const allNotes: {note: string, color: string, id: string}[] = [];

    selectedChords.forEach((chordSelection, index) => {
        if (!chordSelection) return;
        
        const chordDef = CHORDS[chordSelection.key];
        if(!chordDef) return;
        
        const baseNotes = getChordNotesWithOctaves(chordSelection.root, chordDef, chordSelection.octave);
        const invertedNotes = applyInversion(baseNotes, chordSelection.inversion);
        
        invertedNotes.forEach(note => {
            allNotes.push({
                note,
                color: CHORD_COLORS[index],
                id: `chord-${index}-${note}`
            })
        });
    });

    return allNotes;
  }, [selectedChords, instrument]);

  const processedGuitarVoicings = useMemo(() => {
    if (instrument !== 'guitar') return { voicingsByChord: [], noteDots: [] };

    const allNoteDots: Array<{ stringIndex: number; fret: number; note: Note; color: string; id: string; }> = [];
    const voicingsByChord = selectedChords.map(chordConfig => {
        if (!chordConfig) return { available: [] };
        const chordDef = CHORDS[chordConfig.key];
        if (!chordDef) return { available: [] };
        return { available: getGuitarVoicings(chordConfig.root, chordDef) };
    });

    voicingsByChord.forEach((data, index) => {
        const chordConfig = selectedChords[index];
        if (!chordConfig) return;
        
        const selectedVoicing = data.available[chordConfig.inversion];
        if(selectedVoicing) {
            selectedVoicing.forEach(noteInVoicing => {
                 allNoteDots.push({
                    ...noteInVoicing,
                    color: CHORD_COLORS[index],
                    id: `chord-${index}-s${noteInVoicing.stringIndex}-f${noteInVoicing.fret}`
                });
            })
        }
    });

    return { voicingsByChord, noteDots: allNoteDots };
  }, [selectedChords, instrument]);


  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sky-400">Explorador de Voice Leading</h2>
        <p className="text-gray-400 mt-2 max-w-3xl mx-auto">
          {instrument === 'piano'
            ? 'Construye progresiones y visualiza las notas en el teclado. Ajusta la tónica, tipo, inversión y octava para cada acorde.'
            : 'Visualiza múltiples voicings de acordes en un solo diapasón. Elige la tónica, el tipo y la posición para encontrar las transiciones más suaves.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: NUM_CHORDS }).map((_, index) => {
           const chordConfig = selectedChords[index];
           const numNotes = chordConfig ? (CHORDS[chordConfig.key]?.intervals.length || 0) : 0;
           const numPositions = instrument === 'guitar' ? processedGuitarVoicings.voicingsByChord[index]?.available.length : 0;

           return(
            <div key={index} className="p-4 rounded-lg bg-gray-800/50" style={{ border: `2px solid ${CHORD_COLORS[index]}` }}>
               <h3 className="text-lg font-bold mb-3" style={{ color: CHORD_COLORS[index] }}>Acorde {index + 1}</h3>
               <div className="flex flex-col gap-4">
                  <Select
                    label="Tipo"
                    value={chordConfig?.key || 'none'}
                    onChange={(e) => handleChordChange(index, 'key', e.target.value)}
                  >
                      <option value="none">-- Ninguno --</option>
                      {Object.entries(CHORDS).map(([key, chord]) => (
                          <option key={key} value={key}>{chord.name}</option>
                      ))}
                  </Select>
                  
                  {chordConfig && (
                    <>
                      <Select
                        label="Tónica"
                        value={chordConfig.root}
                        onChange={(e) => handleChordChange(index, 'root', e.target.value)}
                      >
                          {NOTES.map(note => <option key={note} value={note}>{note}</option>)}
                      </Select>

                      {instrument === 'piano' ? (
                         <>
                          <Select
                            label="Inversión"
                            value={chordConfig.inversion}
                            onChange={(e) => handleChordChange(index, 'inversion', e.target.value)}
                            disabled={numNotes < 2}
                          >
                            {Array.from({ length: numNotes }).map((_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? 'Fundamental' : `${i}ª Inversión`}
                              </option>
                            ))}
                          </Select>
                          <Select
                            label="Octava"
                            value={chordConfig.octave}
                            onChange={(e) => handleChordChange(index, 'octave', e.target.value)}
                          >
                            {[2, 3, 4, 5].map(o => <option key={o} value={o}>{`C${o} - B${o}`}</option>)}
                          </Select>
                        </>
                      ) : (
                        <Select
                          label="Posición"
                          value={chordConfig.inversion}
                          onChange={(e) => handleChordChange(index, 'inversion', e.target.value)}
                          disabled={numPositions < 2}
                        >
                          {Array.from({ length: numPositions }).map((_, i) => (
                              <option key={i} value={i}>
                                {`Posición ${i + 1}`}
                              </option>
                            ))}
                        </Select>
                      )}
                    </>
                  )}
               </div>
            </div>
           );
        })}
      </div>
      
      {instrument === 'piano' ? (
         <PianoKeyboard 
            ref={pianoContainerRef}
            startOctave={PIANO_START_OCTAVE}
            numOctaves={PIANO_NUM_OCTAVES}
            noteDots={processedPianoVoicings}
        />
      ) : (
        <div className="mt-8">
            <GuitarFretboard noteDots={processedGuitarVoicings.noteDots} />
        </div>
      )}
    </Card>
  );
};

export default Voicing;
