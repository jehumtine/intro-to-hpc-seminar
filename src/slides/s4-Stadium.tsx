import { useEffect, useRef, useState } from 'react';
import type { SlideProps } from '../deck/types';
import { HatchDefs, Reveal } from './common';

/*
 * Genius vs Stadium: latency hiding, as a live simulation.
 * Each tick the genius (CPU) works unless waiting for data (its big desk/cache shortens the wait).
 * The stadium (GPU) has squads of 32 (warps); each tick ONE ready squad works; any squad may
 * then go off to fetch data and wait `latency` ticks. With enough squads, someone is always ready.
 *   step 0 genius · step 1 stadium · step 2 "make squad 3 wait" demo · step 3 the punchline
 */

const TICK = 140;
const P_MEM = 0.3;

interface Sim {
  genius: number; // ticks left waiting
  geniusWork: number;
  geniusTicks: number;
  squads: number[]; // ticks left waiting per squad
  last: number; // squad that worked last tick (-1 none)
  rr: number;
  gpuWork: number;
  gpuTicks: number;
}

function newSim(nSquads: number): Sim {
  // start mid-flight so a still frame already tells the story
  return { genius: 3, geniusWork: 6, geniusTicks: 10, squads: Array.from({ length: nSquads }, (_, i) => (i % 3 === 0 ? 0 : (i * 5) % 17)), last: 0, rr: 0, gpuWork: 9, gpuTicks: 10 };
}

function tick(s: Sim, latency: number) {
  // genius
  s.geniusTicks++;
  if (s.genius > 0) s.genius--;
  else {
    s.geniusWork++;
    if (Math.random() < P_MEM) s.genius = Math.max(1, Math.round(latency * 0.4));
  }
  // stadium
  s.gpuTicks++;
  s.squads = s.squads.map((w) => (w > 0 ? w - 1 : 0));
  s.last = -1;
  for (let k = 0; k < s.squads.length; k++) {
    const i = (s.rr + k) % s.squads.length;
    if (s.squads[i] === 0) {
      s.last = i;
      s.rr = i + 1;
      s.gpuWork++;
      if (Math.random() < P_MEM) s.squads[i] = latency;
      break;
    }
  }
}

function Genius({ waiting }: { waiting: boolean }) {
  return (
    <svg width="460" height="300" viewBox="0 0 460 300">
      <HatchDefs id="-gn" />
      {/* filing cabinets: the cache */}
      {[0, 1].map((k) => (
        <g key={k}>
          <rect x={300 + k * 76} y="70" width="70" height="200" fill="url(#lines-gn)" stroke="var(--ink)" strokeWidth="2.5" />
          {[0, 1, 2, 3].map((d) => (
            <rect key={d} x={308 + k * 76} y={80 + d * 48} width="54" height="38" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          ))}
        </g>
      ))}
      <text x="372" y="60" textAnchor="middle" fontFamily="var(--display)" fontSize="18" letterSpacing="3">CACHE</text>
      {/* desk */}
      <rect x="20" y="170" width="280" height="18" fill="var(--ink)" />
      <rect x="34" y="188" width="14" height="84" fill="var(--ink)" />
      <rect x="270" y="188" width="14" height="84" fill="var(--ink)" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={200 + k * 3} y={150 - k * 9} width="70" height="9" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      ))}
      {/* the genius */}
      <circle cx="120" cy="92" r="24" fill={waiting ? 'var(--paper)' : 'var(--ink)'} stroke="var(--ink)" strokeWidth="3" />
      <path d="M78 172 Q78 122 120 122 Q162 122 162 172 Z" fill={waiting ? 'var(--paper)' : 'var(--ink)'} stroke="var(--ink)" strokeWidth="3" />
      <line x1="150" y1="140" x2={waiting ? 172 : 198} y2={waiting ? 120 : 162} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      {waiting && (
        <text x="120" y="50" textAnchor="middle" fontStyle="italic" fontSize="24">
          …waiting for data
        </text>
      )}
    </svg>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <div className="meter-label">{label}</div>
      <div className="meter-bar">
        <div className="meter-fill" style={{ width: `${value * 100}%` }} />
      </div>
      <div className="meter-val num">{Math.round(value * 100)}%</div>
    </div>
  );
}

export function Stadium({ step, active, explore }: SlideProps) {
  const [latency, setLatency] = useState(20);
  const [nSquads, setNSquads] = useState(10);
  const sim = useRef<Sim>(newSim(10));
  const [, force] = useState(0);
  const showStadium = step >= 1;

  useEffect(() => {
    sim.current = newSim(nSquads);
    force((x) => x + 1);
  }, [nSquads]);

  // step 2: squad III goes off to fetch data, so you can watch the next squad take over
  useEffect(() => {
    if (step === 2 && sim.current.squads.length > 2) {
      sim.current.squads[2] = latency * 2;
      force((x) => x + 1);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      tick(sim.current, latency);
      force((x) => x + 1);
    }, TICK);
    return () => clearInterval(t);
  }, [active, latency]);

  const s = sim.current;
  const cpuUtil = s.geniusWork / s.geniusTicks;
  const gpuUtil = s.gpuWork / s.gpuTicks;

  return (
    <div className="slide stadium">
      <div className="slide-kicker">How a GPU thinks</div>
      <h2 className="slide-h">One genius vs a stadium</h2>
      <div className="stadium-main">
        <div className="st-col genius-col">
          <div className="col-title">
            <b>CPU</b> one genius, a huge desk
          </div>
          <Genius waiting={s.genius > 0} />
          <Meter label="busy" value={cpuUtil} />
        </div>
        <Reveal show={showStadium} className="st-col stadium-col">
          <div className="col-title">
            <b>GPU</b> squads of 32 (“warps”)
          </div>
          <div className="squads">
            {s.squads.map((w, i) => (
              <div key={i} className={`squad ${s.last === i ? 'working' : ''} ${w > 0 ? 'waiting' : ''}`}>
                <span className="squad-n">{i + 1}</span>
                <span className="squad-dots">
                  {Array.from({ length: 32 }, (_, k) => (
                    <i key={k} />
                  ))}
                </span>
                <span className="squad-state">{w > 0 ? 'waiting for data…' : s.last === i ? 'working' : 'ready'}</span>
              </div>
            ))}
          </div>
          <Meter label="busy" value={gpuUtil} />
        </Reveal>
      </div>
      <div className="stadium-bottom" data-interactive>
        {(explore || step >= 1) && (
          <>
            <div className="control">
              <label>Trip to memory</label>
              <input type="range" min={2} max={40} value={latency} onChange={(e) => setLatency(+e.target.value)} style={{ width: 260 }} />
              <span className="num">{latency}</span>
            </div>
            {showStadium && (
              <>
                <div className="control">
                  <label>Squads</label>
                  <input type="range" min={1} max={14} value={nSquads} onChange={(e) => setNSquads(+e.target.value)} style={{ width: 220 }} />
                  <span className="num">{nSquads}</span>
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    if (sim.current.squads.length > 2) sim.current.squads[2] = latency * 2;
                    force((x) => x + 1);
                  }}
                >
                  Make squad 3 wait
                </button>
              </>
            )}
          </>
        )}
      </div>
      <Reveal show={step >= 3} className="stadium-punch">
        Speed doesn't come from being smart. It comes from <b>never being idle.</b>
      </Reveal>
    </div>
  );
}
