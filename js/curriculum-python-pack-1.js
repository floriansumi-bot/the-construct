/* ============================================================
   curriculum-python-pack-1.js — THE CONSTRUCT expansion PACK 1.
   Adds beginner exercises to two existing Python sectors:
     m01-boot  BOOT SEQUENCE       (+5 : banners, end=, concat, repetition, num+text)
     m02-vars  VARIABLES & SIGNALS (+5 : float avg, :.2f, swap, bool, two-input line)
   Same exercise/test contract as curriculum.js:
     "function" -> learner defines function(s); tests assert on them.
     "script"   -> learner writes a program; tests use _run([...]).
   All graded strings here are byte-identical to the self-verified
   set (BAD: 0). Template literals only — no backticks, no \n escapes
   inside Python content (real newlines / multiple print() calls).
   ============================================================ */
(function () {

  window.addExercises("python", "m01-boot", [

    {
      id: "boot-banner",
      title: "BEBOP BANNER",
      kind: "script",
      difficulty: 1,
      xp: 120,
      brief: "Paint the ship's boot banner across the console.",
      prompt: `
A triple-quoted string (\`"""..."""\`) can span several lines, so one print() emits a whole banner. Print these **three lines, exactly**:

~~~text
+------------------+
|   BEBOP ONLINE   |
+------------------+
~~~

Use **one** triple-quoted string inside a single print().
`,
      starter: `# Print the three-line banner using ONE triple-quoted string
`,
      solution: `print("""+------------------+
|   BEBOP ONLINE   |
+------------------+""")
`,
      sampleStdin: [],
      tests: [
        { name: "all three banner lines present", needs_ns: false, code: `out=_run([])
lines=[l.rstrip() for l in out.strip().splitlines()]
expected=['+------------------+','|   BEBOP ONLINE   |','+------------------+']
assert lines==expected, 'Got: '+repr(lines)` },
        { name: "uses a triple-quoted string", needs_ns: false, code: `assert ('"""' in _src) or ("'''" in _src), "Build the banner from ONE triple-quoted string."` },
      ],
      hint: `Open with print(""" then type the three lines on three real rows, and close with """) on the last line.`,
      lore: "See you, space cowboy...",
    },

    {
      id: "boot-oneline",
      title: "LOADING SEQUENCE",
      kind: "script",
      difficulty: 1,
      xp: 120,
      brief: "Stream the dots without breaking the line.",
      prompt: `
By default print() ends with a newline. Pass **end=""** to keep the next print() on the **same line**.

Using several print() calls, produce exactly one line:

~~~text
LOADING...
~~~

Print **LOADING** first (with end=""), then the three dots. Only the final print() should end the line.
`,
      starter: `# Use end= so the three pieces land on ONE line
`,
      solution: `print("LOADING", end="")
print(".", end="")
print(".", end="")
print(".")
`,
      sampleStdin: [],
      tests: [
        { name: "renders LOADING...", needs_ns: false, code: `out=_run([])
assert out.strip()=='LOADING...', 'Expected single line LOADING... got: '+repr(out.strip())` },
        { name: "everything on one line", needs_ns: false, code: `out=_run([])
nonblank=[l for l in out.strip().splitlines() if l.strip()]
assert len(nonblank)==1, 'Keep it to ONE line — use end="" so prints do not break.'` },
      ],
      hint: `print("LOADING", end="") leaves the cursor on the same line; the last print(".") supplies the newline.`,
      lore: "Booting the Wired... carrier detected.",
    },

    {
      id: "boot-splice",
      title: "CALLSIGN SPLICE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Weld a first and last name into one callsign.",
      prompt: `
Strings join with **+**. Define **splice(first, last)** that **returns** the two names joined with a single space between them.

~~~python
splice("Spike", "Spiegel")   -> "Spike Spiegel"
~~~

Build it with **+** — exactly one space in the middle. Do not print; **return** the string.
`,
      starter: `def splice(first, last):
    pass
`,
      solution: `def splice(first, last):
    return first + " " + last
`,
      tests: [
        { name: `splice("Spike","Spiegel") -> "Spike Spiegel"`, code: `assert splice("Spike","Spiegel")=="Spike Spiegel", repr(splice("Spike","Spiegel"))` },
        { name: "joins any two callsigns", code: `assert splice("Faye","Valentine")=="Faye Valentine", repr(splice("Faye","Valentine"))` },
        { name: "exactly one space between", code: `r=splice("A","B")
assert r=="A B", "Put exactly one space between the pieces. Got: "+repr(r)` },
      ],
      hint: `return first + " " + last — note the literal " " (a space) in the middle.`,
      lore: "Three, two, one... let's jam.",
    },

    {
      id: "boot-rule",
      title: "DIVIDER RULE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Forge a horizontal rule of any width.",
      prompt: `
A string times an integer repeats it: \`"=" * 3\` is \`"==="\`. Define **rule(n)** that **returns** a string of **n** equals signs.

~~~python
rule(5)    -> "====="
rule(0)    -> ""
~~~

Use string repetition with **\\***. Return the string; don't print.
`,
      starter: `def rule(n):
    pass
`,
      solution: `def rule(n):
    return "=" * n
`,
      tests: [
        { name: "rule(5) -> '====='", code: `assert rule(5)=="=====", repr(rule(5))` },
        { name: "rule(20) is 20 chars", code: `r=rule(20)
assert r=="="*20 and len(r)==20, repr(r)` },
        { name: "rule(0) -> empty", code: `assert rule(0)=="", repr(rule(0))` },
      ],
      hint: `return "=" * n. Repetition by 0 naturally gives the empty string "".`,
      lore: "Drawing the line between the real and the Wired.",
    },

    {
      id: "boot-countdown",
      title: "CYCLE COUNTDOWN",
      kind: "script",
      difficulty: 2,
      xp: 150,
      brief: "Report a number beside its label.",
      prompt: `
print() can take several values separated by commas and inserts a space between them — so you can mix **text** and a **number** without manual conversion. Print exactly:

~~~text
CYCLES REMAINING: 3
~~~

The **3** must be the integer 3 (pass it via a comma, or convert with str()) — not the text "3".
`,
      starter: `# Print the line:  CYCLES REMAINING: 3
# Combine the text with the NUMBER 3 (not the string "3").
`,
      solution: `cycles = 3
print("CYCLES REMAINING:", cycles)
`,
      sampleStdin: [],
      tests: [
        { name: "exact line CYCLES REMAINING: 3", needs_ns: false, code: `out=_run([])
assert out.strip()=='CYCLES REMAINING: 3', 'Got: '+repr(out.strip())` },
        { name: "the 3 comes from an int", needs_ns: false, code: `assert ('"3"' not in _src) and ("'3'" not in _src), "Use the integer 3 (via commas or str()), not the text 3."` },
      ],
      hint: `print("CYCLES REMAINING:", 3) — the comma joins text and number with a single space.`,
      lore: "El Psy Kongroo. The countdown holds.",
    },

  ]);

  window.addExercises("python", "m02-vars", [

    {
      id: "vars-average",
      title: "SENSOR AVERAGE",
      kind: "script",
      difficulty: 2,
      xp: 150,
      brief: "Fuse two sensor readings into their mean.",
      prompt: `
Read **two** readings (two separate input() calls) and print their **average** as a decimal.

~~~text
10
20
-> 15.0
~~~

input() returns strings — cast with **float()** so the result keeps its decimal point.
`,
      starter: `# Read two readings, print their average (a decimal)
a = input()
b = input()
# TODO
`,
      solution: `a = float(input())
b = float(input())
print((a + b) / 2)
`,
      sampleStdin: ["10", "20"],
      tests: [
        { name: "avg(10,20) -> 15.0", needs_ns: false, code: `import re as _re
out=_run(['10','20'])
nums=_re.findall(r"-?\\d+\\.?\\d*", out)
assert nums and float(nums[-1])==15.0, 'Got: '+repr(out)` },
        { name: "keeps the decimal: avg(2,3) -> 2.5", needs_ns: false, code: `import re as _re
out=_run(['2','3'])
nums=_re.findall(r"-?\\d+\\.?\\d*", out)
assert nums and float(nums[-1])==2.5, 'Got '+repr(out)+' — cast with float(), not int().'` },
      ],
      hint: `a = float(input()); b = float(input()); then print((a + b) / 2).`,
      lore: "Two readings, one truth. The Magi concur.",
    },

    {
      id: "vars-fmt2",
      title: "BPM READOUT",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Lock the tempo display to two decimals.",
      prompt: `
Inside an f-string, **{value:.2f}** formats a number with exactly two decimal places (rounding as needed). Define **fmt_bpm(x)** that **returns**:

~~~text
BPM: 120.00
~~~

So fmt_bpm(120) -> \`BPM: 120.00\` and fmt_bpm(99.999) -> \`BPM: 100.00\`. Return the string; don't print.
`,
      starter: `def fmt_bpm(x):
    pass
`,
      solution: `def fmt_bpm(x):
    return f"BPM: {x:.2f}"
`,
      tests: [
        { name: "fmt_bpm(120) -> 'BPM: 120.00'", code: `assert fmt_bpm(120)=="BPM: 120.00", repr(fmt_bpm(120))` },
        { name: "rounds to 2 dp: 99.999 -> 100.00", code: `assert fmt_bpm(99.999)=="BPM: 100.00", repr(fmt_bpm(99.999))` },
        { name: "pads short decimals: 3.5 -> 3.50", code: `assert fmt_bpm(3.5)=="BPM: 3.50", repr(fmt_bpm(3.5))` },
      ],
      hint: `return f"BPM: {x:.2f}" — the :.2f does the rounding and padding for you.`,
      lore: "Aphex locks the grid at two decimals.",
    },

    {
      id: "vars-swap",
      title: "CHANNEL SWAP",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Cross the wires — return the pair, reversed.",
      prompt: `
Python swaps in one line with **multiple assignment**: \`a, b = b, a\`. Define **swap(a, b)** that **returns** the two values as a tuple in **reversed** order.

~~~python
swap(1, 2)            -> (2, 1)
swap("Lain","Wired")  -> ("Wired", "Lain")
~~~

Return a 2-tuple; don't print.
`,
      starter: `def swap(a, b):
    pass
`,
      solution: `def swap(a, b):
    a, b = b, a
    return (a, b)
`,
      tests: [
        { name: "swap(1,2) -> (2,1)", code: `assert swap(1,2)==(2,1), repr(swap(1,2))` },
        { name: "swap('Lain','Wired') -> ('Wired','Lain')", code: `assert swap("Lain","Wired")==("Wired","Lain"), repr(swap("Lain","Wired"))` },
        { name: "returns a 2-tuple", code: `r=swap(7,9)
assert isinstance(r, tuple) and len(r)==2, repr(r)` },
      ],
      hint: `Either a, b = b, a then return (a, b), or simply return (b, a).`,
      lore: "Present day, present time — the channels cross.",
    },

    {
      id: "vars-overload",
      title: "REACTOR FLAG",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Raise the alarm when the core runs hot.",
      prompt: `
A comparison like \`x > 90\` evaluates straight to a **bool** (True / False). Define **is_critical(level)** that **returns** whether **level** is **strictly greater than 90**.

~~~python
is_critical(95)   -> True
is_critical(90)   -> False   # 90 is NOT over 90
is_critical(12)   -> False
~~~

Return the comparison directly — no if-statement needed.
`,
      starter: `def is_critical(level):
    pass
`,
      solution: `def is_critical(level):
    return level > 90
`,
      tests: [
        { name: "95 is critical -> True", code: `assert is_critical(95) is True, repr(is_critical(95))` },
        { name: "12 is fine -> False", code: `assert is_critical(12) is False, repr(is_critical(12))` },
        { name: "boundary 90 -> False (strictly greater)", code: `assert is_critical(90) is False, "90 is not over 90 — use > not >=. Got: "+repr(is_critical(90))` },
        { name: "returns a real bool", code: `assert isinstance(is_critical(50), bool), "Return a comparison (True/False), not a number."` },
      ],
      hint: `return level > 90. The expression itself is already True or False.`,
      lore: "Pattern blue. Synchronization exceeding limits.",
    },

    {
      id: "vars-manifest",
      title: "PILOT MANIFEST",
      kind: "script",
      difficulty: 3,
      xp: 190,
      brief: "Log the pilot and their unit on one line.",
      prompt: `
Read a **pilot name** then an **EVA unit number** (two input() calls, in that order). Print exactly one line:

~~~text
PILOT <name> :: EVA UNIT-<unit>
~~~

For inputs \`Shinji\` and \`01\`: \`PILOT Shinji :: EVA UNIT-01\`. Build it with an f-string from **both** inputs.
`,
      starter: `# Read pilot name, then EVA unit number. Print one formatted line.
name = input()
unit = input()
# TODO
`,
      solution: `name = input()
unit = input()
print(f"PILOT {name} :: EVA UNIT-{unit}")
`,
      sampleStdin: ["Shinji", "01"],
      tests: [
        { name: "Shinji / 01 -> PILOT Shinji :: EVA UNIT-01", needs_ns: false, code: `out=_run(["Shinji","01"])
assert "PILOT Shinji :: EVA UNIT-01" in out, "Got: "+repr(out)` },
        { name: "rebuilds from both inputs", needs_ns: false, code: `out=_run(["Asuka","02"])
assert "PILOT Asuka :: EVA UNIT-02" in out, "Build the line from BOTH inputs. Got: "+repr(out)` },
      ],
      hint: `Keep unit as a string (it may have a leading zero like 01): f"PILOT {name} :: EVA UNIT-{unit}".`,
      lore: "Get in the robot, Shinji. The manifest is logged.",
    },

  ]);

})();
