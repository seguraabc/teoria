import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { View } from './types';
import CircleOfFifths from './components/CircleOfFifths';
import Scales from './components/Scales';
import Chords from './components/Chords';
import Harmony from './components/Harmony';
import { InstrumentProvider } from './contexts/InstrumentContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CircleOfFifths);

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
      </div>
    </InstrumentProvider>
  );
};

export default App;
