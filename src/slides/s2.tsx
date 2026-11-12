import type { SlideDef } from '../deck/types';
import { SectionCard } from './SectionCard';
import { FreeLunch, PowerDensity, TheGap } from './s2-Charts';
import { AndyBill, FreeLunchOver, MemoryWall, MooreCounter, MoreChefs, Overclock, ThreeWalls } from './s2-Scenes';

/* Section II. See Script v1.md for the beats. Slides run left → right in array order. */
export const s2Slides: SlideDef[] = [
  {
    id: 's2-card',
    section: 2,
    title: 'II · The Free Lunch & the Fire',
    steps: 1,
    notes: 'Moore + Dennard = the free lunch. "Andy giveth, and Bill taketh away."\nGelsinger 2001: nuclear reactor → rocket nozzle → surface of the sun.\nOverclock slider → egg. Clock line hits the wall in 2005; transistor line keeps climbing.\n"The Free Lunch Is Over." Memory wall (chef & fridge). More cores.',
    render: (p) => <SectionCard section={2} focus="52% 22%" zoom={330} thesis="For forty years chips got faster on their own. Then, around 2005, they caught fire." active={p.active} />,
  },
  {
    id: 's2-moore',
    section: 2,
    title: "Moore's Law: the transistor counter",
    steps: 3,
    notes:
      'For about 40 years computing had the best deal in history: Moore\'s Law. Every couple of years, the transistors on a chip doubled.\n' +
      'Click: the counter runs 1971 (2,300) → today (tens of billions).\n' +
      'Click: Dennard scaling, the quieter law that made it magic. Shrink transistors: smaller, faster AND cooler. For free.',
    render: (p) => <MooreCounter {...p} />,
  },
  {
    id: 's2-lunch',
    section: 2,
    title: 'The free lunch',
    steps: 2,
    notes: 'Clock speed rockets: 1 MHz… 33 MHz… 500 MHz… 1 GHz… 3 GHz.\nClick: "If you were a programmer in the 1990s you didn\'t have to do anything. Write slow code, wait 18 months, a new chip makes it twice as fast." Programmers called it THE FREE LUNCH.',
    render: (p) => <FreeLunch {...p} />,
  },
  {
    id: 's2-andy',
    section: 2,
    title: 'Andy giveth, Bill taketh away',
    steps: 2,
    notes: 'There was even a joke about it. Andy Grove ran Intel; Bill Gates ran Microsoft.\nClick: the loop. Every time Intel gave us a faster chip, Microsoft shipped a heavier Windows that ate all the extra speed. The computer feels exactly the same.\nAnd nobody minded: software could afford to be lazy, the hardware always bailed it out. That\'s how free the lunch was.',
    render: (p) => <AndyBill {...p} />,
  },
  {
    id: 's2-gelsinger',
    section: 2,
    title: 'Gelsinger 2001: towards the sun',
    steps: 4,
    notes: 'In 2001, Intel\'s CTO Pat Gelsinger showed this chart: chip power density, climbing. Hot plate already.\nClicks: by 2005 a nuclear reactor… by 2010 a rocket nozzle… by 2015 the surface of the sun.',
    render: (p) => <PowerDensity {...p} />,
  },
  {
    id: 's2-overclock',
    section: 2,
    title: 'Overclock it',
    steps: 4,
    notes:
      'Here\'s why. Power ≈ voltage squared × speed. For years we turned the voltage down to cancel the speed going up. Around 2005 we couldn\'t lower the voltage any more without transistors leaking like a broken tap.\n' +
      'Clicks push the clock: 1 → 3.5 → 5 GHz (smoke) → 6.5 GHz (an egg fries; drag past ~7 GHz and it catches fire). People literally fried eggs on Pentium 4s.\n(Slider is live.)',
    render: (p) => <Overclock {...p} />,
  },
  {
    id: 's2-gap',
    section: 2,
    title: 'The wall: clock vs transistors',
    steps: 3,
    notes:
      'Clock speed: around 2005 the line slams into a wall and goes FLAT.\n' +
      'Click: transistors keep climbing. The two lines split apart. Let that image sit.\n' +
      'Click: point at the gap. "The most important picture in computing in the last twenty years. We still get more transistors every year. We just can\'t make them go faster."',
    render: (p) => <TheGap {...p} />,
  },
  {
    id: 's2-over',
    section: 2,
    title: '"The Free Lunch Is Over."',
    steps: 2,
    notes: 'In 2004, Intel quietly cancelled its next big chip, then its 4 GHz chip. A year later, Herb Sutter wrote an article whose title said it all.\nClick: "The Free Lunch Is Over."',
    render: (p) => <FreeLunchOver {...p} />,
  },
  {
    id: 's2-chef',
    section: 2,
    title: 'The memory wall: chef & fridge',
    steps: 2,
    notes:
      'And speed wasn\'t even the only problem. The MEMORY WALL: the processor got so fast it spent most of its life waiting for data.\n' +
      'Click: the world\'s fastest chef, but every ingredient is in a fridge across the street. Chops in 1 second, each walk takes 3 minutes.\n' +
      'Optional: "make the chef 2× faster": dinner barely changes.',
    render: (p) => <MemoryWall {...p} />,
  },
  {
    id: 's2-walls',
    section: 2,
    title: 'Three walls = brick wall',
    steps: 4,
    notes: 'POWER: the chip catches fire.\nMEMORY: the fridge is across the street.\nILP: we\'d already used every trick to make one chef do several things at once: juggling, guessing what\'s needed next, prepping ahead. No tricks left.\nClick: = BRICK WALL.',
    render: (p) => <ThreeWalls {...p} />,
  },
  {
    id: 's2-cores',
    section: 2,
    title: 'Hire more chefs: 1 → 64 cores',
    steps: 4,
    notes: 'So what do you do? If you can\'t make one chef faster… you hire more chefs.\nClicks: 1 → 4 → 64 cores. That\'s why your laptop has 8 or 16 cores. The industry went sideways instead of up.\nClick: "But a CPU is still a few very smart, very expensive chefs. What if, instead, you hired… a stadium full of cheap ones?"',
    render: (p) => <MoreChefs {...p} />,
  },
];
