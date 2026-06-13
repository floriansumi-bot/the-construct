/* ============================================================
   curriculum-ts-pack-8.js — TYPESCRIPT expansion pack 8.
   Appends practice nodes to existing sectors (tsm09-keyof, tsm0a-transforms, tsm0b-nullsafe, tsm0c-errors, tsm0d-stralgo, tsm0e-math, tsm0f-modeling, tsm10-algos)
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
  add("tsm09-keyof", [
      {
        id: "ts-keysof", title: "KEY HARVEST", kind: "function", difficulty: 2, xp: 200,
        brief: "List every field name carried by a record.",
        prompt: "Define **keysOf<T extends object>(obj: T): string[]** returning an array of `obj`'s own key names.\nAn empty object yields `[]`.\n~~~ts\nkeysOf({ a: 1, b: 2 }) // ['a', 'b']\nkeysOf({})            // []\n~~~",
        starter: "function keysOf<T extends object>(obj: T): string[] {\n  // TODO: harvest the key names of obj\n  return [];\n}",
        solution: "function keysOf<T extends object>(obj: T): string[] {\n  return Object.keys(obj);\n}",
        tests: [
        { name: "two keys", code: "assertEqual(keysOf({ a: 1, b: 2 }), ['a', 'b']);" },
        { name: "empty -> []", code: "assertEqual(keysOf({}), []);" },
        { name: "single key", code: "assertEqual(keysOf({ solo: 9 }), ['solo']);" },
        { name: "mixed value types", code: "assertEqual(keysOf({ id: 1, on: true, tag: 'x' }), ['id', 'on', 'tag']);" }
        ],
        hint: "return Object.keys(obj);", lore: "Scan the manifest before you trust the cargo."
      },
      {
        id: "ts-haskey", title: "KEY PROBE", kind: "function", difficulty: 2, xp: 200,
        brief: "Does the record carry that field?",
        prompt: "Define **hasKey<T extends object>(obj: T, k: string): boolean** returning whether `k` is a key of `obj`.\n~~~ts\nhasKey({ a: 1 }, 'a') // true\nhasKey({ a: 1 }, 'z') // false\n~~~",
        starter: "function hasKey<T extends object>(obj: T, k: string): boolean {\n  // TODO: report whether k is a key of obj\n  return false;\n}",
        solution: "function hasKey<T extends object>(obj: T, k: string): boolean {\n  return k in obj;\n}",
        tests: [
        { name: "present", code: "assert(hasKey({ a: 1, b: 2 }, 'b') === true);" },
        { name: "absent", code: "assert(hasKey({ a: 1 }, 'z') === false);" },
        { name: "empty -> false", code: "assert(hasKey({}, 'a') === false);" },
        { name: "key holding zero still present", code: "assert(hasKey({ n: 0 }, 'n') === true);" }
        ],
        hint: "return k in obj;", lore: "Probe before you read."
      },
      {
        id: "ts-propeq", title: "FIELD MATCH", kind: "function", difficulty: 3, xp: 200,
        brief: "Check one typed field against an expected value.",
        prompt: "Define **propEquals<T, K extends keyof T>(obj: T, k: K, v: T[K]): boolean** returning whether `obj[k]` strictly equals `v`.\n`K extends keyof T` ties `k` to a real key, and `v: T[K]` forces the compared value to match that field's type.\n~~~ts\npropEquals({ id: 7, on: true }, 'id', 7) // true\npropEquals({ id: 7, on: true }, 'id', 9) // false\n~~~",
        starter: "function propEquals<T, K extends keyof T>(obj: T, k: K, v: T[K]): boolean {\n  // TODO: compare obj[k] against v\n  return false;\n}",
        solution: "function propEquals<T, K extends keyof T>(obj: T, k: K, v: T[K]): boolean {\n  return obj[k] === v;\n}",
        tests: [
        { name: "matching number", code: "assert(propEquals({ id: 7, on: true }, 'id', 7) === true);" },
        { name: "mismatching number", code: "assert(propEquals({ id: 7, on: true }, 'id', 9) === false);" },
        { name: "matching boolean", code: "assert(propEquals({ id: 7, on: true }, 'on', true) === true);" },
        { name: "zero value matches zero", code: "assert(propEquals({ n: 0 }, 'n', 0) === true);" }
        ],
        hint: "return obj[k] === v;", lore: "Confirm the field reads exactly what the protocol expects."
      },
      {
        id: "ts-propor", title: "FIELD FALLBACK", kind: "function", difficulty: 3, xp: 200,
        brief: "Read a typed field, or fall back to a default of its type.",
        prompt: "Define **propOr<T, K extends keyof T>(obj: T, k: K, d: T[K]): T[K]** returning `obj[k]` when `k` is present, otherwise the default `d`.\nBoth the result and the default are typed `T[K]`, so the fallback always matches the field it replaces.\n~~~ts\npropOr({ a: 1, b: 2 }, 'a', 0) // 1\npropOr({ a: 1 } as { a: number; z?: number }, 'z', 9) // 9\n~~~",
        starter: "function propOr<T, K extends keyof T>(obj: T, k: K, d: T[K]): T[K] {\n  // TODO: return obj[k] when present, else d\n  return d;\n}",
        solution: "function propOr<T, K extends keyof T>(obj: T, k: K, d: T[K]): T[K] {\n  return k in obj ? obj[k] : d;\n}",
        tests: [
        { name: "present -> value", code: "assertEqual(propOr({ a: 1, b: 2 }, 'a', 0), 1);" },
        { name: "missing -> default", code: "assertEqual(propOr({ a: 1 }, 'z', 9), 9);" },
        { name: "present zero kept (not default)", code: "assertEqual(propOr({ a: 0 }, 'a', 9), 0);" },
        { name: "present false kept (not default)", code: "assert(propOr({ on: false }, 'on', true) === false);" }
        ],
        hint: "return k in obj ? obj[k] : d;", lore: "A missing channel falls back to the safe default — a live one is read as-is."
      },
      {
        id: "ts-valsof", title: "VALUE DUMP", kind: "function", difficulty: 3, xp: 200,
        brief: "Spill every stored value into an array.",
        prompt: "Define **valuesOf<T extends object>(obj: T): Array<T[keyof T]>** returning an array of `obj`'s own values.\n`T[keyof T]` is the union of every field's type, so the array carries exactly the values `obj` stores.\nAn empty object yields `[]`.\n~~~ts\nvaluesOf({ a: 1, b: 2 }) // [1, 2]\nvaluesOf({})            // []\n~~~",
        starter: "function valuesOf<T extends object>(obj: T): Array<T[keyof T]> {\n  // TODO: dump the values of obj\n  return [];\n}",
        solution: "function valuesOf<T extends object>(obj: T): Array<T[keyof T]> {\n  return Object.values(obj);\n}",
        tests: [
        { name: "two values", code: "assertEqual(valuesOf({ a: 1, b: 2 }), [1, 2]);" },
        { name: "empty -> []", code: "assertEqual(valuesOf({}), []);" },
        { name: "single value", code: "assertEqual(valuesOf({ solo: 9 }), [9]);" },
        { name: "mixed value types in order", code: "assertEqual(valuesOf({ id: 1, on: true, tag: 'x' }), [1, true, 'x']);" }
        ],
        hint: "return Object.values(obj);", lore: "Open every register and read the payloads in order."
      }
  ]);

  add("tsm0a-transforms", [
      {
        id: "ts-doubleall", title: "GAIN STAGE", kind: "function", difficulty: 1, xp: 160,
        brief: "Boost every signal by a factor of two.",
        prompt: "Define **doubleAll(nums: number[]): number[]** returning a NEW array with every number multiplied by `2`.\nReach for `map` — it transforms each element and hands back a fresh array.\n~~~ts\ndoubleAll([1, 2, 3]) // [2, 4, 6]\ndoubleAll([])        // []\n~~~",
        starter: "function doubleAll(nums: number[]): number[] {\n  // TODO: map each number to itself times two\n  return nums;\n}",
        solution: "function doubleAll(nums: number[]): number[] {\n  return nums.map(function (n) { return n * 2; });\n}",
        tests: [
        { name: "triples doubled", code: "assertEqual(doubleAll([1, 2, 3]), [2, 4, 6]);" },
        { name: "handles negatives and zero", code: "assertEqual(doubleAll([-2, 0, 5]), [-4, 0, 10]);" },
        { name: "empty -> empty", code: "assertEqual(doubleAll([]), []);" }
        ],
        hint: "nums.map(n => n * 2)", lore: "Push every channel through the gain stage; the levels come back twice as hot."
      },
      {
        id: "ts-reject", title: "NOISE GATE", kind: "function", difficulty: 2, xp: 180,
        brief: "Drop what matches; keep the rest.",
        prompt: "Define **reject<T>(xs: T[], pred: (x: T) => boolean): T[]** returning the items for which `pred` is FALSE (the opposite of filter).\n~~~ts\nreject([1,2,3,4], n => n % 2 === 0) // [1, 3]\n~~~",
        starter: "function reject<T>(xs: T[], pred: (x: T) => boolean): T[] {\n  // TODO\n  return [];\n}",
        solution: "function reject<T>(xs: T[], pred: (x: T) => boolean): T[] {\n  return xs.filter(function (x) { return !pred(x); });\n}",
        tests: [
        { name: "drops evens", code: "assertEqual(reject([1,2,3,4], function (n) { return n % 2 === 0; }), [1,3]);" },
        { name: "empty -> empty", code: "assertEqual(reject([], function () { return true; }), []);" }
        ],
        hint: "xs.filter(x => !pred(x))", lore: "Gate the noise floor."
      },
      {
        id: "ts-takewhile", title: "RUN LENGTH", kind: "function", difficulty: 2, xp: 180,
        brief: "Take the leading run that satisfies the test, then stop.",
        prompt: "Define **takeWhile<T>(xs: T[], pred: (x: T) => boolean): T[]** returning the longest PREFIX of `xs` whose elements all satisfy `pred`.\nStop at the FIRST element that fails — everything after it is dropped, even if it would pass.\n~~~ts\ntakeWhile([2, 4, 5, 6], n => n % 2 === 0) // [2, 4]\ntakeWhile([1, 2, 3], n => n > 5)          // []\n~~~",
        starter: "function takeWhile<T>(xs: T[], pred: (x: T) => boolean): T[] {\n  // TODO: collect from the front while pred holds, then break\n  return [];\n}",
        solution: "function takeWhile<T>(xs: T[], pred: (x: T) => boolean): T[] {\n  var out: T[] = [];\n  for (var i = 0; i < xs.length; i++) {\n    if (!pred(xs[i])) break;\n    out.push(xs[i]);\n  }\n  return out;\n}",
        tests: [
        { name: "stops at first odd", code: "assertEqual(takeWhile([2, 4, 5, 6], function (n) { return n % 2 === 0; }), [2, 4]);" },
        { name: "first element fails -> empty", code: "assertEqual(takeWhile([1, 2, 3], function (n) { return n > 5; }), []);" },
        { name: "all pass -> whole array", code: "assertEqual(takeWhile(['a', 'b', 'c'], function (s) { return s.length === 1; }), ['a', 'b', 'c']);" },
        { name: "empty -> empty", code: "assertEqual(takeWhile([], function () { return true; }), []);" }
        ],
        hint: "Loop from index 0; break on the first element where !pred(x), pushing the rest.", lore: "Read the stream until the first bad packet, then cut — the run length is all you keep."
      },
      {
        id: "ts-flatten", title: "UNNEST GRID", kind: "function", difficulty: 3, xp: 190,
        brief: "Collapse a list of lists down one level.",
        prompt: "Define a generic **flatten<T>(xss: T[][]): T[]** that concatenates every inner array into ONE flat array, in order.\nFlatten exactly one level — fold the rows together with `reduce`.\n~~~ts\nflatten([[1, 2], [3], [4, 5]]) // [1, 2, 3, 4, 5]\nflatten<number>([])            // []\n~~~",
        starter: "function flatten<T>(xss: T[][]): T[] {\n  // TODO: reduce the rows into a single array via concat\n  return [];\n}",
        solution: "function flatten<T>(xss: T[][]): T[] {\n  return xss.reduce(function (acc: T[], xs: T[]) { return acc.concat(xs); }, [] as T[]);\n}",
        tests: [
        { name: "three rows joined", code: "assertEqual(flatten([[1, 2], [3], [4, 5]]), [1, 2, 3, 4, 5]);" },
        { name: "strings preserved in order", code: "assertEqual(flatten([['a'], ['b', 'c']]), ['a', 'b', 'c']);" },
        { name: "inner empties skipped", code: "assertEqual(flatten([[], [1], []]), [1]);" },
        { name: "empty outer -> empty", code: "assertEqual(flatten([]), []);" }
        ],
        hint: "xss.reduce((acc, xs) => acc.concat(xs), [])", lore: "Drop the grid down one dimension — every row spills into the same line."
      },
      {
        id: "ts-sumof", title: "WEIGHTED TALLY", kind: "function", difficulty: 3, xp: 190,
        brief: "Project each item to a number, then total them.",
        prompt: "Define a generic **sumOf<T>(xs: T[], f: (x: T) => number): number** that maps each element through `f` and returns the SUM of those numbers.\nUse `reduce` with a starting accumulator of `0`, so an empty array returns `0`.\n~~~ts\nsumOf([{ n: 1 }, { n: 2 }, { n: 3 }], item => item.n) // 6\nsumOf<string>([], s => s.length)                     // 0\n~~~",
        starter: "function sumOf<T>(xs: T[], f: (x: T) => number): number {\n  // TODO: reduce, adding f(x) to a running total that starts at 0\n  return xs.length;\n}",
        solution: "function sumOf<T>(xs: T[], f: (x: T) => number): number {\n  return xs.reduce(function (acc, x) { return acc + f(x); }, 0);\n}",
        tests: [
        { name: "sums a projected field", code: "assertEqual(sumOf([{ n: 1 }, { n: 2 }, { n: 3 }], function (item) { return item.n; }), 6);" },
        { name: "sums string lengths", code: "assertEqual(sumOf(['a', 'bb', 'ccc'], function (s) { return s.length; }), 6);" },
        { name: "single item", code: "assertEqual(sumOf([10], function (x) { return x; }), 10);" },
        { name: "empty -> 0", code: "assertEqual(sumOf([], function (x) { return x; }), 0);" }
        ],
        hint: "xs.reduce((acc, x) => acc + f(x), 0)", lore: "Weigh each record, drop it on the scale, and read the running total."
      }
  ]);

  add("tsm0b-nullsafe", [
      {
        id: "ts-initial", title: "GLYPH STAMP", kind: "function", difficulty: 2, xp: 170,
        brief: "Brand a callsign by its leading glyph.",
        prompt: "Define **initial(name?: string): string** returning the **first character uppercased**, or `'?'` when the name is **missing or empty**. Use `?.` and `??`.\n~~~ts\ninitial('neo')  // 'N'\ninitial('')     // '?'\ninitial()       // '?'\n~~~",
        starter: "function initial(name?: string): string {\n  // TODO: also UPPERCASE the first character\n  return name?.[0] ?? '?';\n}",
        solution: "function initial(name?: string): string {\n  return name?.[0]?.toUpperCase() ?? '?';\n}",
        tests: [
        { name: "first char uppercased", code: "assertEqual(initial('neo'), 'N');" },
        { name: "already uppercase stays", code: "assertEqual(initial('Faye'), 'F');" },
        { name: "empty string -> ?", code: "assertEqual(initial(''), '?', 'index 0 of an empty string is undefined');" },
        { name: "missing -> ?", code: "assertEqual(initial(), '?');" }
        ],
        hint: "name?.[0]?.toUpperCase() ?? '?'  — chain ?. so a missing name never throws.", lore: "Even a one-glyph mark must burn bright. The nameless get a question."
      },
      {
        id: "ts-safelen", title: "NULL PROBE", kind: "function", difficulty: 2, xp: 170,
        brief: "Measure a maybe-missing buffer.",
        prompt: "Define **safeLen(xs?: unknown[]): number** returning the array length, or `0` if the argument is missing. Use `?.` and `??`.\n~~~ts\nsafeLen([1,2,3]) // 3\nsafeLen() // 0\n~~~",
        starter: "function safeLen(xs?: unknown[]): number {\n  // TODO\n  return -1;\n}",
        solution: "function safeLen(xs?: unknown[]): number {\n  return xs?.length ?? 0;\n}",
        tests: [
        { name: "counts", code: "assertEqual(safeLen([1,2,3]), 3);" },
        { name: "missing -> 0", code: "assertEqual(safeLen(), 0);" },
        { name: "empty -> 0", code: "assertEqual(safeLen([]), 0);" }
        ],
        hint: "xs?.length ?? 0", lore: "Trust nothing that might be null."
      },
      {
        id: "ts-debugon", title: "FLAG SWEEP", kind: "function", difficulty: 2, xp: 170,
        brief: "Read a deeply optional debug flag.",
        prompt: "Define **debugOn(cfg: { opts?: { debug?: boolean } }): boolean** returning whether debug is on, defaulting to `false` when `opts` or `debug` is missing. Use `?.` and `??`.\n~~~ts\ndebugOn({ opts: { debug: true } })  // true\ndebugOn({})                         // false\n~~~",
        starter: "function debugOn(cfg: { opts?: { debug?: boolean } }): boolean {\n  // TODO: the default should be false, not true\n  return cfg.opts?.debug ?? true;\n}",
        solution: "function debugOn(cfg: { opts?: { debug?: boolean } }): boolean {\n  return cfg.opts?.debug ?? false;\n}",
        tests: [
        { name: "debug true", code: "assertEqual(debugOn({ opts: { debug: true } }), true);" },
        { name: "missing opts -> false", code: "assertEqual(debugOn({}), false);" },
        { name: "opts without debug -> false", code: "assertEqual(debugOn({ opts: {} }), false);" },
        { name: "explicit false is kept", code: "assertEqual(debugOn({ opts: { debug: false } }), false, '?? keeps a real false, it does not re-default it');" }
        ],
        hint: "cfg.opts?.debug ?? false  — ?. tunnels through a missing opts in one read.", lore: "Two locks deep sits the debug switch. Default it dark."
      },
      {
        id: "ts-priceor", title: "PRICE TAG", kind: "function", difficulty: 3, xp: 200,
        brief: "Default a price only when it is truly absent.",
        prompt: "Define **priceOr(item: { price?: number }, d: number): number** returning the item's price, or the default `d` when `price` is **missing**. A price of **0** must be **kept**, never replaced. Use `??`.\n~~~ts\npriceOr({ price: 99 }, 10)  // 99\npriceOr({}, 10)            // 10\npriceOr({ price: 0 }, 10)  // 0  (kept!)\n~~~",
        starter: "function priceOr(item: { price?: number }, d: number): number {\n  // TODO: fall back to d (not 0) when price is missing\n  return item.price ?? 0;\n}",
        solution: "function priceOr(item: { price?: number }, d: number): number {\n  return item.price ?? d;\n}",
        tests: [
        { name: "uses the price", code: "assertEqual(priceOr({ price: 99 }, 10), 99);" },
        { name: "missing -> default", code: "assertEqual(priceOr({}, 10), 10);" },
        { name: "price of 0 is kept", code: "assertEqual(priceOr({ price: 0 }, 10), 0, 'zero is a real price; ?? must not replace it with d');" }
        ],
        hint: "item.price ?? d  — ?? only fires on null/undefined, so a price of 0 survives.", lore: "A free item still costs zero. Mark it zero, not the fallback."
      },
      {
        id: "ts-firstdef", title: "FIRST SIGNAL", kind: "function", difficulty: 3, xp: 200,
        brief: "Take the first value that actually arrived.",
        prompt: "Define a generic **firstDefined<T>(a: T | undefined, b: T | undefined, c: T | undefined): T | undefined** returning the **first argument that is not `undefined`**, or `undefined` if all three are. Use `??`. A value of `0` or `''` counts as present.\n~~~ts\nfirstDefined(undefined, 'B', 'C')          // 'B'\nfirstDefined(undefined, undefined, undefined) // undefined\n~~~",
        starter: "function firstDefined<T>(a: T | undefined, b: T | undefined, c: T | undefined): T | undefined {\n  // TODO: c must also be considered\n  return a ?? b;\n}",
        solution: "function firstDefined<T>(a: T | undefined, b: T | undefined, c: T | undefined): T | undefined {\n  return a ?? b ?? c;\n}",
        tests: [
        { name: "first present wins", code: "assertEqual(firstDefined('A', 'B', 'C'), 'A');" },
        { name: "skips leading undefined", code: "assertEqual(firstDefined(undefined, 'B', 'C'), 'B');" },
        { name: "falls through to third", code: "assertEqual(firstDefined(undefined, undefined, 'C'), 'C');" },
        { name: "all undefined -> undefined", code: "assert(firstDefined(undefined, undefined, undefined) === undefined);" },
        { name: "a zero counts as present", code: "assertEqual(firstDefined(0, 9, 9), 0, '0 is not undefined, so ?? returns it');" }
        ],
        hint: "a ?? b ?? c  — ?? chains left to right, stopping at the first non-undefined.", lore: "Three relays, one packet. Trust whichever fires first."
      }
  ]);

  add("tsm0c-errors", [
      {
        id: "ts-requirepos", title: "GATEKEEPER", kind: "function", difficulty: 2, xp: 170,
        brief: "Reject non-positive power.",
        prompt: "Define **requirePositive(n: number): number** returning `n` when `n > 0`, otherwise **throwing** an Error.\n~~~ts\nrequirePositive(5) // 5\nrequirePositive(0) // throws\n~~~",
        starter: "function requirePositive(n: number): number {\n  // TODO: throw when n <= 0, else return n\n  return n;\n}",
        solution: "function requirePositive(n: number): number {\n  if (n <= 0) throw new Error('must be positive');\n  return n;\n}",
        tests: [
        { name: "passes positive", code: "assertEqual(requirePositive(5), 5);" },
        { name: "passes large positive", code: "assertEqual(requirePositive(9000), 9000);" },
        { name: "throws on zero", code: "assertThrows(function () { requirePositive(0); });" },
        { name: "throws on negative", code: "assertThrows(function () { requirePositive(-3); });" }
        ],
        hint: "if (n <= 0) throw new Error(...); return n;", lore: "None pass the reactor gate without a positive charge."
      },
      {
        id: "ts-validatetag", title: "CHECKPOINT", kind: "function", difficulty: 2, xp: 180,
        brief: "Demand a real tag, trimmed clean.",
        prompt: "Define **validateTag(s: string): string** that **trims** surrounding whitespace and returns the result.\nIf the trimmed tag is empty (blank or all spaces), **throw** an Error instead.\n~~~ts\nvalidateTag('  neo ') // 'neo'\nvalidateTag('   ')    // throws\n~~~",
        starter: "function validateTag(s: string): string {\n  // TODO: trim s; throw if empty, else return it\n  return s;\n}",
        solution: "function validateTag(s: string): string {\n  const t: string = s.trim();\n  if (t === '') throw new Error('tag required');\n  return t;\n}",
        tests: [
        { name: "trims padding", code: "assertEqual(validateTag('  neo '), 'neo');" },
        { name: "keeps inner content", code: "assertEqual(validateTag('trinity'), 'trinity');" },
        { name: "throws on blank spaces", code: "assertThrows(function () { validateTag('   '); });" },
        { name: "throws on empty string", code: "assertThrows(function () { validateTag(''); });" }
        ],
        hint: "const t = s.trim(); if (t === '') throw new Error(...); return t;", lore: "A blank ID badge gets you nowhere at the checkpoint."
      },
      {
        id: "ts-getorelse", title: "FALLBACK CACHE", kind: "function", difficulty: 2, xp: 190,
        brief: "Trust the function, keep a backup ready.",
        prompt: "Define a generic **getOrElse<T>(fn: () => T, fallback: T): T** that calls `fn()` and returns its value.\nIf `fn()` **throws**, swallow the error with `try` / `catch` and return `fallback` instead. It must never throw.\n~~~ts\ngetOrElse(() => 42, 0)                       // 42\ngetOrElse(() => { throw new Error('x'); }, 0) // 0\n~~~",
        starter: "function getOrElse<T>(fn: () => T, fallback: T): T {\n  // TODO: return fn(), or fallback if it throws\n  return fn();\n}",
        solution: "function getOrElse<T>(fn: () => T, fallback: T): T {\n  try {\n    return fn();\n  } catch (e) {\n    return fallback;\n  }\n}",
        tests: [
        { name: "returns fn value", code: "assertEqual(getOrElse(function () { return 42; }, 0), 42);" },
        { name: "falls back on throw", code: "assertEqual(getOrElse(function () { throw new Error('boom'); }, 0), 0);" },
        { name: "fallback can be a string", code: "assertEqual(getOrElse(function () { throw new Error('down'); }, 'OFFLINE'), 'OFFLINE');" },
        { name: "does not throw on failure", code: "assertEqual(getOrElse(function () { throw new Error('e'); }, -1), -1);" }
        ],
        hint: "try { return fn(); } catch (e) { return fallback; }", lore: "When the live feed dies, the cache keeps the deck breathing."
      },
      {
        id: "ts-safesqrt", title: "RESULT ROOT", kind: "function", difficulty: 3, xp: 240,
        brief: "Square root that returns a typed Result.",
        prompt: "A **Result union** carries either a value or an error, never both:\n~~~ts\ntype Result<T> = { ok: true; value: T } | { ok: false; error: string };\n~~~\nDefine **safeSqrt(n: number): Result<number>**. For negative `n` return `{ ok: false, error: 'negative' }`; otherwise return `{ ok: true, value: Math.sqrt(n) }`.\n~~~ts\nsafeSqrt(9)  // { ok: true, value: 3 }\nsafeSqrt(-4) // { ok: false, error: 'negative' }\n~~~",
        starter: "type Result<T> = { ok: true; value: T } | { ok: false; error: string };\n\nfunction safeSqrt(n: number): Result<number> {\n  // TODO: negative -> error result, else ok result\n  return { ok: true, value: n };\n}",
        solution: "type Result<T> = { ok: true; value: T } | { ok: false; error: string };\n\nfunction safeSqrt(n: number): Result<number> {\n  if (n < 0) return { ok: false, error: 'negative' };\n  return { ok: true, value: Math.sqrt(n) };\n}",
        tests: [
        { name: "perfect square -> ok", code: "assertEqual(safeSqrt(9), { ok: true, value: 3 });" },
        { name: "zero -> ok", code: "assertEqual(safeSqrt(0), { ok: true, value: 0 });" },
        { name: "negative -> error", code: "assertEqual(safeSqrt(-4), { ok: false, error: 'negative' });" },
        { name: "ok flag set on success", code: "assertEqual(safeSqrt(16).ok, true);" }
        ],
        hint: "if (n < 0) return { ok: false, error: 'negative' }; return { ok: true, value: Math.sqrt(n) };", lore: "The result packet tags itself: a clean root, or a flagged fault."
      },
      {
        id: "ts-firstok", title: "FIRST CONTACT", kind: "function", difficulty: 3, xp: 240,
        brief: "Return the first attempt that survives.",
        prompt: "Define a generic **firstOk<T>(fns: Array<() => T>): T** that tries each function in order and returns the value of the **first one that does not throw**.\nWrap each call in `try` / `catch`; if **every** function throws, **throw** an Error.\n~~~ts\nfirstOk([() => { throw new Error('x'); }, () => 7]) // 7\nfirstOk([() => { throw new Error('x'); }])          // throws\n~~~",
        starter: "function firstOk<T>(fns: Array<() => T>): T {\n  // TODO: return the first call that does not throw; throw if all fail\n  return fns[0]();\n}",
        solution: "function firstOk<T>(fns: Array<() => T>): T {\n  for (let i = 0; i < fns.length; i++) {\n    try {\n      return fns[i]();\n    } catch (e) {\n      // try the next one\n    }\n  }\n  throw new Error('all attempts failed');\n}",
        tests: [
        { name: "first survivor wins", code: "assertEqual(firstOk([function () { return 1; }, function () { return 2; }]), 1);" },
        { name: "skips a thrower", code: "assertEqual(firstOk([function () { throw new Error('a'); }, function () { return 7; }]), 7);" },
        { name: "skips two throwers", code: "assertEqual(firstOk([function () { throw new Error('a'); }, function () { throw new Error('b'); }, function () { return 'live'; }]), 'live');" },
        { name: "all throw -> throws", code: "assertThrows(function () { firstOk([function () { throw new Error('x'); }, function () { throw new Error('y'); }]); });" }
        ],
        hint: "loop the array, try { return fns[i](); } catch (e) {}; after the loop throw new Error(...)", lore: "Probe the array of channels; the first that answers clean is your link."
      }
  ]);

  add("tsm0d-stralgo", [
      {
        id: "ts-capitalize", title: "PROPER CASE", kind: "function", difficulty: 1, xp: 150,
        brief: "Stand the word up straight.",
        prompt: "Define **capitalize(s: string): string** with the first character uppercase and the rest lowercase. Empty string -> ''.\n~~~ts\ncapitalize('lAIN') // 'Lain'\n~~~",
        starter: "function capitalize(s: string): string {\n  // TODO\n  return '';\n}",
        solution: "function capitalize(s: string): string {\n  if (s.length === 0) return '';\n  return s[0].toUpperCase() + s.slice(1).toLowerCase();\n}",
        tests: [
        { name: "capitalizes", code: "assertEqual(capitalize('lAIN'), 'Lain');" },
        { name: "lowercases tail", code: "assertEqual(capitalize('NEO'), 'Neo');" },
        { name: "single", code: "assertEqual(capitalize('x'), 'X');" },
        { name: "empty -> empty", code: "assertEqual(capitalize(''), '');" }
        ],
        hint: "s[0].toUpperCase() + s.slice(1).toLowerCase()", lore: "Posture matters in the Wired."
      },
      {
        id: "ts-countchar", title: "TALLY GLYPH", kind: "function", difficulty: 2, xp: 180,
        brief: "Count how many times one glyph appears.",
        prompt: "Define **countChar(s: string, ch: string): number** returning how many times `ch` occurs in `s`. Match case exactly.\n~~~ts\ncountChar('banana', 'a') // 3\ncountChar('abc', 'z')    // 0\n~~~",
        starter: "function countChar(s: string, ch: string): number {\n  // TODO\n  return -1;\n}",
        solution: "function countChar(s: string, ch: string): number {\n  let n = 0;\n  for (const c of s) {\n    if (c === ch) n++;\n  }\n  return n;\n}",
        tests: [
        { name: "three a's", code: "assert(countChar('banana', 'a') === 3);" },
        { name: "two l's", code: "assert(countChar('hello', 'l') === 2);" },
        { name: "absent -> 0", code: "assert(countChar('abc', 'z') === 0);" },
        { name: "empty -> 0", code: "assert(countChar('', 'a') === 0);" }
        ],
        hint: "Loop the characters of s and do n++ each time c === ch.", lore: "Every matching glyph trips the counter once."
      },
      {
        id: "ts-isanagram", title: "LETTER MIRROR", kind: "function", difficulty: 2, xp: 190,
        brief: "Do two strings hold the very same letters?",
        prompt: "Define **isAnagram(a: string, b: string): boolean** that is `true` when both strings contain exactly the same characters (the same counts), regardless of order. Compare case-sensitively. Sorting each string's characters and comparing the results is the simplest route.\n~~~ts\nisAnagram('listen', 'silent') // true\nisAnagram('abc', 'abd')       // false\n~~~",
        starter: "function isAnagram(a: string, b: string): boolean {\n  // TODO\n  return true;\n}",
        solution: "function isAnagram(a: string, b: string): boolean {\n  const sort = (x: string): string => x.split('').sort().join('');\n  return sort(a) === sort(b);\n}",
        tests: [
        { name: "listen/silent", code: "assert(isAnagram('listen', 'silent') === true);" },
        { name: "cat/act", code: "assert(isAnagram('cat', 'act') === true);" },
        { name: "one letter off", code: "assert(isAnagram('abc', 'abd') === false);" },
        { name: "different lengths", code: "assert(isAnagram('a', 'aa') === false);" },
        { name: "both empty", code: "assert(isAnagram('', '') === true);" }
        ],
        hint: "Sort the characters of each string and compare: x.split('').sort().join('').", lore: "Same atoms, rearranged — the mirror still recognises them."
      },
      {
        id: "ts-mostfrequentchar", title: "DOMINANT SIGNAL", kind: "function", difficulty: 3, xp: 210,
        brief: "Find the character that shows up the most.",
        prompt: "Define **mostFrequentChar(s: string): string** returning the single character that occurs most often, ignoring spaces. On a tie, return the character that *first* reaches that maximum count. Assume `s` has at least one non-space character.\n~~~ts\nmostFrequentChar('hello')  // 'l'\nmostFrequentChar('a b a')  // 'a'\n~~~",
        starter: "function mostFrequentChar(s: string): string {\n  // TODO\n  return ' ';\n}",
        solution: "function mostFrequentChar(s: string): string {\n  const counts: Record<string, number> = {};\n  let best = '';\n  let max = 0;\n  for (const c of s) {\n    if (c === ' ') continue;\n    counts[c] = (counts[c] || 0) + 1;\n    if (counts[c] > max) {\n      max = counts[c];\n      best = c;\n    }\n  }\n  return best;\n}",
        tests: [
        { name: "double l wins", code: "assertEqual(mostFrequentChar('hello'), 'l');" },
        { name: "tie -> first to reach max", code: "assertEqual(mostFrequentChar('aabb'), 'a');" },
        { name: "spaces ignored", code: "assertEqual(mostFrequentChar('a b a'), 'a');" },
        { name: "all unique -> first", code: "assertEqual(mostFrequentChar('xyz'), 'x');" }
        ],
        hint: "Tally each non-space char in a map; update best only when a count strictly beats the current max.", lore: "Amid the chatter, one signal climbs loudest first."
      },
      {
        id: "ts-caesar", title: "SHIFT CIPHER", kind: "function", difficulty: 3, xp: 220,
        brief: "Rotate the lowercase alphabet forward, wrapping past z.",
        prompt: "Define **caesar(s: string, n: number): string** that shifts every lowercase letter `a`-`z` forward by `n` positions, wrapping `z` back to `a`. Leave all other characters (uppercase, spaces, punctuation) unchanged.\nUse char codes: `'a'` is 97. For a letter, `((code - 97 + n) % 26) + 97` gives the shifted code.\n~~~ts\ncaesar('abc', 1) // 'bcd'\ncaesar('xyz', 3) // 'abc'\n~~~",
        starter: "function caesar(s: string, n: number): string {\n  // TODO\n  return s;\n}",
        solution: "function caesar(s: string, n: number): string {\n  let out = '';\n  for (const c of s) {\n    const code = c.charCodeAt(0);\n    if (code >= 97 && code <= 122) {\n      out += String.fromCharCode(((code - 97 + n) % 26) + 97);\n    } else {\n      out += c;\n    }\n  }\n  return out;\n}",
        tests: [
        { name: "simple shift", code: "assertEqual(caesar('abc', 1), 'bcd');" },
        { name: "wrap past z", code: "assertEqual(caesar('xyz', 3), 'abc');" },
        { name: "rot13 with punctuation", code: "assertEqual(caesar('hello, world', 13), 'uryyb, jbeyq');" },
        { name: "uppercase untouched", code: "assertEqual(caesar('Zap!', 1), 'Zbq!');" },
        { name: "shift of zero", code: "assertEqual(caesar('abc', 0), 'abc');" }
        ],
        hint: "Loop chars; only when code is 97..122 rebuild it as ((code - 97 + n) % 26) + 97, else keep c.", lore: "Slide the glyphs down the ring; whatever falls off z reappears at a."
      }
  ]);

  add("tsm0e-math", [
      {
        id: "ts-digitalroot", title: "DIGIT COLLAPSE", kind: "function", difficulty: 1, xp: 170,
        brief: "Crush a number down to a single glowing digit.",
        prompt: "Define **digitalRoot(n: number): number** — keep replacing `n` with the sum of its digits until only one digit is left. Assume `n >= 0`.\n~~~ts\ndigitalRoot(38)  // 3 + 8 = 11 -> 1 + 1 = 2\ndigitalRoot(9)   // 9\n~~~",
        starter: "function digitalRoot(n: number): number {\n  // TODO: sum digits repeatedly until one digit remains\n  return n;\n}",
        solution: "function digitalRoot(n: number): number {\n  while (n >= 10) {\n    let sum: number = 0;\n    while (n > 0) {\n      sum += n % 10;\n      n = Math.floor(n / 10);\n    }\n    n = sum;\n  }\n  return n;\n}",
        tests: [
        { name: "38 -> 2", code: "assertEqual(digitalRoot(38), 2);" },
        { name: "single digit stays", code: "assertEqual(digitalRoot(9), 9);" },
        { name: "zero", code: "assertEqual(digitalRoot(0), 0);" },
        { name: "12345 -> 6", code: "assertEqual(digitalRoot(12345), 6);" },
        { name: "99 -> 9", code: "assertEqual(digitalRoot(99), 9);" }
        ],
        hint: "Outer loop while n >= 10; inner loop adds n % 10 and does n = Math.floor(n / 10).", lore: "Fold the number in on itself until a single rune remains."
      },
      {
        id: "ts-lcm", title: "SYNC CYCLE", kind: "function", difficulty: 2, xp: 180,
        brief: "When do the two cycles realign?",
        prompt: "Define **lcm(a: number, b: number): number** — the least common multiple of two positive integers (a*b divided by their gcd).\n~~~ts\nlcm(4, 6) // 12\n~~~",
        starter: "function lcm(a: number, b: number): number {\n  // TODO\n  return 0;\n}",
        solution: "function lcm(a: number, b: number): number {\n  function gcd(x: number, y: number): number { return y === 0 ? x : gcd(y, x % y); }\n  return a / gcd(a, b) * b;\n}",
        tests: [
        { name: "lcm(4,6)", code: "assertEqual(lcm(4, 6), 12);" },
        { name: "coprime", code: "assertEqual(lcm(3, 5), 15);" },
        { name: "equal", code: "assertEqual(lcm(7, 7), 7);" },
        { name: "one divides other", code: "assertEqual(lcm(2, 8), 8);" }
        ],
        hint: "a / gcd(a,b) * b", lore: "Two rhythms, one downbeat."
      },
      {
        id: "ts-ispoweroftwo", title: "BINARY BEACON", kind: "function", difficulty: 2, xp: 190,
        brief: "Does this number sit exactly on a power-of-two boundary?",
        prompt: "Define **isPowerOfTwo(n: number): boolean** — `true` when `n` is `1, 2, 4, 8, 16, ...`, and `false` for `0`, negatives, and anything in between.\n~~~ts\nisPowerOfTwo(16) // true\nisPowerOfTwo(6)  // false\nisPowerOfTwo(0)  // false\n~~~",
        starter: "function isPowerOfTwo(n: number): boolean {\n  // TODO: only exact powers of two should pass\n  return n > 0;\n}",
        solution: "function isPowerOfTwo(n: number): boolean {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
        tests: [
        { name: "1 is 2^0", code: "assert(isPowerOfTwo(1) === true);" },
        { name: "16 is a power", code: "assert(isPowerOfTwo(16) === true);" },
        { name: "1024 is a power", code: "assert(isPowerOfTwo(1024) === true);" },
        { name: "6 is not", code: "assert(isPowerOfTwo(6) === false);" },
        { name: "zero is not", code: "assert(isPowerOfTwo(0) === false);" },
        { name: "negative is not", code: "assert(isPowerOfTwo(-4) === false);" }
        ],
        hint: "A power of two has a single set bit: n > 0 && (n & (n - 1)) === 0.", lore: "One lone bit burning in the dark — that is a true beacon."
      },
      {
        id: "ts-roundto", title: "PRECISION GATE", kind: "function", difficulty: 3, xp: 210,
        brief: "Snap a value to a fixed number of decimal places.",
        prompt: "Define **roundTo(n: number, places: number): number** — round `n` to `places` decimal places.\nScale up, round, scale back down: `Math.round(n * 10 ** places) / 10 ** places`.\n~~~ts\nroundTo(3.14159, 2) // 3.14\nroundTo(1.5, 0)     // 2\n~~~",
        starter: "function roundTo(n: number, places: number): number {\n  // TODO: scale, round, scale back\n  return Math.round(n);\n}",
        solution: "function roundTo(n: number, places: number): number {\n  return Math.round(n * 10 ** places) / 10 ** places;\n}",
        tests: [
        { name: "pi to 2 places", code: "assertEqual(roundTo(3.14159, 2), 3.14);" },
        { name: "pi to 4 places", code: "assertEqual(roundTo(3.14159, 4), 3.1416);" },
        { name: "half rounds up", code: "assertEqual(roundTo(1.5, 0), 2);" },
        { name: "one decimal", code: "assertEqual(roundTo(123.456, 1), 123.5);" },
        { name: "already short", code: "assertEqual(roundTo(6.25, 1), 6.3);" }
        ],
        hint: "return Math.round(n * 10 ** places) / 10 ** places;", lore: "Trim the noise; keep only the decimals that matter."
      },
      {
        id: "ts-sumdivisors", title: "FACTOR HARVEST", kind: "function", difficulty: 3, xp: 220,
        brief: "Add up every divisor a number will admit.",
        prompt: "Define **sumDivisors(n: number): number** — the sum of every positive divisor of `n`, including `1` and `n` itself. Assume `n >= 1`.\n~~~ts\nsumDivisors(6)  // 1 + 2 + 3 + 6 = 12\nsumDivisors(7)  // 1 + 7 = 8\n~~~",
        starter: "function sumDivisors(n: number): number {\n  // TODO: add every d from 1..n that divides n\n  return n;\n}",
        solution: "function sumDivisors(n: number): number {\n  let total: number = 0;\n  for (let d: number = 1; d <= n; d++) {\n    if (n % d === 0) total += d;\n  }\n  return total;\n}",
        tests: [
        { name: "perfect number 6", code: "assertEqual(sumDivisors(6), 12);" },
        { name: "prime 7", code: "assertEqual(sumDivisors(7), 8);" },
        { name: "one", code: "assertEqual(sumDivisors(1), 1);" },
        { name: "twelve", code: "assertEqual(sumDivisors(12), 28);" },
        { name: "power of two 16", code: "assertEqual(sumDivisors(16), 31);" }
        ],
        hint: "Loop d from 1 to n; whenever n % d === 0, add d to a running total.", lore: "Lay out every factor the number will surrender, then weigh the pile."
      }
  ]);

  add("tsm0f-modeling", [
      {
        id: "ts-setfield", title: "IMMUTABLE WRITE", kind: "function", difficulty: 2, xp: 200,
        brief: "Change one field without touching the original.",
        prompt: "Define **setField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T** returning a **new** object with `key` set to `value`. Do **not** mutate the input.\nThe `K extends keyof T` bound means `key` must be one of the object's real keys, and `value` must match that field's type.\n~~~ts\nsetField({ hp: 10, mp: 5 }, 'hp', 99) // { hp: 99, mp: 5 }\n~~~",
        starter: "function setField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {\n  // TODO: copy obj, then overwrite key with value\n  return obj;\n}",
        solution: "function setField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {\n  return Object.assign({}, obj, { [key]: value });\n}",
        tests: [
        { name: "updates copy", code: "assertEqual(setField({ hp: 10, mp: 5 }, 'hp', 99), { hp: 99, mp: 5 });" },
        { name: "adds nothing, keeps siblings", code: "assertEqual(setField({ name: 'Neo', lvl: 1 }, 'lvl', 7), { name: 'Neo', lvl: 7 });" },
        { name: "does not mutate input", code: "var src = { hp: 10, mp: 5 };\nsetField(src, 'hp', 99);\nassertEqual(src, { hp: 10, mp: 5 });" }
        ],
        hint: "Object.assign({}, obj, { [key]: value }) — a fresh object, then the one override.", lore: "Write to the record without leaving prints on the original."
      },
      {
        id: "ts-combine", title: "SHELL SPLICE", kind: "function", difficulty: 2, xp: 200,
        brief: "Splice two shells into one that carries both.",
        prompt: "Define **combine<A, B>(a: A, b: B): A & B** that shallow-merges `a` and `b` into one object holding **all** keys of both.\nThe return type `A & B` is an **intersection**: the result satisfies *both* shapes. On a key collision, **`b` wins**.\n~~~ts\ncombine({ id: 1 }, { name: 'Neo' }) // { id: 1, name: 'Neo' }\ncombine({ x: 1 }, { x: 9 })         // { x: 9 }\n~~~",
        starter: "function combine<A, B>(a: A, b: B): A & B {\n  // TODO: merge a and b into a new object (b wins on conflict)\n  return a as A & B;\n}",
        solution: "function combine<A, B>(a: A, b: B): A & B {\n  return Object.assign({}, a, b);\n}",
        tests: [
        { name: "union of keys", code: "assertEqual(combine({ id: 1 }, { name: 'Neo' }), { id: 1, name: 'Neo' });" },
        { name: "b wins on conflict", code: "assertEqual(combine({ x: 1, y: 2 }, { x: 9 }), { x: 9, y: 2 });" },
        { name: "empty left side", code: "assertEqual(combine({}, { ok: true }), { ok: true });" }
        ],
        hint: "Object.assign({}, a, b) — later sources overwrite earlier ones, so b wins.", lore: "Two partial shells, one merged body that answers to both."
      },
      {
        id: "ts-incfield", title: "COUNTER TICK", kind: "function", difficulty: 3, xp: 210,
        brief: "Bump a numeric field by one, immutably.",
        prompt: "Define **incField<T, K extends keyof T>(obj: T, key: K): T** returning a **new** object where the number at `key` is increased by **1**. Do **not** mutate the input.\n`keyof T` lets the caller point at any field by name; here we assume that field holds a number.\n~~~ts\nincField({ hits: 3, miss: 0 }, 'hits') // { hits: 4, miss: 0 }\n~~~",
        starter: "function incField<T, K extends keyof T>(obj: T, key: K): T {\n  // TODO: copy obj, then add 1 to obj[key]\n  return obj;\n}",
        solution: "function incField<T, K extends keyof T>(obj: T, key: K): T {\n  return Object.assign({}, obj, { [key]: (obj[key] as unknown as number) + 1 });\n}",
        tests: [
        { name: "bumps target", code: "assertEqual(incField({ hits: 3, miss: 0 }, 'hits'), { hits: 4, miss: 0 });" },
        { name: "leaves siblings", code: "assertEqual(incField({ a: 0, b: 5 }, 'b'), { a: 0, b: 6 });" },
        { name: "does not mutate input", code: "var src = { n: 41 };\nincField(src, 'n');\nassertEqual(src, { n: 41 });" }
        ],
        hint: "Object.assign({}, obj, { [key]: obj[key] + 1 }) — spread, then override the one field.", lore: "Tick the counter on a copy; the live record stays untouched."
      },
      {
        id: "ts-without", title: "FIELD PURGE", kind: "function", difficulty: 3, xp: 210,
        brief: "Drop one key, keep the rest, leave the original intact.",
        prompt: "Define **without<T, K extends keyof T>(obj: T, key: K): T** returning a **new** object that is a copy of `obj` with `key` **removed**. Do **not** mutate the input.\n`K extends keyof T` guarantees you can only purge a key that actually exists.\n~~~ts\nwithout({ a: 1, b: 2 }, 'b') // { a: 1 }\n~~~",
        starter: "function without<T, K extends keyof T>(obj: T, key: K): T {\n  // TODO: copy obj into a fresh object, then delete key from the copy\n  return obj;\n}",
        solution: "function without<T, K extends keyof T>(obj: T, key: K): T {\n  var out = Object.assign({}, obj);\n  delete out[key];\n  return out;\n}",
        tests: [
        { name: "removes key", code: "assertEqual(without({ a: 1, b: 2 }, 'b'), { a: 1 });" },
        { name: "removing only key -> empty", code: "assertEqual(without({ solo: 9 }, 'solo'), {});" },
        { name: "keeps other keys", code: "assertEqual(without({ x: 1, y: 2, z: 3 }, 'y'), { x: 1, z: 3 });" },
        { name: "does not mutate input", code: "var src = { a: 1, b: 2 };\nwithout(src, 'b');\nassertEqual(src, { a: 1, b: 2 });" }
        ],
        hint: "Copy with Object.assign({}, obj), then delete out[key] from the copy — never the original.", lore: "Scrub one field from the duplicate; the source ledger keeps every byte."
      },
      {
        id: "ts-mergeall", title: "PATCH FOLD", kind: "function", difficulty: 3, xp: 210,
        brief: "Fold a stack of partial patches into one record.",
        prompt: "Define **mergeAll<T>(objs: T[]): T** that folds a list of **partial** records into a single object via spread/merge.\nProcess left to right so **later entries win** on conflicts. An **empty** list yields `{}`.\n~~~ts\nmergeAll([{ a: 1 }, { b: 2 }, { a: 9 }]) // { a: 9, b: 2 }\nmergeAll([])                             // {}\n~~~",
        starter: "function mergeAll<T>(objs: T[]): T {\n  // TODO: fold every object into one (later wins); empty -> {}\n  return {} as T;\n}",
        solution: "function mergeAll<T>(objs: T[]): T {\n  var out = {} as T;\n  for (var i = 0; i < objs.length; i++) {\n    out = Object.assign(out, objs[i]);\n  }\n  return out;\n}",
        tests: [
        { name: "folds three", code: "assertEqual(mergeAll([{ a: 1 }, { b: 2 }, { c: 3 }]), { a: 1, b: 2, c: 3 });" },
        { name: "later wins", code: "assertEqual(mergeAll([{ a: 1 }, { a: 9 }]), { a: 9 });" },
        { name: "empty list -> {}", code: "assertEqual(mergeAll([]), {});" },
        { name: "single patch", code: "assertEqual(mergeAll([{ only: true }]), { only: true });" }
        ],
        hint: "Start from {} and Object.assign each object in turn so later patches overwrite earlier ones.", lore: "Stack the patches, fold them down, read the final state off the top."
      }
  ]);

  add("tsm10-algos", [
      {
        id: "ts-contains", title: "ICE PROBE", kind: "function", difficulty: 2, xp: 190,
        brief: "Is the key in the sorted vault?",
        prompt: "`sorted` is ascending. Define **contains(sorted: number[], x: number): boolean** using BINARY search.\n~~~ts\ncontains([1, 3, 5, 7], 5)  // true\ncontains([1, 3, 5, 7], 4)  // false\n~~~",
        starter: "function contains(sorted: number[], x: number): boolean {\n  // TODO: lo/hi window, compare the midpoint\n  return false;\n}",
        solution: "function contains(sorted: number[], x: number): boolean {\n  let lo = 0, hi = sorted.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (sorted[mid] === x) return true;\n    if (sorted[mid] < x) lo = mid + 1; else hi = mid - 1;\n  }\n  return false;\n}",
        tests: [
        { name: "present", code: "assert(contains([1,3,5,7], 5) === true && contains([1,3,5,7], 1) === true && contains([1,3,5,7], 7) === true);" },
        { name: "absent", code: "assert(contains([1,3,5,7], 4) === false && contains([], 9) === false && contains([2], 1) === false);" }
        ],
        hint: "lo<=hi loop; compare midpoint; move lo or hi.", lore: "Halve the space until ICE cracks."
      },
      {
        id: "ts-dedupesorted", title: "SIGNAL SQUELCH", kind: "function", difficulty: 2, xp: 190,
        brief: "Collapse repeated bytes in an ordered stream.",
        prompt: "`xs` is already sorted, so duplicates sit next to each other. Define a generic **dedupeSorted<T>(xs: T[]): T[]**\nreturning a new array with each run of equal, *adjacent* elements collapsed to one.\n~~~ts\ndedupeSorted([1, 1, 2, 3, 3, 3])  // [1, 2, 3]\ndedupeSorted<number>([])          // []\n~~~",
        starter: "function dedupeSorted<T>(xs: T[]): T[] {\n  // TODO: keep an element only when it differs from the one before it\n  return xs.slice();\n}",
        solution: "function dedupeSorted<T>(xs: T[]): T[] {\n  const out: T[] = [];\n  for (let i = 0; i < xs.length; i++) {\n    if (i === 0 || xs[i] !== xs[i - 1]) out.push(xs[i]);\n  }\n  return out;\n}",
        tests: [
        { name: "runs collapsed", code: "assertEqual(dedupeSorted([1, 1, 2, 3, 3, 3]), [1, 2, 3]);" },
        { name: "strings", code: "assertEqual(dedupeSorted(['a', 'a', 'b', 'b', 'c']), ['a', 'b', 'c']);" },
        { name: "already unique", code: "assertEqual(dedupeSorted([1, 2, 3]), [1, 2, 3]);" },
        { name: "empty -> empty", code: "assertEqual(dedupeSorted([]), []);" }
        ],
        hint: "Push xs[i] only when i===0 or xs[i] !== xs[i-1].", lore: "Silence the echo; keep one clean pulse per signal."
      },
      {
        id: "ts-rotateleft", title: "PHASE SHIFT", kind: "function", difficulty: 3, xp: 190,
        brief: "Cycle the buffer leftward, wrapping the overflow.",
        prompt: "Define a generic **rotateLeft<T>(xs: T[], k: number): T[]** returning a new array shifted left by `k` — the\nfirst `k` elements wrap around to the back. `k` may exceed the length (rotate modulo length); an empty array yields `[]`.\n~~~ts\nrotateLeft([1, 2, 3, 4, 5], 2)  // [3, 4, 5, 1, 2]\nrotateLeft([1, 2, 3], 4)        // [2, 3, 1]\n~~~",
        starter: "function rotateLeft<T>(xs: T[], k: number): T[] {\n  // TODO: split at k (mod length) and swap the two parts\n  return xs.slice();\n}",
        solution: "function rotateLeft<T>(xs: T[], k: number): T[] {\n  const n = xs.length;\n  if (n === 0) return [];\n  const s = ((k % n) + n) % n;\n  return xs.slice(s).concat(xs.slice(0, s));\n}",
        tests: [
        { name: "basic rotate", code: "assertEqual(rotateLeft([1, 2, 3, 4, 5], 2), [3, 4, 5, 1, 2]);" },
        { name: "k exceeds length", code: "assertEqual(rotateLeft([1, 2, 3], 4), [2, 3, 1]);" },
        { name: "k = 0 unchanged", code: "assertEqual(rotateLeft(['a', 'b', 'c'], 0), ['a', 'b', 'c']);" },
        { name: "empty -> empty", code: "assertEqual(rotateLeft([], 3), []);" }
        ],
        hint: "s = k % length; return xs.slice(s).concat(xs.slice(0, s)). Guard length 0.", lore: "Spin the ring buffer; what falls off the front re-enters the rear."
      },
      {
        id: "ts-windows", title: "SLIDING APERTURE", kind: "function", difficulty: 3, xp: 190,
        brief: "Scan every contiguous frame of a fixed width.",
        prompt: "Define a generic **windows<T>(xs: T[], size: number): T[][]** returning every contiguous slice of length `size`,\nin order. If `size` is larger than the array, return `[]`.\n~~~ts\nwindows([1, 2, 3, 4], 2)  // [[1, 2], [2, 3], [3, 4]]\nwindows([1, 2], 3)        // []\n~~~",
        starter: "function windows<T>(xs: T[], size: number): T[][] {\n  // TODO: slide a window of length size across xs\n  return [];\n}",
        solution: "function windows<T>(xs: T[], size: number): T[][] {\n  const out: T[][] = [];\n  for (let i = 0; i + size <= xs.length; i++) {\n    out.push(xs.slice(i, i + size));\n  }\n  return out;\n}",
        tests: [
        { name: "sliding pairs", code: "assertEqual(windows([1, 2, 3, 4], 2), [[1, 2], [2, 3], [3, 4]]);" },
        { name: "size 1", code: "assertEqual(windows(['a', 'b', 'c'], 1), [['a'], ['b'], ['c']]);" },
        { name: "size = length", code: "assertEqual(windows([1, 2, 3], 3), [[1, 2, 3]]);" },
        { name: "size > length -> empty", code: "assertEqual(windows([1, 2], 3), []);" }
        ],
        hint: "Loop while i + size <= xs.length; push xs.slice(i, i + size).", lore: "Drag the aperture one step at a time; capture each frame in sequence."
      },
      {
        id: "ts-countoccurrences", title: "TALLY SWEEP", kind: "function", difficulty: 3, xp: 190,
        brief: "Count how many times the key shows up.",
        prompt: "`sorted` is ascending. Define **countOccurrences(sorted: number[], x: number): number** returning how many times\n`x` appears. A linear scan is fine. Absent or empty yields `0`.\n~~~ts\ncountOccurrences([1, 2, 2, 2, 3], 2)  // 3\ncountOccurrences([1, 2, 3], 9)        // 0\n~~~",
        starter: "function countOccurrences(sorted: number[], x: number): number {\n  // TODO: tally every element equal to x\n  return 0;\n}",
        solution: "function countOccurrences(sorted: number[], x: number): number {\n  let n = 0;\n  for (let i = 0; i < sorted.length; i++) {\n    if (sorted[i] === x) n++;\n  }\n  return n;\n}",
        tests: [
        { name: "multiple hits", code: "assert(countOccurrences([1, 2, 2, 2, 3], 2) === 3);" },
        { name: "single hit", code: "assert(countOccurrences([1, 2, 3], 3) === 1 && countOccurrences([5, 5], 5) === 2);" },
        { name: "absent / empty -> 0", code: "assert(countOccurrences([1, 2, 3], 9) === 0 && countOccurrences([], 1) === 0);" }
        ],
        hint: "Walk the array; increment a counter whenever sorted[i] === x.", lore: "Sweep the log and count every matching ping."
      }
  ]);
})();
