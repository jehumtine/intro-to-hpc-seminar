import type { SlideDef } from '../deck/types';
import { TitleSlide } from './TitleSlide';
import { PaintRace } from './PaintRace';
import { Closing } from './Closing';
import { s1Slides } from './s1';
import { s2Slides } from './s2';
import { s3Slides } from './s3';
import { s4Slides } from './s4';
import { s5Slides } from './s5';
import { s6Slides } from './s6';

/*
 * The talk, left to right. Each section lives in its own file (s1.tsx … s6.tsx).
 * Notes are condensed from "Script v1.md" in the Obsidian vault (Projects/Seminars);
 * the script is the source of truth.
 */
export const slides: SlideDef[] = [
  {
    id: 'title',
    section: 0,
    title: 'Title',
    steps: 1,
    notes: 'On screen while people arrive.\nWhen ready: no intro. Just click into the paint race.',
    render: () => <TitleSlide />,
  },
  {
    id: 'paint-race',
    section: 0,
    title: 'The Paint Race',
    steps: 3,
    notes:
      'Step 1: start the lone painter BEFORE saying anything. "One brush, one stroke at a time. It\'s fast. Watch."\n' +
      'Let it run. "…we\'ll come back to him."\n' +
      'Step 2: the 1,024 strike. SPLAT. Pause, let them react.\n' +
      '"That\'s the whole talk: how we spent fifty years making the first painter faster, why he caught fire, and how a company that made toys for gamers built the second, and accidentally started the AI revolution."',
    render: (p) => <PaintRace {...p} />,
  },
  ...s1Slides,
  ...s2Slides,
  ...s3Slides,
  ...s4Slides,
  ...s5Slides,
  ...s6Slides,
  {
    id: 'closing',
    section: 7,
    title: 'The Third Lunch → Discussion',
    steps: 2,
    notes: '"The first free lunch was speed. The second was parallelism. What\'s the third?"\nStep 2: discussion prompts stay up for the whole 30 min.',
    render: (p) => <Closing {...p} />,
  },
];
