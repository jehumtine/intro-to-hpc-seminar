import { useEffect, useRef, useState } from 'react';
import type { SlideProps } from '../deck/types';
import { Reveal } from './common';
import { Stations } from './s3-Stations';

/*
 * The Triangle Factory: a little Greek temple made of polygons goes down the fixed-function
 * pipeline. Each build step turns on one more station:
 *   0 raw pile of triangles · 1 Transform · 2 Lighting · 3 Rasterise · 4 Texture · 5 "hardware T&L"
 * Drag the picture to spin the temple; in explore mode a slider moves the sun.
 */

type V3 = [number, number, number];
type Kind = 'stone' | 'column' | 'roof';
interface Face {
  pts: V3[];
  kind: Kind;
  centre: V3; // centre of the part the face belongs to (to orient normals outwards)
}

const W = 900;
const H = 540;
const INK = '#000000';
const PAPER = '#f6f3ec';

// ---------- model ----------
function box(cx: number, cy: number, cz: number, w: number, h: number, d: number, kind: Kind): Face[] {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
  const c: V3 = [cx, cy, cz];
  const q = (...p: V3[]): Face => ({ pts: p, kind, centre: c });
  return [
    q([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]),
    q([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]),
    q([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]),
    q([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]),
    q([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]),
    q([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]),
  ];
}

function column(cx: number, cz: number, y0: number, y1: number, r: number): Face[] {
  const n = 6;
  const c: V3 = [cx, (y0 + y1) / 2, cz];
  const faces: Face[] = [];
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * Math.PI * 2, a1 = ((k + 1) / n) * Math.PI * 2;
    const p0: V3 = [cx + Math.cos(a0) * r, y0, cz + Math.sin(a0) * r];
    const p1: V3 = [cx + Math.cos(a1) * r, y0, cz + Math.sin(a1) * r];
    faces.push({ pts: [p0, p1, [p1[0], y1, p1[2]], [p0[0], y1, p0[2]]], kind: 'column', centre: c });
  }
  return faces;
}

function roof(w: number, d: number, yb: number, h: number): Face[] {
  const x0 = -w / 2, x1 = w / 2, z0 = -d / 2, z1 = d / 2, yt = yb + h;
  const c: V3 = [0, yb + h / 3, 0];
  return [
    { pts: [[x0, yb, z1], [x1, yb, z1], [0, yt, z1]], kind: 'roof', centre: c },
    { pts: [[x1, yb, z0], [x0, yb, z0], [0, yt, z0]], kind: 'roof', centre: c },
    { pts: [[x0, yb, z0], [x0, yb, z1], [0, yt, z1], [0, yt, z0]], kind: 'roof', centre: c },
    { pts: [[x1, yb, z1], [x1, yb, z0], [0, yt, z0], [0, yt, z1]], kind: 'roof', centre: c },
  ];
}

const MODEL: Face[] = (() => {
  const f: Face[] = [];
  f.push(...box(0, -1.15, 0, 4.6, 0.3, 2.8, 'stone'));
  f.push(...box(0, -0.85, 0, 4.2, 0.3, 2.4, 'stone'));
  for (const x of [-1.65, -0.55, 0.55, 1.65]) for (const z of [-0.85, 0.85]) f.push(...column(x, z, -0.7, 0.75, 0.17));
  f.push(...box(0, 0.92, 0, 4.2, 0.34, 2.4, 'stone'));
  f.push(...roof(4.4, 2.6, 1.09, 0.75));
  return f;
})();

// scattered 2D positions for the "raw pile of triangles" state
const SCATTER = MODEL.map((f, i) => {
  const rnd = (k: number) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const cx = 80 + rnd(1) * (W - 160), cy = 60 + rnd(2) * (H - 120), rot = rnd(3) * Math.PI * 2, s = 34 + rnd(4) * 26;
  return f.pts.map((_, k) => {
    const a = rot + (k / f.pts.length) * Math.PI * 2;
    return [cx + Math.cos(a) * s, cy + Math.sin(a) * s * 0.8] as [number, number];
  });
});

