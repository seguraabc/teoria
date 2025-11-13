import React, { forwardRef } from 'react';
import { PIANO_KEYS } from '../constants';

interface NoteDot {
  note: string;
  color: string;
  id: string | number;
}

interface PianoKeyboardProps {
  highlightedNotes?: string[];
  noteDots?: NoteDot[];
  startOctave?: number;
  numOctaves?: number;
  highlightClasses?: {
    white: string;
    black: string;
  };
}

const PianoKeyboard = forwardRef<HTMLDivElement, PianoKeyboardProps>(({
  highlightedNotes = [],
  noteDots = [],
  startOctave = 3,
  numOctaves = 2,
  highlightClasses = {
    white: '!bg-sky-400 !border-sky-300',
    black: '!bg-sky-500 !border-sky-400',
  }
}, ref) => {
  const noteIsHighlighted = (note: string, octave: number) => {
    return highlightedNotes.includes(`${note}${octave}`);
  };

  const getDotsForNote = (note: string, octave: number) => {
    return noteDots.filter(dot => dot.note === `${note}${octave}`);
  };

  return (
    <div ref={ref} className="flex justify-start items-start my-4 sm:my-8 select-none overflow-x-auto pb-4 w-full">
      <div className="flex">
        {Array.from({ length: numOctaves }).map((_, octaveIndex) => {
          const currentOctave = startOctave + octaveIndex;
          return (
            <div key={`octave-${currentOctave}`} className="relative flex shrink-0">
              {/* White keys */}
              {PIANO_KEYS.filter(k => k.type === 'white').map(key => {
                 const dots = getDotsForNote(key.note, currentOctave);
                 const isOctaveMarker = key.note === 'C';
                 return (
                    <div
                      key={`white-${key.note}-${currentOctave}`}
                      data-note-id={isOctaveMarker ? `C${currentOctave}` : undefined}
                      className={`
                        relative
                        w-12 h-48 border-2 border-gray-700 rounded-b-md bg-white
                        flex items-end justify-center pb-2 text-gray-800 font-bold
                        transition-colors duration-200
                        ${noteIsHighlighted(key.note, currentOctave) ? highlightClasses.white : ''}
                      `}
                    >
                      {isOctaveMarker ? `${key.note}${currentOctave}` : key.note}
                      {dots.length > 0 && (
                         <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-1">
                           {dots.map((dot) => (
                              <div key={dot.id} className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: dot.color }}></div>
                           ))}
                         </div>
                      )}
                    </div>
                 );
              })}
              {/* Black keys */}
              <div className="absolute top-0 left-0 h-28 flex">
                {PIANO_KEYS.map((key, index) => {
                  if (key.type === 'white') {
                    const nextKey = PIANO_KEYS[index + 1];
                    if (nextKey && nextKey.type === 'black') {
                      const dots = getDotsForNote(nextKey.note, currentOctave);
                      return (
                         <div key={`black-container-${key.note}-${currentOctave}`} className="w-12 h-full relative">
                           <div
                            className={`
                              relative
                              w-8 h-28 border-2 border-gray-700 rounded-b-md bg-gray-800
                              absolute left-full transform -translate-x-1/2 z-10
                              transition-colors duration-200
                              flex items-end justify-center
                              ${noteIsHighlighted(nextKey.note, currentOctave) ? highlightClasses.black : ''}
                            `}
                           >
                              {dots.length > 0 && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1">
                                  {dots.map((dot) => (
                                      <div key={dot.id} className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: dot.color }}></div>
                                  ))}
                                </div>
                              )}
                           </div>
                         </div>
                      );
                    }
                    return <div key={`empty-${key.note}-${currentOctave}`} className="w-12 h-full" />;
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PianoKeyboard.displayName = 'PianoKeyboard';
export default PianoKeyboard;