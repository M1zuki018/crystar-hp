import { WORKS, resourceOf, urlOf } from '../../data/works.config.js';

/**
 * 作品HOME（一覧）の描画。
 * 1作品1行で、行ごとに左右のカラムが入れ替わる（入れ替えはCSSの :nth-child(even) 側で行う）。
 */
const mount = document.querySelector('[data-works-list]');

if (mount) {
  // home: false の項目（HOMEタブ自身など）は一覧に出さない
  const items = WORKS.filter((work) => work.home !== false);

  mount.innerHTML = items.map(renderRow).join('');
}

function renderRow(work, index) {
  const isPrep = work.status === 'preparation';
  const title = work.title ?? work.label;

  // 行ごとに左右が入れ替わるので、出てくる向きもそれに合わせる
  const dir =
    index % 2 === 0 ? { body: 'left', visual: 'right' } : { body: 'right', visual: 'left' };

  const body = `
    <div class="work-row__body" data-reveal="${dir.body}">
      <p class="work-row__code">${work.code.toUpperCase()}</p>
      <h2 class="work-row__title">${title}</h2>
      ${work.subtitle ? `<p class="work-row__subtitle">${work.subtitle}</p>` : ''}
      <p class="work-row__more">${isPrep ? 'Coming soon' : 'View work →'}</p>
    </div>
  `;

  const visual = `
    <div class="work-row__visual" data-reveal="${dir.visual}" style="--reveal-delay: 100ms">
      ${
        isPrep
          ? '<div class="work-row__blank" aria-hidden="true"></div>'
          : `<img src="${resourceOf(work.code, 'home')}" alt="${title} のビジュアル" loading="lazy">`
      }
    </div>
  `;

  // 準備中は遷移先が無いので、リンクではなく通常の要素にする
  const tag = isPrep ? 'div' : 'a';
  const href = isPrep ? '' : ` href="${urlOf(work)}"`;

  return `
    <${tag} class="work-row${isPrep ? ' is-preparation' : ''}"${href}>
      ${body}
      ${visual}
    </${tag}>
  `;
}
