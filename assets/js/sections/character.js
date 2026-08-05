import { createCharacterBrowser } from '../components/character-browser.js';

/**
 * 作品ページのCHARACTERブロック。
 * 中身は共通部品に任せ、ここでは「陣営で絞る」設定を渡すだけ。
 */

const ALL_GROUP = { id: 'all', label: 'ALL' };

export function renderCharacter() {
  return '<div class="char-block" data-char-browser></div>';
}

export function bindCharacter(root, { characters, data }) {
  const mount = root.querySelector('[data-char-browser]');
  if (!mount) return;

  createCharacterBrowser(mount, {
    characters,
    // 陣営が無い作品はタブごと出ない（groups が1件以下なら非表示になる）
    groups: (data?.groups ?? []).length ? [ALL_GROUP, ...data.groups] : [],
    groupKey: 'group',
    search: false,
  });
}
