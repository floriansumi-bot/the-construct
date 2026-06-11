/* fr-titles-extract.js — collect EN module + exercise titles per track into
   _verify/fr-titles/<track>__src.json for the title-translation pass.       */
const fs = require("fs");
const path = require("path");
const JOBS = path.join(__dirname, "fr-jobs");
const OUTD = path.join(__dirname, "fr-titles");
fs.mkdirSync(OUTD, { recursive: true });

const index = JSON.parse(fs.readFileSync(path.join(JOBS, "_index.json"), "utf8"));
const byTrack = {};
for (const it of index) {
  const m = JSON.parse(fs.readFileSync(path.join(JOBS, it.trackId + "__" + it.moduleId + ".json"), "utf8"));
  const T = byTrack[it.trackId] || (byTrack[it.trackId] = { trackId: it.trackId, trackName: it.trackName, modules: [], exercises: [] });
  if (m.title) T.modules.push({ id: it.moduleId, en: m.title });
  (m.exercises || []).forEach((e) => { if (e.title) T.exercises.push({ id: e.id, en: e.title }); });
}
const args = { jobs: [] };
for (const tid of Object.keys(byTrack)) {
  const f = path.join(OUTD, tid + "__src.json");
  fs.writeFileSync(f, JSON.stringify(byTrack[tid], null, 2));
  args.jobs.push({ t: tid, n: byTrack[tid].trackName, modules: byTrack[tid].modules.length, exercises: byTrack[tid].exercises.length });
  console.log(tid, "modules:", byTrack[tid].modules.length, "exercises:", byTrack[tid].exercises.length);
}
fs.writeFileSync(path.join(OUTD, "_args.json"), JSON.stringify({ srcDir: OUTD.replace(/\\/g, "/"), outDir: OUTD.replace(/\\/g, "/"), jobs: args.jobs }));
console.log("wrote src + _args.json to", OUTD);
