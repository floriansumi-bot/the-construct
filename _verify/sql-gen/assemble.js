/* Assemble _verify/sql-gen/jobs/*.json into js/curriculum-sql-pack-1.js.
   For EVERY authored exercise the `expected` result set is COMPUTED by running
   the solution through real sql.js (query -> run solution; mutation -> run
   solution then `check`), so solution<->expected can never drift. Also flags:
   solutions that error, starters that already produce `expected` (too easy),
   and id collisions with the existing curriculum.

   Job file shapes (one per sector, written by author agents):
     new sector:  { "type":"new",  "module": {id,code,title,subtitle,theory}, "exercises":[...] }
     fill sector: { "type":"fill", "modId":"sqlm01-select", "exercises":[...] }
   Each exercise (NO expected — computed here):
     { id,title,kind('query'|'mutation'),difficulty,xp,brief,prompt,setup,
       starter,solution,orderMatters(bool),check?(mutation),hint,lore }

   Usage: node _verify/sql-gen/assemble.js          (assemble + report)
          node _verify/sql-gen/assemble.js --selftest   (verify computer vs existing curriculum) */
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const SQLGEN = __dirname;
const ROOT = path.join(SQLGEN, "..", "..");
const JS = path.join(ROOT, "js");
const JOBS = path.join(SQLGEN, "jobs");

function execLast(db, sql) { const r = db.exec(sql); if (!r || !r.length) return { cols: [], rows: [] }; const l = r[r.length - 1]; return { cols: l.columns || [], rows: l.values || [] }; }
function runUser(SQL, ex, sql) {
  const db = new SQL.Database();
  try {
    if (ex.setup) db.exec(ex.setup);
    if ((ex.kind || "query") === "mutation") { db.exec(sql); return execLast(db, ex.check); }
    return execLast(db, sql);
  } finally { db.close(); }
}
function norm(rows, om) { let r = (rows || []).map((x) => x.slice()); if (!om) r = r.sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1)); return JSON.stringify(r); }
function S(v) { return JSON.stringify(v == null ? "" : v); }

function existingIds() {
  const set = new Set();
  fs.readdirSync(JS).filter((f) => /^curriculum-sql(\.js|-pack-\d+\.js)$/.test(f)).forEach((f) => {
    const src = fs.readFileSync(path.join(JS, f), "utf8");
    const re = /id:\s*"(sql-[a-z0-9-]+)"/g; let m; while ((m = re.exec(src))) set.add(m[1]);
  });
  return set;
}

function emitExercise(ex) {
  const lines = [
    "          {",
    "            id: " + S(ex.id) + ", title: " + S(ex.title) + ", kind: " + S(ex.kind || "query") +
      ", difficulty: " + (ex.difficulty || 1) + ", xp: " + (ex.xp || 120) + ",",
    "            brief: " + S(ex.brief) + ",",
    "            prompt: " + S(ex.prompt) + ",",
    "            setup: " + S(ex.setup) + ",",
    "            starter: " + S(ex.starter) + ",",
    "            solution: " + S(ex.solution) + ",",
    "            expected: " + JSON.stringify(ex.expected) + ",",
    "            orderMatters: " + (!!ex.orderMatters) + ",",
  ];
  if ((ex.kind || "query") === "mutation") lines.push("            check: " + S(ex.check) + ",");
  lines.push("            hint: " + S(ex.hint) + ", lore: " + S(ex.lore));
  lines.push("          }");
  return lines.join("\n");
}
function emitModule(m) {
  return [
    "      {",
    "        id: " + S(m.module.id) + ", code: " + S(m.module.code) + ", title: " + S(m.module.title) + ",",
    "        subtitle: " + S(m.module.subtitle) + ",",
    "        theory: " + S(m.module.theory) + ",",
    "        exercises: [",
    m.exercises.map(emitExercise).join(",\n"),
    "        ],",
    "      }",
  ].join("\n");
}

