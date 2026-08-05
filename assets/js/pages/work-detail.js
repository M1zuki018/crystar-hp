import { findWork, sectionsOf } from '../../data/works.config.js';

/**
 * 作品詳細ページ（work.html?code=xxx）。
 * URLの code から作品を特定し、背景・タブの選択状態・セクションの枠を用意する。
 * 各ブロックの中身は次の手順で実装する。
 */

const code = new URLSearchParams(location.search).get('code') ?? '';
const work = findWork(code);

// 該当する作品が無い場合は一覧へ戻す
if (!work || work.status === 'preparation') {
  location.replace('works.html');
} else {
  renderPage(work);
}

function renderPage(work) {
  const title = work.title ?? work.label;

  document.title = `${title} — CryStar Studio`;

  // 背景とタブに作品コードを渡す
  document.querySelector('page-bg')?.setAttribute('data-code', work.code);
  document.querySelector('work-nav')?.setAttribute('data-current', work.code);

  // 見出し
  const hero = document.querySelector('[data-work-hero]');
  if (hero) {
    hero.innerHTML = `
      <p class="work-hero__code">${work.code.toUpperCase()}</p>
      <h1 class="work-hero__title">${title}</h1>
      ${work.subtitle ? `<p class="page-head__lead">${work.subtitle}</p>` : ''}
    `;
  }

  // セクションの枠。作品ごとに sections を変えれば構成が変わる
  const body = document.querySelector('[data-work-sections]');
  if (body) {
    body.innerHTML = sectionsOf(work)
      .map(
        (section) => `
      <section class="work-section" id="${section.id}">
        <p class="work-section__label">${section.label}</p>
        <div class="placeholder">
          <span class="placeholder__label">Work in progress</span>
          ${section.label} ブロックをここに実装する
        </div>
      </section>
    `
      )
      .join('');
  }

  scrollToHash();
}

/**
 * 中身をJSで描画しているため、ブラウザ標準のハッシュ移動は間に合わない。
 * 描画が終わってから自分で位置を合わせる。
 */
function scrollToHash() {
  const id = location.hash.slice(1);
  if (!id) return;

  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
}
