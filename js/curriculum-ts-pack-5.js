/* ============================================================
   curriculum-ts-pack-5.js — TYPESCRIPT expansion pack 5.
   Appends 2 sectors (0x0C..0x0D) to the 'typescript' track:
     0x0C ERROR HANDLING     — throw, try/catch, typed Result unions
     0x0D STRING ALGORITHMS  — reverse, palindrome, word count
   Starters compile under tsc but fail. Verified by _verify/verify-ts.js.
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("typescript");
  if (!t) return;

  t.modules.push(

    /* ---------- TS 0x0C ---------- */
    {
      id: "tsm0c-errors", code: "0x0C", title: "ERROR HANDLING",
      subtitle: "throw · try/catch · typed Result unions",
      theory: J(
        "## Throw on bad input",
        "Reject impossible states loudly instead of returning a wrong number.",
        "~~~ts",
        "function toInt(s: string): number {",
        "  const n = Number(s);",
        "  if (isNaN(n)) throw new Error('not a number');",
        "  return n;",
        "}",
        "~~~",
        "## The typed Result pattern",
        "Throwing isn't always best. A **Result** union makes success and failure explicit in the type — the caller",
        "must check before using the value.",
        "~~~ts",
        "type Result = { ok: true; value: number } | { ok: false };",
        "function tryParse(s: string): Result {",
        "  const n = Number(s);",
        "  return isNaN(n) ? { ok: false } : { ok: true, value: n };",
        "}",
        "~~~",
        "> INTEL — `{ ok: true; value: T } | { ok: false }` forces a check on `.ok` before `.value` is reachable."
      ),
      exercises: [
        {
          id: "ts-safedivide", title: "DIV/0 GUARD", kind: "function", difficulty: 2, xp: 170,
          brief: "Refuse the impossible division.",
          prompt: J(
            "Define **safeDivide(a: number, b: number): number** returning `a / b`, but **throw** an `Error` when",
            "`b === 0`.",
            "~~~ts",
            "safeDivide(10, 2)  // 5",
            "safeDivide(1, 0)   // throws",
            "~~~"
          ),
          starter: J("function safeDivide(a: number, b: number): number {", "  // TODO: throw on b === 0", "  return 0;", "}"),
          solution: J(
            "function safeDivide(a: number, b: number): number {",
            "  if (b === 0) throw new Error('division by zero');",
            "  return a / b;",
            "}"
          ),
          tests: [
            { name: "divides", code: "assert(safeDivide(10, 2) === 5 && safeDivide(9, 3) === 3);" },
            { name: "throws on zero", code: J("var threw = false;", "try { safeDivide(1, 0); } catch (e) { threw = true; }", "assert(threw, 'must throw on b === 0');") },
          ],
          hint: "if (b === 0) throw new Error('...'); return a / b;",
          lore: "Some divisions the core must refuse.",
        },
        {
          id: "ts-toint", title: "STRICT PARSE", kind: "function", difficulty: 2, xp: 180,
          brief: "Convert or reject — no silent NaN.",
          prompt: J(
            "Define **toInt(s: string): number** returning `Number(s)`, but **throw** an `Error` if the result is",
            "`NaN`.",
            "~~~ts",
            "toInt('42')   // 42",
            "toInt('x!')   // throws",
            "~~~"
          ),
          starter: J("function toInt(s: string): number {", "  // TODO: throw when Number(s) is NaN", "  return -1;", "}"),
          solution: J(
            "function toInt(s: string): number {",
            "  const n = Number(s);",
            "  if (isNaN(n)) throw new Error('not a number: ' + s);",
            "  return n;",
            "}"
          ),
          tests: [
            { name: "parses numbers", code: "assert(toInt('42') === 42 && toInt('-3') === -3);" },
            { name: "throws on garbage", code: J("var threw = false;", "try { toInt('x!'); } catch (e) { threw = true; }", "assert(threw, 'invalid input must throw');") },
          ],
          hint: "const n = Number(s); if (isNaN(n)) throw new Error(...); return n;",
          lore: "Trust nothing that arrives as text.",
        },
        {
          id: "ts-tryparse", title: "RESULT UNION", kind: "function", difficulty: 3, xp: 240,
          brief: "Make failure part of the type.",
          prompt: J(
            "With **type Result = { ok: true; value: number } | { ok: false }**, define **tryParse(s: string):",
            "Result** — `{ ok: true, value: n }` on success, `{ ok: false }` otherwise. No throwing.",
            "~~~ts",
            "tryParse('42')  // { ok: true, value: 42 }",
            "tryParse('x')   // { ok: false }",
            "~~~"
          ),
          starter: J(
            "type Result = { ok: true; value: number } | { ok: false };",
            "function tryParse(s: string): Result {",
            "  // TODO: return ok:true with value, or ok:false",
            "  return { ok: false };",
            "}"
          ),
          solution: J(
            "type Result = { ok: true; value: number } | { ok: false };",
            "function tryParse(s: string): Result {",
            "  const n = Number(s);",
            "  return isNaN(n) ? { ok: false } : { ok: true, value: n };",
            "}"
          ),
          tests: [
            { name: "success carries value", code: "assertEqual(tryParse('42'), { ok: true, value: 42 });" },
            { name: "failure has no value", code: "assertEqual(tryParse('nope'), { ok: false });" },
          ],
          hint: "const n = Number(s); return isNaN(n) ? { ok: false } : { ok: true, value: n };",
          lore: "Failure, made first-class.",
        },
      ],
    },

    /* ---------- TS 0x0D ---------- */
    {
      id: "tsm0d-stralgo", code: "0x0D", title: "STRING ALGORITHMS",
      subtitle: "reverse · palindrome · word count",
      theory: J(
        "## Strings to arrays and back",
        "`split('')` explodes a string into characters; transform, then `join('')`.",
        "~~~ts",
        "'lain'.split('').reverse().join('');  // 'nial'",
        "~~~",
        "## Normalize for comparisons",
        "Lower-case and strip non-letters before testing palindromes or anagrams.",
        "## Counting words",
        "`trim()` then split on whitespace — but guard the empty string, which splits to `['']` (length 1, wrong).",
        "> INTEL — `s.trim().split(/\\s+/)` collapses runs of spaces; handle '' separately so it counts as 0 words."
      ),
      exercises: [
        {
          id: "ts-reverse", title: "REVERSE STREAM", kind: "function", difficulty: 1, xp: 140,
          brief: "Flip the packet end-for-end.",
          prompt: J("Define **reverseStr(s: string): string** returning the reversed string.", "~~~ts", "reverseStr('lain')  // 'nial'", "~~~"),
          starter: J("function reverseStr(s: string): string {", "  // TODO", "  return s;", "}"),
          solution: J("function reverseStr(s: string): string {", "  return s.split('').reverse().join('');", "}"),
          tests: [
            { name: "reverses", code: "assertEqual(reverseStr('lain'), 'nial');" },
            { name: "edge cases", code: "assert(reverseStr('') === '' && reverseStr('x') === 'x');" },
          ],
          hint: "s.split('').reverse().join('')",
          lore: "Close the world, open the nExT.",
        },
        {
          id: "ts-palindrome", title: "MIRROR CHECK", kind: "function", difficulty: 2, xp: 190,
          brief: "Reads the same both ways.",
          prompt: J(
            "Define **isPalindrome(s: string): boolean** — `true` if `s` reads the same forwards and backwards,",
            "ignoring case and non-alphanumeric characters.",
            "~~~ts",
            "isPalindrome('Race, car!')  // true",
            "~~~"
          ),
          starter: J("function isPalindrome(s: string): boolean {", "  // TODO: clean, then compare to reverse", "  return false;", "}"),
          solution: J(
            "function isPalindrome(s: string): boolean {",
            "  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');",
            "  return clean === clean.split('').reverse().join('');",
            "}"
          ),
          tests: [
            { name: "messy palindrome", code: "assert(isPalindrome('Race, car!') === true && isPalindrome('A man a plan a canal Panama') === true);" },
            { name: "non-palindrome", code: "assert(isPalindrome('wired') === false);" },
            { name: "trivial", code: "assert(isPalindrome('') === true && isPalindrome('z') === true);" },
          ],
          hint: "Clean with /[^a-z0-9]/g over the lower-cased string, then compare to its reverse.",
          lore: "Symmetry hidden under the noise.",
        },
        {
          id: "ts-wordcount", title: "WORD COUNT", kind: "function", difficulty: 2, xp: 180,
          brief: "Tally the words in the transmission.",
          prompt: J(
            "Define **wordCount(s: string): number** counting whitespace-separated words. Extra spaces don't count;",
            "an empty/blank string is **0**.",
            "~~~ts",
            "wordCount('ghost in the shell')  // 4",
            "~~~"
          ),
          starter: J("function wordCount(s: string): number {", "  // TODO: trim, split on whitespace, guard empty", "  return -1;", "}"),
          solution: J(
            "function wordCount(s: string): number {",
            "  const trimmed = s.trim();",
            "  return trimmed === '' ? 0 : trimmed.split(/\\s+/).length;",
            "}"
          ),
          tests: [
            { name: "counts words", code: "assertEqual(wordCount('ghost in the shell'), 4);" },
            { name: "collapses spaces", code: "assertEqual(wordCount('  one   two  '), 2);" },
            { name: "blank -> 0", code: "assert(wordCount('') === 0 && wordCount('   ') === 0);" },
          ],
          hint: "const t = s.trim(); return t === '' ? 0 : t.split(/\\s+/).length;",
          lore: "Count the signal words; ignore the dead air.",
        },
      ],
    }

  );
})();
