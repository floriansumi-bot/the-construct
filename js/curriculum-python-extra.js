/* ============================================================
   curriculum-python-extra.js — THE CONSTRUCT advanced payload.
   Appends 4 advanced sectors (0x0D..0x10) to the 'python' track:
     0x0D DATA STREAMS                — file I/O & CSV via StringIO
     0x0E COMPREHENSIONS & FUNCTIONAL — comps, map/filter, lambda, generators
     0x0F UNIT TESTING                — assertions & edge-case thinking
     0x10 ALGORITHMS & COMPLEXITY     — search, sort, recursion, Big-O
   Same exercise/test contract as curriculum.js:
     "function" -> learner defines function(s); tests assert on them.
     "script"   -> learner writes a program; tests use _run([...]).
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack('python');
  if (!t) return;
  t.modules.push(

  /* ===================== SECTOR 0x0D ===================== */
  {
    id: "m13-streams",
    code: "0x0D",
    title: "DATA STREAMS",
    subtitle: "text I/O · CSV parsing · rows · the csv & io modules",
    theory: `
## Streams, not just files
A **string** is just text — letters, digits and symbols stored as one value. When a program reads a file or receives data, it usually arrives as one big string that you then pull apart. On real hardware you read a file into such a string, then parse it. In this sim the data arrives as text already - a captured stream from the Wired - so you work on the string directly. Everything you learn here transfers 1:1 to opening a real file with \`open(path)\`.

## Lines
Inside text, \`\\n\` is the **newline** character — the invisible marker for pressing Enter that separates one line from the next, so \`"BOOT\\nSYNC"\` is really two lines. Split a multi-line **blob** (one big chunk of text holding many lines) into rows with **.splitlines()** (which also drops any empty line at the very end), and stitch rows back with **"\\n".join(...)** — note that puts a newline *between* rows but not after the last one.

~~~python
log = "BOOT\\nSYNC\\nJACK-IN"
log.splitlines()          # ["BOOT", "SYNC", "JACK-IN"]
"\\n".join(["a", "b"])     # "a\\nb"
~~~

## CSV the right way
Comma-separated data hides traps (quoted fields, embedded commas). Don't hand-split - feed the text to the **csv** module through **io.StringIO**, which makes a string behave like an open file.

~~~python
import csv, io

text = "name,bpm\\nLain,90\\nWired,140"
reader = csv.reader(io.StringIO(text))
rows = list(reader)       # [["name","bpm"], ["Lain","90"], ["Wired","140"]]
~~~

\`csv.DictReader\` is even cleaner - it uses the header row as keys:

~~~python
for row in csv.DictReader(io.StringIO(text)):
    row["name"], row["bpm"]   # "Lain", "90"  (values are strings!)
~~~

A \`csv.reader\` hands you rows one at a time and is "used up" once you loop over it — it isn't a list yet. Turn it into a real, reusable list with **list(...)** when you need its length or want to slice the header off: **rows = list(csv.reader(...))**, and then **rows[1:]** is just the data rows (everything after the header).

## Cleaning a line
Two **str** methods earn their keep when sifting text:
- **.strip()** removes whitespace from both ends - so **ln.strip() == ""** is the test for a blank/whitespace-only line.
- **.lstrip()** strips only the **left** side, and **.startswith(prefix)** tests how a string begins. Together they spot a comment even when it is indented.

~~~python
"   # note".strip()                 # "# note"
"   # note".lstrip().startswith("#")  # True  (leading spaces ignored)
"JACK_IN=1".lstrip().startswith("#")  # False
~~~

## Averaging a column
A mean is just **sum / count**. Cast each string field with **int(...)**, sum them, divide by how many rows there were. The **/** operator always yields a **float** (so **4 / 2** is **2.0**).

~~~python
rows = list(csv.DictReader(io.StringIO(text)))
mean = sum(int(r["bpm"]) for r in rows) / len(rows)   # a float
~~~

> INTEL - CSV fields come back as **strings**. Cast with \`int(...)\` / \`float(...)\` before doing math. The header row is data too - skip it (slice **rows[1:]**) when you only want records.
`,
    exercises: [
      {
        id: "streams-lines",
        title: "PACKET REASSEMBLY",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Count the non-empty lines in a captured stream.",
        prompt: `
A telemetry capture is one blob of text. Define **count_records(blob)** that **returns** how many **non-empty** lines it holds. A line is "empty" if it is blank or only whitespace.

~~~python
count_records("BOOT\\nSYNC\\nJACK-IN")     -> 3
count_records("BOOT\\n\\n   \\nSYNC")        -> 2
count_records("")                          -> 0
~~~

Split the blob into lines and keep only the ones with real content.
`,
        starter: `def count_records(blob):
    # TODO: split into lines, count the ones that aren't blank/whitespace
    pass
`,
        solution: `def count_records(blob):
    return len([ln for ln in blob.splitlines() if ln.strip() != ""])
`,
        tests: [
          { name: "counts three records", code: `assert count_records("BOOT\\nSYNC\\nJACK-IN")==3, repr(count_records("BOOT\\nSYNC\\nJACK-IN"))` },
          { name: "ignores blank and whitespace lines", code: `assert count_records("BOOT\\n\\n   \\nSYNC")==2, repr(count_records("BOOT\\n\\n   \\nSYNC"))` },
          { name: "empty blob -> 0", code: `assert count_records("")==0 and count_records("\\n\\n  \\n")==0` },
        ],
        hint: `blob.splitlines() gives the rows; filter with if ln.strip() != "" before counting with len().`,
        lore: "Signal acquired. Reassembling fragments from the Wired...",
      },
      {
        id: "streams-csv-sum",
        title: "REACTOR LEDGER",
        kind: "function",
        difficulty: 3,
        xp: 190,
        brief: "Sum a numeric column from CSV text.",
        prompt: `
\`text\` is CSV with a header row \`node,power\`, then data rows. Define **total_power(text)** that parses it with the **csv** module and **returns** the integer sum of the \`power\` column.

~~~python
text = "node,power\\nMELCHIOR,120\\nBALTHASAR,80\\nCASPER,200"
total_power(text) -> 400
~~~

Use \`csv.DictReader\` (or \`csv.reader\` and skip the header). Remember: column values are **strings** - cast them.
`,
        starter: `import csv, io

def total_power(text):
    # TODO: DictReader over io.StringIO(text); sum int(row["power"])
    pass
`,
        solution: `import csv, io

def total_power(text):
    reader = csv.DictReader(io.StringIO(text))
    return sum(int(row["power"]) for row in reader)
`,
        tests: [
          { name: "sums the power column", code: `text="node,power\\nMELCHIOR,120\\nBALTHASAR,80\\nCASPER,200"
assert total_power(text)==400, repr(total_power(text))` },
          { name: "header is not counted as data", code: `text="node,power\\nA,5"
assert total_power(text)==5, "Skip the header row - got "+repr(total_power(text))` },
          { name: "single record", code: `assert total_power("node,power\\nSOLO,42")==42` },
        ],
        hint: `reader = csv.DictReader(io.StringIO(text)); then sum(int(row["power"]) for row in reader). int() the string value.`,
        lore: "The MAGI draw power as one. Tally the grid.",
      },
      {
        id: "streams-filter",
        title: "BPM GATE",
        kind: "function",
        difficulty: 3,
        xp: 200,
        brief: "Filter CSV rows and re-emit a clean CSV.",
        prompt: `
\`text\` is CSV \`track,bpm\` with a header. Define **fast_tracks(text)** that **returns** a new CSV string containing **only** rows whose \`bpm\` is **>= 120**, with the **header preserved** and the original row order kept.

~~~python
text = "track,bpm\\nLull,90\\nSpice,128\\nWired,140"
fast_tracks(text) -> "track,bpm\\nSpice,128\\nWired,140"
~~~

No trailing newline. Parse the input rows, keep the header plus matching rows, and join them back with \`"\\n"\`.
`,
        starter: `import csv, io

def fast_tracks(text):
    # TODO: parse rows, keep header + rows where int(bpm) >= 120, rejoin with "\\n"
    pass
`,
        solution: `import csv, io

def fast_tracks(text):
    rows = list(csv.reader(io.StringIO(text)))
    header = rows[0]
    kept = [header]
    for row in rows[1:]:
        if int(row[1]) >= 120:
            kept.append(row)
    return "\\n".join(",".join(row) for row in kept)
`,
        tests: [
          { name: "keeps only bpm >= 120", code: `text="track,bpm\\nLull,90\\nSpice,128\\nWired,140"
assert fast_tracks(text)=="track,bpm\\nSpice,128\\nWired,140", repr(fast_tracks(text))` },
          { name: "header survives even with no matches", code: `text="track,bpm\\nLull,90\\nDrift,60"
assert fast_tracks(text)=="track,bpm", repr(fast_tracks(text))` },
          { name: "boundary 120 is kept", code: `text="track,bpm\\nEdge,120"
assert fast_tracks(text)=="track,bpm\\nEdge,120", repr(fast_tracks(text))` },
        ],
        hint: `rows = list(csv.reader(io.StringIO(text))); header is rows[0]; keep rows[1:] where int(row[1]) >= 120; rebuild with "\\n".join(",".join(r) for r in kept).`,
        lore: "Only the bangers pass the gate. Drop the rest.",
      },
    ],
  },

  /* ===================== SECTOR 0x0E ===================== */
  {
    id: "m14-functional",
    code: "0x0E",
    title: "COMPREHENSIONS & FUNCTIONAL",
    subtitle: "comprehensions · map/filter · lambda · sorted(key) · generators",
    theory: `
## Comprehensions
A **comprehension** is a compact way to build a new list by looping over an existing sequence — doing a calculation on each item ("transform") and optionally keeping only some ("filter"), all in one line. Read \`[n * n for n in range(5)]\` as "for each \`n\` in \`range(5)\`, collect \`n * n\`". The general shape is \`[expr for item in seq if condition]\` — the \`expr\` is what you keep, the optional \`if condition\` decides which items survive. Swap the outer brackets to build other collections:

~~~python
[n * n for n in range(5)]              # list  -> [0, 1, 4, 9, 16]
{c for c in "mississippi"}             # set   -> {"m", "i", "s", "p"}
{k: len(k) for k in ["lain", "navi"]}  # dict  -> {"lain": 4, "navi": 4}
~~~

Looping over a string visits one character at a time, and a **set** automatically throws away duplicates — that's why the repeated \`i\` and \`s\` in "mississippi" each appear only once.

## lambda - tiny inline functions
A **lambda** is a tiny, throwaway function written on one line, with no name. \`lambda x: x * 2\` means "take an input \`x\`, give back \`x * 2\`" — the same job as a full \`def\`, just short enough to write right where you need it. You almost always pass a lambda *into* another function that asks "how should I handle each item?", like \`sorted\` below.

## sorted(key=...)
Sort by a computed value with **key**. Add \`reverse=True\` to flip it.

~~~python
crew = [("Spike", 27), ("Ed", 13), ("Jet", 36)]
sorted(crew, key=lambda p: p[1])           # by age, ascending
sorted(crew, key=lambda p: p[1], reverse=True)  # oldest first
~~~

## map / filter
- **map(fn, seq)** applies \`fn\` to every item.
- **filter(fn, seq)** keeps items where \`fn(item)\` is truthy.

Both are **lazy**: they don't do the work up front but hand you results one at a time as you ask, so you wrap them in \`list(...)\` when you want every result collected into an actual list. A comprehension often reads cleaner, but know these too.

## Generators
Normally \`return\` ends a function and hands back one value. **\`yield\`** is different: a function containing \`yield\` becomes a **generator** — calling it doesn't run the body right away, it hands you an object that produces values one at a time, pausing at each \`yield\` and resuming on the next request. Wrapping it in \`list(...)\` runs it to the end and gathers every yielded value. Generators are ideal for big or infinite streams.

~~~python
def squares(n):
    for i in range(n):
        yield i * i

list(squares(4))   # [0, 1, 4, 9]
~~~

A generator can also be driven by a **while** loop - yield, mutate, repeat - which is handy for countdowns or anything that runs until a condition flips:

~~~python
def countup(n):
    i = 1
    while i <= n:
        yield i
        i += 1
~~~

## Folding with sum / any / all
Drop the square brackets from a comprehension and you get a **generator expression** — the same syntax, but instead of building a whole list first it streams items one at a time straight into a function. Feed one to a function that **folds** (also called "reduces") — that is, crunches a whole sequence down into a single value:

~~~python
sum(x * x for x in nums)            # sum of squares (a fold; empty -> 0)
any(x < 0 for x in nums)            # True if ANY reading is negative
all(len(name) >= 4 for name in crew)  # True only if EVERY name is long enough
~~~

**sum** seeds the total at **0**, so an empty sequence folds to **0** with no special case. **any** / **all** short-circuit and return a **bool**.

> INTEL - \`sorted\` is **stable**: items comparing equal keep their original order. Lean on that for tie-breaks.
`,
    exercises: [
      {
        id: "func-squares",
        title: "SQUARE WAVE",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Synthesize even squares with one comprehension.",
        prompt: `
Define **even_squares(n)** that **returns a list** of the squares of the **even** integers in \`range(n)\` (i.e. \`0 .. n-1\`), in order. Use a **single list comprehension** with a filter.

~~~python
even_squares(6)  -> [0, 4, 16]      # 0**2, 2**2, 4**2
even_squares(1)  -> [0]
even_squares(0)  -> []
~~~
`,
        starter: `def even_squares(n):
    # TODO: [i*i for i in range(n) if i is even]
    pass
`,
        solution: `def even_squares(n):
    return [i * i for i in range(n) if i % 2 == 0]
`,
        tests: [
          { name: "even_squares(6) -> [0, 4, 16]", code: `assert even_squares(6)==[0,4,16], repr(even_squares(6))` },
          { name: "small ranges", code: `assert even_squares(1)==[0] and even_squares(0)==[] and even_squares(2)==[0]` },
          { name: "larger range stays ordered", code: `assert even_squares(11)==[0,4,16,36,64,100], repr(even_squares(11))` },
        ],
        hint: `[i * i for i in range(n) if i % 2 == 0] - the filter clause keeps only even i.`,
        lore: "A square wave is just honesty in the frequency domain.",
      },
      {
        id: "func-sortkey",
        title: "RANK THE CREW",
        kind: "function",
        difficulty: 2,
        xp: 170,
        brief: "Sort bounties by reward using a key.",
        prompt: `
\`crew\` is a list of \`(name, reward)\` tuples. Define **by_reward(crew)** that **returns** the list sorted by reward, **highest first**. Use \`sorted\` with a \`key=lambda\` and \`reverse=True\`. Do not mutate the input.

~~~python
data = [("Spike", 300), ("Ed", 50), ("Jet", 120)]
by_reward(data) -> [("Spike", 300), ("Jet", 120), ("Ed", 50)]
~~~
`,
        starter: `def by_reward(crew):
    # TODO: sorted(crew, key=lambda p: p[1], reverse=True)
    pass
`,
        solution: `def by_reward(crew):
    return sorted(crew, key=lambda p: p[1], reverse=True)
`,
        tests: [
          { name: "sorts by reward descending", code: `data=[("Spike",300),("Ed",50),("Jet",120)]
assert by_reward(data)==[("Spike",300),("Jet",120),("Ed",50)], repr(by_reward(data))` },
          { name: "does not mutate the original", code: `data=[("A",1),("B",9),("C",4)]
by_reward(data)
assert data==[("A",1),("B",9),("C",4)], "Use sorted(), which returns a new list - don't sort in place."` },
          { name: "empty list -> empty list", code: `assert by_reward([])==[]` },
        ],
        hint: `sorted(crew, key=lambda p: p[1], reverse=True). The key picks the reward (index 1); reverse=True puts the biggest first.`,
        lore: "Top of the board, dead or alive.",
      },
      {
        id: "func-gen-fib",
        title: "FIBONACCI STREAM",
        kind: "function",
        difficulty: 3,
        xp: 200,
        brief: "Yield a lazy Fibonacci sequence with a generator.",
        prompt: `
Define **fib_stream(n)** as a **generator** that **yields** the first \`n\` Fibonacci numbers, starting \`0, 1, 1, 2, 3, 5, ...\`. Use \`yield\`, not a return-a-list.

~~~python
list(fib_stream(7)) -> [0, 1, 1, 2, 3, 5, 8]
list(fib_stream(1)) -> [0]
list(fib_stream(0)) -> []
~~~
`,
        starter: `def fib_stream(n):
    # TODO: yield the first n Fibonacci numbers (start 0, 1)
    pass
`,
        solution: `def fib_stream(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
`,
        tests: [
          { name: "first seven Fibonacci numbers", code: `assert list(fib_stream(7))==[0,1,1,2,3,5,8], repr(list(fib_stream(7)))` },
          { name: "edge counts", code: `assert list(fib_stream(0))==[] and list(fib_stream(1))==[0] and list(fib_stream(2))==[0,1]` },
          { name: "it is a real generator (lazy)", code: `import types
g=fib_stream(3)
assert isinstance(g, types.GeneratorType), "Use yield so fib_stream returns a generator."
assert next(g)==0 and next(g)==1` },
        ],
        hint: `Track a, b = 0, 1. Loop n times: yield a, then advance a, b = b, a + b.`,
        lore: "0, 1, 1, 2, 3, 5... the spiral repeats across every world line.",
      },
    ],
  },

  /* ===================== SECTOR 0x0F ===================== */
  {
    id: "m15-testing",
    code: "0x0F",
    title: "UNIT TESTING",
    subtitle: "assert · edge cases · contracts · the pytest mindset",
    theory: `
## Trust nothing - prove it
A **unit test** pins down what a function must do, then checks it automatically. The core tool is the humble **assert** — a keyword that does **nothing** when the condition after it is \`True\`, and **stops the program with an \`AssertionError\`** when it's \`False\`. The optional message after the comma is what prints on failure.

~~~python
assert 2 + 2 == 4, "math is broken"   # True  -> nothing happens (silence)
assert 2 + 2 == 5, "math is broken"   # False -> raises AssertionError: math is broken
~~~

So a passing test is **silent**. No news is good news.

Frameworks like **pytest** just collect functions named \`test_*\` and run their asserts for you - same idea, more automation. The discipline is what matters.

## Think in edge cases
Bugs hide at the boundaries. Before writing the function, ask:
- **Empty** input - \`""\`, \`[]\`, \`0\`?
- **Boundaries** - exactly at the limit (\`==100\`), just over, just under?
- **Negatives**, duplicates, a single element?
- The **happy path** — normal, well-behaved input — is the easy 20%. The edges are where you earn your keep.

## Write a contract, then satisfy it
Good practice: write the asserts first — they **fail** while the function is still empty (testers call this the **red** stage) — then write the code that makes them **pass** (the **green** stage). Red, then green. Below you'll implement functions whose hidden tests hammer exactly these edges - so handle them deliberately, not by accident.

## Properties worth testing
Beyond single input/output pairs, strong contracts pin down **properties**:
- **Idempotence** - applying the operation twice equals applying it once: **clean(clean(s)) == clean(s)**. Cleaners and normalizers should hold this.
- **Round-trip (inverse)** - if one function undoes another, **decode(encode(s)) == s** for every input. A lossless codec must survive the trip.
- **Real booleans** - when the contract says return a bool, return one. A comparison already is a bool: **return n % 4 == 0** yields **True** / **False**, not **1** / **0**. Tests may check with **is True** / **is False**, which only pass for actual bools.

## A contract can require an error
Sometimes the correct behaviour is to **refuse** - e.g. popping an empty stack should **raise**, not return junk. Signal that with **raise**:

~~~python
raise IndexError("pop from empty stack")
~~~

To test that a call raises, wrap it and flip a flag - if no error fires, the test fails:

~~~python
raised = False
try:
    s.pop()
except IndexError:
    raised = True
assert raised, "pop() on an empty stack must raise IndexError."
~~~

> INTEL - \`assert x == y, msg\` shows \`msg\` on failure. Always include the offending value, e.g. \`repr(got)\`, so a red test tells you *what* broke.
`,
    exercises: [
      {
        id: "test-clamp",
        title: "SHIELD CLAMP",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Constrain a value to a safe band - mind the edges.",
        prompt: `
Define **clamp(value, low, high)** that **returns** \`value\` forced into the inclusive range \`[low, high]\`:
- below \`low\` -> \`low\`
- above \`high\` -> \`high\`
- otherwise \`value\` unchanged (including exactly at either boundary)

~~~python
clamp(150, 0, 100) -> 100
clamp(-5, 0, 100)  -> 0
clamp(42, 0, 100)  -> 42
clamp(0, 0, 100)   -> 0      # boundary stays
~~~
`,
        starter: `def clamp(value, low, high):
    # TODO: floor at low, cap at high, else return value unchanged
    pass
`,
        solution: `def clamp(value, low, high):
    if value < low:
        return low
    if value > high:
        return high
    return value
`,
        tests: [
          { name: "clamps above and below", code: `assert clamp(150,0,100)==100 and clamp(-5,0,100)==0` },
          { name: "passes values inside the band", code: `assert clamp(42,0,100)==42 and clamp(1,0,100)==1` },
          { name: "boundaries are inclusive", code: `assert clamp(0,0,100)==0 and clamp(100,0,100)==100, "Exact boundaries must pass through unchanged."` },
          { name: "works with negative bands", code: `assert clamp(-50,-10,-1)==-10 and clamp(0,-10,-1)==-1 and clamp(-5,-10,-1)==-5` },
        ],
        hint: `Two guards: if value < low return low; if value > high return high; otherwise return value. Use < and > (not <=) so the boundaries pass through.`,
        lore: "Shields holding at the limit. Not one point over.",
      },
      {
        id: "test-median",
        title: "MEDIAN SENSOR",
        kind: "function",
        difficulty: 3,
        xp: 200,
        brief: "Compute a median, both parities handled.",
        prompt: `
Define **median(nums)** for a **non-empty** list of numbers. **Return** the middle value of the **sorted** data:
- **odd** count -> the single middle element
- **even** count -> the **average of the two middle elements** (a float)

Don't assume the input is already sorted, and don't mutate it.

~~~python
median([3, 1, 2])     -> 2
median([1, 2, 3, 4])  -> 2.5
median([7])           -> 7
~~~
`,
        starter: `def median(nums):
    # TODO: sort a copy; pick middle (odd) or mean of two middles (even)
    pass
`,
        solution: `def median(nums):
    s = sorted(nums)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2
`,
        tests: [
          { name: "odd count -> middle element", code: `assert median([3,1,2])==2 and median([7])==7` },
          { name: "even count -> mean of two middles", code: `assert median([1,2,3,4])==2.5, repr(median([1,2,3,4]))` },
          { name: "sorts first; ignores input order", code: `assert median([5,3,1,4,2])==3 and median([10,0])==5.0` },
          { name: "does not mutate the input", code: `data=[3,1,2]
median(data)
assert data==[3,1,2], "Sort a copy with sorted(), don't sort the caller's list."` },
        ],
        hint: `s = sorted(nums); n = len(s); mid = n // 2. If n is odd return s[mid]; else return (s[mid-1] + s[mid]) / 2.`,
        lore: "The sensor reports the true center, not the loudest voice.",
      },
      {
        id: "test-isbalanced",
        title: "BRACKET INTEGRITY",
        kind: "function",
        difficulty: 3,
        xp: 210,
        brief: "Validate nested brackets - a classic edge-case gauntlet.",
        prompt: `
Define **is_balanced(s)** that **returns True** if every bracket in \`s\` is properly matched and nested, else **False**. Consider only \`()\`, \`[]\`, \`{}\`; ignore all other characters. The **empty string is balanced**.

~~~python
is_balanced("a(b[c]d)e")  -> True
is_balanced("([])")        -> True
is_balanced("(]")          -> False   # wrong type
is_balanced("(()")         -> False   # left open
is_balanced(")(")          -> False   # closes before it opens
~~~

Push opening brackets on a stack; on a closing bracket, the top of the stack must be its partner.
`,
        starter: `def is_balanced(s):
    # TODO: use a stack; match each closer against the top opener
    pass
`,
        solution: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    openers = set(pairs.values())
    stack = []
    for ch in s:
        if ch in openers:
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0
`,
        tests: [
          { name: "balanced and nested -> True", code: `assert is_balanced("a(b[c]d)e") is True and is_balanced("([])") is True` },
          { name: "empty string is balanced", code: `assert is_balanced("") is True and is_balanced("no brackets here") is True` },
          { name: "mismatched type -> False", code: `assert is_balanced("(]") is False and is_balanced("([)]") is False` },
          { name: "unclosed or premature close -> False", code: `assert is_balanced("(()") is False and is_balanced(")(") is False and is_balanced("}") is False` },
        ],
        hint: `Map closer -> opener: {")":"(","]":"[","}":"{"}. Push openers; on a closer, fail if the stack is empty or stack.pop() isn't the matching opener. At the end, the stack must be empty.`,
        lore: "One unclosed brace and the whole construct collapses. Integrity check.",
      },
    ],
  },

  /* ===================== SECTOR 0x10 ===================== */
  {
    id: "m16-algorithms",
    code: "0x10",
    title: "ALGORITHMS & COMPLEXITY",
    subtitle: "binary search · sorting · recursion · Big-O intuition",
    theory: `
## Big-O - how cost scales
Imagine a list gets 1000x bigger. Does your code take 1000x longer? 20x? Or barely notice? **Big-O** is shorthand for answering that — it describes how the *number of steps* grows as the input (we call its size \`n\`) grows. We care about the *shape* of that growth, not exact timings, so we drop constant factors.
- **O(1)** - "constant": the work never changes, no matter how big \`n\` is. A dict lookup.
- **O(log n)** - each step throws away **half** of what's left, so doubling \`n\` adds just one step. Binary search. (\`log n\` grows painfully slowly — that's the good news.)
- **O(n)** - touch every item once. A single loop over the list.
- **O(n^2)** - "n squared": a loop **inside** a loop, so 10x the data is 100x the work. Bubble/selection sort.

At \`n = 1,000,000\`: O(log n) is ~20 steps; O(n) is a million; O(n^2) is a trillion. Choosing the right complexity is the difference between instant and never.

## Binary search - O(log n)
On a **sorted** sequence, check the middle, then discard the half that can't contain the target. Repeat.

~~~python
lo, hi = 0, len(arr) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target: ...
    elif arr[mid] < target: lo = mid + 1
    else: hi = mid - 1
~~~

## Insertion point - the half-open variant
Plain binary search asks *is it here?*. This variant asks *where would it go?* — useful for slotting a value into a sorted list without re-sorting. Use a **half-open** window **lo, hi = 0, len(arr)** where \`hi\` starts **one past the last real item** (the slot that means "belongs at the very end"), loop while **lo < hi**, and on a match keep going **left**. The result is the **leftmost** slot that keeps the list sorted - which is exactly what Python's built-in **bisect_left** does. Use a strict **less-than** so equal values land before, not after.

~~~python
lo, hi = 0, len(arr)
while lo < hi:
    mid = (lo + hi) // 2
    if arr[mid] < target:
        lo = mid + 1     # target belongs to the right half
    else:
        hi = mid         # mid might be the slot - keep it in range
return lo                # 0..len(arr); larger-than-all -> len(arr)
~~~

## Selection sort - O(n^2)
Repeatedly find the smallest remaining element and place it next. Simple, not fast - but it teaches the nested-loop cost.

## Bubble sort - O(n^2)
The other classic quadratic. Walk the list comparing **adjacent** pairs; whenever the left is bigger, **swap** them, so big values bubble toward the end. One full pass with no swaps means it is sorted. Swap two slots in one line with tuple assignment:

~~~python
a[j], a[j + 1] = a[j + 1], a[j]   # swap neighbours, no temp variable
~~~

## Two-pointer merge
To fuse **two already-sorted** lists into one sorted list, walk both with an index each and repeatedly take the smaller front element. This is the merge step at the heart of merge sort - O(n), far better than concatenating and re-sorting. Compare with **<=** to keep equal elements stable, then tack on whatever tail is left:

~~~python
i = j = 0
out = []
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        out.append(a[i]); i += 1
    else:
        out.append(b[j]); j += 1
out.extend(a[i:]); out.extend(b[j:])   # one list is now empty
~~~

## Trade space for time - the seen dict
A dictionary lookup is O(1), so remembering what you have already seen can collapse an O(n^2) double loop into a single O(n) pass. The classic is **two-sum**: as you scan, for each value work out its **complement** — the *other* number you'd need to hit the target, which is simply \`target - value\` — and check whether you've already seen it; if so, you have your pair. **enumerate** hands you the index alongside the value.

~~~python
seen = {}                       # value -> index
for i, x in enumerate(nums):
    if target - x in seen:
        ... seen[target - x], i # the matching pair of indices
    seen[x] = i
~~~

## Recursion
A function that calls **itself** on a smaller input. The **base case** is the smallest, simplest input the function can answer **without** calling itself — the floor that stops the chain of calls going forever. Without one, the function calls itself endlessly and crashes.

~~~python
def factorial(n):
    if n <= 1:        # base case
        return 1
    return n * factorial(n - 1)
~~~

Shrinking the input can mean peeling a digit, too: **n % 10** is the last digit and **n // 10** is the rest, so a number's digits fall away one recursive call at a time (base case: a single digit, **n < 10**).

> INTEL - Binary search is unbeatable, but only on **sorted** data. No base case (or one you never reach) means infinite recursion and a crash.
`,
    exercises: [
      {
        id: "algo-bsearch",
        title: "BINARY LOCK",
        kind: "function",
        difficulty: 3,
        xp: 200,
        brief: "Crack a sorted vault in O(log n).",
        prompt: `
Define **binary_search(arr, target)** over a list \`arr\` **sorted ascending**. **Return the index** of \`target\`, or **-1** if it's absent. Implement the halving loop yourself - no \`.index()\`, no \`in\`.

~~~python
binary_search([1, 3, 5, 7, 9], 7)  -> 3
binary_search([1, 3, 5, 7, 9], 4)  -> -1
binary_search([], 1)               -> -1
~~~
`,
        starter: `def binary_search(arr, target):
    # TODO: lo/hi pointers; compare arr[mid]; return index or -1
    pass
`,
        solution: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
        tests: [
          { name: "finds present values", code: `assert binary_search([1,3,5,7,9],7)==3 and binary_search([1,3,5,7,9],1)==0 and binary_search([1,3,5,7,9],9)==4` },
          { name: "missing value -> -1", code: `assert binary_search([1,3,5,7,9],4)==-1 and binary_search([1,3,5,7,9],10)==-1` },
          { name: "empty and single-element", code: `assert binary_search([],1)==-1 and binary_search([42],42)==0 and binary_search([42],7)==-1` },
          { name: "works on a large sorted range", code: `data=list(range(0,2000,2))
assert binary_search(data,1334)==667 and binary_search(data,1335)==-1` },
        ],
        hint: `lo, hi = 0, len(arr)-1. While lo <= hi: mid=(lo+hi)//2; if hit return mid; if arr[mid] < target move lo=mid+1 else hi=mid-1. Fall through to return -1.`,
        lore: "Halve the search space, halve again. The lock yields in log time.",
      },
      {
        id: "algo-selsort",
        title: "SELECTION PROTOCOL",
        kind: "function",
        difficulty: 3,
        xp: 200,
        brief: "Sort a list by hand with selection sort.",
        prompt: `
Define **selection_sort(arr)** that **returns a new list** with \`arr\`'s elements in **ascending** order, implemented with the **selection sort** algorithm (repeatedly select the smallest remaining element). Do **not** call \`sorted()\` or \`.sort()\`, and do **not** mutate the input.

~~~python
selection_sort([5, 2, 9, 1]) -> [1, 2, 5, 9]
selection_sort([])           -> []
selection_sort([3, 3, 1])    -> [1, 3, 3]
~~~
`,
        starter: `def selection_sort(arr):
    # TODO: copy arr; repeatedly find the min of the rest and swap it forward
    pass
`,
        solution: `def selection_sort(arr):
    a = list(arr)
    n = len(a)
    for i in range(n):
        smallest = i
        for j in range(i + 1, n):
            if a[j] < a[smallest]:
                smallest = j
        a[i], a[smallest] = a[smallest], a[i]
    return a
`,
        tests: [
          { name: "sorts ascending", code: `assert selection_sort([5,2,9,1])==[1,2,5,9], repr(selection_sort([5,2,9,1]))` },
          { name: "edges: empty and single", code: `assert selection_sort([])==[] and selection_sort([7])==[7]` },
          { name: "handles duplicates and negatives", code: `assert selection_sort([3,3,1])==[1,3,3] and selection_sort([0,-2,5,-2])==[-2,-2,0,5]` },
          { name: "does not mutate input; result matches sorted()", code: `import random
data=[random.randint(-20,20) for _ in range(15)]
copy=list(data)
out=selection_sort(data)
assert out==sorted(copy) and data==copy, "Sort a copy and return it; leave the input untouched."` },
        ],
        hint: `Work on a=list(arr). For each i, scan j from i+1 to end to find the index of the smallest element, then swap a[i], a[smallest]. Return a.`,
        lore: "Pick the strongest of the rest. Promote. Repeat down the line.",
      },
      {
        id: "algo-factorial",
        title: "RECURSIVE DESCENT",
        kind: "function",
        difficulty: 2,
        xp: 180,
        brief: "Compute factorial with true recursion.",
        prompt: `
Define **factorial(n)** for a non-negative integer \`n\`, computed **recursively** (the function must call itself). By definition \`0! == 1\`.

~~~python
factorial(0) -> 1
factorial(1) -> 1
factorial(5) -> 120
~~~

Make sure your **base case** stops the descent - \`n <= 1\` returns \`1\`.
`,
        starter: `def factorial(n):
    # TODO: base case n <= 1 -> 1; else n * factorial(n - 1)
    pass
`,
        solution: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`,
        tests: [
          { name: "base cases", code: `assert factorial(0)==1 and factorial(1)==1` },
          { name: "factorial(5) -> 120", code: `assert factorial(5)==120 and factorial(6)==720, repr(factorial(5))` },
          { name: "grows correctly", code: `assert factorial(10)==3628800` },
          { name: "actually recurses (calls itself)", code: `names=factorial.__code__.co_names
assert "factorial" in names and "math" not in names, "Implement it recursively - the body must call factorial(...) itself (no math.factorial)."` },
        ],
        hint: `if n <= 1: return 1 (base case). Otherwise return n * factorial(n - 1) so each call shrinks toward the base.`,
        lore: "Descend the stack, multiply on the way back up. El Psy Kongroo.",
      },
    ],
  }

  );
})();
