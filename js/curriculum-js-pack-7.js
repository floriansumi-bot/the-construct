/* ============================================================
   curriculum-js-pack-7.js — JAVASCRIPT expansion pack 7.
   Appends practice nodes to existing sectors 0x01..0x04 to bring
   JavaScript toward Python parity. Auto-assembled from
   _verify/js-gen/*.json and verified by _verify/verify-js.js on the
   REAL V8 grader (every solution passes, every starter fails).
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;
  function add(modId, exs) {
    var m = t.modules.find(function (x) { return x.id === modId; });
    if (m) Array.prototype.push.apply(m.exercises, exs);
  }
  add("jsm01-boot", [
      {
        id: "js-rootkit", title: "ROOT CHECK", kind: "function", difficulty: 1, xp: 120,
        brief: "Verify an identity with strict equality.",
        prompt: "Define **isRoot(name)** that returns `true` only when `name` is **exactly** the string `'root'`, otherwise `false`.\nUse strict equality `===` — case matters, so `'Root'` is **not** root.\n~~~js\nisRoot('root')     // true\nisRoot('Trinity')  // false\nisRoot('Root')     // false\n~~~",
        starter: "function isRoot(name) {\n  // TODO: return whether name === 'root'\n}",
        solution: "function isRoot(name) {\n  return name === 'root';\n}",
        tests: [
        { name: "root -> true", code: "assertEqual(isRoot('root'), true, \"isRoot('root') should be true\");" },
        { name: "intruder -> false", code: "assert(isRoot('Trinity') === false && isRoot('admin') === false, 'non-root names should be false');" },
        { name: "case-sensitive", code: "assertEqual(isRoot('Root'), false, \"'Root' is not 'root' — === is case-sensitive\");" }
        ],
        hint: "Return the comparison directly: name === 'root'.", lore: "Root access is earned, not guessed."
      },
      {
        id: "js-typeprobe", title: "TYPE PROBE", kind: "function", difficulty: 1, xp: 130,
        brief: "Scan a value and report its type.",
        prompt: "Define **probe(value)** that returns the **type** of `value` as a string, using the `typeof` operator.\n~~~js\nprobe('Neo')  // 'string'\nprobe(42)     // 'number'\nprobe(true)   // 'boolean'\n~~~",
        starter: "function probe(value) {\n  // TODO: return typeof value\n}",
        solution: "function probe(value) {\n  return typeof value;\n}",
        tests: [
        { name: "string -> 'string'", code: "assertEqual(probe('Neo'), 'string');" },
        { name: "number -> 'number'", code: "assertEqual(probe(42), 'number');" },
        { name: "boolean -> 'boolean'", code: "assert(probe(true) === 'boolean' && probe(false) === 'boolean', 'booleans should report boolean');" }
        ],
        hint: "return typeof value;", lore: "Every signal has a signature."
      },
      {
        id: "js-callsign", title: "CALLSIGN", kind: "function", difficulty: 2, xp: 160,
        brief: "Forge a callsign from two name parts.",
        prompt: "Define **callsign(first, last)** that returns the **last** name and **first** name joined by a hyphen, using a template literal.\nFormat: `` `${last}-${first}` ``\n~~~js\ncallsign('Motoko', 'Kusanagi')  // 'Kusanagi-Motoko'\ncallsign('Spike', 'Spiegel')    // 'Spiegel-Spike'\n~~~",
        starter: "function callsign(first, last) {\n  // TODO: return `${last}-${first}`\n}",
        solution: "function callsign(first, last) {\n  return `${last}-${first}`;\n}",
        tests: [
        { name: "Kusanagi-Motoko", code: "assertEqual(callsign('Motoko', 'Kusanagi'), 'Kusanagi-Motoko');" },
        { name: "order: last then first", code: "assertEqual(callsign('Spike', 'Spiegel'), 'Spiegel-Spike');" },
        { name: "single hyphen, exact", code: "assertEqual(callsign('A', 'B'), 'B-A');" }
        ],
        hint: "Backticks, last first: `${last}-${first}`.", lore: "On the net, your callsign is all they know."
      },
      {
        id: "js-roundpwr", title: "POWER GAUGE", kind: "function", difficulty: 2, xp: 170,
        brief: "Round a reading into a labelled gauge string.",
        prompt: "Define **powerLabel(level)** that **rounds** `level` to the nearest whole number and returns it as a labelled string.\nFormat: `` `Power: ${rounded}%` `` — use `Math.round` and a template literal.\n~~~js\npowerLabel(87.6)  // 'Power: 88%'\npowerLabel(50)    // 'Power: 50%'\npowerLabel(33.2)  // 'Power: 33%'\n~~~",
        starter: "function powerLabel(level) {\n  // TODO: round level, then return `Power: ${...}%`\n}",
        solution: "function powerLabel(level) {\n  return `Power: ${Math.round(level)}%`;\n}",
        tests: [
        { name: "rounds up", code: "assertEqual(powerLabel(87.6), 'Power: 88%');" },
        { name: "whole number stays put", code: "assertEqual(powerLabel(50), 'Power: 50%');" },
        { name: "rounds down", code: "assertEqual(powerLabel(33.2), 'Power: 33%');" }
        ],
        hint: "Math.round(level) inside `Power: ${...}%`.", lore: "Reactor at eighty-eight percent. Hold."
      },
      {
        id: "js-banner", title: "BOOT BANNER", kind: "script", difficulty: 3, xp: 200,
        brief: "Print a formatted login banner from variables.",
        prompt: "Store the operator name and node number in variables, then `console.log` a **three-line banner** built with template literals.\nPrint these **three lines, exactly**:\n~~~text\n=== THE CONSTRUCT ===\nUSER: Neo\nNODE: 7\n~~~\nDeclare `const user = 'Neo'` and `const node = 7`, then interpolate them with `${...}` — don't hard-code the values into the USER/NODE lines.",
        starter: "const user = 'Neo';\nconst node = 7;\n// TODO: console.log the three banner lines using ${user} and ${node}",
        solution: "const user = 'Neo';\nconst node = 7;\nconsole.log('=== THE CONSTRUCT ===');\nconsole.log(`USER: ${user}`);\nconsole.log(`NODE: ${node}`);",
        tests: [
        { name: "the banner is not silent", code: "assert(stdout().trim().length > 0, 'Nothing logged — use console.log().');" },
        { name: "three lines, exact", code: "var lines = stdout().trim().split('\\n').map(function (s) { return s.trim(); });\nassertEqual(lines, ['=== THE CONSTRUCT ===', 'USER: Neo', 'NODE: 7'], 'Match all three banner lines exactly.');" }
        ],
        hint: "Three console.log calls: a literal title line, then `USER: ${user}` and `NODE: ${node}`.", lore: "Welcome back, operator. The Construct is yours."
      }
  ]);

  add("jsm02-logic", [
      {
        id: "js-absval", title: "MAGNITUDE", kind: "function", difficulty: 1, xp: 120,
        brief: "Strip the sign from a voltage reading.",
        prompt: "Define **absValue(n)** returning the distance of `n` from zero (its absolute value).\nDo **not** use `Math.abs`. Use a ternary or `if`.\n~~~js\nabsValue(-7)  // 7\nabsValue(7)   // 7\nabsValue(0)   // 0\n~~~",
        starter: "function absValue(n) {\n  // TODO: return n flipped positive when negative\n}",
        solution: "function absValue(n) {\n  return n < 0 ? -n : n;\n}",
        tests: [
        { name: "negative flips positive", code: "assertEqual(absValue(-7), 7, 'absValue(-7) should be 7');" },
        { name: "positive unchanged", code: "assertEqual(absValue(7), 7, 'absValue(7) should be 7');" },
        { name: "zero stays zero", code: "assertEqual(absValue(0), 0, 'absValue(0) should be 0');" },
        { name: "large negative", code: "assertEqual(absValue(-128), 128, 'absValue(-128) should be 128');" }
        ],
        hint: "n < 0 ? -n : n", lore: "The grid only cares how far you spike, not which way."
      },
      {
        id: "js-tag", title: "POLARITY TAG", kind: "function", difficulty: 2, xp: 150,
        brief: "Label a signal by its polarity.",
        prompt: "Define **tag(n)** returning the string `'POS'` if `n` is positive, `'NEG'` if negative, and `'ZERO'` if exactly 0.\nUse a ternary chain (`?:`).\n~~~js\ntag(5)   // 'POS'\ntag(-3)  // 'NEG'\ntag(0)   // 'ZERO'\n~~~",
        starter: "function tag(n) {\n  // TODO: POS / NEG / ZERO\n}",
        solution: "function tag(n) {\n  return n > 0 ? 'POS' : n < 0 ? 'NEG' : 'ZERO';\n}",
        tests: [
        { name: "positive is POS", code: "assertEqual(tag(5), 'POS', 'tag(5) should be POS');" },
        { name: "negative is NEG", code: "assertEqual(tag(-3), 'NEG', 'tag(-3) should be NEG');" },
        { name: "zero is ZERO", code: "assertEqual(tag(0), 'ZERO', 'tag(0) should be ZERO');" },
        { name: "tiny positive still POS", code: "assertEqual(tag(0.0001), 'POS', 'tag(0.0001) should be POS');" }
        ],
        hint: "n > 0 ? 'POS' : n < 0 ? 'NEG' : 'ZERO'", lore: "Every pulse on the wire wears a tag, or it gets quarantined."
      },
      {
        id: "js-bothonline", title: "DUAL UPLINK", kind: "function", difficulty: 2, xp: 160,
        brief: "Both nodes must be live to route traffic.",
        prompt: "Define **bothOnline(a, b)** returning `true` only when **both** `a` and `b` are `true`, otherwise `false`.\nUse the `&&` operator. Return an actual boolean.\n~~~js\nbothOnline(true, true)   // true\nbothOnline(true, false)  // false\n~~~",
        starter: "function bothOnline(a, b) {\n  // TODO: true only if both are true\n}",
        solution: "function bothOnline(a, b) {\n  return a === true && b === true;\n}",
        tests: [
        { name: "both true", code: "assert(bothOnline(true, true) === true, 'both true should be true');" },
        { name: "first false", code: "assert(bothOnline(false, true) === false, 'false,true should be false');" },
        { name: "second false", code: "assert(bothOnline(true, false) === false, 'true,false should be false');" },
        { name: "both false", code: "assert(bothOnline(false, false) === false, 'both false should be false');" }
        ],
        hint: "a === true && b === true", lore: "One dead node and the whole route goes dark."
      },
      {
        id: "js-gradeletter", title: "THREAT GRADE", kind: "function", difficulty: 3, xp: 190,
        brief: "Convert a 0-100 threat score into a letter grade.",
        prompt: "Define **gradeLetter(score)** mapping a 0-100 number to a letter:\n`>= 90` -> `'A'`, `>= 80` -> `'B'`, `>= 70` -> `'C'`, `>= 60` -> `'D'`, otherwise `'F'`.\nUse `if / else if / else`.\n~~~js\ngradeLetter(95)  // 'A'\ngradeLetter(72)  // 'C'\ngradeLetter(40)  // 'F'\n~~~",
        starter: "function gradeLetter(score) {\n  // TODO: A / B / C / D / F bands\n}",
        solution: "function gradeLetter(score) {\n  if (score >= 90) return 'A';\n  else if (score >= 80) return 'B';\n  else if (score >= 70) return 'C';\n  else if (score >= 60) return 'D';\n  else return 'F';\n}",
        tests: [
        { name: "A band incl 90", code: "assert(gradeLetter(100) === 'A' && gradeLetter(90) === 'A', 'A band');" },
        { name: "B band incl 80", code: "assert(gradeLetter(89) === 'B' && gradeLetter(80) === 'B', 'B band');" },
        { name: "C band incl 70", code: "assert(gradeLetter(79) === 'C' && gradeLetter(70) === 'C', 'C band');" },
        { name: "D band incl 60", code: "assert(gradeLetter(69) === 'D' && gradeLetter(60) === 'D', 'D band');" },
        { name: "F below 60", code: "assert(gradeLetter(59) === 'F' && gradeLetter(0) === 'F', 'F band');" }
        ],
        hint: "Check the highest band first, then fall through with else if.", lore: "ICE rates every intruder before it decides how hard to bite."
      },
      {
        id: "js-isleap", title: "LEAP CYCLE", kind: "function", difficulty: 3, xp: 210,
        brief: "Decide if a year is a leap year.",
        prompt: "Define **isLeap(year)** returning `true` if `year` is a leap year, else `false`.\nRule: divisible by 4 **and** not by 100 — **unless** also divisible by 400.\n~~~js\nisLeap(2024)  // true\nisLeap(1900)  // false\nisLeap(2000)  // true\n~~~",
        starter: "function isLeap(year) {\n  // TODO: div by 4, not 100, except div by 400\n}",
        solution: "function isLeap(year) {\n  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;\n}",
        tests: [
        { name: "common div-by-4 leap", code: "assert(isLeap(2024) === true, 'isLeap(2024) should be true');" },
        { name: "century not by 400", code: "assert(isLeap(1900) === false, 'isLeap(1900) should be false');" },
        { name: "century by 400", code: "assert(isLeap(2000) === true, 'isLeap(2000) should be true');" },
        { name: "non-leap odd year", code: "assert(isLeap(2023) === false, 'isLeap(2023) should be false');" },
        { name: "2100 not leap", code: "assert(isLeap(2100) === false, 'isLeap(2100) should be false');" }
        ],
        hint: "(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0", lore: "The mainframe clock skips a beat every four cycles, but the centuries lie."
      }
  ]);

  add("jsm03-strings", [
      {
        id: "js-shout", title: "VOICE AMP", kind: "function", difficulty: 1, xp: 120,
        brief: "Trim, shout it in caps, slam an exclamation on the end.",
        prompt: "Define **shout(s)** that trims surrounding whitespace, converts the text to **upper case**, and appends a single `'!'`.\n~~~js\nshout('wake up')   // 'WAKE UP!'\nshout('  neo ')    // 'NEO!'\n~~~",
        starter: "function shout(s) {\n  // TODO: trim, uppercase, then add '!'\n}",
        solution: "function shout(s) {\n  return s.trim().toUpperCase() + '!';\n}",
        tests: [
        { name: "basic phrase", code: "assertEqual(shout('wake up'), 'WAKE UP!', 'phrase should be upper-cased with !');" },
        { name: "trims edges", code: "assertEqual(shout('  neo '), 'NEO!', 'leading/trailing spaces must be trimmed');" },
        { name: "empty string", code: "assertEqual(shout(''), '!', 'empty input yields just the bang');" }
        ],
        hint: "s.trim().toUpperCase() + '!'", lore: "In the construct, volume is a weapon. Crank it."
      },
      {
        id: "js-mask", title: "CRED MASK", kind: "function", difficulty: 2, xp: 150,
        brief: "Hide a cred-stick number, leaving only the last four digits.",
        prompt: "Define **mask(card)** that returns the number with every character except the **last 4** replaced by `'*'`.\nIf the input is 4 characters or shorter, return it unchanged.\n~~~js\nmask('1234567890123456')  // '************3456'\nmask('4242')              // '4242'\n~~~",
        starter: "function mask(card) {\n  // TODO: keep the last 4, replace the rest with '*'\n}",
        solution: "function mask(card) {\n  if (card.length <= 4) return card;\n  return '*'.repeat(card.length - 4) + card.slice(-4);\n}",
        tests: [
        { name: "16 digits", code: "assertEqual(mask('1234567890123456'), '************3456', 'mask all but last 4');" },
        { name: "exactly four", code: "assertEqual(mask('4242'), '4242', '4 chars stay visible');" },
        { name: "shorter than four", code: "assertEqual(mask('42'), '42', 'short input is returned unchanged');" },
        { name: "empty string", code: "assertEqual(mask(''), '', 'empty stays empty');" },
        { name: "nine digits", code: "assertEqual(mask('123456789'), '*****6789', 'five stars then last four');" }
        ],
        hint: "'*'.repeat(card.length - 4) + card.slice(-4), but guard length <= 4", lore: "Flash the stick, not the balance. Last four only."
      },
      {
        id: "js-wordcount", title: "TOKEN TALLY", kind: "function", difficulty: 2, xp: 165,
        brief: "Count the words in a transmission.",
        prompt: "Define **wordCount(s)** that returns how many space-separated words the string holds.\nAn empty or whitespace-only string must return `0`.\n~~~js\nwordCount('hack the planet')  // 3\nwordCount('')                 // 0\n~~~",
        starter: "function wordCount(s) {\n  // TODO: split on spaces and count, but handle the empty case\n}",
        solution: "function wordCount(s) {\n  var trimmed = s.trim();\n  if (trimmed === '') return 0;\n  return trimmed.split(' ').filter(function (w) { return w !== ''; }).length;\n}",
        tests: [
        { name: "three words", code: "assertEqual(wordCount('hack the planet'), 3, 'three space-separated words');" },
        { name: "empty string", code: "assertEqual(wordCount(''), 0, 'empty string is zero words');" },
        { name: "whitespace only", code: "assertEqual(wordCount('   '), 0, 'spaces alone count as zero');" },
        { name: "single word", code: "assertEqual(wordCount('solo'), 1, 'one word counts as one');" }
        ],
        hint: "Trim first; if it's '' return 0, else split(' ').length (drop empty chunks).", lore: "Every token on the wire costs power. Count them."
      },
      {
        id: "js-screamcase", title: "SCREAM CASE", kind: "function", difficulty: 3, xp: 190,
        brief: "Forge a screaming identifier from a list of words.",
        prompt: "Define **screamCase(words)** that upper-cases every word and joins them with an underscore `'_'`.\nAn empty array returns the empty string.\n~~~js\nscreamCase(['boot', 'up'])  // 'BOOT_UP'\nscreamCase([])             // ''\n~~~",
        starter: "function screamCase(words) {\n  // TODO: map each word to upper case, then join with '_'\n}",
        solution: "function screamCase(words) {\n  return words.map(function (w) { return w.toUpperCase(); }).join('_');\n}",
        tests: [
        { name: "two words", code: "assertEqual(screamCase(['boot', 'up']), 'BOOT_UP', 'upper-case and underscore-join');" },
        { name: "empty array", code: "assertEqual(screamCase([]), '', 'no words gives empty string');" },
        { name: "single word", code: "assertEqual(screamCase(['solo']), 'SOLO', 'one word, no underscore');" },
        { name: "three words", code: "assertEqual(screamCase(['jack', 'in', 'now']), 'JACK_IN_NOW', 'three screamed tokens');" }
        ],
        hint: "words.map(w => w.toUpperCase()).join('_')", lore: "Constants don't whisper. They SCREAM_LIKE_THIS."
      },
      {
        id: "js-longwords", title: "SIGNAL SIEVE", kind: "function", difficulty: 3, xp: 210,
        brief: "Keep only the long callsigns, drop the short noise.",
        prompt: "Define **longWords(words)** that returns a new array containing only the words whose length is **5 or more**.\nOrder is preserved; an empty array returns an empty array.\n~~~js\nlongWords(['neo', 'trinity', 'tank'])  // ['trinity']\nlongWords([])                          // []\n~~~",
        starter: "function longWords(words) {\n  // TODO: filter the array down to words of length >= 5\n}",
        solution: "function longWords(words) {\n  return words.filter(function (w) { return w.length >= 5; });\n}",
        tests: [
        { name: "keeps one", code: "assertEqual(longWords(['neo', 'trinity', 'tank']), ['trinity'], 'only words of length >= 5 survive');" },
        { name: "empty array", code: "assertEqual(longWords([]), [], 'empty input gives empty output');" },
        { name: "all long", code: "assertEqual(longWords(['cipher', 'dozer', 'mouse']), ['cipher', 'dozer', 'mouse'], 'all five-plus words kept');" },
        { name: "boundary length", code: "assertEqual(longWords(['four', 'fives']), ['fives'], 'length 4 dropped, length 5 kept');" }
        ],
        hint: "words.filter(w => w.length >= 5)", lore: "Short bursts are static. The sieve keeps the long signals."
      }
  ]);

  add("jsm04-objects", [
      {
        id: "js-maxcell", title: "PEAK OUTPUT", kind: "function", difficulty: 1, xp: 130,
        brief: "Find the hottest reactor cell.",
        prompt: "Define **maxCell(cells)** returning the largest number in a non-empty array. Use **reduce**.\n~~~js\nmaxCell([3, 7, 2])  // 7\n~~~",
        starter: "function maxCell(cells) {\n  // TODO: reduce, keeping the bigger of the two\n}",
        solution: "function maxCell(cells) {\n  return cells.reduce(function (m, c) { return c > m ? c : m; });\n}",
        tests: [
        { name: "finds the peak", code: "assertEqual(maxCell([3, 7, 2]), 7);" },
        { name: "single cell", code: "assertEqual(maxCell([5]), 5);" },
        { name: "all negative", code: "assertEqual(maxCell([-3, -1, -9]), -1);" }
        ],
        hint: "cells.reduce((m, c) => (c > m ? c : m)) — with no seed, reduce starts from the first cell.", lore: "One cell always runs hottest. Find it before it blows."
      },
      {
        id: "js-average", title: "MEAN SIGNAL", kind: "function", difficulty: 2, xp: 150,
        brief: "Average the telemetry stream.",
        prompt: "Define **average(nums)** returning the arithmetic mean of the array. An **empty** array averages to **0**.\n~~~js\naverage([2, 4])  // 3\naverage([])     // 0\n~~~",
        starter: "function average(nums) {\n  // TODO: guard the empty case, then sum / length\n}",
        solution: "function average(nums) {\n  if (nums.length === 0) return 0;\n  return nums.reduce(function (a, c) { return a + c; }, 0) / nums.length;\n}",
        tests: [
        { name: "mean of two", code: "assertEqual(average([2, 4]), 3);" },
        { name: "mean of three", code: "assertEqual(average([10, 20, 30]), 20);" },
        { name: "empty -> 0", code: "assertEqual(average([]), 0, 'an empty stream averages to 0, not NaN');" }
        ],
        hint: "Return 0 when nums.length is 0; otherwise nums.reduce((a, c) => a + c, 0) / nums.length.", lore: "Noise cancels. The mean is the only honest reading."
      },
      {
        id: "js-merge", title: "CONFIG OVERRIDE", kind: "function", difficulty: 2, xp: 170,
        brief: "Patch the defaults with overrides.",
        prompt: "Define **mergeConfigs(a, b)** returning a **new** object with all keys of both, where `b`'s values win on conflicts. Do **not** mutate `a` or `b`.\n~~~js\nmergeConfigs({ hp: 100, mp: 30 }, { mp: 50, lvl: 9 })  // { hp: 100, mp: 50, lvl: 9 }\n~~~",
        starter: "function mergeConfigs(a, b) {\n  const out = {};\n  // TODO: copy a, then let b override\n  return out;\n}",
        solution: "function mergeConfigs(a, b) {\n  return Object.assign({}, a, b);\n}",
        tests: [
        { name: "b overrides a", code: "assertEqual(mergeConfigs({ hp: 100, mp: 30 }, { mp: 50, lvl: 9 }), { hp: 100, mp: 50, lvl: 9 });" },
        { name: "two empties -> empty", code: "assertEqual(mergeConfigs({}, {}), {});" },
        { name: "does not mutate a", code: "var a = { hp: 100 };\nmergeConfigs(a, { hp: 1 });\nassertEqual(a, { hp: 100 }, 'the original defaults must be untouched');" }
        ],
        hint: "Object.assign({}, a, b) — later sources overwrite earlier ones, and the fresh {} keeps the inputs clean.", lore: "Defaults are a suggestion. The override is the law."
      },
      {
        id: "js-rewards", title: "BOUNTY LEDGER", kind: "function", difficulty: 3, xp: 190,
        brief: "Tally every reward on the board.",
        prompt: "`board` is an object of `name -> reward`. Define **totalRewards(board)** returning the sum of all the rewards (the **values**). Use **Object.values** and **reduce**. An empty board totals **0**.\n~~~js\ntotalRewards({ Spike: 2500000, Jet: 1000000 })  // 3500000\n~~~",
        starter: "function totalRewards(board) {\n  // TODO: sum the object's values\n}",
        solution: "function totalRewards(board) {\n  return Object.values(board).reduce(function (a, c) { return a + c; }, 0);\n}",
        tests: [
        { name: "sums all rewards", code: "assertEqual(totalRewards({ Spike: 2500000, Jet: 1000000 }), 3500000);" },
        { name: "single entry", code: "assertEqual(totalRewards({ Asimov: 2500000 }), 2500000);" },
        { name: "empty board -> 0", code: "assertEqual(totalRewards({}), 0);" }
        ],
        hint: "Object.values(board).reduce((a, c) => a + c, 0) — pull the numbers out, then fold them.", lore: "Add up every head on the board. That is your year."
      },
      {
        id: "js-invert", title: "REVERSE LOOKUP", kind: "function", difficulty: 3, xp: 210,
        brief: "Flip the codec table end for end.",
        prompt: "Define **invert(obj)** returning a **new** object with keys and values swapped: each value becomes a key, mapping back to its original key. Assume values are unique. Use **Object.entries**.\n~~~js\ninvert({ a: 'x', b: 'y' })  // { x: 'a', y: 'b' }\n~~~",
        starter: "function invert(obj) {\n  const out = {};\n  // TODO: for each [key, value], set out[value] = key\n  return out;\n}",
        solution: "function invert(obj) {\n  return Object.entries(obj).reduce(function (acc, pair) {\n    acc[pair[1]] = pair[0];\n    return acc;\n  }, {});\n}",
        tests: [
        { name: "swaps keys and values", code: "assertEqual(invert({ a: 'x', b: 'y' }), { x: 'a', y: 'b' });" },
        { name: "round-trips a codec", code: "assertEqual(invert({ north: 'cold' }), { cold: 'north' });" },
        { name: "empty -> empty", code: "assertEqual(invert({}), {});" }
        ],
        hint: "Object.entries(obj).reduce((acc, [k, v]) => { acc[v] = k; return acc; }, {})", lore: "Every codec runs both ways. Read it backward and the ghost speaks."
      }
  ]);
})();
