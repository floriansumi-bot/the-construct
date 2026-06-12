/* ============================================================
   curriculum-python-pack-5.js — THE CONSTRUCT expansion PACK 5.
   Adds 5 new exercises each to two existing Python sectors:
     m09-dicts  DICTIONARIES & SETS   (zip-build, invert, mode,
                                        merge-sum, set triad ops)
     m10-exc    EXCEPTIONS & VALIDATION (parse-skip, KeyError default,
                                          raise-on-bad, try/else/finally,
                                          multi-except)
   Same exercise/test contract as curriculum.js:
     "function" -> learner defines function(s); tests assert on them.
   Theme: sci-fi / anime / music.
   ============================================================ */
(function () {

  window.addExercises("python", "m09-dicts", [

    {
      id: "dicts-zip-roster",
      title: "CREW MANIFEST",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Pair two parallel lists into one dict.",
      prompt: `
Two lists arrive side by side: **names** and their **ids**, lined up index-for-index. Define **build_roster(names, ids)** that **returns a dict** mapping each name to its id.

~~~python
build_roster(["Spike", "Jet"], [1, 2]) -> {"Spike": 1, "Jet": 2}
build_roster([], [])                    -> {}
~~~

Reach for **zip** to walk both lists together.
`,
      starter: `def build_roster(names, ids):
    # TODO: pair names with ids using zip
    pass
`,
      solution: `def build_roster(names, ids):
    return dict(zip(names, ids))
`,
      tests: [
        { name: "pairs names to ids", code: `assert build_roster(["Spike","Jet"],[1,2])=={"Spike":1,"Jet":2}, repr(build_roster(["Spike","Jet"],[1,2]))` },
        { name: "empty lists -> empty dict", code: `assert build_roster([],[])=={}` },
        { name: "single pair", code: `assert build_roster(["Ed"],[42])=={"Ed":42}` },
      ],
      hint: `dict(zip(names, ids)) zips the two lists into key/value pairs and builds the dict.`,
      lore: "Logging the Bebop's crew, one bounty hunter at a time.",
    },

    {
      id: "dicts-invert-codec",
      title: "REVERSE CODEC",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Flip a lookup table end for end.",
      prompt: `
A codec maps symbols to codes. Define **invert_codec(d)** that **returns a new dict** with keys and values **swapped** (value becomes key, key becomes value). Assume the values are unique.

~~~python
invert_codec({"a": 1, "b": 2}) -> {1: "a", 2: "b"}
invert_codec({})               -> {}
~~~
`,
      starter: `def invert_codec(d):
    # TODO: return a new dict with keys and values swapped
    pass
`,
      solution: `def invert_codec(d):
    return {v: k for k, v in d.items()}
`,
      tests: [
        { name: "swaps keys and values", code: `assert invert_codec({"a":1,"b":2})=={1:"a",2:"b"}, repr(invert_codec({"a":1,"b":2}))` },
        { name: "empty -> empty", code: `assert invert_codec({})=={}` },
        { name: "string to string", code: `assert invert_codec({"Lain":"Wired"})=={"Wired":"Lain"}` },
      ],
      hint: `A dict comprehension does it in one line: {v: k for k, v in d.items()}.`,
      lore: "Decode becomes encode. Present day, present time.",
    },

    {
      id: "dicts-most-frequent",
      title: "DOMINANT SIGNAL",
      kind: "function",
      difficulty: 2,
      xp: 170,
      brief: "Find the element that appears most.",
      prompt: `
A stream of readings comes in. Define **most_frequent(seq)** that **returns the single element** that occurs the **most** times. The input is non-empty, and assume one clear winner.

~~~python
most_frequent([1, 2, 2, 3, 2]) -> 2
most_frequent(["a","b","a","a","b"]) -> "a"
~~~

Build a frequency table, then pick the key with the highest count.
`,
      starter: `def most_frequent(seq):
    freq = {}
    # TODO: count, then return the element with the highest count
    return None
`,
      solution: `def most_frequent(seq):
    freq = {}
    for x in seq:
        freq[x] = freq.get(x, 0) + 1
    return max(freq, key=freq.get)
`,
      tests: [
        { name: "returns the modal element", code: `assert most_frequent([1,2,2,3,2])==2, repr(most_frequent([1,2,2,3,2]))` },
        { name: "works on strings", code: `assert most_frequent(["a","b","a","a","b"])=="a"` },
        { name: "single element", code: `assert most_frequent([7])==7` },
      ],
      hint: `Count into freq, then max(freq, key=freq.get) returns the key with the largest count.`,
      lore: "Above the noise floor, one frequency dominates the Wired.",
    },

    {
      id: "dicts-merge-sum",
      title: "POWER MERGE",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Combine two tallies, adding shared keys.",
      prompt: `
Two score tables come back from different runs. Define **merge_sum(a, b)** that **returns a new dict** containing every key from both — and where a key appears in **both**, its values are **added**. Do **not** mutate the inputs.

~~~python
merge_sum({"x": 1, "y": 2}, {"y": 3, "z": 4}) -> {"x": 1, "y": 5, "z": 4}
merge_sum({"a": 1}, {"b": 2})                 -> {"a": 1, "b": 2}
~~~
`,
      starter: `def merge_sum(a, b):
    # TODO: combine dicts; shared keys add their values
    pass
`,
      solution: `def merge_sum(a, b):
    out = dict(a)
    for k, v in b.items():
        out[k] = out.get(k, 0) + v
    return out
`,
      tests: [
        { name: "adds shared keys", code: `assert merge_sum({"x":1,"y":2},{"y":3,"z":4})=={"x":1,"y":5,"z":4}, repr(merge_sum({"x":1,"y":2},{"y":3,"z":4}))` },
        { name: "no overlap just merges", code: `assert merge_sum({"a":1},{"b":2})=={"a":1,"b":2}` },
        { name: "empty second dict", code: `assert merge_sum({"a":5},{})=={"a":5}` },
        { name: "does not mutate first arg", code: `src={"a":1}
merge_sum(src,{"a":9})
assert src=={"a":1}, "merge_sum must not mutate its first argument"` },
      ],
      hint: `Start with out = dict(a) (a copy), then for each k, v in b: out[k] = out.get(k, 0) + v.`,
      lore: "Two reactor cores, one combined output reading.",
    },

    {
      id: "sets-triad-ops",
      title: "SET TRIAD",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Intersection, union, and difference in one shot.",
      prompt: `
Two node lists describe overlapping networks. Define **set_triad(a, b)** that **returns a 3-tuple** of **sorted lists**:

1. **intersection** — items in both
2. **union** — items in either
3. **difference** — items in **a** but not **b**

~~~python
set_triad([1, 2, 3], [2, 3, 4]) -> ([2, 3], [1, 2, 3, 4], [1])
~~~

Use the set operators **&** (intersection), **|** (union), **-** (difference) — these are symbols, not the words \`and\`/\`or\`. Sort each result.
`,
      starter: `def set_triad(a, b):
    # TODO: return (intersection, union, difference) as three SORTED lists
    pass
`,
      solution: `def set_triad(a, b):
    sa, sb = set(a), set(b)
    return (sorted(sa & sb), sorted(sa | sb), sorted(sa - sb))
`,
      tests: [
        { name: "intersection, union, difference", code: `assert set_triad([1,2,3],[2,3,4])==([2,3],[1,2,3,4],[1]), repr(set_triad([1,2,3],[2,3,4]))` },
        { name: "disjoint sets", code: `assert set_triad([1,2],[3,4])==([],[1,2,3,4],[1,2])` },
        { name: "dedupes inputs", code: `assert set_triad([1,1,2],[2,2])==([2],[1,2],[1])` },
      ],
      hint: `Make sa, sb = set(a), set(b); then sorted(sa & sb), sorted(sa | sb), sorted(sa - sb).`,
      lore: "Three relationships between two networks, mapped at once.",
    },

  ]);

  window.addExercises("python", "m10-exc", [

    {
      id: "exc-parse-stream",
      title: "STREAM SCRUBBER",
      kind: "function",
      difficulty: 1,
      xp: 130,
      brief: "Parse the good packets, drop the corrupt ones.",
      prompt: `
A noisy stream arrives as a list of strings — some are numbers, some are garbage. Define **parse_ints(tokens)** that **returns a list of ints** for every token that converts cleanly, **skipping** any that raise a ValueError.

~~~python
parse_ints(["7", "x", "42", "3.5"]) -> [7, 42]
parse_ints(["a", "b", ""])          -> []
~~~

Try the conversion in a loop; on failure, just move on.
`,
      starter: `def parse_ints(tokens):
    out = []
    # TODO: keep only the tokens that convert to int; skip the rest
    return out
`,
      solution: `def parse_ints(tokens):
    out = []
    for t in tokens:
        try:
            out.append(int(t))
        except ValueError:
            pass
    return out
`,
      tests: [
        { name: "keeps valid, skips junk", code: `assert parse_ints(["7","x","42","3.5"])==[7,42], repr(parse_ints(["7","x","42","3.5"]))` },
        { name: "all invalid -> empty", code: `assert parse_ints(["a","b",""])==[]` },
        { name: "handles negatives", code: `assert parse_ints(["-5","z","0"])==[-5,0]` },
      ],
      hint: `Loop the tokens; wrap int(t) in try/except ValueError and only append on success.`,
      lore: "Filtering signal from static on the open channel.",
    },

    {
      id: "exc-keyerror-lookup",
      title: "GRACEFUL LOOKUP",
      kind: "function",
      difficulty: 1,
      xp: 130,
      brief: "Survive a missing key without crashing.",
      prompt: `
Define **lookup(registry, key, default)** that **returns** registry indexed by \`key\` using **square brackets** — but if that raises a **KeyError**, return \`default\` instead.

~~~python
lookup({"hp": 3}, "hp", 0) -> 3
lookup({"hp": 3}, "mp", 0) -> 0
~~~

Use \`registry[key]\` inside try/except — this drills the KeyError path (not .get).
`,
      starter: `def lookup(registry, key, default):
    # TODO: return registry[key], but if it raises KeyError return default
    pass
`,
      solution: `def lookup(registry, key, default):
    try:
        return registry[key]
    except KeyError:
        return default
`,
      tests: [
        { name: "present key returns value", code: `assert lookup({"hp":3},"hp",0)==3` },
        { name: "missing key returns default", code: `assert lookup({"hp":3},"mp",0)==0, "Missing key must return the default via KeyError handling"` },
        { name: "default can be any type", code: `assert lookup({},"x","N/A")=="N/A"` },
      ],
      hint: `try: return registry[key]  except KeyError: return default.`,
      lore: "The database shrugs; you hand back a sane fallback.",
    },

    {
      id: "exc-callsign",
      title: "CALLSIGN GATE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Reject blank callsigns; uppercase the rest.",
      prompt: `
Define **register_callsign(name)**:
- if \`name\` is empty or only whitespace, **raise ValueError** (with any message)
- otherwise **return** the name in **UPPERCASE**

~~~python
register_callsign("spike") -> "SPIKE"
register_callsign("   ")    -> raises ValueError
~~~

Tip: **name.strip()** is falsy when the string is blank.
`,
      starter: `def register_callsign(name):
    # TODO: raise ValueError if name is empty/blank, else return name.upper()
    pass
`,
      solution: `def register_callsign(name):
    if not name.strip():
        raise ValueError("callsign must not be blank")
    return name.upper()
`,
      tests: [
        { name: "valid name is uppercased", code: `assert register_callsign("spike")=="SPIKE"` },
        { name: "blank raises ValueError", code: `raised=False
try:
    register_callsign("   ")
except ValueError:
    raised=True
assert raised, "blank callsign must raise ValueError"` },
        { name: "empty raises ValueError", code: `raised=False
try:
    register_callsign("")
except ValueError:
    raised=True
assert raised, "empty callsign must raise ValueError"` },
      ],
      hint: `if not name.strip(): raise ValueError("...")  else return name.upper().`,
      lore: "No name, no clearance. State your callsign, pilot.",
    },

    {
      id: "exc-reactor-status",
      title: "REACTOR PROTOCOL",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Walk the full try / except / else / finally flow.",
      prompt: `
Define **reactor_status(a, b)** using **try / except / else / finally** to return a status string from \`a // b\`:
- on success: \`"OK:" + str(quotient) + ":DONE"\`  (e.g. 10,2 -> "OK:5:DONE") — wrap the int quotient in \`str(...)\`; you can't \`+\` an int onto text
- on **ZeroDivisionError**: \`"ERR:DONE"\`

The \`":DONE"\` suffix is appended in **finally**, so it is always present.

~~~python
reactor_status(10, 2) -> "OK:5:DONE"
reactor_status(5, 0)  -> "ERR:DONE"
~~~

Compute the quotient in **try**, set "ERR" in **except**, build "OK:n" in **else**, append ":DONE" in **finally**.
`,
      starter: `def reactor_status(a, b):
    # TODO: use try/except/else/finally to return a status string
    # success -> "OK:<quotient>:DONE" ; ZeroDivisionError -> "ERR:DONE"
    pass
`,
      solution: `def reactor_status(a, b):
    status = ""
    try:
        q = a // b
    except ZeroDivisionError:
        status = "ERR"
    else:
        status = "OK:" + str(q)
    finally:
        status = status + ":DONE"
    return status
`,
      tests: [
        { name: "success path runs else + finally", code: `assert reactor_status(10,2)=="OK:5:DONE", repr(reactor_status(10,2))` },
        { name: "error path runs except + finally", code: `assert reactor_status(5,0)=="ERR:DONE", repr(reactor_status(5,0))` },
        { name: "finally always appends DONE", code: `assert reactor_status(9,3).endswith(":DONE") and reactor_status(9,0).endswith(":DONE")` },
      ],
      hint: `else runs only when try succeeds; finally runs no matter what — append ":DONE" there.`,
      lore: "Sequence complete. The core logs DONE either way.",
    },

    {
      id: "exc-multi-catch",
      title: "DUAL FAILSAFE",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "One handler, two failure modes.",
      prompt: `
Define **safe_ratio(a, b)** that **returns** \`int(a) / int(b)\`. If **either** a ValueError (bad text) **or** a ZeroDivisionError (zero denominator) occurs, **return None** — caught by a single except that lists both types.

~~~python
safe_ratio("10", "2")   -> 5.0
safe_ratio("oops", "2") -> None   # ValueError
safe_ratio("10", "0")   -> None   # ZeroDivisionError
~~~

Catch a tuple of types: **except (ValueError, ZeroDivisionError)**.
`,
      starter: `def safe_ratio(a, b):
    # TODO: return int(a) / int(b); on ValueError OR ZeroDivisionError return None
    pass
`,
      solution: `def safe_ratio(a, b):
    try:
        return int(a) / int(b)
    except (ValueError, ZeroDivisionError):
        return None
`,
      tests: [
        { name: "valid ratio", code: `assert safe_ratio("10","2")==5.0, repr(safe_ratio("10","2"))` },
        { name: "bad text -> None (ValueError)", code: `assert safe_ratio("oops","2") is None` },
        { name: "divide by zero -> None (ZeroDivisionError)", code: `assert safe_ratio("10","0") is None` },
      ],
      hint: `One except can name several types: except (ValueError, ZeroDivisionError): return None.`,
      lore: "Two ways to fail, one clean catch. The failsafe holds.",
    },

  ]);

})();
