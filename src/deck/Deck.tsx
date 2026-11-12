import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SECTIONS, STAGE_H, STAGE_W, type SlideDef } from './types';
import { useDeck } from './useDeck';
import { Meander } from './Meander';

/** Heavy, deliberate pan, like a camera sliding along a frieze. */
const PAN = { duration: 1.25, ease: [0.65, 0, 0.35, 1] as const };

/** Elements a click should NOT treat as "advance the talk". */
const INTERACTIVE = 'button,input,select,textarea,a,label,canvas,[data-interactive]';

function useStageScale() {
  const calc = () => Math.min(innerWidth / STAGE_W, innerHeight / STAGE_H);
  const [s, setS] = useState(calc);
  useEffect(() => {
    const on = () => setS(calc());
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  return s;
}

/**
 * Audience view: all slides laid out left → right on one long frieze; the camera pans along it.
 *
 * Two modes:
 *  - talk (default): click anywhere / clicker / arrows to advance; synced with the presenter window.
 *  - explore (?explore): for visitors on their own phone or laptop. On-screen arrows, swipe,
 *    a contents menu, no sync, and clicks go to the demos instead of advancing.
 */
export function Deck({ slides, explore }: { slides: SlideDef[]; explore: boolean }) {
  const { pos, next, prev, goto, blank } = useDeck(slides, { sync: !explore });
  const scale = useStageScale();
  const [menu, setMenu] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const cur = slides[pos.slide];
  const sec = SECTIONS[cur.section];
  const atEnd = pos.slide === slides.length - 1 && pos.step === cur.steps - 1;
  const atStart = pos.slide === 0 && pos.step === 0;

  return (
    <div
      className={`viewport ${explore ? 'explore' : ''}`}
      onClick={(e) => {
        if (explore || e.detail !== 1) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
        next();
      }}
      onTouchStart={(e) => {
        if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const t0 = touch.current;
        touch.current = null;
        if (!t0) return;
        const dx = e.changedTouches[0].clientX - t0.x;
        const dy = e.changedTouches[0].clientY - t0.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
      }}
    >
      <div className="stage" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
        <motion.div className="track" style={{ width: STAGE_W * slides.length }} initial={false} animate={{ x: -pos.slide * STAGE_W }} transition={PAN}>
          <div className="frieze-band top" />
          <div className="frieze-band bottom" />
          {slides.map((s, i) => {
            // only mount slides near the camera; keeps animations cheap
            const near = Math.abs(i - pos.slide) <= 1;
            return (
              <section key={s.id} className="panel" style={{ left: i * STAGE_W }}>
                {i > 0 && <div className="column-rule" />}
                {near && s.render({ step: i === pos.slide ? pos.step : i < pos.slide ? s.steps - 1 : 0, active: i === pos.slide, explore })}
              </section>
            );
          })}
        </motion.div>

        <div className="progress">
          <Meander progress={(pos.slide + (pos.step + 1) / cur.steps) / slides.length} />
          <div className="progress-label">
            {sec.numeral && <span>{sec.numeral} · </span>}
            {sec.name}
          </div>
        </div>

        {explore && (
          <>
            <button className="nav-arrow left" onClick={prev} disabled={atStart} aria-label="Back">‹</button>
            <button className="nav-arrow right" onClick={next} disabled={atEnd} aria-label="Next">›</button>
            <button className="nav-menu" onClick={() => setMenu((m) => !m)}>
              {menu ? 'Close' : 'Contents'}
            </button>
            {cur.steps > 1 && (
              <div className="step-dots">
                {Array.from({ length: cur.steps }, (_, i) => <span key={i} className={i <= pos.step ? 'on' : ''} />)}
              </div>
            )}
            {menu && (
              <div className="contents" data-interactive>
                <div className="eyebrow">Contents</div>
                <ol>
                  {slides.map((s, i) => (
                    <li key={s.id} className={i === pos.slide ? 'cur' : ''} onClick={() => { goto(i); setMenu(false); }}>
                      <span>{SECTIONS[s.section].numeral || '·'}</span>
                      {s.title}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}

        <motion.div className="blackout" animate={{ opacity: blank ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ pointerEvents: blank ? 'auto' : 'none' }} />
      </div>
    </div>
  );
}
