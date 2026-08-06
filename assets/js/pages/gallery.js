import { GALLERY } from '../../data/gallery.js';
import { WORKS } from '../../data/works.config.js';
import { openLightbox } from '../components/lightbox.js';

/**
 * ギャラリーページ。
 * 画像はファイル名の先頭（最初の _ まで）を作品コードとみなして分類する。
 *   Resources/gallery/rotl_battle_01.png → rotl
 * 一覧そのものは tools/build_gallery.py が生成しているので、
 * 画像を足すときにこのファイルを触る必要はない。
 */

const DIR = 'Resources/gallery/';
const OTHER = { id: 'other', label: 'その他' };
const FALLBACK_RATIO = 4 / 3; // 縦横が読めなかった画像の暫定値

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
  layout();
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
  const labelOf = (code) => WORKS.find((work) => work.code === code)?.label ?? OTHER.label;

  mount.innerHTML = items
    .map((item) => {
      // 未登録のコードは「その他」に寄せる
      const group = known.has(item.code) ? item.code : OTHER.id;
      const ratio = item.w && item.h ? item.w / item.h : '';

      return `
        <button class="gallery__item" type="button" data-group="${group}"
                data-src="${item.src}" ${ratio ? `data-ratio="${ratio}"` : ''}>
          <img src="${item.src}" alt="${labelOf(item.code)}のイラスト" loading="lazy"
               ${item.w ? `width="${item.w}" height="${item.h}"` : ''}>
        </button>
      `;
    })
    .join('');
}

/**
 * 各画像が「グリッドの何行分を占めるか」を計算して割り当てる。
 * 行を細かく刻んでおき、縦横比から求めた高さを行数に換算することで、
 * 並び順を左から右に保ったまま高さの違う画像を敷き詰められる。
 */
function layout() {
  const styles = getComputedStyle(mount);
  const rowUnit = parseFloat(styles.gridAutoRows) || 8;
  const rowGap = parseFloat(styles.rowGap) || 0;

  mount.querySelectorAll('.gallery__item').forEach((item) => {
    if (item.hidden) return;

    const ratio = Number(item.dataset.ratio) || FALLBACK_RATIO;
    const height = item.clientWidth / ratio;
    const span = Math.ceil((height + rowGap) / (rowUnit + rowGap));

    item.style.setProperty('--span', span);
  });
}

function bind() {
  // 幅が変わると1列の幅も変わるので、そのつど計算し直す
  new ResizeObserver(layout).observe(mount);

  // 生成データに縦横が無い画像は、読み込めた時点で実寸から比率を取る
  mount.querySelectorAll('.gallery__item img').forEach((img) => {
    if (img.parentElement.dataset.ratio) return;

    img.addEventListener('load', () => {
      if (!img.naturalWidth) return;
      img.parentElement.dataset.ratio = img.naturalWidth / img.naturalHeight;
      layout();
    });
  });

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

    layout();
  });

  // 押したら拡大表示
  mount.addEventListener('click', (event) => {
    const item = event.target.closest('.gallery__item');
    if (item) openLightbox(item.dataset.src, item.querySelector('img')?.alt ?? '');
  });
}
