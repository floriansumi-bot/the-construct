// review-extract.js — dump the FULL Python course (theory + every exercise's
// prompt, starter, solution, tests, hint) into _verify/review/python__<mod>.json
// so reviewers have complete context. Run: node _verify/review-extract.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const JS = path.join(__dirname, "..", "js");
const OUT = path.join(__dirname, "review");

const sandbox = { window: {}, document: undefined, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

const order = [
  "tracks.js", "curriculum.js", "curriculum-python-extra.js",
  "curriculum-python-pack-1.js", "curriculum-python-pack-2.js", "curriculum-python-pack-3.js",
  "curriculum-python-pack-4.js", "curriculum-python-pack-5.js", "curriculum-python-pack-6.js",
  "curriculum-python-pack-7.js", "curriculum-python-pack-8.js",
];
for (const f of order) {
  try { vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), sandbox, { filename: f }); }
  catch (e) { console.error("LOAD FAIL", f, e.message); }
}
const py = (sandbox.window.TRACKS || []).find((t) => t.id === "python");
if (!py) { console.error("no python track"); process.exit(1); }

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let mods = 0, exs = 0;
for (const m of py.modules) {
  const data = {
    moduleId: m.id, code: m.code, title: m.title, subtitle: m.subtitle, theory: m.theory,
    exercises: (m.exercises || []).map((e) => ({
      id: e.id, title: e.title, kind: e.kind, difficulty: e.difficulty, xp: e.xp,
      brief: e.brief, prompt: e.prompt, starter: e.starter, solution: e.solution,
      tests: (e.tests || []).map((t) => ({ name: t.name, code: t.code })),
      hint: e.hint, lore: e.lore,
    })),
  };
  mods++; exs += data.exercises.length;
  fs.writeFileSync(path.join(OUT, "python__" + m.id + ".json"), JSON.stringify(data, null, 2));
}
console.log("modules:", mods, "exercises:", exs, "->", OUT);
console.log("module ids:", py.modules.map((m) => m.id).join(", "));
