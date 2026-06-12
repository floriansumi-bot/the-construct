/* ============================================================
   app.js — THE CONSTRUCT (multi-language).
   Boot, language select, per-track router, lazy per-language
   runtimes, progress/XP, and the live exercise workspace.
   ============================================================ */
(function () {
  "use strict";

  /* ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     DONATIONS — the ☕ support button sends visitors to this Ko-fi page.
     Set it to YOUR Ko-fi handle, e.g. "https://ko-fi.com/florian".
     This single value is served to every visitor, so it is the link
     everyone donates to. (An optional per-device override lives in
     Settings, but THIS constant is what ships to the public.)
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */
  const DONATE_URL = "https://ko-fi.com/";   // ← put your Ko-fi handle after the slash

  /* ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     ADS / GO-AD-FREE — the free app shows a tasteful in-content ad slot.
     • ADFREE_URL  : checkout link for the "remove ads" product (falls back
                     to your Ko-fi link if left blank).
     • ADFREE_CODE : the unlock code buyers receive (e.g. set it as Ko-fi's
                     post-purchase message). Empty = code unlock disabled.
                     Shared-code MVP — see notes; per-buyer license keys
                     (Lemon Squeezy) are the upgrade path.
     • AD_NETWORK  : leave null for in-house ads; later drop in a privacy-
                     first network (EthicalAds / Carbon) — no cookie banner.
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */
  const ADFREE_URL = "https://theconstruct.lemonsqueezy.com/checkout/buy/dd141ed4-4645-435b-9df8-d71598d09ea1";  // Lemon Squeezy ad-free checkout
  const ADFREE_CODE = "";     // ← unlock code given to buyers (optional)
  const EA_PUBLISHER = "";    // ← EthicalAds publisher id (set after approval → real, privacy-first ads). Empty = in-house ads.

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ---------- localized lesson content (FR overlay, EN fallback) ----------
     French lesson text lives in window.CONTENT_FR (js/content-fr.js), keyed by
     track id -> { track:{...}, modules:{id:{...}}, exercises:{id:{...}} } and
     merged onto each object as `_fr` at start(). Lx(obj,field) returns the FR
     string when French is active AND present, otherwise the English original —
     so partial translation is always safe. */
  function frActive() { return !!(window.I18N && window.I18N.lang === "fr"); }
  function Lx(obj, field) {
    if (frActive() && obj && obj._fr && obj._fr[field] != null && obj._fr[field] !== "") return obj._fr[field];
    return obj ? obj[field] : "";
  }
  function applyContentOverlay() {
    const C = window.CONTENT_FR; if (!C || !window.TRACKS) return;
    window.TRACKS.forEach(function (tr) {
      const ov = C[tr.id]; if (!ov) return;
      if (ov.track) tr._fr = ov.track;
      (tr.modules || []).forEach(function (m) {
        if (ov.modules && ov.modules[m.id]) m._fr = ov.modules[m.id];
        (m.exercises || []).forEach(function (ex) {
          if (ov.exercises && ov.exercises[ex.id]) ex._fr = ov.exercises[ex.id];
        });
      });
    });
  }

  /* ---------- markdown-lite ---------- */
  function inlineMd(s) {
    const codes = [];
    s = s.replace(/`([^`]+)`/g, function (m, c) { codes.push(c); return "@@C" + (codes.length - 1) + "C@@"; });
    s = escapeHtml(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/@@C(\d+)C@@/g, function (m, i) { return "<code>" + escapeHtml(codes[+i]) + "</code>"; });
    return s;
  }
  function mdToHtml(md) {
    const lines = String(md == null ? "" : md).replace(/\r/g, "").replace(/^\n+/, "").split("\n");
    let html = "", i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const fence = line.match(/^\s*(`{3}|~{3})\s*([\w+-]*)/);
      if (fence) {
        const mark = fence[1][0] === "~" ? "~~~" : "```";
        const lang = fence[2] || "plaintext";
        const buf = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith(mark)) { buf.push(lines[i]); i++; }
        i++;
        html += '<pre class="codeblock language-' + lang + '"><code class="language-' + lang + '">' + escapeHtml(buf.join("\n")) + "</code></pre>";
        continue;
      }
      if (/^### /.test(line)) { html += "<h3>" + inlineMd(line.slice(4)) + "</h3>"; i++; continue; }
      if (/^## /.test(line)) { html += "<h2>" + inlineMd(line.slice(3)) + "</h2>"; i++; continue; }
      if (/^> /.test(line)) {
        const buf = []; let warn = false;
        while (i < lines.length && /^>/.test(lines[i])) { let t = lines[i].replace(/^>\s?/, ""); if (/^\[!warn\]/i.test(t)) { warn = true; t = t.replace(/^\[!warn\]\s*/i, ""); } buf.push(t); i++; }
        html += '<div class="callout' + (warn ? " warn" : "") + '"><span class="tag">' + (warn ? "⚠ WARNING" : "▸ INTEL") + "</span>" + inlineMd(buf.join(" ")) + "</div>";
        continue;
      }
      if (/^[-*] /.test(line)) { const buf = []; while (i < lines.length && /^[-*] /.test(lines[i])) { buf.push("<li>" + inlineMd(lines[i].slice(2)) + "</li>"); i++; } html += "<ul>" + buf.join("") + "</ul>"; continue; }
      if (/^\d+\. /.test(line)) { const buf = []; while (i < lines.length && /^\d+\. /.test(lines[i])) { buf.push("<li>" + inlineMd(lines[i].replace(/^\d+\.\s/, "")) + "</li>"); i++; } html += "<ol>" + buf.join("") + "</ol>"; continue; }
      if (line.trim() === "") { i++; continue; }
      const buf = [line]; i++;
      while (i < lines.length && lines[i].trim() !== "" && !/^(#{2,3} |> |\s*(?:`{3}|~{3})|[-*] |\d+\. )/.test(lines[i])) { buf.push(lines[i]); i++; }
      html += "<p>" + inlineMd(buf.join(" ")) + "</p>";
    }
    return html;
  }
  function highlightIn(root) { if (!window.Prism) return; root.querySelectorAll('code[class*="language-"]').forEach((c) => { try { Prism.highlightElement(c); } catch (e) {} }); }

  /* ---------- persistence (per-track) ---------- */
  const LS_KEY = "construct.save.v2";
  let SAVE = {};
  try { SAVE = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { SAVE = {}; }
  SAVE.tracks = SAVE.tracks || {};
  SAVE.settings = SAVE.settings || { mute: false };
  SAVE.lastTrack = SAVE.lastTrack || null;
  // migrate v1 (python-only flat save) if present
  try {
    const old = JSON.parse(localStorage.getItem("construct.save.v1"));
    if (old && old.done && !SAVE.tracks.python) {
      SAVE.tracks.python = { done: old.done, code: old.code || {}, open: old.openSectors || {}, last: old.lastLesson || null };
    }
  } catch (e) {}
  function genCode() {
    var abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", bytes = null;
    try { bytes = crypto.getRandomValues(new Uint8Array(12)); } catch (e) {}
    var s = "";
    for (var i = 0; i < 12; i++) { var r = bytes ? bytes[i] : Math.floor(Math.random() * 256); s += abc[r % abc.length]; if (i % 4 === 3 && i < 11) s += "-"; }
    return s;
  }
  SAVE.profile = SAVE.profile || { code: genCode() };
  SAVE.updatedAt = SAVE.updatedAt || 0;
  function persistRaw() { try { localStorage.setItem(LS_KEY, JSON.stringify(SAVE)); } catch (e) {} }
  function persist() { SAVE.updatedAt = Date.now(); persistRaw(); scheduleSync(); }
  function ts(id) { if (!SAVE.tracks[id]) SAVE.tracks[id] = { done: {}, code: {}, open: {}, last: null }; return SAVE.tracks[id]; }
  // cloud sync is deployed — default it on so progress follows your profile code
  var DEFAULT_SYNC_URL = "https://construct-sync.florian-sumi.workers.dev";
  if (!SAVE.settings.syncUrl) SAVE.settings.syncUrl = DEFAULT_SYNC_URL;
  if (SAVE.settings.autoSync === undefined) SAVE.settings.autoSync = true;
  if (SAVE.settings.lang === undefined) SAVE.settings.lang = "en";
  if (SAVE.settings.sfxVol === undefined) SAVE.settings.sfxVol = 0.6;
  if (SAVE.settings.musicVol === undefined) SAVE.settings.musicVol = 0.4;
  if (SAVE.settings.musicOn === undefined) SAVE.settings.musicOn = true;
  if (SAVE.settings.theme === undefined) SAVE.settings.theme = "matrix";
  if (window.I18N) I18N.set(SAVE.settings.lang);
  if (window.Snd) Snd.init({ sfxVol: SAVE.settings.sfxVol, musicVol: SAVE.settings.musicVol, muted: !!SAVE.settings.mute, musicOn: SAVE.settings.musicOn });
  document.body.classList.toggle("no-motion", !!SAVE.settings.motion);
  persistRaw(); // persist profile code + sync/audio/language defaults

  /* ---------- cross-device profile sync ---------- */
  // Progress is monotonic (a cleared node stays cleared), so merging is a
  // safe union — no destructive conflicts across devices.
  function mergeSaves(a, b) {
    a = a || {}; b = b || {};
    var au = a.updatedAt || 0, bu = b.updatedAt || 0;
    var out = {
      tracks: {}, lastTrack: (au >= bu ? a.lastTrack : b.lastTrack) || a.lastTrack || b.lastTrack || null,
      updatedAt: Math.max(au, bu),
      adFree: !!(a.adFree || b.adFree),                     // entitlement is sticky once earned
      license: a.license || b.license || null,
    };
    var ids = {};
    Object.keys(a.tracks || {}).forEach(function (k) { ids[k] = 1; });
    Object.keys(b.tracks || {}).forEach(function (k) { ids[k] = 1; });
    Object.keys(ids).forEach(function (id) {
      var ta = (a.tracks && a.tracks[id]) || { done: {}, code: {}, open: {}, last: null };
      var tb = (b.tracks && b.tracks[id]) || { done: {}, code: {}, open: {}, last: null };
      var newer = au >= bu ? ta : tb, older = au >= bu ? tb : ta;
      // code: newer side wins per-key, but a blank value must never erase saved code
      var code = Object.assign({}, older.code), ncode = newer.code || {};
      Object.keys(ncode).forEach(function (k) { var nv = ncode[k]; if ((nv == null || (typeof nv === "string" && nv.trim() === "")) && code[k]) return; code[k] = nv; });
      out.tracks[id] = {
        done: Object.assign({}, ta.done, tb.done),          // union of cleared nodes
        code: code,
        open: Object.assign({}, ta.open, tb.open),
        last: newer.last || older.last || null,
      };
    });
    return out;
  }
  function applyMerged(merged) {
    SAVE.tracks = merged.tracks || {};
    SAVE.lastTrack = merged.lastTrack || SAVE.lastTrack;
    SAVE.updatedAt = Math.max(SAVE.updatedAt || 0, merged.updatedAt || 0);
    // ad-free entitlement + license follow the profile across devices/backups
    if (merged.adFree) SAVE.settings.adFree = true;
    if (merged.license && SAVE.profile && !SAVE.profile.license) SAVE.profile.license = merged.license;
    persistRaw();
    if (merged.adFree) mountAd();
  }
  function localSnapshot() { return { tracks: SAVE.tracks, lastTrack: SAVE.lastTrack, updatedAt: SAVE.updatedAt, adFree: !!(SAVE.settings && SAVE.settings.adFree), license: (SAVE.profile && SAVE.profile.license) || null }; }
  function syncConfigured() { return !!(SAVE.settings.syncUrl && SAVE.profile && SAVE.profile.code); }
  function syncUrlFor() { var u = (SAVE.settings.syncUrl || "").trim(); return u + (u.indexOf("?") >= 0 ? "&" : "?") + "code=" + encodeURIComponent(SAVE.profile.code); }

  async function cloudPull() {
    if (!syncConfigured()) throw new Error("set a sync URL first");
    var res = await fetch(syncUrlFor(), { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("pull failed (" + res.status + ")");
    var data; try { data = await res.json(); } catch (e) { return null; } // tolerate a non-JSON / HTML error page
    return data && data.save ? data.save : null;
  }
  async function cloudPush() {
    if (!syncConfigured()) throw new Error("set a sync URL first");
    // POST with a default text/plain body is a "simple" CORS request: no preflight,
    // and POST is never blocked by proxies that 405 a PUT. The worker parses the JSON body.
    var res = await fetch(syncUrlFor(), { method: "POST", body: JSON.stringify({ save: localSnapshot() }) });
    if (!res.ok) throw new Error("push failed (" + res.status + ")");
    return true;
  }
  var _syncing = false, _syncTimer = null;
  async function cloudSync() {
    if (_syncing) return "busy"; _syncing = true;
    try {
      var remote = await cloudPull();
      if (remote) { applyMerged(mergeSaves(localSnapshot(), remote)); var t = currentTrackObj(); updateHud(t); renderSidebar(t); }
      await cloudPush();
      return "ok";
    } finally { _syncing = false; }
  }
  function scheduleSync() {
    if (!(SAVE.settings.autoSync && syncConfigured())) return;
    if (_syncTimer) clearTimeout(_syncTimer);
    _syncTimer = setTimeout(function () { cloudSync().catch(function () {}); }, 2500);
  }

  /* ---------- manual export / import ---------- */
  function exportCode() { return "CONSTRUCT1:" + btoa(unescape(encodeURIComponent(JSON.stringify(localSnapshot())))); }
  function importCode(str) {
    str = (str || "").trim(); var i = str.indexOf("CONSTRUCT1:"); if (i >= 0) str = str.slice(i + 11);
    var data = JSON.parse(decodeURIComponent(escape(atob(str))));
    if (!data.tracks) data = { tracks: data, updatedAt: Date.now() };
    applyMerged(mergeSaves(localSnapshot(), data));
    route();
  }
  function copyText(t) {
    try { navigator.clipboard.writeText(t); } catch (e) {
      var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {} ta.remove();
    }
  }
  function downloadText(name, text) {
    var b = new Blob([text], { type: "text/plain" }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  }
  function currentTrackObj() { var p = parseHash(); return p.length ? findTrack(p[0]) : null; }

  /* ---------- track / curriculum helpers ---------- */
  const TRACKS = () => window.TRACKS || [];
  const findTrack = (id) => (window.TRACKS || []).find((t) => t.id === id) || null;
  const findModuleIn = (track, mid) => track.modules.find((m) => m.id === mid) || null;
  function moduleProgress(track, m) { const d = m.exercises.filter((e) => ts(track.id).done[e.id]).length; const t = m.exercises.length; return { d, t, pct: t ? Math.round((d / t) * 100) : 0, done: t > 0 && d === t }; }
  function trackProgress(track) {
    let dEx = 0, tEx = 0, dSec = 0;
    track.modules.forEach((m) => { const p = moduleProgress(track, m); dEx += p.d; tEx += p.t; if (p.done) dSec++; });
    return { dEx, tEx, dSec, tSec: track.modules.length, pct: tEx ? Math.round((dEx / tEx) * 100) : 0 };
  }
  function trackXp(track) { let x = 0; track.modules.forEach((m) => m.exercises.forEach((e) => { if (ts(track.id).done[e.id]) x += e.xp || 100; })); return x; }
  function globalXp() { let x = 0; TRACKS().forEach((t) => (x += trackXp(t))); return x; }
  function globalDone() { let d = 0; TRACKS().forEach((t) => (d += trackProgress(t).dEx)); return d; }
  function globalTotal() { let t = 0; TRACKS().forEach((tr) => (t += trackProgress(tr).tEx)); return t; }

  const LEVELS = [
    { min: 0, t: "TRESPASSER" }, { min: 400, t: "SCRIPT KIDDIE" }, { min: 900, t: "INITIATE" },
    { min: 1600, t: "OPERATOR" }, { min: 2600, t: "NETRUNNER" }, { min: 4000, t: "ICE BREAKER" },
    { min: 6000, t: "GHOST" }, { min: 8500, t: "DAEMON" }, { min: 12000, t: "ARCHITECT" },
  ];
  function levelFor(xp) { let idx = 0; LEVELS.forEach((l, i) => { if (xp >= l.min) idx = i; }); return { level: idx, title: LEVELS[idx].t, next: LEVELS[idx + 1] || null, base: LEVELS[idx].min }; }

  function updateHud(track) {
    const xp = globalXp(), lv = levelFor(xp);
    let sectorsStr;
    if (track) { const pr = trackProgress(track); sectorsStr = pr.dSec + "/" + pr.tSec; }
    else { let ds = 0, tsec = 0; TRACKS().forEach((tr) => { const p = trackProgress(tr); ds += p.dSec; tsec += p.tSec; }); sectorsStr = ds + "/" + tsec; }
    const lines = document.querySelectorAll("#topbar .hud-line");
    if (lines[0]) lines[0].innerHTML = t("access_lvl") + ' <b id="hud-level">' + lv.level + '</b> · <span id="hud-title" class="accent">' + escapeHtml(lv.title) + "</span>";
    if (lines[1]) lines[1].innerHTML = '<span id="hud-xp">' + xp + "</span> " + t("xp_label") + " · " + t("sectors") + ' <span id="hud-sectors">' + sectorsStr + "</span>";
    const span = lv.next ? lv.next.min - lv.base : 1;
    const pct = lv.next ? Math.round(((xp - lv.base) / span) * 100) : 100;
    $("hud-xp-fill").style.width = Math.max(3, Math.min(100, pct)) + "%";
    const sub = document.querySelector(".brand-sub");
    if (sub) sub.textContent = track ? t("brand_sub_track", { name: track.name }) : t("brand_sub_poly");
  }

  /* ---------- audio + toast ---------- */
  let actx;
  function beep(freq, dur) { if (SAVE.settings.mute) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.type = "square"; o.frequency.value = freq || 660; g.gain.value = 0.04; o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + (dur || 0.08)); } catch (e) {} }
  function toast(msg, bad) { const t = el("div", "toast" + (bad ? " bad" : ""), escapeHtml(msg)); document.body.appendChild(t); setTimeout(() => { t.style.transition = "opacity .4s"; t.style.opacity = "0"; }, 1500); setTimeout(() => t.remove(), 2000); }

  /* ---------- editor ---------- */
  function makeEditor(textarea, initial, mode, onChange) {
    if (window.CodeMirror) {
      const cm = CodeMirror.fromTextArea(textarea, {
        mode: mode || "python", lineNumbers: true, indentUnit: 2, tabSize: 2, indentWithTabs: false,
        autoCloseBrackets: true, matchBrackets: true, lineWrapping: false, theme: "default", styleActiveLine: true,
        extraKeys: { "Ctrl-Enter": () => { const b = $("btn-run"); if (b) b.click(); }, "Cmd-Enter": () => { const b = $("btn-run"); if (b) b.click(); }, Tab: (cm2) => cm2.replaceSelection("  ") },
      });
      cm.setValue(initial);
      if (onChange) cm.on("change", () => onChange());
      setTimeout(() => cm.refresh(), 30);
      return { get: () => cm.getValue(), set: (v) => cm.setValue(v), focus: () => cm.focus(), destroy: () => { try { cm.toTextArea(); } catch (e) {} } };
    }
    textarea.value = initial; textarea.classList.add("fallback-editor");
    if (onChange) textarea.addEventListener("input", () => onChange());
    return { get: () => textarea.value, set: (v) => { textarea.value = v; }, focus: () => textarea.focus(), destroy: () => {} };
  }

  /* ---------- runtime lazy init ---------- */
  function ensureRuntime(track, onLog) {
    const rt = (window.Runtimes || {})[track.runtime];
    if (!rt) return Promise.reject(new Error("No runtime registered for '" + track.runtime + "'."));
    if (rt.ready) return Promise.resolve(rt);
    if (!rt._initPromise) {
      rt._initPromise = Promise.resolve(rt.init(onLog)).then(() => { rt.ready = true; return rt; }).catch((e) => { rt._initPromise = null; throw e; });
    }
    return rt._initPromise;
  }
  function editorModeFor(track) { if (track.editorMode) return track.editorMode; const rt = (window.Runtimes || {})[track.runtime]; return (rt && rt.editorMode) || "python"; }
  function runtimeTag(track) { const rt = (window.Runtimes || {})[track.runtime]; return (rt && rt.tag) || ""; }

  /* ---------- router ---------- */
  let _activeEditor = null;   // current CodeMirror wrapper, torn down on navigation
  let _exGen = 0;             // render token: stale async callbacks bail when it changes
  const parseHash = () => location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const go = (path) => { location.hash = "#/" + path; };
  function setDrawer(open) {
    const sb = $("sidebar"), bd = $("nav-backdrop");
    if (sb) sb.classList.toggle("open", open);
    if (bd) bd.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
  }
  function route() {
    if (_activeEditor) { try { _activeEditor.destroy(); } catch (e) {} _activeEditor = null; }
    setDrawer(false);
    const p = parseHash();
    if (p.length === 0) { renderSidebar(null); renderLangSelect(); updateHud(null); mountAd(); $("main").scrollTop = 0; return; }
    const track = findTrack(p[0]);
    if (!track) { location.hash = "#/"; return; }
    SAVE.lastTrack = track.id; persist();
    renderSidebar(track);
    if (p.length === 1) renderTrackDashboard(track);
    else {
      const m = findModuleIn(track, p[1]);
      if (!m) renderTrackDashboard(track);
      else if (p.length === 2) renderTheory(track, m);
      else { const ex = m.exercises.find((e) => e.id === p[2]); ex ? renderExercise(track, m, ex) : renderTheory(track, m); }
    }
    updateHud(track); mountAd(); $("main").scrollTop = 0;
  }

  /* ---------- sidebar ---------- */
  function renderSidebar(track) {
    const p = parseHash();
    const sb = $("sidebar"); sb.innerHTML = "";
    const home = el("div", "sector");
    const hh = el("div", "sector-head" + (!track ? " open" : ""));
    hh.innerHTML = '<span class="ix">◀</span><span class="nm">' + t("all_languages") + "</span>";
    hh.onclick = () => go("");
    home.appendChild(hh); sb.appendChild(home);

    if (!track) {
      TRACKS().forEach((t) => {
        const pr = trackProgress(t);
        const it = el("div", "lesson");
        it.innerHTML = '<span class="mark" style="color:' + (t.accent || "var(--green)") + '">◆</span><span class="lt">' + escapeHtml(t.name) + '</span><span class="xp">' + pr.dEx + "/" + pr.tEx + "</span>";
        it.onclick = () => go(t.id);
        sb.appendChild(it);
      });
      return;
    }

    const banner = el("div", "sidebar-track");
    banner.innerHTML = '<span style="color:' + (track.accent || "var(--green)") + '">●</span> ' + escapeHtml(track.name) + ' <span class="dim">· ' + escapeHtml(runtimeTag(track)) + "</span>";
    sb.appendChild(banner);
    const curMod = p[1], curEx = p[2];
    track.modules.forEach((m) => {
      const pr = moduleProgress(track, m);
      const open = ts(track.id).open[m.id] || curMod === m.id;
      const sec = el("div", "sector");
      const head = el("div", "sector-head" + (open ? " open" : "") + (pr.done ? " done" : ""));
      head.innerHTML = '<span class="chev">▶</span><span class="ix">' + m.code + '</span><span class="nm">' + escapeHtml(m.title) + '</span><span class="pct">' + pr.d + "/" + pr.t + "</span>";
      head.onclick = () => { ts(track.id).open[m.id] = !open; persist(); renderSidebar(track); };
      sec.appendChild(head);
      if (open) {
        const ls = el("div", "lessons");
        const th = el("div", "lesson theory" + (curMod === m.id && !curEx ? " active" : ""));
        th.innerHTML = '<span class="mark">◈</span><span class="lt">' + t("theory_brief") + "</span>";
        th.onclick = () => go(track.id + "/" + m.id);
        ls.appendChild(th);
        m.exercises.forEach((ex, ei) => {
          const done = !!ts(track.id).done[ex.id];
          const li = el("div", "lesson" + (done ? " done" : "") + (curMod === m.id && curEx === ex.id ? " active" : ""));
          li.innerHTML = '<span class="mark">' + (done ? "✔" : ei + 1) + '</span><span class="lt">' + escapeHtml(Lx(ex, "title")) + '</span><span class="xp">+' + (ex.xp || 100) + "</span>";
          li.onclick = () => go(track.id + "/" + m.id + "/" + ex.id);
          ls.appendChild(li);
        });
        sec.appendChild(ls);
      }
      sb.appendChild(sec);
    });
  }

  /* ---------- language select ---------- */
  function renderLangSelect() {
    const xp = globalXp(), lv = levelFor(xp);
    const m = $("main");
    let cards = "";
    TRACKS().forEach((tk) => {
      const pr = trackProgress(tk);
      cards += '<div class="track-card lang" data-id="' + tk.id + '" style="--acc:' + (tk.accent || "var(--green)") + '">' +
        '<div class="lang-bar"></div>' +
        (tk.id === "python" ? '<div class="start-here">' + t("start_here") + "</div>" : "") +
        '<div class="ix">' + escapeHtml(runtimeTag(tk)) + "</div>" +
        "<h3>" + escapeHtml(tk.name) + "</h3>" +
        "<p>" + escapeHtml(tk.blurb || "") + "</p>" +
        '<div class="meter"><i style="width:' + pr.pct + "%;background:" + (tk.accent || "var(--green)") + '"></i></div>' +
        '<div class="foot"><span>' + t("nodes_count", { d: pr.dEx, t: pr.tEx }) + "</span><span>" + (pr.pct === 100 ? "✔ " + t("mastered") : pr.pct + "%") + "</span></div></div>";
    });
    m.innerHTML =
      '<div class="dash-hero"><h1>' + t("select_language") + "</h1>" +
      "<p>" + t("lang_blurb") + "</p>" +
      '<p class="ls-hint">▸ ' + t("ls_new_hint") + "</p>" +
      '<div class="stats">' +
        '<div class="stat"><div class="v">' + globalDone() + '</div><div class="k">' + t("nodes_cleared") + "</div></div>" +
        '<div class="stat"><div class="v">' + TRACKS().length + '</div><div class="k">' + t("languages") + "</div></div>" +
        '<div class="stat"><div class="v">' + xp + '</div><div class="k">' + t("total_xp") + "</div></div>" +
        '<div class="stat"><div class="v">' + lv.level + '</div><div class="k">' + t("access") + " · " + escapeHtml(lv.title) + "</div></div>" +
      "</div></div>" +
      '<div class="dash-grid">' + cards + "</div>";
    m.querySelectorAll(".track-card.lang").forEach((c) => { c.onclick = () => go(c.getAttribute("data-id")); });
  }

  /* ---------- track dashboard ---------- */
  function renderTrackDashboard(track) {
    const tsv = ts(track.id); const last = tsv.last;
    const pr = trackProgress(track);
    const m = $("main");
    let cards = "";
    track.modules.forEach((mod) => {
      const mp = moduleProgress(track, mod);
      cards += '<div class="track-card" data-go="' + track.id + "/" + mod.id + '">' +
        '<div class="ix">' + t("sector") + " " + mod.code + "</div><h3>" + escapeHtml(Lx(mod, "title")) + "</h3>" +
        "<p>" + escapeHtml(Lx(mod, "subtitle") || "") + "</p>" +
        '<div class="meter"><i style="width:' + mp.pct + "%;background:" + (track.accent || "var(--green)") + '"></i></div>' +
        '<div class="foot"><span>' + t("nodes_count", { d: mp.d, t: mp.t }) + "</span><span>" + (mp.done ? "✔ " + t("cleared") : mp.pct + "%") + "</span></div></div>";
    });
    m.innerHTML =
      '<div class="crumbs">// <b>' + escapeHtml(track.name) + "</b> · " + escapeHtml(runtimeTag(track)) + "</div>" +
      '<div class="dash-hero" style="border-color:' + (track.accent || "#00ff9c") + '44">' +
      "<h1>" + t("uplink", { name: escapeHtml(track.name) }) + "</h1>" +
      "<p>" + escapeHtml(Lx(track, "intro") || Lx(track, "blurb") || "") + "</p>" +
      '<div class="stats">' +
        '<div class="stat"><div class="v">' + pr.dEx + '</div><div class="k">' + t("nodes_cleared") + "</div></div>" +
        '<div class="stat"><div class="v">' + pr.tEx + '</div><div class="k">' + t("total_nodes") + "</div></div>" +
        '<div class="stat"><div class="v">' + trackXp(track) + '</div><div class="k">' + escapeHtml(track.name) + " XP</div></div>" +
        '<div class="stat"><div class="v">' + pr.pct + '%</div><div class="k">' + t("complete") + "</div></div>" +
      "</div>" +
      '<div style="margin-top:18px"><button class="btn" id="resume">▸ ' + (last ? t("resume_uplink") : t("initiate_sequence")) + "</button></div></div>" +
      '<div class="page-sub">// ' + t("sectors_of", { name: escapeHtml(track.name) }) + "</div>" +
      '<div class="dash-grid">' + cards + "</div>";
    m.querySelectorAll("[data-go]").forEach((c) => { c.onclick = () => go(c.getAttribute("data-go")); });
    $("resume").onclick = () => { last ? (location.hash = "#/" + last) : go(track.id + "/" + track.modules[0].id); };
  }

  /* ---------- theory ---------- */
  function renderTheory(track, m) {
    ts(track.id).last = track.id + "/" + m.id; persist();
    const first = m.exercises[0];
    const main = $("main");
    main.innerHTML =
      '<div class="crumbs">// <b>' + escapeHtml(track.name) + "</b> / " + t("sector") + " <b>" + m.code + "</b> · " + escapeHtml(Lx(m, "title")) + "</div>" +
      '<div class="page-title">' + escapeHtml(Lx(m, "title")) + "</div>" +
      '<div class="page-sub">' + escapeHtml(Lx(m, "subtitle") || "") + "</div>" +
      '<article class="theory">' + mdToHtml(Lx(m, "theory")) + "</article>" +
      '<div class="theory-actions">' + (first ? '<button class="btn" id="begin">▸ ' + t("begin_first", { title: escapeHtml(Lx(first, "title")) }) + "</button>" : "") + "</div>";
    highlightIn(main);
    if (first) $("begin").onclick = () => go(track.id + "/" + m.id + "/" + first.id);
  }

  /* ---------- exercise workspace ---------- */
  function renderExercise(track, m, ex) {
    const myGen = ++_exGen;   // any async work from a previous node is now stale
    ts(track.id).last = track.id + "/" + m.id + "/" + ex.id; persist();
    const idx = m.exercises.indexOf(ex);
    const saved = ts(track.id).code[ex.id] != null ? ts(track.id).code[ex.id] : ex.starter;
    const diff = ex.difficulty || 1;
    const main = $("main");
    main.innerHTML =
      '<div class="crumbs">// <b>' + escapeHtml(track.name) + "</b> / " + escapeHtml(Lx(m, "title")) + " / " + t("node_of", { i: idx + 1, t: m.exercises.length }) + "</div>" +
      '<div class="ex-wrap"><section class="brief-card"><div class="brief-head"><span>▌ ' + t("mission_brief") + '</span><span class="diff">' + t("threat") + " " + "◆".repeat(diff) + "◇".repeat(Math.max(0, 3 - diff)) + "</span></div>" +
      '<div class="brief-body"><h1>' + escapeHtml(Lx(ex, "title")) + "</h1>" +
      '<div class="mission">' + escapeHtml(Lx(ex, "brief") || "") + "</div>" + mdToHtml(Lx(ex, "prompt")) +
      (ex.lore ? '<div class="lore">' + escapeHtml(Lx(ex, "lore")) + "</div>" : "") + "</div></section>" +
      '<section class="lab"><div class="editor-shell"><div class="editor-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
      '<span class="fname">~/construct/' + track.id + "/" + ex.id + "." + (track.ext || "txt") + '</span><span class="spacer"></span><span class="kbdhint">Ctrl+↵ run</span></div>' +
      '<textarea id="cm-area"></textarea></div>' +
      '<div class="lab-actions"><button class="btn" id="btn-run" disabled>' + t("booting") + "</button>" +
      '<button class="btn subtle sm" id="btn-reset-ex">' + t("reset") + '</button><button class="btn subtle sm" id="btn-hint">' + t("hint") + "</button>" +
      '<button class="btn subtle sm" id="btn-sol">' + t("solution") + '</button><span class="spacer"></span>' +
      (idx + 1 < m.exercises.length ? '<button class="btn alt sm" id="btn-next">' + t("next") + "</button>" : "") + "</div>" +
      '<div id="hint-slot"></div>' +
      '<div class="panel"><div class="panel-head"><span>▌ ' + t("output_stdout") + '</span><span class="dim">' + escapeHtml(runtimeTag(track)) + '</span></div><div class="console" id="console"><span class="muted">' + t("booting_kernel", { name: escapeHtml(track.name) }) + "</span></div></div>" +
      '<div class="panel results"><div class="panel-head"><span>▌ ' + t("diagnostics") + '</span><span class="dim" id="res-count"></span></div><div id="results"><div class="empty">' + t("awaiting") + "</div></div></div>" +
      '<div id="cleared-slot"></div></section></div>';
    highlightIn(main);

    let editor;
    let _synTimer = null;
    function _onEdit() {
      if (myGen !== _exGen) return;
      if (!window.Companion || !Companion.isOpen() || Companion.isBusy()) return;
      clearTimeout(_synTimer);
      _synTimer = setTimeout(async () => {
        try {
          const code = editor.get();
          const rt = (window.Runtimes || {})[track.runtime];
          let ok = true;
          if (rt && rt.checkSyntax) { const r = await rt.checkSyntax(code); ok = !!(r && r.ok); }
          else ok = Companion.balanced(code);
          Companion.glitch(!ok);
        } catch (e) {}
      }, 450);
    }
    editor = makeEditor($("cm-area"), saved, editorModeFor(track), _onEdit);
    _activeEditor = editor;
    const consoleEl = $("console"), resultsEl = $("results"), resCount = $("res-count");
    const clearedSlot = $("cleared-slot"), runBtn = $("btn-run"), hintSlot = $("hint-slot");

    function cClear() { consoleEl.innerHTML = ""; }
    function cAdd(text, cls) { const s = el("div", cls || ""); s.textContent = text; consoleEl.appendChild(s); consoleEl.scrollTop = consoleEl.scrollHeight; }
    function cRaw(text) { const s = document.createElement("span"); s.textContent = text; consoleEl.appendChild(s); consoleEl.scrollTop = consoleEl.scrollHeight; }
    function renderResults(g) {
      resultsEl.innerHTML = "";
      if (!g.results || !g.results.length) { resultsEl.innerHTML = '<div class="empty">' + t("no_test") + "</div>"; return; }
      g.results.forEach((r) => {
        const row = el("div", "row " + (r.ok ? "pass" : "fail"));
        row.innerHTML = '<span class="ic">' + (r.ok ? "✔" : "✘") + '</span><span class="nm">' + escapeHtml(r.name) + "</span>";
        if (!r.ok && r.msg) { const mm = el("div", "msg"); mm.textContent = r.msg; row.appendChild(mm); }
        resultsEl.appendChild(row);
      });
      resCount.textContent = g.passed + "/" + g.total + " " + t("pass");
      resCount.style.color = g.all_ok ? "var(--green)" : "var(--amber)";
    }

    // boot the runtime for this track
    cClear(); cAdd(t("loading_lang", { name: track.name }), "sys");
    ensureRuntime(track, (msg, c) => { if (myGen === _exGen) cAdd("> " + msg, c === "ok" ? "" : "sys"); }).then(() => {
      if (myGen !== _exGen) return;
      cClear(); cAdd(t("kernel_ready"), "muted");
      runBtn.disabled = false; runBtn.textContent = t("execute");
    }).catch((e) => {
      if (myGen !== _exGen) return;
      cClear(); cAdd(t("kernel_fail", { err: (e && e.message ? e.message : e) }), "err");
      cAdd(t("kernel_fail_hint"), "muted");
    });

    async function doRun() {
      const rt = (window.Runtimes || {})[track.runtime];
      if (!rt || !rt.ready) { cAdd(t("kernel_wait"), "muted"); return; }
      const code = editor.get();
      ts(track.id).code[ex.id] = code; persist();
      runBtn.disabled = true; runBtn.classList.add("running-dots"); runBtn.textContent = t("running") + " ";
      cClear(); cAdd("> " + t("exec_payload"), "sys");
      try {
        const disp = await rt.runDisplay(code, ex);
        if (myGen !== _exGen) return;
        cClear();
        if (disp.stdout) cRaw(disp.stdout);
        if (disp.error) cAdd(disp.error, "err");
        if (!disp.stdout && !disp.error) cAdd(t("no_output"), "muted");
        const g = await rt.grade(code, ex);
        if (myGen !== _exGen) return;
        renderResults(g);
        if (g.all_ok) onSolved(track, m, ex, clearedSlot);
        else { clearedSlot.innerHTML = ""; if (window.Snd) Snd.sfx("error"); }
      } catch (e) { if (myGen !== _exGen) return; cClear(); cAdd(t("kernel_fault") + " :: " + (e && e.message ? e.message : e), "err"); }
      finally { runBtn.disabled = false; runBtn.classList.remove("running-dots"); runBtn.textContent = t("execute"); }
    }
    runBtn.onclick = doRun;

    $("btn-reset-ex").onclick = () => {
      editor.set(ex.starter); delete ts(track.id).code[ex.id]; persist(); editor.focus();
      resultsEl.innerHTML = '<div class="empty">' + t("awaiting") + "</div>"; resCount.textContent = "";
      clearedSlot.innerHTML = ""; hintSlot.innerHTML = ""; hintSlot.dataset.open = "0"; hintSlot.dataset.kind = "";
    };
    $("btn-hint").onclick = () => {
      if (hintSlot.dataset.open === "1" && hintSlot.dataset.kind === "hint") { hintSlot.innerHTML = ""; hintSlot.dataset.open = "0"; hintSlot.dataset.kind = ""; return; }
      hintSlot.innerHTML = '<div class="hintbox"><span class="tag">▸ ' + t("decrypted_hint") + "</span>" + mdToHtml(Lx(ex, "hint") || t("no_hint")) + "</div>";
      highlightIn(hintSlot); hintSlot.dataset.open = "1"; hintSlot.dataset.kind = "hint";
    };
    $("btn-sol").onclick = () => {
      if (!confirm(t("confirm_solution"))) return;
      hintSlot.innerHTML = '<div class="hintbox solbox"><span class="tag">▸ ' + t("reference_solution") + '</span><pre class="codeblock language-' + (track.prism || "plaintext") + '"><code class="language-' + (track.prism || "plaintext") + '">' + escapeHtml(ex.solution || "# (none)") + '</code></pre><button class="btn subtle sm" id="load-sol">' + t("load_solution") + "</button></div>";
      highlightIn(hintSlot); hintSlot.dataset.open = "1"; hintSlot.dataset.kind = "sol";
      const ls = $("load-sol"); if (ls) ls.onclick = () => { editor.set(ex.solution || ""); editor.focus(); };
    };
    const nb = $("btn-next"); if (nb) nb.onclick = () => go(track.id + "/" + m.id + "/" + m.exercises[idx + 1].id);
  }

  function onSolved(track, m, ex, slot) {
    const already = !!ts(track.id).done[ex.id];
    if (!already) { ts(track.id).done[ex.id] = true; persist(); }
    updateHud(track); renderSidebar(track);
    const idx = m.exercises.indexOf(ex);
    let nextTarget = null, label = "";
    if (idx + 1 < m.exercises.length) { nextTarget = track.id + "/" + m.id + "/" + m.exercises[idx + 1].id; label = t("next_node"); }
    else { const mi = track.modules.indexOf(m); if (mi + 1 < track.modules.length) { const nm = track.modules[mi + 1]; nextTarget = track.id + "/" + nm.id; label = t("enter_sector", { code: nm.code }); } }
    const trackDone = trackProgress(track).dEx === trackProgress(track).tEx;
    slot.innerHTML = '<div class="cleared"><h3>' + t("node_cleared") + '</h3><div class="xpwin">+' + (ex.xp || 100) + " XP · " + (already ? t("xp_logged") : t("xp_acquired")) + "</div>" +
      (trackDone ? '<div class="xpwin" style="margin-top:6px;color:var(--green)">' + t("track_mastered", { name: escapeHtml(track.name) }) + "</div>" : "") +
      '<div class="nextbtn"><button class="btn ' + (nextTarget ? "alt " : "") + 'sm" id="cl-next">' + (nextTarget ? label : "▸ " + t("back_to", { name: escapeHtml(track.name) })) + "</button></div></div>";
    const b = $("cl-next"); if (b) b.onclick = () => { nextTarget ? (location.hash = "#/" + nextTarget) : go(track.id); };
    if (window.Companion) Companion.victory();
    if (!already) { toast(t("toast_cleared", { xp: (ex.xp || 100) })); }
  }

  /* ---------- modal / help ---------- */
  function openHelp() {
    $("modal-body").innerHTML =
      "<h2>▌ " + t("help_title") + "</h2><p>" + t("help_intro") + "</p>" +
      "<h3>" + t("help_engines_h") + "</h3><ul><li>" + t("help_engine_py") + "</li><li>" + t("help_engine_js") + "</li><li>" + t("help_engine_sql") + "</li><li>" + t("help_engine_lua") + "</li><li>" + t("help_engine_ruby") + "</li></ul>" +
      "<h3>" + t("help_train_h") + "</h3><ul><li>" + t("help_train_1") + "</li><li>" + t("help_train_2") + "</li><li>" + t("help_train_3") + "</li><li>" + t("help_train_4") + "</li></ul>" +
      "<h3>" + t("help_notes_h") + "</h3><ul><li>" + t("help_notes_1") + "</li><li>" + t("help_notes_2") + "</li></ul>" +
      '<h3>' + t("help_config_h") + '</h3><p><label><input type="checkbox" id="mute-box"' + (SAVE.settings.mute ? " checked" : "") + "> " + t("help_mute") + "</label></p><p class='dim'>" + t("help_credits") + "</p>";
    $("modal").hidden = false;
    const mb = $("mute-box"); if (mb) mb.onchange = () => { SAVE.settings.mute = mb.checked; persist(); if (window.Snd) Snd.setMuted(SAVE.settings.mute); };
  }
  function closeHelp() { $("modal").hidden = true; }

  /* ---------- donations (Ko-fi) ---------- */
  function donateUrl() { var u = (SAVE.settings && SAVE.settings.donateUrl) || DONATE_URL; return String(u || "").trim(); }
  function donateReady() { return /^https?:\/\/[^\/]+\/.+/.test(donateUrl()); } // has a real handle/path
  function openDonate() {
    var ready = donateReady(), url = donateUrl();
    $("modal-body").innerHTML =
      "<h2>▌ " + t("donate_title") + "</h2>" +
      "<p>" + t("donate_body") + "</p>" +
      '<div class="donate-wrap">' +
        (ready
          ? '<a class="donate-cta" id="donate-go" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">☕ ' + t("donate_cta") + "</a>"
          : '<div class="callout warn"><span class="tag">⚠</span> ' + t("donate_soon") + "</div>") +
      "</div>" +
      '<p class="dim">' + t("donate_note") + "</p>";
    $("modal").hidden = false;
    var g = $("donate-go");
    if (g) g.onclick = function () { if (window.Snd) Snd.sfx("open"); };
  }

  /* ---------- fullscreen ---------- */
  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null; }
  function fsSupported() { var el = document.documentElement; return !!(el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen); }
  function toggleFullscreen() {
    try {
      if (!fsEl()) {
        var el = document.documentElement;
        var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (req) { var p = req.call(el); if (p && p.catch) p.catch(function () {}); }
      } else {
        var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (exit) { var q = exit.call(document); if (q && q.catch) q.catch(function () {}); }
      }
    } catch (e) {}
  }
  function updateFsBtn() {
    var b = $("btn-fullscreen"); if (!b) return;
    var on = !!fsEl();
    b.classList.toggle("active", on);
    b.title = t(on ? "tt_unfullscreen" : "tt_fullscreen");
  }

  /* ---------- ads + go-ad-free ---------- */
  function isAdFree() { return !!(SAVE.settings && SAVE.settings.adFree); }
  function setAdFree(on) { SAVE.settings.adFree = !!on; persist(); mountAd(); }
  // Validate a Lemon Squeezy license key (works against any LS store key; no
  // store secret needed). activate() also enforces the per-product device limit.
  function activateLicense(key) {
    var inst = (SAVE.profile && SAVE.profile.code) || "construct";
    return fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: "license_key=" + encodeURIComponent(key) + "&instance_name=" + encodeURIComponent(inst),
    }).then(function (r) { return r.json(); });
  }
  function unlockAdFree(code) {
    code = String(code || "").trim();
    if (!code) return Promise.resolve({ ok: false });
    // optional manual comp code (press / giveaways)
    if (ADFREE_CODE && code.toUpperCase() === String(ADFREE_CODE).toUpperCase()) return Promise.resolve({ ok: true });
    // otherwise treat it as a Lemon Squeezy license key
    return activateLicense(code).then(function (data) {
      if (data && (data.activated === true || data.valid === true)) return { ok: true, key: code };
      var msg = (data && data.error) ? String(data.error) : "";
      if (/activ/i.test(msg) && /(limit|reach|maxim)/i.test(msg)) return { ok: false, msg: t("adfree_maxdevices") };
      return { ok: false, msg: t("adfree_bad") };
    }).catch(function () { return { ok: false, msg: t("adfree_neterr") }; });
  }
  function adFreeUrl() { var u = (SAVE.settings && SAVE.settings.adFreeUrl) || ADFREE_URL || donateUrl(); return String(u || "").trim(); }
  function adFreeReady() { return /^https?:\/\/[^\/]+\/.+/.test(adFreeUrl()); }
  let _adIx = 0;
  function houseAds() {
    return [
      { title: t("ad_house1_t"), sub: t("ad_house1_s"), url: donateReady() ? donateUrl() : "#adfree" },
      { title: t("ad_house2_t"), sub: t("ad_house2_s"), url: "#adfree" },
    ];
  }
  function houseAdHtml() {
    var ads = houseAds(); var ad = ads[_adIx % ads.length]; _adIx++;
    return '<span class="ad-tag">AD</span>' +
      '<a class="ad-body" href="' + escapeHtml(ad.url) + '" target="_blank" rel="noopener"><b>' + escapeHtml(ad.title) + '</b> <span class="ad-sub">' + escapeHtml(ad.sub) + "</span></a>";
  }
  function removeBtnHtml() { return '<button class="ad-x" type="button">' + t("ad_remove") + " ✕</button>"; }
  function wireAdSlot(bar) {
    var x = bar.querySelector(".ad-x"); if (x) x.onclick = openAdFree;
    var body = bar.querySelector(".ad-body");
    if (body) body.onclick = function (e) { if (body.getAttribute("href") === "#adfree") { e.preventDefault(); openAdFree(); } };
  }
  function injectEAScript() {
    if (document.getElementById("ea-script")) return;
    var s = document.createElement("script"); s.id = "ea-script"; s.async = true;
    s.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
    document.head.appendChild(s);
  }
  function loadEA(tries) {
    if (window.ethicalads && typeof window.ethicalads.load === "function") { try { window.ethicalads.load(); } catch (e) {} return; }
    if (tries > 0) setTimeout(function () { loadEA(tries - 1); }, 400);
  }
  function mountAd() {
    var main = $("main"); if (!main) return;
    var old = main.querySelector(".ad-slot"); if (old) old.remove();
    if (isAdFree()) return;
    var bar = el("div", "ad-slot");
    if (EA_PUBLISHER) {
      bar.classList.add("ad-ea");
      bar.innerHTML = '<div class="ea-slot dark" data-ea-publisher="' + escapeHtml(EA_PUBLISHER) + '" data-ea-type="text"></div>' + removeBtnHtml();
      main.insertBefore(bar, main.firstChild);
      wireAdSlot(bar);
      injectEAScript(); loadEA(10);
      // If EthicalAds doesn't fill the slot (no inventory / not yet approved), show a house ad instead.
      setTimeout(function () {
        var slot = bar.querySelector(".ea-slot");
        if (bar.parentNode && slot && !slot.children.length && !(slot.textContent || "").trim()) {
          bar.classList.remove("ad-ea");
          bar.innerHTML = houseAdHtml() + removeBtnHtml();
          wireAdSlot(bar);
        }
      }, 3000);
    } else {
      bar.innerHTML = houseAdHtml() + removeBtnHtml();
      main.insertBefore(bar, main.firstChild);
      wireAdSlot(bar);
    }
  }
  function openAdFree() {
    var url = adFreeUrl(), ready = adFreeReady(), active = isAdFree();
    $("modal-body").innerHTML =
      "<h2>▌ " + t("adfree_title") + "</h2>" +
      "<p>" + t("adfree_body") + "</p>" +
      (active
        ? '<div class="callout"><span class="tag">✓</span> ' + t("adfree_active") + "</div>"
        : '<div class="donate-wrap">' +
            (ready
              ? '<a class="donate-cta" id="adfree-go" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">✦ ' + t("adfree_cta") + "</a>"
              : '<div class="callout warn"><span class="tag">⚠</span> ' + t("adfree_soon") + "</div>") +
          "</div>" +
          '<div class="sync-sec"><h3>' + t("adfree_have_code") + "</h3>" +
          '<div class="codebox"><input type="text" id="adfree-code" placeholder="' + t("adfree_code_ph") + '" style="flex:1 1 150px;width:auto"><button class="btn alt sm" id="adfree-apply">' + t("adfree_unlock") + "</button></div>" +
          '<div class="sync-status" id="adfree-status"></div></div>') +
      '<p class="dim">' + t("adfree_note") + "</p>";
    $("modal").hidden = false;
    var ap = $("adfree-apply");
    if (ap) ap.onclick = function () {
      var v = (($("adfree-code") || {}).value || "").trim();
      var st = $("adfree-status");
      if (!v) return;
      if (st) { st.textContent = t("adfree_checking"); st.className = "sync-status"; }
      ap.disabled = true;
      unlockAdFree(v).then(function (r) {
        ap.disabled = false;
        if (r && r.ok) {
          if (r.key && SAVE.profile) SAVE.profile.license = r.key;
          setAdFree(true);
          if (st) { st.textContent = t("adfree_ok"); st.className = "sync-status ok"; }
          if (window.Snd) Snd.sfx("victory");
          setTimeout(function () { if (!$("modal").hidden && $("adfree-status")) closeHelp(); }, 1200);
        } else {
          if (st) { st.textContent = (r && r.msg) ? r.msg : t("adfree_bad"); st.className = "sync-status bad"; }
        }
      });
    };
  }

  function openSettings() {
    var s = SAVE.settings;
    var pct = function (v) { return Math.round((v || 0) * 100); };
    $("modal-body").innerHTML =
      "<h2>▌ " + t("settings_title") + "</h2>" +
      '<div class="sync-sec"><h3>' + t("s_language") + '</h3><div class="codebox">' +
      '<button class="btn ' + (s.lang !== "fr" ? "" : "subtle ") + 'sm" id="lang-en">' + t("english") + "</button>" +
      '<button class="btn ' + (s.lang === "fr" ? "" : "subtle ") + 'sm" id="lang-fr">' + t("french") + "</button></div></div>" +
      '<div class="sync-sec"><h3>' + t("s_style") + '</h3><div class="codebox">' +
      '<button class="btn ' + (s.theme !== "synthwave" && s.theme !== "amber" ? "" : "subtle ") + 'sm theme-opt" data-theme="matrix"><span class="theme-sw" style="background:#00ff9c"></span>MATRIX</button>' +
      '<button class="btn ' + (s.theme === "synthwave" ? "" : "subtle ") + 'sm theme-opt" data-theme="synthwave"><span class="theme-sw" style="background:#ff4dd2"></span>SYNTHWAVE</button>' +
      '<button class="btn ' + (s.theme === "amber" ? "" : "subtle ") + 'sm theme-opt" data-theme="amber"><span class="theme-sw" style="background:#ffb000"></span>AMBER</button></div></div>' +
      '<div class="sync-sec"><h3>' + t("s_ads") + '</h3><div class="codebox">' +
      '<span class="dim" style="flex:1 1 auto">' + (isAdFree() ? "✓ " + t("adfree_active") : t("ads_on")) + "</span>" +
      '<button class="btn alt sm" id="set-adfree">' + (isAdFree() ? t("adfree_manage") : t("adfree_cta")) + "</button></div></div>" +
      '<div class="sync-sec"><h3>' + t("s_audio") + "</h3>" +
      '<div class="set-row"><label><input type="checkbox" id="set-mute"' + (s.mute ? " checked" : "") + "> " + t("s_mute") + "</label></div>" +
      '<div class="set-row"><label><input type="checkbox" id="set-musicon"' + (s.musicOn ? " checked" : "") + "> " + t("s_music") + "</label></div>" +
      '<div class="set-row"><span class="set-lbl">' + t("s_music_vol") + '</span><input type="range" id="set-musicvol" min="0" max="100" value="' + pct(s.musicVol) + '"><span class="set-val" id="mv-val">' + pct(s.musicVol) + "</span></div>" +
      '<div class="set-row"><span class="set-lbl">' + t("s_sfx_vol") + '</span><input type="range" id="set-sfxvol" min="0" max="100" value="' + pct(s.sfxVol) + '"><span class="set-val" id="sv-val">' + pct(s.sfxVol) + "</span></div>" +
      '<div class="set-row"><span class="set-lbl">' + t("s_music_src") + '</span><span class="dim" id="src-state">' + (window.Snd && Snd.hasUserTracks() ? t("s_your_files") : t("s_generative")) + "</span></div>" +
      '<div class="codebox"><label class="btn subtle sm" for="set-files" style="cursor:pointer">' + t("s_load_files") + '</label><input id="set-files" type="file" accept="audio/*" multiple style="display:none"><button class="btn subtle sm" id="set-gen">' + t("s_clear_files") + "</button></div>" +
      '<div class="sync-status" id="set-filestatus"></div>' +
      '<div class="set-row"><label><input type="checkbox" id="set-motion"' + (s.motion ? " checked" : "") + "> " + t("s_motion") + "</label></div></div>";
    $("modal").hidden = false;
    document.querySelectorAll(".theme-opt").forEach(function (b) { b.onclick = function () { applyTheme(b.getAttribute("data-theme")); openSettings(); }; });
    $("lang-en").onclick = function () { setLang("en"); openSettings(); };
    $("lang-fr").onclick = function () { setLang("fr"); openSettings(); };
    if ($("set-adfree")) $("set-adfree").onclick = function () { openAdFree(); };
    $("set-mute").onchange = function () { s.mute = this.checked; persistRaw(); if (window.Snd) Snd.setMuted(s.mute); };
    $("set-musicon").onchange = function () { s.musicOn = this.checked; persistRaw(); if (window.Snd) Snd.setMusicOn(s.musicOn); };
    $("set-musicvol").oninput = function () { var v = +this.value; $("mv-val").textContent = v; s.musicVol = v / 100; persistRaw(); if (window.Snd) Snd.setMusicVol(s.musicVol); };
    $("set-sfxvol").oninput = function () { var v = +this.value; $("sv-val").textContent = v; s.sfxVol = v / 100; persistRaw(); if (window.Snd) Snd.setSfxVol(s.sfxVol); };
    $("set-sfxvol").onchange = function () { if (window.Snd) Snd.sfx("click"); };
    $("set-files").onchange = function () { var f = this.files; if (window.Snd) Snd.loadFiles(f, function (n) { $("set-filestatus").textContent = t("s_loaded", { n: n }); var ss = $("src-state"); if (ss) ss.textContent = t("s_your_files"); }); };
    $("set-gen").onclick = function () { if (window.Snd) Snd.clearUserTracks(); var ss = $("src-state"); if (ss) ss.textContent = t("s_generative"); $("set-filestatus").textContent = ""; };
    $("set-motion").onchange = function () { s.motion = this.checked; persistRaw(); document.body.classList.toggle("no-motion", s.motion); };
  }
  function localizeChrome() {
    var map = { "btn-buddy": "tt_buddy", "btn-sync": "tt_sync", "btn-settings": "tt_settings", "btn-help": "tt_help", "btn-reset": "tt_wipe", "btn-menu": "tt_menu", "btn-donate": "tt_donate" };
    for (var id in map) { var e = $(id); if (e) e.title = t(map[id]); }
    var bs = $("btn-sync"); if (bs) bs.textContent = t("btn_sync");
    updateFsBtn();
  }
  function setLang(l) { SAVE.settings.lang = l; persistRaw(); if (window.I18N) I18N.set(l); localizeChrome(); route(); }
  function localizeBoot() {
    var jin = $("jack-in"); if (jin) jin.textContent = t("jack_in");
    var tag = $("boot-tag"); if (tag) tag.textContent = t("boot_tag");
    var lbl = $("boot-lang-label"); if (lbl) lbl.textContent = t("boot_lang");
    var en = $("boot-en"), fr = $("boot-fr");
    if (en) en.classList.toggle("active", (window.I18N ? I18N.lang : "en") === "en");
    if (fr) fr.classList.toggle("active", (window.I18N ? I18N.lang : "en") === "fr");
  }
  function setBootLang(l) { SAVE.settings.lang = l; persistRaw(); if (window.I18N) I18N.set(l); localizeBoot(); localizeChrome(); }
  function applyTheme(theme) {
    theme = (theme === "synthwave" || theme === "amber") ? theme : "matrix";
    SAVE.settings.theme = theme; persistRaw();
    document.body.classList.remove("theme-synthwave", "theme-amber");
    if (theme !== "matrix") document.body.classList.add("theme-" + theme);
    if (window.Companion && Companion.refreshTheme) Companion.refreshTheme();
  }

  function openSync() {
    var code = SAVE.profile.code;
    function st(id, msg, cls) { var e = $(id); if (e) { e.textContent = msg; e.className = "sync-status" + (cls ? " " + cls : ""); } }
    $("modal-body").innerHTML =
      "<h2>▌ " + t("sync_title") + "</h2>" +
      "<p>" + t("sync_intro") + "</p>" +
      '<div class="sync-sec"><h3>' + t("sync_s1_h") + '</h3><p class="dim">' + t("sync_s1_p") + "</p>" +
      '<div class="codebox"><span class="code" id="pcode">' + escapeHtml(code) + "</span>" +
      '<button class="btn subtle sm" id="copy-code">' + t("sync_copy") + '</button><button class="btn subtle sm" id="regen-code">' + t("sync_new") + "</button></div>" +
      '<div class="codebox"><input type="text" id="link-code" placeholder="' + t("sync_link_ph") + '" style="flex:1 1 150px;width:auto"><button class="btn alt sm" id="link-btn">' + t("sync_link") + "</button></div></div>" +
      '<div class="sync-sec"><h3>' + t("sync_s2_h") + ' <span class="dim">— ' + t("sync_s2_ready") + '</span></h3>' +
      '<p class="dim">' + t("sync_s2_p") + "</p>" +
      '<input type="text" id="sync-url" placeholder="https://your-worker.workers.dev" value="' + escapeHtml(SAVE.settings.syncUrl || "") + '">' +
      '<div class="codebox"><label><input type="checkbox" id="auto-sync"' + (SAVE.settings.autoSync ? " checked" : "") + "> " + t("sync_auto") + "</label>" +
      '<button class="btn alt sm" id="sync-now">' + t("sync_now_btn") + '</button></div><div class="sync-status" id="sync-status"></div></div>' +
      '<div class="sync-sec"><h3>' + t("sync_s3_h") + '</h3><p class="dim">' + t("sync_s3_p") + "</p>" +
      '<div class="codebox"><button class="btn subtle sm" id="exp-copy">' + t("sync_exp_copy") + '</button><button class="btn subtle sm" id="exp-file">' + t("sync_exp_file") + "</button></div>" +
      '<textarea class="sync-import" id="imp-text" placeholder="' + t("sync_imp_ph") + '"></textarea>' +
      '<div class="codebox"><button class="btn subtle sm" id="imp-apply">' + t("sync_imp_apply") + "</button>" +
      '<label class="btn subtle sm" for="imp-file" style="cursor:pointer">' + t("sync_imp_file") + "</label>" +
      '<input id="imp-file" type="file" accept=".construct,.json,.txt" style="display:none"></div>' +
      '<div class="sync-status" id="imp-status"></div></div>';
    $("modal").hidden = false;
    $("copy-code").onclick = function () { copyText((($("pcode") || {}).textContent) || code); st("sync-status", t("sync_msg_copied"), "ok"); };
    $("link-btn").onclick = function () {
      var v = $("link-code").value.trim();
      if (v.length < 6) { st("sync-status", t("sync_msg_badcode"), "bad"); return; }
      SAVE.profile.code = v; persistRaw();
      var pc = $("pcode"); if (pc) pc.textContent = v;
      st("sync-status", t("sync_msg_linking"), "");
      cloudSync().then(function () { st("sync-status", t("sync_msg_linked"), "ok"); updateHud(currentTrackObj()); renderSidebar(currentTrackObj()); }).catch(function (e) { st("sync-status", t("sync_msg_fail", { err: (e && e.message ? e.message : e) }), "bad"); });
    };
    $("regen-code").onclick = function () { if (!confirm(t("sync_confirm_regen"))) return; SAVE.profile.code = genCode(); persistRaw(); openSync(); };
    $("sync-url").onchange = function () { SAVE.settings.syncUrl = this.value.trim(); persistRaw(); };
    $("auto-sync").onchange = function () { SAVE.settings.autoSync = this.checked; persistRaw(); };
    $("sync-now").onclick = function () { SAVE.settings.syncUrl = $("sync-url").value.trim(); persistRaw(); st("sync-status", t("sync_msg_syncing"), ""); cloudSync().then(function () { st("sync-status", t("sync_msg_synced"), "ok"); }).catch(function (e) { st("sync-status", t("sync_msg_fail", { err: (e && e.message ? e.message : e) }), "bad"); }); };
    $("exp-copy").onclick = function () { copyText(exportCode()); st("imp-status", t("sync_msg_exp_copied"), "ok"); };
    $("exp-file").onclick = function () { downloadText("construct-profile.construct", exportCode()); st("imp-status", t("sync_msg_exp_dl"), "ok"); };
    $("imp-apply").onclick = function () { try { importCode($("imp-text").value); st("imp-status", t("sync_msg_imp_ok"), "ok"); } catch (e) { st("imp-status", t("sync_msg_imp_bad"), "bad"); } };
    $("imp-file").onchange = function () { var f = this.files && this.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { importCode(String(r.result)); st("imp-status", t("sync_msg_imp_ok"), "ok"); } catch (e) { st("imp-status", t("sync_msg_imp_badfile"), "bad"); } }; r.readAsText(f); };
  }

  /* ---------- matrix ---------- */
  function startMatrix(canvas) {
    const ctx = canvas.getContext("2d");
    const chars = "アカサタナハマヤラ0123456789ABCDEF<>[]{}=+*/$#@%&░▒▓".split("");
    let w, h, cols, drops, raf;
    function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; cols = Math.floor(w / 14); drops = new Array(cols).fill(0).map(() => Math.random() * -40); }
    resize(); const onR = () => resize(); window.addEventListener("resize", onR);
    const primary = (getComputedStyle(document.body).getPropertyValue("--green") || "").trim() || "#00ff9c";
    function draw() { ctx.fillStyle = "rgba(2,2,4,0.11)"; ctx.fillRect(0, 0, w, h); ctx.font = "14px monospace"; for (let i = 0; i < cols; i++) { const t = chars[Math.floor(Math.random() * chars.length)]; ctx.fillStyle = Math.random() > 0.975 ? "#eafff5" : primary; ctx.fillText(t, i * 14, drops[i] * 16); if (drops[i] * 16 > h && Math.random() > 0.975) drops[i] = 0; else drops[i]++; } raf = requestAnimationFrame(draw); }
    if (!reducedMotion()) draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
  }

  /* ---------- boot (framework only) ---------- */
  async function boot() {
    const logEl = $("boot-log"), fill = $("boot-bar-fill");
    applyTheme(SAVE.settings.theme);
    const stopMatrix = startMatrix($("matrix"));
    function line(text, cls) { const d = el("div", cls); d.textContent = text; logEl.appendChild(d); logEl.scrollTop = logEl.scrollHeight; }
    const scripted = [
      ["> establishing uplink to THE CONSTRUCT…", "dim"],
      ["> handshake OK :: node 0xDEAD:BEEF", "ok"],
      ["> spoofing MAC 13:37:c0:de:ca:fe", "dim"],
      ["> bypassing ICE … [ TRACE EVADED ]", "warn"],
      ["> mounting polyglot curriculum :: 6 language cores", "dim"],
      ["> language engines: python · javascript · typescript · sql · lua · ruby", "ok"],
      ["> engines load on demand — zero install", "dim"],
    ];
    let p = 0;
    for (const [t, c] of scripted) { line(t, c); p++; fill.style.width = Math.min(100, (p / scripted.length) * 100) + "%"; await sleep(reducedMotion() ? 30 : randInt(110, 260)); }
    line("> ALL SYSTEMS NOMINAL", "ok"); line("> neural link stabilized.", "ok");
    const jin = $("jack-in"); jin.hidden = false; jin.focus();
    // a focused <button> already activates on Enter/Space — no global key handler,
    // so jacking-in can't double-fire and Enter on the EN/FR toggle won't trigger it
    const enter = () => { jin.removeEventListener("click", enter); jackIn(stopMatrix); };
    jin.addEventListener("click", enter);
  }
  function jackIn(stopMatrix) {
    if (window.Snd) { Snd.resume(); Snd.sfx("jackin"); if (SAVE.settings.musicOn) setTimeout(function () { Snd.startMusic(); }, 400); }
    $("boot").style.transition = "opacity .5s"; $("boot").style.opacity = "0";
    setTimeout(() => { $("boot").style.display = "none"; if (stopMatrix) stopMatrix(); }, 520);
    $("app").hidden = false;
    localizeChrome();
    if (window.Companion) Companion.mount({
      getMute: () => SAVE.settings.mute,
      onToggle: (open) => { SAVE.settings.companion = open; persistRaw(); },
      initialOpen: !!SAVE.settings.companion,
    });
    if (!location.hash || location.hash === "#") location.hash = "#/";
    route();
    if (SAVE.settings.autoSync && syncConfigured()) cloudSync().catch(function () {});
  }

  /* ---------- chrome ---------- */
  function wireChrome() {
    window.addEventListener("hashchange", route);
    $("btn-help").onclick = openHelp;
    $("btn-sync").onclick = openSync;
    $("btn-settings").onclick = openSettings;
    if ($("btn-donate")) $("btn-donate").onclick = openDonate;
    var fsb = $("btn-fullscreen");
    if (fsb) {
      if (!fsSupported()) { fsb.style.display = "none"; }
      else {
        fsb.onclick = toggleFullscreen;
        document.addEventListener("fullscreenchange", updateFsBtn);
        document.addEventListener("webkitfullscreenchange", updateFsBtn);
        document.addEventListener("MSFullscreenChange", updateFsBtn);
        updateFsBtn();
      }
    }
    $("btn-buddy").onclick = () => { if (window.Companion) Companion.toggle(); };
    if ($("boot-en")) $("boot-en").onclick = () => setBootLang("en");
    if ($("boot-fr")) $("boot-fr").onclick = () => setBootLang("fr");
    // one delegated listener gives every control its futuristic blip
    document.addEventListener("pointerdown", function (e) {
      if (!window.Snd) return;
      var b = e.target.closest("button, .lesson, .sector-head, .track-card");
      if (!b) return;
      Snd.resume();
      var id = b.id || "";
      if (id === "jack-in") return;
      if (id === "btn-settings" || id === "btn-sync" || id === "btn-help" || id === "btn-donate") Snd.sfx("open");
      else if (id === "modal-close" || b.classList.contains("companion-x")) Snd.sfx("close");
      else if (id === "btn-run") Snd.sfx("execute");
      else if (id === "btn-reset") Snd.sfx("wipe");
      else if (b.classList.contains("track-card") || b.classList.contains("lesson") || b.classList.contains("sector-head")) Snd.sfx("nav");
      else Snd.sfx("click");
    }, true);
    $("btn-menu").onclick = () => setDrawer(!$("sidebar").classList.contains("open"));
    $("nav-backdrop").onclick = () => setDrawer(false);
    $("btn-reset").onclick = () => {
      if (!confirm(t("confirm_wipe"))) return;
      SAVE = { tracks: {}, settings: SAVE.settings, lastTrack: null, profile: SAVE.profile, updatedAt: Date.now() };
      persistRaw(); toast(t("toast_wiped")); go(""); route();
    };
    $("modal-close").onclick = closeHelp;
    $("modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeHelp(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("modal").hidden) closeHelp(); });
  }
  function start() {
    applyTheme(SAVE.settings.theme);
    if (!window.TRACKS || !window.TRACKS.length) {
      // recoverable, localized fatal state — keep the boot-language toggle live + offer reload
      if ($("boot-en")) $("boot-en").onclick = function () { setBootLang("en"); };
      if ($("boot-fr")) $("boot-fr").onclick = function () { setBootLang("fr"); };
      localizeBoot();
      var be = $("boot-error");
      if (be) { be.hidden = false; be.innerHTML = "<div>" + escapeHtml(t("fatal_no_tracks")) + '</div><button type="button" id="boot-reload">' + t("retry") + "</button>"; var rl = $("boot-reload"); if (rl) rl.onclick = function () { location.reload(); }; }
      else { $("boot-log").innerHTML = '<div class="crit">' + escapeHtml(t("fatal_no_tracks")) + "</div>"; }
      return;
    }
    // order each section as a difficulty ladder (stable: keeps authored order within a tier)
    window.TRACKS.forEach(function (t) { t.modules.forEach(function (m) { m.exercises.sort(function (a, b) { return (a.difficulty || 1) - (b.difficulty || 1); }); }); });
    applyContentOverlay();
    wireChrome(); localizeBoot(); boot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
