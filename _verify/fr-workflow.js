export const meta = {
  name: 'translate-fr',
  description: 'Translate all THE CONSTRUCT lessons to French (code-preserving)',
  phases: [{ title: 'Translate', detail: 'one agent per sector across 6 languages' }],
};

// args may arrive as a JSON string or an object — handle both.
const A = (typeof args === 'string') ? JSON.parse(args) : (args || {});
const baseDir = A.baseDir;
const outDir = A.outDir;
const jobs = A.jobs || [];

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['trackId', 'moduleId', 'exercisesTranslated', 'wrotePath'],
  properties: {
    trackId: { type: 'string' },
    moduleId: { type: 'string' },
    exercisesTranslated: { type: 'number' },
    wrotePath: { type: 'string', description: 'the output file path you wrote' },
  },
};

function buildPrompt(inFile, outFile, trackName) {
  return [
    "You are a professional French (France) technical translator localizing a cyberpunk-themed learn-to-code course called THE CONSTRUCT. Your French must be fluent, natural and idiomatic — not word-for-word.",
    "",
    "STEP 1 — Read the source JSON module with the Read tool from this EXACT path:",
    inFile,
    "It contains: { trackId, moduleId, title, subtitle, theory (markdown), exercises:[{id,title,brief,prompt,hint}] }. A field may be absent; only translate fields that are present.",
    "",
    "STEP 2 — Translate the human-readable text to French.",
    "",
    "ABSOLUTE RULES (breaking ANY of these breaks the live auto-grader — be meticulous):",
    "1. NEVER change anything inside fenced code blocks (everything between ~~~ and ~~~, or between triple-backticks). Reproduce them byte-for-byte: code, code comments, AND especially expected OUTPUT text. Sample outputs like \"Wake up, Neo...\", \"SOL :: GATE :: MARS\", \"BEBOP ONLINE\", \"CYCLES REMAINING: 3\" must stay EXACTLY in English.",
    "2. NEVER translate inline `code spans` (text in backticks), identifiers, function/method names, language keywords, or escape sequences (\\n, \\t, \\\\). Keep print(), len(), sep=, end=\"\", def, return, function, const, SELECT, FROM, WHERE, end, local, puts, etc. verbatim.",
    "3. Keep ALL markdown tokens and structure EXACTLY: ## and ### headers, **bold**, *italic*, > callouts (including any leading 'INTEL —' or 'WARNING' / '[!warn]'), - and 1. lists, ~~~ fences, and example arrows ->. Translate only the natural-language words around them.",
    "4. Keep proper nouns, character names, song / anime / sci-fi references, and the term 'the Wired' unchanged.",
    "5. Preserve every exercise `id` EXACTLY, and include EVERY exercise. Never add, drop, merge, or reorder.",
    "6. Translate `title`, `subtitle`, `theory`, `brief`, `prompt`, `hint` only — never `id`.",
    "",
    "STYLE: vouvoiement (vous / votre). French typography: a normal space before : ; ! and ?. Straight apostrophes ('). Imperative for instructions (\"Affichez...\", \"Définissez...\", \"Renvoyez...\"). Keep the terse hacker tone.",
    "",
    "GLOSSARY — use consistently: string=chaîne, integer=entier, float=flottant, boolean=booléen, list=liste, array=tableau, dictionary=dictionnaire, tuple=tuple, set=ensemble, function=fonction, to return=renvoyer, argument/parameter=argument/paramètre, variable=variable, value=valeur, key=clé, index=indice, element=élément, loop=boucle, statement=instruction, to print/output=afficher, input=saisie, to assign=affecter, to call=appeler, to define=définir, uppercase=majuscule, lowercase=minuscule, slice=tranche, row=ligne, column=colonne, table=table, query=requête, whitespace=espaces, nested=imbriqué, to iterate=parcourir.",
    "",
    "GOLD EXAMPLE (EN -> FR). The ~~~text block and the `code spans` are copied unchanged; only prose changes:",
    "EN prompt: Using a **single** print() call and the **sep=** argument, print three waypoints joined by ` :: `: / ~~~text / SOL :: GATE :: MARS / ~~~ / Pass the three waypoints as separate arguments — let `sep` do the joining.",
    "FR prompt: Avec un **seul** appel à print() et l'argument **sep=**, affichez trois points de passage reliés par ` :: ` : / ~~~text / SOL :: GATE :: MARS / ~~~ / Passez les trois points de passage comme arguments séparés — laissez `sep` faire la jointure.",
    "(The ' / ' above just marks line breaks in this example; keep real newlines in your output.)",
    "",
    "STEP 3 — Write your translation as ONE valid JSON object to this EXACT path using the Write tool:",
    outFile,
    "The file content must be EXACTLY one JSON object and nothing else (no markdown, no code fence, no commentary). Shape:",
    '{ "trackId": "..", "moduleId": "..", "title": "..", "subtitle": "..", "theory": "..", "exercises": [ { "id": "..", "title": "..", "brief": "..", "prompt": "..", "hint": ".." } ] }',
    "Include a field ONLY if the source had it. It MUST be valid JSON parseable by JSON.parse: escape internal double-quotes as \\\", newlines as \\n, tabs as \\t, backslashes as \\\\. The source file you read uses this exact JSON escaping — mirror its style so escape sequences such as \\\\n and \\\\t survive untouched.",
    "",
    "STEP 4 — Return the structured ack (trackId, moduleId, exercisesTranslated = number of exercises in your output, wrotePath = the path you wrote).",
    "",
    "This module belongs to the " + trackName + " track.",
  ].join("\n");
}

phase('Translate');
log('Translating ' + jobs.length + ' sectors across 6 languages into French…');

const results = await parallel(jobs.map(function (j) {
  return function () {
    const inFile = baseDir + "/" + j.t + "__" + j.m + ".json";
    const outFile = outDir + "/" + j.t + "__" + j.m + ".json";
    return agent(buildPrompt(inFile, outFile, j.n), {
      label: j.t + "/" + j.m,
      phase: 'Translate',
      schema: SCHEMA,
    });
  };
}));

const ok = results.filter(Boolean);
log('Done: ' + ok.length + '/' + jobs.length + ' sectors acknowledged.');
return ok;
