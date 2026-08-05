import { buildKeyVisual } from '../components/key-visual.js';
import { openCharacter } from '../components/character-modal.js';
import { toParagraphs } from './story.js';

/**
 * WORLDブロック。
 * キービジュアル ＋ 本文 ＋ 関連キャラクターのアイコン。
 * アイコンを押すとキャラクター詳細ポップアップが開く。
 */
export function renderWorld({ data, resolve, characters }) {
  const visuals = (data.visuals ?? []).map(resolve);

  // data.characters には characters 配列の id を並べる
  const related = (data.characters ?? [])
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean);

  return `
    ${visuals.length ? buildKeyVisual(visuals) : ''}

    <div class="block-text">
      ${toParagraphs(data.text)}
    </div>

    ${
      related.length
        ? `
    <ul class="char-icons">
      ${related
        .map(
          (c) => `
        <li>
          <button class="char-icon" type="button" data-character="${c.id}">
            ${c.icon ? `<img src="${c.icon}" alt="" loading="lazy">` : ''}
            <span class="char-icon__name">${c.name}</span>
          </button>
        </li>
      `
        )
        .join('')}
    </ul>`
        : ''
    }
  `;
}

/**
 * アイコンの押下をまとめて拾う。
 * 個々のボタンに登録せず親で受けているので、あとから増えても動く。
 */
export function bindCharacterIcons(root) {
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-character]');
    if (button) openCharacter(button.dataset.character);
  });
}
