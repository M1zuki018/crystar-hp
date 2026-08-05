# Resources

作品ごとのリソース置き場。フォルダ名は works.config.js の `code` と一致させる。

```
Resources/
├── common/top/top_bg.png   トップページ背景
└── (code)/
    ├── (code)_bg.png     ページ背景（固定表示・cover）
    └── (code)_home.png   作品HOMEの一覧に出すビジュアル（16:9推奨）
```

命名規約は `assets/data/works.config.js` の `resourceOf()` にまとまっているので、
規約を変えたいときはその関数を書き換える。

## 作品ページで使う画像

`works.config.js` の `resourceOf()` により `Resources/(code)/(code)_(名前).png` に解決される。

```
Resources/rotl/
├── rotl_bg.png                  ページ背景
├── rotl_home.png                作品HOMEの一覧ビジュアル
├── rotl_story_01.png            STORYのキービジュアル（枚数自由）
├── rotl_world_01.png            WORLDのキービジュアル
├── rotl_char_victor_icon.png    キャラクターアイコン（正方形）
└── rotl_char_victor_stand.png   立ち絵（背景透過）
```

アイコンと立ち絵は `char_(id)_icon` / `char_(id)_stand` が既定名。
別名にしたい場合は、キャラクターデータに `icon` / `stand` を書けば上書きできる。

## ギャラリー

`Resources/gallery/` に平置きする。ファイル名の先頭（最初の `_` まで）が作品コードとして扱われ、
ギャラリーページのタブ分類に使われる。

```
Resources/gallery/
├── rotl_battle_01.png    → ROTL
├── rotl_battle_02.png    → ROTL
├── aube_01.jpg           → 暁星
└── misc_01.png           → 「その他」（works.config.js に無いコード）
```

画像を置いたら一覧を生成し直す。

```bash
node tools/build-gallery.mjs
```

`assets/data/gallery.js` が書き換わる。このファイルは生成物なので直接編集しない。
並び順はファイル名の昇順なので、番号で制御する。
