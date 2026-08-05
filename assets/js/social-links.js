import { SOCIAL } from '../site.config.js';

/**
 * SNSリンク。<social-links></social-links> を置くだけで描画される。
 * data-variant で並べ方を切り替える：
 *   aside … 縦並び・右寄せ（トップページの右上で使用）
 *   stack … 縦並び・左寄せ（フッターで使用）
 *   row   … 横並び（既定）
 */
class SocialLinks extends HTMLElement {
  connectedCallback() {
    const variant = this.dataset.variant ?? 'row';

    this.innerHTML = `
      <ul class="social social--${variant}" aria-label="SNS">
        ${SOCIAL.map(
          ({ label, href }) => `
          <li>
            <a class="social__link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>
          </li>
        `
        ).join('')}
      </ul>
    `;
  }
}

customElements.define('social-links', SocialLinks);
