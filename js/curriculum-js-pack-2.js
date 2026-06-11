/* ============================================================
   curriculum-js-pack-2.js — JAVASCRIPT expansion pack 2.
   Appends 2 sectors (0x07..0x08) to the 'javascript' track:
     0x07 RECURSION        — base case + smaller subproblem
     0x08 ERROR HANDLING   — throw / try / catch, failing safe
   Verified by _verify/verify-js.js (solutions pass, starters fail).
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;

  t.modules.push(

    /* ---------- JS 0x07 ---------- */
    {
      id: "jsm07-recursion", code: "0x07", title: "RECURSION",
      subtitle: "a function that calls itself · base case · the descent",
      theory: J(
        "## The descent",
        "A **recursive** function calls itself on a **smaller** input until it hits a **base case** that stops the fall.",
        "~~~js",
        "function factorial(n) {",
        "  if (n <= 1) return 1;          // base case",
        "  return n * factorial(n - 1);   // smaller subproblem",
        "}",
        "~~~",
        "## Two rules, always",
        "1. A **base case** that returns without recursing (or you fall forever — stack overflow).",
        "2. Every recursive call must move **toward** that base case.",
        "## Trace it",
        "`factorial(3)` → `3 * factorial(2)` → `3 * 2 * factorial(1)` → `3 * 2 * 1` → **6**.",
        "> INTEL — Anything a loop can do, recursion can too. Pick whichever reads clearer."
      ),
      exercises: [
        {
          id: "js-factorial", title: "FACTORIAL CASCADE", kind: "function", difficulty: 2, xp: 160,
          brief: "Multiply the descent.",
          prompt: J(
            "Define **factorial(n)** recursively: `n!` = n × (n-1) × ... × 1, with `factorial(0) === 1`.",
            "~~~js",
            "factorial(5)  // 120",
            "~~~"
          ),
          starter: J("function factorial(n) {", "  // TODO: base case, then n * factorial(n - 1)", "}"),
          solution: J("function factorial(n) {", "  if (n <= 1) return 1;", "  return n * factorial(n - 1);", "}"),
          tests: [
            { name: "base cases", code: "assert(factorial(0) === 1 && factorial(1) === 1, '0! and 1! are 1');" },
            { name: "factorial(5) -> 120", code: "assertEqual(factorial(5), 120);" },
            { name: "factorial(7) -> 5040", code: "assertEqual(factorial(7), 5040);" },
          ],
          hint: "if (n <= 1) return 1; else return n * factorial(n - 1);",
          lore: "Each layer multiplies the one below.",
        },
        {
          id: "js-fib", title: "FIBONACCI GHOST", kind: "function", difficulty: 2, xp: 180,
          brief: "Summon the golden sequence.",
          prompt: J(
            "The sequence: 0, 1, 1, 2, 3, 5, 8, 13, ... — each term is the sum of the two before it.",
            "Define **fib(n)** returning the nth term (0-indexed): `fib(0) === 0`, `fib(1) === 1`.",
            "~~~js",
            "fib(7)  // 13",
            "~~~"
          ),
          starter: J("function fib(n) {", "  // TODO: two base cases, then fib(n-1) + fib(n-2)", "}"),
          solution: J("function fib(n) {", "  if (n < 2) return n;", "  return fib(n - 1) + fib(n - 2);", "}"),
          tests: [
            { name: "base cases", code: "assert(fib(0) === 0 && fib(1) === 1, 'fib(0)=0, fib(1)=1');" },
            { name: "fib(7) -> 13", code: "assertEqual(fib(7), 13);" },
            { name: "fib(10) -> 55", code: "assertEqual(fib(10), 55);" },
          ],
          hint: "if (n < 2) return n; else return fib(n-1) + fib(n-2);",
          lore: "The same spiral as a nautilus, a galaxy, a fern.",
        },
        {
          id: "js-power", title: "POWER LADDER", kind: "function", difficulty: 2, xp: 170,
          brief: "Raise the signal, rung by rung.",
          prompt: J(
            "Define **power(base, exp)** recursively (exp is an integer >= 0). `power(b, 0) === 1`.",
            "~~~js",
            "power(2, 10)  // 1024",
            "~~~"
          ),
          starter: J("function power(base, exp) {", "  // TODO: base case exp === 0, then base * power(base, exp - 1)", "}"),
          solution: J("function power(base, exp) {", "  if (exp === 0) return 1;", "  return base * power(base, exp - 1);", "}"),
          tests: [
            { name: "anything^0 -> 1", code: "assert(power(2, 0) === 1 && power(99, 0) === 1);" },
            { name: "2^10 -> 1024", code: "assertEqual(power(2, 10), 1024);" },
            { name: "3^4 -> 81", code: "assertEqual(power(3, 4), 81);" },
          ],
          hint: "if (exp === 0) return 1; else return base * power(base, exp - 1);",
          lore: "Each rung doubles the climb.",
        },
      ],
    },

    /* ---------- JS 0x08 ---------- */
    {
      id: "jsm08-errors", code: "0x08", title: "ERROR HANDLING",
      subtitle: "throw · try / catch · failing safe",
      theory: J(
        "## Throwing",
        "When input is invalid, **throw** an Error instead of returning a wrong answer that poisons everything downstream.",
        "~~~js",
        "function root(x) {",
        "  if (x < 0) throw new Error('negative');",
        "  return Math.sqrt(x);",
        "}",
        "~~~",
        "## Catching",
        "Wrap risky code in **try / catch** to recover instead of crashing.",
        "~~~js",
        "try {",
        "  risky();",
        "} catch (e) {",
        "  console.log('contained:', e.message);",
        "}",
        "~~~",
        "> INTEL — Throw early on bad input (a 'guard clause'); catch only where you can actually recover."
      ),
      exercises: [
        {
          id: "js-divide", title: "DIV/0 TRAP", kind: "function", difficulty: 2, xp: 160,
          brief: "Refuse the impossible.",
          prompt: J(
            "Define **safeDivide(a, b)** returning `a / b`, but **throw** an `Error` when `b === 0`.",
            "~~~js",
            "safeDivide(10, 2)  // 5",
            "safeDivide(1, 0)   // throws",
            "~~~"
          ),
          starter: J("function safeDivide(a, b) {", "  // TODO: throw on b === 0, else return a / b", "}"),
          solution: J(
            "function safeDivide(a, b) {",
            "  if (b === 0) throw new Error('division by zero');",
            "  return a / b;",
            "}"
          ),
          tests: [
            { name: "normal division", code: "assert(safeDivide(10, 2) === 5 && safeDivide(9, 3) === 3);" },
            { name: "throws on zero", code: J(
              "var threw = false;",
              "try { safeDivide(1, 0); } catch (e) { threw = true; }",
              "assert(threw, 'dividing by zero must throw');"
            ) },
          ],
          hint: "if (b === 0) throw new Error('...'); else return a / b;",
          lore: "Some operations the machine must simply refuse.",
        },
        {
          id: "js-parselevel", title: "PARSE OR PERISH", kind: "function", difficulty: 2, xp: 170,
          brief: "Trust no input.",
          prompt: J(
            "Define **parseLevel(s)** converting string `s` to a number. If it isn't a valid number, **throw** an `Error`.",
            "~~~js",
            "parseLevel('42')   // 42",
            "parseLevel('NaN!') // throws",
            "~~~"
          ),
          starter: J("function parseLevel(s) {", "  // TODO: Number(s); throw if Number.isNaN(...)", "}"),
          solution: J(
            "function parseLevel(s) {",
            "  const n = Number(s);",
            "  if (Number.isNaN(n)) throw new Error('not a number: ' + s);",
            "  return n;",
            "}"
          ),
          tests: [
            { name: "parses valid numbers", code: "assert(parseLevel('42') === 42 && parseLevel('-3') === -3);" },
            { name: "throws on garbage", code: J(
              "var threw = false;",
              "try { parseLevel('NaN!'); } catch (e) { threw = true; }",
              "assert(threw, 'invalid input must throw');"
            ) },
          ],
          hint: "const n = Number(s); if (Number.isNaN(n)) throw new Error(...); return n;",
          lore: "Garbage in, exception out.",
        },
        {
          id: "js-attempt", title: "FAIL-SAFE", kind: "function", difficulty: 3, xp: 200,
          brief: "Catch the fall, return the net.",
          prompt: J(
            "Define **attempt(fn, fallback)** that calls `fn()` and returns its result — but if `fn` **throws**,",
            "return `fallback` instead.",
            "~~~js",
            "attempt(() => 42, 0)            // 42",
            "attempt(() => { throw 1; }, 0)  // 0",
            "~~~"
          ),
          starter: J("function attempt(fn, fallback) {", "  // TODO: try fn(), catch -> fallback", "}"),
          solution: J(
            "function attempt(fn, fallback) {",
            "  try { return fn(); } catch (e) { return fallback; }",
            "}"
          ),
          tests: [
            { name: "returns fn result when ok", code: "assertEqual(attempt(function () { return 42; }, 0), 42);" },
            { name: "returns fallback when fn throws", code: "assertEqual(attempt(function () { throw new Error('x'); }, 7), 7);" },
            { name: "fallback can be anything", code: "assertEqual(attempt(function () { throw 1; }, 'SAFE'), 'SAFE');" },
          ],
          hint: "try { return fn(); } catch (e) { return fallback; }",
          lore: "Even Neo needed a soft landing.",
        },
      ],
    }

  );
})();
