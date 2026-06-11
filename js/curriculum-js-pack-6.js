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
        "## Normalize, then compare",
        "Most string puzzles fall apart once you **normalize**: lower-case it and strip the noise, then the logic is easy.",
        "~~~js",
        "const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');",
        "~~~",
        "## Reverse & sort signatures",
        "- A **palindrome** equals its own reverse after cleaning.",
        "- Two strings are **anagrams** if their sorted letters match.",
        "~~~js",
        "'abc'.split('').sort().join('');   // 'abc' — a signature you can compare",
        "~~~",
        "> INTEL — Sorting the characters gives each word a fingerprint; equal fingerprints = anagrams."
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
        "## Euclid's algorithm",
        "The greatest common divisor: keep replacing `(a, b)` with `(b, a % b)` until `b` is 0 — then `a` is the GCD.",
        "~~~js",
        "while (b !== 0) { [a, b] = [b, a % b]; }   // a is now gcd",
        "~~~",
        "## Primality, the cheap way",
        "A number `n` is prime if nothing from 2 up to **√n** divides it — checking past the square root is wasted work.",
        "~~~js",
        "for (let i = 2; i * i <= n; i++) { if (n % i === 0) return false; }",
        "~~~",
        "## Clamping",
        "Pin a value into a range with `Math.max(lo, Math.min(x, hi))`.",
        "> INTEL — `i * i <= n` beats `i <= Math.sqrt(n)`: integer math, no floating-point surprises."
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
