/* Executable check for an author job file: runs each exercise's solution and
   starter through real sql.js and prints one JSON line per exercise:
     { id, kind, solErr, solRows, starterSameAsSolution, stErr }
   solErr must be null; starterSameAsSolution must be false; solRows is the
   real result set (sanity-check it against the prompt).
   Usage: node _verify/sql-gen/run.js <path-to-job.json> */
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");
(async function () {
  const SQL = await initSqlJs({ locateFile: (f) => path.join(__dirname, "..", "node_modules", "sql.js", "dist", f) });
  const job = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  function execLast(db, sql) { const r = db.exec(sql); if (!r || !r.length) return { rows: [] }; return { rows: r[r.length - 1].values || [] }; }
  function run(ex, sql) {
    const db = new SQL.Database();
    try {
      if (ex.setup) db.exec(ex.setup);
      if ((ex.kind || "query") === "mutation") { db.exec(sql); return execLast(db, ex.check); }
      return execLast(db, sql);
    } finally { db.close(); }
  }
  const key = (rows) => JSON.stringify((rows || []).map((r) => r.slice()).sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1)));
  for (const ex of job.exercises) {
    let sol = null, solErr = null, st = null, stErr = null;
    try { sol = run(ex, ex.solution).rows; } catch (e) { solErr = String(e.message || e); }
    try { st = run(ex, ex.starter).rows; } catch (e) { stErr = String(e.message || e); }
    console.log(JSON.stringify({ id: ex.id, kind: ex.kind || "query", solErr, solRows: sol, starterSameAsSolution: solErr ? null : key(sol) === key(st), stErr }));
  }
})();
