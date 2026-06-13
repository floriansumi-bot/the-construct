/* ============================================================
   curriculum-ts-pack-3.js — TYPESCRIPT expansion pack 3.
   Appends 2 sectors (0x08..0x09) to the 'typescript' track:
     0x08 FUNCTION TYPES        — callback signatures, rest params, higher-order
     0x09 CONSTRAINTS & KEYOF   — T extends, keyof T, indexed access T[K]
   Starters compile under tsc but fail. Verified by _verify/verify-ts.js.
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;

  t.modules.push(

    /* ---------- TS 0x08 ---------- */
    {
      id: "tsm08-fntypes", code: "0x08", title: "FUNCTION TYPES",
      subtitle: "callback signatures · higher-order · rest params",
      theory: J(
        "## Typing a function value",
        "In TypeScript, **functions are values** — you can pass one into another function, just like a number or a string. To do that safely you need to describe its *shape*: what arguments it takes and what it returns. That shape is a **function type**, written `(arg: A) => R` — read it as 'takes an `A`, returns an `R`'.",
        "Why bother? Because the compiler can then guarantee that whatever function you hand over actually fits. No surprises at runtime.",
        "~~~ts",
        "function twice(f: (n: number) => number, x: number): number {",
        "  return f(f(x));",
        "}",
        "~~~",
        "Here `f` is typed as `(n: number) => number`: a function eating one number and spitting out one number. `twice` is a **higher-order function** — a function that takes another function as input (or returns one).",
        "## Passing functions",
        "When you call `twice`, the function you pass **must match the declared signature** exactly. The compiler checks both the parameter types and the return type at the call site — pass `(s: string) => string` where a `(n: number) => number` is expected and it refuses to compile.",
        "> WARNING — A callback's parameter and return types must line up with the signature it's plugged into. A common slip: returning the wrong type (e.g. a `string` from a function declared `=> number`). The function body has to honour the contract, not just the arguments.",
        "## Rest parameters",
        "Sometimes you don't know *how many* arguments will arrive. A **rest parameter** `...args: number[]` scoops up every remaining argument into a single typed array — so the caller can pass zero, one, or fifty values and inside the function it's just one tidy `number[]`.",
        "~~~ts",
        "function sum(...nums: number[]): number {",
        "  return nums.reduce((a, b) => a + b, 0);",
        "}",
        "~~~",
        "Inside `sum`, `nums` really is a `number[]` — array methods like `reduce`, `map`, and `filter` all work on it.",
        "> INTEL — A function **type alias** keeps signatures short and readable when you reuse them: `type NumFn = (n: number) => number;` Now you can write `f: NumFn` instead of repeating the whole arrow each time."
      ),
      exercises: [
        {
          id: "ts-applytwice", title: "DOUBLE TAP", kind: "function", difficulty: 2, xp: 180,
          brief: "Run a transform through itself.",
          prompt: J(
            "Define **applyTwice(f: (n: number) => number, x: number): number** returning `f(f(x))`.",
            "~~~ts",
            "applyTwice((n) => n + 1, 5)  // 7",
            "~~~"
          ),
          starter: J(
            "function applyTwice(f: (n: number) => number, x: number): number {",
            "  // TODO: apply f to x, then to the result",
            "  return x;",
            "}"
          ),
          solution: J(
            "function applyTwice(f: (n: number) => number, x: number): number {",
            "  return f(f(x));",
            "}"
          ),
          tests: [
            { name: "increment twice", code: "assertEqual(applyTwice(function (n) { return n + 1; }, 5), 7);" },
            { name: "double twice", code: "assertEqual(applyTwice(function (n) { return n * 2; }, 3), 12);" },
          ],
          hint: "return f(f(x));",
          lore: "Two taps to confirm the kill.",
        },
        {
          id: "ts-mapnums", title: "TYPED MAP", kind: "function", difficulty: 2, xp: 180,
          brief: "Transform a number array with a callback.",
          prompt: J(
            "Define **mapNums(xs: number[], f: (n: number) => number): number[]** applying `f` to each element.",
            "~~~ts",
            "mapNums([1, 2, 3], (x) => x * x)  // [1, 4, 9]",
            "~~~"
          ),
          starter: J(
            "function mapNums(xs: number[], f: (n: number) => number): number[] {",
            "  // TODO: apply f to each",
            "  return [];",
            "}"
          ),
          solution: J(
            "function mapNums(xs: number[], f: (n: number) => number): number[] {",
            "  return xs.map(f);",
            "}"
          ),
          tests: [
            { name: "squares", code: "assertEqual(mapNums([1, 2, 3], function (x) { return x * x; }), [1, 4, 9]);" },
            { name: "negate", code: "assertEqual(mapNums([1, -2, 3], function (x) { return -x; }), [-1, 2, -3]);" },
            { name: "empty -> empty", code: "assertEqual(mapNums([], function (x) { return x; }), []);" },
          ],
          hint: "return xs.map(f);",
          lore: "Run every packet through the same filter.",
        },
        {
          id: "ts-sumall", title: "VARIADIC SUM", kind: "function", difficulty: 2, xp: 170,
          brief: "Add however many signals arrive.",
          prompt: J(
            "Define **sumAll(...nums: number[]): number** returning the sum of all arguments (0 for none).",
            "~~~ts",
            "sumAll(1, 2, 3)  // 6",
            "sumAll()         // 0",
            "~~~"
          ),
          starter: J(
            "function sumAll(...nums: number[]): number {",
            "  // TODO: reduce the rest array",
            "  return -1;",
            "}"
          ),
          solution: J(
            "function sumAll(...nums: number[]): number {",
            "  return nums.reduce(function (a, b) { return a + b; }, 0);",
            "}"
          ),
          tests: [
            { name: "sums args", code: "assert(sumAll(1, 2, 3) === 6 && sumAll(5) === 5);" },
            { name: "none -> 0", code: "assertEqual(sumAll(), 0);" },
          ],
          hint: "nums.reduce((a, b) => a + b, 0)",
          lore: "However many transmitters, one total.",
        },
      ],
    },

    /* ---------- TS 0x09 ---------- */
    {
      id: "tsm09-keyof", code: "0x09", title: "CONSTRAINTS & KEYOF",
      subtitle: "T extends · keyof T · indexed access T[K]",
      theory: J(
        "## Constraining a type parameter",
        "A plain generic `<T>` accepts *literally anything*, which means inside the function you can't assume `T` has any particular feature. A **constraint** narrows that down: `<T extends Shape>` is a promise that `T` has *at least* everything in `Shape`. In exchange, the compiler lets you safely touch those members.",
        "Think of `extends` here as 'must be assignable to' — not inheritance, but a minimum requirement the caller has to meet.",
        "~~~ts",
        "function longer<T extends { length: number }>(a: T, b: T): T {",
        "  return a.length >= b.length ? a : b;",
        "}",
        "~~~",
        "Because of `extends { length: number }`, reading `a.length` is allowed — yet `T` stays flexible, so this works for strings, arrays, or any object that has a `length`.",
        "## keyof & indexed access",
        "Two operators unlock type-safe property work. `keyof T` is the **union of `T`'s property names** as a type — for `{ name: string; age: number }` it's `'name' | 'age'`. And `T[K]` is **indexed access**: the type of the value stored at key `K` — `T['age']` is `number`.",
        "Combine them and you get a getter that can't be fooled: the key must really exist, and the return type tracks whichever field you asked for.",
        "~~~ts",
        "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {",
        "  return obj[key];",
        "}",
        "~~~",
        "Calling `getProp(person, 'name')` returns a `string`; `getProp(person, 'age')` returns a `number` — the type follows the key automatically, no casting needed.",
        "> WARNING — `keyof T` is the **union of property NAMES**, not the values. And `T[K]` is the **type AT** that key, not the key itself. Mixing these up is the classic beginner trap — `keyof` gives you `'name' | 'age'`, while `T['name']` gives you the value type `string`.",
        "> INTEL — The constraint `K extends keyof T` is what keeps the key honest: it forces `K` to be one of `T`'s real keys, so the compiler rejects any name that isn't actually on the object — caught at compile time, never at runtime."
      ),
      exercises: [
        {
          id: "ts-getprop", title: "SAFE GETTER", kind: "function", difficulty: 3, xp: 230,
          brief: "Read any field, keep its type.",
          prompt: J(
            "Define **getProp<T, K extends keyof T>(obj: T, key: K): T[K]** returning `obj[key]`.",
            "~~~ts",
            "getProp({ name: 'Rei', age: 14 }, 'name')  // 'Rei'",
            "~~~"
          ),
          starter: J(
            "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {",
            "  // TODO: return obj[key]",
            "  return (undefined as unknown) as T[K];",
            "}"
          ),
          solution: J(
            "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {",
            "  return obj[key];",
            "}"
          ),
          tests: [
            { name: "reads a string field", code: "assertEqual(getProp({ name: 'Rei', age: 14 }, 'name'), 'Rei');" },
            { name: "reads a number field", code: "assertEqual(getProp({ name: 'Rei', age: 14 }, 'age'), 14);" },
          ],
          hint: "return obj[key];",
          lore: "Pull any field; the type comes with it.",
        },
        {
          id: "ts-longest", title: "LONGEST WINS", kind: "function", difficulty: 2, xp: 200,
          brief: "Pick the longer of two — strings or arrays.",
          prompt: J(
            "Define **longest<T extends { length: number }>(a: T, b: T): T** returning whichever has the greater",
            "`length` (ties -> `a`).",
            "~~~ts",
            "longest('hi', 'hello')     // 'hello'",
            "longest([1, 2], [1, 2, 3]) // [1, 2, 3]",
            "~~~"
          ),
          starter: J(
            "function longest<T extends { length: number }>(a: T, b: T): T {",
            "  // TODO: compare .length",
            "  return a;",
            "}"
          ),
          solution: J(
            "function longest<T extends { length: number }>(a: T, b: T): T {",
            "  return a.length >= b.length ? a : b;",
            "}"
          ),
          tests: [
            { name: "longer string", code: "assertEqual(longest('hi', 'hello'), 'hello');" },
            { name: "longer array", code: "assertEqual(longest([1, 2], [1, 2, 3]), [1, 2, 3]);" },
            { name: "tie -> first", code: "assertEqual(longest('ab', 'cd'), 'ab');" },
          ],
          hint: "return a.length >= b.length ? a : b;",
          lore: "Reach wins the duel.",
        },
        {
          id: "ts-pluckgen", title: "GENERIC PLUCK", kind: "function", difficulty: 3, xp: 240,
          brief: "Extract one typed field from every record.",
          prompt: J(
            "Define **pluck<T, K extends keyof T>(xs: T[], key: K): T[K][]** returning that field from each element.",
            "~~~ts",
            "pluck([{ id: 1 }, { id: 2 }], 'id')  // [1, 2]",
            "~~~"
          ),
          starter: J(
            "function pluck<T, K extends keyof T>(xs: T[], key: K): T[K][] {",
            "  // TODO: map each element to element[key]",
            "  return [];",
            "}"
          ),
          solution: J(
            "function pluck<T, K extends keyof T>(xs: T[], key: K): T[K][] {",
            "  return xs.map(function (x) { return x[key]; });",
            "}"
          ),
          tests: [
            { name: "plucks ids", code: "assertEqual(pluck([{ id: 1 }, { id: 2 }], 'id'), [1, 2]);" },
            { name: "plucks names", code: "assertEqual(pluck([{ name: 'a' }, { name: 'b' }], 'name'), ['a', 'b']);" },
            { name: "empty -> empty", code: "assertEqual(pluck([], 'id'), []);" },
          ],
          hint: "return xs.map((x) => x[key]);",
          lore: "Siphon one column, type intact.",
        },
      ],
    }

  );
})();
