# CryStar — 創作アーカイブ

HTML / CSS / JavaScript のみで作る、創作紹介用の静的サイト。GitHub Pages での公開を前提にしています。

## ローカルでの確認

JavaScript を ES Modules で書いているため、`index.html` をダブルクリックして `file://` で開くと動きません。簡易サーバーを立てて確認してください。

```bash
npx serve .
# または
python3 -m http.server 8000
```

## ディレクトリ構成

```
.
├── index.html          Top
├── works.html          作品
├── characters.html     キャラクター
├── gallery.html        ギャラリー
├── work.html           作品詳細の共通テンプレート（?code=xxx で切り替え）
├── Resources/          → Resources/README.md に命名規約
└── assets/
    ├── css/
    │   ├── main.css        @import で束ねるエントリポイント
    │   ├── reset.css       ブラウザ標準スタイルの打ち消し
    │   ├── tokens.css      色・書体・余白の変数（配色変更はここだけ）
    │   ├── layout.css      共通の骨格・背景
    │   ├── components/     ヘッダー・フッターなどのパーツ
    │   └── pages/          ページ単位のスタイル
    └── js/
    ├── data/
    │   ├── works.config.js 作品一覧とタブ構成の定義
    │   └── works/          作品ごとの中身（STORY/WORLD/CHARACTER）
    └── js/
        ├── main.js         エントリポイント（各HTMLはこれだけ読む）
        ├── site.config.js  サイト名・ナビ・外部リンクの定義
        ├── components/     カスタム要素（ヘッダー・作品タブ・背景など）
        └── pages/          ページ固有の処理（body の data-script で振り分け）
```

## ページを追加する手順

1. `assets/js/site.config.js` の `NAV` に `{ id, label, href }` を1行追加する
2. 既存のHTMLを複製し、`<body data-page="...">` を `NAV` の `id` に合わせる
3. ページ固有のスタイルが必要なら `assets/css/pages/` にファイルを作り、`main.css` に `@import` を1行足す

ヘッダーとフッターは `<site-header>` / `<site-footer>` が描画するため、HTML側の編集は不要です。

## 公開

リポジトリの Settings → Pages で、公開ブランチのルートを指定します。すべて相対パスで参照しているため、`https://<user>.github.io/<repo>/` のようなサブディレクトリでもそのまま動きます。

## 作品を追加する手順

1. `assets/data/works.config.js` の `WORKS` に1件追加する
2. `Resources/(code)/` に `(code)_bg.png` と `(code)_home.png` を置く
3. `assets/data/works/(code).js` に中身のデータを書く

HTMLの新規作成は不要です。作品詳細は `work.html?code=(code)` が共通テンプレートとして処理します。
セクション構成（STORY / WORLD / CHARACTER）を作品ごとに変える場合は、`WORKS` のその作品に `sections` を書けば上書きされます。

## ギャラリー画像の追加

1. `Resources/gallery/` に `(作品コード)_xxx.png` の名前で置く
2. 一覧を生成し直す

```bash
node tools/build-gallery.mjs
```

`assets/data/gallery.js`（生成物）が更新され、タブの分類と表示順に反映されます。
画像の縦横もスクリプトが読み取って埋め込むので、読み込み時のガタつきは起きません。
