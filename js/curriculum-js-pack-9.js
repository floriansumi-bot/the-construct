/* ============================================================
   curriculum-js-pack-9.js — JAVASCRIPT expansion pack 9.
   Appends practice nodes to existing sectors (jsm09-sets, jsm0a-classes, jsm0b-regex, jsm0c-json, jsm0d-sort, jsm0e-search, jsm0f-stralgo, jsm10-math)
   to bring JavaScript toward Python parity. Auto-assembled from
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
  add("jsm09-sets", [
      {
        id: "js-union", title: "MERGE NETS", kind: "function", difficulty: 1, xp: 140,
        brief: "Fuse two node lists, no repeats.",
        prompt: "Define **union(a, b)** returning the unique values from both arrays — a's order first, then values from b not already present.\n~~~js\nunion([1, 2], [2, 3])  // [1, 2, 3]\n~~~",
        starter: "function union(a, b) {\n  // TODO: collect a's values, then new ones from b\n}",
        solution: "function union(a, b) {\n  const out = [];\n  const seen = new Set();\n  for (const x of a.concat(b)) {\n    if (!seen.has(x)) { seen.add(x); out.push(x); }\n  }\n  return out;\n}",
        tests: [
        { name: "merges unique", code: "assertEqual(union([1, 2], [2, 3]), [1, 2, 3]);" },
        { name: "drops repeats in b", code: "assertEqual(union([], [5, 5]), [5]);" },
        { name: "no overlap", code: "assertEqual(union([1], [2]), [1, 2]);" },
        { name: "preserves a then b order", code: "assertEqual(union(['x', 'y'], ['y', 'z']), ['x', 'y', 'z']);" },
        { name: "both empty -> empty", code: "assertEqual(union([], []), []);" }
        ],
        hint: "Walk a.concat(b), push each value not already in a Set.", lore: "Two nets, one mesh."
      },
      {
        id: "js-difference", title: "PURGE LIST", kind: "function", difficulty: 2, xp: 170,
        brief: "Keep only the nodes b never claimed.",
        prompt: "Define **difference(a, b)** returning the values from `a` that do **not** appear in `b`, in a's original order. Duplicates in `a` are kept.\n~~~js\ndifference([1, 2, 3], [2])  // [1, 3]\n~~~",
        starter: "function difference(a, b) {\n  // TODO: keep a's values that are not in b\n}",
        solution: "function difference(a, b) {\n  const block = new Set(b);\n  const out = [];\n  for (const x of a) {\n    if (!block.has(x)) { out.push(x); }\n  }\n  return out;\n}",
        tests: [
        { name: "removes shared", code: "assertEqual(difference([1, 2, 3], [2]), [1, 3]);" },
        { name: "keeps duplicates", code: "assertEqual(difference([1, 1, 2], [2]), [1, 1]);" },
        { name: "nothing removed", code: "assertEqual(difference([1, 2], [9]), [1, 2]);" },
        { name: "everything removed", code: "assertEqual(difference([4, 5], [4, 5]), []);" },
        { name: "empty a -> empty", code: "assertEqual(difference([], [1, 2]), []);" }
        ],
        hint: "Put b in a Set, then push each x of a that the Set lacks.", lore: "Scrub the roster clean of anyone they already own."
      },
      {
        id: "js-hasdupes", title: "CLONE ALARM", kind: "function", difficulty: 2, xp: 175,
        brief: "Trip the alarm if any value repeats.",
        prompt: "Define **hasDuplicates(arr)** returning **true** if any value appears more than once, else **false**. Compare a `Set`'s size to the array length.\n~~~js\nhasDuplicates([1, 2, 1])  // true\nhasDuplicates([1, 2, 3])  // false\n~~~",
        starter: "function hasDuplicates(arr) {\n  // TODO: compare unique count to total count\n}",
        solution: "function hasDuplicates(arr) {\n  return new Set(arr).size !== arr.length;\n}",
        tests: [
        { name: "detects a repeat", code: "assert(hasDuplicates([1, 2, 1]) === true, 'should flag the clone');" },
        { name: "all unique -> false", code: "assert(hasDuplicates([1, 2, 3]) === false, 'no clones here');" },
        { name: "strings repeat", code: "assert(hasDuplicates(['a', 'b', 'a']) === true, 'should flag duplicate strings');" },
        { name: "single value -> false", code: "assert(hasDuplicates([7]) === false, 'one value cannot repeat');" },
        { name: "empty -> false", code: "assert(hasDuplicates([]) === false, 'empty has no duplicates');" }
        ],
        hint: "If new Set(arr).size is smaller than arr.length, something repeated.", lore: "Two signatures, one ID. The clone alarm screams."
      },
      {
        id: "js-firstrepeat", title: "ECHO TRACE", kind: "function", difficulty: 3, xp: 200,
        brief: "Catch the first signal that pings twice.",
        prompt: "Define **firstRepeat(arr)** returning the first value that is seen a **second** time as you scan left to right. If nothing repeats, return **null**.\n~~~js\nfirstRepeat([2, 1, 3, 1, 2])  // 1\nfirstRepeat([1, 2, 3])        // null\n~~~",
        starter: "function firstRepeat(arr) {\n  // TODO: return the first value seen twice, else null\n}",
        solution: "function firstRepeat(arr) {\n  const seen = new Set();\n  for (const x of arr) {\n    if (seen.has(x)) { return x; }\n    seen.add(x);\n  }\n  return null;\n}",
        tests: [
        { name: "first echo wins", code: "assertEqual(firstRepeat([2, 1, 3, 1, 2]), 1);" },
        { name: "adjacent repeat", code: "assertEqual(firstRepeat([5, 5, 9]), 5);" },
        { name: "strings too", code: "assertEqual(firstRepeat(['a', 'b', 'b', 'a']), 'b');" },
        { name: "no repeat -> null", code: "assertEqual(firstRepeat([1, 2, 3]), null);" },
        { name: "empty -> null", code: "assertEqual(firstRepeat([]), null);" }
        ],
        hint: "Track seen values in a Set; the first x already in it is your answer.", lore: "The grid remembers every ping. The first echo gives the ghost away."
      },
      {
        id: "js-mostcommon", title: "DOMINANT FREQ", kind: "function", difficulty: 3, xp: 210,
        brief: "Find the value that drowns out the rest.",
        prompt: "Define **mostCommon(arr)** returning the value with the highest count. On a tie, return the value that **first reaches** that winning count as you scan left to right. Empty array returns **null**.\n~~~js\nmostCommon([1, 2, 2, 3, 2])  // 2\nmostCommon([1, 2, 2, 1])     // 2\n~~~",
        starter: "function mostCommon(arr) {\n  // TODO: tally counts, track the running leader\n}",
        solution: "function mostCommon(arr) {\n  const counts = new Map();\n  let best = null;\n  let bestCount = 0;\n  for (const x of arr) {\n    const c = (counts.get(x) || 0) + 1;\n    counts.set(x, c);\n    if (c > bestCount) { bestCount = c; best = x; }\n  }\n  return best;\n}",
        tests: [
        { name: "clear winner", code: "assertEqual(mostCommon([1, 2, 2, 3, 2]), 2);" },
        { name: "tie -> first to reach count", code: "assertEqual(mostCommon([1, 2, 2, 1]), 2);" },
        { name: "all distinct -> first", code: "assertEqual(mostCommon([7, 8, 9]), 7);" },
        { name: "strings", code: "assertEqual(mostCommon(['a', 'b', 'a', 'b', 'a']), 'a');" },
        { name: "single value", code: "assertEqual(mostCommon([5]), 5);" },
        { name: "empty -> null", code: "assertEqual(mostCommon([]), null);" }
        ],
        hint: "Build a Map of counts; update the leader only when a count strictly beats the best so far.", lore: "One frequency rises above the static and owns the channel."
      }
  ]);

  add("jsm0a-classes", [
      {
        id: "js-toggle-cls", title: "POWER RELAY", kind: "function", difficulty: 1, xp: 130,
        brief: "A switch that flips between two states.",
        prompt: "Define a class **Toggle** with `constructor(on = false)`, `flip()` (inverts the state), and `isOn()` (returns the current boolean). A fresh `Toggle()` starts **off**.\n~~~js\nconst t = new Toggle();\nt.isOn()   // false\nt.flip();\nt.isOn()   // true\n~~~",
        starter: "class Toggle {\n  // TODO: constructor + flip + isOn\n}",
        solution: "class Toggle {\n  constructor(on = false) { this.on = on; }\n  flip() { this.on = !this.on; }\n  isOn() { return this.on; }\n}",
        tests: [
        { name: "starts off by default", code: "var t = new Toggle();\nassertEqual(t.isOn(), false);" },
        { name: "flip turns it on", code: "var t = new Toggle();\nt.flip();\nassertEqual(t.isOn(), true);" },
        { name: "flips back and forth", code: "var t = new Toggle();\nt.flip();\nt.flip();\nassertEqual(t.isOn(), false);" },
        { name: "honors a true start state", code: "var t = new Toggle(true);\nassert(t.isOn() === true);\nt.flip();\nassert(t.isOn() === false);" },
        { name: "instances are independent", code: "var a = new Toggle(), b = new Toggle();\na.flip();\nassert(a.isOn() === true && b.isOn() === false, 'b is untouched by a');" }
        ],
        hint: "Store this.on in the constructor; flip sets this.on = !this.on; isOn returns it.", lore: "Pull the relay: light, dark, light. The grid breathes in two states."
      },
      {
        id: "js-accum-cls", title: "TALLY CORE", kind: "function", difficulty: 2, xp: 160,
        brief: "Keep a running total across every hit.",
        prompt: "Define a class **Accumulator** with `constructor()` (total starts at **0**), `add(n)` (adds `n` and **returns** the new running total), and `total()` (returns the current total).\n~~~js\nconst acc = new Accumulator();\nacc.add(10)   // 10\nacc.add(5)    // 15\nacc.total()   // 15\n~~~",
        starter: "class Accumulator {\n  // TODO: constructor + add + total\n}",
        solution: "class Accumulator {\n  constructor() { this.sum = 0; }\n  add(n) { this.sum += n; return this.sum; }\n  total() { return this.sum; }\n}",
        tests: [
        { name: "add returns the new total", code: "var acc = new Accumulator();\nassert(acc.add(10) === 10, 'first add returns 10');\nassert(acc.add(5) === 15, 'then 15');" },
        { name: "total reflects all adds", code: "var acc = new Accumulator();\nacc.add(3);\nacc.add(4);\nassertEqual(acc.total(), 7);" },
        { name: "starts at zero", code: "var acc = new Accumulator();\nassertEqual(acc.total(), 0);" },
        { name: "handles negative deltas", code: "var acc = new Accumulator();\nacc.add(20);\nassert(acc.add(-8) === 12, 'subtracting works too');" },
        { name: "instances are independent", code: "var a = new Accumulator(), b = new Accumulator();\na.add(100);\nassert(b.total() === 0, 'b keeps its own total');" }
        ],
        hint: "Init this.sum = 0 in the constructor; add does this.sum += n; return this.sum.", lore: "The core counts every credit that passes through. It never forgets a single unit."
      },
      {
        id: "js-inventory-cls", title: "CARGO HOLD", kind: "function", difficulty: 2, xp: 175,
        brief: "Track distinct items in the hold.",
        prompt: "Define a class **Inventory** with `constructor()` (starts empty), `add(item)` (stores the item), `has(item)` (returns `true`/`false`), and `count()` (returns the number of **distinct** items — duplicates do not increase the count).\n~~~js\nconst inv = new Inventory();\ninv.add('ammo'); inv.add('ammo'); inv.add('medkit');\ninv.has('ammo')   // true\ninv.count()       // 2\n~~~",
        starter: "class Inventory {\n  // TODO: constructor + add + has + count\n}",
        solution: "class Inventory {\n  constructor() { this.items = new Set(); }\n  add(item) { this.items.add(item); }\n  has(item) { return this.items.has(item); }\n  count() { return this.items.size; }\n}",
        tests: [
        { name: "has finds an added item", code: "var inv = new Inventory();\ninv.add('ammo');\nassertEqual(inv.has('ammo'), true);" },
        { name: "has is false for missing item", code: "var inv = new Inventory();\ninv.add('ammo');\nassertEqual(inv.has('medkit'), false);" },
        { name: "count is distinct", code: "var inv = new Inventory();\ninv.add('ammo');\ninv.add('ammo');\ninv.add('medkit');\nassertEqual(inv.count(), 2);" },
        { name: "empty hold counts zero", code: "var inv = new Inventory();\nassert(inv.count() === 0 && inv.has('x') === false);" },
        { name: "instances are independent", code: "var a = new Inventory(), b = new Inventory();\na.add('scrap');\nassert(b.has('scrap') === false && b.count() === 0, 'b has its own hold');" }
        ],
        hint: "Back it with a Set: add -> this.items.add(item); count -> this.items.size; has -> this.items.has(item).", lore: "The cargo manifest logs each unique crate once. Stack ten of the same and it still reads one line."
      },
      {
        id: "js-queue-cls", title: "SIGNAL QUEUE", kind: "function", difficulty: 3, xp: 200,
        brief: "First in, first out — the packet buffer.",
        prompt: "Define a class **Queue** with `enqueue(x)` (adds to the back), `dequeue()` (removes and returns the **front** item, or `null` when empty), and `size()` (number of items waiting). It is **FIFO**: the first item enqueued is the first dequeued.\n~~~js\nconst q = new Queue();\nq.enqueue(1); q.enqueue(2);\nq.dequeue()  // 1\nq.size()     // 1\n~~~",
        starter: "class Queue {\n  // TODO: constructor + enqueue + dequeue + size\n}",
        solution: "class Queue {\n  constructor() { this.items = []; }\n  enqueue(x) { this.items.push(x); }\n  dequeue() { return this.items.length === 0 ? null : this.items.shift(); }\n  size() { return this.items.length; }\n}",
        tests: [
        { name: "dequeues in FIFO order", code: "var q = new Queue();\nq.enqueue(1);\nq.enqueue(2);\nassert(q.dequeue() === 1, 'front first');\nassert(q.dequeue() === 2, 'then the next');" },
        { name: "size tracks pending items", code: "var q = new Queue();\nq.enqueue('a');\nq.enqueue('b');\nq.dequeue();\nassertEqual(q.size(), 1);" },
        { name: "empty dequeue returns null", code: "var q = new Queue();\nassertEqual(q.dequeue(), null);" },
        { name: "drains then refills", code: "var q = new Queue();\nq.enqueue(7);\nq.dequeue();\nassert(q.dequeue() === null, 'empty again after draining');\nq.enqueue(9);\nassert(q.dequeue() === 9 && q.size() === 0);" },
        { name: "instances are independent", code: "var a = new Queue(), b = new Queue();\na.enqueue(1);\nassert(b.size() === 0 && b.dequeue() === null, 'b has its own buffer');" }
        ],
        hint: "Back it with an array: enqueue pushes; dequeue returns null when empty else shift(); size is items.length.", lore: "Packets line up at the relay. The buffer spits them out in the order they arrived — no jumping the line."
      },
      {
        id: "js-wallet-cls", title: "CRED WALLET", kind: "function", difficulty: 3, xp: 210,
        brief: "Hold cred; refuse any overdraft.",
        prompt: "Define a class **Wallet** with `constructor(start = 0)`, `deposit(n)` (adds to the balance), `withdraw(n)` (returns `false` and changes **nothing** if `n` exceeds the balance, otherwise subtracts and returns `true`), and `balance()`.\n~~~js\nconst w = new Wallet(10);\nw.withdraw(4)   // true\nw.balance()     // 6\nw.withdraw(99)  // false  (balance unchanged)\n~~~",
        starter: "class Wallet {\n  // TODO: constructor + deposit + withdraw + balance\n}",
        solution: "class Wallet {\n  constructor(start = 0) { this.bal = start; }\n  deposit(n) { this.bal += n; }\n  withdraw(n) { if (n > this.bal) return false; this.bal -= n; return true; }\n  balance() { return this.bal; }\n}",
        tests: [
        { name: "deposit raises balance", code: "var w = new Wallet(10);\nw.deposit(5);\nassertEqual(w.balance(), 15);" },
        { name: "withdraw succeeds when funded", code: "var w = new Wallet(10);\nassert(w.withdraw(4) === true && w.balance() === 6);" },
        { name: "overdraft is refused", code: "var w = new Wallet(3);\nassert(w.withdraw(9) === false && w.balance() === 3, 'no change on refusal');" },
        { name: "default start is zero", code: "var w = new Wallet();\nassert(w.balance() === 0 && w.withdraw(1) === false);" },
        { name: "exact balance withdraws fully", code: "var w = new Wallet(5);\nassert(w.withdraw(5) === true && w.balance() === 0);" },
        { name: "instances are independent", code: "var a = new Wallet(100), b = new Wallet(0);\na.withdraw(50);\nassert(b.balance() === 0, 'b keeps its own balance');" }
        ],
        hint: "Store this.bal in the constructor; in withdraw guard with if (n > this.bal) return false before subtracting.", lore: "No overdraft in Night City. The wallet bounces you cold before it lets you go negative."
      }
  ]);

  add("jsm0b-regex", [
      {
        id: "js-maskdigits", title: "DIGIT REDACT", kind: "function", difficulty: 1, xp: 150,
        brief: "Black out every digit in the feed.",
        prompt: "Define **maskDigits(s)** returning `s` with **every digit** replaced by a `'#'`. Non-digits are untouched.\n~~~js\nmaskDigits('a1b2')      // 'a#b#'\nmaskDigits('CASE 0451') // 'CASE ####'\n~~~",
        starter: "function maskDigits(s) {\n  // TODO: replace each digit with '#'\n}",
        solution: "function maskDigits(s) {\n  return s.replace(/\\d/g, '#');\n}",
        tests: [
        { name: "masks digits", code: "assertEqual(maskDigits('a1b2'), 'a#b#');" },
        { name: "keeps letters/spaces", code: "assertEqual(maskDigits('CASE 0451'), 'CASE ####');" },
        { name: "no digits unchanged", code: "assertEqual(maskDigits('wired'), 'wired');" },
        { name: "empty stays empty", code: "assertEqual(maskDigits(''), '');" }
        ],
        hint: "s.replace(/\\\\d/g, '#') — the g flag hits every digit.", lore: "Scrub the IDs before the trace locks on."
      },
      {
        id: "js-istag", title: "HASHTAG GATE", kind: "function", difficulty: 2, xp: 175,
        brief: "Admit only clean lowercase hashtags.",
        prompt: "Define **isTag(s)** returning `true` only when `s` is a `#` followed by **one or more** lowercase letters or digits — and nothing else.\n~~~js\nisTag('#neo7')  // true\nisTag('#Neo')   // false (uppercase)\nisTag('#')      // false (needs 1+ chars)\nisTag('neo')    // false (no #)\n~~~",
        starter: "function isTag(s) {\n  // TODO: anchor ^#[a-z0-9]+$ and test it\n}",
        solution: "function isTag(s) {\n  return /^#[a-z0-9]+$/.test(s);\n}",
        tests: [
        { name: "valid tags", code: "assert(isTag('#neo7') === true && isTag('#abc') === true && isTag('#0') === true);" },
        { name: "uppercase rejected", code: "assertEqual(isTag('#Neo'), false);" },
        { name: "hash alone rejected", code: "assertEqual(isTag('#'), false);" },
        { name: "missing hash / empty", code: "assert(isTag('neo') === false && isTag('') === false);" }
        ],
        hint: "/^#[a-z0-9]+$/.test(s) — ^ and $ pin both ends, + means one-or-more.", lore: "Only the lowercase sigils open the channel."
      },
      {
        id: "js-countvowels", title: "VOWEL COUNTER", kind: "function", difficulty: 2, xp: 180,
        brief: "Tally the vowels, any case.",
        prompt: "Define **countVowels(s)** returning how many vowels (`a e i o u`, **case-insensitive**) are in `s`.\n~~~js\ncountVowels('Neo')   // 2\ncountVowels('AEIOU') // 5\ncountVowels('xyz')   // 0\n~~~",
        starter: "function countVowels(s) {\n  // TODO: match all vowels (case-insensitive) and count them\n}",
        solution: "function countVowels(s) {\n  return (s.match(/[aeiou]/gi) || []).length;\n}",
        tests: [
        { name: "mixed case", code: "assertEqual(countVowels('Neo'), 2);" },
        { name: "all five upper", code: "assertEqual(countVowels('AEIOU'), 5);" },
        { name: "no vowels", code: "assertEqual(countVowels('xyz'), 0);" },
        { name: "empty string", code: "assertEqual(countVowels(''), 0);" }
        ],
        hint: "(s.match(/[aeiou]/gi) || []).length — guard the null when there are none.", lore: "Strip the consonants; count what sings."
      },
      {
        id: "js-collapsespaces", title: "WHITESPACE CRUSH", kind: "function", difficulty: 3, xp: 200,
        brief: "Squeeze runs of whitespace into single gaps.",
        prompt: "Define **collapseSpaces(s)** that replaces every run of whitespace with a single space `' '`, then trims the ends.\nA blank or whitespace-only string returns `''`.\n~~~js\ncollapseSpaces('  hack   the  planet ')  // 'hack the planet'\ncollapseSpaces('   ')                    // ''\n~~~",
        starter: "function collapseSpaces(s) {\n  // TODO: collapse whitespace runs to one space, then trim\n}",
        solution: "function collapseSpaces(s) {\n  return s.replace(/\\s+/g, ' ').trim();\n}",
        tests: [
        { name: "collapses runs", code: "assertEqual(collapseSpaces('  hack   the  planet '), 'hack the planet');" },
        { name: "whitespace only", code: "assertEqual(collapseSpaces('   '), '');" },
        { name: "tabs and newlines", code: "assertEqual(collapseSpaces('a\\t\\tb\\nc'), 'a b c');" },
        { name: "empty string", code: "assertEqual(collapseSpaces(''), '');" },
        { name: "already clean", code: "assertEqual(collapseSpaces('neo'), 'neo');" }
        ],
        hint: "s.replace(/\\\\s+/g, ' ').trim() — \\\\s+ is one-or-more whitespace.", lore: "Compress the dead air; keep the signal tight."
      },
      {
        id: "js-extractnums", title: "NUMBER HARVEST", kind: "function", difficulty: 3, xp: 200,
        brief: "Pull every number out of the noise.",
        prompt: "Define **extractNumbers(s)** returning an array of all runs of digits as **numbers**, in order. No digits → empty array.\n~~~js\nextractNumbers('a12b3')  // [12, 3]\nextractNumbers('none')   // []\n~~~",
        starter: "function extractNumbers(s) {\n  // TODO: match all digit runs, convert to numbers\n}",
        solution: "function extractNumbers(s) {\n  const m = s.match(/\\d+/g);\n  return m ? m.map(Number) : [];\n}",
        tests: [
        { name: "pulls numbers", code: "assertEqual(extractNumbers('a12b3'), [12, 3]);" },
        { name: "none -> empty", code: "assertEqual(extractNumbers('none'), []);" },
        { name: "multi-digit", code: "assertEqual(extractNumbers('ip 192 then 8'), [192, 8]);" },
        { name: "empty string", code: "assertEqual(extractNumbers(''), []);" }
        ],
        hint: "s.match(/\\\\d+/g) returns matches or null; map(Number).", lore: "Sift the datastream for digits."
      }
  ]);

  add("jsm0c-json", [
      {
        id: "js-parsescore", title: "DECRYPT", kind: "function", difficulty: 1, xp: 150,
        brief: "Parse a JSON packet and read its score.",
        prompt: "A sensor sends its reading as a JSON **string** like `'{\"score\":42}'`. Define **parseScore(jsonStr)** that parses the string with `JSON.parse` and returns the value of the `score` field.\n~~~js\nparseScore('{\"score\":42}')   // 42\nparseScore('{\"score\":0}')    // 0\n~~~",
        starter: "function parseScore(jsonStr) {\n  // TODO: JSON.parse the string, return its score field\n}",
        solution: "function parseScore(jsonStr) {\n  const obj = JSON.parse(jsonStr);\n  return obj.score;\n}",
        tests: [
        { name: "reads score 42", code: "assertEqual(parseScore('{\"score\":42}'), 42, 'should parse score 42');" },
        { name: "reads score 0", code: "assertEqual(parseScore('{\"score\":0}'), 0, 'should parse score 0');" },
        { name: "ignores other fields", code: "assertEqual(parseScore('{\"id\":7,\"score\":99}'), 99, 'should pick score, not id');" },
        { name: "handles spaced json", code: "assertEqual(parseScore('{ \"score\" : 13 }'), 13, 'should parse spaced json');" }
        ],
        hint: "const obj = JSON.parse(jsonStr); return obj.score;", lore: "Crack the packet's seal and the score bleeds out in plaintext."
      },
      {
        id: "js-sumfield", title: "TALLY CORE", kind: "function", difficulty: 2, xp: 170,
        brief: "Reduce a column of records to one total.",
        prompt: "`records` is an array of objects. Define **sumField(records, key)** that returns the sum of the numeric value at `key` across every record. An empty array totals `0`.\n~~~js\nsumField([{n:1},{n:2},{n:3}], 'n')   // 6\nsumField([], 'n')                    // 0\n~~~",
        starter: "function sumField(records, key) {\n  // TODO: reduce the records, summing each record[key]\n}",
        solution: "function sumField(records, key) {\n  return records.reduce(function (acc, r) { return acc + r[key]; }, 0);\n}",
        tests: [
        { name: "sums three records", code: "assertEqual(sumField([{n:1},{n:2},{n:3}], 'n'), 6, 'should sum to 6');" },
        { name: "empty -> 0", code: "assertEqual(sumField([], 'n'), 0, 'empty array should total 0');" },
        { name: "sums by chosen key", code: "assertEqual(sumField([{hp:10},{hp:5},{hp:25}], 'hp'), 40, 'should sum hp to 40');" },
        { name: "single record", code: "assertEqual(sumField([{watts:7}], 'watts'), 7, 'single record sums to 7');" }
        ],
        hint: "records.reduce((acc, r) => acc + r[key], 0)", lore: "The tally core melts a whole ledger column into a single glowing number."
      },
      {
        id: "js-averagefield", title: "MEAN FILTER", kind: "function", difficulty: 2, xp: 180,
        brief: "Average a field across all records.",
        prompt: "`records` is an array of objects. Define **averageField(records, key)** that returns the mean (average) of the value at `key`. Sum the field, then divide by the record count. An empty array returns `0` (never divide by zero).\n~~~js\naverageField([{n:2},{n:4},{n:6}], 'n')   // 4\naverageField([], 'n')                    // 0\n~~~",
        starter: "function averageField(records, key) {\n  // TODO: return the mean of record[key]; empty -> 0\n}",
        solution: "function averageField(records, key) {\n  if (records.length === 0) return 0;\n  const total = records.reduce(function (acc, r) { return acc + r[key]; }, 0);\n  return total / records.length;\n}",
        tests: [
        { name: "averages to 4", code: "assertEqual(averageField([{n:2},{n:4},{n:6}], 'n'), 4, 'mean should be 4');" },
        { name: "empty -> 0", code: "assertEqual(averageField([], 'n'), 0, 'empty array should average 0');" },
        { name: "fractional mean", code: "assertEqual(averageField([{v:1},{v:2}], 'v'), 1.5, 'mean should be 1.5');" },
        { name: "single record", code: "assertEqual(averageField([{ping:50}], 'ping'), 50, 'single record averages itself');" }
        ],
        hint: "Guard length 0, then sum / records.length.", lore: "The mean filter smooths a thousand noisy pings into one steady reading."
      },
      {
        id: "js-countbyfield", title: "CENSUS", kind: "function", difficulty: 3, xp: 200,
        brief: "Tally records by a field.",
        prompt: "`records` is an array of objects. Define **countByField(records, key)** returning an object mapping each distinct value at `key` to the count of records having it. An empty array returns `{}`.\n~~~js\ncountByField([{c:'a'},{c:'b'},{c:'a'}], 'c')  // { a: 2, b: 1 }\n~~~",
        starter: "function countByField(records, key) {\n  // TODO\n}",
        solution: "function countByField(records, key) {\n  const out = {};\n  for (const r of records) { const v = r[key]; out[v] = (out[v] || 0) + 1; }\n  return out;\n}",
        tests: [
        { name: "counts by value", code: "assertEqual(countByField([{c:'a'},{c:'b'},{c:'a'}], 'c'), { a: 2, b: 1 });" },
        { name: "empty -> {}", code: "assertEqual(countByField([], 'c'), {});" },
        { name: "single bucket", code: "assertEqual(countByField([{t:'x'},{t:'x'}], 't'), { x: 2 });" },
        { name: "three distinct factions", code: "assertEqual(countByField([{f:'zion'},{f:'agent'},{f:'zion'},{f:'oracle'}], 'f'), { zion: 2, agent: 1, oracle: 1 });" }
        ],
        hint: "out[v] = (out[v] || 0) + 1 in a loop.", lore: "Headcount the datastream, faction by faction."
      },
      {
        id: "js-maxbyfield", title: "APEX SCAN", kind: "function", difficulty: 3, xp: 210,
        brief: "Find the record topping a field.",
        prompt: "`records` is an array of objects. Define **maxByField(records, key)** that returns the whole record whose value at `key` is the largest. On an empty array, return `null`.\n~~~js\nmaxByField([{name:'a',hp:5},{name:'b',hp:9}], 'hp')  // {name:'b',hp:9}\nmaxByField([], 'hp')                                 // null\n~~~",
        starter: "function maxByField(records, key) {\n  // TODO: return the record with the largest record[key]; empty -> null\n}",
        solution: "function maxByField(records, key) {\n  if (records.length === 0) return null;\n  let best = records[0];\n  for (const r of records) { if (r[key] > best[key]) best = r; }\n  return best;\n}",
        tests: [
        { name: "picks highest hp", code: "assertEqual(maxByField([{name:'a',hp:5},{name:'b',hp:9}], 'hp'), {name:'b',hp:9});" },
        { name: "empty -> null", code: "assertEqual(maxByField([], 'hp'), null);" },
        { name: "single record", code: "assertEqual(maxByField([{id:1,v:7}], 'v'), {id:1,v:7});" },
        { name: "max in the middle", code: "assertEqual(maxByField([{v:3},{v:42},{v:8}], 'v'), {v:42});" },
        { name: "keeps first on tie", code: "assertEqual(maxByField([{tag:'x',v:5},{tag:'y',v:5}], 'v'), {tag:'x',v:5});" }
        ],
        hint: "Guard empty -> null, seed best = records[0], loop keeping the larger record[key].", lore: "The apex scan locks onto the strongest signal in the swarm and ignores the rest."
      }
  ]);

  add("jsm0d-sort", [
      {
        id: "js-sortasc", title: "ASCENDING SWEEP", kind: "function", difficulty: 1, xp: 150,
        brief: "Order the signal low to high.",
        prompt: "Define **sortAsc(nums)** returning a NEW array sorted numerically ascending. Don't mutate the input.\n~~~js\nsortAsc([3,1,2])    // [1,2,3]\nsortAsc([10,9,100]) // [9,10,100]  (numeric, not '10' < '100' < '9')\n~~~",
        starter: "function sortAsc(nums) {\n  // TODO: copy, then sort with a numeric comparator\n}",
        solution: "function sortAsc(nums) {\n  return nums.slice().sort(function (a, b) { return a - b; });\n}",
        tests: [
        { name: "sorts ascending", code: "assertEqual(sortAsc([3,1,2]), [1,2,3]);" },
        { name: "numeric not lexical", code: "assertEqual(sortAsc([10,9,100]), [9,10,100]);" },
        { name: "handles negatives", code: "assertEqual(sortAsc([0,-5,3,-1]), [-5,-1,0,3]);" },
        { name: "empty stays empty", code: "assertEqual(sortAsc([]), []);" },
        { name: "does not mutate", code: "var src = [2,1];\nsortAsc(src);\nassertEqual(src, [2,1]);" }
        ],
        hint: "nums.slice().sort((a,b) => a - b)", lore: "Default sort is alphabetical — give it a comparator and the stream lines up."
      },
      {
        id: "js-median", title: "MIDPOINT LOCK", kind: "function", difficulty: 2, xp: 170,
        brief: "Find the value dead-center in the data.",
        prompt: "Define **median(nums)** returning the middle value of the sorted numbers. If the length is even, return the **average of the two middle values**. An empty array returns **0**. Don't mutate the input.\n~~~js\nmedian([3,1,2])     // 2\nmedian([4,1,3,2])   // 2.5  (average of 2 and 3)\nmedian([])          // 0\n~~~",
        starter: "function median(nums) {\n  // TODO: sort a copy numerically, then pick the middle\n}",
        solution: "function median(nums) {\n  if (nums.length === 0) { return 0; }\n  var s = nums.slice().sort(function (a, b) { return a - b; });\n  var mid = Math.floor(s.length / 2);\n  if (s.length % 2 === 1) { return s[mid]; }\n  return (s[mid - 1] + s[mid]) / 2;\n}",
        tests: [
        { name: "odd length middle", code: "assertEqual(median([3,1,2]), 2);" },
        { name: "even length averages", code: "assertEqual(median([4,1,3,2]), 2.5);" },
        { name: "single value", code: "assertEqual(median([7]), 7);" },
        { name: "empty -> 0", code: "assertEqual(median([]), 0);" },
        { name: "unsorted even", code: "assertEqual(median([10,2,8,4]), 6);" },
        { name: "does not mutate", code: "var src = [3,1,2];\nmedian(src);\nassertEqual(src, [3,1,2]);" }
        ],
        hint: "Sort a copy, take Math.floor(len/2); for even length average s[mid-1] and s[mid].", lore: "Half the readings sit above, half below. The midpoint is the truth."
      },
      {
        id: "js-sortbylength", title: "SHORTEST FIRST", kind: "function", difficulty: 2, xp: 175,
        brief: "Queue the strings by size, stable on ties.",
        prompt: "Define **sortByLength(words)** returning a NEW array sorted ascending by **string length**. Strings of equal length keep their original input order (stable). Don't mutate the input.\n~~~js\nsortByLength(['ccc','a','bb'])      // ['a','bb','ccc']\nsortByLength(['bb','dd','a','cc'])   // ['a','bb','dd','cc']  (ties keep order)\n~~~",
        starter: "function sortByLength(words) {\n  // TODO: copy, then sort by length with a numeric comparator\n}",
        solution: "function sortByLength(words) {\n  return words.slice().sort(function (a, b) { return a.length - b.length; });\n}",
        tests: [
        { name: "sorts by length", code: "assertEqual(sortByLength(['ccc','a','bb']), ['a','bb','ccc']);" },
        { name: "stable on ties", code: "assertEqual(sortByLength(['bb','dd','a','cc']), ['a','bb','dd','cc']);" },
        { name: "includes empty string", code: "assertEqual(sortByLength(['ab','','x']), ['','x','ab']);" },
        { name: "empty stays empty", code: "assertEqual(sortByLength([]), []);" },
        { name: "does not mutate", code: "var src = ['ccc','a','bb'];\nsortByLength(src);\nassertEqual(src, ['ccc','a','bb']);" }
        ],
        hint: "words.slice().sort((a,b) => a.length - b.length) — V8's sort is stable for equal keys.", lore: "Shortest packets clear the gate first; equal sizes hold their slot in line."
      },
      {
        id: "js-secondlargest", title: "RUNNER-UP", kind: "function", difficulty: 3, xp: 200,
        brief: "Find the second-highest distinct signal.",
        prompt: "Define **secondLargest(nums)** returning the **2nd largest distinct** value. Repeated values count once. If there are fewer than 2 distinct values, return **null**. Don't mutate the input.\n~~~js\nsecondLargest([3,1,2])    // 2\nsecondLargest([5,5,4])    // 4  (5 counts once)\nsecondLargest([7,7,7])    // null\n~~~",
        starter: "function secondLargest(nums) {\n  // TODO: drop duplicates, sort descending, take index 1\n}",
        solution: "function secondLargest(nums) {\n  var distinct = [];\n  var seen = new Set();\n  for (var i = 0; i < nums.length; i++) {\n    if (!seen.has(nums[i])) { seen.add(nums[i]); distinct.push(nums[i]); }\n  }\n  if (distinct.length < 2) { return null; }\n  distinct.sort(function (a, b) { return b - a; });\n  return distinct[1];\n}",
        tests: [
        { name: "plain runner-up", code: "assertEqual(secondLargest([3,1,2]), 2);" },
        { name: "ignores duplicates", code: "assertEqual(secondLargest([5,5,4]), 4);" },
        { name: "all same -> null", code: "assertEqual(secondLargest([7,7,7]), null);" },
        { name: "single value -> null", code: "assertEqual(secondLargest([9]), null);" },
        { name: "empty -> null", code: "assertEqual(secondLargest([]), null);" },
        { name: "negatives", code: "assertEqual(secondLargest([-1,-2,-3]), -2);" },
        { name: "does not mutate", code: "var src = [5,5,4];\nsecondLargest(src);\nassertEqual(src, [5,5,4]);" }
        ],
        hint: "Collect distinct values into a Set-backed array, sort descending, return index 1 (or null if fewer than 2).", lore: "The throne's taken — but who's next in line? Strip the clones and read second place."
      },
      {
        id: "js-bottomn", title: "WEAKEST LINKS", kind: "function", difficulty: 3, xp: 210,
        brief: "Pull the n smallest readings, low to high.",
        prompt: "Define **bottomN(nums, n)** returning a NEW array of the **n smallest** values in **ascending** order. If n is 0 or less, return `[]`. If n exceeds the length, return all values sorted. Don't mutate the input.\n~~~js\nbottomN([5,3,9,1], 2)  // [1,3]\nbottomN([5,3,9,1], 0)  // []\nbottomN([2,1], 9)      // [1,2]\n~~~",
        starter: "function bottomN(nums, n) {\n  // TODO: sort a copy ascending, then take the first n\n}",
        solution: "function bottomN(nums, n) {\n  if (n <= 0) { return []; }\n  return nums.slice().sort(function (a, b) { return a - b; }).slice(0, n);\n}",
        tests: [
        { name: "two smallest", code: "assertEqual(bottomN([5,3,9,1], 2), [1,3]);" },
        { name: "n zero -> empty", code: "assertEqual(bottomN([5,3,9,1], 0), []);" },
        { name: "n exceeds length", code: "assertEqual(bottomN([2,1], 9), [1,2]);" },
        { name: "negative n -> empty", code: "assertEqual(bottomN([4,2,6], -1), []);" },
        { name: "negatives sorted", code: "assertEqual(bottomN([0,-3,2,-1], 3), [-3,-1,0]);" },
        { name: "does not mutate", code: "var src = [5,3,9,1];\nbottomN(src, 2);\nassertEqual(src, [5,3,9,1]);" }
        ],
        hint: "nums.slice().sort((a,b) => a - b).slice(0, n) — guard n <= 0 first.", lore: "Triage runs bottom-up: the faintest signals get flagged before they flatline."
      }
  ]);

  add("jsm0e-search", [
      {
        id: "js-contains", title: "ICE PROBE", kind: "function", difficulty: 2, xp: 180,
        brief: "Is the key inside the sorted vault?",
        prompt: "`sorted` is ascending. Define **contains(sorted, x)** returning `true`/`false` using **binary search** (halve the range each step).\n~~~js\ncontains([1, 3, 5, 7], 5)  // true\ncontains([1, 3, 5, 7], 4)  // false\n~~~",
        starter: "function contains(sorted, x) {\n  // TODO: lo/hi pointers, halve each step\n}",
        solution: "function contains(sorted, x) {\n  let lo = 0, hi = sorted.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (sorted[mid] === x) return true;\n    if (sorted[mid] < x) lo = mid + 1; else hi = mid - 1;\n  }\n  return false;\n}",
        tests: [
        { name: "present", code: "assert(contains([1, 3, 5, 7], 5) === true && contains([1, 3, 5, 7], 1) === true);" },
        { name: "absent", code: "assert(contains([1, 3, 5, 7], 4) === false && contains([], 9) === false);" },
        { name: "ends", code: "assert(contains([2, 4, 6], 6) === true && contains([2, 4, 6], 7) === false);" },
        { name: "single element", code: "assert(contains([8], 8) === true && contains([8], 3) === false);" }
        ],
        hint: "lo<=hi loop; compare midpoint; move lo or hi.", lore: "Halve the search space until the ICE cracks."
      },
      {
        id: "js-countocc", title: "SIGNAL TALLY", kind: "function", difficulty: 2, xp: 180,
        brief: "Count how many times the ping repeats.",
        prompt: "Define **countOccurrences(arr, x)** returning how many times `x` appears in `arr`. A single left-to-right scan is fine.\n~~~js\ncountOccurrences([1, 2, 2, 3, 2], 2)  // 3\ncountOccurrences([1, 2, 3], 5)        // 0\n~~~",
        starter: "function countOccurrences(arr, x) {\n  // TODO: tally each match\n}",
        solution: "function countOccurrences(arr, x) {\n  let count = 0;\n  for (const v of arr) {\n    if (v === x) count++;\n  }\n  return count;\n}",
        tests: [
        { name: "counts repeats", code: "assertEqual(countOccurrences([1, 2, 2, 3, 2], 2), 3);" },
        { name: "missing -> 0", code: "assertEqual(countOccurrences([1, 2, 3], 5), 0);" },
        { name: "strings", code: "assertEqual(countOccurrences(['a', 'b', 'a'], 'a'), 2);" },
        { name: "all match", code: "assertEqual(countOccurrences([7, 7, 7], 7), 3);" },
        { name: "empty -> 0", code: "assertEqual(countOccurrences([], 9), 0);" }
        ],
        hint: "Start a counter at 0 and add 1 for every value equal to x.", lore: "Every echo of the signal logged on the tally board."
      },
      {
        id: "js-firstindex", title: "FIRST TRACE", kind: "function", difficulty: 3, xp: 200,
        brief: "Pin the first slot holding the target.",
        prompt: "Define **firstIndex(arr, x)** returning the index of the **first** element equal to `x`, or **-1** if none. Write the loop yourself — no `indexOf`.\n~~~js\nfirstIndex([5, 3, 5, 7], 5)  // 0\nfirstIndex([1, 2, 3], 9)     // -1\n~~~",
        starter: "function firstIndex(arr, x) {\n  // TODO: scan and return the first matching index, else -1\n}",
        solution: "function firstIndex(arr, x) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === x) return i;\n  }\n  return -1;\n}",
        tests: [
        { name: "first wins", code: "assertEqual(firstIndex([5, 3, 5, 7], 5), 0);" },
        { name: "middle hit", code: "assertEqual(firstIndex([1, 2, 3], 3), 2);" },
        { name: "strings", code: "assertEqual(firstIndex(['a', 'b', 'c'], 'c'), 2);" },
        { name: "not found -> -1", code: "assertEqual(firstIndex([1, 2, 3], 9), -1);" },
        { name: "empty -> -1", code: "assertEqual(firstIndex([], 1), -1);" }
        ],
        hint: "Loop by index; return i on the first match; return -1 after the loop.", lore: "The scanner stops at the first slot that lights up."
      },
      {
        id: "js-kthsmallest", title: "RANK CIPHER", kind: "function", difficulty: 3, xp: 210,
        brief: "Pull the k-th smallest from the heap.",
        prompt: "Define **kthSmallest(arr, k)** returning the **k-th smallest** value (1-based) by sorting a **copy** of the array ascending. `arr` always has at least `k` numbers. Do not mutate the input.\n~~~js\nkthSmallest([3, 1, 2], 1)     // 1\nkthSmallest([5, 5, 2, 8], 2)  // 5\n~~~",
        starter: "function kthSmallest(arr, k) {\n  // TODO: sort a copy ascending, then take position k\n}",
        solution: "function kthSmallest(arr, k) {\n  const copy = arr.slice().sort((a, b) => a - b);\n  return copy[k - 1];\n}",
        tests: [
        { name: "smallest (k=1)", code: "assertEqual(kthSmallest([3, 1, 2], 1), 1);" },
        { name: "largest (k=n)", code: "assertEqual(kthSmallest([3, 1, 2], 3), 3);" },
        { name: "with duplicates + no mutation", code: "const a = [5, 5, 2, 8]; assertEqual(kthSmallest(a, 2), 5); assertEqual(a, [5, 5, 2, 8]);" },
        { name: "negatives", code: "assertEqual(kthSmallest([-1, -5, 3], 1), -5);" },
        { name: "single element", code: "assertEqual(kthSmallest([10], 1), 10);" }
        ],
        hint: "arr.slice().sort((a,b)=>a-b) then index k-1 — slice keeps the original intact.", lore: "Sort the stolen keys; the k-th one unlocks the rank cipher."
      },
      {
        id: "js-findpeak", title: "SIGNAL CREST", kind: "function", difficulty: 3, xp: 200,
        brief: "Find a slot no lower than its neighbors.",
        prompt: "Define **findPeakIndex(arr)** returning the index of the **first** element that is `>=` both its neighbors (edges count, comparing only the side that exists). `arr` has at least one element, so a peak always exists.\n~~~js\nfindPeakIndex([1, 3, 2])  // 1\nfindPeakIndex([5, 4, 3])  // 0\n~~~",
        starter: "function findPeakIndex(arr) {\n  // TODO: return first index >= its existing neighbors\n}",
        solution: "function findPeakIndex(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n; i++) {\n    const okLeft = i === 0 || arr[i] >= arr[i - 1];\n    const okRight = i === n - 1 || arr[i] >= arr[i + 1];\n    if (okLeft && okRight) return i;\n  }\n  return -1;\n}",
        tests: [
        { name: "interior peak", code: "assertEqual(findPeakIndex([1, 3, 2]), 1);" },
        { name: "descending -> first", code: "assertEqual(findPeakIndex([5, 4, 3]), 0);" },
        { name: "ascending -> last", code: "assertEqual(findPeakIndex([1, 2, 3]), 2);" },
        { name: "plateau counts", code: "assertEqual(findPeakIndex([2, 2, 1]), 0);" },
        { name: "single element", code: "assertEqual(findPeakIndex([7]), 0);" }
        ],
        hint: "Scan left to right; an element is a peak when it's >= every neighbor that exists.", lore: "Climb the signal until no neighbor rises above the crest."
      }
  ]);

  add("jsm0f-stralgo", [
      {
        id: "js-normalize", title: "SIGNAL NORMALIZE", kind: "function", difficulty: 2, xp: 180,
        brief: "Clean a noisy transmission: lowercase, trim, collapse the gaps.",
        prompt: "Define **normalize(s)** that lower-cases the text, trims the ends, and collapses every run of internal whitespace down to a single space.\n~~~js\nnormalize('  Hello   WORLD ')  // 'hello world'\nnormalize('JACK   IN')         // 'jack in'\n~~~",
        starter: "function normalize(s) {\n  // TODO: lowercase, trim, then squeeze runs of whitespace to one space\n}",
        solution: "function normalize(s) {\n  return s.trim().toLowerCase().replace(/\\s+/g, ' ');\n}",
        tests: [
        { name: "lower and collapse", code: "assertEqual(normalize('  Hello   WORLD '), 'hello world', 'lowercase, trim, single spaces');" },
        { name: "multiple gaps", code: "assertEqual(normalize('JACK   IN'), 'jack in', 'internal run becomes one space');" },
        { name: "single word", code: "assertEqual(normalize('  Neo  '), 'neo', 'trim and lowercase one word');" },
        { name: "empty string", code: "assertEqual(normalize(''), '', 'empty stays empty');" }
        ],
        hint: "s.trim().toLowerCase().replace(/\\s+/g, ' ')", lore: "Raw feeds are full of jitter. Normalize before you parse."
      },
      {
        id: "js-longword", title: "LONGEST CALLSIGN", kind: "function", difficulty: 2, xp: 180,
        brief: "Find the longest space-separated word in a string.",
        prompt: "Define **longestWord(s)** that returns the longest space-separated word. On a tie, return the **first** word that reaches the maximum length.\n~~~js\nlongestWord('hack the planet')   // 'planet'\nlongestWord('neo trinity tank')  // 'trinity'\n~~~",
        starter: "function longestWord(s) {\n  // TODO: split on spaces, keep the longest (first wins ties)\n}",
        solution: "function longestWord(s) {\n  var words = s.split(' ');\n  var best = '';\n  for (var i = 0; i < words.length; i++) {\n    if (words[i].length > best.length) { best = words[i]; }\n  }\n  return best;\n}",
        tests: [
        { name: "picks longest", code: "assertEqual(longestWord('hack the planet'), 'planet', 'planet is longest');" },
        { name: "middle word", code: "assertEqual(longestWord('neo trinity tank'), 'trinity', 'trinity beats the rest');" },
        { name: "tie keeps first", code: "assertEqual(longestWord('a bb cc'), 'bb', 'first word at max length wins');" },
        { name: "single word", code: "assertEqual(longestWord('solo'), 'solo', 'one word is the longest');" }
        ],
        hint: "Split on ' ', loop keeping a word only when length is strictly greater.", lore: "On a crowded channel, the longest callsign cuts through."
      },
      {
        id: "js-pangram", title: "PANGRAM PROBE", kind: "function", difficulty: 2, xp: 180,
        brief: "Check whether a line uses every letter of the alphabet.",
        prompt: "Define **isPangram(s)** returning `true` only if the string contains every letter **a-z** at least once, case-insensitively.\n~~~js\nisPangram('The quick brown fox jumps over the lazy dog')  // true\nisPangram('hello world')                                 // false\n~~~",
        starter: "function isPangram(s) {\n  // TODO: lowercase, then confirm a..z each appear at least once\n}",
        solution: "function isPangram(s) {\n  var t = s.toLowerCase();\n  for (var c = 97; c <= 122; c++) {\n    if (t.indexOf(String.fromCharCode(c)) === -1) { return false; }\n  }\n  return true;\n}",
        tests: [
        { name: "classic pangram", code: "assert(isPangram('The quick brown fox jumps over the lazy dog') === true, 'full alphabet is a pangram');" },
        { name: "missing letters", code: "assert(isPangram('hello world') === false, 'not every letter present');" },
        { name: "bare alphabet", code: "assert(isPangram('abcdefghijklmnopqrstuvwxyz') === true, 'exactly a-z counts');" },
        { name: "one letter short", code: "assert(isPangram('abcdefghijklmnopqrstuvwxy') === false, 'missing z fails');" }
        ],
        hint: "Lowercase, then loop char codes 97..122; if any indexOf is -1, return false.", lore: "A clean keymap test: every glyph must fire at least once."
      },
      {
        id: "js-freqchar", title: "DOMINANT GLYPH", kind: "function", difficulty: 3, xp: 200,
        brief: "Find the character that shows up the most, spaces excluded.",
        prompt: "Define **mostFrequentChar(s)** returning the character that appears most often, **ignoring spaces**. On a tie, return the character that **first** reaches the maximum count. Assume at least one non-space character.\n~~~js\nmostFrequentChar('aabbbc')  // 'b'\nmostFrequentChar('hello')   // 'l'\nmostFrequentChar('a b a')   // 'a'\n~~~",
        starter: "function mostFrequentChar(s) {\n  // TODO: tally each non-space char, track the first to hit the running max\n}",
        solution: "function mostFrequentChar(s) {\n  var counts = {};\n  var best = '';\n  var max = 0;\n  for (var i = 0; i < s.length; i++) {\n    var ch = s[i];\n    if (ch === ' ') { continue; }\n    counts[ch] = (counts[ch] || 0) + 1;\n    if (counts[ch] > max) { max = counts[ch]; best = ch; }\n  }\n  return best;\n}",
        tests: [
        { name: "clear winner", code: "assertEqual(mostFrequentChar('aabbbc'), 'b', 'b appears three times');" },
        { name: "double letter", code: "assertEqual(mostFrequentChar('hello'), 'l', 'l is the most frequent');" },
        { name: "ignores spaces", code: "assertEqual(mostFrequentChar('a b a'), 'a', 'spaces are not counted');" },
        { name: "single char", code: "assertEqual(mostFrequentChar('z'), 'z', 'only one character');" }
        ],
        hint: "Skip ' ', count in an object, and update best only when the new count is strictly greater than max.", lore: "Trace the traffic: one glyph always dominates the wire."
      },
      {
        id: "js-caesar", title: "CAESAR CIPHER", kind: "function", difficulty: 3, xp: 200,
        brief: "Shift the lowercase alphabet forward, wrapping past z.",
        prompt: "Define **caesar(s, n)** that shifts each lowercase letter a-z forward by `n` (wrapping z→a). Leave every other character unchanged. Assume `n` is 0..25.\n~~~js\ncaesar('abc', 1)   // 'bcd'\ncaesar('xyz', 3)   // 'abc'\ncaesar('a-b', 1)   // 'b-c'\n~~~",
        starter: "function caesar(s, n) {\n  // TODO: shift only a-z within 0..25, wrap with % 26, keep the rest\n}",
        solution: "function caesar(s, n) {\n  var out = '';\n  for (var i = 0; i < s.length; i++) {\n    var c = s.charCodeAt(i);\n    if (c >= 97 && c <= 122) { out += String.fromCharCode((c - 97 + n) % 26 + 97); }\n    else { out += s[i]; }\n  }\n  return out;\n}",
        tests: [
        { name: "shifts by one", code: "assertEqual(caesar('abc', 1), 'bcd', 'each letter moves forward one');" },
        { name: "wraps past z", code: "assertEqual(caesar('xyz', 3), 'abc', 'z wraps around to a');" },
        { name: "leaves others", code: "assertEqual(caesar('a-b', 1), 'b-c', 'non-letters untouched');" },
        { name: "rot thirteen", code: "assertEqual(caesar('hello', 13), 'uryyb', 'classic ROT13 of hello');" },
        { name: "zero shift", code: "assertEqual(caesar('abc', 0), 'abc', 'shift of zero changes nothing');" }
        ],
        hint: "For codes 97..122 use (c - 97 + n) % 26 + 97; otherwise copy the char.", lore: "Old crypto from a dead empire. Still fun to crack at runtime."
      }
  ]);

  add("jsm10-math", [
      {
        id: "js-lcm", title: "LEAST COMMON MULTIPLE", kind: "function", difficulty: 1, xp: 150,
        brief: "Smallest number divisible by both inputs.",
        prompt: "Define **lcm(a, b)** returning the least common multiple of two positive integers. Use the identity `a * b / gcd(a, b)`.\n~~~js\nlcm(4, 6)   // 12\nlcm(3, 5)   // 15\n~~~",
        starter: "function lcm(a, b) {\n  // TODO: divide the product by the gcd\n}",
        solution: "function lcm(a, b) {\n  function gcd(x, y) { return y === 0 ? x : gcd(y, x % y); }\n  return a / gcd(a, b) * b;\n}",
        tests: [
        { name: "lcm(4,6) = 12", code: "assertEqual(lcm(4, 6), 12);" },
        { name: "coprime multiplies", code: "assertEqual(lcm(3, 5), 15);" },
        { name: "lcm(12,18) = 36", code: "assertEqual(lcm(12, 18), 36);" },
        { name: "shared factor", code: "assertEqual(lcm(6, 6), 6);" }
        ],
        hint: "Compute gcd first, then a / gcd(a,b) * b avoids overflow.", lore: "Two clock cycles realign only at their shared beat."
      },
      {
        id: "js-digitalroot", title: "DIGITAL ROOT", kind: "function", difficulty: 2, xp: 170,
        brief: "Collapse a number to a single digit.",
        prompt: "Define **digitalRoot(n)** that repeatedly sums the digits of `n` (n >= 0) until a single digit remains.\n~~~js\ndigitalRoot(942)  // 9+4+2=15 -> 1+5=6\ndigitalRoot(0)    // 0\n~~~",
        starter: "function digitalRoot(n) {\n  // TODO: loop until n is a single digit\n}",
        solution: "function digitalRoot(n) {\n  while (n >= 10) {\n    let s = 0;\n    while (n > 0) { s += n % 10; n = Math.floor(n / 10); }\n    n = s;\n  }\n  return n;\n}",
        tests: [
        { name: "942 -> 6", code: "assertEqual(digitalRoot(942), 6);" },
        { name: "single digit stays", code: "assert(digitalRoot(0) === 0 && digitalRoot(7) === 7);" },
        { name: "99 -> 9", code: "assertEqual(digitalRoot(99), 9);" }
        ],
        hint: "Outer loop while n>=10; inner loop sums digits.", lore: "Every number folds to one."
      },
      {
        id: "js-ispoweroftwo", title: "POWER OF TWO", kind: "function", difficulty: 2, xp: 170,
        brief: "Detect exact powers of two.",
        prompt: "Define **isPowerOfTwo(n)** returning `true` only when `n` is a positive power of two (1, 2, 4, 8, 16, ...).\n~~~js\nisPowerOfTwo(8)   // true\nisPowerOfTwo(6)   // false\n~~~",
        starter: "function isPowerOfTwo(n) {\n  // TODO: a power of two has exactly one set bit\n}",
        solution: "function isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
        tests: [
        { name: "1 is 2^0", code: "assert(isPowerOfTwo(1) === true);" },
        { name: "8 is a power", code: "assert(isPowerOfTwo(8) === true);" },
        { name: "1024 is a power", code: "assert(isPowerOfTwo(1024) === true);" },
        { name: "6 is not", code: "assert(isPowerOfTwo(6) === false);" },
        { name: "zero is not", code: "assert(isPowerOfTwo(0) === false);" }
        ],
        hint: "n > 0 AND (n & (n - 1)) === 0 clears the lone set bit.", lore: "Powers of two: a single lit bit in the dark register."
      },
      {
        id: "js-roundto", title: "ROUND TO PLACES", kind: "function", difficulty: 3, xp: 200,
        brief: "Round to a fixed number of decimals.",
        prompt: "Define **roundTo(n, places)** that rounds `n` to `places` decimal places and returns a Number. Scale up, round, scale back down.\n~~~js\nroundTo(3.14159, 2)  // 3.14\nroundTo(2.5, 0)      // 3\n~~~",
        starter: "function roundTo(n, places) {\n  // TODO: scale by 10**places, round, then unscale\n}",
        solution: "function roundTo(n, places) {\n  return Math.round(n * 10 ** places) / 10 ** places;\n}",
        tests: [
        { name: "pi to 2 places", code: "assertEqual(roundTo(3.14159, 2), 3.14);" },
        { name: "half rounds up", code: "assertEqual(roundTo(2.5, 0), 3);" },
        { name: "one place", code: "assertEqual(roundTo(123.456, 1), 123.5);" },
        { name: "rounds up to integer", code: "assertEqual(roundTo(9.999, 2), 10);" }
        ],
        hint: "Math.round(n * 10 ** places) / 10 ** places.", lore: "Trim the signal's noise to the decimals that matter."
      },
      {
        id: "js-sumdivisors", title: "SUM OF DIVISORS", kind: "function", difficulty: 3, xp: 200,
        brief: "Add up every divisor of n.",
        prompt: "Define **sumDivisors(n)** returning the sum of all positive divisors of `n` (n >= 1), including 1 and n itself.\n~~~js\nsumDivisors(6)   // 1+2+3+6 = 12\nsumDivisors(7)   // 1+7 = 8\n~~~",
        starter: "function sumDivisors(n) {\n  // TODO: add every i from 1..n that divides n\n}",
        solution: "function sumDivisors(n) {\n  let s = 0;\n  for (let i = 1; i <= n; i++) {\n    if (n % i === 0) s += i;\n  }\n  return s;\n}",
        tests: [
        { name: "1 has only itself", code: "assertEqual(sumDivisors(1), 1);" },
        { name: "perfect number 6", code: "assertEqual(sumDivisors(6), 12);" },
        { name: "12 -> 28", code: "assertEqual(sumDivisors(12), 28);" },
        { name: "prime 7 -> 8", code: "assertEqual(sumDivisors(7), 8);" }
        ],
        hint: "Loop i from 1 to n; when n % i === 0, add i to the total.", lore: "Tally a number's factors; if they sum to itself, it is perfect."
      }
  ]);
})();
