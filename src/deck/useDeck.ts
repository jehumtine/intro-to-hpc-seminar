import { useCallback, useEffect, useRef, useState } from 'react';
import type { SlideDef } from './types';

export interface Pos {
  slide: number;
  step: number;
}

type Msg = { type: 'pos'; pos: Pos; from: string } | { type: 'hello'; from: string } | { type: 'blank'; on: boolean; from: string };

const CHANNEL = 'hpc-seminar';
const me = Math.random().toString(36).slice(2);

function parseHash(slides: SlideDef[]): Pos {
  const m = location.hash.match(/^#\/(\d+)(?:\/(\d+))?/);
  if (!m) return { slide: 0, step: 0 };
  const slide = Math.min(Math.max(0, +m[1]), slides.length - 1);
  const step = Math.min(Math.max(0, +(m[2] ?? 0)), slides[slide].steps - 1);
  return { slide, step };
}

/**
 * Deck state: current slide + build step, keyboard control, URL hash persistence,
 * and two-way sync between the audience window and the presenter window.
 */
export function useDeck(slides: SlideDef[], { sync = true }: { sync?: boolean } = {}) {
  const [pos, setPos] = useState<Pos>(() => parseHash(slides));
  const [blank, setBlank] = useState(false);
  const chan = useRef<BroadcastChannel | null>(null);
  const posRef = useRef(pos);
  posRef.current = pos;

  const apply = useCallback((p: Pos, broadcast = true) => {
    setPos(p);
    history.replaceState(null, '', `#/${p.slide}/${p.step}`);
    if (broadcast) chan.current?.postMessage({ type: 'pos', pos: p, from: me } satisfies Msg);
  }, []);

  const next = useCallback(() => {
    const { slide, step } = posRef.current;
    if (step < slides[slide].steps - 1) apply({ slide, step: step + 1 });
    else if (slide < slides.length - 1) apply({ slide: slide + 1, step: 0 });
  }, [apply, slides]);

  const prev = useCallback(() => {
    const { slide, step } = posRef.current;
    if (step > 0) apply({ slide, step: step - 1 });
    else if (slide > 0) apply({ slide: slide - 1, step: slides[slide - 1].steps - 1 });
  }, [apply, slides]);

  const goto = useCallback((slide: number, step = 0) => apply({ slide, step }), [apply]);

  const toggleBlank = useCallback(() => {
    setBlank((b) => {
      chan.current?.postMessage({ type: 'blank', on: !b, from: me } satisfies Msg);
      return !b;
    });
  }, []);

  // cross-window sync (off in explore mode, so a visitor's tab never drives anyone else's)
  useEffect(() => {
    if (!sync) return;
    const c = new BroadcastChannel(CHANNEL);
    chan.current = c;
    c.onmessage = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (m.from === me) return;
      if (m.type === 'pos') apply(m.pos, false);
      if (m.type === 'blank') setBlank(m.on);
      if (m.type === 'hello') c.postMessage({ type: 'pos', pos: posRef.current, from: me } satisfies Msg);
    };
    c.postMessage({ type: 'hello', from: me } satisfies Msg);
    return () => c.close();
  }, [apply, sync]);

  // keyboard (works with most presentation clickers, which send PageUp/PageDown)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // a focused slider / text box / demo keeps its keys, but the clicker (PageUp/PageDown) always works
      const clicker = e.key === 'PageDown' || e.key === 'PageUp';
      const t = e.target instanceof HTMLElement ? e.target : null;
      if (!clicker && t && (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.closest('[data-keys]'))) return;
      switch (e.key) {
        case 'ArrowRight': case 'PageDown': case ' ': case 'Enter':
          e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'PageUp': case 'Backspace':
          e.preventDefault(); prev(); break;
        case 'Home': goto(0); break;
        case 'End': goto(slides.length - 1); break;
        case 'b': case 'B': case '.': toggleBlank(); break;
        case 'f': case 'F':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case 'p': case 'P':
          window.open(`${location.pathname}?presenter${location.hash}`, 'hpc-presenter', 'width=1280,height=800');
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goto, toggleBlank, slides.length]);

  return { pos, next, prev, goto, blank, toggleBlank };
}
