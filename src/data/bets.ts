/**
 * The five dated bets from the closing slide, and the link to the Google Sheet that stores them.
 * The Sheet side lives in apps-script/Code.gs (see README → "Bets").
 */

/** Web-app URL of the deployed Apps Script (ends in /exec). Empty = bets page shows "not connected". */
export const BETS_API = 'https://script.google.com/macros/s/AKfycbwg9Kw5NE1UGsSmwTWGbaQUW_yIZkJTQD-jLF_VGUv5fcr2cbs07p9eAVLkGQuNJ3Ks/exec';

/** `short` is the label used on the shareable image. */
export type Question = { text: string; short: string; options: string[] };

export const QUESTIONS: Question[] = [
  {
    text: 'By 2036, where does the next big speed-up come from? Quantum, optical, specialised chips, or better software?',
    short: 'Where the next big speed-up comes from',
    options: ['Quantum computers', 'Optical (light-based) chips', 'Specialised chips', 'Better software'],
  },
  {
    text: 'In 2036, what will HPC mostly be used for? AI, climate and weather, drug discovery, something else?',
    short: 'What HPC is mostly used for',
    options: ['AI', 'Climate and weather', 'Drug discovery and biology'],
  },
  {
    text: 'In 10 years, is NVIDIA still the king of AI chips? If not, who took the crown?',
    short: 'King of AI chips',
    options: ['Yes, still NVIDIA', 'AMD', 'Google (TPUs)', 'A Chinese chipmaker'],
  },
  {
    text: 'By 2036, will Africa have a supercomputer in the world top 10? Will Zambia?',
    short: 'Top-10 supercomputer in Africa? In Zambia?',
    options: ['Neither', 'Africa yes, Zambia no', 'Both: Zambia too'],
  },
  {
    text: 'In 10 years, will your phone run an AI as smart as today’s ChatGPT, with no internet?',
    short: 'ChatGPT-level AI on your phone, offline',
    options: ['Yes', 'No'],
  },
];

export const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

export type Bet = { time: string; name: string; answers: string[] };

export const NAME_MAX = 60;
export const ANSWER_MAX = 200;

export async function fetchBets(): Promise<Bet[]> {
  const res = await fetch(BETS_API);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.bets as Bet[]).reverse(); // newest first
}

export async function placeBet(name: string, answers: string[]): Promise<void> {
  // Plain-text body = a "simple" CORS request, so Apps Script needs no preflight.
  const res = await fetch(BETS_API, { method: 'POST', body: JSON.stringify({ name, answers }) });
  const data = await res.json().catch(() => ({ ok: false, error: 'Bad response from the bets sheet' }));
  if (!data.ok) throw new Error(data.error || 'Could not save the bet');
}
