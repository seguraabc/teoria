import React from 'react';
import { Instrument } from '../../types';

interface InstrumentSwitchProps {
  instrument: Instrument;
  setInstrument: (instrument: Instrument) => void;
}

const InstrumentSwitch: React.FC<InstrumentSwitchProps> = ({ instrument, setInstrument }) => {
  const isPiano = instrument === 'piano';

  return (
    <div className="flex items-center bg-gray-700 rounded-full p-1">
      <button
        onClick={() => setInstrument('piano')}
        aria-pressed={isPiano}
        className={`p-2 rounded-full transition-colors duration-300 ${isPiano ? 'bg-sky-500' : 'hover:bg-gray-600'}`}
        title="Cambiar a Piano"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3M8 19H6V5H8V19M12 19H10V5H12V19M14 19V5H16V19H14M18 19V5H20V19H18Z" />
        </svg>
      </button>
      <button
        onClick={() => setInstrument('guitar')}
        aria-pressed={!isPiano}
        className={`p-2 rounded-full transition-colors duration-300 ${!isPiano ? 'bg-sky-500' : 'hover:bg-gray-600'}`}
        title="Cambiar a Guitarra"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59,2.27L15,5.19V5C15,3.9 14.1,3 13,3C11.9,3 11,3.9 11,5V11.27C10.42,11.09 9.77,11 9.09,11C6.27,11 4,13.27 4,16.09C4,18.9 6.27,21.18 9.09,21.18C11.9,21.18 14.18,18.9 14.18,16.09V10.34L19.59,6.81C20.2,6.43 20.5,5.71 20.5,5C20.5,3.9 19.59,2.27 19.59,2.27M9.09,19.36C7.28,19.36 5.82,17.9 5.82,16.09C5.82,14.28 7.28,12.82 9.09,12.82C10.9,12.82 12.36,14.28 12.36,16.09C12.36,17.9 10.9,19.36 9.09,19.36Z" />
        </svg>
      </button>
    </div>
  );
};

export default InstrumentSwitch;
