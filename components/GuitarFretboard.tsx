import React from 'react';
import { Note } from '../types';
// Fix: Import the 'getNoteOnString' function to resolve the 'Cannot find name' error.
import { NOTES, GUITAR_TUNING_STANDARD, getNoteOnString } from '../constants';

interface GuitarFretboardProps {
  highlightedNotes?: string[];
  rootNote?: Note;
  numFrets?: number;
  noteColors?: {
      root: string;
      other: string;
  };
  voicing?: Array<{ stringIndex: number; fret: number; note: Note }>;
}

const GuitarFretboard: React.FC<GuitarFretboardProps> = ({ 
    highlightedNotes = [], 
    rootNote, 
    numFrets = 15,
    noteColors = { root: 'bg-sky-500', other: 'bg-green-500'},
    voicing,
}) => {
    const fretMarkers = [3, 5, 7, 9, 15];
    const notesToHighlight = highlightedNotes.map(n => n.replace(/[0-9]/g, ''));

    const renderNoteDot = (note: Note, key: string) => {
        const isRoot = note === rootNote;
        const bgColor = isRoot ? noteColors.root : noteColors.other;

        return (
            <div key={key} className="absolute inset-0 flex items-center justify-center z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-gray-900/50 ${bgColor}`}>
                    {note.replace('#', '♯')}
                </div>
            </div>
        )
    }

    // --- Lógica para dibujar la cejilla (Barre) ---
    const renderBarre = () => {
        if (!voicing || voicing.length === 0) return null;

        const frettedNotes = voicing.filter(n => n.fret > 0);
        if (frettedNotes.length < 2) return null;

        const minFret = Math.min(...frettedNotes.map(n => n.fret));
        
        const barreNotes = voicing.filter(n => n.fret === minFret);
        if (barreNotes.length < 2) return null;

        const minString = Math.min(...barreNotes.map(n => n.stringIndex));
        const maxString = Math.max(...barreNotes.map(n => n.stringIndex));

        const barreHeight = (maxString - minString) * 2; // 2rem per string (h-8)
        
        // La posición se calcula desde la cuerda más aguda (índice 0)
        const topPosition = `${minString * 2}rem`; // 2rem per string
        // El traste 1 está a 16px (w-4) + 8px (w-2) del borde, cada traste siguiente a 64px (w-16)
        const leftPosition = `${4 + 2 + (minFret - 1) * 16}rem`;
        
        return (
             <div
                className="absolute bg-gray-400 h-2 rounded-sm z-[5]"
                style={{
                    width: `${barreHeight}rem`,
                    top: `calc(${topPosition} + 1rem - 0.25rem)`, // Center on the string line
                    left: `calc(${(minFret - 1) * 4}rem + 2.5rem - 0.25rem)`, // Center on the fret
                    transform: 'rotate(90deg)',
                    transformOrigin: 'top left'
                }}
            ></div>
        );
    };

    const barreElement = renderBarre();

    return (
        <div className="flex justify-start lg:justify-center items-center my-4 sm:my-8 overflow-x-auto p-4 select-none">
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col">
                <div className="flex flex-col-reverse relative">
                     {barreElement}
                    {GUITAR_TUNING_STANDARD.map((openNote, stringIndex) => {
                        const openNoteIndex = NOTES.indexOf(openNote);
                        const noteOnOpenString = voicing?.find(v => v.stringIndex === stringIndex && v.fret === 0)?.note;

                        return (
                            <div key={stringIndex} className="flex items-center relative">
                                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 mr-2">{openNote}</div>
                                <div className="relative w-4 h-8 flex items-center justify-center">
                                    {noteOnOpenString && renderNoteDot(noteOnOpenString, `open-${stringIndex}`)}
                                </div>
                                <div className="w-2 h-8 bg-gray-400"></div>
                                <div className={`absolute w-full h-px ${['bg-gray-500', 'bg-gray-400', 'bg-gray-500', 'bg-gray-400', 'bg-gray-500', 'bg-gray-400'][stringIndex]} top-1/2 -translate-y-1/2 z-0`}></div>

                                {Array.from({ length: numFrets }).map((_, fretIndex) => {
                                    const fret = fretIndex + 1;
                                    const currentNote = getNoteOnString(stringIndex, fret);
                                    
                                    let noteToRender: Note | null = null;
                                    if (voicing) {
                                        const voicedFret = voicing.find(v => v.stringIndex === stringIndex && v.fret === fret);
                                        if (voicedFret) noteToRender = voicedFret.note;
                                    } else if (notesToHighlight.includes(currentNote)) {
                                        noteToRender = currentNote;
                                    }
                                    
                                    const isInlayString = stringIndex === 2;
                                    const showInlay = isInlayString && fretMarkers.includes(fret);
                                    const showDoubleInlay = isInlayString && fret === 12;

                                    return (
                                        <div key={fret} className="relative w-16 h-8 flex items-center justify-center border-r border-gray-600">
                                            {noteToRender && renderNoteDot(noteToRender, `fret-${stringIndex}-${fret}`)}

                                            {!noteToRender && showInlay && (
                                                <div className="w-3 h-3 bg-gray-600/80 rounded-full"></div>
                                            )}
                                            {!noteToRender && showDoubleInlay && (
                                                <div className="flex w-full justify-around">
                                                    <div className="w-3 h-3 bg-gray-600/80 rounded-full"></div>
                                                    <div className="w-3 h-3 bg-gray-600/80 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                 <div className="flex w-full mt-2">
                     <div className="w-8 mr-2"></div>
                     <div className="w-4"></div>
                     <div className="w-2"></div>
                     {Array.from({ length: numFrets }).map((_, fretIndex) => {
                        const fret = fretIndex + 1;
                        return (
                            <div key={`num-${fret}`} className="w-16 text-center text-xs text-gray-500">
                                {(fretMarkers.includes(fret) || fret === 12) ? fret : ''}
                            </div>
                        )
                     })}
                </div>
            </div>
        </div>
    );
};

export default GuitarFretboard;