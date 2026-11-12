import type { ReactNode } from 'react';

export interface SlideProps {
  /** current build step within this slide (0-based) */
  step: number;
  /** true while this slide is the one on screen */
  active: boolean;
  /** explore mode: a visitor is clicking through alone (show extra hands-on controls, hints) */
  explore: boolean;
}

export interface SlideDef {
  id: string;
  /** index into SECTIONS */
  section: number;
  title: string;
  /** number of build steps (1 = static slide) */
  steps: number;
  /** speaker notes, shown in presenter view */
  notes: string;
  render: (p: SlideProps) => ReactNode;
}

export interface Section {
  numeral: string;
  name: string;
  minutes: number;
}

/** Talk structure. Minutes are the time budget per section (see Script v1). */
export const SECTIONS: Section[] = [
  { numeral: '', name: 'Prologue', minutes: 2 },
  { numeral: 'I', name: 'What is HPC?', minutes: 4 },
  { numeral: 'II', name: 'The Free Lunch & the Fire', minutes: 6 },
  { numeral: 'III', name: 'The First GPU', minutes: 6 },
  { numeral: 'IV', name: 'Getting It Right', minutes: 5 },
  { numeral: 'V', name: 'The World It Made', minutes: 5 },
  { numeral: 'VI', name: 'What Comes Next', minutes: 3 },
  { numeral: '', name: 'Symposium', minutes: 30 },
];

/** Stage design size. Everything is laid out at this size and scaled to fit. */
export const STAGE_W = 1920;
export const STAGE_H = 1080;
