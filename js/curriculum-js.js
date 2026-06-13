/* ============================================================
   curriculum-js.js — JAVASCRIPT track.
   Authored with the J() line-joiner (not template literals) so
   that backticks and ${...} in JS code stay literal & parse-safe.
   Test helpers available in every test: assert, assertEqual
   (deep), assertThrows, eq, show, stdout().
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };

  window.registerTrack({
    id: "javascript",
    name: "JAVASCRIPT",
    code: "JS",
    runtime: "javascript",
    ext: "js",
    prism: "javascript",
    accent: "#f7df1e",
    blurb: "The language of the web, run natively in a sandboxed Worker. Functions, arrays, objects, closures.",
    intro: "JavaScript runs in a sandboxed Web Worker right here — native speed, no install, infinite loops auto-halted. Read the brief, breach the nodes, bank XP.",
    modules: [

      /* ---------- JS 0x01 ---------- */
      {
        id: "jsm01-boot", code: "0x01", title: "BOOTLOADER",
        subtitle: "console.log · let/const · template literals · types",
        theory: J(
          "## Jacking in",
          "**console.log()** prints a value to the console — your window into what the code is doing. It's how you check your work and trace bugs, the JS twin of Python's `print()`.",
          "~~~js",
          "console.log('Wake up, Neo...');",
          "~~~",
          "> INTEL — Statements end in a semicolon `;`. JS often forgives a missing one, but adding them keeps the machine predictable.",
          "## Variables",
          "A variable is a named box that holds a value so you can reuse it. Declare with **let** when the value will change, or **const** when it must never be reassigned. Default to `const` — it stops you from clobbering data by accident.",
          "~~~js",
          "const codename = 'Lain';  // locked",
          "let clearance = 7;        // can change later",
          "clearance = 8;",
          "~~~",
          "> WARNING — Reassigning a `const` throws an error. Reach for `let` only when you truly need to overwrite the value.",
          "## Template literals",
          "A template literal is a string in backticks `` ` `` that can splice values straight in with `${...}`. Cleaner than gluing strings with `+`, and it handles numbers without manual conversion.",
          "~~~js",
          "const name = 'Faye';",
          "console.log(`${name} :: clearance L${clearance}`);",
          "~~~",
          "> WARNING — `${...}` only fires inside backticks. In ordinary quotes `'...'` it stays dead literal text.",
          "## Types & equality",
          "Every value has a type. **typeof x** tells you which one — 'string', 'number', 'boolean', 'object', 'function', or 'undefined' — handy when a value isn't behaving as expected.",
          "~~~js",
          "typeof 'Neo';   // 'string'",
          "typeof 42;      // 'number'",
          "~~~",
          "> WARNING — Compare with === (strict), never == . Loose == quietly converts types so `0 == ''` and `1 == true` come out true — ghosts in the machine. Strict === checks value AND type, no surprises."
        ),
        exercises: [
          {
            id: "js-wake", title: "WAKE UP", kind: "script", difficulty: 1, xp: 100,
            brief: "First contact. Log the signal.",
            prompt: J(
              "Log these **three lines, exactly**, in order, using `console.log`:",
              "~~~text",
              "Wake up, Neo...",
              "The Matrix has you...",
              "Follow the white rabbit.",
              "~~~"
            ),
            starter: J("// Use console.log() three times"),
            solution: J(
              "console.log('Wake up, Neo...');",
              "console.log('The Matrix has you...');",
              "console.log('Follow the white rabbit.');"
            ),
            tests: [
              { name: "the channel is not silent", code: "assert(stdout().trim().length > 0, 'Nothing logged — use console.log().');" },
              { name: "all three lines, in order", code: J(
                "var lines = stdout().trim().split('\\n').map(function (s) { return s.trim(); });",
                "assertEqual(lines, ['Wake up, Neo...','The Matrix has you...','Follow the white rabbit.'], 'Match the three lines exactly.');"
              ) },
            ],
            hint: "Three separate console.log() calls, punctuation and capitalization matched exactly.",
            lore: "The Matrix has you, Neo.",
          },
          {
            id: "js-amplify", title: "AMPLIFY", kind: "function", difficulty: 1, xp: 120,
            brief: "Boost a weak transmission.",
            prompt: J(
              "Define **amplify(signal)** that **returns** the signal at double amplitude (signal × 2).",
              "~~~js",
              "amplify(21)  // 42",
              "amplify(-3)  // -6",
              "~~~"
            ),
            starter: J("function amplify(signal) {", "  // TODO: return double the signal", "}"),
            solution: J("function amplify(signal) {", "  return signal * 2;", "}"),
            tests: [
              { name: "amplify(21) -> 42", code: "assertEqual(amplify(21), 42, 'amplify(21) should be 42');" },
              { name: "works across the range", code: "assert(amplify(5)===10 && amplify(0)===0 && amplify(-3)===-6, 'check 5, 0, -3');" },
            ],
            hint: "return signal * 2;",
            lore: "Crank the gain.",
          },
          {
            id: "js-boot", title: "AI BOOTUP", kind: "function", difficulty: 1, xp: 120,
            brief: "Bring a supercomputer online — with a template literal.",
            prompt: J(
              "Define **bootMessage(name)** returning the string:",
              "~~~text",
              "<name> online. All systems nominal.",
              "~~~",
              "Use a template literal."
            ),
            starter: J("function bootMessage(name) {", "  // TODO: return the boot string", "}"),
            solution: J("function bootMessage(name) {", "  return `${name} online. All systems nominal.`;", "}"),
            tests: [
              { name: "boots MAGI", code: "assertEqual(bootMessage('MAGI'), 'MAGI online. All systems nominal.');" },
              { name: "uses the argument", code: "assertEqual(bootMessage('Tachikoma'), 'Tachikoma online. All systems nominal.');" },
            ],
            hint: "return `${name} online. All systems nominal.`;",
            lore: "MAGI system online.",
          },
        ],
      },

      /* ---------- JS 0x02 ---------- */
      {
        id: "jsm02-logic", code: "0x02", title: "OPERATORS & LOGIC",
        subtitle: "math · % · === · && || ! · branching",
        theory: J(
          "## Arithmetic",
          "The usual math operators do exactly what you'd expect: `+ - * /`. Two extras earn their keep — **%** gives the remainder after division, and **\\*\\*** raises to a power. The remainder is the go-to even/odd test: `n % 2` is `0` for evens.",
          "~~~js",
          "17 % 5;   // 2  (remainder)",
          "2 ** 8;   // 256 (2 to the 8th)",
          "~~~",
          "> WARNING — `/` always gives a decimal: `7 / 2` is `3.5`, not `3`. JS has no separate integer division like Python's `//`.",
          "## Comparison & booleans",
          "A comparison asks a yes/no question and answers with a **boolean** — `true` or `false`. Use `=== !== < <= > >=`, then chain conditions with **&&** (AND — needs both), **||** (OR — needs either), and **!** (NOT — flips it).",
          "~~~js",
          "const ok = level >= 0 && level <= 100;  // true only if in range",
          "~~~",
          "> WARNING — `=` assigns a value, `===` compares. Writing `if (x = 5)` overwrites x instead of testing it — a classic one-character bug.",
          "## Branching",
          "**if / else if / else** lets your code choose a path based on a condition. Inside a function, a `return` in a branch hands back a value and exits immediately, so later branches never run.",
          "~~~js",
          "if (n % 15 === 0) return 'SYNCHRONIZED';",
          "else if (n % 3 === 0) return 'MELCHIOR';",
          "~~~",
          "> INTEL — Order matters: check the most specific condition first. Test divisible-by-15 before 3 or 5, or the broader rule grabs the match and the specific one never fires."
        ),
        exercises: [
          {
            id: "js-parity", title: "PARITY CHECK", kind: "function", difficulty: 1, xp: 120,
            brief: "Flag even-numbered packets.",
            prompt: J("Define **isEven(n)** returning a boolean — `true` if n is even, else `false`. Use `%` and `===`."),
            starter: J("function isEven(n) {", "  // TODO", "}"),
            solution: J("function isEven(n) {", "  return n % 2 === 0;", "}"),
            tests: [
              { name: "even -> true", code: "assert(isEven(4)===true && isEven(0)===true, 'evens are true');" },
              { name: "odd -> false", code: "assert(isEven(7)===false && isEven(-3)===false, 'odds are false');" },
            ],
            hint: "return n % 2 === 0;",
            lore: "Parity verified.",
          },
          {
            id: "js-clearance", title: "ACCESS TIERS", kind: "function", difficulty: 2, xp: 150,
            brief: "Map clearance levels to tiers.",
            prompt: J(
              "Define **clearance(level)** returning:",
              "- `< 1` → 'DENIED'",
              "- `1–2` → 'GUEST'",
              "- `3–4` → 'OPERATOR'",
              "- `5+` → 'ROOT'"
            ),
            starter: J("function clearance(level) {", "  // TODO", "}"),
            solution: J(
              "function clearance(level) {",
              "  if (level < 1) return 'DENIED';",
              "  if (level <= 2) return 'GUEST';",
              "  if (level <= 4) return 'OPERATOR';",
              "  return 'ROOT';",
              "}"
            ),
            tests: [
              { name: "below 1 -> DENIED", code: "assert(clearance(0)==='DENIED' && clearance(-4)==='DENIED');" },
              { name: "1-2 -> GUEST", code: "assert(clearance(1)==='GUEST' && clearance(2)==='GUEST');" },
              { name: "3-4 -> OPERATOR", code: "assert(clearance(3)==='OPERATOR' && clearance(4)==='OPERATOR');" },
              { name: "5+ -> ROOT", code: "assert(clearance(5)==='ROOT' && clearance(99)==='ROOT');" },
            ],
            hint: "Chain ifs with early returns, from lowest to highest.",
            lore: "Access is earned, netrunner.",
          },
          {
            id: "js-magi", title: "THE MAGI SYSTEM", kind: "function", difficulty: 2, xp: 160,
            brief: "FizzBuzz, in a plugsuit.",
            prompt: J(
              "Define **magi(n)** returning:",
              "- divisible by **15** → 'SYNCHRONIZED'",
              "- divisible by **3** → 'MELCHIOR'",
              "- divisible by **5** → 'BALTHASAR'",
              "- otherwise the number as a string, e.g. '7'"
            ),
            starter: J("function magi(n) {", "  // TODO: check 15 first", "}"),
            solution: J(
              "function magi(n) {",
              "  if (n % 15 === 0) return 'SYNCHRONIZED';",
              "  if (n % 3 === 0) return 'MELCHIOR';",
              "  if (n % 5 === 0) return 'BALTHASAR';",
              "  return String(n);",
              "}"
            ),
            tests: [
              { name: "multiples of 3 -> MELCHIOR", code: "assert(magi(3)==='MELCHIOR' && magi(9)==='MELCHIOR');" },
              { name: "multiples of 5 -> BALTHASAR", code: "assert(magi(5)==='BALTHASAR' && magi(20)==='BALTHASAR');" },
              { name: "multiples of 15 -> SYNCHRONIZED", code: "assert(magi(15)==='SYNCHRONIZED' && magi(30)==='SYNCHRONIZED');" },
              { name: "others -> number as string", code: "assert(magi(7)==='7' && magi(1)==='1');" },
            ],
            hint: "String(n) converts a number to its text form.",
            lore: "Pattern blue. The MAGI are unanimous.",
          },
        ],
      },

      /* ---------- JS 0x03 ---------- */
      {
        id: "jsm03-strings", code: "0x03", title: "STRINGS & ARRAYS",
        subtitle: "methods · split/join · map · filter",
        theory: J(
          "## Strings",
          "A string is text. Its methods don't change the original — they return a fresh string, because strings are **immutable**. Reach for `.toUpperCase()`, `.toLowerCase()`, `.includes(x)` (does it contain x?), `.split(sep)`, and `.slice(a,b)` (grab a chunk).",
          "~~~js",
          "const s = 'WIRED';",
          "s.toLowerCase();    // 'wired'",
          "s.includes('IR');   // true",
          "~~~",
          "> WARNING — `s.toLowerCase()` doesn't modify `s` — it hands back a new string. To keep it, save it: `s = s.toLowerCase()`.",
          "## Arrays",
          "An array is an ordered list of values. Instead of writing loops, transform it with three workhorses: **.map()** changes every item, **.filter()** keeps the items that pass a test, and **.reduce()** folds the whole list into one value. Each returns a NEW array (reduce returns one value), leaving the original intact.",
          "~~~js",
          "[1,2,3,4].filter(function (n) { return n % 2 === 0; });  // [2, 4]",
          "[1,2,3].map(function (n) { return n * 10; });            // [10, 20, 30]",
          "['a','b'].join('-');                                     // 'a-b'",
          "~~~",
          "> WARNING — The function inside `.map()`/`.filter()` must **return** something. Forget the `return` and every item comes back `undefined`.",
          "## Split / reverse / join",
          "Chain methods to reshape a string: **split** it into an array, transform that array, then **join** it back into a string. Each step feeds the next.",
          "~~~js",
          "'LAIN'.split('').reverse().join('');  // 'NIAL'",
          "~~~",
          "> INTEL — `str.split('')` explodes a string into a one-character-per-slot array you can map or filter. `join('')` glues the pieces back with nothing between them."
        ),
        exercises: [
          {
            id: "js-reverse", title: "PALINDROME ICE", kind: "function", difficulty: 1, xp: 120,
            brief: "Reverse the encrypted packet.",
            prompt: J("Define **reverseSignal(s)** returning the string reversed.", "~~~js", "reverseSignal('LAIN')  // 'NIAL'", "~~~"),
            starter: J("function reverseSignal(s) {", "  // TODO", "}"),
            solution: J("function reverseSignal(s) {", "  return s.split('').reverse().join('');", "}"),
            tests: [
              { name: "reverses text", code: "assertEqual(reverseSignal('LAIN'), 'NIAL');" },
              { name: "edge cases", code: "assert(reverseSignal('')==='' && reverseSignal('a')==='a');" },
              { name: "longer string", code: "assertEqual(reverseSignal('wired'), 'deriw');" },
            ],
            hint: "split('') then reverse() then join('').",
            lore: "Close the world, open the nExT.",
          },
          {
            id: "js-purge", title: "VOWEL PURGE", kind: "function", difficulty: 2, xp: 150,
            brief: "Compress a transmission.",
            prompt: J(
              "Define **compress(s)** returning `s` with every vowel removed (a e i o u, upper or lower). Keep everything else, including y.",
              "~~~js",
              "compress('Windowlicker')  // 'Wndwlckr'",
              "~~~"
            ),
            starter: J("function compress(s) {", "  // TODO", "}"),
            solution: J(
              "function compress(s) {",
              "  return s.split('').filter(function (ch) { return !'aeiou'.includes(ch.toLowerCase()); }).join('');",
              "}"
            ),
            tests: [
              { name: "Twitter -> Twttr", code: "assertEqual(compress('Twitter'), 'Twttr');" },
              { name: "Windowlicker -> Wndwlckr", code: "assertEqual(compress('Windowlicker'), 'Wndwlckr');" },
              { name: "keeps consonants and y", code: "assert(compress('RHYTHM')==='RHYTHM' && compress('AEIOU')==='');" },
            ],
            hint: "Filter characters where !'aeiou'.includes(ch.toLowerCase()).",
            lore: "Windowlicker. Aphex Twin, 1999.",
          },
          {
            id: "js-loud", title: "FREQUENCY FILTER", kind: "function", difficulty: 2, xp: 160,
            brief: "Filter the set for high-BPM bangers.",
            prompt: J(
              "`tracks` is an array of objects `{ name, bpm }`. Define **loudTracks(tracks)** returning an array of just the **names** whose bpm is **>= 120**, preserving order.",
              "~~~js",
              "loudTracks([{name:'Lull',bpm:90},{name:'Spice',bpm:128}])  // ['Spice']",
              "~~~"
            ),
            starter: J("function loudTracks(tracks) {", "  // TODO: filter then map", "}"),
            solution: J(
              "function loudTracks(tracks) {",
              "  return tracks.filter(function (t) { return t.bpm >= 120; }).map(function (t) { return t.name; });",
              "}"
            ),
            tests: [
              { name: "keeps bpm >= 120", code: J(
                "var data = [{name:'Lull',bpm:90},{name:'Spice',bpm:128},{name:'Wired',bpm:140}];",
                "assertEqual(loudTracks(data), ['Spice','Wired']);"
              ) },
              { name: "boundary 120 included", code: "assertEqual(loudTracks([{name:'X',bpm:120}]), ['X']);" },
              { name: "empty -> empty", code: "assertEqual(loudTracks([]), []);" },
            ],
            hint: ".filter(t => t.bpm >= 120).map(t => t.name)",
            lore: "Drop the bass in Night City.",
          },
        ],
      },

      /* ---------- JS 0x04 ---------- */
      {
        id: "jsm04-objects", code: "0x04", title: "FUNCTIONS & OBJECTS",
        subtitle: "arrow fns · reduce · objects · lookups",
        theory: J(
          "## Arrow functions",
          "An arrow function is a shorter way to write a function — perfect for the little one-liners you hand to `.map()` or `.filter()`. When the body is a single expression, you can drop both the braces and the word `return`; the value comes back automatically. These two are identical:",
          "~~~js",
          "const dbl = function (x) { return x * 2; };",
          "const dbl2 = (x) => x * 2;  // implicit return",
          "~~~",
          "> WARNING — The moment you add braces `=> { ... }` the auto-return switches off. `(x) => { x * 2 }` returns `undefined` — you must write `return x * 2;`.",
          "## reduce",
          "**.reduce()** boils an array down to one value — a sum, a max, a tally. It walks the list carrying an **accumulator** (the running total); your function returns the next accumulator each step. The second argument is its starting value.",
          "~~~js",
          "[10,20,12].reduce((a, c) => a + c, 0);  // 42  (a=running total, c=current)",
          "~~~",
          "> WARNING — Don't skip the start value. `reduce((a,c)=>a+c)` with no `0` breaks on an empty array — pass the initial accumulator.",
          "## Objects",
          "An object is a collection of **key/value** pairs — like a labelled drawer, where each label (key) maps to a value. Read a value with `obj[key]`, and check whether a key exists with `key in obj` before trusting it.",
          "~~~js",
          "const freq = {};",
          "freq['a'] = (freq['a'] || 0) + 1;  // 1, then 2, then 3...",
          "~~~",
          "> INTEL — `(freq[k] || 0) + 1` is the classic frequency-table trick: a missing key reads as `undefined`, the `|| 0` turns that into 0, so the first count starts at 1 instead of crashing."
        ),
        exercises: [
          {
            id: "js-accumulate", title: "POWER ACCUMULATOR", kind: "function", difficulty: 1, xp: 130,
            brief: "Sum the reactor cells.",
            prompt: J("Define **totalPower(cells)** returning the sum of an array of numbers. Use **reduce**.", "~~~js", "totalPower([10,20,12])  // 42", "~~~"),
            starter: J("function totalPower(cells) {", "  // TODO: reduce", "}"),
            solution: J("function totalPower(cells) {", "  return cells.reduce(function (a, c) { return a + c; }, 0);", "}"),
            tests: [
              { name: "sums a list", code: "assert(totalPower([10,20,12])===42 && totalPower([1,2,3,4])===10);" },
              { name: "empty -> 0", code: "assertEqual(totalPower([]), 0);" },
              { name: "handles negatives", code: "assertEqual(totalPower([10,-4,2]), 8);" },
            ],
            hint: "cells.reduce((a, c) => a + c, 0) — the 0 is the starting accumulator.",
            lore: "Every cell counts.",
          },
          {
            id: "js-frequency", title: "SIGNAL FREQUENCY", kind: "function", difficulty: 2, xp: 170,
            brief: "Build a frequency table of the stream.",
            prompt: J(
              "Define **charFrequency(s)** returning an **object** mapping each character to its count.",
              "~~~js",
              "charFrequency('aab')  // { a: 2, b: 1 }",
              "~~~"
            ),
            starter: J("function charFrequency(s) {", "  const freq = {};", "  // TODO", "  return freq;", "}"),
            solution: J(
              "function charFrequency(s) {",
              "  const freq = {};",
              "  for (const ch of s) { freq[ch] = (freq[ch] || 0) + 1; }",
              "  return freq;",
              "}"
            ),
            tests: [
              { name: "counts repeats", code: "assertEqual(charFrequency('aab'), { a: 2, b: 1 });" },
              { name: "empty -> {}", code: "assertEqual(charFrequency(''), {});" },
              { name: "all distinct", code: "assertEqual(charFrequency('wired'), { w:1, i:1, r:1, e:1, d:1 });" },
            ],
            hint: "Loop with for...of; freq[ch] = (freq[ch] || 0) + 1.",
            lore: "Decoding the signal from the Wired...",
          },
          {
            id: "js-bounty", title: "BOUNTY BOARD", kind: "function", difficulty: 2, xp: 150,
            brief: "Look up a target's price — safely.",
            prompt: J(
              "`board` is an object of `name -> reward`. Define **bounty(board, name)** returning the reward, or **0** if the name isn't on the board.",
              "~~~js",
              "bounty({ Asimov: 2500000 }, 'Spike')  // 0",
              "~~~"
            ),
            starter: J("function bounty(board, name) {", "  // TODO: return reward or 0", "}"),
            solution: J("function bounty(board, name) {", "  return (name in board) ? board[name] : 0;", "}"),
            tests: [
              { name: "known target", code: "assertEqual(bounty({ Asimov: 2500000, Teddy: 1000000 }, 'Asimov'), 2500000);" },
              { name: "unknown -> 0", code: "assertEqual(bounty({ Asimov: 2500000 }, 'Spike'), 0);" },
              { name: "empty board -> 0", code: "assertEqual(bounty({}, 'anyone'), 0);" },
            ],
            hint: "(name in board) ? board[name] : 0",
            lore: "Three million woolongs, dead or alive.",
          },
        ],
      },

    ],
  });
})();
