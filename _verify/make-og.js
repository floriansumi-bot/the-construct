// Generates og-image.png (1200x630) — the social-share banner for link previews.
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

const GREEN = [0, 255, 156], CYAN = [37, 225, 255], WHITE = [234, 255, 245], DIM = [40, 120, 95];

// background gradient (top glow -> near black) + scanlines
for (let y = 0; y < H; y++) {
  const t = y / H, g = Math.max(0, 1 - t * 1.7);
  const r0 = Math.round(5 + 10 * g), g0 = Math.round(12 + 34 * g), b0 = Math.round(11 + 26 * g);
  for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; rgba[i] = r0; rgba[i + 1] = g0; rgba[i + 2] = b0; rgba[i + 3] = 255; }
  if (y % 3 === 0) for (let x = 0; x < W; x++) setPx(x, y, [0, 0, 0], 0.18); // scanline
}
// faint grid
for (let x = 0; x < W; x += 40) rect(x, 0, 1, H, GREEN, 0.05);
for (let y = 0; y < H; y += 40) rect(0, y, W, 1, GREEN, 0.05);

// neon frame
function frame(inset, col, a) { rect(inset, inset, W - 2 * inset, 2, col, a); rect(inset, H - inset - 2, W - 2 * inset, 2, col, a); rect(inset, inset, 2, H - 2 * inset, col, a); rect(W - inset - 2, inset, 2, H - 2 * inset, col, a); }
frame(22, GREEN, 0.55); frame(28, GREEN, 0.15);

// pixel-art hero (PROTO.EXE) — same art family as the app icon
const COL = { D: [6, 59, 44], H: GREEN, V: CYAN, C: WHITE };
const HERO = ["                ", "    DDDDDDDD    ", "   DHHHHHHHHD   ", "   DHHHHHHHHD   ", "   DHVVVVVVHD   ", "   DHVVVVVVHD   ", "   DHHHHHHHHD   ", "    DDHHHHDD    ", "  DDDHHHHHHDDD  ", " CCDHHHHHHHHDD  ", " CCDHHHHHHHHD   ", "  DDHHHHHHHHD   ", "   DHHHHHHHHD   ", "   DHHDDDDHHD   ", "   DHHD  DHHD   ", "   DDD    DDD   "];
const heroCell = 13, heroX = Math.floor((W - 16 * heroCell) / 2), heroY = 58;
for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) { const col = COL[HERO[r][c]]; if (col) rect(heroX + c * heroCell, heroY + r * heroCell, heroCell, heroCell, col); }

// 5x7 pixel font — just the glyphs needed for the title
const FONT = {
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
function text(str, x, y, scale, col) {
  let cx = x;
  for (const ch of str) { const g = FONT[ch] || FONT[" "];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === "#") rect(cx + c * scale, y + r * scale, scale, scale, col);
    cx += 6 * scale;
  }
  return cx;
}
const TITLE = "THE CONSTRUCT", tScale = 11;
const tWidth = (TITLE.length * 6 - 1) * tScale;
text(TITLE, Math.floor((W - tWidth) / 2), 332, tScale, GREEN);

// 6-language colour spectrum chips (Python/JS/TS/SQL/Lua/Ruby)
const CHIPS = [[0, 255, 156], [247, 223, 30], [49, 120, 198], [37, 225, 255], [203, 213, 255], [255, 77, 77]];
const chW = 150, chH = 12, gap = 16, total = CHIPS.length * chW + (CHIPS.length - 1) * gap, cx0 = Math.floor((W - total) / 2), cy = 470;
CHIPS.forEach((col, i) => { rect(cx0 + i * (chW + gap), cy, chW, chH, col); rect(cx0 + i * (chW + gap), cy, chW, chH, [0, 0, 0], 0.0); });

// little URL strip (drawn as a dim underline accent; text comes from og:title/description)
rect(Math.floor((W - 520) / 2), 524, 520, 2, DIM, 0.8);

fs.writeFileSync(path.resolve(__dirname, "..", "og-image.png"), encodePNG(W, H, rgba));
console.log("wrote og-image.png (" + W + "x" + H + ")");
