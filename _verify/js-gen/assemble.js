/* Assemble _verify/js-gen/<sector>.json files into js/curriculum-js-pack-7.js.
   Every string is emitted via JSON.stringify so backticks/${}/quotes/newlines
   survive verbatim. Also checks new ids don't collide with existing ones. */
const fs = require("fs");
const path = require("path");
const base = path.resolve(__dirname, "..", "..");          // repo root
const genDir = __dirname;

const SECTORS = ["jsm01-boot", "jsm02-logic", "jsm03-strings", "jsm04-objects"];

// collect existing ids from the base track + packs 1..6 so we can detect collisions
const existing = new Set();
["curriculum-js.js", "curriculum-js-pack-1.js", "curriculum-js-pack-2.js",
 "curriculum-js-pack-3.js", "curriculum-js-pack-4.js", "curriculum-js-pack-5.js",
 "curriculum-js-pack-6.js"].forEach(function (f) {
  const src = fs.readFileSync(path.join(base, "js", f), "utf8");
  const re = /id:\s*"(js-[a-z0-9-]+)"/g; let m;
  while ((m = re.exec(src))) existing.add(m[1]);
});

function S(v) { return JSON.stringify(v == null ? "" : v); }      // safe string literal
function lines(arr) { return S((arr || []).join("\n")); }         // array-of-lines -> one string literal

const seen = new Set();
let total = 0;
const blocks = SECTORS.map(function (mod) {
  const file = path.join(genDir, mod + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const exs = data.exercises || [];
  const body = exs.map(function (ex) {
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
  "   curriculum-js-pack-7.js — JAVASCRIPT expansion pack 7.",
  "   Appends practice nodes to existing sectors 0x01..0x04 to bring",
  "   JavaScript toward Python parity. Auto-assembled from",
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

fs.writeFileSync(path.join(base, "js", "curriculum-js-pack-7.js"), out, "utf8");
console.log("assembled curriculum-js-pack-7.js :: " + total + " new exercises across " + SECTORS.length + " sectors");
