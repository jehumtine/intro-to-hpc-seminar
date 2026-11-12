import { useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';

/**
 * The bill. A big engraved power dial: data-centre electricity per year, 2024 → 2030
 * (IEA projection: ~415 TWh → ~945 TWh, about all of Japan).
 * step 0 dial at 2024 · step 1 swings to 2030 · step 2 Three Mile Island · step 3 the fire line
 * Explore: a year slider drives the needle.
 */
const MAX = 1000; // TWh at the end of the dial
const twh = (year: number) => 415 + ((945 - 415) * (year - 2024)) / 6;

const CX = 430;
const CY = 400;
const R = 330;
// dial runs from 200° (left) to -20° (right), i.e. a 220° sweep
const ang = (v: number) => ((200 - (v / MAX) * 220) * Math.PI) / 180;
const pt = (v: number, r: number) => [CX + Math.cos(ang(v)) * r, CY - Math.sin(ang(v)) * r] as const;

export function Bill({ step, explore }: SlideProps) {
  const [year, setYear] = useState(2030);
  const y = explore && step >= 1 ? year : step >= 1 ? 2030 : 2024;
  const v = twh(y);
  const needleDeg = 90 - (200 - (v / MAX) * 220); // rotate from pointing up

  return (
    <Slide kicker="The bill" title="Where does all that power come from?">
      <div className="s5-bill">
        <svg viewBox="0 0 860 560">
          <HatchDefs id="-s5bill" />
          {/* dial face */}
          <path
            d={`M ${pt(0, R)[0]} ${pt(0, R)[1]} A ${R} ${R} 0 1 1 ${pt(MAX, R)[0]} ${pt(MAX, R)[1]}`}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <path
            d={`M ${pt(0, R - 40)[0]} ${pt(0, R - 40)[1]} A ${R - 40} ${R - 40} 0 1 1 ${pt(MAX, R - 40)[0]} ${pt(MAX, R - 40)[1]}`}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />
          {/* "danger" band: past Japan */}
          <path
            d={`M ${pt(900, R)[0]} ${pt(900, R)[1]} A ${R} ${R} 0 0 1 ${pt(MAX, R)[0]} ${pt(MAX, R)[1]} L ${pt(MAX, R - 40)[0]} ${pt(MAX, R - 40)[1]} A ${R - 40} ${R - 40} 0 0 0 ${pt(900, R - 40)[0]} ${pt(900, R - 40)[1]} Z`}
            fill="url(#crosshatch-s5bill)"
            stroke="none"
          />
          {Array.from({ length: 21 }, (_, i) => {
            const t = i * 50;
            const major = t % 250 === 0;
            const [x1, y1] = pt(t, R);
            const [x2, y2] = pt(t, R - (major ? 40 : 18));
            const [tx, ty] = pt(t, R - 72);
            return (
              <g key={t}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={major ? 3 : 1.4} />
                {major && (
                  <text x={tx} y={ty + 9} textAnchor="middle" fontSize="26" fontFamily="var(--display)" fill="var(--ink)">{t}</text>
                )}
              </g>
            );
          })}
          {/* Japan marker */}
          {(() => {
            const [x1, y1] = pt(945, R + 6);
            const [x2, y2] = pt(945, R + 40);
            const [tx, ty] = pt(945, R + 70);
            return (
              <g>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="3" />
                <text x={tx + 10} y={ty} textAnchor="middle" fontSize="26" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink)">all of Japan</text>
              </g>
            );
          })()}
          {/* needle */}
          <motion.g initial={false} animate={{ rotate: needleDeg }} transition={{ type: 'spring', stiffness: 40, damping: 8 }} style={{ originX: `${CX}px`, originY: `${CY}px` }}>
            <path d={`M ${CX - 12} ${CY} L ${CX} ${CY - R + 52} L ${CX + 12} ${CY} Z`} fill="var(--ink)" />
          </motion.g>
          <circle cx={CX} cy={CY} r="26" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx={CX} cy={CY} r="9" fill="var(--ink)" />
          <text x={CX} y={CY + 150} textAnchor="middle" fontSize="54" fontFamily="var(--display)" fontWeight="600" fill="var(--ink)">
            {Math.round(v)} TWh
          </text>
          <text x={CX} y={CY + 186} textAnchor="middle" fontSize="26" fontStyle="italic" fontFamily="var(--serif)" fill="var(--ink-soft)">
            data centres, per year · {y}
          </text>
        </svg>

        <div className="cards">
          {explore && step >= 1 ? (
            <div className="control" data-interactive>
              <label htmlFor="bill-year">Year</label>
              <input id="bill-year" type="range" min={2024} max={2030} value={year} onChange={(e) => setYear(+e.target.value)} style={{ width: 380 }} />
              <span className="num">{year}</span>
            </div>
          ) : (
            <Reveal show={step >= 1}>
              <p className="lede">By 2030, data centres are on track to use as much electricity as <b>all of Japan</b>.</p>
            </Reveal>
          )}
          <Reveal show={step >= 2} className="card">
            <p>
              <b>2024:</b> Microsoft signs a deal to restart <b>Three Mile Island</b>, a nuclear power plant, just to feed its data centres.
            </p>
          </Reveal>
          <Reveal show={step >= 3}>
            <p className="s5-fire">We didn't escape the fire. We moved it from the chip to the whole building.</p>
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
