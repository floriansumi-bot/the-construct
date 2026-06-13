/* ============================================================
   curriculum-ts-pack-4.js — TYPESCRIPT expansion pack 4.
   Appends 2 sectors (0x0A..0x0B) to the 'typescript' track:
     0x0A TYPED TRANSFORMS    — filter/map/reduce with generic callbacks
     0x0B NULL SAFETY         — optional fields, ?., ??, undefined handling
   Starters compile under tsc but fail. Verified by _verify/verify-ts.js.
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;

  t.modules.push(

    /* ---------- TS 0x0A ---------- */
    {
      id: "tsm0a-transforms", code: "0x0A", title: "TYPED TRANSFORMS",
      subtitle: "filter · generic reduce · predicate counting",
      theory: J(
        "## Transforms keep their types",
        "**WHAT** — `filter`, `map`, and `reduce` reshape an array without throwing the type away. Feed them a",
        "`number[]` and you still get typed numbers back. **WHY** — the compiler keeps watching every element, so a",
        "typo in the callback is caught before the code ever runs.",
        "## Generic callbacks with `<T>`",
        "**WHAT** — a `<T>` on the function lets one transform work over any element type, not just numbers. **WHY** —",
        "write the fold once, reuse it on users, packets, prices — whatever `T` turns out to be at the call site.",
        "~~~ts",
        "function sumBy<T>(xs: T[], f: (x: T) => number): number {",
        "  return xs.reduce((acc, x) => acc + f(x), 0);  // acc starts at 0",
        "}",
        "~~~",
        "> WARNING — `reduce` needs the **right seed**. The second argument (`0` above) sets both the start value AND",
        "the type of `acc`. Forget it and `acc` becomes the first element, which breaks an empty array and can mistype",
        "the result. Always pass a seed that matches your return type.",
        "## Predicates",
        "**WHAT** — a **predicate** is just a function `(x: T) => boolean` that answers yes/no for one element. **WHY**",
        "— hand it to `filter` to keep the matches, or `.filter(pred).length` to count how many passed the gate.",
        "~~~ts",
        "const longs = words.filter((w) => w.length >= 4);  // keeps the matches",
        "const howMany = words.filter((w) => w.length >= 4).length;  // counts them",
        "~~~",
        "> INTEL — `reduce((acc, x) => ..., start)` is the universal fold: sum, max, build an object, anything. `filter`",
        "and `map` are just the two folds you reach for most."
      ),
      exercises: [
        {
          id: "ts-evens", title: "EVEN PACKETS", kind: "function", difficulty: 1, xp: 150,
          brief: "Keep only the even-numbered frames.",
          prompt: J(
            "Define **evens(xs: number[]): number[]** returning only the even numbers, order preserved.",
            "~~~ts",
            "evens([1, 2, 3, 4])  // [2, 4]",
            "~~~"
          ),
          starter: J("function evens(xs: number[]): number[] {", "  // TODO: filter the evens", "  return [];", "}"),
          solution: J("function evens(xs: number[]): number[] {", "  return xs.filter(function (n) { return n % 2 === 0; });", "}"),
          tests: [
            { name: "keeps evens", code: "assertEqual(evens([1, 2, 3, 4]), [2, 4]);" },
            { name: "all odd -> empty", code: "assertEqual(evens([1, 3, 5]), []);" },
            { name: "zero is even", code: "assertEqual(evens([0, -2, -3]), [0, -2]);" },
          ],
          hint: "xs.filter((n) => n % 2 === 0)",
          lore: "Only the even frames carry the payload.",
        },
        {
          id: "ts-sumby", title: "FOLD BY FIELD", kind: "function", difficulty: 3, xp: 220,
          brief: "Sum a computed value over any records.",
          prompt: J(
            "Define a generic **sumBy<T>(xs: T[], f: (x: T) => number): number** summing `f(x)` over every element.",
            "~~~ts",
            "sumBy([{ n: 1 }, { n: 2 }], (x) => x.n)  // 3",
            "~~~"
          ),
          starter: J("function sumBy<T>(xs: T[], f: (x: T) => number): number {", "  // TODO: reduce f(x)", "  return -1;", "}"),
          solution: J(
            "function sumBy<T>(xs: T[], f: (x: T) => number): number {",
            "  return xs.reduce(function (acc, x) { return acc + f(x); }, 0);",
            "}"
          ),
          tests: [
            { name: "sums a field", code: "assertEqual(sumBy([{ n: 1 }, { n: 2 }, { n: 3 }], function (x) { return x.n; }), 6);" },
            { name: "sums prices", code: "assertEqual(sumBy([{ price: 10 }, { price: 5 }], function (x) { return x.price; }), 15);" },
            { name: "empty -> 0", code: "assertEqual(sumBy([], function (x) { return 1; }), 0);" },
          ],
          hint: "xs.reduce((acc, x) => acc + f(x), 0)",
          lore: "Fold the manifest into a single number.",
        },
        {
          id: "ts-countwhere", title: "PREDICATE TALLY", kind: "function", difficulty: 2, xp: 190,
          brief: "Count how many pass the filter.",
          prompt: J(
            "Define a generic **countWhere<T>(xs: T[], pred: (x: T) => boolean): number** returning how many",
            "elements satisfy `pred`.",
            "~~~ts",
            "countWhere([1, 2, 3, 4], (x) => x % 2 === 0)  // 2",
            "~~~"
          ),
          starter: J("function countWhere<T>(xs: T[], pred: (x: T) => boolean): number {", "  // TODO: count matches", "  return -1;", "}"),
          solution: J(
            "function countWhere<T>(xs: T[], pred: (x: T) => boolean): number {",
            "  return xs.filter(pred).length;",
            "}"
          ),
          tests: [
            { name: "counts evens", code: "assertEqual(countWhere([1, 2, 3, 4], function (x) { return x % 2 === 0; }), 2);" },
            { name: "counts long words", code: "assertEqual(countWhere(['hi', 'wired', 'lain'], function (s) { return s.length >= 4; }), 2);" },
            { name: "none -> 0", code: "assertEqual(countWhere([1, 3], function (x) { return x > 100; }), 0);" },
          ],
          hint: "xs.filter(pred).length",
          lore: "How many cleared the gate?",
        },
      ],
    },

    /* ---------- TS 0x0B ---------- */
    {
      id: "tsm0b-nullsafe", code: "0x0B", title: "NULL SAFETY",
      subtitle: "optional fields · ?. · ?? · keeping falsy values",
      theory: J(
        "## Optional fields",
        "**WHAT** — a `?` after a field name marks it optional: the value might be **undefined**. **WHY** — real data",
        "is full of holes (a user with no address yet), and the type tells the truth instead of pretending the field",
        "is always there.",
        "~~~ts",
        "interface User { name?: string }  // name may be undefined",
        "~~~",
        "> WARNING — once a field is `?`, the compiler refuses to let you use it blindly. You must handle the missing",
        "case first — that is the whole point.",
        "## Optional chaining `?.`",
        "**WHAT** — `a?.b` reads `b` only if `a` exists; if `a` is `null`/`undefined` the whole expression",
        "short-circuits to `undefined` instead of crashing. **WHY** — it lets you reach into a maybe-missing nested",
        "object on one line, no manual `if` ladder.",
        "~~~ts",
        "user.address?.city  // undefined if address is missing — no crash",
        "~~~",
        "> WARNING — `?.` stops at the FIRST missing link and yields `undefined`. So `a?.b.c` still crashes if `b` is",
        "missing — put a `?.` on every hop that could be absent: `a?.b?.c`.",
        "## Nullish coalescing `??`",
        "**WHAT** — `x ?? fallback` returns `x` unless `x` is `null`/`undefined`, in which case it returns `fallback`.",
        "**WHY** — it supplies a default ONLY for truly-missing values, leaving real data alone.",
        "~~~ts",
        "user.name ?? 'ANON';              // default only when name is missing",
        "user.address?.city ?? 'UNKNOWN';  // chain + default, the classic combo",
        "~~~",
        "## The falsy trap — the big one",
        "**WHAT** — the old `x || fallback` triggers on EVERY falsy value, so it wrongly throws away a valid `0` or",
        "`''`. **WHY** `??` exists — it fires only on `null`/`undefined`, so legitimate zero and empty-string survive.",
        "~~~ts",
        "0 || 5    // 5  — WRONG, the real 0 was discarded",
        "0 ?? 5    // 0  — correct, 0 is a real value and is kept",
        "'' ?? 'x' // ''  — empty string kept too",
        "~~~",
        "> WARNING — this is the single most common bug here: reaching for `||` when `0` or `''` are valid. Use `??`",
        "(or an explicit `=== undefined` test) whenever zero/empty must be kept.",
        "> INTEL — `??` cares only about null/undefined; `||` triggers on every falsy value. Choose deliberately."
      ),
      exercises: [
        {
          id: "ts-firstname", title: "ANON FALLBACK", kind: "function", difficulty: 2, xp: 170,
          brief: "Name the user, or call them ANON.",
          prompt: J(
            "Define **firstName(user: { name?: string }): string** returning the name, or `'ANON'` when it's missing.",
            "~~~ts",
            "firstName({ name: 'Rei' })  // 'Rei'",
            "firstName({})               // 'ANON'",
            "~~~"
          ),
          starter: J("function firstName(user: { name?: string }): string {", "  // TODO: fall back to 'ANON'", "  return '';", "}"),
          solution: J("function firstName(user: { name?: string }): string {", "  return user.name ?? 'ANON';", "}"),
          tests: [
            { name: "uses the name", code: "assertEqual(firstName({ name: 'Rei' }), 'Rei');" },
            { name: "missing -> ANON", code: "assertEqual(firstName({}), 'ANON');" },
          ],
          hint: "return user.name ?? 'ANON';",
          lore: "Everyone gets a handle, even the nameless.",
        },
        {
          id: "ts-cityof", title: "DEEP READ", kind: "function", difficulty: 3, xp: 220,
          brief: "Reach into a maybe-missing nested field.",
          prompt: J(
            "Define **cityOf(u: { address?: { city?: string } }): string** returning the city, or `'UNKNOWN'` if",
            "either the address or the city is missing. Use optional chaining.",
            "~~~ts",
            "cityOf({ address: { city: 'Neo Kyoto' } })  // 'Neo Kyoto'",
            "cityOf({})                                  // 'UNKNOWN'",
            "~~~"
          ),
          starter: J("function cityOf(u: { address?: { city?: string } }): string {", "  // TODO: u.address?.city ?? 'UNKNOWN'", "  return '';", "}"),
          solution: J("function cityOf(u: { address?: { city?: string } }): string {", "  return u.address?.city ?? 'UNKNOWN';", "}"),
          tests: [
            { name: "reads nested city", code: "assertEqual(cityOf({ address: { city: 'Neo Kyoto' } }), 'Neo Kyoto');" },
            { name: "missing address", code: "assertEqual(cityOf({}), 'UNKNOWN');" },
            { name: "address without city", code: "assertEqual(cityOf({ address: {} }), 'UNKNOWN');" },
          ],
          hint: "return u.address?.city ?? 'UNKNOWN';",
          lore: "Probe the nested record without tripping the alarm.",
        },
        {
          id: "ts-orelse", title: "KEEP THE ZERO", kind: "function", difficulty: 2, xp: 200,
          brief: "Default only when truly absent.",
          prompt: J(
            "Define a generic **orElse<T>(value: T | undefined, fallback: T): T** returning `value` unless it is",
            "`undefined` — in which case return `fallback`. Crucially, a value of **0** or **''** must be kept.",
            "~~~ts",
            "orElse(0, 5)          // 0  (kept!)",
            "orElse(undefined, 5)  // 5",
            "~~~"
          ),
          starter: J("function orElse<T>(value: T | undefined, fallback: T): T {", "  // TODO: only undefined triggers the fallback", "  return fallback;", "}"),
          solution: J("function orElse<T>(value: T | undefined, fallback: T): T {", "  return value === undefined ? fallback : value;", "}"),
          tests: [
            { name: "keeps a real value", code: "assertEqual(orElse('x', 'y'), 'x');" },
            { name: "keeps zero and empty", code: "assert(orElse(0, 5) === 0 && orElse('', 'z') === '', 'falsy-but-present values survive');" },
            { name: "undefined -> fallback", code: "assertEqual(orElse(undefined, 5), 5);" },
          ],
          hint: "return value === undefined ? fallback : value;  // not ||, which would eat 0 and ''",
          lore: "Zero is data, not absence. Respect it.",
        },
      ],
    }

  );
})();
