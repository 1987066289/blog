// 生成 256x256 渐变头像占位图（无外部依赖）
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 256, H = 256;
const raw = Buffer.alloc((W * 3 + 1) * H);
let p = 0;
for (let y = 0; y < H; y++) {
  raw[p++] = 0; // filter: none
  for (let x = 0; x < W; x++) {
    // 左上到右下的蓝紫渐变，中心圆形高亮
    const t = (x / W + y / H) / 2;
    const cx = (x - W / 2) / (W / 2), cy = (y - H / 2) / (H / 2);
    const r = Math.sqrt(cx * cx + cy * cy);
    const glow = r < 0.55 ? Math.max(0, (0.55 - r)) * 90 : 0;
    raw[p++] = Math.min(255, Math.round(60 + 40 * t + glow));
    raw[p++] = Math.min(255, Math.round(90 + 60 * t + glow * 0.7));
    raw[p++] = Math.min(255, Math.round(200 + 40 * t + glow * 0.3));
  }
}

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
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8-bit truecolor

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = path.join(__dirname, '..', 'source', 'img', 'avatar.png');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log('avatar written:', out, png.length, 'bytes');
