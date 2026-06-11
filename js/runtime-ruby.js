/* ============================================================
   runtime-ruby.js — Ruby adapter (CRuby via ruby.wasm).
   Heavy engine (~34MB stdlib wasm), loaded lazily only when the
   Ruby track is opened. The compiled module is cached and a FRESH
   VM is instantiated per Run, so definitions never leak between
   runs (important for class exercises). Tests are native Ruby.
   ============================================================ */
(function () {
  "use strict";
  // esm.sh bundles ruby.wasm's deps (browser_wasi_shim) so the ESM import resolves.
  var GLUE = "https://esm.sh/@ruby/wasm-wasi@2.6.2/dist/browser";
  // raw wasm binary from jsdelivr
  var WASM = "https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@2.6.2/dist/ruby+stdlib.wasm";
  var DefaultRubyVM = null, rubyModule = null, loadPromise = null;

  var PRE = [
    "require 'stringio'",
    "$__buf = StringIO.new",
    "$stdout = $__buf",
    "def stdout; $__buf.string; end",
    "def assert(c, m = 'assertion failed'); raise m.to_s unless c; end",
    "def assert_equal(a, b, m = nil); raise(m || ('expected ' + b.inspect + ' but got ' + a.inspect)) unless a == b; end",
    "def assert_raises(m = 'expected an error'); begin; yield; rescue StandardError; return; end; raise m; end",
    "",
  ].join("\n");

  async function ensureRuby(onLog) {
    if (rubyModule) return rubyModule;
    if (!loadPromise) {
      loadPromise = (async function () {
        if (onLog) onLog("fetching CRuby (ruby.wasm) — ~34MB, one-time…", "");
        var mod = await import(GLUE);
        DefaultRubyVM = mod.DefaultRubyVM;
        var resp = await fetch(WASM);
        var buf = await resp.arrayBuffer();
        if (onLog) onLog("compiling Ruby interpreter…", "");
        rubyModule = await WebAssembly.compile(buf);
        return rubyModule;
      })();
    }
    return loadPromise;
  }
  async function freshVM() { var res = await DefaultRubyVM(rubyModule); return res.vm; }
  function cleanErr(e) {
    var m = e && e.message ? e.message : String(e);
    var lines = m.split("\n").filter(function (l) { return l.trim() && l.indexOf("eval at") < 0; });
    return (lines[0] || m).trim();
  }
  function evalRuby(vm, src, testCode) {
    var program = PRE + (src || "") + "\n" + (testCode || "");
    var err = null, out = "";
    try { vm.eval(program); } catch (e) { err = cleanErr(e); }
    try { out = vm.eval("$__buf.string").toString(); } catch (_) { out = ""; }
    return { ok: !err, err: err, out: out };
  }

  var RubyRuntime = {
    key: "ruby", label: "Ruby", editorMode: "ruby", tag: "CRuby 3.3 · WASM", ready: false,
    _vm: null,
    note: "Real CRuby (ruby.wasm). The engine downloads once (large) on first use.",
    async init(onLog) { await ensureRuby(onLog); this.ready = true; if (onLog) onLog("ruby engine ready", "ok"); },
    async runDisplay(src, ex) {
      var vm = await freshVM(); this._vm = vm; // hand this fresh VM to the grade() that follows
      var r = evalRuby(vm, src, null);
      return { stdout: r.out, error: r.err };
    },
    async grade(src, ex) {
      var tests = (ex && ex.tests) || [];
      var vm = this._vm || (await freshVM()); this._vm = null;
      var disp = evalRuby(vm, src, null);
      var results = [];
      for (var i = 0; i < tests.length; i++) {
        var t = tests[i];
        if (disp.err) { results.push({ name: t.name, ok: false, msg: "your code did not load: " + disp.err }); continue; }
        var r = evalRuby(vm, src, t.code);
        results.push({ name: t.name, ok: r.ok, msg: r.ok ? "" : r.err });
      }
      var passed = 0; results.forEach(function (r) { if (r.ok) passed++; });
      return { results: results, stdout: disp.out, preexec_error: disp.err, passed: passed, total: results.length, all_ok: results.length > 0 && passed === results.length };
    },
  };
  window.Runtimes = window.Runtimes || {};
  window.Runtimes.ruby = RubyRuntime;
})();
