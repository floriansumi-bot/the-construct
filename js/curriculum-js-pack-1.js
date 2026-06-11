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
        "## The for loop",
        "Run a block a fixed number of times. Three parts: init, condition, step.",
        "~~~js",
        "for (let i = 0; i < 3; i++) {",
        "  console.log(i);   // 0, 1, 2",
        "}",
        "~~~",
        "## while",
        "Loop while a condition holds — use it when you don't know the count up front.",
        "~~~js",
        "let n = 8;",
        "while (n > 1) { n = n / 2; }   // 8 -> 4 -> 2 -> 1",
        "~~~",
        "## for...of",
        "Walk the values of an array directly.",
        "~~~js",
        "let total = 0;",
        "for (const x of [10, 20, 12]) { total += x; }   // 42",
        "~~~",
        "## Building results",
        "Start with an empty array/accumulator and `push` or `+=` inside the loop.",
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
        "You can store a function in a variable, pass it as an argument, and **return** it from another function.",
        "## Closures",
        "A function remembers the variables alive where it was created — even after that outer call has returned.",
        "~~~js",
        "function makeAdder(step) {",
        "  return function (x) { return x + step; };  // 'step' stays captured",
        "}",
        "const add5 = makeAdder(5);",
        "add5(10);   // 15",
        "~~~",
        "## Private state",
        "Because the captured variable is invisible outside, closures give you private, persistent state.",
        "~~~js",
        "function tally() {",
        "  let n = 0;",
        "  return function () { n++; return n; };",
        "}",
        "~~~",
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
