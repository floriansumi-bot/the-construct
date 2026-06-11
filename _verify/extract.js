// Extracts the live grading harness (runtime.js) and the FULL Python track
// curriculum (base curriculum.js + curriculum-python-extra.js) so real CPython
// can verify every reference solution against the exact grader the browser uses.
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..");

const win = { TRACKS: [] };
win.registerTrack = function (t) { if (!win.TRACKS.some((x) => x.id === t.id)) win.TRACKS.push(t); };
win.getTrack = function (id) { return win.TRACKS.find((t) => t.id === id) || null; };

function run(file) {
  const src = fs.readFileSync(path.join(base, "js", file), "utf8");
  new Function("window", src)(win);
}
run("tracks.js");
run("curriculum.js");
if (fs.existsSync(path.join(base, "js", "curriculum-python-extra.js"))) run("curriculum-python-extra.js");

const py = win.getTrack("python");
if (!py) throw new Error("python track not registered");
fs.writeFileSync(path.join(__dirname, "curriculum.json"), JSON.stringify({ modules: py.modules }, null, 2));

// harness.py from runtime.js
const rtSrc = fs.readFileSync(path.join(base, "js", "runtime.js"), "utf8");
const m = rtSrc.match(/String\.raw`([\s\S]*?)`/);
if (!m) throw new Error("HARNESS_PY not found in runtime.js");
fs.writeFileSync(path.join(__dirname, "harness.py"), m[1]);

let ex = 0;
py.modules.forEach((mod) => (ex += mod.exercises.length));
console.log("extracted OK :: python modules=" + py.modules.length + " exercises=" + ex);
