/* ============================================================
   curriculum-ruby-pack-1.js — RUBY expansion (right-size to ~8 sectors).
   Adds new sectors + fills existing. Test-based (assert/assert_equal/
   assert_raises); verified by _verify/verify-ruby.js on CRuby (ruby.wasm).
   Auto-assembled from _verify/ruby-gen/jobs/*.json — do not hand-edit.
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack("ruby");
  if (!t) return;
  function add(modId, exs) { var m = t.modules.find(function (x) { return x.id === modId; }); if (m) Array.prototype.push.apply(m.exercises, exs); }
  t.modules.push(
      {
        id: "rbm04-hashes", code: "0x04", title: "HASHES & SYMBOLS",
        subtitle: "hash literals · symbol keys · fetch · tally",
        theory: "\n## What is a hash?\nA **hash** is a lookup table: it maps **keys** to **values**. Think of it as a labelled drawer — instead of asking for \"item number 3\" (an array index), you ask for the drawer named `:bpm`.\n~~~ruby\ntrack = { name: \"Da Funk\", bpm: 112, key: \"Am\" }\ntrack[:bpm]   # 112\n~~~\nThe **WHY**: arrays are great when order matters, but when you want to look something up *by name* — a config value, a player's score, a count — a hash is faster and clearer.\n\n## Symbol keys\nThose `name:` / `bpm:` keys are **symbols**. A symbol like `:bpm` is a lightweight, immutable label — written with a leading colon. The literal `{ bpm: 112 }` is just shorthand for `{ :bpm => 112 }`.\n~~~ruby\n{ bpm: 112 }          # symbol key, the modern style\n{ :bpm => 112 }       # exactly the same hash\n{ \"bpm\" => 112 }      # a STRING key — a DIFFERENT key!\n~~~\n\n> WARNING — `:bpm` (symbol) and `\"bpm\"` (string) are **not** the same key. `h[:bpm]` will return **nil** if the hash was built with string keys. When you write `{ bpm: 112 }`, the key is the *symbol* `:bpm`, so read it back with `h[:bpm]`.\n\n## Reading: `[ ]` vs `fetch`\nTwo ways to read a value:\n~~~ruby\ntrack[:bpm]              # 112\ntrack[:genre]            # nil  (missing key -> nil, no error)\ntrack.fetch(:bpm)        # 112\ntrack.fetch(:genre, 0)   # 0    (missing key -> the default you pass)\ntrack.fetch(:genre)      # raises KeyError!  (no default given)\n~~~\nUse **`h[:k]`** for a quick read where `nil` is fine. Use **`h.fetch(:k, default)`** when a missing key should fall back to a sensible value, or **`h.fetch(:k)`** when a missing key is a real bug you want to blow up loudly.\n\n## Iterating\nWalk every pair with **`each`** (or its twin **`each_pair`**). The block gets the key and the value:\n~~~ruby\nscores = { ren: 3, lain: 5 }\nscores.each { |name, points| puts \"#{name}: #{points}\" }\n# ren: 3\n# lain: 5\n~~~\nNeed just one side? **`scores.keys`** gives `[:ren, :lain]`, **`scores.values`** gives `[3, 5]`.\n\n## Counting with `Hash.new(0)`\nA plain `{}` returns `nil` for unknown keys, so `count[x] += 1` would crash (`nil + 1`). Give the hash a **default value** with `Hash.new(0)` — now any unseen key reads as `0`, perfect for tallies:\n~~~ruby\ntally = Hash.new(0)\n[\"a\", \"b\", \"a\"].each { |c| tally[c] += 1 }\ntally   # { \"a\" => 2, \"b\" => 1 }\n~~~\n\n> INTEL — `Hash.new(0)` is the single most useful hash trick: it turns counting into a one-liner. The `0` is the value handed back for any key you never set.\n\n## Combining: `merge`\n**`merge`** returns a **new** hash with both sets of pairs; on a clash, the **argument wins**. It does **not** change the original.\n~~~ruby\ndefaults = { hp: 100, mp: 30 }\ndefaults.merge({ mp: 50, lvl: 9 })   # { hp: 100, mp: 50, lvl: 9 }\ndefaults                             # { hp: 100, mp: 30 }  (untouched)\n~~~\n\n> WARNING — `merge` returns the combined hash — it does **not** modify the receiver. The common beginner mistake is calling `a.merge(b)` and expecting `a` to change. Capture the result: `merged = a.merge(b)` (or use `merge!` only when you truly mean to mutate). And remember Ruby's implicit return — the **last expression** is the method's value, so write the hash last instead of reaching for an explicit `return`.\n",
        exercises: [
        {
          id: "rb-hlook", title: "DRAWER READ", kind: "function", difficulty: 1, xp: 120,
          brief: "Pull one value out of a hash.",
          prompt: "\nA **track** is a hash with symbol keys like **{ name: \"Spice\", bpm: 128 }**. Define **get_bpm(track)** returning the value under the **:bpm** key.\n~~~ruby\nget_bpm({ name: \"Spice\", bpm: 128 })  # 128\n~~~\n",
          starter: "def get_bpm(track)\n  # TODO: read the :bpm value\n  0\nend\n",
          solution: "def get_bpm(track)\n  track[:bpm]\nend\n",
          tests: [
          { name: "reads bpm", code: "assert_equal(get_bpm({ name: \"Spice\", bpm: 128 }), 128)" },
          { name: "another track", code: "assert_equal(get_bpm({ name: \"Da Funk\", bpm: 112 }), 112)" },
          { name: "uses the symbol key", code: "assert_equal(get_bpm({ bpm: 90 }), 90)" }
          ],
          hint: "track[:bpm]  — note the leading colon, it's a symbol key.", lore: "Open the drawer marked bpm. Read what's inside."
        },
        {
          id: "rb-hfetch", title: "SAFE FETCH", kind: "function", difficulty: 1, xp: 130,
          brief: "Read a key with a fallback.",
          prompt: "\nDefine **volume_of(settings)** returning the **:volume** value from the **settings** hash, or **5** if that key is missing. Use **fetch** with a default.\n~~~ruby\nvolume_of({ volume: 9 })  # 9\nvolume_of({})             # 5\n~~~\n",
          starter: "def volume_of(settings)\n  # TODO: fetch :volume, default 5\n  settings[:volume]\nend\n",
          solution: "def volume_of(settings)\n  settings.fetch(:volume, 5)\nend\n",
          tests: [
          { name: "present key", code: "assert_equal(volume_of({ volume: 9 }), 9)" },
          { name: "missing key -> 5", code: "assert_equal(volume_of({}), 5)" },
          { name: "other keys ignored", code: "assert_equal(volume_of({ bass: 3 }), 5)" }
          ],
          hint: "settings.fetch(:volume, 5)  — the second argument is returned when the key is absent.", lore: "No signal on the line? Fall back to a known-safe level."
        },
        {
          id: "rb-hkeys", title: "NAME ROSTER", kind: "function", difficulty: 2, xp: 160,
          brief: "List the keys of a hash.",
          prompt: "\n**roster** is a hash mapping each callsign (a symbol) to a score, like **{ ren: 3, lain: 5 }**. Define **callsigns(roster)** returning an **array of just the keys**, in order.\n~~~ruby\ncallsigns({ ren: 3, lain: 5 })  # [:ren, :lain]\n~~~\n",
          starter: "def callsigns(roster)\n  # TODO: return the hash's keys\n  []\nend\n",
          solution: "def callsigns(roster)\n  roster.keys\nend\n",
          tests: [
          { name: "lists keys", code: "assert_equal(callsigns({ ren: 3, lain: 5 }), [:ren, :lain])" },
          { name: "single entry", code: "assert_equal(callsigns({ akira: 1 }), [:akira])" },
          { name: "empty -> empty", code: "assert_equal(callsigns({}), [])" }
          ],
          hint: "roster.keys returns the keys as an array; roster.values would give the scores.", lore: "Who's on the net tonight? Read the roster."
        },
        {
          id: "rb-hsumv", title: "LEDGER TOTAL", kind: "function", difficulty: 2, xp: 170,
          brief: "Add up every value in the hash.",
          prompt: "\n**ledger** maps a name to a number, like **{ spike: 25, jet: 10 }**. Define **total(ledger)** returning the **sum of all the values**. An empty ledger totals **0**. Reach for **values**.\n~~~ruby\ntotal({ spike: 25, jet: 10 })  # 35\ntotal({})                      # 0\n~~~\n",
          starter: "def total(ledger)\n  # TODO: sum the values\n  nil\nend\n",
          solution: "def total(ledger)\n  ledger.values.sum\nend\n",
          tests: [
          { name: "sums values", code: "assert_equal(total({ spike: 25, jet: 10 }), 35)" },
          { name: "single entry", code: "assert_equal(total({ ed: 7 }), 7)" },
          { name: "empty -> 0", code: "assert_equal(total({}), 0)" }
          ],
          hint: "ledger.values.sum  — pull the numbers out, then fold them.", lore: "Every bounty on the board, added head by head."
        },
        {
          id: "rb-hmerge", title: "CONFIG OVERLAY", kind: "function", difficulty: 2, xp: 180,
          brief: "Patch defaults with overrides, no mutation.",
          prompt: "\nDefine **apply(defaults, overrides)** returning a **new** hash with all the pairs of both, where **overrides** wins on any shared key. Do **not** change **defaults**. Use **merge**.\n~~~ruby\napply({ hp: 100, mp: 30 }, { mp: 50, lvl: 9 })  # { hp: 100, mp: 50, lvl: 9 }\n~~~\n",
          starter: "def apply(defaults, overrides)\n  # TODO: merge, letting overrides win\n  defaults\nend\n",
          solution: "def apply(defaults, overrides)\n  defaults.merge(overrides)\nend\n",
          tests: [
          { name: "overrides win", code: "assert_equal(apply({ hp: 100, mp: 30 }, { mp: 50, lvl: 9 }), { hp: 100, mp: 50, lvl: 9 })" },
          { name: "two empties -> empty", code: "assert_equal(apply({}, {}), {})" },
          { name: "does not mutate defaults", code: "d = { hp: 100 }\napply(d, { hp: 1 })\nassert_equal(d, { hp: 100 }, \"the original defaults must be untouched\")" }
          ],
          hint: "defaults.merge(overrides) returns a fresh hash; on a clash the argument's value wins.", lore: "Defaults are a suggestion. The overlay is law."
        },
        {
          id: "rb-htally", title: "PACKET TALLY", kind: "function", difficulty: 3, xp: 200,
          brief: "Count how often each item appears.",
          prompt: "\nDefine **tally(items)** taking an array and returning a hash mapping **each item to how many times it appears**. Build it with **Hash.new(0)** and **each**.\n~~~ruby\ntally([\"a\", \"b\", \"a\"])  # { \"a\" => 2, \"b\" => 1 }\n~~~\n",
          starter: "def tally(items)\n  counts = {}\n  # TODO: a plain {} returns nil for new keys — use Hash.new(0)\n  items.each { |x| counts[x] += 1 }\n  counts\nend\n",
          solution: "def tally(items)\n  counts = Hash.new(0)\n  items.each { |x| counts[x] += 1 }\n  counts\nend\n",
          tests: [
          { name: "counts repeats", code: "assert_equal(tally([\"a\", \"b\", \"a\"]), { \"a\" => 2, \"b\" => 1 })" },
          { name: "all distinct", code: "assert_equal(tally([1, 2, 3]), { 1 => 1, 2 => 1, 3 => 1 })" },
          { name: "empty -> empty", code: "assert_equal(tally([]), {})" },
          { name: "missing keys default to 0 (no crash)", code: "assert_equal(tally([\"x\"]), { \"x\" => 1 })" }
          ],
          hint: "Hash.new(0) makes every unseen key read as 0, so counts[x] += 1 just works.", lore: "Every packet logged. The pattern hides in the counts."
        },
        {
          id: "rb-hpairs", title: "DOSSIER LINES", kind: "function", difficulty: 3, xp: 210,
          brief: "Turn each pair into a formatted line.",
          prompt: "\n**dossier** maps a symbol field to a string value, like **{ name: \"Lain\", city: \"Tokyo\" }**. Define **lines(dossier)** returning an **array of strings** — one per pair, formatted **\"key: value\"** — in order. Iterate with **each_pair** (or **each**).\n~~~ruby\nlines({ name: \"Lain\", city: \"Tokyo\" })  # [\"name: Lain\", \"city: Tokyo\"]\n~~~\n",
          starter: "def lines(dossier)\n  out = []\n  # TODO: each_pair, push \"#{key}: #{value}\"\n  out\nend\n",
          solution: "def lines(dossier)\n  out = []\n  dossier.each_pair { |key, value| out << \"#{key}: #{value}\" }\n  out\nend\n",
          tests: [
          { name: "formats each pair", code: "assert_equal(lines({ name: \"Lain\", city: \"Tokyo\" }), [\"name: Lain\", \"city: Tokyo\"])" },
          { name: "single field", code: "assert_equal(lines({ id: \"X1\" }), [\"id: X1\"])" },
          { name: "empty -> empty", code: "assert_equal(lines({}), [])" }
          ],
          hint: "dossier.each_pair { |key, value| out << \"#{key}: #{value}\" } — the symbol key interpolates without its colon.", lore: "The dossier reads itself, line by line."
        },
        {
          id: "rb-hwinner", title: "TOP CALLSIGN", kind: "script", difficulty: 3, xp: 220,
          brief: "Print the highest-scoring entry from a tally.",
          prompt: "\nThis is a **script** task. Start from this scoreboard exactly:\n~~~ruby\nscores = { \"ren\" => 3, \"lain\" => 5, \"akira\" => 1 }\n~~~\nWalk every pair with **each**, find the callsign with the **highest** score (assume no ties), and **puts** that callsign on its own line.\n~~~text\nlain\n~~~\n",
          starter: "scores = { \"ren\" => 3, \"lain\" => 5, \"akira\" => 1 }\nbest = scores.keys.first\n# TODO: walk the pairs and keep the callsign with the most points\nputs best\n",
          solution: "scores = { \"ren\" => 3, \"lain\" => 5, \"akira\" => 1 }\nbest = nil\nbest_points = -1\nscores.each do |name, points|\n  if points > best_points\n    best = name\n    best_points = points\n  end\nend\nputs best\n",
          tests: [
          { name: "prints the top scorer", code: "assert(stdout().include?(\"lain\"), \"expected lain (score 5) on the channel\")" },
          { name: "does not print a loser", code: "lines = stdout().split(\"\\n\").map { |l| l.strip }\nassert(lines.include?(\"lain\"), \"lain should be printed\")\nassert(!lines.include?(\"akira\"), \"only the winner should be printed, not akira\")" }
          ],
          hint: "Track a running best and best_points; replace both whenever points is larger.", lore: "One name rises above the net. Surface it."
        }
        ],
      },
      {
        id: "rbm05-enum", code: "0x05", title: "ENUMERABLE",
        subtitle: "reduce · group_by · sort_by · min_by/max_by",
        theory: "## The Enumerable toolkit\n\nEvery array (and hash) in Ruby mixes in **Enumerable** — a giant box of looping tools. You almost never write a manual `for` loop. Instead you pick the tool that already does what you want and hand it a **block**: `{ |x| ... }` for one line, or `do |x| ... end` for many.\n\nThe golden rule of blocks: **the last line of the block is its value**. No `return` needed — and `return` inside a block is actually a mistake that jumps out of the whole method.\n\n## reduce / inject — fold a list into one value\n\n`reduce` walks the list carrying an **accumulator**. The block's result becomes the next accumulator.\n~~~ruby\n[1, 2, 3, 4].reduce(0) { |sum, n| sum + n }   # 10\n[1, 2, 3, 4].reduce(1) { |prod, n| prod * n } # 24\n~~~\nThe number in `reduce(0)` is the **starting** accumulator. For a product, start at **1** (starting at 0 would zero everything out — a classic beginner trap). There's even a shortcut for simple operators: `[1,2,3].reduce(:+)  # 6`.\n\n> INTEL — `inject` is the exact same method under a different name. `reduce` and `inject` are interchangeable.\n\n## each_with_object — build a collection as you go\n\nWhen you want to fill up a hash or array, `each_with_object` is cleaner than `reduce`. You pass the object **once**, and it is handed back to you every loop:\n~~~ruby\n[\"a\", \"b\", \"a\"].each_with_object(Hash.new(0)) do |word, counts|\n  counts[word] += 1\nend\n# { \"a\" => 2, \"b\" => 1 }\n~~~\n\n> WARNING — `each_with_object` **returns the object you passed in**, not the block's last line. So you mutate `counts` (e.g. `counts[word] += 1`) and let Ruby hand the finished object back. Trying to `return counts` from inside, or writing the count as the last line, are the two most common slip-ups.\n\n## group_by — bucket items by a key\n\nGives you a **hash** mapping each block result to the array of items that produced it.\n~~~ruby\n[1, 2, 3, 4, 5].group_by { |n| n.even? }\n# { false => [1, 3, 5], true => [2, 4] }\n~~~\n\n## sort_by — order by a computed value\n\nSorts ascending by whatever the block returns. To reverse, negate a number or call `.reverse` after.\n~~~ruby\n[\"ruby\", \"go\", \"perl\"].sort_by { |w| w.length }   # [\"go\", \"ruby\", \"perl\"]\n~~~\n\n## min_by / max_by — the single best item\n\nReturns the actual **element** whose block value is smallest / largest — not the number itself.\n~~~ruby\n[\"ruby\", \"go\", \"perl\"].max_by { |w| w.length }   # \"perl\"\n~~~\n\n## count, find / detect\n\n`count { |x| ... }` counts how many items match. `find` (alias `detect`) returns the **first** matching element, or `nil` if none.\n~~~ruby\n[1, 2, 3, 4].count { |n| n.even? }     # 2\n[1, 2, 3, 4].find { |n| n > 2 }        # 3\n~~~\n\n> INTEL — Chaining is the whole game: `select` then `map` is the most common combo — filter first, then transform. `data.select { |x| x.live? }.map { |x| x.name }` reads top-to-bottom like a pipeline.\n\n> WARNING — Symbol keys vs string keys are different worlds. A hash written `{ bpm: 128 }` is read with `h[:bpm]` (symbol), while `{ \"bpm\" => 128 }` needs `h[\"bpm\"]` (string). Mixing them up returns `nil`.\n",
        exercises: [
        {
          id: "rb-fold", title: "SUM CORE", kind: "function", difficulty: 1, xp: 120,
          brief: "Fold cells into one sum.",
          prompt: "Define **fold_sum(nums)** that uses **reduce** to add up every number in the array and return the total. Start the accumulator at **0**.\n~~~ruby\nfold_sum([1, 2, 3, 4])  # 10\n~~~",
          starter: "def fold_sum(nums)\n  # TODO: use reduce starting at 0\n  0\nend\n",
          solution: "def fold_sum(nums)\n  nums.reduce(0) { |sum, n| sum + n }\nend\n",
          tests: [
          { name: "sums values", code: "assert_equal(fold_sum([1, 2, 3, 4]), 10)" },
          { name: "empty -> 0", code: "assert_equal(fold_sum([]), 0)" },
          { name: "handles negatives", code: "assert_equal(fold_sum([10, -4, 2]), 8)" }
          ],
          hint: "nums.reduce(0) { |sum, n| sum + n }", lore: "One value to bind them all."
        },
        {
          id: "rb-product", title: "REACTOR PRODUCT", kind: "function", difficulty: 1, xp: 130,
          brief: "Multiply the whole chain.",
          prompt: "Define **chain_product(nums)** that uses **reduce** to multiply every number together. Start the accumulator at **1** so an empty array returns 1.\n~~~ruby\nchain_product([2, 3, 4])  # 24\n~~~",
          starter: "def chain_product(nums)\n  # TODO: reduce with a starting value\n  0\nend\n",
          solution: "def chain_product(nums)\n  nums.reduce(1) { |prod, n| prod * n }\nend\n",
          tests: [
          { name: "multiplies values", code: "assert_equal(chain_product([2, 3, 4]), 24)" },
          { name: "empty -> 1", code: "assert_equal(chain_product([]), 1)" },
          { name: "single element", code: "assert_equal(chain_product([7]), 7)" }
          ],
          hint: "Start at 1, not 0: nums.reduce(1) { |prod, n| prod * n }", lore: "Multiply the load until the core hums."
        },
        {
          id: "rb-tally", title: "PACKET TALLY", kind: "function", difficulty: 2, xp: 170,
          brief: "Count how often each tag appears.",
          prompt: "Define **tally(words)** that returns a **hash** mapping each string to how many times it appears. Use **each_with_object** with a `Hash.new(0)` so missing keys default to 0.\n~~~ruby\ntally([\"a\", \"b\", \"a\"])  # { \"a\" => 2, \"b\" => 1 }\n~~~",
          starter: "def tally(words)\n  # TODO: build a count hash with each_with_object\n  {}\nend\n",
          solution: "def tally(words)\n  words.each_with_object(Hash.new(0)) do |w, counts|\n    counts[w] += 1\n  end\nend\n",
          tests: [
          { name: "counts repeats", code: "assert_equal(tally([\"a\", \"b\", \"a\"]), { \"a\" => 2, \"b\" => 1 })" },
          { name: "empty -> empty hash", code: "assert_equal(tally([]), {})" },
          { name: "all unique", code: "assert_equal(tally([\"x\", \"y\", \"z\"]), { \"x\" => 1, \"y\" => 1, \"z\" => 1 })" }
          ],
          hint: "words.each_with_object(Hash.new(0)) { |w, counts| counts[w] += 1 }", lore: "Every packet logged, none lost in the noise."
        },
        {
          id: "rb-bucket", title: "PARITY BUCKETS", kind: "function", difficulty: 2, xp: 170,
          brief: "Split numbers into even and odd.",
          prompt: "Define **by_parity(nums)** that uses **group_by** to bucket numbers by whether they are even. Return the hash keyed by **true** (even) and **false** (odd).\n~~~ruby\nby_parity([1, 2, 3, 4])  # { false => [1, 3], true => [2, 4] }\n~~~",
          starter: "def by_parity(nums)\n  # TODO: group_by even?\n  {}\nend\n",
          solution: "def by_parity(nums)\n  nums.group_by { |n| n.even? }\nend\n",
          tests: [
          { name: "buckets by parity", code: "assert_equal(by_parity([1, 2, 3, 4]), { false => [1, 3], true => [2, 4] })" },
          { name: "all even", code: "assert_equal(by_parity([2, 4, 6]), { true => [2, 4, 6] })" },
          { name: "empty -> empty hash", code: "assert_equal(by_parity([]), {})" }
          ],
          hint: "nums.group_by { |n| n.even? }", lore: "Sort the signal from the static."
        },
        {
          id: "rb-longest", title: "MAX SIGNAL", kind: "function", difficulty: 2, xp: 180,
          brief: "Find the longest call sign.",
          prompt: "Define **longest(words)** that uses **max_by** to return the **string** with the most characters. If two tie, returning the first one is fine. Assume the array is never empty.\n~~~ruby\nlongest([\"go\", \"ruby\", \"kernel\"])  # \"kernel\"\n~~~",
          starter: "def longest(words)\n  # TODO: max_by length\n  words.first\nend\n",
          solution: "def longest(words)\n  words.max_by { |w| w.length }\nend\n",
          tests: [
          { name: "picks longest", code: "assert_equal(longest([\"go\", \"ruby\", \"kernel\"]), \"kernel\")" },
          { name: "single element", code: "assert_equal(longest([\"solo\"]), \"solo\")" },
          { name: "returns the element not its length", code: "assert_equal(longest([\"ab\", \"cde\"]), \"cde\")" }
          ],
          hint: "words.max_by { |w| w.length }", lore: "The loudest broadcast wins the channel."
        },
        {
          id: "rb-rank", title: "RANK BY BPM", kind: "function", difficulty: 3, xp: 210,
          brief: "Order tracks slowest to fastest.",
          prompt: "**tracks** is an array of hashes like **{ name: \"Spice\", bpm: 128 }**. Define **ranked_names(tracks)** returning an array of the **names** sorted by **bpm** ascending. Use **sort_by** then **map**.\n~~~ruby\nranked_names([{ name: \"Fast\", bpm: 140 }, { name: \"Slow\", bpm: 90 }])  # [\"Slow\", \"Fast\"]\n~~~",
          starter: "def ranked_names(tracks)\n  # TODO: sort_by bpm, then map names\n  tracks.map { |t| t[:name] }\nend\n",
          solution: "def ranked_names(tracks)\n  tracks.sort_by { |t| t[:bpm] }.map { |t| t[:name] }\nend\n",
          tests: [
          { name: "sorts by bpm", code: "data = [{ name: \"Fast\", bpm: 140 }, { name: \"Slow\", bpm: 90 }, { name: \"Mid\", bpm: 120 }]\nassert_equal(ranked_names(data), [\"Slow\", \"Mid\", \"Fast\"])" },
          { name: "empty -> empty", code: "assert_equal(ranked_names([]), [])" },
          { name: "already sorted stays sorted", code: "assert_equal(ranked_names([{ name: \"A\", bpm: 1 }, { name: \"B\", bpm: 2 }]), [\"A\", \"B\"])" }
          ],
          hint: "tracks.sort_by { |t| t[:bpm] }.map { |t| t[:name] }", lore: "Line them up by tempo before the set."
        },
        {
          id: "rb-hunt", title: "FIRST HIT", kind: "function", difficulty: 3, xp: 210,
          brief: "Find the first threshold breach.",
          prompt: "Define **first_over(nums, limit)** that uses **find** (a.k.a. detect) to return the **first** number strictly greater than **limit**. Return **nil** if none qualify.\n~~~ruby\nfirst_over([1, 5, 8, 2], 4)  # 5\nfirst_over([1, 2], 9)        # nil\n~~~",
          starter: "def first_over(nums, limit)\n  # TODO: find the first number over the limit\n  nums.first\nend\n",
          solution: "def first_over(nums, limit)\n  nums.find { |n| n > limit }\nend\n",
          tests: [
          { name: "returns first match", code: "assert_equal(first_over([1, 5, 8, 2], 4), 5)" },
          { name: "no match -> nil", code: "assert_equal(first_over([1, 2, 3], 9), nil)" },
          { name: "stops at first not biggest", code: "assert_equal(first_over([10, 20], 5), 10)" }
          ],
          hint: "nums.find { |n| n > limit }", lore: "Lock on the first heat signature."
        },
        {
          id: "rb-stats", title: "SQUAD REPORT", kind: "function", difficulty: 3, xp: 240,
          brief: "Summarise the active runners.",
          prompt: "**units** is an array of hashes like **{ name: \"Trin\", hp: 80, online: true }**. Define **report(units)** returning a **hash** with three keys:\n- **:online** — how many units have `online: true` (use **count**)\n- **:total_hp** — the sum of `hp` across the online units only (use **select** then **reduce** or **sum**)\n- **:strongest** — the **name** of the online unit with the highest hp (use **max_by**)\n\nAssume at least one unit is online.\n~~~ruby\nreport([{ name: \"Trin\", hp: 80, online: true }, { name: \"Dozer\", hp: 50, online: false }])\n# { online: 1, total_hp: 80, strongest: \"Trin\" }\n~~~",
          starter: "def report(units)\n  # TODO: count online, sum their hp, find strongest by hp\n  { online: 0, total_hp: 0, strongest: nil }\nend\n",
          solution: "def report(units)\n  live = units.select { |u| u[:online] }\n  {\n    online: live.count,\n    total_hp: live.reduce(0) { |sum, u| sum + u[:hp] },\n    strongest: live.max_by { |u| u[:hp] }[:name],\n  }\nend\n",
          tests: [
          { name: "full report", code: "data = [{ name: \"Trin\", hp: 80, online: true }, { name: \"Dozer\", hp: 50, online: false }, { name: \"Neo\", hp: 95, online: true }]\nassert_equal(report(data), { online: 2, total_hp: 175, strongest: \"Neo\" })" },
          { name: "ignores offline in hp + strongest", code: "data = [{ name: \"A\", hp: 10, online: true }, { name: \"B\", hp: 999, online: false }]\nassert_equal(report(data), { online: 1, total_hp: 10, strongest: \"A\" })" },
          { name: "strongest is the online max", code: "data = [{ name: \"Lo\", hp: 30, online: true }, { name: \"Hi\", hp: 70, online: true }]\nr = report(data)\nassert_equal(r[:strongest], \"Hi\")\nassert_equal(r[:online], 2)" }
          ],
          hint: "live = units.select { |u| u[:online] }; then count, reduce hp, and max_by hp on live.", lore: "Only the jacked-in count toward the run."
        }
        ],
      },
      {
        id: "rbm06-control", code: "0x06", title: "CONTROL & RANGES",
        subtitle: "if/unless · case · ranges · times · while",
        theory: "## Branching: if / unless\nRuby chooses a path with **if**. The opposite of `if` is **unless** — it runs when the condition is **false**. Both end with **end**.\n~~~ruby\nif power > 50\n  \"online\"\nelsif power > 0\n  \"low\"\nelse\n  \"dead\"\nend\n~~~\nBecause `if` is an **expression**, the whole block has a value — you can return it or assign it:\n~~~ruby\nstatus = if power > 0 then \"on\" else \"off\" end\n~~~\n\n## case / when\nWhen you compare one value against many options, **case** is cleaner than a stack of `elsif`. Each **when** can list several values.\n~~~ruby\ncase code\nwhen 200 then \"ok\"\nwhen 404 then \"missing\"\nwhen 500, 502, 503 then \"server down\"\nelse \"unknown\"\nend\n~~~\n\n## Ranges: 1..n and 1...n\nA **range** is a span of values. Two dots **1..5** is *inclusive* (1,2,3,4,5). Three dots **1...5** is *exclusive* — it stops one short (1,2,3,4). Turn one into an array with **.to_a**.\n~~~ruby\n(1..5).to_a    # [1, 2, 3, 4, 5]\n(1...5).to_a   # [1, 2, 3, 4]\n(1..5).include?(5)   # true\n(1...5).include?(5)  # false\n~~~\n\n> INTEL — Count the dots. Two dots reaches the end; three dots leaves it behind. The classic off-by-one bug is using `...` when you meant `..`.\n\n## Looping without a counter: times / upto / while\nYou rarely write a manual counter in Ruby. **n.times** runs a block n times (with index 0..n-1). **a.upto(b)** counts from a up to b inclusive. **while** repeats as long as a condition holds.\n~~~ruby\nsum = 0\n3.times { |i| sum += i }   # i = 0,1,2  -> sum 3\n\ntotal = 0\n1.upto(4) { |n| total += n }  # 1+2+3+4 -> 10\n\nn = 10\nwhile n > 1\n  n = n / 2\nend\n~~~\n\n> WARNING — `3.times` gives you indexes **0, 1, 2** — not 1, 2, 3. If you need 1..3, use `1.upto(3)` instead.\n\n## The ternary: cond ? a : b\nA one-line `if/else`. Read it as \"condition? then a, else b\".\n~~~ruby\nlabel = score >= 60 ? \"pass\" : \"fail\"\n~~~\n\n## Guard clauses: return early\nRather than wrapping the whole method in a big `if`, **bail out early** with a one-line guard. `return value if condition` reads left-to-right and keeps the happy path un-indented.\n~~~ruby\ndef reciprocal(x)\n  return 0 if x == 0\n  1.0 / x\nend\n~~~\n\n> INTEL — `return x if cond` and `puts x unless cond` are *statement modifiers*: the action comes first, the condition trails. They only make sense for a single line.\n",
        exercises: [
        {
          id: "rb-clamp-zero", title: "GROUND THE SIGNAL", kind: "function", difficulty: 1, xp: 120,
          brief: "Negatives become zero.",
          prompt: "Define a method **clamp_zero(n)** that returns `n` when it is zero or positive, but returns **0** when `n` is negative.\n~~~ruby\nclamp_zero(7)   # 7\nclamp_zero(-3)  # 0\n~~~",
          starter: "def clamp_zero(n)\n  # TODO: negatives should become 0\n  n\nend\n",
          solution: "def clamp_zero(n)\n  if n < 0\n    0\n  else\n    n\n  end\nend\n",
          tests: [
          { name: "positive passes through", code: "assert_equal(clamp_zero(7), 7)" },
          { name: "negative becomes zero", code: "assert_equal(clamp_zero(-3), 0)" },
          { name: "zero stays zero", code: "assert_equal(clamp_zero(0), 0)" }
          ],
          hint: "if n < 0 then 0 else n.", lore: "Drain the negative voltage to earth."
        },
        {
          id: "rb-access-check", title: "ACCESS GATE", kind: "function", difficulty: 1, xp: 120,
          brief: "Deny unless cleared.",
          prompt: "Define **access(level)** that returns `\"GRANTED\"` only when `level` is **5 or higher**, otherwise `\"DENIED\"`. Use **unless** (deny *unless* the level is high enough) or a normal if — your call.\n~~~ruby\naccess(5)  # \"GRANTED\"\naccess(2)  # \"DENIED\"\n~~~",
          starter: "def access(level)\n  # TODO\n  \"GRANTED\"\nend\n",
          solution: "def access(level)\n  return \"DENIED\" unless level >= 5\n  \"GRANTED\"\nend\n",
          tests: [
          { name: "level 5 is granted", code: "assert_equal(access(5), \"GRANTED\")" },
          { name: "level 9 is granted", code: "assert_equal(access(9), \"GRANTED\")" },
          { name: "level 2 is denied", code: "assert_equal(access(2), \"DENIED\")" },
          { name: "level 4 is denied", code: "assert_equal(access(4), \"DENIED\")" }
          ],
          hint: "return \"DENIED\" unless level >= 5", lore: "Clearance five. No exceptions, runner."
        },
        {
          id: "rb-status-code", title: "STATUS DECODER", kind: "function", difficulty: 2, xp: 120,
          brief: "Map codes to words.",
          prompt: "Define **status_text(code)** using **case ... when** that returns:\n- `\"OK\"` for **200**\n- `\"NOT FOUND\"` for **404**\n- `\"SERVER ERROR\"` for **500, 502 or 503**\n- `\"UNKNOWN\"` for anything else\n~~~ruby\nstatus_text(502)  # \"SERVER ERROR\"\n~~~",
          starter: "def status_text(code)\n  case code\n  when 200 then \"OK\"\n  # TODO: handle 404 and the server errors\n  else \"UNKNOWN\"\n  end\nend\n",
          solution: "def status_text(code)\n  case code\n  when 200 then \"OK\"\n  when 404 then \"NOT FOUND\"\n  when 500, 502, 503 then \"SERVER ERROR\"\n  else \"UNKNOWN\"\n  end\nend\n",
          tests: [
          { name: "200 is OK", code: "assert_equal(status_text(200), \"OK\")" },
          { name: "404 is not found", code: "assert_equal(status_text(404), \"NOT FOUND\")" },
          { name: "502 is a server error", code: "assert_equal(status_text(502), \"SERVER ERROR\")" },
          { name: "503 is a server error", code: "assert_equal(status_text(503), \"SERVER ERROR\")" },
          { name: "418 is unknown", code: "assert_equal(status_text(418), \"UNKNOWN\")" }
          ],
          hint: "when 500, 502, 503 then \"SERVER ERROR\"", lore: "The relay answers in numbers. Translate."
        },
        {
          id: "rb-range-sum", title: "RANGE TOTAL", kind: "function", difficulty: 2, xp: 120,
          brief: "Sum 1 up to n.",
          prompt: "Define **range_sum(n)** that returns the sum of every integer from **1 to n inclusive**. Build the inclusive range with **(1..n)** and use **.sum**.\n~~~ruby\nrange_sum(5)  # 15  (1+2+3+4+5)\n~~~",
          starter: "def range_sum(n)\n  # TODO: sum 1..n inclusive (watch the dots!)\n  (1...n).sum\nend\n",
          solution: "def range_sum(n)\n  (1..n).sum\nend\n",
          tests: [
          { name: "1..5 sums to 15", code: "assert_equal(range_sum(5), 15)" },
          { name: "1..1 is 1", code: "assert_equal(range_sum(1), 1)" },
          { name: "1..10 sums to 55", code: "assert_equal(range_sum(10), 55)" }
          ],
          hint: "Two dots includes n: (1..n).sum", lore: "Tally every node on the bus."
        },
        {
          id: "rb-countdown", title: "LAUNCH COUNTDOWN", kind: "function", difficulty: 2, xp: 120,
          brief: "n down to 1, then LIFTOFF.",
          prompt: "Define **countdown(n)** that returns an **array** counting down from `n` to `1`, with the string `\"LIFTOFF\"` appended at the end. Use **n.downto(1)** to collect the numbers.\n~~~ruby\ncountdown(3)  # [3, 2, 1, \"LIFTOFF\"]\n~~~",
          starter: "def countdown(n)\n  out = []\n  # TODO: push n, n-1, ... 1 then \"LIFTOFF\"\n  out\nend\n",
          solution: "def countdown(n)\n  out = []\n  n.downto(1) { |i| out << i }\n  out << \"LIFTOFF\"\n  out\nend\n",
          tests: [
          { name: "counts 3,2,1 then liftoff", code: "assert_equal(countdown(3), [3, 2, 1, \"LIFTOFF\"])" },
          { name: "single step", code: "assert_equal(countdown(1), [1, \"LIFTOFF\"])" },
          { name: "longer count", code: "assert_equal(countdown(5), [5, 4, 3, 2, 1, \"LIFTOFF\"])" }
          ],
          hint: "n.downto(1) { |i| out << i }, then out << \"LIFTOFF\".", lore: "Ignition sequence start."
        },
        {
          id: "rb-grade-tag", title: "VERDICT", kind: "function", difficulty: 3, xp: 120,
          brief: "Pass or fail in one line.",
          prompt: "Define **verdict(score)** that returns `\"PASS\"` when `score` is **60 or more**, otherwise `\"FAIL\"`. Write it as a **single ternary expression**: `cond ? a : b`.\n~~~ruby\nverdict(72)  # \"PASS\"\nverdict(40)  # \"FAIL\"\n~~~",
          starter: "def verdict(score)\n  # TODO: use the ternary  cond ? \"PASS\" : \"FAIL\"\n  \"FAIL\"\nend\n",
          solution: "def verdict(score)\n  score >= 60 ? \"PASS\" : \"FAIL\"\nend\n",
          tests: [
          { name: "60 exactly passes", code: "assert_equal(verdict(60), \"PASS\")" },
          { name: "high score passes", code: "assert_equal(verdict(99), \"PASS\")" },
          { name: "below threshold fails", code: "assert_equal(verdict(59), \"FAIL\")" },
          { name: "zero fails", code: "assert_equal(verdict(0), \"FAIL\")" }
          ],
          hint: "score >= 60 ? \"PASS\" : \"FAIL\"", lore: "The tribunal decides in a single breath."
        },
        {
          id: "rb-halving-steps", title: "HALVING PROTOCOL", kind: "function", difficulty: 3, xp: 120,
          brief: "Count halvings to reach 1.",
          prompt: "Define **halving_steps(n)** that repeatedly does integer-division by 2 until `n` reaches **1**, and returns **how many halvings** it took. Use a **while** loop. Assume `n >= 1`.\n~~~ruby\nhalving_steps(8)  # 3   (8 -> 4 -> 2 -> 1)\nhalving_steps(1)  # 0\n~~~",
          starter: "def halving_steps(n)\n  steps = 0\n  # TODO: while n > 1, halve n and count\n  steps\nend\n",
          solution: "def halving_steps(n)\n  steps = 0\n  while n > 1\n    n = n / 2\n    steps += 1\n  end\n  steps\nend\n",
          tests: [
          { name: "8 takes 3 steps", code: "assert_equal(halving_steps(8), 3)" },
          { name: "1 takes no steps", code: "assert_equal(halving_steps(1), 0)" },
          { name: "10 takes 3 steps", code: "assert_equal(halving_steps(10), 3)" },
          { name: "1024 takes 10 steps", code: "assert_equal(halving_steps(1024), 10)" }
          ],
          hint: "while n > 1: n = n / 2; steps += 1.", lore: "Fold the signal in half until only the seed remains."
        },
        {
          id: "rb-fizz-pulse", title: "PULSE GRID", kind: "function", difficulty: 3, xp: 120,
          brief: "Build a 1..n FizzBuzz-style grid.",
          prompt: "Define **pulse_grid(n)** returning an **array** of length `n`. For each number from **1 to n inclusive**, the entry is:\n- `\"FIZZBUZZ\"` if divisible by both 3 and 5\n- `\"FIZZ\"` if divisible by 3\n- `\"BUZZ\"` if divisible by 5\n- otherwise the **number itself**\n\nUse **1.upto(n)** (or **(1..n)**) and check the both-case first.\n~~~ruby\npulse_grid(5)  # [1, 2, \"FIZZ\", 4, \"BUZZ\"]\n~~~",
          starter: "def pulse_grid(n)\n  out = []\n  1.upto(n) do |i|\n    # TODO: FIZZBUZZ / FIZZ / BUZZ / i\n    out << i\n  end\n  out\nend\n",
          solution: "def pulse_grid(n)\n  out = []\n  1.upto(n) do |i|\n    if i % 3 == 0 && i % 5 == 0\n      out << \"FIZZBUZZ\"\n    elsif i % 3 == 0\n      out << \"FIZZ\"\n    elsif i % 5 == 0\n      out << \"BUZZ\"\n    else\n      out << i\n    end\n  end\n  out\nend\n",
          tests: [
          { name: "first five", code: "assert_equal(pulse_grid(5), [1, 2, \"FIZZ\", 4, \"BUZZ\"])" },
          { name: "length matches n", code: "assert_equal(pulse_grid(15).length, 15)" },
          { name: "15 is fizzbuzz", code: "assert_equal(pulse_grid(15)[14], \"FIZZBUZZ\")" },
          { name: "starts at 1, not 0", code: "assert_equal(pulse_grid(3)[0], 1)" }
          ],
          hint: "Test i % 3 == 0 && i % 5 == 0 BEFORE the single checks.", lore: "Every third beat flares. Every fifth one howls."
        }
        ],
      },
      {
        id: "rbm07-regex", code: "0x07", title: "REGEX & TEXT",
        subtitle: "gsub · scan · match? · split · format",
        theory: "## Patterns in the noise\nText is the wire format of the net. Ruby gives you a clean toolkit for slicing, matching and rebuilding it. A **regex** (regular expression) is a pattern written between slashes: `/cat/` matches the letters c-a-t anywhere in a string.\n\n## Search: match? and =~\n**match?** asks a yes/no question and returns **true** or **false** — fast and clean.\n~~~ruby\n\"NEON-7\".match?(/[0-9]/)   # true  (contains a digit)\n\"abc\".match?(/[0-9]/)      # false\n~~~\nThe older **=~** operator returns the *index* of the first match, or **nil** if there is none. Because nil is falsy, it also works in an `if`.\n~~~ruby\n\"abc7\" =~ /[0-9]/   # 3   (digit is at index 3)\n\"abc\"  =~ /[0-9]/   # nil\n~~~\n\n> INTEL — Reach for **match?** when you only need true/false. It is faster and reads like plain English.\n\n## Replace: gsub and sub\n**gsub** replaces *every* match; **sub** replaces only the *first*. Both **return a new string** — the original is untouched.\n~~~ruby\n\"a-b-c\".gsub(\"-\", \"_\")   # \"a_b_c\"   (all)\n\"a-b-c\".sub(\"-\", \"_\")    # \"a_b-c\"   (first only)\n\"r2d2\".gsub(/[0-9]/, \"#\") # \"r#d#\"   (regex)\n~~~\n\n> WARNING — gsub does NOT change the string in place; it hands you a fresh one. `s.gsub(\"x\",\"y\")` alone does nothing useful — you must keep the result: `s = s.gsub(\"x\",\"y\")`. (The bang versions `gsub!`/`sub!` mutate, but for now prefer returning a new value.)\n\n## Collect: scan\n**scan** walks the whole string and returns an **array** of every match.\n~~~ruby\n\"a1 b2 c3\".scan(/[0-9]/)   # [\"1\", \"2\", \"3\"]\n\"id-42 id-99\".scan(/[0-9]+/) # [\"42\", \"99\"]  (+ means one or more)\n~~~\n\n## Break apart & rejoin: split and join\n**split** cuts a string into an array on a separator; **join** glues an array back into a string.\n~~~ruby\n\"red,green,blue\".split(\",\")   # [\"red\", \"green\", \"blue\"]\n[\"a\", \"b\", \"c\"].join(\"-\")      # \"a-b-c\"\n~~~\n\n## Tidy the edges: strip\n**strip** returns a copy with leading and trailing whitespace removed (it does NOT touch spaces in the middle).\n~~~ruby\n\"  hello  \".strip   # \"hello\"\n~~~\n\n## Templates: format and %\nBuild a string from a template with **format(...)** (or its twin, the **%** operator). `%s` inserts a string, `%d` an integer, `%05d` pads an integer to width 5 with zeros.\n~~~ruby\nformat(\"USER %s :: LVL %d\", \"Neo\", 7)   # \"USER Neo :: LVL 7\"\n\"ID-%05d\" % 42                          # \"ID-00042\"\n~~~\n\n## Quick checks: start_with? and include?\n**start_with?** tests the beginning; **include?** tests anywhere inside.\n~~~ruby\n\"NEON-CITY\".start_with?(\"NEON\")  # true\n\"NEON-CITY\".include?(\"CITY\")     # true\n~~~\n\n> INTEL — These predicate methods end in **?** and return true/false. That trailing `?` is just part of the name in Ruby.",
        exercises: [
        {
          id: "rb-scrub", title: "SCRUB STATIC", kind: "function", difficulty: 1, xp: 120,
          brief: "Replace every dash with a space.",
          prompt: "Define a method **scrub(text)** that returns a new string with **every** dash `-` replaced by a single space. Use **gsub**.\n~~~ruby\nscrub(\"de-tox-now\")  # \"de tox now\"\n~~~",
          starter: "def scrub(text)\n  # TODO: gsub every dash to a space\n  text\nend\n",
          solution: "def scrub(text)\n  text.gsub(\"-\", \" \")\nend\n",
          tests: [
          { name: "replaces all dashes", code: "assert_equal(scrub(\"de-tox-now\"), \"de tox now\")" },
          { name: "no dash, no change", code: "assert_equal(scrub(\"clean\"), \"clean\")" },
          { name: "returns a new string, original untouched", code: "s = \"a-b\"\nassert_equal(scrub(s), \"a b\")\nassert_equal(s, \"a-b\", \"gsub returns a copy; do not mutate the input\")" }
          ],
          hint: "text.gsub(\"-\", \" \") returns a fresh string.", lore: "Clean the line before you jack in."
        },
        {
          id: "rb-hasdigit", title: "DIGIT SCAN", kind: "function", difficulty: 1, xp: 120,
          brief: "True if the code contains any digit.",
          prompt: "Define a method **has_digit?(code)** that returns **true** if the string contains at least one digit (0-9), otherwise **false**. Use **match?** with the regex `/[0-9]/`.\n~~~ruby\nhas_digit?(\"NEON7\")  # true\nhas_digit?(\"NEON\")   # false\n~~~",
          starter: "def has_digit?(code)\n  # TODO: use match? with /[0-9]/\n  false\nend\n",
          solution: "def has_digit?(code)\n  code.match?(/[0-9]/)\nend\n",
          tests: [
          { name: "digit present -> true", code: "assert_equal(has_digit?(\"NEON7\"), true)" },
          { name: "no digit -> false", code: "assert_equal(has_digit?(\"NEON\"), false)" },
          { name: "digit anywhere counts", code: "assert_equal(has_digit?(\"4ever\"), true)" }
          ],
          hint: "code.match?(/[0-9]/) is already true or false.", lore: "Numbers hide in the signal."
        },
        {
          id: "rb-firsthit", title: "FIRST HIT", kind: "function", difficulty: 2, xp: 140,
          brief: "Index of the first digit, or -1.",
          prompt: "Define a method **first_digit_index(code)** that returns the **index** of the first digit using the **=~** operator with `/[0-9]/`. If there is no digit, `=~` gives **nil** — return **-1** in that case.\n~~~ruby\nfirst_digit_index(\"abc7\")  # 3\nfirst_digit_index(\"abc\")   # -1\n~~~",
          starter: "def first_digit_index(code)\n  # TODO: use =~ , handle the nil case\n  0\nend\n",
          solution: "def first_digit_index(code)\n  (code =~ /[0-9]/) || -1\nend\n",
          tests: [
          { name: "digit at index 3", code: "assert_equal(first_digit_index(\"abc7\"), 3)" },
          { name: "digit at index 0", code: "assert_equal(first_digit_index(\"9lives\"), 0)" },
          { name: "no digit -> -1", code: "assert_equal(first_digit_index(\"abc\"), -1)" }
          ],
          hint: "(code =~ /[0-9]/) || -1  — nil is falsy, so || gives the fallback.", lore: "Where does the corruption begin?"
        },
        {
          id: "rb-harvest", title: "HARVEST CODES", kind: "function", difficulty: 2, xp: 140,
          brief: "Collect every run of digits.",
          prompt: "Define a method **harvest(text)** that returns an **array of every number** found in the string, each as a string. Use **scan** with `/[0-9]+/` (the `+` means one or more digits in a row).\n~~~ruby\nharvest(\"id-42 port-99\")  # [\"42\", \"99\"]\nharvest(\"no codes\")       # []\n~~~",
          starter: "def harvest(text)\n  # TODO: scan for runs of digits\n  []\nend\n",
          solution: "def harvest(text)\n  text.scan(/[0-9]+/)\nend\n",
          tests: [
          { name: "two codes", code: "assert_equal(harvest(\"id-42 port-99\"), [\"42\", \"99\"])" },
          { name: "multi-digit stays whole", code: "assert_equal(harvest(\"v1024\"), [\"1024\"])" },
          { name: "none found -> empty array", code: "assert_equal(harvest(\"no codes\"), [])" }
          ],
          hint: "text.scan(/[0-9]+/) returns an array of matches.", lore: "Strip the codes from the data stream."
        },
        {
          id: "rb-rejoin", title: "RE-ROUTE", kind: "function", difficulty: 2, xp: 140,
          brief: "Split on commas, rejoin with arrows.",
          prompt: "Define a method **reroute(path)** that **splits** the string on commas, then **joins** the pieces with ` -> ` (space, arrow, space).\n~~~ruby\nreroute(\"node1,node2,node3\")  # \"node1 -> node2 -> node3\"\n~~~",
          starter: "def reroute(path)\n  # TODO: split on \",\" then join with \" -> \"\n  path\nend\n",
          solution: "def reroute(path)\n  path.split(\",\").join(\" -> \")\nend\n",
          tests: [
          { name: "three nodes", code: "assert_equal(reroute(\"node1,node2,node3\"), \"node1 -> node2 -> node3\")" },
          { name: "single node unchanged", code: "assert_equal(reroute(\"solo\"), \"solo\")" },
          { name: "two nodes", code: "assert_equal(reroute(\"a,b\"), \"a -> b\")" }
          ],
          hint: "path.split(\",\").join(\" -> \")", lore: "Lay a new route through the grid."
        },
        {
          id: "rb-badge", title: "ID BADGE", kind: "function", difficulty: 3, xp: 160,
          brief: "Format a zero-padded badge string.",
          prompt: "Define a method **badge(name, level)** that returns a string in the form `NAME-LVL` where the level is **zero-padded to 3 digits**. Use **format** with `%s` and `%03d`.\n~~~ruby\nbadge(\"Neo\", 7)    # \"Neo-007\"\nbadge(\"Trinity\", 42) # \"Trinity-042\"\n~~~",
          starter: "def badge(name, level)\n  # TODO: format with %s and %03d\n  \"#{name}-#{level}\"\nend\n",
          solution: "def badge(name, level)\n  format(\"%s-%03d\", name, level)\nend\n",
          tests: [
          { name: "pads to 3 digits", code: "assert_equal(badge(\"Neo\", 7), \"Neo-007\")" },
          { name: "two-digit level", code: "assert_equal(badge(\"Trinity\", 42), \"Trinity-042\")" },
          { name: "three-digit level unpadded", code: "assert_equal(badge(\"Morpheus\", 128), \"Morpheus-128\")" }
          ],
          hint: "format(\"%s-%03d\", name, level) — %03d pads with zeros to width 3.", lore: "Every operative needs a number."
        },
        {
          id: "rb-trim", title: "TRIM THE EDGES", kind: "function", difficulty: 3, xp: 160,
          brief: "Strip ends, then test the prefix.",
          prompt: "Define a method **valid_command?(line)** that first **strips** leading/trailing whitespace, then returns **true** only if the cleaned text **starts with** `\"CMD:\"`. Use **strip** and **start_with?**.\n~~~ruby\nvalid_command?(\"  CMD: run  \")  # true\nvalid_command?(\"run CMD:\")      # false\n~~~",
          starter: "def valid_command?(line)\n  # TODO: strip, then check start_with?(\"CMD:\")\n  false\nend\n",
          solution: "def valid_command?(line)\n  line.strip.start_with?(\"CMD:\")\nend\n",
          tests: [
          { name: "padded but valid", code: "assert_equal(valid_command?(\"  CMD: run  \"), true)" },
          { name: "prefix not at start", code: "assert_equal(valid_command?(\"run CMD:\"), false)" },
          { name: "tabs and newlines stripped too", code: "assert_equal(valid_command?(\"\\n\\tCMD: halt\"), true)" }
          ],
          hint: "line.strip.start_with?(\"CMD:\") — strip first, then test.", lore: "Trim the noise before you trust the order."
        },
        {
          id: "rb-redact", title: "REDACT", kind: "function", difficulty: 3, xp: 160,
          brief: "Mask every digit with a hash.",
          prompt: "Define a method **redact(text)** that returns a new string where **every digit** is replaced by `#`, but only **if** the text contains the substring `\"SECRET\"`. If `\"SECRET\"` is not present (use **include?**), return the text unchanged. Use **gsub** with `/[0-9]/` for the masking.\n~~~ruby\nredact(\"SECRET pin 4827\")  # \"SECRET pin ####\"\nredact(\"public 4827\")      # \"public 4827\"\n~~~",
          starter: "def redact(text)\n  # TODO: if it includes \"SECRET\", gsub digits to #\n  text\nend\n",
          solution: "def redact(text)\n  if text.include?(\"SECRET\")\n    text.gsub(/[0-9]/, \"#\")\n  else\n    text\n  end\nend\n",
          tests: [
          { name: "secret -> digits masked", code: "assert_equal(redact(\"SECRET pin 4827\"), \"SECRET pin ####\")" },
          { name: "not secret -> untouched", code: "assert_equal(redact(\"public 4827\"), \"public 4827\")" },
          { name: "secret but no digits", code: "assert_equal(redact(\"SECRET clear\"), \"SECRET clear\")" }
          ],
          hint: "if text.include?(\"SECRET\") then text.gsub(/[0-9]/, \"#\") else text end", lore: "What they cannot read, they cannot steal."
        }
        ],
      },
      {
        id: "rbm08-oop", code: "0x08", title: "CLASSES & OOP II",
        subtitle: "attr_accessor · state · methods · to_s",
        theory: "## Objects that REMEMBER\n\nIn sector 0x03 you built your first class. Now we go deeper: objects that carry **state** — data that lives *inside* the object and changes over time. A bank account remembers its balance. A stack remembers what you pushed onto it. The object is a little machine that holds memory between calls.\n\nState lives in **instance variables** — names that start with `@`. Each object gets its own copy.\n\n~~~ruby\nclass Drone\n  def initialize\n    @energy = 100   # this drone's private store\n  end\nend\n~~~\n\nEvery `Drone.new` has its *own* `@energy`. Two drones never share it.\n\n> INTEL — `@energy` is invisible from outside the object. You cannot write `drone.@energy`. The only way in or out is through **methods** you define. That is the whole point of OOP: the object guards its own data.\n\n## Letting the world read and write: attr_*\n\nWriting a getter method by hand is tedious:\n\n~~~ruby\nclass Drone\n  def energy        # getter\n    @energy\n  end\n  def energy=(v)    # setter\n    @energy = v\n  end\nend\n~~~\n\nRuby generates these for you. Put one line near the top of the class:\n\n- **`attr_reader :energy`** — makes a getter. You can `drone.energy` (read only).\n- **`attr_writer :energy`** — makes a setter. You can `drone.energy = 50` (write only).\n- **`attr_accessor :energy`** — makes BOTH. Read and write.\n\n~~~ruby\nclass Drone\n  attr_accessor :energy\n  def initialize\n    @energy = 100\n  end\nend\n\nd = Drone.new\nd.energy          # 100   (reader)\nd.energy = 60     # sets @energy\nd.energy          # 60\n~~~\n\nNote the symbol: `attr_accessor :energy` — a colon name, not a string, and NOT `@energy`. It names the *attribute*; Ruby wires it to the matching `@energy` behind the scenes.\n\n> WARNING — A classic beginner mix-up: `attr_accessor :energy` vs `attr_accessor \"energy\"` vs `attr_accessor @energy`. Use the **symbol** `:energy`. Strings and `@`-names will not give you the accessor you want.\n\n## Methods that CHANGE state\n\nMost interesting methods don't just read — they *mutate*. They reach into `@vars`, change them, and the object remembers the new value for next time.\n\n~~~ruby\nclass Counter\n  attr_reader :count\n  def initialize\n    @count = 0\n  end\n  def tick\n    @count += 1     # mutate the stored state\n    @count          # return the new value\n  end\nend\n\nc = Counter.new\nc.tick   # 1\nc.tick   # 2\nc.count  # 2  — it stuck\n~~~\n\nThe difference between **mutating** and **returning** trips up newcomers. `@count += 1` *changes* the object. The last line `@count` is what the method *hands back*. They are two separate jobs. A method can mutate and also return — but be deliberate about which value comes out.\n\n> INTEL — The LAST expression in a method is its return value (no `return` keyword needed). If you want `tick` to return the new count, make `@count` the last line. If the last line were `puts @count`, the method would return `nil`, because `puts` returns `nil` — a very common surprise.\n\n## Guards: refusing bad operations\n\nA good stateful object protects its invariants. An account should refuse to go overdrawn. A stack should refuse to pop when empty. You enforce this with a **guard** — a check at the top of the method.\n\n~~~ruby\nclass Account\n  attr_reader :balance\n  def initialize(start = 0)\n    @balance = start\n  end\n\n  def deposit(n)\n    @balance += n\n    @balance\n  end\n\n  def withdraw(n)\n    return false if n > @balance   # GUARD: refuse overdraft\n    @balance -= n\n    @balance\n  end\nend\n~~~\n\nHere `withdraw` returns `false` and changes nothing when the money isn't there. Sometimes you instead want to **raise an error** for a truly illegal move:\n\n~~~ruby\ndef pop\n  raise \"stack empty\" if @items.empty?   # explode loudly\n  @items.pop\nend\n~~~\n\n`raise \"message\"` stops the method and signals a failure the caller must handle. Tests can check for this with `assert_raises { ... }`.\n\n> WARNING — `raise` aborts the method immediately. Put your guard FIRST, before you mutate anything, so a rejected call leaves the object untouched.\n\n## A friendly face: to_s\n\nWhen you `puts` an object or interpolate it into a string, Ruby calls its **`to_s`** method. The default is ugly (`#<Account:0x000...>`). Define your own to give the object a readable form:\n\n~~~ruby\nclass Account\n  def initialize(name, balance)\n    @name = name\n    @balance = balance\n  end\n  def to_s\n    \"#{@name}: #{@balance} credits\"\n  end\nend\n\nputs Account.new(\"Trinity\", 500)   # => Trinity: 500 credits\n\"Balance — #{Account.new(\"Neo\", 9)}\"  # => \"Balance — Neo: 9 credits\"\n~~~\n\n`to_s` must **return** the string (last expression), not `puts` it. If you `puts` inside `to_s`, you print early and return `nil`, and the interpolation shows blank.\n\n> INTEL — String interpolation `\"#{obj}\"` automatically calls `obj.to_s`. Define `to_s` once and your object reads nicely everywhere.\n\nYou now have the full kit: `@state`, `attr_*` accessors, mutating methods, guards, and `to_s`. Build objects that remember, defend themselves, and explain who they are.",
        exercises: [
        {
          id: "rb-vault", title: "THE VAULT", kind: "function", difficulty: 1, xp: 120,
          brief: "Expose stored credits with attr_reader.",
          prompt: "Define a class **Vault**.\n\n- **initialize(credits)** stores the amount in `@credits`\n- expose it with **attr_reader :credits** so the world can read `v.credits`\n\n~~~ruby\nv = Vault.new(500)\nv.credits   # 500\n~~~",
          starter: "class Vault\n  # TODO: attr_reader + initialize\n  def initialize(credits)\n    @credits = 0\n  end\nend\n",
          solution: "class Vault\n  attr_reader :credits\n  def initialize(credits)\n    @credits = credits\n  end\nend\n",
          tests: [
          { name: "stores the credits", code: "v = Vault.new(500)\nassert_equal(v.credits, 500)" },
          { name: "another value", code: "v = Vault.new(42)\nassert_equal(v.credits, 42)" },
          { name: "reader exposes it", code: "v = Vault.new(7)\nassert(v.respond_to?(:credits), \"need attr_reader :credits\")" }
          ],
          hint: "attr_reader :credits at the top, and store the argument: @credits = credits.", lore: "The vault remembers every credit. It never forgets a debt."
        },
        {
          id: "rb-handle", title: "CALL SIGN", kind: "function", difficulty: 1, xp: 120,
          brief: "A read/write attribute with attr_accessor.",
          prompt: "Define a class **Operator**.\n\n- **initialize(handle)** stores the handle in `@handle`\n- use **attr_accessor :handle** so the handle can be both READ and CHANGED from outside\n\n~~~ruby\no = Operator.new(\"Neo\")\no.handle          # \"Neo\"\no.handle = \"The One\"\no.handle          # \"The One\"\n~~~",
          starter: "class Operator\n  attr_reader :handle   # TODO: needs to be writable too\n  def initialize(handle)\n    @handle = handle\n  end\nend\n",
          solution: "class Operator\n  attr_accessor :handle\n  def initialize(handle)\n    @handle = handle\n  end\nend\n",
          tests: [
          { name: "reads the handle", code: "o = Operator.new(\"Neo\")\nassert_equal(o.handle, \"Neo\")" },
          { name: "handle can be rewritten", code: "o = Operator.new(\"Neo\")\no.handle = \"The One\"\nassert_equal(o.handle, \"The One\")" },
          { name: "accessor gives a writer", code: "o = Operator.new(\"Trinity\")\nassert(o.respond_to?(:handle=), \"need attr_accessor so handle is writable\")" }
          ],
          hint: "attr_accessor :handle makes both a reader and a writer (handle=).", lore: "Choose your call sign carefully. The grid will know you by it."
        },
        {
          id: "rb-killtally", title: "KILL TALLY", kind: "function", difficulty: 2, xp: 160,
          brief: "A counter that mutates and returns its state.",
          prompt: "Define a class **Tally** that counts events.\n\n- **initialize** sets `@count` to **0**\n- expose it with **attr_reader :count**\n- **bump** increases the count by 1 and RETURNS the new count\n\n~~~ruby\nt = Tally.new\nt.bump    # 1\nt.bump    # 2\nt.count   # 2\n~~~",
          starter: "class Tally\n  attr_reader :count\n  def initialize\n    @count = 0\n  end\n  def bump\n    # TODO: increase @count and return it\n    @count\n  end\nend\n",
          solution: "class Tally\n  attr_reader :count\n  def initialize\n    @count = 0\n  end\n  def bump\n    @count += 1\n    @count\n  end\nend\n",
          tests: [
          { name: "starts at zero", code: "t = Tally.new\nassert_equal(t.count, 0)" },
          { name: "bump returns new count", code: "t = Tally.new\nassert_equal(t.bump, 1)\nassert_equal(t.bump, 2)" },
          { name: "state sticks", code: "t = Tally.new\nt.bump\nt.bump\nt.bump\nassert_equal(t.count, 3)" }
          ],
          hint: "Inside bump: @count += 1 mutates the state, then make @count the last line so it is returned.", lore: "Every mark on the tally is a ghost in the machine."
        },
        {
          id: "rb-stack", title: "PUSH DOWN", kind: "function", difficulty: 2, xp: 170,
          brief: "A stack with push, pop and size.",
          prompt: "Define a class **Stack** backed by an array `@items`.\n\n- **initialize** sets `@items` to an empty array `[]`\n- **push(x)** adds x to the top and returns x\n- **pop** removes and returns the top item (the LAST one added)\n- **size** returns how many items are stored\n\n~~~ruby\ns = Stack.new\ns.push(\"a\")\ns.push(\"b\")\ns.size   # 2\ns.pop    # \"b\"\ns.size   # 1\n~~~",
          starter: "class Stack\n  def initialize\n    @items = []\n  end\n  def push(x)\n    # TODO\n  end\n  def pop\n    # TODO\n  end\n  def size\n    0\n  end\nend\n",
          solution: "class Stack\n  def initialize\n    @items = []\n  end\n  def push(x)\n    @items.push(x)\n    x\n  end\n  def pop\n    @items.pop\n  end\n  def size\n    @items.size\n  end\nend\n",
          tests: [
          { name: "push returns the item and grows", code: "s = Stack.new\nassert_equal(s.push(\"a\"), \"a\")\nassert_equal(s.size, 1)" },
          { name: "pop is last-in first-out", code: "s = Stack.new\ns.push(\"a\")\ns.push(\"b\")\nassert_equal(s.pop, \"b\")\nassert_equal(s.size, 1)" },
          { name: "size tracks the count", code: "s = Stack.new\ns.push(1)\ns.push(2)\ns.push(3)\ns.pop\nassert_equal(s.size, 2)" }
          ],
          hint: "Array has .push, .pop and .size already — delegate to @items and return the right value.", lore: "Last in, first out. The newest secret is the first to surface."
        },
        {
          id: "rb-meter", title: "POWER METER", kind: "function", difficulty: 2, xp: 170,
          brief: "Mutate a value but clamp it to a ceiling.",
          prompt: "Define a class **Meter** that charges toward a maximum.\n\n- **initialize(max)** stores `@max` and sets `@level` to **0**\n- expose the current level with **attr_reader :level**\n- **charge(n)** adds n to the level but NEVER above `@max`, then returns the new level\n\n~~~ruby\nm = Meter.new(100)\nm.charge(40)   # 40\nm.charge(80)   # 100  (clamped at max)\nm.level        # 100\n~~~",
          starter: "class Meter\n  attr_reader :level\n  def initialize(max)\n    @max = max\n    @level = 0\n  end\n  def charge(n)\n    @level += n   # TODO: must not exceed @max\n    @level\n  end\nend\n",
          solution: "class Meter\n  attr_reader :level\n  def initialize(max)\n    @max = max\n    @level = 0\n  end\n  def charge(n)\n    @level = [@max, @level + n].min\n    @level\n  end\nend\n",
          tests: [
          { name: "charges up", code: "m = Meter.new(100)\nassert_equal(m.charge(40), 40)\nassert_equal(m.level, 40)" },
          { name: "clamps at max", code: "m = Meter.new(100)\nm.charge(40)\nassert_equal(m.charge(80), 100)\nassert_equal(m.level, 100)" },
          { name: "stays clamped on more charge", code: "m = Meter.new(50)\nm.charge(999)\nm.charge(999)\nassert_equal(m.level, 50)" }
          ],
          hint: "Use [@max, @level + n].min so the level can rise but never passes @max.", lore: "The reactor will take only so much. Push harder and it simply holds."
        },
        {
          id: "rb-account", title: "OVERDRAFT GUARD", kind: "function", difficulty: 3, xp: 200,
          brief: "An account that refuses to go negative.",
          prompt: "Define a class **Account** with a guard against overdraft.\n\n- **initialize(start)** stores the opening balance in `@balance`\n- expose it with **attr_reader :balance**\n- **deposit(n)** adds n and returns the new balance\n- **withdraw(n)** subtracts n and returns the new balance — BUT if n is greater than the balance it must change nothing and return **false**\n\n~~~ruby\na = Account.new(100)\na.deposit(50)    # 150\na.withdraw(60)   # 90\na.withdraw(999)  # false  (refused, balance unchanged)\na.balance        # 90\n~~~",
          starter: "class Account\n  attr_reader :balance\n  def initialize(start)\n    @balance = start\n  end\n  def deposit(n)\n    @balance += n\n    @balance\n  end\n  def withdraw(n)\n    @balance -= n   # TODO: refuse if it would overdraw\n    @balance\n  end\nend\n",
          solution: "class Account\n  attr_reader :balance\n  def initialize(start)\n    @balance = start\n  end\n  def deposit(n)\n    @balance += n\n    @balance\n  end\n  def withdraw(n)\n    return false if n > @balance\n    @balance -= n\n    @balance\n  end\nend\n",
          tests: [
          { name: "deposit grows the balance", code: "a = Account.new(100)\nassert_equal(a.deposit(50), 150)\nassert_equal(a.balance, 150)" },
          { name: "valid withdraw works", code: "a = Account.new(100)\nassert_equal(a.withdraw(60), 40)\nassert_equal(a.balance, 40)" },
          { name: "overdraft refused, balance untouched", code: "a = Account.new(90)\nassert_equal(a.withdraw(999), false)\nassert_equal(a.balance, 90)" },
          { name: "exact balance withdraw allowed", code: "a = Account.new(50)\nassert_equal(a.withdraw(50), 0)\nassert_equal(a.balance, 0)" }
          ],
          hint: "Put the guard FIRST: return false if n > @balance — before you touch @balance.", lore: "The bank does not extend credit to ghosts. Insufficient funds, runner."
        },
        {
          id: "rb-buffer", title: "EMPTY BUFFER PANIC", kind: "function", difficulty: 3, xp: 210,
          brief: "A queue that raises when popped while empty.",
          prompt: "Define a class **Buffer** (a first-in first-out queue) backed by `@items`.\n\n- **initialize** sets `@items` to `[]`\n- **add(x)** appends x and returns x\n- **take** removes and returns the OLDEST item (the first one added) — but if the buffer is empty it must **raise** an error\n- **empty?** returns true when there are no items\n\n~~~ruby\nb = Buffer.new\nb.add(\"a\")\nb.add(\"b\")\nb.take     # \"a\"\nb.take     # \"b\"\nb.take     # raises — nothing left\n~~~",
          starter: "class Buffer\n  def initialize\n    @items = []\n  end\n  def add(x)\n    @items.push(x)\n    x\n  end\n  def take\n    @items.shift   # TODO: must raise when empty\n  end\n  def empty?\n    @items.empty?\n  end\nend\n",
          solution: "class Buffer\n  def initialize\n    @items = []\n  end\n  def add(x)\n    @items.push(x)\n    x\n  end\n  def take\n    raise \"buffer empty\" if @items.empty?\n    @items.shift\n  end\n  def empty?\n    @items.empty?\n  end\nend\n",
          tests: [
          { name: "FIFO order", code: "b = Buffer.new\nb.add(\"a\")\nb.add(\"b\")\nassert_equal(b.take, \"a\")\nassert_equal(b.take, \"b\")" },
          { name: "empty? reflects state", code: "b = Buffer.new\nassert_equal(b.empty?, true)\nb.add(1)\nassert_equal(b.empty?, false)" },
          { name: "take on empty raises", code: "b = Buffer.new\nassert_raises { b.take }" },
          { name: "raises again after draining", code: "b = Buffer.new\nb.add(\"x\")\nb.take\nassert_raises { b.take }" }
          ],
          hint: "Guard first: raise \"buffer empty\" if @items.empty?  then @items.shift for FIFO.", lore: "Reach into an empty buffer and the system screams. Nothing comes from nothing."
        },
        {
          id: "rb-profile", title: "IDENTITY STRING", kind: "function", difficulty: 3, xp: 210,
          brief: "Give an object a readable to_s.",
          prompt: "Define a class **Runner** with a custom **to_s** so the object reads nicely when printed or interpolated.\n\n- **initialize(name, level)** stores both in `@name` and `@level`\n- **to_s** RETURNS the string `\"NAME [LV.LEVEL]\"` — the name, a space, then the level in square brackets prefixed with `LV.`\n\n~~~ruby\nr = Runner.new(\"Neo\", 7)\nr.to_s              # \"Neo [LV.7]\"\n\"#{Runner.new(\"Trinity\", 12)}\"   # \"Trinity [LV.12]\"\n~~~",
          starter: "class Runner\n  def initialize(name, level)\n    @name = name\n    @level = level\n  end\n  def to_s\n    # TODO: return \"NAME [LV.LEVEL]\"\n    \"\"\n  end\nend\n",
          solution: "class Runner\n  def initialize(name, level)\n    @name = name\n    @level = level\n  end\n  def to_s\n    \"#{@name} [LV.#{@level}]\"\n  end\nend\n",
          tests: [
          { name: "formats name and level", code: "r = Runner.new(\"Neo\", 7)\nassert_equal(r.to_s, \"Neo [LV.7]\")" },
          { name: "another runner", code: "r = Runner.new(\"Trinity\", 12)\nassert_equal(r.to_s, \"Trinity [LV.12]\")" },
          { name: "interpolation uses to_s", code: "r = Runner.new(\"Morpheus\", 99)\nassert_equal(\"#{r}\", \"Morpheus [LV.99]\")" }
          ],
          hint: "Build it with interpolation and make it the LAST expression: \"#{@name} [LV.#{@level}]\".", lore: "On the grid you are a name and a number. Wear them well."
        }
        ],
      }
  );
  add("rbm01-core", [
        {
          id: "rb-greet-op", title: "OPERATOR GREETING", kind: "function", difficulty: 1, xp: 120,
          brief: "Hail the operator.",
          prompt: "Define a method **greet(handle)** that returns a greeting string.\n\nGiven a handle, return exactly:\n~~~text\nWelcome to the Construct, <handle>.\n~~~\nUse string interpolation: **#{handle}**.\n\n~~~ruby\ngreet(\"Trinity\")  # \"Welcome to the Construct, Trinity.\"\n~~~",
          starter: "def greet(handle)\n  # TODO: interpolate the handle\n  \"\"\nend\n",
          solution: "def greet(handle)\n  \"Welcome to the Construct, #{handle}.\"\nend\n",
          tests: [
          { name: "greets Trinity", code: "assert_equal(greet(\"Trinity\"), \"Welcome to the Construct, Trinity.\")" },
          { name: "uses the argument", code: "assert_equal(greet(\"Neo\"), \"Welcome to the Construct, Neo.\")" },
          { name: "not hard-coded", code: "assert(greet(\"Dozer\").include?(\"Dozer\"), \"interpolate the handle\")" }
          ],
          hint: "\"Welcome to the Construct, #{handle}.\"", lore: "Every jack-in starts with a handshake."
        },
        {
          id: "rb-id-tag", title: "ID TAG", kind: "function", difficulty: 2, xp: 120,
          brief: "Stamp a runner's badge.",
          prompt: "Define a method **id_tag(name, level)** that returns a badge string combining a name and a numeric level.\n\nReturn exactly:\n~~~text\n[<name>] clearance level <level>\n~~~\nBoth values go inside one interpolated string.\n\n~~~ruby\nid_tag(\"Switch\", 7)  # \"[Switch] clearance level 7\"\n~~~",
          starter: "def id_tag(name, level)\n  # TODO: combine name and level\n  name\nend\n",
          solution: "def id_tag(name, level)\n  \"[#{name}] clearance level #{level}\"\nend\n",
          tests: [
          { name: "tags Switch at 7", code: "assert_equal(id_tag(\"Switch\", 7), \"[Switch] clearance level 7\")" },
          { name: "tags Apoc at 3", code: "assert_equal(id_tag(\"Apoc\", 3), \"[Apoc] clearance level 3\")" },
          { name: "level is interpolated", code: "assert(id_tag(\"Mouse\", 12).include?(\"12\"), \"interpolate the level too\")" }
          ],
          hint: "Two #{} slots in one string: \"[#{name}] clearance level #{level}\".", lore: "No badge, no jack-in."
        },
        {
          id: "rb-ping", title: "PING SWEEP", kind: "script", difficulty: 2, xp: 120,
          brief: "Broadcast a status sweep.",
          prompt: "Define a method **ping(host)** that **puts** (prints) the line:\n~~~text\nPING <host> ... ACK\n~~~\nThen, at the top level, call it three times with **\"core\"**, **\"relay\"**, and **\"gateway\"**, in that order.\n\n~~~ruby\nping(\"core\")    # prints: PING core ... ACK\n~~~",
          starter: "def ping(host)\n  # TODO: puts the ping line\nend\n\n# TODO: call ping three times\n",
          solution: "def ping(host)\n  puts \"PING #{host} ... ACK\"\nend\n\nping(\"core\")\nping(\"relay\")\nping(\"gateway\")\n",
          tests: [
          { name: "something was printed", code: "assert(stdout().length > 0, \"Nothing printed. Use puts inside ping.\")" },
          { name: "all three hosts acked", code: "o = stdout()\nassert(o.include?(\"PING core ... ACK\"), \"missing core\")\nassert(o.include?(\"PING relay ... ACK\"), \"missing relay\")\nassert(o.include?(\"PING gateway ... ACK\"), \"missing gateway\")" },
          { name: "core comes before gateway", code: "o = stdout()\nassert(o.index(\"core\") < o.index(\"gateway\"), \"wrong order\")" }
          ],
          hint: "Inside ping: puts \"PING #{host} ... ACK\". Then call it three times.", lore: "Listen for the echo in the dark."
        },
        {
          id: "rb-status-line", title: "STATUS LINE", kind: "function", difficulty: 3, xp: 120,
          brief: "Compose a telemetry readout.",
          prompt: "Define a method **status_line(name, online)** that returns a status string. The **online** argument is a boolean.\n\nWhen **online** is true return:\n~~~text\n<name>: ONLINE\n~~~\nWhen it is false return:\n~~~text\n<name>: OFFLINE\n~~~\nThe state word changes; the name is interpolated.\n\n~~~ruby\nstatus_line(\"MAGI\", true)   # \"MAGI: ONLINE\"\nstatus_line(\"MAGI\", false)  # \"MAGI: OFFLINE\"\n~~~",
          starter: "def status_line(name, online)\n  # TODO: pick ONLINE or OFFLINE\n  \"#{name}: ONLINE\"\nend\n",
          solution: "def status_line(name, online)\n  state = online ? \"ONLINE\" : \"OFFLINE\"\n  \"#{name}: #{state}\"\nend\n",
          tests: [
          { name: "online reads ONLINE", code: "assert_equal(status_line(\"MAGI\", true), \"MAGI: ONLINE\")" },
          { name: "offline reads OFFLINE", code: "assert_equal(status_line(\"MAGI\", false), \"MAGI: OFFLINE\")" },
          { name: "name is interpolated", code: "assert_equal(status_line(\"Tank\", false), \"Tank: OFFLINE\")" },
          { name: "both branches differ", code: "assert(status_line(\"X\", true) != status_line(\"X\", false), \"the state must change with the flag\")" }
          ],
          hint: "state = online ? \"ONLINE\" : \"OFFLINE\", then interpolate both.", lore: "A green light is a promise the grid keeps."
        },
        {
          id: "rb-banner", title: "BOOT BANNER", kind: "function", difficulty: 3, xp: 120,
          brief: "Frame the cold-boot header.",
          prompt: "Define a method **banner(title)** that returns a TWO-LINE string: the title, then a line of dashes (**-**) exactly as long as the title. Separate the two lines with a newline **\\n**.\n\n~~~ruby\nbanner(\"CORE\")\n# \"CORE\\n----\"\n~~~\nUse interpolation and **String#length**. The string **\"-\" * n** repeats a dash n times.",
          starter: "def banner(title)\n  # TODO: title on line 1, matching dashes on line 2\n  title\nend\n",
          solution: "def banner(title)\n  \"#{title}\\n#{\"-\" * title.length}\"\nend\n",
          tests: [
          { name: "CORE banner", code: "assert_equal(banner(\"CORE\"), \"CORE\\n----\")" },
          { name: "dashes match length", code: "assert_equal(banner(\"ZION\"), \"ZION\\n----\")" },
          { name: "longer title, longer rule", code: "assert_equal(banner(\"MATRIX\"), \"MATRIX\\n------\")" },
          { name: "two lines exactly", code: "assert_equal(banner(\"AI\").split(\"\\n\").length, 2)" }
          ],
          hint: "\"#{title}\\n#{\"-\" * title.length}\" gives a rule the same width as the title.", lore: "Every system announces itself before it thinks."
        }
  ]);

  add("rbm02-blocks", [
        {
          id: "rb-doubles", title: "SIGNAL AMPLIFIER", kind: "function", difficulty: 1, xp: 120,
          brief: "Double every reading.",
          prompt: "Define a method **doubles(nums)** that takes an array of integers and returns a NEW array with every value multiplied by 2.\n\nUse **map** with a block: **nums.map { |n| ... }**.\n\n~~~ruby\ndoubles([1, 2, 3])  # [2, 4, 6]\ndoubles([])         # []\n~~~",
          starter: "def doubles(nums)\n  # TODO: map each number to twice its value\n  nums\nend\n",
          solution: "def doubles(nums)\n  nums.map { |n| n * 2 }\nend\n",
          tests: [
          { name: "doubles a short signal", code: "assert_equal(doubles([1, 2, 3]), [2, 4, 6])" },
          { name: "handles negatives and zero", code: "assert_equal(doubles([-4, 0, 5]), [-8, 0, 10])" },
          { name: "empty stays empty", code: "assert_equal(doubles([]), [])" }
          ],
          hint: "nums.map { |n| n * 2 } returns a fresh, amplified array.", lore: "Turn the gain up; the grid is whispering."
        },
        {
          id: "rb-positives", title: "NOISE GATE", kind: "function", difficulty: 2, xp: 120,
          brief: "Keep only the live channels.",
          prompt: "Define a method **positives(nums)** that returns a NEW array containing only the numbers greater than zero, in their original order.\n\nUse **select** with a block: **nums.select { |n| ... }**.\n\n~~~ruby\npositives([-2, 5, 0, 9, -1])  # [5, 9]\npositives([-3, -1])           # []\n~~~",
          starter: "def positives(nums)\n  # TODO: keep only numbers above zero\n  nums\nend\n",
          solution: "def positives(nums)\n  nums.select { |n| n > 0 }\nend\n",
          tests: [
          { name: "drops zero and negatives", code: "assert_equal(positives([-2, 5, 0, 9, -1]), [5, 9])" },
          { name: "all negative gives empty", code: "assert_equal(positives([-3, -1]), [])" },
          { name: "all positive kept in order", code: "assert_equal(positives([4, 1, 7]), [4, 1, 7])" }
          ],
          hint: "nums.select { |n| n > 0 } filters; zero is NOT greater than zero.", lore: "Silence the dead channels before they drown the song."
        },
        {
          id: "rb-name-tags", title: "TAG FORGE", kind: "function", difficulty: 2, xp: 120,
          brief: "Brand each handle.",
          prompt: "Define a method **name_tags(names)** that takes an array of handle strings and returns a NEW array where each handle is wrapped in square brackets and uppercased.\n\nChain **map** with string methods and interpolation.\n\n~~~ruby\nname_tags([\"neo\", \"Trinity\"])  # [\"[NEO]\", \"[TRINITY]\"]\nname_tags([])                  # []\n~~~",
          starter: "def name_tags(names)\n  # TODO: bracket and upcase each name\n  names\nend\n",
          solution: "def name_tags(names)\n  names.map { |n| \"[#{n.upcase}]\" }\nend\n",
          tests: [
          { name: "brackets and upcases", code: "assert_equal(name_tags([\"neo\", \"Trinity\"]), [\"[NEO]\", \"[TRINITY]\"])" },
          { name: "single handle", code: "assert_equal(name_tags([\"mouse\"]), [\"[MOUSE]\"])" },
          { name: "empty roster", code: "assert_equal(name_tags([]), [])" }
          ],
          hint: "names.map { |n| \"[#{n.upcase}]\" } builds each branded tag.", lore: "Stamp the runners before they hit the wire."
        },
        {
          id: "rb-avg-load", title: "LOAD AVERAGER", kind: "function", difficulty: 3, xp: 120,
          brief: "Average the core load.",
          prompt: "Define a method **avg_load(readings)** that returns the average of an array of integers as a **Float**. Sum the values with **reduce** (or **sum**) and divide by the count.\n\nReturn **0.0** when the array is empty (never divide by zero).\n\n~~~ruby\navg_load([2, 4, 6])  # 4.0\navg_load([1, 2])     # 1.5\navg_load([])         # 0.0\n~~~",
          starter: "def avg_load(readings)\n  # TODO: reduce to a sum, then divide as a Float\n  0\nend\n",
          solution: "def avg_load(readings)\n  return 0.0 if readings.empty?\n  total = readings.reduce(0) { |acc, n| acc + n }\n  total.to_f / readings.length\nend\n",
          tests: [
          { name: "whole average", code: "assert_equal(avg_load([2, 4, 6]), 4.0)" },
          { name: "fractional average", code: "assert_equal(avg_load([1, 2]), 1.5)" },
          { name: "empty is zero float", code: "assert_equal(avg_load([]), 0.0)" },
          { name: "result is a Float", code: "assert(avg_load([3, 3]).is_a?(Float), \"divide using to_f so the result is a Float\")" }
          ],
          hint: "Guard the empty case, then readings.reduce(0) { |a, n| a + n }.to_f / readings.length.", lore: "Spread the heat evenly or the core melts down."
        },
        {
          id: "rb-runner-card", title: "RUNNER DOSSIER", kind: "function", difficulty: 3, xp: 120,
          brief: "Assemble a runner's file.",
          prompt: "Define a method **runner_card(name, level)** that returns a **Hash with symbol keys**: **:name** holding the given name, **:level** holding the given level, and **:active** set to **true** when the level is 5 or higher, otherwise **false**.\n\nBuild and return the hash literal **{ name: ..., level: ..., active: ... }**.\n\n~~~ruby\nrunner_card(\"Neo\", 9)\n# { name: \"Neo\", level: 9, active: true }\nrunner_card(\"Mouse\", 2)\n# { name: \"Mouse\", level: 2, active: false }\n~~~",
          starter: "def runner_card(name, level)\n  # TODO: return a hash with :name, :level, :active\n  { name: name, level: level, active: false }\nend\n",
          solution: "def runner_card(name, level)\n  { name: name, level: level, active: level >= 5 }\nend\n",
          tests: [
          { name: "high level is active", code: "assert_equal(runner_card(\"Neo\", 9), { name: \"Neo\", level: 9, active: true })" },
          { name: "low level is inactive", code: "assert_equal(runner_card(\"Mouse\", 2), { name: \"Mouse\", level: 2, active: false })" },
          { name: "boundary of five is active", code: "assert_equal(runner_card(\"Switch\", 5)[:active], true)" },
          { name: "reads by symbol key", code: "assert_equal(runner_card(\"Tank\", 7)[:name], \"Tank\")" }
          ],
          hint: "{ name: name, level: level, active: level >= 5 } - the >= test yields the boolean directly.", lore: "A dossier is the only truth a runner carries inside."
        }
  ]);

  add("rbm03-objects", [
        {
          id: "rb-titlecase", title: "TITLE CASE", kind: "function", difficulty: 1, xp: 120,
          brief: "Capitalize a single word.",
          prompt: "Define **titlecase(s)** that returns the string `s` with its first letter upper-cased and the rest lower-cased. Use `capitalize`.\n\n~~~ruby\ntitlecase(\"lAIN\")    # \"Lain\"\ntitlecase(\"WIRED\")   # \"Wired\"\n~~~",
          starter: "def titlecase(s)\n  # TODO: capitalize the word\n  s\nend\n",
          solution: "def titlecase(s)\n  s.capitalize\nend\n",
          tests: [
          { name: "capitalizes a name", code: "assert_equal(titlecase(\"lAIN\"), \"Lain\")" },
          { name: "lowercases the tail", code: "assert_equal(titlecase(\"WIRED\"), \"Wired\")" },
          { name: "empty stays empty", code: "assert_equal(titlecase(\"\"), \"\")" }
          ],
          hint: "s.capitalize upcases the first char and downcases the rest.", lore: "The wired logs every handle in one tidy case. Order from the noise."
        },
        {
          id: "rb-swapfix", title: "SWAP FIX", kind: "function", difficulty: 2, xp: 160,
          brief: "Replace every match in a string.",
          prompt: "Define **swapfix(s)** that returns `s` with EVERY space replaced by an underscore `\"_\"`. Use `gsub`, which replaces all matches.\n\n~~~ruby\nswapfix(\"break the ice\")   # \"break_the_ice\"\nswapfix(\"node\")            # \"node\"\n~~~",
          starter: "def swapfix(s)\n  # TODO: replace ALL spaces with underscores\n  s\nend\n",
          solution: "def swapfix(s)\n  s.gsub(\" \", \"_\")\nend\n",
          tests: [
          { name: "replaces all spaces", code: "assert_equal(swapfix(\"break the ice\"), \"break_the_ice\")" },
          { name: "no space unchanged", code: "assert_equal(swapfix(\"node\"), \"node\")" },
          { name: "leading and trailing", code: "assert_equal(swapfix(\" a b \"), \"_a_b_\")" }
          ],
          hint: "s.gsub(\" \", \"_\") hits every match, not just the first.", lore: "Filenames on the wired never breathe. Every gap clamps shut into an underscore."
        },
        {
          id: "rb-echo-len", title: "ECHO LENGTH", kind: "function", difficulty: 2, xp: 170,
          brief: "Downcase then measure.",
          prompt: "Define **echo_len(s)** that lower-cases `s` and then returns the number of characters in the result. Chain `downcase` and `length`.\n\n~~~ruby\necho_len(\"LAIN\")    # 4\necho_len(\"Wired!\")  # 6\n~~~",
          starter: "def echo_len(s)\n  # TODO: downcase then return the length\n  0\nend\n",
          solution: "def echo_len(s)\n  s.downcase.length\nend\n",
          tests: [
          { name: "counts after downcase", code: "assert_equal(echo_len(\"LAIN\"), 4)" },
          { name: "counts punctuation too", code: "assert_equal(echo_len(\"Wired!\"), 6)" },
          { name: "empty is zero", code: "assert_equal(echo_len(\"\"), 0)" }
          ],
          hint: "Chain it: s.downcase.length.", lore: "Drop the signal to a whisper, then count how far the echo carries."
        },
        {
          id: "rb-callsign", title: "CALL SIGN", kind: "function", difficulty: 3, xp: 200,
          brief: "A class that stores and accessor-mutates a call sign.",
          prompt: "Define a class **CallSign** that holds an operator's sign.\n\n- **initialize(sign)** stores the sign in `@sign`\n- expose it for READ and WRITE with **attr_accessor :sign**\n- **broadcast** returns the sign upper-cased\n\nThe accessor must let callers reassign `sign=` after construction.\n\n~~~ruby\nc = CallSign.new(\"raven\")\nc.sign            # \"raven\"\nc.broadcast       # \"RAVEN\"\nc.sign = \"ghost\"\nc.broadcast       # \"GHOST\"\n~~~",
          starter: "class CallSign\n  # TODO: attr_accessor :sign\n  def initialize(sign)\n    @sign = sign\n  end\n  def broadcast\n    # TODO: upper-case the sign\n    @sign\n  end\nend\n",
          solution: "class CallSign\n  attr_accessor :sign\n  def initialize(sign)\n    @sign = sign\n  end\n  def broadcast\n    @sign.upcase\n  end\nend\n",
          tests: [
          { name: "reads the sign", code: "c = CallSign.new(\"raven\")\nassert_equal(c.sign, \"raven\")" },
          { name: "broadcast upcases", code: "c = CallSign.new(\"raven\")\nassert_equal(c.broadcast, \"RAVEN\")" },
          { name: "accessor allows reassign", code: "c = CallSign.new(\"raven\")\nc.sign = \"ghost\"\nassert_equal(c.sign, \"ghost\")\nassert_equal(c.broadcast, \"GHOST\")" }
          ],
          hint: "attr_accessor :sign gives both reader and writer; broadcast is @sign.upcase.", lore: "Operators swap call signs to stay ghosts. The tower still shouts whatever you give it."
        },
        {
          id: "rb-counter", title: "HIT COUNTER", kind: "function", difficulty: 3, xp: 210,
          brief: "A class that mutates internal state across calls.",
          prompt: "Define a class **Counter** that tracks a tally.\n\n- **initialize** sets `@count` to `0` (no arguments)\n- expose the tally with **attr_reader :count**\n- **hit** increases `@count` by 1 and returns the new count\n\nEach call to `hit` must remember the previous value.\n\n~~~ruby\nc = Counter.new\nc.count   # 0\nc.hit     # 1\nc.hit     # 2\nc.count   # 2\n~~~",
          starter: "class Counter\n  attr_reader :count\n  def initialize\n    @count = 0\n  end\n  def hit\n    # TODO: increment @count and return it\n    @count\n  end\nend\n",
          solution: "class Counter\n  attr_reader :count\n  def initialize\n    @count = 0\n  end\n  def hit\n    @count += 1\n    @count\n  end\nend\n",
          tests: [
          { name: "starts at zero", code: "c = Counter.new\nassert_equal(c.count, 0)" },
          { name: "first hit returns one", code: "c = Counter.new\nassert_equal(c.hit, 1)" },
          { name: "remembers across calls", code: "c = Counter.new\nc.hit\nc.hit\nassert_equal(c.count, 2)" },
          { name: "hit returns running total", code: "c = Counter.new\nc.hit\nassert_equal(c.hit, 2)" }
          ],
          hint: "@count += 1 mutates the stored value; return @count as the last line.", lore: "The turnstile on the wired never forgets. Every pass clicks the tally one higher."
        }
  ]);
})();