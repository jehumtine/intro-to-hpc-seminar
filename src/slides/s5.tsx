import type { SlideDef } from '../deck/types';
import { SectionCard } from './SectionCard';
import { Bedroom } from './s5-Bedroom';
import { Leaderboard } from './s5-Leaderboard';
import { Timeline, TIMELINE_STEPS } from './s5-Timeline';
import { Chain, CHAIN_STEPS } from './s5-Chain';
import { Bill } from './s5-Bill';
import './s5.css';

/* Section V. See Script v1.md for the beats. Slides run left → right in array order. */
export const s5Slides: SlideDef[] = [
  {
    id: 's5-card',
    section: 5,
    title: 'V · The World It Made',
    steps: 1,
    notes: '2012: Alex Krizhevsky, two gaming cards, his parents\' house. 26% → 15%.\nTimeline: AlphaGo · Transformer · AlphaFold · ChatGPT · Nobels · $5T.\n"Gamers funded the AI revolution."\nThe bill: data centres ≈ Japan by 2030; Three Mile Island.',
    render: (p) => <SectionCard section={5} focus="62% 70%" zoom={280} thesis="Gamers wanted better explosions. They accidentally funded the AI revolution." active={p.active} />,
  },
  {
    id: 's5-bedroom',
    section: 5,
    title: 'A bedroom, two gaming cards',
    steps: 3,
    notes:
      '2012. Grad student in Toronto, Alex Krizhevsky, with Ilya Sutskever and their advisor Geoffrey Hinton. They want to teach a computer to recognise pictures.\n' +
      'Everyone in AI thinks neural networks are a dead end: too slow to train.\n' +
      'Step 2: so Alex buys TWO GAMING CARDS, puts them in a computer at his parents\' house, writes CUDA…\n' +
      'Step 3: …and trains for about a week.',
    render: (p) => <Bedroom {...p} />,
  },
  {
    id: 's5-imagenet',
    section: 5,
    title: 'ImageNet 2012: off a cliff',
    steps: 3,
    notes:
      'The biggest image-recognition competition in the world. Everyone bunched up around one-in-four wrong (~26%).\n' +
      'Step 2: AlexNet: 15.3%. They don\'t just win, they DEMOLISH it. Let the bar fall. Pause.\n' +
      'Step 3: The AI world turned around overnight. Every researcher on the planet went out and bought NVIDIA GPUs.',
    render: (p) => <Leaderboard {...p} />,
  },
  {
    id: 's5-timeline',
    section: 5,
    title: 'Then everything happened at once',
    steps: TIMELINE_STEPS,
    notes:
      'Fast. One card per click, keep the rhythm:\n' +
      '2012 AlexNet · 2016 AlphaGo beats the world champion at Go · 2017 the Transformer, the "T" in ChatGPT · 2020 AlphaFold solves protein folding, a 50-year-old biology problem · 2022 ChatGPT, 100 million users in two months · 2024 Nobel Prizes in BOTH Physics and Chemistry go to AI work · 2025 NVIDIA becomes the first $5 trillion company in history.',
    render: (p) => <Timeline {...p} />,
  },
  {
    id: 's5-gamers',
    section: 5,
    title: 'Gamers funded the AI revolution',
    steps: CHAIN_STEPS,
    notes:
      'Slow down here. Think about that chain.\n' +
      'Gamers wanted better explosions in Call of Duty → that paid for NVIDIA to build massively parallel chips → scientists hijacked them → a grad student used two of them to train a neural network → now those same chips are behind ChatGPT, drug discovery, self-driving cars, weather forecasting…\n' +
      'Big line: "Gamers funded the AI revolution."\n' +
      'Last click: a company that sold graphics cards to teenagers is now worth more than the entire economy of almost every country on Earth.',
    render: (p) => <Chain {...p} />,
  },
  {
    id: 's5-bill',
    section: 5,
    title: 'The bill',
    steps: 4,
    notes:
      'But there\'s a bill.\n' +
      'Step 2: the needle swings. Data centres are on track to use about as much electricity as ALL OF JAPAN by 2030.\n' +
      'Step 3: tech companies are literally buying nuclear power. Microsoft signed a deal to restart Three Mile Island.\n' +
      'Step 4: remember the fire from Section II? We didn\'t escape it. We just moved it from the chip to the whole building.',
    render: (p) => <Bill {...p} />,
  },
];
