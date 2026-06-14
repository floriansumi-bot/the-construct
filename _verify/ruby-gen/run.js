/* Per-job Ruby engine check (CRuby via ruby.wasm), mirroring verify-ruby.js with
   a FRESH vm per test. Prints one JSON line per exercise:
     { id, solLoadErr, solFails:[...], starterPassesAll }
   PASS = solLoadErr null, solFails empty, starterPassesAll false.
   Usage: node _verify/ruby-gen/run.js <path-to-job.json>   (slow: ruby.wasm) */
const { DefaultRubyVM } = require("@ruby/wasm-wasi/dist/node");
const fs = require("fs");
const path = require("path");
const wasmPath = path.join(__dirname, "..", "node_modules", "@ruby", "3.3-wasm-wasi", "dist", "ruby+stdlib.wasm");
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
  const mod = await WebAssembly.compile(fs.readFileSync(wasmPath));
  async function ev(code, test) {
    const { vm } = await DefaultRubyVM(mod);
    let err = null;
    try { vm.eval(PRE + (code || "") + "\n" + (test || "")); }
    catch (e) { err = (e && e.message ? e.message.split("\n")[0] : String(e)).trim(); }
    return err;
  }
  const job = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  for (const ex of job.exercises) {
    const solLoadErr = await ev(ex.solution, null);
    const solFails = [];
    if (!solLoadErr) for (const t of ex.tests) { const er = await ev(ex.solution, t.code); if (er) solFails.push(t.name + ": " + er); }
    let starterPassesAll = true;
    const stLoad = await ev(ex.starter, null);
    if (stLoad) starterPassesAll = false;
    else { for (const t of ex.tests) { const er = await ev(ex.starter, t.code); if (er) { starterPassesAll = false; break; } } }
    console.log(JSON.stringify({ id: ex.id, solLoadErr, solFails, starterPassesAll }));
  }
  process.exit(0);
})();
