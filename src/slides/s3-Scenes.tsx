import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, PlateCrop, Reveal } from './common';
import { Stations } from './s3-Stations';

/* ======================================================================
   1999: a blocky video-game hero
   ====================================================================== */
const HERO: { d: string; fill: string }[] = [
  { d: '220,70 262,112 252,172 232,122', fill: 'url(#crosshatch-h)' },
  { d: '180,60 220,60 235,95 220,130 180,130 165,95', fill: 'url(#dots-h)' },
  { d: '190,130 210,130 212,150 188,150', fill: 'url(#dots-h)' },
  { d: '150,150 250,150 240,262 160,262', fill: 'url(#lines-h)' },
  { d: '160,262 240,262 252,302 148,302', fill: 'url(#crosshatch-h)' },
  { d: '150,155 125,165 108,242 132,247', fill: 'url(#dots-h)' },
  { d: '108,242 132,247 128,322 106,318', fill: 'url(#dots-h)' },
  { d: '250,155 276,165 302,236 280,247', fill: 'url(#dots-h)' },
  { d: '280,247 302,236 340,198 348,212', fill: 'url(#dots-h)' },
  { d: '336,196 372,186 376,198 344,212', fill: 'var(--ink)' },
  { d: '155,302 198,302 190,412 160,412', fill: 'url(#dots-h)' },
  { d: '160,412 190,412 185,522 162,522', fill: 'url(#hatch-h)' },
  { d: '155,522 190,522 196,548 148,548', fill: 'var(--ink)' },
  { d: '202,302 246,302 243,412 212,412', fill: 'url(#dots-h)' },
  { d: '212,412 243,412 239,522 215,522', fill: 'url(#hatch-h)' },
  { d: '210,522 246,522 258,548 207,548', fill: 'var(--ink)' },
];

