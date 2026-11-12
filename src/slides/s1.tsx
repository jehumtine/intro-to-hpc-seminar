import type { SlideDef } from '../deck/types';
import { SectionCard } from './SectionCard';
import { AsciWhite, FlopsLadder, PizzaParty, Problems, ZoomOut, ZOOM_STEPS } from './s1-Scenes';

/* Section I. See Script v1.md for the beats. Slides run left → right in array order. */
export const s1Slides: SlideDef[] = [
  {
    id: 's1-card',
    section: 1,
    title: 'I · What is HPC?',
    steps: 1,
    notes: 'Some problems are too big for one computer, so you get thousands to work on the same problem at once.\nWeather · car crashes · proteins.\nFLOPS ladder → ASCI White vs one graphics card → the Pizza Party (Amdahl: the oven).',
    render: (p) => <SectionCard section={1} focus="2% 60%" zoom={300} thesis="Some problems are too big for one machine, so a thousand machines push the same stone." active={p.active} />,
  },
  {
    id: 's1-zoom',
    section: 1,
    title: 'Zoom out: laptop → supercomputer',
    steps: ZOOM_STEPS,
    notes:
      'Each click zooms the camera out: laptop → server → rack → row of racks → a building the size of two football pitches.\n' +
      'Last click: "High performance computing is just this: some problems are too big for one computer, so you get thousands of computers to work on the same problem at the same time."',
    render: (p) => <ZoomOut {...p} />,
  },
  {
    id: 's1-problems',
    section: 1,
    title: 'What kind of problems?',
    steps: 3,
    notes: "Weather: chop the entire planet's atmosphere into little boxes and simulate every one.\nCar crashes: crash a car ten thousand times without buying ten thousand cars.\nProteins & drugs: fold a molecule to see if it cures something.",
    render: (p) => <Problems {...p} />,
  },
  {
    id: 's1-flops',
    section: 1,
    title: 'The FLOPS ladder',
    steps: 4,
    notes:
      'FLOP = one bit of arithmetic, like 3.7 × 2.1.\n' +
      'You: ~1 per second (on a good day) → your laptop: trillions → the fastest supercomputer: 2 quintillion.\n' +
      'Last click: 8 billion humans, one calculation per second each, nonstop, would take about 8 years to do what it does in ONE second.\n' +
      'Optional: pick a volunteer for "Measure your own FLOPS" (card on the right).',
    render: (p) => <FlopsLadder {...p} />,
  },
  {
    id: 's1-asci',
    section: 1,
    title: 'ASCI White vs one graphics card',
    steps: 2,
    notes: 'Year 2000: ASCI White, the fastest computer on Earth. Filled a room, $110 million, weighed as much as 17 elephants.\nClick: today, ONE graphics card you can hold in your hand is faster than it.',
    render: (p) => <AsciWhite {...p} />,
  },
  {
    id: 's1-pizza',
    section: 1,
    title: 'The Pizza Party (Amdahl)',
    steps: 4,
    notes:
      '"Why can\'t we just add more computers?" Making pizza: dough + toppings can be split between friends. But there\'s ONE oven, 10 minutes.\n' +
      'Clicks: 1 → 10 → 100 → 1,000 friends. Time drops fast, then flattens against the oven line. Friends get bored.\n' +
      "Last click: Amdahl's Law: the part you can't split decides your speed limit. Remember the oven. It comes back.\n" +
      '(Slider is live: drag it if you want.)',
    render: (p) => <PizzaParty {...p} />,
  },
];
