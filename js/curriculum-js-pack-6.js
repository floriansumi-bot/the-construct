/* ============================================================
   curriculum-js-pack-6.js — JAVASCRIPT expansion pack 6 (final).
   Appends 2 sectors (0x0F..0x10) to the 'javascript' track,
   bringing JS to 16 sectors / 48 nodes — parity with Python:
     0x0F STRING ALGORITHMS — palindrome, anagram, title-case
     0x10 MATH & NUMBERS    — gcd, primality, clamp
   Verified by _verify/verify-js.js (solutions pass, starters fail).
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;

  t.modules.push(

    /* ---------- JS 0x0F ---------- */
    {
      id: "jsm0f-stralgo", code: "0x0F", title: "STRING ALGORITHMS",
      subtitle: "normalize · palindrome · anagram · title-case",
      theory: J(
        "## Normalize first, compare second",
        "**What:** *normalizing* means scrubbing a string down to a plain form — lower-case, no spaces, no punctuation — before you do anything with it.",
        "**Why:** the computer sees `'Lain'` and `'lain'` as totally different text. Strip away the noise and the real comparison becomes trivial.",
        "~~~js",
        "const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');",
        "// 'A man!' -> 'aman'  (lower-cased, only letters/digits survive)",
        "~~~",
        "The regex `/[^a-z0-9]/g` means *every character that is NOT a lowercase letter or digit* — `replace` deletes them all.",
        "> WARNING — Comparing raw strings is the #1 beginner trap: `'Silent' === 'silent'` is `false`. Normalize **both** sides before any check.",
        "## Reverse & sort: build a signature",
        "Two classic puzzles fall right out of normalized text:",
        "- A **palindrome** reads the same both ways — so the cleaned string equals its own reverse.",
        "- Two strings are **anagrams** if they use the exact same letters — so their *sorted* letters match.",
        "~~~js",
        "'cinema'.split('').sort().join('');  // 'aceimn'",
        "'iceman'.split('').sort().join('');  // 'aceimn' — same signature -> anagram",
        "~~~",
        "Sorting the characters turns each word into a **fingerprint**: rearranging the letters can't change it, so equal fingerprints mean equal letter-sets.",
        "## Char codes",
        "Need the raw number behind a character? `'A'.charCodeAt(0)` is `65`, and `String.fromCharCode(65)` turns it back into `'A'` — handy for shifting or ordering letters.",
        "> INTEL — `split('')` shatters a string into a character array, and `join('')` welds it back. `sort()` and `reverse()` only work on arrays, so this round-trip is how you reshape text."
      ),
      exercises: [
        {
          id: "js-palindrome2", title: "MIRROR PROTOCOL", kind: "function", difficulty: 2, xp: 190,
          brief: "Detect a phrase that reads both ways.",
          prompt: J(
            "Define **isPalindrome(s)** returning `true` if `s` reads the same forwards and backwards, **ignoring**",
            "case, spaces, and punctuation.",
            "~~~js",
            "isPalindrome('A man, a plan, a canal: Panama')  // true",
            "isPalindrome('wired')                           // false",
            "~~~"
          ),
          starter: J("function isPalindrome(s) {", "  // TODO: clean to lowercase letters/digits, compare to its reverse", "}"),
          solution: J(
            "function isPalindrome(s) {",
            "  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');",
            "  return clean === clean.split('').reverse().join('');",
            "}"
          ),
          tests: [
            { name: "messy palindrome", code: "assert(isPalindrome('A man, a plan, a canal: Panama') === true);" },
            { name: "non-palindrome", code: "assert(isPalindrome('wired') === false);" },
            { name: "empty / single", code: "assert(isPalindrome('') === true && isPalindrome('x') === true);" },
          ],
          hint: "Clean with /[^a-z0-9]/g, then compare to the reversed clean string.",
          lore: "Lain, backwards, is still Lain.",
        },
        {
          id: "js-anagram", title: "LETTER SCRAMBLE", kind: "function", difficulty: 2, xp: 190,
          brief: "Same letters, different order.",
          prompt: J(
            "Define **isAnagram(a, b)** returning `true` if `a` and `b` use the same letters, **ignoring case and",
            "spaces**.",
            "~~~js",
            "isAnagram('listen', 'silent')        // true",
            "isAnagram('Dormitory', 'Dirty Room') // true",
            "~~~"
          ),
          starter: J("function isAnagram(a, b) {", "  // TODO: normalize each (lowercase, no spaces, sorted) and compare", "}"),
          solution: J(
            "function isAnagram(a, b) {",
            "  const norm = function (x) { return x.toLowerCase().replace(/\\s/g, '').split('').sort().join(''); };",
            "  return norm(a) === norm(b);",
            "}"
          ),
          tests: [
            { name: "simple anagram", code: "assert(isAnagram('listen', 'silent') === true);" },
            { name: "ignores case + spaces", code: "assert(isAnagram('Dormitory', 'Dirty Room') === true);" },
            { name: "not anagrams", code: "assert(isAnagram('abc', 'abd') === false && isAnagram('aab', 'abb') === false);" },
          ],
          hint: "Sort the cleaned letters of each; equal signatures = anagram.",
          lore: "Rearrange the signal; the information survives.",
        },
        {
          id: "js-titlecase", title: "TITLE CASE", kind: "function", difficulty: 2, xp: 170,
          brief: "Capitalize the mission name.",
          prompt: J(
            "Define **titleCase(s)** capitalizing the first letter of each space-separated word, lowercasing the rest.",
            "~~~js",
            "titleCase('ghost in the shell')  // 'Ghost In The Shell'",
            "~~~"
          ),
          starter: J("function titleCase(s) {", "  // TODO: split on spaces, upper-case the first letter of each word", "}"),
          solution: J(
            "function titleCase(s) {",
            "  return s.split(' ').map(function (w) {",
            "    return w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w;",
            "  }).join(' ');",
            "}"
          ),
          tests: [
            { name: "capitalizes each word", code: "assertEqual(titleCase('ghost in the shell'), 'Ghost In The Shell');" },
            { name: "fixes mixed case", code: "assertEqual(titleCase('cOWBOY beBOP'), 'Cowboy Bebop');" },
            { name: "single word", code: "assertEqual(titleCase('akira'), 'Akira');" },
          ],
          hint: "s.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(' ')",
          lore: "Name the operation properly, soldier.",
        },
      ],
    },

    /* ---------- JS 0x10 ---------- */
    {
      id: "jsm10-math", code: "0x10", title: "MATH & NUMBERS",
      subtitle: "gcd · primality · clamping ranges",
      theory: J(
        "## Euclid's algorithm (greatest common divisor)",
        "**What:** the GCD is the biggest number that divides two values evenly — `gcd(12, 18)` is `6`.",
        "**Why:** Euclid found a 2,000-year-old shortcut: replace `(a, b)` with `(b, a % b)` over and over. The numbers shrink fast, and the moment `b` hits 0, the answer is sitting in `a`.",
        "~~~js",
        "while (b !== 0) { [a, b] = [b, a % b]; }   // a is now the gcd",
        "// 18%12=6 -> (12,6); 12%6=0 -> (6,0); stop -> 6",
        "~~~",
        "`a % b` is the **remainder** of division. `[a, b] = [b, a % b]` swaps both values at once (destructuring) so you don't lose `b` before you've used it.",
        "## Primality, without wasted work",
        "**What:** a **prime** is a whole number above 1 with no divisors except 1 and itself (2, 3, 5, 7, 11, ...).",
        "**Why test only up to √n?** Divisors come in pairs that multiply to `n`. One partner is always ≤ √n, so if no divisor shows up by the square root, none exists above it either.",
        "~~~js",
        "if (n < 2) return false;                 // 0 and 1 are not prime",
        "for (let i = 2; i * i <= n; i++) {",
        "  if (n % i === 0) return false;         // found a divisor -> not prime",
        "}",
        "return true;",
        "~~~",
        "> WARNING — Looping `i` all the way to `n` still works but is hugely wasteful: for a million it does ~1000x the checks. Stop at √n.",
        "## Clamping a value into a range",
        "**What:** *clamp* forces a number to stay between a low and high bound — anything below `lo` becomes `lo`, anything above `hi` becomes `hi`.",
        "~~~js",
        "Math.max(lo, Math.min(x, hi));  // x pinned to [lo, hi]",
        "// clamp(99, 0, 10): min(99,10)=10, then max(0,10)=10",
        "~~~",
        "> WARNING — Argument order matters: it's `Math.min(x, hi)` then `Math.max(lo, ...)`. Swap `lo` and `hi` and a value that's too low can slip past the ceiling.",
        "## Integers vs floats",
        "JavaScript has only one number type, and decimals are stored in binary — so some fractions can't be exact.",
        "~~~js",
        "0.1 + 0.2;                       // 0.30000000000000004, not 0.3 !",
        "(0.1 + 0.2).toFixed(2);          // '0.30'  (a string, rounded for display)",
        "~~~",
        "> INTEL — Never test floats with `===`. Compare with a tiny tolerance, e.g. `Math.abs(a - b) < 1e-9`. And `i * i <= n` beats `i <= Math.sqrt(n)`: pure integer math, no floating-point surprises."
      ),
      exercises: [
        {
          id: "js-gcd", title: "COMMON DIVISOR", kind: "function", difficulty: 2, xp: 190,
          brief: "Reduce two signals to their root.",
          prompt: J(
            "Define **gcd(a, b)** returning the greatest common divisor (assume a, b >= 0, not both 0).",
            "~~~js",
            "gcd(12, 18)  // 6",
            "~~~"
          ),
          starter: J("function gcd(a, b) {", "  // TODO: Euclid — loop until b is 0", "}"),
          solution: J(
            "function gcd(a, b) {",
            "  while (b !== 0) { const r = a % b; a = b; b = r; }",
            "  return a;",
            "}"
          ),
          tests: [
            { name: "gcd(12, 18) -> 6", code: "assertEqual(gcd(12, 18), 6);" },
            { name: "coprime -> 1", code: "assert(gcd(17, 5) === 1 && gcd(13, 27) === 1);" },
            { name: "with zero", code: "assert(gcd(0, 9) === 9 && gcd(9, 0) === 9);" },
          ],
          hint: "while (b !== 0) { const r = a % b; a = b; b = r; } return a;",
          lore: "Strip two frequencies to their shared root.",
        },
        {
          id: "js-isprime", title: "PRIME SCANNER", kind: "function", difficulty: 2, xp: 190,
          brief: "Flag the indivisible.",
          prompt: J(
            "Define **isPrime(n)** returning `true` if `n` is prime. Numbers below 2 are not prime.",
            "~~~js",
            "isPrime(13)  // true",
            "isPrime(1)   // false",
            "~~~"
          ),
          starter: J("function isPrime(n) {", "  // TODO: reject < 2, then test divisors up to sqrt(n)", "}"),
          solution: J(
            "function isPrime(n) {",
            "  if (n < 2) return false;",
            "  for (let i = 2; i * i <= n; i++) { if (n % i === 0) return false; }",
            "  return true;",
            "}"
          ),
          tests: [
            { name: "small primes", code: "assert(isPrime(2) === true && isPrime(3) === true && isPrime(13) === true);" },
            { name: "composites", code: "assert(isPrime(1) === false && isPrime(4) === false && isPrime(91) === false);" },
            { name: "larger prime", code: "assert(isPrime(97) === true);" },
          ],
          hint: "if (n < 2) return false; for (let i = 2; i*i <= n; i++) if (n % i === 0) return false; return true;",
          lore: "Indivisible. Like a properly secured key.",
        },
        {
          id: "js-clamp", title: "RANGE CLAMP", kind: "function", difficulty: 1, xp: 150,
          brief: "Keep the throttle in bounds.",
          prompt: J(
            "Define **clamp(x, lo, hi)** returning `x` constrained to the range `[lo, hi]`.",
            "~~~js",
            "clamp(5, 0, 10)   // 5",
            "clamp(-3, 0, 10)  // 0",
            "clamp(99, 0, 10)  // 10",
            "~~~"
          ),
          starter: J("function clamp(x, lo, hi) {", "  // TODO: never below lo, never above hi", "}"),
          solution: J("function clamp(x, lo, hi) {", "  return Math.max(lo, Math.min(x, hi));", "}"),
          tests: [
            { name: "inside range", code: "assertEqual(clamp(5, 0, 10), 5);" },
            { name: "below / above", code: "assert(clamp(-3, 0, 10) === 0 && clamp(99, 0, 10) === 10);" },
            { name: "on the edges", code: "assert(clamp(0, 0, 10) === 0 && clamp(10, 0, 10) === 10);" },
          ],
          hint: "Math.max(lo, Math.min(x, hi))",
          lore: "Redline is a limit, not a target.",
        },
      ],
    }

  );
})();
