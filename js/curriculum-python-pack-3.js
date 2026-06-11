/* ============================================================
   curriculum-python-pack-3.js — EXPANSION PACK 3
   Adds exercises to:
     • m05-cond  (CONDITIONALS)  — 5 new
     • m06-loops (LOOPS)         — 5 new
   Registered via window.addExercises (see tracks.js).
   ============================================================ */
(function () {
  window.addExercises("python", "m05-cond", [
    {
      id: "cond-polarity",
      title: "POLARITY CHECK",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Read the sign of a reactor flux value.",
      prompt: `
The hull sensor reports a flux value that can be positive, negative, or exactly zero. Define **sign(n)** that **returns**:
- \`1\` if n is **positive**
- \`-1\` if n is **negative**
- \`0\` if n is **zero**

~~~python
sign(42)   -> 1
sign(-7)   -> -1
sign(0)    -> 0
~~~
`,
      starter: `def sign(n):
    # TODO: return 1, -1, or 0 depending on n
    pass
`,
      solution: `def sign(n):
    if n > 0:
        return 1
    elif n < 0:
        return -1
    else:
        return 0
`,
      tests: [
        { name: "positive -> 1", code: `assert sign(42)==1 and sign(0.5)==1` },
        { name: "negative -> -1", code: `assert sign(-7)==-1 and sign(-0.001)==-1` },
        { name: "zero -> 0", code: `assert sign(0)==0` },
      ],
      hint: `Three branches: if n > 0 return 1; elif n < 0 return -1; else return 0. Don't forget the exact-zero case.`,
      lore: "Polarity reversed. The drift core hums in a minor key.",
    },
    {
      id: "cond-holo-ticket",
      title: "HOLO-ARCADE GATE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Price a ticket by age, then surcharge on weekends.",
      prompt: `
The neon arcade charges by age, with a weekend surcharge. Define **ticket_price(age, weekend)** that **returns** the price in credits.

Base price by age:
- under **6** → \`0\` (free)
- **6–17** → \`8\`
- **65 and over** → \`6\`
- everyone else (**18–64**) → \`12\`

Then: if **weekend** is True **and** the base price is greater than 0, add **3**. (Free toddlers stay free.)

~~~python
ticket_price(10, False) -> 8
ticket_price(10, True)  -> 11
ticket_price(3,  True)  -> 0
ticket_price(70, True)  -> 9
~~~
`,
      starter: `def ticket_price(age, weekend):
    # TODO: pick the base price by age, THEN apply the weekend surcharge
    pass
`,
      solution: `def ticket_price(age, weekend):
    if age < 6:
        price = 0
    elif age < 18:
        price = 8
    elif age >= 65:
        price = 6
    else:
        price = 12
    if weekend and price > 0:
        price += 3
    return price
`,
      tests: [
        { name: "toddler always free", code: `assert ticket_price(3, False)==0 and ticket_price(3, True)==0` },
        { name: "child weekday 8, weekend 11", code: `assert ticket_price(10, False)==8 and ticket_price(10, True)==11` },
        { name: "adult weekday 12, weekend 15", code: `assert ticket_price(30, False)==12 and ticket_price(30, True)==15` },
        { name: "senior weekday 6, weekend 9", code: `assert ticket_price(70, False)==6 and ticket_price(70, True)==9` },
      ],
      hint: `First compute the base price with an if/elif/else on age. Then, in a SEPARATE if, add 3 only when weekend and price > 0.`,
      lore: "Step inside. The light is cheaper before midnight.",
    },
    {
      id: "cond-bebop-helm",
      title: "BEBOP HELM",
      kind: "function",
      difficulty: 2,
      xp: 155,
      brief: "Route a helm command with match/case.",
      prompt: `
Spike barks orders at the ship's helm. Define **helm(cmd)** using a Python **match/case** statement to **return**:
- \`"warp"\` → \`"ENGAGED"\`
- \`"dock"\` → \`"DOCKING"\`
- \`"scan"\` → \`"SCANNING"\`
- \`"halt"\` **or** \`"stop"\` → \`"ALL STOP"\`
- anything else → \`"UNKNOWN COMMAND"\`

~~~python
helm("warp") -> "ENGAGED"
helm("stop") -> "ALL STOP"
helm("dance") -> "UNKNOWN COMMAND"
~~~

Use the wildcard pattern **case _:** for the fallback, and combine two patterns with **case "halt" | "stop":**.
`,
      starter: `def helm(cmd):
    # TODO: use match/case to map the command string
    pass
`,
      solution: `def helm(cmd):
    match cmd:
        case "warp":
            return "ENGAGED"
        case "dock":
            return "DOCKING"
        case "scan":
            return "SCANNING"
        case "halt" | "stop":
            return "ALL STOP"
        case _:
            return "UNKNOWN COMMAND"
`,
      tests: [
        { name: "warp -> ENGAGED", code: `assert helm("warp")=="ENGAGED"` },
        { name: "dock -> DOCKING", code: `assert helm("dock")=="DOCKING"` },
        { name: "scan -> SCANNING", code: `assert helm("scan")=="SCANNING"` },
        { name: "halt or stop -> ALL STOP", code: `assert helm("halt")=="ALL STOP" and helm("stop")=="ALL STOP"` },
        { name: "anything else -> UNKNOWN COMMAND", code: `assert helm("dance")=="UNKNOWN COMMAND" and helm("")=="UNKNOWN COMMAND"` },
      ],
      hint: `match cmd: then a case per command. Use case "halt" | "stop": for the two-word case and case _: for the catch-all at the end.`,
      lore: "Whatever happens, happens. Now set a heading.",
    },
    {
      id: "cond-jack-in",
      title: "JACK-IN PROTOCOL",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Decide if a netrunner may jack into the Net.",
      prompt: `
Section 9 only lets you dive the Net when **every** rule passes. Define **can_jack_in(level, online, banned)** that **returns** a boolean (True / False).

Allow the dive only when **all** of these hold:
- the deck is **online** (online is True), **and**
- the runner is **not banned** (banned is False), **and**
- clearance **level** is **3 or higher**

~~~python
can_jack_in(5, True, False) -> True
can_jack_in(5, False, False) -> False
can_jack_in(9, True, True)  -> False
can_jack_in(2, True, False) -> False
~~~

Combine the checks into a single boolean expression with **and** / **not**.
`,
      starter: `def can_jack_in(level, online, banned):
    # TODO: return True only if online AND not banned AND level >= 3
    pass
`,
      solution: `def can_jack_in(level, online, banned):
    return online and not banned and level >= 3
`,
      tests: [
        { name: "all good -> True", code: `assert can_jack_in(5, True, False) is True` },
        { name: "offline -> False", code: `assert can_jack_in(5, False, False) is False` },
        { name: "banned -> False", code: `assert can_jack_in(9, True, True) is False` },
        { name: "too low level -> False", code: `assert can_jack_in(2, True, False) is False` },
        { name: "exactly level 3 -> True", code: `assert can_jack_in(3, True, False) is True` },
      ],
      hint: `One line: return online and not banned and level >= 3. The 'and' chain is True only when all parts are True.`,
      lore: "The net is vast and infinite. Mind the ICE on the way in.",
    },
    {
      id: "cond-louder",
      title: "ELEVEN",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "One-line ternary: is the mix clipping?",
      prompt: `
The master bus meter reads in decibels relative to 0 dBFS. Anything above 0 is clipping. Define **louder(db)** as a **single-line ternary expression** that **returns**:
- \`"CLIPPING"\` when db is **greater than 0**
- \`"SAFE"\` otherwise (db **0 or below**)

~~~python
louder(3)  -> "CLIPPING"
louder(0)  -> "SAFE"
louder(-6) -> "SAFE"
~~~

Use Python's conditional expression form: **VALUE_IF_TRUE if CONDITION else VALUE_IF_FALSE**.
`,
      starter: `def louder(db):
    # TODO: ONE line, a ternary expression
    return ""
`,
      solution: `def louder(db):
    return "CLIPPING" if db > 0 else "SAFE"
`,
      tests: [
        { name: "above 0 -> CLIPPING", code: `assert louder(3)=="CLIPPING"` },
        { name: "exactly 0 -> SAFE", code: `assert louder(0)=="SAFE"` },
        { name: "below 0 -> SAFE", code: `assert louder(-6)=="SAFE"` },
        { name: "written with if/else on one line", code: `assert "if" in _src and "else" in _src` },
      ],
      hint: `return "CLIPPING" if db > 0 else "SAFE". The whole thing is one expression — no separate if statement needed.`,
      lore: "These go to eleven. The needle pins and the room turns red.",
    },
  ]);

  window.addExercises("python", "m06-loops", [
    {
      id: "loops-vox-count",
      title: "VOX COUNTER",
      kind: "function",
      difficulty: 1,
      xp: 125,
      brief: "Count the vowels in a transmission.",
      prompt: `
A garbled vox transmission comes through. Define **count_vowels(s)** that **returns** how many vowels (**a e i o u**, any case) the string contains. Use a **loop**.

~~~python
count_vowels("cowboy")     -> 2
count_vowels("EVANGELION") -> 5
count_vowels("rhythm")     -> 0
~~~
`,
      starter: `def count_vowels(s):
    n = 0
    # TODO: loop over each character, count the vowels (any case)
    return n
`,
      solution: `def count_vowels(s):
    n = 0
    for ch in s:
        if ch.lower() in "aeiou":
            n += 1
    return n
`,
      tests: [
        { name: "counts lowercase", code: `assert count_vowels("cowboy")==2, repr(count_vowels("cowboy"))` },
        { name: "case insensitive", code: `assert count_vowels("EVANGELION")==5, repr(count_vowels("EVANGELION"))` },
        { name: "no vowels -> 0", code: `assert count_vowels("rhythm")==0` },
        { name: "empty -> 0", code: `assert count_vowels("")==0` },
      ],
      hint: `for ch in s: if ch.lower() in "aeiou": n += 1. Lowercasing the char makes the test case-insensitive.`,
      lore: "Half static, half prayer. Count what survives the noise.",
    },
    {
      id: "loops-resonance",
      title: "RESONANCE CASCADE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Multiply a chain of frequencies together.",
      prompt: `
A resonance cascade multiplies every frequency in the chain. Define **resonance(freqs)** that **returns** the product of a list of numbers — using a **loop** and a running product.

Start the accumulator at **1** (the multiplicative identity), so an empty list returns 1.

~~~python
resonance([2, 3, 4]) -> 24
resonance([])        -> 1
resonance([9, 0, 9]) -> 0
~~~
`,
      starter: `def resonance(freqs):
    product = 1
    # TODO: multiply every number in freqs into product
    return product
`,
      solution: `def resonance(freqs):
    product = 1
    for f in freqs:
        product *= f
    return product
`,
      tests: [
        { name: "multiplies a list", code: `assert resonance([2,3,4])==24 and resonance([5,5])==25` },
        { name: "empty -> 1 (identity)", code: `assert resonance([])==1` },
        { name: "a zero collapses it", code: `assert resonance([9,0,9])==0` },
        { name: "handles negatives", code: `assert resonance([-2,3])==-6` },
      ],
      hint: `Start product = 1 (NOT 0, or everything becomes 0). Then for f in freqs: product *= f.`,
      lore: "Unforeseen consequences ripple out from a single sour note.",
    },
    {
      id: "loops-overdrive",
      title: "OVERDRIVE CHARGE",
      kind: "function",
      difficulty: 2,
      xp: 155,
      brief: "Count charge pulses until the cell is ready.",
      prompt: `
Each pulse pumps **7** units into the overdrive cell. Define **charges_needed(target)** that **returns** how many pulses are needed for the running total to reach **at least** target. Use a **while** loop.

If target is **0 or below**, zero pulses are needed.

~~~python
charges_needed(0)  -> 0
charges_needed(7)  -> 1
charges_needed(20) -> 3   # 7, 14, 21
charges_needed(21) -> 3
~~~
`,
      starter: `def charges_needed(target):
    count = 0
    # TODO: while the total is below target, add 7 and count the pulse
    return count
`,
      solution: `def charges_needed(target):
    total = 0
    count = 0
    while total < target:
        total += 7
        count += 1
    return count
`,
      tests: [
        { name: "target 0 -> 0 charges", code: `assert charges_needed(0)==0` },
        { name: "target 7 -> 1 charge", code: `assert charges_needed(7)==1` },
        { name: "target 20 -> 3 charges", code: `assert charges_needed(20)==3, repr(charges_needed(20))` },
        { name: "target 21 -> 3 charges", code: `assert charges_needed(21)==3, repr(charges_needed(21))` },
      ],
      hint: `Keep a total and a count. while total < target: total += 7; count += 1. When the loop ends, total has crossed the threshold.`,
      lore: "Charge it. The capacitor whines higher with every pulse.",
    },
    {
      id: "loops-star-array",
      title: "STAR ARRAY",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Render a star triangle with nested loops.",
      prompt: `
Map the star array, one row at a time. Define **triangle(n)** that **returns** a string of **n** rows: row 1 has one star, row 2 has two, up to row n. Rows are separated by newlines (no trailing newline).

~~~python
triangle(3) -> the three lines:
*
**
***
~~~

triangle(1) is just \`"*"\`, and triangle(0) is the empty string \`""\`.

Use a loop for the rows and an inner loop (or string repetition) for the stars, then join the rows. Tip: **chr(10)** is the newline character, so \`chr(10).join(rows)\` glues the rows with line breaks.
`,
      starter: `def triangle(n):
    rows = []
    # TODO: build each row of stars, then join the rows with newlines
    return chr(10).join(rows)
`,
      solution: `def triangle(n):
    rows = []
    for i in range(1, n + 1):
        row = ""
        for _ in range(i):
            row += "*"
        rows.append(row)
    return chr(10).join(rows)
`,
      tests: [
        { name: "triangle(3)", code: `assert triangle(3)=="*"+chr(10)+"**"+chr(10)+"***", repr(triangle(3))` },
        { name: "triangle(1)", code: `assert triangle(1)=="*", repr(triangle(1))` },
        { name: "triangle(0) empty", code: `assert triangle(0)=="", repr(triangle(0))` },
        { name: "three rows for n=3", code: `assert len(triangle(3).splitlines())==3` },
        { name: "last line has n stars", code: `assert triangle(5).splitlines()[-1]=="*****"` },
      ],
      hint: `for i in range(1, n+1): build a row of i stars (an inner loop, or "*" * i), append it to a list, then return chr(10).join(rows).`,
      lore: "Each row a little brighter. The array reaches for orbit.",
    },
    {
      id: "loops-first-contact",
      title: "FIRST CONTACT",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Find the first anomalous reading, or report none.",
      prompt: `
Scan the readings left to right for the first anomaly (a value **below 0**). Define **first_negative(readings)** that **returns** the **index** of the first negative value. If there are none, **return** \`-1\`.

Stop as soon as you find one (return immediately — that is the loop-with-break idea).

~~~python
first_negative([4, 2, -1, 8, -3]) -> 2
first_negative([-5, 1, 2])        -> 0
first_negative([1, 2, 3])         -> -1
~~~
`,
      starter: `def first_negative(readings):
    # TODO: scan with an index; return the first index whose value < 0, else -1
    return -1
`,
      solution: `def first_negative(readings):
    for i in range(len(readings)):
        if readings[i] < 0:
            return i
    return -1
`,
      tests: [
        { name: "first negative index", code: `assert first_negative([4, 2, -1, 8, -3])==2, repr(first_negative([4, 2, -1, 8, -3]))` },
        { name: "negative at start", code: `assert first_negative([-5, 1, 2])==0` },
        { name: "none negative -> -1", code: `assert first_negative([1, 2, 3])==-1` },
        { name: "empty -> -1", code: `assert first_negative([])==-1` },
      ],
      hint: `Loop with for i in range(len(readings)). The moment readings[i] < 0, return i. If the loop finishes with no hit, return -1.`,
      lore: "Something out there answered back. Mark its bearing.",
    },
  ]);
})();
