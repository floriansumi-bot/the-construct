/* ============================================================
   curriculum-ts-pack-6.js — TYPESCRIPT expansion pack 6 (final).
   Appends 3 sectors (0x0E..0x10), bringing TS to 16 sectors / 48 nodes
   — parity with Python & JavaScript:
     0x0E NUMBERS & MATH    — clamp, gcd, primality
     0x0F DATA MODELING     — immutable update, merge (A & B), Partial<T> defaults
     0x10 ALGORITHMS        — binary search, is-sorted, generic chunk
   Generic object-spread returns are cast for tsc; starters compile but fail.
   Verified by _verify/verify-ts.js.
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;

  t.modules.push(

    /* ---------- TS 0x0E ---------- */
    {
      id: "tsm0e-math", code: "0x0E", title: "NUMBERS & MATH",
      subtitle: "clamp · gcd · primality",
      theory: J(
        "## Clamp",
        "Pin a value into a range: `Math.max(lo, Math.min(x, hi))`.",
        "## Euclid's GCD",
        "Replace `(a, b)` with `(b, a % b)` until `b` is 0 — then `a` is the greatest common divisor.",
        "## Primality to √n",
        "Test divisors only up to the square root; `i * i <= n` avoids floating-point error.",
        "> INTEL — Integer comparisons (`i * i <= n`) beat `Math.sqrt` for exactness."
      ),
      exercises: [
        {
          id: "ts-clamp", title: "RANGE CLAMP", kind: "function", difficulty: 1, xp: 150,
          brief: "Keep the throttle in bounds.",
          prompt: J("Define **clamp(x: number, lo: number, hi: number): number** constraining `x` to `[lo, hi]`.", "~~~ts", "clamp(99, 0, 10)  // 10", "~~~"),
          starter: J("function clamp(x: number, lo: number, hi: number): number {", "  // TODO", "  return x;", "}"),
          solution: J("function clamp(x: number, lo: number, hi: number): number {", "  return Math.max(lo, Math.min(x, hi));", "}"),
          tests: [
            { name: "inside", code: "assertEqual(clamp(5, 0, 10), 5);" },
            { name: "outside", code: "assert(clamp(-3, 0, 10) === 0 && clamp(99, 0, 10) === 10);" },
          ],
          hint: "Math.max(lo, Math.min(x, hi))",
          lore: "Redline is a limit, not a target.",
        },
        {
          id: "ts-gcd", title: "COMMON DIVISOR", kind: "function", difficulty: 2, xp: 190,
          brief: "Reduce two signals to their root.",
          prompt: J("Define **gcd(a: number, b: number): number** (Euclid; a, b >= 0, not both 0).", "~~~ts", "gcd(12, 18)  // 6", "~~~"),
          starter: J("function gcd(a: number, b: number): number {", "  // TODO: loop until b is 0", "  return 1;", "}"),
          solution: J("function gcd(a: number, b: number): number {", "  while (b !== 0) { const r = a % b; a = b; b = r; }", "  return a;", "}"),
          tests: [
            { name: "gcd(12,18)=6", code: "assertEqual(gcd(12, 18), 6);" },
            { name: "coprime", code: "assert(gcd(17, 5) === 1);" },
            { name: "with zero", code: "assert(gcd(0, 9) === 9 && gcd(9, 0) === 9);" },
          ],
          hint: "while (b !== 0) { const r = a % b; a = b; b = r; } return a;",
          lore: "Two frequencies, one shared root.",
        },
        {
          id: "ts-isprime", title: "PRIME SCAN", kind: "function", difficulty: 2, xp: 190,
          brief: "Flag the indivisible.",
          prompt: J("Define **isPrime(n: number): boolean**. Numbers below 2 are not prime.", "~~~ts", "isPrime(13)  // true", "~~~"),
          starter: J("function isPrime(n: number): boolean {", "  // TODO", "  return true;", "}"),
          solution: J(
            "function isPrime(n: number): boolean {",
            "  if (n < 2) return false;",
            "  for (let i = 2; i * i <= n; i++) { if (n % i === 0) return false; }",
            "  return true;",
            "}"
          ),
          tests: [
            { name: "primes", code: "assert(isPrime(2) === true && isPrime(13) === true && isPrime(97) === true);" },
            { name: "composites", code: "assert(isPrime(1) === false && isPrime(4) === false && isPrime(91) === false);" },
          ],
          hint: "if (n < 2) return false; for (let i = 2; i*i <= n; i++) if (n % i === 0) return false; return true;",
          lore: "Indivisible, like a well-kept key.",
        },
      ],
    },

    /* ---------- TS 0x0F ---------- */
    {
      id: "tsm0f-modeling", code: "0x0F", title: "DATA MODELING",
      subtitle: "immutable update · intersection (A & B) · Partial<T> defaults",
      theory: J(
        "## Immutable update",
        "Copy and override with object spread — never mutate the caller's object.",
        "~~~ts",
        "const updated = { ...item, name: 'new' };",
        "~~~",
        "## Intersection types",
        "Merging two objects yields **A & B** — a value with the members of both.",
        "## Partial<T>",
        "`Partial<T>` makes every field optional — perfect for an 'overrides' object layered over full defaults.",
        "~~~ts",
        "function withDefaults<T>(over: Partial<T>, base: T): T {",
        "  return { ...base, ...over } as T;",
        "}",
        "~~~",
        "> INTEL — Later spreads win: `{ ...base, ...over }` lets `over` override `base`."
      ),
      exercises: [
        {
          id: "ts-rename", title: "IMMUTABLE RENAME", kind: "function", difficulty: 2, xp: 200,
          brief: "Change one field, copy the rest, touch nothing.",
          prompt: J(
            "Define **rename<T extends { name: string }>(item: T, name: string): T** returning a **new** object",
            "with `name` replaced and every other field preserved. Don't mutate `item`.",
            "~~~ts",
            "rename({ name: 'a', id: 1 }, 'b')  // { name: 'b', id: 1 }",
            "~~~"
          ),
          starter: J("function rename<T extends { name: string }>(item: T, name: string): T {", "  // TODO: copy item, override name", "  return item;", "}"),
          solution: J("function rename<T extends { name: string }>(item: T, name: string): T {", "  return { ...item, name } as T;", "}"),
          tests: [
            { name: "overrides name, keeps rest", code: "assertEqual(rename({ name: 'a', id: 1 }, 'b'), { name: 'b', id: 1 });" },
            { name: "does not mutate input", code: J("var orig = { name: 'a', id: 1 };", "rename(orig, 'b');", "assertEqual(orig, { name: 'a', id: 1 });") },
          ],
          hint: "return { ...item, name } as T;",
          lore: "New identity, same ghost.",
        },
        {
          id: "ts-merge", title: "MERGE SHELLS", kind: "function", difficulty: 3, xp: 230,
          brief: "Combine two shapes into their intersection.",
          prompt: J(
            "Define **merge<A, B>(a: A, b: B): A & B** returning an object with the fields of both (b wins on",
            "conflicts).",
            "~~~ts",
            "merge({ x: 1 }, { y: 2 })  // { x: 1, y: 2 }",
            "~~~"
          ),
          starter: J("function merge<A, B>(a: A, b: B): A & B {", "  // TODO: combine a and b", "  return a as A & B;", "}"),
          solution: J("function merge<A, B>(a: A, b: B): A & B {", "  return { ...a, ...b } as A & B;", "}"),
          tests: [
            { name: "combines fields", code: "assertEqual(merge({ x: 1 }, { y: 2 }), { x: 1, y: 2 });" },
            { name: "b overrides a", code: "assertEqual(merge({ hp: 100, mp: 10 }, { mp: 99 }), { hp: 100, mp: 99 });" },
          ],
          hint: "return { ...a, ...b } as A & B;",
          lore: "Two cybershells, one body.",
        },
        {
          id: "ts-withdefaults", title: "CONFIG DEFAULTS", kind: "function", difficulty: 3, xp: 240,
          brief: "Layer overrides over a full default config.",
          prompt: J(
            "Define **withDefaults<T>(over: Partial<T>, base: T): T** returning `base` with any fields from `over`",
            "applied on top.",
            "~~~ts",
            "withDefaults({ timeout: 5 }, { timeout: 30, retries: 3 })  // { timeout: 5, retries: 3 }",
            "~~~"
          ),
          starter: J("function withDefaults<T>(over: Partial<T>, base: T): T {", "  // TODO: base, then overrides on top", "  return base;", "}"),
          solution: J("function withDefaults<T>(over: Partial<T>, base: T): T {", "  return { ...base, ...over } as T;", "}"),
          tests: [
            { name: "override wins", code: "assertEqual(withDefaults({ timeout: 5 }, { timeout: 30, retries: 3 }), { timeout: 5, retries: 3 });" },
            { name: "empty override -> base", code: "assertEqual(withDefaults({}, { a: 1, b: 2 }), { a: 1, b: 2 });" },
          ],
          hint: "return { ...base, ...over } as T;",
          lore: "House rules over factory settings.",
        },
      ],
    },

    /* ---------- TS 0x10 ---------- */
    {
      id: "tsm10-algos", code: "0x10", title: "ALGORITHMS",
      subtitle: "binary search · is-sorted · generic chunk",
      theory: J(
        "## Binary search",
        "Halve a **sorted** array each step: compare the middle, then go left or right. ~20 steps for a million items.",
        "## Chunking",
        "Slice an array into fixed-size groups by stepping the index by `size` and `slice(i, i + size)`.",
        "> INTEL — A generic `<T>` chunker keeps the element type all the way through to `T[][]`."
      ),
      exercises: [
        {
          id: "ts-binsearch", title: "BINARY SWEEP", kind: "function", difficulty: 3, xp: 230,
          brief: "Find the index in log time.",
          prompt: J(
            "Define **binarySearch(sorted: number[], target: number): number** returning the index of `target`, or",
            "**-1** if absent.",
            "~~~ts",
            "binarySearch([1, 3, 5, 7, 9], 7)  // 3",
            "~~~"
          ),
          starter: J("function binarySearch(sorted: number[], target: number): number {", "  // TODO: lo/hi window", "  return 0;", "}"),
          solution: J(
            "function binarySearch(sorted: number[], target: number): number {",
            "  let lo = 0, hi = sorted.length - 1;",
            "  while (lo <= hi) {",
            "    const mid = (lo + hi) >> 1;",
            "    if (sorted[mid] === target) return mid;",
            "    if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;",
            "  }",
            "  return -1;",
            "}"
          ),
          tests: [
            { name: "finds existing", code: "assert(binarySearch([1,3,5,7,9], 7) === 3 && binarySearch([1,3,5,7,9], 1) === 0 && binarySearch([1,3,5,7,9], 9) === 4);" },
            { name: "missing -> -1", code: "assert(binarySearch([1,3,5], 2) === -1 && binarySearch([], 5) === -1);" },
          ],
          hint: "Loop while lo <= hi; mid = (lo+hi)>>1; move lo or hi past mid.",
          lore: "Halve the haystack until the needle remains.",
        },
        {
          id: "ts-issorted", title: "ORDER CHECK", kind: "function", difficulty: 1, xp: 150,
          brief: "Confirm the sequence is clean.",
          prompt: J("Define **isSorted(xs: number[]): boolean** — `true` if non-decreasing. Empty/single -> true.", "~~~ts", "isSorted([1, 2, 2, 3])  // true", "~~~"),
          starter: J("function isSorted(xs: number[]): boolean {", "  // TODO", "  return false;", "}"),
          solution: J("function isSorted(xs: number[]): boolean {", "  for (let i = 1; i < xs.length; i++) { if (xs[i] < xs[i - 1]) return false; }", "  return true;", "}"),
          tests: [
            { name: "sorted", code: "assert(isSorted([1, 2, 2, 3]) === true && isSorted([]) === true && isSorted([5]) === true);" },
            { name: "unsorted", code: "assert(isSorted([3, 1]) === false && isSorted([1, 2, 1]) === false);" },
          ],
          hint: "Return false the moment xs[i] < xs[i-1].",
          lore: "Clean sequence, or corrupted stream.",
        },
        {
          id: "ts-chunk", title: "PACKET SPLIT", kind: "function", difficulty: 3, xp: 230,
          brief: "Break the stream into fixed frames.",
          prompt: J(
            "Define a generic **chunk<T>(xs: T[], size: number): T[][]** splitting `xs` into groups of `size` (the",
            "last group may be shorter).",
            "~~~ts",
            "chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]",
            "~~~"
          ),
          starter: J("function chunk<T>(xs: T[], size: number): T[][] {", "  // TODO: step by size, slice each window", "  return [];", "}"),
          solution: J(
            "function chunk<T>(xs: T[], size: number): T[][] {",
            "  const out: T[][] = [];",
            "  for (let i = 0; i < xs.length; i += size) { out.push(xs.slice(i, i + size)); }",
            "  return out;",
            "}"
          ),
          tests: [
            { name: "splits evenly + remainder", code: "assertEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);" },
            { name: "size 1", code: "assertEqual(chunk([1, 2, 3], 1), [[1], [2], [3]]);" },
            { name: "empty -> empty", code: "assertEqual(chunk([], 3), []);" },
          ],
          hint: "for (let i = 0; i < xs.length; i += size) out.push(xs.slice(i, i + size));",
          lore: "Frame the stream, packet by packet.",
        },
      ],
    }

  );
})();
