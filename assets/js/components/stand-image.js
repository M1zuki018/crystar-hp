/**
 * 立ち絵の表示領域。
 * 高さは --stand-h で固定し、画像は必ずその高さいっぱいに表示する。
 * 横幅は画像の比率次第で余ったり溢れたりするので、
 *   余る  → 背後にぼかした同じ画像を敷いて埋める
 *   溢れる → 両端をぼかして切り口を目立たなくする
 * のどちらかになる。判定は実際の画像比率と枠の比率を比べて行う。
 */

/** 立ち絵のHTMLを組み立てる。srcが無ければ何も出さない */
export const buildStand = (src, alt = '') =>
  src
    ? `
  <div class="stand" data-stand>
    <img class="stand__blur" src="${src}" alt="" aria-hidden="true">
    <img class="stand__img" src="${src}" alt="${alt}">
  </div>`
    : '';

/** 描画後に呼ぶ。root配下の立ち絵に横溢れの判定を仕込む */
export function initStands(root) {
  root.querySelectorAll('[data-stand]').forEach((box) => {
    const img = box.querySelector('.stand__img');

    const check = () => {
      if (!img.naturalWidth || !box.clientHeight) return;
      const imageRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = box.clientWidth / box.clientHeight;
      box.classList.toggle('is-wide', imageRatio > boxRatio);
    };

    if (img.complete) check();
    else img.addEventListener('load', check, { once: true });

    // 画面幅が変わると判定も変わる
    new ResizeObserver(check).observe(box);
  });
}
