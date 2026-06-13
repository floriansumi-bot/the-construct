/* Verify the TYPESCRIPT track through the real runtime: transpile each
   solution/starter with tsc (same as the browser), then grade on the JS
   engine. Solutions must pass all tests; starters must not. */
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..");
global.window = { ts: require("typescript") };
function load(f) { (0, eval)(fs.readFileSync(path.join(base, "js", f), "utf8")); }
load("tracks.js");
load("curriculum-ts.js");
load("curriculum-ts-pack-1.js");
load("curriculum-ts-pack-2.js");
load("curriculum-ts-pack-3.js");
load("curriculum-ts-pack-4.js");
load("curriculum-ts-pack-5.js");
load("curriculum-ts-pack-6.js");
load("curriculum-ts-pack-7.js");
load("curriculum-ts-pack-8.js");
load("runtime-js.js");

(async function () {
  const track = window.TRACKS.find((t) => t.id === "typescript");
  const rt = window.Runtimes.typescript;
  if (!track || !rt) { console.error("ts track/runtime missing"); process.exit(2); }
  const issues = []; let n = 0;
  for (const mod of track.modules) {
    for (const ex of mod.exercises) {
      n++;
      const sol = await rt.grade(ex.solution, ex);
      if (!sol.all_ok) issues.push(["SOLUTION_FAIL", mod.code, ex.id, sol.results.filter((r) => !r.ok), sol.preexec_error]);
      const st = await rt.grade(ex.starter, ex);
      if (st.all_ok) issues.push(["STARTER_PASSES", mod.code, ex.id, [], null]);
    }
  }
  console.log("TS exercises checked:", n);
  console.log("issues:", issues.length);
  for (const [k, c, id, bad, pe] of issues) {
    console.log(`[${k}] ${c} :: ${id}`);
    if (pe) console.log("   compile/err:", pe);
    (bad || []).forEach((r) => console.log("   x", r.name, "::", r.msg));
  }
  console.log(issues.length ? "TS: ISSUES FOUND" : "TS: ALL SOLUTIONS PASS / ALL STARTERS FAIL");
  process.exit(issues.length ? 1 : 0);
})();
