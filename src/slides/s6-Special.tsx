import { useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';
import { Futures } from './s6-MemoryWall';

/**
 * Future III: specialisation. The one-product factory comes back, on purpose.
 * Top belt: 1999, GeForce 256 (graphics only, by accident). Bottom belt: today's AI chips
 * (multiply-add only, on purpose). Parcels run along each belt.
 * step 0 the 1999 belt · step 1 the AI belt · step 2 "history rhymes"
 * Explore: click a belt to speed it up.
 */

function Belt({ stations, parcel, running, fast, id }: { stations: string[]; parcel: 'tri' | 'sq'; running: boolean; fast: boolean; id: string }) {
  const W = 1180;
  const sw = 190;
  const gap = (W - 60 - stations.length * sw) / (stations.length - 1);
  const dur = fast ? 1.6 : 5;
  return (
    <svg viewBox={`0 0 ${W} 260`}>
      <HatchDefs id={id} />
      {/* belt */}
      <rect x="0" y="196" width={W} height="20" fill={`url(#lines${id})`} stroke="var(--ink)" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={30 + i * ((W - 60) / 15)} cy="228" r="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      ))}
      {stations.map((s, i) => {
        const x = 30 + i * (sw + gap);
        return (
          <g key={s}>
            <rect x={x} y="40" width={sw} height="120" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.6" />
            <rect x={x + 12} y="52" width={sw - 24} height="44" fill={`url(#hatch${id})`} stroke="none" opacity="0.5" />
            <path d={`M ${x + 30} 160 V 196 M ${x + sw - 30} 160 V 196`} stroke="var(--ink)" strokeWidth="2.6" />
            <text x={x + sw / 2} y="132" textAnchor="middle" fontSize="23" fontFamily="var(--display)" fontWeight="600" fill="var(--ink)">{s}</text>
          </g>
        );
      })}
      {/* parcels */}
      {running &&
        Array.from({ length: 6 }, (_, i) => (
          <motion.g
            key={`${i}-${fast}`}
            initial={{ x: -60 }}
            animate={{ x: W + 20 }}
            transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay: (i * dur) / 6 }}
          >
            {parcel === 'tri' ? (
              <path d="M0 194 L20 160 L40 194 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" />
            ) : (
              <g>
                <rect x="0" y="160" width="36" height="34" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" />
                <text x="18" y="184" textAnchor="middle" fontSize="18" fontFamily="var(--display)" fill="var(--ink)">×</text>
              </g>
            )}
          </motion.g>
        ))}
    </svg>
  );
}

export function Special({ step, active, explore }: SlideProps) {
  const [fast, setFast] = useState<[boolean, boolean]>([false, false]);
  const toggle = (i: 0 | 1) => explore && setFast((f) => (i === 0 ? [!f[0], f[1]] : [f[0], !f[1]]));

  return (
    <Slide kicker="The future · III" title="Specialisation: back to the factory">
      <Futures n={3} />
      <div className="s6-spec">
        <div className="s6-belt" data-interactive={explore || undefined} onClick={() => toggle(0)} style={{ cursor: explore ? 'pointer' : undefined }}>
          <div className="who">
            1999 · GeForce 256
            <small>one product: pictures. By accident.</small>
          </div>
          <Belt id="-s6s1" stations={['TRANSFORM', 'LIGHT', 'RASTERISE', 'TEXTURE']} parcel="tri" running={active} fast={fast[0]} />
        </div>
        <Reveal show={step >= 1}>
          <div className="s6-belt" data-interactive={explore || undefined} onClick={() => toggle(1)} style={{ cursor: explore ? 'pointer' : undefined }}>
            <div className="who">
              Today · AI chips
              <small>one product: matrix maths. On purpose.</small>
            </div>
            <Belt id="-s6s2" stations={['MULTIPLY', 'ADD', 'MULTIPLY', 'ADD']} parcel="sq" running={active && step >= 1} fast={fast[1]} />
          </div>
        </Reveal>
      </div>
      <Reveal show={step >= 2} style={{ position: 'absolute', left: 0, right: 0, bottom: -16, textAlign: 'center' }}>
        <p className="lede">Google's TPUs and today's AI chips do one job, extremely well. History doesn't repeat, but it rhymes.</p>
      </Reveal>
      {explore && <p className="hint" style={{ position: 'absolute', top: -40, right: 260 }}>Tap a factory to speed it up.</p>}
    </Slide>
  );
}
