import QRCode from 'qrcode';
import { NUMERALS, QUESTIONS } from '../data/bets';

/** 9:16 story size: fits Instagram / WhatsApp stories. */
const W = 1080;
const H = 1920;
const M = 84; // side margin

const PAPER = '#f6f3ec';
const INK = '#000';
const SOFT = '#3a3a3a';
const DISPLAY = "'Cinzel', serif";
const SERIF = "'EB Garamond', Georgia, serif";

export const SHARE_URL = 'https://jehumtine.github.io/intro-to-hpc-seminar/?bets';
const SHARE_LABEL = 'jehumtine.github.io/intro-to-hpc-seminar/?bets';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

/** Draws wrapped text; returns the y below the last line. */
function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number, maxLines = 3) {
  const words = text.split(' ');
  let line = '';
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      if (++lines === maxLines) {
        ctx.fillText(`${line}…`, x, y);
        return y + lineH;
      }
      ctx.fillText(line, x, y);
      y += lineH;
      line = words[i];
    } else line = test;
  }
  ctx.fillText(line, x, y);
  return y + lineH;
}

/** Double rule, as on the deck's frieze bands. */
function frieze(ctx: CanvasRenderingContext2D, y: number) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, y, W, 3);
  ctx.fillRect(0, y + 16, W, 1.5);
}

/** Renders someone's five bets as a shareable PNG. */
export async function renderBetImage(name: string, answers: string[]): Promise<Blob> {
  await Promise.all([
    document.fonts.load(`600 40px ${DISPLAY}`),
    document.fonts.load(`400 40px ${DISPLAY}`),
    document.fonts.load(`400 40px ${SERIF}`),
    document.fonts.load(`italic 400 40px ${SERIF}`),
    document.fonts.load(`500 40px ${SERIF}`),
  ]);

  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  frieze(ctx, 40);

  // engraving band (Doré, Inferno VII): same plate as the closing slide
  const plate = await loadImage(`${import.meta.env.BASE_URL}img/hoarders.jpg`);
  const bandY = 90, bandH = 420, bandW = W - 2 * M;
  const sw = plate.width * 0.96, sh = sw * (bandH / bandW); // the whole procession of hoarders
  const sx = plate.width * 0.5 - sw / 2, sy = plate.height * 0.41 - sh / 2;
  ctx.drawImage(plate, sx, sy, sw, sh, M, bandY, bandW, bandH);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(M, bandY, bandW, bandH);

  let y = bandY + bandH + 78;
  ctx.textAlign = 'center';
  ctx.fillStyle = SOFT;
  ctx.font = `400 24px ${DISPLAY}`;
  ctx.letterSpacing = '7px';
  ctx.fillText('A SYMPOSIUM ON HIGH PERFORMANCE COMPUTING', W / 2, y);
  ctx.letterSpacing = '0px';

  y += 92;
  ctx.fillStyle = INK;
  ctx.font = `600 84px ${DISPLAY}`;
  ctx.fillText('My bets for 2036', W / 2, y);

  y += 66;
  ctx.font = `italic 400 46px ${SERIF}`;
  wrap(ctx, `— ${name} —`, W / 2, y, W - 2 * M, 50, 1);

  y += 50;
  ctx.fillRect(W / 2 - 60, y, 120, 2);

  // the five bets
  y += 72;
  ctx.textAlign = 'left';
  const colX = M + 90, colW = W - colX - M;
  for (let i = 0; i < QUESTIONS.length; i++) {
    ctx.fillStyle = INK;
    ctx.font = `600 40px ${DISPLAY}`;
    ctx.fillText(NUMERALS[i], M, y + 4);
    ctx.fillStyle = SOFT;
    ctx.font = `italic 400 30px ${SERIF}`;
    ctx.fillText(QUESTIONS[i].short, colX, y - 8);
    ctx.fillStyle = INK;
    ctx.font = `500 42px ${SERIF}`;
    y = wrap(ctx, answers[i] || '—', colX, y + 40, colW, 48, 2) + 34;
  }

  // footer: QR + call to action
  const qrSize = 170, footY = H - 110 - qrSize;
  const qr = QRCode.create(SHARE_URL, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size, cell = qrSize / (n + 4);
  ctx.fillStyle = '#fff';
  ctx.fillRect(M, footY, qrSize, qrSize);
  ctx.strokeRect(M, footY, qrSize, qrSize);
  ctx.fillStyle = INK;
  for (let qy = 0; qy < n; qy++)
    for (let qx = 0; qx < n; qx++)
      if (qr.modules.get(qx, qy)) ctx.fillRect(M + (qx + 2) * cell, footY + (qy + 2) * cell, cell + 0.5, cell + 0.5);

  const tx = M + qrSize + 40;
  ctx.font = `600 38px ${DISPLAY}`;
  ctx.fillText('Place yours.', tx, footY + 58);
  ctx.font = `italic 400 32px ${SERIF}`;
  ctx.fillStyle = SOFT;
  ctx.fillText('We open the book in 2036.', tx, footY + 104);
  ctx.font = `400 24px ${SERIF}`;
  ctx.fillText(SHARE_LABEL, tx, footY + 148);

  frieze(ctx, H - 66);

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Could not draw the image'))), 'image/png'));
}

/** Phone: open the share sheet (Instagram, WhatsApp…). Otherwise: download the PNG. */
export async function shareOrDownload(blob: Blob, name: string): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], `hpc-bets-${name.replace(/[^\w-]+/g, '-').toLowerCase() || 'mine'}.png`, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: `My bets for 2036. Place yours: ${SHARE_URL}` });
      return 'shared';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'shared'; // user closed the share sheet
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  return 'downloaded';
}
