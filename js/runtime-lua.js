/* ============================================================
   runtime-lua.js — Lua 5.4 adapter (wasmoon / WASM).
   Grading runs each test as Lua (native assert), so pass/fail
   is decided by Lua itself. A custom print() feeds stdout() and
   the OUTPUT panel. Each test runs in a fresh Lua state.
   ============================================================ */
(function () {
  "use strict";
  var JS_URL = "https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/+esm";
  var WASM_URL = "https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/dist/glue.wasm";
  var factory = null, loadPromise = null;

  async function ensureLua(onLog) {
    if (factory) return factory;
    if (!loadPromise) {
      loadPromise = (async function () {
        if (onLog) onLog("fetching Lua 5.4 engine (wasmoon)…", "");
        var mod = await import(JS_URL);
        factory = new mod.LuaFactory(WASM_URL);
        var e = await factory.createEngine(); // warm up: instantiates the wasm
        e.global.close();
        return factory;
      })();
    }
    return loadPromise;
  }
  function luaToStr(v) {
    if (v === undefined || v === null) return "nil";
    if (typeof v === "boolean") return v ? "true" : "false";
    return String(v);
  }
  function cleanErr(e) {
    var m = e && e.message ? e.message : String(e);
    return m.replace(/\[string "[^"]*"\]:(\d+):/g, "line $1:").trim();
  }
  async function runLua(src, testCode) {
    var engine = await factory.createEngine();
    var out = [];
    engine.global.set("print", function () { out.push(Array.prototype.map.call(arguments, luaToStr).join("\t")); });
    engine.global.set("__getout", function () { return out.join("\n"); });
    var err = null;
    try {
      var program = "function stdout() return __getout() end\n" + (src || "") + (testCode ? "\n" + testCode : "");
      await engine.doString(program);
    } catch (e) { err = cleanErr(e); }
    finally { try { engine.global.close(); } catch (_) {} }
    return { ok: !err, err: err, out: out.join("\n") };
  }

  var LuaRuntime = {
    key: "lua", label: "Lua 5.4", editorMode: "lua", tag: "Lua 5.4 · WASM", ready: false,
    note: "Lua 5.4 (wasmoon/WASM) — the embeddable scripting language.",
    async init(onLog) { await ensureLua(onLog); this.ready = true; if (onLog) onLog("lua engine ready", "ok"); },
    async runDisplay(src, ex) { var r = await runLua(src, null); return { stdout: r.out, error: r.err }; },
    async grade(src, ex) {
      var tests = (ex && ex.tests) || [];
      var disp = await runLua(src, null);
      var results = [];
      for (var i = 0; i < tests.length; i++) {
        var t = tests[i];
        if (disp.err) { results.push({ name: t.name, ok: false, msg: "your code did not load: " + disp.err }); continue; }
        var r = await runLua(src, t.code);
        results.push({ name: t.name, ok: r.ok, msg: r.ok ? "" : r.err });
      }
      var passed = 0; results.forEach(function (r) { if (r.ok) passed++; });
      return { results: results, stdout: disp.out, preexec_error: disp.err, passed: passed, total: results.length, all_ok: results.length > 0 && passed === results.length };
    },
  };
  window.Runtimes = window.Runtimes || {};
  window.Runtimes.lua = LuaRuntime;
})();
