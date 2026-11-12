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
