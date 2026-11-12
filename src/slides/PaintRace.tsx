import { useEffect, useRef, useState } from 'react';
import type { SlideProps } from '../deck/types';
import { PLATE, Reveal } from './common';

/*
 * The cold open: one painter vs 1,024 painters reproducing the seminar engraving.
 * The image is a COLS × ROWS grid of cells; each cell is drawn as engraving hatch
 * lines whose weight follows the darkness of the original.
 *
 * step 0: two blank plates   step 1: the lone painter starts   step 2: the 1,024 strike
 *
 * Explore mode adds a painter-count slider (1 … 1,024) and a restart button. There every
 * painter works at the same speed as the lone one, so the speed-up you see is the real ratio.
 */

const COLS = 192;
const ROWS = 128;
const CELL = 4; // px per cell → 768 × 512 canvas
const W = COLS * CELL;
const H = ROWS * CELL;
const N = COLS * ROWS;
// parallel painters: a 32 × 32 grid of painters, each owns a 6 × 4 block of cells
const PC = 32;
const PR = 32;
const BW = COLS / PC; // 6
const BH = ROWS / PR; // 4
const PER = BW * BH; // 24 cells each
const PAR_TICK_MS = 50;
const SERIAL_PER_FRAME = 3; // the lone painter: ~180 cells/s, ~2 min for the whole plate

/** painter counts on the explore slider: all squares, so painters tile the plate evenly */
const COUNTS = [1, 4, 16, 64, 256, 1024];
const ROMAN: Record<number, string> = { 1: 'I', 4: 'IV', 16: 'XVI', 64: 'LXIV', 256: 'CCLVI', 1024: 'MXXIV' };
const WORDS: Record<number, string> = {
  1: 'one painter',
  4: 'four painters',
  16: 'sixteen painters',
  64: 'sixty-four painters',
  256: 'two hundred and fifty-six painters',
  1024: 'one thousand and twenty-four painters',
};

const INK = '#000000';
const PAPER = '#f6f3ec';

function useDarkness() {
  const [d, setD] = useState<Float32Array | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = PLATE;
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = COLS;
      c.height = ROWS;
      const g = c.getContext('2d')!;
      // crop the plate to 3:2, trimming the margin
      const sw = img.width * 0.96;
      const sh = (sw * 2) / 3;
      g.drawImage(img, img.width * 0.02, (img.height - sh) / 2, sw, sh, 0, 0, COLS, ROWS);
      const px = g.getImageData(0, 0, COLS, ROWS).data;
      const out = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const l = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
        out[i] = Math.min(1, Math.max(0, (1 - l - 0.08) * 1.25)); // a bit of contrast
      }
      setD(out);
    };
  }, []);
  return d;
}

/** draw one cell as two hatch lines */
function drawCell(g: CanvasRenderingContext2D, dark: Float32Array, i: number) {
  const x = (i % COLS) * CELL;
  const y = Math.floor(i / COLS) * CELL;
  const w = dark[i] * 1.95;
  if (w < 0.12) return;
  g.fillStyle = INK;
  g.fillRect(x, y + 1 - w / 2, CELL, w);
  g.fillRect(x, y + 3 - w / 2, CELL, w);
}

function clear(c: HTMLCanvasElement | null) {
  const g = c?.getContext('2d');
  if (!g || !c) return;
  g.fillStyle = PAPER;
  g.fillRect(0, 0, c.width, c.height);
}

function clearOverlay(c: HTMLCanvasElement | null) {
  c?.getContext('2d')?.clearRect(0, 0, W, H);
}

