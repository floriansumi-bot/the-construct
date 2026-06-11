/* fr-assemble.js — build js/content-fr.js from _verify/fr-out/*.json.
   Safety: for prompt/theory, every fenced code block in the French text
   must byte-match the English source; otherwise that field falls back to
   English (so a stray agent edit can never corrupt a graded example).
   Python m01-boot is overridden by the hand-reviewed seed already in
   js/content-fr.js. Run: node _verify/fr-assemble.js                     */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const JOBS = path.join(__dirname, "fr-jobs");
const OUT = path.join(__dirname, "fr-out");

// hand-written French track intros/blurbs (full control)
const TRACK_FR = {
  python: { intro: "Du vrai CPython 3.12, compilé en WebAssembly, exécuté en local. Lisez le briefing, forcez les nœuds — chacun corrigé en direct par des vecteurs de test cachés. Parcours carrière : de zéro à opérateur.", blurb: "Du vrai CPython 3.12 dans votre navigateur. Le parcours CS50P + Dataquest, relooké pour le Wired." },
  javascript: { intro: "JavaScript s'exécute ici dans un Web Worker isolé — vitesse native, aucune installation, boucles infinies stoppées automatiquement. Lisez le briefing, forcez les nœuds, engrangez de l'XP.", blurb: "Le langage du web, exécuté nativement dans un Worker isolé. Fonctions, tableaux, objets, fermetures." },
  typescript: { intro: "Votre code est compilé par le véritable compilateur TypeScript avant de s'exécuter — les types débusquent les fantômes avant même que la machine ne s'éveille. Annotez le signal, satisfaites le compilateur, engrangez de l'XP.", blurb: "JavaScript doté d'un système de types. Le vrai tsc compile votre code, puis il s'exécute. Annotez, créez des alias, unissez, généralisez." },
  sql: { intro: "Un vrai moteur SQLite (sql.js/WASM) tourne en local. Chaque nœud charge une base pré-remplie ; votre requête est comparée au jeu de résultats cible. SELECT, agrégation, JOIN, mutation.", blurb: "Interrogez une vraie base SQLite dans votre navigateur. Le langage sur lequel repose toute carrière dans la donnée." },
  lua: { intro: "Lua 5.4 tourne dans votre navigateur via WASM. Minuscule, rapide, embarquable — la couche de script d'innombrables jeux et outils. Définissez des fonctions, le moteur vérifie votre travail.", blurb: "Le langage de script poids plume qui vit au cœur des jeux, des moteurs et des systèmes embarqués." },
  ruby: { intro: "Du vrai CRuby (ruby.wasm) tourne dans votre navigateur. Le premier nœud Ruby télécharge l'interpréteur (~34 Mo, une seule fois). Expressif, orienté objet, joyeux.", blurb: "Le langage optimisé pour le bonheur des développeurs. Des objets élégants, des blocs, et Rails." },
};

