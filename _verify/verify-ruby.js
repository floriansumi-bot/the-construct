/* Verify the RUBY track on real CRuby (ruby.wasm in Node), mirroring
   runtime-ruby.js. Every solution must clear all asserts; every starter must not. */
const fs = require("fs");
const path = require("path");
const { DefaultRubyVM } = require("@ruby/wasm-wasi/dist/node");
const base = path.resolve(__dirname, "..");
global.window = {};
function load(f) { (0, eval)(fs.readFileSync(path.join(base, "js", f), "utf8")); }
load("tracks.js");
load("curriculum-ruby.js");

const wasmPath = path.join(__dirname, "node_modules", "@ruby", "3.3-wasm-wasi", "dist", "ruby+stdlib.wasm");

const PRE = [
  "require 'stringio'",
  "$__buf = StringIO.new",
  "$stdout = $__buf",
  "def stdout; $__buf.string; end",
  "def assert(c, m = 'assertion failed'); raise m.to_s unless c; end",
  "def assert_equal(a, b, m = nil); raise(m || ('expected ' + b.inspect + ' but got ' + a.inspect)) unless a == b; end",
  "def assert_raises(m = 'expected an error'); begin; yield; rescue StandardError; return; end; raise m; end",
  "",
].join("\n");

(async function () {
  const wasm = fs.readFileSync(wasmPath);
  const mod = await WebAssembly.compile(wasm);
  // a FRESH vm per code variant — mirrors the per-Run isolation in the browser
  async function gradeCode(code, ex) {
    const { vm } = await DefaultRubyVM(mod);
    function ev(testCode) {
      const program = PRE + (code || "") + "\n" + (testCode || "");
      let err = null;
      try { vm.eval(program); } catch (e) { err = (e && e.message ? e.message.split("\n")[0] : String(e)).trim(); }
      return { ok: !err, err: err };
    }
    const disp = ev(null);
    if (disp.err) return { loadErr: disp.err, fails: [], allOk: false };
    const fails = [];
    for (const t of ex.tests) { const r = ev(t.code); if (!r.ok) fails.push([t.name, r.err]); }
    return { loadErr: null, fails, allOk: fails.length === 0 };
  }
  const track = window.TRACKS.find((t) => t.id === "ruby");
  const issues = []; let n = 0;
  for (const m of track.modules) {
    for (const ex of m.exercises) {
      n++;
      const sol = await gradeCode(ex.solution, ex);
      if (sol.loadErr) issues.push(["SOLUTION_LOAD_FAIL", m.code, ex.id, "(load)", sol.loadErr]);
      else sol.fails.forEach(([nm, er]) => issues.push(["SOLUTION_FAIL", m.code, ex.id, nm, er]));
      const st = await gradeCode(ex.starter, ex);
      if (st.allOk) issues.push(["STARTER_PASSES", m.code, ex.id, "", null]);
    }
  }
  console.log("RUBY exercises checked:", n);
  console.log("issues:", issues.length);
  for (const it of issues) console.log(`[${it[0]}] ${it[1]} :: ${it[2]} :: ${it[3]}` + (it[4] ? " :: " + it[4] : ""));
  console.log(issues.length ? "RUBY: ISSUES FOUND" : "RUBY: ALL SOLUTIONS PASS / ALL STARTERS FAIL");
  process.exit(issues.length ? 1 : 0);
})();
