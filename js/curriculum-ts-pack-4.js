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
        "`filter`, `map`, and `reduce` all stay type-safe. A generic callback lets you fold any element type.",
        "~~~ts",
        "function sumBy<T>(xs: T[], f: (x: T) => number): number {",
        "  return xs.reduce((acc, x) => acc + f(x), 0);",
        "}",
        "~~~",
        "## Predicates",
        "A **predicate** is `(x: T) => boolean` — feed it to `filter`, or count how many pass.",
        "> INTEL — `reduce((acc, x) => ..., start)` is the universal fold: sum, max, build an object, anything."
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
        "A `?` on a field means it might be **undefined** — the compiler forces you to handle that.",
        "~~~ts",
        "interface User { name?: string }",
        "~~~",
        "## ?? and ?.",
        "**??** supplies a fallback only when the left side is `null`/`undefined` (NOT for 0 or '').",
        "**?.** reads through a maybe-missing object without crashing.",
        "~~~ts",
        "user.name ?? 'ANON';",
        "user.address?.city ?? 'UNKNOWN';",
        "~~~",
        "## The falsy trap",
        "`x || fallback` wrongly replaces `0` and `''`. Use `x ?? fallback` (or an explicit `=== undefined` test)",
        "when zero/empty are valid values.",
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
