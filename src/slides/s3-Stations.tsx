import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

/* The four stations of the fixed-function graphics pipeline, drawn as machines on a conveyor.
   Shared by the Triangle Factory, the padlocks, GeForce 3, the smuggling scene and Section IV. */

export const STATION_NAMES = ['Transform', 'Lighting', 'Rasterise', 'Texture'];
const NUMERALS = ['I', 'II', 'III', 'IV'];

function StationIcon({ i }: { i: number }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2 } as const;
  return (
    <svg width="54" height="54" viewBox="0 0 54 54">
      {i === 0 && (
        <>
          <path d="M10 34 L27 44 L44 34 L27 24 Z" {...s} />
          <path d="M27 24 V8 M21 14 L27 8 L33 14" {...s} />
        </>
      )}
      {i === 1 && (
        <>
          <circle cx="27" cy="27" r="9" {...s} />
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k * Math.PI) / 4;
            return <line key={k} x1={27 + Math.cos(a) * 14} y1={27 + Math.sin(a) * 14} x2={27 + Math.cos(a) * 22} y2={27 + Math.sin(a) * 22} {...s} />;
          })}
        </>
      )}
      {i === 2 && (
        <>
          {[8, 18, 28, 38].map((x) => [8, 18, 28, 38].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill={x + y < 50 && x < 30 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" />))}
        </>
      )}
      {i === 3 && (
        <>
          <rect x="6" y="10" width="42" height="34" {...s} />
          <path d="M6 21 H48 M6 32 H48 M20 10 V21 M34 10 V21 M13 21 V32 M27 21 V32 M41 21 V32 M20 32 V44 M34 32 V44" {...s} strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}

export function Padlock({ open, size = 64 }: { open: boolean; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 50 60"
      initial={false}
      animate={open ? { y: -140, x: 60, rotate: 40, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
      transition={{ duration: open ? 0.9 : 0.5, ease: open ? [0.3, 0, 0.7, 1] : [0.22, 1, 0.36, 1] }}
    >
      <path d="M13 28 V18 a12 12 0 0 1 24 0 V28" fill="none" stroke="var(--ink)" strokeWidth="5" />
      <rect x="6" y="27" width="38" height="30" rx="3" fill="var(--ink)" />
      <circle cx="25" cy="39" r="4" fill="var(--paper)" />
      <rect x="23" y="40" width="4" height="10" fill="var(--paper)" />
    </motion.svg>
  );
}

/** One station; padlock can be clicked to rattle it. */
function Station({ i, active, locked, screen, lit, dim }: { i: number; active: boolean; locked: boolean; screen?: ReactNode; lit: boolean; dim: boolean }) {
  const [rattle, setRattle] = useState(0);
  return (
    <motion.div className={`st ${active ? 'on' : ''} ${lit ? 'lit' : ''}`} animate={{ opacity: dim ? 0.35 : 1 }} transition={{ duration: 0.5 }}>
      <div className="st-num">{NUMERALS[i]}</div>
      <StationIcon i={i} />
      <div className="st-name">{STATION_NAMES[i]}</div>
      {screen && <div className="st-screen">{screen}</div>}
      <motion.div
        className="st-lock"
        data-interactive
        onClick={() => locked && setRattle((r) => r + 1)}
        key={rattle}
        animate={rattle ? { x: [0, -10, 10, -8, 8, -4, 0] } : {}}
        transition={{ duration: 0.45 }}
        style={{ pointerEvents: locked ? 'auto' : 'none', cursor: 'pointer' }}
      >
        <Padlock open={!locked} />
        {rattle > 0 && locked && (
          <motion.div className="st-welded" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -30 }} transition={{ duration: 1.6, delay: 0.3 }}>
            welded shut
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * A row of the four stations on a conveyor.
 * @param active   which station is highlighted (-1 none)
 * @param locks    which stations show a padlock (undefined = no padlocks)
 * @param screens  optional content (e.g. shader code) inside a station
 * @param lit      stations to draw with a bold frame (e.g. the hardware T&L pair)
 */
export function Stations({
  active = -1,
  locks,
  screens = [],
  lit = [],
  dimOthers = false,
  className = '',
}: {
  active?: number;
  locks?: boolean[];
  screens?: (ReactNode | undefined)[];
  lit?: number[];
  dimOthers?: boolean;
  className?: string;
}) {
  return (
    <div className={`stations ${className}`}>
      <div className="conveyor">
        {Array.from({ length: 24 }, (_, k) => (
          <span key={k} />
        ))}
      </div>
      {STATION_NAMES.map((_, i) => (
        <Station key={i} i={i} active={active === i} locked={!!locks?.[i]} screen={screens[i]} lit={lit.includes(i)} dim={dimOthers && active !== i && !lit.includes(i)} />
      ))}
    </div>
  );
}
