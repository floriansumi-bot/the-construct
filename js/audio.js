/* ============================================================
   audio.js — window.Snd
   Futuristic UI SFX + a generative jungle/breakbeat/DnB music
   engine, both 100% synthesized (copyright-free) via WebAudio.
   Independent SFX and music volumes + master mute. Optional
   user-supplied music files.
   ============================================================ */
window.Snd = (function () {
  "use strict";
  var ctx = null, master = null, sfxBus = null, musicBus = null;
  var cfg = { sfxVol: 0.6, musicVol: 0.45, muted: false, musicOn: true };
  var userTracks = []; // optional user-loaded audio buffers
  var userIdx = 0, userSrc = null;

  function ensure() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.connect(master);
      musicBus = ctx.createGain(); musicBus.connect(master);
      applyVols();
    } catch (e) { ctx = null; }
    return ctx;
  }
  function applyVols() {
    if (!ctx) return;
    var t = ctx.currentTime;
    master.gain.setTargetAtTime(cfg.muted ? 0 : 1, t, 0.01);
    sfxBus.gain.setTargetAtTime(cfg.sfxVol, t, 0.01);
    musicBus.gain.setTargetAtTime(cfg.musicVol, t, 0.02);
  }
  function resume() { if (ctx && ctx.state === "suspended") ctx.resume(); }

  /* ---------------- synth helpers (SFX bus) ---------------- */
  function noiseBuffer(dur) {
    var n = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function blip(bus, freq, dur, type, vol, slideTo) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "square"; o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), ctx.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + dur);
    o.connect(g); g.connect(bus); o.start(); o.stop(ctx.currentTime + dur + 0.02);
  }
  function noiseHit(bus, dur, vol, lp, hp) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuffer(dur);
    var node = s, g = ctx.createGain();
    if (hp) { var f1 = ctx.createBiquadFilter(); f1.type = "highpass"; f1.frequency.value = hp; node.connect(f1); node = f1; }
    if (lp) { var f2 = ctx.createBiquadFilter(); f2.type = "lowpass"; f2.frequency.value = lp; node.connect(f2); node = f2; }
    g.gain.setValueAtTime(vol || 0.2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + dur);
    node.connect(g); g.connect(bus); s.start();
  }

  var SFX = {
    click: function () { blip(sfxBus, 720, 0.045, "square", 0.45, 560); },
    hover: function () { blip(sfxBus, 900, 0.025, "sine", 0.18); },
    open: function () { blip(sfxBus, 300, 0.22, "sawtooth", 0.4, 1300); noiseHit(sfxBus, 0.18, 0.12, 4000, 600); },
    close: function () { blip(sfxBus, 1100, 0.18, "sawtooth", 0.35, 300); },
    toggle: function () { blip(sfxBus, 540, 0.05, "square", 0.4, 720); },
    nav: function () { blip(sfxBus, 680, 0.05, "triangle", 0.4, 1020); },
    execute: function () { blip(sfxBus, 420, 0.09, "square", 0.45, 880); blip(sfxBus, 840, 0.12, "sawtooth", 0.25, 1400); },
    success: function () { [659, 988, 1318].forEach(function (f, i) { setTimeout(function () { if (ctx) blip(sfxBus, f, 0.12, "square", 0.4); }, i * 80); }); },
    error: function () { blip(sfxBus, 170, 0.2, "sawtooth", 0.5, 80); noiseHit(sfxBus, 0.12, 0.18, 1400, 200); },
    jackin: function () { blip(sfxBus, 180, 0.5, "sawtooth", 0.5, 1600); noiseHit(sfxBus, 0.4, 0.1, 6000, 400); },
    wipe: function () { blip(sfxBus, 900, 0.4, "sawtooth", 0.4, 90); },
    // companion combat (routed here so volume/mute apply uniformly)
    glitch: function () { blip(sfxBus, 120 + Math.random() * 900, 0.05, "square", 0.3); noiseHit(sfxBus, 0.04, 0.22, 2600); },
    shoot: function () { blip(sfxBus, 900, 0.12, "square", 0.4, 180); },
    explode: function () { noiseHit(sfxBus, 0.22, 0.5, 1200); blip(sfxBus, 180, 0.18, "sawtooth", 0.3, 60); },
    victory: function () { [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { if (ctx) blip(sfxBus, f, 0.14, "square", 0.4); }, i * 100); }); },
  };
  var _lastSfx = {};
  function sfx(name) {
    if (cfg.muted || cfg.sfxVol <= 0) return;
    if (!ensure()) return; resume();
    var now = (ctx && ctx.currentTime) || 0;
    if (_lastSfx[name] && now - _lastSfx[name] < 0.02) return; // de-dupe bursts
    _lastSfx[name] = now;
    try { (SFX[name] || function () {})(); } catch (e) {}
  }

  /* ---------------- generative jungle / breakbeat engine ---------------- */
  var music = (function () {
    var playing = false, timer = null, nextTime = 0, step = 0, bar = 0, bpm = 168;
    var LOOK = 0.12, INT = 25;
    function stepDur() { return 60 / bpm / 4; }

    // pattern banks (16 steps = 1 bar). velocity 0..1
    var KICKS = [
      [1,0,0,0, 0,0,.9,0, 0,0,1,0, 0,0,.7,0],
      [1,0,0,.6, 0,0,1,0, 0,1,0,0, 0,0,1,0],
      [1,0,.5,0, 0,0,1,0, .7,0,0,0, 0,1,0,0],
    ];
    var SNARES = [
      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,.5],
      [0,0,0,0, 1,0,0,.5, 0,0,1,0, 1,0,0,0],
      [0,0,.4,0, 1,0,0,0, 0,.5,0,0, 1,0,.4,0],
    ];
    // jungle ghost-snare layer (quiet, syncopated)
    var GHOST = [0,.3,0,.25, 0,.3,.2,0, .25,0,.3,0, 0,.3,0,.35];
    // A minor-ish bassline (Hz), 0 = rest. (A1 E2 D2 C2 G1)
    var BASSES = [
      [55,0,0,0, 82.41,0,0,0, 73.42,0,0,0, 65.41,0,0,0],
      [55,0,55,0, 0,0,82.41,0, 0,73.42,0,0, 65.41,0,0,49],
      [82.41,0,0,0, 65.41,0,0,0, 73.42,0,0,0, 55,0,0,0],
    ];
    var ki = 0, si = 0, bi = 0, intensity = 0.5;

    function kick(t, v) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.11);
      g.gain.setValueAtTime(0.95 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + 0.2);
    }
    function snare(t, v) {
      var s = ctx.createBufferSource(); s.buffer = noiseBuffer(0.2);
      var hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1400;
      var g = ctx.createGain(); g.gain.setValueAtTime(0.55 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      s.connect(hp); hp.connect(g); g.connect(musicBus); s.start(t);
      var o = ctx.createOscillator(), og = ctx.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(190, t);
      og.gain.setValueAtTime(0.3 * v, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      o.connect(og); og.connect(musicBus); o.start(t); o.stop(t + 0.1);
    }
    function hat(t, v, open) {
      var dur = open ? 0.11 : 0.035;
      var s = ctx.createBufferSource(); s.buffer = noiseBuffer(dur + 0.01);
      var hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7500;
      var g = ctx.createGain(); g.gain.setValueAtTime(0.22 * v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      s.connect(hp); hp.connect(g); g.connect(musicBus); s.start(t);
    }
    function bass(t, freq) {
      var len = stepDur() * 2;
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = "sawtooth"; o2.type = "sawtooth"; o.frequency.value = freq; o2.frequency.value = freq * 1.008;
      lp.type = "lowpass"; lp.frequency.setValueAtTime(500, t); lp.frequency.exponentialRampToValueAtTime(180, t + len);
      g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.42, t + 0.012); g.gain.exponentialRampToValueAtTime(0.001, t + len);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(musicBus); o.start(t); o2.start(t); o.stop(t + len + 0.05); o2.stop(t + len + 0.05);
      var sub = ctx.createOscillator(), sg = ctx.createGain(); sub.type = "sine"; sub.frequency.value = freq / 2;
      sg.gain.setValueAtTime(0.4, t); sg.gain.exponentialRampToValueAtTime(0.001, t + len);
      sub.connect(sg); sg.connect(musicBus); sub.start(t); sub.stop(t + len + 0.05);
    }
    function stab(t) {
      [220, 277.18, 329.63].forEach(function (f) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "square"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + 0.2);
      });
    }

    function scheduleStep(s, t) {
      var i = s % 16;
      if (i === 0) { // new bar — evolve the pattern
        bar++;
        if (bar % 4 === 0) { ki = (ki + 1) % KICKS.length; si = (si + 1) % SNARES.length; }
        if (bar % 8 === 0) bi = (bi + 1) % BASSES.length;
        intensity = 0.4 + Math.random() * 0.5;
        if (bar % 16 === 0) stab(t); // occasional stab on the one
      }
      var K = KICKS[ki], S = SNARES[si], B = BASSES[bi];
      if (K[i]) kick(t, K[i]);
      if (S[i]) snare(t, S[i]);
      if (GHOST[i] && Math.random() < 0.6 + intensity * 0.3) snare(t, GHOST[i] * 0.8);
      // hats: 16ths with swing/velocity; open hat on off-beats
      hat(t + (i % 2 ? stepDur() * 0.06 : 0), (i % 4 === 0 ? 0.9 : 0.55) * (0.7 + Math.random() * 0.3), i % 8 === 6);
      if (B[i]) bass(t, B[i]);
      // breakcore-ish fill: stutter the last beat of every 4th bar
      if (i >= 12 && bar % 4 === 3 && Math.random() < 0.18 + intensity * 0.25) {
        for (var k = 1; k <= 3; k++) snare(t + (stepDur() / 4) * k, 0.4);
      }
    }
    function tick() {
      if (!playing || !ctx) return;
      while (nextTime < ctx.currentTime + LOOK) { scheduleStep(step, nextTime); nextTime += stepDur(); step++; }
    }
    return {
      get playing() { return playing; },
      start: function () {
        if (playing || userTracks.length) return; // user tracks take over if loaded
        if (!ensure()) return; resume();
        playing = true; step = 0; bar = 0; nextTime = ctx.currentTime + 0.08;
        timer = setInterval(tick, INT);
      },
      stop: function () { playing = false; if (timer) clearInterval(timer); timer = null; },
    };
  })();

  /* ---------------- optional user-supplied music files ---------------- */
  function playUserTrack() {
    if (!userTracks.length || !ensure()) return; resume();
    if (userSrc) { try { userSrc.onended = null; userSrc.stop(); } catch (e) {} }
    var src = ctx.createBufferSource(); src.buffer = userTracks[userIdx % userTracks.length];
    src.connect(musicBus); src.onended = function () { userIdx++; if (cfg.musicOn) playUserTrack(); };
    src.start(); userSrc = src;
  }
  function loadFiles(fileList, cb) {
    if (!ensure()) return; var files = Array.prototype.slice.call(fileList || []);
    var done = 0, added = 0;
    if (!files.length) { cb && cb(0); return; }
    files.forEach(function (f) {
      var r = new FileReader();
      r.onload = function () { ctx.decodeAudioData(r.result, function (buf) { userTracks.push(buf); added++; if (++done === files.length) finish(); }, function () { if (++done === files.length) finish(); }); };
      r.onerror = function () { if (++done === files.length) finish(); };
      r.readAsArrayBuffer(f);
    });
    function finish() { cb && cb(added); if (cfg.musicOn) { music.stop(); userIdx = 0; playUserTrack(); } }
  }

  function startMusic() { if (!cfg.musicOn) return; if (userTracks.length) playUserTrack(); else music.start(); }
  function stopMusic() { music.stop(); if (userSrc) { try { userSrc.onended = null; userSrc.stop(); } catch (e) {} userSrc = null; } }

  return {
    init: function (opts) { opts = opts || {}; for (var k in opts) if (opts[k] !== undefined) cfg[k] = opts[k]; },
    resume: resume,
    sfx: sfx,
    cfg: cfg,
    setSfxVol: function (v) { cfg.sfxVol = Math.max(0, Math.min(1, v)); applyVols(); },
    setMusicVol: function (v) { cfg.musicVol = Math.max(0, Math.min(1, v)); applyVols(); },
    setMuted: function (b) { cfg.muted = !!b; if (ensure()) applyVols(); },
    setMusicOn: function (b) { cfg.musicOn = !!b; if (b) startMusic(); else stopMusic(); },
    startMusic: startMusic,
    stopMusic: stopMusic,
    loadFiles: loadFiles,
    hasUserTracks: function () { return userTracks.length > 0; },
    clearUserTracks: function () { userTracks = []; userIdx = 0; if (userSrc) { try { userSrc.stop(); } catch (e) {} userSrc = null; } if (cfg.musicOn) music.start(); },
  };
})();
