/**
 * 画像が読み込めなかったときの後始末。
 *
 * 立ち絵やアイコンのパスは命名規約から組み立てているので、
 * ファイルがまだ無い場合は読み込みに失敗する。そのままだと
 * ブラウザ既定の壊れた画像アイコンが出てしまうため、
 * 失敗した <img> を隠し、いちばん近い [data-fallback] に印を付ける。
 *
 * error は伝播しないイベントなので、捕捉フェーズで拾っている。
 * これにより、あとから追加された画像にも個別の登録なしで効く。
 */
document.addEventListener(
  'error',
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;

    img.hidden = true;
    img.closest('[data-fallback]')?.classList.add('is-missing');
  },
  true
);

/** 名前から1文字取る。アイコンが無いときの代わりに表示する */
export const initialOf = (character) =>
  (character.alphabet || character.name || '?').trim().charAt(0).toUpperCase();

/**
 * キャラクターのアイコン。
 * 画像が無くても枠が空にならないよう、頭文字とイメージカラーの下地を
 * 常に敷いておき、その上に画像を重ねる構造にしている。
 */
export const thumbHtml = (character, className = '') => `
  <span class="char-thumb ${className}" data-initial="${initialOf(character)}"
        style="--char-color: ${character.color ?? 'var(--c-crys)'}">
    ${character.icon ? `<img src="${character.icon}" alt="" loading="lazy">` : ''}
  </span>
`;
