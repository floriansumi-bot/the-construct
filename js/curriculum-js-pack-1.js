/* ============================================================
   curriculum-js-pack-1.js — JAVASCRIPT expansion pack 1.
   Appends 2 sectors (0x05..0x06) to the 'javascript' track:
     0x05 LOOPS & ITERATION       — for / while / for...of, ranges, accumulation
     0x06 CLOSURES & HIGHER-ORDER — functions that make/keep state and combine
   Same contract as curriculum-js.js (authored with the J() line-joiner so
   backticks/${...} stay literal). Test helpers: assert, assertEqual (deep),
   assertThrows, eq, show, stdout().
   PENDING: verify with _verify/verify-js.js on the real engine before shipping.
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;

  t.modules.push(

    /* ---------- JS 0x05 ---------- */
    {
      id: "jsm05-loops", code: "0x05", title: "LOOPS & ITERATION",
      subtitle: "for · while · for...of · ranges · accumulation",
      theory: J(
        "A **loop** runs the same block of code over and over. Instead of copy-pasting a line 100 times, you write it once and let the machine repeat it. Loops are how you process every item in a list, count things up, or keep going until a goal is hit.",
        "## The for loop",
        "Use `for` when you know **how many times** to repeat (or have a clear start and end). It packs three controls into one line: `init` (set up a counter), `condition` (keep going while this is true), `step` (change the counter each pass).",
        "~~~js",
        "for (let i = 0; i < 3; i++) {",
        "  console.log(i);   // prints 0, then 1, then 2",
        "}",
        "~~~",
        "Read it as: start `i` at 0, run while `i < 3`, add 1 after each pass. It stops at 2 because `3 < 3` is false.",
        "> WARNING — Off-by-one bugs are the classic trap. `i < 3` runs 3 times (0,1,2); `i <= 3` runs 4 times (0,1,2,3). Pick `<` or `<=` deliberately.",
        "## while",
        "Use `while` when you **don't know the count up front** — just a condition to keep looping on. It checks the condition, runs the block, then checks again.",
        "~~~js",
        "let n = 8;",
        "while (n > 1) { n = n / 2; }   // 8 -> 4 -> 2 -> 1",
        "~~~",
        "> WARNING — If nothing inside the loop ever makes the condition false, you get an **infinite loop** that freezes the program. Always change a variable that moves you toward the exit (here, `n` shrinks each pass).",
        "## for...of",
        "When you just want each **value** in an array, `for...of` hands them to you one at a time — no counter, no index, no off-by-one risk.",
        "~~~js",
        "let total = 0;",
        "for (const x of [10, 20, 12]) { total += x; }   // total becomes 42",
        "~~~",
        "## Building results",
        "Loops shine at **accumulation**: start with an empty container, then add to it each pass. Use an array with `.push(item)` to collect values, or a number with `+= x` to keep a running sum.",
        "~~~js",
        "const out = [];",
        "for (let i = 1; i <= 3; i++) { out.push(i * i); }   // [1, 4, 9]",
        "~~~",
        "> WARNING — Declare the accumulator **outside** the loop. Put `const out = []` inside and you wipe it clean every pass, ending with just the last item.",
        "## break & continue",
        "Two escape hatches: `break` quits the loop entirely (stop searching once you've found it), and `continue` skips the rest of *this* pass and jumps to the next one.",
        "> INTEL — `break` bails out of a loop early; `continue` skips to the next turn."
      ),
      exercises: [
        {
          id: "js-countdown", title: "LAUNCH SEQUENCE", kind: "function", difficulty: 1, xp: 120,
          brief: "Spin up the ignition countdown.",
          prompt: J(
            "Define **countdown(n)** returning an **array** counting down from `n` to `1`.",
            "~~~js",
            "countdown(3)  // [3, 2, 1]",
            "countdown(0)  // []",
            "~~~"
          ),
          starter: J("function countdown(n) {", "  // TODO: loop from n down to 1, collect into an array", "}"),
          solution: J(
            "function countdown(n) {",
            "  const out = [];",
            "  for (let i = n; i >= 1; i--) { out.push(i); }",
            "  return out;",
            "}"
          ),
          tests: [
            { name: "counts down", code: "assertEqual(countdown(3), [3, 2, 1]);" },
            { name: "single step", code: "assertEqual(countdown(1), [1]);" },
            { name: "zero / negative -> empty", code: "assert(countdown(0).length === 0 && countdown(-5).length === 0, 'n < 1 should give []');" },
          ],
          hint: "for (let i = n; i >= 1; i--) out.push(i);",
          lore: "T-minus three... the Bebop breaks orbit.",
        },
        {
          id: "js-sumto", title: "REACTOR SUM", kind: "function", difficulty: 1, xp: 130,
          brief: "Tally the first n reactor cells.",
          prompt: J(
            "Define **sumTo(n)** returning `1 + 2 + ... + n`. Return **0** when `n < 1`.",
            "~~~js",
            "sumTo(5)  // 15",
            "~~~"
          ),
          starter: J("function sumTo(n) {", "  // TODO: accumulate 1..n with a loop", "}"),
          solution: J(
            "function sumTo(n) {",
            "  let total = 0;",
            "  for (let i = 1; i <= n; i++) { total += i; }",
            "  return total;",
            "}"
          ),
          tests: [
            { name: "sumTo(5) -> 15", code: "assertEqual(sumTo(5), 15);" },
            { name: "sumTo(1) -> 1", code: "assertEqual(sumTo(1), 1);" },
            { name: "n < 1 -> 0", code: "assert(sumTo(0) === 0 && sumTo(-3) === 0, 'no cells, no sum');" },
          ],
          hint: "Start total = 0, then total += i for i from 1 to n.",
          lore: "Every cell counts toward critical mass.",
        },
        {
          id: "js-hailstone", title: "HAILSTONE", kind: "function", difficulty: 2, xp: 170,
          brief: "Count the steps of the Collatz freefall.",
          prompt: J(
            "The Collatz rule: if `n` is even, halve it; if odd, do `3n + 1`. Repeat until `n` is 1.",
            "Define **hailstone(n)** returning the **number of steps** to reach 1 (assume n >= 1).",
            "~~~js",
            "hailstone(1)  // 0   (already there)",
            "hailstone(8)  // 3   (8 -> 4 -> 2 -> 1)",
            "~~~"
          ),
          starter: J("function hailstone(n) {", "  // TODO: loop until n === 1, counting steps", "}"),
          solution: J(
            "function hailstone(n) {",
            "  let steps = 0;",
            "  while (n !== 1) {",
            "    n = (n % 2 === 0) ? n / 2 : 3 * n + 1;",
            "    steps++;",
            "  }",
            "  return steps;",
            "}"
          ),
          tests: [
            { name: "already at 1", code: "assertEqual(hailstone(1), 0);" },
            { name: "power of two", code: "assertEqual(hailstone(8), 3);" },
            { name: "the classic 6", code: "assertEqual(hailstone(6), 8);" },
          ],
          hint: "while (n !== 1) { n = n % 2 === 0 ? n/2 : 3*n+1; steps++; }",
          lore: "It always falls to one. Nobody knows why.",
        },
      ],
    },

    /* ---------- JS 0x06 ---------- */
    {
      id: "jsm06-closures", code: "0x06", title: "CLOSURES & HIGHER-ORDER",
      subtitle: "functions that keep state · functions that make functions",
      theory: J(
        "## Functions are values",
        "In JavaScript a function is just another **value**, like a number or a string. That means you can store it in a variable, pass it into another function as an argument, and even **return** it from a function. A function that takes or returns other functions is called a **higher-order function** — it's the foundation for the rest of this sector.",
        "~~~js",
        "const shout = function (s) { return s.toUpperCase() + '!'; };",
        "const fns = [shout];        // stored in an array",
        "fns[0]('wake up');          // 'WAKE UP!'",
        "~~~",
        "## Closures",
        "When you define a function **inside** another function, the inner one remembers the variables that were alive where it was born — even after the outer function has finished and returned. That captured memory is a **closure**. It's why the returned function below still knows what `step` was.",
        "~~~js",
        "function makeAdder(step) {",
        "  return function (x) { return x + step; };  // 'step' stays captured",
        "}",
        "const add5 = makeAdder(5);",
        "add5(10);   // 15  — add5 still remembers step was 5",
        "~~~",
        "## Private state",
        "The captured variable can't be seen or touched from outside the function — there's no way to reach in and read `n` below. That makes closures perfect for **private, persistent state**: data that survives between calls but stays sealed off.",
        "~~~js",
        "function tally() {",
        "  let n = 0;                                  // private — only the inner fn sees it",
        "  return function () { n++; return n; };      // n lives on between calls: 1, 2, 3...",
        "}",
        "~~~",
        "> WARNING — Each call to the outer function makes a brand-new, separate capture. `const a = tally()` and `const b = tally()` each get their **own** `n`, so they count independently — `a` reaching 3 doesn't budge `b`. Beginners often expect them to share; they don't.",
        "> INTEL — Each call to the outer function makes a FRESH capture, so two counters don't share state."
      ),
      exercises: [
        {
          id: "js-counter", title: "GHOST COUNTER", kind: "function", difficulty: 2, xp: 170,
          brief: "Forge a counter with a private memory.",
          prompt: J(
            "Define **makeCounter()** that returns a **function**. Each call to that function returns the next",
            "integer, starting at **1**. Separate counters must be independent.",
            "~~~js",
            "const c = makeCounter();",
            "c();  // 1",
            "c();  // 2",
            "~~~"
          ),
          starter: J("function makeCounter() {", "  // TODO: return a function that counts 1, 2, 3, ...", "}"),
          solution: J(
            "function makeCounter() {",
            "  let n = 0;",
            "  return function () { n++; return n; };",
            "}"
          ),
          tests: [
            { name: "counts up from 1", code: J(
              "var c = makeCounter();",
              "assert(c() === 1 && c() === 2 && c() === 3, 'should yield 1, 2, 3');"
            ) },
            { name: "counters are independent", code: J(
              "var a = makeCounter(), b = makeCounter();",
              "a(); a();",
              "assert(a() === 3 && b() === 1, 'each counter keeps its own private state');"
            ) },
          ],
          hint: "Capture `let n = 0;` then return a function that does n++ and returns n.",
          lore: "A ghost in the shell, counting in the dark.",
        },
        {
          id: "js-multiplier", title: "GAIN FACTORY", kind: "function", difficulty: 1, xp: 150,
          brief: "Manufacture amplifiers on demand.",
          prompt: J(
            "Define **multiplier(factor)** that returns a function multiplying its input by `factor`.",
            "~~~js",
            "const double = multiplier(2);",
            "double(21);   // 42",
            "const triple = multiplier(3);",
            "triple(10);   // 30",
            "~~~"
          ),
          starter: J("function multiplier(factor) {", "  // TODO: return a function of x", "}"),
          solution: J("function multiplier(factor) {", "  return function (x) { return x * factor; };", "}"),
          tests: [
            { name: "doubler", code: J("var double = multiplier(2);", "assert(double(21) === 42 && double(0) === 0);") },
            { name: "tripler is separate", code: J("var triple = multiplier(3);", "assert(triple(10) === 30 && triple(-2) === -6);") },
          ],
          hint: "return (x) => x * factor; — factor stays captured.",
          lore: "Crank the gain, netrunner.",
        },
        {
          id: "js-compose", title: "SIGNAL CHAIN", kind: "function", difficulty: 3, xp: 200,
          brief: "Wire two transforms into one.",
          prompt: J(
            "Define **compose(f, g)** returning a new function that applies **g first, then f**:",
            "`compose(f, g)(x)` must equal `f(g(x))`.",
            "~~~js",
            "const inc = (x) => x + 1;",
            "const dbl = (x) => x * 2;",
            "compose(inc, dbl)(5);   // inc(dbl(5)) = 11",
            "~~~"
          ),
          starter: J("function compose(f, g) {", "  // TODO: return x => f(g(x))", "}"),
          solution: J("function compose(f, g) {", "  return function (x) { return f(g(x)); };", "}"),
          tests: [
            { name: "g first, then f", code: J(
              "var inc = function (x) { return x + 1; };",
              "var dbl = function (x) { return x * 2; };",
              "assertEqual(compose(inc, dbl)(5), 11);"
            ) },
            { name: "order matters", code: J(
              "var inc = function (x) { return x + 1; };",
              "var dbl = function (x) { return x * 2; };",
              "assertEqual(compose(dbl, inc)(5), 12);"
            ) },
            { name: "works with strings", code: J(
              "var bang = function (s) { return s + '!'; };",
              "var up = function (s) { return s.toUpperCase(); };",
              "assertEqual(compose(bang, up)('wired'), 'WIRED!');"
            ) },
          ],
          hint: "return (x) => f(g(x)); — inner runs first.",
          lore: "Patch the modular rack: oscillator into filter into the void.",
        },
      ],
    }

  );
})();
