# THE CONSTRUCT // POLYGLOT UPLINK

A hacker-terminal-themed webapp that teaches you to **code** from zero toward professional level —
across **six languages**, each running a **real engine inside your browser**. Every track opens with
**theory**, then drops you into **hands-on exercises** graded live against hidden test vectors.
Curriculum modeled on **Harvard CS50P** + **Dataquest**, re-skinned with sci-fi / anime / music culture.

> "I know kung fu." — you will too.

---

## Languages & engines (all run client-side, no server)

| Track | Engine in your browser | Sectors / Nodes |
|-------|------------------------|-----------------|
| **Python** | CPython 3.12 — Pyodide / WASM | 16 / 48 |
| **JavaScript** | native V8 in a sandboxed Web Worker | 4 / 12 |
| **TypeScript** | the real `tsc` compiler → JS | 3 / 9 |
| **SQL** | SQLite — sql.js / WASM | 3 / 9 |
| **Lua** | Lua 5.4 — wasmoon / WASM | 3 / 9 |
| **Ruby** | CRuby 3.3 — ruby.wasm | 3 / 9 |

**96 exercises total.** Every reference solution has been verified to pass — and every starter to
fail — on the real engine (see `_verify/`). Engines load **on demand** (only when you open that
track), so nothing heavy downloads until you need it. Ruby is the chunky one (~34 MB, one-time).

---

## Quick start

**Option A — just open it**
Double-click `index.html`. (Needs internet on first use to fetch each engine from CDN; after that
they're browser-cached.)

**Option B — serve locally (recommended, most reliable)**
```bash
cd the-construct
python -m http.server 8000      # then open http://localhost:8000
```
or, with Node: `npx serve` .

Serving over `http://localhost` is recommended — a couple of engines use Web Workers / dynamic
imports that some browsers restrict on raw `file://`.

---

## How it works

- Pick a **LANGUAGE**, open a **SECTOR**, read the **THEORY BRIEF**, then breach each **NODE**:
  write code, hit **▸ EXECUTE** (or **Ctrl/Cmd+Enter**).
- Your code runs on the real engine and is graded against hidden tests. Clear them all to bank XP
  and raise your **ACCESS LEVEL** (global across every language: TRESPASSER → … → ARCHITECT).
- **HINT** decrypts a tip; **SOLUTION** reveals a reference exploit.
- Progress, XP and your code **autosave per language** to `localStorage`. **⟲ WIPE** resets everything.
- Infinite loops are force-halted (CPython trace guard / Worker timeout / fresh VMs) instead of
  freezing the tab.

### Grading model per engine
- **Python / JS / TS / Lua / Ruby** — you define functions; tests call them and assert. "script"
  nodes feed stdin / read stdout. Tests run on the native engine, so semantics are exact.
- **SQL** — each node loads a seeded SQLite database; your query's result set is compared to the
  target set (row count + values, order-sensitive where it matters).

---

## Use it on your phone + sync across devices

**Android / mobile:** the UI is fully responsive — a tap-out nav drawer (☰), stacked layouts, and a
16px editor (no zoom-jank). Open the same URL in Chrome on Android. (Engines are WASM, which mobile
browsers run; the Ruby engine is ~34 MB, so prefer Wi-Fi for that track.)

**Continue wherever you left off — open ⇆ SYNC:**
- **Profile code** — your identity for sync (a random 12-char key). Use the *same code* on every device.
- **③ Manual (zero setup):** EXPORT a code / file on one device, IMPORT it on another. Works offline.
- **② Cloud auto-sync (set up once):** deploy the free worker in `sync-worker/` (~2 min), paste its
  URL into the app, tick *auto-sync*. Progress then syncs automatically by profile code across all
  your devices.

Merges are a safe **union** — a node cleared on any device stays cleared everywhere, so syncing in
any order never loses progress.

## Project structure

```
the-construct/
├─ index.html              # shell + all CDN engine/editor deps
├─ css/style.css           # the whole hacker aesthetic (CRT, scanlines, matrix, glow, glitch)
├─ js/
│  ├─ tracks.js            # language-track registry
│  ├─ app.js               # boot, language select, router, progress/XP, exercise workspace
│  ├─ curriculum.js              # Python track (base)
│  ├─ curriculum-python-extra.js # Python advanced sectors (File I/O, functional, testing, algos)
│  ├─ curriculum-js.js / -ts.js / -sql.js / -lua.js / -ruby.js
│  ├─ runtime.js           # Python adapter (Pyodide) + the sandboxed grading harness
│  └─ runtime-js.js / -sql.js / -lua.js / -ruby.js   # one adapter per engine
└─ _verify/                # dev-only: re-run every solution on its real engine (Node)
```

Each runtime adapter implements the same interface — `init`, `runDisplay(src, ex)`,
`grade(src, ex)` — and registers itself into `window.Runtimes`. Each curriculum file calls
`window.registerTrack({...})`.

---

## Extending

Add exercises by editing the relevant `curriculum-*.js`, or add a whole new language by writing a
`runtime-<lang>.js` adapter + a `curriculum-<lang>.js` track and adding both `<script>` tags to
`index.html`.

**Authoring tip:** JS/TS code contains backticks and `${...}`, so those curricula are built with a
small `J('line', ...)` line-joiner instead of template literals. Python/SQL/Lua/Ruby have no
backticks, so template-literal strings are fine (use `~~~lang` fences in theory, not triple
backticks).

### Verifying (recommended before shipping new content)
`_verify/` runs **every reference solution and starter through the real engine** on Node — proving
solutions pass and starters fail. Requires Node + Python 3 (and a one-time `npm install` inside
`_verify/` for sql.js, typescript, wasmoon, @ruby/wasm-wasi):
```bash
cd the-construct/_verify
node extract.js && python verify.py   # Python (48)
node verify-js.js                     # JavaScript (12)
node verify-ts.js                     # TypeScript (9)
node verify-sql.js                    # SQL (9)
node verify-lua.js                    # Lua (9)
node verify-ruby.js                   # Ruby (9)
```
(`_verify/node_modules/` is dev-only and not used by the app — safe to delete to reclaim space.)

---

## Credits
Curriculum inspired by [CS50P](https://cs50.harvard.edu/python/) and
[Dataquest](https://www.dataquest.io/). Engines: [Pyodide](https://pyodide.org),
[sql.js](https://sql.js.org), [wasmoon](https://github.com/ceifa/wasmoon),
[ruby.wasm](https://github.com/ruby/ruby.wasm), [TypeScript](https://www.typescriptlang.org),
editor [CodeMirror](https://codemirror.net), highlighting [Prism](https://prismjs.com).
References to The Matrix, Cowboy Bebop, Ghost in the Shell, Evangelion, Serial Experiments Lain,
Steins;Gate, Blade Runner, Akira, Daft Punk, Aphex Twin & more are affectionate homages.

*See you, space cowboy.*
