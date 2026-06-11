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
        "## Record<K, V>",
        "`Record<string, number>` types an object used as a map: string keys, number values.",
        "~~~ts",
        "const freq: Record<string, number> = {};",
        "freq['a'] = (freq['a'] || 0) + 1;",
        "~~~",
        "## Safe lookups",
        "`key in obj` tests for a key — true even when the value is 0 or '' (unlike `if (obj[key])`).",
        "~~~ts",
        "const price = item in menu ? menu[item] : 0;",
        "~~~",
        "## Walking the values",
        "`for (const k in rec)` iterates the keys; `rec[k]` is typed as the value type.",
        "> INTEL — Type the empty object up front (`const out: Record<string, number> = {}`) so the compiler tracks it."
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
        "## Typed class",
        "Fields get types; **private** hides them from the outside; methods declare parameter and return types.",
        "~~~ts",
        "class Vault {",
        "  private balance: number;",
        "  constructor(start: number) { this.balance = start; }",
        "  get(): number { return this.balance; }",
        "}",
        "~~~",
        "## Constructor shorthand",
        "Prefix a constructor parameter with `public`/`private`/`readonly` and TS declares **and** assigns the field for you.",
        "~~~ts",
        "class Vec2 {",
        "  constructor(public x: number, public y: number) {}",
        "}",
        "~~~",
        "## Generic class",
        "A class can carry a type parameter so it works for any element type while staying type-safe.",
        "~~~ts",
        "class Box<T> { constructor(private value: T) {} get(): T { return this.value; } }",
        "~~~",
        "> INTEL — `private` is compile-time only; at runtime it's a normal property, which is why tests can still observe behaviour through public methods."
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
