/* ============================================================
   curriculum-python-pack-7.js — THE CONSTRUCT expansion PACK 7.
   Extends two existing sectors of the 'python' track:
     0x0D DATA STREAMS                — +5 exercises (csv & io, in-memory)
     0x0E COMPREHENSIONS & FUNCTIONAL — +5 exercises (comps/lambda/gen)
   All data is in-memory text (io.StringIO / csv) — no real disk files.
   Same exercise/test contract as curriculum.js.
   ============================================================ */
(function () {

  window.addExercises("python", "m13-streams", [

    {
      id: "streams-parse-rows",
      title: "STREAM DECODE",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Decode a CSV capture into a list of rows.",
      prompt: `
A flight-recorder dump arrives as one CSV string, header row first. Define **read_rows(text)** that parses it with the **csv** module through **io.StringIO** and **returns a list of rows**, where each row is a list of string fields (the header row is included).

~~~python
text = "callsign,sector" + chr(10) + "FAYE,3" + chr(10) + "SPIKE,7"
read_rows(text) -> [["callsign", "sector"], ["FAYE", "3"], ["SPIKE", "7"]]
~~~

Wrap the text in **io.StringIO**, feed it to **csv.reader**, and materialize with **list(...)**. Let the csv module handle quoting - do not split on commas yourself.
`,
      starter: `import csv, io

def read_rows(text):
    # TODO: list(csv.reader(io.StringIO(text)))
    pass
`,
      solution: `import csv, io

def read_rows(text):
    return list(csv.reader(io.StringIO(text)))
`,
      tests: [
        { name: "parses header + rows", code: `N=chr(10)
text='callsign,sector'+N+'FAYE,3'+N+'SPIKE,7'
assert read_rows(text)==[['callsign','sector'],['FAYE','3'],['SPIKE','7']], repr(read_rows(text))` },
        { name: "single line -> one row", code: `assert read_rows('alpha,beta,gamma')==[['alpha','beta','gamma']], repr(read_rows('alpha,beta,gamma'))` },
        { name: "handles a quoted field with a comma", code: `N=chr(10)
text='ship,note'+N+'Bebop,"fast, loud"'
assert read_rows(text)==[['ship','note'],['Bebop','fast, loud']], repr(read_rows(text))` },
      ],
      hint: `reader = csv.reader(io.StringIO(text)); then return list(reader). StringIO makes the string behave like an open file.`,
      lore: "Raw stream in, structured rows out. The recorder never lies.",
    },

    {
      id: "streams-mean-bpm",
      title: "TEMPO AVERAGE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Average a numeric column from CSV text.",
      prompt: `
\`text\` is CSV with header \`track,bpm\`, then data rows. Define **average_bpm(text)** that parses it with **csv.DictReader** and **returns** the mean of the \`bpm\` column as a **float**. Assume at least one data row.

~~~python
text = "track,bpm" + chr(10) + "Intro,100" + chr(10) + "Drop,140" + chr(10) + "Outro,120"
average_bpm(text) -> 120.0
~~~

Column values come back as **strings** - cast each with **int(...)** before averaging. Mean = sum of values / number of rows.
`,
      starter: `import csv, io

def average_bpm(text):
    # TODO: DictReader rows; return sum(int(r["bpm"])) / number_of_rows  (a float)
    pass
`,
      solution: `import csv, io

def average_bpm(text):
    rows = list(csv.DictReader(io.StringIO(text)))
    return sum(int(r['bpm']) for r in rows) / len(rows)
`,
      tests: [
        { name: "averages the bpm column", code: `N=chr(10)
text='track,bpm'+N+'Intro,100'+N+'Drop,140'+N+'Outro,120'
assert average_bpm(text)==120.0, repr(average_bpm(text))` },
        { name: "single record returns that value", code: `N=chr(10)
text='track,bpm'+N+'Solo,128'
assert average_bpm(text)==128.0, repr(average_bpm(text))` },
        { name: "result is a float mean, not a sum", code: `N=chr(10)
text='track,bpm'+N+'A,90'+N+'B,91'
assert abs(average_bpm(text)-90.5) < 1e-9, repr(average_bpm(text))` },
      ],
      hint: `rows = list(csv.DictReader(io.StringIO(text))); return sum(int(r["bpm"]) for r in rows) / len(rows). The / operator gives a float.`,
      lore: "Find the heartbeat of the set: one tempo to rule the floor.",
    },

    {
      id: "streams-by-pilot",
      title: "PILOT LOOKUP",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Filter CSV rows by a column value.",
      prompt: `
\`text\` is CSV with header \`pilot,unit\`, then data rows. Define **rows_for(text, pilot)** that **returns** a list of the **data rows** (each a list of fields) whose first column equals \`pilot\`, in original order. **Exclude the header** from the result.

~~~python
text = "pilot,unit" + chr(10) + "Shinji,01" + chr(10) + "Asuka,02" + chr(10) + "Shinji,13"
rows_for(text, "Shinji") -> [["Shinji", "01"], ["Shinji", "13"]]
rows_for(text, "Rei")    -> []
~~~

Parse all rows with **csv.reader**, then keep rows from \`rows[1:]\` whose index-0 field matches.
`,
      starter: `import csv, io

def rows_for(text, pilot):
    # TODO: parse rows; from rows[1:] keep those where row[0] == pilot
    pass
`,
      solution: `import csv, io

def rows_for(text, pilot):
    rows = list(csv.reader(io.StringIO(text)))
    return [r for r in rows[1:] if r[0] == pilot]
`,
      tests: [
        { name: "keeps only the matching pilot", code: `N=chr(10)
text='pilot,unit'+N+'Shinji,01'+N+'Asuka,02'+N+'Shinji,13'
assert rows_for(text,'Shinji')==[['Shinji','01'],['Shinji','13']], repr(rows_for(text,'Shinji'))` },
        { name: "no match -> empty list (header excluded)", code: `N=chr(10)
text='pilot,unit'+N+'Shinji,01'+N+'Asuka,02'
assert rows_for(text,'Rei')==[], repr(rows_for(text,'Rei'))` },
        { name: "single match", code: `N=chr(10)
text='pilot,unit'+N+'Rei,00'+N+'Asuka,02'
assert rows_for(text,'Rei')==[['Rei','00']], repr(rows_for(text,'Rei'))` },
      ],
      hint: `rows = list(csv.reader(io.StringIO(text))); then [r for r in rows[1:] if r[0] == pilot]. Slicing off rows[0] drops the header.`,
      lore: "Synch ratio confirmed. Pull every record tagged to the pilot.",
    },

    {
      id: "streams-strip-comments",
      title: "SIGNAL FILTER",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Count live config lines, ignoring blanks and comments.",
      prompt: `
A config blob is one block of text. Define **live_lines(blob)** that **returns** how many lines actually carry settings: **skip blank/whitespace-only lines AND comment lines** (a line whose first non-space character is \`#\`).

~~~python
blob = "# config" + chr(10) + "JACK_IN=1" + chr(10) + chr(10) + "SYNC=0" + chr(10) + "# end"
live_lines(blob) -> 2      # JACK_IN=1 and SYNC=0
~~~

Split with **.splitlines()**. For each line, use **.strip()** to test emptiness and check **.lstrip().startswith("#")** so indented comments are caught too.
`,
      starter: `def live_lines(blob):
    # TODO: count lines that are non-blank AND not comments (ignore leading spaces)
    pass
`,
      solution: `def live_lines(blob):
    return len([ln for ln in blob.splitlines() if ln.strip() != '' and not ln.lstrip().startswith('#')])
`,
      tests: [
        { name: "ignores blanks and comment lines", code: `N=chr(10)
blob='# config'+N+'JACK_IN=1'+N+N+'SYNC=0'+N+'# end'
assert live_lines(blob)==2, repr(live_lines(blob))` },
        { name: "leading-whitespace comment still counts as comment", code: `N=chr(10)
blob='RUN'+N+'   # indented note'+N+'HALT'
assert live_lines(blob)==2, repr(live_lines(blob))` },
        { name: "all comments or blank -> 0", code: `N=chr(10)
assert live_lines('# a'+N+N+'  # b')==0 and live_lines('')==0` },
      ],
      hint: `Filter blob.splitlines() with: ln.strip() != "" and not ln.lstrip().startswith("#"). lstrip() handles indented comments. Count with len().`,
      lore: "Strip the noise, keep the signal. Comments are for humans.",
    },

    {
      id: "streams-dictreader",
      title: "RECORD MAPPER",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Turn CSV text into a list of dicts with DictReader.",
      prompt: `
\`text\` is CSV with a header row. Define **records(text)** that uses **csv.DictReader** to **return a list of dicts**, one per data row, keyed by the header columns. Values stay as **strings** (do not cast). A header-only input yields an empty list.

~~~python
text = "name,bpm" + chr(10) + "Lain,90" + chr(10) + "Wired,140"
records(text) -> [{"name": "Lain", "bpm": "90"}, {"name": "Wired", "bpm": "140"}]
~~~

\`csv.DictReader(io.StringIO(text))\` yields one mapping per row. Build a plain \`dict\` from each so the result compares cleanly.
`,
      starter: `import csv, io

def records(text):
    # TODO: [dict(row) for row in csv.DictReader(io.StringIO(text))]
    pass
`,
      solution: `import csv, io

def records(text):
    return [dict(row) for row in csv.DictReader(io.StringIO(text))]
`,
      tests: [
        { name: "builds a dict per row using the header", code: `N=chr(10)
text='name,bpm'+N+'Lain,90'+N+'Wired,140'
assert records(text)==[{'name':'Lain','bpm':'90'},{'name':'Wired','bpm':'140'}], repr(records(text))` },
        { name: "header only -> empty list", code: `assert records('name,bpm')==[], repr(records('name,bpm'))` },
        { name: "values stay strings", code: `N=chr(10)
text='id,level'+N+'NAVI,7'
out=records(text)
assert out==[{'id':'NAVI','level':'7'}] and out[0]['level']=='7', repr(out)` },
      ],
      hint: `return [dict(row) for row in csv.DictReader(io.StringIO(text))]. DictReader uses the first row as keys; wrap each row in dict() for a clean mapping.`,
      lore: "Headers become keys. The Wired remembers every NAVI by name.",
    },

  ]);

  window.addExercises("python", "m14-functional", [

    {
      id: "func-map-filter",
      title: "POWER ROUTE",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Map and filter in a single comprehension.",
      prompt: `
\`levels\` is a list of integer power readings. Define **boosted(levels)** that **returns a list** containing **each positive reading doubled**, in original order. Negatives and zero are dropped. Use **one list comprehension** with both a transform and a filter (no map/filter calls needed).

~~~python
boosted([3, -1, 0, 4]) -> [6, 8]
boosted([5, 2, 9])     -> [10, 4, 18]
boosted([-2, 0, -7])   -> []
~~~
`,
      starter: `def boosted(levels):
    # TODO: [x * 2 for x in levels if x > 0]
    pass
`,
      solution: `def boosted(levels):
    return [x * 2 for x in levels if x > 0]
`,
      tests: [
        { name: "doubles only the positive levels", code: `assert boosted([3,-1,0,4])==[6,8], repr(boosted([3,-1,0,4]))` },
        { name: "order is preserved", code: `assert boosted([5,2,9])==[10,4,18], repr(boosted([5,2,9]))` },
        { name: "no positives -> empty", code: `assert boosted([-2,0,-7])==[] and boosted([])==[]` },
      ],
      hint: `[x * 2 for x in levels if x > 0] - the if clause filters, the x * 2 transforms. Both happen in one pass.`,
      lore: "Route power only through live conduits. Double it on the way.",
    },

    {
      id: "func-sort-records",
      title: "SIGNAL RANKING",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Sort dict records by a field with a lambda key.",
      prompt: `
\`navis\` is a list of dicts like \`{"name": ..., "signal": int}\`. Define **by_signal(navis)** that **returns** the list sorted by \`signal\`, **strongest first**, using \`sorted\` with \`key=lambda\` and \`reverse=True\`. Do not mutate the input. Because \`sorted\` is **stable**, equal signals keep their original order.

~~~python
data = [{"name": "Lain", "signal": 3}, {"name": "Alice", "signal": 9}, {"name": "Mika", "signal": 5}]
by_signal(data) -> [{"name":"Alice","signal":9}, {"name":"Mika","signal":5}, {"name":"Lain","signal":3}]
~~~
`,
      starter: `def by_signal(navis):
    # TODO: sorted(navis, key=lambda n: n["signal"], reverse=True)
    pass
`,
      solution: `def by_signal(navis):
    return sorted(navis, key=lambda n: n['signal'], reverse=True)
`,
      tests: [
        { name: "sorts records by signal, strongest first", code: `data=[{'name':'Lain','signal':3},{'name':'Alice','signal':9},{'name':'Mika','signal':5}]
assert [n['name'] for n in by_signal(data)]==['Alice','Mika','Lain'], repr(by_signal(data))` },
        { name: "ties keep original order (stable)", code: `data=[{'name':'A','signal':4},{'name':'B','signal':4},{'name':'C','signal':1}]
assert [n['name'] for n in by_signal(data)]==['A','B','C'], repr(by_signal(data))` },
        { name: "does not mutate input", code: `data=[{'name':'X','signal':1},{'name':'Y','signal':2}]
by_signal(data)
assert [n['name'] for n in data]==['X','Y'], 'Use sorted(), do not sort in place.'` },
      ],
      hint: `sorted(navis, key=lambda n: n["signal"], reverse=True). The key reads each dict's "signal"; reverse=True puts the strongest first; sorted() returns a new list.`,
      lore: "Loudest ghost on the Wired takes the top slot.",
    },

    {
      id: "func-transform-filter",
      title: "CALL SIGN FORGE",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Comprehension with a transform and a length filter.",
      prompt: `
\`crew\` is a list of name strings. Define **call_signs(crew)** that **returns a list** of the names that are **at least 4 characters long**, each converted to **UPPERCASE**, in original order. Use a single list comprehension (transform with \`.upper()\`, filter with \`len(...) >= 4\`).

~~~python
call_signs(["Spike", "Ed", "Jet", "Faye"]) -> ["SPIKE", "FAYE"]
call_signs(["Lain", "Rei", "Navi"])        -> ["LAIN", "NAVI"]
~~~
`,
      starter: `def call_signs(crew):
    # TODO: [name.upper() for name in crew if len(name) >= 4]
    pass
`,
      solution: `def call_signs(crew):
    return [name.upper() for name in crew if len(name) >= 4]
`,
      tests: [
        { name: "uppercases names of length >= 4", code: `assert call_signs(['Spike','Ed','Jet','Faye'])==['SPIKE','FAYE'], repr(call_signs(['Spike','Ed','Jet','Faye']))` },
        { name: "boundary length 4 is kept", code: `assert call_signs(['Lain','Rei','Navi'])==['LAIN','NAVI'], repr(call_signs(['Lain','Rei','Navi']))` },
        { name: "nothing qualifies -> empty", code: `assert call_signs(['Ed','Al'])==[] and call_signs([])==[]` },
      ],
      hint: `[name.upper() for name in crew if len(name) >= 4]. The filter keeps long-enough names; .upper() forges the call sign.`,
      lore: "Short names stay grounded. Forge the rest into call signs.",
    },

    {
      id: "func-gen-countdown",
      title: "LAUNCH SEQUENCE",
      kind: "function",
      difficulty: 2,
      xp: 170,
      brief: "Yield a descending countdown with a generator.",
      prompt: `
Define **countdown(n)** as a **generator** that **yields** the integers from \`n\` down to \`1\` (inclusive). If \`n\` is zero or negative, it yields nothing. Use \`yield\`, not a return-a-list.

~~~python
list(countdown(5))  -> [5, 4, 3, 2, 1]
list(countdown(0))  -> []
list(countdown(-3)) -> []
~~~

Loop while \`n > 0\`, yielding then decrementing - or iterate a suitable \`range\`.
`,
      starter: `def countdown(n):
    # TODO: yield n, n-1, ... down to 1 (nothing if n <= 0)
    pass
`,
      solution: `def countdown(n):
    while n > 0:
        yield n
        n -= 1
`,
      tests: [
        { name: "yields n down to 1", code: `assert list(countdown(5))==[5,4,3,2,1], repr(list(countdown(5)))` },
        { name: "zero or negative -> empty", code: `assert list(countdown(0))==[] and list(countdown(-3))==[]` },
        { name: "it is a real generator (lazy)", code: `import types
g=countdown(3)
assert isinstance(g, types.GeneratorType), 'Use yield so countdown returns a generator.'
assert next(g)==3 and next(g)==2` },
      ],
      hint: `while n > 0: yield n; then n -= 1. Because you use yield, calling countdown(n) returns a lazy generator.`,
      lore: "Five... four... three... ignition holds across every world line.",
    },

    {
      id: "func-sum-squares",
      title: "ENERGY FOLD",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Fold a list into the sum of its squares.",
      prompt: `
\`readings\` is a list of numbers. Define **energy(readings)** that **returns** the **sum of the squares** of every reading - a single reduce-style fold. An empty list folds to \`0\`.

~~~python
energy([1, 2, 3]) -> 14      # 1 + 4 + 9
energy([-2, 2])   -> 8       # 4 + 4
energy([])        -> 0
~~~

The clean way is \`sum(x * x for x in readings)\` - a generator expression handed straight to \`sum\`, which seeds the fold at 0.
`,
      starter: `def energy(readings):
    # TODO: sum(x * x for x in readings)
    pass
`,
      solution: `def energy(readings):
    return sum(x * x for x in readings)
`,
      tests: [
        { name: "sums the squares", code: `assert energy([1,2,3])==14, repr(energy([1,2,3]))` },
        { name: "handles negatives (squares are positive)", code: `assert energy([-2,2])==8, repr(energy([-2,2]))` },
        { name: "empty -> 0", code: `assert energy([])==0 and energy([5])==25` },
      ],
      hint: `sum(x * x for x in readings). sum() folds the squares together and returns 0 for an empty input automatically.`,
      lore: "Total energy is the square of every tremor, summed across the grid.",
    },

  ]);

})();
