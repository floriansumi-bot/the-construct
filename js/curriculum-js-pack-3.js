/* ============================================================
   curriculum-js-pack-3.js — JAVASCRIPT expansion pack 3.
   Appends 2 sectors (0x09..0x0A) to the 'javascript' track:
     0x09 SETS & MAPS   — unique values, frequency maps, intersections
     0x0A CLASSES & OOP — class, constructor, methods, state
   Verified by _verify/verify-js.js (solutions pass, starters fail).
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;

  t.modules.push(

    /* ---------- JS 0x09 ---------- */
    {
      id: "jsm09-sets", code: "0x09", title: "SETS & MAPS",
      subtitle: "Set · Map · unique · frequency · membership",
      theory: J(
        "## Set — a bag of unique values",
        "A **Set** holds each value at most once. Build one from an array to dedupe; spread it back to an array.",
        "~~~js",
        "const s = new Set([1, 1, 2, 3]);   // {1, 2, 3}",
        "s.has(2);                          // true",
        "[...new Set([1, 1, 2])];           // [1, 2]   (order preserved)",
        "~~~",
        "## Map — keyed by anything",
        "A **Map** is a key/value store like an object, but keys can be any type and it remembers insertion order.",
        "~~~js",
        "const m = new Map();",
        "m.set('a', (m.get('a') || 0) + 1);",
        "m.get('a');   // 1",
        "m.size;       // 1",
        "~~~",
        "> INTEL — `new Set(b).has(x)` is the fast membership test that powers intersections and 'is it in the list?'."
      ),
      exercises: [
        {
          id: "js-unique", title: "DEDUPE THE SIGNAL", kind: "function", difficulty: 1, xp: 140,
          brief: "Strip duplicate packets.",
          prompt: J(
            "Define **unique(arr)** returning a new array with duplicates removed, **order preserved**.",
            "~~~js",
            "unique([1, 1, 2, 3, 3])  // [1, 2, 3]",
            "~~~"
          ),
          starter: J("function unique(arr) {", "  // TODO: a Set dedupes; spread it back to an array", "}"),
          solution: J("function unique(arr) {", "  return [...new Set(arr)];", "}"),
          tests: [
            { name: "removes duplicates", code: "assertEqual(unique([1, 1, 2, 3, 3, 3]), [1, 2, 3]);" },
            { name: "preserves order", code: "assertEqual(unique(['c', 'a', 'c', 'b']), ['c', 'a', 'b']);" },
            { name: "empty -> empty", code: "assertEqual(unique([]), []);" },
          ],
          hint: "return [...new Set(arr)];",
          lore: "One signal, one ghost — no echoes.",
        },
        {
          id: "js-tally", title: "FREQUENCY MAP", kind: "function", difficulty: 2, xp: 170,
          brief: "Count the chatter on each channel.",
          prompt: J(
            "Define **tally(items)** returning a **Map** from each item to how many times it appears.",
            "~~~js",
            "const m = tally(['a', 'a', 'b']);",
            "m.get('a');  // 2",
            "m.size;      // 2",
            "~~~"
          ),
          starter: J("function tally(items) {", "  const m = new Map();", "  // TODO: count each item", "  return m;", "}"),
          solution: J(
            "function tally(items) {",
            "  const m = new Map();",
            "  for (const x of items) { m.set(x, (m.get(x) || 0) + 1); }",
            "  return m;",
            "}"
          ),
          tests: [
            { name: "returns a Map of counts", code: J(
              "var m = tally(['a', 'a', 'b']);",
              "assert(m instanceof Map, 'return a Map');",
              "assert(m.get('a') === 2 && m.get('b') === 1 && m.size === 2, 'counts: a=2, b=1');"
            ) },
            { name: "empty -> empty map", code: "assertEqual(tally([]).size, 0);" },
          ],
          hint: "for (const x of items) m.set(x, (m.get(x) || 0) + 1);",
          lore: "Who's talking, and how loud.",
        },
        {
          id: "js-intersect", title: "COMMON GROUND", kind: "function", difficulty: 2, xp: 180,
          brief: "Find the shared coordinates.",
          prompt: J(
            "Define **intersect(a, b)** returning the values present in **both** arrays — unique, in the order they",
            "appear in `a`.",
            "~~~js",
            "intersect([1, 2, 3], [2, 3, 4])  // [2, 3]",
            "~~~"
          ),
          starter: J("function intersect(a, b) {", "  // TODO: keep a's unique values that are also in b", "}"),
          solution: J(
            "function intersect(a, b) {",
            "  const sb = new Set(b);",
            "  return [...new Set(a)].filter(function (x) { return sb.has(x); });",
            "}"
          ),
          tests: [
            { name: "shared values", code: "assertEqual(intersect([1, 2, 3], [2, 3, 4]), [2, 3]);" },
            { name: "no overlap -> empty", code: "assertEqual(intersect([1, 2], [3, 4]), []);" },
            { name: "dedupes from a", code: "assertEqual(intersect([1, 1, 2], [1, 2]), [1, 2]);" },
          ],
          hint: "const sb = new Set(b); return [...new Set(a)].filter(x => sb.has(x));",
          lore: "Where two networks overlap, secrets leak.",
        },
      ],
    },

    /* ---------- JS 0x0A ---------- */
    {
      id: "jsm0a-classes", code: "0x0A", title: "CLASSES & OOP",
      subtitle: "class · constructor · methods · instance state",
      theory: J(
        "## A class is a blueprint",
        "**class** bundles state (in the **constructor**) with behaviour (methods). **new** stamps out an instance.",
        "~~~js",
        "class Drone {",
        "  constructor(name) { this.name = name; this.alt = 0; }",
        "  climb(n) { this.alt += n; }",
        "  status() { return `${this.name} @ ${this.alt}m`; }",
        "}",
        "const d = new Drone('Tachikoma');",
        "d.climb(50);",
        "d.status();   // 'Tachikoma @ 50m'",
        "~~~",
        "## this",
        "Inside a method, **this** is the instance. Each `new` object carries its own copy of the state.",
        "> INTEL — Default parameters work in constructors too: `constructor(start = 0) { this.n = start; }`."
      ),
      exercises: [
        {
          id: "js-stack-class", title: "THE STACK", kind: "function", difficulty: 2, xp: 190,
          brief: "Build a last-in, first-out buffer.",
          prompt: J(
            "Define a class **Stack** with: **push(x)**, **pop()** (returns & removes the top), **peek()** (top",
            "without removing), **size()**, and **isEmpty()**.",
            "~~~js",
            "const s = new Stack();",
            "s.push(1); s.push(2);",
            "s.pop();   // 2",
            "s.size();  // 1",
            "~~~"
          ),
          starter: J("class Stack {", "  // TODO: store items; implement push/pop/peek/size/isEmpty", "}"),
          solution: J(
            "class Stack {",
            "  constructor() { this.items = []; }",
            "  push(x) { this.items.push(x); }",
            "  pop() { return this.items.pop(); }",
            "  peek() { return this.items[this.items.length - 1]; }",
            "  size() { return this.items.length; }",
            "  isEmpty() { return this.items.length === 0; }",
            "}"
          ),
          tests: [
            { name: "starts empty", code: "assert(new Stack().isEmpty() === true, 'a new Stack is empty');" },
            { name: "push / peek / size", code: J(
              "var s = new Stack();",
              "s.push(1); s.push(2);",
              "assert(s.size() === 2 && s.peek() === 2, 'two items, top is 2');"
            ) },
            { name: "LIFO order", code: J(
              "var s = new Stack();",
              "s.push('a'); s.push('b');",
              "assert(s.pop() === 'b' && s.pop() === 'a' && s.isEmpty(), 'pops in reverse, then empty');"
            ) },
          ],
          hint: "Back it with an array: push -> arr.push, pop -> arr.pop, peek -> arr[arr.length-1].",
          lore: "Last in, first out — like memories under pressure.",
        },
        {
          id: "js-counter-class", title: "TICK COUNTER", kind: "function", difficulty: 1, xp: 150,
          brief: "An object that remembers its count.",
          prompt: J(
            "Define a class **Counter** with an optional starting value (default **0**), methods **inc()** and",
            "**dec()**, and **value()** returning the current count.",
            "~~~js",
            "const c = new Counter(10);",
            "c.inc(); c.inc(); c.dec();",
            "c.value();   // 11",
            "~~~"
          ),
          starter: J("class Counter {", "  // TODO: constructor(start = 0); inc(); dec(); value()", "}"),
          solution: J(
            "class Counter {",
            "  constructor(start = 0) { this.n = start; }",
            "  inc() { this.n++; }",
            "  dec() { this.n--; }",
            "  value() { return this.n; }",
            "}"
          ),
          tests: [
            { name: "default start 0", code: J("var c = new Counter();", "c.inc(); c.inc();", "assertEqual(c.value(), 2);") },
            { name: "custom start + dec", code: J("var c = new Counter(10);", "c.inc(); c.inc(); c.dec();", "assertEqual(c.value(), 11);") },
            { name: "instances are independent", code: J("var a = new Counter(); var b = new Counter();", "a.inc();", "assert(a.value() === 1 && b.value() === 0);") },
          ],
          hint: "constructor(start = 0) { this.n = start; } then inc/dec adjust this.n.",
          lore: "It counts so you don't have to.",
        },
        {
          id: "js-rect-class", title: "BOUNDING BOX", kind: "function", difficulty: 1, xp: 150,
          brief: "Geometry for the HUD.",
          prompt: J(
            "Define a class **Rectangle** taking width and height, with **area()** and **perimeter()**.",
            "~~~js",
            "const r = new Rectangle(3, 4);",
            "r.area();        // 12",
            "r.perimeter();   // 14",
            "~~~"
          ),
          starter: J("class Rectangle {", "  // TODO: constructor(w, h); area(); perimeter()", "}"),
          solution: J(
            "class Rectangle {",
            "  constructor(w, h) { this.w = w; this.h = h; }",
            "  area() { return this.w * this.h; }",
            "  perimeter() { return 2 * (this.w + this.h); }",
            "}"
          ),
          tests: [
            { name: "area", code: "assertEqual(new Rectangle(3, 4).area(), 12);" },
            { name: "perimeter", code: "assertEqual(new Rectangle(3, 4).perimeter(), 14);" },
            { name: "another box", code: "assert(new Rectangle(5, 5).area() === 25 && new Rectangle(5, 5).perimeter() === 20);" },
          ],
          hint: "area = w * h; perimeter = 2 * (w + h).",
          lore: "Draw the box around the target.",
        },
      ],
    }

  );
})();
