import { useEffect, useRef, useState } from 'react';
import { animate, motion, AnimatePresence } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';
import './s2.css';

/* =====================================================================
   II.1  Moore's law: the transistor counter
   ===================================================================== */

const transistorsIn = (year: number) => 2300 * Math.pow(2, (year - 1971) / 2);
const fmtInt = (n: number) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  return Math.round(n).toLocaleString();
};

function ChipGrid({ year }: { year: number }) {
  // the grid on the chip doubles its density as the years pass
  const g = Math.min(6, Math.max(0, Math.floor(((year - 1971) / 50) * 6.99)));
  const d = Math.pow(2, g + 1);
  const S = 380;
  const lines = [];
  for (let i = 1; i < d; i++) {
    const p = (i / d) * S;
    lines.push(<line key={`v${i}`} x1={p} y1="0" x2={p} y2={S} stroke="currentColor" strokeWidth={Math.max(0.6, 3 - g * 0.4)} />);
    lines.push(<line key={`h${i}`} x1="0" y1={p} x2={S} y2={p} stroke="currentColor" strokeWidth={Math.max(0.6, 3 - g * 0.4)} />);
  }
  const pins = Array.from({ length: 10 }, (_, i) => 22 + i * 37);
  return (
    <svg viewBox="-60 -60 500 500" className="chip-grid">
      {pins.map((p) => (
        <g key={p} stroke="currentColor" strokeWidth="6">
          <line x1={p} y1="-50" x2={p} y2="-8" />
          <line x1={p} y1={S + 8} x2={p} y2={S + 50} />
          <line x1="-50" y1={p} x2="-8" y2={p} />
          <line x1={S + 8} y1={p} x2={S + 50} y2={p} />
        </g>
      ))}
      <rect x="0" y="0" width={S} height={S} fill="var(--paper)" stroke="currentColor" strokeWidth="6" />
      {lines}
    </svg>
  );
}

