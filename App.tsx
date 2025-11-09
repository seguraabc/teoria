import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { View } from './types';
import CircleOfFifths from './components/CircleOfFifths';
import Scales from './components/Scales';
import Chords from './components/Chords';
import Harmony from './components/Harmony';
import { InstrumentProvider } from './contexts/InstrumentContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Chords);

  const renderView = () => {
    switch (currentView) {
      case View.CircleOfFifths:
        return <CircleOfFifths />;
      case View.Scales:
        return <Scales />;
      case View.Chords:
        return <Chords />;
      case View.Harmony:
        return <Harmony />;
      default:
        return <CircleOfFifths />;
    }
  };

  return (
    <InstrumentProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="container mx-auto p-4 md:p-8">
          <div className="flex justify-center">
              {renderView()}
          </div>
        </main>
        <footer className="text-center p-4 text-gray-500 text-sm">
          <p>Hecho por S.Segura-2025</p>
        </footer>
        <a
          href="https://visualizador-acordes.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 bg-sky-500 hover:bg-sky-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
          aria-label="Abrir Visualizador de Acordes Externo"
          title="Visualizador de Acordes (enlace externo)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </a>
      </div>
    </InstrumentProvider>
  );
};

export default App;
