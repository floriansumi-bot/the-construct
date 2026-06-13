/* ============================================================
   curriculum-lua-pack-1.js — LUA expansion (right-size to ~8 sectors).
   Adds new sectors + fills existing. Test-based (native Lua assert);
   verified by _verify/verify-lua.js on Lua 5.4 (wasmoon). Auto-assembled
   from _verify/lua-gen/jobs/*.json — do not hand-edit.
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack("lua");
  if (!t) return;
  function add(modId, exs) { var m = t.modules.find(function (x) { return x.id === modId; }); if (m) Array.prototype.push.apply(m.exercises, exs); }
  t.modules.push(
      {
        id: "luam04-tables", code: "0x04", title: "TABLES AS MAPS",
        subtitle: "pairs · key/value · membership · frequency",
        theory: "\n## Tables can be maps, not just lists\nIn the last sector a table was a numbered list (`t[1]`, `t[2]`, ...). The SAME table type can also be a **map** (also called a hash, dictionary, or lookup): you store a **value** under a **key**, and the key can be a string.\n\n~~~lua\nlocal user = {}\nuser[\"name\"] = \"lain\"   -- store value \"lain\" under key \"name\"\nuser[\"level\"] = 7\nprint(user[\"name\"])      -- lain\n~~~\n\n**WHAT** — `t[key] = value` puts something into the slot named `key`. **WHY** — a map lets you look things up *by name* instead of by position, which is how you model records, settings, and counts.\n\n> INTEL — `t.name` is just shorthand for `t[\"name\"]`. The dot form only works when the key is a plain word; for any other key (a variable, or a string with spaces) you must use the square brackets `t[key]`.\n\n## Reading a key — and the nil that means \"absent\"\nReading `t[key]` gives you the stored value. If nothing was ever stored under that key, you get **nil** (Lua's word for \"nothing here\"). It is NOT an error and it does NOT crash.\n\n~~~lua\nlocal scores = {}\nscores[\"ana\"] = 50\nprint(scores[\"ana\"])   -- 50\nprint(scores[\"zed\"])   -- nil   (never stored, so absent)\n~~~\n\n> WARNING — a missing key returns `nil`, and `nil` can't do arithmetic. `scores[\"zed\"] + 1` blows up with \"attempt to perform arithmetic on a nil value\". Always check, or supply a default (see below).\n\n## A safe default with `or`\nA common trick: `t[key] or default` gives the stored value, or the default when the slot is `nil`. This is how you start a counter at 0 even on the first sighting.\n\n~~~lua\nlocal n = counts[\"hit\"] or 0   -- 0 if \"hit\" was never seen\ncounts[\"hit\"] = n + 1          -- now it's safely a number\n~~~\n\n## Iterating a map with `pairs`\nA numeric `for` only walks 1, 2, 3, ... so it can't reach string keys. To visit EVERY key/value in a map, use **pairs**:\n\n~~~lua\nfor key, value in pairs(scores) do\n  print(key, value)   -- ana  50   (and every other pair)\nend\n~~~\n\n**WHAT** — `pairs(t)` hands you each `key, value` pair in turn. **WHY** — it's the only way to loop over a map, since the keys aren't numbered positions.\n\n> WARNING — `pairs` gives NO guaranteed order. Do not rely on which key comes first. When you need a total or a count, accumulate into a variable inside the loop — never assume the pairs arrive sorted.\n\n## Checking membership\n\"Is this key in the map?\" — compare its value to `nil`. If the slot holds anything, the key is present.\n\n~~~lua\nif scores[\"ana\"] ~= nil then\n  print(\"ana is registered\")\nend\n~~~\n\nNote `~=` is Lua's **not-equal** operator (other languages write `!=`). And `t[k] ~= nil` is the precise membership test: it stays true even if the stored value is `0` or `\"\"`, which a plain `if t[k] then` would mistreat — but in Lua only `nil` and `false` are falsy, so `0` and `\"\"` are still truthy. Using `~= nil` makes the intent obvious.\n\n## Building a frequency / count table\nPut it together: walk a list, and for each item bump its counter in a map. This counts how often each value appears.\n\n~~~lua\nlocal items = { \"a\", \"b\", \"a\" }\nlocal freq = {}\nfor i = 1, #items do\n  local k = items[i]\n  freq[k] = (freq[k] or 0) + 1   -- start at 0, then add 1\nend\nprint(freq[\"a\"])   -- 2\nprint(freq[\"b\"])   -- 1\n~~~\n\n> INTEL — `(freq[k] or 0) + 1` is the heartbeat of every counter you'll ever write. The `or 0` covers the first time you meet a key; after that the real number takes over.\n\n> WARNING — remember Lua basics from earlier sectors: there is no `++`, so write `x = x + 1`. And `..` joins strings while `+` adds numbers — never use `+` to glue text or `..` to add.\n",
        exercises: [
        {
          id: "lua-stash", title: "STASH SLOT", kind: "function", difficulty: 1, xp: 120,
          brief: "Store one value under a key.",
          prompt: "\nDefine **stash(key, value)** that creates a fresh table, stores **value** under **key**, and returns the table.\n~~~lua\nlocal t = stash(\"name\", \"lain\")\nprint(t[\"name\"])  -- lain\n~~~\n",
          starter: "function stash(key, value)\n  local t = {}\n  -- TODO: store value under key, then return t\n  return t\nend",
          solution: "function stash(key, value)\n  local t = {}\n  t[key] = value\n  return t\nend",
          tests: [
          { name: "stores under string key", code: "local t = stash(\"name\", \"lain\")\nassert(t[\"name\"] == \"lain\")" },
          { name: "key is dynamic", code: "local t = stash(\"level\", 7)\nassert(t[\"level\"] == 7)" },
          { name: "other keys absent", code: "local t = stash(\"a\", 1)\nassert(t[\"b\"] == nil)" }
          ],
          hint: "Inside the table, write t[key] = value before returning t.", lore: "Every secret needs a slot in the grid. Name it, drop it, walk away."
        },
        {
          id: "lua-lookup", title: "COLD LOOKUP", kind: "function", difficulty: 1, xp: 120,
          brief: "Read a key that might be missing.",
          prompt: "\nDefine **lookup(t, key)** that returns the value stored under **key** in table **t**, or returns **nil** when the key is absent (just reading `t[key]` already does this).\n~~~lua\nlocal t = { name = \"lain\" }\nprint(lookup(t, \"name\"))  -- lain\nprint(lookup(t, \"age\"))   -- nil\n~~~\n",
          starter: "function lookup(t, key)\n  -- TODO: return the value at key (nil when absent)\n  return \"\"\nend",
          solution: "function lookup(t, key)\n  return t[key]\nend",
          tests: [
          { name: "returns stored value", code: "assert(lookup({ name = \"lain\" }, \"name\") == \"lain\")" },
          { name: "missing key is nil", code: "assert(lookup({ name = \"lain\" }, \"age\") == nil)" },
          { name: "reads numbers too", code: "assert(lookup({ level = 7 }, \"level\") == 7)" }
          ],
          hint: "Just return t[key] — Lua hands back nil for a key that was never set.", lore: "Probe the slot. Empty slots whisper nil, not error."
        },
        {
          id: "lua-registered", title: "REGISTERED", kind: "function", difficulty: 2, xp: 120,
          brief: "Is the key present?",
          prompt: "\nDefine **is_registered(t, key)** that returns **true** when **key** exists in **t**, and **false** when it does not. Test membership with `t[key] ~= nil`.\n~~~lua\nlocal users = { ana = true, zed = false }\nprint(is_registered(users, \"ana\"))  -- true\nprint(is_registered(users, \"who\"))  -- false\n~~~\n",
          starter: "function is_registered(t, key)\n  -- TODO: true when key exists, false otherwise\n  return false\nend",
          solution: "function is_registered(t, key)\n  return t[key] ~= nil\nend",
          tests: [
          { name: "present key is true", code: "assert(is_registered({ ana = 50 }, \"ana\") == true)" },
          { name: "missing key is false", code: "assert(is_registered({ ana = 50 }, \"who\") == false)" },
          { name: "value false still counts as present", code: "assert(is_registered({ zed = false }, \"zed\") == true)" }
          ],
          hint: "Return the comparison itself: t[key] ~= nil already yields true or false.", lore: "The gate doesn't care what you are — only that your slot isn't empty."
        },
        {
          id: "lua-bump", title: "COUNTER BUMP", kind: "function", difficulty: 2, xp: 120,
          brief: "Increment a counter that may not exist yet.",
          prompt: "\nDefine **bump(t, key)** that adds 1 to the counter at **key** in table **t** (starting from 0 if it was absent), then returns the table. Use the `(t[key] or 0) + 1` idiom.\n~~~lua\nlocal c = {}\nbump(c, \"hit\")\nbump(c, \"hit\")\nprint(c[\"hit\"])  -- 2\n~~~\n",
          starter: "function bump(t, key)\n  -- TODO: add 1 to t[key], starting from 0 if absent\n  return t\nend",
          solution: "function bump(t, key)\n  t[key] = (t[key] or 0) + 1\n  return t\nend",
          tests: [
          { name: "first bump starts at 1", code: "local c = bump({}, \"hit\")\nassert(c[\"hit\"] == 1)" },
          { name: "second bump reaches 2", code: "local c = {}\nbump(c, \"hit\")\nbump(c, \"hit\")\nassert(c[\"hit\"] == 2)" },
          { name: "keys are independent", code: "local c = {}\nbump(c, \"a\")\nbump(c, \"b\")\nbump(c, \"a\")\nassert(c[\"a\"] == 2 and c[\"b\"] == 1)" }
          ],
          hint: "t[key] = (t[key] or 0) + 1 — the 'or 0' covers the first sighting.", lore: "Tick the ledger. Each ghost in the wire leaves one more mark."
        },
        {
          id: "lua-keycount", title: "KEY CENSUS", kind: "function", difficulty: 2, xp: 120,
          brief: "Count how many keys a map holds.",
          prompt: "\nDefine **key_count(t)** that returns how many key/value pairs are in map **t**. The `#` operator does NOT work for string keys — loop with **pairs** and count.\n~~~lua\nkey_count({ a = 1, b = 2, c = 3 })  -- 3\nkey_count({})                        -- 0\n~~~\n",
          starter: "function key_count(t)\n  local n = 0\n  -- TODO: walk t with pairs and count each key\n  return -1\nend",
          solution: "function key_count(t)\n  local n = 0\n  for _ in pairs(t) do\n    n = n + 1\n  end\n  return n\nend",
          tests: [
          { name: "three keys", code: "assert(key_count({ a = 1, b = 2, c = 3 }) == 3)" },
          { name: "empty map is zero", code: "assert(key_count({}) == 0)" },
          { name: "single key", code: "assert(key_count({ only = 99 }) == 1)" }
          ],
          hint: "for _ in pairs(t) do n = n + 1 end — then return n.", lore: "Tally the slots. The grid never tells you its size — you count it yourself."
        },
        {
          id: "lua-tally", title: "FREQUENCY TALLY", kind: "function", difficulty: 3, xp: 120,
          brief: "Build a count table from a list.",
          prompt: "\nDefine **tally(list)** that takes an array of strings and returns a map from each string to how many times it appears. Walk the array with a numeric for loop and bump a counter for each item.\n~~~lua\nlocal f = tally({ \"a\", \"b\", \"a\" })\nprint(f[\"a\"])  -- 2\nprint(f[\"b\"])  -- 1\n~~~\n",
          starter: "function tally(list)\n  local freq = {}\n  -- TODO: count each item in list into freq\n  return freq\nend",
          solution: "function tally(list)\n  local freq = {}\n  for i = 1, #list do\n    local k = list[i]\n    freq[k] = (freq[k] or 0) + 1\n  end\n  return freq\nend",
          tests: [
          { name: "counts repeats", code: "local f = tally({ \"a\", \"b\", \"a\" })\nassert(f[\"a\"] == 2 and f[\"b\"] == 1)" },
          { name: "single occurrences", code: "local f = tally({ \"x\", \"y\", \"z\" })\nassert(f[\"x\"] == 1 and f[\"y\"] == 1 and f[\"z\"] == 1)" },
          { name: "unseen item is nil", code: "local f = tally({ \"a\", \"a\", \"a\" })\nassert(f[\"a\"] == 3 and f[\"b\"] == nil)" }
          ],
          hint: "Loop i = 1, #list; let k = list[i]; freq[k] = (freq[k] or 0) + 1.", lore: "Feed it the packet stream. It spits back who screamed loudest."
        },
        {
          id: "lua-topkey", title: "LOUDEST SIGNAL", kind: "function", difficulty: 3, xp: 120,
          brief: "Find the key with the largest value.",
          prompt: "\nDefine **top_key(counts)** that takes a map from string to number and returns the key whose value is the largest. Walk the map with **pairs**, tracking the best key and its value. Assume the map is non-empty and the maximum is unique.\n~~~lua\ntop_key({ a = 1, b = 5, c = 2 })  -- \"b\"\n~~~\n",
          starter: "function top_key(counts)\n  -- TODO: return the key with the biggest value\n  return nil\nend",
          solution: "function top_key(counts)\n  local best_key = nil\n  local best_val = nil\n  for k, v in pairs(counts) do\n    if best_val == nil or v > best_val then\n      best_key = k\n      best_val = v\n    end\n  end\n  return best_key\nend",
          tests: [
          { name: "largest in the middle", code: "assert(top_key({ a = 1, b = 5, c = 2 }) == \"b\")" },
          { name: "single key wins", code: "assert(top_key({ solo = 42 }) == \"solo\")" },
          { name: "works with built count map", code: "local f = {}\nlocal list = { \"x\", \"y\", \"y\", \"y\", \"x\" }\nfor i = 1, #list do f[list[i]] = (f[list[i]] or 0) + 1 end\nassert(top_key(f) == \"y\")" }
          ],
          hint: "Seed best_val = nil; for k, v in pairs(counts) do if best_val == nil or v > best_val then ... end end.", lore: "Somewhere in the static, one voice peaks. Lock onto it."
        },
        {
          id: "lua-mergecounts", title: "MERGE LEDGERS", kind: "function", difficulty: 3, xp: 120,
          brief: "Add two count maps together.",
          prompt: "\nDefine **merge_counts(a, b)** that returns a NEW map where each key's value is the sum of its values in **a** and **b** (a missing key counts as 0). Copy **a** with pairs, then add **b** with pairs.\n~~~lua\nlocal m = merge_counts({ x = 1, y = 2 }, { y = 3, z = 5 })\nprint(m[\"x\"])  -- 1\nprint(m[\"y\"])  -- 5\nprint(m[\"z\"])  -- 5\n~~~\n",
          starter: "function merge_counts(a, b)\n  local out = {}\n  -- TODO: add values from a and b into out\n  return out\nend",
          solution: "function merge_counts(a, b)\n  local out = {}\n  for k, v in pairs(a) do\n    out[k] = (out[k] or 0) + v\n  end\n  for k, v in pairs(b) do\n    out[k] = (out[k] or 0) + v\n  end\n  return out\nend",
          tests: [
          { name: "overlapping key sums", code: "local m = merge_counts({ x = 1, y = 2 }, { y = 3, z = 5 })\nassert(m[\"x\"] == 1 and m[\"y\"] == 5 and m[\"z\"] == 5)" },
          { name: "no overlap keeps both", code: "local m = merge_counts({ a = 4 }, { b = 6 })\nassert(m[\"a\"] == 4 and m[\"b\"] == 6)" },
          { name: "result is a fresh table", code: "local a = { p = 1 }\nlocal m = merge_counts(a, {})\nm[\"p\"] = 99\nassert(a[\"p\"] == 1)" }
          ],
          hint: "Two pairs loops, each doing out[k] = (out[k] or 0) + v.", lore: "Two ledgers, one truth. Sum the wire and seal it."
        }
        ],
      },
      {
        id: "luam05-loops", code: "0x05", title: "LOOPS & RANGES",
        subtitle: "numeric for · while · repeat · accumulation",
        theory: "\n## Doing something many times\nUp to now your code ran each line once, top to bottom. A **loop** lets you repeat a block — count from 1 to 10, add up a list, keep going until a condition is met. This sector covers Lua's three loops and the patterns you build with them.\n\n## The numeric `for` — a counted range\nThe most common loop walks a **range** of numbers. You give a **start**, an **end**, and (optionally) a **step**.\n\n~~~lua\nfor i = 1, 5 do      -- i takes 1, 2, 3, 4, 5\n  print(i)\nend\n~~~\n\n**WHAT** — `for i = a, b do ... end` runs the block once for each value of `i` from `a` up to and *including* `b`. **WHY** — when you know exactly how many times to repeat (or which numbers to visit), this is the clearest tool.\n\n> INTEL — the end value is **inclusive**. `for i = 1, 5` really does run with `i = 5` on the last pass. This trips up people coming from languages where the end is excluded.\n\n### Adding a step\nA third number is the **step** — how much `i` changes each pass. A negative step counts **down**.\n\n~~~lua\nfor i = 0, 10, 2 do print(i) end   -- 0 2 4 6 8 10\nfor i = 5, 1, -1 do print(i) end   -- 5 4 3 2 1\n~~~\n\n> WARNING — to count downward you MUST give a negative step. `for i = 5, 1 do` uses the default step of `+1`, sees that 5 is already past 1, and runs **zero** times — no error, just nothing happens. Write `for i = 5, 1, -1 do`.\n\n## Accumulating — sum and product\nThe killer move of a loop is the **accumulator**: a variable you set up *before* the loop and update *inside* it. To total a list, start at `0` and add each value. To multiply, start at `1` and multiply.\n\n~~~lua\nlocal sum = 0\nfor i = 1, 4 do\n  sum = sum + i      -- 0+1, then +2, +3, +4\nend\nprint(sum)           -- 10\n~~~\n\n> WARNING — declare the accumulator OUTSIDE the loop. If you write `local sum = 0` *inside* the `do ... end`, it resets to 0 on every pass and your total is wrong. And remember Lua has no `++`: write `sum = sum + i`, never `sum++`.\n\n> INTEL — pick the right seed. Sums start at **0** (adding 0 changes nothing). Products start at **1** (multiplying by 1 changes nothing). Seeding a product with 0 would force the answer to 0 forever.\n\n## The `while` loop — repeat as long as a condition holds\nWhen you DON'T know the count up front — \"keep going until the number drops below 1\" — use **while**. It checks the condition *first*, then runs the block, then checks again.\n\n~~~lua\nlocal n = 16\nlocal steps = 0\nwhile n > 1 do\n  n = n / 2          -- you must change n, or this never ends\n  steps = steps + 1\nend\nprint(steps)         -- 4\n~~~\n\n> WARNING — a `while` runs forever unless something inside it eventually makes the condition false. The classic bug is forgetting to update the variable you're testing — an **infinite loop**. Always make sure the block moves toward the exit.\n\n## The `repeat ... until` loop — run first, check after\n`repeat ... until cond` is `while`'s mirror image: it runs the block **once before** checking, then keeps going **until** the condition becomes true. Because the body runs first, it always executes at least once.\n\n~~~lua\nlocal i = 1\nrepeat\n  print(i)\n  i = i + 1\nuntil i > 3          -- prints 1, 2, 3\n~~~\n\n> INTEL — note the logic is flipped: `while cond` loops *while true*, but `repeat ... until cond` loops *until true* (i.e. while the condition is still false). Read the word `until` literally: \"keep going until this becomes true.\"\n\n## Building a result table with `table.insert`\nLoops often produce a **list**. Start with an empty table `{}` and push values onto the end with `table.insert`. Lua arrays are **1-indexed**, and `table.insert(t, v)` appends `v` at position `#t + 1`.\n\n~~~lua\nlocal squares = {}\nfor i = 1, 4 do\n  table.insert(squares, i * i)   -- 1, 4, 9, 16\nend\nprint(squares[1], squares[4])    -- 1   16\nprint(#squares)                  -- 4\n~~~\n\n**WHAT** — `table.insert(t, v)` grows the array by one, putting `v` last. **WHY** — you rarely know the final size ahead of time; inserting lets the list grow as the loop runs. `#t` then tells you how many items landed.\n\n## `break` — leave a loop early\nSometimes you want to stop the moment you find what you're after. **break** jumps straight out of the nearest loop, skipping the rest.\n\n~~~lua\nlocal found = nil\nfor i = 2, 100 do\n  if 84 % i == 0 then\n    found = i        -- first divisor of 84 that is >= 2\n    break            -- stop looking\n  end\nend\nprint(found)         -- 2\n~~~\n\n> INTEL — `break` only exits the **innermost** loop it sits in. There is no `break 2` to escape several loops at once — for that you restructure with a flag or a helper function.\n\n> WARNING — `%` is the **remainder** operator: `a % b == 0` means `b` divides `a` evenly. It's the standard \"is this divisible / is this even\" test — `n % 2 == 0` is true for even numbers.\n",
        exercises: [
        {
          id: "lua-loop-countsum", title: "RANGE TOTAL", kind: "function", difficulty: 1, xp: 120,
          brief: "Sum 1 up to n with a numeric for.",
          prompt: "\nDefine **sum_to(n)** that returns the total of every whole number from **1** to **n** (inclusive). Use a numeric `for` and an accumulator that starts at 0.\n~~~lua\nsum_to(4)   -- 10   (1 + 2 + 3 + 4)\nsum_to(1)   -- 1\n~~~\n",
          starter: "function sum_to(n)\n  -- TODO: add 1, 2, ..., n into a running total\n  return 0\nend",
          solution: "function sum_to(n)\n  local sum = 0\n  for i = 1, n do\n    sum = sum + i\n  end\n  return sum\nend",
          tests: [
          { name: "sum to 4", code: "assert(sum_to(4) == 10)" },
          { name: "sum to 1", code: "assert(sum_to(1) == 1)" },
          { name: "sum to 10", code: "assert(sum_to(10) == 55)" }
          ],
          hint: "local sum = 0 before the loop; for i = 1, n do sum = sum + i end; then return sum.", lore: "Walk the range one node at a time. The total is the toll you pay."
        },
        {
          id: "lua-loop-countdown", title: "DESCENT VECTOR", kind: "function", difficulty: 1, xp: 120,
          brief: "Count down from n into a list.",
          prompt: "\nDefine **countdown(n)** that returns an array holding the numbers **n, n-1, ... , 1** in that order. Use a numeric `for` with a negative step and `table.insert`.\n~~~lua\nlocal t = countdown(3)\nprint(t[1], t[2], t[3])  -- 3  2  1\n~~~\n",
          starter: "function countdown(n)\n  local out = {}\n  -- TODO: push n, n-1, ..., 1 onto out (mind the step)\n  return out\nend",
          solution: "function countdown(n)\n  local out = {}\n  for i = n, 1, -1 do\n    table.insert(out, i)\n  end\n  return out\nend",
          tests: [
          { name: "counts down from 3", code: "local t = countdown(3)\nassert(#t == 3 and t[1] == 3 and t[2] == 2 and t[3] == 1)" },
          { name: "single element", code: "local t = countdown(1)\nassert(#t == 1 and t[1] == 1)" },
          { name: "length matches n", code: "local t = countdown(5)\nassert(#t == 5 and t[1] == 5 and t[5] == 1)" }
          ],
          hint: "for i = n, 1, -1 do table.insert(out, i) end — the -1 step counts downward.", lore: "Ten to one, the descent burns clean. Forget the minus and you never leave the pad."
        },
        {
          id: "lua-loop-product", title: "CHAIN MULTIPLY", kind: "function", difficulty: 2, xp: 120,
          brief: "Multiply 1 through n together.",
          prompt: "\nDefine **product_to(n)** that returns the product of every whole number from **1** to **n** (this is n factorial). Seed the accumulator at **1**, not 0.\n~~~lua\nproduct_to(4)   -- 24   (1 * 2 * 3 * 4)\nproduct_to(1)   -- 1\n~~~\n",
          starter: "function product_to(n)\n  -- TODO: multiply 1 * 2 * ... * n (start the accumulator at 1)\n  return 0\nend",
          solution: "function product_to(n)\n  local prod = 1\n  for i = 1, n do\n    prod = prod * i\n  end\n  return prod\nend",
          tests: [
          { name: "product to 4", code: "assert(product_to(4) == 24)" },
          { name: "product to 1", code: "assert(product_to(1) == 1)" },
          { name: "product to 5", code: "assert(product_to(5) == 120)" }
          ],
          hint: "Start local prod = 1 (a 0 seed would zero everything); then prod = prod * i in the loop.", lore: "Stack the multipliers. Seed it with zero and the whole chain flatlines."
        },
        {
          id: "lua-loop-evens", title: "EVEN HARVEST", kind: "function", difficulty: 2, xp: 120,
          brief: "Collect even numbers up to n.",
          prompt: "\nDefine **evens_to(n)** that returns an array of every even number from **2** up to **n** (inclusive), in ascending order. A `for` with step 2 makes this clean; build the list with `table.insert`.\n~~~lua\nlocal t = evens_to(8)\nprint(t[1], t[4])  -- 2  8\n~~~\n",
          starter: "function evens_to(n)\n  local out = {}\n  -- TODO: collect 2, 4, 6, ... up to n\n  return out\nend",
          solution: "function evens_to(n)\n  local out = {}\n  for i = 2, n, 2 do\n    table.insert(out, i)\n  end\n  return out\nend",
          tests: [
          { name: "evens up to 8", code: "local t = evens_to(8)\nassert(#t == 4 and t[1] == 2 and t[2] == 4 and t[3] == 6 and t[4] == 8)" },
          { name: "odd bound stops early", code: "local t = evens_to(7)\nassert(#t == 3 and t[3] == 6)" },
          { name: "none below 2", code: "local t = evens_to(1)\nassert(#t == 0)" }
          ],
          hint: "for i = 2, n, 2 do table.insert(out, i) end — the step of 2 skips the odds.", lore: "Skim every second packet off the wire. The grid breathes in twos."
        },
        {
          id: "lua-loop-halve", title: "HALVING CASCADE", kind: "function", difficulty: 2, xp: 120,
          brief: "Count how many halvings reach 1.",
          prompt: "\nDefine **halvings(n)** that returns how many times you can integer-halve **n** before it reaches **1** or below. Use a `while` loop: keep dividing while `n > 1`, counting each step. Use `//` (floor division) so the result stays a whole number.\n~~~lua\nhalvings(16)  -- 4   (16 -> 8 -> 4 -> 2 -> 1)\nhalvings(1)   -- 0\n~~~\n",
          starter: "function halvings(n)\n  local steps = 0\n  -- TODO: while n > 1, halve n (use //) and count the step\n  return steps\nend",
          solution: "function halvings(n)\n  local steps = 0\n  while n > 1 do\n    n = n // 2\n    steps = steps + 1\n  end\n  return steps\nend",
          tests: [
          { name: "16 takes 4 steps", code: "assert(halvings(16) == 4)" },
          { name: "1 needs no steps", code: "assert(halvings(1) == 0)" },
          { name: "non-power rounds down", code: "assert(halvings(10) == 3)" }
          ],
          hint: "while n > 1 do n = n // 2; steps = steps + 1 end — you must change n or it loops forever.", lore: "Fold the signal in half, again and again, until only the core bit remains."
        },
        {
          id: "lua-loop-firstdiv", title: "FIRST FACTOR", kind: "function", difficulty: 3, xp: 120,
          brief: "Find the smallest divisor, then break.",
          prompt: "\nDefine **first_divisor(n)** that returns the smallest integer **d** with `d >= 2` that divides **n** evenly (test with `n % d == 0`). Loop `d` from 2 upward and `break` the instant you find one. Assume `n >= 2`; a prime's first divisor is itself.\n~~~lua\nfirst_divisor(15)  -- 3\nfirst_divisor(13)  -- 13\n~~~\n",
          starter: "function first_divisor(n)\n  -- TODO: scan d from 2 up; return the first d that divides n\n  return -1\nend",
          solution: "function first_divisor(n)\n  local found = n\n  for d = 2, n do\n    if n % d == 0 then\n      found = d\n      break\n    end\n  end\n  return found\nend",
          tests: [
          { name: "15 splits at 3", code: "assert(first_divisor(15) == 3)" },
          { name: "even splits at 2", code: "assert(first_divisor(28) == 2)" },
          { name: "prime returns itself", code: "assert(first_divisor(13) == 13)" }
          ],
          hint: "for d = 2, n do if n % d == 0 then found = d; break end end — the loop reaches n itself for a prime.", lore: "Pry at the number from the smallest end. The first crack is the one that matters."
        },
        {
          id: "lua-loop-collatz", title: "STORM SEQUENCE", kind: "function", difficulty: 3, xp: 120,
          brief: "Count steps with repeat...until.",
          prompt: "\nDefine **storm_steps(n)** that applies this rule until **n** reaches **1**, counting the steps: if `n` is even, set `n = n // 2`; otherwise set `n = 3 * n + 1`. Because you act before testing, use a `repeat ... until n == 1` loop. Return the number of steps. Assume `n >= 1`.\n~~~lua\nstorm_steps(1)  -- 0   (already at 1)\nstorm_steps(8)  -- 3   (8 -> 4 -> 2 -> 1)\n~~~\n",
          starter: "function storm_steps(n)\n  local steps = 0\n  if n == 1 then return 0 end\n  -- TODO: repeat the even/odd rule until n == 1, counting steps\n  return steps\nend",
          solution: "function storm_steps(n)\n  local steps = 0\n  if n == 1 then return 0 end\n  repeat\n    if n % 2 == 0 then\n      n = n // 2\n    else\n      n = 3 * n + 1\n    end\n    steps = steps + 1\n  until n == 1\n  return steps\nend",
          tests: [
          { name: "already at 1", code: "assert(storm_steps(1) == 0)" },
          { name: "power of two", code: "assert(storm_steps(8) == 3)" },
          { name: "odd start", code: "assert(storm_steps(6) == 8)" }
          ],
          hint: "Guard n == 1 first, then repeat the if/else rule with steps = steps + 1, until n == 1.", lore: "Feed any seed to the storm. It always spirals home to one — eventually."
        },
        {
          id: "lua-loop-runcap", title: "CAPPED RUN", kind: "function", difficulty: 3, xp: 120,
          brief: "Accumulate until a cap, then break.",
          prompt: "\nDefine **run_until_cap(list, cap)** that walks the array **list** adding values to a running total, but stops the moment the total would **reach or exceed** `cap`. Return an array of the values actually taken (those added before hitting the cap). Use a numeric `for` and `break`.\n~~~lua\nlocal t = run_until_cap({ 3, 4, 10, 1 }, 8)\nprint(t[1], t[2])  -- 3  4   (3+4=7 ok; adding 10 hits 17 >= 8, so stop)\nprint(#t)          -- 2\n~~~\n",
          starter: "function run_until_cap(list, cap)\n  local taken = {}\n  -- TODO: add items while the total stays below cap; break otherwise\n  return taken\nend",
          solution: "function run_until_cap(list, cap)\n  local taken = {}\n  local total = 0\n  for i = 1, #list do\n    if total + list[i] >= cap then\n      break\n    end\n    total = total + list[i]\n    table.insert(taken, list[i])\n  end\n  return taken\nend",
          tests: [
          { name: "stops before cap", code: "local t = run_until_cap({ 3, 4, 10, 1 }, 8)\nassert(#t == 2 and t[1] == 3 and t[2] == 4)" },
          { name: "takes all when under cap", code: "local t = run_until_cap({ 1, 1, 1 }, 100)\nassert(#t == 3 and t[3] == 1)" },
          { name: "first item already over", code: "local t = run_until_cap({ 50, 1 }, 10)\nassert(#t == 0)" }
          ],
          hint: "Track a running total; for each item, if total + list[i] >= cap then break, else add it and table.insert.", lore: "Pull data until the buffer's about to blow, then cut the line clean."
        }
        ],
      },
      {
        id: "luam06-closures", code: "0x06", title: "CLOSURES & HIGHER-ORDER",
        subtitle: "functions as values · closures · varargs",
        theory: "## Functions are values\nIn Lua a function is just a value, like a number or a string. That means you can store it in a variable, put it in a table, pass it to another function, or hand it back as a return value.\n\n~~~lua\nlocal function double(n)\n  return n * 2\nend\n\nlocal f = double      -- store the function in another variable\nprint(f(21))          -- 42  (calling f calls double)\n~~~\n\nWriting `local function double(n) ... end` is the same as `local double = function(n) ... end`. The second form makes it obvious that the function is a value being assigned.\n\n> INTEL — `double` (no parentheses) is the function itself. `double(5)` (with parentheses) **calls** it and gives you the result. Mixing these up is the #1 beginner slip.\n\n## Passing functions as arguments (higher-order)\nA **higher-order function** is one that takes another function as an argument, or returns one. This lets you write a routine once and feed it different behaviour.\n\n~~~lua\nlocal function apply(fn, x)\n  return fn(x)        -- call whatever function we were handed\nend\n\nlocal function shout(s) return s .. \"!\" end\nprint(apply(shout, \"go\"))   -- go!\n~~~\n\nHere `apply` does not know or care what `fn` does. It just calls it. You decide the behaviour by choosing which function to pass in.\n\n## Returning functions + closures\nA function defined **inside** another function can remember the local variables that surrounded it, even after the outer function has returned. That captured, remembered variable is what makes it a **closure**.\n\n~~~lua\nlocal function make_adder(n)\n  return function(x)\n    return x + n     -- n is remembered from make_adder\n  end\nend\n\nlocal add10 = make_adder(10)\nprint(add10(5))   -- 15\nprint(add10(1))   -- 11\n~~~\n\n`make_adder(10)` builds and returns a brand-new function whose private `n` is locked to 10. Call `make_adder(3)` and you get a different function with its own `n` of 3 — they do not interfere.\n\n## A closure that keeps state (a counter)\nBecause the captured local is shared between calls, a closure can hold state that survives across calls — like a counter that goes up every time you call it.\n\n~~~lua\nlocal function make_counter()\n  local count = 0\n  return function()\n    count = count + 1   -- there is no ++ in Lua\n    return count\n  end\nend\n\nlocal next_id = make_counter()\nprint(next_id())  -- 1\nprint(next_id())  -- 2\nprint(next_id())  -- 3\n~~~\n\n`count` lives on between calls because the inner function still holds a reference to it. Each fresh call to `make_counter()` gets its own independent `count`.\n\n> WARNING — Remember Lua has no `++` and no `+=`. To bump a value you must write `count = count + 1`. Also, two separate counters made by two `make_counter()` calls do NOT share their `count` — each closure has its own.\n\n## Varargs: functions that take any number of arguments\nThe three dots `...` in a parameter list mean \"capture all remaining arguments here.\" Inside the function, `...` stands for that list of extra values.\n\n~~~lua\nlocal function add_all(...)\n  local total = 0\n  for _, v in ipairs({...}) do   -- {...} packs the args into a table\n    total = total + v\n  end\n  return total\nend\n\nprint(add_all(1, 2, 3, 4))   -- 10\n~~~\n\nThe expression `{...}` collects the varargs into a normal (1-indexed) array, so you can loop over them with `ipairs`.\n\n## Counting varargs with select(\"#\", ...)\nTo ask **how many** arguments were passed, use `select(\"#\", ...)`. The literal string `\"#\"` is the special signal that means \"give me the count.\"\n\n~~~lua\nlocal function how_many(...)\n  return select(\"#\", ...)\nend\n\nprint(how_many(\"a\", \"b\", \"c\"))   -- 3\nprint(how_many())                 -- 0\n~~~\n\n`select(\"#\", ...)` counts even `nil` holes correctly, which `#{...}` cannot always do — so prefer it when you truly need the count.\n\n> INTEL — Lua arrays are **1-indexed**: the first element is `t[1]`, not `t[0]`. Keep that in mind whenever you turn `{...}` into a table and read its slots.",
        exercises: [
        {
          id: "lua-store-fn", title: "STORE THE ROUTINE", kind: "function", difficulty: 1, xp: 120,
          brief: "A function is just a value.",
          prompt: "Functions are values you can put in a variable.\n\nDefine **run_twice(fn, x)** that calls `fn` on `x`, then calls `fn` again on that result, and returns the final value.\n~~~lua\nlocal function inc(n) return n + 1 end\nrun_twice(inc, 5)   -- 7   (5 -> 6 -> 7)\n~~~",
          starter: "function run_twice(fn, x)\n  -- TODO: call fn on x, then on the result\n  return x\nend\n",
          solution: "function run_twice(fn, x)\n  return fn(fn(x))\nend\n",
          tests: [
          { name: "run_twice(inc, 5) -> 7", code: "local function inc(n) return n + 1 end\nassert(run_twice(inc, 5) == 7, \"5 -> 6 -> 7 should be 7\")" },
          { name: "works with doubling", code: "local function dbl(n) return n * 2 end\nassert(run_twice(dbl, 3) == 12, \"3 -> 6 -> 12 should be 12\")" },
          { name: "works with strings", code: "local function bang(s) return s .. \"!\" end\nassert(run_twice(bang, \"go\") == \"go!!\")" }
          ],
          hint: "Call fn twice: fn(fn(x)).", lore: "The same routine, run again on its own output."
        },
        {
          id: "lua-apply", title: "APPLY", kind: "function", difficulty: 1, xp: 120,
          brief: "Pass a function as an argument.",
          prompt: "Define **apply(fn, x)** that simply calls the function `fn` with the argument `x` and returns the result.\n~~~lua\nlocal function neg(n) return -n end\napply(neg, 8)   -- -8\n~~~",
          starter: "function apply(fn, x)\n  -- TODO: call fn on x\n  return nil\nend\n",
          solution: "function apply(fn, x)\n  return fn(x)\nend\n",
          tests: [
          { name: "apply(neg, 8) -> -8", code: "local function neg(n) return -n end\nassert(apply(neg, 8) == -8)" },
          { name: "apply with a string function", code: "local function up(s) return s:upper() end\nassert(apply(up, \"trace\") == \"TRACE\")" }
          ],
          hint: "Just return fn(x).", lore: "Hand the engine a routine; it runs whatever you give it."
        },
        {
          id: "lua-make-adder", title: "MAKE ADDER", kind: "function", difficulty: 2, xp: 120,
          brief: "Return a function that remembers a number.",
          prompt: "Define **make_adder(n)** that returns a NEW function. That returned function takes one argument `x` and returns `x + n`. The value of `n` is captured (a closure).\n~~~lua\nlocal add10 = make_adder(10)\nadd10(5)   -- 15\nadd10(1)   -- 11\n~~~",
          starter: "function make_adder(n)\n  -- TODO: return a function that adds n to its argument\n  return nil\nend\n",
          solution: "function make_adder(n)\n  return function(x)\n    return x + n\n  end\nend\n",
          tests: [
          { name: "make_adder returns a function", code: "assert(type(make_adder(10)) == \"function\", \"make_adder must return a function\")" },
          { name: "add10 adds ten", code: "local add10 = make_adder(10)\nassert(add10(5) == 15 and add10(1) == 11)" },
          { name: "two adders are independent", code: "local add3 = make_adder(3)\nlocal add100 = make_adder(100)\nassert(add3(1) == 4 and add100(1) == 101)" }
          ],
          hint: "Inside make_adder, return function(x) return x + n end.", lore: "Forge a tool; bake in its calibration."
        },
        {
          id: "lua-counter", title: "COUNTER CORE", kind: "function", difficulty: 2, xp: 120,
          brief: "A closure that counts up.",
          prompt: "Define **make_counter()** that returns a function. Each time the returned function is called it increases an internal count by 1 and returns the new count, starting at 1.\n~~~lua\nlocal next_id = make_counter()\nnext_id()   -- 1\nnext_id()   -- 2\nnext_id()   -- 3\n~~~",
          starter: "function make_counter()\n  -- TODO: keep a private count and return a function that bumps it\n  return function()\n    return 0\n  end\nend\n",
          solution: "function make_counter()\n  local count = 0\n  return function()\n    count = count + 1\n    return count\n  end\nend\n",
          tests: [
          { name: "counts 1, 2, 3", code: "local c = make_counter()\nassert(c() == 1 and c() == 2 and c() == 3)" },
          { name: "each counter is independent", code: "local a = make_counter()\nlocal b = make_counter()\nassert(a() == 1 and a() == 2 and b() == 1, \"counters must not share state\")" }
          ],
          hint: "Declare local count = 0 OUTSIDE the returned function, then count = count + 1 inside.", lore: "A ticking register, sealed inside the closure."
        },
        {
          id: "lua-map-double", title: "MAP", kind: "function", difficulty: 2, xp: 120,
          brief: "Apply a function to every element.",
          prompt: "Define **map(fn, arr)** that returns a NEW array where each element is `fn` applied to the matching element of `arr`. Do not change the original array.\n~~~lua\nlocal function dbl(n) return n * 2 end\nmap(dbl, {1, 2, 3})   -- {2, 4, 6}\n~~~",
          starter: "function map(fn, arr)\n  -- TODO: build a new array by applying fn to each element\n  return {}\nend\n",
          solution: "function map(fn, arr)\n  local out = {}\n  for i = 1, #arr do\n    out[i] = fn(arr[i])\n  end\n  return out\nend\n",
          tests: [
          { name: "doubles each element", code: "local function dbl(n) return n * 2 end\nlocal r = map(dbl, {1, 2, 3})\nassert(#r == 3 and r[1] == 2 and r[2] == 4 and r[3] == 6)" },
          { name: "works with a string function", code: "local function bang(s) return s .. \"!\" end\nlocal r = map(bang, {\"a\", \"b\"})\nassert(#r == 2 and r[1] == \"a!\" and r[2] == \"b!\")" },
          { name: "empty array gives empty array", code: "local function id(x) return x end\nlocal r = map(id, {})\nassert(#r == 0)" }
          ],
          hint: "Loop i = 1, #arr and set out[i] = fn(arr[i]). Arrays are 1-indexed.", lore: "Run the filter over the whole datastream."
        },
        {
          id: "lua-varargs-sum", title: "VARARG SUM", kind: "function", difficulty: 3, xp: 120,
          brief: "Add up any number of arguments.",
          prompt: "Define **sum_all(...)** that accepts any number of numbers and returns their total. With no arguments it returns 0. Use `{...}` to gather the arguments.\n~~~lua\nsum_all(1, 2, 3, 4)   -- 10\nsum_all()             -- 0\n~~~",
          starter: "function sum_all(...)\n  -- TODO: add up all the arguments\n  return 0\nend\n",
          solution: "function sum_all(...)\n  local total = 0\n  for _, v in ipairs({...}) do\n    total = total + v\n  end\n  return total\nend\n",
          tests: [
          { name: "sum_all(1,2,3,4) -> 10", code: "assert(sum_all(1, 2, 3, 4) == 10)" },
          { name: "no args -> 0", code: "assert(sum_all() == 0)" },
          { name: "handles a single arg and negatives", code: "assert(sum_all(7) == 7 and sum_all(5, -2, -3) == 0)" }
          ],
          hint: "for _, v in ipairs({...}) do total = total + v end.", lore: "Aggregate every packet on the wire."
        },
        {
          id: "lua-varargs-count", title: "ARG COUNT", kind: "function", difficulty: 3, xp: 120,
          brief: "How many arguments came in?",
          prompt: "Define **arg_count(...)** that returns how many arguments it was given, using **select(\"#\", ...)**.\n~~~lua\narg_count(\"a\", \"b\", \"c\")   -- 3\narg_count()                 -- 0\n~~~",
          starter: "function arg_count(...)\n  -- TODO: return the number of arguments\n  return 0\nend\n",
          solution: "function arg_count(...)\n  return select(\"#\", ...)\nend\n",
          tests: [
          { name: "three args -> 3", code: "assert(arg_count(\"a\", \"b\", \"c\") == 3)" },
          { name: "no args -> 0", code: "assert(arg_count() == 0)" },
          { name: "counts nil holes too", code: "assert(arg_count(1, nil, 3) == 3, \"select(#) counts nils\")" }
          ],
          hint: "return select(\"#\", ...) — the \"#\" is a literal string.", lore: "Count the incoming signals before you decode them."
        },
        {
          id: "lua-compose", title: "COMPOSE", kind: "function", difficulty: 3, xp: 120,
          brief: "Chain two functions into one.",
          prompt: "Define **compose(f, g)** that returns a NEW function. Calling that function with `x` should first apply `g`, then apply `f` to that result — i.e. it returns `f(g(x))`.\n~~~lua\nlocal function inc(n) return n + 1 end\nlocal function dbl(n) return n * 2 end\nlocal h = compose(dbl, inc)\nh(5)   -- 12   (inc(5)=6, then dbl(6)=12)\n~~~",
          starter: "function compose(f, g)\n  -- TODO: return a function that does f(g(x))\n  return function(x)\n    return x\n  end\nend\n",
          solution: "function compose(f, g)\n  return function(x)\n    return f(g(x))\n  end\nend\n",
          tests: [
          { name: "compose returns a function", code: "local function id(x) return x end\nassert(type(compose(id, id)) == \"function\")" },
          { name: "applies g then f", code: "local function inc(n) return n + 1 end\nlocal function dbl(n) return n * 2 end\nlocal h = compose(dbl, inc)\nassert(h(5) == 12, \"inc(5)=6 then dbl(6)=12\")" },
          { name: "order matters", code: "local function inc(n) return n + 1 end\nlocal function dbl(n) return n * 2 end\nlocal h = compose(inc, dbl)\nassert(h(5) == 11, \"dbl(5)=10 then inc(10)=11\")" }
          ],
          hint: "Return function(x) return f(g(x)) end — inner g runs first.", lore: "Two routines welded into a single pipeline."
        }
        ],
      },
      {
        id: "luam07-patterns", code: "0x07", title: "STRING PATTERNS",
        subtitle: "format · find · match · gsub · gmatch",
        theory: "## What this sector is about\nText is data. To read a log line, pull a name out of a packet, or clean up dirty input, you need to **search inside strings** and **rebuild them**. Lua gives you a tiny, fast pattern engine for exactly this.\n\n> WARNING — Lua patterns are **NOT regular expressions (regex)**. They look similar but the rules differ. `%d` works, but `\\d` does NOT. Forget PCRE here — learn the few Lua rules below and you are done.\n\n## string.format — build a clean string\n`string.format` fills in blanks (called **specifiers**) with your values, like a fill-in template.\n~~~lua\nprint(string.format(\"%s lvl %d\", \"NEO\", 7))  -- NEO lvl 7\nprint(string.format(\"%.2f credits\", 3.5))     -- 3.50 credits\n~~~\nThe common specifiers: **%s** = a string, **%d** = a whole number, **%.2f** = a decimal with 2 places.\n\n> INTEL — `%d` needs an integer. `string.format(\"%d\", 3.5)` will error. Use `%.0f` if you want to round a decimal, or `%d` only on real integers.\n\n## What a pattern is — the character classes\nA **pattern** is a mini-description of \"what kind of text I am looking for\". The building blocks are **classes** (each matches ONE character):\n~~~text\n%d  one digit        0-9\n%a  one letter       A-Z a-z\n%s  one space        space, tab, newline\n%w  one letter OR digit (alphanumeric)\n.   any one character at all\n~~~\nA **capital** class means the opposite: **%D** = not a digit, **%A** = not a letter, **%S** = not a space.\n\n## Quantifiers — how many\nBy itself a class matches exactly one character. Add a symbol after it to repeat:\n~~~text\n%d+   one OR MORE digits   (greedy: grabs as many as it can)\n%d*   zero or more digits\n%d-   zero or more, but as FEW as possible (lazy)\n~~~\nSo `%d+` matches `\"42\"` as the whole thing, not just `\"4\"`.\n\n## string.find — where is it?\n`string.find(s, pattern)` returns the **start and end positions** of the first match, or **nil** if nothing matched. Positions are **1-indexed** (the first character is 1, not 0).\n~~~lua\nlocal i, j = string.find(\"id=A7\", \"%d+\")\nprint(i, j)  -- 5   5   (the single digit \"7\" sits at position 5)\n~~~\nA plain word with no special characters just finds that literal text:\n~~~lua\nprint(string.find(\"hello world\", \"world\"))  -- 7   11\n~~~\n\n> WARNING — beginners expect index **0** for \"first character\". In Lua the first character is at index **1**, and `find` returns `nil` (not -1, not 0) when there is no match. Always test `if string.find(...) then`.\n\n## Anchors — ^ start and $ end\nPut **^** at the FRONT of a pattern to mean \"must match at the very start of the string\". Put **$** at the END to mean \"must reach the very end\".\n~~~lua\nprint(string.find(\"abc\", \"^a\"))   -- 1  1  (starts with a)\nprint(string.find(\"abc\", \"^b\"))   -- nil  (does not start with b)\nprint(string.match(\"4242\", \"^%d+$\"))  -- 4242 (the WHOLE string is digits)\n~~~\n`^%d+$` is the classic \"is this string made of only digits?\" check.\n\n> INTEL — `^` only anchors when it is the FIRST character of the pattern. Anywhere else it is just a literal `^`. Same idea for `$` only at the very end.\n\n## string.match — give me the text\n`string.find` tells you WHERE. `string.match` gives you the matched **text itself** (or **nil** if no match).\n~~~lua\nprint(string.match(\"id=A7\", \"%d+\"))  -- 7\n~~~\n\n## Captures — pull pieces out with ( )\nWrap part of a pattern in **parentheses** to **capture** it. `match` then returns just those pieces, in order.\n~~~lua\nlocal user, host = string.match(\"neo@matrix\", \"(%a+)@(%a+)\")\nprint(user, host)  -- neo   matrix\n~~~\nWithout captures you get the whole match. With captures you get exactly the pieces you wrapped.\n\n## string.gsub — find AND replace\n`string.gsub(s, pattern, replacement)` returns a **new string** with every match swapped, plus a **count** of how many it changed. (Strings in Lua never change in place — you always get a new one back.)\n~~~lua\nlocal clean, n = string.gsub(\"a1b2c3\", \"%d\", \"#\")\nprint(clean, n)  -- a#b#c#   3\n~~~\nUse `()` in the replacement too: `%1` means \"the first capture\".\n~~~lua\nprint(string.gsub(\"neo@matrix\", \"(%a+)@(%a+)\", \"%2.%1\"))  -- matrix.neo  1\n~~~\n\n## string.gmatch — loop over every match\n`string.gmatch(s, pattern)` gives you an **iterator** — perfect for a `for` loop that visits each match one at a time.\n~~~lua\nfor word in string.gmatch(\"red green blue\", \"%a+\") do\n  print(word)   -- red   green   blue (each on its own line)\nend\n~~~\nWith captures, `gmatch` hands you the captured pieces each time through the loop.\n\n> INTEL — colon style works too: `s:match(p)` is the same as `string.match(s, p)`. Pick whichever reads better.\n\n> WARNING — `..` joins strings (`\"a\" .. \"b\"` is `\"ab\"`). The `+` symbol is **only math** — `\"a\" + \"b\"` is an error. To build text, always use `..`, never `+`.\n",
        exercises: [
        {
          id: "lua-fmt-tag", title: "ID TAG", kind: "function", difficulty: 1, xp: 120,
          brief: "Format a name-and-level badge.",
          prompt: "Define **id_tag(name, lvl)** that returns a string built with **string.format** in the form `NAME [Lv.N]`, where N is a whole number.\n~~~lua\nid_tag(\"NEO\", 7)   -- \"NEO [Lv.7]\"\nid_tag(\"TRINITY\", 12)  -- \"TRINITY [Lv.12]\"\n~~~\nUse the **%s** and **%d** specifiers.",
          starter: "function id_tag(name, lvl)\n  -- TODO: use string.format with %s and %d\n  return \"\"\nend\n",
          solution: "function id_tag(name, lvl)\n  return string.format(\"%s [Lv.%d]\", name, lvl)\nend\n",
          tests: [
          { name: "basic tag", code: "assert(id_tag(\"NEO\", 7) == \"NEO [Lv.7]\")" },
          { name: "two digits", code: "assert(id_tag(\"TRINITY\", 12) == \"TRINITY [Lv.12]\")" },
          { name: "level zero", code: "assert(id_tag(\"GHOST\", 0) == \"GHOST [Lv.0]\")" }
          ],
          hint: "return string.format(\"%s [Lv.%d]\", name, lvl)", lore: "Every runner needs a callsign on the grid."
        },
        {
          id: "lua-find-digit", title: "FIRST DIGIT", kind: "function", difficulty: 1, xp: 120,
          brief: "Locate where the first run of digits starts.",
          prompt: "Define **first_digit_pos(s)** that returns the **1-indexed position** where the first digit appears in **s**, or **0** if there is no digit at all. Use **string.find** with the pattern `%d`.\n~~~lua\nfirst_digit_pos(\"id=A7\")   -- 5\nfirst_digit_pos(\"abc\")     -- 0\n~~~",
          starter: "function first_digit_pos(s)\n  -- TODO: string.find(s, \"%d\") returns the start position, or nil\n  return -1\nend\n",
          solution: "function first_digit_pos(s)\n  local i = string.find(s, \"%d\")\n  if i then\n    return i\n  end\n  return 0\nend\n",
          tests: [
          { name: "digit found", code: "assert(first_digit_pos(\"id=A7\") == 5)" },
          { name: "no digit", code: "assert(first_digit_pos(\"abc\") == 0)" },
          { name: "digit at start", code: "assert(first_digit_pos(\"9lives\") == 1)" }
          ],
          hint: "local i = string.find(s, \"%d\"); return i or 0", lore: "Find the number buried in the noise."
        },
        {
          id: "lua-all-digits", title: "PURE NUMERIC", kind: "function", difficulty: 2, xp: 160,
          brief: "Is the whole string only digits?",
          prompt: "Define **all_digits(s)** that returns **true** if **s** is made up of one or more digits and NOTHING else, otherwise **false**. Use anchors: the pattern `^%d+$` matches a string that is entirely digits. An empty string is **false**.\n~~~lua\nall_digits(\"4242\")   -- true\nall_digits(\"4a2\")    -- false\nall_digits(\"\")       -- false\n~~~",
          starter: "function all_digits(s)\n  -- TODO: match against ^%d+$ and return a boolean\n  return true\nend\n",
          solution: "function all_digits(s)\n  return string.match(s, \"^%d+$\") ~= nil\nend\n",
          tests: [
          { name: "all digits", code: "assert(all_digits(\"4242\") == true)" },
          { name: "has a letter", code: "assert(all_digits(\"4a2\") == false)" },
          { name: "empty is false", code: "assert(all_digits(\"\") == false)" },
          { name: "leading text fails", code: "assert(all_digits(\"x99\") == false)" }
          ],
          hint: "return string.match(s, \"^%d+$\") ~= nil", lore: "Clean keys only. Reject the tampered ones."
        },
        {
          id: "lua-grab-number", title: "EXTRACT VALUE", kind: "function", difficulty: 2, xp: 160,
          brief: "Pull the number out of a key=value pair.",
          prompt: "Define **grab_number(s)** that finds the first run of digits in **s** and returns it as a **number** (use tonumber), or **nil** if there are no digits. Match `%d+` so you grab the whole run, not just one digit.\n~~~lua\ngrab_number(\"hp=255\")   -- 255\ngrab_number(\"level 8 ok\")  -- 8\ngrab_number(\"none\")     -- nil\n~~~",
          starter: "function grab_number(s)\n  -- TODO: string.match(s, \"%d+\") then tonumber(...)\n  return 0\nend\n",
          solution: "function grab_number(s)\n  local hit = string.match(s, \"%d+\")\n  if hit then\n    return tonumber(hit)\n  end\n  return nil\nend\n",
          tests: [
          { name: "extracts 255", code: "assert(grab_number(\"hp=255\") == 255)" },
          { name: "extracts 8", code: "assert(grab_number(\"level 8 ok\") == 8)" },
          { name: "no number is nil", code: "assert(grab_number(\"none\") == nil)" },
          { name: "returns a number type", code: "assert(type(grab_number(\"x=42\")) == \"number\")" }
          ],
          hint: "local hit = string.match(s, \"%d+\"); return hit and tonumber(hit) or nil", lore: "Strip the label, keep the payload."
        },
        {
          id: "lua-split-pair", title: "SPLIT HANDLE", kind: "function", difficulty: 2, xp: 160,
          brief: "Capture both sides of an @ handle.",
          prompt: "Define **split_handle(s)** for a handle like `user@host`. Use a pattern with two captures — `(%a+)@(%a+)` — and return the two captured strings (user first, host second).\n~~~lua\nlocal u, h = split_handle(\"neo@matrix\")\n-- u == \"neo\", h == \"matrix\"\n~~~",
          starter: "function split_handle(s)\n  -- TODO: return both captures from (%a+)@(%a+)\n  return nil, nil\nend\n",
          solution: "function split_handle(s)\n  local user, host = string.match(s, \"(%a+)@(%a+)\")\n  return user, host\nend\n",
          tests: [
          { name: "splits neo@matrix", code: "local u, h = split_handle(\"neo@matrix\"); assert(u == \"neo\" and h == \"matrix\")" },
          { name: "splits root@zion", code: "local u, h = split_handle(\"root@zion\"); assert(u == \"root\" and h == \"zion\")" },
          { name: "user side only check", code: "local u = split_handle(\"trinity@grid\"); assert(u == \"trinity\")" }
          ],
          hint: "return string.match(s, \"(%a+)@(%a+)\")", lore: "Two halves of one identity, decoded."
        },
        {
          id: "lua-redact", title: "REDACT DIGITS", kind: "function", difficulty: 3, xp: 200,
          brief: "Mask every digit and count them.",
          prompt: "Define **redact(s)** that replaces every digit in **s** with `#` using **string.gsub**, and returns BOTH the new string and the number of digits replaced (gsub already returns both values, in that order).\n~~~lua\nlocal out, n = redact(\"a1b2c3\")\n-- out == \"a#b#c#\", n == 3\n~~~",
          starter: "function redact(s)\n  -- TODO: use string.gsub(s, \"%d\", \"#\") and return both results\n  return s, 0\nend\n",
          solution: "function redact(s)\n  return string.gsub(s, \"%d\", \"#\")\nend\n",
          tests: [
          { name: "masks and counts", code: "local out, n = redact(\"a1b2c3\"); assert(out == \"a#b#c#\" and n == 3)" },
          { name: "no digits", code: "local out, n = redact(\"abc\"); assert(out == \"abc\" and n == 0)" },
          { name: "all digits", code: "local out, n = redact(\"007\"); assert(out == \"###\" and n == 3)" }
          ],
          hint: "return string.gsub(s, \"%d\", \"#\")  -- gsub returns string AND count", lore: "Scrub the serials before the dump leaks."
        },
        {
          id: "lua-swap-handle", title: "FLIP HANDLE", kind: "function", difficulty: 3, xp: 200,
          brief: "Rewrite user@host as host.user using captures.",
          prompt: "Define **flip_handle(s)** that turns a handle `user@host` into `host.user`, using **string.gsub** with two captures `(%a+)@(%a+)` and a replacement that uses `%2` and `%1`. Return ONLY the rewritten string (gsub returns the count second — ignore it).\n~~~lua\nflip_handle(\"neo@matrix\")  -- \"matrix.neo\"\n~~~",
          starter: "function flip_handle(s)\n  -- TODO: gsub with \"(%a+)@(%a+)\" -> \"%2.%1\", return only the string\n  return s\nend\n",
          solution: "function flip_handle(s)\n  local out = string.gsub(s, \"(%a+)@(%a+)\", \"%2.%1\")\n  return out\nend\n",
          tests: [
          { name: "flips neo@matrix", code: "assert(flip_handle(\"neo@matrix\") == \"matrix.neo\")" },
          { name: "flips root@zion", code: "assert(flip_handle(\"root@zion\") == \"zion.root\")" },
          { name: "returns a single string", code: "local r = flip_handle(\"a@b\"); assert(r == \"b.a\" and type(r) == \"string\")" }
          ],
          hint: "local out = string.gsub(s, \"(%a+)@(%a+)\", \"%2.%1\"); return out", lore: "Reverse the routing. Send the ghost home."
        },
        {
          id: "lua-sum-numbers", title: "TALLY STREAM", kind: "function", difficulty: 3, xp: 200,
          brief: "Add up every number found in the text.",
          prompt: "Define **sum_numbers(s)** that finds every run of digits in **s** and returns their total as a number. Loop with **string.gmatch(s, \"%d+\")**, convert each match with **tonumber**, and add it up. If there are no numbers, return **0**.\n~~~lua\nsum_numbers(\"a3 b10 c2\")   -- 15\nsum_numbers(\"none here\")   -- 0\n~~~",
          starter: "function sum_numbers(s)\n  local total = 0\n  -- TODO: for n in string.gmatch(s, \"%d+\") do ... end\n  return total\nend\n",
          solution: "function sum_numbers(s)\n  local total = 0\n  for n in string.gmatch(s, \"%d+\") do\n    total = total + tonumber(n)\n  end\n  return total\nend\n",
          tests: [
          { name: "sums 3+10+2", code: "assert(sum_numbers(\"a3 b10 c2\") == 15)" },
          { name: "no numbers", code: "assert(sum_numbers(\"none here\") == 0)" },
          { name: "single number", code: "assert(sum_numbers(\"value=42\") == 42)" },
          { name: "multi-digit runs", code: "assert(sum_numbers(\"100 and 200 and 300\") == 600)" }
          ],
          hint: "for n in string.gmatch(s, \"%d+\") do total = total + tonumber(n) end", lore: "Drain every credit from the stream and tally it."
        }
        ],
      },
      {
        id: "luam08-math", code: "0x08", title: "MATH & ALGORITHMS",
        subtitle: "math lib · recursion · table.sort",
        theory: "## The math toolbox\nLua ships a built-in **math** library. You call its tools with a dot: `math.floor(x)`. The handy ones:\n\n- **math.floor(x)** — round DOWN to the nearest whole number. `math.floor(3.9)` is `3`.\n- **math.abs(x)** — distance from zero (drops the minus sign). `math.abs(-7)` is `7`.\n- **math.max(a, b, ...)** — the biggest of the arguments.\n- **math.min(a, b, ...)** — the smallest.\n- **math.sqrt(x)** — the square root. `math.sqrt(9)` is `3.0`.\n\n~~~lua\nprint(math.floor(3.9))   -- 3\nprint(math.abs(-7))      -- 7\nprint(math.max(4, 9, 2)) -- 9\nprint(math.sqrt(16))     -- 4.0\n~~~\n\n> INTEL — `math.sqrt` always hands back a float, so `math.sqrt(9)` prints as `3.0`, not `3`. That is normal — `3.0 == 3` is still `true` in Lua.\n\n## Recursion: a function that calls itself\n**Recursion** means a function calls itself on a smaller problem until it hits a tiny case it can answer directly — the **base case**. Without a base case it loops forever, so always write that first.\n\nThe classic is **factorial** (`5! = 5*4*3*2*1`):\n~~~lua\nfunction factorial(n)\n  if n <= 1 then return 1 end      -- base case\n  return n * factorial(n - 1)      -- shrink the problem\nend\nprint(factorial(5))  -- 120\n~~~\n\n**Euclid's algorithm** finds the greatest common divisor (gcd) — the largest number that divides both. Lua's `%` gives the remainder:\n~~~lua\nfunction gcd(a, b)\n  if b == 0 then return a end      -- base case\n  return gcd(b, a % b)             -- swap & shrink\nend\nprint(gcd(48, 18))  -- 6\n~~~\n\n**Fibonacci** adds the two numbers before it (0, 1, 1, 2, 3, 5, 8, ...). Two base cases here:\n~~~lua\nfunction fib(n)\n  if n < 2 then return n end       -- fib(0)=0, fib(1)=1\n  return fib(n - 1) + fib(n - 2)\nend\nprint(fib(7))  -- 13\n~~~\n\n> WARNING — Every recursion needs a base case that stops it. If `factorial` never checked `n <= 1` it would call itself forever and crash with a stack overflow.\n\n## Checking for primes\nA **prime** is a whole number greater than 1 divisible only by 1 and itself (2, 3, 5, 7, 11, ...). To test `n`, try dividing by every number from 2 up: if any divides evenly (remainder 0), it is NOT prime.\n~~~lua\nfunction is_prime(n)\n  if n < 2 then return false end\n  for d = 2, n - 1 do\n    if n % d == 0 then return false end\n  end\n  return true\nend\n~~~\n\n## Sorting a table\n**table.sort(t)** rearranges an array IN PLACE — it changes `t` itself and returns nothing. By default it sorts ascending (smallest first):\n~~~lua\nlocal nums = {5, 1, 4, 2}\ntable.sort(nums)\nprint(nums[1], nums[4])  -- 1   5\n~~~\n\nTo sort differently, pass a **comparator**: a function `(a, b)` that returns `true` when `a` should come before `b`. For descending order, say \"a comes first when it is bigger\":\n~~~lua\nlocal nums = {5, 1, 4, 2}\ntable.sort(nums, function(a, b) return a > b end)\nprint(nums[1])  -- 5\n~~~\n\n> WARNING — `table.sort` does NOT return a new table. Writing `local s = table.sort(t)` puts `nil` in `s`. Sort `t`, then use `t`. Also remember Lua arrays start at index **1**, not 0 — the first element is `t[1]`.\n",
        exercises: [
        {
          id: "lua-driftgap", title: "DRIFT GAP", kind: "function", difficulty: 1, xp: 120,
          brief: "How far off the mark?",
          prompt: "Define **drift_gap(target, actual)** that returns how far `actual` is from `target`, as a positive number, using **math.abs**.\n~~~lua\ndrift_gap(10, 7)  -- 3\ndrift_gap(7, 10)  -- 3\n~~~",
          starter: "function drift_gap(target, actual)\n  -- TODO: use math.abs\n  return 0\nend\n",
          solution: "function drift_gap(target, actual)\n  return math.abs(target - actual)\nend\n",
          tests: [
          { name: "actual below target", code: "assert(drift_gap(10, 7) == 3, \"expected 3\")" },
          { name: "actual above target", code: "assert(drift_gap(7, 10) == 3, \"gap is always positive\")" },
          { name: "dead on", code: "assert(drift_gap(5, 5) == 0, \"no gap\")" }
          ],
          hint: "math.abs(target - actual) drops the minus sign.", lore: "Off by three microns. The net notices."
        },
        {
          id: "lua-peaksignal", title: "PEAK SIGNAL", kind: "function", difficulty: 1, xp: 120,
          brief: "The strongest of three.",
          prompt: "Define **peak_signal(a, b, c)** that returns the largest of the three numbers, using **math.max**.\n~~~lua\npeak_signal(4, 9, 2)  -- 9\n~~~",
          starter: "function peak_signal(a, b, c)\n  -- TODO: use math.max\n  return 0\nend\n",
          solution: "function peak_signal(a, b, c)\n  return math.max(a, b, c)\nend\n",
          tests: [
          { name: "middle wins", code: "assert(peak_signal(4, 9, 2) == 9, \"expected 9\")" },
          { name: "last wins", code: "assert(peak_signal(1, 1, 8) == 8, \"expected 8\")" },
          { name: "handles negatives", code: "assert(peak_signal(-5, -2, -9) == -2, \"expected -2\")" }
          ],
          hint: "math.max takes any number of arguments and returns the biggest.", lore: "Lock onto the loudest channel."
        },
        {
          id: "lua-floorvolts", title: "FLOOR VOLTS", kind: "function", difficulty: 2, xp: 120,
          brief: "Round the reading down.",
          prompt: "Define **floor_volts(reading)** that returns the reading rounded DOWN to a whole number, using **math.floor**.\n~~~lua\nfloor_volts(3.9)   -- 3\nfloor_volts(7.01)  -- 7\n~~~",
          starter: "function floor_volts(reading)\n  -- TODO: use math.floor\n  return reading\nend\n",
          solution: "function floor_volts(reading)\n  return math.floor(reading)\nend\n",
          tests: [
          { name: "rounds down", code: "assert(floor_volts(3.9) == 3, \"expected 3\")" },
          { name: "barely over", code: "assert(floor_volts(7.01) == 7, \"expected 7\")" },
          { name: "already whole", code: "assert(floor_volts(5) == 5, \"expected 5\")" }
          ],
          hint: "math.floor(3.9) is 3 — it always rounds toward smaller.", lore: "Trim the noise. Keep the whole units."
        },
        {
          id: "lua-vectorlen", title: "VECTOR LENGTH", kind: "function", difficulty: 2, xp: 120,
          brief: "Hypotenuse from two legs.",
          prompt: "Define **vector_len(x, y)** that returns the straight-line length of the vector — the square root of `x*x + y*y` — using **math.sqrt**.\n~~~lua\nvector_len(3, 4)  -- 5.0\n~~~",
          starter: "function vector_len(x, y)\n  -- TODO: use math.sqrt\n  return 0\nend\n",
          solution: "function vector_len(x, y)\n  return math.sqrt(x * x + y * y)\nend\n",
          tests: [
          { name: "3-4-5 triangle", code: "assert(vector_len(3, 4) == 5, \"expected 5\")" },
          { name: "axis only", code: "assert(vector_len(0, 6) == 6, \"expected 6\")" },
          { name: "5-12-13 triangle", code: "assert(vector_len(5, 12) == 13, \"expected 13\")" }
          ],
          hint: "math.sqrt(x*x + y*y). Squaring before adding, like Pythagoras.", lore: "Distance is just geometry under pressure."
        },
        {
          id: "lua-factorial", title: "FACTORIAL", kind: "function", difficulty: 2, xp: 120,
          brief: "Multiply the chain down.",
          prompt: "Define **factorial(n)** using **recursion**. It returns `n * (n-1) * ... * 1`. The factorial of 0 is 1.\n~~~lua\nfactorial(5)  -- 120\nfactorial(0)  -- 1\n~~~",
          starter: "function factorial(n)\n  -- TODO: base case, then recurse\n  return 0\nend\n",
          solution: "function factorial(n)\n  if n <= 1 then return 1 end\n  return n * factorial(n - 1)\nend\n",
          tests: [
          { name: "factorial of 5", code: "assert(factorial(5) == 120, \"expected 120\")" },
          { name: "base case zero", code: "assert(factorial(0) == 1, \"factorial(0) is 1\")" },
          { name: "factorial of 6", code: "assert(factorial(6) == 720, \"expected 720\")" }
          ],
          hint: "Base case: if n <= 1 return 1. Otherwise return n * factorial(n - 1).", lore: "Each layer multiplies the one below."
        },
        {
          id: "lua-euclidgcd", title: "EUCLID GCD", kind: "function", difficulty: 3, xp: 120,
          brief: "Greatest common divisor.",
          prompt: "Define **gcd(a, b)** using **Euclid's algorithm** (recursion): when `b` is 0, return `a`; otherwise return `gcd(b, a % b)`.\n~~~lua\ngcd(48, 18)  -- 6\ngcd(7, 0)    -- 7\n~~~",
          starter: "function gcd(a, b)\n  -- TODO: base case b == 0, then recurse\n  return 0\nend\n",
          solution: "function gcd(a, b)\n  if b == 0 then return a end\n  return gcd(b, a % b)\nend\n",
          tests: [
          { name: "48 and 18", code: "assert(gcd(48, 18) == 6, \"expected 6\")" },
          { name: "base case", code: "assert(gcd(7, 0) == 7, \"when b is 0, return a\")" },
          { name: "coprime", code: "assert(gcd(13, 7) == 1, \"expected 1\")" },
          { name: "one divides the other", code: "assert(gcd(100, 25) == 25, \"expected 25\")" }
          ],
          hint: "If b == 0 return a; else return gcd(b, a % b). The % is the remainder.", lore: "Strip the shared factor. What remains is irreducible."
        },
        {
          id: "lua-fibwave", title: "FIB WAVE", kind: "function", difficulty: 3, xp: 120,
          brief: "Each term sums the two before.",
          prompt: "Define **fib(n)** using **recursion**. The sequence is 0, 1, 1, 2, 3, 5, 8, ... so `fib(0)` is 0 and `fib(1)` is 1; otherwise `fib(n) = fib(n-1) + fib(n-2)`.\n~~~lua\nfib(7)  -- 13\nfib(0)  -- 0\n~~~",
          starter: "function fib(n)\n  -- TODO: base cases for 0 and 1, then recurse\n  return 0\nend\n",
          solution: "function fib(n)\n  if n < 2 then return n end\n  return fib(n - 1) + fib(n - 2)\nend\n",
          tests: [
          { name: "fib(7)", code: "assert(fib(7) == 13, \"expected 13\")" },
          { name: "base zero", code: "assert(fib(0) == 0, \"fib(0) is 0\")" },
          { name: "base one", code: "assert(fib(1) == 1, \"fib(1) is 1\")" },
          { name: "fib(10)", code: "assert(fib(10) == 55, \"expected 55\")" }
          ],
          hint: "If n < 2 return n. Otherwise return fib(n-1) + fib(n-2).", lore: "The spiral grows from what came before."
        },
        {
          id: "lua-rankdesc", title: "RANK DESCENDING", kind: "function", difficulty: 3, xp: 120,
          brief: "Sort a table, biggest first.",
          prompt: "Define **rank_desc(t)** that sorts the array `t` from largest to smallest and returns it. Use **table.sort** with a comparator. Remember `table.sort` changes `t` in place, so sort it then `return t`.\n~~~lua\nrank_desc({3, 1, 4, 1, 5})  -- {5, 4, 3, 1, 1}\n~~~",
          starter: "function rank_desc(t)\n  -- TODO: sort t descending with a comparator, then return it\n  return t\nend\n",
          solution: "function rank_desc(t)\n  table.sort(t, function(a, b) return a > b end)\n  return t\nend\n",
          tests: [
          { name: "five elements, descending", code: "local r = rank_desc({3, 1, 4, 1, 5})\nassert(#r == 5 and r[1] == 5 and r[2] == 4 and r[3] == 3 and r[4] == 1 and r[5] == 1, \"expected {5,4,3,1,1}\")" },
          { name: "already descending stays put", code: "local r = rank_desc({9, 6, 2})\nassert(#r == 3 and r[1] == 9 and r[2] == 6 and r[3] == 2, \"expected {9,6,2}\")" },
          { name: "handles negatives", code: "local r = rank_desc({-1, -5, 0})\nassert(#r == 3 and r[1] == 0 and r[2] == -1 and r[3] == -5, \"expected {0,-1,-5}\")" }
          ],
          hint: "table.sort(t, function(a, b) return a > b end), then return t.", lore: "The strongest signals rise to the top of the stack."
        }
        ],
      }
  );
  add("luam01-core", [
        {
          id: "lua-tag", title: "PACKET TAG", kind: "function", difficulty: 1, xp: 120,
          brief: "Stamp a label on a payload.",
          prompt: "Define **tag_packet(payload)** that returns the payload string with the prefix `[NET] ` in front of it.\n~~~lua\ntag_packet(\"ping\")  -- \"[NET] ping\"\n~~~\nBuild it with the **..** concatenation operator.",
          starter: "function tag_packet(payload)\n  -- TODO: prefix with \"[NET] \"\n  return \"\"\nend\n",
          solution: "function tag_packet(payload)\n  return \"[NET] \" .. payload\nend\n",
          tests: [
          { name: "tags a ping", code: "assert(tag_packet(\"ping\") == \"[NET] ping\", \"expected [NET] ping\")" },
          { name: "tags any payload", code: "assert(tag_packet(\"sync\") == \"[NET] sync\")" }
          ],
          hint: "return \"[NET] \" .. payload", lore: "Every packet wears the colors of its sender."
        },
        {
          id: "lua-handle", title: "USER HANDLE", kind: "function", difficulty: 2, xp: 120,
          brief: "Forge an operator handle.",
          prompt: "Define **make_handle(user, node)** that joins the two arguments with an `@` between them.\n~~~lua\nmake_handle(\"trinity\", \"zion\")  -- \"trinity@zion\"\n~~~\nUse a **local** variable to build the result, then **return** it.",
          starter: "function make_handle(user, node)\n  local handle = user\n  return handle\nend\n",
          solution: "function make_handle(user, node)\n  local handle = user .. \"@\" .. node\n  return handle\nend\n",
          tests: [
          { name: "joins user and node", code: "assert(make_handle(\"trinity\", \"zion\") == \"trinity@zion\", \"expected trinity@zion\")" },
          { name: "works for any pair", code: "assert(make_handle(\"morpheus\", \"neb\") == \"morpheus@neb\")" }
          ],
          hint: "local handle = user .. \"@\" .. node", lore: "A handle is the only true name in the wire."
        },
        {
          id: "lua-status", title: "STATUS LINE", kind: "function", difficulty: 2, xp: 120,
          brief: "Render a core's status report.",
          prompt: "Define **status_line(core, level)** where `core` is a string and `level` is a number. Return the report:\n~~~text\n<core>: level <level>\n~~~\nFor example `status_line(\"MAGI\", 7)` returns `\"MAGI: level 7\"`. Concatenating a number with **..** converts it to text automatically.",
          starter: "function status_line(core, level)\n  -- TODO\n  return core\nend\n",
          solution: "function status_line(core, level)\n  return core .. \": level \" .. level\nend\n",
          tests: [
          { name: "reports MAGI at 7", code: "assert(status_line(\"MAGI\", 7) == \"MAGI: level 7\", \"expected MAGI: level 7\")" },
          { name: "reports another core", code: "assert(status_line(\"HAL\", 9) == \"HAL: level 9\")" },
          { name: "handles level zero", code: "assert(status_line(\"GHOST\", 0) == \"GHOST: level 0\")" }
          ],
          hint: "return core .. \": level \" .. level", lore: "The status line never lies. Only the operators do."
        },
        {
          id: "lua-uplink", title: "UPLINK LOG", kind: "script", difficulty: 3, xp: 120,
          brief: "Print a three-line boot log.",
          prompt: "Store the call sign `\"NEB-7\"` in a **local** variable, then **print()** these three lines, in order, building each with **..**:\n~~~text\nUplink: NEB-7\nChannel open\nNEB-7 ready\n~~~\nUse the local variable for the call sign in lines 1 and 3 (do not hard-code it twice).",
          starter: "local sign = \"NEB-7\"\n-- TODO: print the three lines\n",
          solution: "local sign = \"NEB-7\"\nprint(\"Uplink: \" .. sign)\nprint(\"Channel open\")\nprint(sign .. \" ready\")\n",
          tests: [
          { name: "the channel is not silent", code: "assert(#stdout() > 0, \"Nothing printed. Use print().\")" },
          { name: "uplink line present", code: "assert(stdout():find(\"Uplink: NEB-7\", 1, true), \"missing line 1\")" },
          { name: "channel line present", code: "assert(stdout():find(\"Channel open\", 1, true), \"missing line 2\")" },
          { name: "ready line present", code: "assert(stdout():find(\"NEB-7 ready\", 1, true), \"missing line 3\")" }
          ],
          hint: "print(\"Uplink: \" .. sign) then print(\"Channel open\") then print(sign .. \" ready\")", lore: "Three lines and the hovercraft is yours."
        },
        {
          id: "lua-relay", title: "SIGNAL RELAY", kind: "function", difficulty: 3, xp: 120,
          brief: "Chain two helpers into one transmission.",
          prompt: "First define a helper **shout(text)** that returns `text` followed by `\"!\"`. Then define **relay(text)** that returns the result of `shout(text)` prefixed with `\">> \"`.\n~~~lua\nrelay(\"go\")  -- \">> go!\"\n~~~\nCall `shout` from inside `relay` and combine the pieces with **..**.",
          starter: "function shout(text)\n  -- TODO\n  return text\nend\n\nfunction relay(text)\n  -- TODO: prefix shout(text) with \">> \"\n  return text\nend\n",
          solution: "function shout(text)\n  return text .. \"!\"\nend\n\nfunction relay(text)\n  return \">> \" .. shout(text)\nend\n",
          tests: [
          { name: "shout adds a bang", code: "assert(shout(\"go\") == \"go!\", \"shout should append !\")" },
          { name: "relay chains shout", code: "assert(relay(\"go\") == \">> go!\", \"expected >> go!\")" },
          { name: "relay works on any text", code: "assert(relay(\"jack in\") == \">> jack in!\")" }
          ],
          hint: "relay returns \">> \" .. shout(text)", lore: "One signal, relayed, becomes a chorus."
        }
  ]);

  add("luam02-control", [
        {
          id: "lua-grade", title: "SIGNAL GRADE", kind: "function", difficulty: 1, xp: 120,
          brief: "Label a signal by strength.",
          prompt: "Define **signal_grade(strength)** that returns a label based on the number **strength**:\n- strength **< 30** -> \"WEAK\"\n- **30 to 69** -> \"OK\"\n- **70 or more** -> \"STRONG\"\n\nChain the cases with **if / elseif / else**.\n~~~lua\nsignal_grade(10)  -- \"WEAK\"\nsignal_grade(50)  -- \"OK\"\nsignal_grade(95)  -- \"STRONG\"\n~~~",
          starter: "function signal_grade(strength)\n  -- TODO: branch on strength\n  return \"\"\nend\n",
          solution: "function signal_grade(strength)\n  if strength < 30 then\n    return \"WEAK\"\n  elseif strength < 70 then\n    return \"OK\"\n  else\n    return \"STRONG\"\n  end\nend\n",
          tests: [
          { name: "weak signal", code: "assert(signal_grade(10) == \"WEAK\", \"expected WEAK\")" },
          { name: "ok signal", code: "assert(signal_grade(50) == \"OK\" and signal_grade(30) == \"OK\")" },
          { name: "strong signal", code: "assert(signal_grade(95) == \"STRONG\" and signal_grade(70) == \"STRONG\")" }
          ],
          hint: "if strength < 30 then ... elseif strength < 70 then ... else ... end", lore: "The tower reads the wire and renders its verdict."
        },
        {
          id: "lua-clamp", title: "VOLTAGE CLAMP", kind: "function", difficulty: 2, xp: 120,
          brief: "Pin a value inside a range.",
          prompt: "Define **clamp(value, low, high)** that pulls **value** back inside the range:\n- if value is **below low**, return **low**\n- if value is **above high**, return **high**\n- otherwise return **value** unchanged\n\nUse **if / elseif / else**.\n~~~lua\nclamp(5, 0, 10)   -- 5\nclamp(-3, 0, 10)  -- 0\nclamp(99, 0, 10)  -- 10\n~~~",
          starter: "function clamp(value, low, high)\n  -- TODO: clamp value between low and high\n  return value\nend\n",
          solution: "function clamp(value, low, high)\n  if value < low then\n    return low\n  elseif value > high then\n    return high\n  else\n    return value\n  end\nend\n",
          tests: [
          { name: "in range stays", code: "assert(clamp(5, 0, 10) == 5)" },
          { name: "below clamps to low", code: "assert(clamp(-3, 0, 10) == 0)" },
          { name: "above clamps to high", code: "assert(clamp(99, 0, 10) == 10)" },
          { name: "edges held", code: "assert(clamp(0, 0, 10) == 0 and clamp(10, 0, 10) == 10)" }
          ],
          hint: "if value < low then return low elseif value > high then return high else return value end", lore: "No surge escapes the regulator alive."
        },
        {
          id: "lua-maxcell", title: "PEAK CELL", kind: "function", difficulty: 2, xp: 120,
          brief: "Find the largest reactor cell.",
          prompt: "Define **max_cell(cells)** where **cells** is a non-empty array of numbers. Return the largest value. Start your best guess at `cells[1]`, then walk the array with **ipairs** and keep the bigger value whenever you find one.\n~~~lua\nmax_cell({3, 9, 4})    -- 9\nmax_cell({7})          -- 7\n~~~",
          starter: "function max_cell(cells)\n  local best = cells[1]\n  -- TODO: scan with ipairs and keep the largest\n  return 0\nend\n",
          solution: "function max_cell(cells)\n  local best = cells[1]\n  for _, v in ipairs(cells) do\n    if v > best then\n      best = v\n    end\n  end\n  return best\nend\n",
          tests: [
          { name: "peak in middle", code: "assert(max_cell({3, 9, 4}) == 9)" },
          { name: "single cell", code: "assert(max_cell({7}) == 7)" },
          { name: "peak at end", code: "assert(max_cell({1, 2, 8}) == 8 and max_cell({-5, -2, -9}) == -2)" }
          ],
          hint: "for _, v in ipairs(cells) do if v > best then best = v end end", lore: "One cell always burns hottest. Find it before it finds you."
        },
        {
          id: "lua-counthi", title: "OVER THRESHOLD", kind: "function", difficulty: 3, xp: 120,
          brief: "Count readings above a line.",
          prompt: "Define **count_above(readings, limit)** where **readings** is an array of numbers. Return how many entries are **strictly greater than limit**. Walk the array with **ipairs**, keep a counter, and bump it with `count = count + 1` (Lua has no `++`).\n~~~lua\ncount_above({2, 5, 9, 1}, 4)  -- 2   (5 and 9)\ncount_above({1, 2}, 9)        -- 0\n~~~",
          starter: "function count_above(readings, limit)\n  local count = 0\n  -- TODO: count entries strictly greater than limit\n  return -1\nend\n",
          solution: "function count_above(readings, limit)\n  local count = 0\n  for _, v in ipairs(readings) do\n    if v > limit then\n      count = count + 1\n    end\n  end\n  return count\nend\n",
          tests: [
          { name: "two over the line", code: "assert(count_above({2, 5, 9, 1}, 4) == 2)" },
          { name: "none over", code: "assert(count_above({1, 2}, 9) == 0)" },
          { name: "equal does not count", code: "assert(count_above({4, 4, 5}, 4) == 1 and count_above({10, 20, 30}, 0) == 3)" }
          ],
          hint: "for _, v in ipairs(readings) do if v > limit then count = count + 1 end end", lore: "Every spike past the redline is logged for the tribunal."
        },
        {
          id: "lua-doublewave", title: "DOUBLE WAVE", kind: "function", difficulty: 3, xp: 120,
          brief: "Build a new array of doubled values.",
          prompt: "Define **double_all(nums)** where **nums** is an array of numbers. Return a **new** array where every element is doubled, in the same order. Start with an empty table `{}`, loop the indices with a numeric for from **1** to **#nums**, and assign each result with `out[i] = nums[i] * 2`.\n~~~lua\ndouble_all({1, 2, 3})  -- {2, 4, 6}\ndouble_all({})         -- {}\n~~~",
          starter: "function double_all(nums)\n  local out = {}\n  -- TODO: for i = 1, #nums do out[i] = nums[i] * 2 end\n  return out\nend\n",
          solution: "function double_all(nums)\n  local out = {}\n  for i = 1, #nums do\n    out[i] = nums[i] * 2\n  end\n  return out\nend\n",
          tests: [
          { name: "doubles three", code: "local r = double_all({1, 2, 3}); assert(#r == 3 and r[1] == 2 and r[2] == 4 and r[3] == 6)" },
          { name: "empty stays empty", code: "local r = double_all({}); assert(#r == 0)" },
          { name: "preserves order and length", code: "local r = double_all({5, 0, -2}); assert(#r == 3 and r[1] == 10 and r[2] == 0 and r[3] == -4)" }
          ],
          hint: "for i = 1, #nums do out[i] = nums[i] * 2 end", lore: "Amplify the waveform, index by index, and ride it out."
        }
  ]);

  add("luam03-strings", [
        {
          id: "lua-yell", title: "ALL CAPS ALERT", kind: "function", difficulty: 1, xp: 120,
          brief: "Force a message into uppercase.",
          prompt: "Define **yell(msg)** that returns `msg` converted to all uppercase letters.\n~~~lua\nyell(\"breach\")  -- \"BREACH\"\n~~~\nUse the **string.upper** function (or the method form `msg:upper()`).",
          starter: "function yell(msg)\n  -- TODO: return msg in uppercase\n  return msg\nend\n",
          solution: "function yell(msg)\n  return string.upper(msg)\nend\n",
          tests: [
          { name: "shouts breach", code: "assert(yell(\"breach\") == \"BREACH\", \"expected BREACH\")" },
          { name: "uppercases mixed case", code: "assert(yell(\"Alert Now\") == \"ALERT NOW\")" },
          { name: "leaves digits alone", code: "assert(yell(\"node7\") == \"NODE7\")" }
          ],
          hint: "return string.upper(msg)", lore: "When the grid screams, it screams in capitals."
        },
        {
          id: "lua-keylen", title: "KEY LENGTH", kind: "function", difficulty: 2, xp: 120,
          brief: "Measure an access key.",
          prompt: "Define **key_length(key)** that returns the number of characters in the string `key`.\n~~~lua\nkey_length(\"abcd\")  -- 4\n~~~\nUse the **#** length operator on the string.",
          starter: "function key_length(key)\n  -- TODO: return the length of key\n  return 0\nend\n",
          solution: "function key_length(key)\n  return #key\nend\n",
          tests: [
          { name: "counts four", code: "assert(key_length(\"abcd\") == 4, \"expected 4\")" },
          { name: "counts longer key", code: "assert(key_length(\"override\") == 8)" },
          { name: "empty key is zero", code: "assert(key_length(\"\") == 0)" }
          ],
          hint: "return #key", lore: "A key too short opens nothing."
        },
        {
          id: "lua-prefix", title: "FIRST FRAGMENT", kind: "function", difficulty: 2, xp: 120,
          brief: "Slice the head off a string.",
          prompt: "Define **first_n(text, n)** that returns the first `n` characters of `text`.\n~~~lua\nfirst_n(\"hovercraft\", 5)  -- \"hover\"\n~~~\nUse **string.sub(text, 1, n)** (Lua strings are 1-indexed).",
          starter: "function first_n(text, n)\n  -- TODO: return the first n characters\n  return \"\"\nend\n",
          solution: "function first_n(text, n)\n  return string.sub(text, 1, n)\nend\n",
          tests: [
          { name: "takes first five", code: "assert(first_n(\"hovercraft\", 5) == \"hover\", \"expected hover\")" },
          { name: "takes first three", code: "assert(first_n(\"matrix\", 3) == \"mat\")" },
          { name: "n of one returns one char", code: "assert(first_n(\"zion\", 1) == \"z\")" }
          ],
          hint: "return string.sub(text, 1, n)", lore: "The first fragment tells you what kind of file you stole."
        },
        {
          id: "lua-vowelcount", title: "VOWEL SWEEP", kind: "function", difficulty: 3, xp: 120,
          brief: "Walk a string and tally the vowels.",
          prompt: "Define **count_vowels(text)** that returns how many lowercase vowels (`a`, `e`, `i`, `o`, `u`) appear in `text`. Walk the characters by index from `1` to `#text`, pull each one with **string.sub(text, i, i)**, and add to a counter when it is a vowel.\n~~~lua\ncount_vowels(\"matrix\")  -- 2\n~~~\nAssume `text` is already lowercase.",
          starter: "function count_vowels(text)\n  local total = 0\n  -- TODO: walk each char and count vowels\n  return total\nend\n",
          solution: "function count_vowels(text)\n  local total = 0\n  for i = 1, #text do\n    local c = string.sub(text, i, i)\n    if c == \"a\" or c == \"e\" or c == \"i\" or c == \"o\" or c == \"u\" then\n      total = total + 1\n    end\n  end\n  return total\nend\n",
          tests: [
          { name: "matrix has two", code: "assert(count_vowels(\"matrix\") == 2, \"expected 2\")" },
          { name: "counts all vowels", code: "assert(count_vowels(\"aeiou\") == 5)" },
          { name: "no vowels is zero", code: "assert(count_vowels(\"crypt\") == 0)" },
          { name: "empty string is zero", code: "assert(count_vowels(\"\") == 0)" }
          ],
          hint: "loop i = 1, #text and test string.sub(text, i, i) against each vowel", lore: "Strip the vowels and the message still breathes. Barely."
        },
        {
          id: "lua-titlecase", title: "CAPITALIZE NODE", kind: "function", difficulty: 3, xp: 120,
          brief: "Uppercase the first letter, lowercase the rest.",
          prompt: "Define **capitalize(word)** that returns `word` with its first character uppercased and every following character lowercased.\n~~~lua\ncapitalize(\"nEBuchadnezzar\")  -- \"Nebuchadnezzar\"\n~~~\nUse **string.sub** to split off the first character from the rest, then **string.upper** and **string.lower** on the pieces and join them with **..**. Return `\"\"` unchanged when `word` is empty.",
          starter: "function capitalize(word)\n  -- TODO: uppercase first char, lowercase the rest\n  return word\nend\n",
          solution: "function capitalize(word)\n  if #word == 0 then\n    return \"\"\n  end\n  local head = string.upper(string.sub(word, 1, 1))\n  local tail = string.lower(string.sub(word, 2))\n  return head .. tail\nend\n",
          tests: [
          { name: "normalizes mixed case", code: "assert(capitalize(\"nEBuchadnezzar\") == \"Nebuchadnezzar\", \"expected Nebuchadnezzar\")" },
          { name: "capitalizes lowercase word", code: "assert(capitalize(\"zion\") == \"Zion\")" },
          { name: "single char", code: "assert(capitalize(\"x\") == \"X\")" },
          { name: "empty stays empty", code: "assert(capitalize(\"\") == \"\")" }
          ],
          hint: "head = string.upper(string.sub(word,1,1)); tail = string.lower(string.sub(word,2)); return head .. tail", lore: "Even a ship's name deserves to be spelled with pride."
        }
  ]);
})();