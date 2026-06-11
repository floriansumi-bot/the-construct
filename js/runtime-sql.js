/* ============================================================
   runtime-sql.js — SQL adapter backed by real SQLite (sql.js/WASM).
   Each exercise carries a `setup` (schema + seed), and grading
   compares the learner's result set to an explicit `expected`.
     kind 'query'    -> run learner SQL, compare its rows
     kind 'mutation' -> run learner SQL, then run `check` SELECT
   ============================================================ */
(function () {
  "use strict";
  var BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/";
  var SQL = null, SQLPromise = null;

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res;
      s.onerror = function () { rej(new Error("failed to load " + src)); };
      document.head.appendChild(s);
    });
  }
  async function ensureSQL(onLog) {
    if (SQL) return SQL;
    if (!SQLPromise) {
      SQLPromise = (async function () {
        if (typeof initSqlJs === "undefined") { if (onLog) onLog("fetching SQLite engine (sql.js)…", ""); await loadScript(BASE + "sql-wasm.js"); }
        if (onLog) onLog("initializing SQLite WASM…", "");
        SQL = await initSqlJs({ locateFile: function (f) { return BASE + f; } });
        return SQL;
      })();
    }
    return SQLPromise;
  }

  function execLast(db, sql) {
    var res = db.exec(sql);
    if (!res || !res.length) return { cols: [], rows: [] };
    var last = res[res.length - 1];
    return { cols: last.columns || [], rows: last.values || [] };
  }
  function runUser(ex, sql) {
    var db = new SQL.Database();
    try {
      if (ex.setup) db.exec(ex.setup);
      if ((ex.kind || "query") === "mutation") { db.exec(sql); return execLast(db, ex.check); }
      return execLast(db, sql);
    } finally { db.close(); }
  }
  function norm(rows, orderMatters) {
    var r = rows.map(function (row) { return row.slice(); });
    if (!orderMatters) r = r.sort(function (a, b) { return JSON.stringify(a) < JSON.stringify(b) ? -1 : 1; });
    return JSON.stringify(r);
  }
  function renderTable(cols, rows) {
    if (!cols.length && !rows.length) return "(no rows)";
    var widths = cols.map(function (c) { return String(c).length; });
    rows.forEach(function (r) { r.forEach(function (c, i) { var L = String(c === null ? "NULL" : c).length; if (L > (widths[i] || 0)) widths[i] = L; }); });
    function pad(s, w) { s = String(s); return s + new Array(Math.max(0, w - s.length) + 1).join(" "); }
    var sep = "+" + widths.map(function (w) { return new Array(w + 3).join("-"); }).join("+") + "+";
    var head = "| " + cols.map(function (c, i) { return pad(c, widths[i]); }).join(" | ") + " |";
    var body = rows.map(function (r) { return "| " + r.map(function (c, i) { return pad(c === null ? "NULL" : c, widths[i]); }).join(" | ") + " |"; }).join("\n");
    return sep + "\n" + head + "\n" + sep + "\n" + (body ? body + "\n" : "") + sep + "\n(" + rows.length + " row" + (rows.length === 1 ? "" : "s") + ")";
  }

  var SQLRuntime = {
    key: "sql", label: "SQLite", editorMode: "text/x-sql", tag: "SQLite · WASM", ready: false,
    note: "A real SQLite database (sql.js/WASM) in your browser.",
    async init(onLog) { await ensureSQL(onLog); this.ready = true; if (onLog) onLog("sqlite engine ready", "ok"); },
    async runDisplay(src, ex) {
      try { var r = runUser(ex, src); return { stdout: renderTable(r.cols, r.rows), error: null }; }
      catch (e) { return { stdout: "", error: "SQL error: " + ((e && e.message) || e) }; }
    },
    async grade(src, ex) {
      var expected = ex.expected || [];
      var orderMatters = !!ex.orderMatters;
      var results = [], usr = null, err = null, table = "";
      try { usr = runUser(ex, src); table = renderTable(usr.cols, usr.rows); }
      catch (e) { err = "SQL error: " + ((e && e.message) || e); }
      if (err) {
        results.push({ name: "statement executes without error", ok: false, msg: err });
        results.push({ name: "result matches the target set", ok: false, msg: "(did not run)" });
      } else {
        results.push({ name: "statement executes without error", ok: true, msg: "" });
        var rowOk = usr.rows.length === expected.length;
        results.push({ name: "returns " + expected.length + " row(s)", ok: rowOk, msg: rowOk ? "" : "got " + usr.rows.length + " row(s), expected " + expected.length });
        var match = norm(usr.rows, orderMatters) === norm(expected, orderMatters);
        results.push({ name: orderMatters ? "rows match in the required order" : "values match the target set", ok: match, msg: match ? "" : "result set does not match the target." });
      }
      var passed = 0; results.forEach(function (r) { if (r.ok) passed++; });
      return { results: results, stdout: table, preexec_error: err, passed: passed, total: results.length, all_ok: passed === results.length };
    },
  };

  window.Runtimes = window.Runtimes || {};
  window.Runtimes.sql = SQLRuntime;
})();
