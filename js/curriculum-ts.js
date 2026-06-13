/* ============================================================
   curriculum-ts.js — TYPESCRIPT track.
   The learner writes REAL TypeScript; tsc compiles it to JS
   (types stripped) and it runs in a sandboxed Worker. Tests are
   PLAIN JS that call the compiled functions by name.
   Authored with the J() line-joiner (not template literals) so
   that backticks and ${...} in TS code stay literal & parse-safe.
   Test helpers available in every test: assert, assertEqual
   (deep), assertThrows, eq, show, stdout().
   ============================================================ */
(function () {
  var J = function () { return Array.prototype.join.call(arguments, '\n'); };

  window.registerTrack({
    id: 'typescript',
    name: 'TYPESCRIPT',
    code: 'TS',
    runtime: 'typescript',
    ext: 'ts',
    prism: 'typescript',
    accent: '#3178c6',
    blurb: 'JavaScript with a type system bolted on. Real tsc compiles your code, then it runs. Annotate, alias, union, generalize.',
    intro: 'Your code is compiled by the actual TypeScript compiler before it runs - the types catch ghosts before the machine ever wakes. Annotate the signal, satisfy the compiler, bank XP.',
    modules: [

      /* ---------- TS 0x01 ---------- */
      {
        id: 'tsm01-annotate', code: '0x01', title: 'TYPE ANNOTATIONS',
        subtitle: 'typed params & returns · primitives · literal/union types',
        theory: J(
          '## Static types',
          '**WHAT:** TypeScript is JavaScript with **labels** that say what kind of value lives where. **WHY:** the compiler reads those labels *before* you run anything and screams if you mix a `number` where a `string` belongs - bugs caught at your desk, not in production.',
          'You attach a label with `: type`. The three core **primitives** are `number`, `string`, `boolean`.',
          '~~~ts',
          "const codename: string = 'Lain';",
          'let clearance: number = 7;',
          'const online: boolean = true;',
          '~~~',
          'Once labelled, `clearance = "seven"` is rejected by the compiler before the code ever boots.',
          '## Typed functions',
          '**WHAT:** label each parameter *and* the return value. **WHY:** this is a **contract** - the compiler checks every call passes the right types in and that you return the right type out.',
          '~~~ts',
          'function amplify(signal: number): number {',
          '  return signal * 2;',
          '}',
          '~~~',
          'Call `amplify("loud")` and the compiler blocks it on the spot - the argument is not a `number`.',
          '## Literal & union types',
          '**WHAT:** a type can be one exact **literal** value (e.g. `\'ONLINE\'`), and a **union** with `|` means "any one of these". **WHY:** it pins a value to a fixed menu, so typos like `\'ONLNE\'` are caught immediately.',
          '~~~ts',
          "type Status = 'ONLINE' | 'OFFLINE';",
          'function uptime(s: Status): number {',
          "  return s === 'ONLINE' ? 1 : 0;",
          '}',
          '~~~',
          'Anything outside the menu - `uptime(\'BUSY\')` - is rejected before runtime.',
          '> INTEL - Annotations are **erased** before the code runs. They brief the compiler, not the CPU; the shipped JS has zero type info left.',
          '> WARNING - Types are a *compile-time* check only. They never run, never validate live data, and never sanitise input from the Wired - a `: number` label does not stop a string arriving at runtime if the check was skipped.'
        ),
        exercises: [
          {
            id: 'ts-amplify', title: 'AMPLIFY THE SIGNAL', kind: 'function', difficulty: 1, xp: 120,
            brief: 'Boost a weak transmission - with types this time.',
            prompt: J(
              'Define **amplify(signal: number): number** that **returns** the signal at double amplitude.',
              '~~~ts',
              'amplify(21) // 42',
              'amplify(-3) // -6',
              '~~~'
            ),
            starter: J('function amplify(signal: number): number {', '  // TODO: return double the signal', '  return 0;', '}'),
            solution: J('function amplify(signal: number): number {', '  return signal * 2;', '}'),
            tests: [
              { name: 'amplify(21) -> 42', code: "assertEqual(amplify(21), 42, 'amplify(21) should be 42');" },
              { name: 'works across the range', code: "assert(amplify(5) === 10 && amplify(0) === 0 && amplify(-3) === -6, 'check 5, 0, -3');" },
            ],
            hint: 'return signal * 2;',
            lore: 'Crank the gain. The Wired is listening.',
          },
          {
            id: 'ts-boot', title: 'BOOT SEQUENCE', kind: 'function', difficulty: 1, xp: 130,
            brief: 'Bring a supercomputer online with a typed string return.',
            prompt: J(
              'Define **bootMessage(name: string): string** returning the line below. Use a template literal.',
              '~~~text',
              '<name> online. All systems nominal.',
              '~~~',
              '~~~ts',
              "bootMessage('MAGI') // 'MAGI online. All systems nominal.'",
              '~~~'
            ),
            starter: J('function bootMessage(name: string): string {', '  // TODO: return the boot string', "  return '';", '}'),
            solution: J('function bootMessage(name: string): string {', '  return `${name} online. All systems nominal.`;', '}'),
            tests: [
              { name: 'boots MAGI', code: "assertEqual(bootMessage('MAGI'), 'MAGI online. All systems nominal.');" },
              { name: 'uses the argument', code: "assertEqual(bootMessage('Tachikoma'), 'Tachikoma online. All systems nominal.');" },
            ],
            hint: 'return `${name} online. All systems nominal.`;',
            lore: 'MAGI system online. Pattern blue.',
          },
          {
            id: 'ts-status', title: 'STATUS LITERAL', kind: 'function', difficulty: 2, xp: 160,
            brief: 'Constrain the input to a fixed menu with a union of literals.',
            prompt: J(
              "A **union of string literals** restricts input to an exact set. Define type **Drive = 'COLD' | 'WARM' | 'HOT'** and a function **thrust(d: Drive): number** returning:",
              '- COLD -> 0',
              '- WARM -> 50',
              '- HOT -> 100',
              '~~~ts',
              "thrust('HOT') // 100",
              '~~~'
            ),
            starter: J(
              "type Drive = 'COLD' | 'WARM' | 'HOT';",
              'function thrust(d: Drive): number {',
              '  // TODO',
              '  return -1;',
              '}'
            ),
            solution: J(
              "type Drive = 'COLD' | 'WARM' | 'HOT';",
              'function thrust(d: Drive): number {',
              "  if (d === 'COLD') return 0;",
              "  if (d === 'WARM') return 50;",
              '  return 100;',
              '}'
            ),
            tests: [
              { name: 'COLD -> 0', code: "assertEqual(thrust('COLD'), 0);" },
              { name: 'WARM -> 50', code: "assertEqual(thrust('WARM'), 50);" },
              { name: 'HOT -> 100', code: "assertEqual(thrust('HOT'), 100);" },
            ],
            hint: 'Compare d against each literal with === and return the matching number.',
            lore: 'Ignition sequence start. 3... 2... 1...',
          },
        ],
      },

      /* ---------- TS 0x02 ---------- */
      {
        id: 'tsm02-shapes', code: '0x02', title: 'SHAPES & STRUCTURES',
        subtitle: 'interfaces · type aliases · arrays · tuples · optional params',
        theory: J(
          '## Interfaces & type aliases',
          '**WHAT:** describe the **shape** of an object once - which fields it has and their types - then reuse that name everywhere. **WHY:** instead of re-typing `{ name: string; clearance: number }` at every function, you write `Operator` and the compiler checks every object matches.',
          'Two tools do this. An `interface` and a `type` alias are nearly interchangeable for plain object shapes:',
          '~~~ts',
          'interface Operator {',
          '  name: string;',
          '  clearance: number;',
          '}',
          "type Track = { title: string; bpm: number };",
          '~~~',
          'Pass an object missing `clearance`, or with `clearance: \'high\'`, and the compiler rejects it.',
          '## Typed arrays',
          '**WHAT:** `T[]` means "an array where every element is a `T`". **WHY:** the compiler guards each slot, so you cannot accidentally push a `string` into a list of numbers.',
          '~~~ts',
          'const cells: number[] = [10, 20, 12];',
          "const crew: string[] = ['Spike', 'Jet', 'Faye'];",
          '~~~',
          '## Tuples',
          '**WHAT:** a **tuple** is a fixed-length array where each *position* has its own type - `[number, number]` is exactly two numbers. **WHY:** perfect for coordinates or a paired return where order and count matter.',
          '~~~ts',
          'const point: [number, number] = [128, 256];',
          '~~~',
          'A plain `number[]` allows any length; a tuple locks the slots, so `[128]` or `[1, 2, 3]` is rejected.',
          '## Optional parameters',
          '**WHAT:** a `?` after a parameter name makes it optional - the caller may skip it. **WHY:** sane defaults without forcing every caller to pass everything.',
          '~~~ts',
          'function greet(name: string, rank?: string): string {',
          "  return rank ? `${rank} ${name}` : name;",
          '}',
          '~~~',
          '> INTEL - `rank?: string` is shorthand for `rank: string | undefined`. Inside the function the value really might be missing.',
          '> WARNING - Optional means **maybe undefined**. Touch `rank.toUpperCase()` without first checking it exists and you risk a runtime crash on the missing case - always handle the `undefined` branch.'
        ),
        exercises: [
          {
            id: 'ts-operator', title: 'OPERATOR DOSSIER', kind: 'function', difficulty: 2, xp: 170,
            brief: 'Read a field off a typed object shape.',
            prompt: J(
              'Given the interface below, define **idTag(op: Operator): string** returning `"<name> :: L<clearance>"`.',
              '~~~ts',
              'interface Operator { name: string; clearance: number }',
              "idTag({ name: 'Lain', clearance: 7 }) // 'Lain :: L7'",
              '~~~'
            ),
            starter: J(
              'interface Operator { name: string; clearance: number }',
              'function idTag(op: Operator): string {',
              '  // TODO',
              "  return '';",
              '}'
            ),
            solution: J(
              'interface Operator { name: string; clearance: number }',
              'function idTag(op: Operator): string {',
              '  return `${op.name} :: L${op.clearance}`;',
              '}'
            ),
            tests: [
              { name: 'Lain L7', code: "assertEqual(idTag({ name: 'Lain', clearance: 7 }), 'Lain :: L7');" },
              { name: 'reads both fields', code: "assertEqual(idTag({ name: 'Motoko', clearance: 9 }), 'Motoko :: L9');" },
            ],
            hint: 'Access op.name and op.clearance inside a template literal.',
            lore: 'Present day, present time. Identity confirmed.',
          },
          {
            id: 'ts-loud', title: 'FREQUENCY FILTER', kind: 'function', difficulty: 2, xp: 180,
            brief: 'Filter an array of typed objects down to a string array.',
            prompt: J(
              'With **type Track = { name: string; bpm: number }**, define **loudTracks(tracks: Track[]): string[]** returning just the **names** whose bpm is **>= 120**, preserving order.',
              '~~~ts',
              "loudTracks([{ name: 'Lull', bpm: 90 }, { name: 'Spice', bpm: 128 }]) // ['Spice']",
              '~~~'
            ),
            starter: J(
              'type Track = { name: string; bpm: number };',
              'function loudTracks(tracks: Track[]): string[] {',
              '  // TODO: filter then map',
              '  return [];',
              '}'
            ),
            solution: J(
              'type Track = { name: string; bpm: number };',
              'function loudTracks(tracks: Track[]): string[] {',
              '  return tracks.filter((t) => t.bpm >= 120).map((t) => t.name);',
              '}'
            ),
            tests: [
              { name: 'keeps bpm >= 120', code: J(
                "var data = [{ name: 'Lull', bpm: 90 }, { name: 'Spice', bpm: 128 }, { name: 'Wired', bpm: 140 }];",
                "assertEqual(loudTracks(data), ['Spice', 'Wired']);"
              ) },
              { name: 'boundary 120 included', code: "assertEqual(loudTracks([{ name: 'X', bpm: 120 }]), ['X']);" },
              { name: 'empty -> empty', code: 'assertEqual(loudTracks([]), []);' },
            ],
            hint: 'tracks.filter((t) => t.bpm >= 120).map((t) => t.name)',
            lore: 'Daft Punk on the decks. Harder, better, faster, louder.',
          },
          {
            id: 'ts-vector', title: 'VECTOR LOCK', kind: 'function', difficulty: 3, xp: 200,
            brief: 'Return a fixed-shape tuple, with an optional scale.',
            prompt: J(
              'Define **scaleVec(v: [number, number], k?: number): [number, number]** that multiplies both components by **k**. If **k** is omitted, default to **2**.',
              '~~~ts',
              'scaleVec([3, 4])    // [6, 8]',
              'scaleVec([3, 4], 0) // [0, 0]',
              '~~~'
            ),
            starter: J(
              'function scaleVec(v: [number, number], k?: number): [number, number] {',
              '  // TODO: handle the missing k',
              '  return [0, 0];',
              '}'
            ),
            solution: J(
              'function scaleVec(v: [number, number], k?: number): [number, number] {',
              '  const f = k === undefined ? 2 : k;',
              '  return [v[0] * f, v[1] * f];',
              '}'
            ),
            tests: [
              { name: 'default doubles', code: 'assertEqual(scaleVec([3, 4]), [6, 8]);' },
              { name: 'explicit scale', code: 'assertEqual(scaleVec([3, 4], 10), [30, 40]);' },
              { name: 'scale by zero (not default)', code: 'assertEqual(scaleVec([3, 4], 0), [0, 0]);' },
            ],
            hint: 'Test k === undefined explicitly so that passing 0 does not trigger the default.',
            lore: 'Lock vector. Punch it, Tank.',
          },
        ],
      },

      /* ---------- TS 0x03 ---------- */
      {
        id: 'tsm03-generics', code: '0x03', title: 'GENERICS PROTOCOL',
        subtitle: 'type parameters · generic functions · reusable contracts',
        theory: J(
          '## Why generics',
          '**WHAT:** a **type parameter** `<T>` is a placeholder for "whatever type the caller uses". **WHY:** some functions work on *any* type but must hand the **same** type back. Without generics you reach for `any` and throw away all checking; `<T>` keeps the wire connected from input to output.',
          'Think of `T` as a variable for types - the caller fills it in, and it stays consistent everywhere it appears:',
          '~~~ts',
          'function identity<T>(x: T): T {',
          '  return x;',
          '}',
          "identity<string>('Neo'); // result type is string, not any",
          '~~~',
          '## Generic over arrays',
          '**WHAT:** the same placeholder shines on collections. **WHY:** the element type flows straight through - feed in numbers, get a number back, with no casting.',
          '~~~ts',
          'function firstOf<T>(xs: T[]): T {',
          '  return xs[0];',
          '}',
          '~~~',
          '## Inference',
          '**WHAT:** you rarely write `<T>` at the call site. **WHY:** the compiler **infers** `T` from the argument you actually pass, so the code reads like plain JS while staying fully typed.',
          '~~~ts',
          'firstOf([1, 2, 3]); // T inferred as number - no <number> needed',
          '~~~',
          '> INTEL - A generic is a contract: "give me a `T`, and I will give you back something built from that same `T`". The link is what makes it safer than `any`.',
          '> WARNING - Let inference do the work. Writing `firstOf<number>([1, 2, 3])` everywhere is noise the compiler already knows - only spell out `<T>` when it genuinely cannot be guessed.'
        ),
        exercises: [
          {
            id: 'ts-last', title: 'TAIL POINTER', kind: 'function', difficulty: 2, xp: 190,
            brief: 'A generic that returns the last element, type preserved.',
            prompt: J(
              'Define a generic **lastOf<T>(xs: T[]): T** returning the final element of the array.',
              '~~~ts',
              "lastOf([1, 2, 3])           // 3",
              "lastOf(['Spike', 'Jet'])    // 'Jet'",
              '~~~'
            ),
            starter: J(
              'function lastOf<T>(xs: T[]): T {',
              '  // TODO: return the last element',
              '  return xs[0];',
              '}'
            ),
            solution: J(
              'function lastOf<T>(xs: T[]): T {',
              '  return xs[xs.length - 1];',
              '}'
            ),
            tests: [
              { name: 'last number', code: 'assertEqual(lastOf([1, 2, 3]), 3);' },
              { name: 'last string', code: "assertEqual(lastOf(['Spike', 'Jet', 'Faye']), 'Faye');" },
              { name: 'single element', code: 'assertEqual(lastOf([42]), 42);' },
            ],
            hint: 'xs[xs.length - 1]',
            lore: 'See you, space cowboy. End of the line.',
          },
          {
            id: 'ts-pair', title: 'ENTANGLED PAIR', kind: 'function', difficulty: 3, xp: 210,
            brief: 'Two type parameters, returned as a tuple.',
            prompt: J(
              'Define **pair<A, B>(a: A, b: B): [A, B]** that bundles two values of possibly different types into a tuple.',
              '~~~ts',
              "pair('gate', 42) // ['gate', 42]",
              '~~~'
            ),
            starter: J(
              'function pair<A, B>(a: A, b: B): [A, B] {',
              '  // TODO',
              '  return [a, a] as unknown as [A, B];',
              '}'
            ),
            solution: J(
              'function pair<A, B>(a: A, b: B): [A, B] {',
              '  return [a, b];',
              '}'
            ),
            tests: [
              { name: 'mixed types', code: "assertEqual(pair('gate', 42), ['gate', 42]);" },
              { name: 'two numbers', code: 'assertEqual(pair(1, 1.048596), [1, 1.048596]);' },
              { name: 'string and boolean', code: "assertEqual(pair('lain', true), ['lain', true]);" },
            ],
            hint: 'Just return [a, b] in order.',
            lore: 'El Psy Kongroo. The worldline is 1.048596.',
          },
          {
            id: 'ts-pluck', title: 'FIELD EXTRACTOR', kind: 'function', difficulty: 3, xp: 230,
            brief: 'A generic map that pulls one named field off every record.',
            prompt: J(
              'Define **pluckNames<T extends { name: string }>(xs: T[]): string[]** returning the `name` field of every element. The constraint **T extends { name: string }** guarantees a name exists.',
              '~~~ts',
              "pluckNames([{ name: 'Rei' }, { name: 'Asuka', unit: '02' }]) // ['Rei', 'Asuka']",
              '~~~'
            ),
            starter: J(
              'function pluckNames<T extends { name: string }>(xs: T[]): string[] {',
              '  // TODO: map to the name field',
              '  return [];',
              '}'
            ),
            solution: J(
              'function pluckNames<T extends { name: string }>(xs: T[]): string[] {',
              '  return xs.map((x) => x.name);',
              '}'
            ),
            tests: [
              { name: 'extracts names', code: "assertEqual(pluckNames([{ name: 'Rei' }, { name: 'Asuka' }]), ['Rei', 'Asuka']);" },
              { name: 'ignores extra fields', code: J(
                "var pilots = [{ name: 'Shinji', unit: '01' }, { name: 'Kaworu', unit: '13' }];",
                "assertEqual(pluckNames(pilots), ['Shinji', 'Kaworu']);"
              ) },
              { name: 'empty -> empty', code: 'assertEqual(pluckNames([]), []);' },
            ],
            hint: 'xs.map((x) => x.name) - the constraint promises x.name is a string.',
            lore: 'Get in the robot, Shinji. Field extracted.',
          },
        ],
      },

    ],
  });
})();
