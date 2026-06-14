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
## Speaking Ruby — puts
**puts** writes a line to the console and drops the cursor to the next line. **WHY** — it is your window into the machine: the fastest way to see what your code is actually doing.
~~~ruby
puts "Wake up, Neo..."
puts "The Matrix has you..."
~~~
Each **puts** prints its own line, so the two calls above stack into two lines of output.

## String interpolation — #{...}
Drop a live value into the middle of a string with **#{...}**. Ruby evaluates whatever is inside the braces and splices the result straight into the text. **WHY** — it beats gluing strings together with **+**, and it reads like plain language.
~~~ruby
name = "Lain"
puts "Wake up, #{name}"   # Wake up, Lain
~~~

> WARNING — Interpolation **#{...}** only fires inside **double quotes**. In single quotes, 'Hi #{name}' prints the literal characters #{name}, untouched. When in doubt, use double quotes.

## Methods — def ... end
A method is a named, reusable block of logic. Define it with **def**, close it with **end**, and feed it inputs called parameters. **WHY** — write the logic once, call it by name a thousand times.
~~~ruby
def amplify(signal)
  signal * 2
end

amplify(21)   # 42
~~~
Ruby hands back the value of the **last line it evaluates** — here, **signal * 2** — so you almost never type **return**.

> WARNING — The last line is returned **implicitly**. Beginners sprinkle **return** everywhere or add a stray **puts** as the final line — that makes the method return **nil** instead of your value. Let the last expression speak for itself.

> INTEL — Ruby returns the last evaluated line automatically. Clean, quiet, and very Ruby.
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
## Arrays
An **array** is an ordered list of values, written inside square brackets. **WHY** — most data comes in batches: signals, tracks, scores. An array holds the whole batch in one variable.
~~~ruby
levels = [10, 20, 12]
levels[0]      # 10  (counting starts at zero)
levels.length  # 3
~~~

## Blocks — { |x| ... }
A **block** is a chunk of code you hand to a method. The method runs your block once per item, passing each item into the **|x|** slot. **WHY** — instead of writing loops by hand, you describe what to do with one item and let Ruby walk the whole list.
~~~ruby
[1, 2, 3].each { |n| puts n }   # prints 1, then 2, then 3
~~~

## select — keep what matches
**select** runs the block on each item and keeps only the ones where the block is **true**. **WHY** — it is a filter: pull out just the items you care about.
~~~ruby
[1, 2, 3, 4].select { |n| n.even? }   # [2, 4]
~~~

## map — transform each
**map** runs the block on each item and collects the **results** into a brand-new array. **WHY** — reshape a whole list at once: double every number, grab every name.
~~~ruby
[1, 2, 3].map { |n| n * 2 }   # [2, 4, 6]
~~~

> WARNING — **map** returns a **new array** and leaves the original alone. The bang version **map!** rewrites the original array in place. Reach for plain **map** unless you truly mean to mutate.

## sum — fold to one number
**sum** adds every element together into a single total. **WHY** — totals and aggregates without a manual loop. You can chain it after **select** or **map**.
~~~ruby
[10, 20, 12].sum   # 42
~~~

## Hashes — symbol keys
A **hash** stores **key → value** pairs, like a labelled record. Keys are often **symbols** — names that start with a colon, like **:bpm**. **WHY** — when each item has named fields (a track has a name and a bpm), a hash beats remembering which array slot held what.
~~~ruby
track = { name: "Da Funk", bpm: 112 }
track[:bpm]   # 112
~~~

> WARNING — A symbol **:bpm** is **not** the string "bpm". If you built the hash with symbol keys, look values up with the symbol: **track[:bpm]**, never **track["bpm"]** — that returns **nil**.

> INTEL — **select** filters, **map** transforms, **sum** folds. Each returns a value you can feed to the next — chain them into a single elegant line.
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
## String methods
A string carries a toolbox of built-in methods for reshaping text. **WHY** — cleaning, formatting, and transforming text is half of real-world code, and Ruby gives you a verb for each job.
~~~ruby
"lain".upcase       # "LAIN"   (all caps)
"LAIN".reverse      # "NIAL"   (back to front)
"lain".length       # 4        (how many characters)
"signal".sub("s", "S")  # "Signal"  (replace first match)
~~~

> WARNING — These methods return a **new** string and leave the original unchanged. So **s.upcase** alone does nothing lasting — you must **use** the value, e.g. **loud = s.upcase**, or reassign it. The bang twins like **upcase!** edit the string in place.

## Classes — class ... end
Everything in Ruby is an **object**, and a **class** is the blueprint that defines a new kind of object. **WHY** — when data and the actions on that data belong together (a mech has hit points, and it takes damage), a class bundles them into one tidy unit.
~~~ruby
class Mech
  def initialize(name, hp)
    @name = name
    @hp = hp
  end
end

m = Mech.new("Unit-01", 400)
~~~
**initialize** is the **constructor** — Ruby runs it automatically when you call **.new**, wiring up the object's starting state.

## Instance variables — @ivars
A name starting with **@**, like **@hp**, is an **instance variable**: it belongs to one particular object and lives for as long as that object does. **WHY** — it is the object's private memory, remembered across every method call on that object.

## attr_reader — open a window
By default, **@ivars are hidden** from the outside world. **attr_reader :hp** generates a public **hp** method so other code can read it with **m.hp**. **WHY** — it exposes exactly what you choose, no more, in one clean line.
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

m = Mech.new("Unit-01", 400)
m.hp   # 400  (readable thanks to attr_reader)
~~~

> WARNING — Without **attr_reader :hp**, calling **m.hp** from outside crashes with a NoMethodError — the **@hp** variable still exists, it is just sealed inside the object. **attr_reader** is the window that lets the outside read it.

> INTEL — **[0, x].max** is a neat clamp: it never lets the value fall below 0, so a battered mech bottoms out at zero hp instead of going negative.
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
