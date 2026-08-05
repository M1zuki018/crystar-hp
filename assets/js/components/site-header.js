import { SITE, NAV } from '../site.config.js';

/**
 * 共通ヘッダー。<site-header></site-header> を置くだけで描画される。
 * Shadow DOM は使わず通常のDOMに描画するので、スタイルは
 * assets/css/components/header.css で普通に書ける。
 */
class SiteHeader extends HTMLElement {
  connectedCallback() {
    // 現在地は <body data-page="..."> から取得する
    const currentPage = document.body.dataset.page ?? '';

    this.innerHTML = `
      <header class="site-header">
        <div class="site-header__inner wrap">

          <!-- ロゴ：左詰め -->
          <a class="logo" href="${NAV[0].href}" aria-label="${SITE.name} トップページ">
            <span class="logo__mark" aria-hidden="true"></span>
            <span class="logo__name">${SITE.short}</span>
          </a>

          <!-- モバイル用の開閉ボタン（幅が狭いときだけ表示） -->
          <button class="nav-toggle" type="button"
                  aria-expanded="false" aria-controls="global-nav" aria-label="メニューを開く">
            <span class="nav-toggle__bar" aria-hidden="true"></span>
          </button>

          <!-- ナビゲーション：右詰め -->
          <nav class="site-nav" id="global-nav" aria-label="サイト内メニュー">
            <ul class="site-nav__list">
              ${NAV.map((item) => this.renderNavItem(item, currentPage)).join('')}
            </ul>
          </nav>

        </div>
      </header>
    `;

    this.setupToggle();
  }

  /** ナビ1項目分のHTML。現在地の項目には aria-current と modifier を付ける */
  renderNavItem({ id, label, href }, currentPage) {
    const isCurrent = id === currentPage;
    return `
      <li class="site-nav__item">
        <a class="site-nav__link${isCurrent ? ' is-current' : ''}"
           href="${href}"${isCurrent ? ' aria-current="page"' : ''}>${label}</a>
      </li>
    `;
  }

  /** モバイル時のメニュー開閉 */
  setupToggle() {
    const toggle = this.querySelector('.nav-toggle');
    const header = this.querySelector('.site-header');

    toggle.addEventListener('click', () => {
      const willOpen = toggle.getAttribute('aria-expanded') === 'false';
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
      header.classList.toggle('is-nav-open', willOpen);
    });

    // メニュー内のリンクを踏んだら閉じる（同一ページ内リンクを増やしたときの保険）
    this.querySelectorAll('.site-nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        header.classList.remove('is-nav-open');
      });
    });
  }
}

customElements.define('site-header', SiteHeader);
