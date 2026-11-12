import { AnimatePresence, motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';

/**
 * TOP500, June 2026. Rows 2–5 (all accelerated) arrive first; then #1 slams in with a
 * record-scratch: LineShine, 2.2 exaflops, GPUs: ZERO.
 * step 0 rows 2–5 · step 1 the twist · step 2 "maybe the story isn't over"
 */
const ROWS = [
  { rk: 2, nm: 'El Capitan', where: 'USA', ef: 1.809, acc: 'AMD MI300A GPUs' },
  { rk: 3, nm: 'Frontier', where: 'USA', ef: 1.353, acc: 'AMD MI250X GPUs' },
  { rk: 4, nm: 'Aurora', where: 'USA', ef: 1.012, acc: 'Intel Max GPUs' },
  { rk: 5, nm: 'JUPITER', where: 'Germany', ef: 1.0, acc: 'NVIDIA GH200 GPUs' },
];
const MAX_EF = 2.3;

function Bar({ ef, id, hatched, delay }: { ef: number; id: string; hatched: boolean; delay: number }) {
  return (
    <div className="bar" style={{ border: 'none' }}>
      <svg width="100%" height="46" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <HatchDefs id={`-s6t${id}`} />
        <motion.rect
          x="0"
          y="0"
          height="46"
          initial={{ width: '0%' }}
          animate={{ width: `${(ef / MAX_EF) * 100}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          fill={hatched ? `url(#hatch-s6t${id})` : 'var(--ink)'}
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
      </svg>
      <span style={{ right: 'auto', left: `calc(${(ef / MAX_EF) * 100}% + 10px)` }}>{ef.toFixed(2)} EF</span>
    </div>
  );
}

export function Top500({ step }: SlideProps) {
  const twist = step >= 1;
  return (
    <Slide kicker="TOP500 · June 2026" title="So the GPU won, right?">
      <div className="s6-top">
        <AnimatePresence mode="wait">
          {twist ? (
            <motion.div
              key="first"
              className="s6-row first"
              initial={{ opacity: 0, scale: 1.25, y: -60 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: [0, -18, 14, -9, 6, 0] }}
              transition={{ type: 'spring', stiffness: 380, damping: 18, x: { type: 'tween', delay: 0.25, duration: 0.5 } }}
            >
              <div className="rk">1</div>
              <div className="nm">LineShine<small>China · 13.8 million CPU cores</small></div>
              <Bar ef={2.198} id="1" hatched={false} delay={0.2} />
              <div />
              <motion.div
                className="s6-stamp"
                initial={{ opacity: 0, scale: 2.4, rotate: -14, y: '-50%' }}
                animate={{ opacity: 1, scale: 1, rotate: -6, y: '-50%' }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 500, damping: 16 }}
              >
                GPUs: ZERO
              </motion.div>
              <motion.div
                className="s6-scratch"
                initial={{ opacity: 0, x: '-80%' }}
                animate={{ opacity: [0, 1, 1, 0], x: ['-80%', '-50%', '-45%', '-40%'] }}
                transition={{ type: 'tween', duration: 1.3 }}
              >
                ~ scrrrratch ~
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="empty" className="s6-empty" exit={{ opacity: 0 }}>
              #1 ?
            </motion.div>
          )}
        </AnimatePresence>

        {ROWS.map((r, i) => (
          <motion.div
            key={r.rk}
            className="s6-row"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.6 }}
          >
            <div className="rk">{r.rk}</div>
            <div className="nm">{r.nm}<small>{r.where}</small></div>
            <Bar ef={r.ef} id={String(r.rk)} hatched delay={0.15 * i + 0.2} />
            <div className="acc">{r.acc}</div>
          </motion.div>
        ))}

        <Reveal show={step >= 2} style={{ marginTop: 20, textAlign: 'center' }}>
          <p className="lede">The fastest computer on Earth has no GPUs at all. So maybe the story isn't over…</p>
        </Reveal>
      </div>
    </Slide>
  );
}
