import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { Reveal, Slide } from './common';

/**
 * "Gamers funded the AI revolution." A chain of five medallions, one per step,
 * then the big line, then the kicker about NVIDIA's size.
 */
const s = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const LINKS = [
  {
    label: 'Gamers want better explosions',
    icon: (
      <svg viewBox="0 0 100 100">
        <path d="M50 8 L58 34 L86 22 L68 46 L94 58 L64 62 L72 90 L50 70 L28 90 L36 62 L6 58 L32 46 L14 22 L42 34 Z" {...s} />
        <circle cx="50" cy="52" r="10" {...s} />
      </svg>
    ),
  },
  {
    label: 'NVIDIA builds massively parallel chips',
    icon: (
      <svg viewBox="0 0 100 100">
        <rect x="24" y="24" width="52" height="52" {...s} />
        <path d="M36 24V12 M50 24V12 M64 24V12 M36 76V88 M50 76V88 M64 76V88 M24 36H12 M24 50H12 M24 64H12 M76 36H88 M76 50H88 M76 64H88" {...s} strokeWidth={2.6} />
        <path d="M34 34h8v8h-8z M46 34h8v8h-8z M58 34h8v8h-8z M34 46h8v8h-8z M46 46h8v8h-8z M58 46h8v8h-8z M34 58h8v8h-8z M46 58h8v8h-8z M58 58h8v8h-8z" fill="var(--ink)" />
      </svg>
    ),
  },
  {
    label: 'Scientists hijack them',
    icon: (
      <svg viewBox="0 0 100 100">
        <path d="M40 10H60 M44 10V40 L20 84 Q18 90 26 90 H74 Q82 90 80 84 L56 40 V10" {...s} />
        <path d="M30 66 H70" {...s} strokeWidth={2} />
        <circle cx="44" cy="76" r="4" fill="var(--ink)" />
        <circle cx="58" cy="80" r="3" fill="var(--ink)" />
      </svg>
    ),
  },
  {
    label: 'A grad student and two cards',
    icon: (
      <svg viewBox="0 0 100 100">
        <rect x="12" y="26" width="76" height="20" {...s} />
        <rect x="12" y="56" width="76" height="20" {...s} />
        <circle cx="32" cy="36" r="6" {...s} strokeWidth={2.2} />
        <circle cx="32" cy="66" r="6" {...s} strokeWidth={2.2} />
        <path d="M48 36H80 M48 66H80" {...s} strokeWidth={2} />
      </svg>
    ),
  },
  {
    label: 'ChatGPT, AlphaFold, and the rest',
    icon: (
      <svg viewBox="0 0 100 100">
        <path d="M10 16H90V64H46L26 82V64H10Z" {...s} />
        <path d="M24 32H76 M24 46H60" {...s} strokeWidth={2.6} />
      </svg>
    ),
  },
];

export const CHAIN_STEPS = LINKS.length + 2; // the five links, then the big line, then the kicker

export function Chain({ step }: SlideProps) {
  return (
    <Slide>
      <div className="s5-chain">
        <Reveal show={step >= LINKS.length} className="quote" y={30}>
          Gamers funded the AI revolution.
        </Reveal>
        <div className="s5-links">
          {LINKS.map((l, i) => (
            <motion.div
              key={i}
              className="s5-link"
              initial={false}
              animate={{ opacity: i <= step ? 1 : 0, y: i <= step ? 0 : 30, scale: i <= step ? 1 : 0.9 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            >
              <div className="medal">{l.icon}</div>
              <div className="lbl">{l.label}</div>
              {i < LINKS.length - 1 && <div className="arrow">→</div>}
            </motion.div>
          ))}
        </div>
        <Reveal show={step >= LINKS.length + 1} className="foot">
          A company that sold graphics cards to teenagers is now worth more than the economy of almost every country on Earth.
        </Reveal>
      </div>
    </Slide>
  );
}
