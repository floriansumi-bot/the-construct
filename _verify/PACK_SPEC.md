# Python exercise-pack authoring spec (THE CONSTRUCT)

You are adding exercises to the Python track of an in-browser code trainer. Each new exercise is
graded live by a real CPython 3.12 kernel. **Correctness is non-negotiable: every reference solution
must pass all its tests, and every starter must fail at least one.** You will self-verify with the
real grader before writing the final file.

## 1. The exercise object
Each exercise is a JS object literal:
```js
{
  id: "func-tuple-stats",          // UNIQUE, lowercase-hyphen, must not collide with existing ids
  title: "TELEMETRY SPREAD",       // short, ALL-CAPS-ish, themed
  kind: "function",                // "function" or "script"  (see §2)
  difficulty: 2,                   // 1 (warm-up) .. 3 (challenge)
  xp: 150,                         // ~120 for diff 1, ~150 for diff 2, ~190 for diff 3
  brief: "One-line mission tagline.",
  prompt: `markdown — see §4`,
  starter: `python scaffold that does NOT pass`,
  solution: `python reference that passes all tests`,
  tests: [ { name: "human label", code: `python assertion(s)`, needs_ns: false /* script only */ } ],
  hint: `markdown tip`,
  lore: "italic flavor line (sci-fi / anime / music)",
}
```

## 2. kind + grading contract
- **kind: "function"** — the learner DEFINES function(s)/class(es); do NOT call `input()`. Each test runs
  in a namespace where the solution has already been exec'd, so the test calls the function directly:
  ```js
  { name: "stats([3,1,2]) -> (1,3)", code: `assert stats([3,1,2])==(1,3), repr(stats([3,1,2]))` }
  ```
- **kind: "script"** — the learner writes a full program using `input()`/`print()`. Mark every test
  `needs_ns: false` and drive it with the `_run(stdin_list)` helper, which runs the program with mocked
  input and returns captured stdout:
  ```js
  { name: "7 + 35 = 42", needs_ns: false, code: `out=_run(["7","35"]); assert out.strip().splitlines()[-1]=="42", repr(out)` }
  ```
- Prefer **function** kind for most exercises (cleaner, deterministic). Use script only when the skill is
  inherently about input/print I/O.
- Available inside test code: `assert`, plus helpers `_run(stdin)`, `_src` (the source string), `json`.
- Tests may be multi-line (real newlines). To check exceptions:
  ```js
  { name: "raises ValueError", code: `raised=False
try:
    set_fuel(150)
except ValueError:
    raised=True
assert raised, "set_fuel(150) must raise ValueError"` }
  ```

## 3. ESCAPING RULES — read carefully (the file uses JS template literals)
- All code strings (`starter`, `solution`, test `code`) and `prompt`/`hint` are **JS template literals**
  delimited by backticks. **Python has no backticks, so this is safe — but you must NOT type a backtick
  anywhere inside the content.**
- **Do NOT use backslash escape sequences (`\n`, `\t`, etc.) inside Python string content.** A `\n` in a
  template literal becomes a real newline, which corrupts the Python. Instead:
  - For multi-line output, use multiple `print(...)` calls (not `print("a\nb")`).
  - To check multi-line output, use `_run([...]).splitlines()` or `"text" in out`, never embed `\n`.
- Write `solution`/`starter` content starting at **column 0** (the line right after the opening backtick),
  so there is no stray leading indentation. End with a trailing newline before the closing backtick.
- Use real newlines for multiple statements; keep individual test assertions simple.

## 4. prompt / hint markdown
- Use `~~~python ... ~~~` (tilde fences, NOT triple backticks) for code examples.
- Use `**bold**` for inline emphasis (e.g. function names). **Do NOT use single backticks** for inline
  code (they would break the template literal). Plain text otherwise.
- Keep prompts tight: a themed scenario, the exact spec (function name, params, return), and one example.

## 5. Quality bar
- Each new exercise targets a **distinct application** of the section's theory — a real difficulty ladder,
  not reskins of the existing three. Read the existing exercises first (do not duplicate them).
- Order your new exercises easy → hard (difficulty 1 → 3).
- Theme everything around **sci-fi / anime / music** culture (Cowboy Bebop, Ghost in the Shell, Evangelion,
  Serial Experiments Lain, Steins;Gate, The Matrix, Blade Runner, Dune, Daft Punk, Aphex Twin, synthwave…).
  Keep it fun but never at the expense of a crystal-clear spec.
- Every test needs a clear `name`. Add a helpful assert message where it aids learning.

## 6. SELF-VERIFY before writing the pack (mandatory)
Create a scratch file `_verify/_scratch_<PACKNUM>.py` that defines your exercises as Python dicts (same
strings you'll put in the JS) and grades them with the real harness:
```python
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
exec(open("harness.py", encoding="utf-8").read())   # defines grade()

EXERCISES = [
  {"id":"func-tuple-stats","kind":"function",
   "starter":"def stats(xs):\n    pass\n",
   "solution":"def stats(xs):\n    return (min(xs), max(xs))\n",
   "tests":[{"name":"min,max","code":"assert stats([3,1,2])==(1,3)"}]},
  # ... all your exercises ...
]
bad=[]
for ex in EXERCISES:
    pre = ex["kind"]!="script"
    r = grade(ex["solution"], ex["tests"], pre)
    if not r["all_ok"]: bad.append((ex["id"],"SOLUTION_FAILS",[x for x in r["results"] if not x["ok"]]))
    s = grade(ex.get("starter",""), ex["tests"], pre)
    if s["all_ok"]: bad.append((ex["id"],"STARTER_PASSES",[]))
print("BAD:", len(bad))
for b in bad: print(b)
```
Run `python _verify/_scratch_<PACKNUM>.py` and **iterate until it prints `BAD: 0`**.
(In the scratch you write Python string literals, so `\n` IS a real newline there — that's fine. In the
final JS you use template literals with REAL newlines and NO `\n` escapes, per §3. The actual Python
source is identical either way.)

## 7. Output
- Write `js/curriculum-python-pack-<PACKNUM>.js` as one IIFE calling `window.addExercises`:
```js
(function () {
  window.addExercises("python", "<moduleId>", [ /* exercises */ ]);
  window.addExercises("python", "<moduleId2>", [ /* exercises */ ]);
})();
```
- Run `node --check js/curriculum-python-pack-<PACKNUM>.js` — it must pass.
- Delete your `_verify/_scratch_<PACKNUM>.py` when done.
- Report: which modules, how many exercises each, and confirm "BAD: 0" + "node --check OK".
