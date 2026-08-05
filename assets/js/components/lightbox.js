/**
 * 画像の拡大表示。
 * ネイティブの <dialog> を使っているので、Escapeで閉じる・背面を操作させない・
 * フォーカスを閉じ込める、といった挙動はブラウザ側が担当してくれる。
 */

let dialog = null;

/** 初回呼び出し時にだけ <dialog> を作って body に置く */
function ensureDialog() {
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="閉じる">×</button>
    <img class="lightbox__img" src="" alt="">
  `;

  dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());

  // 画像の外側（＝dialog自身）をクリックしたら閉じる
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.body.append(dialog);
  return dialog;
}

/** 画像を拡大表示する */
export function openLightbox(src, alt = '') {
  const el = ensureDialog();
  const img = el.querySelector('.lightbox__img');

  img.src = src;
  img.alt = alt;
  el.showModal();
}
