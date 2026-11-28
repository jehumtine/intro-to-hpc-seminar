# A Symposium on High Performance Computing

Interactive, left-to-right presentation for the HPC seminar (28 Nov 2026).
Script and sources live in the Obsidian vault: `Projects/Seminars/`.

```sh
npm install
npm run dev        # develop at http://localhost:5173
npm run build      # offline build in dist/ (open with `npm run preview`)
```

## Controls
| Key | Action |
|---|---|
| → / Space / PageDown | next step / slide (clickers send PageDown) |
| ← / PageUp | back |
| P | open presenter window (notes, timer, next slide; synced) |
| F | fullscreen |
| B or . | black out the screen |
| T (presenter) | start / reset the timer |
| Home / End | first / last slide |

## Structure
- `src/deck/`: engine (horizontal frieze, steps, sync, presenter, meander progress bar)
- `src/slides/index.tsx`: the talk, in order. Each slide has `steps`, `notes`, `render`
- `public/img/hoarders.jpg`: G. Doré, *Inferno* Canto VII (1861), public domain, via Wikimedia Commons

## Bets (`?bets`)
People can bet on the five closing predictions at `…/intro-to-hpc-seminar/?bets`. Each bet (a name plus answers) is stored in a Google Sheet.

One-time setup:
1. Create a Google Sheet (e.g. "HPC Symposium Bets") → **Extensions → Apps Script**.
2. Replace the code with `apps-script/Code.gs` and save.
3. **Deploy → New deployment → Web app**: *Execute as* **Me**, *Who has access* **Anyone**. Authorise it, then copy the URL ending in `/exec`.
4. Paste it into `BETS_API` in `src/data/bets.ts`, then commit and push (GitHub Pages redeploys).

Bets land in the Sheet's **Bets** tab (Timestamp, Name, I–V). If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
