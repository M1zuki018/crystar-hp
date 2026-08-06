/**
 * 画像が読み込めなかったときの後始末。
 *
 * 立ち絵やアイコンのパスは命名規約から組み立てているので、
 * ファイルがまだ無い場合は読み込みに失敗する。そのままだと
 * ブラウザ既定の壊れた画像アイコンが出てしまうため、失敗した <img> を隠す。
 *
 * error は伝播しないイベントなので、捕捉フェーズで拾っている。
 * これにより、あとから追加された画像にも個別の登録なしで効く。
 *
 * レイアウトごと組み替える必要がある箇所（立ち絵）は、
 * それぞれの描画側が error を受けて作り直している。
 * ここは「壊れた画像を見せない」ことだけを担当する。
 */
document.addEventListener(
  'error',
  (event) => {
    const img = event.target;
    if (img instanceof HTMLImageElement) img.hidden = true;
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
