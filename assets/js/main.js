/**
 * JSのエントリポイント。各HTMLはこの1ファイルだけを読み込む。
 * 機能を足すときは、ここに import を1行追加する。
 */

import './components/site-header.js';
import './components/site-footer.js';
import './components/social-links.js';

// スクロール量に応じてヘッダーの見た目を変える（少し下げたら背景を敷く）
const onScroll = () => {
  document.documentElement.classList.toggle('is-scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();