export function MooreCounter({ step, active, explore }: SlideProps) {
  const [year, setYear] = useState(1971);
  const ctl = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    ctl.current?.stop();
    if (!active) return;
    if (step === 0) setYear(1971);
    if (step === 1) ctl.current = animate(year, 2021, { duration: 7, ease: 'easeInOut', onUpdate: setYear });
    if (step >= 2) setYear(2021);
    return () => ctl.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, active]);

  return (
    <Slide kicker="II · The free lunch" title="Moore's Law">
      <div className="moore">
        <ChipGrid year={year} />
        <div className="moore-side">
          <div className="moore-year num">{Math.floor(year)}</div>
          <div className="moore-count num">{fmtInt(transistorsIn(year))}</div>
          <div className="caption moore-cap">transistors on one chip</div>
          <p className="moore-text">Every couple of years, the number of transistors you could fit on a chip <b>doubled</b>.</p>
          <Reveal show={step >= 2} className="dennard card">
            <div className="slide-kicker">…and Dennard scaling made it magic</div>
            <div className="dennard-trio">
              <span>smaller</span>·<span>faster</span>·<span>cooler</span>
            </div>
            <div className="caption">all at the same time, for free</div>
          </Reveal>
          {explore && (
            <div className="control" data-interactive>
              <label>Year</label>
              <input type="range" min={1971} max={2021} step={1} value={Math.floor(year)} onChange={(e) => { ctl.current?.stop(); setYear(+e.target.value); }} />
            </div>
          )}
        </div>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.3  Andy giveth, and Bill taketh away
   ===================================================================== */

const GENERATIONS = [
  { chip: 'Pentium · 60 MHz', os: 'Windows 3.1' },
  { chip: 'Pentium · 133 MHz', os: 'Windows 95' },
  { chip: 'Pentium II · 300 MHz', os: 'Windows 98' },
  { chip: 'Pentium III · 1 GHz', os: 'Windows 2000' },
  { chip: 'Pentium 4 · 3 GHz', os: 'Windows XP' },
  { chip: 'Core 2 · lots', os: 'Windows Vista' },
];

function GiftBox() {
  return (
    <svg viewBox="0 0 160 150" className="andy-icon">
      <HatchDefs id="-gift" />
      <rect x="20" y="58" width="120" height="84" fill="url(#lines-gift)" stroke="currentColor" strokeWidth="3" />
      <rect x="12" y="40" width="136" height="22" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <rect x="72" y="40" width="16" height="102" fill="currentColor" />
      <path d="M80 40 C 50 0, 30 30, 80 40 C 130 30, 110 0, 80 40" fill="none" stroke="currentColor" strokeWidth="3" />
      {/* a chip on the gift tag */}
      <rect x="104" y="80" width="26" height="26" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Fork() {
  return (
    <svg viewBox="0 0 160 150" className="andy-icon">
      <g transform="rotate(-25 80 75)" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M60 10 V50 M73 10 V50 M86 10 V50 M99 10 V50" />
        <path d="M58 48 Q79 70 101 48" />
        <path d="M79 64 V145" strokeWidth="9" />
      </g>
    </svg>
  );
}

function Meter({ label, value, max, solid }: { label: string; value: number; max: number; solid?: boolean }) {
  return (
    <div className="ab-meter">
      <div className="ab-meter-label">{label}</div>
      <div className="ab-meter-track">
        <motion.div className={`ab-meter-fill ${solid ? 'solid' : ''}`} initial={false} animate={{ width: `${Math.min(100, (value / max) * 100)}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

export function AndyBill({ step, active, explore }: SlideProps) {
  const [gen, setGen] = useState(0);
  useEffect(() => {
    if (!active || step < 1) {
      setGen(0);
      return;
    }
    const t = setInterval(() => setGen((g) => (g + 1) % GENERATIONS.length), 2200);
    return () => clearInterval(t);
  }, [active, step]);

  const G = GENERATIONS[gen];
  const v = gen + 1; // both bars grow together, generation by generation

  return (
    <Slide kicker="II · The free lunch" title="">
      <div className="andy">
        <div className="andy-quote">
          <div className="andy-person">
            <GiftBox />
            <div className="num">Andy Grove</div>
            <div className="caption">ran Intel</div>
          </div>
          <div className="big-quote andy-text">
            “Andy giveth,
            <br />
            and Bill taketh away.”
          </div>
          <div className="andy-person">
            <Fork />
            <div className="num">Bill Gates</div>
            <div className="caption">ran Microsoft</div>
          </div>
        </div>

        <Reveal show={step >= 1} className="andy-loop card">
          <div className="andy-gen">
            <AnimatePresence mode="wait">
              <motion.div key={gen} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
                <span className="num">{G.chip}</span> <span className="caption">running</span> <span className="num">{G.os}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          <Meter label="Chip speed" value={v} max={GENERATIONS.length} solid />
          <Meter label="Software weight" value={v} max={GENERATIONS.length} />
          <Meter label="How fast it feels" value={1.4} max={GENERATIONS.length} solid />
          <div className="andy-foot">
            <span className="caption">Every faster chip, eaten by a fatter Windows. And nobody minded: the hardware always bailed software out.</span>
            {(explore || step >= 1) && (
              <button className="btn" data-interactive onClick={() => setGen((g) => (g + 1) % GENERATIONS.length)}>
                Upgrade ↻
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.5  Overclock it: the chip heats up, smokes, fries an egg
   ===================================================================== */

const OC_STEPS = [1, 3.5, 5, 6.5]; // fire (>~7 GHz) is left for the slider
const tempAt = (ghz: number) => 25 + 1.1 * Math.pow(ghz, 3);

export function Overclock({ step, explore }: SlideProps) {
  const [ghz, setGhz] = useState(OC_STEPS[0]);
  useEffect(() => setGhz(OC_STEPS[Math.min(step, OC_STEPS.length - 1)]), [step]);
  const T = tempAt(ghz);
  const heat = T > 70;
  const smoke = T > 140;
  const egg = T > 220;
  const fire = T > 420;
  const fill = T < 60 ? 'url(#dots-oc)' : T < 120 ? 'url(#lines-oc)' : T < 220 ? 'url(#hatch-oc)' : T < 420 ? 'url(#crosshatch-oc)' : 'var(--ink)';
  const verdict = T < 60 ? 'Comfortable.' : T < 120 ? 'Warm. Fans spinning up.' : T < 220 ? 'Smoking.' : T < 420 ? 'Breakfast is served.' : 'On fire.';

  return (
    <Slide kicker="II · The fire" title="Overclock it">
      <div className="oc">
        <svg viewBox="0 0 700 640" className="oc-svg">
          <HatchDefs id="-oc" />
          {/* heat waves */}
          {heat &&
            [0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M${230 + i * 60} 210 q 14 -22 0 -44 q -14 -22 0 -44`} fill="none" stroke="currentColor" strokeWidth="3" className="heatwave" style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${Math.max(0.5, 2.2 - ghz * 0.2)}s` }} />
            ))}
          {/* smoke */}
          {smoke &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={260 + (i % 3) * 90} cy="160" r={24 + (i % 2) * 12} fill="url(#lines-oc)" stroke="currentColor" strokeWidth="2" className="smoke" style={{ animationDelay: `${i * 0.45}s` }} />
            ))}
          {/* fire */}
          {fire &&
            [0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${220 + i * 90} 250 q -40 -60 10 -130 q 10 50 30 40 q 10 -50 -10 -90 q 70 50 40 180 Z`} fill="url(#crosshatch-oc)" stroke="currentColor" strokeWidth="3" className="flame" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          {/* the chip */}
          <g transform="translate(200 250)">
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i} stroke="currentColor" strokeWidth="6">
                <line x1={22 + i * 37} y1="300" x2={22 + i * 37} y2="340" />
                <line x1="-40" y1={22 + i * 37} x2="0" y2={22 + i * 37} />
                <line x1="300" y1={22 + i * 37} x2="340" y2={22 + i * 37} />
              </g>
            ))}
            <motion.rect x="0" y="0" width="300" height="300" stroke="currentColor" strokeWidth="6" animate={{ x: fire ? [0, -3, 3, 0] : 0 }} transition={{ repeat: fire ? Infinity : 0, duration: 0.2 }} fill={fill} />
            {/* the egg */}
            <AnimatePresence>
              {egg && (
                <motion.g initial={{ y: -260, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', bounce: 0.35, duration: 0.8 }}>
                  <path d="M70 160 C 40 100, 110 60, 160 80 C 230 60, 270 130, 240 180 C 230 240, 120 250, 90 220 C 60 210, 60 190, 70 160 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="4" />
                  {fire && <path d="M70 160 C 40 100, 110 60, 160 80 C 230 60, 270 130, 240 180 C 230 240, 120 250, 90 220 C 60 210, 60 190, 70 160 Z" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="3 9" />}
                  <circle cx="160" cy="150" r="38" fill="url(#crosshatch-oc)" stroke="currentColor" strokeWidth="4" />
                  <path d="M145 135 q 8 -8 18 -4" fill="none" stroke="var(--paper)" strokeWidth="5" strokeLinecap="round" />
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        </svg>

        <div className="oc-side">
          <div className="oc-read">
            <div>
              <div className="num oc-big">{ghz.toFixed(1)}</div>
              <div className="caption">GHz</div>
            </div>
            <div>
              <div className="num oc-big">{Math.round(T)}°</div>
              <div className="caption">Celsius</div>
            </div>
          </div>
          <div className="oc-verdict num">{verdict}</div>
          <div className="control" data-interactive>
            <label>Clock</label>
            <input type="range" min={1} max={9} step={0.1} value={ghz} onChange={(e) => setGhz(+e.target.value)} />
          </div>
          {explore && <p className="hint">Push the clock up. How far can you go before breakfast?</p>}
          <div className="oc-formula card">
            <div className="oc-eq">
              Power ≈ <i>C</i> × <i>V</i>² × <i>f</i>
            </div>
            <p>For years, we turned the <b>voltage down</b> to cancel out the <b>speed going up</b>. Around 2005 the voltage couldn't go any lower without the transistors leaking like a broken tap.</p>
            <p>So every extra GHz came straight out as <b>heat</b>.</p>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.7  "The Free Lunch Is Over."
   ===================================================================== */

export function FreeLunchOver({ step }: SlideProps) {
  return (
    <Slide kicker="II · The fire" title="">
      <div className="over">
        <Reveal show={step >= 0} className="over-events">
          <div><span className="num">2004</span> Intel quietly cancels its next big chip.</div>
          <div><span className="num">2004</span> …then cancels its 4 GHz chip.</div>
          <div><span className="num">2005</span> A programmer named Herb Sutter writes an article:</div>
        </Reveal>
        <motion.div
          className="over-quote"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 1.6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          “The Free Lunch Is Over.”
          <div className="caption over-cite">Herb Sutter, Dr. Dobb's Journal, March 2005</div>
        </motion.div>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.8  The memory wall: the world's fastest chef, the fridge across the street
   ===================================================================== */

function Chef({ chopping }: { chopping: boolean }) {
  return (
    <g>
      {/* toque */}
      <path d="M-20 -150 q -14 -24 6 -32 q 4 -20 22 -12 q 16 -14 26 6 q 18 4 6 26 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <rect x="-18" y="-152" width="36" height="14" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <circle cx="0" cy="-122" r="17" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <path d="M0 -105 V-50 M0 -50 L-16 0 M0 -50 L16 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M0 -92 L28 -76 L44 -88" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" animate={chopping ? { rotate: [0, 18, 0] } : { rotate: 0 }} transition={{ repeat: chopping ? Infinity : 0, duration: 0.25 }} style={{ originX: '0px', originY: '-92px' }} />
      <path d="M0 -92 L-24 -70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* apron */}
      <path d="M-12 -96 H12 L14 -56 H-14 Z" fill="url(#lines-mw)" stroke="currentColor" strokeWidth="2" />
    </g>
  );
}

const CHOP_S = 1;
const WALK_S = 180; // three minutes to the fridge and back

export function MemoryWall({ step, active, explore }: SlideProps) {
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState<'chop' | 'walk'>('chop');
  const running = active && step >= 1;
  // in the animation, chopping takes 1.2 s and the round trip 7 s (it's compressed; the numbers below are the real story)
  useEffect(() => {
    if (!running) {
      setPhase('chop');
      return;
    }
    let t: number;
    const loop = (p: 'chop' | 'walk') => {
      setPhase(p);
      t = window.setTimeout(() => loop(p === 'chop' ? 'walk' : 'chop'), p === 'chop' ? 1200 / speed : 7000);
    };
    loop('chop');
    return () => clearTimeout(t);
  }, [running, speed]);

  const chop = CHOP_S / speed;
  const busy = (chop / (chop + WALK_S)) * 100;
  const FRIDGE_X = 1380;

  return (
    <Slide kicker="II · The memory wall" title="The world's fastest chef">
      <div className="mw">
        <svg viewBox="0 0 1660 420" className="mw-svg">
          <HatchDefs id="-mw" />
          {/* kitchen */}
          <rect x="40" y="250" width="230" height="110" fill="url(#lines-mw)" stroke="currentColor" strokeWidth="3" />
          <rect x="70" y="236" width="120" height="14" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
          <text x="155" y="400" textAnchor="middle" className="mw-label">THE KITCHEN</text>
          {/* street */}
          <rect x="420" y="340" width="760" height="40" fill="url(#crosshatch-mw)" opacity="0.6" />
          <line x1="420" y1="360" x2="1180" y2="360" stroke="var(--paper)" strokeWidth="5" strokeDasharray="30 22" />
          <text x="800" y="410" textAnchor="middle" className="mw-label">THE STREET</text>
          {/* fridge building */}
          <path d="M1260 360 V120 L1400 60 L1540 120 V360 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
          <rect x="1350" y="170" width="100" height="190" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
          <line x1="1350" y1="240" x2="1450" y2="240" stroke="currentColor" strokeWidth="3" />
          <line x1="1435" y1="190" x2="1435" y2="225" stroke="currentColor" strokeWidth="4" />
          <line x1="1435" y1="255" x2="1435" y2="300" stroke="currentColor" strokeWidth="4" />
          <text x="1400" y="400" textAnchor="middle" className="mw-label">THE FRIDGE</text>
          <line x1="0" y1="360" x2="1660" y2="360" stroke="currentColor" strokeWidth="2" />
          {/* the chef */}
          <motion.g
            initial={false}
            animate={phase === 'walk' ? { x: [300, FRIDGE_X - 60, FRIDGE_X - 60, 300] } : { x: 300 }}
            transition={phase === 'walk' ? { duration: 7, times: [0, 0.45, 0.55, 1], ease: 'easeInOut' } : { duration: 0.3 }}
            style={{ y: 360 }}
          >
            <Chef chopping={running && phase === 'chop'} />
          </motion.g>
        </svg>

        <div className="mw-foot">
          <div className="mw-stats">
            <div>
              <div className="num mw-big">{chop < 1 ? chop.toFixed(2) : chop} s</div>
              <div className="caption">chopping</div>
            </div>
            <div>
              <div className="num mw-big">3 min</div>
              <div className="caption">walking to the fridge and back</div>
            </div>
            <Reveal show={step >= 1} className="">
              <div className="num mw-big">{busy.toFixed(1)}%</div>
              <div className="caption">of the time actually cooking</div>
            </Reveal>
          </div>
          <div className="mw-side" data-interactive>
            <button className={`btn ${speed > 1 ? 'on' : ''}`} onClick={() => setSpeed((s) => (s >= 8 ? 1 : s * 2))}>
              {speed >= 8 ? 'Reset chef' : 'Make the chef 2× faster'}
            </button>
            {speed > 1 && <div className="caption">Chef {speed}× faster → dinner {(((CHOP_S + WALK_S) / (chop + WALK_S) - 1) * 100).toFixed(1)}% sooner.</div>}
            {explore && speed === 1 && <div className="hint">Try making the chef faster.</div>}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.9  Three walls = a brick wall
   ===================================================================== */

const WALLS = [
  { name: 'Power', line: 'Faster means hotter. The chip catches fire.' },
  { name: 'Memory', line: 'The chef is fast. The fridge is across the street.' },
  { name: 'ILP', line: 'We already taught the chef every trick: juggling, guessing the next order, prepping ahead. No tricks left.' },
];

function Bricks({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="80" height="40" patternUnits="userSpaceOnUse">
        <rect width="80" height="40" fill="var(--paper)" />
        <path d="M0 0 H80 M0 20 H80 M40 0 V20 M0 20 V40 M80 20 V40" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M4 6 H30 M44 26 H70 M8 13 H24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </pattern>
    </defs>
  );
}

export function ThreeWalls({ step }: SlideProps) {
  return (
    <Slide kicker="II · The fire" title="Three walls">
      <div className="walls">
        {WALLS.map((w, i) => (
          <motion.div
            key={w.name}
            className="wall"
            initial={false}
            animate={{ y: step >= i ? 0 : -900, rotate: step >= i ? 0 : -4 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 1.4 }}
          >
            <svg viewBox="0 0 400 300" className="wall-bricks" preserveAspectRatio="none">
              <Bricks id={`brick-${i}`} />
              <rect width="400" height="300" fill={`url(#brick-${i})`} stroke="currentColor" strokeWidth="4" />
            </svg>
            <div className="wall-name num">{w.name}</div>
            <p className="wall-line">{w.line}</p>
          </motion.div>
        ))}
      </div>
      <motion.div className="brickwall" initial={false} animate={{ opacity: step >= 3 ? 1 : 0, scaleX: step >= 3 ? 1 : 0.2 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
        <svg viewBox="0 0 1660 150" preserveAspectRatio="none" className="wall-bricks brickwall-svg">
          <Bricks id="brick-all" />
          <rect width="1660" height="150" fill="url(#brick-all)" stroke="currentColor" strokeWidth="5" />
        </svg>
        <div className="brickwall-text num">= Brick wall</div>
      </motion.div>
    </Slide>
  );
}

/* =====================================================================
   II.10  Hire more chefs: 1 → 64 cores
   ===================================================================== */

const CORE_STEPS = [1, 4, 64, 64];

function ChefHat({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-20 10 q -14 -24 6 -32 q 4 -20 22 -12 q 16 -14 26 6 q 18 4 6 26 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3" transform="translate(-10 0)" />
      <rect x="-28" y="8" width="36" height="14" fill="var(--paper)" stroke="currentColor" strokeWidth="3" transform="translate(10 0)" />
    </g>
  );
}

export function MoreChefs({ step, explore }: SlideProps) {
  const [cores, setCores] = useState(CORE_STEPS[0]);
  useEffect(() => setCores(CORE_STEPS[Math.min(step, 3)]), [step]);
  const n = Math.round(Math.sqrt(cores)) ** 2 === cores ? Math.sqrt(cores) : Math.sqrt(cores / 2);
  const cols = Math.round(Math.sqrt(cores)) ** 2 === cores ? n : n * 2;
  const rows = cores / cols;
  const S = 560;
  const gap = cores > 16 ? 8 : 16;
  const cw = (S - gap * (cols + 1)) / cols;
  const ch = (S - gap * (rows + 1)) / rows;

  return (
    <Slide kicker="II · So what do you do?" title="If you can't make one chef faster… hire more chefs.">
      <div className="cores">
        <svg viewBox="-40 -40 640 640" className="cores-svg">
          <HatchDefs id="-cr" />
          <rect x="0" y="0" width={S} height={S} fill="var(--paper)" stroke="currentColor" strokeWidth="6" />
          {Array.from({ length: cores }, (_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const x = gap + c * (cw + gap);
            const y = gap + r * (ch + gap);
            return (
              <motion.g key={`${cores}-${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * (0.4 / cores), duration: 0.4 }} style={{ originX: `${x + cw / 2}px`, originY: `${y + ch / 2}px` }}>
                <rect x={x} y={y} width={cw} height={ch} fill={cores >= 32 ? 'url(#hatch-cr)' : 'var(--paper)'} stroke="currentColor" strokeWidth={cores >= 32 ? 2 : 3} />
                {cores <= 16 && <ChefHat x={x + cw / 2} y={y + ch / 2 + 10} s={Math.min(cw, ch) / 110} />}
              </motion.g>
            );
          })}
        </svg>
        <div className="cores-side">
          <div className="num cores-big">{cores}</div>
          <div className="caption cores-cap">{cores === 1 ? 'core' : 'cores'} on one chip</div>
          <p className="cores-text">That's why your laptop has 8 or 16 "cores" now. The industry went <b>sideways</b> instead of up.</p>
          <div className="control" data-interactive>
            <label>Cores</label>
            <input type="range" min={0} max={6} step={1} value={Math.log2(cores)} onChange={(e) => setCores(2 ** +e.target.value)} />
          </div>
          {explore && <p className="hint">Slide to add cores.</p>}
          <Reveal show={step >= 3} className="cores-tease">
            But a CPU is still a few <i>very smart, very expensive</i> chefs.
            <div className="cores-q">What if you hired… a stadium full of cheap ones?</div>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
