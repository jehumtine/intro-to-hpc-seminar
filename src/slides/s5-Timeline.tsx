import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { Slide } from './common';

/**
 * The fast timeline: one card slams in per step. The newest card's one-line story shows
 * underneath; anyone can click any revealed card to read its story instead.
 */
const EVENTS = [
  { yr: '2012', what: 'AlexNet', sub: 'two gaming cards', story: 'Two gaming cards in a bedroom, and computers learn to see.', icon: 'eye' },
  { yr: '2016', what: 'AlphaGo', sub: 'beats the world champion', story: 'Beats Lee Sedol at Go, a game with more positions than atoms in the universe.', icon: 'go' },
  { yr: '2017', what: 'The Transformer', sub: 'the "T" in ChatGPT', story: '"Attention Is All You Need." Eight Google researchers write the recipe every chatbot now uses.', icon: 't' },
  { yr: '2020', what: 'AlphaFold', sub: 'protein folding, solved', story: 'Predicts the shape of proteins: a fifty-year-old problem in biology, cracked.', icon: 'helix' },
  { yr: '2022', what: 'ChatGPT', sub: '100M users in 2 months', story: 'One hundred million people in two months. The fastest-growing app the world had ever seen.', icon: 'chat' },
  { yr: '2024', what: 'Two Nobels', sub: 'Physics and Chemistry', story: 'The Nobel Prizes in Physics and in Chemistry both go to AI work in the same week.', icon: 'medal' },
  { yr: '2025', what: '$5 Trillion', sub: 'NVIDIA', story: 'The gaming-card company becomes the first $5 trillion company in history.', icon: 'coin' },
];

function Icon({ kind }: { kind: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'eye':
      return <svg viewBox="0 0 84 84"><path d="M8 42 Q42 10 76 42 Q42 74 8 42Z" {...s} /><circle cx="42" cy="42" r="12" {...s} /><circle cx="42" cy="42" r="4" fill="currentColor" /></svg>;
    case 'go':
      return <svg viewBox="0 0 84 84"><path d="M14 14H70V70H14Z M14 32H70 M14 52H70 M32 14V70 M52 14V70" {...s} strokeWidth={2} /><circle cx="32" cy="32" r="8" fill="currentColor" /><circle cx="52" cy="52" r="8" fill="var(--paper)" stroke="currentColor" strokeWidth="3" /><circle cx="52" cy="32" r="8" fill="currentColor" /></svg>;
    case 't':
      return <svg viewBox="0 0 84 84"><text x="42" y="64" textAnchor="middle" fontSize="62" fontFamily="var(--display)" fontWeight="600" fill="currentColor">T</text></svg>;
    case 'helix':
      return <svg viewBox="0 0 84 84"><path d="M26 8 C 26 30, 58 30, 58 42 S 26 54, 26 76 M58 8 C 58 30, 26 30, 26 42 S 58 54, 58 76 M30 20H54 M30 64H54 M36 42H48" {...s} /></svg>;
    case 'chat':
      return <svg viewBox="0 0 84 84"><path d="M10 16H74V56H38L22 70V56H10Z" {...s} /><path d="M22 30H62 M22 42H50" {...s} strokeWidth={2.4} /></svg>;
    case 'medal':
      return <svg viewBox="0 0 84 84"><path d="M28 8L38 34 M56 8L46 34" {...s} /><circle cx="42" cy="52" r="20" {...s} /><circle cx="42" cy="52" r="12" {...s} strokeWidth={1.6} /></svg>;
    default:
      return <svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="30" {...s} /><circle cx="42" cy="42" r="23" {...s} strokeWidth={1.6} /><text x="42" y="54" textAnchor="middle" fontSize="34" fontFamily="var(--display)" fontWeight="600" fill="currentColor">$</text></svg>;
  }
}

export function Timeline({ step, explore }: SlideProps) {
  const [picked, setPicked] = useState<number | null>(null);
  // a new step means a new card: follow it
  useEffect(() => setPicked(null), [step]);
  const sel = picked ?? step;

  return (
    <Slide kicker="2012 → 2025" title="Then everything happened at once">
      <div className="s5-timeline">
        <div className="s5-cards">
          {EVENTS.map((e, i) => (
            <AnimatePresence key={e.yr}>
              {i <= step && (
                <motion.div
                  className={`s5-card ${i === sel ? 'sel' : ''}`}
                  data-interactive
                  onClick={() => setPicked(i)}
                  initial={{ opacity: 0, scale: 1.7, rotate: i % 2 ? 6 : -6, y: -40 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                >
                  <div className="yr">{e.yr}</div>
                  <Icon kind={e.icon} />
                  <div className="what">{e.what}</div>
                  <div className="rule" />
                  <div className="sub">{e.sub}</div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={sel} className="s5-story" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            {EVENTS[Math.min(sel, EVENTS.length - 1)].story}
          </motion.p>
        </AnimatePresence>
        {explore && <p className="hint" style={{ textAlign: 'center' }}>Tap any card to read its story.</p>}
      </div>
    </Slide>
  );
}

export const TIMELINE_STEPS = EVENTS.length;
