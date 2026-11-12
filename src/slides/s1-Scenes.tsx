import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';
import './s1.css';

/* =====================================================================
   I.1  Zoom out: laptop → server → rack → row → building
   ===================================================================== */

const ZOOM_ITEMS = [
  { x: 0, w: 150, label: 'A laptop', sub: 'one chip' },
  { x: 190, w: 230, label: 'A server', sub: 'a handful of chips in a box' },
  { x: 460, w: 130, label: 'A rack', sub: 'dozens of servers stacked like pizza boxes' },
  { x: 630, w: 430, label: 'A row of racks', sub: 'thousands of chips, all wired together' },
  { x: 1100, w: 600, label: 'A supercomputer', sub: 'a building the size of two football pitches, humming' },
];
const ZOOM_BASE = 600; // ground line in the SVG

function Laptop() {
  return (
    <g transform={`translate(0 ${ZOOM_BASE})`}>
      <rect x="15" y="-110" width="120" height="80" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="23" y="-102" width="104" height="64" fill="url(#lines-z)" opacity="0.5" />
      <path d="M0 -6 L15 -30 H135 L150 -6 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <line x1="0" y1="-3" x2="150" y2="-3" stroke="currentColor" strokeWidth="4" />
    </g>
  );
}

function Server({ x = 190, y = ZOOM_BASE, w = 230 }: { x?: number; y?: number; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-70" width={w} height="70" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={12 + i * ((w - 70) / 6)} y="-56" width={(w - 70) / 6 - 8} height="42" fill="url(#hatch-z)" stroke="currentColor" strokeWidth="1.5" />
      ))}
      <circle cx={w - 30} cy="-46" r="5" fill="currentColor" />
      <circle cx={w - 30} cy="-24" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
    </g>
  );
}

function Rack({ x, w = 130, h = 340 }: { x: number; w?: number; h?: number }) {
  const n = 14;
  return (
    <g transform={`translate(${x} ${ZOOM_BASE})`}>
      <rect x="0" y={-h} width={w} height={h} fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x="8" y={-h + 10 + i * ((h - 20) / n)} width={w - 16} height={(h - 20) / n - 5} fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={w - 18} cy={-h + 10 + i * ((h - 20) / n) + ((h - 20) / n - 5) / 2} r="2.5" fill="currentColor" />
        </g>
      ))}
    </g>
  );
}

