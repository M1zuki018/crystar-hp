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
└── assets/
    ├── css/
    │   ├── main.css        @import で束ねるエントリポイント
    │   ├── reset.css       ブラウザ標準スタイルの打ち消し
    │   ├── tokens.css      色・書体・余白の変数（配色変更はここだけ）
    │   ├── layout.css      共通の骨格・背景
    │   ├── components/     ヘッダー・フッターなどのパーツ
    │   └── pages/          ページ単位のスタイル
    └── js/
        ├── main.js         エントリポイント（各HTMLはこれだけ読む）
        ├── site.config.js  サイト名・ナビ・外部リンクの定義
        └── components/     ヘッダー・フッターのカスタム要素
```

## ページを追加する手順

1. `assets/js/site.config.js` の `NAV` に `{ id, label, href }` を1行追加する
2. 既存のHTMLを複製し、`<body data-page="...">` を `NAV` の `id` に合わせる
3. ページ固有のスタイルが必要なら `assets/css/pages/` にファイルを作り、`main.css` に `@import` を1行足す

ヘッダーとフッターは `<site-header>` / `<site-footer>` が描画するため、HTML側の編集は不要です。

## 公開

リポジトリの Settings → Pages で、公開ブランチのルートを指定します。すべて相対パスで参照しているため、`https://<user>.github.io/<repo>/` のようなサブディレクトリでもそのまま動きます。
