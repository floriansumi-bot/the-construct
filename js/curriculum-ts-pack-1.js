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
        "An **enum** gives names to a closed set of related constants — clearer than loose numbers or strings.",
        "~~~ts",
        "enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }  // Mon = 0 ... Sun = 6",
        "Day.Sat;   // 5",
        "~~~",
        "## Custom values",
        "Assign your own numbers, or use **string enums** for self-describing values.",
        "~~~ts",
        "enum Level { Guest = 1, Operator = 2, Root = 3 }",
        "enum Signal { Red = 'STOP', Green = 'GO', Yellow = 'SLOW' }",
        "~~~",
        "## Compare, don't compute",
        "Compare a value to enum members with `===`. (Avoid arithmetic that produces a plain `number` and assigns it back to the enum type — the compiler rejects that.)",
        "> INTEL — `Day.Sat` reads better than the magic number `5`, and the compiler guards the set."
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
        "A **union** `string | number` holds either. Before using type-specific behaviour you must **narrow** to one branch.",
        "## typeof narrowing",
        "Inside an `if (typeof x === 'string')` block, the compiler knows `x` is a string there.",
        "~~~ts",
        "function describe(x: string | number): string {",
        "  if (typeof x === 'string') return 'text:' + x;",
        "  return 'num:' + x;",
        "}",
        "~~~",
        "## Shared members need no narrowing",
        "Both `string` and `T[]` have `.length`, so a union of them can use it directly.",
        "## Discriminated unions",
        "Give each shape a common literal **tag**, then switch on it — the compiler narrows the rest of the fields for you.",
        "~~~ts",
        "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };",
        "if (sh.kind === 'circle') { /* sh.r is available here */ }",
        "~~~",
        "> INTEL — The `kind` tag is the key that unlocks the right fields. Check it first."
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
