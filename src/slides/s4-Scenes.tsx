import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal } from './common';
import { STATION_NAMES } from './s3-Stations';

/* ======================================================================
   November 2006: the GeForce 8800 GTX reveal
   ====================================================================== */
function Card() {
  return (
    <svg width="980" height="420" viewBox="0 0 980 420">
      <HatchDefs id="-gc" />
      {/* bracket */}
      <rect x="10" y="20" width="34" height="380" fill="url(#lines-gc)" stroke="var(--ink)" strokeWidth="3" />
      {[70, 150, 230].map((y) => (
        <rect key={y} x="18" y={y} width="18" height="56" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      ))}
      {/* shroud */}
      <rect x="44" y="30" width="900" height="300" rx="10" fill="url(#crosshatch-gc)" stroke="var(--ink)" strokeWidth="4" />
      <rect x="70" y="56" width="560" height="248" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      {Array.from({ length: 26 }, (_, k) => (
        <line key={k} x1={84 + k * 21} y1="70" x2={84 + k * 21} y2="290" stroke="var(--ink)" strokeWidth="2" />
      ))}
      {/* fan */}
      <circle cx="780" cy="180" r="128" fill="var(--paper)" stroke="var(--ink)" strokeWidth="4" />
      <motion.g style={{ originX: '780px', originY: '180px' }} animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
        {Array.from({ length: 9 }, (_, k) => (
          <path key={k} d="M780 180 C 800 140, 850 110, 880 130 C 850 150, 815 165, 780 180 Z" fill="url(#hatch-gc)" stroke="var(--ink)" strokeWidth="2" transform={`rotate(${k * 40} 780 180)`} />
        ))}
      </motion.g>
      <circle cx="780" cy="180" r="30" fill="var(--ink)" />
      <text x="780" y="186" textAnchor="middle" fill="var(--paper)" fontFamily="var(--display)" fontSize="16" fontWeight="600">G80</text>
      {/* board + gold fingers */}
      <rect x="44" y="330" width="900" height="36" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      {Array.from({ length: 40 }, (_, k) => (
        <rect key={k} x={260 + k * 12} y="366" width="8" height="28" fill="var(--ink)" />
      ))}
      <text x="96" y="356" fontFamily="var(--display)" fontSize="18" letterSpacing="4">GEFORCE 8800 GTX</text>
    </svg>
  );
}

export function Reveal8800({ step }: SlideProps) {
  return (
    <div className="slide g80">
      <div className="g80-stage">
        <motion.div className="g80-rays" initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 1.2 }}>
          <svg width="1660" height="760" viewBox="0 0 1660 760">
            {Array.from({ length: 23 }, (_, k) => {
              const a = Math.PI * (0.1 + (k / 22) * 0.8);
              return <line key={k} x1="830" y1="380" x2={830 + Math.cos(a) * 1200} y2={380 - Math.sin(a) * 1200} stroke="var(--ink)" strokeWidth={k % 2 ? 1 : 2.5} opacity="0.35" />;
            })}
          </svg>
        </motion.div>
        <motion.div className="g80-card" initial={false} animate={step >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.92 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
          <Card />
        </motion.div>
        <motion.div className="g80-curtain" initial={false} animate={{ y: step >= 1 ? '-102%' : '0%' }} transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}>
          <div className="g80-curtain-text">MMVI</div>
        </motion.div>
      </div>
      <div className="g80-text">
        <Reveal show={step >= 1}>
          <div className="g80-name">GeForce 8800 GTX</div>
          <div className="g80-sub">November 2006 · the G80, codenamed “Tesla”</div>
        </Reveal>
        <Reveal show={step >= 2} className="g80-punch">
          On the outside: just another gaming card. On the inside: <b>a completely different idea.</b>
        </Reveal>
      </div>
    </div>
  );
}

/* ======================================================================
   The assembly line dissolves into 128 identical workers
   ====================================================================== */
const COLS = 16;
const ROWS = 8;
const N = COLS * ROWS;
const AREA_W = 1660;
const CELL_W = 86;
const CELL_H = 64;
const GRID_X0 = (AREA_W - COLS * CELL_W) / 2;
const GRID_Y0 = 40;
const ST_W = 300;
const ST_X = (i: number) => 130 + i * 370;

type Task = 'none' | 'triangle' | 'pixel' | 'galaxy';

function Glyph({ task }: { task: Task }) {
  if (task === 'none') return null;
  return (
    <svg className="w-glyph" width="22" height="22" viewBox="0 0 22 22">
      {task === 'triangle' && <polygon points="11,2 20,19 2,19" fill="none" stroke="var(--ink)" strokeWidth="2" />}
      {task === 'pixel' && <rect x="4" y="4" width="14" height="14" fill="var(--ink)" />}
      {task === 'galaxy' && <path d="M11 11 m0 0 a2 2 0 1 1 3 1 a5 5 0 1 1 -7 -4 a8 8 0 1 1 9 11" fill="none" stroke="var(--ink)" strokeWidth="1.8" />}
    </svg>
  );
}

