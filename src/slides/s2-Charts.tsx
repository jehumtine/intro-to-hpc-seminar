import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { FREQUENCY_MHZ, TRANSISTORS_K, TREND_CREDIT } from '../data/microprocessorTrends';
import { HatchDefs, Reveal, Slide } from './common';
import './s2.css';

/* ---------------------------------------------------------------------
   Shared: log-scale trend chart of clock speed and transistor count
   --------------------------------------------------------------------- */

type Pt = [number, number];

/** median per bin → a smooth-ish trend line through the scattered chips */
function trend(data: Pt[], bin = 2): Pt[] {
  const bins = new Map<number, number[]>();
  for (const [x, y] of data) {
    const b = Math.floor(x / bin) * bin + bin / 2;
    if (!bins.has(b)) bins.set(b, []);
    bins.get(b)!.push(Math.log10(y));
  }
  return [...bins.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([x, ys]) => {
      ys.sort((a, b) => a - b);
      return [x, Math.pow(10, ys[Math.floor(ys.length / 2)])] as Pt;
    });
}

const CLOCK_TREND = trend(FREQUENCY_MHZ);
const TRANS_TREND = trend(TRANSISTORS_K);

/*
 * The transistor axis is scaled so the two trend lines climb TOGETHER until ~2004
 * (same start, same height in 2004). After that the clock flattens and the
 * transistors keep going: the lines split apart. That split is the whole point.
 */
const ANCHOR_A = 1972;
const ANCHOR_B = 2004;
const lc = (y: number) => Math.log10(interp(CLOCK_TREND, y));
const lt = (y: number) => Math.log10(interp(TRANS_TREND, y));
const T_SLOPE = (lc(ANCHOR_B) - lc(ANCHOR_A)) / (lt(ANCHOR_B) - lt(ANCHOR_A));
/** transistor count (thousands) → equivalent clock value (MHz) on the shared vertical axis */
const transAsClock = (k: number) => Math.pow(10, lc(ANCHOR_A) + (Math.log10(k) - lt(ANCHOR_A)) * T_SLOPE);

interface ChartOpts {
  /** top of the vertical axis, in log10(MHz). 4 = 10 GHz */
  top?: number;
  x0: number;
  x1: number;
  w: number;
  h: number;
}

function scales(opts: ChartOpts) {
  const { x0, x1, w, h } = opts;
  const L = 110;
  const R = 130;
  const T = 30;
  const B = 60;
  const px = (yr: number) => L + ((yr - x0) / (x1 - x0)) * (w - L - R);
  // clock: 0.1 MHz .. 10 GHz (5 decades); transistors: 1k .. 100B (8 decades, in thousands: 1 .. 1e8)
  const top = opts.top ?? 4;
  const pyClock = (mhz: number) => T + (1 - (Math.log10(mhz) + 1) / (top + 1)) * (h - T - B);
  const pyTrans = (k: number) => pyClock(transAsClock(k));
  return { L, R, T, B, px, pyClock, pyTrans };
}

const poly = (pts: Pt[], fx: (x: number) => number, fy: (y: number) => number) => pts.map(([x, y]) => `${fx(x).toFixed(1)},${fy(y).toFixed(1)}`).join(' ');

function interp(pts: Pt[], yr: number) {
  if (yr <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (yr <= pts[i][0]) {
      const [xa, ya] = pts[i - 1];
      const [xb, yb] = pts[i];
      const t = (yr - xa) / (xb - xa);
      return Math.pow(10, Math.log10(ya) + t * (Math.log10(yb) - Math.log10(ya)));
    }
  }
  return pts[pts.length - 1][1];
}

