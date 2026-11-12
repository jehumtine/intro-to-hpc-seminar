import { useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';
import { Futures } from './s6-MemoryWall';

/**
 * Future IV: power is the real limit. Pick a number of GPUs; see the power it draws as
 * homes and power stations. (Rule of thumb: ~1.4 kW per GPU once you add cooling and
 * networking; a big power station ≈ 1,000 MW; a home ≈ 1 kW on average.)
 * step 0 10k GPUs · step 1 100k (today's giant clusters) · step 2 1M (the plans) + the line
 * Explore: a GPU-count slider.
 */
const KW_PER_GPU = 1.4;
const STOPS = [1_000, 10_000, 100_000, 1_000_000];
const STEP_GPUS = [10_000, 100_000, 1_000_000];

function Tower({ x }: { x: number }) {
  // a cooling tower: hyperbolic silhouette, engraved
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M0 330 Q 26 230 8 140 L 92 140 Q 74 230 100 330 Z" fill="url(#lines-s6p)" stroke="var(--ink)" strokeWidth="2.4" />
      <path d="M20 128 q 10 -30 30 -20 q 20 -30 40 0" fill="none" stroke="var(--ink)" strokeWidth="2" />
    </g>
  );
}

function House({ x, y }: { x: number; y: number }) {
  return <path transform={`translate(${x} ${y})`} d="M0 18 L12 6 L24 18 V32 H0 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.6" />;
}

export function Power({ step, explore }: SlideProps) {
  const [idx, setIdx] = useState(2);
  const gpus = explore ? STOPS[idx] : STEP_GPUS[Math.min(step, STEP_GPUS.length - 1)];
  const mw = (gpus * KW_PER_GPU) / 1000;
  const homes = Math.round(gpus * KW_PER_GPU); // ~1 kW per home
  const plants = mw / 1000;
  const towers = Math.max(1, Math.ceil(plants));
  const houseIcons = Math.min(120, Math.round(Math.log10(homes) * 22));

  return (
    <Slide kicker="The future · IV" title="Power is the real limit">
      <Futures n={4} />
      <div className="s6-pow">
        <svg viewBox="0 0 1000 520">
          <HatchDefs id="-s6p" />
          <line x1="0" y1="330" x2="1000" y2="330" stroke="var(--ink)" strokeWidth="2.4" />
          {/* power stations needed */}
          {Array.from({ length: Math.min(towers, 3) }, (_, i) => (
            <motion.g key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: plants >= 0.5 || i === 0 ? 1 : 0.25, y: 0 }} transition={{ delay: i * 0.15 }}>
              <Tower x={20 + i * 130} />
            </motion.g>
          ))}
          <text x="20" y="380" fontSize="26" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink)">
            {plants < 0.5 ? 'a slice of one power station' : plants < 1.2 ? 'a whole power station' : `${plants.toFixed(1)} power stations`}
          </text>
          {/* pylons + wire to the data centre */}
          <path d="M420 330 L440 180 L460 330 M428 260 H452 M432 220 H448 M440 180 L700 200" fill="none" stroke="var(--ink)" strokeWidth="2.2" />
          {/* the data centre */}
          <rect x="700" y="190" width="280" height="140" fill="url(#crosshatch-s6p)" stroke="var(--ink)" strokeWidth="2.6" />
          <rect x="720" y="210" width="240" height="100" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.6" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={732 + i * 28} y="222" width="18" height="76" fill="url(#hatch-s6p)" stroke="var(--ink)" strokeWidth="1.2" />
          ))}
          <text x="840" y="370" textAnchor="middle" fontSize="26" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink)">{gpus.toLocaleString()} GPUs</text>
          {/* homes it could have powered */}
          {Array.from({ length: houseIcons }, (_, i) => (
            <House key={i} x={20 + (i % 30) * 32} y={410 + Math.floor(i / 30) * 26} />
          ))}
        </svg>

        <div className="readout">
          <div className="big">{mw >= 1000 ? `${(mw / 1000).toFixed(1)} GW` : `${Math.round(mw)} MW`}</div>
          <p>
            for <b>{gpus.toLocaleString()} GPUs</b>. That's the electricity of about <b>{homes.toLocaleString()} homes</b>.
          </p>
          {explore ? (
            <div className="control" data-interactive>
              <label htmlFor="gpus">GPUs</label>
              <input id="gpus" type="range" min={0} max={STOPS.length - 1} value={idx} onChange={(e) => setIdx(+e.target.value)} style={{ width: 300 }} />
            </div>
          ) : (
            <p className="hint">{['A mid-sized AI cluster.', "Today's biggest AI clusters.", 'What the giants are planning next.'][Math.min(step, 2)]}</p>
          )}
          <Reveal show={step >= 2} style={{ marginTop: 30 }}>
            <p className="final">Not transistors. Not clever design. Electricity. The next supercomputer will be designed around a power plant.</p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
