import type { SlideProps } from '../deck/types';
import { PlateCrop, Reveal } from './common';

const PROMPTS = [
  'What is the third free lunch? Quantum, optical, specialised chips, something else?',
  'Is AI worth the electricity? Where do we draw the line?',
  'Did NVIDIA get lucky, or did they see it coming?',
  'Can Zambia and Africa take part in the compute race?',
  'If you had a supercomputer for one day, what would you simulate?',
];

/**
 * Where the site will live online. Leave empty until it's deployed; once set, the
 * QR slot below shows in talk mode too (drop a QR image/component into it then).
 */
const ONLINE_URL = '';

function QrSlot() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        marginTop: 16,
      }}
    >
      {/* TODO: QR code for ONLINE_URL goes here (no QR library yet) */}
      <div
        style={{
          width: 96,
          height: 96,
          border: '2px dashed var(--ink-faint)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--display)',
          fontSize: 18,
          color: 'var(--ink-faint)',
          flex: 'none',
        }}
      >
        QR
      </div>
      <p className="hint" style={{ fontSize: 26 }}>{ONLINE_URL || 'online version: link coming soon'}</p>
    </div>
  );
}

export function Closing({ step, explore }: SlideProps) {
  return (
    <div className="closing">
      <PlateCrop focus="72% 50%" zoom="cover" className="closing-plate" />
      <div className="closing-body">
        <Reveal show={step === 0} className="closing-question" style={{ position: 'absolute' }}>
          <p>The first free lunch was <em>speed</em>.</p>
          <p>The second was <em>parallelism</em>.</p>
          <p className="big">What is the third?</p>
        </Reveal>
        <Reveal show={step >= 1} className="closing-prompts">
          <div className="eyebrow">Symposium</div>
          <ol>
            {PROMPTS.map((p, i) => (
              <li key={i} style={explore ? { fontSize: 31, marginBottom: 20 } : undefined}>
                <span className="n">{['I', 'II', 'III', 'IV', 'V'][i]}</span>
                {p}
              </li>
            ))}
          </ol>
          {explore && (
            <p style={{ fontSize: 26, fontStyle: 'italic', marginTop: 0 }}>
              Thank you for exploring. Go back and play with any demo: every slider is yours.
            </p>
          )}
          {(explore || ONLINE_URL) && <QrSlot />}
        </Reveal>
      </div>
    </div>
  );
}
