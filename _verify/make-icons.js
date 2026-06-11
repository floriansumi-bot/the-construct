// Generates PWA app icons (pixel-art hero on near-black) with a dependency-free
// PNG encoder. Run: node _verify/make-icons.js  -> writes ../icons/*.png
const zlib = require("zlib"), fs = require("fs"), path = require("path");
const outDir = path.resolve(__dirname, "..", "icons");
fs.mkdirSync(outDir, { recursive: true });

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

const COL = { D: [6, 59, 44, 255], H: [0, 255, 156, 255], V: [37, 225, 255, 255], C: [234, 255, 245, 255] };
const HERO = [
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
const BG = [5, 8, 10, 255];

function render(size, heroFrac) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) { rgba[i * 4] = BG[0]; rgba[i * 4 + 1] = BG[1]; rgba[i * 4 + 2] = BG[2]; rgba[i * 4 + 3] = 255; }
  const grid = 16, heroPx = Math.floor(size * heroFrac), cell = Math.max(1, Math.floor(heroPx / grid)), draw = cell * grid;
  const ox = Math.floor((size - draw) / 2), oy = Math.floor((size - draw) / 2);
  for (let r = 0; r < grid; r++) { const row = HERO[r]; for (let c = 0; c < grid; c++) { const col = COL[row[c]]; if (!col) continue;
    for (let yy = 0; yy < cell; yy++) for (let xx = 0; xx < cell; xx++) { const X = ox + c * cell + xx, Y = oy + r * cell + yy, idx = (Y * size + X) * 4; rgba[idx] = col[0]; rgba[idx + 1] = col[1]; rgba[idx + 2] = col[2]; rgba[idx + 3] = 255; } } }
  return encodePNG(size, size, rgba);
}

fs.writeFileSync(path.join(outDir, "icon-192.png"), render(192, 0.72));
fs.writeFileSync(path.join(outDir, "icon-512.png"), render(512, 0.72));
fs.writeFileSync(path.join(outDir, "maskable-512.png"), render(512, 0.56));
fs.writeFileSync(path.join(outDir, "apple-touch-icon.png"), render(180, 0.72));
fs.writeFileSync(path.join(outDir, "favicon-32.png"), render(32, 0.82));
console.log("icons written to", outDir);
