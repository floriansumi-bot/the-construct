/* ============================================================
   i18n.js — interface localization (English / French).
   window.t(key, vars) returns the localized string.
   ============================================================ */
window.I18N = {
  lang: "en",
  set: function (l) { this.lang = l === "fr" ? "fr" : "en"; },
  dict: {
    en: {
      brand_sub_poly: "// POLYGLOT UPLINK",
      brand_sub_track: "// {name} UPLINK",
      access_lvl: "ACCESS LVL", sectors: "SECTORS", xp_label: "XP",
      tt_buddy: "PROTO.EXE — a buddy that reacts to your code",
      tt_sync: "sync profile across devices", tt_settings: "settings — sound & language",
      tt_help: "briefing", tt_wipe: "wipe all progress", tt_menu: "menu",

      all_languages: "ALL LANGUAGES", dashboard: "DASHBOARD", theory_brief: "THEORY BRIEF",

      select_language: "SELECT YOUR LANGUAGE",
      lang_blurb: "THE CONSTRUCT is a polyglot training sim. Every track runs a <b>real engine</b> in your browser — CPython, V8, the TypeScript compiler, SQLite, Lua and Ruby — with theory then live-graded exercises. Pick a uplink and jack in. Career track: <b>zero → operator</b>, in any language.",
      nodes_cleared: "NODES CLEARED", languages: "LANGUAGES", total_xp: "TOTAL XP", access: "ACCESS",
      curriculum_sectors: "CURRICULUM SECTORS", mastered: "MASTERED",

      uplink: "{name} UPLINK", total_nodes: "TOTAL NODES", complete: "COMPLETE",
      resume_uplink: "RESUME UPLINK", initiate_sequence: "INITIATE SEQUENCE",
      sectors_of: "{name} SECTORS", nodes_count: "{d}/{t} nodes", cleared: "CLEARED",

      sector: "SECTOR", begin_first: "BREACH FIRST NODE — {title}",
      node_of: "NODE {i} of {t}",
      mission_brief: "MISSION BRIEF", threat: "THREAT",
      output_stdout: "OUTPUT // stdout", diagnostics: "DIAGNOSTICS // test vector",
      execute: "▸ EXECUTE", running: "RUNNING", booting: "BOOTING…",
      reset: "RESET", hint: "HINT", solution: "SOLUTION", next: "NEXT ▸",
      awaiting: "awaiting execution…", no_test: "no test vector wired for this node",
      no_output: "(no output)", pass: "PASS",
      run_press: "// hit EXECUTE to run your payload through the kernel",
      booting_kernel: "// booting {name} kernel…",
      node_cleared: "◈ NODE CLEARED", next_node: "NEXT NODE ▸",
      enter_sector: "ENTER SECTOR {code} ▸", back_to: "▸ BACK TO {name}",
      xp_acquired: "acquired", xp_logged: "already logged",
      track_mastered: "██ {name} TRACK MASTERED ██",
      toast_cleared: "NODE CLEARED · +{xp} XP", toast_wiped: "MEMORY WIPED",
      decrypted_hint: "DECRYPTED HINT", reference_solution: "REFERENCE SOLUTION",
      load_solution: "⇩ LOAD INTO EDITOR",
      confirm_solution: "Reveal the reference exploit? Try to crack it yourself first.",
      confirm_wipe: "WIPE all progress, XP and saved code for EVERY language from this browser? (Your profile code is kept; if cloud auto-sync is on, cloud progress will merge back.)",
      kernel_ready: "// kernel online — hit EXECUTE",
      kernel_fail: "KERNEL LOAD FAILED :: {err}",
      kernel_fail_hint: "This language needs internet on first use to fetch its engine. Check your connection and re-open this node.",

      // settings
      settings_title: "SETTINGS", s_language: "LANGUAGE", s_audio: "AUDIO",
      s_music: "Music", s_music_vol: "Music volume", s_sfx_vol: "Effects volume",
      s_mute: "Mute everything", s_motion: "Reduce motion",
      s_music_src: "Music source", s_generative: "Generative jungle ☕",
      s_your_files: "Your files", s_load_files: "↑ Load audio files",
      s_clear_files: "use generative", s_loaded: "{n} track(s) loaded",
      english: "English", french: "Français",

      // sync (kept mostly as-is; a few labels)
      sync_title: "PROFILE SYNC",
    },
    fr: {
      brand_sub_poly: "// LIAISON POLYGLOTTE",
      brand_sub_track: "// LIAISON {name}",
      access_lvl: "NIVEAU D'ACCÈS", sectors: "SECTEURS", xp_label: "XP",
      tt_buddy: "PROTO.EXE — un acolyte qui réagit à votre code",
      tt_sync: "synchroniser le profil entre appareils", tt_settings: "paramètres — son & langue",
      tt_help: "briefing", tt_wipe: "effacer toute la progression", tt_menu: "menu",

      all_languages: "TOUS LES LANGAGES", dashboard: "TABLEAU DE BORD", theory_brief: "BRIEF THÉORIQUE",

      select_language: "CHOISISSEZ VOTRE LANGAGE",
      lang_blurb: "THE CONSTRUCT est un simulateur d'entraînement polyglotte. Chaque parcours fait tourner un <b>vrai moteur</b> dans votre navigateur — CPython, V8, le compilateur TypeScript, SQLite, Lua et Ruby — avec de la théorie puis des exercices corrigés en direct. Choisissez une liaison et connectez-vous. Parcours carrière : <b>zéro → opérateur</b>, dans n'importe quel langage.",
      nodes_cleared: "NŒUDS VALIDÉS", languages: "LANGAGES", total_xp: "XP TOTAL", access: "ACCÈS",
      curriculum_sectors: "SECTEURS DU PROGRAMME", mastered: "MAÎTRISÉ",

      uplink: "LIAISON {name}", total_nodes: "NŒUDS TOTAUX", complete: "COMPLÉTÉ",
      resume_uplink: "REPRENDRE", initiate_sequence: "DÉMARRER",
      sectors_of: "SECTEURS {name}", nodes_count: "{d}/{t} nœuds", cleared: "VALIDÉ",

      sector: "SECTEUR", begin_first: "FORCER LE 1er NŒUD — {title}",
      node_of: "NŒUD {i} sur {t}",
      mission_brief: "BRIEFING DE MISSION", threat: "MENACE",
      output_stdout: "SORTIE // stdout", diagnostics: "DIAGNOSTICS // vecteur de test",
      execute: "▸ EXÉCUTER", running: "EN COURS", booting: "DÉMARRAGE…",
      reset: "RÉINIT.", hint: "INDICE", solution: "SOLUTION", next: "SUIVANT ▸",
      awaiting: "en attente d'exécution…", no_test: "aucun vecteur de test pour ce nœud",
      no_output: "(aucune sortie)", pass: "VALIDE",
      run_press: "// appuyez sur EXÉCUTER pour lancer votre code dans le noyau",
      booting_kernel: "// démarrage du noyau {name}…",
      node_cleared: "◈ NŒUD VALIDÉ", next_node: "NŒUD SUIVANT ▸",
      enter_sector: "ENTRER DANS LE SECTEUR {code} ▸", back_to: "▸ RETOUR À {name}",
      xp_acquired: "gagnés", xp_logged: "déjà enregistré",
      track_mastered: "██ PARCOURS {name} MAÎTRISÉ ██",
      toast_cleared: "NŒUD VALIDÉ · +{xp} XP", toast_wiped: "MÉMOIRE EFFACÉE",
      decrypted_hint: "INDICE DÉCRYPTÉ", reference_solution: "SOLUTION DE RÉFÉRENCE",
      load_solution: "⇩ CHARGER DANS L'ÉDITEUR",
      confirm_solution: "Révéler la solution de référence ? Essayez d'abord de la trouver vous-même.",
      confirm_wipe: "EFFACER toute la progression, l'XP et le code sauvegardé de TOUS les langages dans ce navigateur ? (Votre code de profil est conservé ; si la synchro cloud est activée, la progression cloud sera refusionnée.)",
      kernel_ready: "// noyau en ligne — appuyez sur EXÉCUTER",
      kernel_fail: "ÉCHEC DE CHARGEMENT DU NOYAU :: {err}",
      kernel_fail_hint: "Ce langage a besoin d'internet à la première utilisation pour charger son moteur. Vérifiez votre connexion et réouvrez ce nœud.",

      settings_title: "PARAMÈTRES", s_language: "LANGUE", s_audio: "AUDIO",
      s_music: "Musique", s_music_vol: "Volume musique", s_sfx_vol: "Volume effets",
      s_mute: "Tout couper", s_motion: "Réduire les animations",
      s_music_src: "Source musicale", s_generative: "Jungle générative ☕",
      s_your_files: "Vos fichiers", s_load_files: "↑ Charger des fichiers audio",
      s_clear_files: "revenir au génératif", s_loaded: "{n} piste(s) chargée(s)",
      english: "English", french: "Français",

      sync_title: "SYNCHRO DU PROFIL",
    },
  },
};
window.t = function (key, vars) {
  var I = window.I18N, d = I.dict[I.lang] || I.dict.en;
  var s = key in d ? d[key] : (I.dict.en[key] !== undefined ? I.dict.en[key] : key);
  if (vars) for (var k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
};
