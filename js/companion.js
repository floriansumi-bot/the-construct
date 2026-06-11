/* ============================================================
   companion.js — PROTO.EXE, a pixel-art helper buddy.
   - idle: bobs / blinks
   - glitch: RGB-split corruption while your code has syntax errors
   - victory: blasts Space-Invaders enemies with his arm cannon
   - retro WebAudio SFX for glitches + combat (honors mute)
   Exposes window.Companion. Draggable + closable.
   ============================================================ */
(function () {
  "use strict";

  /* ---- sprites (char grid) ---- */
  var HERO = [
    "                ",
    "    DDDDDDDD    ",
    "   DHHHHHHHHD   ",
    "   DHHHHHHHHD   ",
    "   DHVVVVVVHD   ",
    "   DHVVVVVVHD   ",
    "   DHHHHHHHHD   ",
    "    DDHHHHDD    ",
    "  DDDHHHHHHDDD  ",
    " CCDHHHHHHHHDD  ",
    " CCDHHHHHHHHD   ",
    "  DDHHHHHHHHD   ",
    "   DHHHHHHHHD   ",
    "   DHHDDDDHHD   ",
    "   DHHD  DHHD   ",
    "   DDD    DDD   ",
  ];
  var HPAL = { D: "#063b2c", H: "#00ff9c", V: "#25e1ff", C: "#eafff5" };
  var INVADER = [
    "  X     X  ",
    "   X   X   ",
    "  XXXXXXX  ",
    " XX XXX XX ",
    "XXXXXXXXXXX",
    "X XXXXXXX X",
    "X X     X X",
    "   XX XX   ",
  ];
  var IPAL = { X: "#ff2e88" };

  function drawSprite(ctx, map, pal, x, y, s) {
    for (var r = 0; r < map.length; r++) { var row = map[r]; for (var c = 0; c < row.length; c++) { var col = pal[row[c]]; if (!col) continue; ctx.fillStyle = col; ctx.fillRect(x + c * s, y + r * s, s, s); } }
  }
  function drawTint(ctx, map, x, y, s, color, alpha) {
    ctx.globalAlpha = alpha; ctx.fillStyle = color;
    for (var r = 0; r < map.length; r++) { var row = map[r]; for (var c = 0; c < row.length; c++) { if (row[c] === " ") continue; ctx.fillRect(x + c * s, y + r * s, s, s); } }
    ctx.globalAlpha = 1;
  }

  var W = 160, H = 140, HS = 3, IS = 2;
  var heroX = Math.round((W - 16 * HS) / 2), heroY = H - 16 * HS - 6;

  /* ---- audio ---- */
  var actx = null;
  function ac() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } } return actx; }
  function muted() { return Companion._getMute ? Companion._getMute() : false; }
  function tone(freq, dur, type, vol, slideTo) {
    if (muted()) return; var a = ac(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain(); o.type = type || "square"; o.frequency.setValueAtTime(freq, a.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), a.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.05, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur + 0.02);
  }
  function noise(dur, vol, lp) {
    if (muted()) return; var a = ac(); if (!a) return;
    var n = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var src = a.createBufferSource(); src.buffer = buf; var g = a.createGain(); g.gain.value = vol || 0.06;
    var f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp || 1800;
    src.connect(f); f.connect(g); g.connect(a.destination); src.start();
  }
  var lastGlitchSfx = 0;
  function sfxGlitch(ts) { if (ts - lastGlitchSfx < 170) return; lastGlitchSfx = ts; if (window.Snd) Snd.sfx("glitch"); }
  function sfxShoot() { if (window.Snd) Snd.sfx("shoot"); }
  function sfxExplode() { if (window.Snd) Snd.sfx("explode"); }
  function sfxVictory() { if (window.Snd) Snd.sfx("victory"); }

  /* ---- state ---- */
  var el = null, canvas = null, ctx = null, statusEl = null, raf = null, lastTs = 0;
  var state = "idle", glitchOn = false, vClock = 0, fireTimer = 0;
  var invaders = [], proj = null, booms = [];

  function setStatus(txt, cls) { if (statusEl) { statusEl.textContent = txt; statusEl.className = "companion-status" + (cls ? " " + cls : ""); } }

  function startVictory() {
    state = "victory"; vClock = 0; fireTimer = 0; proj = null; booms = [];
    update._won = false; winUntil = 0;
    invaders = [{ x: 20, alive: true }, { x: 69, alive: true }, { x: 118, alive: true }];
    setStatus("TARGETS ACQUIRED", "fight");
  }
  function update(dt, ts) {
    if (state === "glitch" && glitchOn) { sfxGlitch(ts); }
    if (state !== "victory") return;
    vClock += dt;
    // bob invaders
    var iy = 14 + Math.sin(vClock / 180) * 3;
    for (var k = 0; k < invaders.length; k++) invaders[k].y = iy;
    // fire cadence
    fireTimer += dt;
    var alive = invaders.filter(function (i) { return i.alive; });
    if (!proj && alive.length && fireTimer > 430) {
      fireTimer = 0; var tgt = alive[0];
      proj = { x: heroX + 5, y: heroY + 6, tx: tgt.x + 11 * IS / 2, target: tgt, age: 0 };
      // aim x toward target gradually handled in move
      sfxShoot();
    }
    if (proj) {
      proj.age += dt; proj.y -= dt * 0.32; proj.x += (proj.tx - proj.x) * Math.min(1, dt * 0.02);
      if (proj.y <= (proj.target.y || 16) + 8) {
        proj.target.alive = false; booms.push({ x: proj.target.x + 8, y: (proj.target.y || 16) + 8, age: 0 }); sfxExplode(); proj = null;
      }
    }
    for (var b = booms.length - 1; b >= 0; b--) { booms[b].age += dt; if (booms[b].age > 260) booms.splice(b, 1); }
    if (!invaders.some(function (i) { return i.alive; }) && !booms.length) {
      if (vClock > 0 && state === "victory") { // win flourish
        if (!update._won) { update._won = true; sfxVictory(); setStatus("AREA CLEARED ✓", "win"); winUntil = vClock + 1100; }
        if (vClock > winUntil) { update._won = false; state = glitchOn ? "glitch" : "idle"; setStatus(glitchOn ? "⚠ SYNTAX FAULT" : "STATUS: ONLINE", glitchOn ? "fault" : ""); }
      }
    }
    if (vClock > 6000) { update._won = false; state = glitchOn ? "glitch" : "idle"; }
  }
  var winUntil = 0;

  function bg(ts) {
    ctx.fillStyle = "#04100b"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    for (var y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
    ctx.strokeStyle = "rgba(0,255,156,0.15)"; ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  }
  function render(ts) {
    bg(ts);
    if (state === "victory") {
      for (var k = 0; k < invaders.length; k++) { var iv = invaders[k]; if (iv.alive) drawSprite(ctx, INVADER, IPAL, Math.round(iv.x), Math.round(iv.y || 14), IS); }
      for (var b = 0; b < booms.length; b++) { var bb = booms[b], rad = 2 + bb.age / 18; ctx.fillStyle = (bb.age % 60 < 30) ? "#ffb300" : "#eafff5"; for (var p = 0; p < 8; p++) { var ang = p / 8 * Math.PI * 2; ctx.fillRect(Math.round(bb.x + Math.cos(ang) * rad), Math.round(bb.y + Math.sin(ang) * rad), 2, 2); } }
      if (proj) { ctx.fillStyle = "#eafff5"; ctx.fillRect(Math.round(proj.x), Math.round(proj.y), 2, 5); ctx.fillStyle = "#25e1ff"; ctx.fillRect(Math.round(proj.x) - 1, Math.round(proj.y) + 2, 4, 3); if (proj.age < 90) { ctx.fillStyle = "#ffb300"; ctx.fillRect(heroX + 2, heroY + 2, 7, 7); } }
      drawSprite(ctx, HERO, HPAL, heroX, heroY, HS);
      return;
    }
    if (state === "glitch") {
      // RGB-split + tears
      var jx = (Math.random() * 4 - 2) | 0, jy = (Math.random() * 2 - 1) | 0;
      drawTint(ctx, HERO, heroX - 3 + jx, heroY + jy, HS, "#ff2e88", 0.6);
      drawTint(ctx, HERO, heroX + 3 + jx, heroY + jy, HS, "#25e1ff", 0.6);
      drawSprite(ctx, HERO, HPAL, heroX + jx, heroY + jy, HS);
      for (var t = 0; t < 3; t++) { var ty = (Math.random() * H) | 0, th = 2 + (Math.random() * 6 | 0), tx = (Math.random() * 20 - 10) | 0; ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,46,136,0.5)" : "rgba(37,225,255,0.5)"; ctx.fillRect(tx, ty, W, th); }
      for (var n = 0; n < 6; n++) ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 3, 3);
      return;
    }
    // idle: bob + blink
    var bobY = Math.round(Math.sin(ts / 350) * 2);
    drawSprite(ctx, HERO, HPAL, heroX, heroY + bobY, HS);
    var blink = (Math.floor(ts / 160) % 18 === 0);
    if (blink) { ctx.fillStyle = "#063b2c"; ctx.fillRect(heroX + 4 * HS, heroY + bobY + 4 * HS, 6 * HS, 2 * HS); }
  }
  function loop(ts) {
    if (!Companion.open) { raf = null; return; }
    var dt = lastTs ? Math.min(64, ts - lastTs) : 16; lastTs = ts;
    update(dt, ts); render(ts);
    raf = requestAnimationFrame(loop);
  }
  function ensureLoop() { if (Companion.open && !raf) { lastTs = 0; raf = requestAnimationFrame(loop); } }

  /* ---- dragging ---- */
  function makeDraggable(handle) {
    var sx, sy, ox, oy, dragging = false;
    function down(cx, cy) { var r = el.getBoundingClientRect(); ox = r.left; oy = r.top; sx = cx; sy = cy; dragging = true; el.style.right = "auto"; el.style.bottom = "auto"; el.style.left = ox + "px"; el.style.top = oy + "px"; }
    function move(cx, cy) { if (!dragging) return; var nx = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, ox + cx - sx)), ny = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, oy + cy - sy)); el.style.left = nx + "px"; el.style.top = ny + "px"; }
    function up() { dragging = false; }
    handle.addEventListener("mousedown", function (e) { down(e.clientX, e.clientY); e.preventDefault(); });
    document.addEventListener("mousemove", function (e) { move(e.clientX, e.clientY); });
    document.addEventListener("mouseup", up);
    handle.addEventListener("touchstart", function (e) { var t = e.touches[0]; down(t.clientX, t.clientY); }, { passive: true });
    document.addEventListener("touchmove", function (e) { if (dragging) { var t = e.touches[0]; move(t.clientX, t.clientY); e.preventDefault(); } }, { passive: false });
    document.addEventListener("touchend", up);
  }

  var Companion = {
    open: false,
    mounted: false,
    _getMute: null,
    _onToggle: null,
    mount: function (opts) {
      opts = opts || {};
      this._getMute = opts.getMute || function () { return false; };
      this._onToggle = opts.onToggle || function () {};
      if (this.mounted) return;
      el = document.createElement("div"); el.id = "companion"; el.className = "companion"; el.hidden = true;
      el.innerHTML =
        '<div class="companion-bar"><span class="companion-title">▮ PROTO.EXE</span><span class="companion-spacer"></span><button class="companion-x" title="close" aria-label="close">✕</button></div>' +
        '<canvas class="companion-canvas" width="' + W + '" height="' + H + '"></canvas>' +
        '<div class="companion-status">STATUS: ONLINE</div>';
      document.body.appendChild(el);
      canvas = el.querySelector(".companion-canvas"); ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
      statusEl = el.querySelector(".companion-status");
      el.querySelector(".companion-x").addEventListener("click", function () { Companion.setOpen(false); });
      makeDraggable(el.querySelector(".companion-bar"));
      window.addEventListener("resize", function () { if (Companion.open) Companion.clamp(); });
      this.mounted = true;
      this.setOpen(!!opts.initialOpen);
    },
    setOpen: function (v) {
      if (!this.mounted) return;
      this.open = !!v; el.hidden = !this.open;
      document.body.classList.toggle("companion-open", this.open);
      if (this.open) this.clamp();
      if (this._onToggle) this._onToggle(this.open);
      if (this.open) ensureLoop();
    },
    /* keep the window fully on-screen (after a drag or a viewport resize) */
    clamp: function () {
      if (!el || el.hidden) return;
      if (el.style.left && el.style.left !== "auto") {
        var maxL = Math.max(0, window.innerWidth - el.offsetWidth), maxT = Math.max(0, window.innerHeight - el.offsetHeight);
        el.style.left = Math.max(0, Math.min(parseFloat(el.style.left) || 0, maxL)) + "px";
        el.style.top = Math.max(0, Math.min(parseFloat(el.style.top) || 0, maxT)) + "px";
      }
    },
    toggle: function () { this.setOpen(!this.open); },
    isOpen: function () { return this.open; },
    glitch: function (on) {
      glitchOn = !!on;
      if (state === "victory") return; // don't interrupt the show
      if (glitchOn) { state = "glitch"; setStatus("⚠ SYNTAX FAULT", "fault"); }
      else { state = "idle"; setStatus("STATUS: ONLINE", ""); }
    },
    victory: function () {
      if (!this.mounted) return;
      if (!this.open) this.setOpen(true);
      startVictory(); ensureLoop();
    },
    /* generic bracket/quote balance for languages without a real parser */
    balanced: function (code) {
      var stack = [], pairs = { ")": "(", "]": "[", "}": "{" }, inStr = false, q = "", i, ch, prev = "";
      for (i = 0; i < code.length; i++) {
        ch = code[i];
        if (inStr) { if (ch === q && prev !== "\\") inStr = false; prev = ch; continue; }
        if (ch === '"' || ch === "'" || ch === "`") { inStr = true; q = ch; prev = ch; continue; }
        if (ch === "#") { while (i < code.length && code[i] !== "\n") i++; continue; }
        if (ch === "/" && code[i + 1] === "/") { while (i < code.length && code[i] !== "\n") i++; continue; }
        if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
        else if (pairs[ch]) { if (stack.pop() !== pairs[ch]) return false; }
        prev = ch;
      }
      return stack.length === 0 && !inStr;
    },
  };

  window.Companion = Companion;
})();
