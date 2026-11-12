import { useEffect, useRef, useState } from 'react';
import type { SlideProps } from '../deck/types';
import { PLATE, Reveal, Slide } from './common';
import { Futures } from './s6-MemoryWall';

/**
 * Future II: less precision, more speed. The same detail of the Doré plate, drawn with
 * fewer and fewer bits per pixel. It stays recognisable for a long time.
 * step 0 → 8 bits · step 1 → 4 bits · step 2 → 1 bit
 * Explore: a bits slider (1–8).
 */
const W = 720;
const H = 480;
const STEP_BITS = [8, 4, 1];

function useGrey() {
  const [g, setG] = useState<Float32Array | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = PLATE;
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const x = c.getContext('2d')!;
      // a detail: the central figures
      const sw = img.width * 0.42;
      const sh = (sw * H) / W;
      x.drawImage(img, img.width * 0.4, img.height * 0.12, sw, sh, 0, 0, W, H);
      const d = x.getImageData(0, 0, W, H).data;
      const out = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) out[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
      setG(out);
    };
  }, []);
  return g;
}

// paper and ink as the two ends of the grey scale
const P = [246, 243, 236];
const K = [0, 0, 0];

function render(c: HTMLCanvasElement | null, grey: Float32Array | null, bits: number) {
  if (!c || !grey) return;
  const x = c.getContext('2d')!;
  const im = x.createImageData(W, H);
  const levels = Math.pow(2, bits);
  for (let i = 0; i < W * H; i++) {
    let v = grey[i];
    v = bits >= 8 ? v : Math.round(v * (levels - 1)) / (levels - 1);
    im.data[i * 4] = K[0] + (P[0] - K[0]) * v;
    im.data[i * 4 + 1] = K[1] + (P[1] - K[1]) * v;
    im.data[i * 4 + 2] = K[2] + (P[2] - K[2]) * v;
    im.data[i * 4 + 3] = 255;
  }
  x.putImageData(im, 0, 0);
}

const shades = (b: number) => Math.pow(2, b).toLocaleString();

export function Precision({ step, explore }: SlideProps) {
  const grey = useGrey();
  const full = useRef<HTMLCanvasElement>(null);
  const low = useRef<HTMLCanvasElement>(null);
  const [slider, setSlider] = useState(4);
  const bits = explore ? slider : STEP_BITS[Math.min(step, STEP_BITS.length - 1)];

  useEffect(() => render(full.current, grey, 8), [grey]);
  useEffect(() => render(low.current, grey, bits), [grey, bits]);

  // illustrative: halve the bits, roughly double the sums per second
  const speed = 8 / bits;

  return (
    <Slide kicker="The future · II" title="Less precision, more speed">
      <Futures n={2} />
      <div className="s6-prec">
        <div className="pane">
          <canvas ref={full} width={W} height={H} className="plate" />
          <div className="lbl">8 bits</div>
          <div className="sub">256 shades of grey: "proper" maths</div>
        </div>
        <div className="pane">
          <canvas ref={low} width={W} height={H} className="plate" />
          <div className="lbl">{bits} bit{bits > 1 ? 's' : ''}</div>
          <div className="sub">
            {shades(bits)} shade{bits > 1 ? 's' : ''}
            {bits === 4 && ': still a masterpiece'}
            {bits === 1 && ': okay, maybe too far'}
          </div>
          <div className="s6-speed">
            <span>speed</span>
            <div className="meter"><div style={{ width: `${(speed / 8) * 100}%`, transition: 'width 0.5s' }} /></div>
            <span className="num">×{speed % 1 ? speed.toFixed(1) : speed}</span>
          </div>
          {explore && (
            <div className="control" data-interactive style={{ marginTop: 14 }}>
              <label htmlFor="bits">Bits</label>
              <input id="bits" type="range" min={1} max={8} value={slider} onChange={(e) => setSlider(+e.target.value)} style={{ width: 380 }} />
            </div>
          )}
        </div>
      </div>
      <Reveal show={!explore && step >= 1} style={{ position: 'absolute', left: 0, right: 0, bottom: -10, textAlign: 'center' }}>
        <p className="lede">AI doesn't need sixteen decimal places. New chips do maths with <b>4-bit</b> numbers. Rough, but insanely fast.</p>
      </Reveal>
    </Slide>
  );
}
