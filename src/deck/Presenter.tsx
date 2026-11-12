import { useEffect, useState } from 'react';
import { SECTIONS, type SlideDef } from './types';
import { useDeck } from './useDeck';

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(Math.abs(ms) / 1000));
  return `${ms < 0 ? '−' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Planned start time (ms) of each section, from the minute budgets. */
const sectionStart = SECTIONS.reduce<number[]>((acc, s, i) => (acc.push(i === 0 ? 0 : acc[i - 1] + SECTIONS[i - 1].minutes * 60000), acc), []);

/**
 * Presenter view (open with `p`, or add ?presenter to the URL). Stays in sync with the
 * audience window over BroadcastChannel; you can drive the talk from either.
 */
export function Presenter({ slides }: { slides: SlideDef[] }) {
  const { pos, next, prev, goto, blank, toggleBlank } = useDeck(slides);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  // timer starts automatically the first time you advance past the title
  useEffect(() => {
    if (startedAt === null && (pos.slide > 0 || pos.step > 0)) setStartedAt(Date.now());
  }, [pos, startedAt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') setStartedAt((s) => (s === null ? Date.now() : null));
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const cur = slides[pos.slide];
  const nxt = slides[pos.slide + 1];
  const elapsed = startedAt ? now - startedAt : 0;
  // how far ahead (+) / behind (−) the plan you are, measured against the start of this section
  const drift = startedAt ? sectionStart[cur.section] - elapsed : 0;

  return (
    <div className="presenter">
      <header>
        <div className="p-clock">
          <div className="p-big">{fmt(elapsed)}</div>
          <div className="p-small">elapsed {startedAt === null && '(starts on first advance · t to toggle)'}</div>
        </div>
        <div className={`p-clock ${drift < -60000 ? 'late' : ''}`}>
          <div className="p-big">{startedAt ? (drift >= 0 ? '+' : '') + fmt(drift) : '—'}</div>
          <div className="p-small">vs plan for this section</div>
        </div>
        <div className="p-clock">
          <div className="p-big">{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="p-small">wall clock</div>
        </div>
      </header>

      <main>
        <div className="p-now">
          <div className="p-section">
            {SECTIONS[cur.section].numeral} {SECTIONS[cur.section].name} · {SECTIONS[cur.section].minutes} min
          </div>
          <h1>{cur.title}</h1>
          <div className="p-steps">
            {Array.from({ length: cur.steps }, (_, i) => (
              <span key={i} className={i <= pos.step ? 'on' : ''} />
            ))}
            <em>
              slide {pos.slide + 1}/{slides.length} · step {pos.step + 1}/{cur.steps}
            </em>
          </div>
          <div className="p-notes">{cur.notes.split('\n').map((l, i) => <p key={i}>{l}</p>)}</div>
        </div>
        <aside>
          <div className="p-small">next</div>
          <h2>{nxt ? nxt.title : '— end —'}</h2>
          <div className="p-controls">
            <button onClick={prev}>◀ back</button>
            <button onClick={next}>next ▶</button>
            <button onClick={toggleBlank} className={blank ? 'on' : ''}>{blank ? 'unblank' : 'blank (b)'}</button>
          </div>
          <ol className="p-index">
            {slides.map((s, i) => (
              <li key={s.id} className={i === pos.slide ? 'cur' : ''} onClick={() => goto(i)}>
                <span>{SECTIONS[s.section].numeral || '·'}</span> {s.title}
              </li>
            ))}
          </ol>
        </aside>
      </main>
    </div>
  );
}
