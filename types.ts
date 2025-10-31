
export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export enum View {
  CircleOfFifths = 'Círculo de Quintas',
  Scales = 'Escalas',
  Chords = 'Acordes',
  Harmony = 'Armonía',
}

export interface Scale {
  name: string;
  intervals: number[];
}

export interface Chord {
  name: string;
  intervals: number[];
}

export type Mode = 'major' | 'minor';
