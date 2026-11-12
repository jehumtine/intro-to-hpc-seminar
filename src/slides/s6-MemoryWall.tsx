import { useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';

/**
 * Future I: the memory wall is the boss now.
 * Left: compute grows ×3 every 2 years, memory ×1.6 (log chart, lines diverge).
 * Right: a queue of chefs at one fridge; the longer the gap, the longer the queue.
 * step 0 chart · step 1 the queue + the line
 * Explore: a "years" slider grows both.
 */
const W = 800;
const H = 560;
const L = 90;
const B = 500;
const T = 30;
const YMAX = Math.log10(100000);
const px = (yr: number) => L + (yr / 20) * (W - L - 40);
const py = (mult: number) => B - (Math.log10(mult) / YMAX) * (B - T);
const compute = (yr: number) => Math.pow(3, yr / 2);
const memory = (yr: number) => Math.pow(1.6, yr / 2);

function sample(f: (y: number) => number, upto: number) {
  const pts: string[] = [];
  for (let y = 0; y <= upto + 1e-9; y += 0.25) pts.push(`${px(y).toFixed(1)} ${py(f(y)).toFixed(1)}`);
  return pts;
}
const path = (f: (y: number) => number, upto: number) => 'M ' + sample(f, upto).join(' L ');
const gap = (upto: number) => 'M ' + [...sample(compute, upto), ...sample(memory, upto).reverse()].join(' L ') + ' Z';

const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000).toLocaleString()},000` : Math.round(n).toLocaleString());

/** the four futures, as a row of numbered seals; `n` is lit */
export function Futures({ n }: { n: number }) {
  return (
    <div className="s6-futures">
      {['I', 'II', 'III', 'IV'].map((r, i) => <span key={r} className={i + 1 === n ? 'on' : ''}>{r}</span>)}
    </div>
  );
}

function Chef({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="var(--ink)" strokeWidth="2" fill="var(--paper)" strokeLinecap="round">
      <path d="M-9 -44 q-6 -10 3 -14 q6 -8 12 0 q9 4 3 14 z" />
      <rect x="-8" y="-46" width="16" height="6" />
      <circle cx="0" cy="-32" r="8" />
      <path d="M0 -24 V0 M0 -16 L-10 -6 M0 -16 L10 -8 M0 0 L-7 16 M0 0 L7 16" fill="none" />
    </g>
  );
}

export function MemoryWall({ step, explore, active }: SlideProps) {
  const [years, setYears] = useState(20);
  const yrs = explore ? years : 20;
  const c = compute(yrs);
  const m = memory(yrs);
  // queue length grows with the gap (log), capped to what fits
  const chefs = Math.max(1, Math.min(44, Math.round(Math.log10(c / m) * 11)));

  return (
    <Slide kicker="The future · I" title="The memory wall is the boss now">
      <Futures n={1} />
      <div className="s6-mem">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            <HatchDefs id="-s6m" />
            {[1, 10, 100, 1000, 10000, 100000].map((v) => (
              <g key={v}>
                <line x1={L} x2={W - 40} y1={py(v)} y2={py(v)} stroke="var(--ink)" strokeOpacity={v === 1 ? 1 : 0.15} strokeWidth={v === 1 ? 2.4 : 1} />
                <text x={L - 14} y={py(v) + 8} textAnchor="end" fontSize="22" fontFamily="var(--display)" fill="var(--ink-soft)">×{v.toLocaleString()}</text>
              </g>
            ))}
            {[0, 5, 10, 15, 20].map((y) => (
              <text key={y} x={px(y)} y={B + 36} textAnchor="middle" fontSize="22" fontFamily="var(--display)" fill="var(--ink-soft)">{y}</text>
            ))}
            <text x={(L + W) / 2} y={B + 66} textAnchor="middle" fontSize="22" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink-soft)">years</text>
            {/* the gap */}
            <path d={gap(yrs)} fill="url(#hatch-s6m)" opacity="0.35" stroke="none" />
            <motion.path key={`c${active}`} d={path(compute, yrs)} fill="none" stroke="var(--ink)" strokeWidth="5" initial={{ pathLength: explore ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
            <motion.path key={`m${active}`} d={path(memory, yrs)} fill="none" stroke="var(--ink)" strokeWidth="3" strokeDasharray="10 7" initial={{ pathLength: explore ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
            <text x={px(yrs) - 6} y={py(c) - 16} textAnchor="end" fontSize="28" fontFamily="var(--display)" fontWeight="600" fill="var(--ink)">compute ×{fmt(c)}</text>
            <text x={px(yrs) - 6} y={py(m) + 40} textAnchor="end" fontSize="26" fontFamily="var(--serif)" fontStyle="italic" fill="var(--ink)">memory ×{fmt(m)}</text>
          </svg>
          {explore && (
            <div className="control" data-interactive style={{ marginTop: 6 }}>
              <label htmlFor="mem-years">Years</label>
              <input id="mem-years" type="range" min={2} max={20} step={1} value={years} onChange={(e) => setYears(+e.target.value)} style={{ width: 420 }} />
              <span className="num">{years}</span>
            </div>
          )}
        </div>

        <Reveal show={step >= 1} className="q">
          <svg viewBox="0 0 700 470">
            {/* the fridge */}
            <rect x="590" y="70" width="100" height="330" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
            <line x1="590" y1="190" x2="690" y2="190" stroke="var(--ink)" strokeWidth="2.4" />
            <line x1="604" y1="120" x2="604" y2="160" stroke="var(--ink)" strokeWidth="5" />
            <line x1="604" y1="220" x2="604" y2="290" stroke="var(--ink)" strokeWidth="5" />
            <text x="640" y="440" textAnchor="middle" fontSize="24" fontFamily="var(--display)" fill="var(--ink)">MEMORY</text>
            {/* the queue: snakes back and forth toward the fridge */}
            {Array.from({ length: chefs }, (_, i) => {
              const perRow = 11;
              const row = Math.floor(i / perRow);
              const k = i % perRow;
              const dir = row % 2 === 0 ? 1 : -1;
              const x = dir === 1 ? 545 - k * 48 : 545 - (perRow - 1 - k) * 48;
              const y = 390 - row * 95;
              return (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <Chef x={x} y={y} s={0.95} />
                </motion.g>
              );
            })}
          </svg>
          <p className="line">
            Our chips can compute far faster than we can feed them. A thousand chefs, one fridge across the street.
          </p>
        </Reveal>
      </div>
    </Slide>
  );
}