export function Intro1999({ step }: SlideProps) {
  return (
    <div className="slide intro99">
      <div className="intro99-hero">
        <motion.svg viewBox="80 30 320 540" width="420" height="700" initial={{ rotate: -2 }} animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <HatchDefs id="-h" />
          {HERO.map((p, i) => (
            <polygon key={i} points={p.d} fill={p.fill} stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
          ))}
        </motion.svg>
        <div className="caption">fig. 1: a video-game hero, c. 1999. About 500 triangles. Cutting edge.</div>
      </div>
      <div className="intro99-text">
        <div className="intro99-year">MCMXCIX</div>
        <p className="lede">Meanwhile, in a completely different universe…</p>
        <Reveal show={step >= 1}>
          <p className="intro99-punch">
            …there was a company
            <br />
            making chips for
            <br />
            <span>video games.</span>
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/* ======================================================================
   The marketing trick: a shelf of graphics cards, one gets a gold seal
   ====================================================================== */
const BOXES = ['TurboVision 3D', 'Velox 3D', 'GeForce 256', 'PixelMaster Pro', 'Hyperion 3D'];

function Seal() {
  const pts = Array.from({ length: 48 }, (_, k) => {
    const r = k % 2 ? 96 : 110;
    const a = (k / 48) * Math.PI * 2;
    return `${110 + Math.cos(a) * r},${110 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <polygon points={pts} fill="var(--ink)" />
      <circle cx="110" cy="110" r="82" fill="none" stroke="var(--paper)" strokeWidth="2" />
      <circle cx="110" cy="110" r="76" fill="none" stroke="var(--paper)" strokeWidth="1" />
      <text x="110" y="82" textAnchor="middle" fill="var(--paper)" fontFamily="var(--display)" fontSize="15" letterSpacing="2">THE WORLD'S</text>
      <text x="110" y="113" textAnchor="middle" fill="var(--paper)" fontFamily="var(--display)" fontSize="30" fontWeight="600">FIRST</text>
      <text x="110" y="152" textAnchor="middle" fill="var(--paper)" fontFamily="var(--display)" fontSize="38" fontWeight="600" letterSpacing="4">GPU</text>
    </svg>
  );
}

export function Marketing({ step }: SlideProps) {
  return (
    <div className="slide marketing">
      <div className="slide-kicker">1999 · the marketing trick</div>
      <div className="shelf">
        {BOXES.map((b, i) => (
          <div key={b} className={`gbox ${i === 2 ? 'hero' : ''}`}>
            <div className="gbox-brand">{b}</div>
            <svg className="gbox-art" viewBox="0 0 100 60" width="150" height="90">
              <polygon points="10,50 50,8 90,50" fill="none" stroke="var(--ink)" strokeWidth="2" />
              <polygon points="30,50 50,28 70,50" fill="var(--ink)" opacity={0.15 + i * 0.12} />
            </svg>
            <div className="gbox-label">3D Graphics Accelerator</div>
            {i === 2 && (
              <motion.div
                className="gbox-seal"
                initial={false}
                animate={step >= 1 ? { scale: 1, opacity: 1, rotate: -12 } : { scale: 3, opacity: 0, rotate: -40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <Seal />
              </motion.div>
            )}
          </div>
        ))}
        <div className="shelf-plank" />
      </div>
      <div className="marketing-text">
        <Reveal show={step >= 2} className="gpu-cpu">
          <span className="g">G·P·U</span>
          <span className="sounds">sounds like</span>
          <span className="g">C·P·U</span>
        </Reveal>
        <Reveal show={step >= 3} className="marketing-punch">
          It sounds like a processor. <b>It wasn't.</b>
        </Reveal>
      </div>
    </div>
  );
}

/* ======================================================================
   The padlocks: every station welded shut
   ====================================================================== */
export function Padlocks({ step, explore }: SlideProps) {
  const locked = step >= 1;
  return (
    <div className="slide padlocks">
      <div className="slide-kicker">The catch</div>
      <h2 className="slide-h">A factory with welded-shut machines</h2>
      <Stations locks={[locked, locked, locked, locked]} className="padlock-stations" />
      <div className="dialogue">
        <Reveal show={step >= 2} className="speech dev">
          <div className="who">The game designer</div>
          <p>"I want water that ripples. I want skin that glows a little when light passes through it."</p>
        </Reveal>
        <Reveal show={step >= 3} className="speech chip">
          <div className="who">The chip</div>
          <p>"No. I do lighting one way. Take it or leave it."</p>
        </Reveal>
      </div>
      <Reveal show={step >= 4} className="padlock-punch">
        <b>Fixed-function:</b> it was called a processor, but you couldn't give it a program.
      </Reveal>
      {explore && locked && <div className="hint padlock-hint">try clicking a padlock</div>}
    </div>
  );
}

/* ======================================================================
   GeForce 3 (2001): two padlocks pop off, shaders appear
   ====================================================================== */
function Flag() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const f = (now: number) => {
      setT(now / 1000);
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, []);
  const pts = (row: number) =>
    Array.from({ length: 13 }, (_, k) => {
      const x = 20 + k * 14;
      const y = 14 + row * 14 + Math.sin(k * 0.6 - t * 4) * k * 0.9;
      return `${x},${y}`;
    }).join(' ');
  return (
    <svg width="230" height="110" viewBox="0 0 230 110">
      <line x1="18" y1="6" x2="18" y2="108" stroke="var(--ink)" strokeWidth="3" />
      {Array.from({ length: 6 }, (_, r) => (
        <polyline key={r} points={pts(r)} fill="none" stroke="var(--ink)" strokeWidth="1.6" />
      ))}
    </svg>
  );
}

function Shine() {
  return (
    <svg width="230" height="110" viewBox="0 0 230 110">
      <HatchDefs id="-sh" />
      <circle cx="115" cy="55" r="48" fill="url(#lines-sh)" stroke="var(--ink)" strokeWidth="2" />
      <ellipse cx="96" cy="38" rx="16" ry="10" fill="var(--paper)" transform="rotate(-30 96 38)" />
      <path d="M40 104 Q60 80 52 60 Q72 74 70 104 M160 104 Q170 76 186 66 Q184 86 196 104" fill="none" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

export function GeForce3({ step }: SlideProps) {
  const open = step >= 1;
  return (
    <div className="slide gf3">
      <div className="slide-kicker">MMI · GeForce 3</div>
      <h2 className="slide-h">You can program it now. A little.</h2>
      <Stations
        locks={[!open, true, true, !open]}
        className="gf3-stations"
        screens={[
          step >= 2 ? <pre key="v">{`pos.y += sin(pos.x + time);`}</pre> : undefined,
          undefined,
          undefined,
          step >= 3 ? <pre key="p">{`colour = shiny(p);`}</pre> : undefined,
        ]}
      />
      <div className="gf3-cards">
        <Reveal show={step >= 2} className="card gf3-card">
          <Flag />
          <div>
            <div className="gf3-name">Vertex shader</div>
            <p>A little program that runs on <b>every corner of every triangle</b>. Waving grass, flags in the wind.</p>
          </div>
        </Reveal>
        <Reveal show={step >= 3} className="card gf3-card">
          <Shine />
          <div>
            <div className="gf3-name">Pixel shader</div>
            <p>A little program that runs on <b>every single pixel</b>. Water, shiny metal, fire.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ======================================================================
   The scientist notices
   ====================================================================== */
export function Scientist({ step }: SlideProps) {
  return (
    <div className="slide scientist">
      <div className="sci-figure">
        <PlateCrop focus="26% 14%" zoom={420} className="sci-plate" />
        <div className="caption">A scientist, 2001 (artist's impression)</div>
      </div>
      <div className="sci-thoughts">
        <Reveal show={step >= 1} className="bubble">
          <p>
            "…a <em>program</em>…
            <br />
            that runs a <em>million times at once</em>…
            <br />
            and does <em>maths</em>…?"
          </p>
          <span className="bubble-dot a" />
          <span className="bubble-dot b" />
          <span className="bubble-dot c" />
        </Reveal>
        <Reveal show={step >= 2} className="sci-facts">
          <div>
            <span className="num">More</span> raw maths than our supercomputers
          </div>
          <div>
            <span className="num">$300</span> at the shop
          </div>
          <div>
            <span className="num">Now</span> programmable
          </div>
        </Reveal>
        <Reveal show={step >= 3} className="sci-punch">
          Well… sort of. You could only program them to <b>draw pictures.</b>
        </Reveal>
      </div>
    </div>
  );
}

/* ======================================================================
   The smuggling era (2003–2006): physics in a pixel costume
   ====================================================================== */
function Teapot() {
  return (
    <svg width="360" height="280" viewBox="-20 0 340 230">
      <HatchDefs id="-tp" />
      <path d="M62 128 C20 118 12 70 -4 52 L10 46 C34 74 42 102 72 106" fill="url(#lines-tp)" stroke="var(--ink)" strokeWidth="3" />
      <path d="M238 98 C300 86 302 182 234 166" fill="none" stroke="var(--ink)" strokeWidth="12" />
      <path d="M238 98 C300 86 302 182 234 166" fill="none" stroke="var(--paper)" strokeWidth="5" />
      <ellipse cx="150" cy="132" rx="96" ry="70" fill="url(#lines-tp)" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="112" cy="104" rx="26" ry="14" fill="var(--paper)" transform="rotate(-25 112 104)" />
      <path d="M92 70 Q150 30 208 70 Z" fill="url(#crosshatch-tp)" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="150" cy="40" r="11" fill="var(--ink)" />
      <rect x="96" y="196" width="108" height="12" fill="var(--ink)" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${120 + k * 30} ${-2 + (k % 2) * 6} l6 -10 l6 10 l-6 10 z`} fill="var(--ink)" />
      ))}
    </svg>
  );
}

