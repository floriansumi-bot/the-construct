/* ============================================================
   curriculum-js-pack-5.js — JAVASCRIPT expansion pack 5.
   Appends 2 sectors (0x0D..0x0E) to the 'javascript' track:
     0x0D SORTING & COMPARATORS — sort(), numeric vs lexical, sort by key
     0x0E SEARCH & ALGORITHMS   — binary search, is-sorted, rotation
   Verified by _verify/verify-js.js (solutions pass, starters fail).
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, "\n"); };
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;

  t.modules.push(

    /* ---------- JS 0x0D ---------- */
    {
      id: "jsm0d-sort", code: "0x0D", title: "SORTING & COMPARATORS",
      subtitle: "sort() · numeric vs lexical · sort by key · top-N",
      theory: J(
        "## What sort actually does",
        "`.sort()` reorders an array. Sounds simple — but by default it sorts **as text**, comparing items",
        "character by character like words in a dictionary. That's why numbers come out scrambled:",
        "~~~js",
        "[10, 9, 100].sort();   // ['10','100','9'] — '1' beats '9' alphabetically!",
        "~~~",
        "## The comparator: how to sort numbers",
        "To sort the way *you* mean, hand `.sort()` a **comparator** — a function that takes two items `(a, b)`",
        "and returns a number. **Negative** means 'a comes first', **positive** means 'b comes first', **0** means",
        "'leave them tied'. For numbers the whole trick is just `a - b`:",
        "~~~js",
        "[10, 9, 100].sort((a, b) => a - b);   // [9, 10, 100] ascending",
        "[10, 9, 100].sort((a, b) => b - a);   // [100, 10, 9] descending",
        "~~~",
        "> WARNING — Forgetting the comparator is the #1 sort bug. `[10, 9, 100].sort()` gives `['10','100','9']`,",
        "> not `[9, 10, 100]`. Always pass `(a, b) => a - b` for numbers.",
        "## Sort mutates — so copy first",
        "`.sort()` does **not** return a fresh array; it rearranges the **original one in place** and hands it back.",
        "If a caller still needs their data in its old order, you've wrecked it. Copy with `.slice()` first, then",
        "sort the copy — the input stays untouched:",
        "~~~js",
        "const ranked = scores.slice().sort((a, b) => b - a);   // scores is unchanged",
        "~~~",
        "## Sort by a key, not the whole item",
        "To order objects, compare the **field** you care about. Strings have no `-`, so return `-1 / 1 / 0` by hand:",
        "~~~js",
        "people.slice().sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));",
        "~~~",
        "> INTEL — Sort descending, then keep the front slice, and you have the classic 'top-N' one-liner:",
        "> `arr.slice().sort((a, b) => b - a).slice(0, n)`."
      ),
      exercises: [
        {
          id: "js-sortdesc", title: "RANK DESCENDING", kind: "function", difficulty: 1, xp: 150,
          brief: "Highest threat first.",
          prompt: J(
            "Define **sortDesc(nums)** returning a **new** array of the numbers, largest to smallest. Don't mutate the input.",
            "~~~js",
            "sortDesc([3, 1, 2])  // [3, 2, 1]",
            "~~~"
          ),
          starter: J("function sortDesc(nums) {", "  // TODO: copy, then sort with a numeric comparator", "}"),
          solution: J("function sortDesc(nums) {", "  return nums.slice().sort(function (a, b) { return b - a; });", "}"),
          tests: [
            { name: "sorts descending", code: "assertEqual(sortDesc([3, 1, 2, 10]), [10, 3, 2, 1]);" },
            { name: "does not mutate input", code: J("var orig = [3, 1, 2];", "sortDesc(orig);", "assertEqual(orig, [3, 1, 2]);") },
            { name: "empty -> empty", code: "assertEqual(sortDesc([]), []);" },
          ],
          hint: "nums.slice().sort((a, b) => b - a)",
          lore: "Triage by threat level.",
        },
        {
          id: "js-sortbyname", title: "ROSTER SORT", kind: "function", difficulty: 2, xp: 180,
          brief: "Alphabetize the crew manifest.",
          prompt: J(
            "`crew` is an array of objects `{ name }`. Define **sortByName(crew)** returning a **new** array sorted",
            "alphabetically by `name`.",
            "~~~js",
            "sortByName([{name:'Spike'},{name:'Ed'}])  // [{name:'Ed'},{name:'Spike'}]",
            "~~~"
          ),
          starter: J("function sortByName(crew) {", "  // TODO: copy, then sort comparing .name", "}"),
          solution: J(
            "function sortByName(crew) {",
            "  return crew.slice().sort(function (a, b) {",
            "    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;",
            "  });",
            "}"
          ),
          tests: [
            { name: "alphabetical by name", code: J(
              "var crew = [{name:'Spike'},{name:'Ed'},{name:'Jet'}];",
              "assertEqual(sortByName(crew), [{name:'Ed'},{name:'Jet'},{name:'Spike'}]);"
            ) },
            { name: "does not mutate input", code: J(
              "var crew = [{name:'B'},{name:'A'}];",
              "sortByName(crew);",
              "assertEqual(crew, [{name:'B'},{name:'A'}]);"
            ) },
          ],
          hint: "crew.slice().sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)",
          lore: "Order the manifest before the jump.",
        },
        {
          id: "js-topn", title: "TOP-N THREATS", kind: "function", difficulty: 2, xp: 180,
          brief: "Surface the biggest signals.",
          prompt: J(
            "Define **topN(nums, n)** returning the `n` largest numbers, descending. If `n` exceeds the length,",
            "return all of them sorted.",
            "~~~js",
            "topN([5, 1, 9, 3], 2)  // [9, 5]",
            "~~~"
          ),
          starter: J("function topN(nums, n) {", "  // TODO: sort descending, take the first n", "}"),
          solution: J(
            "function topN(nums, n) {",
            "  return nums.slice().sort(function (a, b) { return b - a; }).slice(0, n);",
            "}"
          ),
          tests: [
            { name: "two largest", code: "assertEqual(topN([5, 1, 9, 3], 2), [9, 5]);" },
            { name: "n bigger than length", code: "assertEqual(topN([2, 1], 5), [2, 1]);" },
            { name: "n = 0 -> empty", code: "assertEqual(topN([4, 5, 6], 0), []);" },
          ],
          hint: "nums.slice().sort((a, b) => b - a).slice(0, n)",
          lore: "Only the loudest signals make the report.",
        },
      ],
    },

    /* ---------- JS 0x0E ---------- */
    {
      id: "jsm0e-search", code: "0x0E", title: "SEARCH & ALGORITHMS",
      subtitle: "binary search · is-sorted · array rotation",
      theory: J(
        "## Linear vs binary search",
        "The simplest way to find something is **linear search**: walk the array from the start and stop at the",
        "first match. It always works, but on a big list it can check every single element.",
        "If the array is **already sorted**, **binary search** is far faster. You track a window with two indices,",
        "`lo` and `hi`, look at the **middle**, and throw away half the array each step: too small? the answer is",
        "to the right, so move `lo` past `mid`. Too big? move `hi` left. Keep going while `lo <= hi`.",
        "~~~js",
        "let lo = 0, hi = arr.length - 1;",
        "while (lo <= hi) {",
        "  const mid = (lo + hi) >> 1;        // middle index",
        "  if (arr[mid] === target) return mid;",
        "  if (arr[mid] < target) lo = mid + 1;   // search the right half",
        "  else hi = mid - 1;                     // search the left half",
        "}",
        "~~~",
        "Halving like this finds a value among a million entries in ~20 steps instead of a million.",
        "> WARNING — Binary search is **only correct on a sorted array**. On unsorted data it silently returns",
        "> wrong answers. Verify the order first (see `isSorted`), or sort before you search.",
        "## Watch the boundaries",
        "Most binary-search bugs are **off-by-one**: use `lo <= hi` (not `<`) so a one-element window is still",
        "checked, and always move the bound *past* `mid` (`mid + 1` / `mid - 1`) — leaving it *on* `mid` can loop",
        "forever. When in doubt, trace a 1- and 2-element array by hand.",
        "## Modular wrap (for rotation)",
        "To rotate or wrap an index around an array of length `n`, `((k % n) + n) % n` always lands in `0..n-1` —",
        "even when `k` is negative or larger than `n`. The first `% n` shrinks it; the `+ n` then `% n` fixes",
        "negatives, since plain `%` in JS can return a negative result.",
        "> INTEL — Reach for the brute-force version first to lock down the correct answer, then optimise. A fast",
        "> function that's wrong on the edge cases is worse than a slow one that's right."
      ),
      exercises: [
        {
          id: "js-binsearch", title: "BINARY SWEEP", kind: "function", difficulty: 3, xp: 220,
          brief: "Locate the target in log time.",
          prompt: J(
            "Define **binarySearch(sorted, target)** returning the **index** of `target` in the ascending-sorted",
            "array, or **-1** if absent.",
            "~~~js",
            "binarySearch([1, 3, 5, 7, 9], 7)  // 3",
            "binarySearch([1, 3, 5], 2)        // -1",
            "~~~"
          ),
          starter: J("function binarySearch(sorted, target) {", "  // TODO: lo/hi window, check the middle", "}"),
          solution: J(
            "function binarySearch(sorted, target) {",
            "  let lo = 0, hi = sorted.length - 1;",
            "  while (lo <= hi) {",
            "    const mid = (lo + hi) >> 1;",
            "    if (sorted[mid] === target) return mid;",
            "    if (sorted[mid] < target) lo = mid + 1;",
            "    else hi = mid - 1;",
            "  }",
            "  return -1;",
            "}"
          ),
          tests: [
            { name: "finds existing", code: "assert(binarySearch([1,3,5,7,9], 7) === 3 && binarySearch([1,3,5,7,9], 1) === 0 && binarySearch([1,3,5,7,9], 9) === 4);" },
            { name: "missing -> -1", code: "assert(binarySearch([1,3,5], 2) === -1 && binarySearch([], 5) === -1);" },
            { name: "single element", code: "assert(binarySearch([42], 42) === 0 && binarySearch([42], 7) === -1);" },
          ],
          hint: "Loop while lo <= hi; mid = (lo+hi)>>1; move lo or hi past mid.",
          lore: "Halve the haystack until the needle is all that's left.",
        },
        {
          id: "js-issorted", title: "ORDER CHECK", kind: "function", difficulty: 1, xp: 150,
          brief: "Confirm the sequence is clean.",
          prompt: J(
            "Define **isSorted(arr)** returning `true` if the array is in non-decreasing order (each element >= the",
            "previous). Empty and single-element arrays are sorted.",
            "~~~js",
            "isSorted([1, 2, 2, 3])  // true",
            "isSorted([3, 1])        // false",
            "~~~"
          ),
          starter: J("function isSorted(arr) {", "  // TODO: compare each element to the previous", "}"),
          solution: J(
            "function isSorted(arr) {",
            "  for (let i = 1; i < arr.length; i++) { if (arr[i] < arr[i - 1]) return false; }",
            "  return true;",
            "}"
          ),
          tests: [
            { name: "sorted -> true", code: "assert(isSorted([1, 2, 2, 3]) === true && isSorted([]) === true && isSorted([5]) === true);" },
            { name: "unsorted -> false", code: "assert(isSorted([3, 1]) === false && isSorted([1, 2, 1]) === false);" },
          ],
          hint: "Return false the moment arr[i] < arr[i-1].",
          lore: "A clean sequence, or a corrupted one.",
        },
        {
          id: "js-rotate", title: "ARRAY ROTATION", kind: "function", difficulty: 3, xp: 210,
          brief: "Shift the ring buffer.",
          prompt: J(
            "Define **rotate(arr, k)** returning a **new** array rotated **right** by `k` positions. `k` may exceed",
            "the length.",
            "~~~js",
            "rotate([1, 2, 3, 4, 5], 2)  // [4, 5, 1, 2, 3]",
            "~~~"
          ),
          starter: J("function rotate(arr, k) {", "  // TODO: normalize k with modulo, then slice + concat", "}"),
          solution: J(
            "function rotate(arr, k) {",
            "  const n = arr.length;",
            "  if (n === 0) return [];",
            "  const s = ((k % n) + n) % n;",
            "  return arr.slice(n - s).concat(arr.slice(0, n - s));",
            "}"
          ),
          tests: [
            { name: "rotates right by 2", code: "assertEqual(rotate([1, 2, 3, 4, 5], 2), [4, 5, 1, 2, 3]);" },
            { name: "k = 0 unchanged", code: "assertEqual(rotate([1, 2, 3], 0), [1, 2, 3]);" },
            { name: "k larger than length wraps", code: "assertEqual(rotate([1, 2, 3], 4), [3, 1, 2]);" },
          ],
          hint: "s = ((k % n) + n) % n; return arr.slice(n - s).concat(arr.slice(0, n - s));",
          lore: "The buffer turns; the data stays.",
        },
      ],
    }

  );
})();
