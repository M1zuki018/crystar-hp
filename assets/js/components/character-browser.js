import { openCharacter } from './character-modal.js';
import { searchTextOf } from '../lib/work-data.js';
import { thumbHtml } from '../lib/image-fallback.js';
import { buildStand, initStands } from './stand-image.js';

/**
 * キャラクター一覧の共通部品。
 * タブ → アイコン行 → 紹介、の構成は作品ページとキャラクターページで共通なので、
 * 「タブが何で絞るか」と「検索バーを出すか」だけを差し替えて使い回す。
 *
 *   groups   … タブの定義 [{ id, label }]。1件以下ならタブを出さない
 *   groupKey … キャラクターのどの項目でタブを絞るか（'group' = 陣営 / 'workCode' = 作品）
 *   search   … 検索バーを出すか
 */
export function createCharacterBrowser(root, { characters, groups = [], groupKey = 'group', search = false }) {
  if (!characters.length) {
    root.innerHTML = `<div class="placeholder">
                        <span class="placeholder__label">No data</span>
                        キャラクターが未登録
                      </div>`;
    return;
  }

  // 検索用の文字列をあらかじめ作っておく
  const list = characters.map((c) => ({ ...c, searchText: searchTextOf(c) }));
  const tabs = groups.length > 1 ? groups : [];

  // 検索 → タブ → アイコン行 → 紹介 の順に、少しずつ遅らせて出す
  root.innerHTML = `
    ${search ? renderSearch() : ''}
    ${tabs.length ? renderTabs(tabs) : ''}

    <ul class="char-roster" data-reveal style="--reveal-delay: 120ms">
      ${list.map((c) => renderRosterItem(c, groupKey)).join('')}
    </ul>

    <p class="char-empty" hidden>該当するキャラクターがいません</p>
    <div class="char-detail" data-char-detail data-reveal style="--reveal-delay: 220ms"></div>
  `;

  bind(root, list);
}

/* ================= 描画 ================= */

const renderSearch = () => `
  <div class="char-search" data-reveal>
    <input class="char-search__input" type="search" data-char-search
           placeholder="作品名・陣営・キャラクター名で絞り込む"
           aria-label="キャラクターを絞り込む">
  </div>
`;

const renderTabs = (groups) => `
  <ul class="char-tabs" data-reveal>
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
  </ul>
`;

const renderRosterItem = (c, groupKey) => `
  <li data-group="${c[groupKey] ?? ''}" data-search="${c.searchText}">
    <button class="char-roster__item" type="button" data-select="${c.id}" aria-label="${c.name}">
      ${thumbHtml(c)}
    </button>
  </li>
`;

/**
 * 紹介の中身。
 * withStand が false のときは立ち絵のカラムを出力しないので、
 * 空の領域が残らず、1カラムで左詰めになる。
 */
function renderDetail(c, withStand) {
  return `
    ${
      withStand
          ? `<div class="char-detail__visual">
             ${buildStand(c.stand, `${c.name}の立ち絵`)}
           </div>`
          : ''
  }

    <div class="char-detail__info">
      <p class="char-detail__meta">
        ${[c.workTitle, c.groupLabel].filter(Boolean).join(' / ')}
      </p>
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

/* ================= 操作 ================= */

/** 立ち絵が読み込めなかった時点で、立ち絵なしの形に組み直す */
function fillDetail(detail, character, withStand) {
  detail.classList.toggle('is-standless', !withStand);
  detail.innerHTML = renderDetail(character, withStand);

  if (!withStand) return;

  initStands(detail);

  detail
      .querySelector('.stand__img')
      ?.addEventListener('error', () => fillDetail(detail, character, false), { once: true });
}

function bind(root, list) {
  const detail = root.querySelector('[data-char-detail]');
  const empty = root.querySelector('.char-empty');
  const rows = [...root.querySelectorAll('.char-roster > li')];
  const tabs = [...root.querySelectorAll('.char-tab')];
  const input = root.querySelector('[data-char-search]');

  let activeGroup = tabs[0]?.dataset.group ?? '';
  let query = '';

  /** 紹介を描き替える */
  const select = (id) => {
    const character = list.find((c) => c.id === id);
    if (!character) return;

    root.querySelectorAll('.char-roster__item').forEach((item) => {
      item.classList.toggle('is-active', item.dataset.select === id);
    });

    detail.hidden = false;
    detail.style.setProperty('--char-color', character.color ?? 'var(--c-crys)');
    fillDetail(detail, character, Boolean(character.stand));
  };

  /**
   * タブと検索の両方を適用して表示を更新する。
   * タブ同士は排他（AND/ORにはしない）で、検索はそこにさらに重ねる。
   */
  const apply = () => {
    rows.forEach((row) => {
      const byGroup = !activeGroup || activeGroup === 'all' || row.dataset.group === activeGroup;
      const byQuery = !query || row.dataset.search.includes(query);
      row.hidden = !(byGroup && byQuery);
    });

    const visible = rows.filter((row) => !row.hidden);
    empty.hidden = visible.length > 0;
    detail.hidden = visible.length === 0;

    // 表示中に選択が残っていればそのまま、消えたら先頭に切り替える
    const stillActive = visible.some((row) =>
        row.querySelector('.char-roster__item').classList.contains('is-active')
    );
    if (!stillActive && visible.length) {
      select(visible[0].querySelector('.char-roster__item').dataset.select);
    }
  };

  root.addEventListener('click', (event) => {
    const tab = event.target.closest('.char-tab');
    if (tab) {
      activeGroup = tab.dataset.group;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', String(on));
      });
      return apply();
    }

    const item = event.target.closest('[data-select]');
    if (item) return select(item.dataset.select);

    const more = event.target.closest('[data-character]');
    if (more) openCharacter(more.dataset.character);
  });

  input?.addEventListener('input', () => {
    query = input.value.trim().toLowerCase();
    apply();
  });

  select(list[0].id);
  apply();
}