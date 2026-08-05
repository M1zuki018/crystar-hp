/**
 * JSのエントリポイント。各HTMLはこの1ファイルだけを読み込む。
 * 共通パーツは import、ページ固有の処理は data-script で振り分ける。
 */

import './components/site-header.js';
import './components/site-footer.js';
import './components/social-links.js';
import './components/page-bg.js';
import './components/work-nav.js';

/**
 * ページ固有スクリプト。
 * <body data-script="works-home"> のように書くと、その1本だけが読み込まれる。
 * 追加するときはここに1行足す。
 */
const PAGE_SCRIPTS = {
  'works-home': () => import('./pages/works-home.js'),
  'work-detail': () => import('./pages/work-detail.js'),
};

PAGE_SCRIPTS[document.body.dataset.script]?.();

// スクロール量に応じてヘッダーの見た目を変える（少し下げたら背景を敷く）
const onScroll = () => {
  document.documentElement.classList.toggle('is-scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
