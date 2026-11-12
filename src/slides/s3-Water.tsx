import { useEffect, useRef, useState } from 'react';
import type { SlideProps } from '../deck/types';
import { Reveal } from './common';

/*
 * GeForce 3's pixel shader, demonstrated: the same pond drawn as engraving lines.
 * Fixed-function → flat plastic water. Pixel shader → every point runs a tiny program
 * (a sine of the distance to each raindrop), so the water ripples.
 * Click the water to drop a stone.
 *   step 0 flat · step 1 shader on · step 2 the Xbox fact
 */

const W = 1000;
const H = 520;
const INK = '#000000';
const PAPER = '#f6f3ec';

interface Drop {
  x: number;
  y: number;
  t0: number;
}

function draw(g: CanvasRenderingContext2D, shader: boolean, drops: Drop[], t: number) {
  g.fillStyle = PAPER;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = INK;
  const rows = 64;
  for (let r = 0; r < rows; r++) {
    // perspective: lines bunch up towards the horizon
    const v = r / rows;
    const y0 = 20 + Math.pow(v, 1.6) * (H - 30);
    const amp = 0.4 + v * 1.6;
    g.beginPath();
    for (let x = 0; x <= W; x += 5) {
      let d = 0;
      if (shader) {
        for (const dp of drops) {
          const age = t - dp.t0;
          if (age < 0 || age > 6) continue;
          const dx = x - dp.x, dy = (y0 - dp.y) * 2.2;
          const rr = Math.hypot(dx, dy);
          const front = age * 160;
          const env = Math.exp(-Math.pow((rr - front) / 70, 2)) * Math.exp(-age * 0.55);
          d += Math.sin(rr * 0.09 - age * 9) * 9 * env;
        }
        d += Math.sin(x * 0.02 + t * 1.3 + r * 0.6) * 0.8 * amp;
      }
      const y = y0 + d * amp;
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.lineWidth = 0.7 + v * 1.6;
    g.stroke();
  }
}

export function Water({ step, active, explore }: SlideProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [shaderOverride, setShaderOverride] = useState<boolean | null>(null);
  const shader = shaderOverride ?? step >= 1;
  const drops = useRef<Drop[]>([]);
  const t0 = useRef(performance.now());

  // stepping resets any manual toggle
  useEffect(() => setShaderOverride(null), [step]);

  useEffect(() => {
    const g = ref.current!.getContext('2d')!;
    const now = () => (performance.now() - t0.current) / 1000;
    if (shader && drops.current.length === 0) {
      // a few drops already in flight, so even a still frame shows ripples
      drops.current = [
        { x: 300, y: 300, t0: now() - 1.6 },
        { x: 720, y: 400, t0: now() - 0.9 },
        { x: 560, y: 180, t0: now() - 2.4 },
      ];
    }
    let raf = 0;
    let nextDrop = now() + 1.4;
    const frame = () => {
      const t = now();
      if (shader && t > nextDrop) {
        drops.current.push({ x: 120 + Math.random() * (W - 240), y: 160 + Math.random() * (H - 200), t0: t });
        drops.current = drops.current.filter((d) => t - d.t0 < 6);
        nextDrop = t + 1.2 + Math.random() * 1.2;
      }
      draw(g, shader, drops.current, t);
      if (active) raf = requestAnimationFrame(frame);
    };
    frame();
    return () => cancelAnimationFrame(raf);
  }, [shader, active]);

  return (
    <div className="slide water">
      <div className="slide-kicker">GeForce 3 · the pixel shader</div>
      <h2 className="slide-h">Same pond. One tiny program per pixel.</h2>
      <div className="water-main">
        <div className="water-pane">
          <div className="plate water-plate">
            <canvas
              ref={ref}
              width={W}
              height={H}
              onPointerDown={(e) => {
                const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
                drops.current.push({ x, y, t0: (performance.now() - t0.current) / 1000 });
                if (!shader) setShaderOverride(true);
              }}
            />
          </div>
          <div className="water-toggle" data-interactive>
            <button className={`btn ${!shader ? 'on' : ''}`} onClick={() => setShaderOverride(false)}>
              Fixed-function
            </button>
            <button className={`btn ${shader ? 'on' : ''}`} onClick={() => setShaderOverride(true)}>
              Pixel shader
            </button>
            <span className="hint">{explore ? 'click the water to drop a stone' : shader ? 'every point is running a little program' : 'flat, plastic, take it or leave it'}</span>
          </div>
        </div>
        <div className="water-side">
          <div className={`code-card ${shader ? '' : 'dim'}`}>
            <div className="code-title">pixel shader · runs for EVERY pixel</div>
            <pre>{`colour water(pixel p) {
  r = distance(p, raindrop);
  wave = sin(r * 40 - time * 6);
  return paper + ink * wave;
}`}</pre>
          </div>
          <Reveal show={step >= 2} className="card xbox-card">
            <div className="xbox-kicker">Fun fact</div>
            <div className="xbox-text">
              The chip inside the original <b>Xbox</b> (2001) was a cousin of the GeForce 3.
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
