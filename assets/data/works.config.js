/**
 * 作品の一覧と、作品タブ（ヘッダー2段目）の定義。
 * 作品を追加する手順：
 *   1. この WORKS に1件足す
 *   2. Resources/(code)/ に (code)_bg.png と (code)_home.png を置く
 *   3. assets/data/works/(code).js を作る（STORY/WORLD/CHARACTERの中身）
 * HTMLの新規作成は不要（work.html?code=(code) が共通テンプレートとして動く）。
 */

/** 作品ページ内のセクション。sections を省略した作品はこれが使われる */
export const DEFAULT_SECTIONS = [
  { id: 'story', label: 'STORY' },
  { id: 'world', label: 'WORLD' },
  { id: 'character', label: 'CHARACTER' },
];

/**
 * 作品定義。
 *   code     … 識別子。Resources/(code)/ とデータファイル名に対応する
 *   label    … タブに出す表記
 *   title    … HOMEページの見出し（省略時は label）
 *   subtitle … 見出しに添える一行（任意）
 *   sections … 作品ごとにブロック構成を変えたいときだけ指定する
 *   status   … 'preparation' なら準備中扱い（遷移しない・展開しない）
 *   home     … HOMEの一覧に出す／出さない
 */
export const WORKS = [
  {
    code: 'home',
    label: 'HOME',
    href: 'works.html',   // 一覧ページ自体へのタブなので href を直接持つ
    sections: [],
    home: false,
  },
  {
    code: 'void',
    label: 'v※|d',
    subtitle: '',
  },
  {
    code: 'aube',
    label: '暁星',
    subtitle: '',
  },
  {
    code: 'rotl',
    label: 'ROTL',
    subtitle: '',
  },
  {
    code: 'eoh',
    label: 'EOH',
    subtitle: '',
  },
  {
    code: 'tokyo',
    label: '深層東京',
    subtitle: '',
  },
  {
    code: 'preparation',
    label: '準備中',
    status: 'preparation',
    sections: [],
  },
];

/* ============ 以下は参照用のヘルパー ============ */

/** code から作品を引く */
export const findWork = (code) => WORKS.find((w) => w.code === code) ?? null;

/** その作品のセクション一覧（未指定なら既定値） */
export const sectionsOf = (work) => work.sections ?? DEFAULT_SECTIONS;

/** その作品のページURL。section を渡すとその位置まで飛ぶ */
export const urlOf = (work, sectionId) => {
  if (work.href) return work.href;
  const hash = sectionId ? `#${sectionId}` : '';
  return `work.html?code=${work.code}${hash}`;
};

/** リソースの置き場所の規約。ここを変えればフォルダ構成を変更できる */
export const resourceOf = (code, suffix, ext = 'png') =>
  `Resources/${code}/${code}_${suffix}.${ext}`;
