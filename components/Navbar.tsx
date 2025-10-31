
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const views = Object.values(View);

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
          </svg>
          Visualizador de Teoría para Piano
        </div>
        <div className="flex space-x-2 bg-gray-700 rounded-full p-1">
          {views.map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300
                ${currentView === view ? 'bg-sky-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;