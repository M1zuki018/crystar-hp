import { GALLERY } from '../../data/gallery.js';
import { WORKS } from '../../data/works.config.js';
import { openLightbox } from '../components/lightbox.js';

/**
 * ギャラリーページ。
 * 画像はファイル名の先頭（最初の _ まで）を作品コードとみなして分類する。
 *   Resources/gallery/rotl_battle_01.png → rotl
 * 一覧そのものは tools/build-gallery.mjs が生成しているので、
 * 画像を足すときにこのファイルを触る必要はない。
 */

const DIR = 'Resources/gallery/';
const OTHER = { id: 'other', label: 'その他' };

const mount = document.querySelector('[data-gallery]');
const tabsMount = document.querySelector('[data-gallery-tabs]');

if (mount) init();

function init() {
  // ファイル名から作品コードを取り出す
  const items = GALLERY.map((item) => ({
    ...item,
    code: item.file.split('_')[0],
    src: DIR + item.file,
  }));

  if (!items.length) {
    mount.innerHTML = `<p class="char-empty">画像がまだ登録されていません</p>`;
    return;
  }

  renderTabs(items);
  renderItems(items);
  bind();
}

/** タブは「ALL＋画像が1枚以上ある作品」だけを、works.config.js の並び順で出す */
function renderTabs(items) {
  const used = new Set(items.map((item) => item.code));

  const groups = [
    { id: 'all', label: 'ALL' },
    ...WORKS.filter((work) => used.has(work.code)).map((work) => ({
      id: work.code,
      label: work.title ?? work.label,
    })),
  ];

  // works.config.js に無いコードの画像があれば「その他」でまとめる
  const known = new Set(WORKS.map((work) => work.code));
  if ([...used].some((code) => !known.has(code))) groups.push(OTHER);

  if (!tabsMount || groups.length < 2) return;

  tabsMount.innerHTML = `
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
    </ul>
  `;
}

function renderItems(items) {
  const known = new Set(WORKS.map((work) => work.code));
  const labelOf = (code) =>
    WORKS.find((work) => work.code === code)?.label ?? OTHER.label;

  mount.innerHTML = items
    .map((item) => {
      // 未登録のコードは「その他」に寄せる
      const group = known.has(item.code) ? item.code : OTHER.id;

      return `
        <button class="gallery__item" type="button" data-group="${group}"
                data-src="${item.src}">
          <img src="${item.src}" alt="${labelOf(item.code)}のイラスト" loading="lazy"
               ${item.w ? `width="${item.w}" height="${item.h}"` : ''}>
        </button>
      `;
    })
    .join('');
}

function bind() {
  // タブの絞り込み
  tabsMount?.addEventListener('click', (event) => {
    const tab = event.target.closest('.char-tab');
    if (!tab) return;

    tabsMount.querySelectorAll('.char-tab').forEach((other) => {
      const on = other === tab;
      other.classList.toggle('is-active', on);
      other.setAttribute('aria-pressed', String(on));
    });

    const group = tab.dataset.group;
    mount.querySelectorAll('.gallery__item').forEach((item) => {
      item.hidden = group !== 'all' && item.dataset.group !== group;
    });
  });

  // 押したら拡大表示
  mount.addEventListener('click', (event) => {
    const item = event.target.closest('.gallery__item');
    if (item) openLightbox(item.dataset.src, item.querySelector('img')?.alt ?? '');
  });
}
