import { SITE, NAV, SOCIAL } from '../site.config.js';

/**
 * 共通フッター。<site-footer></site-footer> を置くだけで描画される。
 * サイトマップとSNSは site.config.js の NAV / SOCIAL から自動生成されるので、
 * ページやリンクが増えてもこのファイルの修正は不要。
 */
class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer__inner wrap">

          <!-- 名義 -->
          <div class="site-footer__brand">
            <p class="site-footer__name">
              <span class="site-footer__mark" aria-hidden="true"></span>${SITE.name}
            </p>
            <p class="site-footer__tagline">${SITE.tagline}</p>
          </div>

          <!-- サイトマップ -->
          <nav class="site-footer__col" aria-label="フッターメニュー">
            <p class="site-footer__heading">Sitemap</p>
            <ul class="site-footer__list">
              ${NAV.map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`).join('')}
            </ul>
          </nav>

          <!-- SNS（SOCIAL が空なら丸ごと出さない） -->
          ${
            SOCIAL.length
                ? `
          <div class="site-footer__col">
            <p class="site-footer__heading">Follow</p>
            <social-links data-variant="stack"></social-links>
          </div>`
                : ''
        }

        </div>

        <div class="site-footer__bottom wrap">
          <p class="site-footer__copy">${SITE.copyright}</p>
        </div>
      </footer>
    `;
    }
}

customElements.define('site-footer', SiteFooter);