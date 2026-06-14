/* Assemble _verify/ruby-gen/jobs/*.json into js/curriculum-ruby-pack-1.js.
   Ruby exercises are test-based (assert / assert_equal / assert_raises) like the
   JS track — no computed expected. The real engine gate is _verify/verify-ruby.js
   (CRuby via ruby.wasm); author agents self-test via _verify/ruby-gen/run.js.
   This emitter does id-collision checks + structural emit (JSON.stringify).

   Job shapes (one per sector):
     new:  { "type":"new",  "module":{id,code,title,subtitle,theory}, "exercises":[...] }
     fill: { "type":"fill", "modId":"rbm01-core", "exercises":[...] }
   Each exercise: { id,title,kind('function'|'script'),difficulty,xp,brief,prompt,
                    starter,solution,tests:[{name,code}],hint,lore }   (Ruby source strings) */
const fs = require("fs");
const path = require("path");
const GEN = __dirname, ROOT = path.join(GEN, "..", ".."), JS = path.join(ROOT, "js"), JOBS = path.join(GEN, "jobs");
const TRACK = "ruby", PREFIX = "rb", PACK = "curriculum-ruby-pack-1.js";

function S(v) { return JSON.stringify(v == null ? "" : v); }
function existingIds() {
  const set = new Set();
  fs.readdirSync(JS).filter((f) => f !== PACK && new RegExp("^curriculum-" + TRACK + "(\\.js|-pack-\\d+\\.js)$").test(f)).forEach((f) => {
    const src = fs.readFileSync(path.join(JS, f), "utf8");
    const re = new RegExp('id:\\s*"(' + PREFIX + '-[a-z0-9-]+)"', "g"); let m; while ((m = re.exec(src))) set.add(m[1]);
  });
  return set;
}
function emitExercise(ex) {
  const tests = (ex.tests || []).map((t) => "          { name: " + S(t.name) + ", code: " + S(t.code) + " }").join(",\n");
  return [
    "        {",
    "          id: " + S(ex.id) + ", title: " + S(ex.title) + ", kind: " + S(ex.kind || "function") + ", difficulty: " + (ex.difficulty || 1) + ", xp: " + (ex.xp || 120) + ",",
    "          brief: " + S(ex.brief) + ",",
    "          prompt: " + S(ex.prompt) + ",",
    "          starter: " + S(ex.starter) + ",",
    "          solution: " + S(ex.solution) + ",",
    "          tests: [\n" + tests + "\n          ],",
    "          hint: " + S(ex.hint) + ", lore: " + S(ex.lore),
    "        }",
  ].join("\n");
}
function emitModule(m) {
  return [
    "      {",
    "        id: " + S(m.module.id) + ", code: " + S(m.module.code) + ", title: " + S(m.module.title) + ",",
    "        subtitle: " + S(m.module.subtitle) + ",",
    "        theory: " + S(m.module.theory) + ",",
    "        exercises: [\n" + m.exercises.map(emitExercise).join(",\n") + "\n        ],",
    "      }",
  ].join("\n");
}

const existing = existingIds();
const files = fs.readdirSync(JOBS).filter((f) => f.endsWith(".json")).sort();
const newMods = [], fills = {}, issues = [], seen = new Set(); let total = 0;
for (const f of files) {
  const job = JSON.parse(fs.readFileSync(path.join(JOBS, f), "utf8"));
  for (const ex of job.exercises) {
    total++;
    if (seen.has(ex.id)) issues.push("dup id in batch: " + ex.id);
    if (existing.has(ex.id)) issues.push("id collides with existing: " + ex.id);
    seen.add(ex.id);
    if (!ex.tests || !ex.tests.length) issues.push(ex.id + " :: no tests");
  }
  if (job.type === "new") newMods.push(job); else (fills[job.modId] = fills[job.modId] || []).push(...job.exercises);
}
newMods.sort((a, b) => (a.module.code < b.module.code ? -1 : 1));
const pushBlock = newMods.length ? ("  t.modules.push(\n" + newMods.map(emitModule).join(",\n") + "\n  );") : "";
const addBlocks = Object.keys(fills).map((mid) => '  add("' + mid + '", [\n' + fills[mid].map(emitExercise).join(",\n") + "\n  ]);").join("\n\n");
const out = [
  "/* ============================================================",
  "   " + PACK + " — RUBY expansion (right-size to ~8 sectors).",
  "   Adds new sectors + fills existing. Test-based (assert/assert_equal/",
  "   assert_raises); verified by _verify/verify-ruby.js on CRuby (ruby.wasm).",
  "   Auto-assembled from _verify/ruby-gen/jobs/*.json — do not hand-edit.",
  "   ============================================================ */",
  "(function () {",
  '  var t = window.getTrack && window.getTrack("' + TRACK + '");',
  "  if (!t) return;",
  "  function add(modId, exs) { var m = t.modules.find(function (x) { return x.id === modId; }); if (m) Array.prototype.push.apply(m.exercises, exs); }",
  pushBlock,
  addBlocks,
  "})();",
  "",
].filter(Boolean).join("\n");
fs.writeFileSync(path.join(JS, PACK), out, "utf8");
console.log("assembled " + PACK + " :: " + total + " exercises (" + newMods.length + " new sectors, " + Object.keys(fills).length + " filled)");
console.log("issues:", issues.length); issues.forEach((x) => console.log("   - " + x));
process.exit(issues.length ? 1 : 0);
