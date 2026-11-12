import { motion } from 'motion/react';
import { SECTIONS } from '../deck/types';
import { PlateCrop } from './common';

/** Chapter opener: a detail of the engraving + the section's numeral, name and thesis. */
export function SectionCard({ section, thesis, focus, zoom, active }: { section: number; thesis: string; focus: string; zoom?: number; active: boolean }) {
  const s = SECTIONS[section];
  return (
    <div className="section-card">
      <motion.div initial={false} animate={{ scale: active ? 1 : 1.04 }} transition={{ duration: 6, ease: 'linear' }} style={{ transformOrigin: '50% 50%' }}>
        <PlateCrop focus={focus} zoom={zoom} className="section-plate" />
      </motion.div>
      <div className="section-text">
        <div className="eyebrow">Part {s.numeral}</div>
        <div className="numeral">{s.numeral}</div>
        <h1>{s.name}</h1>
        <div className="rule-ornament left">
          <span />◆
        </div>
        <p className="thesis">{thesis}</p>
      </div>
    </div>
  );
}
