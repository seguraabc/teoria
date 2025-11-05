import React, { useState, useMemo, useEffect } from 'react';
import { Note } from '../types';
import { NOTES, CHORDS, getChordNotesWithOctaves, getGuitarVoicings } from '../constants';
import Card from './ui/Card';
import Select from './ui/Select';
import PianoKeyboard from './PianoKeyboard';
import GuitarFretboard from './GuitarFretboard';
import { useInstrument } from '../contexts/InstrumentContext';

const Chords: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('C');
  const [chordKey, setChordKey] = useState<string>('major');
  const [inversion, setInversion] = useState<number>(0);
  const { instrument } = useInstrument();

  const selectedChord = CHORDS[chordKey];

  const chordNotes = useMemo(() => {
    if (rootNote && selectedChord) {
      return getChordNotesWithOctaves(rootNote, selectedChord);
    }
    return [];
  }, [rootNote, selectedChord]);

  const guitarVoicings = useMemo(() => {
      if (instrument === 'guitar' && rootNote && selectedChord) {
          return getGuitarVoicings(rootNote, selectedChord);
      }
      return [];
  }, [instrument, rootNote, selectedChord]);
  
  const currentGuitarVoicing = guitarVoicings[inversion] || undefined;

  useEffect(() => {
    setInversion(0);
  }, [instrument, rootNote, chordKey]);

  useEffect(() => {
    const maxPositions = instrument === 'piano' ? chordNotes.length : guitarVoicings.length;
    if (inversion >= maxPositions) {
      setInversion(0);
    }
  }, [chordNotes.length, guitarVoicings.length, inversion, instrument]);

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
  
  const invertedChordNotes = useMemo(() => {
    return applyInversion(chordNotes, inversion);
  }, [chordNotes, inversion]);

  const handleRootNoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRootNote(e.target.value as Note);
    setInversion(0);
  };

  const handleChordKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChordKey(e.target.value);
    setInversion(0);
  };
  
  const displayedNotes = instrument === 'guitar' 
    ? (currentGuitarVoicing?.map(v => v.note) ?? [])
    : invertedChordNotes;
    
  const positionOptionsCount = instrument === 'guitar' ? guitarVoicings.length : chordNotes.length;

  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-sky-400">Visualizador de Acordes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <Select
          label="Nota Fundamental"
          value={rootNote}
          onChange={handleRootNoteChange}
        >
          {NOTES.map(note => <option key={note} value={note}>{note}</option>)}
        </Select>
        <Select
          label="Tipo de Acorde"
          value={chordKey}
          onChange={handleChordKeyChange}
        >
          {Object.entries(CHORDS).map(([key, chord]) => (
            <option key={key} value={key}>{chord.name}</option>
          ))}
        </Select>
        <Select
          label={instrument === 'guitar' ? 'Posición' : 'Inversión'}
          value={inversion}
          onChange={(e) => setInversion(parseInt(e.target.value, 10))}
          disabled={positionOptionsCount < 2}
        >
          {Array.from({ length: positionOptionsCount }).map((_, index) => (
            <option key={index} value={index}>
              {instrument === 'guitar'
                ? `Posición ${index + 1}`
                : index === 0 ? 'Posición Fundamental' : `${index}ª Inversión`
              }
            </option>
          ))}
        </Select>
      </div>
       <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold">{rootNote} {selectedChord.name}</h3>
        <div className="flex gap-2 justify-center mt-2 font-mono flex-wrap">
          {/* Display unique notes for clarity in text */}
          {[...new Set(displayedNotes.map(n => n.replace(/[0-9]/, '')))].map((note, index) => (
            <span key={`${note}-${index}`} className="bg-gray-700 px-3 py-1 rounded-md text-lg">{note}</span>
          ))}
        </div>
      </div>
       {instrument === 'piano' ? (
          <PianoKeyboard highlightedNotes={invertedChordNotes} />
        ) : (
          <GuitarFretboard 
              voicing={currentGuitarVoicing} 
              rootNote={rootNote}
          />
        )}
    </Card>
  );
};

export default Chords;