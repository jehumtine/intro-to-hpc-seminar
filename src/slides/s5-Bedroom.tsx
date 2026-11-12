import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal, Slide } from './common';

/**
 * 2012: a bedroom in Toronto. Line-art desk + PC with two GTX 580s.
 * step 0 scene · step 1 the two cards hum · step 2 a week of training runs
 * Explore: "Train" button reruns the week.
 */
const DAYS = 6;

export function Bedroom({ step, active, explore }: SlideProps) {
  const [day, setDay] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!active || step < 2) {
      setDay(0);
      return;
    }
    setDay(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const d = Math.min(DAYS, ((performance.now() - t0) / 4000) * DAYS);
      setDay(d);
      if (d < DAYS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, step, run]);

  const hum = step >= 1;

  return (
    <Slide kicker="Toronto · 2012" title="A bedroom, two gaming cards">
      <div className="s5-bedroom">
        <svg viewBox="0 0 900 620" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <HatchDefs id="-s5b" />
          {/* wall shading */}
          <rect x="0" y="0" width="900" height="560" fill="url(#lines-s5b)" opacity="0.12" stroke="none" />
          {/* window, night sky, moon */}
          <rect x="60" y="60" width="230" height="260" fill="url(#lines-s5b)" opacity="0.9" />
          <rect x="60" y="60" width="230" height="260" fill="none" strokeWidth="4" />
          <circle cx="215" cy="135" r="34" fill="var(--paper)" />
          <circle cx="230" cy="125" r="30" fill="url(#lines-s5b)" stroke="none" />
          <line x1="175" y1="60" x2="175" y2="320" strokeWidth="5" />
          <line x1="60" y1="190" x2="290" y2="190" strokeWidth="5" />
          {/* floor */}
          <line x1="0" y1="560" x2="900" y2="560" strokeWidth="3" />
          <rect x="0" y="560" width="900" height="60" fill="url(#hatch-s5b)" opacity="0.25" stroke="none" />
          {/* desk */}
          <rect x="300" y="380" width="560" height="20" fill="var(--paper)" />
          <line x1="325" y1="400" x2="325" y2="560" strokeWidth="5" />
          <line x1="835" y1="400" x2="835" y2="560" strokeWidth="5" />
          {/* monitor with a falling loss curve */}
          <rect x="330" y="215" width="240" height="150" fill="var(--paper)" />
          <rect x="342" y="227" width="216" height="126" fill="none" strokeWidth="1.2" />
          <motion.path
            d="M355 245 C 390 300, 420 320, 470 330 S 540 338, 548 340"
            strokeWidth="2.4"
            initial={false}
            animate={{ pathLength: step >= 2 ? Math.max(0.02, day / DAYS) : 0.02 }}
            transition={{ duration: 0.1 }}
          />
          <text x="350" y="345" fontSize="13" fill="var(--ink)" stroke="none" fontFamily="var(--serif)" fontStyle="italic">error</text>
          <line x1="450" y1="365" x2="450" y2="380" strokeWidth="5" />
          <rect x="410" y="372" width="80" height="8" fill="var(--paper)" />
          {/* keyboard + mug */}
          <path d="M600 345 h34 v34 h-34 z" fill="var(--paper)" />
          <path d="M634 352 q14 0 14 10 q0 10 -14 10" />
          <path d="M608 336 q4 -8 0 -14 M620 336 q4 -8 0 -14" strokeWidth="1.4" />
          {/* PC tower, side panel off */}
          <rect x="660" y="190" width="180" height="190" fill="var(--paper)" strokeWidth="3" />
          <rect x="672" y="202" width="156" height="166" fill="url(#dots-s5b)" opacity="0.35" stroke="none" />
          {[236, 296].map((y, i) => (
            <g key={y}>
              <rect x="676" y={y} width="140" height="40" fill="url(#hatch-s5b)" />
              <rect x="676" y={y} width="140" height="40" fill="none" strokeWidth="2.6" />
              <circle cx="716" cy={y + 20} r="14" fill="var(--paper)" />
              <motion.g
                style={{ originX: '716px', originY: `${y + 20}px` }}
                animate={hum ? { rotate: 360 } : { rotate: 0 }}
                transition={hum ? { repeat: Infinity, duration: 0.6 + i * 0.07, ease: 'linear' } : { duration: 0.3 }}
              >
                <line x1={704} y1={y + 20} x2={728} y2={y + 20} strokeWidth="2" />
                <line x1={716} y1={y + 8} x2={716} y2={y + 32} strokeWidth="2" />
              </motion.g>
              <rect x="742" y={y + 9} width="68" height="22" fill="var(--paper)" strokeWidth="1.4" />
              <text x="776" y={y + 25} textAnchor="middle" fontSize="14" fill="var(--ink)" stroke="none" fontFamily="var(--display)" fontWeight="600">GTX 580</text>
            </g>
          ))}
          {/* the hum: radiating strokes */}
          {Array.from({ length: 14 }, (_, k) => {
            const a = (k / 14) * Math.PI * 2;
            const cx = 750, cy = 285;
            return (
              <motion.line
                key={k}
                x1={cx + Math.cos(a) * 125}
                y1={cy + Math.sin(a) * 125}
                x2={cx + Math.cos(a) * 150}
                y2={cy + Math.sin(a) * 150}
                strokeWidth="2"
                initial={false}
                animate={{ opacity: hum ? [0.15, 1, 0.15] : 0 }}
                transition={hum ? { repeat: Infinity, duration: 1.2, delay: (k % 4) * 0.15 } : { duration: 0.3 }}
              />
            );
          })}
          {/* chair */}
          <path d="M200 370 V560 M200 470 H290 M290 470 V560" strokeWidth="5" />
          <path d="M200 380 H236 M200 410 H236 M236 380 V410" strokeWidth="3" />
        </svg>

        <div className="s5-side">
          <p>
            In 2012, everyone in AI agreed: neural networks were a <em>dead end</em>. Too slow to train.
          </p>
          <div className="who">
            <div><b>Alex Krizhevsky</b> grad student</div>
            <div><b>Ilya Sutskever</b> grad student</div>
            <div><b>Geoffrey Hinton</b> their advisor</div>
          </div>
          <Reveal show={step >= 1}>
            <p>
              Alex bought <b>two gaming cards</b>, plugged them in at his parents' house, and wrote CUDA.
            </p>
          </Reveal>
          <Reveal show={step >= 2} className="s5-train">
            <div className="days">
              {Array.from({ length: DAYS }, (_, i) => <span key={i}>Day {i + 1}</span>)}
            </div>
            <div className="bar"><div style={{ width: `${(day / DAYS) * 100}%` }} /></div>
            <p style={{ fontSize: 28 }}>
              {day >= DAYS ? 'About a week later: the network can see.' : 'Training…'}
            </p>
            {explore && (
              <button className="btn" onClick={() => setRun((r) => r + 1)}>Train again</button>
            )}
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}
