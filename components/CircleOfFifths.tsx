import React, { useState, useMemo, useEffect } from 'react';
import Card from './ui/Card';
import PianoKeyboard from './PianoKeyboard';
import { 
  CIRCLE_OF_FIFTHS_MAJOR, 
  CIRCLE_OF_FIFTHS_MINOR, 
  SCALES, 
  CHORDS,
  getScaleNotesWithOctaves, 
  getChordNotesWithOctaves,
  KEY_DISPLAY_NAMES,
  DIATONIC_CHORD_QUALITIES,
  ROMAN_NUMERALS,
  NOTES
} from '../constants';
import { Note, Mode } from '../types';

const CircleOfFifths: React.FC = () => {
  const [selectedMajorKey, setSelectedMajorKey] = useState<Note>('C');
  const [mode, setMode] = useState<Mode>('major');
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [highlightType, setHighlightType] = useState<'scale' | 'chord'>('scale');

  // Memoized values for performance
  const keyInfo = useMemo(() => KEY_DISPLAY_NAMES[selectedMajorKey], [selectedMajorKey]);
  
  const relativeMinorKey = useMemo(() => {
     const majorIndex = CIRCLE_OF_FIFTHS_MAJOR.indexOf(selectedMajorKey);
     return CIRCLE_OF_FIFTHS_MINOR[majorIndex];
  }, [selectedMajorKey]);

  const activeKey = useMemo(() => (mode === 'major' ? selectedMajorKey : relativeMinorKey), [mode, selectedMajorKey, relativeMinorKey]);
  const activeScale = useMemo(() => (mode === 'major' ? SCALES.major : SCALES.naturalMinor), [mode]);
  
  const scaleNotes = useMemo(() => {
    const notes = getScaleNotesWithOctaves(activeKey, activeScale);
    return notes.slice(0, 7);
  }, [activeKey, activeScale]);

  // Effect to update piano display when the scale changes (key or mode)
  useEffect(() => {
    setHighlightedNotes(scaleNotes);
    setHighlightType('scale');
  }, [scaleNotes]);
  
  const diatonicChords = useMemo(() => {
    const scaleRootNotes = getScaleNotesWithOctaves(activeKey, activeScale, 0).map(n => n.slice(0, -1) as Note);
    return DIATONIC_CHORD_QUALITIES[mode].map((quality, index) => {
        const root = scaleRootNotes[index];
        const chord = CHORDS[quality];
        const numeral = ROMAN_NUMERALS[mode][index];
        const suffix = quality === 'minor' ? 'm' : quality === 'diminished' ? '°' : '';
        return {
            name: `${root}${suffix}`,
            numeral,
            notes: getChordNotesWithOctaves(root, chord, 3)
        }
    });
  }, [activeKey, activeScale, mode]);

  const { dominantKey, subdominantKey } = useMemo(() => {
    const currentIndex = CIRCLE_OF_FIFTHS_MAJOR.indexOf(selectedMajorKey);
    const dominantIndex = (currentIndex + 1) % 12;
    const subdominantIndex = (currentIndex - 1 + 12) % 12;
    return {
      dominantKey: CIRCLE_OF_FIFTHS_MAJOR[dominantIndex],
      subdominantKey: CIRCLE_OF_FIFTHS_MAJOR[subdominantIndex]
    };
  }, [selectedMajorKey]);
  
  const handleKeySelect = (key: Note) => {
    setSelectedMajorKey(key);
  }

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  }
  
  const renderCircle = () => {
    const size = 320;
    const radius = size / 2;
    return (
      <div className="relative w-80 h-80 mx-auto shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
        {CIRCLE_OF_FIFTHS_MAJOR.map((key, index) => {
          const angle = (index / 12) * 2 * Math.PI - Math.PI / 2;
          const x = radius + (radius - 30) * Math.cos(angle);
          const y = radius + (radius - 30) * Math.sin(angle);
          const minorKey = CIRCLE_OF_FIFTHS_MINOR[index];

          const isSelected = selectedMajorKey === key;
          const isDominant = dominantKey === key;
          const isSubdominant = subdominantKey === key;

          let bgClass = 'bg-gray-700 hover:bg-gray-600';
          if (isSelected) {
            bgClass = 'bg-sky-500 text-white scale-110 shadow-lg';
          } else if (isDominant || isSubdominant) {
            bgClass = 'bg-gray-600 border-2 border-sky-800/50';
          }

          return (
            <div
              key={key}
              className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer
                         transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2
                         ${bgClass}`}
              style={{ top: `${y}px`, left: `${x}px` }}
              onClick={() => handleKeySelect(key)}
            >
              <span className="font-bold text-lg">{KEY_DISPLAY_NAMES[key].major.replace(' Major','')}</span>
              <span className="text-xs text-gray-300">{KEY_DISPLAY_NAMES[key].minor.replace(' Minor','m')}</span>
            </div>
          );
        })}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gray-800 rounded-full border-4 border-gray-700"></div>
      </div>
    );
  };

  const highlightClasses = highlightType === 'chord'
    ? { white: '!bg-green-400 !border-green-300', black: '!bg-green-500 !border-green-400' }
    : undefined;

  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-sky-400">Círculo de Quintas Interactivo</h2>
      <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
        {renderCircle()}
        <div className="text-center w-full lg:w-auto">
            <div className="flex justify-center mb-4">
                <div className="flex space-x-1 bg-gray-700 rounded-full p-1">
                    <button onClick={() => handleModeChange('major')} className={`px-4 py-1 text-sm rounded-full transition ${mode === 'major' ? 'bg-sky-500' : ''}`}>Mayor</button>
                    <button onClick={() => handleModeChange('minor')} className={`px-4 py-1 text-sm rounded-full transition ${mode === 'minor' ? 'bg-sky-500' : ''}`}>Menor</button>
                </div>
            </div>
            <h3 className="text-xl font-semibold">Tonalidad: <span className="text-sky-400">{mode === 'major' ? keyInfo.major : keyInfo.minor}</span></h3>
            <p className="text-sm text-gray-400 mb-2">Armadura: {keyInfo.signature}</p>
            <p className="text-gray-400">Notas en la Escala:</p>
            <div className="flex gap-2 justify-center mt-2 font-mono" onClick={() => {
                setHighlightedNotes(scaleNotes);
                setHighlightType('scale');
              }}>
                {scaleNotes.map(note => (
                    <span key={note} className="bg-gray-700 px-2 py-1 rounded-md cursor-pointer">{note.replace(/[0-9]/, '')}</span>
                ))}
            </div>
            <div className="mt-6 w-full max-w-md mx-auto">
                <p className="text-gray-400">Acordes Diatónicos:</p>
                 <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                    {diatonicChords.map(chord => (
                        <div key={chord.numeral} onClick={() => {
                           setHighlightedNotes(chord.notes);
                           setHighlightType('chord');
                        }} className="bg-gray-700 p-2 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition">
                           <span className="text-xs text-gray-400">{chord.numeral}</span>
                           <span className="font-mono font-bold text-sm">{chord.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      <PianoKeyboard highlightedNotes={highlightedNotes} highlightClasses={highlightClasses} />
    </Card>
  );
};

export default CircleOfFifths;