// ---------- maths ----------
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V3): V3 => {
  const l = Math.hypot(...a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

function rot(p: V3, ay: number, ax: number): V3 {
  const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
  const x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
  const y = p[1] * cx - z * sx, z2 = p[1] * sx + z * cx;
  return [x, y, z2];
}

interface Proj {
  pts: [number, number][];
  depth: number;
  bright: number;
  kind: Kind;
  visible: boolean;
}

function project(ay: number, light: V3): Proj[] {
  const ax = -0.32, dist = 7.6, f = 680;
  const out: Proj[] = [];
  for (const face of MODEL) {
    const wp = face.pts.map((p) => rot(p, ay, ax));
    const wc = rot(face.centre, ay, ax);
    let n = norm(cross(sub(wp[1], wp[0]), sub(wp[2], wp[0])));
    const fc = wp.reduce<V3>((a, p) => [a[0] + p[0] / wp.length, a[1] + p[1] / wp.length, a[2] + p[2] / wp.length], [0, 0, 0]);
    if (dot(n, sub(fc, wc)) < 0) n = [-n[0], -n[1], -n[2]];
    const cam: V3 = [0, 0, -dist];
    const visible = dot(n, sub(cam, fc)) > 0;
    const pts = wp.map((p) => {
      const z = p[2] + dist;
      return [W / 2 + (p[0] * f) / z, H / 2 + 34 - (p[1] * f) / z] as [number, number];
    });
    const bright = 0.18 + 0.82 * Math.max(0, dot(n, light));
    out.push({ pts, depth: fc[2], bright, kind: face.kind, visible });
  }
  return out.filter((p) => p.visible).sort((a, b) => b.depth - a.depth);
}

// ---------- drawing ----------
function poly(g: CanvasRenderingContext2D, pts: [number, number][]) {
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
  g.closePath();
}

const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function hatchFace(g: CanvasRenderingContext2D, p: Proj, fine: boolean) {
  g.save();
  poly(g, p.pts);
  g.fillStyle = PAPER;
  g.fill();
  g.clip();
  if (p.bright < 0.93) {
    const sp = (fine ? 1.6 : 2.4) + p.bright * (fine ? 7 : 10);
    const xs = p.pts.map((q) => q[0]), ys = p.pts.map((q) => q[1]);
    const x0 = Math.min(...xs) - 40, x1 = Math.max(...xs) + 40, y0 = Math.min(...ys), y1 = Math.max(...ys);
    g.strokeStyle = INK;
    g.lineWidth = fine ? 1 : 1.3;
    g.beginPath();
    const slant = p.kind === 'roof' ? 0.35 : p.kind === 'column' ? 0 : -0.12;
    for (let y = y0 - 40; y < y1 + 40; y += sp) {
      g.moveTo(x0, y);
      g.lineTo(x1, y + (x1 - x0) * slant);
    }
    g.stroke();
    // a second, crossed layer in deep shadow
    if (p.bright < 0.4) {
      g.beginPath();
      for (let x = x0; x < x1; x += sp * 1.3) {
        g.moveTo(x, y0 - 5);
        g.lineTo(x + 18, y1 + 5);
      }
      g.stroke();
    }
  }
  g.restore();
}

/** stone courses / column flutes, mapped across each quad: the "texture" */
function textureFace(g: CanvasRenderingContext2D, p: Proj) {
  if (p.pts.length !== 4) return;
  const [a, b, c, d] = p.pts;
  g.save();
  poly(g, p.pts);
  g.clip();
  g.strokeStyle = INK;
  g.lineWidth = 1.1;
  g.beginPath();
  if (p.kind === 'column') {
    for (let k = 1; k < 3; k++) {
      const t = k / 3;
      const p0 = lerp2(a, b, t), p1 = lerp2(d, c, t);
      g.moveTo(...p0);
      g.lineTo(...p1);
    }
  } else {
    const rows = p.kind === 'roof' ? 5 : 2;
    for (let r = 1; r < rows; r++) {
      const t = r / rows;
      g.moveTo(...lerp2(a, d, t));
      g.lineTo(...lerp2(b, c, t));
    }
    for (let r = 0; r < rows; r++) {
      const cols = 6;
      for (let k = 1; k < cols; k++) {
        const u = (k + (r % 2) * 0.5) / cols;
        if (u >= 1) continue;
        const top = lerp2(lerp2(a, b, u), lerp2(d, c, u), r / rows);
        const bot = lerp2(lerp2(a, b, u), lerp2(d, c, u), (r + 1) / rows);
        g.moveTo(...top);
        g.lineTo(...bot);
      }
    }
  }
  g.stroke();
  g.restore();
}

function render(g: CanvasRenderingContext2D, scratch: HTMLCanvasElement, stage: number, ay: number, light: V3, morph: number) {
  g.fillStyle = PAPER;
  g.fillRect(0, 0, W, H);
  const faces = project(ay, light);
  g.lineJoin = 'round';

  if (stage === 0 || morph < 1) {
    // the raw pile of triangles, morphing into place as Transform switches on
    const all = MODEL.map((_, i) => i);
    const full = projectAll(ay);
    g.strokeStyle = INK;
    g.lineWidth = 1.4;
    for (const i of all) {
      const from = SCATTER[i];
      const to = full[i];
      const pts = from.map((q, k) => lerp2(q, to[k], ease(morph)));
      poly(g, pts);
      g.stroke();
    }
    return;
  }
  if (stage === 1) {
    g.strokeStyle = INK;
    g.lineWidth = 1.4;
    for (const f of faces) {
      poly(g, f.pts);
      g.fillStyle = PAPER;
      g.fill();
      g.stroke();
    }
    return;
  }
  // lighting (stage ≥ 2)
  for (const f of faces) {
    hatchFace(g, f, stage >= 4);
    if (stage >= 4) textureFace(g, f);
    poly(g, f.pts);
    g.strokeStyle = INK;
    g.lineWidth = 1.5;
    g.stroke();
  }
  if (stage === 3) {
    // rasterise: resample into a coarse pixel grid, drawn as halftone dots
    const sg = scratch.getContext('2d', { willReadFrequently: true })!;
    sg.drawImage(g.canvas, 0, 0);
    const data = sg.getImageData(0, 0, W, H).data;
    const C = 15;
    g.fillStyle = PAPER;
    g.fillRect(0, 0, W, H);
    g.fillStyle = INK;
    for (let y = 0; y < H; y += C) {
      for (let x = 0; x < W; x += C) {
        let sum = 0, n = 0;
        for (let yy = y; yy < y + C && yy < H; yy += 3)
          for (let xx = x; xx < x + C && xx < W; xx += 3) {
            sum += data[(yy * W + xx) * 4];
            n++;
          }
        const dark = 1 - sum / n / 246;
        if (dark > 0.03) {
          const sz = (C - 2) * Math.sqrt(Math.min(1, dark * 1.6));
          g.fillRect(x + (C - sz) / 2, y + (C - sz) / 2, sz, sz);
        }
      }
    }
    g.strokeStyle = 'rgba(0, 0, 0,0.12)';
    g.lineWidth = 1;
    g.beginPath();
    for (let x = 0; x <= W; x += C) {
      g.moveTo(x, 0);
      g.lineTo(x, H);
    }
    for (let y = 0; y <= H; y += C) {
      g.moveTo(0, y);
      g.lineTo(W, y);
    }
    g.stroke();
  }
}

function projectAll(ay: number) {
  // projection of every face (not culled) for the morph from the scattered pile
  const ax = -0.32, dist = 7.6, f = 680;
  return MODEL.map((face) =>
    face.pts.map((p) => {
      const q = rot(p, ay, ax);
      const z = q[2] + dist;
      return [W / 2 + (q[0] * f) / z, H / 2 + 34 - (q[1] * f) / z] as [number, number];
    }),
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const TEXT = [
  'A video game is a pile of triangles. Millions of them. Every frame, they go down the line.',
  'Move every triangle to where the camera is looking. You turned your head? The whole world has to shift. That is a lot of multiplication.',
  'How bright is each triangle? It depends on where the lights are.',
  'Chop each triangle into the pixels it covers. Every pixel is independent, so many painters can work side by side.',
  'Paint each pixel: wallpaper it with stone, skin, car paint. Then do it all again. Sixty times a second.',
];

export function TriangleFactory({ step, active, explore }: SlideProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scratch = useRef<HTMLCanvasElement | null>(null);
  const [sun, setSun] = useState(35);
  const st = useRef({ ay: 0.6, drag: null as null | { x: number; ay: number }, morph: step >= 1 ? 1 : 0, lastStep: step });
  const stage = Math.min(step, 4);

  useEffect(() => {
    if (!scratch.current) {
      scratch.current = document.createElement('canvas');
      scratch.current.width = W;
      scratch.current.height = H;
    }
    const g = ref.current!.getContext('2d')!;
    const s = st.current;
    // Transform just switched on → animate the pile flying into place; otherwise keep where we are
    if (step === 0 || (s.lastStep === 0 && step >= 1)) s.morph = 0;
    s.lastStep = step;
    const a = (sun * Math.PI) / 180;
    const light = norm([Math.cos(a), 0.75, -Math.sin(a) - 0.3]);
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (stage >= 1 && s.morph < 1) s.morph = Math.min(1, s.morph + dt / 1.1);
      if (!s.drag && stage >= 1 && s.morph >= 1) s.ay += dt * 0.25;
      render(g, scratch.current!, stage, s.ay, light, stage === 0 ? 0 : s.morph);
      if (active) raf = requestAnimationFrame(frame);
    };
    // draw once immediately (also covers headless screenshots), then animate
    render(g, scratch.current, stage, s.ay, light, stage === 0 ? 0 : s.morph);
    if (active) raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [stage, step, active, sun]);

  return (
    <div className="slide tf">
      <div className="slide-kicker">The Triangle Factory · GeForce 256, 1999</div>
      <Stations active={stage - 1} lit={step >= 5 ? [0, 1] : []} className="tf-stations" />
      <Reveal show={step >= 5} className="tf-bracket">
        <div className="tf-bracket-line" />
      </Reveal>
      <div className="tf-main">
        <div className="tf-monitor">
          <canvas
            ref={ref}
            width={W}
            height={H}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              st.current.drag = { x: e.clientX, ay: st.current.ay };
            }}
            onPointerMove={(e) => {
              const d = st.current.drag;
              if (d) st.current.ay = d.ay + (e.clientX - d.x) * 0.01;
            }}
            onPointerUp={() => (st.current.drag = null)}
          />
          <div className="tf-monitor-foot" />
        </div>
        <div className="tf-side">
          {step < 5 ? (
            <>
              <div className="tf-station-name">{stage === 0 ? 'The raw material' : `Station ${['I', 'II', 'III', 'IV'][stage - 1]}`}</div>
              <p className="tf-text">{TEXT[stage]}</p>
            </>
          ) : (
            <>
              <div className="tf-station-name">The big deal</div>
              <p className="tf-text">
                Before 1999, your <b>CPU</b> did stations I and II. NVIDIA built them into the graphics chip: <b>hardware transform &amp; lighting.</b> The CPU was freed up, and games got far more detailed.
              </p>
            </>
          )}
          {explore && (
            <div className="tf-controls">
              <div className="control">
                <label>Sun</label>
                <input type="range" min={-80} max={200} value={sun} onChange={(e) => setSun(+e.target.value)} style={{ width: 340 }} />
              </div>
              <div className="hint">Drag the picture to spin the temple. Use › to switch on the next station.</div>
            </div>
          )}
          {!explore && <div className="hint">drag to spin</div>}
        </div>
      </div>
    </div>
  );
}
