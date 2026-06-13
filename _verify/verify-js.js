/* Verify the JAVASCRIPT track: every reference solution must clear all
   tests and every starter must NOT — run through the real runtime-js.js
   grader (main-thread fallback path, identical logic to the worker). */
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..");
global.window = {};
function load(f) { (0, eval)(fs.readFileSync(path.join(base, "js", f), "utf8")); }
load("tracks.js");
load("curriculum-js.js");
// expansion packs (verified alongside the base track)
load("curriculum-js-pack-1.js");
load("curriculum-js-pack-2.js");
load("curriculum-js-pack-3.js");
load("curriculum-js-pack-4.js");
load("curriculum-js-pack-5.js");
load("curriculum-js-pack-6.js");
load("curriculum-js-pack-7.js");
load("curriculum-js-pack-8.js");
load("curriculum-js-pack-9.js");
load("runtime-js.js");

(async function () {
  const track = window.TRACKS.find((t) => t.id === "javascript");
  const rt = window.Runtimes.javascript;
  if (!track || !rt) { console.error("track/runtime missing"); process.exit(2); }

  const issues = [];
  let n = 0;
  for (const mod of track.modules) {
    for (const ex of mod.exercises) {
      n++;
      const sol = await rt.grade(ex.solution, ex);
      if (!sol.all_ok) issues.push(["SOLUTION_FAIL", mod.code, ex.id, sol.results.filter((r) => !r.ok), sol.preexec_error]);
      const st = await rt.grade(ex.starter, ex);
      if (st.all_ok) issues.push(["STARTER_PASSES", mod.code, ex.id, [], null]);
    }
  }

  console.log("JS exercises checked:", n);
  console.log("issues:", issues.length);
  console.log("=".repeat(58));
  for (const [kind, code, id, bad, pe] of issues) {
    console.log(`[${kind}] ${code} :: ${id}`);
    if (pe) console.log("   display_error:", pe);
    bad.forEach((r) => console.log("   x", r.name, "::", r.msg));
    console.log("-".repeat(58));
  }
  console.log(issues.length ? "JS: ISSUES FOUND" : "JS: ALL SOLUTIONS PASS / ALL STARTERS FAIL");
  process.exit(issues.length ? 1 : 0);
})();
