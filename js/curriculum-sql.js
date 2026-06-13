/* ============================================================
   curriculum-sql.js — SQL track (real SQLite via sql.js).
   Each exercise: setup (schema+seed), solution, and an explicit
   `expected` result set. kind 'query' or 'mutation' (+ `check`).
   ============================================================ */
(function () {
  var BOUNTIES =
    "CREATE TABLE bounties (id INTEGER, name TEXT, reward INTEGER, planet TEXT);" +
    "INSERT INTO bounties VALUES (1,'Asimov',2500000,'Mars'),(2,'Teddy',1000000,'Mars')," +
    "(3,'Hex',800000,'Ganymede'),(4,'Pierrot',7000000,'Earth');";

  var TRACKS_DB =
    "CREATE TABLE tracks (title TEXT, artist TEXT, bpm INTEGER, genre TEXT);" +
    "INSERT INTO tracks VALUES ('Da Funk','Daft Punk',112,'house'),('Aerodynamic','Daft Punk',123,'house')," +
    "('Windowlicker','Aphex Twin',100,'idm'),('Avril 14th','Aphex Twin',60,'ambient'),('Awake','Tycho',120,'synthwave');";

  var CREW =
    "CREATE TABLE ships (id INTEGER, name TEXT);" +
    "INSERT INTO ships VALUES (1,'Bebop'),(2,'Swordfish');" +
    "CREATE TABLE crew (name TEXT, ship_id INTEGER, role TEXT);" +
    "INSERT INTO crew VALUES ('Spike',1,'hunter'),('Jet',1,'captain'),('Faye',1,'hunter'),('Ed',1,'hacker');";

  window.registerTrack({
    id: "sql",
    name: "SQL",
    code: "SQL",
    runtime: "sql",
    ext: "sql",
    prism: "sql",
    accent: "#25e1ff",
    blurb: "Query a real SQLite database in your browser. The language every data career runs on.",
    intro: "A real SQLite engine (sql.js/WASM) runs locally. Each node loads a seeded database; your query is checked against the target result set. SELECT, aggregate, JOIN, mutate.",
    modules: [

      /* ---------- SQL 0x01 ---------- */
      {
        id: "sqlm01-select", code: "0x01", title: "INTERROGATION",
        subtitle: "SELECT · WHERE · ORDER BY",
        theory: `
## Interrogating the grid
A database is a stack of **tables** — grids of rows (records) and columns (fields). You never read a table by hand; you **interrogate** it with a query and the engine hands back exactly the rows you asked for. One statement, four moving parts:
~~~sql
SELECT columns FROM table WHERE condition ORDER BY column;
~~~

## SELECT — choose your columns
**WHAT:** **SELECT** names the columns you want back; **FROM** names the table to pull them from. Use **\\*** to grab every column.
**WHY:** you almost never need the whole table — pulling only the fields you care about keeps results tight and fast.
~~~sql
SELECT name, reward FROM bounties;
~~~

## WHERE — keep only the rows you want
**WHAT:** **WHERE** is a filter: the engine tests each row against your condition and drops the ones that fail. Combine tests with **AND** / **OR**, compare with **=**, **>**, **>=**, **<**, **<=**, **!=**.
**WHY:** it answers questions — "which marks are worth over a million?" — instead of dumping the entire roster on you.
~~~sql
SELECT name, reward FROM bounties WHERE reward > 1000000;
~~~

## ORDER BY — sort the result
**WHAT:** **ORDER BY** ranks the rows by a column. Default is ascending (A→Z, low→high); add **DESC** to flip it (high→low).
**WHY:** "who's the top target?" is just a sort — let the engine rank them so you don't have to.
~~~sql
SELECT name, reward FROM bounties WHERE reward > 1000000 ORDER BY reward DESC;
~~~

## The bounties table
The seeded data is your active hit list — four marks scattered across the system:
~~~text
bounties(id, name, reward, planet)
~~~
**id** (number), **name** (text), **reward** in woolongs (number), **planet** where they're hiding (text).

> INTEL — Order of clauses is fixed: SELECT, then FROM, then WHERE, then ORDER BY. The engine reads them in that order too.

> WARNING — Text values need single quotes: planet = 'Mars' works, planet = Mars throws an error (the engine thinks Mars is a column name). Numbers take NO quotes: reward > 1000000, never reward > '1000000'.
`,
        exercises: [
          {
            id: "sql-wanted", title: "MOST WANTED", kind: "query", difficulty: 1, xp: 120,
            brief: "Rank every target by price.",
            prompt: `
The **bounties(id, name, reward, planet)** table holds active marks. Return just the **name** of every bounty, ordered by **reward**, highest first.
`,
            setup: BOUNTIES,
            starter: "SELECT name FROM bounties;\n",
            solution: "SELECT name FROM bounties ORDER BY reward DESC;\n",
            expected: [["Pierrot"], ["Asimov"], ["Teddy"], ["Hex"]],
            orderMatters: true,
            hint: "ORDER BY reward DESC sorts biggest first.",
            lore: "Three million woolongs is just the opening bid.",
          },
          {
            id: "sql-highvalue", title: "HIGH-VALUE TARGETS", kind: "query", difficulty: 2, xp: 150,
            brief: "Filter for the lucrative marks.",
            prompt: `
Return **name** and **reward** for every bounty worth **at least 1,000,000**, ordered by reward (highest first).
`,
            setup: BOUNTIES,
            starter: "SELECT name, reward FROM bounties;\n",
            solution: "SELECT name, reward FROM bounties WHERE reward >= 1000000 ORDER BY reward DESC;\n",
            expected: [["Pierrot", 7000000], ["Asimov", 2500000], ["Teddy", 1000000]],
            orderMatters: true,
            hint: "Combine WHERE reward >= 1000000 with ORDER BY reward DESC.",
            lore: "Small fish don't pay the docking fees.",
          },
          {
            id: "sql-mars", title: "MARS DRAGNET", kind: "query", difficulty: 2, xp: 150,
            brief: "Sweep one planet.",
            prompt: `
Return the **name** of every bounty hiding on **Mars**, sorted alphabetically (A→Z).
`,
            setup: BOUNTIES,
            starter: "SELECT name FROM bounties WHERE planet = 'Earth';\n",
            solution: "SELECT name FROM bounties WHERE planet = 'Mars' ORDER BY name;\n",
            expected: [["Asimov"], ["Teddy"]],
            orderMatters: true,
            hint: "WHERE planet = 'Mars' (single quotes), then ORDER BY name.",
            lore: "Red dust hides a lot of faces.",
          },
        ],
      },

      /* ---------- SQL 0x02 ---------- */
      {
        id: "sqlm02-agg", code: "0x02", title: "AGGREGATION",
        subtitle: "COUNT · SUM · GROUP BY · HAVING",
        theory: `
## From rows to numbers
**SELECT** hands you rows. **Aggregation** crunches those rows into a single answer — a total, an average, a count. Instead of "show me the tracks," you ask "how many tracks? what's the average BPM?" The engine does the math.

## The aggregate functions
**WHAT:** five functions collapse a whole column of values into one number:
- **COUNT** — how many
- **SUM** — add them up
- **AVG** — the average
- **MIN** / **MAX** — the smallest / largest
**WHY:** they turn a pile of records into the one figure a question actually needs.
~~~sql
SELECT COUNT(*), AVG(bpm), MAX(bpm) FROM tracks;
~~~

## GROUP BY — one answer per category
**WHAT:** **GROUP BY** splits the rows into buckets that share a value, then runs the aggregate once per bucket. Group by **artist**, and COUNT(\\*) counts the tracks each artist has — not the whole table.
**WHY:** it answers "per X" questions — tracks per artist, total reward per planet — in a single query.
~~~sql
SELECT artist, COUNT(*) FROM tracks GROUP BY artist;
~~~

## HAVING — filter the groups
**WHAT:** **HAVING** is a filter for groups, the way **WHERE** is a filter for rows. After grouping, it keeps only the buckets that pass a test on their aggregate.
**WHY:** "which artists have 2+ tracks?" is a test on a count — and you can't test a count until after the grouping happens.
~~~sql
SELECT artist, COUNT(*) FROM tracks GROUP BY artist HAVING COUNT(*) >= 2;
~~~

## The catalog
The seeded data is the station playlist — five cuts across a few genres:
~~~text
tracks(title, artist, bpm, genre)
~~~
**title** (text), **artist** (text), **bpm** beats-per-minute (number), **genre** (text).

> INTEL — The pipeline runs WHERE → GROUP BY → HAVING. WHERE filters individual rows *before* they're grouped; HAVING filters whole groups *after*. Use WHERE for raw-row tests (genre = 'house'), HAVING for tests on the aggregate (COUNT(\\*) >= 2).

> WARNING — COUNT(\\*) counts every row, including ones with blank fields. COUNT(column) counts only rows where that column is NOT NULL (empty) — so the two can give different numbers. When you just want "how many rows," reach for COUNT(\\*).
`,
        exercises: [
          {
            id: "sql-count", title: "CATALOG SIZE", kind: "query", difficulty: 1, xp: 120,
            brief: "How many tracks are on the deck?",
            prompt: `
The **tracks(title, artist, bpm, genre)** table is the station playlist. Return a single number: the **total count** of tracks.
`,
            setup: TRACKS_DB,
            starter: "SELECT title FROM tracks;\n",
            solution: "SELECT COUNT(*) FROM tracks;\n",
            expected: [[5]],
            orderMatters: false,
            hint: "COUNT(*) counts all rows.",
            lore: "Five cuts. All killer, no filler.",
          },
          {
            id: "sql-tally", title: "ARTIST TALLY", kind: "query", difficulty: 2, xp: 160,
            brief: "Count tracks per artist.",
            prompt: `
Return each **artist** and **how many tracks** they have, as two columns, sorted by artist name (A→Z).
`,
            setup: TRACKS_DB,
            starter: "SELECT artist FROM tracks;\n",
            solution: "SELECT artist, COUNT(*) FROM tracks GROUP BY artist ORDER BY artist;\n",
            expected: [["Aphex Twin", 2], ["Daft Punk", 2], ["Tycho", 1]],
            orderMatters: true,
            hint: "GROUP BY artist, then SELECT artist, COUNT(*). Add ORDER BY artist.",
            lore: "Robots, aliens, and a lighthouse keeper.",
          },
          {
            id: "sql-prolific", title: "PROLIFIC ARTISTS", kind: "query", difficulty: 3, xp: 180,
            brief: "Only the artists with range.",
            prompt: `
Return the **artist** name of every artist with **2 or more** tracks in the catalog, sorted A→Z. (One column.)
`,
            setup: TRACKS_DB,
            starter: "SELECT artist FROM tracks GROUP BY artist;\n",
            solution: "SELECT artist FROM tracks GROUP BY artist HAVING COUNT(*) >= 2 ORDER BY artist;\n",
            expected: [["Aphex Twin"], ["Daft Punk"]],
            orderMatters: true,
            hint: "Filter groups with HAVING COUNT(*) >= 2.",
            lore: "One-hit wonders need not apply.",
          },
        ],
      },

      /* ---------- SQL 0x03 ---------- */
      {
        id: "sqlm03-join", code: "0x03", title: "JOINS & MUTATIONS",
        subtitle: "JOIN · INSERT · UPDATE",
        theory: `
## JOIN — stitch two tables together
**WHAT:** real data is split across tables to avoid repeating itself — the **crew** table stores a **ship_id** number, not the whole ship. A **JOIN** glues two tables back together by matching that key (**ON crew.ship_id = ships.id**), so each crew row gets its ship's details attached.
**WHY:** it lets you ask across tables in one shot — "who serves on which ship?" — instead of looking up ids by hand.
~~~sql
SELECT crew.name, ships.name
FROM crew JOIN ships ON crew.ship_id = ships.id;
~~~
When a column name lives in both tables (like **name** here), prefix it with the table — **crew.name**, **ships.name** — so the engine knows which one you mean.

## INSERT — add a new row
**WHAT:** **INSERT INTO** adds a fresh record. List the columns, then the matching **VALUES** in the same order.
**WHY:** every new recruit, sale, or signup is a new row — this is how data gets *into* the table.
~~~sql
INSERT INTO crew (name, ship_id, role) VALUES ('Ein', 1, 'dog');
~~~

## UPDATE — change existing rows
**WHAT:** **UPDATE** rewrites fields in rows that already exist. **SET** says what changes; **WHERE** says which rows.
**WHY:** records change — promotions, price edits, status flips — and you fix them in place instead of deleting and re-adding.
~~~sql
UPDATE crew SET role = 'captain' WHERE name = 'Spike';
~~~

## The tables
Two seeded tables, linked by ship id:
~~~text
ships(id, name)              crew(name, ship_id, role)
~~~
**ships** — **id** (number), **name** (text). **crew** — **name** (text), **ship_id** the id of their ship (number, matches ships.id), **role** (text).

> INTEL — The link between tables is just a shared value: crew.ship_id holds the same number as ships.id. That shared key is what the JOIN's ON clause matches on.

> WARNING — An UPDATE (or DELETE) with no WHERE hits EVERY row in the table — one careless line and the whole crew becomes captains. Always write the WHERE first, aim it carefully, then fire.
`,
        exercises: [
          {
            id: "sql-manifest", title: "CREW MANIFEST", kind: "query", difficulty: 2, xp: 170,
            brief: "Match each hand to their ship.",
            prompt: `
Join **crew** to **ships** on crew.ship_id = ships.id. Return each crew member's **name** and their **ship's name** (two columns), sorted by crew name (A→Z).
`,
            setup: CREW,
            starter: "SELECT name FROM crew;\n",
            solution: "SELECT crew.name, ships.name FROM crew JOIN ships ON crew.ship_id = ships.id ORDER BY crew.name;\n",
            expected: [["Ed", "Bebop"], ["Faye", "Bebop"], ["Jet", "Bebop"], ["Spike", "Bebop"]],
            orderMatters: true,
            hint: "JOIN ships ON crew.ship_id = ships.id, then SELECT crew.name, ships.name.",
            lore: "Everyone aboard the Bebop, eventually.",
          },
          {
            id: "sql-recruit", title: "RECRUIT", kind: "mutation", difficulty: 2, xp: 170,
            brief: "Add the data dog to the manifest.",
            prompt: `
Add a new crew member to the **crew** table: name **Ein**, ship_id **1**, role **dog**. Use INSERT.

The verifier then runs: SELECT name FROM crew WHERE role = 'dog'.
`,
            setup: CREW,
            check: "SELECT name FROM crew WHERE role = 'dog';",
            starter: "-- INSERT the new crew member here\n",
            solution: "INSERT INTO crew (name, ship_id, role) VALUES ('Ein', 1, 'dog');\n",
            expected: [["Ein"]],
            orderMatters: false,
            hint: "INSERT INTO crew (name, ship_id, role) VALUES ('Ein', 1, 'dog');",
            lore: "A Welsh Corgi with a data-grade brain.",
          },
          {
            id: "sql-promote", title: "FIELD PROMOTION", kind: "mutation", difficulty: 2, xp: 170,
            brief: "Update a record in place.",
            prompt: `
**Spike** just earned a promotion. UPDATE the **crew** table to set his **role** to **captain** — and change no one else.

The verifier then runs: SELECT role FROM crew WHERE name = 'Spike'.
`,
            setup: CREW,
            check: "SELECT role FROM crew WHERE name = 'Spike';",
            starter: "-- UPDATE Spike's role here\n",
            solution: "UPDATE crew SET role = 'captain' WHERE name = 'Spike';\n",
            expected: [["captain"]],
            orderMatters: false,
            hint: "UPDATE crew SET role = 'captain' WHERE name = 'Spike'; — don't forget the WHERE!",
            lore: "Bang.",
          },
        ],
      },

    ],
  });
})();
