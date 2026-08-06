/**
 * スクロールに合わせて要素を出現させる仕組み。
 *
 * 使い方：出したい要素に data-reveal を付けるだけ。
 *   <div data-reveal>              … 下からフェードイン（既定）
 *   <div data-reveal="left">       … 左から
 *   <div data-reveal="right">      … 右から
 *   <div data-reveal="scale">      … わずかに拡大しながら
 *   <div data-reveal style="--reveal-delay: 120ms">  … 遅らせて出す
 *
 * このサイトの中身はほとんどJSで描画しているため、
 * DOMの追加を監視して自動で対象に加える。呼び出し側の記述は不要。
 *
 * 動きを減らす設定のときは何もしない（CSS側も無効化される）。
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  // JSが動いた場合だけ隠す。読み込みに失敗しても中身が消えないようにするため
  document.documentElement.classList.add('has-reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // 一度出したら戻さない
      });
    },
    {
      // 画面の下端ぎりぎりではなく、少し入ってから動かす
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05,
    }
  );

  /** 要素とその子孫から対象を探して監視に加える */
  const scan = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('[data-reveal]')) observer.observe(node);
    node.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
  };

  // あとから描画される中身も拾う
  new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach(scan));
  }).observe(document.documentElement, { childList: true, subtree: true });

  scan(document.body);
}
