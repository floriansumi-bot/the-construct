/* ============================================================
   curriculum-js-pack-4.js — JAVASCRIPT expansion pack 4.
   Appends 2 sectors (0x0B..0x0C) to the 'javascript' track:
     0x0B PATTERNS & REGEX   — match / test / replace with regular expressions
     0x0C JSON & DATA SHAPING — parse, reshape, pick fields
   Verified by _verify/verify-js.js (solutions pass, starters fail).
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;

  t.modules.push(

    /* ---------- JS 0x0B ---------- */
    {
      id: "jsm0b-regex", code: "0x0B", title: "PATTERNS & REGEX",
      subtitle: "test · match · replace · character classes",
      theory: J(
        "## Regular expressions",
        "A **regex** is a pattern for text. Write it between slashes; flags follow (`g` global, `i` case-insensitive).",
        "~~~js",
        "/cat/i.test('Cataphract');   // true",
        "~~~",
        "## Character classes",
        "- `\\\\d` a digit, `\\\\D` a non-digit",
        "- `\\\\w` a word char, `\\\\s` whitespace",
        "- `[a-z]` a range, `+` one-or-more, `*` zero-or-more, `{6}` exactly six",
        "- `^` start, `$` end",
        "## The three workhorses",
        "~~~js",
        "'a1b2'.replace(/\\\\d/g, '#');   // 'a#b#'   (replace all digits)",
        "'x42y7'.match(/\\\\d+/g);        // ['42', '7']   (all number runs)",
        "/^#[0-9a-f]{6}$/i.test('#FF8800');  // true",
        "~~~",
        "> INTEL — `str.match(/.../g)` returns an array of hits, or **null** if none. `(... || [])` makes it safe."
      ),
      exercises: [
        {
          id: "js-digitsonly", title: "STRIP TO DIGITS", kind: "function", difficulty: 1, xp: 150,
          brief: "Keep only the numeric signal.",
          prompt: J(
            "Define **digitsOnly(s)** returning `s` with every non-digit removed.",
            "~~~js",
            "digitsOnly('a1b2c3')  // '123'",
            "~~~"
          ),
          starter: J("function digitsOnly(s) {", "  // TODO: replace non-digits with ''", "}"),
          solution: J("function digitsOnly(s) {", "  return s.replace(/\\D/g, '');", "}"),
          tests: [
            { name: "keeps digits", code: "assertEqual(digitsOnly('a1b2c3'), '123');" },
            { name: "phone-ish", code: "assertEqual(digitsOnly('+41 (79) 555-0042'), '4179555004' + '2');" },
            { name: "no digits -> empty", code: "assertEqual(digitsOnly('wired'), '');" },
          ],
          hint: "return s.replace(/\\D/g, '');  // \\D is 'not a digit'",
          lore: "Filter the noise; keep the numbers.",
        },
        {
          id: "js-hexcolor", title: "HEX VALIDATOR", kind: "function", difficulty: 2, xp: 180,
          brief: "Accept only true color codes.",
          prompt: J(
            "Define **isHexColor(s)** returning `true` only when `s` is a `#` followed by **exactly 6** hex digits",
            "(0-9, a-f, A-F).",
            "~~~js",
            "isHexColor('#ff8800')  // true",
            "isHexColor('#FFF')     // false (only 3)",
            "isHexColor('ff8800')   // false (no #)",
            "~~~"
          ),
          starter: J("function isHexColor(s) {", "  // TODO: anchor a regex ^#......$ of hex digits", "}"),
          solution: J("function isHexColor(s) {", "  return /^#[0-9a-fA-F]{6}$/.test(s);", "}"),
          tests: [
            { name: "valid colors", code: "assert(isHexColor('#ff8800') === true && isHexColor('#000000') === true && isHexColor('#A1B2C3') === true);" },
            { name: "wrong length / no hash", code: "assert(isHexColor('#FFF') === false && isHexColor('ff8800') === false && isHexColor('#1234567') === false);" },
            { name: "non-hex chars", code: "assert(isHexColor('#zzzzzz') === false);" },
          ],
          hint: "/^#[0-9a-fA-F]{6}$/.test(s) — ^ and $ anchor the whole string.",
          lore: "Only valid colors render in the grid.",
        },
        {
          id: "js-tokens", title: "TOKENIZER", kind: "function", difficulty: 2, xp: 180,
          brief: "Split a transmission into words.",
          prompt: J(
            "Define **tokens(s)** returning an array of the alphanumeric 'words' in `s` (runs of letters/digits),",
            "ignoring punctuation and spaces. No matches -> `[]`.",
            "~~~js",
            "tokens('hi, world! 42')  // ['hi', 'world', '42']",
            "~~~"
          ),
          starter: J("function tokens(s) {", "  // TODO: match runs of [a-z0-9] (case-insensitive); guard null", "}"),
          solution: J("function tokens(s) {", "  return s.match(/[a-z0-9]+/gi) || [];", "}"),
          tests: [
            { name: "splits on punctuation", code: "assertEqual(tokens('hi, world! 42'), ['hi', 'world', '42']);" },
            { name: "collapses spaces", code: "assertEqual(tokens('  ghost   in the   shell '), ['ghost', 'in', 'the', 'shell']);" },
            { name: "no words -> []", code: "assertEqual(tokens('!!! ...'), []);" },
          ],
          hint: "return s.match(/[a-z0-9]+/gi) || [];",
          lore: "Parse the chatter into clean tokens.",
        },
      ],
    },

    /* ---------- JS 0x0C ---------- */
    {
      id: "jsm0c-json", code: "0x0C", title: "JSON & DATA SHAPING",
      subtitle: "JSON.parse · reduce over records · pick fields",
      theory: J(
        "## JSON",
        "JSON is text that looks like JS objects/arrays. **JSON.parse** turns text into data; **JSON.stringify** turns data into text.",
        "~~~js",
        "const data = JSON.parse('[{\"price\": 10}, {\"price\": 5}]');",
        "data[0].price;   // 10",
        "~~~",
        "## Shaping records",
        "Once parsed, it's just arrays of objects — reduce/map/filter as usual.",
        "~~~js",
        "data.reduce((sum, r) => sum + r.price, 0);   // 15",
        "~~~",
        "## Picking fields",
        "Copy a subset of keys into a new object:",
        "~~~js",
        "const out = {};",
        "for (const k of ['a', 'c']) if (k in obj) out[k] = obj[k];",
        "~~~",
        "> INTEL — `k in obj` is true even when the value is 0 or '' — safer than `if (obj[k])`."
      ),
      exercises: [
        {
          id: "js-pricetotal", title: "INVOICE SUM", kind: "function", difficulty: 2, xp: 170,
          brief: "Total the ledger from raw JSON.",
          prompt: J(
            "`json` is a JSON string of an array of objects each with a numeric **price**. Define",
            "**totalPrice(json)** returning the sum of all prices.",
            "~~~js",
            "totalPrice('[{\"price\":10},{\"price\":5}]')  // 15",
            "~~~"
          ),
          starter: J("function totalPrice(json) {", "  // TODO: JSON.parse, then sum the .price fields", "}"),
          solution: J(
            "function totalPrice(json) {",
            "  const rows = JSON.parse(json);",
            "  return rows.reduce(function (sum, r) { return sum + r.price; }, 0);",
            "}"
          ),
          tests: [
            { name: "sums prices", code: "assertEqual(totalPrice('[{\"price\":10},{\"price\":5},{\"price\":2}]'), 17);" },
            { name: "empty -> 0", code: "assertEqual(totalPrice('[]'), 0);" },
          ],
          hint: "JSON.parse(json).reduce((sum, r) => sum + r.price, 0)",
          lore: "Three million woolongs, itemized.",
        },
        {
          id: "js-pluck", title: "FIELD EXTRACTOR", kind: "function", difficulty: 2, xp: 180,
          brief: "Yank one column out of the records.",
          prompt: J(
            "`json` is a JSON array of objects. Define **pluck(json, key)** returning an array of just that",
            "field's values, in order.",
            "~~~js",
            "pluck('[{\"name\":\"Spike\"},{\"name\":\"Jet\"}]', 'name')  // ['Spike', 'Jet']",
            "~~~"
          ),
          starter: J("function pluck(json, key) {", "  // TODO: parse, then map each record to record[key]", "}"),
          solution: J(
            "function pluck(json, key) {",
            "  return JSON.parse(json).map(function (r) { return r[key]; });",
            "}"
          ),
          tests: [
            { name: "extracts names", code: "assertEqual(pluck('[{\"name\":\"Spike\"},{\"name\":\"Jet\"}]', 'name'), ['Spike', 'Jet']);" },
            { name: "extracts numbers", code: "assertEqual(pluck('[{\"bpm\":90},{\"bpm\":140}]', 'bpm'), [90, 140]);" },
            { name: "empty -> []", code: "assertEqual(pluck('[]', 'name'), []);" },
          ],
          hint: "JSON.parse(json).map(r => r[key])",
          lore: "One column, cleanly siphoned.",
        },
        {
          id: "js-pick", title: "REDACTOR", kind: "function", difficulty: 2, xp: 190,
          brief: "Release only the cleared fields.",
          prompt: J(
            "Define **pick(obj, keys)** returning a **new** object containing only the listed keys that actually",
            "exist on `obj` (skip missing ones). Don't mutate `obj`.",
            "~~~js",
            "pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }",
            "~~~"
          ),
          starter: J("function pick(obj, keys) {", "  const out = {};", "  // TODO: copy each existing key", "  return out;", "}"),
          solution: J(
            "function pick(obj, keys) {",
            "  const out = {};",
            "  for (const k of keys) { if (k in obj) out[k] = obj[k]; }",
            "  return out;",
            "}"
          ),
          tests: [
            { name: "keeps listed keys", code: "assertEqual(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 });" },
            { name: "skips missing keys", code: "assertEqual(pick({ a: 1 }, ['a', 'x']), { a: 1 });" },
            { name: "keeps falsy values", code: "assertEqual(pick({ a: 0, b: '' }, ['a', 'b']), { a: 0, b: '' });" },
          ],
          hint: "for (const k of keys) if (k in obj) out[k] = obj[k];",
          lore: "Redact everything not on the clearance list.",
        },
      ],
    }

  );
})();
