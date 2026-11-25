import { useMemo } from 'react';
import QRCode from 'qrcode';
import type { SlideProps } from '../deck/types';
import { PlateCrop, Reveal } from './common';

const PROMPTS = [
  'By 2036, where does the next big speed-up come from? Quantum, optical, specialised chips, or better software?',
  'In 2036, what will HPC mostly be used for? AI, climate and weather, drug discovery, something else?',
  'In 10 years, is NVIDIA still the king of AI chips? If not, who took the crown?',
  'By 2036, will Africa have a supercomputer in the world top 10? Will Zambia?',
  'In 10 years, will your phone run an AI as smart as today’s ChatGPT, with no internet?',
];

/** Where the site lives online (GitHub Pages). The QR opens it in explore mode. */
const ONLINE_URL = 'https://jehumtine.github.io/intro-to-hpc-seminar/?explore';
const ONLINE_LABEL = 'jehumtine.github.io/intro-to-hpc-seminar';

/** QR code drawn as plain SVG squares (generated locally, works offline). */
function Qr({ text, size }: { text: string; size: number }) {
  const qr = useMemo(() => QRCode.create(text, { errorCorrectionLevel: 'M' }), [text]);
  const n = qr.modules.size;
  const cells: JSX.Element[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) cells.push(<rect key={y * n + x} x={x} y={y} width={1.02} height={1.02} />);
  return (
    <svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} style={{ background: '#fff', flex: 'none', border: '1.5px solid var(--ink)' }}>
      <g fill="#000">{cells}</g>
    </svg>
  );
}

function QrSlot() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 10 }} data-interactive>
      <Qr text={ONLINE_URL} size={190} />
      <div>
        <div className="eyebrow" style={{ fontSize: 20 }}>Play with it yourself</div>
        <p style={{ fontSize: 28, marginTop: 8 }}>Scan to open every demo on your phone.</p>
        <p className="hint" style={{ fontSize: 22 }}>{ONLINE_LABEL}</p>
      </div>
    </div>
  );
}

export function Closing({ step, explore }: SlideProps) {
  return (
    <div className="closing">
      <PlateCrop focus="72% 50%" zoom="cover" className="closing-plate" />
      <div className="closing-body">
        <Reveal show={step === 0} className="closing-question" style={{ position: 'absolute' }}>
          <p>The first free lunch was <em>speed</em>.</p>
          <p>The second was <em>parallelism</em>.</p>
          <p className="big">What is the third?</p>
        </Reveal>
        <Reveal show={step >= 1} className="closing-prompts">
          <div className="eyebrow">Symposium · Place your bets</div>
          <ol>
            {PROMPTS.map((p, i) => (
              <li key={i} style={{ fontSize: 30, marginBottom: 16 }}>
                <span className="n">{['I', 'II', 'III', 'IV', 'V'][i]}</span>
                {p}
              </li>
            ))}
          </ol>
          {explore && (
            <p style={{ fontSize: 26, fontStyle: 'italic', marginTop: 0 }}>
              Thank you for exploring. Go back and play with any demo: every slider is yours.
            </p>
          )}
          <QrSlot />
        </Reveal>
      </div>
    </div>
  );
}
