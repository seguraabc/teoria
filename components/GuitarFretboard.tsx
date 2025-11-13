import React from 'react';
import { Note } from '../types';
import { NOTES, GUITAR_TUNING_STANDARD, getNoteOnString } from '../constants';

interface FretboardNoteDot {
  stringIndex: number;
  fret: number;
  note: Note;
  color: string;
  id: string;
}

interface GuitarFretboardProps {
  highlightedNotes?: string[];
  rootNote?: Note;
  numFrets?: number;
  noteColors?: {
      root: string;
      other: string;
  };
  voicing?: Array<{ stringIndex: number; fret: number; note: Note }>;
  noteDots?: FretboardNoteDot[];
}

const GuitarFretboard: React.FC<GuitarFretboardProps> = ({ 
    highlightedNotes = [], 
    rootNote, 
    numFrets = 15,
    noteColors = { root: 'bg-sky-500', other: 'bg-green-500'},
    voicing,
    noteDots,
}) => {
    const fretMarkers = [3, 5, 7, 9, 15];
    const notesToHighlight = highlightedNotes.map(n => n.replace(/[0-9]/g, ''));

    const renderSingleNoteDot = (note: Note, key: string) => {
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

    const renderBarre = () => {
        if (!voicing ||voicing.length === 0 || noteDots) return null;

        const frettedNotes = voicing.filter(n => n.fret > 0);
        if (frettedNotes.length < 2) return null;

        const minFret = Math.min(...frettedNotes.map(n => n.fret));
        
        const barreNotes = voicing.filter(n => n.fret === minFret);
        if (barreNotes.length < 2) return null;

        const minString = Math.min(...barreNotes.map(n => n.stringIndex));
        const maxString = Math.max(...barreNotes.map(n => n.stringIndex));

        const barreHeight = (maxString - minString) * 2;
        
        const topPosition = `${minString * 2}rem`;
        const leftPosition = `${4 + 2 + (minFret - 1) * 16}rem`;
        
        return (
             <div
                className="absolute bg-gray-400 h-2 rounded-sm z-[5]"
                style={{
                    width: `${barreHeight}rem`,
                    top: `calc(${topPosition} + 1rem - 0.25rem)`,
                    left: `calc(${(minFret - 1) * 4}rem + 2.5rem - 0.25rem)`,
                    transform: 'rotate(90deg)',
                    transformOrigin: 'top left'
                }}
            ></div>
        );
    };

    const barreElement = renderBarre();

    return (
        <div className="flex justify-start items-center my-4 sm:my-8 overflow-x-auto p-4 select-none">
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col min-w-max">
                <div className="flex flex-col-reverse relative">
                     {barreElement}
                    {GUITAR_TUNING_STANDARD.map((openNote, stringIndex) => {
                        let openStringContent = null;
                        const dotsForOpenString = noteDots?.filter(d => d.stringIndex === stringIndex && d.fret === 0);

                        if (dotsForOpenString && dotsForOpenString.length > 0) {
                            openStringContent = (
                                <div className="absolute inset-0 flex items-center justify-center z-10 gap-1">
                                    {dotsForOpenString.map(dot => (
                                        <div key={dot.id} className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-gray-900/50" style={{ backgroundColor: dot.color }}>
                                            {dot.note.replace('#', '♯')}
                                        </div>
                                    ))}
                                </div>
                            );
                        } else if (voicing) {
                            const noteOnOpenString = voicing.find(v => v.stringIndex === stringIndex && v.fret === 0)?.note;
                            if(noteOnOpenString) {
                                openStringContent = renderSingleNoteDot(noteOnOpenString, `open-${stringIndex}`);
                            }
                        }

                        return (
                            <div key={stringIndex} className="flex items-center relative">
                                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 mr-2">{openNote}</div>
                                <div className="relative w-4 h-8 flex items-center justify-center">
                                    {openStringContent}
                                </div>
                                <div className="w-2 h-8 bg-gray-400"></div>
                                <div className={`absolute w-full h-px ${['bg-gray-500', 'bg-gray-400', 'bg-gray-500', 'bg-gray-400', 'bg-gray-500', 'bg-gray-400'][stringIndex]} top-1/2 -translate-y-1/2 z-0`}></div>

                                {Array.from({ length: numFrets }).map((_, fretIndex) => {
                                    const fret = fretIndex + 1;
                                    let fretContent = null;
                                    
                                    const dotsForThisFret = noteDots?.filter(d => d.stringIndex === stringIndex && d.fret === fret);
                                    
                                    if(dotsForThisFret && dotsForThisFret.length > 0) {
                                        fretContent = (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 gap-1">
                                                {dotsForThisFret.map(dot => (
                                                    <div key={dot.id} className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-gray-900/50" style={{ backgroundColor: dot.color }}>
                                                        {dot.note.replace('#', '♯')}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else if (voicing) {
                                        const voicedFret = voicing.find(v => v.stringIndex === stringIndex && v.fret === fret);
                                        if (voicedFret) fretContent = renderSingleNoteDot(voicedFret.note, `fret-${stringIndex}-${fret}`);
                                    } else if (highlightedNotes.length > 0) {
                                        const currentNote = getNoteOnString(stringIndex, fret);
                                        if (notesToHighlight.includes(currentNote)) {
                                            fretContent = renderSingleNoteDot(currentNote, `fret-${stringIndex}-${fret}`);
                                        }
                                    }
                                    
                                    const isInlayString = stringIndex === 2;
                                    const showInlay = !fretContent && isInlayString && fretMarkers.includes(fret);
                                    const showDoubleInlay = !fretContent && isInlayString && fret === 12;

                                    return (
                                        <div key={fret} className="relative w-16 h-8 flex items-center justify-center border-r border-gray-600">
                                            {fretContent}
                                            {!fretContent && showInlay && (
                                                <div className="w-3 h-3 bg-gray-600/80 rounded-full"></div>
                                            )}
                                            {!fretContent && showDoubleInlay && (
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
