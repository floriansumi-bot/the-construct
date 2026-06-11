export const meta = {
  name: 'translate-fr-titles',
  description: 'Translate module + exercise titles to French (one agent per track)',
  phases: [{ title: 'Titles', detail: 'six tracks' }],
};

const A = (typeof args === 'string') ? JSON.parse(args) : (args || {});
const srcDir = A.srcDir, outDir = A.outDir, jobs = A.jobs || [];

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['trackId', 'modules', 'exercises', 'wrotePath'],
  properties: {
    trackId: { type: 'string' },
    modules: { type: 'number' }, exercises: { type: 'number' },
    wrotePath: { type: 'string' },
  },
};

function prompt(srcFile, outFile, trackName) {
  return [
    "You localize the section and exercise TITLES of THE CONSTRUCT, a cyberpunk-themed learn-to-code course, into French (France).",
    "",
    "STEP 1 — Read this JSON with the Read tool:",
    srcFile,
    "Shape: { trackId, trackName, modules:[{id,en}], exercises:[{id,en}] }. `en` is the English title (usually ALL-CAPS).",
    "",
    "STEP 2 — Translate every `en` title to French. Rules:",
    "- These are punchy sci-fi / anime / music 'mission codename' titles. Translate to natural French, keeping the cool, terse tone.",
    "- Translate plain technical section names properly: LOOPS->BOUCLES, LISTS & TUPLES->LISTES & TUPLES, REGULAR EXPRESSIONS->EXPRESSIONS RÉGULIÈRES, VARIABLES & SIGNALS->VARIABLES & SIGNAUX, DICTIONARIES->DICTIONNAIRES, EXCEPTIONS->EXCEPTIONS, FUNCTIONS->FONCTIONS, CONDITIONS->CONDITIONS, STRINGS->CHAÎNES, TESTING->TESTS, ALGORITHMS->ALGORITHMES.",
    "- KEEP unchanged: proper nouns, character/place/band names and franchise references (e.g. Neo, Spike, Bebop, Lain, the Wired, Mega Man), and any code token / keyword / identifier (for, while, range, JOIN, SELECT, async, etc.).",
    "- Keep titles ALL-CAPS if the English was ALL-CAPS. Keep them short.",
    "- Use straight apostrophes ('). French accents are required (É, È, À, Î...).",
    "",
    "STEP 3 — Write ONE valid JSON object (nothing else) with the Write tool to this EXACT path:",
    outFile,
    'Shape: { "trackId": "..", "modules": { "<moduleId>": "FR TITLE", ... }, "exercises": { "<exerciseId>": "FR TITLE", ... } }',
    "Include EVERY id from the source. Valid JSON: escape \\\" and \\\\ properly.",
    "",
    "STEP 4 — Return the structured ack (trackId, modules = count, exercises = count, wrotePath).",
    "",
    "Track: " + trackName + ".",
  ].join("\n");
}

phase('Titles');
log('Translating titles for ' + jobs.length + ' tracks…');
const results = await parallel(jobs.map(function (j) {
  return function () {
    const srcFile = srcDir + "/" + j.t + "__src.json";
    const outFile = outDir + "/" + j.t + ".json";
    return agent(prompt(srcFile, outFile, j.n), { label: 'titles:' + j.t, phase: 'Titles', schema: SCHEMA });
  };
}));
const ok = results.filter(Boolean);
log('Titles done: ' + ok.length + '/' + jobs.length);
return ok;
