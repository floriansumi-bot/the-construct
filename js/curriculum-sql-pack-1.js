/* ============================================================
   curriculum-sql-pack-1.js — SQL expansion (right-size to ~8 sectors).
   Adds new sectors + fills existing ones. `expected` result sets are
   COMPUTED from each solution via real sql.js by _verify/sql-gen/assemble.js
   and verified by _verify/verify-sql.js. Do not hand-edit expected.
   ============================================================ */
(function () {
  var t = window.getTrack && window.getTrack("sql");
  if (!t) return;
  function add(modId, exs) { var m = t.modules.find(function (x) { return x.id === modId; }); if (m) Array.prototype.push.apply(m.exercises, exs); }
  t.modules.push(
      {
        id: "sqlm04-filters", code: "0x04", title: "FILTERS & SETS",
        subtitle: "DISTINCT · LIMIT · IN · BETWEEN · LIKE · IS NULL",
        theory: "## Trimming the result set\nA raw SELECT can dump thousands of rows. The keywords in this sector let you *narrow, slice, and pattern-match* before the data ever hits your deck.\n\n## DISTINCT — drop the duplicates\n**DISTINCT** removes repeated rows, leaving one of each unique value. Use it when a column repeats and you only want the distinct set.\n~~~sql\nSELECT DISTINCT district FROM runners;\n~~~\n**WHY:** Twelve runners might work three districts — DISTINCT collapses that to the three district names.\n\n> WARNING — DISTINCT applies to the *whole row you SELECT*, not one column. **SELECT DISTINCT district, rep** keeps a row whenever the (district, rep) pair differs, so you can get \"duplicate\" districts. List only the columns you actually want unique.\n\n## LIMIT and OFFSET — top-N and pagination\n**LIMIT n** returns at most **n** rows. Pair it with **ORDER BY** to get a true top-N (highest, newest, etc.). **LIMIT n OFFSET k** skips the first **k** rows first — that is how you page through results.\n~~~sql\nSELECT name FROM runners ORDER BY rep DESC LIMIT 3;\nSELECT name FROM runners ORDER BY rep DESC LIMIT 3 OFFSET 3;\n~~~\n**WHY:** The first query is the top 3 by rep; the second is \"page 2\" — rows 4, 5, 6.\n\n> INTEL — LIMIT without ORDER BY gives you *some* n rows, but which ones is undefined. For a meaningful top-N, always sort first.\n\n## IN — match a value list\n**IN (a, b, c)** is shorthand for **= a OR = b OR = c**. Cleaner than chaining ORs.\n~~~sql\nSELECT name FROM runners WHERE district IN ('Neon Strip', 'The Sprawl');\n~~~\n\n## BETWEEN — an inclusive range\n**BETWEEN low AND high** matches values from low to high, **including both ends**.\n~~~sql\nSELECT name FROM runners WHERE rep BETWEEN 40 AND 70;\n~~~\n**WHY:** That returns everyone with rep 40, 70, and everything between — both boundaries count.\n\n> WARNING — BETWEEN is inclusive on both ends. **BETWEEN 40 AND 70** includes 40 and 70. If you meant \"above 40 up to 70\" you want **rep > 40 AND rep <= 70** instead.\n\n## LIKE — pattern matching with wildcards\n**LIKE** compares text against a pattern. Two wildcards: **%** matches any run of characters (including none), and **_** matches exactly one character.\n~~~sql\nSELECT name FROM runners WHERE handle LIKE 'Gh%';      -- starts with Gh\nSELECT name FROM runners WHERE handle LIKE '%x';       -- ends with x\nSELECT name FROM runners WHERE handle LIKE 'V_per';    -- V, one char, then per\n~~~\n\n> INTEL — SQLite's LIKE is case-insensitive for plain ASCII letters: **LIKE 'gh%'** and **LIKE 'Gh%'** match the same rows.\n\n## IS NULL — the empty cells\nNULL means \"no value here\" — it is **not** zero and **not** an empty string. You cannot test it with **=**. Use **IS NULL** / **IS NOT NULL**.\n~~~sql\nSELECT name FROM runners WHERE handle IS NULL;\nSELECT name FROM runners WHERE handle IS NOT NULL;\n~~~\n\n> WARNING — **handle = NULL** is the classic rookie mistake: it never matches anything, even blank cells. NULL is unknown, so **= NULL** is itself unknown. Always use **IS NULL**.\n\n## The runners table\n~~~text\nrunners(id, name, handle, district, rep, credits)\n~~~\nSome runners are off-grid — their **handle** is NULL.",
        exercises: [
          {
            id: "sql-districts", title: "KNOWN TURF", kind: "query", difficulty: 1, xp: 120,
            brief: "List each district once.",
            prompt: "The **runners(id, name, handle, district, rep, credits)** table logs every courier in the grid. Return each **district** that has runners, with no duplicates — one **district** column. Order is not required.",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT district FROM runners;\n",
            solution: "SELECT DISTINCT district FROM runners;\n",
            expected: [["Neon Strip"],["The Sprawl"],["Old Town"]],
            orderMatters: false,
            hint: "DISTINCT collapses repeated district values to one each.", lore: "Three districts. Three sets of rules. None of them written down."
          },
          {
            id: "sql-topcred", title: "RICH LIST", kind: "query", difficulty: 1, xp: 120,
            brief: "Top 3 by credits.",
            prompt: "Return the **name** and **credits** of the **3 richest** runners in the **runners** table, ordered by **credits** highest first.",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT name, credits FROM runners ORDER BY credits DESC;\n",
            solution: "SELECT name, credits FROM runners ORDER BY credits DESC LIMIT 3;\n",
            expected: [["Juno",15800],["Kioko",12000],["Mara",7200]],
            orderMatters: true,
            hint: "ORDER BY credits DESC, then LIMIT 3 keeps only the top three.", lore: "The top of the list never stays the same for long."
          },
          {
            id: "sql-page2", title: "PAGE TWO", kind: "query", difficulty: 2, xp: 150,
            brief: "Skip the top 3, take the next 2.",
            prompt: "Sort the **runners** by **rep** highest first, then return the **name** of runners on \"page 2\": **skip the first 3** and return the **next 2** names. (One **name** column, in that ranked order.)",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT name FROM runners ORDER BY rep DESC LIMIT 2;\n",
            solution: "SELECT name FROM runners ORDER BY rep DESC LIMIT 2 OFFSET 3;\n",
            expected: [["Reza"],["Dex"]],
            orderMatters: true,
            hint: "LIMIT 2 OFFSET 3 skips the first three rows, then takes two.", lore: "The mid-tier runners do the quiet work nobody headlines."
          },
          {
            id: "sql-incity", title: "TWO DISTRICTS", kind: "query", difficulty: 2, xp: 150,
            brief: "Match a list of districts.",
            prompt: "Return the **name** of every runner working in either **Neon Strip** or **Old Town**, using an **IN** value list on **district**. Sort by **name** A→Z. (One **name** column.)",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT name FROM runners WHERE district = 'Neon Strip' ORDER BY name;\n",
            solution: "SELECT name FROM runners WHERE district IN ('Neon Strip', 'Old Town') ORDER BY name;\n",
            expected: [["Juno"],["Kioko"],["Mara"],["Salt"],["Wren"]],
            orderMatters: true,
            hint: "WHERE district IN ('Neon Strip', 'Old Town'), then ORDER BY name.", lore: "The Sprawl keeps its own ledger. Leave it out."
          },
          {
            id: "sql-midrep", title: "MID-TIER SWEEP", kind: "query", difficulty: 2, xp: 150,
            brief: "Inclusive rep range.",
            prompt: "Return the **name** and **rep** of every runner whose **rep** is **between 40 and 70 inclusive**, using **BETWEEN**. Sort by **rep** lowest first.",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT name, rep FROM runners WHERE rep > 40 AND rep < 70 ORDER BY rep;\n",
            solution: "SELECT name, rep FROM runners WHERE rep BETWEEN 40 AND 70 ORDER BY rep;\n",
            expected: [["Salt",41],["Dex",55],["Reza",64],["Mara",70]],
            orderMatters: true,
            hint: "rep BETWEEN 40 AND 70 includes both 40 and 70.", lore: "Reputation forty to seventy: trusted enough to hire, cheap enough to burn."
          },
          {
            id: "sql-vhandles", title: "V FOR VENOM", kind: "query", difficulty: 3, xp: 180,
            brief: "Handles starting with V.",
            prompt: "Return the **handle** of every runner whose **handle starts with the letter V**, using **LIKE**. Sort by **handle** A→Z. (One **handle** column.)",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT handle FROM runners WHERE handle = 'V%' ORDER BY handle;\n",
            solution: "SELECT handle FROM runners WHERE handle LIKE 'V%' ORDER BY handle;\n",
            expected: [["Vesper"],["Viper"]],
            orderMatters: true,
            hint: "LIKE 'V%' — the % matches any characters after the V.", lore: "Two vipers in the wire. Only one of them bites."
          },
          {
            id: "sql-offgrid", title: "OFF THE GRID", kind: "query", difficulty: 3, xp: 180,
            brief: "Runners with no handle.",
            prompt: "Some runners stay anonymous — their **handle** is NULL. Return the **name** of every runner whose **handle IS NULL**. Sort by **name** A→Z. (One **name** column.)",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT name FROM runners WHERE handle = NULL ORDER BY name;\n",
            solution: "SELECT name FROM runners WHERE handle IS NULL ORDER BY name;\n",
            expected: [["Salt"],["Wren"]],
            orderMatters: true,
            hint: "Use IS NULL, never = NULL — the equals form never matches.", lore: "No handle, no trace, no obituary."
          },
          {
            id: "sql-named", title: "ON THE RECORD", kind: "query", difficulty: 3, xp: 180,
            brief: "Top earner who has a handle.",
            prompt: "Among runners who **have a handle** (handle IS NOT NULL), return the **name** and **credits** of the single **richest** one — highest **credits**. Return exactly one row, two columns.",
            setup: "CREATE TABLE runners (id INTEGER, name TEXT, handle TEXT, district TEXT, rep INTEGER, credits INTEGER);\nINSERT INTO runners VALUES\n(1,'Kioko','Ghost','Neon Strip',88,12000),\n(2,'Reza','Viper','The Sprawl',64,5400),\n(3,'Salt',NULL,'Neon Strip',41,900),\n(4,'Mara','Vesper','Old Town',70,7200),\n(5,'Dex','Glitch','The Sprawl',55,3300),\n(6,'Wren',NULL,'Old Town',30,1500),\n(7,'Juno','Onyx','Neon Strip',92,15800);\n",
            starter: "SELECT name, credits FROM runners ORDER BY credits DESC;\n",
            solution: "SELECT name, credits FROM runners WHERE handle IS NOT NULL ORDER BY credits DESC LIMIT 1;\n",
            expected: [["Juno",15800]],
            orderMatters: true,
            hint: "Filter with handle IS NOT NULL, ORDER BY credits DESC, then LIMIT 1.", lore: "The richest ghost on file still left a name."
          }
        ],
      },
      {
        id: "sqlm05-expr", code: "0x05", title: "EXPRESSIONS & CASE",
        subtitle: "AS · arithmetic · string funcs · CASE",
        theory: "## Shaping the output\nUntil now you returned columns exactly as stored. SQL can also **compute new values** inside SELECT and rename them. The list between SELECT and FROM is just a set of expressions.\n\n## Aliases with AS\n**AS** gives a column a friendly name in the result. It does not change the table, only the label on the output.\n~~~sql\nSELECT name AS item FROM gear;\n~~~\n**WHY** — computed columns get ugly auto-names like `price*qty`. An alias makes the result readable.\n\n> INTEL — The keyword AS is optional (`name item` works) but writing it out is clearer.\n\n## Arithmetic in SELECT\nYou can do math on columns per row: `+`, `-`, `*`, `/`.\n~~~sql\nSELECT name, price * qty AS stock_value FROM gear;\n~~~\nEach row gets its own result. **WHY** — store the raw pieces (price, qty) once, compute totals on demand.\n\n> WARNING — Dividing two integers does integer math: `7 / 2` is **3**, not 3.5. Multiply by 1.0 (`7 * 1.0 / 2`) to force decimals.\n\n## String functions\n- **UPPER(s)** / **LOWER(s)** — change case\n- **LENGTH(s)** — number of characters\n- **SUBSTR(s, start, len)** — slice; positions start at **1**\n- **a || b** — glue two strings together (concatenation)\n~~~sql\nSELECT UPPER(name) AS shout, LENGTH(name) AS chars FROM gear;\nSELECT name || ' [' || grade || ']' AS tag FROM gear;\n~~~\n\n> WARNING — SUBSTR counts from 1, not 0. `SUBSTR('NEON', 1, 2)` is `'NE'`.\n\n## Rounding numbers\n**ROUND(x, n)** rounds x to n decimal places.\n~~~sql\nSELECT name, ROUND(rating, 1) AS stars FROM gear;\n~~~\n**WHY** — raw computed numbers can run to many decimals; ROUND makes them presentable.\n\n## CASE — if/else for columns\n**CASE** picks a value based on conditions, row by row. It is SQL's if/else.\n~~~sql\nSELECT name,\n  CASE WHEN price >= 1000 THEN 'premium' ELSE 'budget' END AS tier\nFROM gear;\n~~~\nIt reads top to bottom: the first WHEN that is true wins; ELSE catches the rest. Always close with **END** (and alias it with AS).\n\n> INTEL — You can chain conditions: `CASE WHEN x>=900 THEN 'A' WHEN x>=600 THEN 'B' ELSE 'C' END`.\n\n## The market\n~~~text\ngear(id, name, price, qty, rating, grade)\n~~~\nA black-market cyberware stall: each row is an item with a unit price, units in stock, a 0-5 rating, and a letter grade.",
        exercises: [
          {
            id: "sql-alias", title: "RELABEL THE GOODS", kind: "query", difficulty: 1, xp: 120,
            brief: "Rename a column on output.",
            prompt: "From the **gear(id, name, price, qty, rating, grade)** table, return the **name** column but label it **item** in the result (use AS). Return that one column for every row, in table order (no sorting needed).",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT id FROM gear;\n",
            solution: "SELECT name AS item FROM gear;\n",
            expected: [["Neural Jack"],["Optic Mod"],["Dermal Plate"],["Reflex Booster"],["Skin Weave"],["Voice Box"]],
            orderMatters: false,
            hint: "SELECT name AS item FROM gear;", lore: "Same chrome, cleaner label. The buyer never reads the serial."
          },
          {
            id: "sql-shout", title: "SCREAM THE INVENTORY", kind: "query", difficulty: 1, xp: 120,
            brief: "Uppercase every name.",
            prompt: "From the **gear** table, return each item's **name converted to upper case**, labeled **loud** (use UPPER and AS). One column, every row, table order.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name AS loud FROM gear;\n",
            solution: "SELECT UPPER(name) AS loud FROM gear;\n",
            expected: [["NEURAL JACK"],["OPTIC MOD"],["DERMAL PLATE"],["REFLEX BOOSTER"],["SKIN WEAVE"],["VOICE BOX"]],
            orderMatters: false,
            hint: "Wrap the column: UPPER(name) AS loud.", lore: "On the night market, the loudest sign moves the most chrome."
          },
          {
            id: "sql-stockval", title: "STOCK VALUE", kind: "query", difficulty: 2, xp: 150,
            brief: "Multiply price by quantity.",
            prompt: "For every row in **gear**, return two columns: the **name**, and **price multiplied by qty** labeled **stock_value**. Table order is fine.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name, price FROM gear;\n",
            solution: "SELECT name, price * qty AS stock_value FROM gear;\n",
            expected: [["Neural Jack",3600],["Optic Mod",4480],["Dermal Plate",3600],["Reflex Booster",3700],["Skin Weave",3780],["Voice Box",1900]],
            orderMatters: false,
            hint: "Compute it in the SELECT list: price * qty AS stock_value.", lore: "Count the till before the till counts you."
          },
          {
            id: "sql-stars", title: "ROUND THE RATING", kind: "query", difficulty: 2, xp: 150,
            brief: "Round ratings to one decimal.",
            prompt: "From **gear**, return the **name** and the **rating rounded to 1 decimal place**, labeled **stars** (use ROUND). Two columns, every row, table order.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name, rating FROM gear;\n",
            solution: "SELECT name, ROUND(rating, 1) AS stars FROM gear;\n",
            expected: [["Neural Jack",4.6],["Optic Mod",3.9],["Dermal Plate",2.8],["Reflex Booster",5],["Skin Weave",3.2],["Voice Box",2.1]],
            orderMatters: false,
            hint: "ROUND(rating, 1) AS stars — the 1 means one decimal place.", lore: "Four-point-nine-five rounds to five. The reviews never lie that hard."
          },
          {
            id: "sql-tag", title: "BUILD THE TAG", kind: "query", difficulty: 2, xp: 150,
            brief: "Concatenate name and grade.",
            prompt: "From **gear**, build one column labeled **tag** that glues each item's **name**, then a space and an opening bracket, then its **grade**, then a closing bracket — for example `Neural Jack [A]`. Use the || operator. One column, every row, table order.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name AS tag FROM gear;\n",
            solution: "SELECT name || ' [' || grade || ']' AS tag FROM gear;\n",
            expected: [["Neural Jack [A]"],["Optic Mod [B]"],["Dermal Plate [C]"],["Reflex Booster [A]"],["Skin Weave [B]"],["Voice Box [C]"]],
            orderMatters: false,
            hint: "Chain pieces with ||: name || ' [' || grade || ']'.", lore: "Every piece on the rack wears its grade like a gang colour."
          },
          {
            id: "sql-tier", title: "PRICE TIER", kind: "query", difficulty: 3, xp: 180,
            brief: "Label items premium or budget.",
            prompt: "From **gear**, return the **name** and a computed label **tier** using CASE: if **price is 1000 or more** the tier is **'premium'**, otherwise **'budget'**. Two columns, every row, table order.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name, price FROM gear;\n",
            solution: "SELECT name, CASE WHEN price >= 1000 THEN 'premium' ELSE 'budget' END AS tier FROM gear;\n",
            expected: [["Neural Jack","premium"],["Optic Mod","budget"],["Dermal Plate","budget"],["Reflex Booster","premium"],["Skin Weave","budget"],["Voice Box","budget"]],
            orderMatters: false,
            hint: "CASE WHEN price >= 1000 THEN 'premium' ELSE 'budget' END AS tier.", lore: "Premium chrome, premium prices. Budget chrome, budget regrets."
          },
          {
            id: "sql-prefix", title: "STOCK CODE", kind: "query", difficulty: 3, xp: 180,
            brief: "Slice the first three letters, upper case.",
            prompt: "From **gear**, build one column labeled **code**: take the **first 3 characters** of each item's **name** and convert them to upper case (use SUBSTR and UPPER). For example `Neural Jack` becomes `NEU`. One column, every row, table order.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name AS code FROM gear;\n",
            solution: "SELECT UPPER(SUBSTR(name, 1, 3)) AS code FROM gear;\n",
            expected: [["NEU"],["OPT"],["DER"],["REF"],["SKI"],["VOI"]],
            orderMatters: false,
            hint: "SUBSTR(name, 1, 3) grabs the first three chars; wrap it in UPPER(...).", lore: "Three letters on the crate. The rest is need-to-know."
          },
          {
            id: "sql-restock", title: "RESTOCK ALERT", kind: "query", difficulty: 3, xp: 180,
            brief: "Three-way stock status with CASE.",
            prompt: "From **gear**, return the **name** and a column **status** using a chained CASE on **qty**: when qty is **less than 5** return **'critical'**, when qty is **less than 10** return **'low'**, otherwise **'stocked'**. Two columns, every row, table order.",
            setup: "CREATE TABLE gear (id INTEGER, name TEXT, price INTEGER, qty INTEGER, rating REAL, grade TEXT);\nINSERT INTO gear VALUES (1,'Neural Jack',1200,3,4.6,'A'),(2,'Optic Mod',640,7,3.9,'B'),(3,'Dermal Plate',300,12,2.8,'C'),(4,'Reflex Booster',1850,2,4.95,'A'),(5,'Skin Weave',420,9,3.2,'B'),(6,'Voice Box',95,20,2.1,'C');",
            starter: "SELECT name, qty FROM gear;\n",
            solution: "SELECT name, CASE WHEN qty < 5 THEN 'critical' WHEN qty < 10 THEN 'low' ELSE 'stocked' END AS status FROM gear;\n",
            expected: [["Neural Jack","critical"],["Optic Mod","low"],["Dermal Plate","stocked"],["Reflex Booster","critical"],["Skin Weave","low"],["Voice Box","stocked"]],
            orderMatters: false,
            hint: "Order matters in CASE: test qty < 5 first, then qty < 10, then ELSE.", lore: "Two units left on the booster. The fixers are already circling."
          }
        ],
      },
      {
        id: "sqlm06-joins2", code: "0x06", title: "ADVANCED JOINS",
        subtitle: "LEFT JOIN · multi-table · self-join · join+aggregate",
        theory: "## The grid you are jacking into\nThree tables wired together:\n~~~text\ncrews(id, name, sector)\nrunners(id, alias, crew_id, mentor_id)\ncontracts(id, runner_id, target, payout)\n~~~\nA **runner** belongs to a **crew** (crew_id) and may have a **mentor** who is *another runner* (mentor_id). A **contract** is a job pulled by one runner (runner_id).\n\n## LEFT JOIN — keep every left-side row\nA plain `JOIN` (inner join) only returns rows that match on **both** sides. If a runner has no crew, an inner join silently drops that runner.\n\nA **LEFT JOIN** keeps **every** row from the **left** table (the one before `LEFT JOIN`). When the right side has no match, its columns come back as **NULL** instead of vanishing.\n~~~sql\nSELECT runners.alias, crews.name\nFROM runners\nLEFT JOIN crews ON runners.crew_id = crews.id;\n~~~\n**WHY:** you want a full roster — including the freelancer with no crew — not just the ones who happen to match.\n\n> INTEL — To find the *unmatched* rows (the freelancer, the empty crew), LEFT JOIN and then filter `WHERE rightTable.id IS NULL`. Those NULLs are the rows that had no partner.\n\n> WARNING — **Left vs right matters.** `runners LEFT JOIN crews` keeps all runners; `crews LEFT JOIN runners` keeps all crews. They answer different questions. Pick the table you must not lose, and put it on the left.\n\n## Joining three tables\nChain `JOIN` clauses. Each `ON` connects the new table to one already in the query. To walk from a contract out to the crew, hop contract → runner → crew:\n~~~sql\nSELECT contracts.target, runners.alias, crews.name\nFROM contracts\nJOIN runners ON contracts.runner_id = runners.id\nJOIN crews   ON runners.crew_id = crews.id;\n~~~\n**WHY:** the fact you need (the target) lives in one table but the labels (alias, crew name) live in others. Joins reassemble the full picture.\n\n## Self-join — one table, two roles\nWhen a table points back at itself (a runner's `mentor_id` is another runner's `id`), join the table **to itself** using two **aliases** so SQLite can tell the two copies apart:\n~~~sql\nSELECT r.alias AS student, m.alias AS mentor\nFROM runners AS r\nJOIN runners AS m ON r.mentor_id = m.id;\n~~~\nHere `r` is the student copy and `m` is the mentor copy of the *same* table.\n\n> WARNING — Without aliases, `SELECT alias FROM runners JOIN runners ...` is **ambiguous** — SQLite cannot tell which copy you mean and the query errors. The aliases (`r`, `m`) are mandatory.\n\n## JOIN + GROUP BY + an aggregate\nJoin first to stitch the rows together, then `GROUP BY` to fold them into buckets and run an aggregate (`COUNT`, `SUM`, `AVG`...). Counting **contracts per runner** with a LEFT JOIN keeps runners who pulled **zero** jobs (their count is 0):\n~~~sql\nSELECT runners.alias, COUNT(contracts.id) AS jobs\nFROM runners\nLEFT JOIN contracts ON contracts.runner_id = runners.id\nGROUP BY runners.id;\n~~~\n> INTEL — Count the column from the **right** table (`COUNT(contracts.id)`), not `COUNT(*)`. `COUNT(*)` counts rows — and a LEFT-JOINed runner with no contract still has one NULL row, so `COUNT(*)` would wrongly report 1. `COUNT(contracts.id)` ignores NULLs and correctly reports 0.",
        exercises: [
          {
            id: "sql-roster-full", title: "FULL ROSTER", kind: "query", difficulty: 1, xp: 120,
            brief: "Every runner, crew or not.",
            prompt: "List **every** runner with the **name** of their crew. Return two columns: runners.**alias** and crews.**name**. Runners with no crew must still appear (their crew name will be NULL). Use a LEFT JOIN. Order by runners.alias (A→Z).",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT runners.alias, crews.name FROM runners JOIN crews ON runners.crew_id = crews.id ORDER BY runners.alias;\n",
            solution: "SELECT runners.alias, crews.name FROM runners LEFT JOIN crews ON runners.crew_id = crews.id ORDER BY runners.alias;\n",
            expected: [["Cobra","Neon Wraiths"],["Drift",null],["Echo","Black ICE"],["Halcyon","Ghost Lattice"],["Static","Black ICE"],["Wisp","Neon Wraiths"]],
            orderMatters: true,
            hint: "LEFT JOIN crews ON runners.crew_id = crews.id — the LEFT keeps the crewless runner.", lore: "Even the unaffiliated leave footprints on the grid."
          },
          {
            id: "sql-freelancer", title: "FREELANCER", kind: "query", difficulty: 1, xp: 120,
            brief: "The runner with no crew.",
            prompt: "Find the runner(s) who belong to **no crew**. LEFT JOIN runners to crews, then keep only the rows where the crew did not match (crews.id IS NULL). Return one column: runners.**alias**. Order does not matter.",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT alias FROM runners;\n",
            solution: "SELECT runners.alias FROM runners LEFT JOIN crews ON runners.crew_id = crews.id WHERE crews.id IS NULL;\n",
            expected: [["Drift"]],
            orderMatters: false,
            hint: "After the LEFT JOIN, the unmatched rows are exactly the ones WHERE crews.id IS NULL.", lore: "No colours, no banner — only a handle and a price."
          },
          {
            id: "sql-empty-crew", title: "EMPTY CREW", kind: "query", difficulty: 2, xp: 170,
            brief: "A crew with nobody in it.",
            prompt: "Find the crew(s) that have **no runners** assigned. LEFT JOIN crews to runners (crews on the left this time), then keep rows where no runner matched (runners.id IS NULL). Return one column: crews.**name**. Order does not matter.",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT crews.name FROM crews LEFT JOIN runners ON runners.crew_id = crews.id;\n",
            solution: "SELECT crews.name FROM crews LEFT JOIN runners ON runners.crew_id = crews.id WHERE runners.id IS NULL;\n",
            expected: [["Pale Choir"]],
            orderMatters: false,
            hint: "Put crews on the left, LEFT JOIN runners, then filter WHERE runners.id IS NULL.", lore: "A banner with no soldiers behind it."
          },
          {
            id: "sql-contract-trace", title: "CONTRACT TRACE", kind: "query", difficulty: 2, xp: 170,
            brief: "Walk contract to runner to crew.",
            prompt: "For every contract, return three columns: contracts.**target**, runners.**alias** (who pulled it) and crews.**name** (their crew). Join all three tables (contracts → runners → crews). Order by contracts.payout **descending** (highest payout first).",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT contracts.target, runners.alias FROM contracts JOIN runners ON contracts.runner_id = runners.id;\n",
            solution: "SELECT contracts.target, runners.alias, crews.name FROM contracts JOIN runners ON contracts.runner_id = runners.id JOIN crews ON runners.crew_id = crews.id ORDER BY contracts.payout DESC;\n",
            expected: [["Militech vault","Cobra","Neon Wraiths"],["Petrochem grid","Static","Black ICE"],["Arasaka node","Cobra","Neon Wraiths"],["NUSA relay","Halcyon","Ghost Lattice"],["Biotechnica DB","Wisp","Neon Wraiths"]],
            orderMatters: true,
            hint: "Two JOINs: contracts JOIN runners ON runner_id=id, then JOIN crews ON crew_id=id. Then ORDER BY contracts.payout DESC.", lore: "Follow the money back to the banner that flies it."
          },
          {
            id: "sql-mentor-link", title: "MENTOR LINK", kind: "query", difficulty: 2, xp: 170,
            brief: "Pair each student with their mentor.",
            prompt: "Each runner's mentor_id points to another runner's id. Self-join the **runners** table to itself (aliases **r** for the student, **m** for the mentor) to pair each student with their mentor. Return two columns: the student's alias and the mentor's alias. Only runners who actually have a mentor should appear. Order by the student's alias (A→Z).",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT alias, mentor_id FROM runners WHERE mentor_id IS NOT NULL;\n",
            solution: "SELECT r.alias, m.alias FROM runners AS r JOIN runners AS m ON r.mentor_id = m.id ORDER BY r.alias;\n",
            expected: [["Drift","Cobra"],["Echo","Static"],["Halcyon","Static"],["Wisp","Cobra"]],
            orderMatters: true,
            hint: "FROM runners AS r JOIN runners AS m ON r.mentor_id = m.id — two aliases for the same table.", lore: "Every ghost in the wire learned from another ghost."
          },
          {
            id: "sql-jobs-per-runner", title: "JOBS PER RUNNER", kind: "query", difficulty: 3, xp: 240,
            brief: "Count contracts, including zeros.",
            prompt: "Count how many contracts each runner has pulled — including runners who have pulled **zero** (their count must be 0). LEFT JOIN runners to contracts, GROUP BY the runner, and COUNT the contracts. Return two columns: runners.**alias** and the count. Order by runners.alias (A→Z).",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT runners.alias, COUNT(contracts.id) FROM runners JOIN contracts ON contracts.runner_id = runners.id GROUP BY runners.id ORDER BY runners.alias;\n",
            solution: "SELECT runners.alias, COUNT(contracts.id) FROM runners LEFT JOIN contracts ON contracts.runner_id = runners.id GROUP BY runners.id ORDER BY runners.alias;\n",
            expected: [["Cobra",2],["Drift",0],["Echo",0],["Halcyon",1],["Static",1],["Wisp",1]],
            orderMatters: true,
            hint: "LEFT JOIN keeps the zero-contract runners; COUNT(contracts.id) (not COUNT(*)) reports 0 for them.", lore: "Some runners are all talk and no breach."
          },
          {
            id: "sql-crew-haul", title: "CREW HAUL", kind: "query", difficulty: 3, xp: 240,
            brief: "Total payout banked by each crew.",
            prompt: "Total the payout banked by each crew. Join crews → runners → contracts, GROUP BY the crew, and SUM contracts.payout. Return two columns: crews.**name** and the total payout. Only crews that have at least one contract will appear. Order by the total payout **descending** (biggest haul first).",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT crews.name, SUM(contracts.payout) FROM crews JOIN runners ON runners.crew_id = crews.id GROUP BY crews.id;\n",
            solution: "SELECT crews.name, SUM(contracts.payout) FROM crews JOIN runners ON runners.crew_id = crews.id JOIN contracts ON contracts.runner_id = runners.id GROUP BY crews.id ORDER BY SUM(contracts.payout) DESC;\n",
            expected: [["Neon Wraiths",16000],["Black ICE",7000],["Ghost Lattice",4500]],
            orderMatters: true,
            hint: "Three tables joined, GROUP BY crews.id, SUM(contracts.payout), then ORDER BY that sum DESC.", lore: "Whichever banner banks the most eddies runs the sector."
          },
          {
            id: "sql-mentor-crew", title: "MENTOR & CREW", kind: "query", difficulty: 3, xp: 240,
            brief: "Student, mentor, and the student's crew.",
            prompt: "For each runner who has a mentor, return three columns: the student's alias, the mentor's alias, and the **name** of the **student's** crew. Self-join runners to itself (r = student, m = mentor) and also JOIN crews on the student's crew_id. Order by the student's alias (A→Z).",
            setup: "CREATE TABLE crews (id INTEGER PRIMARY KEY, name TEXT, sector TEXT);\nINSERT INTO crews (id, name, sector) VALUES\n (1, 'Neon Wraiths', 'Shibuya'),\n (2, 'Black ICE', 'Chiba'),\n (3, 'Ghost Lattice', 'Night City'),\n (4, 'Pale Choir', 'Watson');\nCREATE TABLE runners (id INTEGER PRIMARY KEY, alias TEXT, crew_id INTEGER, mentor_id INTEGER);\nINSERT INTO runners (id, alias, crew_id, mentor_id) VALUES\n (1, 'Cobra', 1, NULL),\n (2, 'Wisp', 1, 1),\n (3, 'Static', 2, NULL),\n (4, 'Echo', 2, 3),\n (5, 'Drift', NULL, 1),\n (6, 'Halcyon', 3, 3);\nCREATE TABLE contracts (id INTEGER PRIMARY KEY, runner_id INTEGER, target TEXT, payout INTEGER);\nINSERT INTO contracts (id, runner_id, target, payout) VALUES\n (1, 1, 'Arasaka node', 5000),\n (2, 1, 'Militech vault', 8000),\n (3, 2, 'Biotechnica DB', 3000),\n (4, 3, 'Petrochem grid', 7000),\n (5, 6, 'NUSA relay', 4500);",
            starter: "SELECT r.alias, m.alias FROM runners AS r JOIN runners AS m ON r.mentor_id = m.id ORDER BY r.alias;\n",
            solution: "SELECT r.alias, m.alias, crews.name FROM runners AS r JOIN runners AS m ON r.mentor_id = m.id JOIN crews ON r.crew_id = crews.id ORDER BY r.alias;\n",
            expected: [["Echo","Static","Black ICE"],["Halcyon","Static","Ghost Lattice"],["Wisp","Cobra","Neon Wraiths"]],
            orderMatters: true,
            hint: "Keep the self-join (r, m), then add JOIN crews ON r.crew_id = crews.id for the student's crew name.", lore: "Lineage and allegiance, traced in a single pull."
          }
        ],
      },
      {
        id: "sqlm07-subq", code: "0x07", title: "SUBQUERIES",
        subtitle: "scalar · IN (subquery) · correlated · derived table",
        theory: "## What a subquery is\nA **subquery** is a SELECT tucked inside another query. The inner query runs first, hands its result to the outer query, and the outer query uses it. Think of it as asking a small question to answer a bigger one.\n\n## 1. Scalar subquery (returns ONE value)\nA scalar subquery returns a single value, so you can compare a column against it in **WHERE**.\n~~~sql\nSELECT handle, payout FROM runners\nWHERE payout > (SELECT AVG(payout) FROM runners);\n~~~\n**WHAT** it does: the inner query computes the average payout once; the outer query keeps only rows above it. **WHY** use it: you cannot put AVG() directly in a WHERE clause, so you wrap it in a subquery.\n\n> INTEL — A scalar subquery must return exactly one row and one column. Use AVG/MAX/MIN/COUNT, or a single-row lookup like (SELECT rep FROM runners WHERE handle = 'Cipher').\n\n## 2. WHERE col IN (SELECT ...)\nWhen the inner query returns a *list* of values, test membership with **IN**.\n~~~sql\nSELECT handle FROM runners\nWHERE id IN (SELECT runner_id FROM contracts);\n~~~\n**WHAT** it does: the inner query lists every runner_id that holds a contract; the outer query keeps runners whose id is in that list. **WHY**: it answers \"which rows match something in another table?\" without writing a JOIN. Flip it to **NOT IN** for the opposite group.\n\n> WARNING — NOT IN behaves strangely if the inner list contains NULL. Keep the inner column NULL-free (as ours is) and you are safe.\n\n## 3. Correlated subquery (runs once per outer row)\nA **correlated** subquery refers back to the outer query, so it re-runs for each outer row.\n~~~sql\nSELECT handle, sector FROM runners r\nWHERE payout = (SELECT MAX(payout) FROM runners s WHERE s.sector = r.sector);\n~~~\n**WHAT** it does: for each runner r, the inner query finds the top payout *in that runner's own sector*; we keep r only if it owns that top payout. **WHY**: it compares each row to its own group. The table aliases **r** and **s** are what link the inner query to the outer one.\n\n## 4. Derived table — FROM (SELECT ...) alias\nYou can SELECT from the result of another SELECT. That inner result is a **derived table**, and it MUST be given an alias.\n~~~sql\nSELECT sector, avg_rep\nFROM (SELECT sector, AVG(rep) AS avg_rep FROM runners GROUP BY sector) t\nWHERE avg_rep >= 70;\n~~~\n**WHAT** it does: the inner query builds a mini-table of one row per sector with its average rep; the outer query filters that mini-table. **WHY**: it lets you filter or sort on an aggregate you just computed.\n\n> WARNING — Forgetting the alias after the closing parenthesis (the **t** above) is the #1 beginner mistake. SQLite rejects a derived table with no name.\n\n## The grid\n~~~text\nrunners(id, handle, sector, rep, payout)\ncontracts(id, runner_id, target, bounty)\n~~~",
        exercises: [
          {
            id: "sql-overpaid", title: "OVERPAID", kind: "query", difficulty: 1, xp: 120,
            brief: "Runners earning above the average.",
            prompt: "The **runners(id, handle, sector, rep, payout)** table lists every netrunner on the grid. Return the **handle** and **payout** of each runner whose **payout** is **strictly greater than the average payout** of all runners. Two columns. Any order.",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle, payout FROM runners;\n",
            solution: "SELECT handle, payout FROM runners WHERE payout > (SELECT AVG(payout) FROM runners);\n",
            expected: [["Glitch",42000],["Nyx",60000],["Cipher",30000]],
            orderMatters: false,
            hint: "Wrap the average in a subquery: WHERE payout > (SELECT AVG(payout) FROM runners).", lore: "The fixer pays by the megabyte. Most of us never see the mean."
          },
          {
            id: "sql-outclass", title: "OUTCLASS CIPHER", kind: "query", difficulty: 1, xp: 120,
            brief: "Reps above Cipher's.",
            prompt: "Return the **handle** of every runner whose **rep** is **strictly higher than Cipher's rep**. Look up Cipher's rep with a subquery (do not hard-code a number). One column, sorted by handle (A to Z).",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle FROM runners ORDER BY handle;\n",
            solution: "SELECT handle FROM runners WHERE rep > (SELECT rep FROM runners WHERE handle = 'Cipher') ORDER BY handle;\n",
            expected: [["Glitch"],["Nyx"]],
            orderMatters: true,
            hint: "Compare rep to (SELECT rep FROM runners WHERE handle = 'Cipher').", lore: "Cipher set the bar. A few ghosts cleared it."
          },
          {
            id: "sql-contracted", title: "ON THE BOARD", kind: "query", difficulty: 2, xp: 150,
            brief: "Runners holding a contract.",
            prompt: "The **contracts(id, runner_id, target, bounty)** table records who is on a job. Return the **handle** of every runner that holds **at least one contract** — match runners.id against the runner_id values inside contracts using **IN (SELECT ...)**. One column, sorted by handle (A to Z).",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle FROM runners ORDER BY handle;\n",
            solution: "SELECT handle FROM runners WHERE id IN (SELECT runner_id FROM contracts) ORDER BY handle;\n",
            expected: [["Cipher"],["Glitch"],["Nyx"]],
            orderMatters: true,
            hint: "WHERE id IN (SELECT runner_id FROM contracts).", lore: "If your tag is on the board, you are already burning daylight."
          },
          {
            id: "sql-benched", title: "BENCHED", kind: "query", difficulty: 2, xp: 150,
            brief: "Runners with no contract.",
            prompt: "Return the **handle** of every runner that holds **no contract at all** — use **NOT IN (SELECT runner_id FROM contracts)**. One column, sorted by handle (A to Z).",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle FROM runners ORDER BY handle;\n",
            solution: "SELECT handle FROM runners WHERE id NOT IN (SELECT runner_id FROM contracts) ORDER BY handle;\n",
            expected: [["Riser"],["Vex"],["Wraith"]],
            orderMatters: true,
            hint: "Flip the membership test: WHERE id NOT IN (SELECT runner_id FROM contracts).", lore: "No job, no payout. Just neon and cold noodles."
          },
          {
            id: "sql-richseam", title: "RICH SEAM", kind: "query", difficulty: 2, xp: 150,
            brief: "Everyone in the top earner's sector.",
            prompt: "Find the sector of the single highest-paid runner, then return the **handle** of **every** runner working in that **same sector**. Use a scalar subquery to get the top earner's sector. One column, sorted by handle (A to Z).",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle FROM runners ORDER BY handle;\n",
            solution: "SELECT handle FROM runners WHERE sector = (SELECT sector FROM runners ORDER BY payout DESC LIMIT 1) ORDER BY handle;\n",
            expected: [["Nyx"],["Riser"]],
            orderMatters: true,
            hint: "Inner query: (SELECT sector FROM runners ORDER BY payout DESC LIMIT 1). Compare sector to it.", lore: "Money clusters. Find the seam, work the seam."
          },
          {
            id: "sql-localking", title: "LOCAL KINGS", kind: "query", difficulty: 3, xp: 180,
            brief: "Top earner of each sector.",
            prompt: "Return the **handle** and **sector** of the runner with the **highest payout in their own sector** (one per sector). Use a **correlated subquery** that compares each runner's payout to the MAX payout of that same sector. Two columns, sorted by sector (A to Z).",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle, sector FROM runners ORDER BY sector;\n",
            solution: "SELECT handle, sector FROM runners r WHERE payout = (SELECT MAX(payout) FROM runners s WHERE s.sector = r.sector) ORDER BY sector;\n",
            expected: [["Nyx","Kowloon"],["Cipher","Neon Spine"],["Glitch","Shibuya"]],
            orderMatters: true,
            hint: "Alias the outer table r and the inner table s; link them with WHERE s.sector = r.sector.", lore: "Every block has one name the drones whisper."
          },
          {
            id: "sql-overlocal", title: "ABOVE THE BLOCK", kind: "query", difficulty: 3, xp: 180,
            brief: "Beating your own sector average.",
            prompt: "Return the **handle** and **sector** of every runner whose **payout is above the average payout of their OWN sector**. Use a **correlated subquery** (the inner AVG must filter to the outer row's sector). Two columns, sorted by handle (A to Z).",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT handle, sector FROM runners ORDER BY handle;\n",
            solution: "SELECT handle, sector FROM runners r WHERE payout > (SELECT AVG(payout) FROM runners s WHERE s.sector = r.sector) ORDER BY handle;\n",
            expected: [["Cipher","Neon Spine"],["Glitch","Shibuya"],["Nyx","Kowloon"]],
            orderMatters: true,
            hint: "Correlate the inner AVG to the outer row: (SELECT AVG(payout) FROM runners s WHERE s.sector = r.sector).", lore: "Out-earn your neighbors and the syndicate takes notice."
          },
          {
            id: "sql-repmap", title: "REP HOTSPOTS", kind: "query", difficulty: 3, xp: 180,
            brief: "Sectors with high average rep.",
            prompt: "First build a per-sector average rep, then keep only the strong sectors. Using a **derived table** in the FROM clause, return **sector** and its **avg_rep** for every sector whose average rep is **70 or higher**. Sort by avg_rep, highest first. The derived table MUST have an alias.",
            setup: "CREATE TABLE runners (id INTEGER, handle TEXT, sector TEXT, rep INTEGER, payout INTEGER);\nINSERT INTO runners VALUES\n  (1,'Glitch','Shibuya',88,42000),\n  (2,'Vex','Shibuya',64,15000),\n  (3,'Nyx','Kowloon',91,60000),\n  (4,'Riser','Kowloon',55,9000),\n  (5,'Cipher','Neon Spine',73,30000),\n  (6,'Wraith','Neon Spine',40,5000);\nCREATE TABLE contracts (id INTEGER, runner_id INTEGER, target TEXT, bounty INTEGER);\nINSERT INTO contracts VALUES\n  (101,3,'Arasaka Vault',120000),\n  (102,1,'Militech Relay',55000),\n  (103,3,'Biotechnica Node',80000),\n  (104,5,'Petrochem Grid',25000);\n",
            starter: "SELECT sector, AVG(rep) AS avg_rep FROM runners GROUP BY sector;\n",
            solution: "SELECT sector, avg_rep FROM (SELECT sector, AVG(rep) AS avg_rep FROM runners GROUP BY sector) t WHERE avg_rep >= 70 ORDER BY avg_rep DESC;\n",
            expected: [["Shibuya",76],["Kowloon",73]],
            orderMatters: true,
            hint: "FROM (SELECT sector, AVG(rep) AS avg_rep FROM runners GROUP BY sector) t, then WHERE avg_rep >= 70.", lore: "Where the reputations run hot, the real work hides."
          }
        ],
      },
      {
        id: "sqlm08-mutate2", code: "0x08", title: "MUTATIONS II",
        subtitle: "DELETE · UPDATE expr · INSERT…SELECT · conditional",
        theory: "## Rewriting the grid\nIn the last sector you added rows (INSERT) and changed them (UPDATE). Now you learn to **delete** rows, **compute** new values, **copy** rows between tables, and make **conditional** edits. Every move here is a *mutation* — it changes the database instead of just reading it.\n\nFor each task you write the mutation; the verifier then runs a **check** query (a plain SELECT, shown in the prompt) and compares what it reveals. So you are always told exactly what will be inspected afterward.\n\n## DELETE — remove rows\n**WHAT:** **DELETE FROM table WHERE condition;** erases every row that matches the condition.\n**WHY:** purge dead, expired, or unwanted records.\n~~~sql\nDELETE FROM drones WHERE status = 'scrapped';\n~~~\n\n> WARNING — A DELETE with **no WHERE** wipes the *entire* table. There is no undo here. Always aim with WHERE before you fire.\n\n## UPDATE with an expression\nSET can store a **computed value**, not just a fixed one. The right side can do arithmetic on the column's current value.\n**WHAT:** **SET battery = battery + 10** reads each row's current battery and writes back the new number.\n**WHY:** recharge, apply a discount, add a bonus — change values *relative* to what they already are.\n~~~sql\nUPDATE drones SET battery = battery + 10 WHERE status = 'active';\n~~~\n\n> INTEL — **battery = battery + 10** is not a contradiction. SQL reads the old value, adds 10, and stores the result. It is the same idea as x = x + 10 in other languages.\n\n## INSERT … SELECT — copy rows in\nInstead of typing VALUES, you can feed INSERT the **rows a SELECT returns**. The selected columns line up, in order, with the target columns.\n**WHAT:** copy matching rows from one table into another.\n**WHY:** archive, snapshot, or move records without retyping them.\n~~~sql\nINSERT INTO scrapyard (codename, status)\nSELECT codename, status FROM drones WHERE battery = 0;\n~~~\n\n> WARNING — The SELECT's columns must match the INSERT column list in **count and order**, or you store data in the wrong place.\n\n## Conditional UPDATE with CASE\n**CASE** lets **one** UPDATE write **different** values per row, based on a test.\n**WHAT:** **CASE WHEN test THEN value ... ELSE value END** picks a value row by row.\n**WHY:** retag, re-grade, or bucket many rows in a single statement.\n~~~sql\nUPDATE drones\nSET status = CASE WHEN battery = 0 THEN 'dead' ELSE 'active' END;\n~~~\n\n> INTEL — Without an **ELSE**, rows that match no **WHEN** are set to NULL. Add ELSE to leave them on a sensible default.\n",
        exercises: [
          {
            id: "sql-purge-scrap", title: "PURGE THE SCRAP", kind: "mutation", difficulty: 1, xp: 120,
            brief: "Delete the dead units.",
            prompt: "The **drones(id, codename, battery, status, credits)** fleet is cluttered with junk. DELETE from **drones** every row whose **status** is **'scrapped'** — and nothing else.\n\nThe verifier then runs: SELECT codename FROM drones ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "-- DELETE the scrapped drones here\n",
            solution: "DELETE FROM drones WHERE status = 'scrapped';\n",
            expected: [["Hornet"],["Locust"],["Moth"],["Wasp"]],
            orderMatters: true,
            check: "SELECT codename FROM drones ORDER BY codename;",
            hint: "DELETE FROM drones WHERE status = 'scrapped';", lore: "Two husks, hauled to the smelter before dawn."
          },
          {
            id: "sql-drop-broke", title: "DROP THE BROKE", kind: "mutation", difficulty: 1, xp: 120,
            brief: "Delete units with no credits.",
            prompt: "Cut the freeloaders. DELETE from **drones** every row whose **credits** equals **0** — leave every other row untouched.\n\nThe verifier then runs: SELECT codename FROM drones ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "DELETE FROM drones;\n",
            solution: "DELETE FROM drones WHERE credits = 0;\n",
            expected: [["Hornet"],["Locust"],["Mantis"],["Moth"],["Wasp"]],
            orderMatters: true,
            check: "SELECT codename FROM drones ORDER BY codename;",
            hint: "Add WHERE credits = 0 so you only remove the broke unit.", lore: "No credits, no clearance. Off the grid you go."
          },
          {
            id: "sql-recharge-active", title: "RECHARGE THE ACTIVE", kind: "mutation", difficulty: 2, xp: 150,
            brief: "Add 10 battery to active units.",
            prompt: "A power surge tops up the working fleet. UPDATE **drones**: for every row whose **status** is **'active'**, set **battery** to its current value **plus 10**. Other rows stay as they are.\n\nThe verifier then runs: SELECT codename, battery FROM drones WHERE status = 'active' ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "UPDATE drones SET battery = 10 WHERE status = 'active';\n",
            solution: "UPDATE drones SET battery = battery + 10 WHERE status = 'active';\n",
            expected: [["Hornet",55],["Wasp",90]],
            orderMatters: true,
            check: "SELECT codename, battery FROM drones WHERE status = 'active' ORDER BY codename;",
            hint: "Use SET battery = battery + 10 (read the old value, add 10), not battery = 10.", lore: "Coils hum. Ten more percent before the next sweep."
          },
          {
            id: "sql-double-credits", title: "DOUBLE THE BOUNTY", kind: "mutation", difficulty: 2, xp: 150,
            brief: "Double credits for idle units.",
            prompt: "Management offers a retention bonus. UPDATE **drones**: for every row whose **status** is **'idle'**, set **credits** to **double** its current value (credits times 2). Leave all other rows alone.\n\nThe verifier then runs: SELECT codename, credits FROM drones WHERE status = 'idle' ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "UPDATE drones SET credits = credits * 2 WHERE status = 'active';\n",
            solution: "UPDATE drones SET credits = credits * 2 WHERE status = 'idle';\n",
            expected: [["Locust",2400],["Moth",600]],
            orderMatters: true,
            check: "SELECT codename, credits FROM drones WHERE status = 'idle' ORDER BY codename;",
            hint: "SET credits = credits * 2, and add WHERE status = 'idle' so only idle units double.", lore: "Idle hands, fattened wallets. Keep them loyal."
          },
          {
            id: "sql-archive-dead", title: "ARCHIVE THE DEAD", kind: "mutation", difficulty: 2, xp: 150,
            brief: "Copy flat-battery units to the scrapyard.",
            prompt: "Snapshot the casualties. INSERT INTO **scrapyard(codename, status)** the **codename** and **status** of every drone whose **battery** equals **0**. Read the rows with a SELECT from **drones**.\n\nThe verifier then runs: SELECT codename, status FROM scrapyard ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "-- copy the flat-battery drones into scrapyard with INSERT ... SELECT\n",
            solution: "INSERT INTO scrapyard (codename, status)\nSELECT codename, status FROM drones WHERE battery = 0;\n",
            expected: [["Gnat","scrapped"],["Moth","idle"]],
            orderMatters: true,
            check: "SELECT codename, status FROM scrapyard ORDER BY codename;",
            hint: "INSERT INTO scrapyard (codename, status) SELECT codename, status FROM drones WHERE battery = 0;", lore: "Their last positions, logged in the boneyard ledger."
          },
          {
            id: "sql-mothball-idle", title: "MOTHBALL THE IDLE", kind: "mutation", difficulty: 3, xp: 180,
            brief: "Archive idle units and drain their battery.",
            prompt: "Two-step decommission. First INSERT INTO **scrapyard(codename, status)** the **codename** and the literal status text **'mothballed'** for every drone whose **status** is **'idle'**. Then UPDATE those same **idle** drones in **drones**, setting their **battery** to **0**.\n\nThe verifier then runs: SELECT s.codename, s.status, d.battery FROM scrapyard s JOIN drones d ON d.codename = s.codename ORDER BY s.codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "INSERT INTO scrapyard (codename, status)\nSELECT codename, status FROM drones WHERE status = 'idle';\n",
            solution: "INSERT INTO scrapyard (codename, status)\nSELECT codename, 'mothballed' FROM drones WHERE status = 'idle';\nUPDATE drones SET battery = 0 WHERE status = 'idle';\n",
            expected: [["Locust","mothballed",0],["Moth","mothballed",0]],
            orderMatters: true,
            check: "SELECT s.codename, s.status, d.battery FROM scrapyard s JOIN drones d ON d.codename = s.codename ORDER BY s.codename;",
            hint: "Select codename and the literal 'mothballed', then UPDATE ... SET battery = 0 WHERE status = 'idle'.", lore: "Powered down, tagged, and shelved for the long winter."
          },
          {
            id: "sql-retag-battery", title: "RETAG BY CHARGE", kind: "mutation", difficulty: 3, xp: 180,
            brief: "One CASE update sets status from battery.",
            prompt: "Re-grade the whole fleet in one statement. UPDATE **drones** and set **status** using CASE based on **battery**: battery **0** → **'dead'**; battery **less than 50** (but not 0) → **'low'**; otherwise → **'ready'**. Apply it to every row.\n\nThe verifier then runs: SELECT codename, status FROM drones ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "UPDATE drones SET status = 'ready';\n",
            solution: "UPDATE drones SET status = CASE WHEN battery = 0 THEN 'dead' WHEN battery < 50 THEN 'low' ELSE 'ready' END;\n",
            expected: [["Gnat","dead"],["Hornet","low"],["Locust","ready"],["Mantis","low"],["Moth","dead"],["Wasp","ready"]],
            orderMatters: true,
            check: "SELECT codename, status FROM drones ORDER BY codename;",
            hint: "UPDATE drones SET status = CASE WHEN battery = 0 THEN 'dead' WHEN battery < 50 THEN 'low' ELSE 'ready' END; — order the WHENs so 0 is caught first.", lore: "Green, amber, black. The grid recolors itself."
          },
          {
            id: "sql-tier-credits", title: "TIER BY CREDITS", kind: "mutation", difficulty: 3, xp: 180,
            brief: "CASE update for high earners only.",
            prompt: "Reward the earners — and only them. UPDATE **drones**: for every row whose **credits** is **at least 900**, set **status** using CASE — credits **at least 1000** → **'elite'**, otherwise → **'veteran'**. Rows with credits under 900 must be left exactly as they are.\n\nThe verifier then runs: SELECT codename, status FROM drones ORDER BY codename.",
            setup: "CREATE TABLE drones (id INTEGER, codename TEXT, battery INTEGER, status TEXT, credits INTEGER);\nINSERT INTO drones VALUES (1,'Wasp',80,'active',500),(2,'Moth',0,'idle',300),(3,'Hornet',45,'active',900),(4,'Gnat',0,'scrapped',0),(5,'Locust',100,'idle',1200),(6,'Mantis',20,'scrapped',150);\nCREATE TABLE scrapyard (codename TEXT, status TEXT);",
            starter: "UPDATE drones SET status = CASE WHEN credits >= 1000 THEN 'elite' ELSE 'veteran' END;\n",
            solution: "UPDATE drones SET status = CASE WHEN credits >= 1000 THEN 'elite' ELSE 'veteran' END WHERE credits >= 900;\n",
            expected: [["Gnat","scrapped"],["Hornet","veteran"],["Locust","elite"],["Mantis","scrapped"],["Moth","idle"],["Wasp","active"]],
            orderMatters: true,
            check: "SELECT codename, status FROM drones ORDER BY codename;",
            hint: "Add WHERE credits >= 900 so the CASE only touches earners; the CASE then splits elite from veteran.", lore: "Two new ranks stamped on the high rollers. The rest stay nameless."
          }
        ],
      }
  );
  add("sqlm01-select", [
          {
            id: "sql-roster", title: "FULL ROSTER", kind: "query", difficulty: 1, xp: 120,
            brief: "Pull the whole file, in order.",
            prompt: "The **bounties(id, name, reward, planet)** table is your active case file. Return **all columns** for **every** bounty, ordered by **id** (lowest first).\n",
            setup: "CREATE TABLE bounties (id INTEGER, name TEXT, reward INTEGER, planet TEXT);INSERT INTO bounties VALUES (1,'Asimov',2500000,'Mars'),(2,'Teddy',1000000,'Mars'),(3,'Hex',800000,'Ganymede'),(4,'Pierrot',7000000,'Earth');",
            starter: "SELECT name FROM bounties;\n",
            solution: "SELECT * FROM bounties ORDER BY id;\n",
            expected: [[1,"Asimov",2500000,"Mars"],[2,"Teddy",1000000,"Mars"],[3,"Hex",800000,"Ganymede"],[4,"Pierrot",7000000,"Earth"]],
            orderMatters: true,
            hint: "Use SELECT * for all columns, then ORDER BY id.", lore: "Every face in the file gets a number before it gets a price."
          },
          {
            id: "sql-planets", title: "KNOWN HIDEOUTS", kind: "query", difficulty: 2, xp: 150,
            brief: "List each hideout world once.",
            prompt: "From **bounties(id, name, reward, planet)**, return the list of **distinct planet** values — each planet exactly once. No specific order is required.\n",
            setup: "CREATE TABLE bounties (id INTEGER, name TEXT, reward INTEGER, planet TEXT);INSERT INTO bounties VALUES (1,'Asimov',2500000,'Mars'),(2,'Teddy',1000000,'Mars'),(3,'Hex',800000,'Ganymede'),(4,'Pierrot',7000000,'Earth');",
            starter: "SELECT planet FROM bounties;\n",
            solution: "SELECT DISTINCT planet FROM bounties;\n",
            expected: [["Mars"],["Ganymede"],["Earth"]],
            orderMatters: false,
            hint: "SELECT DISTINCT planet collapses repeats into one row each.", lore: "Mars shows up twice in the logs, but it's still one red rock."
          },
          {
            id: "sql-offworld", title: "OFF MARS", kind: "query", difficulty: 2, xp: 150,
            brief: "Everyone who isn't on Mars.",
            prompt: "From **bounties(id, name, reward, planet)**, return the **name** and **planet** of every bounty whose **planet is not 'Mars'**, sorted by **name** alphabetically (A->Z).\n",
            setup: "CREATE TABLE bounties (id INTEGER, name TEXT, reward INTEGER, planet TEXT);INSERT INTO bounties VALUES (1,'Asimov',2500000,'Mars'),(2,'Teddy',1000000,'Mars'),(3,'Hex',800000,'Ganymede'),(4,'Pierrot',7000000,'Earth');",
            starter: "SELECT name, planet FROM bounties WHERE planet = 'Mars';\n",
            solution: "SELECT name, planet FROM bounties WHERE planet <> 'Mars' ORDER BY name;\n",
            expected: [["Hex","Ganymede"],["Pierrot","Earth"]],
            orderMatters: true,
            hint: "Use WHERE planet <> 'Mars' (or !=), then ORDER BY name.", lore: "The smart ones never linger on the same rock as the law."
          },
          {
            id: "sql-midrange", title: "MID-TIER MARKS", kind: "query", difficulty: 3, xp: 120,
            brief: "Bounties inside a pay band.",
            prompt: "From **bounties(id, name, reward, planet)**, return **name** and **reward** for every bounty whose **reward is between 1,000,000 and 3,000,000 inclusive**, ordered by **reward** ascending (lowest first).\n",
            setup: "CREATE TABLE bounties (id INTEGER, name TEXT, reward INTEGER, planet TEXT);INSERT INTO bounties VALUES (1,'Asimov',2500000,'Mars'),(2,'Teddy',1000000,'Mars'),(3,'Hex',800000,'Ganymede'),(4,'Pierrot',7000000,'Earth');",
            starter: "SELECT name, reward FROM bounties ORDER BY reward;\n",
            solution: "SELECT name, reward FROM bounties WHERE reward BETWEEN 1000000 AND 3000000 ORDER BY reward;\n",
            expected: [["Teddy",1000000],["Asimov",2500000]],
            orderMatters: true,
            hint: "WHERE reward BETWEEN 1000000 AND 3000000 keeps the band, then ORDER BY reward.", lore: "Not chump change, not a fortune. Just enough to refuel."
          },
          {
            id: "sql-cheapmars", title: "CHEAP ON MARS", kind: "query", difficulty: 3, xp: 120,
            brief: "Low-reward marks on the red planet.",
            prompt: "From **bounties(id, name, reward, planet)**, return the **name** of every bounty that is **on Mars AND worth less than 2,000,000**, sorted by **name** alphabetically (A->Z).\n",
            setup: "CREATE TABLE bounties (id INTEGER, name TEXT, reward INTEGER, planet TEXT);INSERT INTO bounties VALUES (1,'Asimov',2500000,'Mars'),(2,'Teddy',1000000,'Mars'),(3,'Hex',800000,'Ganymede'),(4,'Pierrot',7000000,'Earth');",
            starter: "SELECT name FROM bounties WHERE planet = 'Mars';\n",
            solution: "SELECT name FROM bounties WHERE planet = 'Mars' AND reward < 2000000 ORDER BY name;\n",
            expected: [["Teddy"]],
            orderMatters: true,
            hint: "Chain two conditions with AND: planet = 'Mars' AND reward < 2000000.", lore: "Barely worth the fuel, but Mars dust is cheap to walk through."
          }
  ]);

  add("sqlm02-agg", [
          {
            id: "sql-avgbpm", title: "MEAN TEMPO", kind: "query", difficulty: 1, xp: 120,
            brief: "Average tempo across the whole crate.",
            prompt: "From **tracks(title, artist, bpm, genre)**, return a **single value**: the **average bpm** across **all** tracks. No specific order is required.\n",
            setup: "CREATE TABLE tracks (title TEXT, artist TEXT, bpm INTEGER, genre TEXT);INSERT INTO tracks VALUES ('Da Funk','Daft Punk',112,'house'),('Aerodynamic','Daft Punk',123,'house'),('Windowlicker','Aphex Twin',100,'idm'),('Avril 14th','Aphex Twin',60,'ambient'),('Awake','Tycho',120,'synthwave');",
            starter: "SELECT bpm FROM tracks;\n",
            solution: "SELECT AVG(bpm) FROM tracks;\n",
            expected: [[103]],
            orderMatters: false,
            hint: "AVG(bpm) collapses every row into one mean value.", lore: "The deck finds the heartbeat of the whole set in one pulse."
          },
          {
            id: "sql-tempobounds", title: "SLOWEST AND FASTEST", kind: "query", difficulty: 2, xp: 150,
            brief: "The tempo floor and ceiling in one row.",
            prompt: "From **tracks(title, artist, bpm, genre)**, return **two values in one row**: the **minimum bpm** and the **maximum bpm** across all tracks (min first, then max). No specific order is required.\n",
            setup: "CREATE TABLE tracks (title TEXT, artist TEXT, bpm INTEGER, genre TEXT);INSERT INTO tracks VALUES ('Da Funk','Daft Punk',112,'house'),('Aerodynamic','Daft Punk',123,'house'),('Windowlicker','Aphex Twin',100,'idm'),('Avril 14th','Aphex Twin',60,'ambient'),('Awake','Tycho',120,'synthwave');",
            starter: "SELECT MIN(bpm) FROM tracks;\n",
            solution: "SELECT MIN(bpm), MAX(bpm) FROM tracks;\n",
            expected: [[60,123]],
            orderMatters: false,
            hint: "Put both MIN(bpm) and MAX(bpm) in the same SELECT list.", lore: "Drag the slowest crawl and the hardest sprint into the same readout."
          },
          {
            id: "sql-genreavg", title: "TEMPO BY GENRE", kind: "query", difficulty: 2, xp: 150,
            brief: "Average tempo, grouped per genre.",
            prompt: "From **tracks(title, artist, bpm, genre)**, return **genre** and the **average bpm** for that genre, one row **per genre**. Sort by **genre** alphabetically (A->Z).\n",
            setup: "CREATE TABLE tracks (title TEXT, artist TEXT, bpm INTEGER, genre TEXT);INSERT INTO tracks VALUES ('Da Funk','Daft Punk',112,'house'),('Aerodynamic','Daft Punk',123,'house'),('Windowlicker','Aphex Twin',100,'idm'),('Avril 14th','Aphex Twin',60,'ambient'),('Awake','Tycho',120,'synthwave');",
            starter: "SELECT genre, AVG(bpm) FROM tracks;\n",
            solution: "SELECT genre, AVG(bpm) FROM tracks GROUP BY genre ORDER BY genre;\n",
            expected: [["ambient",60],["house",117.5],["idm",100],["synthwave",120]],
            orderMatters: true,
            hint: "GROUP BY genre makes one row per genre, then ORDER BY genre.", lore: "Each sound-clan reports its own collective pulse to the grid."
          },
          {
            id: "sql-bpmsum", title: "GENRE TOTALS", kind: "query", difficulty: 3, xp: 120,
            brief: "Count and summed tempo per genre, only multi-track genres.",
            prompt: "From **tracks(title, artist, bpm, genre)**, return **genre**, the **number of tracks** in that genre, and the **total (summed) bpm** of that genre — but only for genres holding **more than one track**. Sort by **genre** alphabetically (A->Z).\n",
            setup: "CREATE TABLE tracks (title TEXT, artist TEXT, bpm INTEGER, genre TEXT);INSERT INTO tracks VALUES ('Da Funk','Daft Punk',112,'house'),('Aerodynamic','Daft Punk',123,'house'),('Windowlicker','Aphex Twin',100,'idm'),('Avril 14th','Aphex Twin',60,'ambient'),('Awake','Tycho',120,'synthwave');",
            starter: "SELECT genre, COUNT(*), SUM(bpm) FROM tracks GROUP BY genre ORDER BY genre;\n",
            solution: "SELECT genre, COUNT(*), SUM(bpm) FROM tracks GROUP BY genre HAVING COUNT(*) > 1 ORDER BY genre;\n",
            expected: [["house",2,235]],
            orderMatters: true,
            hint: "Group by genre, then filter the groups with HAVING COUNT(*) > 1.", lore: "Only the crews deep enough to field a pair make the totals board."
          },
          {
            id: "sql-fastfloor", title: "FAST FLOORS ONLY", kind: "query", difficulty: 3, xp: 120,
            brief: "Artists whose slowest track still hits hard.",
            prompt: "From **tracks(title, artist, bpm, genre)**, return **artist** and that artist's **minimum bpm**, keeping only artists whose **minimum bpm is at least 100**. Sort by **artist** alphabetically (A->Z).\n",
            setup: "CREATE TABLE tracks (title TEXT, artist TEXT, bpm INTEGER, genre TEXT);INSERT INTO tracks VALUES ('Da Funk','Daft Punk',112,'house'),('Aerodynamic','Daft Punk',123,'house'),('Windowlicker','Aphex Twin',100,'idm'),('Avril 14th','Aphex Twin',60,'ambient'),('Awake','Tycho',120,'synthwave');",
            starter: "SELECT artist, MIN(bpm) FROM tracks GROUP BY artist ORDER BY artist;\n",
            solution: "SELECT artist, MIN(bpm) FROM tracks GROUP BY artist HAVING MIN(bpm) >= 100 ORDER BY artist;\n",
            expected: [["Daft Punk",112],["Tycho",120]],
            orderMatters: true,
            hint: "Group by artist, then use HAVING MIN(bpm) >= 100 to drop the slow crews.", lore: "If even your sleepiest track keeps the floor moving, you're on the list."
          }
  ]);

  add("sqlm03-join", [
          {
            id: "sql-hunters-ship", title: "HUNTERS ABOARD", kind: "query", difficulty: 1, xp: 120,
            brief: "Ship name for every hunter.",
            prompt: "Join **crew** to **ships** on crew.ship_id = ships.id. Return each **hunter's name** and their **ship's name** (two columns), keeping only rows where the crew member's **role** is **'hunter'**. Sort by crew **name** (A->Z).\n",
            setup: "CREATE TABLE ships (id INTEGER, name TEXT);INSERT INTO ships VALUES (1,'Bebop'),(2,'Swordfish');CREATE TABLE crew (name TEXT, ship_id INTEGER, role TEXT);INSERT INTO crew VALUES ('Spike',1,'hunter'),('Jet',1,'captain'),('Faye',1,'hunter'),('Ed',1,'hacker');",
            starter: "SELECT crew.name, ships.name FROM crew JOIN ships ON crew.ship_id = ships.id ORDER BY crew.name;\n",
            solution: "SELECT crew.name, ships.name FROM crew JOIN ships ON crew.ship_id = ships.id WHERE crew.role = 'hunter' ORDER BY crew.name;\n",
            expected: [["Faye","Bebop"],["Spike","Bebop"]],
            orderMatters: true,
            hint: "Add WHERE crew.role = 'hunter' to the JOIN so only the bounty hunters show.", lore: "Two trigger fingers, one deck. The hunters log their berth."
          },
          {
            id: "sql-crew-count", title: "HEADCOUNT BY HULL", kind: "query", difficulty: 2, xp: 150,
            brief: "How many hands each ship carries.",
            prompt: "Join **crew** to **ships** on crew.ship_id = ships.id, then return each **ship's name** and the **number of crew** aboard it, one row **per ship that has crew**. Sort by ship **name** (A->Z).\n",
            setup: "CREATE TABLE ships (id INTEGER, name TEXT);INSERT INTO ships VALUES (1,'Bebop'),(2,'Swordfish');CREATE TABLE crew (name TEXT, ship_id INTEGER, role TEXT);INSERT INTO crew VALUES ('Spike',1,'hunter'),('Jet',1,'captain'),('Faye',1,'hunter'),('Ed',1,'hacker');",
            starter: "SELECT ships.name FROM crew JOIN ships ON crew.ship_id = ships.id ORDER BY ships.name;\n",
            solution: "SELECT ships.name, COUNT(*) FROM crew JOIN ships ON crew.ship_id = ships.id GROUP BY ships.name ORDER BY ships.name;\n",
            expected: [["Bebop",4]],
            orderMatters: true,
            hint: "After the JOIN, GROUP BY ships.name so COUNT(*) gives one tally per ship.", lore: "The manifest tallies itself, hull by hull."
          },
          {
            id: "sql-board-swordfish", title: "BOARD THE SWORDFISH", kind: "mutation", difficulty: 2, xp: 150,
            brief: "Sign a pilot onto the empty ship.",
            prompt: "The **Swordfish** (ship id **2**) flies with no crew. INSERT a new row into **crew**: name **Vicious**, ship_id **2**, role **pilot**. Add nobody else.\n\nThe verifier then runs: SELECT name, role FROM crew WHERE ship_id = 2.\n",
            setup: "CREATE TABLE ships (id INTEGER, name TEXT);INSERT INTO ships VALUES (1,'Bebop'),(2,'Swordfish');CREATE TABLE crew (name TEXT, ship_id INTEGER, role TEXT);INSERT INTO crew VALUES ('Spike',1,'hunter'),('Jet',1,'captain'),('Faye',1,'hunter'),('Ed',1,'hacker');",
            starter: "-- INSERT the new pilot onto ship 2 here\n",
            solution: "INSERT INTO crew (name, ship_id, role) VALUES ('Vicious', 2, 'pilot');\n",
            expected: [["Vicious","pilot"]],
            orderMatters: false,
            check: "SELECT name, role FROM crew WHERE ship_id = 2;",
            hint: "INSERT INTO crew (name, ship_id, role) VALUES ('Vicious', 2, 'pilot');", lore: "The lone fighter finally takes a hand at the stick."
          },
          {
            id: "sql-empty-hulls", title: "EMPTY HULLS", kind: "query", difficulty: 3, xp: 180,
            brief: "Every ship and its crew tally, even the empty ones.",
            prompt: "Use a **LEFT JOIN** from **ships** to **crew** on ships.id = crew.ship_id so that **every ship appears** — including ones with no crew. Return each **ship's name** and the **number of crew** aboard (use COUNT on a crew column so empty ships show **0**), one row per ship. Sort by ship **name** (A->Z).\n",
            setup: "CREATE TABLE ships (id INTEGER, name TEXT);INSERT INTO ships VALUES (1,'Bebop'),(2,'Swordfish');CREATE TABLE crew (name TEXT, ship_id INTEGER, role TEXT);INSERT INTO crew VALUES ('Spike',1,'hunter'),('Jet',1,'captain'),('Faye',1,'hunter'),('Ed',1,'hacker');",
            starter: "SELECT ships.name, COUNT(*) FROM ships JOIN crew ON ships.id = crew.ship_id GROUP BY ships.name ORDER BY ships.name;\n",
            solution: "SELECT ships.name, COUNT(crew.name) FROM ships LEFT JOIN crew ON ships.id = crew.ship_id GROUP BY ships.name ORDER BY ships.name;\n",
            expected: [["Bebop",4],["Swordfish",0]],
            orderMatters: true,
            hint: "LEFT JOIN keeps empty ships; COUNT(crew.name) counts 0 for them, while COUNT(*) would wrongly count 1.", lore: "Even the ghost hull reports in: zero souls aboard."
          },
          {
            id: "sql-transfer-fleet", title: "FLEET TRANSFER", kind: "mutation", difficulty: 3, xp: 180,
            brief: "Move every Bebop hand to the Swordfish by name.",
            prompt: "Command reassigns the whole Bebop crew. UPDATE **crew**: set **ship_id** to the id of the ship named **'Swordfish'** for every crew member currently assigned to the ship named **'Bebop'**. Do not hard-code the numbers 1 or 2 — look both ids up from the **ships** table with subqueries.\n\nThe verifier then runs: SELECT crew.name, ships.name FROM crew JOIN ships ON crew.ship_id = ships.id ORDER BY crew.name.\n",
            setup: "CREATE TABLE ships (id INTEGER, name TEXT);INSERT INTO ships VALUES (1,'Bebop'),(2,'Swordfish');CREATE TABLE crew (name TEXT, ship_id INTEGER, role TEXT);INSERT INTO crew VALUES ('Spike',1,'hunter'),('Jet',1,'captain'),('Faye',1,'hunter'),('Ed',1,'hacker');",
            starter: "UPDATE crew SET ship_id = (SELECT id FROM ships WHERE name = 'Swordfish') WHERE name = 'Spike';\n",
            solution: "UPDATE crew SET ship_id = (SELECT id FROM ships WHERE name = 'Swordfish') WHERE ship_id = (SELECT id FROM ships WHERE name = 'Bebop');\n",
            expected: [["Ed","Swordfish"],["Faye","Swordfish"],["Jet","Swordfish"],["Spike","Swordfish"]],
            orderMatters: false,
            check: "SELECT crew.name, ships.name FROM crew JOIN ships ON crew.ship_id = ships.id ORDER BY crew.name;",
            hint: "SET ship_id = (SELECT id FROM ships WHERE name = 'Swordfish') WHERE ship_id = (SELECT id FROM ships WHERE name = 'Bebop').", lore: "Papers stamped: the whole deck wakes up on a different ship."
          }
  ]);
})();