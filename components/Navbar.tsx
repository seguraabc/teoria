import React from 'react';
import { View } from '../types';
import { useInstrument } from '../contexts/InstrumentContext';
import InstrumentSwitch from './ui/InstrumentSwitch';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const views = Object.values(View);
  const { instrument, setInstrument } = useInstrument();

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-20">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A3,3 0 0,0 9,5A3,3 0 0,0 12,8A3,3 0 0,0 15,5A3,3 0 0,0 12,2M11,10.04C5.84,10.55 4.5,15.18 4.5,17A1.5,1.5 0 0,0 6,18.5A1.5,1.5 0 0,0 7.5,17C7.5,15.82 8.44,14.07 11,13.81V20A1,1 0 0,0 12,21A1,1 0 0,0 13,20V11.35C18.16,11.86 19.5,16.5 19.5,18A1.5,1.5 0 0,0 21,19.5A1.5,1.5 0 0,0 22.5,18C22.5,13.55 16.04,9.5 13,10.18V10C12.33,10 11.67,10 11,10.04Z" />
          </svg>
          <span className="hidden sm:inline">Visualizador de Teoría Musical</span>
          <span className="sm:hidden">Teoría Musical</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <InstrumentSwitch instrument={instrument} setInstrument={setInstrument} />
          <div className="flex flex-wrap justify-center items-center gap-1 bg-gray-700 rounded-lg p-1">
            {views.map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300
                  ${currentView === view ? 'bg-sky-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
              >
                {view}
              </button>
            ))}
            <a
              href="https://ocr-partituras.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 text-gray-300 hover:bg-gray-600"
              title="OCR Partituras (enlace externo)"
            >
              OCR
            </a>
            <a
              href="https://mis-acordes.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-9 w-9 rounded-full text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-300"
              aria-label="Mis Acordes"
              title="Mis Acordes (enlace externo)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;