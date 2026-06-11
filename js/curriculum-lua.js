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
Lua prints with **print()**. Strings concatenate with **..** (two dots), not +.
~~~lua
local name = "Lain"
print("Wake up, " .. name)
~~~

## Variables
Use **local** for variables (globals exist but locals are best practice).
~~~lua
local clearance = 7
~~~

## Functions
Define with **function ... end** and hand back with **return**.
~~~lua
function amplify(signal)
  return signal * 2
end
~~~

> INTEL — Lua uses **..** to join strings and **==** to compare. There is no ++; write x = x + 1.
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
~~~lua
if level < 1 then
  return "DENIED"
elseif level <= 2 then
  return "GUEST"
else
  return "ROOT"
end
~~~

## Tables
Tables are Lua's everything — arrays AND maps. Arrays are **1-indexed**. **#t** is the length.
~~~lua
local crew = {"Spike", "Jet", "Faye"}
print(crew[1])   -- Spike
print(#crew)     -- 3
~~~

## Looping a table
~~~lua
local total = 0
for _, v in ipairs({10, 20, 12}) do
  total = total + v
end
~~~

> WARNING — Lua arrays start at 1, not 0. The first element is t[1].
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
Strings carry methods you call with a colon, or via the **string** table:
~~~lua
local s = "lain"
print(s:upper())        -- LAIN
print(string.reverse(s)) -- nial
print(#s)               -- 4   (length)
print(s:sub(1, 2))      -- la  (chars 1..2)
~~~

## Walking characters
**#s** is the length; **s:sub(i, i)** is the i-th character (1-indexed).
~~~lua
for i = 1, #s do
  print(s:sub(i, i))
end
~~~

> INTEL — s:upper() and string.upper(s) are the same call, two ways.
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
