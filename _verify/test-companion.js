// Headless runtime test for companion.js: mocks canvas/audio/DOM, mounts the
// companion, and drives many frames through idle (all ~20 anims), glitch and
// victory states to catch any runtime error. Run: node _verify/test-companion.js
const fs = require("fs"), path = require("path");

function noop() {}
function makeCtx() {
  const c = { fillStyle: "", strokeStyle: "", lineWidth: 1, font: "", globalAlpha: 1, imageSmoothingEnabled: false };
  ["save", "restore", "translate", "scale", "rotate", "fillRect", "strokeRect", "clearRect",
   "beginPath", "arc", "stroke", "fill", "moveTo", "lineTo", "closePath", "fillText", "rect", "setTransform"].forEach((m) => (c[m] = noop));
  return c;
}
function makeEl() {
  const el = { style: {}, hidden: false, className: "", id: "", innerHTML: "", classList: { toggle: noop, add: noop, remove: noop, contains: () => false } };
  el.appendChild = noop; el.addEventListener = noop; el.removeEventListener = noop;
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 160, height: 200 });
  el.offsetWidth = 160; el.offsetHeight = 200;
  el.querySelector = (sel) => {
    const q = makeEl();
    if (sel === ".companion-canvas") { q.getContext = () => makeCtx(); q.width = 160; q.height = 140; }
    return q;
  };
  return el;
}

let rafCb = null;
global.window = {
  AudioContext: function () { return { currentTime: 0, sampleRate: 44100, destination: {}, createOscillator: () => ({ frequency: { setValueAtTime: noop, exponentialRampToValueAtTime: noop }, connect: noop, start: noop, stop: noop, type: "" }), createGain: () => ({ gain: { setValueAtTime: noop, exponentialRampToValueAtTime: noop, value: 0 }, connect: noop }), createBuffer: () => ({ getChannelData: () => new Float32Array(1024) }), createBufferSource: () => ({ buffer: null, connect: noop, start: noop }), createBiquadFilter: () => ({ type: "", frequency: { value: 0 }, connect: noop }) }; },
  requestAnimationFrame: (cb) => { rafCb = cb; return 1; },
  cancelAnimationFrame: noop,
  addEventListener: noop,
  innerWidth: 1000, innerHeight: 800,
};
global.window.window = global.window;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = noop;
const body = makeEl();
global.document = { createElement: () => makeEl(), body, addEventListener: noop };
global.Snd = { sfx: noop };
global.window.Snd = global.Snd;

// load companion.js into this context
new Function(fs.readFileSync(path.join(__dirname, "..", "js", "companion.js"), "utf8"))();
const C = global.window.Companion;

C.mount({ getMute: () => true, onToggle: noop, initialOpen: true });

function drive(frames, step) {
  for (let i = 0; i < frames; i++) {
    if (!rafCb) throw new Error("no rAF callback scheduled (loop stopped)");
    const cb = rafCb; rafCb = null;
    cb(i * step);
  }
}

let ok = true;
try {
  // idle: lots of frames + big steps so every anim is picked and rendered
  drive(900, 220);
  // glitch
  C.glitch(true); drive(120, 30); C.glitch(false);
  // victory (full show: shoot all invaders)
  C.victory(); drive(400, 60);
  // back to idle
  drive(200, 200);
  console.log("companion runtime OK — idle anims, glitch and victory all ran without error");
} catch (e) {
  ok = false;
  console.error("RUNTIME ERROR:", e && e.stack ? e.stack : e);
}
process.exit(ok ? 0 : 1);
