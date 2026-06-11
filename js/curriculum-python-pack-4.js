/* THE CONSTRUCT — Python exercise pack 4
   Adds 5 exercises each to m07-str (STRING MANIPULATION) and
   m08-lists (LISTS & TUPLES). Loaded after curriculum.js. */
(function () {
  window.addExercises("python", "m07-str", [
    {
      id: "str-count",
      title: "SIGNAL TALLY",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Count how often a pattern pings the array.",
      prompt: `
A long-range dish keeps logging the same call pattern. Define **count_signal(text, target)** that **returns** how many times the substring **target** appears inside **text** (non-overlapping, case-sensitive).

~~~python
count_signal("Tachikoma", "a")      -> 2
count_signal("na na na batman", "na") -> 3
count_signal("LAIN", "z")           -> 0
~~~
`,
      starter: `def count_signal(text, target):
    # TODO: count occurrences of target in text
    pass
`,
      solution: `def count_signal(text, target):
    return text.count(target)
`,
      tests: [
        { name: "counts single chars", code: `assert count_signal("Tachikoma","a")==2, repr(count_signal("Tachikoma","a"))` },
        { name: "counts a substring", code: `assert count_signal("na na na batman","na")==3, repr(count_signal("na na na batman","na"))` },
        { name: "absent target -> 0", code: `assert count_signal("LAIN","z")==0` },
      ],
      hint: `The string method .count(target) does exactly this.`,
      lore: "The dish at Sector 7 has heard that same chirp three times tonight.",
    },
    {
      id: "str-palindrome",
      title: "MIRROR PROTOCOL",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Does the cipher read the same both ways?",
      prompt: `
Some access codes are valid only if they mirror perfectly. Define **is_palindrome(s)** that **returns** a **bool**: True when **s** reads the same forwards and backwards, else False. Compare against the reversed slice.

~~~python
is_palindrome("radar")  -> True
is_palindrome("motoko") -> False
is_palindrome("")       -> True
~~~
`,
      starter: `def is_palindrome(s):
    # TODO: return True if s reads the same backwards
    pass
`,
      solution: `def is_palindrome(s):
    return s == s[::-1]
`,
      tests: [
        { name: "true for a palindrome", code: `assert is_palindrome("radar") is True, repr(is_palindrome("radar"))` },
        { name: "false for non-palindrome", code: `assert is_palindrome("motoko") is False, repr(is_palindrome("motoko"))` },
        { name: "empty and single are palindromes", code: `assert is_palindrome("")==True and is_palindrome("x")==True` },
        { name: "returns a real bool", code: `assert isinstance(is_palindrome("abba"), bool)` },
      ],
      hint: `Reverse with s[::-1], then compare it to s with ==. That comparison is already a bool.`,
      lore: "A Ghost recognizes itself in the mirror — or it does not.",
    },
    {
      id: "str-reverse-words",
      title: "BACKMASKED ORDER",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Play the message back, word order reversed.",
      prompt: `
A spliced transmission needs its words flipped end-to-end (the letters inside each word stay put). Define **reverse_words(sentence)** that **splits** on spaces, **reverses** the word order, and **joins** them back with single spaces.

~~~python
reverse_words("see you space cowboy") -> "cowboy space you see"
reverse_words("Bebop")                -> "Bebop"
~~~
`,
      starter: `def reverse_words(sentence):
    # TODO: split on spaces, reverse word order, join back
    pass
`,
      solution: `def reverse_words(sentence):
    return " ".join(sentence.split()[::-1])
`,
      tests: [
        { name: "reverses word order", code: `assert reverse_words("see you space cowboy")=="cowboy space you see", repr(reverse_words("see you space cowboy"))` },
        { name: "single word unchanged", code: `assert reverse_words("Bebop")=="Bebop"` },
        { name: "two words swap", code: `assert reverse_words("Cowboy Bebop")=="Bebop Cowboy"` },
      ],
      hint: `sentence.split() gives a list of words; reverse it with [::-1]; rejoin with " ".join(...).`,
      lore: "See you, space cowboy... yobwoc ecaps ,uoy eeS.",
    },
    {
      id: "str-scrub",
      title: "CALLSIGN SCRUB",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Sanitize a unit designation before transmit.",
      prompt: `
Raw callsigns arrive padded with whitespace and hyphens the relay cannot route. Define **scrub_callsign(raw)** that **returns** the string with outer whitespace **stripped** and every hyphen replaced by an underscore.

~~~python
scrub_callsign("  EVA-01  ")        -> "EVA_01"
scrub_callsign("NERV-HQ-TOKYO-3")   -> "NERV_HQ_TOKYO_3"
~~~
`,
      starter: `def scrub_callsign(raw):
    # TODO: strip outer whitespace, then replace every "-" with "_"
    pass
`,
      solution: `def scrub_callsign(raw):
    return raw.strip().replace("-", "_")
`,
      tests: [
        { name: "strips and replaces", code: `assert scrub_callsign("  EVA-01  ")=="EVA_01", repr(scrub_callsign("  EVA-01  "))` },
        { name: "replaces every hyphen", code: `assert scrub_callsign("NERV-HQ-TOKYO-3")=="NERV_HQ_TOKYO_3", repr(scrub_callsign("NERV-HQ-TOKYO-3"))` },
        { name: "clean input untouched", code: `assert scrub_callsign("ASUKA")=="ASUKA"` },
      ],
      hint: `Chain the methods: raw.strip() first, then .replace("-", "_") on the result.`,
      lore: "Unit EVA_01, you are cleared for launch.",
    },
    {
      id: "str-skip",
      title: "EVERY OTHER BIT",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Decode the carrier hidden on alternating samples.",
      prompt: `
The real message lives only on the even-indexed samples (0, 2, 4, ...); the odd ones are decoy noise. Define **every_other(s)** that **returns** the characters at indices 0, 2, 4, ... using a single **step slice**.

~~~python
every_other("ABCDEF")    -> "ACE"
every_other("SxTyAzRwS") -> "STARS"
~~~
`,
      starter: `def every_other(s):
    # TODO: return characters at index 0, 2, 4, ... using a step slice
    pass
`,
      solution: `def every_other(s):
    return s[::2]
`,
      tests: [
        { name: "keeps even indices", code: `assert every_other("ABCDEF")=="ACE", repr(every_other("ABCDEF"))` },
        { name: "decodes the signal", code: `assert every_other("SxTyAzRwS")=="STARS", repr(every_other("SxTyAzRwS"))` },
        { name: "empty stays empty", code: `assert every_other("")=="" and every_other("Z")=="Z"` },
      ],
      hint: `The slice s[::2] starts at 0 and steps by 2, keeping every other character.`,
      lore: "Between the stars, the noise; on the stars, the truth.",
    },
  ]);

  window.addExercises("python", "m08-lists", [
    {
      id: "lists-comp-power",
      title: "POWER ROUTING",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Reroute only the live conduits, at double output.",
      prompt: `
Only conduits carrying a positive charge should be powered, and each survivor runs at double output. Define **boost(levels)** that, using a **list comprehension**, keeps every value greater than 0 and **doubles** it.

~~~python
boost([3, -1, 4, 0, 5]) -> [6, 8, 10]
boost([-2, -3, 0])      -> []
~~~
`,
      starter: `def boost(levels):
    # TODO: for each level > 0, include level doubled (use a comprehension)
    pass
`,
      solution: `def boost(levels):
    return [n * 2 for n in levels if n > 0]
`,
      tests: [
        { name: "filters then doubles", code: `assert boost([3, -1, 4, 0, 5])==[6, 8, 10], repr(boost([3,-1,4,0,5]))` },
        { name: "drops zero and negatives", code: `assert boost([-2, -3, 0])==[]` },
        { name: "all positive", code: `assert boost([1, 2, 3])==[2, 4, 6]` },
      ],
      hint: `[n * 2 for n in levels if n > 0] — the if filters, the n * 2 transforms.`,
      lore: "Tachikoma: re-routing power! All thrusters at two hundred percent!",
    },
    {
      id: "lists-dedupe",
      title: "GHOST DEDUP",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Strip duplicate ghosts, keep first appearance.",
      prompt: `
The crew roster keeps re-logging the same names. Define **dedupe(items)** that **returns** a new list with duplicates removed, keeping only the **first** appearance of each item and preserving order. (A plain set would scramble the order — track what you have seen instead.)

~~~python
dedupe(["Spike", "Jet", "Spike", "Faye", "Jet"]) -> ["Spike", "Jet", "Faye"]
dedupe([3, 1, 2, 1, 3, 2])                        -> [3, 1, 2]
~~~
`,
      starter: `def dedupe(items):
    # TODO: keep first occurrence of each item, preserving order
    pass
`,
      solution: `def dedupe(items):
    seen = set()
    out = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out
`,
      tests: [
        { name: "removes later duplicates", code: `assert dedupe(["Spike","Jet","Spike","Faye","Jet"])==["Spike","Jet","Faye"], repr(dedupe(["Spike","Jet","Spike","Faye","Jet"]))` },
        { name: "preserves original order", code: `assert dedupe([3, 1, 2, 1, 3, 2])==[3, 1, 2], repr(dedupe([3,1,2,1,3,2]))` },
        { name: "no duplicates -> unchanged", code: `assert dedupe(["a","b","c"])==["a","b","c"] and dedupe([])==[]` },
      ],
      hint: `Keep a set of seen items; append x to the output only the first time you see it.`,
      lore: "The Major has met a hundred copies of herself. She remembers only the first.",
    },
    {
      id: "lists-pair-up",
      title: "STEREO PAIRING",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Bind each track name to its tempo.",
      prompt: `
Two parallel arrays arrive from the deck: track names and their BPMs. Define **pair_up(names, bpms)** that **returns** a list of **(name, bpm)** tuples, matched by position. If the lists differ in length, stop at the shorter one.

~~~python
pair_up(["Aphex", "Boards"], [140, 90]) -> [("Aphex", 140), ("Boards", 90)]
~~~
`,
      starter: `def pair_up(names, bpms):
    # TODO: return a list of (name, bpm) tuples, paired by position
    pass
`,
      solution: `def pair_up(names, bpms):
    return list(zip(names, bpms))
`,
      tests: [
        { name: "pairs by position", code: `assert pair_up(["Aphex","Boards"], [140, 90])==[("Aphex",140),("Boards",90)], repr(pair_up(["Aphex","Boards"],[140,90]))` },
        { name: "stops at shorter list", code: `assert pair_up(["a","b","c"], [1, 2])==[("a",1),("b",2)], repr(pair_up(["a","b","c"],[1,2]))` },
        { name: "empty inputs -> empty list", code: `assert pair_up([], [])==[]` },
      ],
      hint: `zip(names, bpms) pairs them up; wrap it in list(...) to materialize the tuples.`,
      lore: "Left channel: Aphex. Right channel: Boards of Canada. Mind the phase.",
    },
    {
      id: "lists-flatten",
      title: "GRID COLLAPSE",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Collapse the sector grid into one stream.",
      prompt: `
Sensor data comes in as rows of a grid (a list of lists). Define **flatten(grid)** that **returns** a single flat list containing every inner item, left-to-right, top-to-bottom. Empty rows contribute nothing.

~~~python
flatten([[1, 2], [3, 4], [5]])      -> [1, 2, 3, 4, 5]
flatten([[], ["a"], [], ["b", "c"]]) -> ["a", "b", "c"]
~~~
`,
      starter: `def flatten(grid):
    # TODO: return one flat list of all inner items, in order
    pass
`,
      solution: `def flatten(grid):
    return [item for row in grid for item in row]
`,
      tests: [
        { name: "flattens rows in order", code: `assert flatten([[1, 2], [3, 4], [5]])==[1, 2, 3, 4, 5], repr(flatten([[1,2],[3,4],[5]]))` },
        { name: "handles empty inner lists", code: `assert flatten([[], ["a"], [], ["b","c"]])==["a","b","c"], repr(flatten([[],["a"],[],["b","c"]]))` },
        { name: "empty grid -> empty list", code: `assert flatten([])==[]` },
      ],
      hint: `A nested comprehension reads left-to-right: [item for row in grid for item in row].`,
      lore: "The grid folds flat, and every cell speaks in one voice.",
    },
    {
      id: "lists-runner-up",
      title: "SILVER MEDAL",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Find the second-best score, ties ignored.",
      prompt: `
On the arcade leaderboard, a tie for first place still leaves one runner-up. Define **runner_up(scores)** that **returns** the **second-largest DISTINCT** value. Collapse duplicates first, then take the second highest. Assume at least two distinct values exist.

~~~python
runner_up([5, 2, 9, 1, 7])    -> 7
runner_up([10, 10, 8, 8, 3])  -> 8
~~~
`,
      starter: `def runner_up(scores):
    # TODO: return the second-largest DISTINCT value
    pass
`,
      solution: `def runner_up(scores):
    return sorted(set(scores), reverse=True)[1]
`,
      tests: [
        { name: "second highest distinct", code: `assert runner_up([5, 2, 9, 1, 7])==7, repr(runner_up([5,2,9,1,7]))` },
        { name: "ignores duplicate top", code: `assert runner_up([10, 10, 8, 8, 3])==8, repr(runner_up([10,10,8,8,3]))` },
        { name: "works unsorted", code: `assert runner_up([1, 3, 2])==2` },
      ],
      hint: `set(scores) removes duplicates; sorted(..., reverse=True) ranks them; index [1] is the runner-up.`,
      lore: "Player Two has entered the high-score table. Forever second, never forgotten.",
    },
  ]);
})();
