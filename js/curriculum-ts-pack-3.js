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
        "A function type is written `(arg: A) => R`. Use it to type a **callback** parameter.",
        "~~~ts",
        "function twice(f: (n: number) => number, x: number): number {",
        "  return f(f(x));",
        "}",
        "~~~",
        "## Passing functions",
        "The callback must match the signature — the compiler checks arguments and return type at the call site.",
        "## Rest parameters",
        "`...args: number[]` collects any number of trailing arguments into a typed array.",
        "~~~ts",
        "function sum(...nums: number[]): number {",
        "  return nums.reduce((a, b) => a + b, 0);",
        "}",
        "~~~",
        "> INTEL — A function type alias keeps signatures readable: `type NumFn = (n: number) => number;`"
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
        "`<T extends Shape>` promises `T` has at least `Shape`'s members — so you can use them safely.",
        "~~~ts",
        "function longer<T extends { length: number }>(a: T, b: T): T {",
        "  return a.length >= b.length ? a : b;",
        "}",
        "~~~",
        "## keyof & indexed access",
        "`keyof T` is the union of `T`'s keys; `T[K]` is the type of the value at key `K`. Together they type a",
        "perfectly safe property getter.",
        "~~~ts",
        "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {",
        "  return obj[key];",
        "}",
        "~~~",
        "> INTEL — `K extends keyof T` makes the compiler reject any key that isn't actually on the object."
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
