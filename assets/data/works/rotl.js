/**
 * 作品データのサンプル。他の作品を作るときはこのファイルを複製して中身を差し替える。
 *
 * 画像は名前だけ書けばよく、Resources/rotl/rotl_(名前).png に解決される。
 * 解決の規約は assets/data/works.config.js の resourceOf() にある。
 */
export default {
  /* ============ STORYブロック ============ */
  story: {
    // 何枚でもよい。2枚以上なら自動で切り替わる（間隔は VISUAL_INTERVAL）
    visuals: ['story_01', 'story_02', 'story_03'],

    // 空行で段落が分かれる。段落内の改行はそのまま改行になる
    text: `ここにあらすじを書く。

空行をひとつ入れると、次の段落として表示される。`,

    // リンクが無い作品はこの link ごと消す（ボタンは出なくなる）
    link: { label: 'GO', href: 'https://example.com' },
  },

  /* ============ WORLDブロック ============ */
  world: {
    visuals: ['world_01', 'world_02'],
    text: `ここに世界観の説明を書く。`,

    // 下の characters の id を並べる。アイコンから詳細ポップアップが開く
    characters: ['victor', 'razwald'],
  },

  /* ============ 陣営（CHARACTERブロックのタブ） ============
     ALL は自動で先頭に追加されるので書かなくてよい。
     ここが空、または1件だけの場合はタブ自体が表示されない。 */
  characterGroups: [
    { id: 'faction-a', label: '陣営A' },
    { id: 'faction-b', label: '陣営B' },
  ],

  /* ============ キャラクター ============
     icon / stand を省略すると char_(id)_icon.png / char_(id)_stand.png を探す。
     空文字の項目は詳細ポップアップに表示されない。 */
  characters: [
    {
      id: 'victor',
      group: 'faction-a',
      color: '#8fa9d9', // イメージカラー。ポップアップの配色に使われる

      name: 'ヴィクター',
      realName: '',
      alphabet: 'VICTOR',
      quote: 'セリフサンプルをここに書く',

      affiliation: '',
      gender: '',
      age: '',
      birthday: '',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro: 'ここに紹介文を書く。',
    },
    {
      id: 'razwald',
      group: 'faction-b',
      color: '#c98fa9',

      name: 'ラズワルド',
      realName: '',
      alphabet: 'RAZWALD',
      quote: '',

      affiliation: '',
      gender: '',
      age: '',
      birthday: '',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro: '',
    },
  ],
};
