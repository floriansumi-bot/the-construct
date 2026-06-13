/* ============================================================
   curriculum-js-pack-8.js — JAVASCRIPT expansion pack 8.
   Appends practice nodes to existing sectors (jsm05-loops, jsm06-closures, jsm07-recursion, jsm08-errors)
   to bring JavaScript toward Python parity. Auto-assembled from
   _verify/js-gen/*.json and verified by _verify/verify-js.js on the
   REAL V8 grader (every solution passes, every starter fails).
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack("javascript");
  if (!t) return;
  function add(modId, exs) {
    var m = t.modules.find(function (x) { return x.id === modId; });
    if (m) Array.prototype.push.apply(m.exercises, exs);
  }
  add("jsm05-loops", [
      {
        id: "js-rangearr", title: "SCAN RANGE", kind: "function", difficulty: 1, xp: 130,
        brief: "Sweep every sector from a to b.",
        prompt: "Define **rangeArr(a, b)** returning an **array** of the integers from `a` up to `b`, **inclusive** (assume `a <= b`). Build it with a loop.\n~~~js\nrangeArr(2, 5)  // [2, 3, 4, 5]\nrangeArr(4, 4)  // [4]\n~~~",
        starter: "function rangeArr(a, b) {\n  // TODO: push i from a through b into an array\n}",
        solution: "function rangeArr(a, b) {\n  const out = [];\n  for (let i = a; i <= b; i++) { out.push(i); }\n  return out;\n}",
        tests: [
        { name: "spans the range", code: "assertEqual(rangeArr(2, 5), [2, 3, 4, 5]);" },
        { name: "single sector", code: "assertEqual(rangeArr(4, 4), [4]);" },
        { name: "crosses zero", code: "assertEqual(rangeArr(-1, 2), [-1, 0, 1, 2]);" }
        ],
        hint: "Start out = [], then for (let i = a; i <= b; i++) out.push(i).", lore: "Paint the grid one sector at a time. Miss nothing."
      },
      {
        id: "js-maxof", title: "TALLEST SPIKE", kind: "function", difficulty: 2, xp: 150,
        brief: "Track the biggest reading in one pass.",
        prompt: "Define **maxOf(nums)** returning the largest number in the array. Do **not** use `Math.max`; walk the array with a loop. An **empty** array returns **null**.\n~~~js\nmaxOf([3, 7, 2])  // 7\nmaxOf([])         // null\n~~~",
        starter: "function maxOf(nums) {\n  // TODO: track the biggest value seen so far\n}",
        solution: "function maxOf(nums) {\n  if (nums.length === 0) return null;\n  let best = nums[0];\n  for (const n of nums) { if (n > best) { best = n; } }\n  return best;\n}",
        tests: [
        { name: "finds the peak", code: "assertEqual(maxOf([3, 7, 2]), 7);" },
        { name: "all negative", code: "assertEqual(maxOf([-5, -2, -9]), -2);" },
        { name: "single reading", code: "assertEqual(maxOf([4]), 4);" },
        { name: "empty -> null", code: "assertEqual(maxOf([]), null, 'no readings, no max');" }
        ],
        hint: "Guard the empty case with null, seed best = nums[0], then raise it whenever n > best.", lore: "Somewhere in the noise, one spike towers. Pin it."
      },
      {
        id: "js-countmatches", title: "SIGNAL TALLY", kind: "function", difficulty: 2, xp: 160,
        brief: "Count how often the target shows up.",
        prompt: "Define **countMatches(arr, target)** returning how many elements **strictly equal** `target` (`===`). Count them with a loop.\n~~~js\ncountMatches([1, 2, 2, 3, 2], 2)  // 3\ncountMatches([], 5)               // 0\n~~~",
        starter: "function countMatches(arr, target) {\n  // TODO: count elements equal to target\n}",
        solution: "function countMatches(arr, target) {\n  let count = 0;\n  for (const x of arr) { if (x === target) { count++; } }\n  return count;\n}",
        tests: [
        { name: "counts repeats", code: "assertEqual(countMatches([1, 2, 2, 3, 2], 2), 3);" },
        { name: "no matches", code: "assertEqual(countMatches([9, 9], 1), 0);" },
        { name: "strings too", code: "assertEqual(countMatches(['a', 'b', 'a'], 'a'), 2);" },
        { name: "empty -> 0", code: "assertEqual(countMatches([], 5), 0);" }
        ],
        hint: "Start count = 0, loop with for...of, and count++ whenever x === target.", lore: "How many times did that ghost ping the net? Count every hit."
      },
      {
        id: "js-digitssum", title: "DIGIT CRUSH", kind: "function", difficulty: 3, xp: 190,
        brief: "Fold a number down to its digit sum.",
        prompt: "Define **digitsSum(n)** returning the sum of the decimal digits of a non-negative integer `n`. Use a **while** loop with `% 10` and `Math.floor(n / 10)` — no string conversion.\n~~~js\ndigitsSum(123)  // 6\ndigitsSum(0)    // 0\n~~~",
        starter: "function digitsSum(n) {\n  // TODO: peel off n % 10 while n > 0\n}",
        solution: "function digitsSum(n) {\n  let sum = 0;\n  while (n > 0) {\n    sum += n % 10;\n    n = Math.floor(n / 10);\n  }\n  return sum;\n}",
        tests: [
        { name: "123 -> 6", code: "assertEqual(digitsSum(123), 6);" },
        { name: "all nines", code: "assertEqual(digitsSum(9999), 36);" },
        { name: "trailing zero", code: "assertEqual(digitsSum(40), 4);" },
        { name: "zero -> 0", code: "assertEqual(digitsSum(0), 0, 'the loop should not run for 0');" }
        ],
        hint: "Loop while n > 0: add n % 10 to the sum, then n = Math.floor(n / 10).", lore: "Crush the address down to a single resonance. The grid hums back."
      },
      {
        id: "js-fizzlist", title: "BUZZ GRID", kind: "function", difficulty: 3, xp: 210,
        brief: "Stamp the classic fizz/buzz pattern across a range.",
        prompt: "Define **fizzList(n)** returning an **array** for `1..n`: multiples of **15** become `'FB'`, multiples of **3** become `'F'`, multiples of **5** become `'B'`, otherwise the number itself. `fizzList(0)` is `[]`.\n~~~js\nfizzList(5)  // [1, 2, 'F', 4, 'B']\n~~~",
        starter: "function fizzList(n) {\n  // TODO: loop 1..n, push 'FB' / 'F' / 'B' / the number\n}",
        solution: "function fizzList(n) {\n  const out = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) { out.push('FB'); }\n    else if (i % 3 === 0) { out.push('F'); }\n    else if (i % 5 === 0) { out.push('B'); }\n    else { out.push(i); }\n  }\n  return out;\n}",
        tests: [
        { name: "first five", code: "assertEqual(fizzList(5), [1, 2, 'F', 4, 'B']);" },
        { name: "fifteen lands on FB", code: "assertEqual(fizzList(15), [1, 2, 'F', 4, 'B', 'F', 7, 8, 'F', 'B', 11, 'F', 13, 14, 'FB']);" },
        { name: "numbers stay numbers", code: "assertEqual(fizzList(2), [1, 2], 'non-multiples keep their numeric value');" },
        { name: "zero -> empty", code: "assertEqual(fizzList(0), []);" }
        ],
        hint: "Check i % 15 first, then i % 3, then i % 5, else push the number — order matters.", lore: "Three and five collide on fifteen. The grid lights up double."
      }
  ]);

  add("jsm06-closures", [
      {
        id: "js-accum", title: "RUNNING TALLY", kind: "function", difficulty: 1, xp: 130,
        brief: "A function that remembers its running total.",
        prompt: "Define **makeAccumulator()** returning a function. Each call **adds** its argument to a running total kept inside the closure and returns the **new** total. A fresh accumulator starts at **0**.\n~~~js\nconst acc = makeAccumulator();\nacc(10)  // 10\nacc(5)   // 15\nacc(-3)  // 12\n~~~",
        starter: "function makeAccumulator() {\n  // TODO: keep a total, return a function that adds to it\n}",
        solution: "function makeAccumulator() {\n  let total = 0;\n  return function (n) {\n    total += n;\n    return total;\n  };\n}",
        tests: [
        { name: "accumulates across calls", code: "var acc = makeAccumulator();\nassert(acc(10) === 10, 'first call returns 10');\nassert(acc(5) === 15, 'then 15');\nassert(acc(-3) === 12, 'then 12');" },
        { name: "first call returns its arg", code: "var acc = makeAccumulator();\nassertEqual(acc(7), 7);" },
        { name: "instances are independent", code: "var a = makeAccumulator(), b = makeAccumulator();\na(100);\nassert(b(1) === 1, 'b has its own total, untouched by a');" }
        ],
        hint: "let total = 0 outside the returned function; inside do total += n; return total.", lore: "The meter never resets. Every credit you burn, it remembers."
      },
      {
        id: "js-toggle", title: "FLIP-FLOP RELAY", kind: "function", difficulty: 2, xp: 160,
        brief: "A switch that flips on every pull.",
        prompt: "Define **toggle(a, b)** returning a function that **alternates** its return value each call: `a`, then `b`, then `a`, then `b`, and so on. The **first** call returns `a`.\n~~~js\nconst sw = toggle('ON', 'OFF');\nsw()  // 'ON'\nsw()  // 'OFF'\nsw()  // 'ON'\n~~~",
        starter: "function toggle(a, b) {\n  // TODO: remember which side is next, then flip\n}",
        solution: "function toggle(a, b) {\n  let onA = true;\n  return function () {\n    const value = onA ? a : b;\n    onA = !onA;\n    return value;\n  };\n}",
        tests: [
        { name: "alternates a then b", code: "var sw = toggle('ON', 'OFF');\nassert(sw() === 'ON', '1st is a');\nassert(sw() === 'OFF', '2nd is b');\nassert(sw() === 'ON', '3rd is a again');\nassert(sw() === 'OFF', '4th is b again');" },
        { name: "works with numbers", code: "var f = toggle(1, 0);\nassertEqual([f(), f(), f(), f(), f()], [1, 0, 1, 0, 1]);" },
        { name: "instances flip independently", code: "var x = toggle('a', 'b'), y = toggle('a', 'b');\nx();\nassert(y() === 'a', 'y still starts on a even after x advanced');" }
        ],
        hint: "Keep a boolean flag in the closure; read the value, then invert the flag before returning.", lore: "Pull the relay: light, dark, light, dark. The grid breathes in two states."
      },
      {
        id: "js-limiter", title: "RATE GATE", kind: "function", difficulty: 2, xp: 170,
        brief: "Allow a fixed number of passes, then deny.",
        prompt: "Define **limiter(max)** returning a function that returns `true` for its first `max` calls, then `false` for every call after that.\n~~~js\nconst gate = limiter(2);\ngate()  // true\ngate()  // true\ngate()  // false\ngate()  // false\n~~~",
        starter: "function limiter(max) {\n  // TODO: count the calls, allow only the first max\n}",
        solution: "function limiter(max) {\n  let used = 0;\n  return function () {\n    if (used < max) {\n      used += 1;\n      return true;\n    }\n    return false;\n  };\n}",
        tests: [
        { name: "allows max then denies", code: "var gate = limiter(2);\nassert(gate() === true, '1st pass');\nassert(gate() === true, '2nd pass');\nassert(gate() === false, '3rd denied');\nassert(gate() === false, '4th denied');" },
        { name: "limit of 0 denies immediately", code: "var gate = limiter(0);\nassert(gate() === false, 'with max 0 the very first call is denied');" },
        { name: "separate gates count separately", code: "var g1 = limiter(1), g2 = limiter(1);\ng1();\nassert(g2() === true, 'g2 still has its own pass left');" }
        ],
        hint: "Track a used count; while used < max increment and return true, otherwise return false.", lore: "The turnstile clicks twice, then locks. After that you climb the fence."
      },
      {
        id: "js-once", title: "SINGLE FIRE", kind: "function", difficulty: 3, xp: 190,
        brief: "Run it once; cache the result forever.",
        prompt: "Define **once(fn)** returning a wrapper. The **first** time the wrapper is called it runs `fn` (passing along the argument) and remembers the result. Every later call returns that **same** first result **without** calling `fn` again.\n~~~js\nlet runs = 0;\nconst boot = once(function (x) { runs++; return x * 2; });\nboot(5)  // 10  (runs === 1)\nboot(9)  // 10  (runs still 1)\n~~~",
        starter: "function once(fn) {\n  // TODO: return a wrapper that calls fn at most one time\n}",
        solution: "function once(fn) {\n  let called = false;\n  let result;\n  return function (x) {\n    if (!called) {\n      called = true;\n      result = fn(x);\n    }\n    return result;\n  };\n}",
        tests: [
        { name: "returns first result every time", code: "var boot = once(function (x) { return x * 2; });\nassert(boot(5) === 10, 'first call computes');\nassert(boot(9) === 10, 'later calls reuse the first result');\nassert(boot(100) === 10, 'still the first result');" },
        { name: "fn runs at most once", code: "var runs = 0;\nvar f = once(function () { runs += 1; return 'done'; });\nf(); f(); f();\nassert(runs === 1, 'the wrapped fn must execute exactly once');" },
        { name: "caches non-number results", code: "var f = once(function () { return { id: 7 }; });\nassertEqual(f(), { id: 7 });\nassertEqual(f(), { id: 7 });" }
        ],
        hint: "Keep a called flag and a saved result; on the first call set the flag and store fn(x), then always return result.", lore: "The ignition sequence runs one time. After that the engine just hums the same note."
      },
      {
        id: "js-applyn", title: "ITERATED CHAIN", kind: "function", difficulty: 3, xp: 210,
        brief: "Compose a function with itself n times.",
        prompt: "Define **applyN(fn, n)** returning a function that applies `fn` to its input **n** times in a row. With `n === 0` it returns the input unchanged (identity).\n~~~js\nconst inc = function (x) { return x + 1; };\napplyN(inc, 3)(0)   // 3\napplyN(inc, 0)(42)  // 42\n~~~",
        starter: "function applyN(fn, n) {\n  // TODO: return a function that runs fn on its input n times\n}",
        solution: "function applyN(fn, n) {\n  return function (x) {\n    let value = x;\n    for (let i = 0; i < n; i++) {\n      value = fn(value);\n    }\n    return value;\n  };\n}",
        tests: [
        { name: "applies fn n times", code: "var inc = function (x) { return x + 1; };\nassert(applyN(inc, 3)(0) === 3, 'inc applied 3 times to 0 is 3');\nassert(applyN(inc, 5)(10) === 15, 'inc applied 5 times to 10 is 15');" },
        { name: "n = 0 is identity", code: "var dbl = function (x) { return x * 2; };\nassert(applyN(dbl, 0)(42) === 42, 'zero applications returns the input');" },
        { name: "works for any fn", code: "var dbl = function (x) { return x * 2; };\nassertEqual(applyN(dbl, 4)(1), 16);" },
        { name: "reusable on different inputs", code: "var inc = function (x) { return x + 1; };\nvar plus2 = applyN(inc, 2);\nassert(plus2(0) === 2 && plus2(40) === 42, 'the returned function can be called many times');" }
        ],
        hint: "Return (x) => { let v = x; loop n times v = fn(v); return v; }. When n is 0 the loop never runs.", lore: "Feed the signal back through the same gate, again and again. Each pass bends it further."
      }
  ]);

  add("jsm07-recursion", [
      {
        id: "js-sumdigits", title: "DIGIT BLEED", kind: "function", difficulty: 2, xp: 170,
        brief: "Bleed an integer down one digit at a time and sum the drops.",
        prompt: "Define **sumDigits(n)** returning the sum of the decimal digits of a non-negative integer `n` — **recursively**, no loops. Base case: a single digit (`n < 10`) returns itself.\n~~~js\nsumDigits(123)  // 6\nsumDigits(0)    // 0\n~~~",
        starter: "function sumDigits(n) {\n  // TODO: if n < 10 return n; else (n % 10) + sumDigits(Math.floor(n / 10))\n}",
        solution: "function sumDigits(n) {\n  if (n < 10) return n;\n  return (n % 10) + sumDigits(Math.floor(n / 10));\n}",
        tests: [
        { name: "123 -> 6", code: "assertEqual(sumDigits(123), 6, 'digits 1+2+3 = 6');" },
        { name: "single digit", code: "assertEqual(sumDigits(7), 7, 'one digit is its own sum');" },
        { name: "zero -> 0", code: "assertEqual(sumDigits(0), 0, 'base case 0');" },
        { name: "99 -> 18", code: "assertEqual(sumDigits(99), 18, '9+9 = 18');" },
        { name: "ten -> 1", code: "assertEqual(sumDigits(10), 1, '1+0 = 1');" }
        ],
        hint: "Base: n < 10 -> n. Else (n % 10) + sumDigits(Math.floor(n / 10)).", lore: "Peel one digit off the wire, let the rest bleed out below."
      },
      {
        id: "js-reversestr", title: "BACKMASK", kind: "function", difficulty: 2, xp: 170,
        brief: "Spin the signal backwards, one character at a time.",
        prompt: "Define **reverseStr(s)** returning the string reversed — **recursively**, no loops or `.reverse()`. Base case: the empty string returns `''`.\n~~~js\nreverseStr('neo')  // 'oen'\nreverseStr('')     // ''\n~~~",
        starter: "function reverseStr(s) {\n  // TODO: if empty return ''; else reverseStr(rest) + first char\n}",
        solution: "function reverseStr(s) {\n  if (s === '') return '';\n  return reverseStr(s.slice(1)) + s[0];\n}",
        tests: [
        { name: "reverses word", code: "assertEqual(reverseStr('neo'), 'oen', 'characters come back flipped');" },
        { name: "empty -> empty", code: "assertEqual(reverseStr(''), '', 'base case empty string');" },
        { name: "single char", code: "assertEqual(reverseStr('x'), 'x', 'one char reversed is itself');" },
        { name: "longer string", code: "assertEqual(reverseStr('matrix'), 'xirtam', 'full string reversed');" }
        ],
        hint: "Base: '' -> ''. Else reverseStr(s.slice(1)) + s[0].", lore: "Run the tape backwards and the message reads true."
      },
      {
        id: "js-repeatstr", title: "ECHO LOOP", kind: "function", difficulty: 2, xp: 175,
        brief: "Stack the same fragment n deep without a single loop.",
        prompt: "Define **repeatStr(s, n)** returning `s` concatenated `n` times — **recursively**, no loops or `.repeat()`. Base case: `n === 0` returns `''`.\n~~~js\nrepeatStr('ab', 3)  // 'ababab'\nrepeatStr('x', 0)   // ''\n~~~",
        starter: "function repeatStr(s, n) {\n  // TODO: if n === 0 return ''; else s + repeatStr(s, n - 1)\n}",
        solution: "function repeatStr(s, n) {\n  if (n === 0) return '';\n  return s + repeatStr(s, n - 1);\n}",
        tests: [
        { name: "three copies", code: "assertEqual(repeatStr('ab', 3), 'ababab', 'ab three times');" },
        { name: "zero -> empty", code: "assertEqual(repeatStr('x', 0), '', 'base case n = 0');" },
        { name: "single copy", code: "assertEqual(repeatStr('hi', 1), 'hi', 'one copy is the string itself');" },
        { name: "five copies", code: "assertEqual(repeatStr('z', 5), 'zzzzz', 'five z chars');" }
        ],
        hint: "Base: n === 0 -> ''. Else s + repeatStr(s, n - 1).", lore: "Each call leaves an echo, stacked until the count hits zero."
      },
      {
        id: "js-palindrome-rec", title: "MIRROR PROBE", kind: "function", difficulty: 3, xp: 195,
        brief: "Probe a string from both ends, collapsing toward the middle.",
        prompt: "Define **isPalindrome(s)** returning `true` if `s` reads the same forwards and backwards — **recursively**, no loops or `.reverse()`. Compare the two ends, then recurse on the middle. Base case: length `<= 1` is `true`.\n~~~js\nisPalindrome('racecar')  // true\nisPalindrome('hello')    // false\n~~~",
        starter: "function isPalindrome(s) {\n  // TODO: if length <= 1 return true; if ends differ return false; else recurse on the middle\n}",
        solution: "function isPalindrome(s) {\n  if (s.length <= 1) return true;\n  if (s[0] !== s[s.length - 1]) return false;\n  return isPalindrome(s.slice(1, -1));\n}",
        tests: [
        { name: "racecar -> true", code: "assert(isPalindrome('racecar') === true, 'racecar is a palindrome');" },
        { name: "hello -> false", code: "assert(isPalindrome('hello') === false, 'hello is not a palindrome');" },
        { name: "empty -> true", code: "assert(isPalindrome('') === true, 'base case empty is true');" },
        { name: "single char", code: "assert(isPalindrome('a') === true, 'one char is a palindrome');" },
        { name: "even length", code: "assert(isPalindrome('abba') === true, 'even-length palindrome');" },
        { name: "two differ", code: "assert(isPalindrome('ab') === false, 'mismatched ends fail');" }
        ],
        hint: "Base: length <= 1 -> true. Else if s[0] !== last char -> false; else isPalindrome(s.slice(1, -1)).", lore: "Touch both ends to the mirror; if they match, fall inward."
      },
      {
        id: "js-countdownarr", title: "LAUNCH SEQUENCE", kind: "function", difficulty: 3, xp: 200,
        brief: "Build the launch sequence n..1 by stacking the descent.",
        prompt: "Define **countDownArr(n)** returning an array counting down from `n` to `1` — **recursively**, no loops. Base case: `n <= 0` returns `[]`.\n~~~js\ncountDownArr(3)  // [3, 2, 1]\ncountDownArr(0)  // []\n~~~",
        starter: "function countDownArr(n) {\n  // TODO: if n <= 0 return []; else [n].concat(countDownArr(n - 1))\n}",
        solution: "function countDownArr(n) {\n  if (n <= 0) return [];\n  return [n].concat(countDownArr(n - 1));\n}",
        tests: [
        { name: "3 -> [3,2,1]", code: "assertEqual(countDownArr(3), [3, 2, 1], 'counts down from 3');" },
        { name: "zero -> []", code: "assertEqual(countDownArr(0), [], 'base case empty array');" },
        { name: "one -> [1]", code: "assertEqual(countDownArr(1), [1], 'single step sequence');" },
        { name: "5 -> [5,4,3,2,1]", code: "assertEqual(countDownArr(5), [5, 4, 3, 2, 1], 'five-step descent');" }
        ],
        hint: "Base: n <= 0 -> []. Else [n].concat(countDownArr(n - 1)).", lore: "Each call drops a rung; the floor of the descent is the empty array."
      }
  ]);

  add("jsm08-errors", [
      {
        id: "js-requirepos", title: "GATEKEEPER", kind: "function", difficulty: 2, xp: 160,
        brief: "Reject any non-positive power draw.",
        prompt: "Define **requirePositive(n)** that returns `n` when `n > 0`, but **throws** an `Error` when `n <= 0`.\n~~~js\nrequirePositive(5)   // 5\nrequirePositive(0)   // throws\nrequirePositive(-3)  // throws\n~~~",
        starter: "function requirePositive(n) {\n  // TODO: throw when n <= 0, else return n\n}",
        solution: "function requirePositive(n) {\n  if (n <= 0) throw new Error('must be positive');\n  return n;\n}",
        tests: [
        { name: "passes positive", code: "assertEqual(requirePositive(5), 5, 'requirePositive(5) should be 5');" },
        { name: "passes large positive", code: "assertEqual(requirePositive(9000), 9000, 'requirePositive(9000) should be 9000');" },
        { name: "throws on zero", code: "assertThrows(function () { requirePositive(0); }, 'should throw on 0');" },
        { name: "throws on negative", code: "assertThrows(function () { requirePositive(-3); }, 'should throw on -3');" }
        ],
        hint: "if (n <= 0) throw new Error(...); return n;", lore: "None shall pass the reactor gate without a positive charge."
      },
      {
        id: "js-validatename", title: "CHECKPOINT", kind: "function", difficulty: 2, xp: 170,
        brief: "Demand a real handle, trimmed clean.",
        prompt: "Define **validateName(s)** that returns the name with surrounding whitespace removed.\nIf the trimmed name is empty (blank or all spaces), **throw** an `Error` instead.\n~~~js\nvalidateName('  Neo ')  // 'Neo'\nvalidateName('   ')     // throws\nvalidateName('')        // throws\n~~~",
        starter: "function validateName(s) {\n  // TODO: trim s; throw if empty, else return it\n}",
        solution: "function validateName(s) {\n  var name = s.trim();\n  if (name === '') throw new Error('name required');\n  return name;\n}",
        tests: [
        { name: "trims padding", code: "assertEqual(validateName('  Neo '), 'Neo', 'should trim to Neo');" },
        { name: "keeps inner content", code: "assertEqual(validateName('Trinity'), 'Trinity', 'should return Trinity');" },
        { name: "throws on blank spaces", code: "assertThrows(function () { validateName('   '); }, 'should throw on blanks');" },
        { name: "throws on empty string", code: "assertThrows(function () { validateName(''); }, 'should throw on empty');" }
        ],
        hint: "var name = s.trim(); if (name === '') throw new Error(...); return name;", lore: "A blank ID badge gets you nowhere at the checkpoint."
      },
      {
        id: "js-safedivide", title: "SAFE PORT", kind: "function", difficulty: 2, xp: 180,
        brief: "Divide without ever blowing the fuse.",
        prompt: "Define **safeDivide(a, b)** that returns `a / b`, but returns `null` instead of dividing by zero.\nIt must **never throw** — when `b` is `0`, fail safe with `null`.\n~~~js\nsafeDivide(10, 2)  // 5\nsafeDivide(7, 0)   // null\n~~~",
        starter: "function safeDivide(a, b) {\n  // TODO: return a / b, or null when b is 0\n}",
        solution: "function safeDivide(a, b) {\n  if (b === 0) return null;\n  return a / b;\n}",
        tests: [
        { name: "divides evenly", code: "assertEqual(safeDivide(10, 2), 5, 'safeDivide(10, 2) should be 5');" },
        { name: "divides to fraction", code: "assertEqual(safeDivide(3, 4), 0.75, 'safeDivide(3, 4) should be 0.75');" },
        { name: "zero divisor returns null", code: "assertEqual(safeDivide(7, 0), null, 'safeDivide(7, 0) should be null');" },
        { name: "zero over zero returns null", code: "assertEqual(safeDivide(0, 0), null, 'safeDivide(0, 0) should be null');" }
        ],
        hint: "if (b === 0) return null; return a / b;", lore: "The safe port routes a zero-load to ground instead of frying the deck."
      },
      {
        id: "js-getordefault", title: "FALLBACK CACHE", kind: "function", difficulty: 3, xp: 200,
        brief: "Trust the function, but keep a backup ready.",
        prompt: "Define **getOrDefault(fn, fallback)** that calls `fn()` and returns its value.\nIf `fn()` **throws**, swallow the error and return `fallback` instead. Use `try` / `catch`.\n~~~js\ngetOrDefault(function () { return 42; }, 0)            // 42\ngetOrDefault(function () { throw new Error('x'); }, 0)  // 0\n~~~",
        starter: "function getOrDefault(fn, fallback) {\n  // TODO: return fn(), or fallback if it throws\n}",
        solution: "function getOrDefault(fn, fallback) {\n  try {\n    return fn();\n  } catch (e) {\n    return fallback;\n  }\n}",
        tests: [
        { name: "returns fn value", code: "assertEqual(getOrDefault(function () { return 42; }, 0), 42, 'should return 42');" },
        { name: "falls back on throw", code: "assertEqual(getOrDefault(function () { throw new Error('boom'); }, 0), 0, 'should fall back to 0');" },
        { name: "fallback can be a string", code: "assertEqual(getOrDefault(function () { throw new Error('down'); }, 'OFFLINE'), 'OFFLINE', 'should fall back to OFFLINE');" },
        { name: "does not throw on failure", code: "assertEqual(getOrDefault(function () { throw new Error('e'); }, null), null, 'should swallow the error');" }
        ],
        hint: "try { return fn(); } catch (e) { return fallback; }", lore: "When the live feed dies, the cache keeps the deck breathing."
      },
      {
        id: "js-assertrange", title: "RANGE LOCK", kind: "function", difficulty: 3, xp: 210,
        brief: "Clamp the dial — or trip the alarm.",
        prompt: "Define **assertRange(x, lo, hi)** that returns `x` when it sits within `lo` and `hi` (inclusive).\nIf `x` is below `lo` **or** above `hi`, **throw** an `Error`.\n~~~js\nassertRange(5, 0, 10)   // 5\nassertRange(0, 0, 10)   // 0  (boundary is allowed)\nassertRange(11, 0, 10)  // throws\n~~~",
        starter: "function assertRange(x, lo, hi) {\n  // TODO: throw if x < lo or x > hi, else return x\n}",
        solution: "function assertRange(x, lo, hi) {\n  if (x < lo || x > hi) throw new Error('out of range');\n  return x;\n}",
        tests: [
        { name: "passes inside range", code: "assertEqual(assertRange(5, 0, 10), 5, 'assertRange(5, 0, 10) should be 5');" },
        { name: "low boundary allowed", code: "assertEqual(assertRange(0, 0, 10), 0, 'lower bound should pass');" },
        { name: "high boundary allowed", code: "assertEqual(assertRange(10, 0, 10), 10, 'upper bound should pass');" },
        { name: "throws below range", code: "assertThrows(function () { assertRange(-1, 0, 10); }, 'should throw below lo');" },
        { name: "throws above range", code: "assertThrows(function () { assertRange(11, 0, 10); }, 'should throw above hi');" }
        ],
        hint: "if (x < lo || x > hi) throw new Error(...); return x;", lore: "Push the dial past the redline and the range lock slams shut."
      }
  ]);
})();
