import React from 'react';
import { PIANO_KEYS } from '../constants';

interface PianoKeyboardProps {
  highlightedNotes?: string[];
  startOctave?: number;
  numOctaves?: number;
  highlightClasses?: {
    white: string;
    black: string;
  };
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  highlightedNotes = [],
  startOctave = 3,
  numOctaves = 2,
  highlightClasses = {
    white: '!bg-sky-400 !border-sky-300',
    black: '!bg-sky-500 !border-sky-400',
  }
}) => {
  const noteIsHighlighted = (note: string, octave: number) => {
    return highlightedNotes.includes(`${note}${octave}`);
  };

  return (
    <div className="flex justify-start lg:justify-center items-start my-4 sm:my-8 select-none overflow-x-auto pb-4">
      <div className="flex">
        {Array.from({ length: numOctaves }).map((_, octaveIndex) => {
          const currentOctave = startOctave + octaveIndex;
          return (
            <div key={`octave-${currentOctave}`} className="relative flex shrink-0">
              {/* White keys */}
              {PIANO_KEYS.filter(k => k.type === 'white').map(key => (
                <div
                  key={`white-${key.note}-${currentOctave}`}
                  className={`
                    w-12 h-48 border-2 border-gray-700 rounded-b-md bg-white
                    flex items-end justify-center pb-2 text-gray-800 font-bold
                    transition-colors duration-200
                    ${noteIsHighlighted(key.note, currentOctave) ? highlightClasses.white : ''}
                  `}
                >
                  {key.note === 'C' ? `${key.note}${currentOctave}` : key.note}
                </div>
              ))}
              {/* Black keys */}
              <div className="absolute top-0 left-0 h-28 flex">
                {PIANO_KEYS.map((key, index) => {
                  if (key.type === 'white') {
                    const nextKey = PIANO_KEYS[index + 1];
                    if (nextKey && nextKey.type === 'black') {
                      return (
                         <div key={`black-container-${key.note}-${currentOctave}`} className="w-12 h-full relative">
                           <div
                            className={`
                              w-8 h-28 border-2 border-gray-700 rounded-b-md bg-gray-800
                              absolute left-full transform -translate-x-1/2 z-10
                              transition-colors duration-200
                              ${noteIsHighlighted(nextKey.note, currentOctave) ? highlightClasses.black : ''}
                            `}
                           ></div>
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
};

export default PianoKeyboard;