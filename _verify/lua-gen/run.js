/* Per-job Lua engine check (wasmoon 5.4), mirroring verify-lua.js. Prints one
   JSON line per exercise: { id, solLoadErr, solFails:[...], starterPassesAll }.
   PASS = solLoadErr null, solFails empty, starterPassesAll false.
   Usage: node _verify/lua-gen/run.js <path-to-job.json> */
const { LuaFactory } = require("wasmoon");
const fs = require("fs");
(async function () {
  const factory = new LuaFactory();
  function s(v) { return v == null ? "nil" : (typeof v === "boolean" ? (v ? "true" : "false") : String(v)); }
  async function run(src, test) {
    const e = await factory.createEngine();
    const out = [];
    e.global.set("print", function () { out.push(Array.prototype.map.call(arguments, s).join("\t")); });
    e.global.set("__getout", function () { return out.join("\n"); });
    let err = null;
    try { await e.doString("function stdout() return __getout() end\n" + (src || "") + (test ? "\n" + test : "")); }
    catch (x) { err = String((x && x.message) || x); }
    finally { try { e.global.close(); } catch (_) {} }
    return err;
  }
  const job = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  for (const ex of job.exercises) {
    const solLoadErr = await run(ex.solution, null);
    const solFails = [];
    if (!solLoadErr) for (const t of ex.tests) { const er = await run(ex.solution, t.code); if (er) solFails.push(t.name + ": " + er); }
    let starterPassesAll = true;
    const stLoad = await run(ex.starter, null);
    if (stLoad) starterPassesAll = false;
    else { for (const t of ex.tests) { const er = await run(ex.starter, t.code); if (er) { starterPassesAll = false; break; } } }
    console.log(JSON.stringify({ id: ex.id, solLoadErr, solFails, starterPassesAll }));
  }
  process.exit(0);
})();
