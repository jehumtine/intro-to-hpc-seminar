import type { SlideDef } from '../deck/types';
import { SectionCard } from './SectionCard';
import { Top500 } from './s6-Top500';
import { MemoryWall } from './s6-MemoryWall';
import { Precision } from './s6-Precision';
import { Special } from './s6-Special';
import { Power } from './s6-Power';
import { PaintRace } from './PaintRace';
import './s6.css';

/* Section VI. See Script v1.md for the beats. Slides run left → right in array order. */
export const s6Slides: SlideDef[] = [
  {
    id: 's6-card',
    section: 6,
    title: 'VI · What Comes Next',
    steps: 1,
    notes: 'Twist: #1 (LineShine) has ZERO GPUs.\nMemory wall is the boss now · lower precision · specialisation · power is the real limit.\nClose: the two painters again.',
    render: (p) => <SectionCard section={6} focus="95% 15%" zoom={300} thesis="The memory wall, the power bill, and the question nobody has answered yet." active={p.active} />,
  },
  {
    id: 's6-top500',
    section: 6,
    title: 'TOP500 2026: the twist',
    steps: 3,
    notes:
      'So, the GPU won, right? Well… (rows 2–5 arrive: all GPUs: AMD, AMD, Intel, NVIDIA)\n' +
      'Step 2: RECORD SCRATCH. #1: LineShine, China. 2.2 exaflops. GPUs: ZERO. Thirteen million CPU cores.\n' +
      'Step 3: So maybe the story isn\'t over. Here\'s where I think we\'re going.',
    render: (p) => <Top500 {...p} />,
  },
  {
    id: 's6-memory',
    section: 6,
    title: 'I · The memory wall is the boss',
    steps: 2,
    notes:
      'Remember the chef and the fridge? It\'s back, and it\'s the boss now.\n' +
      'Over the last twenty years compute grew about ×3 every two years; memory speed only about ×1.6. (Gholami et al., "AI and Memory Wall")\n' +
      'Step 2: now it\'s a thousand chefs, all queuing at the same fridge. The fastest chef in the world is useless if the fridge is across the street.',
    render: (p) => <MemoryWall {...p} />,
  },
  {
    id: 's6-precision',
    section: 6,
    title: 'II · Less precision, more speed',
    steps: 3,
    notes:
      'AI doesn\'t need 16 decimal places.\n' +
      'Step 2: drop to 4 bits: 16 shades. Still a masterpiece. New chips do maths with 4-bit numbers. Rough maths, insanely fast.\n' +
      'Step 3: 1 bit. Okay, too far. But "close enough" is good enough for a lot of things.',
    render: (p) => <Precision {...p} />,
  },
  {
    id: 's6-special',
    section: 6,
    title: 'III · Specialisation',
    steps: 3,
    notes:
      'Remember the GeForce 256: the factory that could only make one product?\n' +
      'Step 2: we\'re going back to that, on purpose. Chips built for one job: AI chips, Google\'s TPUs. Multiply, add, multiply, add.\n' +
      'Step 3: history rhymes.',
    render: (p) => <Special {...p} />,
  },
  {
    id: 's6-power',
    section: 6,
    title: 'IV · Power is the real limit',
    steps: 3,
    notes:
      'Power is the real limit now. Not transistors. Not clever design. Electricity.\n' +
      '10,000 GPUs ≈ 14 MW (rule of thumb ~1.4 kW per GPU incl. cooling).\n' +
      'Step 2: 100,000 GPUs: today\'s biggest AI clusters ≈ 140 MW.\n' +
      'Step 3: a million GPUs ≈ 1.4 GW, more than a whole power station. The next supercomputer will be designed around a power plant.',
    render: (p) => <Power {...p} />,
  },
  {
    id: 's6-painters',
    section: 6,
    title: 'The two painters, again',
    steps: 1,
    notes:
      'The two painters from the start, side by side again (both start together).\n' +
      'So: for fifty years we had a free lunch. Chips got faster on their own. Then around 2005, the lunch ended. The chip caught fire.\n' +
      'The second lunch was PARALLELISM. Stop making one painter faster, and use a thousand. And the people who served it were a gaming company, almost by accident.',
    render: (p) => <PaintRace {...p} step={2} heading="Speed · then parallelism" />,
  },
];
