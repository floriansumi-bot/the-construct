/* Verify the SQL track on real SQLite (node sql.js): every solution must
   produce its `expected` result set; every starter must NOT. */
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");
const base = path.resolve(__dirname, "..");
global.window = {};
function load(f) { (0, eval)(fs.readFileSync(path.join(base, "js", f), "utf8")); }
load("tracks.js");
load("curriculum-sql.js");

function execLast(db, sql) { const r = db.exec(sql); if (!r || !r.length) return { cols: [], rows: [] }; const l = r[r.length - 1]; return { cols: l.columns || [], rows: l.values || [] }; }
function runUser(SQL, ex, sql) {
  const db = new SQL.Database();
  try {
    if (ex.setup) db.exec(ex.setup);
    if ((ex.kind || "query") === "mutation") { db.exec(sql); return execLast(db, ex.check); }
    return execLast(db, sql);
  } finally { db.close(); }
}
function norm(rows, om) { let r = rows.map((x) => x.slice()); if (!om) r = r.sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1)); return JSON.stringify(r); }

(async function () {
  const SQL = await initSqlJs({ locateFile: (f) => path.join(__dirname, "node_modules", "sql.js", "dist", f) });
  const track = window.TRACKS.find((t) => t.id === "sql");
  const issues = []; let n = 0;
  for (const mod of track.modules) {
    for (const ex of mod.exercises) {
      n++;
      const want = norm(ex.expected || [], !!ex.orderMatters);
      let solOk = false, solErr = null;
      try { solOk = norm(runUser(SQL, ex, ex.solution).rows, !!ex.orderMatters) === want; } catch (e) { solErr = String(e.message || e); }
      if (!solOk) issues.push(["SOLUTION_FAIL", mod.code, ex.id, solErr]);
      let starterMatches = false;
      try { starterMatches = norm(runUser(SQL, ex, ex.starter).rows, !!ex.orderMatters) === want; } catch (e) { starterMatches = false; }
      if (starterMatches) issues.push(["STARTER_PASSES", mod.code, ex.id, null]);
    }
  }
  console.log("SQL exercises checked:", n);
  console.log("issues:", issues.length);
  for (const [k, c, id, err] of issues) { console.log(`[${k}] ${c} :: ${id}` + (err ? " :: " + err : "")); }
  console.log(issues.length ? "SQL: ISSUES FOUND" : "SQL: ALL SOLUTIONS PASS / ALL STARTERS FAIL");
  process.exit(issues.length ? 1 : 0);
})();
