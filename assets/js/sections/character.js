import { openCharacter } from '../components/character-modal.js';

/**
 * CHARACTERブロック。
 * 陣営タブ → アイコン行 → 紹介、の3段構成。
 * アイコンを押すと下の紹介が切り替わり、MOREで詳細ポップアップが開く。
 */

const ALL_GROUP = { id: 'all', label: 'ALL' };

export function renderCharacter({ data, characters }) {
  if (!characters.length) {
    return `<div class="placeholder">
              <span class="placeholder__label">No data</span>
              キャラクターが未登録
            </div>`;
  }

  // data.groups（作品データの characterGroups）が無ければ ALL だけになる
  const groups = [ALL_GROUP, ...(data.groups ?? [])];

  // 陣営が ALL しか無いときはタブ自体を出さない
  const tabs =
    groups.length > 1
      ? `
    <ul class="char-tabs">
      ${groups
        .map(
          (group, i) => `
        <li>
          <button class="char-tab${i === 0 ? ' is-active' : ''}" type="button"
                  data-group="${group.id}" aria-pressed="${i === 0}">${group.label}</button>
        </li>
      `
        )
        .join('')}
    </ul>`
      : '';

  return `
    <div class="char-block">
      ${tabs}

      <!-- アイコンのみの行。陣営タブで絞り込む -->
      <ul class="char-roster">
        ${characters
          .map(
            (c, i) => `
          <li data-group="${c.group ?? ''}">
            <button class="char-roster__item${i === 0 ? ' is-active' : ''}" type="button"
                    data-select="${c.id}" aria-label="${c.name}">
              ${c.icon ? `<img src="${c.icon}" alt="" loading="lazy">` : ''}
            </button>
          </li>
        `
          )
          .join('')}
      </ul>

      <!-- 紹介。選択中の1人だけを表示する -->
      <div class="char-detail" data-char-detail></div>
    </div>
  `;
}

/** 描画後の操作をまとめて登録する */
export function bindCharacter(root, { characters }) {
  const detail = root.querySelector('[data-char-detail]');
  const items = [...root.querySelectorAll('.char-roster__item')];
  const rows = [...root.querySelectorAll('.char-roster > li')];
  const tabs = [...root.querySelectorAll('.char-tab')];

  if (!characters.length) return;

  /** 紹介を描き替える */
  const select = (id) => {
    const character = characters.find((c) => c.id === id);
    if (!character) return;

    items.forEach((item) => item.classList.toggle('is-active', item.dataset.select === id));
    detail.innerHTML = renderDetail(character);
    detail.style.setProperty('--char-color', character.color ?? 'var(--c-crys)');
  };

  /** 陣営で絞り込む。絞り込みは常に1つだけ（AND/ORにはしない） */
  const filter = (groupId) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.group === groupId;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-pressed', String(on));
    });

    rows.forEach((row) => {
      const visible = groupId === 'all' || row.dataset.group === groupId;
      row.hidden = !visible;
    });

    // 絞り込んだ結果の先頭を選び直す
    const first = rows.find((row) => !row.hidden);
    if (first) select(first.querySelector('.char-roster__item').dataset.select);
  };

  root.addEventListener('click', (event) => {
    const tab = event.target.closest('.char-tab');
    if (tab) return filter(tab.dataset.group);

    const item = event.target.closest('[data-select]');
    if (item) return select(item.dataset.select);

    const more = event.target.closest('[data-character]');
    if (more) openCharacter(more.dataset.character);
  });

  select(characters[0].id);
}

function renderDetail(c) {
  return `
    <div class="char-detail__visual">
      ${c.stand ? `<img src="${c.stand}" alt="${c.name}の立ち絵">` : ''}
    </div>

    <div class="char-detail__info">
      ${c.alphabet ? `<p class="char-detail__alphabet">${c.alphabet}</p>` : ''}
      <h3 class="char-detail__name">${c.name}</h3>
      ${c.realName ? `<p class="char-detail__real">${c.realName}</p>` : ''}
      ${c.intro ? `<p class="char-detail__intro">${c.intro}</p>` : ''}

      <button class="more-button" type="button" data-character="${c.id}">
        <span>MORE</span>
      </button>
    </div>
  `;
}
