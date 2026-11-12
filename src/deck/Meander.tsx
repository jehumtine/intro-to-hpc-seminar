import { motion } from 'motion/react';

/**
 * Greek-key (meander) progress bar. A faint meander runs the full width; the inked
 * part grows as the talk advances.
 */
export function Meander({ progress, width = 1720, height = 22 }: { progress: number; width?: number; height?: number }) {
  // one meander unit is a square spiral, 22px tall, repeated
  const u = height;
  const b = u - 1; // baseline (inset so the stroke isn't clipped by the pattern tile)
  const path = `M1 ${b} V1 H${u * 0.85} V${u * 0.7} H${u * 0.35} V${u * 0.4} H${u * 0.6} M0 ${b} H${u}`;
  return (
    <svg width={width} height={height + 4} viewBox={`0 -2 ${width} ${height + 4}`} className="meander">
      <defs>
        <pattern id="key" width={u} height={u} patternUnits="userSpaceOnUse">
          <path d={path} fill="none" stroke="currentColor" strokeWidth="1.6" />
        </pattern>
        <clipPath id="key-clip">
          <motion.rect x="0" y="-2" height={height + 4} initial={false} animate={{ width: Math.max(0, Math.min(1, progress)) * width }} transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1] }} />
        </clipPath>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#key)" opacity="0.18" />
      <rect x="0" y="0" width={width} height={height} fill="url(#key)" clipPath="url(#key-clip)" />
    </svg>
  );
}
