// 生成两张 1200x630 渐变封面图（无外部依赖，输出到 source/img/）
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function png(pixels, out) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  void out;
}

// 柔和插值
function lerp(a, b, t) { return a + (b - a) * t; }

function makeCover(stops, blobs, file) {
  const raw = Buffer.alloc((W * 3 + 1) * H);
  let p = 0;
  for (let y = 0; y < H; y++) {
    raw[p++] = 0;
    for (let x = 0; x < W; x++) {
      const t = (x / W + y / H) / 2;
      // 基础多段渐变
      let [r, g, b] = stops[0];
      for (let i = 0; i < stops.length - 1; i++) {
        const seg = 1 / (stops.length - 1);
        if (t >= i * seg && t <= (i + 1) * seg) {
          const st = (t - i * seg) / seg;
          r = lerp(stops[i][0], stops[i + 1][0], st);
          g = lerp(stops[i][1], stops[i + 1][1], st);
          b = lerp(stops[i][2], stops[i + 1][2], st);
        }
      }
      // 叠加光斑
      for (const [cx, cy, rad, col] of blobs) {
        const dx = (x - W * cx) / (W * 0.4), dy = (y - H * cy) / (W * 0.4);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < rad) {
          const glow = (1 - d / rad) * 0.55;
          r = lerp(r, col[0], glow);
          g = lerp(g, col[1], glow);
          b = lerp(b, col[2], glow);
        }
      }
      raw[p++] = Math.min(255, Math.round(r));
      raw[p++] = Math.min(255, Math.round(g));
      raw[p++] = Math.min(255, Math.round(b));
    }
  }
  const out = path.join(__dirname, '..', 'source', 'img', file);
  fs.writeFileSync(out, png(raw));
  console.log(file, fs.statSync(out).size, 'bytes');
}

// 封面1：暮色蓝紫（首页首文章）
makeCover(
  [[38, 44, 104], [78, 84, 180], [150, 100, 200]],
  [[0.2, 0.25, 0.5, [120, 200, 255]], [0.85, 0.7, 0.45, [255, 160, 220]]],
  'cover-1.png'
);

// 封面2：青碧深海
makeCover(
  [[16, 92, 108], [32, 140, 150], [70, 190, 170]],
  [[0.25, 0.7, 0.5, [160, 255, 230]], [0.8, 0.3, 0.4, [110, 220, 255]]],
  'cover-2.png'
);
