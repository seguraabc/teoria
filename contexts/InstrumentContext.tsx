import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Instrument } from '../types';

interface InstrumentContextType {
  instrument: Instrument;
  setInstrument: (instrument: Instrument) => void;
}

const InstrumentContext = createContext<InstrumentContextType | undefined>(undefined);

export const InstrumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [instrument, setInstrument] = useState<Instrument>('piano');

  return (
    <InstrumentContext.Provider value={{ instrument, setInstrument }}>
      {children}
    </InstrumentContext.Provider>
  );
};

export const useInstrument = (): InstrumentContextType => {
  const context = useContext(InstrumentContext);
  if (!context) {
    throw new Error('useInstrument must be used within an InstrumentProvider');
  }
  return context;
};
