#!/usr/bin/env python3
"""ギャラリー一覧の自動生成。

    python3 tools/build_gallery.py

Resources/gallery/ を走査して assets/data/gallery.js を書き出す。
画像を追加・削除したらこれを実行するだけでよく、コードを書き足す必要はない。

ファイル名の先頭（最初の _ まで）を作品コードとして扱う。
    rotl_battle_01.png → rotl
画像の縦横も読み取って埋め込むので、読み込み時のガタつきが起きない。

標準ライブラリのみで動く（pip install は不要）。
"""

import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "Resources/gallery"
OUT_FILE = ROOT / "assets/data/gallery.js"

EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

HEADER = """/**
 * このファイルは tools/build_gallery.py が生成しています。
 * 直接編集せず、Resources/gallery/ に画像を置いてから再実行してください。
 *
 *   python3 tools/build_gallery.py
 */
"""


# ================= 画像サイズの読み取り =================

def read_png(b):
    if len(b) < 24 or b[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    w, h = struct.unpack(">II", b[16:24])
    return w, h


def read_jpeg(b):
    if len(b) < 4 or b[:2] != b"\xff\xd8":
        return None

    i = 2
    while i < len(b) - 9:
        if b[i] != 0xFF:
            i += 1
            continue

        marker = b[i + 1]
        # SOF0〜SOF15（DHT/JPG/DAC を除く）に縦横が入っている
        is_sof = (
            0xC0 <= marker <= 0xC3
            or 0xC5 <= marker <= 0xC7
            or 0xC9 <= marker <= 0xCB
            or 0xCD <= marker <= 0xCF
        )
        if is_sof:
            h, w = struct.unpack(">HH", b[i + 5 : i + 9])
            return w, h

        (length,) = struct.unpack(">H", b[i + 2 : i + 4])
        i += 2 + length
    return None


def read_webp(b):
    if len(b) < 30 or b[:4] != b"RIFF":
        return None

    chunk = b[12:16]

    if chunk == b"VP8X":
        w = int.from_bytes(b[24:27], "little") + 1
        h = int.from_bytes(b[27:30], "little") + 1
        return w, h

    if chunk == b"VP8 ":
        w = int.from_bytes(b[26:28], "little") & 0x3FFF
        h = int.from_bytes(b[28:30], "little") & 0x3FFF
        return w, h

    return None  # VP8L（可逆）は未対応。必要になったら足す


def read_image_size(path):
    """PNG / JPEG / WebP のヘッダから縦横を取る。読めなければ None"""
    b = path.read_bytes()
    for reader in (read_png, read_jpeg, read_webp):
        size = reader(b)
        if size:
            return size
    return None


# ================= 生成 =================

def main():
    if not SRC_DIR.is_dir():
        print(f"{SRC_DIR} がありません", file=sys.stderr)
        return 1

    files = sorted(  # 並び順はファイル名で決まる
        p
        for p in SRC_DIR.iterdir()
        if p.suffix.lower() in EXTENSIONS and not p.name.startswith(".")
    )

    lines = []
    for path in files:
        size = read_image_size(path)
        meta = f", w: {size[0]}, h: {size[1]}" if size else ""
        lines.append(f"  {{ file: '{path.name}'{meta} }},")

    body = "\n".join(lines)
    OUT_FILE.write_text(f"{HEADER}export const GALLERY = [\n{body}\n];\n", encoding="utf-8")

    print(f"{len(files)}件を assets/data/gallery.js に書き出しました")
    return 0


if __name__ == "__main__":
    sys.exit(main())
