/* Assemble _verify/js-gen/<sector>.json into js/curriculum-js-pack-<N>.js.
   Usage: node assemble.js <packNumber> <comma,separated,modIds>
   e.g.   node assemble.js 8 jsm05-loops,jsm06-closures,jsm07-recursion,jsm08-errors
   Every string is emitted via JSON.stringify so backticks/${}/quotes/newlines
   survive verbatim. New ids are checked against every other pack for collisions. */
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..", "..");          // repo root
const genDir = __dirname;

const OUT = process.argv[2];
const SECTORS = (process.argv[3] || "").split(",").filter(Boolean);
if (!OUT || !SECTORS.length) { console.error("usage: node assemble.js <packN> <modId,modId,...>"); process.exit(2); }
const outName = "curriculum-js-pack-" + OUT + ".js";

// collect existing ids from every curriculum-js file EXCEPT the target output
const existing = new Set();
fs.readdirSync(path.join(base, "js"))
  .filter(function (f) { return /^curriculum-js(\.js|-pack-\d+\.js)$/.test(f) && f !== outName; })
  .forEach(function (f) {
    const src = fs.readFileSync(path.join(base, "js", f), "utf8");
    const re = /id:\s*"(js-[a-z0-9-]+)"/g; let m;
    while ((m = re.exec(src))) existing.add(m[1]);
  });

function S(v) { return JSON.stringify(v == null ? "" : v); }   // safe string literal
function lines(arr) { return S((arr || []).join("\n")); }      // array-of-lines -> one string literal

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
  "   " + outName + " — JAVASCRIPT expansion pack " + OUT + ".",
  "   Appends practice nodes to existing sectors (" + SECTORS.join(", ") + ")",
  "   to bring JavaScript toward Python parity. Auto-assembled from",
  "   _verify/js-gen/*.json and verified by _verify/verify-js.js on the",
  "   REAL V8 grader (every solution passes, every starter fails).",
  "   ============================================================ */",
  "(function () {",
  '  var t = window.getTrack && window.getTrack("javascript");',
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
