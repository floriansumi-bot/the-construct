/* ============================================================
   curriculum-lua.js — LUA track (Lua 5.4 / wasmoon).
   Tests are Lua snippets using native assert(cond, msg).
   stdout() (injected) returns captured print() output.
   ============================================================ */
(function () {
  window.registerTrack({
    id: "lua",
    name: "LUA",
    code: "LUA",
    runtime: "lua",
    ext: "lua",
    prism: "lua",
    accent: "#8899ff",
    blurb: "The featherweight scripting language that lives inside games, engines and embedded systems.",
    intro: "Lua 5.4 runs in your browser via WASM. Tiny, fast, embeddable — the scripting layer of countless games and tools. Define functions, the engine asserts your work.",
    modules: [

      /* ---------- LUA 0x01 ---------- */
      {
        id: "luam01-core", code: "0x01", title: "CORE ROUTINES",
        subtitle: "print · variables · functions · strings",
        theory: `
## Hello, operator
**print()** writes a line to the console — your window into a running program.
**WHY** — it is how you make the machine talk back: check a value, trace a bug, transmit a signal to the operator.
~~~lua
print("Wake up, operator")
~~~

To stitch text together, Lua uses **..** — two dots, the concatenation operator.
**WHY** — you rarely send a fixed string; you splice a name, a status, a number into a message.
~~~lua
local name = "Lain"
print("Wake up, " .. name)   -- Wake up, Lain
~~~

> WARNING — Strings join with **..**, never with **+**. The plus sign is for math only; "a" + "b" is an error in Lua.

## Variables
A variable is a labeled slot in memory. Declare it with **local**, then read or overwrite it by name.
**WHY** — store a value once, reuse it everywhere, and change it in one place instead of retyping it.
~~~lua
local clearance = 7
clearance = clearance + 1   -- now 8
~~~

> WARNING — Always write **local** when you create a variable. Drop it and Lua makes the name a hidden GLOBAL that leaks across your whole program. Also: there is no **++** — bump a number with x = x + 1.

## Functions
A function is a named, reusable block of logic. It takes inputs (parameters), runs, and hands a result back with **return**.
**WHY** — package a routine once and call it a hundred times. Less repetition, fewer bugs, cleaner core.
~~~lua
function amplify(signal)
  return signal * 2
end

print(amplify(21))   -- 42
~~~

> WARNING — **=** assigns (puts a value in a slot); **==** compares (asks "are these equal?"). Mixing them up is the classic rookie crash.

> INTEL — Define a function with **function ... end**. Once **return** fires, the function stops — nothing after it on that path runs.
`,
        exercises: [
          {
            id: "lua-wake", title: "WAKE UP", kind: "script", difficulty: 1, xp: 100,
            brief: "Transmit the signal.",
            prompt: `
Print these three lines, exactly, in order, using **print()**:
~~~text
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.
~~~
`,
            starter: `-- print the three lines
`,
            solution: `print("Wake up, Neo...")
print("The Matrix has you...")
print("Follow the white rabbit.")
`,
            tests: [
              { name: "the channel is not silent", code: `assert(#stdout() > 0, "Nothing printed. Use print().")` },
              { name: "all three lines present, in order", code: `local o = stdout()
assert(o:find("Wake up, Neo...", 1, true), "missing line 1")
assert(o:find("The Matrix has you...", 1, true), "missing line 2")
assert(o:find("Follow the white rabbit.", 1, true), "missing line 3")` },
            ],
            hint: `Three print() calls, one per line.`,
            lore: "The Matrix has you.",
          },
          {
            id: "lua-amplify", title: "AMPLIFY", kind: "function", difficulty: 1, xp: 120,
            brief: "Double the signal.",
            prompt: `
Define **amplify(signal)** that returns the signal times 2.
~~~lua
amplify(21)  -- 42
~~~
`,
            starter: `function amplify(signal)
  -- TODO
  return 0
end
`,
            solution: `function amplify(signal)
  return signal * 2
end
`,
            tests: [
              { name: "amplify(21) -> 42", code: `assert(amplify(21) == 42, "amplify(21) should be 42")` },
              { name: "works across the range", code: `assert(amplify(5) == 10 and amplify(0) == 0 and amplify(-3) == -6)` },
            ],
            hint: `return signal * 2`,
            lore: "Crank the gain.",
          },
          {
            id: "lua-boot", title: "AI BOOTUP", kind: "function", difficulty: 1, xp: 120,
            brief: "Bring a core online.",
            prompt: `
Define **boot_message(name)** that returns the string:
~~~text
<name> online. All systems nominal.
~~~
Build it with the **..** concatenation operator.
`,
            starter: `function boot_message(name)
  -- TODO
  return ""
end
`,
            solution: `function boot_message(name)
  return name .. " online. All systems nominal."
end
`,
            tests: [
              { name: "boots MAGI", code: `assert(boot_message("MAGI") == "MAGI online. All systems nominal.")` },
              { name: "uses the argument", code: `assert(boot_message("Tachikoma") == "Tachikoma online. All systems nominal.")` },
            ],
            hint: `return name .. " online. All systems nominal."`,
            lore: "Project 2501 is awake.",
          },
        ],
      },

      /* ---------- LUA 0x02 ---------- */
      {
        id: "luam02-control", code: "0x02", title: "CONTROL & TABLES",
        subtitle: "if/elseif · for · tables · ipairs",
        theory: `
## Branching
**if / elseif / else** lets your code choose a path based on a condition that is true or false.
**WHY** — a program that can't decide is just a calculator. Branching is how it reacts: grant or deny, fire or hold.
~~~lua
if level < 1 then
  return "DENIED"
elseif level <= 2 then
  return "GUEST"
else
  return "ROOT"
end
~~~
Lua checks each test top to bottom and takes the FIRST one that is true. **else** is the fallback when none match. Comparisons return true/false: **==** equal, **~=** not-equal, **< > <= >=**.

> WARNING — Use **==** to compare and **=** to assign — they are not interchangeable. And "not equal" in Lua is **~=**, not != like other languages.

## Tables
A table is Lua's one container for everything — it works as a list (array) AND as a key/value map.
**WHY** — almost all real data is plural: a crew, a inventory, a stream of readings. A table holds the whole set under one name.
~~~lua
local crew = {"Spike", "Jet", "Faye"}
print(crew[1])   -- Spike   (first slot)
print(#crew)     -- 3       (how many)
~~~
Index a slot with square brackets **crew[1]**. The **#** operator gives the length of an array-style table.

> WARNING — Lua arrays are **1-INDEXED**: the first element is **t[1]**, not t[0]. Reaching for index 0 gives you nil. (This trips up almost everyone coming from other languages.)

## Looping a table
A **numeric for** counts through a range; **ipairs** walks an array in order, handing you each index and value.
**WHY** — to act on every element — sum them, transform them, search them — without writing the same line N times.
~~~lua
local total = 0
for _, v in ipairs({10, 20, 12}) do
  total = total + v   -- 10, then 30, then 42
end

for i = 1, 3 do       -- numeric for: 1, 2, 3
  print(i)
end
~~~
The **_** is a throwaway name for the index when you only care about the value.

> WARNING — Don't compare two tables with **==** to check their contents — that test is reference equality. {1,2} == {1,2} is **false** because they are two different objects in memory, even though they look alike.
`,
        exercises: [
          {
            id: "lua-even", title: "PARITY CHECK", kind: "function", difficulty: 1, xp: 120,
            brief: "Flag the even packets.",
            prompt: `
Define **is_even(n)** returning a boolean — true if n is even, else false. Use the modulo operator **%**.
`,
            starter: `function is_even(n)
  -- TODO
  return false
end
`,
            solution: `function is_even(n)
  return n % 2 == 0
end
`,
            tests: [
              { name: "even -> true", code: `assert(is_even(4) == true and is_even(0) == true)` },
              { name: "odd -> false", code: `assert(is_even(7) == false and is_even(-3) == false)` },
            ],
            hint: `return n % 2 == 0`,
            lore: "Parity holds.",
          },
          {
            id: "lua-clearance", title: "ACCESS TIERS", kind: "function", difficulty: 2, xp: 150,
            brief: "Map levels to tiers.",
            prompt: `
Define **clearance(level)** returning:
- level **< 1** -> "DENIED"
- **1-2** -> "GUEST"
- **3-4** -> "OPERATOR"
- **5+** -> "ROOT"
`,
            starter: `function clearance(level)
  -- TODO
  return "?"
end
`,
            solution: `function clearance(level)
  if level < 1 then
    return "DENIED"
  elseif level <= 2 then
    return "GUEST"
  elseif level <= 4 then
    return "OPERATOR"
  else
    return "ROOT"
  end
end
`,
            tests: [
              { name: "below 1 -> DENIED", code: `assert(clearance(0) == "DENIED" and clearance(-4) == "DENIED")` },
              { name: "1-2 -> GUEST", code: `assert(clearance(1) == "GUEST" and clearance(2) == "GUEST")` },
              { name: "3-4 -> OPERATOR", code: `assert(clearance(3) == "OPERATOR" and clearance(4) == "OPERATOR")` },
              { name: "5+ -> ROOT", code: `assert(clearance(5) == "ROOT" and clearance(99) == "ROOT")` },
            ],
            hint: `Chain with if / elseif / else, ending in ROOT.`,
            lore: "Access is earned.",
          },
          {
            id: "lua-sum", title: "POWER ACCUMULATOR", kind: "function", difficulty: 2, xp: 150,
            brief: "Sum the reactor cells.",
            prompt: `
Define **total_power(cells)** where **cells** is a table (array) of numbers. Return their sum. Loop with **ipairs**.
~~~lua
total_power({10, 20, 12})  -- 42
~~~
`,
            starter: `function total_power(cells)
  local total = 0
  -- TODO: loop and add
  return total
end
`,
            solution: `function total_power(cells)
  local total = 0
  for _, v in ipairs(cells) do
    total = total + v
  end
  return total
end
`,
            tests: [
              { name: "sums a table", code: `assert(total_power({10, 20, 12}) == 42 and total_power({1, 2, 3, 4}) == 10)` },
              { name: "empty -> 0", code: `assert(total_power({}) == 0)` },
              { name: "handles negatives", code: `assert(total_power({10, -4, 2}) == 8)` },
            ],
            hint: `for _, v in ipairs(cells) do total = total + v end`,
            lore: "Every cell counts.",
          },
        ],
      },

      /* ---------- LUA 0x03 ---------- */
      {
        id: "luam03-strings", code: "0x03", title: "STRING LIBRARY",
        subtitle: "string methods · # length · sub",
        theory: `
## The string library
Every Lua string comes wired with a toolkit of methods. Call them with a colon — **s:upper()** — or through the **string** table — **string.upper(s)**.
**WHY** — text is everywhere: names, codes, messages. The string library transforms and inspects it so you don't hand-roll the logic yourself.
~~~lua
local s = "lain"
print(s:upper())         -- LAIN   (uppercase copy)
print(string.reverse(s)) -- nial   (reversed copy)
print(#s)                -- 4      (length)
print(s:sub(1, 2))       -- la     (chars 1 through 2)
~~~
**s:sub(i, j)** returns the slice from position **i** to **j**, inclusive. **#s** measures the length.

> WARNING — These methods return a NEW string; the original **s** is never changed. Lua strings are immutable, so capture the result: s = s:upper() — calling s:upper() alone throws the answer away.

## Walking characters
To read a string one character at a time, count from 1 to **#s** and pull each slot with **s:sub(i, i)** (start and end equal = a single character).
**WHY** — counting, searching, filtering, encrypting — anything per-character starts with walking the string.
~~~lua
for i = 1, #s do
  print(s:sub(i, i))   -- l, then a, then i, then n
end
~~~

> WARNING — String positions are **1-INDEXED**, just like tables: the first character is **s:sub(1, 1)**, not s:sub(0, 0). Position 0 is not the start.

> INTEL — **s:upper()** and **string.upper(s)** are the exact same call written two ways. The colon form quietly passes **s** as the first argument for you.
`,
        exercises: [
          {
            id: "lua-reverse", title: "PALINDROME ICE", kind: "function", difficulty: 1, xp: 130,
            brief: "Reverse the packet.",
            prompt: `
Define **reverse_signal(s)** returning the string reversed. Use the string library.
~~~lua
reverse_signal("LAIN")  -- "NIAL"
~~~
`,
            starter: `function reverse_signal(s)
  -- TODO
  return s
end
`,
            solution: `function reverse_signal(s)
  return s:reverse()
end
`,
            tests: [
              { name: "reverses text", code: `assert(reverse_signal("LAIN") == "NIAL")` },
              { name: "edge cases", code: `assert(reverse_signal("") == "" and reverse_signal("a") == "a")` },
            ],
            hint: `return s:reverse()  -- or string.reverse(s)`,
            lore: "Close the world, open the nExT.",
          },
          {
            id: "lua-shout", title: "AMPLITUDE", kind: "function", difficulty: 1, xp: 130,
            brief: "Shout the track name.",
            prompt: `
Define **shout(s)** returning the string upper-cased with a single **!** appended.
~~~lua
shout("daft")  -- "DAFT!"
~~~
`,
            starter: `function shout(s)
  -- TODO
  return s
end
`,
            solution: `function shout(s)
  return s:upper() .. "!"
end
`,
            tests: [
              { name: "shouts", code: `assert(shout("daft") == "DAFT!")` },
              { name: "already loud", code: `assert(shout("punk") == "PUNK!")` },
            ],
            hint: `return s:upper() .. "!"`,
            lore: "ONE MORE TIME.",
          },
          {
            id: "lua-count", title: "SIGNAL COUNT", kind: "function", difficulty: 2, xp: 160,
            brief: "Count a character in the stream.",
            prompt: `
Define **count_char(s, ch)** returning how many times the single character **ch** appears in **s**. Walk the string with a numeric for loop and **s:sub(i, i)**.
~~~lua
count_char("aab", "a")  -- 2
~~~
`,
            starter: `function count_char(s, ch)
  local n = 0
  -- TODO
  return n
end
`,
            solution: `function count_char(s, ch)
  local n = 0
  for i = 1, #s do
    if s:sub(i, i) == ch then
      n = n + 1
    end
  end
  return n
end
`,
            tests: [
              { name: "counts repeats", code: `assert(count_char("aab", "a") == 2)` },
              { name: "absent -> 0", code: `assert(count_char("wired", "z") == 0)` },
              { name: "every char", code: `assert(count_char("aaaa", "a") == 4)` },
            ],
            hint: `Loop i = 1, #s; if s:sub(i, i) == ch then n = n + 1 end.`,
            lore: "Counting packets in the Wired.",
          },
        ],
      },

    ],
  });
})();
