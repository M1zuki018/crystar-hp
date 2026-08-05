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
