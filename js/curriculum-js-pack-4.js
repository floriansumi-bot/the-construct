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
        "A **regex** is a tiny search pattern for text — not a single word to find, but a *shape* to match: 'three digits',",
        "'a word ending in -ing', 'starts with #'. It looks cryptic at first, but it's just a handful of symbols. Once you",
        "know them, you can validate, search, and rewrite text in one line instead of a loop full of `if`s.",
        "Write the pattern between slashes; optional **flags** come after the closing slash (`g` = find all, not just the first; `i` = ignore case).",
        "~~~js",
        "/cat/i.test('Cataphract');   // true  — 'cat' appears, case ignored",
        "~~~",
        "> INTEL — `/cat/` is a regex *literal*, like `'cat'` is a string literal. No quotes around it.",
        "## Character classes — the building blocks",
        "A **character class** matches one character of a certain kind:",
        "- `\\\\d` any digit `0-9` &nbsp;·&nbsp; `\\\\D` any **non**-digit",
        "- `\\\\w` a word char (letter, digit, or `_`) &nbsp;·&nbsp; `\\\\s` any whitespace",
        "- `[a-z]` your own range — any one lowercase letter &nbsp;·&nbsp; `[aeiou]` any one vowel",
        "**Quantifiers** say *how many* of the thing before them: `+` one-or-more, `*` zero-or-more, `?` zero-or-one, `{6}` exactly six.",
        "So `\\\\d+` means 'one or more digits in a row'. **Anchors** pin the match: `^` to the start of the text, `$` to the end.",
        "## The three workhorses",
        "`.test` asks yes/no, `.match` pulls out the hits, `.replace` swaps them:",
        "~~~js",
        "/\\\\d/.test('a1b2');             // true   — is there a digit anywhere?",
        "'x42y7'.match(/\\\\d+/g);         // ['42', '7']   — every run of digits",
        "'a1b2'.replace(/\\\\d/g, '#');    // 'a#b#'   — every digit becomes #",
        "/^#[0-9a-f]{6}$/i.test('#FF8800');  // true — # then exactly 6 hex digits, nothing else",
        "~~~",
        "> WARNING — forget the `g` flag and `.replace` changes only the **first** match, while `.match` returns just one hit. Add `g` to mean 'all of them'.",
        "> INTEL — `str.match(/.../g)` returns an array of hits, or **null** when there are none — not `[]`. Writing `(str.match(re) || [])` keeps your code from crashing on no-match."
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
        "## JSON — data as text",
        "**JSON** (JavaScript Object Notation) is the universal format for sending data between programs: APIs reply in it,",
        "config files are written in it, save files store it. It's plain **text** that looks almost exactly like a JS object",
        "or array — so it travels over the network easily, but you can't use it directly until you turn it back into real data.",
        "Two built-in functions cross that bridge: **JSON.parse** turns a JSON string into live data; **JSON.stringify** turns data back into a string.",
        "~~~js",
        "const data = JSON.parse('[{\"price\": 10}, {\"price\": 5}]');",
        "data[0].price;                 // 10  — now it's a real array of objects",
        "JSON.stringify({ ok: true });  // '{\"ok\":true}'  — back to text",
        "~~~",
        "> WARNING — in JSON, **keys must be in double quotes** and you can't leave a trailing comma: `{name: 'Jet'}` and `{\"a\":1,}` are both invalid.",
        "> INTEL — `JSON.parse` **throws** if the text is malformed. Wrap risky input in `try { ... } catch (e) { ... }` so one bad string doesn't crash everything.",
        "## Shaping records",
        "Once parsed, it's just an array of plain objects — so `reduce`, `map`, and `filter` work exactly as always.",
        "`reduce` is perfect for collapsing many records into one value, like a running total:",
        "~~~js",
        "data.reduce((sum, r) => sum + r.price, 0);   // 15  — sum every record's price",
        "~~~",
        "## Picking fields",
        "Often you only want a few keys out of a big record. Copy the ones you want into a fresh object — leaving the original untouched:",
        "~~~js",
        "const out = {};",
        "for (const k of ['a', 'c']) if (k in obj) out[k] = obj[k];",
        "~~~",
        "> INTEL — use `k in obj` to test for a key, not `if (obj[k])`. The `in` check is still true when the value is `0` or `''`, whereas `if (obj[k])` would wrongly skip those."
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
