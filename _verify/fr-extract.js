/* fr-extract.js — load every curriculum in a browser-like shim and emit
   one translation job file per module under _verify/fr-jobs/.
   Run: node _verify/fr-extract.js                                        */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const JS = path.join(__dirname, "..", "js");
const OUT = path.join(__dirname, "fr-jobs");

// ---- browser shim ----
const sandbox = { window: {}, document: undefined, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

// load order must match index.html (core before packs)
const order = [
  "tracks.js",
  "curriculum.js", "curriculum-python-extra.js",
  "curriculum-python-pack-1.js", "curriculum-python-pack-2.js", "curriculum-python-pack-3.js",
  "curriculum-python-pack-4.js", "curriculum-python-pack-5.js", "curriculum-python-pack-6.js",
  "curriculum-python-pack-7.js", "curriculum-python-pack-8.js",
  "curriculum-js.js",
  "curriculum-js-pack-1.js", "curriculum-js-pack-2.js", "curriculum-js-pack-3.js",
  "curriculum-js-pack-4.js", "curriculum-js-pack-5.js", "curriculum-js-pack-6.js",
  "curriculum-js-pack-7.js", "curriculum-js-pack-8.js", "curriculum-js-pack-9.js",
  "curriculum-ts.js",
  "curriculum-ts-pack-1.js", "curriculum-ts-pack-2.js", "curriculum-ts-pack-3.js",
  "curriculum-ts-pack-4.js", "curriculum-ts-pack-5.js", "curriculum-ts-pack-6.js",
  "curriculum-ts-pack-7.js", "curriculum-ts-pack-8.js",
  "curriculum-sql.js", "curriculum-sql-pack-1.js", "curriculum-lua.js", "curriculum-ruby.js",
];

for (const f of order) {
  const p = path.join(JS, f);
  if (!fs.existsSync(p)) { console.error("MISSING", f); continue; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), sandbox, { filename: f }); }
  catch (e) { console.error("LOAD FAIL", f, e.message); }
}

const tracks = sandbox.window.TRACKS || [];
if (!tracks.length) { console.error("No tracks loaded"); process.exit(1); }

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pick = (o, keys) => { const r = {}; for (const k of keys) if (o[k] != null && o[k] !== "") r[k] = o[k]; return r; };

const index = [];
const trackMeta = [];
let modCount = 0, exCount = 0, chars = 0;

for (const tr of tracks) {
  trackMeta.push({ id: tr.id, name: tr.name, intro: tr.intro || "", blurb: tr.blurb || "" });
  for (const m of (tr.modules || [])) {
    const job = {
      trackId: tr.id, trackName: tr.name,
      moduleId: m.id, code: m.code || "",
      title: m.title || "", subtitle: m.subtitle || "", theory: m.theory || "",
      exercises: (m.exercises || []).map((ex) => pick(ex, ["id", "title", "brief", "prompt", "hint"])),
    };
    modCount++; exCount += job.exercises.length;
    chars += JSON.stringify(job).length;
    const file = path.join(OUT, tr.id + "__" + m.id + ".json");
    fs.writeFileSync(file, JSON.stringify(job, null, 2));
    index.push({ trackId: tr.id, trackName: tr.name, moduleId: m.id, file });
  }
}

fs.writeFileSync(path.join(OUT, "_index.json"), JSON.stringify(index, null, 2));
fs.writeFileSync(path.join(OUT, "_track-meta.json"), JSON.stringify(trackMeta, null, 2));

console.log("tracks   :", tracks.map((t) => t.id + "(" + (t.modules || []).length + ")").join(", "));
console.log("modules  :", modCount);
console.log("exercises:", exCount);
console.log("approx translatable chars:", chars, "(~" + Math.round(chars / 1024) + " KB)");
console.log("jobs dir :", OUT);
