import { WORKS, findWork, resourceOf } from '../../data/works.config.js';

/**
 * 作品データ（assets/data/works/(code).js）の読み込みまわり。
 * 作品ページとキャラクターページの両方から使う。
 */

/** 1作品分のデータを読む。未作成でも例外を投げず空を返す */
export async function loadWorkData(code) {
  try {
    const module = await import(`../../data/works/${code}.js`);
    return module.default ?? {};
  } catch {
    console.warn(`assets/data/works/${code}.js が見つかりません`);
    return {};
  }
}

/**
 * キャラクターに画像パスと所属作品の情報を足す。
 * icon / stand の指定が無ければ char_(id)_(種別) を既定名として使う。
 */
export function resolveCharacters(work, data) {
  const groups = data.characterGroups ?? [];

  return (data.characters ?? []).map((character) => ({
    ...character,
    icon: resourceOf(work.code, character.icon ?? `char_${character.id}_icon`),
    stand: resourceOf(work.code, character.stand ?? `char_${character.id}_stand`),

    // 横断表示・検索用に、作品と陣営の情報を持たせておく
    workCode: work.code,
    workTitle: work.title ?? work.label,
    groupLabel: groups.find((g) => g.id === character.group)?.label ?? '',
  }));
}

/**
 * 全作品のキャラクターを1つの配列にまとめて返す。
 * 準備中の作品と、HOMEタブのような作品以外の項目は除外する。
 */
export async function loadAllCharacters() {
  const targets = WORKS.filter((work) => work.home !== false && work.status !== 'preparation');

  const results = await Promise.all(
    targets.map(async (work) => resolveCharacters(work, await loadWorkData(work.code)))
  );

  return results.flat();
}

/** 検索対象になる文字列をまとめて作る（小文字化して比較しやすくしておく） */
export const searchTextOf = (c) =>
  [c.name, c.realName, c.alphabet, c.groupLabel, c.workTitle].filter(Boolean).join(' ').toLowerCase();

export { findWork };
