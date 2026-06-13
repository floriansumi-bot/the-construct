/* ============================================================
   curriculum-ts-pack-7.js — TYPESCRIPT expansion pack 7.
   Appends practice nodes to existing sectors (tsm01-annotate, tsm02-shapes, tsm03-generics, tsm04-enums, tsm05-unions, tsm06-records, tsm07-classes, tsm08-fntypes)
   to bring TypeScript toward Python parity. Auto-assembled from
   _verify/ts-gen/*.json and verified by _verify/verify-ts.js (real tsc
   transpile + V8 grade: every solution passes, every starter fails).
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;
  function add(modId, exs) {
    var m = t.modules.find(function (x) { return x.id === modId; });
    if (m) Array.prototype.push.apply(m.exercises, exs);
  }
  add("tsm01-annotate", [
      {
        id: "ts-greet", title: "HANDSHAKE", kind: "function", difficulty: 1, xp: 110,
        brief: "Open a channel by name.",
        prompt: "Define **greet(name: string): string** returning `hi ` followed by the name.\n~~~ts\ngreet('Spike') // 'hi Spike'\n~~~",
        starter: "function greet(name: string): string {\n  // TODO\n  return '';\n}",
        solution: "function greet(name: string): string {\n  return 'hi ' + name;\n}",
        tests: [
        { name: "greets Spike", code: "assertEqual(greet('Spike'), 'hi Spike');" },
        { name: "uses the arg", code: "assertEqual(greet('Ed'), 'hi Ed');" }
        ],
        hint: "return 'hi ' + name;", lore: "Channel open. Identify yourself, runner."
      },
      {
        id: "ts-adult", title: "AGE GATE", kind: "function", difficulty: 1, xp: 120,
        brief: "Boolean gate on a numeric threshold.",
        prompt: "Define **isAdult(age: number): boolean** that returns `true` when `age` is **18 or more**, else `false`.\n~~~ts\nisAdult(18) // true\nisAdult(17) // false\n~~~",
        starter: "function isAdult(age: number): boolean {\n  // TODO\n  return false;\n}",
        solution: "function isAdult(age: number): boolean {\n  return age >= 18;\n}",
        tests: [
        { name: "18 is adult", code: "assertEqual(isAdult(18), true);" },
        { name: "17 is not", code: "assertEqual(isAdult(17), false);" },
        { name: "well over", code: "assertEqual(isAdult(99), true);" }
        ],
        hint: "return age >= 18;", lore: "ICE checks your birthdate before the door unlocks."
      },
      {
        id: "ts-credits", title: "CREDIT TICKER", kind: "function", difficulty: 2, xp: 150,
        brief: "Format a number as currency with two decimals.",
        prompt: "Define **credits(n: number): string** returning `$` followed by `n` fixed to **two decimals**. Use `n.toFixed(2)`.\n~~~ts\ncredits(5) // '$5.00'\ncredits(2.5) // '$2.50'\n~~~",
        starter: "function credits(n: number): string {\n  // TODO\n  return '';\n}",
        solution: "function credits(n: number): string {\n  return '$' + n.toFixed(2);\n}",
        tests: [
        { name: "whole number", code: "assertEqual(credits(5), '$5.00');" },
        { name: "half credit", code: "assertEqual(credits(2.5), '$2.50');" },
        { name: "broke", code: "assertEqual(credits(0), '$0.00');" }
        ],
        hint: "return '$' + n.toFixed(2);", lore: "Your balance, jacked straight from the black market till."
      },
      {
        id: "ts-rank", title: "THREAT RANK", kind: "function", difficulty: 2, xp: 160,
        brief: "Map a union of literals to a numeric level.",
        prompt: "A **union of string literals** pins the input to an exact set. Define type **Priority = 'LOW' | 'MED' | 'HIGH'** and a function **rank(p: Priority): number** returning:\n- LOW -> 0\n- MED -> 1\n- HIGH -> 2\n~~~ts\nrank('HIGH') // 2\n~~~",
        starter: "type Priority = 'LOW' | 'MED' | 'HIGH';\nfunction rank(p: Priority): number {\n  // TODO\n  return -1;\n}",
        solution: "type Priority = 'LOW' | 'MED' | 'HIGH';\nfunction rank(p: Priority): number {\n  if (p === 'LOW') return 0;\n  if (p === 'MED') return 1;\n  return 2;\n}",
        tests: [
        { name: "LOW -> 0", code: "assertEqual(rank('LOW'), 0);" },
        { name: "MED -> 1", code: "assertEqual(rank('MED'), 1);" },
        { name: "HIGH -> 2", code: "assertEqual(rank('HIGH'), 2);" }
        ],
        hint: "Compare p against each literal with === and return 0, 1, or 2.", lore: "The grid colour-codes every soul it watches."
      },
      {
        id: "ts-flip", title: "KILL SWITCH", kind: "function", difficulty: 3, xp: 180,
        brief: "Invert a boolean and return the typed result.",
        prompt: "Define **flip(b: boolean): boolean** that returns the **opposite** of `b`. Use the `!` operator.\n~~~ts\nflip(true) // false\nflip(false) // true\n~~~",
        starter: "function flip(b: boolean): boolean {\n  // TODO\n  return b;\n}",
        solution: "function flip(b: boolean): boolean {\n  return !b;\n}",
        tests: [
        { name: "true flips to false", code: "assertEqual(flip(true), false);" },
        { name: "false flips to true", code: "assertEqual(flip(false), true);" },
        { name: "double flip is identity", code: "assertEqual(flip(flip(true)), true);" }
        ],
        hint: "return !b;", lore: "One toggle and the whole rig goes dark."
      }
  ]);

  add("tsm02-shapes", [
      {
        id: "ts-agentid", title: "AGENT BADGE", kind: "function", difficulty: 1, xp: 170,
        brief: "Stamp an agent's name and clearance level.",
        prompt: "Define `interface Agent { name: string; level: number }` and **label(a: Agent): string** returning `<name> L<level>` built with a **template literal**.\n~~~ts\nlabel({ name: 'Faye', level: 3 }) // 'Faye L3'\n~~~",
        starter: "interface Agent { name: string; level: number }\nfunction label(a: Agent): string {\n  // TODO: build `${name} L${level}` with a template literal\n  return '';\n}",
        solution: "interface Agent { name: string; level: number }\nfunction label(a: Agent): string {\n  return `${a.name} L${a.level}`;\n}",
        tests: [
        { name: "Faye L3", code: "assertEqual(label({ name: 'Faye', level: 3 }), 'Faye L3');" },
        { name: "reads both fields", code: "assertEqual(label({ name: 'Jet', level: 9 }), 'Jet L9');" },
        { name: "level zero", code: "assertEqual(label({ name: 'Ein', level: 0 }), 'Ein L0');" }
        ],
        hint: "return `${a.name} L${a.level}`; — the L sits between the two interpolations.", lore: "Every operator on the grid wears a badge. Yours just printed."
      },
      {
        id: "ts-topagent", title: "RANK SWEEP", kind: "function", difficulty: 2, xp: 170,
        brief: "Name the highest-level agent in the array.",
        prompt: "With `interface Agent { name: string; level: number }`, define **topAgent(agents: Agent[]): string** returning the **name** of the agent with the highest **level**. An **empty** array returns **''**.\n~~~ts\ntopAgent([{ name: 'Faye', level: 3 }, { name: 'Spike', level: 8 }]) // 'Spike'\ntopAgent([]) // ''\n~~~",
        starter: "interface Agent { name: string; level: number }\nfunction topAgent(agents: Agent[]): string {\n  // TODO: guard the empty array, then find the highest level\n  return '';\n}",
        solution: "interface Agent { name: string; level: number }\nfunction topAgent(agents: Agent[]): string {\n  if (agents.length === 0) return '';\n  let best = agents[0];\n  for (const a of agents) {\n    if (a.level > best.level) best = a;\n  }\n  return best.name;\n}",
        tests: [
        { name: "picks the highest level", code: "assertEqual(topAgent([{ name: 'Faye', level: 3 }, { name: 'Spike', level: 8 }]), 'Spike');" },
        { name: "keeps the first on a tie", code: "assertEqual(topAgent([{ name: 'Jet', level: 5 }, { name: 'Ed', level: 5 }]), 'Jet');" },
        { name: "single agent", code: "assertEqual(topAgent([{ name: 'Vicious', level: 7 }]), 'Vicious');" },
        { name: "empty -> empty string", code: "assertEqual(topAgent([]), '', 'no agents on the board means no name');" }
        ],
        hint: "Return '' first if the array is empty, then loop keeping the agent whose level is strictly greater.", lore: "Scan the bounty board. The biggest head sets the price."
      },
      {
        id: "ts-swap", title: "TUPLE FLIP", kind: "function", difficulty: 2, xp: 170,
        brief: "Flip a fixed-shape pair end for end.",
        prompt: "Define **swap(p: [string, number]): [number, string]** that returns a new tuple with the two slots **flipped**: the number first, the string second.\n~~~ts\nswap(['hp', 100]) // [100, 'hp']\n~~~",
        starter: "function swap(p: [string, number]): [number, string] {\n  // TODO: return the slots in the opposite order\n  return [0, ''];\n}",
        solution: "function swap(p: [string, number]): [number, string] {\n  return [p[1], p[0]];\n}",
        tests: [
        { name: "flips label and value", code: "assertEqual(swap(['hp', 100]), [100, 'hp']);" },
        { name: "another pair", code: "assertEqual(swap(['mp', 30]), [30, 'mp']);" },
        { name: "zero and empty label", code: "assertEqual(swap(['', 0]), [0, '']);" }
        ],
        hint: "return [p[1], p[0]]; — slot 1 (the number) goes first, slot 0 (the string) second.", lore: "Reverse the packet's header and payload. The router never noticed."
      },
      {
        id: "ts-tag", title: "CORE SUFFIX", kind: "function", difficulty: 3, xp: 170,
        brief: "Append a callsign suffix, defaulting to the core.",
        prompt: "Define **tag(name: string, suffix?: string): string** returning `name` with `suffix` appended. When `suffix` is **omitted**, default it to **'-CORE'** using the **`??`** operator.\n~~~ts\ntag('NODE')        // 'NODE-CORE'\ntag('NODE', '-7')  // 'NODE-7'\n~~~",
        starter: "function tag(name: string, suffix?: string): string {\n  // TODO: fall back to '-CORE' when suffix is missing\n  return name + (suffix ?? '');\n}",
        solution: "function tag(name: string, suffix?: string): string {\n  return name + (suffix ?? '-CORE');\n}",
        tests: [
        { name: "defaults to -CORE", code: "assertEqual(tag('NODE'), 'NODE-CORE', 'a missing suffix becomes -CORE');" },
        { name: "uses the given suffix", code: "assertEqual(tag('NODE', '-7'), 'NODE-7');" },
        { name: "empty string suffix is kept", code: "assertEqual(tag('NODE', ''), 'NODE', 'an empty string is present, so ?? does not replace it');" }
        ],
        hint: "return name + (suffix ?? '-CORE'); — ?? only falls back on null/undefined, so '' stays.", lore: "Unsigned packets get stamped -CORE and routed to the deep stack."
      },
      {
        id: "ts-manhattan", title: "GRID DISTANCE", kind: "function", difficulty: 3, xp: 170,
        brief: "Measure a point's taxi distance from the origin.",
        prompt: "Define `type Point = { x: number; y: number }` and **manhattan(p: Point): number** returning the **Manhattan distance** from the origin: `Math.abs(p.x) + Math.abs(p.y)`.\n~~~ts\nmanhattan({ x: 3, y: 4 })   // 7\nmanhattan({ x: -2, y: 5 })  // 7\n~~~",
        starter: "type Point = { x: number; y: number };\nfunction manhattan(p: Point): number {\n  // TODO: sum the absolute values of x and y\n  return 0;\n}",
        solution: "type Point = { x: number; y: number };\nfunction manhattan(p: Point): number {\n  return Math.abs(p.x) + Math.abs(p.y);\n}",
        tests: [
        { name: "3 + 4 = 7", code: "assertEqual(manhattan({ x: 3, y: 4 }), 7);" },
        { name: "absolute values", code: "assertEqual(manhattan({ x: -2, y: 5 }), 7);" },
        { name: "both negative", code: "assertEqual(manhattan({ x: -6, y: -1 }), 7);" },
        { name: "origin -> 0", code: "assertEqual(manhattan({ x: 0, y: 0 }), 0);" }
        ],
        hint: "return Math.abs(p.x) + Math.abs(p.y); — distance is never negative.", lore: "On the grid you move in right angles only. Count the blocks, not the line."
      }
  ]);

  add("tsm03-generics", [
      {
        id: "ts-firstof", title: "HEAD POINTER", kind: "function", difficulty: 2, xp: 190,
        brief: "Read the head of any stream, type preserved.",
        prompt: "Define a generic **firstOf<T>(xs: T[]): T | undefined** returning the first element, or `undefined` when the array is empty.\n~~~ts\nfirstOf([10, 20])    // 10\nfirstOf<string>([])  // undefined\n~~~",
        starter: "function firstOf<T>(xs: T[]): T | undefined {\n  // TODO: return xs[0], but undefined when empty\n  return undefined;\n}",
        solution: "function firstOf<T>(xs: T[]): T | undefined {\n  return xs.length ? xs[0] : undefined;\n}",
        tests: [
        { name: "numbers -> head", code: "assertEqual(firstOf([10, 20]), 10);" },
        { name: "strings -> head", code: "assertEqual(firstOf(['a', 'b', 'c']), 'a');" },
        { name: "single element", code: "assertEqual(firstOf([42]), 42);" },
        { name: "empty -> undefined", code: "assert(firstOf([]) === undefined);" }
        ],
        hint: "xs.length ? xs[0] : undefined", lore: "Same probe, any payload — the head of the queue answers first."
      },
      {
        id: "ts-identity", title: "ECHO CHAMBER", kind: "function", difficulty: 2, xp: 190,
        brief: "Return exactly what you were given, type intact.",
        prompt: "Define a generic **identity<T>(x: T): T** that simply returns its argument unchanged.\nIt is the simplest contract: hand it a `T`, get the *same* `T` back — not `any`.\n~~~ts\nidentity(7)        // 7\nidentity('Neo')    // 'Neo'\n~~~",
        starter: "function identity<T>(x: T): T {\n  // TODO: return the argument unchanged\n  return x === x ? (null as unknown as T) : x;\n}",
        solution: "function identity<T>(x: T): T {\n  return x;\n}",
        tests: [
        { name: "number passthrough", code: "assertEqual(identity(7), 7);" },
        { name: "string passthrough", code: "assertEqual(identity('Neo'), 'Neo');" },
        { name: "boolean passthrough", code: "assert(identity(true) === true);" },
        { name: "array passthrough (deep)", code: "assertEqual(identity([1, 2, 3]), [1, 2, 3]);" }
        ],
        hint: "There is nothing to compute — just return x.", lore: "The mirror adds nothing and loses nothing. Whatever enters, returns."
      },
      {
        id: "ts-repeat", title: "REPLICATOR", kind: "function", difficulty: 3, xp: 190,
        brief: "Stamp out n copies of any value into an array.",
        prompt: "Define a generic **repeat<T>(x: T, n: number): T[]** returning an array containing `x` repeated `n` times.\nWhen `n` is `0`, return an empty array `[]`.\n~~~ts\nrepeat('x', 3)   // ['x', 'x', 'x']\nrepeat(0, 0)     // []\n~~~",
        starter: "function repeat<T>(x: T, n: number): T[] {\n  // TODO: build an array of n copies of x\n  return [];\n}",
        solution: "function repeat<T>(x: T, n: number): T[] {\n  const out: T[] = [];\n  for (let i = 0; i < n; i++) out.push(x);\n  return out;\n}",
        tests: [
        { name: "string x3", code: "assertEqual(repeat('x', 3), ['x', 'x', 'x']);" },
        { name: "number x2", code: "assertEqual(repeat(9, 2), [9, 9]);" },
        { name: "n = 0 -> empty", code: "assertEqual(repeat('z', 0), []);" },
        { name: "n = 1 -> single", code: "assertEqual(repeat(true, 1), [true]);" }
        ],
        hint: "Start with an empty T[] and push x in a loop that runs n times.", lore: "Feed the replicator one pattern and a count; it prints the rest."
      },
      {
        id: "ts-swappair", title: "POLARITY FLIP", kind: "function", difficulty: 3, xp: 190,
        brief: "Swap a two-type tuple, tracking each slot's type.",
        prompt: "Define a generic **swapPair<A, B>(p: [A, B]): [B, A]** that returns a new tuple with the two slots exchanged.\nTwo type parameters keep each slot's type wired to the right position.\n~~~ts\nswapPair(['id', 42])   // [42, 'id']\nswapPair([true, 'on']) // ['on', true]\n~~~",
        starter: "function swapPair<A, B>(p: [A, B]): [B, A] {\n  // TODO: return the slots in swapped order\n  return [p[1], p[1]];\n}",
        solution: "function swapPair<A, B>(p: [A, B]): [B, A] {\n  return [p[1], p[0]];\n}",
        tests: [
        { name: "string/number", code: "assertEqual(swapPair(['id', 42]), [42, 'id']);" },
        { name: "boolean/string", code: "assertEqual(swapPair([true, 'on']), ['on', true]);" },
        { name: "number/number", code: "assertEqual(swapPair([1, 2]), [2, 1]);" },
        { name: "second slot preserved", code: "assertEqual(swapPair([0, 'tail'])[1], 0);" }
        ],
        hint: "Return [p[1], p[0]] — second slot first, first slot second.", lore: "Reverse the polarity: what led now trails, what trailed now leads."
      },
      {
        id: "ts-dropfirst", title: "BEHEAD STREAM", kind: "function", difficulty: 3, xp: 190,
        brief: "Return everything after the head, element type preserved.",
        prompt: "Define a generic **dropFirst<T>(xs: T[]): T[]** returning a new array with every element *except* the first.\nAn empty input yields an empty array `[]`.\n~~~ts\ndropFirst([1, 2, 3])      // [2, 3]\ndropFirst<number>([])     // []\n~~~",
        starter: "function dropFirst<T>(xs: T[]): T[] {\n  // TODO: return all elements after the first\n  return xs.slice(0);\n}",
        solution: "function dropFirst<T>(xs: T[]): T[] {\n  return xs.slice(1);\n}",
        tests: [
        { name: "numbers tail", code: "assertEqual(dropFirst([1, 2, 3]), [2, 3]);" },
        { name: "strings tail", code: "assertEqual(dropFirst(['a', 'b', 'c']), ['b', 'c']);" },
        { name: "single -> empty", code: "assertEqual(dropFirst([7]), []);" },
        { name: "empty -> empty", code: "assertEqual(dropFirst([]), []);" }
        ],
        hint: "xs.slice(1) keeps everything from index 1 onward.", lore: "Behead the stream and the body marches on without its lead packet."
      }
  ]);

  add("tsm04-enums", [
      {
        id: "ts-turnright", title: "COMPASS STEP", kind: "function", difficulty: 1, xp: 150,
        brief: "Rotate the heading 90 degrees clockwise.",
        prompt: "An **enum** names a fixed set of values. A numeric enum auto-numbers from 0.\nWith `enum Dir { N, E, S, W }` (0..3), define **turnRight(d: Dir): Dir** returning the next direction clockwise, wrapping W back to N.\n~~~ts\nturnRight(Dir.N) // Dir.E (1)\nturnRight(Dir.W) // Dir.N (0)\n~~~",
        starter: "enum Dir { N, E, S, W }\nfunction turnRight(d: Dir): Dir {\n  // TODO: step one slot clockwise, wrapping 3 -> 0\n  return d;\n}",
        solution: "enum Dir { N, E, S, W }\nfunction turnRight(d: Dir): Dir {\n  return (d + 1) % 4;\n}",
        tests: [
        { name: "N -> E", code: "assertEqual(turnRight(0), 1);" },
        { name: "S -> W", code: "assertEqual(turnRight(2), 3);" },
        { name: "wraps W -> N", code: "assertEqual(turnRight(3), 0);" }
        ],
        hint: "return (d + 1) % 4;", lore: "Box the compass, runner. Every turn is a quarter of the grid."
      },
      {
        id: "ts-levelrank", title: "CLEARANCE TIER", kind: "function", difficulty: 2, xp: 150,
        brief: "Map a string enum to a numeric rank.",
        prompt: "A **string enum** pins each name to an explicit text value.\nWith `enum Level { Low = 'LOW', Med = 'MED', High = 'HIGH' }`, define **rank(l: Level): number** returning:\n- Low -> 0\n- Med -> 1\n- High -> 2\n~~~ts\nrank(Level.High) // 2\n~~~",
        starter: "enum Level { Low = 'LOW', Med = 'MED', High = 'HIGH' }\nfunction rank(l: Level): number {\n  // TODO: Low 0, Med 1, High 2\n  return -1;\n}",
        solution: "enum Level { Low = 'LOW', Med = 'MED', High = 'HIGH' }\nfunction rank(l: Level): number {\n  if (l === Level.Low) return 0;\n  if (l === Level.Med) return 1;\n  return 2;\n}",
        tests: [
        { name: "Low -> 0", code: "assertEqual(rank('LOW'), 0);" },
        { name: "Med -> 1", code: "assertEqual(rank('MED'), 1);" },
        { name: "High -> 2", code: "assertEqual(rank('HIGH'), 2);" }
        ],
        hint: "Compare l to Level.Low / Level.Med with ===, else return 2.", lore: "The arcology sorts every keycard into a tier before the doors part."
      },
      {
        id: "ts-valueof", title: "COIN COUNTER", kind: "function", difficulty: 2, xp: 150,
        brief: "Read the number a coin enum already holds.",
        prompt: "Enum members can carry **explicit numbers**.\nWith `enum Coin { Penny = 1, Nickel = 5, Dime = 10 }`, define **valueOf(c: Coin): number** returning the coin's own value.\n~~~ts\nvalueOf(Coin.Nickel) // 5\n~~~",
        starter: "enum Coin { Penny = 1, Nickel = 5, Dime = 10 }\nfunction valueOf(c: Coin): number {\n  // TODO: the enum value already IS the number\n  return 0;\n}",
        solution: "enum Coin { Penny = 1, Nickel = 5, Dime = 10 }\nfunction valueOf(c: Coin): number {\n  return c;\n}",
        tests: [
        { name: "penny", code: "assertEqual(valueOf(1), 1);" },
        { name: "nickel", code: "assertEqual(valueOf(5), 5);" },
        { name: "dime", code: "assertEqual(valueOf(10), 10);" }
        ],
        hint: "return c;", lore: "Loose creds rattle in your pocket, each stamped with its own worth."
      },
      {
        id: "ts-opposite", title: "ABOUT FACE", kind: "function", difficulty: 2, xp: 150,
        brief: "Find the heading 180 degrees from the input.",
        prompt: "Reuse the compass. With `enum Dir { N, E, S, W }` (0..3), define **opposite(d: Dir): Dir** returning the heading directly behind you, wrapping around 4.\n~~~ts\nopposite(Dir.N) // Dir.S (2)\nopposite(Dir.E) // Dir.W (3)\n~~~",
        starter: "enum Dir { N, E, S, W }\nfunction opposite(d: Dir): Dir {\n  // TODO: two slots around the compass\n  return d;\n}",
        solution: "enum Dir { N, E, S, W }\nfunction opposite(d: Dir): Dir {\n  return (d + 2) % 4;\n}",
        tests: [
        { name: "N -> S", code: "assertEqual(opposite(0), 2);" },
        { name: "E -> W", code: "assertEqual(opposite(1), 3);" },
        { name: "S -> N", code: "assertEqual(opposite(2), 0);" },
        { name: "wraps W -> E", code: "assertEqual(opposite(3), 1);" }
        ],
        hint: "return (d + 2) % 4;", lore: "Turn your back on the grid and stare straight down the other way."
      },
      {
        id: "ts-issevere", title: "ALERT FLOOR", kind: "function", difficulty: 3, xp: 150,
        brief: "Compare against a named enum member.",
        prompt: "Enum members compare like the numbers they are.\nWith `enum Sev { Info, Warn, Error }` (0..2), define **isSevere(s: Sev): boolean** returning `true` when the level is **Warn or higher**. Compare against `Sev.Warn` rather than a raw number.\n~~~ts\nisSevere(Sev.Info) // false\nisSevere(Sev.Warn) // true\n~~~",
        starter: "enum Sev { Info, Warn, Error }\nfunction isSevere(s: Sev): boolean {\n  // TODO: true from Warn upward\n  return false;\n}",
        solution: "enum Sev { Info, Warn, Error }\nfunction isSevere(s: Sev): boolean {\n  return s >= Sev.Warn;\n}",
        tests: [
        { name: "Info is calm", code: "assertEqual(isSevere(0), false);" },
        { name: "Warn trips it", code: "assertEqual(isSevere(1), true);" },
        { name: "Error trips it", code: "assertEqual(isSevere(2), true);" }
        ],
        hint: "return s >= Sev.Warn;", lore: "Below the warning floor the console stays dark. Cross it and the room turns red."
      }
  ]);

  add("tsm05-unions", [
      {
        id: "ts-render", title: "SIGNAL FORMAT", kind: "function", difficulty: 2, xp: 180,
        brief: "Two payload types, one formatter.",
        prompt: "A `string | number` arrives. Define **render(x: string | number): string**. If `x` is a number return `'#' + x`; if it is a string return it **uppercased**. Use a `typeof` guard to narrow the union.\n~~~ts\nrender(7) // '#7'\nrender('hi') // 'HI'\n~~~",
        starter: "function render(x: string | number): string {\n  // TODO: narrow with typeof\n  return '';\n}",
        solution: "function render(x: string | number): string {\n  if (typeof x === 'number') return '#' + x;\n  return x.toUpperCase();\n}",
        tests: [
        { name: "number gets a hash", code: "assertEqual(render(7), '#7');" },
        { name: "string is uppercased", code: "assertEqual(render('hi'), 'HI');" },
        { name: "zero still hashes", code: "assertEqual(render(0), '#0');" }
        ],
        hint: "if (typeof x === 'number') return '#' + x; else return x.toUpperCase();", lore: "Narrow the beam before you trust the packet."
      },
      {
        id: "ts-sizeof", title: "PAYLOAD SIZE", kind: "function", difficulty: 2, xp: 190,
        brief: "One length probe, two shapes.",
        prompt: "Define **sizeOf(x: string | unknown[]): number** returning its `.length`. Both a string and an array expose `.length`, so the union resolves to one expression.\n~~~ts\nsizeOf('neon') // 4\nsizeOf([1, 2, 3]) // 3\n~~~",
        starter: "function sizeOf(x: string | unknown[]): number {\n  // TODO: return the length\n  return -1;\n}",
        solution: "function sizeOf(x: string | unknown[]): number {\n  return x.length;\n}",
        tests: [
        { name: "string length", code: "assertEqual(sizeOf('neon'), 4);" },
        { name: "array length", code: "assertEqual(sizeOf([1, 2, 3]), 3);" },
        { name: "empty string", code: "assertEqual(sizeOf(''), 0);" },
        { name: "empty array", code: "assertEqual(sizeOf([]), 0);" }
        ],
        hint: "return x.length;", lore: "Same ruler measures every signal on the wire."
      },
      {
        id: "ts-legs", title: "GAIT COUNT", kind: "function", difficulty: 3, xp: 230,
        brief: "Count limbs off a tagged union.",
        prompt: "A **discriminated union** tags each member with `kind`. Define **legsOf(a: { kind: 'dog'; legs: number } | { kind: 'snake' }): number**.\nSwitch on `a.kind`: a `'dog'` returns `a.legs`; a `'snake'` returns `0`.\n~~~ts\nlegsOf({ kind: 'dog', legs: 4 }) // 4\nlegsOf({ kind: 'snake' }) // 0\n~~~",
        starter: "function legsOf(a: { kind: 'dog'; legs: number } | { kind: 'snake' }): number {\n  // TODO: branch on a.kind\n  return -1;\n}",
        solution: "function legsOf(a: { kind: 'dog'; legs: number } | { kind: 'snake' }): number {\n  if (a.kind === 'dog') return a.legs;\n  return 0;\n}",
        tests: [
        { name: "dog reports its legs", code: "assertEqual(legsOf({ kind: 'dog', legs: 4 }), 4);" },
        { name: "snake has none", code: "assertEqual(legsOf({ kind: 'snake' }), 0);" },
        { name: "three-legged dog", code: "assertEqual(legsOf({ kind: 'dog', legs: 3 }), 3);" }
        ],
        hint: "if (a.kind === 'dog') return a.legs; else return 0;", lore: "The tag tells you which creature crawled onto the grid."
      },
      {
        id: "ts-idtext", title: "ID RESOLVER", kind: "function", difficulty: 3, xp: 230,
        brief: "A bare id or a wrapper carrying one.",
        prompt: "Define **idText(x: number | { id: number }): string** returning `'ID:'` followed by the id. If `x` is a number use it directly; otherwise read `x.id`. Narrow with a `typeof` guard.\n~~~ts\nidText(5) // 'ID:5'\nidText({ id: 9 }) // 'ID:9'\n~~~",
        starter: "function idText(x: number | { id: number }): string {\n  // TODO: narrow then read the id\n  return '';\n}",
        solution: "function idText(x: number | { id: number }): string {\n  if (typeof x === 'number') return 'ID:' + x;\n  return 'ID:' + x.id;\n}",
        tests: [
        { name: "bare number", code: "assertEqual(idText(5), 'ID:5');" },
        { name: "wrapped id", code: "assertEqual(idText({ id: 9 }), 'ID:9');" },
        { name: "zero id wrapped", code: "assertEqual(idText({ id: 0 }), 'ID:0');" }
        ],
        hint: "if (typeof x === 'number') return 'ID:' + x; else return 'ID:' + x.id;", lore: "Some records hand you the key; others hide it in a struct."
      },
      {
        id: "ts-toarray", title: "LIST COERCE", kind: "function", difficulty: 3, xp: 240,
        brief: "Normalise one-or-many into an array.",
        prompt: "Define a generic **toArray<T>(x: T | T[]): T[]**. If `x` is already an array, pass it through unchanged; otherwise wrap the lone value in `[x]`. Use an `Array.isArray` guard to narrow.\n~~~ts\ntoArray(3) // [3]\ntoArray([1, 2]) // [1, 2]\n~~~",
        starter: "function toArray<T>(x: T | T[]): T[] {\n  // TODO: wrap a value, pass an array through\n  return [];\n}",
        solution: "function toArray<T>(x: T | T[]): T[] {\n  if (Array.isArray(x)) return x;\n  return [x];\n}",
        tests: [
        { name: "lone value is wrapped", code: "assertEqual(toArray(3), [3]);" },
        { name: "array passes through", code: "assertEqual(toArray([1, 2]), [1, 2]);" },
        { name: "lone string", code: "assertEqual(toArray('x'), ['x']);" },
        { name: "empty array stays empty", code: "assertEqual(toArray([]), []);" }
        ],
        hint: "if (Array.isArray(x)) return x; else return [x];", lore: "One or many — the buffer takes them both the same way."
      }
  ]);

  add("tsm06-records", [
      {
        id: "ts-getor", title: "SAFE INDEX", kind: "function", difficulty: 1, xp: 150,
        brief: "Read a key, or fall back.",
        prompt: "Define **getOr(r: Record<string, number>, k: string, d: number): number** returning `r[k]` when the key is present, otherwise `d`.\n~~~ts\ngetOr({ a: 1 }, 'a', 0) // 1\ngetOr({ a: 1 }, 'z', 0) // 0\n~~~",
        starter: "function getOr(r: Record<string, number>, k: string, d: number): number {\n  // TODO\n  return 0;\n}",
        solution: "function getOr(r: Record<string, number>, k: string, d: number): number {\n  return k in r ? r[k] : d;\n}",
        tests: [
        { name: "present", code: "assertEqual(getOr({ a: 1, b: 2 }, 'b', 0), 2);" },
        { name: "missing -> default", code: "assertEqual(getOr({ a: 1 }, 'z', 9), 9);" },
        { name: "zero value kept", code: "assertEqual(getOr({ a: 0 }, 'a', 9), 0);" }
        ],
        hint: "k in r ? r[k] : d", lore: "Never trust a missing key."
      },
      {
        id: "ts-maxkey", title: "PEAK SIGNAL", kind: "function", difficulty: 2, xp: 160,
        brief: "Find the key holding the biggest value.",
        prompt: "Define **maxKey(r: Record<string, number>): string** returning the key whose value is **highest**.\nOn an **empty** record return `''`. On a tie, return the **first** key seen with that max.\n~~~ts\nmaxKey({ a: 1, b: 5, c: 3 }) // 'b'\nmaxKey({}) // ''\n~~~",
        starter: "function maxKey(r: Record<string, number>): string {\n  // TODO\n  return '';\n}",
        solution: "function maxKey(r: Record<string, number>): string {\n  let best = '';\n  let seen = false;\n  for (const k in r) {\n    if (!seen || r[k] > r[best]) {\n      best = k;\n      seen = true;\n    }\n  }\n  return best;\n}",
        tests: [
        { name: "clear winner", code: "assertEqual(maxKey({ a: 1, b: 5, c: 3 }), 'b');" },
        { name: "empty -> ''", code: "assertEqual(maxKey({}), '');" },
        { name: "tie keeps first", code: "assertEqual(maxKey({ x: 2, y: 2 }), 'x');" },
        { name: "single key", code: "assertEqual(maxKey({ solo: 7 }), 'solo');" }
        ],
        hint: "Track the best key so far; replace it only when r[k] is strictly greater.", lore: "The loudest node on the grid wins the trace."
      },
      {
        id: "ts-counttrue", title: "LIVE COUNT", kind: "function", difficulty: 2, xp: 160,
        brief: "Count how many flags are raised.",
        prompt: "Define **countTrue(r: Record<string, boolean>): number** returning **how many values are `true`**.\n~~~ts\ncountTrue({ a: true, b: false, c: true }) // 2\ncountTrue({}) // 0\n~~~",
        starter: "function countTrue(r: Record<string, boolean>): number {\n  // TODO\n  return 0;\n}",
        solution: "function countTrue(r: Record<string, boolean>): number {\n  let n = 0;\n  for (const k in r) {\n    if (r[k]) n++;\n  }\n  return n;\n}",
        tests: [
        { name: "two true", code: "assertEqual(countTrue({ a: true, b: false, c: true }), 2);" },
        { name: "empty -> 0", code: "assertEqual(countTrue({}), 0);" },
        { name: "all false -> 0", code: "assertEqual(countTrue({ a: false, b: false }), 0);" },
        { name: "single true", code: "assertEqual(countTrue({ x: true }), 1);" }
        ],
        hint: "Loop the keys and add 1 for every truthy value.", lore: "How many sentries are still awake on the wire?"
      },
      {
        id: "ts-invert", title: "MIRROR MAP", kind: "function", difficulty: 3, xp: 180,
        brief: "Swap every key with its value.",
        prompt: "Define **invert(r: Record<string, string>): Record<string, string>** returning a **new** record where each value becomes a key and each key becomes its value.\n~~~ts\ninvert({ a: 'x', b: 'y' }) // { x: 'a', y: 'b' }\ninvert({}) // {}\n~~~",
        starter: "function invert(r: Record<string, string>): Record<string, string> {\n  // TODO\n  return {};\n}",
        solution: "function invert(r: Record<string, string>): Record<string, string> {\n  const out: Record<string, string> = {};\n  for (const k in r) {\n    out[r[k]] = k;\n  }\n  return out;\n}",
        tests: [
        { name: "swaps pairs", code: "assertEqual(invert({ a: 'x', b: 'y' }), { x: 'a', y: 'b' });" },
        { name: "empty -> empty", code: "assertEqual(invert({}), {});" },
        { name: "single pair", code: "assertEqual(invert({ k: 'v' }), { v: 'k' });" }
        ],
        hint: "const out = {}; for (const k in r) out[r[k]] = k; return out;", lore: "Flip the lookup and read the grid in reverse."
      },
      {
        id: "ts-addbucket", title: "BUCKET PUSH", kind: "function", difficulty: 3, xp: 190,
        brief: "Add to a tally without touching the original.",
        prompt: "Define **addToBucket(r: Record<string, number>, k: string, n: number): Record<string, number>** returning a **new** record where `r[k]` is increased by `n`. A missing key starts at **0**. Do **not** mutate the input.\n~~~ts\naddToBucket({ a: 1 }, 'a', 5) // { a: 6 }\naddToBucket({ a: 1 }, 'b', 3) // { a: 1, b: 3 }\n~~~",
        starter: "function addToBucket(r: Record<string, number>, k: string, n: number): Record<string, number> {\n  // TODO\n  return r;\n}",
        solution: "function addToBucket(r: Record<string, number>, k: string, n: number): Record<string, number> {\n  const out: Record<string, number> = {};\n  for (const key in r) {\n    out[key] = r[key];\n  }\n  out[k] = (k in out ? out[k] : 0) + n;\n  return out;\n}",
        tests: [
        { name: "adds to existing", code: "assertEqual(addToBucket({ a: 1 }, 'a', 5), { a: 6 });" },
        { name: "missing starts at 0", code: "assertEqual(addToBucket({ a: 1 }, 'b', 3), { a: 1, b: 3 });" },
        { name: "fresh key on empty", code: "assertEqual(addToBucket({}, 'x', 4), { x: 4 });" },
        { name: "input not mutated", code: "const src = { a: 1 };\naddToBucket(src, 'a', 5);\nassertEqual(src, { a: 1 });" }
        ],
        hint: "Copy r into a new object first, then set out[k] = (k in out ? out[k] : 0) + n.", lore: "Never write back to the shared ledger — fork it."
      }
  ]);

  add("tsm07-classes", [
      {
        id: "ts-counter", title: "PULSE COUNTER", kind: "function", difficulty: 1, xp: 130,
        brief: "A private tally that only goes up.",
        prompt: "Define a class **Counter** with a **private** number field that **starts at 0**, a method **tick(): void** that adds 1, and a method **value(): number** returning the current count.\n~~~ts\nconst c = new Counter();\nc.tick(); c.tick();\nc.value() // 2\n~~~",
        starter: "class Counter {\n  // TODO: private count field starting at 0\n  tick(): void {}\n  value(): number { return 0; }\n}",
        solution: "class Counter {\n  private count: number = 0;\n  tick(): void { this.count += 1; }\n  value(): number { return this.count; }\n}",
        tests: [
        { name: "starts at zero", code: "assertEqual(new Counter().value(), 0);" },
        { name: "two ticks", code: "var c = new Counter();\nc.tick();\nc.tick();\nassertEqual(c.value(), 2);" },
        { name: "instances are independent", code: "var a = new Counter();\nvar b = new Counter();\na.tick();\nassert(a.value() === 1 && b.value() === 0, 'each counter keeps its own count');" }
        ],
        hint: "private count: number = 0; then this.count += 1 in tick and return this.count in value.", lore: "Every heartbeat logged, none erased."
      },
      {
        id: "ts-box", title: "TYPED CRATE", kind: "function", difficulty: 2, xp: 180,
        brief: "Seal any payload in a typed crate.",
        prompt: "Define a generic class **Box<T>** using constructor shorthand `constructor(private value: T)` and a method **get(): T** returning the stored value.\n~~~ts\nnew Box(42).get() // 42\nnew Box('x').get() // 'x'\n~~~",
        starter: "class Box<T> {\n  // TODO: constructor shorthand + get()\n  get(): T { return undefined as any; }\n}",
        solution: "class Box<T> {\n  constructor(private value: T) {}\n  get(): T { return this.value; }\n}",
        tests: [
        { name: "number box", code: "assertEqual(new Box(42).get(), 42);" },
        { name: "string box", code: "assertEqual(new Box('x').get(), 'x');" },
        { name: "holds an array", code: "assertEqual(new Box([1, 2]).get(), [1, 2]);" }
        ],
        hint: "constructor(private value: T) {} then return this.value;", lore: "Schrodinger's crate — typed."
      },
      {
        id: "ts-range", title: "ZONE CHECK", kind: "function", difficulty: 2, xp: 190,
        brief: "Is the target inside the perimeter?",
        prompt: "Define a class **Range** using constructor shorthand `constructor(private lo: number, private hi: number)` and a method **contains(x: number): boolean** that is `true` when `x` is between `lo` and `hi` **inclusive**.\n~~~ts\nconst r = new Range(1, 10);\nr.contains(1)  // true\nr.contains(11) // false\n~~~",
        starter: "class Range {\n  constructor(private lo: number, private hi: number) {}\n  contains(x: number): boolean { return false; }\n}",
        solution: "class Range {\n  constructor(private lo: number, private hi: number) {}\n  contains(x: number): boolean { return x >= this.lo && x <= this.hi; }\n}",
        tests: [
        { name: "inside", code: "assertEqual(new Range(1, 10).contains(5), true);" },
        { name: "low edge inclusive", code: "assertEqual(new Range(1, 10).contains(1), true);" },
        { name: "high edge inclusive", code: "assertEqual(new Range(1, 10).contains(10), true);" },
        { name: "outside", code: "assert(new Range(1, 10).contains(11) === false && new Range(1, 10).contains(0) === false);" }
        ],
        hint: "return x >= this.lo && x <= this.hi;", lore: "Cross the line and the turrets wake."
      },
      {
        id: "ts-wallet", title: "CRED WALLET", kind: "function", difficulty: 3, xp: 220,
        brief: "Spend only what you hold.",
        prompt: "Define a class **Wallet** with a **private** balance. The constructor takes a starting amount (default 0). Add **deposit(n: number): void**, **withdraw(n: number): boolean** (return `false` and change nothing if `n` exceeds the balance, else subtract and return `true`), and **balance(): number**.\n~~~ts\nconst w = new Wallet(100);\nw.deposit(50);   // balance 150\nw.withdraw(200); // false (insufficient)\n~~~",
        starter: "class Wallet {\n  constructor(start: number = 0) {}\n  deposit(n: number): void {}\n  withdraw(n: number): boolean { return false; }\n  balance(): number { return 0; }\n}",
        solution: "class Wallet {\n  private bal: number;\n  constructor(start: number = 0) { this.bal = start; }\n  deposit(n: number): void { this.bal += n; }\n  withdraw(n: number): boolean {\n    if (n > this.bal) return false;\n    this.bal -= n;\n    return true;\n  }\n  balance(): number { return this.bal; }\n}",
        tests: [
        { name: "defaults to empty", code: "assertEqual(new Wallet().balance(), 0);" },
        { name: "deposit raises balance", code: "var w = new Wallet(100);\nw.deposit(50);\nassertEqual(w.balance(), 150);" },
        { name: "overdraft refused", code: "var w = new Wallet(100);\nassert(w.withdraw(200) === false && w.balance() === 100, 'no overdraft, balance unchanged');" },
        { name: "valid withdrawal", code: "var w = new Wallet(100);\nassert(w.withdraw(60) === true && w.balance() === 40);" }
        ],
        hint: "Store this.bal; withdraw checks n > this.bal and returns false before changing anything.", lore: "The street ledger never extends credit."
      },
      {
        id: "ts-accumulator", title: "RUNNING SUM", kind: "function", difficulty: 3, xp: 230,
        brief: "Fold a stream of numbers into one total.",
        prompt: "Define a class **Accumulator** with a **private** total that **starts at 0**. Add **add(n: number): number** that adds `n` to the total and **returns the new running total**, and **total(): number** returning the current total.\n~~~ts\nconst acc = new Accumulator();\nacc.add(3) // 3\nacc.add(4) // 7\nacc.total() // 7\n~~~",
        starter: "class Accumulator {\n  // TODO: private sum field starting at 0\n  add(n: number): number { return 0; }\n  total(): number { return 0; }\n}",
        solution: "class Accumulator {\n  private sum: number = 0;\n  add(n: number): number { this.sum += n; return this.sum; }\n  total(): number { return this.sum; }\n}",
        tests: [
        { name: "starts at zero", code: "assertEqual(new Accumulator().total(), 0);" },
        { name: "add returns running total", code: "var acc = new Accumulator();\nassert(acc.add(3) === 3 && acc.add(4) === 7, 'add returns the updated total');" },
        { name: "total reflects the sum", code: "var acc = new Accumulator();\nacc.add(3);\nacc.add(4);\nassertEqual(acc.total(), 7);" },
        { name: "instances are independent", code: "var a = new Accumulator();\nvar b = new Accumulator();\na.add(5);\nassert(a.total() === 5 && b.total() === 0, 'each accumulator keeps its own sum');" }
        ],
        hint: "private sum = 0; in add do this.sum += n then return this.sum.", lore: "Drip by drip, the meter climbs."
      }
  ]);

  add("tsm08-fntypes", [
      {
        id: "ts-makemult", title: "GAIN FORGE", kind: "function", difficulty: 2, xp: 180,
        brief: "Forge an amplifier with the factor baked in.",
        prompt: "Define **makeMultiplier(factor: number): (x: number) => number** returning a function that multiplies its input by `factor`.\n~~~ts\nconst double = makeMultiplier(2);\ndouble(21) // 42\n~~~",
        starter: "function makeMultiplier(factor: number): (x: number) => number {\n  // TODO\n  return (x: number) => 0;\n}",
        solution: "function makeMultiplier(factor: number): (x: number) => number {\n  return (x: number) => x * factor;\n}",
        tests: [
        { name: "doubler", code: "var double = makeMultiplier(2);\nassert(double(21) === 42 && double(0) === 0);" },
        { name: "tripler", code: "var triple = makeMultiplier(3);\nassert(triple(10) === 30 && triple(-2) === -6);" }
        ],
        hint: "return (x) => x * factor;", lore: "Crank the gain."
      },
      {
        id: "ts-countmatch", title: "PASS FILTER", kind: "function", difficulty: 2, xp: 190,
        brief: "Count how many items clear the predicate.",
        prompt: "A **predicate** is a function-type `(x: T) => boolean`. Define **countMatching<T>(xs: T[], pred: (x: T) => boolean): number** returning how many items in `xs` make `pred` return `true`.\n~~~ts\ncountMatching([1, 2, 3, 4], (n: number) => n % 2 === 0) // 2\ncountMatching([], (n: number) => true) // 0\n~~~",
        starter: "function countMatching<T>(xs: T[], pred: (x: T) => boolean): number {\n  // TODO\n  return 0;\n}",
        solution: "function countMatching<T>(xs: T[], pred: (x: T) => boolean): number {\n  let n = 0;\n  for (const x of xs) {\n    if (pred(x)) n++;\n  }\n  return n;\n}",
        tests: [
        { name: "evens", code: "assert(countMatching([1, 2, 3, 4], function (n) { return n % 2 === 0; }) === 2);" },
        { name: "long words", code: "assert(countMatching(['hi', 'runner', 'ok', 'grid'], function (s) { return s.length > 2; }) === 2);" },
        { name: "empty is zero", code: "assert(countMatching([], function (n) { return true; }) === 0);" }
        ],
        hint: "Loop xs, do n++ each time pred(x) is true, then return n.", lore: "The scanner tallies every signal that clears the gate."
      },
      {
        id: "ts-joinnums", title: "SPLICE STREAM", kind: "function", difficulty: 3, xp: 210,
        brief: "Gather any count of numbers and weld them with a separator.",
        prompt: "**Rest params** `...ns: number[]` collect every extra argument into an array. Define **joinNums(sep: string, ...ns: number[]): string** returning the numbers joined by `sep` (use `ns.join(sep)`).\n~~~ts\njoinNums('-', 1, 2, 3) // '1-2-3'\njoinNums(',') // ''\n~~~",
        starter: "function joinNums(sep: string, ...ns: number[]): string {\n  // TODO\n  return 'x';\n}",
        solution: "function joinNums(sep: string, ...ns: number[]): string {\n  return ns.join(sep);\n}",
        tests: [
        { name: "dash weld", code: "assertEqual(joinNums('-', 1, 2, 3), '1-2-3');" },
        { name: "single value", code: "assertEqual(joinNums(',', 7), '7');" },
        { name: "no numbers", code: "assertEqual(joinNums(','), '');" }
        ],
        hint: "return ns.join(sep);", lore: "Stray packets, spliced into one clean stream."
      },
      {
        id: "ts-applyall", title: "PIPE ARRAY", kind: "function", difficulty: 3, xp: 220,
        brief: "Run one value through a whole rack of transforms.",
        prompt: "An **array of function-types** `Array<(n: number) => number>` is a rack of transforms. Define **applyAll(fns: Array<(n: number) => number>, x: number): number[]** returning the result of applying each function to `x`, in order.\n~~~ts\napplyAll([(n: number) => n + 1, (n: number) => n * 2], 10) // [11, 20]\napplyAll([], 5) // []\n~~~",
        starter: "function applyAll(fns: Array<(n: number) => number>, x: number): number[] {\n  // TODO\n  return [x];\n}",
        solution: "function applyAll(fns: Array<(n: number) => number>, x: number): number[] {\n  return fns.map((f) => f(x));\n}",
        tests: [
        { name: "two transforms", code: "assertEqual(applyAll([function (n) { return n + 1; }, function (n) { return n * 2; }], 10), [11, 20]);" },
        { name: "order preserved", code: "assertEqual(applyAll([function (n) { return n - 3; }, function (n) { return n * n; }, function (n) { return n; }], 4), [1, 16, 4]);" },
        { name: "empty rack", code: "assertEqual(applyAll([], 5), []);" }
        ],
        hint: "return fns.map((f) => f(x));", lore: "One signal, fanned across every patch in the rack."
      },
      {
        id: "ts-repeatcall", title: "ECHO LOOP", kind: "function", difficulty: 3, xp: 230,
        brief: "Fire a zero-arg producer n times and collect the echoes.",
        prompt: "A producer is a function-type `() => T` taking no args. Define **repeatCall<T>(fn: () => T, n: number): T[]** that calls `fn` exactly `n` times and collects the results into an array. When `n` is `0`, return `[]`.\n~~~ts\nlet i = 0;\nrepeatCall(() => i++, 3) // [0, 1, 2]\nrepeatCall(() => 9, 0) // []\n~~~",
        starter: "function repeatCall<T>(fn: () => T, n: number): T[] {\n  // TODO\n  return [fn()];\n}",
        solution: "function repeatCall<T>(fn: () => T, n: number): T[] {\n  const out: T[] = [];\n  for (let i = 0; i < n; i++) {\n    out.push(fn());\n  }\n  return out;\n}",
        tests: [
        { name: "counts up", code: "var i = 0;\nassertEqual(repeatCall(function () { return i++; }, 3), [0, 1, 2]);" },
        { name: "constant echo", code: "assertEqual(repeatCall(function () { return 'x'; }, 2), ['x', 'x']);" },
        { name: "zero calls", code: "var hits = 0;\nvar r = repeatCall(function () { hits++; return 1; }, 0);\nassertEqual(r, []);\nassert(hits === 0);" }
        ],
        hint: "Build an empty array, loop i from 0 to n pushing fn(), return it.", lore: "Strike once, hear it bounce n times down the corridor."
      }
  ]);
})();
