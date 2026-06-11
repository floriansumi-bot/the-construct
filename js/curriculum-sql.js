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
## Reading the database
SQL pulls rows from tables. The core query:
~~~sql
SELECT columns FROM table WHERE condition ORDER BY column;
~~~
**SELECT** picks columns (or **\\*** for all), **FROM** names the table, **WHERE** filters rows, **ORDER BY** sorts (add **DESC** for descending).

## The bounties table
~~~text
bounties(id, name, reward, planet)
~~~
~~~sql
SELECT name, reward FROM bounties WHERE reward > 1000000 ORDER BY reward DESC;
~~~

> INTEL — Text literals use single quotes: planet = 'Mars'. Numbers don't.
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
## Summarizing
Aggregate functions collapse many rows into one value: **COUNT**, **SUM**, **AVG**, **MIN**, **MAX**.
~~~sql
SELECT COUNT(*) FROM tracks;
~~~

## Grouping
**GROUP BY** runs the aggregate once per group. **HAVING** filters groups (like WHERE, but for aggregates).
~~~sql
SELECT artist, COUNT(*) FROM tracks GROUP BY artist HAVING COUNT(*) >= 2;
~~~

## The catalog
~~~text
tracks(title, artist, bpm, genre)
~~~

> INTEL — WHERE filters rows *before* grouping; HAVING filters groups *after*.
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
## Joining tables
A **JOIN** stitches rows from two tables on a matching key.
~~~sql
SELECT crew.name, ships.name
FROM crew JOIN ships ON crew.ship_id = ships.id;
~~~

## Changing data
- **INSERT INTO** table (cols) **VALUES** (...) — add a row
- **UPDATE** table **SET** col = val **WHERE** ... — change rows
~~~sql
INSERT INTO crew (name, ship_id, role) VALUES ('Ein', 1, 'dog');
UPDATE crew SET role = 'captain' WHERE name = 'Spike';
~~~

## Tables
~~~text
ships(id, name)   crew(name, ship_id, role)
~~~

> WARNING — An UPDATE with no WHERE rewrites *every* row. Always aim before you fire.
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
