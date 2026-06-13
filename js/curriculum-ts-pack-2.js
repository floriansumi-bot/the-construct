/* ============================================================
   curriculum-ts-pack-2.js — TYPESCRIPT expansion pack 2.
   Appends 2 sectors (0x06..0x07) to the 'typescript' track:
     0x06 RECORDS & MAPS          — Record<K,V>, index lookups, summing values
     0x07 CLASSES & ACCESS        — typed fields, private, ctor shorthand, generic class
   Starters compile under tsc but fail. Verified by _verify/verify-ts.js.
   (Avoids lib-dependent APIs like Object.values / ?? so it compiles on a
    minimal tsc lib — plain for..in and 'in' checks instead.)
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;

  t.modules.push(

    /* ---------- TS 0x06 ---------- */
    {
      id: "tsm06-records", code: "0x06", title: "RECORDS & MAPS",
      subtitle: "Record<K, V> · index lookups · aggregating values",
      theory: J(
        "## Record<K, V> — the typed dictionary",
        "**WHAT.** A `Record<K, V>` is an object used as a lookup table: every key has type `K`, every value has type `V`. `Record<string, number>` means *string keys mapped to number values* — a name-to-number ledger.",
        "**WHY.** A plain `{}` lets you write anything anywhere. Declaring the `Record` shape up front lets the compiler catch a wrong-typed value or a misspelled access before the runtime ever sees it.",
        "~~~ts",
        "const freq: Record<string, number> = {};",
        "freq['a'] = (freq['a'] || 0) + 1;  // first hit: undefined || 0 -> 0, then +1",
        "~~~",
        "> WARNING — A missing key reads back as `undefined`, not a clean `0`. Always supply a fallback (`freq[k] || 0`) before doing math, or you'll be adding to `undefined` and minting `NaN`.",
        "## Safe lookups — does the key exist?",
        "**WHAT.** `key in obj` asks one honest question: *is this key present?* It answers `true` even when the stored value is falsy — `0`, `''`, or `false`.",
        "**WHY.** Truthiness checks lie about real data. `if (menu[item])` skips an item priced at `0`, treating a free drink as if it weren't on the menu at all. `in` checks presence, not value.",
        "~~~ts",
        "const price = item in menu ? menu[item] : 0;  // a 0 price survives",
        "~~~",
        "> WARNING — `if (obj[key])` is a presence check in disguise that drops every legitimately falsy value. Reach for `key in obj` when zero or empty are valid data.",
        "## Walking the values — aggregating",
        "**WHAT.** `for (const k in rec)` loops over the keys; inside, `rec[k]` is already typed as the value type `V`, so you can sum, max, or fold it directly.",
        "**WHY.** Aggregating (totalling a ledger, finding a peak) means visiting every entry once. The `for...in` loop hands you each key, and the typed value lets the math stay type-checked.",
        "~~~ts",
        "let sum = 0;",
        "for (const k in rec) { sum += rec[k]; }  // rec[k] is a number here",
        "~~~",
        "> INTEL — Type the empty object up front (`const out: Record<string, number> = {}`) so the compiler tracks every write and every read from the very first line."
      ),
      exercises: [
        {
          id: "ts-tally", title: "FREQUENCY RECORD", kind: "function", difficulty: 2, xp: 180,
          brief: "Count the chatter into a typed map.",
          prompt: J(
            "Define **tally(items: string[]): Record<string, number>** mapping each item to its count.",
            "~~~ts",
            "tally(['a', 'a', 'b'])  // { a: 2, b: 1 }",
            "~~~"
          ),
          starter: J(
            "function tally(items: string[]): Record<string, number> {",
            "  const out: Record<string, number> = {};",
            "  // TODO: count each item",
            "  return out;",
            "}"
          ),
          solution: J(
            "function tally(items: string[]): Record<string, number> {",
            "  const out: Record<string, number> = {};",
            "  for (const x of items) { out[x] = (out[x] || 0) + 1; }",
            "  return out;",
            "}"
          ),
          tests: [
            { name: "counts occurrences", code: "assertEqual(tally(['a', 'a', 'b']), { a: 2, b: 1 });" },
            { name: "empty -> empty", code: "assertEqual(tally([]), {});" },
          ],
          hint: "for (const x of items) out[x] = (out[x] || 0) + 1;",
          lore: "Who's transmitting, and how often.",
        },
        {
          id: "ts-priceof", title: "MENU LOOKUP", kind: "function", difficulty: 1, xp: 150,
          brief: "Price a target, default to zero.",
          prompt: J(
            "Define **priceOf(menu: Record<string, number>, item: string): number** returning the item's price,",
            "or **0** if it isn't on the menu.",
            "~~~ts",
            "priceOf({ coffee: 3 }, 'coffee')  // 3",
            "priceOf({ coffee: 3 }, 'water')   // 0",
            "~~~"
          ),
          starter: J(
            "function priceOf(menu: Record<string, number>, item: string): number {",
            "  // TODO: return the price or 0",
            "  return -1;",
            "}"
          ),
          solution: J(
            "function priceOf(menu: Record<string, number>, item: string): number {",
            "  return item in menu ? menu[item] : 0;",
            "}"
          ),
          tests: [
            { name: "known item", code: "assert(priceOf({ coffee: 3, tea: 2 }, 'coffee') === 3 && priceOf({ coffee: 3, tea: 2 }, 'tea') === 2);" },
            { name: "unknown -> 0", code: "assertEqual(priceOf({ coffee: 3 }, 'water'), 0);" },
            { name: "keeps a zero price", code: "assertEqual(priceOf({ free: 0 }, 'free'), 0);" },
          ],
          hint: "return item in menu ? menu[item] : 0;",
          lore: "Everything has a price on the menu — or it's not served.",
        },
        {
          id: "ts-totalvalues", title: "LEDGER SUM", kind: "function", difficulty: 2, xp: 170,
          brief: "Sum every value in the record.",
          prompt: J(
            "Define **totalValues(rec: Record<string, number>): number** returning the sum of all values.",
            "~~~ts",
            "totalValues({ a: 1, b: 2, c: 3 })  // 6",
            "~~~"
          ),
          starter: J(
            "function totalValues(rec: Record<string, number>): number {",
            "  // TODO: add up every value",
            "  return -1;",
            "}"
          ),
          solution: J(
            "function totalValues(rec: Record<string, number>): number {",
            "  let sum = 0;",
            "  for (const k in rec) { sum += rec[k]; }",
            "  return sum;",
            "}"
          ),
          tests: [
            { name: "sums values", code: "assertEqual(totalValues({ a: 1, b: 2, c: 3 }), 6);" },
            { name: "empty -> 0", code: "assertEqual(totalValues({}), 0);" },
          ],
          hint: "let sum = 0; for (const k in rec) sum += rec[k]; return sum;",
          lore: "Total the ledger before the auditors arrive.",
        },
      ],
    },

    /* ---------- TS 0x07 ---------- */
    {
      id: "tsm07-classes", code: "0x07", title: "CLASSES & ACCESS",
      subtitle: "typed fields · private · constructor shorthand · generic class",
      theory: J(
        "## Typed class — fields with a contract",
        "**WHAT.** A class bundles data (fields) with the methods that act on it. In TS each field carries a type, methods declare their parameter and return types, and `private` marks a field as off-limits to the outside world.",
        "**WHY.** Typed fields stop you from stuffing a string where a number belongs. `private` hides internal state so callers can only touch it through methods you control — the balance can't be rewritten from outside, only adjusted by the rules you wrote.",
        "~~~ts",
        "class Vault {",
        "  private balance: number;",
        "  constructor(start: number) { this.balance = start; }",
        "  get(): number { return this.balance; }",
        "}",
        "~~~",
        "> WARNING — `private` is enforced by the **compiler only**, not at runtime. Compiled JS keeps it as an ordinary property, so a test (or any JS) can still reach it — and that's exactly why we verify a vault through its public methods, not by peeking at the field.",
        "## Constructor shorthand — declare and assign in one move",
        "**WHAT.** Prefix a constructor parameter with `public`, `private`, or `readonly` and TS does two jobs at once: it **declares** the field on the class **and assigns** the incoming argument to it. No separate field line, no `this.x = x`.",
        "**WHY.** Most constructors are pure boilerplate — copy each argument onto a matching field. The shorthand collapses that ceremony into the parameter list, so `Vec2` below really does end up with public `x` and `y` fields set from the arguments.",
        "~~~ts",
        "class Vec2 {",
        "  constructor(public x: number, public y: number) {}  // declares + assigns x and y",
        "}",
        "~~~",
        "> WARNING — Drop the access keyword and the magic stops: `constructor(x: number)` is a plain parameter that vanishes when the constructor returns — no field is created. The `public`/`private`/`readonly` prefix is what does both jobs.",
        "## Generic class — one shape, any type",
        "**WHAT.** A class can take a type parameter `<T>`, a placeholder filled in when you create an instance. `Box<T>` stores a `T` and hands back a `T`, so `new Box(7)` is a `Box<number>` and `new Box('x')` is a `Box<string>`.",
        "**WHY.** Without generics you'd write one box for numbers, another for strings, or fall back to `any` and lose all safety. `<T>` lets one definition serve every element type while the compiler still tracks exactly what's inside.",
        "~~~ts",
        "class Box<T> { constructor(private value: T) {} get(): T { return this.value; } }",
        "~~~",
        "> INTEL — Combine the tricks freely: `constructor(private value: T)` uses the shorthand to declare a private generic field, so `get()` returns the same `T` you put in — fully typed end to end."
      ),
      exercises: [
        {
          id: "ts-account", title: "THE VAULT", kind: "function", difficulty: 3, xp: 220,
          brief: "A balance nobody can corrupt directly.",
          prompt: J(
            "Define a class **Account** with a **private** balance (constructor takes a starting amount, default 0),",
            "**deposit(n)**, **withdraw(n)** (returns `false` and changes nothing if `n` exceeds the balance, else",
            "subtracts and returns `true`), and **getBalance()**.",
            "~~~ts",
            "const a = new Account(100);",
            "a.deposit(50);     // balance 150",
            "a.withdraw(200);   // false (insufficient)",
            "~~~"
          ),
          starter: J(
            "class Account {",
            "  constructor(start: number = 0) {}",
            "  deposit(n: number): void {}",
            "  withdraw(n: number): boolean { return false; }",
            "  getBalance(): number { return 0; }",
            "}"
          ),
          solution: J(
            "class Account {",
            "  private balance: number;",
            "  constructor(start: number = 0) { this.balance = start; }",
            "  deposit(n: number): void { this.balance += n; }",
            "  withdraw(n: number): boolean {",
            "    if (n > this.balance) return false;",
            "    this.balance -= n;",
            "    return true;",
            "  }",
            "  getBalance(): number { return this.balance; }",
            "}"
          ),
          tests: [
            { name: "deposit raises balance", code: J("var a = new Account(100);", "a.deposit(50);", "assertEqual(a.getBalance(), 150);") },
            { name: "overdraft refused", code: J("var a = new Account(100);", "assert(a.withdraw(200) === false && a.getBalance() === 100, 'no overdraft');") },
            { name: "valid withdrawal", code: J("var a = new Account(100);", "assert(a.withdraw(60) === true && a.getBalance() === 40);") },
          ],
          hint: "Store this.balance; withdraw returns false when n > this.balance before changing anything.",
          lore: "The vault opens only for the cleared.",
        },
        {
          id: "ts-vec2", title: "VECTOR ADD", kind: "function", difficulty: 2, xp: 190,
          brief: "Constructor shorthand, immutable add.",
          prompt: J(
            "Define a class **Vec2** using constructor shorthand `(public x: number, public y: number)`, with",
            "**add(o: Vec2): Vec2** returning a **new** Vec2 of the component sums.",
            "~~~ts",
            "new Vec2(1, 2).add(new Vec2(3, 4))  // Vec2(4, 6)",
            "~~~"
          ),
          starter: J(
            "class Vec2 {",
            "  constructor(public x: number, public y: number) {}",
            "  add(o: Vec2): Vec2 { return this; }",
            "}"
          ),
          solution: J(
            "class Vec2 {",
            "  constructor(public x: number, public y: number) {}",
            "  add(o: Vec2): Vec2 { return new Vec2(this.x + o.x, this.y + o.y); }",
            "}"
          ),
          tests: [
            { name: "adds components", code: J("var v = new Vec2(1, 2).add(new Vec2(3, 4));", "assert(v.x === 4 && v.y === 6);") },
            { name: "returns a new vector", code: J("var a = new Vec2(1, 1);", "a.add(new Vec2(5, 5));", "assert(a.x === 1 && a.y === 1, 'add must not mutate the original');") },
          ],
          hint: "return new Vec2(this.x + o.x, this.y + o.y);",
          lore: "Plot the jump vector. Don't overwrite the origin.",
        },
        {
          id: "ts-genstack", title: "TYPED STACK", kind: "function", difficulty: 3, xp: 230,
          brief: "A generic LIFO that keeps its element type.",
          prompt: J(
            "Define a generic class **Stack<T>** with **push(x: T): void**, **pop(): T | undefined**, and",
            "**size(): number**.",
            "~~~ts",
            "const s = new Stack<number>();",
            "s.push(1); s.push(2);",
            "s.pop();   // 2",
            "~~~"
          ),
          starter: J(
            "class Stack<T> {",
            "  push(x: T): void {}",
            "  pop(): T | undefined { return undefined; }",
            "  size(): number { return 0; }",
            "}"
          ),
          solution: J(
            "class Stack<T> {",
            "  private items: T[] = [];",
            "  push(x: T): void { this.items.push(x); }",
            "  pop(): T | undefined { return this.items.pop(); }",
            "  size(): number { return this.items.length; }",
            "}"
          ),
          tests: [
            { name: "push grows size", code: J("var s = new Stack();", "s.push(1); s.push(2);", "assertEqual(s.size(), 2);") },
            { name: "LIFO pop", code: J("var s = new Stack();", "s.push('a'); s.push('b');", "assert(s.pop() === 'b' && s.pop() === 'a' && s.size() === 0);") },
            { name: "pop empty -> undefined", code: "assertEqual(new Stack().pop(), undefined);" },
          ],
          hint: "Back it with a private T[]; push/pop/size delegate to the array.",
          lore: "Type-safe to the last byte.",
        },
      ],
    }

  );
})();
