import { WORKS, sectionsOf, urlOf } from '../../data/works.config.js';

/**
 * 作品タブ（ヘッダー2段目）。<work-nav></work-nav> を置くと描画される。
 * data-current に作品コードを渡すと、そのタブが選択状態になる。
 *
 * ホバー（またはフォーカス）でセクション一覧が展開され、
 * クリックすると「その作品ページへ遷移 → 該当セクションを先頭に表示」まで行う。
 * 遷移先での位置合わせは work.html 側の scrollToSection() が担当する。
 */
class WorkNav extends HTMLElement {
  // data-current があとから変わっても描き直せるようにしておく
  static observedAttributes = ['data-current'];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const current = this.dataset.current ?? '';

    this.innerHTML = `
      <nav class="work-nav" aria-label="作品メニュー">
        <ul class="work-nav__list wrap">
          ${WORKS.map((work) => this.renderTab(work, current)).join('')}
        </ul>
      </nav>
    `;

    this.setupDropdowns();
  }

  renderTab(work, current) {
    const sections = sectionsOf(work);
    const isCurrent = work.code === current;
    const isPrep = work.status === 'preparation';

    // 準備中のタブはリンクにしない
    const tab = isPrep
      ? `<span class="work-tab work-tab--disabled">${work.label}</span>`
      : `<a class="work-tab${isCurrent ? ' is-current' : ''}" href="${urlOf(work)}"
            ${isCurrent ? 'aria-current="page"' : ''}>${work.label}</a>`;

    // セクションが無い作品は展開部分ごと出さない
    const dropdown = sections.length
      ? `
      <div class="work-nav__drop">
        <ul class="work-nav__drop-list">
          ${sections
            .map(
              (section) => `
            <li>
              <a class="work-nav__drop-link" href="${urlOf(work, section.id)}">${section.label}</a>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>`
      : '';

    return `
      <li class="work-nav__item${sections.length ? ' has-drop' : ''}">
        ${tab}
        ${dropdown}
      </li>
    `;
  }

  /**
   * 展開の制御。
   * マウスが使える環境はホバー、タッチ環境はタップで開く。
   * キーボード操作は focusin / focusout で拾う。
   */
  setupDropdowns() {
    const items = [...this.querySelectorAll('.work-nav__item.has-drop')];
    const canHover = window.matchMedia('(hover: hover)').matches;

    const open = (item) => {
      items.forEach((other) => other.classList.toggle('is-open', other === item));
    };
    const closeAll = () => items.forEach((item) => item.classList.remove('is-open'));

    items.forEach((item) => {
      if (canHover) {
        item.addEventListener('pointerenter', () => open(item));
        item.addEventListener('pointerleave', () => item.classList.remove('is-open'));
      } else {
        // タッチ環境：1回目のタップで展開、2回目で遷移
        item.querySelector('.work-tab')?.addEventListener('click', (event) => {
          if (!item.classList.contains('is-open')) {
            event.preventDefault();
            open(item);
          }
        });
      }

      // キーボードでタブ内に入ったら開き、出たら閉じる
      item.addEventListener('focusin', () => open(item));
      item.addEventListener('focusout', (event) => {
        if (!item.contains(event.relatedTarget)) item.classList.remove('is-open');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll();
    });
  }
}

customElements.define('work-nav', WorkNav);
