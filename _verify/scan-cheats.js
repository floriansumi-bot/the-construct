// Scans every Python exercise for "the method is the point" language and reports
// which ones lack a source-guard (so a hard-coded / shortcut answer could pass).
// Run: node _verify/review-extract.js && node _verify/scan-cheats.js
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "review");
const files = fs.readdirSync(DIR).filter((f) => /^python__.*\.json$/.test(f));

const SIGNALS = [
  [/don'?t (just )?(call|use)\s+`?(\w+)\s*\(/i, "ban-builtin"],
  [/without (using|calling)\s+`?(\w+)/i, "ban-builtin"],
  [/\b(using|with|in) a (single )?loop\b/i, "loop-required"],
  [/\brecursi|call(?:ing|s)? (itself|yourself)\b/i, "recursion"],
  [/\bsep=/, "needs-sep"],
  [/\bend=/, "needs-end"],
  [/\bcomprehension\b/i, "comprehension"],
  [/\bno `?for`?\b|\bno loops?\b|without a loop/i, "no-loop"],
  [/\bf-string|\bf"/i, "fstring"],
  [/\bternary\b|one-line (conditional|if)/i, "ternary"],
  [/\bmust (re)?use\b|\bhave \w+ call\b/i, "reuse"],
];

const rows = [];
for (const f of files) {
  const m = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  for (const e of m.exercises) {
    const text = (e.prompt || "") + " " + (e.brief || "");
    const hits = [];
    for (const [re, tag] of SIGNALS) { const mm = text.match(re); if (mm) hits.push(tag + (mm[3] ? ":" + mm[3] : (mm[2] && /^[a-z]+$/i.test(mm[2]) ? ":" + mm[2] : ""))); }
    if (!hits.length) continue;
    const hasGuard = (e.tests || []).some((t) => /_src\b/.test(t.code || ""));
    rows.push({ mod: m.moduleId, id: e.id, kind: e.kind, hits: hits.join(", "), guard: hasGuard ? "HAS-GUARD" : "—none—" });
  }
}
rows.sort((a, b) => (a.guard === b.guard ? 0 : a.guard === "—none—" ? -1 : 1));
console.log("EXERCISES WITH 'METHOD MATTERS' LANGUAGE (" + rows.length + "):\n");
for (const r of rows) {
  console.log(("[" + r.guard + "]").padEnd(12), (r.mod + "/" + r.id).padEnd(34), r.kind.padEnd(9), r.hits);
}
console.log("\nUNGUARDED candidates:", rows.filter((r) => r.guard === "—none—").length);