function extractFences(md) {
  const lines = String(md == null ? "" : md).replace(/\r/g, "").split("\n");
  const blocks = []; let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^\s*(`{3}|~{3})/);
    if (m) {
      const mark = m[1][0] === "~" ? "~~~" : "```";
      const buf = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith(mark)) { buf.push(lines[i]); i++; }
      i++; blocks.push(buf.join("\n"));
    } else i++;
  }
  return blocks;
}
function fencesMatch(en, fr) {
  const a = extractFences(en), b = extractFences(fr);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// ---- load EN source jobs ----
const index = JSON.parse(fs.readFileSync(path.join(JOBS, "_index.json"), "utf8"));
const enByKey = {};
for (const it of index) {
  const key = it.trackId + "__" + it.moduleId;
  enByKey[key] = JSON.parse(fs.readFileSync(path.join(JOBS, key + ".json"), "utf8"));
}

const CONTENT = {};
const stats = { modules: 0, missing: [], parseFail: [], guardFallback: [], exTranslated: 0 };

function ensureTrack(tid) {
  if (!CONTENT[tid]) CONTENT[tid] = { track: TRACK_FR[tid] || {}, modules: {}, exercises: {} };
  return CONTENT[tid];
}

for (const it of index) {
  const key = it.trackId + "__" + it.moduleId;
  const en = enByKey[key];
  const outFile = path.join(OUT, key + ".json");
  if (!fs.existsSync(outFile)) { stats.missing.push(key); continue; }
  let fr;
  try { fr = JSON.parse(fs.readFileSync(outFile, "utf8")); }
  catch (e) { stats.parseFail.push(key + " :: " + e.message); continue; }

  const T = ensureTrack(it.trackId);
  const mod = {};
  if (fr.title) mod.title = fr.title;
  if (fr.subtitle) mod.subtitle = fr.subtitle;
  if (fr.theory) {
    if (fencesMatch(en.theory || "", fr.theory)) mod.theory = fr.theory;
    else stats.guardFallback.push(key + " :: theory");
  }
  if (Object.keys(mod).length) T.modules[it.moduleId] = mod;

  const enEx = {}; (en.exercises || []).forEach((e) => { enEx[e.id] = e; });
  (fr.exercises || []).forEach((e) => {
    if (!e || !e.id) return;
    const src = enEx[e.id] || {};
    const obj = {};
    if (e.title) obj.title = e.title;
    if (e.brief) obj.brief = e.brief;
    if (e.hint) obj.hint = e.hint;
    if (e.prompt) {
      if (fencesMatch(src.prompt || "", e.prompt)) obj.prompt = e.prompt;
      else stats.guardFallback.push(key + "/" + e.id + " :: prompt");
    }
    if (Object.keys(obj).length) { T.exercises[e.id] = obj; stats.exTranslated++; }
  });
  stats.modules++;
}

// ---- merge French TITLES (from the title pass) over the body translations ----
const TITLES_DIR = path.join(__dirname, "fr-titles");
let titleMerged = 0;
for (const tid of ["python", "javascript", "typescript", "sql", "lua", "ruby"]) {
  const tf = path.join(TITLES_DIR, tid + ".json");
  if (!fs.existsSync(tf)) continue;
  let tj;
  try { tj = JSON.parse(fs.readFileSync(tf, "utf8")); }
  catch (e) { stats.parseFail.push("titles:" + tid + " :: " + e.message); continue; }
  const T = ensureTrack(tid);
  for (const mid of Object.keys(tj.modules || {})) { if (!tj.modules[mid]) continue; (T.modules[mid] = T.modules[mid] || {}).title = tj.modules[mid]; titleMerged++; }
  for (const eid of Object.keys(tj.exercises || {})) { if (!tj.exercises[eid]) continue; (T.exercises[eid] = T.exercises[eid] || {}).title = tj.exercises[eid]; titleMerged++; }
}
if (titleMerged) console.log("title pass merged:", titleMerged, "French titles");

// ---- override Python m01-boot with the hand-reviewed seed in js/content-fr.js ----
try {
  const seedSrc = fs.readFileSync(path.join(ROOT, "js", "content-fr.js"), "utf8");
  const sb = { window: {} }; vm.createContext(sb); vm.runInContext(seedSrc, sb);
  const seed = sb.window.CONTENT_FR && sb.window.CONTENT_FR.python;
  if (seed) {
    ensureTrack("python");
    if (seed.modules && seed.modules["m01-boot"]) CONTENT.python.modules["m01-boot"] = seed.modules["m01-boot"];
    const seedIds = ["boot-wake", "boot-callsign", "boot-coords", "boot-banner", "boot-oneline", "boot-splice", "boot-rule", "boot-countdown"];
    for (const id of seedIds) if (seed.exercises && seed.exercises[id]) CONTENT.python.exercises[id] = seed.exercises[id];
    console.log("seed override: Python m01-boot restored from hand-reviewed version");
  }
} catch (e) { console.error("seed override skipped:", e.message); }

// ensure every track has its FR meta even if no module landed
for (const tid of Object.keys(TRACK_FR)) { ensureTrack(tid).track = TRACK_FR[tid]; }

// ---- write js/content-fr.js ----
const header = "/* ============================================================\n" +
  "   content-fr.js — French lesson overlay for THE CONSTRUCT.\n" +
  "   AUTO-GENERATED by _verify/fr-assemble.js from translated\n" +
  "   sectors in _verify/fr-out/. Merged onto each module/exercise\n" +
  "   as `_fr` by applyContentOverlay() in app.js; Lx(obj,field)\n" +
  "   uses these strings only when French is active AND present,\n" +
  "   else falls back to the English original.\n" +
  "   Safety: any prompt/theory whose fenced code blocks did not\n" +
  "   byte-match the English source was dropped (English kept), so\n" +
  "   graded examples are never altered. Do not edit by hand —\n" +
  "   re-run the assembler instead.\n" +
  "   ============================================================ */\n";
const body = "window.CONTENT_FR = " + JSON.stringify(CONTENT, null, 2) + ";\n";
fs.writeFileSync(path.join(ROOT, "js", "content-fr.js"), header + body);

// ---- report ----
console.log("\n=== ASSEMBLY REPORT ===");
console.log("modules with FR   :", stats.modules, "/", index.length);
console.log("exercises FR fields:", stats.exTranslated);
console.log("missing FR files  :", stats.missing.length, stats.missing.join(", ") || "");
console.log("parse failures    :", stats.parseFail.length); stats.parseFail.forEach((x) => console.log("   ", x));
console.log("guard fallbacks   :", stats.guardFallback.length, "(field kept English due to code-block mismatch)");
stats.guardFallback.forEach((x) => console.log("   ", x));
const tracks = Object.keys(CONTENT).map((t) => t + "(" + Object.keys(CONTENT[t].modules).length + "m/" + Object.keys(CONTENT[t].exercises).length + "ex)");
console.log("tracks            :", tracks.join(", "));
console.log("wrote js/content-fr.js (" + (header + body).length + " bytes)");
