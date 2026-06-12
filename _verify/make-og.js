// Generates og-image.png (1200x630) — the social-share banner.
// Design: "THE CONSTRUCT" over Matrix-style green code rain. No character.
// Dependency-free PNG encoder (same approach as make-icons.js). No browser needed.
// Run: node _verify/make-og.js  -> writes ../og-image.png
const zlib = require("zlib"), fs = require("fs"), path = require("path");

const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function chunk(type, data) { const t = Buffer.from(type, "ascii"); const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])) >>> 0, 0); return Buffer.concat([len, t, data, c]); }
function encodePNG(w, h, rgba) {
  const stride = w * 4, raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); }
  const idat = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const W = 1200, H = 630;
const rgba = Buffer.alloc(W * H * 4);
function setPx(x, y, col, a) {
  x = x | 0; y = y | 0; if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4, al = a == null ? 1 : a;
  rgba[i] = Math.round(rgba[i] * (1 - al) + col[0] * al);
  rgba[i + 1] = Math.round(rgba[i + 1] * (1 - al) + col[1] * al);
  rgba[i + 2] = Math.round(rgba[i + 2] * (1 - al) + col[2] * al);
  rgba[i + 3] = 255;
}
function rect(x, y, w, h, col, a) { for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) setPx(x + xx, y + yy, col, a); }

// near-black background
for (let i = 0; i < W * H; i++) { rgba[i * 4] = 1; rgba[i * 4 + 1] = 6; rgba[i * 4 + 2] = 5; rgba[i * 4 + 3] = 255; }

// 5x7 font: digits (for the rain) + the letters in the title
const FONT = {
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
  "T": ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  "H": ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  "E": ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  "C": [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  "O": [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  "N": ["#...#", "##..#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],
  "S": [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  "R": ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  "U": ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};
function glyph(ch, x, y, scale, col, a) {
  const g = FONT[ch] || FONT[" "];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === "#") rect(x + c * scale, y + r * scale, scale, scale, col, a);
}

// deterministic PRNG so the banner is reproducible build-to-build
let seed = 20260612 >>> 0;
function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

// ── Matrix code rain ──
const RS = 3, cw = 5 * RS, ch = 7 * RS, colStep = cw + 8, rowStep = ch + 5;
const DIGITS = "0123456789";
const HEAD = [205, 255, 226], NEAR = [120, 255, 198], TAIL = [0, 255, 156];
for (let x = 6; x < W - cw; x += colStep) {
  const streams = 2 + (rnd() < 0.6 ? 1 : 0);
  for (let s = 0; s < streams; s++) {
    const head = Math.floor(rnd() * (H + 360)) - 200;
    const len = 6 + Math.floor(rnd() * 24);
    for (let i = 0; i < len; i++) {
      const y = head - i * rowStep;
      if (y < -ch || y > H) continue;
      const d = DIGITS[Math.floor(rnd() * 10)];
      let col, a;
      if (i === 0) { col = HEAD; a = 1; }
      else if (i < 3) { col = NEAR; a = 0.9; }
      else { col = TAIL; a = Math.max(0.05, 1 - i / len); }
      glyph(d, x, y, RS, col, a * 0.9);
    }
  }
}

// vignette (darken edges so the title reads)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const dx = (x - W / 2) / (W / 2), dy = (y - H / 2) / (H / 2);
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > 0.6) setPx(x, y, [0, 0, 0], Math.min(0.7, (d - 0.6) * 0.9));
}

// readability band behind the title
const tScale = 12, TITLE = "THE CONSTRUCT";
const tW = (TITLE.length * 6 - 1) * tScale, tH = 7 * tScale;
const tx = Math.floor((W - tW) / 2), ty = Math.floor((H - tH) / 2);
rect(0, ty - 34, W, tH + 68, [1, 6, 5], 0.6);
rect(0, ty - 34, W, 2, TAIL, 0.35); rect(0, ty + tH + 32, W, 2, TAIL, 0.35);

// title — soft green halo, then bright core
function drawTitle(col, a, dx, dy) { let cx = tx + dx; for (const c of TITLE) { glyph(c, cx, ty + dy, tScale, col, a); cx += 6 * tScale; } }
[[-3, 0], [3, 0], [0, -3], [0, 3], [-2, -2], [2, 2]].forEach(o => drawTitle([0, 255, 156], 0.22, o[0], o[1]));
drawTitle([236, 255, 244], 1, 0, 0);

fs.writeFileSync(path.resolve(__dirname, "..", "og-image.png"), encodePNG(W, H, rgba));
console.log("wrote og-image.png (" + W + "x" + H + ") — Matrix rain + title");
