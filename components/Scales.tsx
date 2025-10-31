import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import { NOTES, SCALES, getScaleNotesWithOctaves } from '../constants';
import Card from './ui/Card';
import Select from './ui/Select';
import PianoKeyboard from './PianoKeyboard';

const Scales: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('C');
  const [scaleKey, setScaleKey] = useState<string>('major');

  const selectedScale = SCALES[scaleKey];

  const scaleNotes = useMemo(() => {
    if (rootNote && selectedScale) {
      return getScaleNotesWithOctaves(rootNote, selectedScale);
    }
    return [];
  }, [rootNote, selectedScale]);

  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-sky-400">Visualizador de Escalas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
        <Select
          label="Nota Fundamental"
          value={rootNote}
          onChange={(e) => setRootNote(e.target.value as Note)}
        >
          {NOTES.map(note => <option key={note} value={note}>{note}</option>)}
        </Select>
        <Select
          label="Tipo de Escala"
          value={scaleKey}
          onChange={(e) => setScaleKey(e.target.value)}
        >
          {Object.entries(SCALES).map(([key, scale]) => (
            <option key={key} value={key}>{scale.name}</option>
          ))}
        </Select>
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold">{rootNote} {selectedScale.name}</h3>
        <div className="flex gap-2 justify-center mt-2 font-mono flex-wrap">
          {scaleNotes.slice(0, -1).map(note => (
            <span key={note} className="bg-gray-700 px-3 py-1 rounded-md text-lg">{note.replace(/[0-9]/, '')}</span>
          ))}
        </div>
      </div>
      <PianoKeyboard highlightedNotes={scaleNotes.slice(0, -1)} />
    </Card>
  );
};

export default Scales;