export function Smuggling({ step, explore }: SlideProps) {
  const [oops, setOops] = useState<boolean | null>(null);
  useEffect(() => setOops(null), [step]);
  const teapot = oops ?? step >= 4;
  // where the equation is: outside → in disguise → sneaking through → gone (out the other side)
  const x = step <= 1 ? 0 : step === 2 ? 700 : 1260;
  return (
    <div className="slide smuggle">
      <div className="slide-kicker">2003 – 2006 · the smuggling era</div>
      <h2 className="slide-h">Physics, disguised as a picture</h2>
      <div className="smuggle-scene">
        <div className="factory-box">
          <div className="factory-sign">Graphics only</div>
          <div className="factory-door" />
          <div className="factory-mini">
            {['I', 'II', 'III', 'IV'].map((n, i) => (
              <motion.div key={n} className="mini-st" animate={step === 2 ? { y: [0, -6, 0] } : { y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.25, repeat: step === 2 ? Infinity : 0, repeatDelay: 1 }}>
                {n}
              </motion.div>
            ))}
          </div>
          <div className="factory-label">the graphics factory</div>
        </div>

        <motion.div className="eqn" initial={false} animate={{ x, opacity: step >= 3 ? 0 : 1, scale: step === 2 ? 0.85 : 1 }} transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}>
          <motion.div className="eqn-hat" initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -60 }} transition={{ duration: 0.6 }}>
            PIXEL
          </motion.div>
          <div className="eqn-card">
            <span>∂u/∂t = α ∇²u</span>
            <motion.svg className="eqn-disguise" viewBox="0 0 200 70" width="200" height="70" initial={false} animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 1.6 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <circle cx="66" cy="20" r="17" fill="none" stroke="var(--ink)" strokeWidth="4" />
              <circle cx="134" cy="20" r="17" fill="none" stroke="var(--ink)" strokeWidth="4" />
              <path d="M83 20 Q100 10 117 20" fill="none" stroke="var(--ink)" strokeWidth="4" />
              <path d="M50 58 Q75 36 100 52 Q125 36 150 58 Q125 48 100 60 Q75 48 50 58 Z" fill="var(--ink)" />
            </motion.svg>
          </div>
          <Reveal show={step === 1} className="eqn-says">
            "I am definitely a pixel."
          </Reveal>
        </motion.div>

        <div className="smuggle-out">
          {!teapot && (
            <Reveal show={step >= 3} className="out-grid">
              {Array.from({ length: 24 }, (_, i) => {
                const v = (Math.sin(i * 1.7) + 1) / 2;
                return (
                  <div key={i} className="out-cell" style={{ background: `rgba(0, 0, 0,${0.1 + v * 0.75})` }}>
                    <span>{v.toFixed(2)}</span>
                  </div>
                );
              })}
            </Reveal>
          )}
          {teapot && (
            <motion.div initial={{ scale: 0.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
              <Teapot />
            </motion.div>
          )}
        </div>
      </div>
      <div className="smuggle-caption">
        {step <= 1 && <Reveal show>Take a physics problem. Turn the numbers into colours. Make the GPU "draw" it.</Reveal>}
        {step === 2 && <Reveal show>Through the factory it goes, pretending to be a shader effect…</Reveal>}
        {step >= 3 && !teapot && (
          <Reveal show>
            …then read the colours back as numbers. <b>Ten times faster!</b> Also completely insane.
          </Reveal>
        )}
        {teapot && (
          <Reveal show>
            One wrong move and your fluid simulation is <b>a shiny teapot.</b>
          </Reveal>
        )}
      </div>
      {(explore || step >= 3) && step >= 3 && (
        <div className="smuggle-ctl" data-interactive>
          <button className={`btn ${teapot ? 'on' : ''}`} onClick={() => setOops(!teapot)}>
            {teapot ? 'Undo' : 'Make one wrong move'}
          </button>
        </div>
      )}
    </div>
  );
}
