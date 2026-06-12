/* ============================================================
   curriculum.js — THE CONSTRUCT course payload.
   12 sectors modeled on Harvard CS50P + Dataquest, re-skinned
   for sci-fi / anime / music culture.
   Exercise kinds:
     "function" -> learner defines function(s); tests call them.
     "script"   -> learner writes a program; tests feed stdin and
                   read stdout via the _run([...]) helper.
   ============================================================ */
window.registerTrack({
  id: "python",
  name: "PYTHON",
  code: "PY",
  runtime: "python",
  ext: "py",
  prism: "python",
  accent: "#00ff9c",
  blurb: "Real CPython 3.12 in your browser. The CS50P + Dataquest arc, re-skinned for the Wired.",
  intro: "Real CPython 3.12, compiled to WebAssembly, running locally. Read the brief, breach the nodes — each graded live against hidden test vectors. Career track: zero to operator.",
  modules: [

  /* ===================== SECTOR 0x01 ===================== */
  {
    id: "m01-boot",
    code: "0x01",
    title: "BOOT SEQUENCE",
    subtitle: "print() · strings · comments · your first transmissions",
    theory: `
## Jacking in
Every program is a stack of **instructions** the machine runs top to bottom. Your first tool is **print()** — it pushes text out to the terminal (stdout).

~~~python
print("Wake up, Neo...")
~~~

Text wrapped in quotes is a **string**. Single or double quotes both work — pick one and stay consistent.

## Comments
A line starting with **#** is a comment. Python ignores it; it's a note for humans.

~~~python
# this line does nothing — it's a comment
print("but this runs")   # trailing comments work too
~~~

## Escape sequences
Some characters are typed with a backslash:
- **\\n** — newline
- **\\t** — tab
- **\\\\** — a literal backslash

~~~python
print("NAME:\\tSPIKE")   # NAME:  <tab>  SPIKE
~~~

## One print, many pieces
print() accepts several values and joins them with a separator (default a space). Override it with **sep=**. Mixing **text and numbers** is fine — the comma handles it, no manual conversion needed.

~~~python
print("SOL", "GATE", "MARS", sep=" :: ")   # SOL :: GATE :: MARS
print("CYCLES REMAINING:", 3)              # CYCLES REMAINING: 3
~~~

## Staying on the same line
By default print() ends with a newline. Pass **end=""** to keep the next print() on the **same line**.

~~~python
print("LOADING", end="")
print("...")            # LOADING... on ONE line
~~~

## Multi-line strings
Wrap text in **triple quotes** to span several lines in a single string — one print() can emit a whole banner.

~~~python
print("""+----------+
| BEBOP ON |
+----------+""")
~~~

## Building strings
- **+** glues two strings together (no automatic space)
- **\\*** repeats a string (repeating by 0 gives the empty string "")

~~~python
"Spike" + " " + "Spiegel"   # "Spike Spiegel"
"=" * 5                      # "====="
print("=" * 16)              # ================
~~~

## Functions
A **function** is a reusable recipe. Define one with **def**, list its inputs (parameters) in parentheses, and hand a result back with **return**.

~~~python
def greet(name):
    return "hi " + name

greet("Spike")   # "hi Spike"
~~~

**return** hands a value back to whoever *called* the function — different from **print()**, which only shows text on screen. A couple of nodes below ask you to **define** a function and **return** its answer (don't print it). Full coverage comes in SECTOR 0x03.

> INTEL — In this sim a **script** node means: write a normal program. Hit EXECUTE and the kernel runs it for real, then checks what it printed.
`,
    exercises: [
      {
        id: "boot-wake",
        title: "WAKE UP",
        kind: "script",
        difficulty: 1,
        xp: 100,
        brief: "First contact. Transmit the signal.",
        prompt: `
The white rabbit is waiting. Print these **three lines, exactly**, in order:

~~~text
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.
~~~

Use three **print()** calls.
`,
        starter: `# Transmit the three lines below using print()
`,
        solution: `print("Wake up, Neo...")
print("The Matrix has you...")
print("Follow the white rabbit.")
`,
        sampleStdin: [],
        tests: [
          { name: "the channel is not silent", needs_ns: false, code: `out=_run([])
assert out.strip() != "", "Nothing reached stdout. Use print()."` },
          { name: "all three lines, in order", needs_ns: false, code: `out=_run([])
lines=[l.rstrip() for l in out.strip().splitlines()]
expected=["Wake up, Neo...","The Matrix has you...","Follow the white rabbit."]
assert lines==expected, "Expected exactly:\\n"+"\\n".join(expected)+"\\n--- got ---\\n"+"\\n".join(lines)` },
        ],
        hint: `Three separate print() calls. Match the punctuation and capitalization character-for-character, including the \`...\`.`,
        lore: "The Matrix has you, Neo. Knock, knock.",
      },
      {
        id: "boot-callsign",
        title: "COWBOY CALLSIGN",
        kind: "script",
        difficulty: 1,
        xp: 100,
        brief: "Register the bounty hunter with the registry.",
        prompt: `
Print two records, each as **label, a TAB, then value**:

~~~text
NAME:	SPIKE
SHIP:	Bebop
~~~

The gap between label and value must be a real **tab** — use the \`\\t\` escape, not spaces.
`,
        starter: `# Use \\t between the label and the value
`,
        solution: `print("NAME:\\tSPIKE")
print("SHIP:\\tBebop")
`,
        sampleStdin: [],
        tests: [
          { name: "a real TAB is present", needs_ns: false, code: `out=_run([])
assert "\\t" in out, "Separate label and value with a TAB character (\\\\t), not spaces."` },
          { name: "both records, correct values", needs_ns: false, code: `out=_run([])
lines=[l.rstrip() for l in out.strip().splitlines()]
assert lines==["NAME:\\tSPIKE","SHIP:\\tBebop"], "Got: "+repr(lines)` },
        ],
        hint: `print("NAME:\\tSPIKE") puts a tab between NAME: and SPIKE.`,
        lore: "Whatever happens, happens. — Spike Spiegel",
      },
      {
        id: "boot-coords",
        title: "JUMP COORDINATES",
        kind: "script",
        difficulty: 1,
        xp: 100,
        brief: "Lock the hyperspace gate sequence.",
        prompt: `
Using a **single** print() call and the **sep=** argument, print three waypoints joined by \` :: \`:

~~~text
SOL :: GATE :: MARS
~~~

Pass the three waypoints as separate arguments — let \`sep\` do the joining.
`,
        starter: `# One print() call. Use sep=" :: "
`,
        solution: `print("SOL", "GATE", "MARS", sep=" :: ")
`,
        sampleStdin: [],
        tests: [
          { name: "exact coordinate string", needs_ns: false, code: `out=_run([])
assert out.strip()=="SOL :: GATE :: MARS", "Expected 'SOL :: GATE :: MARS', got: "+repr(out.strip())` },
          { name: "emitted on a single line", needs_ns: false, code: `out=_run([])
nonblank=[l for l in out.strip().splitlines() if l.strip()]
assert len(nonblank)==1, "Keep it to ONE line — use sep=, not three prints."` },
          { name: "uses the sep= argument", needs_ns: false, code: `assert "sep=" in _src, "Join the three values with the sep= argument — not one hard-coded string."` },
        ],
        hint: `print(a, b, c, sep=" :: ") joins the three values with " :: " between them.`,
        lore: "3, 2, 1, let's jam.",
      },
    ],
  },

  /* ===================== SECTOR 0x02 ===================== */
  {
    id: "m02-vars",
    code: "0x02",
    title: "VARIABLES & SIGNALS",
    subtitle: "data types · input() · casting · f-strings",
    theory: `
## Storing signals
A **variable** is a named box holding a value. Assign with **=**.

~~~python
codename = "Lain"
clearance = 7
~~~

## Core data types
- **str** — text: \`"the wired"\`
- **int** — whole numbers: \`42\`
- **float** — decimals: \`3.14\`
- **bool** — \`True\` / \`False\`

Check a type with **type(x)**. Python infers types automatically.

## Reading input
**input()** pauses and reads one line from the operator. It **always returns a str** — even if they type digits.

~~~python
age = input("Age: ")      # "17"  (a string!)
~~~

Each **input()** reads exactly **one** line. To read several values, call it again — each call grabs the next line:

~~~python
first = input()    # reads line 1
second = input()   # reads line 2
~~~

## Casting
Convert between types with **int()**, **float()**, **str()**. Use **float()** when the value may have a decimal point — \`float("2.5")\` is \`2.5\`, and dividing keeps the decimal.

~~~python
age = int(input("Age: "))       # whole number
reading = float(input("Hz: "))  # keeps decimals
~~~

> WARNING — Forgetting to cast is the #1 rookie bug. \`"10" + "20"\` is \`"1020"\`, but \`10 + 20\` is \`30\`.

## f-strings
Drop variables straight into text with an **f""** string and \`{curly braces}\`.

~~~python
name, lvl = "Faye", 3
print(f"{name} :: clearance L{lvl}")
~~~

Add a **format spec** after a colon to control numbers. **{x:.2f}** shows exactly two decimals (rounding as needed):

~~~python
print(f"BPM: {120:.2f}")     # BPM: 120.00
print(f"BPM: {99.999:.2f}")  # BPM: 100.00
~~~

## Multiple assignment
Assign several names at once — handy for an instant **swap** with no temp variable.

~~~python
a, b = 1, 2
a, b = b, a       # now a == 2, b == 1
~~~

## Comparisons are booleans
A comparison like **level > 90** evaluates straight to **True** / **False**, so you can hand it back directly — no if-statement needed.

~~~python
hot = 95 > 90     # True
~~~
`,
    exercises: [
      {
        id: "vars-handshake",
        title: "IDENTITY HANDSHAKE",
        kind: "script",
        difficulty: 1,
        xp: 100,
        brief: "Authenticate the operator at the gate.",
        prompt: `
Read a **codename** with input(), then print one line:

~~~text
ACCESS GRANTED: <codename>
~~~

For input \`Spike\`, output is \`ACCESS GRANTED: Spike\`. Build it with an f-string — don't hard-code the name.
`,
        starter: `name = input("Codename: ")
# TODO: print the ACCESS GRANTED line using an f-string
`,
        solution: `name = input("Codename: ")
print(f"ACCESS GRANTED: {name}")
`,
        sampleStdin: ["Spike"],
        tests: [
          { name: "greets Spike", needs_ns: false, code: `out=_run(["Spike"])
assert "ACCESS GRANTED: Spike" in out, "Expected 'ACCESS GRANTED: Spike'. Got: "+repr(out)` },
          { name: "uses the input, not a hard-coded name", needs_ns: false, code: `out=_run(["Edward"])
assert "ACCESS GRANTED: Edward" in out, "Build the line from input(). Got: "+repr(out)` },
        ],
        hint: `name = input(); then print(f"ACCESS GRANTED: {name}").`,
        lore: "Present day, present time. — Lain",
      },
      {
        id: "vars-warp",
        title: "WARP MATH",
        kind: "script",
        difficulty: 1,
        xp: 120,
        brief: "Combine two energy cells before the jump.",
        prompt: `
Read **two** whole numbers (two separate input() calls). Print their **sum** on its own line, as just the number.

~~~text
7
35
-> 42
~~~

Remember: input() gives you strings. Cast before adding.
`,
        starter: `# Read two integers and print their sum
a = input()
b = input()
# TODO
`,
        solution: `a = int(input())
b = int(input())
print(a + b)
`,
        sampleStdin: ["7", "35"],
        tests: [
          { name: "7 + 35 = 42", needs_ns: false, code: `import re as _re
out=_run(["7","35"])
nums=_re.findall(r"-?\\d+\\.?\\d*", out)
assert nums and float(nums[-1])==42, "The last number printed should be 42. Got: "+repr(out)` },
          { name: "adds numbers, not strings", needs_ns: false, code: `import re as _re
out=_run(["10","20"])
nums=_re.findall(r"-?\\d+\\.?\\d*", out)
assert nums and float(nums[-1])==30, "Should print 30 — cast with int(), or '10'+'20' becomes '1020'. Got: "+repr(out)` },
        ],
        hint: `Wrap each input() in int(): a = int(input()).`,
        lore: "See you in the next world line.",
      },
      {
        id: "vars-readout",
        title: "DIAGNOSTIC READOUT",
        kind: "script",
        difficulty: 1,
        xp: 120,
        brief: "Format a crew clearance badge.",
        prompt: `
Read a **codename** (str) then a **clearance level** (int), in that order. Print exactly:

~~~text
<name> :: clearance L<level> :: status NOMINAL
~~~

For inputs \`Faye\` and \`3\`: \`Faye :: clearance L3 :: status NOMINAL\`.
`,
        starter: `name = input()
level = int(input())
# TODO: print the readout with an f-string
`,
        solution: `name = input()
level = int(input())
print(f"{name} :: clearance L{level} :: status NOMINAL")
`,
        sampleStdin: ["Faye", "3"],
        tests: [
          { name: "renders Faye / L3", needs_ns: false, code: `out=_run(["Faye","3"])
assert "Faye :: clearance L3 :: status NOMINAL" in out, "Got: "+repr(out)` },
          { name: "rebuilds for any operator", needs_ns: false, code: `out=_run(["Jet","9"])
assert "Jet :: clearance L9 :: status NOMINAL" in out, "Got: "+repr(out)` },
        ],
        hint: `Inside the f-string: f"{name} :: clearance L{level} :: status NOMINAL".`,
        lore: "Section 9 clearance confirmed.",
      },
    ],
  },

  /* ===================== SECTOR 0x03 ===================== */
  {
    id: "m03-func",
    code: "0x03",
    title: "FUNCTIONS & RETURN",
    subtitle: "def · parameters · return · scope",
    theory: `
## Subroutines
A **function** is a reusable block of logic. Define it with **def**, feed it **parameters**, and hand back a result with **return**.

~~~python
def amplify(signal):
    return signal * 2

x = amplify(21)   # 42
~~~

## return vs print
This trips up everyone:
- **print()** shows something on screen, then the function hands back **None**.
- **return** gives a value back to the caller to use in more code.

A grader checks **return** values. If you print instead of returning, the function's result is \`None\`.

~~~python
def good(n):
    return n + 1     # caller gets a number

def bad(n):
    print(n + 1)     # caller gets None
~~~

## Default parameters
Give a parameter a fallback so callers can omit it.

~~~python
def burn(fuel, rate=10):
    return fuel - rate

burn(100)       # 90  (rate defaults to 10)
burn(100, 25)   # 75
~~~

## Scope
Variables created **inside** a function live only there. The outside world can't see them — clean and contained, like a sealed deck on the Bebop.

## Any number of arguments: *args
Prefix a parameter with **\\*** to collect **all** extra positional arguments into a tuple. **sum()** then folds them up.

~~~python
def stack(*cells):
    return sum(cells)    # cells is a tuple

stack(3, 5, 8)   # 16
stack()          # 0
~~~

## Functions are values
A function can be **passed to another function** and called inside it. A **lambda** is a tiny one-expression function written inline.

~~~python
def apply_twice(fn, x):
    return fn(fn(x))

apply_twice(lambda n: n * 2, 5)   # 20  (5 -> 10 -> 20)
~~~

## Recursion
A function may **call itself**. Always give a **base case** that stops the chain, then a step that shrinks toward it.

~~~python
def countdown(n):
    if n == 0:
        return [0]            # base case
    return [n] + countdown(n - 1)

countdown(3)   # [3, 2, 1, 0]
~~~

> INTEL — From here on, most nodes are **function** nodes: you write the \`def\`, the kernel calls it with secret inputs and checks the \`return\`.
`,
    exercises: [
      {
        id: "func-amplify",
        title: "AMPLIFY",
        kind: "function",
        difficulty: 1,
        xp: 120,
        brief: "Boost a weak transmission.",
        prompt: `
Define **amplify(signal)** that **returns** the signal at double amplitude (signal × 2).

~~~python
amplify(21)  ->  42
amplify(-3)  ->  -6
~~~

Use **return**, not print.
`,
        starter: `def amplify(signal):
    # TODO: return the signal boosted x2
    pass
`,
        solution: `def amplify(signal):
    return signal * 2
`,
        tests: [
          { name: "amplify(21) -> 42", code: `assert amplify(21)==42, "amplify(21) should be 42, got "+repr(amplify(21))` },
          { name: "works across the range", code: `assert amplify(5)==10 and amplify(0)==0 and amplify(-3)==-6` },
          { name: "returns a value (not None)", code: `r=amplify(4)
assert r==8, "Use return, not print — got "+repr(r)+"."` },
        ],
        hint: `Double means multiply by 2 with the * operator, and hand it back with return (not print).`,
        lore: "Crank the gain. Aphex would approve.",
      },
      {
        id: "func-boot",
        title: "AI BOOTUP",
        kind: "function",
        difficulty: 1,
        xp: 120,
        brief: "Bring a supercomputer online.",
        prompt: `
Define **boot_message(name)** that **returns** the string:

~~~text
<name> online. All systems nominal.
~~~

\`boot_message("MAGI")\` returns \`MAGI online. All systems nominal.\`
`,
        starter: `def boot_message(name):
    # TODO: return the boot string using an f-string
    pass
`,
        solution: `def boot_message(name):
    return f"{name} online. All systems nominal."
`,
        tests: [
          { name: "boots MAGI", code: `assert boot_message("MAGI")=="MAGI online. All systems nominal.", repr(boot_message("MAGI"))` },
          { name: "uses the parameter", code: `assert boot_message("Tachikoma")=="Tachikoma online. All systems nominal.", repr(boot_message("Tachikoma"))` },
        ],
        hint: `Build the line with an f-string, dropping {name} in front of the fixed text " online. All systems nominal." — and return it.`,
        lore: "MAGI system: MELCHIOR, BALTHASAR, CASPER — online.",
      },
      {
        id: "func-burn",
        title: "THRUSTER BURN",
        kind: "function",
        difficulty: 2,
        xp: 140,
        brief: "Spend fuel — with a default burn rate.",
        prompt: `
Define **burn(fuel, rate=10)** that **returns** the fuel remaining after a burn: \`fuel - rate\`. The \`rate\` parameter defaults to **10**.

~~~python
burn(100)       ->  90
burn(100, 25)   ->  75
~~~
`,
        starter: `def burn(fuel, rate=10):
    # TODO: return remaining fuel
    pass
`,
        solution: `def burn(fuel, rate=10):
    return fuel - rate
`,
        tests: [
          { name: "default rate 10: burn(100) -> 90", code: `assert burn(100)==90, "With default rate 10, burn(100) is 90. Got "+repr(burn(100))` },
          { name: "explicit rate: burn(100, 25) -> 75", code: `assert burn(100,25)==75, repr(burn(100,25))` },
          { name: "default really is 10", code: `assert burn(50)==40 and burn(50,0)==50` },
        ],
        hint: `The signature already encodes the default: def burn(fuel, rate=10). Just return fuel - rate.`,
        lore: "Burn the candle at both ends — discovery awaits.",
      },
    ],
  },

  /* ===================== SECTOR 0x04 ===================== */
  {
    id: "m04-ops",
    code: "0x04",
    title: "OPERATORS & MATH",
    subtitle: "arithmetic · // % ** · comparison · booleans",
    theory: `
## Arithmetic
\`+  -  *  /\` do what you expect — but note **/** always gives a **float** (\`6 / 2 == 3.0\`).

Three more you must know:
- **//** floor division — divide and drop the remainder: \`43 // 5 == 8\`
- **%** modulo — the remainder: \`43 % 5 == 3\`
- **\\*\\*** power: \`2 ** 10 == 1024\`

~~~python
total, crew = 43, 5
each = total // crew   # 8
left = total % crew    # 3
~~~

## Modulo is everywhere
\`n % 2 == 0\` tests **even**. \`n % k == 0\` tests "divisible by k". You'll use it constantly.

## Comparisons return booleans
\`==  !=  <  <=  >  >=\` evaluate to **True** / **False**.

~~~python
9001 > 9000   # True
~~~

## Boolean logic
Combine conditions with **and**, **or**, **not**.

~~~python
in_range = level >= 0 and level <= 100
~~~

## Chained comparisons
Python lets you write a range check the way maths does — **a <= x <= b** is a single expression:

~~~python
audible = 20 <= freq <= 20000   # True when freq is in [20, 20000]
~~~

## Number helpers
- **abs(x)** — drop the sign, so abs(-9) is 9
- **round(x, n)** — round to n decimal places, so round(3.14159, 2) is 3.14
- there's no sqrt operator — raise to the **0.5** power instead

~~~python
dist = (3 ** 2 + 4 ** 2) ** 0.5   # 5.0
clean = round(abs(-3.14159), 2)   # 3.14
~~~

> INTEL — \`=\` assigns, \`==\` compares. Mixing them up is a classic ghost in the machine.
`,
    exercises: [
      {
        id: "ops-parity",
        title: "PARITY CHECK",
        kind: "function",
        difficulty: 1,
        xp: 120,
        brief: "Flag even-numbered data packets.",
        prompt: `
Define **is_even(n)** that **returns** a boolean: \`True\` if n is even, else \`False\`. Use the modulo operator **%**.

~~~python
is_even(4)  ->  True
is_even(7)  ->  False
~~~
`,
        starter: `def is_even(n):
    # TODO: return True if n is even
    pass
`,
        solution: `def is_even(n):
    return n % 2 == 0
`,
        tests: [
          { name: "even -> True", code: `assert is_even(4) is True and is_even(100) is True` },
          { name: "odd -> False", code: `assert is_even(7) is False and is_even(1) is False` },
          { name: "handles 0 and negatives", code: `assert is_even(0) is True and is_even(-2) is True and is_even(-3) is False` },
        ],
        hint: `An even number leaves remainder 0 when divided by 2: return n % 2 == 0.`,
        lore: "Packet parity verified. No corruption detected.",
      },
      {
        id: "ops-overdrive",
        title: "OVERDRIVE",
        kind: "function",
        difficulty: 1,
        xp: 120,
        brief: "Push the reactor exponentially.",
        prompt: `
Define **overdrive(base, n)** that **returns** \`base\` raised to the power \`n\`. Use the **\\*\\*** operator.

~~~python
overdrive(2, 10)  ->  1024
overdrive(5, 0)   ->  1
~~~
`,
        starter: `def overdrive(base, n):
    # TODO: return base ** n
    pass
`,
        solution: `def overdrive(base, n):
    return base ** n
`,
        tests: [
          { name: "2 ** 10 == 1024", code: `assert overdrive(2,10)==1024` },
          { name: "more surges", code: `assert overdrive(9,2)==81 and overdrive(5,0)==1 and overdrive(3,3)==27` },
        ],
        hint: `Exponent operator is two asterisks: base ** n.`,
        lore: "Harder, better, faster, stronger.",
      },
      {
        id: "ops-rations",
        title: "RATION SPLIT",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Divide supplies across the crew.",
        prompt: `
Define **rations(total, crew)** that splits \`total\` supplies among \`crew\` members. **Return a tuple** \`(each, leftover)\` where:
- \`each\` = whole units per member (floor division)
- \`leftover\` = units that don't divide evenly (modulo)

~~~python
rations(43, 5)  ->  (8, 3)
rations(10, 2)  ->  (5, 0)
~~~
`,
        starter: `def rations(total, crew):
    # TODO: return (each, leftover)
    pass
`,
        solution: `def rations(total, crew):
    return (total // crew, total % crew)
`,
        tests: [
          { name: "rations(43, 5) -> (8, 3)", code: `assert rations(43,5)==(8,3), repr(rations(43,5))` },
          { name: "exact split has 0 leftover", code: `assert rations(10,2)==(5,0)` },
          { name: "returns a 2-tuple", code: `r=rations(7,3)
assert isinstance(r, tuple) and r==(2,1), repr(r)` },
        ],
        hint: `Floor division // gives 'each', modulo % gives 'leftover'. return (total // crew, total % crew).`,
        lore: "Everyone eats on the Bebop. Even Ein.",
      },
    ],
  },

  /* ===================== SECTOR 0x05 ===================== */
  {
    id: "m05-cond",
    code: "0x05",
    title: "CONDITIONALS",
    subtitle: "if · elif · else · boolean logic · branching",
    theory: `
## Branching
**if** runs a block only when a condition is True. Add **elif** (else-if) for more cases and **else** for the fallback. Indentation (4 spaces) defines each block.

~~~python
if level >= 5:
    tier = "ROOT"
elif level >= 3:
    tier = "OPERATOR"
else:
    tier = "GUEST"
~~~

## Order matters
Python checks branches **top to bottom** and stops at the first True one. Put the most specific / strictest test first.

~~~python
# divisible by 15 must be checked BEFORE 3 or 5
if n % 15 == 0:
    ...
elif n % 3 == 0:
    ...
~~~

## Combining tests
Use **and**, **or**, **not**, and comparison chaining:

~~~python
if 0 <= score <= 100:
    print("valid reading")
~~~

## One-line choice: the ternary
When you only need to pick between **two** values, use a conditional expression: **VALUE_IF_TRUE if CONDITION else VALUE_IF_FALSE**. The whole thing is one expression, so you can return it directly.

~~~python
status = "CLIPPING" if db > 0 else "SAFE"
~~~

## match / case
For dispatching one value against many fixed options, **match/case** reads cleanly. Combine options with **|**, and use **case _:** as the catch-all (it must come last).

~~~python
match cmd:
    case "warp":
        return "ENGAGED"
    case "halt" | "stop":
        return "ALL STOP"
    case _:
        return "UNKNOWN"
~~~

> INTEL — Returning from inside each branch (\`return "ROOT"\`) is clean and common. Once a function hits \`return\`, it exits immediately.
`,
    exercises: [
      {
        id: "cond-clearance",
        title: "ACCESS TIERS",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Map clearance levels to access tiers.",
        prompt: `
Define **clearance(level)** that **returns** a tier string:
- level **< 1** → \`"DENIED"\`
- level **1–2** → \`"GUEST"\`
- level **3–4** → \`"OPERATOR"\`
- level **5+** → \`"ROOT"\`

~~~python
clearance(0) -> "DENIED"
clearance(3) -> "OPERATOR"
clearance(9) -> "ROOT"
~~~
`,
        starter: `def clearance(level):
    # TODO: branch on level and return the tier
    pass
`,
        solution: `def clearance(level):
    if level < 1:
        return "DENIED"
    elif level <= 2:
        return "GUEST"
    elif level <= 4:
        return "OPERATOR"
    else:
        return "ROOT"
`,
        tests: [
          { name: "below 1 -> DENIED", code: `assert clearance(0)=="DENIED" and clearance(-4)=="DENIED"` },
          { name: "1-2 -> GUEST", code: `assert clearance(1)=="GUEST" and clearance(2)=="GUEST"` },
          { name: "3-4 -> OPERATOR", code: `assert clearance(3)=="OPERATOR" and clearance(4)=="OPERATOR"` },
          { name: "5+ -> ROOT", code: `assert clearance(5)=="ROOT" and clearance(99)=="ROOT"` },
        ],
        hint: `Check from the bottom up or top down consistently: if level < 1 ... elif level <= 2 ... elif level <= 4 ... else ROOT.`,
        lore: "Access is a privilege, netrunner. Earn it.",
      },
      {
        id: "cond-magi",
        title: "THE MAGI SYSTEM",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Three supercomputers vote on every number.",
        prompt: `
NERV's MAGI classifies an integer **n**. Define **magi(n)** that **returns**:
- \`"SYNCHRONIZED"\` if n is divisible by **both 3 and 5**
- \`"MELCHIOR"\` if divisible by **3** (only)
- \`"BALTHASAR"\` if divisible by **5** (only)
- otherwise the number as a **string**, e.g. \`"7"\`

~~~python
magi(9)  -> "MELCHIOR"
magi(20) -> "BALTHASAR"
magi(15) -> "SYNCHRONIZED"
magi(7)  -> "7"
~~~

(Yes — this is FizzBuzz in a plugsuit. A real interview classic.)
`,
        starter: `def magi(n):
    # TODO: check divisible-by-15 FIRST
    pass
`,
        solution: `def magi(n):
    if n % 15 == 0:
        return "SYNCHRONIZED"
    elif n % 3 == 0:
        return "MELCHIOR"
    elif n % 5 == 0:
        return "BALTHASAR"
    else:
        return str(n)
`,
        tests: [
          { name: "multiples of 3 -> MELCHIOR", code: `assert magi(3)=="MELCHIOR" and magi(9)=="MELCHIOR"` },
          { name: "multiples of 5 -> BALTHASAR", code: `assert magi(5)=="BALTHASAR" and magi(20)=="BALTHASAR"` },
          { name: "multiples of 15 -> SYNCHRONIZED", code: `assert magi(15)=="SYNCHRONIZED" and magi(30)=="SYNCHRONIZED"` },
          { name: "others -> the number as text", code: `assert magi(7)=="7" and magi(1)=="1"` },
        ],
        hint: `Test n % 15 == 0 before n % 3 and n % 5, or the 'both' case never triggers.`,
        lore: "Pattern blue. The MAGI are unanimous.",
      },
      {
        id: "cond-vk",
        title: "VOIGHT-KAMPFF",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Is the subject human... or replicant?",
        prompt: `
Given an empathy **score** (expected 0–100), define **verdict(score)** returning:
- \`"INVALID"\` if score is **< 0 or > 100**
- \`"HUMAN"\` if score **>= 80**
- \`"INCONCLUSIVE"\` if score **40–79**
- \`"REPLICANT"\` if score **< 40**

~~~python
verdict(95) -> "HUMAN"
verdict(55) -> "INCONCLUSIVE"
verdict(12) -> "REPLICANT"
verdict(120) -> "INVALID"
~~~
`,
        starter: `def verdict(score):
    # TODO: guard the invalid range FIRST, then classify
    pass
`,
        solution: `def verdict(score):
    if score < 0 or score > 100:
        return "INVALID"
    elif score >= 80:
        return "HUMAN"
    elif score >= 40:
        return "INCONCLUSIVE"
    else:
        return "REPLICANT"
`,
        tests: [
          { name: "high empathy -> HUMAN", code: `assert verdict(95)=="HUMAN" and verdict(80)=="HUMAN"` },
          { name: "mid -> INCONCLUSIVE", code: `assert verdict(40)=="INCONCLUSIVE" and verdict(79)=="INCONCLUSIVE"` },
          { name: "low -> REPLICANT", code: `assert verdict(0)=="REPLICANT" and verdict(39)=="REPLICANT"` },
          { name: "out of range -> INVALID", code: `assert verdict(-5)=="INVALID" and verdict(150)=="INVALID"` },
        ],
        hint: `Reject score < 0 or score > 100 first. Then check >= 80, then >= 40, else REPLICANT.`,
        lore: "I've seen things you people wouldn't believe.",
      },
    ],
  },

  /* ===================== SECTOR 0x06 ===================== */
  {
    id: "m06-loops",
    code: "0x06",
    title: "LOOPS",
    subtitle: "for · while · range · break · accumulators",
    theory: `
## Repeating work
A **for** loop walks a sequence. **range(n)** yields \`0 .. n-1\`; \`range(a, b, step)\` is fully configurable.

~~~python
for i in range(3):
    print(i)        # 0, 1, 2

for i in range(5, 0, -1):
    print(i)        # 5, 4, 3, 2, 1
~~~

## The accumulator pattern
Start with an empty total / list, then build it up each pass. This is the backbone of data work. The same shape works for a **running product** — but start at **1** and use **\\*=**:

~~~python
total = 0
for c in [10, 20, 12]:
    total += c       # 42

product = 1
for c in [2, 3, 4]:
    product *= c     # 24  (start at 1, not 0)
~~~

## Looping by index
Sometimes you need the position, not just the value. **range(len(seq))** gives the indices 0 up to len minus 1; index back into the sequence with **seq[i]**. Returning mid-loop is the clean way to "find the first match and stop":

~~~python
for i in range(len(readings)):
    if readings[i] < 0:
        return i     # first negative index
return -1            # ran out — none found
~~~

## Nested loops
A loop inside a loop. For each outer pass, the **inner** loop runs in full — perfect for building grids and rows.

~~~python
for i in range(1, 4):
    row = "*" * i        # "*", then "**", then "***"
    print(row)
~~~

## while loops
**while** repeats as long as a condition holds. You must change something inside, or it loops forever.

~~~python
n = 8
steps = 0
while n != 1:
    n = n // 2
    steps += 1       # 3
~~~

## break / continue
**break** bails out of the loop entirely; **continue** skips to the next pass.

> WARNING — A \`while\` with no exit will hang. In this sim the kernel force-halts runaway loops after a few seconds.
`,
    exercises: [
      {
        id: "loops-ignition",
        title: "IGNITION SEQUENCE",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Count down to launch.",
        prompt: `
Define **countdown(n)** that **returns a list**: from \`n\` down to \`1\`, then the string \`"IGNITION"\`.

~~~python
countdown(3) -> [3, 2, 1, "IGNITION"]
countdown(1) -> [1, "IGNITION"]
countdown(0) -> ["IGNITION"]
~~~

Build the list with a loop and **.append()**.
`,
        starter: `def countdown(n):
    seq = []
    # TODO: append n, n-1, ..., 1, then "IGNITION"
    return seq
`,
        solution: `def countdown(n):
    seq = []
    for i in range(n, 0, -1):
        seq.append(i)
    seq.append("IGNITION")
    return seq
`,
        tests: [
          { name: "countdown(3)", code: `assert countdown(3)==[3,2,1,"IGNITION"], repr(countdown(3))` },
          { name: "countdown(1)", code: `assert countdown(1)==[1,"IGNITION"], repr(countdown(1))` },
          { name: "countdown(0) is just IGNITION", code: `assert countdown(0)==["IGNITION"], repr(countdown(0))` },
        ],
        hint: `range(n, 0, -1) counts down to 1. Append each i, then append "IGNITION" after the loop.`,
        lore: "3... 2... 1... let's jam.",
      },
      {
        id: "loops-accumulate",
        title: "POWER ACCUMULATOR",
        kind: "function",
        difficulty: 1,
        xp: 130,
        brief: "Sum the reactor cell charges.",
        prompt: `
Define **total_power(cells)** that **returns** the sum of a list of numbers — using a **loop** and an accumulator (don't just call sum(), practice the pattern).

~~~python
total_power([10, 20, 12]) -> 42
total_power([])           -> 0
~~~
`,
        starter: `def total_power(cells):
    total = 0
    # TODO: add each cell to total
    return total
`,
        solution: `def total_power(cells):
    total = 0
    for c in cells:
        total += c
    return total
`,
        tests: [
          { name: "sums a list", code: `assert total_power([10,20,12])==42 and total_power([1,2,3,4])==10` },
          { name: "empty -> 0", code: `assert total_power([])==0` },
          { name: "handles negatives", code: `assert total_power([10,-4,2])==8` },
        ],
        hint: `total = 0; for c in cells: total += c; return total.`,
        lore: "Every cell counts when you're burning for the gate.",
      },
      {
        id: "loops-divergence",
        title: "DIVERGENCE METER",
        kind: "function",
        difficulty: 3,
        xp: 180,
        brief: "Count the steps back to world-line 1.",
        prompt: `
The Collatz sequence: if n is even, halve it; if odd, do \`3n + 1\`. Repeat until you reach **1**.

Define **steps_to_one(n)** returning how many steps it takes to reach 1. Use a **while** loop.

~~~python
steps_to_one(1) -> 0     # already there
steps_to_one(8) -> 3     # 8 -> 4 -> 2 -> 1
steps_to_one(6) -> 8
~~~
`,
        starter: `def steps_to_one(n):
    count = 0
    # TODO: while n != 1 -> halve if even, else 3*n + 1, counting each step
    return count
`,
        solution: `def steps_to_one(n):
    count = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        count += 1
    return count
`,
        tests: [
          { name: "1 needs 0 steps", code: `assert steps_to_one(1)==0` },
          { name: "8 -> 3 steps", code: `assert steps_to_one(8)==3, repr(steps_to_one(8))` },
          { name: "6 -> 8 steps", code: `assert steps_to_one(6)==8, repr(steps_to_one(6))` },
          { name: "7 -> 16 steps", code: `assert steps_to_one(7)==16, repr(steps_to_one(7))` },
        ],
        hint: `Inside the while: if even reassign n = n // 2 else n = 3*n + 1, then count += 1 each pass.`,
        lore: "El Psy Kongroo. The world line shifts by 0.000001%.",
      },
    ],
  },

  /* ===================== SECTOR 0x07 ===================== */
  {
    id: "m07-str",
    code: "0x07",
    title: "STRING MANIPULATION",
    subtitle: "indexing · slicing · methods · formatting",
    theory: `
## Strings are sequences
Each character has an index from **0**. Negative indices count from the end.

~~~python
s = "LAIN"
s[0]    # "L"
s[-1]   # "N"
~~~

## Slicing
\`s[start:stop:step]\` carves out a substring. Omit parts for defaults. The **step** controls stride: **2** keeps every other character, **-1** walks backwards (a reverse).

~~~python
s[1:3]    # "AI"
s[::2]    # "LI"   (every other char, from index 0)
s[::-1]   # "NIAL" (reversed)
~~~

## Essential methods
Strings are immutable — methods return **new** strings:
- \`.upper()\` \`.lower()\` \`.title()\`
- \`.strip()\` — trim whitespace
- \`.replace(a, b)\`
- \`.count(sub)\` — how many times \`sub\` appears
- \`.split(sep)\` → list, and \`sep.join(list)\` → string
- \`x in s\` — membership test

~~~python
"daft punk".upper()          # "DAFT PUNK"
"discovery".title()          # "Discovery"
"a,b,c".split(",")           # ["a","b","c"]
"banana".count("a")          # 3
~~~

Chain methods left to right — each acts on the previous result: \`raw.strip().replace("-", "_")\`.

> INTEL — \`ch.lower() in "aeiou"\` is a tidy way to test whether a character is a vowel regardless of case.
`,
    exercises: [
      {
        id: "str-reverse",
        title: "PALINDROME ICE",
        kind: "function",
        difficulty: 1,
        xp: 120,
        brief: "Reverse the encrypted packet.",
        prompt: `
Define **reverse_signal(s)** that **returns** the string reversed. Use slicing.

~~~python
reverse_signal("LAIN") -> "NIAL"
reverse_signal("")     -> ""
~~~
`,
        starter: `def reverse_signal(s):
    # TODO: return s reversed
    pass
`,
        solution: `def reverse_signal(s):
    return s[::-1]
`,
        tests: [
          { name: "reverses text", code: `assert reverse_signal("LAIN")=="NIAL"` },
          { name: "edge cases", code: `assert reverse_signal("")=="" and reverse_signal("a")=="a"` },
          { name: "longer string", code: `assert reverse_signal("wired")=="deriw"` },
        ],
        hint: `The slice s[::-1] walks the string backwards.`,
        lore: "Close the world, open the nExT.",
      },
      {
        id: "str-purge",
        title: "VOWEL PURGE",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Compress a transmission, CS50P 'twttr'-style.",
        prompt: `
Define **compress(s)** that **returns** \`s\` with every vowel removed (\`a e i o u\`, upper or lower case). Everything else — including \`y\` — stays.

~~~python
compress("Twitter")      -> "Twttr"
compress("Windowlicker") -> "Wndwlckr"
compress("RHYTHM")       -> "RHYTHM"
~~~
`,
        starter: `def compress(s):
    result = ""
    # TODO: keep each character that is NOT a vowel
    return result
`,
        solution: `def compress(s):
    result = ""
    for ch in s:
        if ch.lower() not in "aeiou":
            result += ch
    return result
`,
        tests: [
          { name: "Twitter -> Twttr", code: `assert compress("Twitter")=="Twttr", repr(compress("Twitter"))` },
          { name: "Windowlicker -> Wndwlckr", code: `assert compress("Windowlicker")=="Wndwlckr", repr(compress("Windowlicker"))` },
          { name: "keeps consonants and y", code: `assert compress("RHYTHM")=="RHYTHM" and compress("AEIOU")==""` },
        ],
        hint: `Loop characters; keep ch only if ch.lower() not in "aeiou".`,
        lore: "Windowlicker. Aphex Twin, 1999. The vowels never stood a chance.",
      },
      {
        id: "str-marquee",
        title: "NOW PLAYING",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Render the synthwave station marquee.",
        prompt: `
Define **format_track(artist, title)** that **returns**:

~~~text
<ARTIST IN CAPS> - <Title In Title Case>
~~~

Uppercase the artist, title-case the track, join with \` - \` (space hyphen space).

~~~python
format_track("daft punk", "discovery") -> "DAFT PUNK - Discovery"
~~~
`,
        starter: `def format_track(artist, title):
    # TODO: ARTIST.upper() - Title.title()
    pass
`,
        solution: `def format_track(artist, title):
    return f"{artist.upper()} - {title.title()}"
`,
        tests: [
          { name: "Daft Punk - Discovery", code: `assert format_track("daft punk","discovery")=="DAFT PUNK - Discovery", repr(format_track("daft punk","discovery"))` },
          { name: "title-cases multi-word tracks", code: `assert format_track("daft punk","harder better faster stronger")=="DAFT PUNK - Harder Better Faster Stronger"` },
          { name: "another artist", code: `assert format_track("aphex twin","windowlicker")=="APHEX TWIN - Windowlicker"` },
        ],
        hint: `In one f-string, apply .upper() to the artist and .title() to the track, with a literal " - " between the two slots.`,
        lore: "One more time. We're gonna celebrate.",
      },
    ],
  },

  /* ===================== SECTOR 0x08 ===================== */
  {
    id: "m08-lists",
    code: "0x08",
    title: "LISTS & TUPLES",
    subtitle: "sequences · methods · sorting · comprehensions",
    theory: `
## Lists
An ordered, mutable collection. Index, slice, and mutate it.

~~~python
crew = ["Spike", "Jet", "Faye"]
crew.append("Ed")      # add to end
crew[0]                # "Spike"
len(crew)              # 4
~~~

Handy built-ins: **len, sum, min, max, sorted**.

~~~python
sorted([5, 2, 9], reverse=True)   # [9, 5, 2]
~~~

## Tuples
Like lists but **immutable** — fixed once created. Great for fixed records and returning multiple values.

~~~python
point = (10, 20)
lo, hi = (3, 99)       # unpacking
~~~

## List comprehensions
Build a new list in one expressive line — \`[expr for item in seq if condition]\`. The \`expr\` **transforms**, the \`if\` **filters**:

~~~python
loud = [name for (name, bpm) in tracks if bpm >= 120]
doubled = [n * 2 for n in levels if n > 0]
~~~

This is the Pythonic workhorse for filtering and transforming data. Master it.

A **nested** comprehension flattens a list of lists — read the \`for\` clauses left to right, outer first:

~~~python
flat = [item for row in grid for item in row]   # [[1,2],[3]] -> [1,2,3]
~~~

## zip — walk two lists together
**zip(a, b)** pairs items by position; wrap in **list()** to get the (x, y) tuples. It stops at the shorter list.

~~~python
list(zip(["A", "B"], [1, 2]))   # [("A", 1), ("B", 2)]
~~~

## Sets — a one-minute primer
A **set** is an unordered bag of **unique** items. \`set()\` makes an empty one, \`seen.add(x)\` drops an item in, and \`x in seen\` is a fast "is it already here?" check. Sets get full coverage next sector — here you just use one as a quick memory of what you've already seen.

## Dedupe, keeping order
A **set** removes duplicates but **scrambles order**. To keep the **first** appearance of each item, track what you've **seen**:

~~~python
seen = set()
out = []
for x in items:
    if x not in seen:
        seen.add(x)
        out.append(x)
~~~

(If order doesn't matter, **sorted(set(items))** gives the distinct values, sorted — more on sets in the next sector.)

> INTEL — Unpack tuples right in a for-loop header: \`for (name, bpm) in tracks:\`.
`,
    exercises: [
      {
        id: "lists-topthree",
        title: "HIGH SCORES",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Pull the top three arcade scores.",
        prompt: `
Define **top_three(scores)** that **returns** the three largest values, in **descending** order, as a list. If fewer than three exist, return what's there (still sorted).

~~~python
top_three([5, 2, 9, 1, 7]) -> [9, 7, 5]
top_three([3, 1])          -> [3, 1]
~~~
`,
        starter: `def top_three(scores):
    # TODO: sort descending, take first three
    pass
`,
        solution: `def top_three(scores):
    return sorted(scores, reverse=True)[:3]
`,
        tests: [
          { name: "top three descending", code: `assert top_three([5,2,9,1,7])==[9,7,5], repr(top_three([5,2,9,1,7]))` },
          { name: "fewer than three", code: `assert top_three([3,1])==[3,1] and top_three([8])==[8]` },
          { name: "handles duplicates", code: `assert top_three([4,4,4,4])==[4,4,4]` },
        ],
        hint: `sorted(scores, reverse=True) then slice [:3].`,
        lore: "ENTER YOUR INITIALS: A A A",
      },
      {
        id: "lists-filter",
        title: "FREQUENCY FILTER",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Filter the set for high-BPM bangers.",
        prompt: `
\`tracks\` is a list of \`(name, bpm)\` tuples. Define **loud_tracks(tracks)** that **returns** a list of just the **names** whose bpm is **120 or more**, preserving order. Use a comprehension.

~~~python
data = [("Lull", 90), ("Spice", 128), ("Wired", 140)]
loud_tracks(data) -> ["Spice", "Wired"]
~~~
`,
        starter: `def loud_tracks(tracks):
    # TODO: [name for (name, bpm) in tracks if bpm >= 120]
    pass
`,
        solution: `def loud_tracks(tracks):
    return [name for (name, bpm) in tracks if bpm >= 120]
`,
        tests: [
          { name: "keeps bpm >= 120", code: `data=[("Lull",90),("Spice",128),("Wired",140),("Drift",60)]
assert loud_tracks(data)==["Spice","Wired"], repr(loud_tracks(data))` },
          { name: "boundary 120 is included", code: `assert loud_tracks([("X",120)])==["X"], "120 counts as loud (>= 120)."` },
          { name: "empty set -> empty list", code: `assert loud_tracks([])==[]` },
        ],
        hint: `Unpack inside the comprehension: [name for (name, bpm) in tracks if bpm >= 120].`,
        lore: "Drop the bass at the Night City after-hours.",
      },
      {
        id: "lists-telemetry",
        title: "TELEMETRY",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Summarize a stream of sensor readings.",
        prompt: `
Define **telemetry(readings)** (a non-empty list of numbers) that **returns a tuple** \`(lowest, highest, average)\`. The average is the mean as a **float**.

~~~python
telemetry([10, 20, 30]) -> (10, 30, 20.0)
telemetry([5])          -> (5, 5, 5.0)
~~~
`,
        starter: `def telemetry(readings):
    # TODO: return (min, max, average-as-float)
    pass
`,
        solution: `def telemetry(readings):
    return (min(readings), max(readings), sum(readings) / len(readings))
`,
        tests: [
          { name: "min, max, mean", code: `assert telemetry([10,20,30])==(10,30,20.0), repr(telemetry([10,20,30]))` },
          { name: "single reading", code: `assert telemetry([5])==(5,5,5.0)` },
          { name: "average is a float", code: `r=telemetry([1,2])
assert r==(1,2,1.5) and isinstance(r[2], float), repr(r)` },
        ],
        hint: `Use min(), max(), and sum()/len(). Division with / always yields a float.`,
        lore: "Tachikoma reporting: all readings nominal!",
      },
    ],
  },

  /* ===================== SECTOR 0x09 ===================== */
  {
    id: "m09-dicts",
    code: "0x09",
    title: "DICTIONARIES & SETS",
    subtitle: "key/value · frequency tables · sets",
    theory: `
## Dictionaries
A **dict** maps **keys** to **values** — instant lookup by key.

~~~python
bounty = {"Asimov": 2500000, "Teddy": 1000000}
bounty["Asimov"]          # 2500000
bounty.get("Spike", 0)    # 0  (safe default, no crash)
~~~

Use **.get(key, default)** to avoid \`KeyError\` on missing keys.

## Building frequency tables
The bread-and-butter of data analysis (hello, Dataquest): count occurrences by accumulating into a dict.

~~~python
freq = {}
for ch in text:
    freq[ch] = freq.get(ch, 0) + 1
~~~

## Building & walking dicts
- **dict(zip(keys, values))** builds a dict from two parallel lists.
- **d.items()** yields each (key, value) pair to loop over.
- A **dict comprehension** transforms in one line — e.g. swap keys and values:

~~~python
dict(zip(["a", "b"], [1, 2]))        # {"a": 1, "b": 2}
{v: k for k, v in d.items()}         # invert: keys <-> values
for k, v in d.items():
    ...                              # walk every pair
~~~

## Picking by value
**max(d, key=d.get)** returns the **key** with the largest value — exactly "which entry counts highest" in a frequency table.

~~~python
max(freq, key=freq.get)   # the most common element
~~~

## Sets
A **set** holds **unique** items, unordered. Perfect for dedupe and membership.

~~~python
set([3, 1, 2, 3, 1])     # {1, 2, 3}
sorted(set(data))        # unique, then ordered
~~~

Sets combine with operators: **&** intersection (in both), **|** union (in either), **-** difference (in the first, not the second).

~~~python
a, b = {1, 2, 3}, {2, 3, 4}
a & b    # {2, 3}
a | b    # {1, 2, 3, 4}
a - b    # {1}
~~~

> INTEL — \`sorted(set(x))\` is a one-liner for "distinct values, in order" — you'll reach for it constantly.
`,
    exercises: [
      {
        id: "dicts-bounty",
        title: "BOUNTY BOARD",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Look up a target's price — safely.",
        prompt: `
\`board\` is a dict of \`name -> reward\`. Define **bounty(board, name)** that **returns** the reward for \`name\`, or **0** if the name isn't on the board. Don't let a missing key crash it.

~~~python
b = {"Asimov": 2500000, "Teddy": 1000000}
bounty(b, "Asimov") -> 2500000
bounty(b, "Spike")  -> 0
~~~
`,
        starter: `def bounty(board, name):
    # TODO: return the reward or 0 if absent (use .get)
    pass
`,
        solution: `def bounty(board, name):
    return board.get(name, 0)
`,
        tests: [
          { name: "known target", code: `assert bounty({"Asimov":2500000,"Teddy":1000000},"Asimov")==2500000` },
          { name: "unknown target -> 0", code: `assert bounty({"Asimov":2500000},"Spike")==0, "Missing key must return 0, not crash. Use .get."` },
          { name: "empty board -> 0", code: `assert bounty({}, "anyone")==0` },
        ],
        hint: `board.get(name, 0) returns the value if present, else 0.`,
        lore: "Three million woolongs, dead or alive.",
      },
      {
        id: "dicts-frequency",
        title: "SIGNAL FREQUENCY",
        kind: "function",
        difficulty: 2,
        xp: 170,
        brief: "Build a frequency table of the data stream.",
        prompt: `
Define **char_frequency(s)** that **returns a dict** mapping each character in \`s\` to how many times it appears.

~~~python
char_frequency("aab") -> {"a": 2, "b": 1}
char_frequency("")    -> {}
~~~

This is the core Dataquest "frequency table" move.
`,
        starter: `def char_frequency(s):
    freq = {}
    # TODO: count each character
    return freq
`,
        solution: `def char_frequency(s):
    freq = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    return freq
`,
        tests: [
          { name: "counts repeats", code: `assert char_frequency("aab")=={"a":2,"b":1}, repr(char_frequency("aab"))` },
          { name: "empty string -> empty dict", code: `assert char_frequency("")=={}` },
          { name: "all distinct", code: `assert char_frequency("wired")=={"w":1,"i":1,"r":1,"e":1,"d":1}` },
        ],
        hint: `For each ch: freq[ch] = freq.get(ch, 0) + 1.`,
        lore: "Decoding the signal from the Wired...",
      },
      {
        id: "sets-dedupe",
        title: "DEDUPE THE WIRED",
        kind: "function",
        difficulty: 2,
        xp: 150,
        brief: "Collapse duplicate node IDs.",
        prompt: `
Define **unique_nodes(seq)** that **returns** a **sorted list** of the distinct items in \`seq\`.

~~~python
unique_nodes([3, 1, 2, 3, 1]) -> [1, 2, 3]
unique_nodes(["b","a","b"])   -> ["a", "b"]
~~~
`,
        starter: `def unique_nodes(seq):
    # TODO: distinct values, sorted
    pass
`,
        solution: `def unique_nodes(seq):
    return sorted(set(seq))
`,
        tests: [
          { name: "dedupes and sorts numbers", code: `assert unique_nodes([3,1,2,3,1])==[1,2,3]` },
          { name: "works on strings", code: `assert unique_nodes(["b","a","b","c","a"])==["a","b","c"]` },
          { name: "empty -> empty", code: `assert unique_nodes([])==[]` },
        ],
        hint: `set() removes duplicates; sorted() turns it into an ordered list: sorted(set(seq)).`,
        lore: "No matter where you go, everyone's connected.",
      },
    ],
  },

  /* ===================== SECTOR 0x0A ===================== */
  {
    id: "m10-exc",
    code: "0x0A",
    title: "EXCEPTIONS & VALIDATION",
    subtitle: "try · except · raise · guarding input",
    theory: `
## When things go wrong
Operations that can fail raise an **exception**. Unhandled, it crashes the program. Catch it with **try / except**.

~~~python
try:
    n = int("oops")       # raises ValueError
except ValueError:
    n = None              # recover gracefully
~~~

Catch **specific** types (\`ValueError\`, \`ZeroDivisionError\`, \`KeyError\`, ...) — not a bare \`except\`, which hides real bugs.

## Raising your own
Enforce rules by **raising** when input is illegal.

~~~python
def set_fuel(level):
    if level < 0 or level > 100:
        raise ValueError("out of range")
    return level
~~~

## Catching several types at once
List multiple exception types as a **tuple** to handle them with one block:

~~~python
try:
    return int(a) / int(b)
except (ValueError, ZeroDivisionError):
    return None        # bad text OR zero divisor
~~~

## else and finally
A full **try / except / else / finally** gives you four slots:
- **try** — the risky operation
- **except** — runs only if it failed
- **else** — runs only if it **succeeded** (no exception)
- **finally** — runs **no matter what** (cleanup, always)

~~~python
try:
    q = a // b
except ZeroDivisionError:
    status = "ERR"
else:
    status = "OK:" + str(q)   # only on success
finally:
    status += ":DONE"         # always
~~~

## The validation loop
Professional code never trusts input. Convert + check, recover or reject.

> INTEL — \`int("3.5")\` raises ValueError because the **text** \`"3.5"\` isn't a valid whole-number string — the dot makes it illegal. \`int("3")\` works fine. (That's different from \`int(3.5)\` on an actual number, which simply truncates to \`3\`.) Catching the exception turns a crash into a clean fallback value.
`,
    exercises: [
      {
        id: "exc-decode",
        title: "SAFE DECODE",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Parse a number without crashing on garbage.",
        prompt: `
Define **safe_int(s)** that **returns** \`int(s)\` when possible, otherwise **None** (catch the ValueError — don't let it crash).

~~~python
safe_int("42")   -> 42
safe_int("-7")   -> -7
safe_int("oops") -> None
safe_int("3.5")  -> None
~~~
`,
        starter: `def safe_int(s):
    # TODO: try to convert; return None on failure
    pass
`,
        solution: `def safe_int(s):
    try:
        return int(s)
    except ValueError:
        return None
`,
        tests: [
          { name: "valid integers convert", code: `assert safe_int("42")==42 and safe_int("-7")==-7` },
          { name: "garbage -> None", code: `assert safe_int("oops") is None` },
          { name: "non-integer text -> None", code: `assert safe_int("3.5") is None and safe_int("") is None` },
        ],
        hint: `Wrap int(s) in try/except ValueError; return None in the except block.`,
        lore: "Garbage in, None out. The gate holds.",
      },
      {
        id: "exc-fuel",
        title: "FUEL GUARD",
        kind: "function",
        difficulty: 2,
        xp: 170,
        brief: "Reject impossible fuel readings.",
        prompt: `
Define **set_fuel(level)**:
- if \`level\` is between **0 and 100** (inclusive), **return** it
- otherwise **raise ValueError**

~~~python
set_fuel(50)  -> 50
set_fuel(150) -> raises ValueError
~~~
`,
        starter: `def set_fuel(level):
    # TODO: raise ValueError if out of 0..100, else return level
    pass
`,
        solution: `def set_fuel(level):
    if level < 0 or level > 100:
        raise ValueError("out of range")
    return level
`,
        tests: [
          { name: "accepts the valid range", code: `assert set_fuel(50)==50 and set_fuel(0)==0 and set_fuel(100)==100` },
          { name: "too high raises ValueError", code: `raised=False
try:
    set_fuel(150)
except ValueError:
    raised=True
assert raised, "set_fuel(150) must raise ValueError"` },
          { name: "negative raises ValueError", code: `raised=False
try:
    set_fuel(-1)
except ValueError:
    raised=True
assert raised, "set_fuel(-1) must raise ValueError"` },
        ],
        hint: `if level < 0 or level > 100: raise ValueError("out of range"); else return level.`,
        lore: "Refueling denied. Check your gauge, cowboy.",
      },
      {
        id: "exc-divide",
        title: "REACTOR DIVIDE",
        kind: "function",
        difficulty: 2,
        xp: 160,
        brief: "Handle the divide-by-zero singularity.",
        prompt: `
Define **safe_divide(a, b)** that **returns** \`a / b\`, but returns the string \`"DIV/0"\` if \`b\` is zero (catch ZeroDivisionError).

~~~python
safe_divide(10, 2) -> 5.0
safe_divide(7, 0)  -> "DIV/0"
~~~
`,
        starter: `def safe_divide(a, b):
    # TODO: divide, but guard against b == 0
    pass
`,
        solution: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "DIV/0"
`,
        tests: [
          { name: "normal division", code: `assert safe_divide(10,2)==5.0 and safe_divide(-9,3)==-3.0` },
          { name: "divide by zero -> DIV/0", code: `assert safe_divide(7,0)=="DIV/0"` },
        ],
        hint: `try: return a / b  except ZeroDivisionError: return "DIV/0".`,
        lore: "Singularity contained. Barely.",
      },
    ],
  },

  /* ===================== SECTOR 0x0B ===================== */
  {
    id: "m11-regex",
    code: "0x0B",
    title: "REGULAR EXPRESSIONS",
    subtitle: "pattern matching with the re module",
    theory: `
## Patterns
A **regular expression** describes a text pattern. Import the **re** module and write patterns as **raw strings** (\`r"..."\`) so backslashes stay literal.

~~~python
import re
re.fullmatch(r"\\d{4}", "2099")   # match: four digits
~~~

## Building blocks
- \`\\d\` digit · \`\\w\` word char · \`.\` any char
- \`[A-Z]\` a character class · \`{n}\` exactly n · \`{1,3}\` 1 to 3
- \`+\` one-or-more · \`*\` zero-or-more · \`?\` optional

## search vs fullmatch
- **re.fullmatch(pat, s)** — the **whole** string must match (great for validation)
- **re.search(pat, s)** — find the pattern **anywhere**

Both return a match object (truthy) or **None**.

## Capturing groups
Parentheses capture part of the match; pull it out with **.group(1)**.

~~~python
m = re.search(r"v=([\\w-]{11})", url)
vid = m.group(1) if m else None
~~~

## findall — every match at once
**re.findall(pat, s)** returns a **list** of all matches (no None to handle — an empty list means none).

~~~python
re.findall(r"\\d+", "a7 b42")   # ["7", "42"]  -> len() counts them
~~~

If the pattern has **groups**, findall returns a list of the **groups** (a tuple per match when there are two or more):

~~~python
re.findall(r"(\\w+)=(\\w+)", "hp=400 ap=120")
# [("hp", "400"), ("ap", "120")]
~~~

## sub and split
- **re.sub(pat, repl, s)** — replace every match with the **repl** string.
- **re.split(pat, s)** — split on a pattern (a character class like **[,;/]** matches any one separator).

~~~python
re.sub(r"\\d", "#", "CASE 0451")        # "CASE ####"
re.split(r"\\s*[,;/]\\s*", "a, b;c")     # ["a", "b", "c"]
~~~

> INTEL — To validate, prefer \`fullmatch\`. To extract one, use \`search\` with a group; to extract many, use \`findall\`. Always handle the \`None\` (no-match) case for search/fullmatch.
`,
    exercises: [
      {
        id: "regex-ip",
        title: "TRACE THE IP",
        kind: "function",
        difficulty: 2,
        xp: 170,
        brief: "Validate a four-octet address.",
        prompt: `
Define **is_ipv4(s)** that **returns True** if \`s\` looks like an IPv4 address — **four groups of 1–3 digits separated by dots** — else **False**. (Don't worry about the 0–255 range, just the shape.)

~~~python
is_ipv4("127.0.0.1") -> True
is_ipv4("10.0.0")    -> False
is_ipv4("a.b.c.d")   -> False
~~~

Remember to \`import re\`.
`,
        starter: `import re

def is_ipv4(s):
    # TODO: fullmatch four dot-separated groups of 1-3 digits
    pass
`,
        solution: `import re

def is_ipv4(s):
    return re.fullmatch(r"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", s) is not None
`,
        tests: [
          { name: "valid shape -> True", code: `assert is_ipv4("127.0.0.1") is True and is_ipv4("8.8.8.8") is True` },
          { name: "shape only (range ignored)", code: `assert is_ipv4("999.1.1.1") is True` },
          { name: "malformed -> False", code: `assert is_ipv4("10.0.0") is False and is_ipv4("a.b.c.d") is False` },
        ],
        hint: `Pattern: r"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}". Escape the dots. Return whether fullmatch is not None.`,
        lore: "Trace route initiated. They're at node 0x7F.",
      },
      {
        id: "regex-stream",
        title: "EXTRACT THE STREAM",
        kind: "function",
        difficulty: 3,
        xp: 190,
        brief: "Rip the video ID from a lo-fi stream URL.",
        prompt: `
A YouTube URL contains \`v=\` followed by an **11-character** id (letters, digits, \`_\`, \`-\`). Define **youtube_id(url)** that **returns** that id, or **None** if there isn't one. Use a capturing group.

~~~python
youtube_id("https://youtube.com/watch?v=jfKfPfyJRdk") -> "jfKfPfyJRdk"
youtube_id("https://example.com")                     -> None
~~~
`,
        starter: `import re

def youtube_id(url):
    # TODO: search for v=(<11 id chars>) and return the group, or None
    pass
`,
        solution: `import re

def youtube_id(url):
    m = re.search(r"v=([A-Za-z0-9_-]{11})", url)
    return m.group(1) if m else None
`,
        tests: [
          { name: "extracts the id", code: `assert youtube_id("https://www.youtube.com/watch?v=jfKfPfyJRdk")=="jfKfPfyJRdk"` },
          { name: "stops at extra params", code: `assert youtube_id("https://youtube.com/watch?v=DWcJFNfaw9c&t=3")=="DWcJFNfaw9c"` },
          { name: "no id -> None", code: `assert youtube_id("https://example.com") is None` },
        ],
        hint: `re.search(r"v=([A-Za-z0-9_-]{11})", url); if it matched, return m.group(1), else None.`,
        lore: "lofi hip hop radio - beats to hack/relax to.",
      },
      {
        id: "regex-callsign",
        title: "SECTION 9 CALLSIGN",
        kind: "function",
        difficulty: 2,
        xp: 170,
        brief: "Verify an operative's callsign format.",
        prompt: `
A valid callsign is **two uppercase letters**, a **hyphen**, then **exactly four digits** — e.g. \`GS-0009\`. Define **valid_callsign(s)** returning **True**/**False** using fullmatch.

~~~python
valid_callsign("GS-0009") -> True
valid_callsign("gs-0009") -> False
valid_callsign("ABC-0009")-> False
~~~
`,
        starter: `import re

def valid_callsign(s):
    # TODO: fullmatch [A-Z]{2}-\\d{4}
    pass
`,
        solution: `import re

def valid_callsign(s):
    return re.fullmatch(r"[A-Z]{2}-\\d{4}", s) is not None
`,
        tests: [
          { name: "correct format -> True", code: `assert valid_callsign("GS-0009") is True and valid_callsign("MK-1234") is True` },
          { name: "lowercase rejected", code: `assert valid_callsign("gs-0009") is False` },
          { name: "wrong lengths rejected", code: `assert valid_callsign("ABC-0009") is False and valid_callsign("GS-99") is False` },
        ],
        hint: `Pattern r"[A-Z]{2}-\\d{4}" with fullmatch enforces the whole shape.`,
        lore: "The net is vast and infinite. — Major Kusanagi",
      },
    ],
  },

  /* ===================== SECTOR 0x0C ===================== */
  {
    id: "m12-oop",
    code: "0x0C",
    title: "OBJECT-ORIENTED PROGRAMMING",
    subtitle: "classes · __init__ · methods · inheritance",
    theory: `
## Classes
A **class** is a blueprint; an **object** is an instance built from it. **__init__** is the constructor — it sets up each new instance. **self** is the instance itself.

~~~python
class Mech:
    def __init__(self, name, hp):
        self.name = name      # attribute
        self.hp = hp

    def damage(self, amount):  # method
        self.hp = max(0, self.hp - amount)
        return self.hp

unit = Mech("Unit-01", 400)
unit.damage(150)               # 250
~~~

## __str__
Define **__str__** to control how an object prints.

~~~python
class Target:
    def __init__(self, name, reward):
        self.name, self.reward = name, reward
    def __str__(self):
        return f"{self.name}: {self.reward} woolongs"
~~~

## __eq__
By default two distinct objects are **never** equal. Define **__eq__(self, other)** to compare by **value** — Python calls it for the **==** operator. It must **return** a bool.

~~~python
class Coord:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

Coord(3, 4) == Coord(3, 4)   # True
~~~

## Class variables
An attribute set on **self** belongs to **one instance**. An attribute defined **at class level** is **shared by all** instances — handy for a counter across every object.

~~~python
class Drone:
    count = 0                  # shared by all Drones
    def __init__(self, tag):
        self.tag = tag
        Drone.count += 1       # bump the shared tally
~~~

## Inheritance
A subclass **inherits** attributes and methods from a base class and can **override** them.

~~~python
class Replicant(Android):
    def greet(self):
        return "More human than human."
~~~

## super()
To **extend** a parent's method instead of replacing it, call **super()**. A common case: a subclass **__init__** runs the parent's setup, then adds its own.

~~~python
class Mecha(Robot):
    def __init__(self, name, pilot):
        super().__init__(name)   # run Robot's __init__
        self.pilot = pilot
~~~

## Polymorphism
Different classes can define the **same method name**. Call it on each object and Python dispatches to the right override automatically — no type checks needed.

~~~python
[s.tone() for s in synths]   # each synth answers in its own voice
~~~

> INTEL — If a subclass doesn't define \`__init__\`, it uses the parent's automatically. \`isinstance(obj, Cls)\` and \`issubclass(Sub, Base)\` test the family tree.
`,
    exercises: [
      {
        id: "oop-mech",
        title: "MECH PILOT",
        kind: "function",
        difficulty: 2,
        xp: 180,
        brief: "Model an EVA unit's hit points.",
        prompt: `
Define a class **Mech** with:
- \`__init__(self, name, hp)\` storing \`name\` and \`hp\`
- \`damage(self, amount)\` that subtracts \`amount\` from \`hp\` (never below **0**) and **returns** the new \`hp\`

~~~python
u = Mech("Unit-01", 400)
u.damage(150)   # 250, and u.hp == 250
u.damage(999)   # 0   (clamped)
~~~
`,
        starter: `class Mech:
    def __init__(self, name, hp):
        # TODO: store name and hp
        pass

    def damage(self, amount):
        # TODO: reduce hp (floor at 0) and return it
        pass
`,
        solution: `class Mech:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def damage(self, amount):
        self.hp = max(0, self.hp - amount)
        return self.hp
`,
        tests: [
          { name: "constructor stores attributes", code: `m=Mech("Unit-01",400)
assert m.name=="Unit-01" and m.hp==400` },
          { name: "damage reduces and returns hp", code: `m=Mech("Unit-01",400)
assert m.damage(150)==250 and m.hp==250` },
          { name: "hp clamps at 0", code: `m=Mech("Unit-00",100)
m.damage(999)
assert m.hp==0, "HP must floor at 0, not go negative."` },
        ],
        hint: `In damage: self.hp = max(0, self.hp - amount); return self.hp.`,
        lore: "Get in the robot, Shinji.",
      },
      {
        id: "oop-target",
        title: "BOUNTY TARGET",
        kind: "function",
        difficulty: 2,
        xp: 170,
        brief: "Give a target a printable rap sheet.",
        prompt: `
Define a class **Target** with \`__init__(self, name, reward)\` and a **__str__** method so that printing it yields:

~~~text
<name>: <reward> woolongs
~~~

~~~python
t = Target("Asimov", 2500000)
str(t)  # "Asimov: 2500000 woolongs"
~~~
`,
        starter: `class Target:
    def __init__(self, name, reward):
        # TODO: store name and reward
        pass

    def __str__(self):
        # TODO: return "<name>: <reward> woolongs"
        pass
`,
        solution: `class Target:
    def __init__(self, name, reward):
        self.name = name
        self.reward = reward

    def __str__(self):
        return f"{self.name}: {self.reward} woolongs"
`,
        tests: [
          { name: "str(target) formats the rap sheet", code: `t=Target("Asimov",2500000)
assert str(t)=="Asimov: 2500000 woolongs", repr(str(t))` },
          { name: "works in f-strings too", code: `t=Target("Teddy",1000000)
assert f"{t}"=="Teddy: 1000000 woolongs"` },
        ],
        hint: `__str__ must return a string: f"{self.name}: {self.reward} woolongs".`,
        lore: "Bang. — every bounty, eventually.",
      },
      {
        id: "oop-replicant",
        title: "REPLICANT < ANDROID",
        kind: "function",
        difficulty: 3,
        xp: 200,
        brief: "Inherit, then override.",
        prompt: `
Build two classes:

1. **Android** — \`__init__(self, model)\` stores \`model\`; method \`greet(self)\` returns \`"Unit online."\`
2. **Replicant(Android)** — inherits from Android, **overrides** \`greet(self)\` to return \`"More human than human."\`, and **reuses Android's __init__** (don't redefine it).

~~~python
a = Android("T-800");   a.greet()  # "Unit online."
r = Replicant("Nexus-6"); r.greet()  # "More human than human."
r.model                              # "Nexus-6"  (inherited)
~~~
`,
        starter: `class Android:
    def __init__(self, model):
        # TODO: store model
        pass
    def greet(self):
        # TODO: return "Unit online."
        pass

class Replicant(Android):
    # TODO: inherit __init__, override greet only
    pass
`,
        solution: `class Android:
    def __init__(self, model):
        self.model = model
    def greet(self):
        return "Unit online."

class Replicant(Android):
    def greet(self):
        return "More human than human."
`,
        tests: [
          { name: "Android base behavior", code: `a=Android("T-800")
assert a.greet()=="Unit online." and a.model=="T-800"` },
          { name: "Replicant overrides greet", code: `r=Replicant("Nexus-6")
assert r.greet()=="More human than human."` },
          { name: "Replicant inherits __init__", code: `r=Replicant("Nexus-6")
assert r.model=="Nexus-6", "Don't redefine __init__ — inherit it from Android."` },
          { name: "family tree intact", code: `assert issubclass(Replicant, Android) and isinstance(Replicant("x"), Android)` },
        ],
        hint: `Replicant only needs to define greet(). Leaving out __init__ means it inherits Android's automatically.`,
        lore: "All those moments will be lost in time, like tears in rain.",
      },
    ],
  },

  ],
});
