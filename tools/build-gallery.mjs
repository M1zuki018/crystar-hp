/**
 * ギャラリー一覧の自動生成。
 *
 *   node tools/build-gallery.mjs
 *
 * Resources/gallery/ を走査して assets/data/gallery.js を書き出す。
 * 画像を追加・削除したらこれを実行するだけでよく、コードを書き足す必要はない。
 *
 * ファイル名の先頭（最初の _ まで）を作品コードとして扱う。
 *   rotl_battle_01.png → rotl
 * 画像の縦横も読み取って埋め込むので、読み込み時のガタつきが起きない。
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'Resources/gallery');
const OUT_FILE = join(ROOT, 'assets/data/gallery.js');

const EXTENSIONS = /\.(png|jpe?g|webp)$/i;

const files = (await readdir(SRC_DIR).catch(() => []))
  .filter((name) => EXTENSIONS.test(name) && !name.startsWith('.'))
  .sort(); // 並び順はファイル名で決まる

const entries = [];

for (const file of files) {
  const buffer = await readFile(join(SRC_DIR, file));
  const size = readImageSize(buffer);
  entries.push({ file, ...(size ?? {}) });
}

const body = entries
  .map(({ file, w, h }) => `  { file: '${file}'${w ? `, w: ${w}, h: ${h}` : ''} },`)
  .join('\n');

await writeFile(
  OUT_FILE,
  `/**
 * このファイルは tools/build-gallery.mjs が生成しています。
 * 直接編集せず、Resources/gallery/ に画像を置いてから再実行してください。
 *
 *   node tools/build-gallery.mjs
 */
export const GALLERY = [
${body}
];
`
);

console.log(`${entries.length}件を assets/data/gallery.js に書き出しました`);

/* ================= 画像サイズの読み取り ================= */

/** PNG / JPEG / WebP のヘッダから縦横を取る。読めなければ null */
function readImageSize(b) {
  return readPng(b) ?? readJpeg(b) ?? readWebp(b) ?? null;
}

function readPng(b) {
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function readJpeg(b) {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;

  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) {
      i += 1;
      continue;
    }

    const marker = b[i + 1];
    // SOF0〜SOF15（DHT/JPG/DACを除く）に縦横が入っている
    const isSof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isSof) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };

    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

function readWebp(b) {
  if (b.length < 30 || b.toString('ascii', 0, 4) !== 'RIFF') return null;

  const chunk = b.toString('ascii', 12, 16);

  if (chunk === 'VP8X') {
    return {
      w: (b.readUIntLE(24, 3) & 0xffffff) + 1,
      h: (b.readUIntLE(27, 3) & 0xffffff) + 1,
    };
  }

  if (chunk === 'VP8 ') {
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  }

  return null; // VP8L（可逆）は未対応。必要になったら足す
}
