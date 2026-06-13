/* Verify the LUA track on Lua 5.4 (npm wasmoon), mirroring runtime-lua.js.
   Every solution must clear all asserts; every starter must not. */
const { LuaFactory } = require("wasmoon");
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..");
global.window = {};
function load(f) { (0, eval)(fs.readFileSync(path.join(base, "js", f), "utf8")); }
load("tracks.js");
load("curriculum-lua.js");
load("curriculum-lua-pack-1.js");

(async function () {
  const factory = new LuaFactory();
  function luaToStr(v) { if (v === undefined || v === null) return "nil"; if (typeof v === "boolean") return v ? "true" : "false"; return String(v); }
  async function runLua(src, testCode) {
    const engine = await factory.createEngine();
    const out = [];
    engine.global.set("print", function () { out.push(Array.prototype.map.call(arguments, luaToStr).join("\t")); });
    engine.global.set("__getout", function () { return out.join("\n"); });
    let err = null;
    try { await engine.doString("function stdout() return __getout() end\n" + (src || "") + (testCode ? "\n" + testCode : "")); }
    catch (e) { err = String((e && e.message) || e); }
    finally { try { engine.global.close(); } catch (_) {} }
    return { ok: !err, err: err };
  }
  const track = window.TRACKS.find((t) => t.id === "lua");
  const issues = []; let n = 0;
  for (const mod of track.modules) {
    for (const ex of mod.exercises) {
      n++;
      const disp = await runLua(ex.solution, null);
      if (disp.err) { issues.push(["SOLUTION_LOAD_FAIL", mod.code, ex.id, "(load)", disp.err]); }
      else {
        for (const t of ex.tests) { const r = await runLua(ex.solution, t.code); if (!r.ok) issues.push(["SOLUTION_FAIL", mod.code, ex.id, t.name, r.err]); }
      }
      let starterAll = true;
      const sd = await runLua(ex.starter, null);
      if (sd.err) starterAll = false;
      else { for (const t of ex.tests) { const r = await runLua(ex.starter, t.code); if (!r.ok) { starterAll = false; break; } } }
      if (starterAll) issues.push(["STARTER_PASSES", mod.code, ex.id, "", null]);
    }
  }
  console.log("LUA exercises checked:", n);
  console.log("issues:", issues.length);
  for (const it of issues) console.log(`[${it[0]}] ${it[1]} :: ${it[2]} :: ${it[3]}` + (it[4] ? " :: " + it[4] : ""));
  console.log(issues.length ? "LUA: ISSUES FOUND" : "LUA: ALL SOLUTIONS PASS / ALL STARTERS FAIL");
  process.exit(issues.length ? 1 : 0);
})();
