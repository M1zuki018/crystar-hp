import { findWork, sectionsOf, resourceOf } from '../../data/works.config.js';
import { SECTION_RENDERERS, SECTION_BINDERS } from '../sections/index.js';
import { registerCharacters } from '../components/character-modal.js';

/**
 * 作品詳細ページ（work.html?code=xxx）。
 * URLの code から作品を特定し、assets/data/works/(code).js を読み込んで描画する。
 */

const code = new URLSearchParams(location.search).get('code') ?? '';
const work = findWork(code);

if (!work || work.status === 'preparation') {
  location.replace('works.html');
} else {
  init(work);
}

async function init(work) {
  const title = work.title ?? work.label;

  document.title = `${title} — CryStar Studio`;
  document.querySelector('page-bg')?.setAttribute('data-code', work.code);
  document.querySelector('work-nav')?.setAttribute('data-current', work.code);

  renderHero(work, title);

  // 作品データはページを開いたときにだけ読み込む
  const data = await loadWorkData(work.code);
  renderSections(work, data);

  scrollToHash();
}

async function loadWorkData(code) {
  try {
    const module = await import(`../../data/works/${code}.js`);
    return module.default ?? {};
  } catch {
    // データファイルが未作成でもページ自体は壊さない
    console.warn(`assets/data/works/${code}.js が見つかりません`);
    return {};
  }
}

function renderHero(work, title) {
  const hero = document.querySelector('[data-work-hero]');
  if (!hero) return;

  hero.innerHTML = `
    <p class="work-hero__code">${work.code.toUpperCase()}</p>
    <h1 class="work-hero__title">${title}</h1>
    ${work.subtitle ? `<p class="page-head__lead">${work.subtitle}</p>` : ''}
  `;
}

function renderSections(work, data) {
  const mount = document.querySelector('[data-work-sections]');
  if (!mount) return;

  const characters = data.characters ?? [];

  // 立ち絵・アイコンのパスをここで解決しておく（以降はそのまま使える）
  const resolved = characters.map((character) => ({
    ...character,
    icon: resolveCharacterImage(work.code, character, 'icon'),
    stand: resolveCharacterImage(work.code, character, 'stand'),
  }));

  registerCharacters(resolved);

  // 画像ファイル名を Resources/(code)/(code)_(name).png に変換する
  const resolve = (name) => resourceOf(work.code, name);

  const sections = sectionsOf(work);

  // CHARACTERブロックは陣営タブを使うので、作品データの characterGroups を渡す
  const dataOf = (id) =>
    id === 'character'
      ? { groups: data.characterGroups ?? [] }
      : data[id];

  mount.innerHTML = sections
    .map((section) => {
      const render = SECTION_RENDERERS[section.id];
      const sectionData = dataOf(section.id);

      const body =
        render && sectionData
          ? render({ data: sectionData, resolve, characters: resolved, work })
          : `<div class="placeholder">
               <span class="placeholder__label">No data</span>
               ${section.label} のデータが未登録
             </div>`;

      return `
        <section class="work-section" id="${section.id}">
          <p class="work-section__label">${section.label}</p>
          ${body}
        </section>
      `;
    })
    .join('');

  // 描画後に操作を登録する（対象のブロックだけ）
  sections.forEach((section) => {
    const bind = SECTION_BINDERS[section.id];
    const element = mount.querySelector(`#${section.id}`);
    if (bind && element) bind(element, { characters: resolved, work });
  });
}

/** 画像の指定が無ければ char_(id)_(種別) を既定名として使う */
function resolveCharacterImage(code, character, kind) {
  const name = character[kind] ?? `char_${character.id}_${kind}`;
  return resourceOf(code, name);
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
