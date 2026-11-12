import type { SlideDef } from '../deck/types';
import { SectionCard } from './SectionCard';
import { TriangleFactory } from './s3-TriangleFactory';
import { Water } from './s3-Water';
import { GeForce3, Intro1999, Marketing, Padlocks, Scientist, Smuggling } from './s3-Scenes';
import './s3.css';

/* Section III. See Script v1.md for the beats. Slides run left → right in array order. */
export const s3Slides: SlideDef[] = [
  {
    id: 's3-card',
    section: 3,
    title: 'III · The First GPU',
    steps: 1,
    notes: 'GeForce 256 (1999): marketing invents "the GPU". It sounds like a processor. It wasn\'t.\nTriangle Factory: transform → light → rasterise → texture. Padlocks.\nGeForce 3 (2001): shaders, tiny programs on every pixel. Xbox.\nScientists smuggle physics in as pixels.',
    render: (p) => <SectionCard section={3} focus="30% 30%" zoom={320} thesis="A factory built to make one thing: pictures. Then scientists started smuggling." active={p.active} />,
  },
  {
    id: 's3-1999',
    section: 3,
    title: '1999: video games',
    steps: 2,
    notes: 'Meanwhile, in a completely different universe…\nStep 2: …there was a company making chips for video games.',
    render: (p) => <Intro1999 {...p} />,
  },
  {
    id: 's3-marketing',
    section: 3,
    title: 'The marketing trick',
    steps: 4,
    notes:
      'NVIDIA, 1999: the GeForce 256. The shelves were full of "3D graphics cards". Everyone had one (from The NVIDIA Way).\n' +
      'Step 2: the seal. They didn\'t call it a better graphics card. They invented a category: THE GPU.\n' +
      'Step 3: say it out loud. GPU. Sounds like CPU. Sounds as important as the main chip. They even wrote the definition so only their chip qualified.\n' +
      'Step 4: but you couldn\'t program it. Brilliant chip, one thing, same way, every time.',
    render: (p) => <Marketing {...p} />,
  },
  {
    id: 's3-factory',
    section: 3,
    title: 'The Triangle Factory',
    steps: 6,
    notes:
      'A game is triangles. Every frame they run down a factory line.\n' +
      'Step 2 TRANSFORM: move every triangle to where the camera looks. Turn your head, the whole world shifts.\n' +
      'Step 3 LIGHTING: how bright is each triangle.\n' +
      'Step 4 RASTERISE: chop into pixels. Every pixel independent, so: the paint robots!\n' +
      'Step 5 TEXTURE: paint/wallpaper each pixel. 60 times a second.\n' +
      'Step 6: before 1999 the CPU did I & II. NVIDIA put them in the chip: hardware T&L. CPU freed, games got way more detailed.\n' +
      '(Drag the monitor to spin the temple.)',
    render: (p) => <TriangleFactory {...p} />,
  },
  {
    id: 's3-padlocks',
    section: 3,
    title: 'Welded-shut machines',
    steps: 5,
    notes:
      'Step 2: every station hard-wired. Padlocks.\n' +
      'Step 3: the designer: "I want water that ripples / skin that glows."\n' +
      'Step 4: the chip: "No. I do lighting one way."\n' +
      'Step 5: a factory that makes ONE product, the same way, forever. Fixed-function. Called a processor, but you couldn\'t give it a program.\n' +
      '(Click a padlock: it rattles, "welded shut".)',
    render: (p) => <Padlocks {...p} />,
  },
  {
    id: 's3-geforce3',
    section: 3,
    title: 'GeForce 3: shaders',
    steps: 4,
    notes:
      '2001, GeForce 3. Step 2: two padlocks pop off.\n' +
      'Step 3: vertex shader, a tiny program on every corner of every triangle. Waving grass, flags.\n' +
      'Step 4: pixel shader, a tiny program on every single pixel. Water, shiny metal, fire.',
    render: (p) => <GeForce3 {...p} />,
  },
  {
    id: 's3-water',
    section: 3,
    title: 'Flat vs rippling water',
    steps: 3,
    notes:
      'Fixed-function water: flat plastic.\n' +
      'Step 2: pixel shader on, ripples. Click the water to drop stones.\n' +
      'Step 3: fun fact, the original Xbox chip was a cousin of the GeForce 3.\n' +
      'Then: a pixel shader is a small program that runs on millions of pixels at the same time and does maths…',
    render: (p) => <Water {...p} />,
  },
  {
    id: 's3-scientist',
    section: 3,
    title: 'The scientists noticed',
    steps: 4,
    notes:
      'A scientist looks at the factory longingly.\n' +
      'Step 2: "…a program… that runs a million times at once… and does maths…?"\n' +
      'Step 3: more raw maths than our supercomputers, $300, and now programmable.\n' +
      'Step 4: well… sort of. You could only program them to draw pictures.',
    render: (p) => <Scientist {...p} />,
  },
  {
    id: 's3-smuggling',
    section: 3,
    title: 'The smuggling era',
    steps: 5,
    notes:
      '2003–2006: smuggling. Take a physics problem (fluid flow, matrix maths).\n' +
      'Step 2: disguise it as a picture. Numbers become colours, the equation becomes a "shader effect".\n' +
      'Step 3: through the factory…\n' +
      'Step 4: read the colours back as numbers. Ten times faster! Also insane: graphics wizard AND scientist.\n' +
      'Step 5: one wrong move and your simulation turns into a shiny teapot.\n' +
      'Clearly powerful. But it wasn\'t FOR us yet. It wasn\'t really it.',
    render: (p) => <Smuggling {...p} />,
  },
];
