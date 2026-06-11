/* ============================================================
   curriculum-ruby.js — RUBY track (CRuby via ruby.wasm).
   Tests are Ruby using assert / assert_equal / assert_raises.
   stdout() returns captured puts/print output.
   ============================================================ */
(function () {
  window.registerTrack({
    id: "ruby",
    name: "RUBY",
    code: "RB",
    runtime: "ruby",
    ext: "rb",
    prism: "ruby",
    accent: "#ff5d5d",
    blurb: "The language optimized for developer happiness. Elegant objects, blocks, and Rails.",
    intro: "Real CRuby (ruby.wasm) runs in your browser. The first Ruby node downloads the interpreter (~34MB, one time). Expressive, object-oriented, joyful.",
    modules: [

      /* ---------- RB 0x01 ---------- */
      {
        id: "rbm01-core", code: "0x01", title: "FIRST LIGHT",
        subtitle: "puts · methods · string interpolation",
        theory: `
## Speaking Ruby
Ruby prints with **puts**. Strings interpolate with **#{...}** inside double quotes.
~~~ruby
name = "Lain"
puts "Wake up, #{name}"
~~~

## Methods
Define with **def ... end**. The last expression is returned automatically — **return** is optional.
~~~ruby
def amplify(signal)
  signal * 2
end
~~~

> INTEL — Ruby returns the last evaluated line implicitly. Clean and quiet.
`,
        exercises: [
          {
            id: "rb-wake", title: "WAKE UP", kind: "script", difficulty: 1, xp: 100,
            brief: "Transmit the signal.",
            prompt: `
Print these three lines, exactly, in order, using **puts**:
~~~text
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.
~~~
`,
            starter: `# puts the three lines
`,
            solution: `puts "Wake up, Neo..."
puts "The Matrix has you..."
puts "Follow the white rabbit."
`,
            tests: [
              { name: "the channel is not silent", code: `assert(stdout().length > 0, "Nothing printed. Use puts.")` },
              { name: "all three lines present", code: `o = stdout()
assert(o.include?("Wake up, Neo..."), "missing line 1")
assert(o.include?("The Matrix has you..."), "missing line 2")
assert(o.include?("Follow the white rabbit."), "missing line 3")` },
            ],
            hint: `Three puts calls.`,
            lore: "The Matrix has you.",
          },
          {
            id: "rb-amplify", title: "AMPLIFY", kind: "function", difficulty: 1, xp: 120,
            brief: "Double the signal.",
            prompt: `
Define a method **amplify(signal)** that returns the signal times 2.
~~~ruby
amplify(21)  # 42
~~~
`,
            starter: `def amplify(signal)
  # TODO
  0
end
`,
            solution: `def amplify(signal)
  signal * 2
end
`,
            tests: [
              { name: "amplify(21) -> 42", code: `assert_equal(amplify(21), 42)` },
              { name: "works across the range", code: `assert(amplify(5) == 10 && amplify(0) == 0 && amplify(-3) == -6)` },
            ],
            hint: `The last line is returned: signal * 2`,
            lore: "Crank the gain.",
          },
          {
            id: "rb-boot", title: "AI BOOTUP", kind: "function", difficulty: 1, xp: 120,
            brief: "Bring a core online.",
            prompt: `
Define **boot_message(name)** returning:
~~~text
<name> online. All systems nominal.
~~~
Use string interpolation: **#{name}**.
`,
            starter: `def boot_message(name)
  # TODO
  ""
end
`,
            solution: `def boot_message(name)
  "#{name} online. All systems nominal."
end
`,
            tests: [
              { name: "boots MAGI", code: `assert_equal(boot_message("MAGI"), "MAGI online. All systems nominal.")` },
              { name: "uses the argument", code: `assert_equal(boot_message("Motoko"), "Motoko online. All systems nominal.")` },
            ],
            hint: `"#{name} online. All systems nominal."`,
            lore: "Ghost in the shell, online.",
          },
        ],
      },

      /* ---------- RB 0x02 ---------- */
      {
        id: "rbm02-blocks", code: "0x02", title: "COLLECTIONS & BLOCKS",
        subtitle: "arrays · select · map · sum",
        theory: `
## Arrays & blocks
Ruby's power is **blocks** — chunks of code you pass to methods with **{ |x| ... }**.
~~~ruby
[1, 2, 3, 4].select { |n| n.even? }   # [2, 4]
[1, 2, 3].map { |n| n * 2 }           # [2, 4, 6]
[10, 20, 12].sum                      # 42
~~~

## Hashes
Key/value, often with symbol keys:
~~~ruby
track = { name: "Da Funk", bpm: 112 }
track[:bpm]   # 112
~~~

> INTEL — **select** keeps matching items, **map** transforms each, **sum** folds them. Chain them freely.
`,
        exercises: [
          {
            id: "rb-even", title: "PARITY CHECK", kind: "function", difficulty: 1, xp: 120,
            brief: "Flag even packets.",
            prompt: `
Define **is_even(n)** returning a boolean — true if n is even. Ruby integers even have an **.even?** method.
`,
            starter: `def is_even(n)
  # TODO
  false
end
`,
            solution: `def is_even(n)
  n.even?
end
`,
            tests: [
              { name: "even -> true", code: `assert(is_even(4) == true && is_even(0) == true)` },
              { name: "odd -> false", code: `assert(is_even(7) == false && is_even(-3) == false)` },
            ],
            hint: `n.even?  (or n % 2 == 0)`,
            lore: "Parity holds.",
          },
          {
            id: "rb-sum", title: "POWER ACCUMULATOR", kind: "function", difficulty: 1, xp: 130,
            brief: "Sum the cells.",
            prompt: `
Define **total_power(cells)** where **cells** is an array of numbers. Return their sum.
~~~ruby
total_power([10, 20, 12])  # 42
~~~
`,
            starter: `def total_power(cells)
  # TODO
  0
end
`,
            solution: `def total_power(cells)
  cells.sum
end
`,
            tests: [
              { name: "sums an array", code: `assert_equal(total_power([10, 20, 12]), 42)` },
              { name: "empty -> 0", code: `assert_equal(total_power([]), 0)` },
              { name: "handles negatives", code: `assert_equal(total_power([10, -4, 2]), 8)` },
            ],
            hint: `cells.sum`,
            lore: "Every cell counts.",
          },
          {
            id: "rb-loud", title: "FREQUENCY FILTER", kind: "function", difficulty: 2, xp: 170,
            brief: "Filter the set for bangers.",
            prompt: `
**tracks** is an array of hashes like **{ name: "Spice", bpm: 128 }**. Define **loud_tracks(tracks)** returning an array of the **names** whose bpm is **>= 120**, in order. Use select + map.
`,
            starter: `def loud_tracks(tracks)
  # TODO
  []
end
`,
            solution: `def loud_tracks(tracks)
  tracks.select { |t| t[:bpm] >= 120 }.map { |t| t[:name] }
end
`,
            tests: [
              { name: "keeps bpm >= 120", code: `data = [{ name: "Lull", bpm: 90 }, { name: "Spice", bpm: 128 }, { name: "Wired", bpm: 140 }]
assert_equal(loud_tracks(data), ["Spice", "Wired"])` },
              { name: "boundary 120 included", code: `assert_equal(loud_tracks([{ name: "X", bpm: 120 }]), ["X"])` },
              { name: "empty -> empty", code: `assert_equal(loud_tracks([]), [])` },
            ],
            hint: `tracks.select { |t| t[:bpm] >= 120 }.map { |t| t[:name] }`,
            lore: "Drop the bass in Night City.",
          },
        ],
      },

      /* ---------- RB 0x03 ---------- */
      {
        id: "rbm03-objects", code: "0x03", title: "STRINGS & OBJECTS",
        subtitle: "string methods · classes · attr",
        theory: `
## Strings
~~~ruby
"lain".upcase     # "LAIN"
"LAIN".reverse    # "NIAL"
"lain".length     # 4
~~~

## Classes
Everything in Ruby is an object. Define your own with **class ... end** and an **initialize** constructor. **@var** is an instance variable; **attr_reader** exposes it.
~~~ruby
class Mech
  attr_reader :hp
  def initialize(name, hp)
    @name = name
    @hp = hp
  end
  def damage(amount)
    @hp = [0, @hp - amount].max
  end
end
~~~

> INTEL — [0, x].max is a neat clamp: it never returns below 0.
`,
        exercises: [
          {
            id: "rb-reverse", title: "PALINDROME ICE", kind: "function", difficulty: 1, xp: 130,
            brief: "Reverse the packet.",
            prompt: `
Define **reverse_signal(s)** returning the string reversed.
~~~ruby
reverse_signal("LAIN")  # "NIAL"
~~~
`,
            starter: `def reverse_signal(s)
  # TODO
  s
end
`,
            solution: `def reverse_signal(s)
  s.reverse
end
`,
            tests: [
              { name: "reverses text", code: `assert_equal(reverse_signal("LAIN"), "NIAL")` },
              { name: "edge cases", code: `assert(reverse_signal("") == "" && reverse_signal("a") == "a")` },
            ],
            hint: `s.reverse`,
            lore: "Close the world, open the nExT.",
          },
          {
            id: "rb-shout", title: "AMPLITUDE", kind: "function", difficulty: 1, xp: 130,
            brief: "Shout the track.",
            prompt: `
Define **shout(s)** returning the string upper-cased with a single **!** appended.
~~~ruby
shout("daft")  # "DAFT!"
~~~
`,
            starter: `def shout(s)
  # TODO
  s
end
`,
            solution: `def shout(s)
  s.upcase + "!"
end
`,
            tests: [
              { name: "shouts", code: `assert_equal(shout("daft"), "DAFT!")` },
              { name: "again", code: `assert_equal(shout("punk"), "PUNK!")` },
            ],
            hint: `s.upcase + "!"`,
            lore: "ONE MORE TIME.",
          },
          {
            id: "rb-mech", title: "MECH PILOT", kind: "function", difficulty: 3, xp: 200,
            brief: "Model an EVA unit as a class.",
            prompt: `
Define a class **Mech** with:
- **initialize(name, hp)** storing both (expose hp via **attr_reader :hp**)
- **damage(amount)** that subtracts amount from hp, never below **0**, and returns the new hp
~~~ruby
m = Mech.new("Unit-01", 400)
m.damage(150)   # 250
m.damage(999)   # 0   (clamped)
~~~
`,
            starter: `class Mech
  # TODO: attr_reader, initialize, damage
end
`,
            solution: `class Mech
  attr_reader :hp
  def initialize(name, hp)
    @name = name
    @hp = hp
  end
  def damage(amount)
    @hp = [0, @hp - amount].max
  end
end
`,
            tests: [
              { name: "constructor stores hp", code: `m = Mech.new("Unit-01", 400)
assert_equal(m.hp, 400)` },
              { name: "damage reduces and returns hp", code: `m = Mech.new("Unit-01", 400)
assert_equal(m.damage(150), 250)
assert_equal(m.hp, 250)` },
              { name: "hp clamps at 0", code: `m = Mech.new("Unit-00", 100)
m.damage(999)
assert_equal(m.hp, 0)` },
            ],
            hint: `Use attr_reader :hp; in damage set @hp = [0, @hp - amount].max`,
            lore: "Get in the robot, Shinji.",
          },
        ],
      },

    ],
  });
})();