function Building() {
  const x = 1100;
  return (
    <g transform={`translate(${x} ${ZOOM_BASE})`}>
      {/* main hall */}
      <path d="M0 0 V-300 L300 -400 L600 -300 V0 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="4" />
      <path d="M0 -300 L300 -400 L600 -300" fill="none" stroke="currentColor" strokeWidth="8" />
      {/* cooling towers on the roof */}
      {[120, 200, 400, 480].map((cx) => (
        <g key={cx}>
          <rect x={cx - 22} y={-350 + Math.abs(cx - 300) * 0.33 - 30} width="44" height="30" fill="url(#lines-z)" stroke="currentColor" strokeWidth="2" />
        </g>
      ))}
      {/* windows: rows of racks seen through */}
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 10 }, (_, c) => (
          <rect key={`${r}-${c}`} x={30 + c * 56} y={-270 + r * 80} width="40" height="56" fill="url(#crosshatch-z)" stroke="currentColor" strokeWidth="1.5" />
        )),
      )}
      <rect x="270" y="-60" width="60" height="60" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      {/* hum lines */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${560 + i * 18} ${-330 - i * 10} q 10 -14 0 -28 q -10 -14 0 -28`} fill="none" stroke="currentColor" strokeWidth="2" className="hum" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </g>
  );
}

export function ZoomOut({ step }: SlideProps) {
  const k = Math.min(step, ZOOM_ITEMS.length - 1);
  const right = ZOOM_ITEMS[k].x + ZOOM_ITEMS[k].w + 40;
  const scale = Math.min(3.2, 1660 / right);
  const item = ZOOM_ITEMS[k];
  return (
    <Slide kicker="I · What is HPC?" title="Zoom out.">
      <div className="zoom-view">
        <motion.svg
          className="zoom-svg"
          viewBox={`0 0 1740 ${ZOOM_BASE + 20}`}
          width={1740}
          height={ZOOM_BASE + 20}
          initial={false}
          animate={{ scale }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: `0px ${ZOOM_BASE}px` }}
        >
          <HatchDefs id="-z" />
          <line x1="-200" y1={ZOOM_BASE} x2="1800" y2={ZOOM_BASE} stroke="currentColor" strokeWidth="2" />
          {[
            <Laptop key="l" />,
            <Server key="s" />,
            <Rack key="r" x={460} />,
            <g key="row">{[0, 1, 2, 3, 4, 5].map((i) => <Rack key={i} x={630 + i * 72} w={62} h={320} />)}</g>,
            <Building key="b" />,
          ].map((el, i) => (
            <motion.g key={i} initial={false} animate={{ opacity: i <= k ? 1 : 0 }} transition={{ duration: 0.8, delay: i <= k ? 0.4 : 0 }}>
              {el}
            </motion.g>
          ))}
        </motion.svg>
      </div>
      <div className="zoom-caption">
        <AnimatePresence mode="wait">
          <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <span className="num">{item.label}</span> <span className="caption">· {item.sub}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <Reveal show={step >= ZOOM_ITEMS.length} className="zoom-def card">
        <span className="lede">Some problems are too big for one computer.</span> So you get <b>thousands of computers</b> to work on the <b>same problem</b>, at the <b>same time</b>.
      </Reveal>
    </Slide>
  );
}
export const ZOOM_STEPS = ZOOM_ITEMS.length + 1;

/* =====================================================================
   I.2  What kind of problems?
   ===================================================================== */

function GlobeIcon() {
  return (
    <svg viewBox="0 0 200 200" className="problem-icon">
      <HatchDefs id="-g" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="3" />
      {[-60, -30, 0, 30, 60].map((d) => (
        <ellipse key={d} cx="100" cy="100" rx={80 * Math.cos((d * Math.PI) / 180) || 1} ry="80" fill="none" stroke="currentColor" strokeWidth="1.3" />
      ))}
      {[-55, -28, 0, 28, 55].map((y) => (
        <line key={y} x1={100 - Math.sqrt(80 * 80 - y * y)} y1={100 + y} x2={100 + Math.sqrt(80 * 80 - y * y)} y2={100 + y} stroke="currentColor" strokeWidth="1.3" />
      ))}
      {/* a few "boxes" of atmosphere filled in */}
      <rect x="100" y="72" width="28" height="28" fill="url(#crosshatch-g)" />
      <rect x="72" y="100" width="28" height="28" fill="url(#hatch-g)" />
      <path d="M150 40 q 30 10 20 40 q -10 20 -30 10" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M30 150 q -16 -20 0 -40" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 220 200" className="problem-icon">
      <HatchDefs id="-c" />
      {/* the wall */}
      <rect x="180" y="40" width="30" height="130" fill="url(#crosshatch-c)" stroke="currentColor" strokeWidth="2" />
      {/* car body, crumpled at the front */}
      <path d="M12 140 V112 Q14 104 30 102 L58 74 H118 L146 100 Q166 102 172 112 L176 120 L170 126 L178 134 L172 140 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M66 80 H112 L132 100 H66 Z" fill="url(#lines-c)" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="142" r="17" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <circle cx="140" cy="142" r="17" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="142" r="5" fill="currentColor" />
      <circle cx="140" cy="142" r="5" fill="currentColor" />
      {/* impact lines */}
      <path d="M176 70 l-14 -14 M178 92 l-20 -4 M170 50 l-4 -18" stroke="currentColor" strokeWidth="2.5" />
      <line x1="0" y1="160" x2="220" y2="160" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ProteinIcon() {
  const pts = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      const a = t * Math.PI * 3.2;
      out.push([100 + Math.cos(a) * (70 - t * 40) + Math.sin(i * 1.7) * 6, 100 + Math.sin(a) * (70 - t * 40) + Math.cos(i * 1.3) * 6]);
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 200 200" className="problem-icon">
      <HatchDefs id="-p" />
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth="2.5" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 9 : 6} fill={i % 3 === 0 ? 'url(#crosshatch-p)' : 'var(--paper)'} stroke="currentColor" strokeWidth="2" />
      ))}
    </svg>
  );
}

const PROBLEMS = [
  { icon: <GlobeIcon />, title: 'Weather', text: "Chop the whole planet's atmosphere into little boxes. Simulate every single one." },
  { icon: <CarIcon />, title: 'Car crashes', text: 'Crash a car ten thousand times without buying ten thousand cars.' },
  { icon: <ProteinIcon />, title: 'Proteins & drugs', text: 'Fold a molecule, atom by atom, to see if it cures something.' },
];

export function Problems({ step }: SlideProps) {
  return (
    <Slide kicker="I · What is HPC?" title="What kind of problems?">
      <div className="problems">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} show={step >= i} className="card problem">
            {p.icon}
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}

/* =====================================================================
   I.3  The FLOPS ladder (+ "measure your own FLOPS" game)
   ===================================================================== */

const RUNGS = [
  { exp: 0, who: 'You, doing mental maths', val: '~1 per second', note: 'on a good day' },
  { exp: 12.5, who: 'Your laptop', val: 'trillions per second', note: '' },
  { exp: 18.34, who: 'The fastest supercomputer on Earth', val: '2,000,000,000,000,000,000 per second', note: 'two quintillion' },
];
const LADDER_H = 600;
const yOf = (exp: number) => LADDER_H - 20 - (exp / 19) * (LADDER_H - 60);

function useFlopsGame() {
  const [q, setQ] = useState<{ a: number; b: number; t0: number } | null>(null);
  const [ans, setAns] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const start = () => {
    const a = 11 + Math.floor(Math.random() * 80);
    const b = 3 + Math.floor(Math.random() * 7);
    setQ({ a, b, t0: performance.now() });
    setAns('');
    setResult(null);
  };
  const submit = () => {
    if (!q) return;
    if (+ans === q.a * q.b) {
      setResult(1 / ((performance.now() - q.t0) / 1000));
      setQ(null);
    }
  };
  return { q, ans, setAns, result, start, submit };
}

export function FlopsLadder({ step, explore }: SlideProps) {
  const game = useFlopsGame();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (game.q) inputRef.current?.focus();
  }, [game.q]);
  const youExp = game.result ? Math.log10(game.result) : null;

  return (
    <Slide kicker="I · What is HPC?" title={<>The unit: the <i>FLOP</i>, one bit of arithmetic, like 3.7 × 2.1</>} className="flops-slide">
      <div className="flops">
        <svg className="ladder" viewBox={`0 0 1000 ${LADDER_H}`} width="1000" height={LADDER_H}>
          {/* rails */}
          <line x1="60" y1="10" x2="60" y2={LADDER_H - 10} stroke="currentColor" strokeWidth="4" />
          <line x1="130" y1="10" x2="130" y2={LADDER_H - 10} stroke="currentColor" strokeWidth="4" />
          {Array.from({ length: 20 }, (_, e) => (
            <g key={e}>
              <line x1="60" y1={yOf(e)} x2="130" y2={yOf(e)} stroke="currentColor" strokeWidth={e % 3 === 0 ? 3 : 1.2} />
              {e % 3 === 0 && (
                <text x="40" y={yOf(e) + 7} textAnchor="end" className="ladder-exp">
                  10<tspan dy="-12" fontSize="16">{e}</tspan>
                </text>
              )}
            </g>
          ))}
          {RUNGS.map((r, i) => (
            <motion.g key={r.who} initial={false} animate={{ opacity: step >= i ? 1 : 0, x: step >= i ? 0 : 30 }} transition={{ duration: 0.7 }}>
              <circle cx="95" cy={yOf(r.exp)} r="13" fill="currentColor" />
              <line x1="115" y1={yOf(r.exp)} x2="180" y2={yOf(r.exp)} stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <text x="195" y={yOf(r.exp) - 6} className="ladder-who">{r.who}</text>
              <text x="195" y={yOf(r.exp) + 30} className="ladder-val">
                {r.val} {r.note && <tspan fontStyle="italic" opacity="0.7"> ({r.note})</tspan>}
              </text>
            </motion.g>
          ))}
          {youExp !== null && (
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: `95px ${yOf(Math.max(-0.9, youExp))}px` }}>
              <circle cx="95" cy={yOf(Math.max(-0.9, youExp))} r="18" fill="none" stroke="currentColor" strokeWidth="3" />
              <text x="195" y={yOf(Math.max(-0.9, youExp)) - 40} className="ladder-who">↑ you just now: {game.result!.toFixed(2)} FLOP/s</text>
            </motion.g>
          )}
        </svg>

        <div className="flops-side">
          <Reveal show={step >= 3} className="card humans">
            <p>If every one of the <b>8 billion</b> people on Earth did one calculation every second, nonstop, no sleep…</p>
            <p className="humans-big">
              it would take us <span className="num">about 8 years</span>
            </p>
            <p>to do what that machine does in <span className="num">one second</span>.</p>
          </Reveal>

          <div className="card flops-game" data-interactive>
            <div className="slide-kicker">Measure your own FLOPS</div>
            {!game.q && (
              <button className="btn" onClick={game.start}>
                {game.result ? 'Try again' : 'Start'}
              </button>
            )}
            {game.q && (
              <form
                className="game-q"
                onSubmit={(e) => {
                  e.preventDefault();
                  game.submit();
                }}
              >
                <span className="num">
                  {game.q.a} × {game.q.b} =
                </span>
                <input ref={inputRef} inputMode="numeric" value={game.ans} onChange={(e) => game.setAns(e.target.value.replace(/\D/g, ''))} />
                <button className="btn" type="submit">=</button>
              </form>
            )}
            {game.result && (
              <p className="game-result">
                You: <span className="num">{game.result.toFixed(2)}</span> FLOP/s. The supercomputer is about{' '}
                <span className="num">{formatBig(2.2e18 / game.result)}</span>× faster.
              </p>
            )}
            {explore && !game.result && <p className="hint">Solve it as fast as you can.</p>}
          </div>
        </div>
      </div>
    </Slide>
  );
}

function formatBig(n: number) {
  const units: [number, string][] = [
    [1e18, 'quintillion'],
    [1e15, 'quadrillion'],
    [1e12, 'trillion'],
    [1e9, 'billion'],
  ];
  for (const [v, name] of units) if (n >= v) return `${(n / v).toFixed(1)} ${name}`;
  return Math.round(n).toLocaleString();
}

/* =====================================================================
   I.4  ASCI White (2000) vs one graphics card (today)
   ===================================================================== */

function Elephant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M4 30 Q2 12 18 8 Q30 2 40 10 Q50 6 54 16 Q58 26 54 36 L56 50 H50 L48 40 Q46 44 44 40 V50 H38 V40 H22 V50 H16 V40 Q10 42 8 40 V50 H2 V38 Z"
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M54 22 Q64 30 60 46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="18" r="1.8" fill="currentColor" />
      <path d="M40 12 Q34 22 42 28" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </g>
  );
}

export function AsciWhite({ step }: SlideProps) {
  return (
    <Slide kicker="I · What is HPC?" title="Then and now">
      <div className="asci">
        <div className="asci-col">
          <svg viewBox="0 0 640 300" className="asci-art">
            <HatchDefs id="-a" />
            {Array.from({ length: 4 }, (_, r) =>
              Array.from({ length: 12 }, (_, c) => (
                <rect key={`${r}-${c}`} x={20 + c * 50 + r * 6} y={40 + r * 58} width="40" height="54" fill={r % 2 ? 'url(#lines-a)' : 'url(#crosshatch-a)'} stroke="currentColor" strokeWidth="1.5" />
              )),
            )}
            <line x1="0" y1="290" x2="640" y2="290" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="asci-year num">2000</div>
          <h3>ASCI White</h3>
          <p>The fastest computer on Earth. It filled a room, cost <b>$110 million</b>, and weighed as much as</p>
          <svg viewBox="0 0 680 74" className="elephants">
            {Array.from({ length: 17 }, (_, i) => <Elephant key={i} x={i * 40} y={6} s={0.64} />)}
          </svg>
          <p className="caption">seventeen elephants</p>
        </div>

        <div className="asci-vs num">vs</div>

        <Reveal show={step >= 1} className="asci-col">
          <svg viewBox="0 0 640 300" className="asci-art">
            <HatchDefs id="-b" />
            {/* a single graphics card */}
            <g transform="translate(150 90)">
              <rect x="0" y="0" width="340" height="120" rx="6" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
              <circle cx="95" cy="60" r="44" fill="url(#lines-b)" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="245" cy="60" r="44" fill="url(#lines-b)" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="95" cy="60" r="10" fill="currentColor" />
              <circle cx="245" cy="60" r="10" fill="currentColor" />
              <rect x="40" y="120" width="200" height="14" fill="url(#hatch-b)" stroke="currentColor" strokeWidth="2" />
              <rect x="340" y="10" width="14" height="100" fill="currentColor" />
            </g>
            <line x1="0" y1="290" x2="640" y2="290" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="asci-year num">Today</div>
          <h3>One graphics card</h3>
          <p>Fits in your hands. Plugs into a single computer. And it is <b>faster than the whole of ASCI White.</b></p>
        </Reveal>
      </div>
    </Slide>
  );
}

/* =====================================================================
   I.5  The Pizza Party (Amdahl's Law)
   ===================================================================== */

const PREP_MIN = 60; // dough + toppings: can be split between friends
const OVEN_MIN = 10; // the oven: cannot
const PIZZA_STEPS = [1, 10, 100, 1000];
const total = (n: number) => OVEN_MIN + PREP_MIN / n;

function Friend({ x, bored }: { x: number; bored: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="0" cy="-58" r="9" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
      <path d="M0 -49 V-22 M-12 -40 L0 -36 L12 -40 M0 -22 L-9 0 M0 -22 L9 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {bored ? <path d="M-4 -56 h3 M2 -56 h3 M-3 -53 h6" stroke="currentColor" strokeWidth="1.2" /> : <path d="M-3 -54 q3 3 6 0" fill="none" stroke="currentColor" strokeWidth="1.2" />}
    </g>
  );
}

export function PizzaParty({ step, explore }: SlideProps) {
  const [n, setN] = useState(PIZZA_STEPS[0]);
  useEffect(() => setN(PIZZA_STEPS[Math.min(step, 3)]), [step]);

  // chart: x = log10(friends) 0..3, y = minutes 0..70
  const CW = 860;
  const CH = 470;
  const px = (f: number) => 70 + (Math.log10(f) / 3) * (CW - 100);
  const py = (m: number) => CH - 50 - (m / 72) * (CH - 80);
  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const f = Math.pow(10, (i / 120) * 3);
      pts.push(`${px(f)},${py(total(f))}`);
    }
    return pts.join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = Math.min(n, 20);
  const bored = n >= 60;
  const sliderVal = Math.log10(n);

  return (
    <Slide kicker="I · Why not just add more computers?" title="The Pizza Party">
      <div className="pizza">
        <div className="pizza-left">
          <p className="pizza-rules">
            Rolling dough and adding toppings: <b>{PREP_MIN} minutes</b> of work you can split between friends.
            <br />
            Baking: <b>{OVEN_MIN} minutes</b> in the one oven. Nobody can help with that.
          </p>

          <svg viewBox="0 0 760 120" className="pizza-scene">
            <HatchDefs id="-pz" />
            <g transform="translate(20 110)">
              {Array.from({ length: shown }, (_, i) => <Friend key={i} x={i * 22 + 10} bored={bored} />)}
              {n > shown && (
                <text x={shown * 22 + 22} y="-20" className="pizza-more">+{(n - shown).toLocaleString()} more</text>
              )}
            </g>
            {/* the oven */}
            <g transform="translate(620 18)">
              <rect x="0" y="0" width="120" height="92" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
              <rect x="14" y="26" width="92" height="52" fill="url(#crosshatch-pz)" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="44" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="60" y="-6" textAnchor="middle" className="pizza-oven-label">THE OVEN</text>
            </g>
          </svg>

          <div className="pizza-readout">
            <div>
              <div className="num pizza-n">{n.toLocaleString()}</div>
              <div className="caption">{n === 1 ? 'friend' : 'friends'}</div>
            </div>
            <div>
              <div className="num pizza-n">{total(n) < 11 ? total(n).toFixed(2) : total(n).toFixed(0)}</div>
              <div className="caption">minutes until pizza</div>
            </div>
          </div>

          <div className="control" data-interactive>
            <label>Friends</label>
            <input type="range" min={0} max={3} step={0.01} value={sliderVal} onChange={(e) => setN(Math.max(1, Math.round(Math.pow(10, +e.target.value))))} />
          </div>
          {explore && <p className="hint">Drag the slider. Can you get the pizza under 10 minutes?</p>}
        </div>

        <svg className="pizza-chart" viewBox={`0 0 ${CW} ${CH}`} width={CW} height={CH}>
          <HatchDefs id="-pc" />
          {/* the oven floor: you can never get below it */}
          <rect x="70" y={py(OVEN_MIN)} width={CW - 100} height={py(0) - py(OVEN_MIN)} fill="url(#hatch-pc)" opacity="0.5" />
          <line x1="70" y1={py(OVEN_MIN)} x2={CW - 30} y2={py(OVEN_MIN)} stroke="currentColor" strokeWidth="3" strokeDasharray="10 6" />
          <text x={CW - 34} y={py(OVEN_MIN) - 12} textAnchor="end" className="chart-label">the oven: 10 min, always</text>
          {/* axes */}
          <line x1="70" y1={py(0)} x2={CW - 30} y2={py(0)} stroke="currentColor" strokeWidth="2" />
          <line x1="70" y1={py(0)} x2="70" y2="20" stroke="currentColor" strokeWidth="2" />
          {[1, 10, 100, 1000].map((f) => (
            <text key={f} x={px(f)} y={py(0) + 32} textAnchor="middle" className="chart-tick">{f.toLocaleString()}</text>
          ))}
          {[0, 20, 40, 60].map((m) => (
            <text key={m} x="58" y={py(m) + 7} textAnchor="end" className="chart-tick">{m}</text>
          ))}
          <text x={(CW + 40) / 2} y={CH - 2} textAnchor="middle" className="chart-axis">friends helping</text>
          <text x="84" y="30" className="chart-axis">minutes</text>
          <polyline points={curve} fill="none" stroke="currentColor" strokeWidth="4" />
          <motion.circle initial={false} animate={{ cx: px(n), cy: py(total(n)) }} transition={{ duration: 0.5 }} r="12" fill="currentColor" />
        </svg>
      </div>
      <Reveal show={step >= 3} className="amdahl">
        <span className="num">Amdahl's Law:</span> the part you can't split up sets your speed limit. <i>Remember the oven.</i>
      </Reveal>
    </Slide>
  );
}
