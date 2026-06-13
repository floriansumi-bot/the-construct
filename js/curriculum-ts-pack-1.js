/* ============================================================
   curriculum-ts-pack-1.js — TYPESCRIPT expansion pack 1.
   Appends 2 sectors (0x04..0x05) to the 'typescript' track:
     0x04 ENUMS & CONSTANTS    — numeric & string enums, named sets
     0x05 UNIONS & NARROWING   — union types, typeof guards, discriminated unions
   Starters must COMPILE under tsc (return a correctly-typed wrong value)
   yet FAIL the tests. Verified by _verify/verify-ts.js.
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;

  t.modules.push(

    /* ---------- TS 0x04 ---------- */
    {
      id: "tsm04-enums", code: "0x04", title: "ENUMS & CONSTANTS",
      subtitle: "numeric enums · string enums · named sets of values",
      theory: J(
        "## Enums name a fixed set",
        "**WHAT** — an `enum` bolts human-readable names onto a closed set of related constants. **WHY** — `Day.Sat` tells the next runner exactly what you mean, while a raw `5` is a magic number nobody can decode at 3am.",
        "By default a numeric enum auto-numbers from `0`, climbing by one for each member.",
        "~~~ts",
        "enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }  // Mon = 0 ... Sun = 6",
        "Day.Sat;   // 5",
        "~~~",
        "> WARNING — those names are just labels for **numbers** at runtime. `Day.Sat` literally *is* `5` once compiled, so passing the bare `5` works too. Don't expect the string `'Sat'` to come back.",
        "## Custom values",
        "**WHAT** — you can hand-pick the numbers, or switch to a **string enum** where each member carries its own readable string. **WHY** — string enums survive logging and network payloads as meaningful text instead of mystery digits.",
        "~~~ts",
        "enum Level { Guest = 1, Operator = 2, Root = 3 }  // numeric -> 1, 2, 3",
        "enum Signal { Red = 'STOP', Green = 'GO', Yellow = 'SLOW' }  // string -> 'STOP' ...",
        "Level.Root;     // 3",
        "Signal.Green;   // 'GO'",
        "~~~",
        "## Compare, don't compute",
        "**WHAT** — read an enum value by comparing it with `===`. **WHY** — enums are a guarded set, not free-floating math; treat them as fixed flags, not numbers to add up.",
        "~~~ts",
        "if (level === Level.Root) { /* full access */ }",
        "~~~",
        "> WARNING — common rookie slip: doing arithmetic like `Level.Guest + 1` produces a plain `number`, and assigning that back to the enum type gets rejected by the compiler. Compare, switch, or look up — don't compute.",
        "> INTEL — `Day.Sat` reads better than the magic number `5`, and the compiler guards the set so a typo can't sneak in an invalid member."
      ),
      exercises: [
        {
          id: "ts-isweekend", title: "WEEKEND LOCKOUT", kind: "function", difficulty: 1, xp: 150,
          brief: "Flag the off-shift days.",
          prompt: J(
            "Given **enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }**, define **isWeekend(d: Day): boolean** —",
            "`true` for Sat or Sun.",
            "~~~ts",
            "isWeekend(Day.Sat)  // true",
            "isWeekend(Day.Mon)  // false",
            "~~~"
          ),
          starter: J(
            "enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }",
            "function isWeekend(d: Day): boolean {",
            "  // TODO: true for Sat or Sun",
            "  return false;",
            "}"
          ),
          solution: J(
            "enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }",
            "function isWeekend(d: Day): boolean {",
            "  return d === Day.Sat || d === Day.Sun;",
            "}"
          ),
          tests: [
            { name: "weekend is true", code: "assert(isWeekend(5) === true && isWeekend(6) === true, 'Sat=5, Sun=6');" },
            { name: "weekday is false", code: "assert(isWeekend(0) === false && isWeekend(4) === false, 'Mon..Fri are false');" },
          ],
          hint: "return d === Day.Sat || d === Day.Sun;",
          lore: "No netrunning on the off-shift. Officially.",
        },
        {
          id: "ts-canroot", title: "ROOT GATE", kind: "function", difficulty: 1, xp: 150,
          brief: "Only the highest tier passes.",
          prompt: J(
            "Given **enum Level { Guest = 1, Operator = 2, Root = 3 }**, define **canRoot(l: Level): boolean**",
            "returning `true` only for `Root`.",
            "~~~ts",
            "canRoot(Level.Root)   // true",
            "canRoot(Level.Guest)  // false",
            "~~~"
          ),
          starter: J(
            "enum Level { Guest = 1, Operator = 2, Root = 3 }",
            "function canRoot(l: Level): boolean {",
            "  // TODO",
            "  return false;",
            "}"
          ),
          solution: J(
            "enum Level { Guest = 1, Operator = 2, Root = 3 }",
            "function canRoot(l: Level): boolean {",
            "  return l === Level.Root;",
            "}"
          ),
          tests: [
            { name: "root passes", code: "assertEqual(canRoot(3), true);" },
            { name: "lower tiers fail", code: "assert(canRoot(1) === false && canRoot(2) === false);" },
          ],
          hint: "return l === Level.Root;  // Root === 3",
          lore: "Access is earned, one tier at a time.",
        },
        {
          id: "ts-signal", title: "TRAFFIC PROTOCOL", kind: "function", difficulty: 2, xp: 170,
          brief: "Decode the string-enum signal.",
          prompt: J(
            "Given **enum Signal { Red = 'STOP', Green = 'GO', Yellow = 'SLOW' }**, define **isGo(s: Signal):",
            "boolean** returning `true` only for `Green`.",
            "~~~ts",
            "isGo(Signal.Green)  // true",
            "~~~"
          ),
          starter: J(
            "enum Signal { Red = 'STOP', Green = 'GO', Yellow = 'SLOW' }",
            "function isGo(s: Signal): boolean {",
            "  // TODO",
            "  return false;",
            "}"
          ),
          solution: J(
            "enum Signal { Red = 'STOP', Green = 'GO', Yellow = 'SLOW' }",
            "function isGo(s: Signal): boolean {",
            "  return s === Signal.Green;",
            "}"
          ),
          tests: [
            { name: "green means go", code: "assertEqual(isGo('GO'), true);" },
            { name: "others stop", code: "assert(isGo('STOP') === false && isGo('SLOW') === false);" },
          ],
          hint: "return s === Signal.Green;  // 'GO'",
          lore: "Green. Punch it.",
        },
      ],
    },

    /* ---------- TS 0x05 ---------- */
    {
      id: "tsm05-unions", code: "0x05", title: "UNIONS & NARROWING",
      subtitle: "T | U · typeof guards · discriminated unions",
      theory: J(
        "## A value of several types",
        "**WHAT** — a **union** like `string | number` declares a value that could be *either* type. **WHY** — real data is messy; one slot might carry text on one run and a count on the next, and a union lets the compiler track both possibilities.",
        "The catch: the compiler only lets you touch behaviour that's safe for **every** member until you prove which one you actually hold.",
        "~~~ts",
        "let id: string | number = '7F-3A';",
        "id = 42;  // also legal",
        "~~~",
        "## typeof narrowing",
        "**WHAT** — **narrowing** means proving, with a runtime check, which branch of the union you're on. `typeof` is the classic guard. **WHY** — inside an `if (typeof x === 'string')` block the compiler trusts you and treats `x` as a pure `string`, unlocking string methods.",
        "~~~ts",
        "function describe(x: string | number): string {",
        "  if (typeof x === 'string') return 'text:' + x.toUpperCase();",
        "  return 'num:' + x.toFixed(0);  // here x is a number",
        "}",
        "~~~",
        "> WARNING — top beginner trap: calling `x.toUpperCase()` *before* narrowing. On the raw union the compiler refuses, because that method doesn't exist on `number`. Always narrow first, then reach for member-specific behaviour.",
        "## Shared members need no narrowing",
        "**WHAT** — if a property exists on *all* members of the union, you can use it straight away. **WHY** — both `string` and `T[]` carry `.length`, so the compiler already knows it's safe — no guard required.",
        "~~~ts",
        "function size(v: string | number[]): number { return v.length; }",
        "~~~",
        "## Discriminated unions",
        "**WHAT** — give each object shape a shared literal **tag** (often called `kind`), then branch on that tag. **WHY** — checking the tag narrows the *whole* object for you, so the matching fields become available with zero casting.",
        "~~~ts",
        "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };",
        "function area(sh: Shape): number {",
        "  if (sh.kind === 'circle') return 3.14 * sh.r * sh.r;  // sh.r is in scope",
        "  return sh.s * sh.s;                                   // here sh.s is in scope",
        "}",
        "~~~",
        "> WARNING — reaching for `sh.r` without first checking `sh.kind` fails: a `square` has no `r`. The tag check is what makes the field appear.",
        "> INTEL — the `kind` tag is the key that unlocks the right fields. Check it first, every time."
      ),
      exercises: [
        {
          id: "ts-describe", title: "TYPE SNIFFER", kind: "function", difficulty: 2, xp: 180,
          brief: "Report what kind of signal arrived.",
          prompt: J(
            "Define **describe(x: string | number): string** returning `'text:' + x` for a string and `'num:' + x`",
            "for a number. Narrow with `typeof`.",
            "~~~ts",
            "describe('hi')  // 'text:hi'",
            "describe(42)    // 'num:42'",
            "~~~"
          ),
          starter: J(
            "function describe(x: string | number): string {",
            "  // TODO: narrow with typeof",
            "  return '';",
            "}"
          ),
          solution: J(
            "function describe(x: string | number): string {",
            "  if (typeof x === 'string') return 'text:' + x;",
            "  return 'num:' + x;",
            "}"
          ),
          tests: [
            { name: "string branch", code: "assertEqual(describe('hi'), 'text:hi');" },
            { name: "number branch", code: "assert(describe(42) === 'num:42' && describe(0) === 'num:0');" },
          ],
          hint: "if (typeof x === 'string') return 'text:' + x; else return 'num:' + x;",
          lore: "Identify the packet before you trust it.",
        },
        {
          id: "ts-measure", title: "LENGTH PROBE", kind: "function", difficulty: 2, xp: 170,
          brief: "One probe, two shapes of input.",
          prompt: J(
            "Define **measure(x: string | number[]): number** returning the length — `.length` works for both a",
            "string and an array, so no narrowing is needed.",
            "~~~ts",
            "measure('wired')    // 5",
            "measure([1, 2, 3])  // 3",
            "~~~"
          ),
          starter: J(
            "function measure(x: string | number[]): number {",
            "  // TODO: both strings and arrays have .length",
            "  return -1;",
            "}"
          ),
          solution: J(
            "function measure(x: string | number[]): number {",
            "  return x.length;",
            "}"
          ),
          tests: [
            { name: "string length", code: "assert(measure('wired') === 5 && measure('') === 0);" },
            { name: "array length", code: "assert(measure([1, 2, 3]) === 3 && measure([]) === 0);" },
          ],
          hint: "return x.length;",
          lore: "Same ruler, different signal.",
        },
        {
          id: "ts-area", title: "SHAPE DISPATCH", kind: "function", difficulty: 3, xp: 230,
          brief: "Compute area off a tagged union.",
          prompt: J(
            "With **type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }**, define",
            "**area(sh: Shape): number** — circle = π·r², square = s². Switch on `sh.kind`.",
            "~~~ts",
            "area({ kind: 'square', s: 3 })  // 9",
            "~~~"
          ),
          starter: J(
            "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };",
            "function area(sh: Shape): number {",
            "  // TODO: narrow on sh.kind",
            "  return 0;",
            "}"
          ),
          solution: J(
            "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };",
            "function area(sh: Shape): number {",
            "  if (sh.kind === 'circle') return Math.PI * sh.r * sh.r;",
            "  return sh.s * sh.s;",
            "}"
          ),
          tests: [
            { name: "square area", code: "assert(area({ kind: 'square', s: 3 }) === 9 && area({ kind: 'square', s: 5 }) === 25);" },
            { name: "circle area", code: "assert(Math.abs(area({ kind: 'circle', r: 2 }) - Math.PI * 4) < 1e-9);" },
          ],
          hint: "if (sh.kind === 'circle') return Math.PI * sh.r * sh.r; else return sh.s * sh.s;",
          lore: "Read the tag, dispatch the math.",
        },
      ],
    }

  );
})();
