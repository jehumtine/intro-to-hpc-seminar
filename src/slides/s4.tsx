import type { SlideDef } from '../deck/types';
import { SectionCard } from './SectionCard';
import { Bet, Dissolve, Reveal8800, Tianhe } from './s4-Scenes';
import { Cuda } from './s4-Cuda';
import { Stadium } from './s4-Stadium';
import './s4.css';

/* Section IV. See Script v1.md for the beats. Slides run left → right in array order. */
export const s4Slides: SlideDef[] = [
  {
    id: 's4-card',
    section: 4,
    title: 'IV · Getting It Right',
    steps: 1,
    notes: 'G80 (2006): the stations melt into 128 identical workers. CUDA (2007): write what ONE worker does.\nGenius vs Stadium, warps of 32, never idle.\nThe bet: CUDA in every card, stock crashes. 2010: Tianhe-1A, #1 on GPUs.',
    render: (p) => <SectionCard section={4} focus="78% 35%" zoom={300} thesis="Not a factory, but an army: thousands of identical workers who can do anything." active={p.active} />,
  },
  {
    id: 's4-reveal',
    section: 4,
    title: 'GeForce 8800 GTX',
    steps: 3,
    notes:
      'MMVI (2006). Step 2: curtain up. November 2006: the GeForce 8800, built on G80, aka "Tesla".\n' +
      'Step 3: on the outside, just another gaming card. On the inside, a completely different idea.',
    render: (p) => <Reveal8800 {...p} />,
  },
  {
    id: 's4-dissolve',
    section: 4,
    title: 'The factory becomes an army',
    steps: 5,
    notes:
      'The old assembly line with special stations…\n' +
      'Step 2: it dissolves into 128 identical, general-purpose workers. Any worker, any job.\n' +
      'Steps 3–5: drawing a triangle? Sure. Lighting a pixel? Sure. Simulating a galaxy? …Also sure.\n' +
      '(Buttons switch the job by hand.)',
    render: (p) => <Dissolve {...p} />,
  },
  {
    id: 's4-cuda',
    section: 4,
    title: 'CUDA: one worker, a million times',
    steps: 4,
    notes:
      '2007: the most important part. CUDA. Normal code, basically C, running on the GPU.\n' +
      'Step 2: the CPU way, one worker walks down the list.\n' +
      'Step 3: the CUDA way. You write what ONE worker does; the GPU runs it on thousands at once.\n' +
      'Step 4: no disguises, no pretending your equation is a teapot.',
    render: (p) => <Cuda {...p} />,
  },
  {
    id: 's4-stadium',
    section: 4,
    title: 'Genius vs Stadium',
    steps: 4,
    notes:
      'A CPU is one genius with a huge desk (cache): keeps files close, brilliant at tricky sequences. Note how often it sits waiting.\n' +
      'Step 2: a GPU is a stadium of students in squads of 32, called WARPS. A squad does the same instruction together, like a marching band.\n' +
      'Step 3: squad 3 goes to the fridge for data… and the next squad just starts. Remember the chef and the fridge across the street? CPU answer: big desk. GPU answer: don\'t wait, switch squads.\n' +
      'Step 4: speed doesn\'t come from being smart. It comes from never being idle.\n' +
      '(Sliders: memory trip length & number of squads. Fewer squads → GPU goes idle too.)',
    render: (p) => <Stadium {...p} />,
  },
  {
    id: 's4-bet',
    section: 4,
    title: 'The bet',
    steps: 4,
    notes:
      'People forget this. NVIDIA put CUDA into EVERY gaming card, even though gamers didn\'t need it and it made every chip bigger and more expensive.\n' +
      'Step 2: the stock chart. Down about 80% from late 2007 to late 2008.\n' +
      'Step 3: Wall Street thought they were mad.\n' +
      'Step 4: they were building a highway before anyone had a car.',
    render: (p) => <Bet {...p} />,
  },
  {
    id: 's4-tianhe',
    section: 4,
    title: 'Tianhe-1A, 2010',
    steps: 4,
    notes:
      'November 2010, TOP500.\n' +
      'Step 2: #1, Tianhe-1A, powered by 7,168 NVIDIA GPUs.\n' +
      'Step 3: the gaming card had become a scientific instrument.\n' +
      'Step 4: but the real car hadn\'t arrived yet. → Section V.',
    render: (p) => <Tianhe {...p} />,
  },
];
