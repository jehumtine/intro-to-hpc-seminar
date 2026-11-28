import { useEffect, useState } from 'react';
import { ANSWER_MAX, BETS_API, NAME_MAX, NUMERALS, QUESTIONS, fetchBets, placeBet, type Bet } from '../data/bets';
import { renderBetImage, shareOrDownload } from './shareImage';
import './bets.css';

const OTHER = '__other__';

/** One prediction: pick an option, or "Something else" with a text box. */
function QuestionField({ i, choice, other, onChoice, onOther }: {
  i: number; choice: string; other: string;
  onChoice: (v: string) => void; onOther: (v: string) => void;
}) {
  const q = QUESTIONS[i];
  return (
    <fieldset className="bet-q">
      <legend><span className="n">{NUMERALS[i]}</span>{q.text}</legend>
      <div className="bet-options">
        {[...q.options, OTHER].map((o) => (
          <label key={o} className={choice === o ? 'on' : ''}>
            <input type="radio" name={`q${i}`} value={o} checked={choice === o} onChange={() => onChoice(o)} />
            {o === OTHER ? 'Something else' : o}
          </label>
        ))}
      </div>
      {choice === OTHER && (
        <input className="bet-other" type="text" maxLength={ANSWER_MAX} placeholder="Your prediction" value={other}
          onChange={(e) => onOther(e.target.value)} autoFocus />
      )}
    </fieldset>
  );
}

/** Makes the story-sized image of someone's bets; shows a preview and shares or downloads it. */
function ShareBets({ name, answers, compact = false }: { name: string; answers: string[]; compact?: boolean }) {
  const [url, setUrl] = useState('');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [msg, setMsg] = useState('');

  async function make() {
    setMsg('Drawing…');
    try {
      const b = await renderBetImage(name, answers);
      setBlob(b);
      setUrl(URL.createObjectURL(b));
      setMsg('');
      return b;
    } catch {
      setMsg('Could not make the image.');
      return null;
    }
  }
  async function share() {
    const b = blob ?? (await make());
    if (!b) return;
    const how = await shareOrDownload(b, name);
    setMsg(how === 'downloaded' ? 'Saved to your downloads.' : '');
  }

  useEffect(() => {
    if (!compact) make();
  }, []);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  if (compact)
    return (
      <button type="button" className="bet-share-link" onClick={share}>
        {msg || 'Share as image'}
      </button>
    );
  return (
    <div className="bet-share">
      {url && <img src={url} alt={`${name}'s bets for 2036`} />}
      <button type="button" onClick={share} disabled={!blob}>Share my bets</button>
      {msg && <p className="hint">{msg}</p>}
    </div>
  );
}

function BetForm({ onPlaced }: { onPlaced: () => void }) {
  const [name, setName] = useState('');
  const [choices, setChoices] = useState<string[]>(QUESTIONS.map(() => ''));
  const [others, setOthers] = useState<string[]>(QUESTIONS.map(() => ''));
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  const answers = choices.map((c, i) => (c === OTHER ? others[i].trim() : c));
  const ready = name.trim() !== '' && answers.some((a) => a) && state !== 'saving';
  const set = (arr: string[], i: number, v: string) => arr.map((x, j) => (j === i ? v : x));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setState('saving');
    setError('');
    try {
      await placeBet(name.trim(), answers);
      setState('done');
      onPlaced();
    } catch (err) {
      setError((err as Error).message);
      setState('idle');
    }
  }

  if (state === 'done')
    return (
      <div className="bet-done">
        <p className="big">Your bet is in the book, {name.trim()}.</p>
        <p>We open it again in 2036. Show your friends what you bet:</p>
        <ShareBets name={name.trim()} answers={answers} />
        <button type="button" className="secondary" onClick={() => { setChoices(QUESTIONS.map(() => '')); setOthers(QUESTIONS.map(() => '')); setName(''); setState('idle'); }}>
          Place another bet
        </button>
      </div>
    );

  return (
    <form className="bet-form" onSubmit={submit}>
      {QUESTIONS.map((_, i) => (
        <QuestionField key={i} i={i} choice={choices[i]} other={others[i]}
          onChoice={(v) => setChoices(set(choices, i, v))} onOther={(v) => setOthers(set(others, i, v))} />
      ))}
      <label className="bet-name">
        <span className="eyebrow">Your name</span>
        <input type="text" maxLength={NAME_MAX} value={name} onChange={(e) => setName(e.target.value)} placeholder="So we can find you in 2036" />
      </label>
      {error && <p className="bet-error">{error}</p>}
      <button type="submit" disabled={!ready}>{state === 'saving' ? 'Saving…' : 'Place my bet'}</button>
      <p className="hint">Skip any you’re unsure of. Your name and bets are public on this page.</p>
    </form>
  );
}

function BetBook({ bets, error }: { bets: Bet[] | null; error: string }) {
  if (error) return <p className="bet-error">Couldn’t load the bets: {error}</p>;
  if (!bets) return <p className="hint">Opening the book…</p>;
  if (!bets.length) return <p className="hint">No bets yet. Be the first.</p>;
  return (
    <ol className="bet-book">
      {bets.map((b, k) => (
        <li key={k} className="bet-card">
          <div className="who">
            <span className="name">{b.name}</span>
            <span className="when">{b.time.split(' ')[0]}</span>
          </div>
          <dl>
            {b.answers.map((a, i) => a && (
              <div key={i}>
                <dt>{NUMERALS[i]}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
          <ShareBets name={b.name} answers={b.answers} compact />
        </li>
      ))}
    </ol>
  );
}

/** Standalone page (?bets): place a bet on the five 2036 predictions, and read everyone's. */
export function BetsPage() {
  const [bets, setBets] = useState<Bet[] | null>(null);
  const [error, setError] = useState('');

  const load = () => fetchBets().then(setBets, (e) => setError((e as Error).message));
  useEffect(() => {
    document.body.classList.add('scroll-page');
    if (BETS_API) load();
  }, []);

  return (
    <main className="bets-page">
      <header>
        <a className="back" href="./?explore">← Back to the symposium</a>
        <div className="eyebrow">Symposium · 28 November 2026</div>
        <h1>Place your bets</h1>
        <p className="lede">Five predictions for 2036. Write your name next to yours, and in ten years we open the book and see who was right.</p>
      </header>

      {!BETS_API ? (
        <p className="bet-error">The bet book isn’t connected yet.</p>
      ) : (
        <>
          <section>
            <BetForm onPlaced={load} />
          </section>
          <section>
            <h2>The book{bets ? ` · ${bets.length} ${bets.length === 1 ? 'bet' : 'bets'}` : ''}</h2>
            <BetBook bets={bets} error={error} />
          </section>
        </>
      )}
    </main>
  );
}