(async function () {
  const SQL = await initSqlJs({ locateFile: (f) => path.join(SQLGEN, "..", "node_modules", "sql.js", "dist", f) });

  if (process.argv.includes("--selftest")) {
    // recompute expected for the existing curriculum and confirm it matches the authored values
    global.window = {}; (0, eval)(fs.readFileSync(path.join(JS, "tracks.js"), "utf8")); (0, eval)(fs.readFileSync(path.join(JS, "curriculum-sql.js"), "utf8"));
    const track = window.TRACKS.find((t) => t.id === "sql"); let ok = 0, bad = 0;
    for (const mod of track.modules) for (const ex of mod.exercises) {
      const got = norm(runUser(SQL, ex, ex.solution).rows, !!ex.orderMatters);
      const want = norm(ex.expected || [], !!ex.orderMatters);
      if (got === want) ok++; else { bad++; console.log("MISMATCH", ex.id, "got", got, "want", want); }
    }
    console.log("selftest: " + ok + " match, " + bad + " mismatch"); process.exit(bad ? 1 : 0);
  }

  const existing = existingIds();
  const files = fs.readdirSync(JOBS).filter((f) => f.endsWith(".json")).sort();
  const newMods = [], fills = {}; const issues = []; const seen = new Set(); let total = 0;

  for (const f of files) {
    const job = JSON.parse(fs.readFileSync(path.join(JOBS, f), "utf8"));
    for (const ex of job.exercises) {
      total++;
      if (seen.has(ex.id)) issues.push("dup id in batch: " + ex.id);
      if (existing.has(ex.id)) issues.push("id collides with existing: " + ex.id);
      seen.add(ex.id);
      // compute expected from the solution
      try { ex.expected = runUser(SQL, ex, ex.solution).rows; }
      catch (e) { issues.push(ex.id + " :: SOLUTION ERROR :: " + (e.message || e)); ex.expected = []; continue; }
      // starter must NOT already produce expected
      let starterMatches = false;
      try { starterMatches = norm(runUser(SQL, ex, ex.starter).rows, !!ex.orderMatters) === norm(ex.expected, !!ex.orderMatters); } catch (e) { starterMatches = false; }
      if (starterMatches) issues.push(ex.id + " :: STARTER ALREADY PASSES (make it more incomplete)");
      if (!ex.expected.length) issues.push(ex.id + " :: WARNING expected is empty (0 rows)");
    }
    if (job.type === "new") newMods.push(job); else (fills[job.modId] = fills[job.modId] || []).push(...job.exercises);
  }

  newMods.sort((a, b) => (a.module.code < b.module.code ? -1 : 1));
  const pushBlock = newMods.length ? ("  t.modules.push(\n" + newMods.map(emitModule).join(",\n") + "\n  );") : "";
  const addBlocks = Object.keys(fills).map((mid) => '  add("' + mid + '", [\n' + fills[mid].map(emitExercise).join(",\n") + "\n  ]);").join("\n\n");

  const out = [
    "/* ============================================================",
    "   curriculum-sql-pack-1.js — SQL expansion (right-size to ~8 sectors).",
    "   Adds new sectors + fills existing ones. `expected` result sets are",
    "   COMPUTED from each solution via real sql.js by _verify/sql-gen/assemble.js",
    "   and verified by _verify/verify-sql.js. Do not hand-edit expected.",
    "   ============================================================ */",
    "(function () {",
    '  var t = window.getTrack && window.getTrack("sql");',
    "  if (!t) return;",
    "  function add(modId, exs) { var m = t.modules.find(function (x) { return x.id === modId; }); if (m) Array.prototype.push.apply(m.exercises, exs); }",
    pushBlock,
    addBlocks,
    "})();",
    "",
  ].filter(Boolean).join("\n");

  fs.writeFileSync(path.join(JS, "curriculum-sql-pack-1.js"), out, "utf8");
  console.log("assembled curriculum-sql-pack-1.js :: " + total + " exercises (" + newMods.length + " new sectors, " + Object.keys(fills).length + " filled)");
  console.log("issues:", issues.length); issues.forEach((x) => console.log("   - " + x));
  process.exit(issues.length ? 1 : 0);
})();
