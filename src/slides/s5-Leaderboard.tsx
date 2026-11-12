import { useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';

/**
 * ImageNet 2012: everyone huddles around 26% error; AlexNet ("SuperVision") falls off a cliff to 15.3%.
 * step 0 the pack · step 1 the drop · step 2 the aftermath
 * Explore: "Drop it again" replays the fall.
 */
const TEAMS = [
  { name: 'SuperVision', sub: '(AlexNet)', err: 15.3, star: true },
  { name: 'ISI', err: 26.2 },
  { name: 'Oxford VGG', err: 27.0 },
  { name: 'XRCE / INRIA', err: 27.1 },
  { name: 'Amsterdam', err: 29.6 },
  { name: 'LEAR-XRCE', err: 34.5 },
];

const W = 1100;
const H = 600;
const BASE = 560; // y of the x-axis
const MAX = 40; // % at the top of the chart
const y = (e: number) => BASE - (e / MAX) * (BASE - 30);
const BAR = 110;
const GAP = (W - 120 - TEAMS.length * BAR) / (TEAMS.length - 1);
const x = (i: number) => 100 + i * (BAR + GAP);

export function Leaderboard({ step, explore }: SlideProps) {
  const [replay, setReplay] = useState(0);
  const dropped = step >= 1;
  // the star bar starts disguised among the pack, at ~26.5%
  const starErr = dropped ? 15.3 : 26.5;

  return (
    <Slide kicker="ImageNet · 2012" title="The biggest image contest in the world">
      <div className="s5-board">
        <svg viewBox={`0 0 ${W} ${H + 90}`}>
          <HatchDefs id="-s5l" />
          {/* gridlines + axis */}
          {[0, 10, 20, 30, 40].map((e) => (
            <g key={e}>
              <line x1="80" x2={W} y1={y(e)} y2={y(e)} stroke="var(--ink)" strokeOpacity={e === 0 ? 1 : 0.18} strokeWidth={e === 0 ? 2.5 : 1} />
              <text x="64" y={y(e) + 8} textAnchor="end" fontSize="24" fontFamily="var(--display)" fill="var(--ink-soft)">{e}%</text>
            </g>
          ))}
          <text x="0" y="14" fontSize="22" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink-soft)">mistakes (lower is better)</text>

          {/* where everyone was */}
          <line x1="80" x2={W} y1={y(26.2)} y2={y(26.2)} stroke="var(--ink)" strokeDasharray="10 8" strokeWidth="1.6" />

          {TEAMS.map((t, i) => {
            const e = t.star ? starErr : t.err;
            return (
              <g key={t.name}>
                {t.star ? (
                  <motion.rect
                    key={replay}
                    x={x(i)}
                    width={BAR}
                    initial={{ y: y(26.5), height: BASE - y(26.5) }}
                    animate={{ y: y(e), height: BASE - y(e) }}
                    transition={dropped ? { type: 'spring', stiffness: 60, damping: 7, mass: 1.4, delay: 0.2 } : { duration: 0.4 }}
                    fill="var(--ink)"
                  />
                ) : (
                  <rect x={x(i)} width={BAR} y={y(e)} height={BASE - y(e)} fill="url(#crosshatch-s5l)" stroke="var(--ink)" strokeWidth="1.6" />
                )}
                <motion.text
                  key={`${replay}-t`}
                  x={x(i) + BAR / 2}
                  textAnchor="middle"
                  fontSize="30"
                  fontFamily="var(--display)"
                  fontWeight="600"
                  fill="var(--ink)"
                  initial={{ y: y(t.star ? 26.5 : e) - 14 }}
                  animate={{ y: y(e) - 14 }}
                  transition={t.star && dropped ? { type: 'spring', stiffness: 60, damping: 7, mass: 1.4, delay: 0.2 } : { duration: 0.4 }}
                >
                  {t.star && !dropped ? '?' : `${e.toFixed(1)}%`}
                </motion.text>
                <text x={x(i) + BAR / 2} y={BASE + 38} textAnchor="middle" fontSize="23" fontFamily="var(--serif)" fontWeight={t.star ? 600 : 400} fill="var(--ink)">
                  {t.name}
                </text>
                {t.sub && (
                  <text x={x(i) + BAR / 2} y={BASE + 66} textAnchor="middle" fontSize="22" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink-soft)">
                    {t.sub}
                  </text>
                )}
              </g>
            );
          })}

          {/* the cliff annotation */}
          <motion.g initial={false} animate={{ opacity: dropped ? 1 : 0 }} transition={{ delay: dropped ? 1.4 : 0, duration: 0.5 }}>
            <path d={`M ${x(0) + BAR + 18} ${y(26.2) + 6} V ${y(15.3) - 6}`} stroke="var(--ink)" strokeWidth="2.4" markerEnd="" />
            <path d={`M ${x(0) + BAR + 8} ${y(15.3) - 18} L ${x(0) + BAR + 18} ${y(15.3) - 4} L ${x(0) + BAR + 28} ${y(15.3) - 18}`} stroke="var(--ink)" strokeWidth="2.4" fill="none" />
            <text x={x(0) + BAR / 2} y={y(26.2) - 16} textAnchor="middle" fontSize="28" fontFamily="var(--display)" fontWeight="600" fill="var(--ink)">−11 points</text>
          </motion.g>
        </svg>

        <div className="side">
          <p>Every team was stuck in the same spot: about <b>one guess in four wrong</b>.</p>
          <Reveal show={step >= 1} delay={1.2}>
            <p className="big">Then Alex's two gaming cards entered.</p>
          </Reveal>
          <Reveal show={step >= 2}>
            <p style={{ marginTop: 30 }}>
              The AI world turned around <em>overnight</em>. Every lab on Earth went out and bought NVIDIA GPUs.
            </p>
          </Reveal>
          {explore && dropped && (
            <button className="btn" onClick={() => setReplay((r) => r + 1)}>Drop it again</button>
          )}
        </div>
      </div>
    </Slide>
  );
}
