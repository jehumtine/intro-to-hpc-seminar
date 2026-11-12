import { motion, type HTMLMotionProps } from 'motion/react';

export const PLATE = `${import.meta.env.BASE_URL}img/hoarders.jpg`;
export const PLATE_CAPTION = 'G. Doré, Inferno, Canto VII: the Hoarders and Wasters (1861)';

/** Fades/rises in when `show` becomes true. Used for build steps. */
export function Reveal({ show, delay = 0, y = 18, ...rest }: { show: boolean; delay?: number; y?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : y }}
      transition={{ duration: 0.7, delay: show ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    />
  );
}

/** A crop of the engraving, framed like a printed plate. `focus` is the background-position. */
export function PlateCrop({ focus, zoom = 260, className = '', style }: { focus: string; zoom?: number | 'cover'; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`plate ${className}`} style={style}>
      <div className="plate-inner" style={{ backgroundImage: `url(${PLATE})`, backgroundSize: zoom === 'cover' ? 'cover' : `${zoom}%`, backgroundPosition: focus }} />
    </div>
  );
}

/** Standard content-slide layout: small kicker, heading, then free body area. */
export function Slide({ kicker, title, children, className = '' }: { kicker?: string; title?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`slide ${className}`}>
      {kicker && <div className="slide-kicker">{kicker}</div>}
      {title && <h2 className="slide-h">{title}</h2>}
      <div className="slide-body">{children}</div>
    </div>
  );
}

/**
 * Engraving-style SVG fills, for charts and diagrams (we have no colour, so we tell
 * things apart by texture). Render once inside an <svg>, then use fill="url(#hatch)" etc.
 *  - #hatch       diagonal lines (use for the GPU / "many")
 *  - #crosshatch  dense cross-hatch (dark tone)
 *  - #lines       horizontal engraving lines (mid tone)
 *  - #dots        stipple (light tone)
 * Solid ink (var(--ink)) is reserved for the CPU / "one".
 */
export function HatchDefs({ id = '' }: { id?: string }) {
  return (
    <defs>
      <pattern id={`hatch${id}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--ink)" strokeWidth="2" />
      </pattern>
      <pattern id={`crosshatch${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0V7M0 0H7" stroke="var(--ink)" strokeWidth="1.6" />
      </pattern>
      <pattern id={`lines${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
        <line x1="0" y1="3" x2="6" y2="3" stroke="var(--ink)" strokeWidth="1.4" />
      </pattern>
      <pattern id={`dots${id}`} width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="3.5" cy="3.5" r="1.2" fill="var(--ink)" />
      </pattern>
    </defs>
  );
}
