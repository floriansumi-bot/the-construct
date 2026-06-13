/* Assemble _verify/ts-gen/<sector>.json into js/curriculum-ts-pack-<N>.js.
   Usage: node assemble.js <packNumber> <comma,separated,modIds>
   Mirrors js-gen/assemble.js but for the TYPESCRIPT track. Every string is
   emitted via JSON.stringify so types/backticks/${}/quotes survive verbatim.
   New ids are checked against every other curriculum-ts file for collisions. */
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..", "..");
const genDir = __dirname;

const OUT = process.argv[2];
const SECTORS = (process.argv[3] || "").split(",").filter(Boolean);
if (!OUT || !SECTORS.length) { console.error("usage: node assemble.js <packN> <modId,modId,...>"); process.exit(2); }
const outName = "curriculum-ts-pack-" + OUT + ".js";

const existing = new Set();
fs.readdirSync(path.join(base, "js"))
  .filter(function (f) { return /^curriculum-ts(\.js|-pack-\d+\.js)$/.test(f) && f !== outName; })
  .forEach(function (f) {
    const src = fs.readFileSync(path.join(base, "js", f), "utf8");
    const re = /id:\s*['"](ts-[a-z0-9-]+)['"]/g; let m;
    while ((m = re.exec(src))) existing.add(m[1]);
  });

function S(v) { return JSON.stringify(v == null ? "" : v); }
function lines(arr) { return S((arr || []).join("\n")); }

const seen = new Set();
let total = 0;
const blocks = SECTORS.map(function (mod) {
  const data = JSON.parse(fs.readFileSync(path.join(genDir, mod + ".json"), "utf8"));
  const body = (data.exercises || []).map(function (ex) {
    if (!ex.id || seen.has(ex.id)) throw new Error("dup id in batch: " + ex.id);
    if (existing.has(ex.id)) throw new Error("id collides with existing curriculum: " + ex.id);
    seen.add(ex.id); total++;
    const tests = (ex.tests || []).map(function (tt) {
      return "        { name: " + S(tt.name) + ", code: " + S(tt.code) + " }";
    }).join(",\n");
    return [
      "      {",
      "        id: " + S(ex.id) + ", title: " + S(ex.title) + ", kind: " + S(ex.kind || "function") +
        ", difficulty: " + (ex.difficulty || 1) + ", xp: " + (ex.xp || 120) + ",",
      "        brief: " + S(ex.brief) + ",",
      "        prompt: " + lines(ex.promptLines) + ",",
      "        starter: " + lines(ex.starterLines) + ",",
      "        solution: " + lines(ex.solutionLines) + ",",
      "        tests: [",
      tests,
      "        ],",
      "        hint: " + S(ex.hint) + ", lore: " + S(ex.lore),
      "      }",
    ].join("\n");
  }).join(",\n");
  return '  add("' + mod + '", [\n' + body + "\n  ]);";
}).join("\n\n");

const out = [
  "/* ============================================================",
  "   " + outName + " — TYPESCRIPT expansion pack " + OUT + ".",
  "   Appends practice nodes to existing sectors (" + SECTORS.join(", ") + ")",
  "   to bring TypeScript toward Python parity. Auto-assembled from",
  "   _verify/ts-gen/*.json and verified by _verify/verify-ts.js (real tsc",
  "   transpile + V8 grade: every solution passes, every starter fails).",
  "   ============================================================ */",
  "(function () {",
  '  var t = window.getTrack && window.getTrack("typescript");',
  "  if (!t) return;",
  "  function add(modId, exs) {",
  "    var m = t.modules.find(function (x) { return x.id === modId; });",
  "    if (m) Array.prototype.push.apply(m.exercises, exs);",
  "  }",
  blocks,
  "})();",
  "",
].join("\n");

fs.writeFileSync(path.join(base, "js", outName), out, "utf8");
console.log("assembled " + outName + " :: " + total + " new exercises across " + SECTORS.length + " sectors");
