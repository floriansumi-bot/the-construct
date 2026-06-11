/* THE CONSTRUCT — Python exercise PACK 6
   Adds exercises to:
     - m11-regex  (REGULAR EXPRESSIONS, the re module)  — 5 new
     - m12-oop    (OBJECT-ORIENTED PROGRAMMING)          — 5 new
   Authored per _verify/PACK_SPEC.md. Self-verified with the real harness: BAD: 0. */
(function () {
  window.addExercises("python", "m11-regex", [
    {
      id: "regex-count-signals",
      title: "COUNT THE SIGNALS",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Tally every numeric burst on the wire.",
      prompt: `
A sensor log is full of numbers buried in text. Define **count_signals(text)** that **returns how many runs of digits** appear, using **re.findall**. A run is one-or-more digits in a row, so "42" counts as **one** signal, not two.

~~~python
count_signals("sector 7 grid 42 node 108") -> 3
count_signals("all quiet on the wire")      -> 0
~~~

Remember to **import re**.
`,
      starter: `import re

def count_signals(text):
    # TODO: count runs of digits using re.findall
    pass
`,
      solution: `import re

def count_signals(text):
    return len(re.findall(r"\\d+", text))
`,
      tests: [
        { name: "three numeric bursts", code: `assert count_signals("sector 7 grid 42 node 108")==3, repr(count_signals("sector 7 grid 42 node 108"))` },
        { name: "no digits -> 0", code: `assert count_signals("all quiet on the wire")==0` },
        { name: "runs count once each", code: `assert count_signals("2099-2100")==2, "Each run of digits counts as one match."` },
      ],
      hint: `re.findall(r"\\d+", text) returns a list of every digit-run; take its len(). The + means one-or-more digits, so "42" is a single match.`,
      lore: "Carrier wave detected. Triangulating source...",
    },
    {
      id: "regex-telemetry-pairs",
      title: "TELEMETRY PAIRS",
      kind: "function",
      difficulty: 1,
      xp: 130,
      brief: "Pull key=value tokens into a list.",
      prompt: `
A status packet carries tokens like \`hp=400 ap=120\`. Define **parse_pairs(text)** that **returns a list of (key, value) tuples** for every \`key=value\` token. Use **re.findall** with **two capture groups** — when a pattern has groups, findall returns the groups.

~~~python
parse_pairs("hp=400 ap=120 lvl=9") -> [("hp","400"), ("ap","120"), ("lvl","9")]
~~~

A key/value here is one-or-more word characters (\`\\w\`). Both stay as **strings**.
`,
      starter: `import re

def parse_pairs(text):
    # TODO: return list of (key, value) tuples from key=value tokens
    pass
`,
      solution: `import re

def parse_pairs(text):
    return re.findall(r"(\\w+)=(\\w+)", text)
`,
      tests: [
        { name: "extracts all pairs", code: `assert parse_pairs("hp=400 ap=120 lvl=9")==[('hp','400'),('ap','120'),('lvl','9')], repr(parse_pairs("hp=400 ap=120 lvl=9"))` },
        { name: "single pair", code: `assert parse_pairs("pilot=shinji")==[('pilot','shinji')]` },
        { name: "ignores non-pairs", code: `assert parse_pairs("booting... mode=auto now")==[('mode','auto')]` },
      ],
      hint: `With two groups, re.findall(r"(\\w+)=(\\w+)", text) returns a list of (key, value) tuples directly — no manual splitting needed.`,
      lore: "Decoding handshake from the Tachikoma uplink.",
    },
    {
      id: "regex-redact",
      title: "REDACT THE FILE",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Mask every digit before the leak goes public.",
      prompt: `
Before a classified file leaks, every digit must be scrubbed. Define **redact(text)** that **returns** the text with **each digit replaced by '#'**, using **re.sub**. Letters and punctuation are untouched.

~~~python
redact("CASE 0451")    -> "CASE ####"
redact("unit-01 hp 250") -> "unit-## hp ###"
~~~
`,
      starter: `import re

def redact(text):
    # TODO: replace every digit with '#'
    pass
`,
      solution: `import re

def redact(text):
    return re.sub(r"\\d", "#", text)
`,
      tests: [
        { name: "masks each digit", code: `assert redact("CASE 0451")=="CASE ####", repr(redact("CASE 0451"))` },
        { name: "leaves letters alone", code: `assert redact("Tachikoma")=="Tachikoma"` },
        { name: "mixed content", code: `assert redact("unit-01 hp 250")=="unit-## hp ###"` },
      ],
      hint: `re.sub(pattern, replacement, text) swaps every match. Pattern r"\\d" matches a single digit; replace it with "#".`,
      lore: "Sanitizing the dossier. Plausible deniability engaged.",
    },
    {
      id: "regex-hex-color",
      title: "NEON HEX",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Validate a synthwave palette color.",
      prompt: `
A palette color is a hash followed by **exactly six hex digits** — \`#RRGGBB\` — where a hex digit is 0-9 or a-f (either case). Define **is_hex_color(s)** returning **True**/**False** using **re.fullmatch** (the whole string must match).

~~~python
is_hex_color("#FF00AA") -> True
is_hex_color("#0f0f0f") -> True
is_hex_color("#FFF")    -> False   (too short)
is_hex_color("FF00AA")  -> False   (no #)
~~~
`,
      starter: `import re

def is_hex_color(s):
    # TODO: fullmatch #RRGGBB (six hex digits) -> bool
    pass
`,
      solution: `import re

def is_hex_color(s):
    return re.fullmatch(r"#[0-9a-fA-F]{6}", s) is not None
`,
      tests: [
        { name: "valid colors -> True", code: `assert is_hex_color("#FF00AA") is True and is_hex_color("#0f0f0f") is True` },
        { name: "missing hash -> False", code: `assert is_hex_color("FF00AA") is False` },
        { name: "wrong length / bad digit -> False", code: `assert is_hex_color("#FFF") is False and is_hex_color("#GG0011") is False` },
      ],
      hint: `Pattern r"#[0-9a-fA-F]{6}" with fullmatch enforces hash + six hex digits across the whole string. Return whether it is not None.`,
      lore: "Loading the grid. Magenta and cyan, forever.",
    },
    {
      id: "regex-split-tracklist",
      title: "SPLIT THE TRACKLIST",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Carve a messy tracklist into clean titles.",
      prompt: `
A tracklist arrives with inconsistent separators — commas, semicolons, or slashes, each maybe padded with spaces. Define **split_tracks(text)** that **returns a list of titles** by splitting on **any of** \`, ; /\` with optional surrounding whitespace, using **re.split**. Trim the whole string first so there are no empty edges.

~~~python
split_tracks("Aerith; Tifa , Cloud/Barret") -> ["Aerith", "Tifa", "Cloud", "Barret"]
split_tracks("Windowlicker")                -> ["Windowlicker"]
~~~
`,
      starter: `import re

def split_tracks(text):
    # TODO: split on commas/semicolons/slashes with optional surrounding spaces
    pass
`,
      solution: `import re

def split_tracks(text):
    return re.split(r"\\s*[,;/]\\s*", text.strip())
`,
      tests: [
        { name: "splits on mixed delimiters", code: `assert split_tracks("Aerith; Tifa , Cloud/Barret")==['Aerith','Tifa','Cloud','Barret'], repr(split_tracks("Aerith; Tifa , Cloud/Barret"))` },
        { name: "single token unchanged", code: `assert split_tracks("Windowlicker")==['Windowlicker']` },
        { name: "trims outer whitespace", code: `assert split_tracks("  Da Funk , Around the World  ")==['Da Funk','Around the World']` },
      ],
      hint: `re.split(r"\\s*[,;/]\\s*", text.strip()) treats any of , ; / (plus the spaces around it) as one delimiter. The character class [,;/] matches a single separator.`,
      lore: "Cueing the set. Daft Punk would approve.",
    },
  ]);

  window.addExercises("python", "m12-oop", [
    {
      id: "oop-credit-chip",
      title: "CREDIT CHIP",
      kind: "function",
      difficulty: 1,
      xp: 120,
      brief: "Model a wallet that never goes negative.",
      prompt: `
Define a class **CreditChip** with:
- \`__init__(self, balance)\` storing the starting \`balance\`
- \`deposit(self, amount)\` that adds \`amount\` and **returns** the new balance
- \`withdraw(self, amount)\` that subtracts \`amount\` but **never below 0**, and **returns** the new balance

~~~python
c = CreditChip(100)
c.deposit(50)    # 150, and c.balance == 150
c.withdraw(999)  # 0   (clamped, can't overdraw)
~~~
`,
      starter: `class CreditChip:
    def __init__(self, balance):
        # TODO: store starting balance
        pass

    def deposit(self, amount):
        # TODO: add amount, return new balance
        pass

    def withdraw(self, amount):
        # TODO: subtract amount but never below 0, return new balance
        pass
`,
      solution: `class CreditChip:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        self.balance = max(0, self.balance - amount)
        return self.balance
`,
      tests: [
        { name: "constructor stores balance", code: `c=CreditChip(100)
assert c.balance==100` },
        { name: "deposit adds and returns", code: `c=CreditChip(100)
assert c.deposit(50)==150 and c.balance==150` },
        { name: "withdraw floors at 0", code: `c=CreditChip(100)
c.withdraw(999)
assert c.balance==0, "Balance must never go negative."` },
      ],
      hint: `In withdraw: self.balance = max(0, self.balance - amount); return self.balance. Both methods mutate self.balance and return it.`,
      lore: "3,000,000 woolongs. Easy money, Spike.",
    },
    {
      id: "oop-coord-eq",
      title: "GRID EQUALITY",
      kind: "function",
      difficulty: 2,
      xp: 150,
      brief: "Two map points match when their coordinates do.",
      prompt: `
By default two different objects are never equal. Define a class **Coord** with \`__init__(self, x, y)\` and an **__eq__(self, other)** method so two Coords are **equal when their x and y match**, even if they are separate objects.

~~~python
Coord(3,4) == Coord(3,4)   # True
Coord(3,4) == Coord(3,5)   # False
~~~

**__eq__** must **return** a bool.
`,
      starter: `class Coord:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        # TODO: two Coords are equal when x and y match
        pass
`,
      solution: `class Coord:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
`,
      tests: [
        { name: "same coords are equal", code: `assert Coord(3,4)==Coord(3,4)` },
        { name: "different coords are not equal", code: `assert not (Coord(3,4)==Coord(3,5))` },
        { name: "distinct objects compare by value", code: `a=Coord(1,1)
b=Coord(1,1)
assert a is not b and a==b, "Compare by x/y, not identity."` },
      ],
      hint: `__eq__ should return self.x == other.x and self.y == other.y. Python calls it automatically for the == operator.`,
      lore: "Same coordinates, same ghost. Section 9 confirms.",
    },
    {
      id: "oop-drone-census",
      title: "DRONE CENSUS",
      kind: "function",
      difficulty: 2,
      xp: 160,
      brief: "Count every drone the swarm spawns.",
      prompt: `
A **class variable** is shared by all instances. Define a class **Drone** with a class variable **count** starting at \`0\`, and an \`__init__(self, tag)\` that stores \`tag\` and **increments Drone.count** each time a drone is created.

~~~python
Drone("a"); Drone("b"); Drone("c")
Drone.count   # 3
~~~

Bump the **class** counter (Drone.count), not a per-instance one.
`,
      starter: `class Drone:
    # TODO: class variable tracking how many Drones exist
    count = 0

    def __init__(self, tag):
        # TODO: store tag and bump the class counter
        pass
`,
      solution: `class Drone:
    count = 0

    def __init__(self, tag):
        self.tag = tag
        Drone.count += 1
`,
      tests: [
        { name: "starts at zero", code: `Drone.count = 0
assert Drone.count==0` },
        { name: "counts new instances", code: `Drone.count = 0
Drone('a')
Drone('b')
Drone('c')
assert Drone.count==3, repr(Drone.count)` },
        { name: "tag stored on instance", code: `Drone.count = 0
d=Drone('scout-7')
assert d.tag=='scout-7'` },
      ],
      hint: `Declare count = 0 at class level (outside __init__). Inside __init__, do Drone.count += 1 so every instance shares one tally.`,
      lore: "Swarm online. 9 units... no, 10. Stand by.",
    },
    {
      id: "oop-mecha-super",
      title: "SUPER PILOT",
      kind: "function",
      difficulty: 3,
      xp: 190,
      brief: "Extend the base constructor with super().",
      prompt: `
A subclass can reuse its parent's setup with **super()**. Given a base **Robot** with \`__init__(self, name)\`, define **Mecha(Robot)** whose \`__init__(self, name, pilot)\` **calls super().__init__(name)** to set the name, then stores \`pilot\`.

~~~python
m = Mecha("Unit-01", "Shinji")
m.name    # "Unit-01"  (set via super)
m.pilot   # "Shinji"   (added by Mecha)
~~~

Do **not** set \`self.name\` directly — route it through **super()**.
`,
      starter: `class Robot:
    def __init__(self, name):
        self.name = name

class Mecha(Robot):
    def __init__(self, name, pilot):
        # TODO: call super().__init__ for name, then store pilot
        pass
`,
      solution: `class Robot:
    def __init__(self, name):
        self.name = name

class Mecha(Robot):
    def __init__(self, name, pilot):
        super().__init__(name)
        self.pilot = pilot
`,
      tests: [
        { name: "super sets inherited name", code: `m=Mecha('Unit-01','Shinji')
assert m.name=='Unit-01', "Use super().__init__(name) to set name."` },
        { name: "subclass adds pilot", code: `m=Mecha('Unit-02','Asuka')
assert m.pilot=='Asuka'` },
        { name: "still a Robot", code: `assert isinstance(Mecha('Unit-00','Rei'), Robot)` },
      ],
      hint: `First line of Mecha.__init__: super().__init__(name). Then self.pilot = pilot. super() runs the parent constructor so you don't repeat its code.`,
      lore: "Synchronization at 400%. Pilot and machine, as one.",
    },
    {
      id: "oop-synth-voices",
      title: "SYNTH VOICES",
      kind: "function",
      difficulty: 3,
      xp: 200,
      brief: "Same call, different sound — polymorphism.",
      prompt: `
Two synths share an interface but make different sounds. Build:

1. **Synth** — base class with \`tone(self)\` returning \`"..."\`
2. **Analog(Synth)** — **overrides** \`tone(self)\` to return \`"warm hum"\`
3. **Digital(Synth)** — **overrides** \`tone(self)\` to return \`"crisp bleep"\`

Then define **play_all(synths)** that takes a list of synths and **returns a list of each one's tone()** — calling the same method on each, letting polymorphism pick the right sound.

~~~python
play_all([Analog(), Digital(), Analog()])
# ["warm hum", "crisp bleep", "warm hum"]
~~~
`,
      starter: `class Synth:
    def tone(self):
        return "..."

class Analog(Synth):
    # TODO: override tone() to return "warm hum"
    pass

class Digital(Synth):
    # TODO: override tone() to return "crisp bleep"
    pass

def play_all(synths):
    # TODO: return list of each synth's tone()
    pass
`,
      solution: `class Synth:
    def tone(self):
        return "..."

class Analog(Synth):
    def tone(self):
        return "warm hum"

class Digital(Synth):
    def tone(self):
        return "crisp bleep"

def play_all(synths):
    return [s.tone() for s in synths]
`,
      tests: [
        { name: "Analog overrides tone", code: `assert Analog().tone()=="warm hum"` },
        { name: "Digital overrides tone", code: `assert Digital().tone()=="crisp bleep"` },
        { name: "play_all dispatches polymorphically", code: `assert play_all([Analog(), Digital(), Analog()])==["warm hum","crisp bleep","warm hum"], repr(play_all([Analog(), Digital(), Analog()]))` },
      ],
      hint: `Each subclass defines its own tone(). play_all just does [s.tone() for s in synths] — Python dispatches to the correct override per object.`,
      lore: "Analog warmth or digital precision? Aphex Twin says yes.",
    },
  ]);
})();
