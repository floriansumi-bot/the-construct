/* THE CONSTRUCT — Python exercise pack 2
   Adds to m03-func (FUNCTIONS & RETURN) and m04-ops (OPERATORS & MATH).
   All exercises self-verified with the live grader (BAD: 0). */
(function () {
  window.addExercises("python", "m03-func", [
    {
      id: "func-vector-split",
      title: "VECTOR SPLIT",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Unpack a nav vector into its axes.",
      prompt: `
The nav computer hands you a position as a 2-element list. Define **split_vector(v)** that **returns a tuple** of its two components: \`(x, y)\`.

~~~python
split_vector([3, 4])   ->  (3, 4)
split_vector([-7, 2])  ->  (-7, 2)
~~~

A function can hand back several values at once by returning a tuple.
`,
      starter: `def split_vector(v):
    # TODO: return (x, y)
    pass
`,
      solution: `def split_vector(v):
    return (v[0], v[1])
`,
      tests: [
        { name: "split_vector([3, 4]) -> (3, 4)", code: `assert split_vector([3, 4]) == (3, 4), repr(split_vector([3, 4]))` },
        { name: "works on negatives", code: `assert split_vector([-7, 2]) == (-7, 2), repr(split_vector([-7, 2]))` },
        { name: "returns a 2-tuple", code: `r = split_vector([0, 9])
assert isinstance(r, tuple) and r == (0, 9), repr(r)` },
      ],
      hint: `Index the list and pack the pieces: return (v[0], v[1]).`,
      lore: "Vector locked. Plotting jump to the Gate.",
    },
    {
      id: "func-hail",
      title: "OPEN HAILING FREQ",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Broadcast a greeting on a default channel.",
      prompt: `
Define **hail(name, channel="open")** that **returns** the string:

~~~text
Hailing <name> on the <channel> channel.
~~~

The **channel** parameter defaults to **open**, so callers can leave it out.

~~~python
hail("Nadia")            ->  Hailing Nadia on the open channel.
hail("Spike", "secure")  ->  Hailing Spike on the secure channel.
~~~
`,
      starter: `def hail(name, channel="open"):
    # TODO: return the hail string
    pass
`,
      solution: `def hail(name, channel="open"):
    return f"Hailing {name} on the {channel} channel."
`,
      tests: [
        { name: "default channel is 'open'", code: `assert hail("Nadia") == "Hailing Nadia on the open channel.", repr(hail("Nadia"))` },
        { name: "override the channel", code: `assert hail("Spike", "secure") == "Hailing Spike on the secure channel.", repr(hail("Spike", "secure"))` },
        { name: "default really kicks in", code: `assert hail("MAGI") == "Hailing MAGI on the open channel."` },
      ],
      hint: `Put the fallback in the signature: def hail(name, channel="open"). Build the line with an f-string.`,
      lore: "This is the Bebop, hailing all bounty heads.",
    },
    {
      id: "func-stack-power",
      title: "POWER STACK",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Sum however many power cells get wired in.",
      prompt: `
Engineers plug in any number of power cells. Define **stack_power(\\*cells)** that **returns** the total power of all the cells passed in. Use **\\*args** so it accepts any count — including none.

~~~python
stack_power(3, 5, 8)  ->  16
stack_power(42)       ->  42
stack_power()         ->  0
~~~
`,
      starter: `def stack_power(*cells):
    # TODO: return the total power of all cells
    pass
`,
      solution: `def stack_power(*cells):
    return sum(cells)
`,
      tests: [
        { name: "stack_power(3, 5, 8) -> 16", code: `assert stack_power(3, 5, 8) == 16, repr(stack_power(3, 5, 8))` },
        { name: "one cell", code: `assert stack_power(42) == 42, repr(stack_power(42))` },
        { name: "no cells -> 0", code: `assert stack_power() == 0, repr(stack_power())` },
        { name: "many cells", code: `assert stack_power(1, 1, 1, 1, 1, 1, 1) == 7` },
      ],
      hint: `The star collects every argument into a tuple named cells. Then return sum(cells).`,
      lore: "Stack the cells. Light the drive.",
    },
    {
      id: "func-warp-chain",
      title: "WARP CHAIN",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "One function feeds another.",
      prompt: `
Define **two** functions:
- **charge(power)** returns \`power\` tripled.
- **warp(power)** calls **charge(power)**, then **returns** that result plus 1.

\`warp\` must reuse \`charge\` — do not re-compute the math by hand.

~~~python
charge(4)  ->  12
warp(4)    ->  13   (12 + 1)
~~~
`,
      starter: `def charge(power):
    # TODO: return power tripled
    pass

def warp(power):
    # TODO: call charge(power), then add 1 to its result
    pass
`,
      solution: `def charge(power):
    return power * 3

def warp(power):
    return charge(power) + 1
`,
      tests: [
        { name: "charge(4) -> 12", code: `assert charge(4) == 12, repr(charge(4))` },
        { name: "warp(4) -> 13", code: `assert warp(4) == 13, repr(warp(4))` },
        { name: "warp builds on charge", code: `assert warp(10) == 31 and warp(0) == 1, repr((warp(10), warp(0)))` },
      ],
      hint: `Inside warp, call the other function: return charge(power) + 1.`,
      lore: "Charge the coils, then punch it. Functions calling functions — turtles all the way down.",
    },
    {
      id: "func-apply-twice",
      title: "DOUBLE TAP",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Take a function as input and run it twice.",
      prompt: `
A function can be passed around like any other value. Define **apply_twice(fn, value)** that calls **fn** on **value**, then calls **fn** again on that result, and **returns** the final output.

~~~python
apply_twice(lambda x: x * 2, 5)  ->  20   (5 -> 10 -> 20)
apply_twice(lambda x: x + 1, 0)  ->  2    (0 -> 1 -> 2)
~~~

\`fn\` is a parameter that happens to be callable.
`,
      starter: `def apply_twice(fn, value):
    # TODO: call fn on value, then call fn on that result
    pass
`,
      solution: `def apply_twice(fn, value):
    return fn(fn(value))
`,
      tests: [
        { name: "apply_twice doubling 5 -> 20", code: `assert apply_twice(lambda x: x * 2, 5) == 20, repr(apply_twice(lambda x: x * 2, 5))` },
        { name: "apply_twice +1 on 0 -> 2", code: `assert apply_twice(lambda x: x + 1, 0) == 2, repr(apply_twice(lambda x: x + 1, 0))` },
        { name: "works with a named function", code: `def neg(n):
    return -n
assert apply_twice(neg, 9) == 9, repr(apply_twice(neg, 9))` },
        { name: "actually calls fn twice", code: `calls = []
def rec(x):
    calls.append(x)
    return x + 10
apply_twice(rec, 1)
assert calls == [1, 11], repr(calls)` },
      ],
      hint: `Feed the first result straight back in: return fn(fn(value)).`,
      lore: "A program that eats programs. The Wired runs deep.",
    },
    {
      id: "func-recurse-countdown",
      title: "RECURSIVE COUNTDOWN",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Launch sequence — by calling yourself.",
      prompt: `
Define **countdown(n)** that **returns a list** \`[n, n-1, ..., 1, 0]\` using **recursion** (the function must call itself). No \`for\` or \`while\` loops.

~~~python
countdown(3)  ->  [3, 2, 1, 0]
countdown(0)  ->  [0]
~~~

Base case: when \`n\` is 0, return \`[0]\`. Otherwise return \`[n]\` joined with \`countdown(n - 1)\`.
`,
      starter: `def countdown(n):
    # TODO: return a list [n, n-1, ..., 1, 0] using recursion
    pass
`,
      solution: `def countdown(n):
    if n < 0:
        return []
    if n == 0:
        return [0]
    return [n] + countdown(n - 1)
`,
      tests: [
        { name: "countdown(3) -> [3, 2, 1, 0]", code: `assert countdown(3) == [3, 2, 1, 0], repr(countdown(3))` },
        { name: "countdown(0) -> [0]", code: `assert countdown(0) == [0], repr(countdown(0))` },
        { name: "countdown(5) length 6", code: `r = countdown(5)
assert r == [5, 4, 3, 2, 1, 0], repr(r)` },
        { name: "no loop keywords (recursion)", code: `assert "for " not in _src and "while " not in _src, "Solve it with recursion, not a loop."` },
      ],
      hint: `Stop at the base case (n == 0 -> [0]), otherwise return [n] + countdown(n - 1).`,
      lore: "Three… two… one… each call peels off one number before liftoff.",
    },
  ]);

  window.addExercises("python", "m04-ops", [
    {
      id: "ops-uptime",
      title: "SYSTEM UPTIME",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Convert raw seconds into h : m : s.",
      prompt: `
The core reports uptime as a single count of seconds. Define **uptime(total)** that **returns a tuple** \`(hours, minutes, seconds)\` using **//** and **%**.

~~~python
uptime(3661)  ->  (1, 1, 1)
uptime(7200)  ->  (2, 0, 0)
uptime(59)    ->  (0, 0, 59)
~~~

Hours = total // 3600. The leftover seconds split into minutes (// 60) and seconds (% 60). Hours can exceed 24.
`,
      starter: `def uptime(total):
    # TODO: return (hours, minutes, seconds)
    pass
`,
      solution: `def uptime(total):
    hours = total // 3600
    minutes = (total % 3600) // 60
    seconds = total % 60
    return (hours, minutes, seconds)
`,
      tests: [
        { name: "3661 -> (1, 1, 1)", code: `assert uptime(3661) == (1, 1, 1), repr(uptime(3661))` },
        { name: "exactly 2 hours", code: `assert uptime(7200) == (2, 0, 0), repr(uptime(7200))` },
        { name: "under a minute", code: `assert uptime(59) == (0, 0, 59), repr(uptime(59))` },
        { name: "90061 -> (25, 1, 1)", code: `assert uptime(90061) == (25, 1, 1), repr(uptime(90061))` },
      ],
      hint: `hours = total // 3600; minutes = (total % 3600) // 60; seconds = total % 60.`,
      lore: "MAGI has been awake for a very, very long time.",
    },
    {
      id: "ops-calibrate",
      title: "SENSOR CALIBRATE",
      kind: "function",
      difficulty: 1,
      xp: 130,
      brief: "Clean up a noisy reading.",
      prompt: `
Sensor readings come in noisy and sometimes negative. Define **calibrate(reading, places)** that **returns** the **absolute value** of \`reading\`, **rounded** to \`places\` decimal places.

~~~python
calibrate(-3.14159, 2)  ->  3.14
calibrate(-9.0, 1)      ->  9.0
~~~

Use **abs()** to drop the sign and **round(value, places)** to trim the decimals.
`,
      starter: `def calibrate(reading, places):
    # TODO: return the absolute value of reading, rounded to 'places' decimals
    pass
`,
      solution: `def calibrate(reading, places):
    return round(abs(reading), places)
`,
      tests: [
        { name: "calibrate(-3.14159, 2) -> 3.14", code: `assert calibrate(-3.14159, 2) == 3.14, repr(calibrate(-3.14159, 2))` },
        { name: "already positive stays positive", code: `assert calibrate(2.71828, 2) == 2.72, repr(calibrate(2.71828, 2))` },
        { name: "abs applied", code: `assert calibrate(-9.0, 1) == 9.0, repr(calibrate(-9.0, 1))` },
        { name: "rounds to 3 places", code: `assert calibrate(-0.123456, 3) == 0.123, repr(calibrate(-0.123456, 3))` },
      ],
      hint: `Nest the calls: return round(abs(reading), places).`,
      lore: "Strip the noise. The signal was always there.",
    },
    {
      id: "ops-hypotenuse",
      title: "HYPOTENUSE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Distance to the contact via Pythagoras.",
      prompt: `
A blip sits \`a\` units east and \`b\` units north. Define **hypotenuse(a, b)** that **returns** the straight-line distance: the square root of \`a*a + b*b\`.

There is no sqrt operator — raise to the power **0.5** with **\\*\\***:

~~~python
hypotenuse(3, 4)   ->  5.0
hypotenuse(5, 12)  ->  13.0
~~~
`,
      starter: `def hypotenuse(a, b):
    # TODO: return sqrt(a*a + b*b) using ** 0.5
    pass
`,
      solution: `def hypotenuse(a, b):
    return (a ** 2 + b ** 2) ** 0.5
`,
      tests: [
        { name: "3, 4 -> 5.0", code: `assert hypotenuse(3, 4) == 5.0, repr(hypotenuse(3, 4))` },
        { name: "5, 12 -> 13.0", code: `assert hypotenuse(5, 12) == 13.0, repr(hypotenuse(5, 12))` },
        { name: "8, 15 -> 17.0", code: `assert hypotenuse(8, 15) == 17.0, repr(hypotenuse(8, 15))` },
        { name: "returns a float", code: `r = hypotenuse(0, 9)
assert isinstance(r, float) and r == 9.0, repr(r)` },
      ],
      hint: `Square root is the 0.5 power: return (a ** 2 + b ** 2) ** 0.5.`,
      lore: "Bearing locked. Closing distance on the target.",
    },
    {
      id: "ops-in-band",
      title: "AUDIBLE BAND",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Is this frequency something humans can hear?",
      prompt: `
Human hearing spans roughly 20 Hz to 20000 Hz, inclusive. Define **in_band(freq)** that **returns a boolean**: \`True\` if \`20 <= freq <= 20000\`, else \`False\`.

Python lets you chain the comparison directly:

~~~python
in_band(1000)   ->  True
in_band(20)     ->  True
in_band(19)     ->  False
in_band(20001)  ->  False
~~~
`,
      starter: `def in_band(freq):
    # TODO: return True if 20 <= freq <= 20000, else False
    pass
`,
      solution: `def in_band(freq):
    return 20 <= freq <= 20000
`,
      tests: [
        { name: "1000 is in band", code: `assert in_band(1000) is True, repr(in_band(1000))` },
        { name: "edges are inclusive", code: `assert in_band(20) is True and in_band(20000) is True` },
        { name: "below and above -> False", code: `assert in_band(19) is False and in_band(20001) is False` },
        { name: "returns a real bool", code: `assert in_band(500) is True and in_band(0) is False` },
      ],
      hint: `Chain it in one expression: return 20 <= freq <= 20000.`,
      lore: "Daft Punk lives in that band. So do the whales.",
    },
    {
      id: "ops-clock-wrap",
      title: "CLOCK WRAP",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Time loop — roll the hour around 24.",
      prompt: `
Steins;Gate again. Define **clock_wrap(hour, jump)** that adds \`jump\` hours to a 24-hour clock \`hour\` and **returns** the resulting hour (0–23), wrapping past midnight with **%**.

~~~python
clock_wrap(23, 3)   ->  2    (23 + 3 = 26, wraps to 2)
clock_wrap(8, 5)    ->  13
clock_wrap(10, 24)  ->  10   (a full day later)
~~~
`,
      starter: `def clock_wrap(hour, jump):
    # TODO: return the 24-hour clock time after adding 'jump' hours
    pass
`,
      solution: `def clock_wrap(hour, jump):
    return (hour + jump) % 24
`,
      tests: [
        { name: "23 + 3 -> 2", code: `assert clock_wrap(23, 3) == 2, repr(clock_wrap(23, 3))` },
        { name: "no wrap needed", code: `assert clock_wrap(8, 5) == 13, repr(clock_wrap(8, 5))` },
        { name: "full day returns same hour", code: `assert clock_wrap(10, 24) == 10, repr(clock_wrap(10, 24))` },
        { name: "big jump", code: `assert clock_wrap(0, 49) == 1, repr(clock_wrap(0, 49))` },
      ],
      hint: `Add, then wrap into 0..23 with modulo: return (hour + jump) % 24.`,
      lore: "El Psy Kongroo. The world line shifts, the clock resets.",
    },
  ]);
})();