export function Worker({ busy = true }: { busy?: boolean }) {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34">
      <circle cx="14" cy="8" r="6" fill={busy ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="2" />
      <path d="M3 33 Q3 16 14 16 Q25 16 25 33 Z" fill={busy ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

const SURE = [
  { task: 'triangle' as Task, q: 'Drawing a triangle?', a: 'Sure.' },
  { task: 'pixel' as Task, q: 'Lighting a pixel?', a: 'Sure.' },
  { task: 'galaxy' as Task, q: 'Simulating a galaxy?', a: '…Also sure.' },
];

export function Dissolve({ step, explore }: SlideProps) {
  const [manual, setManual] = useState<Task | null>(null);
  useEffect(() => setManual(null), [step]);
  const dissolved = step >= 1;
  const task: Task = manual ?? (step >= 2 ? SURE[Math.min(step - 2, 2)].task : 'none');
  return (
    <div className="slide dissolve">
      <div className="slide-kicker">G80 · inside the chip</div>
      <h2 className="slide-h">{dissolved ? 'Not a factory. An army.' : 'The old assembly line…'}</h2>
      <div className="dissolve-area">
        {STATION_NAMES.map((n, i) => (
          <motion.div key={n} className="d-station" style={{ left: ST_X(i), width: ST_W }} initial={false} animate={dissolved ? { opacity: 0, scale: 1.25, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.8 }}>
            {n}
          </motion.div>
        ))}
        {Array.from({ length: N }, (_, k) => {
          const st = k % 4;
          const col = k % COLS, row = Math.floor(k / COLS);
          const from = { x: ST_X(st) + ST_W / 2 - 14 + ((k * 37) % 60) - 30, y: 190 + ((k * 53) % 40) - 20 };
          const to = { x: GRID_X0 + col * CELL_W + CELL_W / 2 - 14, y: GRID_Y0 + row * CELL_H };
          return (
            <motion.div
              key={k}
              className="d-worker"
              initial={false}
              animate={dissolved ? { x: to.x, y: to.y, opacity: 1, scale: 1 } : { x: from.x, y: from.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 1.1, delay: dissolved ? 0.3 + ((k * 7) % 40) / 80 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <Worker />
              <motion.div key={task} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: (k % 16) * 0.015 + Math.floor(k / 16) * 0.02 }}>
                <Glyph task={task} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <div className="dissolve-text">
        <Reveal show={dissolved && step < 2 && !manual} className="d-line">
          <b>128</b> identical, general-purpose workers. Any worker can do any job.
        </Reveal>
        {(step >= 2 || manual) && (
          <div className="d-sure">
            {SURE.map((s, i) => (
              <Reveal key={s.task} show={manual ? manual === s.task : step >= 2 + i} className={`d-sure-item ${task === s.task ? 'cur' : ''}`}>
                {s.q} <b>{s.a}</b>
              </Reveal>
            ))}
          </div>
        )}
      </div>
      {(explore || step >= 1) && dissolved && (
        <div className="dissolve-ctl" data-interactive>
          {SURE.map((s) => (
            <button key={s.task} className={`btn ${task === s.task ? 'on' : ''}`} onClick={() => setManual(s.task)}>
              {s.task}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ======================================================================
   The bet: CUDA in every card; the stock falls; a highway with no cars
   ====================================================================== */
// NVIDIA share price, pre-split USD (approximate, for shape)
const STOCK: [number, number][] = [
  [2006.0, 18], [2006.25, 22], [2006.5, 17], [2006.75, 23], [2007.0, 31], [2007.25, 30], [2007.5, 34], [2007.8, 37],
  [2008.0, 27], [2008.25, 20], [2008.5, 19], [2008.75, 10], [2008.9, 6], [2009.0, 8], [2009.25, 10], [2009.5, 13],
];

export function Bet({ step }: SlideProps) {
  const cw = 900, ch = 420, x0 = 2006, x1 = 2009.5;
  const px = (x: number) => 60 + ((x - x0) / (x1 - x0)) * (cw - 90);
  const py = (y: number) => ch - 50 - (y / 40) * (ch - 90);
  const d = STOCK.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x)} ${py(y)}`).join(' ');
  const area = `${d} L${px(x1)} ${py(0)} L${px(x0)} ${py(0)} Z`;
  return (
    <div className="slide bet">
      <div className="slide-kicker">2006 – 2008 · the bet</div>
      <h2 className="slide-h">CUDA in every card. Even the cheap ones.</h2>
      <div className="bet-main">
        <div className="bet-left">
          <p className="lede">Gamers didn't need it. It made every chip bigger and more expensive.</p>
          <p className="lede">NVIDIA put it in anyway.</p>
          <Reveal show={step >= 2} className="bet-quote">Wall Street thought they were mad.</Reveal>
        </div>
        <div className="bet-chart">
          <svg width={cw} height={ch} viewBox={`0 0 ${cw} ${ch}`}>
            <HatchDefs id="-bt" />
            <line x1="60" y1={py(0)} x2={cw - 20} y2={py(0)} stroke="var(--ink)" strokeWidth="2" />
            {[2006, 2007, 2008, 2009].map((y) => (
              <g key={y}>
                <line x1={px(y)} y1={py(0)} x2={px(y)} y2={py(0) + 10} stroke="var(--ink)" strokeWidth="2" />
                <text x={px(y)} y={py(0) + 36} textAnchor="middle" fontFamily="var(--display)" fontSize="22">{y}</text>
              </g>
            ))}
            <motion.path d={area} fill="url(#lines-bt)" stroke="none" initial={false} animate={{ opacity: step >= 1 ? 0.5 : 0 }} transition={{ duration: 0.6, delay: step >= 1 ? 1.6 : 0 }} />
            <motion.path d={d} fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" initial={false} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 2, ease: 'easeInOut' }} />
            <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ delay: step >= 1 ? 1.9 : 0, duration: 0.5 }}>
              <line x1={px(2006.86)} y1={py(25) - 12} x2={px(2006.86)} y2={py(25) - 70} stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx={px(2006.86)} cy={py(25)} r="6" fill="var(--ink)" />
              <text x={px(2006.86)} y={py(25) - 80} textAnchor="middle" fontSize="22" fontStyle="italic">G80 + CUDA ship</text>
              <text x={px(2008.35)} y={py(4)} textAnchor="middle" fontFamily="var(--display)" fontWeight="600" fontSize="48" stroke="var(--paper)" strokeWidth="8" paintOrder="stroke">−80%</text>
            </motion.g>
          </svg>
          <div className="caption">NVIDIA share price, 2006–2009 (approximate)</div>
        </div>
      </div>
      <Reveal show={step >= 3} className="bet-road">
        <svg width="560" height="170" viewBox="0 0 560 170">
          <polygon points="200,10 360,10 560,170 0,170" fill="url(#bt-road)" stroke="var(--ink)" strokeWidth="2.5" />
          <defs>
            <pattern id="bt-road" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="0.9" fill="var(--ink)" />
            </pattern>
          </defs>
          {[0, 1, 2, 3, 4].map((k) => {
            const t0 = k / 5, t1 = t0 + 0.1;
            const y0 = 10 + t0 * 160, y1 = 10 + t1 * 160;
            return <polygon key={k} points={`${280 - 2 - t0 * 8},${y0} ${280 + 2 + t0 * 8},${y0} ${280 + 2 + t1 * 8},${y1} ${280 - 2 - t1 * 8},${y1}`} fill="var(--paper)" stroke="var(--ink)" strokeWidth="1" />;
          })}
        </svg>
        <div className="bet-road-text">They were building a highway before anyone had a car.</div>
      </Reveal>
    </div>
  );
}

/* ======================================================================
   2010: TOP500 #1 is Tianhe-1A, on 7,168 NVIDIA GPUs
   ====================================================================== */
const GPUS = 7168;
const GC = 128; // 128 × 56 = 7,168
const GR = 56;
const GS = 7;

export function Tianhe({ step, active }: SlideProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [n, setN] = useState(step >= 1 ? GPUS : 0);

  useEffect(() => {
    if (step < 1) {
      setN(0);
      return;
    }
    if (!active) {
      setN(GPUS);
      return;
    }
    setN(0);
    let k = 0;
    const t = setInterval(() => {
      k = Math.min(GPUS, k + 180);
      setN(k);
      if (k >= GPUS) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [step >= 1, active]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const g = ref.current!.getContext('2d')!;
    g.fillStyle = '#f6f3ec';
    g.fillRect(0, 0, GC * GS, GR * GS);
    g.fillStyle = '#000000';
    for (let i = 0; i < n; i++) {
      const x = (i % GC) * GS, y = Math.floor(i / GC) * GS;
      g.fillRect(x + 1, y + 1, GS - 2, GS - 3);
    }
  }, [n]);

  return (
    <div className="slide tianhe">
      <div className="slide-kicker">TOP500 · November 2010</div>
      <h2 className="slide-h">The fastest computer on Earth</h2>
      <div className="tianhe-main">
        <ol className="board">
          <li className="first">
            <span className="rank">I</span>
            <span className="name">
              Tianhe-1A <em>China</em>
            </span>
            <span className="pf">2.57 PF</span>
          </li>
          <li>
            <span className="rank">II</span>
            <span className="name">
              Jaguar <em>USA</em>
            </span>
            <span className="pf">1.76 PF</span>
          </li>
          <li>
            <span className="rank">III</span>
            <span className="name">
              Nebulae <em>China</em>
            </span>
            <span className="pf">1.27 PF</span>
          </li>
        </ol>
        <div className="tianhe-gpus">
          <div className="plate tianhe-plate">
            <canvas ref={ref} width={GC * GS} height={GR * GS} />
          </div>
          <Reveal show={step >= 1} className="tianhe-count">
            <span className="num">{n.toLocaleString('en-GB')}</span> NVIDIA GPUs
          </Reveal>
        </div>
      </div>
      <div className="tianhe-text">
        <Reveal show={step >= 2}>The gaming card had become a scientific instrument.</Reveal>
        <Reveal show={step >= 3} className="tianhe-punch">
          But the real car hadn't arrived yet.
        </Reveal>
      </div>
    </div>
  );
}
