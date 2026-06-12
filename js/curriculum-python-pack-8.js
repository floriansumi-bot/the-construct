/* ============================================================
   curriculum-python-pack-8.js — THE CONSTRUCT payload, PACK 8.
   Extends two existing advanced sectors of the 'python' track:
     m15-testing     (0x0F) UNIT TESTING        — +5 exercises
     m16-algorithms  (0x10) ALGORITHMS & BIG-O  — +5 exercises
   Same exercise/test contract as curriculum.js:
     "function" -> learner defines function(s)/class(es); tests assert on them.
   ============================================================ */
(function () {

  /* ===================== m15-testing : UNIT TESTING ===================== */
  window.addExercises("python", "m15-testing", [

    {
      id: "test-leap-year",
      title: "ORBITAL CALENDAR",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Decide if a year holds an extra day — mind the century trap.",
      prompt: `
The ship's clock needs the Gregorian leap rule. Define **is_leap_year(y)** that **returns** a **bool**:
- divisible by **4** -> leap (True)
- BUT divisible by **100** -> not a leap year
- UNLESS also divisible by **400** -> leap after all

~~~python
is_leap_year(2024) -> True     # /4, not a century
is_leap_year(1900) -> False    # /100 but not /400
is_leap_year(2000) -> True     # /400
is_leap_year(2023) -> False
~~~

Return True or False (a real bool), not 1 or 0.
`,
      starter: `def is_leap_year(y):
    # TODO: divisible by 4, except centuries unless divisible by 400
    pass
`,
      solution: `def is_leap_year(y):
    if y % 400 == 0:
        return True
    if y % 100 == 0:
        return False
    return y % 4 == 0
`,
      tests: [
        { name: "common leap years -> True", code: `assert is_leap_year(2024) is True and is_leap_year(1996) is True and is_leap_year(2000) is True` },
        { name: "non-leap years -> False", code: `assert is_leap_year(2023) is False and is_leap_year(2100) is False and is_leap_year(1900) is False` },
        { name: "century rule: /100 not /400 -> False", code: `assert is_leap_year(1700) is False and is_leap_year(1800) is False and is_leap_year(2400) is True` },
        { name: "returns a real bool, not a number", code: `assert is_leap_year(2024) is True and is_leap_year(2023) is False, "Return True/False (a bool), not 1/0."` },
        { name: "year zero and small years", code: `assert is_leap_year(0) is True and is_leap_year(4) is True and is_leap_year(1) is False` },
      ],
      hint: `Check the strongest rule first: if y % 400 == 0 return True; elif y % 100 == 0 return False; else return y % 4 == 0.`,
      lore: "Every fourth orbit, the calendar exhales one extra day. Almost every fourth.",
    },

    {
      id: "test-normalize-ws",
      title: "CLEAN SIGNAL",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Collapse messy whitespace into a single clean line.",
      prompt: `
A transmission arrives padded with stray spaces, tabs and newlines. Define **normalize_whitespace(s)** that **returns** the text with every run of whitespace collapsed to a **single space** and the ends **stripped**.

~~~python
normalize_whitespace("Spike   the    cowboy") -> "Spike the cowboy"
normalize_whitespace("   neon  city   ")       -> "neon city"
normalize_whitespace("")                        -> ""
~~~

A whitespace-only string becomes the empty string. Tip: **str.split()** with no argument already splits on any whitespace and drops the empties.
`,
      starter: `def normalize_whitespace(s):
    # TODO: collapse any run of whitespace to a single space, strip the ends
    pass
`,
      solution: `def normalize_whitespace(s):
    return ' '.join(s.split())
`,
      tests: [
        { name: "collapses internal runs to one space", code: `assert normalize_whitespace("Spike   the    cowboy")=="Spike the cowboy", repr(normalize_whitespace("Spike   the    cowboy"))` },
        { name: "strips leading and trailing whitespace", code: `assert normalize_whitespace("   neon  city   ")=="neon city", repr(normalize_whitespace("   neon  city   "))` },
        { name: "tabs and newlines count as whitespace", code: `tab=chr(9)
nl=chr(10)
messy="a"+tab+tab+"b"+nl+"c"
assert normalize_whitespace(messy)=="a b c", repr(normalize_whitespace(messy))` },
        { name: "empty and whitespace-only -> empty string", code: `ws=chr(9)+chr(10)+"  "+chr(9)
assert normalize_whitespace("")=="" and normalize_whitespace("    ")=="" and normalize_whitespace(ws)==""` },
        { name: "idempotent: normalizing twice == once", code: `s="  many   spaces here  "
once=normalize_whitespace(s)
assert normalize_whitespace(once)==once, "Applying normalize again must not change an already-clean string."` },
      ],
      hint: `One line: " ".join(s.split()). Bare s.split() splits on any whitespace run and discards empties, so join with single spaces.`,
      lore: "Strip the static. What remains is the message.",
    },

    {
      id: "test-safe-percent",
      title: "SHIELD INTEGRITY %",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Report a percentage that never divides by zero.",
      prompt: `
The HUD shows shield integrity as a percentage. Define **safe_percentage(part, whole)** that **returns** \`100 * part / whole\` as a **float** — except when \`whole\` is **0**, where it must **return 0.0** instead of crashing.

~~~python
safe_percentage(1, 4)  -> 25.0
safe_percentage(50, 50) -> 100.0
safe_percentage(5, 0)  -> 0.0     # no ZeroDivisionError!
safe_percentage(0, 8)  -> 0.0
~~~

Negative parts and results over 100 are allowed — only the zero divisor is special.
`,
      starter: `def safe_percentage(part, whole):
    # TODO: 100 * part / whole, but return 0.0 when whole is 0 (no crash)
    pass
`,
      solution: `def safe_percentage(part, whole):
    if whole == 0:
        return 0.0
    return 100.0 * part / whole
`,
      tests: [
        { name: "basic ratios", code: `assert safe_percentage(1,4)==25.0 and safe_percentage(3,4)==75.0, repr(safe_percentage(1,4))` },
        { name: "part == whole -> 100", code: `assert safe_percentage(50,50)==100.0 and safe_percentage(7,7)==100.0` },
        { name: "zero whole -> 0.0, never divides by zero", code: `assert safe_percentage(5,0)==0.0 and safe_percentage(0,0)==0.0, "Guard the zero divisor and return 0.0 instead of raising."` },
        { name: "zero part with nonzero whole -> 0.0", code: `assert safe_percentage(0,8)==0.0` },
        { name: "always returns a float", code: `r=safe_percentage(1,3)
assert isinstance(r,float) and abs(r-33.333333333333336)<1e-9, "Return a float percentage."` },
        { name: "handles negatives and over-100", code: `assert safe_percentage(-2,4)==-50.0 and safe_percentage(8,4)==200.0` },
      ],
      hint: `Guard first: if whole == 0: return 0.0. Otherwise return 100.0 * part / whole — using 100.0 keeps the result a float.`,
      lore: "A divide-by-zero is how the HUD blacks out at the worst moment. Guard it.",
    },

    {
      id: "test-rle",
      title: "BANDWIDTH SQUEEZE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Run-length encode a stream so it survives the round-trip.",
      prompt: `
To save bandwidth on the Wired, compress repeats. Define **run_length_encode(s)** that replaces each **run** of one character with that character followed by the run **length**.

~~~python
run_length_encode("aaab")    -> "a3b1"
run_length_encode("wwwbbzz") -> "w3b2z2"
run_length_encode("lain")    -> "l1a1i1n1"
run_length_encode("")        -> ""
~~~

Every run gets an explicit count (even count 1). The empty string maps to the empty string. A correct encoder is **lossless**: decoding must rebuild the original exactly.
`,
      starter: `def run_length_encode(s):
    # TODO: turn runs of a char into char+count, e.g. "aaab" -> "a3b1"
    pass
`,
      solution: `def run_length_encode(s):
    if s == "":
        return ""
    out = []
    prev = s[0]
    count = 1
    for ch in s[1:]:
        if ch == prev:
            count += 1
        else:
            out.append(prev + str(count))
            prev = ch
            count = 1
    out.append(prev + str(count))
    return "".join(out)
`,
      tests: [
        { name: "compresses adjacent runs", code: `assert run_length_encode("aaab")=="a3b1", repr(run_length_encode("aaab"))` },
        { name: "every run is emitted with its count", code: `assert run_length_encode("wwwbbzz")=="w3b2z2", repr(run_length_encode("wwwbbzz"))` },
        { name: "empty string -> empty string", code: `assert run_length_encode("")==""` },
        { name: "single char and all-same", code: `assert run_length_encode("x")=="x1" and run_length_encode("mmmmm")=="m5"` },
        { name: "no repeats -> each char gets count 1", code: `assert run_length_encode("lain")=="l1a1i1n1", repr(run_length_encode("lain"))` },
        { name: "round-trip: decode(encode(s)) == s", code: `import re
def _decode(code):
    return "".join(ch*int(num) for ch,num in re.findall("([^0-9])([0-9]+)", code))
for s in ["", "a", "aaab", "wwwbbzz", "mississippi", "abcabc"]:
    assert _decode(run_length_encode(s))==s, "Round-trip failed for "+repr(s)+": got "+repr(run_length_encode(s))` },
      ],
      hint: `Walk the string tracking the current char and a run counter. When the char changes, append prev+str(count) and reset. Append the final run after the loop. Handle "" up front.`,
      lore: "Three identical packets are a waste of the wire. Say it once, say how many.",
    },

    {
      id: "test-stack-class",
      title: "MEMORY STACK",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Build a LIFO stack class that fails loudly when empty.",
      prompt: `
Implement a class **MiniStack** — a last-in-first-out buffer — with this exact contract:
- **push(x)** — add x to the top
- **pop()** — remove and return the top; **raise IndexError** if empty
- **peek()** — return the top without removing it; **raise IndexError** if empty
- **is_empty()** — return a bool
- **size()** — return the item count (an int)

~~~python
s = MiniStack()
s.is_empty()   # True
s.push(10); s.push(20)
s.size()       # 2
s.peek()       # 20  (does not remove)
s.pop()        # 20
s.pop()        # 10
s.pop()        # raises IndexError
~~~

Back it with a list internally. The empty-stack errors are part of the contract — the tests check them.
`,
      starter: `class MiniStack:
    def __init__(self):
        # TODO: set up internal storage
        pass
    def push(self, x):
        pass
    def pop(self):
        pass
    def peek(self):
        pass
    def is_empty(self):
        pass
    def size(self):
        pass
`,
      solution: `class MiniStack:
    def __init__(self):
        self._items = []
    def push(self, x):
        self._items.append(x)
    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()
    def peek(self):
        if not self._items:
            raise IndexError("peek from empty stack")
        return self._items[-1]
    def is_empty(self):
        return len(self._items) == 0
    def size(self):
        return len(self._items)
`,
      tests: [
        { name: "new stack is empty", code: `s=MiniStack()
assert s.is_empty() is True and s.size()==0` },
        { name: "push then size/peek reflect the top", code: `s=MiniStack()
s.push(10)
s.push(20)
assert s.size()==2 and s.is_empty() is False and s.peek()==20` },
        { name: "peek does not remove the top", code: `s=MiniStack()
s.push(7)
assert s.peek()==7 and s.peek()==7 and s.size()==1, "peek must not pop."` },
        { name: "pop returns LIFO order", code: `s=MiniStack()
for v in [1,2,3]:
    s.push(v)
assert s.pop()==3 and s.pop()==2 and s.pop()==1 and s.is_empty() is True` },
        { name: "pop on empty raises IndexError", code: `s=MiniStack()
raised=False
try:
    s.pop()
except IndexError:
    raised=True
assert raised, "pop() on an empty stack must raise IndexError."` },
        { name: "peek on empty raises IndexError", code: `s=MiniStack()
raised=False
try:
    s.peek()
except IndexError:
    raised=True
assert raised, "peek() on an empty stack must raise IndexError."` },
        { name: "push/pop round-trip leaves it empty", code: `s=MiniStack()
s.push("a")
assert s.pop()=="a"
assert s.is_empty() is True and s.size()==0` },
      ],
      hint: `Store items in self._items = [] in __init__. push -> append; pop/peek -> if not self._items: raise IndexError(...), else use self._items.pop() / self._items[-1]. size/is_empty read len.`,
      lore: "Last memory in, first memory out. Pop an empty mind and it screams.",
    },

  ]);

  /* ===================== m16-algorithms : ALGORITHMS & COMPLEXITY ===================== */
  window.addExercises("python", "m16-algorithms", [

    {
      id: "algo-bubble-sort",
      title: "BUBBLE PROTOCOL",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Sort by hand — let the big values bubble to the top.",
      prompt: `
Implement **bubble_sort(arr)** the textbook way: repeatedly walk the list swapping any **adjacent** pair that is out of order, until it is sorted **ascending**. **Return a new list**; do not mutate the input and do not call \`sorted()\` or \`.sort()\`.

~~~python
bubble_sort([5, 2, 9, 1]) -> [1, 2, 5, 9]
bubble_sort([3, 3, 1])    -> [1, 3, 3]
bubble_sort([])           -> []
~~~

It is O(n^2) — slow, but the nested loop is the whole lesson.
`,
      starter: `def bubble_sort(arr):
    # TODO: repeatedly swap adjacent out-of-order pairs; return a NEW sorted list
    pass
`,
      solution: `def bubble_sort(arr):
    a = list(arr)
    n = len(a)
    for i in range(n):
        for j in range(0, n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a
`,
      tests: [
        { name: "sorts ascending", code: `assert bubble_sort([5,2,9,1])==[1,2,5,9], repr(bubble_sort([5,2,9,1]))` },
        { name: "edges: empty and single", code: `assert bubble_sort([])==[] and bubble_sort([42])==[42]` },
        { name: "duplicates and negatives", code: `assert bubble_sort([3,3,1])==[1,3,3] and bubble_sort([0,-2,5,-2])==[-2,-2,0,5]` },
        { name: "already sorted stays sorted", code: `assert bubble_sort([1,2,3,4,5])==[1,2,3,4,5]` },
        { name: "does not call sorted()/.sort() and does not mutate", code: `src=_src
assert "sorted(" not in src and ".sort(" not in src, "Implement bubble sort by hand - no sorted()/.sort()."
data=[8,3,7,1,9,2]
copy=list(data)
out=bubble_sort(data)
assert out==[1,2,3,7,8,9] and data==copy, "Sort a copy; leave the input untouched."` },
        { name: "matches sorted() on a random list", code: `import random
d=[random.randint(-30,30) for _ in range(20)]
c=list(d)
assert bubble_sort(d)==sorted(c)` },
      ],
      hint: `Copy: a=list(arr). Outer loop i over range(n); inner loop j over range(0, n-1-i): if a[j] > a[j+1], swap them. Return a.`,
      lore: "Heavy values rise to the surface, one swap at a time. Crude, honest, O(n squared).",
    },

    {
      id: "algo-bsearch-insert",
      title: "INSERTION LOCK",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Binary-search the slot where a value belongs.",
      prompt: `
Given an ascending list \`arr\`, define **insert_index(arr, target)** that returns the **leftmost index** where \`target\` could be inserted while keeping \`arr\` sorted. Use an **iterative binary search** (a halving loop) — no \`.index()\`, no \`bisect\`, no linear scan.

~~~python
insert_index([1, 3, 5, 7], 4) -> 2     # fits between 3 and 5
insert_index([1, 2, 2, 2, 3], 2) -> 1  # LEFTMOST slot among equals
insert_index([10, 20, 30], 5)  -> 0    # smaller than all
insert_index([10, 20, 30], 99) -> 3    # larger than all -> len(arr)
insert_index([], 42)           -> 0
~~~

This is exactly \`bisect_left\`: when \`target\` is already present, return the index of the **first** occurrence.
`,
      starter: `def insert_index(arr, target):
    # TODO: iterative binary search for the LEFTMOST index where target fits, keeping arr sorted
    pass
`,
      solution: `def insert_index(arr, target):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
      tests: [
        { name: "inserts between existing values", code: `assert insert_index([1,3,5,7],4)==2 and insert_index([1,3,5,7],6)==3, repr(insert_index([1,3,5,7],4))` },
        { name: "leftmost slot when target is present", code: `assert insert_index([1,2,2,2,3],2)==1, "Return the LEFTMOST position (bisect_left) - got "+repr(insert_index([1,2,2,2,3],2))` },
        { name: "smaller than all -> 0", code: `assert insert_index([10,20,30],5)==0 and insert_index([10,20,30],10)==0` },
        { name: "larger than all -> len(arr)", code: `assert insert_index([10,20,30],99)==3 and insert_index([10,20,30],30)==2` },
        { name: "empty list -> 0", code: `assert insert_index([],42)==0` },
        { name: "matches bisect.bisect_left on a big range", code: `import bisect
data=list(range(0,1000,2))
for tgt in [-5,0,1,2,3,500,501,998,999,1000,5000]:
    assert insert_index(data,tgt)==bisect.bisect_left(data,tgt), "Mismatch at "+repr(tgt)` },
      ],
      hint: `Use a half-open range: lo, hi = 0, len(arr). While lo < hi: mid=(lo+hi)//2; if arr[mid] < target: lo=mid+1 else hi=mid. Return lo. The strict < (not <=) gives the leftmost slot.`,
      lore: "Halve the gap until exactly one slot remains. The new value clicks into place.",
    },

    {
      id: "algo-sum-digits",
      title: "DIGITAL ROOT DESCENT",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Add a number's digits using pure recursion.",
      prompt: `
Define **sum_digits(n)** for a **non-negative** integer \`n\` that returns the sum of its decimal digits, computed **recursively** (the function must call itself). Solve it numerically — no \`str()\`, no \`sum()\` over the digits.

~~~python
sum_digits(7)   -> 7
sum_digits(123) -> 6      # 1 + 2 + 3
sum_digits(100) -> 1
sum_digits(0)   -> 0
~~~

The last digit is \`n % 10\`; the rest of the number is \`n // 10\`. Your **base case** is a single digit (\`n < 10\`).
`,
      starter: `def sum_digits(n):
    # TODO: recursively add the decimal digits of a non-negative int (must call itself)
    pass
`,
      solution: `def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)
`,
      tests: [
        { name: "single digit returns itself", code: `assert sum_digits(0)==0 and sum_digits(7)==7` },
        { name: "multi-digit sums", code: `assert sum_digits(123)==6 and sum_digits(99)==18, repr(sum_digits(123))` },
        { name: "trailing and internal zeros", code: `assert sum_digits(100)==1 and sum_digits(1020)==3` },
        { name: "large number", code: `assert sum_digits(999999999)==81` },
        { name: "actually recurses (no str/sum shortcut)", code: `names=sum_digits.__code__.co_names
assert "sum_digits" in names, "The body must call sum_digits(...) itself."
src=_src
assert "str(" not in src and "sum(" not in src, "Solve it numerically with recursion - no str()/sum() over the digits."` },
      ],
      hint: `Base case: if n < 10: return n. Recursive step: return n % 10 + sum_digits(n // 10) — peel the last digit, recurse on the rest.`,
      lore: "Peel one digit, fall a decimal place, peel again — until a single number remains.",
    },

    {
      id: "algo-merge-sorted",
      title: "CONVOY MERGE",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Fuse two sorted lists into one with a two-pointer sweep.",
      prompt: `
Two convoys arrive, each already sorted ascending. Define **merge_sorted(a, b)** that returns **one** ascending list containing every element of both. Use the **two-pointer merge** (the heart of merge sort) — walk both lists in step; do **not** just concatenate and \`sorted()\`.

~~~python
merge_sorted([1, 3, 5], [2, 4, 6]) -> [1, 2, 3, 4, 5, 6]
merge_sorted([1, 2, 2], [2, 3])    -> [1, 2, 2, 2, 3]
merge_sorted([1], [2, 3, 4, 5])    -> [1, 2, 3, 4, 5]
merge_sorted([], [3, 4])           -> [3, 4]
~~~

Keep duplicates, handle uneven lengths, and don't mutate the inputs.
`,
      starter: `def merge_sorted(a, b):
    # TODO: two-pointer merge of two ascending lists into one ascending list
    pass
`,
      solution: `def merge_sorted(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out
`,
      tests: [
        { name: "interleaves two sorted lists", code: `assert merge_sorted([1,3,5],[2,4,6])==[1,2,3,4,5,6], repr(merge_sorted([1,3,5],[2,4,6]))` },
        { name: "one or both empty", code: `assert merge_sorted([],[])==[] and merge_sorted([1,2],[])==[1,2] and merge_sorted([],[3,4])==[3,4]` },
        { name: "uneven lengths", code: `assert merge_sorted([1],[2,3,4,5])==[1,2,3,4,5] and merge_sorted([0,9],[1])==[0,1,9]` },
        { name: "keeps duplicates across both lists", code: `assert merge_sorted([1,2,2],[2,3])==[1,2,2,2,3], repr(merge_sorted([1,2,2],[2,3]))` },
        { name: "negatives stay ordered", code: `assert merge_sorted([-5,-1,0],[-3,2])==[-5,-3,-1,0,2]` },
        { name: "result equals sorted(a+b); inputs untouched", code: `a=[1,4,4,8]
b=[2,4,9]
ca,cb=list(a),list(b)
out=merge_sorted(a,b)
assert out==sorted(a+b), repr(out)
assert a==ca and b==cb, "Do not mutate the inputs."` },
      ],
      hint: `Two indices i=j=0. While both in range: append the smaller of a[i]/b[j] and advance that pointer (use <= to stay stable). After the loop, extend out with the leftover tail of whichever list remains.`,
      lore: "Two ordered columns, zipped into a single line that never breaks formation.",
    },

    {
      id: "algo-two-sum",
      title: "RESONANT PAIR",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Find the two indices whose values hit the target frequency.",
      prompt: `
Define **two_sum(nums, target)** that returns a tuple **(i, j)** with \`i < j\` such that \`nums[i] + nums[j] == target\`. If no pair works, return **None**. A value may pair with a value at a **different** index, but never with itself.

~~~python
two_sum([2, 7, 11, 15], 9) -> (0, 1)   # 2 + 7
two_sum([3, 2, 4], 6)      -> (1, 2)   # 2 + 4
two_sum([3, 3], 6)         -> (0, 1)
two_sum([1, 2, 3], 100)    -> None
~~~

Aim for one pass with a dictionary of values seen so far (O(n)). Among all valid pairs, return the one whose **second** index \`j\` is smallest — the pair that completes first as you scan left to right. (For these tests, any valid pair is accepted.)
`,
      starter: `def two_sum(nums, target):
    # TODO: return (i, j) with i < j such that nums[i] + nums[j] == target, else None
    pass
`,
      solution: `def two_sum(nums, target):
    seen = {}
    for j, x in enumerate(nums):
        need = target - x
        if need in seen:
            return (seen[need], j)
        if x not in seen:
            seen[x] = j
    return None
`,
      tests: [
        { name: "finds the pair of indices", code: `assert two_sum([2,7,11,15],9)==(0,1), repr(two_sum([2,7,11,15],9))` },
        { name: "indices are ascending (i < j)", code: `r=two_sum([3,2,4],6)
assert r==(1,2), "Return indices with i < j - got "+repr(r)` },
        { name: "no valid pair -> None", code: `assert two_sum([1,2,3],100) is None and two_sum([],5) is None and two_sum([5],5) is None` },
        { name: "uses two distinct positions for equal values", code: `assert two_sum([3,3],6)==(0,1), "A value may pair with a different index, not itself."` },
        { name: "negatives and zero target", code: `assert two_sum([-3,4,3,90],0)==(0,2) and two_sum([0,0,1],0)==(0,1)` },
        { name: "returns the earliest completing pair", code: `r=two_sum([1,5,2,3,4],6)
assert r==(0,1), "Return the first pair that completes as you scan - got "+repr(r)` },
      ],
      hint: `Keep a dict mapping value -> earliest index. For each j, x: if (target - x) is already in the dict, return (that index, j). Otherwise record x's index (only if unseen). Fall through to None.`,
      lore: "Two tones, struck apart, that ring as one. Find the indices that resonate.",
    },

  ]);

})();