const fmtHz = (mhz: number) => (mhz >= 1000 ? `${(mhz / 1000).toFixed(1)} GHz` : mhz >= 1 ? `${mhz.toFixed(0)} MHz` : `${(mhz * 1000).toFixed(0)} kHz`);
const fmtCount = (k: number) => {
  const n = k * 1000;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} million`;
  return `${Math.round(n / 1000).toLocaleString()} thousand`;
};

function TrendChart({
  opts,
  showClock,
  showTrans,
  showGap,
  showWall,
  cursor,
  clockLabelAt,
}: {
  clockLabelAt?: number;
  opts: ChartOpts;
  showClock: boolean;
  showTrans: boolean;
  showGap?: boolean;
  showWall?: boolean;
  cursor?: number | null;
}) {
  const { w, h, x0, x1 } = opts;
  const { L, R, T, B, px, pyClock, pyTrans } = scales(opts);
  const inRange = (p: Pt) => p[0] >= x0 && p[0] <= x1;
  const clockT = CLOCK_TREND.filter(inRange);
  const transT = TRANS_TREND.filter(inRange);

  // the gap between the two trend lines after 2005
  const gapPath = useMemo(() => {
    const yrs: number[] = [];
    for (let y = 2005; y <= Math.min(x1, 2021); y += 0.5) yrs.push(y);
    const top = yrs.map((y) => `${px(y)},${pyTrans(interp(TRANS_TREND, y))}`);
    const bot = yrs.reverse().map((y) => `${px(y)},${pyClock(interp(CLOCK_TREND, y))}`);
    return `M${top.join(' L')} L${bot.join(' L')} Z`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x1]);

  const decadeTicks = [];
  for (let y = Math.ceil(x0 / 10) * 10; y <= x1; y += 10) decadeTicks.push(y);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="trend-chart">
      <HatchDefs id="-tc" />
      {/* axes */}
      <line x1={L} y1={h - B} x2={w - R} y2={h - B} stroke="currentColor" strokeWidth="2" />
      <line x1={L} y1={T} x2={L} y2={h - B} stroke="currentColor" strokeWidth="2" />
      {decadeTicks.map((y) => (
        <g key={y}>
          <line x1={px(y)} y1={h - B} x2={px(y)} y2={h - B + 10} stroke="currentColor" strokeWidth="2" />
          <text x={px(y)} y={h - B + 40} textAnchor="middle" className="chart-tick">{y}</text>
        </g>
      ))}
      {/* clock axis (left) */}
      {[0.1, 1, 10, 100, 1000, 10000].map((m) => (
        <text key={m} x={L - 14} y={pyClock(m) + 7} textAnchor="end" className="chart-tick" opacity={showClock ? 1 : 0.15}>
          {m >= 1000 ? `${m / 1000} GHz` : m >= 1 ? `${m} MHz` : '100 kHz'}
        </text>
      ))}
      {/* transistor axis (right) */}
      {showTrans &&
        [1, 1e2, 1e4, 1e6, 1e8].filter((k) => pyTrans(k) > 20 && pyTrans(k) < h - B + 5).map((k) => (
          <text key={k} x={w - R + 14} y={pyTrans(k) + 7} className="chart-tick">
            {k >= 1e6 ? `${k / 1e6}B` : k >= 1e3 ? `${k / 1e3}M` : `${k}k`}
          </text>
        ))}

      {showWall && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <rect x={px(2004.5)} y={T} width={px(2006) - px(2004.5)} height={h - T - B} fill="url(#crosshatch-tc)" opacity="0.55" />
          <text x={px(2006) + 12} y={h - B - 14} className="chart-label wall-label">~2005</text>
        </motion.g>
      )}
      {showGap && <motion.path d={gapPath} fill="url(#hatch-tc)" initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ duration: 1 }} />}

      {/* clock: scattered chips + trend */}
      {showClock && (
        <g>
          {FREQUENCY_MHZ.filter(inRange).map(([x, y], i) => (
            <circle key={i} cx={px(x)} cy={pyClock(y)} r="4" fill="currentColor" opacity="0.35" />
          ))}
          <motion.polyline points={poly(clockT, px, pyClock)} fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
          {clockLabelAt ? (
            <text x={px(clockLabelAt) - 16} y={pyClock(interp(CLOCK_TREND, clockLabelAt)) - 24} textAnchor="end" className="series-label">clock speed</text>
          ) : (
            <text x={px(clockT[clockT.length - 1][0]) - 10} y={pyClock(clockT[clockT.length - 1][1]) + 44} textAnchor="end" className="series-label">clock speed</text>
          )}
        </g>
      )}
      {/* transistors */}
      {showTrans && (
        <g>
          {TRANSISTORS_K.filter(inRange).map(([x, y], i) => (
            <rect key={i} x={px(x) - 3.5} y={pyTrans(y) - 3.5} width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
          ))}
          <motion.polyline points={poly(transT, px, pyTrans)} fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="14 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
          <text x={px(transT[transT.length - 1][0]) - 10} y={pyTrans(transT[transT.length - 1][1]) - 18} textAnchor="end" className="series-label">transistors per chip</text>
        </g>
      )}

      {cursor != null && (
        <g>
          <line x1={px(cursor)} y1={T} x2={px(cursor)} y2={h - B} stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
          {showClock && <circle cx={px(cursor)} cy={pyClock(interp(CLOCK_TREND, cursor))} r="10" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />}
          {showTrans && <circle cx={px(cursor)} cy={pyTrans(interp(TRANS_TREND, cursor))} r="10" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />}
        </g>
      )}
    </svg>
  );
}

function YearScrubber({ year, setYear, showTrans, min = 1972, max = 2021 }: { year: number; setYear: (y: number) => void; showTrans: boolean; min?: number; max?: number }) {
  return (
    <div className="scrubber" data-interactive>
      <div className="control">
        <label>Year</label>
        <input type="range" min={min} max={max} step={0.5} value={year} onChange={(e) => setYear(+e.target.value)} />
        <span className="num scrub-year">{Math.floor(year)}</span>
      </div>
      <div className="scrub-read">
        <span>
          clock <b className="num">{fmtHz(interp(CLOCK_TREND, year))}</b>
        </span>
        {showTrans && (
          <span>
            transistors <b className="num">{fmtCount(interp(TRANS_TREND, year))}</b>
          </span>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   II.2  The free lunch: clock speeds rocketing up, 1971 → 2004
   ===================================================================== */

export function FreeLunch({ step, explore }: SlideProps) {
  const [year, setYear] = useState<number | null>(null);
  return (
    <Slide kicker="II · The free lunch" title="Clock speed, 1971 → 2004">
      <div className="lunch">
        <div>
          <TrendChart opts={{ x0: 1970, x1: 2005, w: 1080, h: 600 }} showClock showTrans={false} cursor={year} clockLabelAt={1994} />
          <div className="credit">{TREND_CREDIT}</div>
        </div>
        <div className="lunch-side">
          <Reveal show={step >= 1} className="lunch-text">
            <p>If you were a programmer in the 1990s, you didn't have to do <i>anything</i>.</p>
            <ol>
              <li>Write slow code.</li>
              <li>Wait eighteen months.</li>
              <li>New chip: your code is now twice as fast.</li>
            </ol>
            <div className="lunch-big">The Free Lunch</div>
          </Reveal>
          {(explore || year !== null) && <YearScrubber year={year ?? 1990} setYear={setYear} showTrans={false} max={2004} />}
        </div>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.6  The gap: clocks hit the wall, transistors keep climbing
   ===================================================================== */

export function TheGap({ step, explore }: SlideProps) {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(null), [step]);
  return (
    <Slide kicker="II · The fire" title={step >= 2 ? 'The most important picture in computing' : 'Clock speed vs transistors'}>
      <div className="gap">
        <TrendChart opts={{ x0: 1970, x1: 2022, w: 1660, h: 560, top: 5.2 }} showClock showTrans={step >= 1} showWall={step >= 2} showGap={step >= 2} cursor={year} />
        <div className="gap-foot">
          <Reveal show={step >= 2} className="gap-text">
            We still get <b>more transistors</b> every year. We just can't make them go <b>faster</b>.
          </Reveal>
          <div className="gap-right">
            {(explore || year !== null) && <YearScrubber year={year ?? 2005} setYear={setYear} showTrans={step >= 1} />}
            <div className="credit">{TREND_CREDIT}</div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* =====================================================================
   II.4  Gelsinger, 2001: power density heading for the sun
   ===================================================================== */

// rough reading of the chart Pat Gelsinger showed at ISSCC 2001 (W/cm²)
const PD_HISTORY: [number, number, string][] = [
  [1971, 2, '4004'],
  [1974, 3, '8080'],
  [1978, 4.5, '8086'],
  [1982, 6, '286'],
  [1985, 8, '386'],
  [1989, 12, '486'],
  [1993, 18, 'Pentium'],
  [1997, 32, 'Pentium II'],
  [2000, 60, 'Pentium 4'],
];
const PD_PROJECTION: [number, number][] = [
  [2000, 60],
  [2005, 150],
  [2010, 1000],
  [2015, 10000],
];
const PD_REFS = [
  { v: 10, label: 'Hot plate' },
  { v: 100, label: 'Nuclear reactor' },
  { v: 1000, label: 'Rocket nozzle' },
  { v: 10000, label: "Surface of the sun" },
];

function RefGlyph({ i, x, y }: { i: number; x: number; y: number }) {
  // small engraved glyphs: coil, atom, nozzle, sun
  if (i === 0)
    return <path transform={`translate(${x} ${y})`} d="M-22 0 q6 -12 12 0 t12 0 t12 0 t12 0" fill="none" stroke="currentColor" strokeWidth="3" />;
  if (i === 1)
    return (
      <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse rx="22" ry="8" />
        <ellipse rx="22" ry="8" transform="rotate(60)" />
        <ellipse rx="22" ry="8" transform="rotate(-60)" />
        <circle r="4" fill="currentColor" />
      </g>
    );
  if (i === 2)
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M-8 -16 H8 L18 14 H-18 Z" fill="url(#crosshatch-pd)" stroke="currentColor" strokeWidth="2" />
        <path d="M-12 18 q4 10 0 18 M0 18 q5 12 0 22 M12 18 q4 10 0 18" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
    );
  return (
    <g transform={`translate(${x} ${y})`} stroke="currentColor" strokeWidth="2.5">
      <circle r="13" fill="var(--paper)" />
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * Math.PI * 2;
        return <line key={k} x1={Math.cos(a) * 18} y1={Math.sin(a) * 18} x2={Math.cos(a) * 26} y2={Math.sin(a) * 26} />;
      })}
    </g>
  );
}

export function PowerDensity({ step }: SlideProps) {
  const W = 1660;
  const H = 600;
  const L = 120;
  const R = 330;
  const T = 30;
  const B = 60;
  const px = (yr: number) => L + ((yr - 1970) / (2016 - 1970)) * (W - L - R);
  const py = (v: number) => T + (1 - Math.log10(v) / 4.2) * (H - T - B);
  return (
    <Slide kicker="II · The fire · Intel, 2001" title={<>“If we keep going like this…”</>}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="pd-chart">
        <HatchDefs id="-pd" />
        <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="currentColor" strokeWidth="2" />
        <line x1={L} y1={T} x2={L} y2={H - B} stroke="currentColor" strokeWidth="2" />
        {[1970, 1980, 1990, 2000, 2010].map((y) => (
          <text key={y} x={px(y)} y={H - B + 40} textAnchor="middle" className="chart-tick">{y}</text>
        ))}
        {[1, 10, 100, 1000, 10000].map((v) => (
          <text key={v} x={L - 14} y={py(v) + 7} textAnchor="end" className="chart-tick">{v.toLocaleString()}</text>
        ))}
        <text x={L + 10} y={T + 4} className="chart-axis">watts per cm² of chip</text>

        {PD_REFS.map((r, i) => (
          <motion.g key={r.label} initial={false} animate={{ opacity: step >= i ? 1 : 0 }} transition={{ duration: 0.7 }}>
            <line x1={L} y1={py(r.v)} x2={W - R + 20} y2={py(r.v)} stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 6" />
            <RefGlyph i={i} x={W - R + 60} y={py(r.v)} />
            <text x={W - R + 100} y={py(r.v) + 10} className="pd-ref">{r.label}</text>
          </motion.g>
        ))}

        <polyline points={PD_HISTORY.map(([x, v]) => `${px(x)},${py(v)}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="5" />
        {PD_HISTORY.map(([x, v, name], i) => (
          <g key={name}>
            <circle cx={px(x)} cy={py(v)} r="7" fill="currentColor" />
            {i % 2 === 0 && (
              <text x={px(x)} y={py(v) + 34} textAnchor="middle" className="pd-chip">{name}</text>
            )}
          </g>
        ))}
        <motion.polyline
          points={PD_PROJECTION.filter((_, i) => i <= Math.max(1, step)).map(([x, v]) => `${px(x)},${py(v)}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray="12 10"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
        />
        {step >= 1 && <circle cx={px(PD_PROJECTION[Math.min(step, 3)][0])} cy={py(PD_PROJECTION[Math.min(step, 3)][1])} r="11" fill="var(--paper)" stroke="currentColor" strokeWidth="4" />}
      </svg>
      <Reveal show={step >= 3} className="pd-quote">
        By 2005, as hot as a nuclear reactor. By 2010, a rocket nozzle. By 2015, <b>the surface of the sun.</b>
        <span className="caption"> (Pat Gelsinger, Intel CTO, 2001, roughly)</span>
      </Reveal>
    </Slide>
  );
}