export function PaintRace({ step, active, explore, heading }: SlideProps & { heading?: string }) {
  const dark = useDarkness();
  const serialRef = useRef<HTMLCanvasElement>(null);
  const serialOv = useRef<HTMLCanvasElement>(null);
  const parRef = useRef<HTMLCanvasElement>(null);
  const parOv = useRef<HTMLCanvasElement>(null);
  const [serialDone, setSerialDone] = useState(0);
  const [serialT, setSerialT] = useState(0);
  const [parDone, setParDone] = useState(0);
  const [parT, setParT] = useState(0);
  const [painters, setPainters] = useState(1024);
  const [run, setRun] = useState(0); // bump to restart both lanes

  // reset when stepping back to the start, or when the slide is left and re-entered
  // (also on "Race again" / a new painter count)
  const lastRun = useRef({ run, painters });
  useEffect(() => {
    const restarted = lastRun.current.run !== run || lastRun.current.painters !== painters;
    lastRun.current = { run, painters };
    if (step === 0 || !active || restarted) {
      clear(serialRef.current);
      clear(parRef.current);
      clearOverlay(serialOv.current);
      clearOverlay(parOv.current);
      setSerialDone(0);
      setSerialT(0);
      setParDone(0);
      setParT(0);
    }
  }, [step, active, run, painters]);

  // the lone painter: one cell per frame, left to right, top to bottom
  useEffect(() => {
    if (!dark || !active || step < 1) return;
    const g = serialRef.current!.getContext('2d')!;
    const ov = serialOv.current!.getContext('2d')!;
    let i = 0;
    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      if (i < N) {
        for (let k = 0; k < SERIAL_PER_FRAME && i < N; k++) drawCell(g, dark, i++);
        ov.clearRect(0, 0, W, H);
        const x = (i % COLS) * CELL + CELL / 2;
        const y = Math.floor(i / COLS) * CELL + CELL / 2;
        ov.fillStyle = INK;
        ov.beginPath();
        ov.arc(x, y, 5, 0, Math.PI * 2);
        ov.fill();
        ov.strokeStyle = INK;
        ov.lineWidth = 1.2;
        ov.beginPath();
        ov.arc(x, y, 12, 0, Math.PI * 2);
        ov.stroke();
        if (i % 30 === 0) {
          setSerialDone(i);
          setSerialT(performance.now() - t0);
        }
        raf = requestAnimationFrame(frame);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark, active, step >= 1, run, painters]);

  // explore mode: P painters, each painting at the lone painter's speed (fair race)
  useEffect(() => {
    if (!explore || !dark || !active || step < 2) return;
    const g = parRef.current!.getContext('2d')!;
    const ov = parOv.current!.getContext('2d')!;
    const side = Math.sqrt(painters);
    const bw = COLS / side;
    const bh = ROWS / side;
    const per = bw * bh;
    let t = 0;
    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      ov.clearRect(0, 0, W, H);
      if (t >= per) {
        setParDone(N);
        setParT(performance.now() - t0);
        return;
      }
      ov.fillStyle = INK;
      ov.strokeStyle = INK;
      for (let k = 0; k < SERIAL_PER_FRAME && t < per; k++, t++) {
        const lx = t % bw;
        const ly = Math.floor(t / bw);
        for (let pr = 0; pr < side; pr++) for (let pc = 0; pc < side; pc++) drawCell(g, dark, (pr * bh + ly) * COLS + pc * bw + lx);
      }
      // where each painter is now
      const lx = t % bw;
      const ly = Math.floor(t / bw);
      for (let pr = 0; pr < side; pr++) {
        for (let pc = 0; pc < side; pc++) {
          const x = (pc * bw + lx) * CELL + CELL / 2;
          const y = (pr * bh + ly) * CELL + CELL / 2;
          if (painters <= 64) {
            ov.beginPath();
            ov.arc(x, y, 5, 0, Math.PI * 2);
            ov.fill();
            ov.beginPath();
            ov.arc(x, y, 12, 0, Math.PI * 2);
            ov.stroke();
          } else ov.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
      if (t % 30 < SERIAL_PER_FRAME || painters >= 256) {
        setParDone(Math.min(N, t * painters));
        setParT(performance.now() - t0);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explore, dark, active, step >= 2, run, painters]);

  // the 1,024: every painter paints one cell of its own block per tick
  useEffect(() => {
    if (explore || !dark || !active || step < 2) return;
    const g = parRef.current!.getContext('2d')!;
    const ov = parOv.current!.getContext('2d')!;
    let t = 0;
    const t0 = performance.now();
    const tick = () => {
      ov.clearRect(0, 0, W, H);
      if (t >= PER) {
        setParDone(N);
        setParT(performance.now() - t0);
        return;
      }
      const lx = t % BW;
      const ly = Math.floor(t / BW);
      ov.fillStyle = INK;
      for (let pr = 0; pr < PR; pr++) {
        for (let pc = 0; pc < PC; pc++) {
          const cx = pc * BW + lx;
          const cy = pr * BH + ly;
          drawCell(g, dark, cy * COLS + cx);
          ov.fillRect(cx * CELL, cy * CELL, 3, 3);
        }
      }
      t++;
      setParDone(t * PC * PR);
      setParT(performance.now() - t0);
      timer = window.setTimeout(tick, PAR_TICK_MS);
    };
    let timer = window.setTimeout(tick, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explore, dark, active, step >= 2]);

  const pct = (n: number) => `${((n / N) * 100).toFixed(n === N ? 0 : 1)}%`;

  const count = explore ? painters : 1024;

  return (
    <>
    {heading && (
      <div style={{ position: 'absolute', top: 66, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--display)', fontSize: 30, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
        {heading}
      </div>
    )}
    {explore && (
      <div className="control" data-interactive style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 5, whiteSpace: 'nowrap', background: 'var(--paper)', padding: '4px 18px' }}>
        <label htmlFor="painters">Painters</label>
        <input
          id="painters"
          type="range"
          min={0}
          max={COUNTS.length - 1}
          step={1}
          value={COUNTS.indexOf(painters)}
          onChange={(e) => setPainters(COUNTS[+e.target.value])}
          style={{ width: 360 }}
        />
        <span className="num" style={{ width: 90 }}>{painters.toLocaleString()}</span>
        <button className="btn" onClick={() => setRun((r) => r + 1)}>Race again</button>
        {step < 2 && <span className="hint">press › to start {step === 0 ? 'the lone painter' : 'the crowd'}</span>}
      </div>
    )}
    <div className="race">
      <div className="race-lane">
        <div className="race-head">
          <span className="race-count">I</span>
          <span className="race-name">one painter</span>
        </div>
        <div className="race-canvas plate">
          <canvas ref={serialRef} width={W} height={H} />
          <canvas ref={serialOv} width={W} height={H} className="overlay" />
        </div>
        <Reveal show={step >= 1} className="race-stats">
          <span>{pct(serialDone)}</span> painted · {(serialT / 1000).toFixed(1)} s
        </Reveal>
      </div>

      <div className="race-lane">
        <div className="race-head">
          <span className="race-count">{ROMAN[count]}</span>
          <span className="race-name">{WORDS[count]}</span>
        </div>
        <div className="race-canvas plate">
          <canvas ref={parRef} width={W} height={H} />
          <canvas ref={parOv} width={W} height={H} className="overlay" />
        </div>
        <Reveal show={step >= 2} className="race-stats">
          <span>{pct(parDone)}</span> painted · {(parT / 1000).toFixed(1)} s
        </Reveal>
      </div>
    </div>
    </>
  );
}
