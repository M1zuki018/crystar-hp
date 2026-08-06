import { WORKS, sectionsOf, urlOf } from '../../data/works.config.js';

/**
 * 作品タブ（ヘッダー2段目）。<work-nav></work-nav> を置くと描画される。
 * data-current に作品コードを渡すと、そのタブが選択状態になる。
 *
 * タブにカーソルを乗せると、その作品のセクション（STORY / WORLD / …）が
 * 全幅の横帯として下に展開される。クリックすると作品ページへ遷移したうえで、
 * 選んだセクションが先頭に来る位置まで移動する。
 *
 * 展開部分はタブ行の外に置いている。タブ行は横スクロールさせるため
 * overflow-x: auto を持っており、その内側に置くと展開部分まで
 * スクロール領域に閉じ込められてしまうため。
 */
class WorkNav extends HTMLElement {
  static observedAttributes = ['data-current'];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const current = this.dataset.current ?? '';
    const expandable = WORKS.filter((work) => sectionsOf(work).length);

    this.innerHTML = `
      <nav class="work-nav" aria-label="作品メニュー">
        <ul class="work-nav__list wrap">
          ${WORKS.map((work) => this.renderTab(work, current)).join('')}
        </ul>

        <!-- 展開部分。タブ行の外に置き、全幅の帯として重ねる -->
        ${expandable.map((work) => this.renderDrop(work)).join('')}
      </nav>
    `;

    this.setupDropdowns();
  }

  renderTab(work, current) {
    const isCurrent = work.code === current;
    const isPrep = work.status === 'preparation';
    const hasDrop = sectionsOf(work).length > 0;

    // 準備中のタブはリンクにしない
    const tab = isPrep
        ? `<span class="work-tab work-tab--disabled">${work.label}</span>`
        : `<a class="work-tab${isCurrent ? ' is-current' : ''}" href="${urlOf(work)}"
            ${isCurrent ? 'aria-current="page"' : ''}>${work.label}</a>`;

    return `
      <li class="work-nav__item${hasDrop ? ' has-drop' : ''}" data-work="${work.code}">
        ${tab}
      </li>
    `;
  }

  renderDrop(work) {
    return `
      <div class="work-nav__drop" data-drop="${work.code}">
        <ul class="work-nav__drop-list wrap">
          ${sectionsOf(work)
        .map(
            (section) => `
            <li>
              <a class="work-nav__drop-link" href="${urlOf(work, section.id)}">${section.label}</a>
            </li>
          `
        )
        .join('')}
        </ul>
      </div>
    `;
  }

  /**
   * 展開の制御。
   * マウスが使える環境はホバー、タッチ環境はタップで開く。
   * 閉じる判定はタブ行ではなく <nav> 全体で行うので、
   * タブから帯へカーソルを移しても閉じない。
   */
  setupDropdowns() {
    const nav = this.querySelector('.work-nav');
    const items = [...this.querySelectorAll('.work-nav__item.has-drop')];
    const drops = [...this.querySelectorAll('.work-nav__drop')];
    const canHover = window.matchMedia('(hover: hover)').matches;

    const open = (code) => {
      items.forEach((item) => item.classList.toggle('is-open', item.dataset.work === code));
      drops.forEach((drop) => drop.classList.toggle('is-open', drop.dataset.drop === code));
    };
    const closeAll = () => open(null);

    items.forEach((item) => {
      if (canHover) {
        item.addEventListener('pointerenter', () => open(item.dataset.work));
      } else {
        // タッチ環境：1回目のタップで展開、2回目で遷移
        item.querySelector('.work-tab')?.addEventListener('click', (event) => {
          if (!item.classList.contains('is-open')) {
            event.preventDefault();
            open(item.dataset.work);
          }
        });
      }

      // キーボードでタブに入ったら開く
      item.addEventListener('focusin', () => open(item.dataset.work));
    });

    // 帯の中にフォーカスが入っている間は開いたままにする
    drops.forEach((drop) => {
      drop.addEventListener('focusin', () => open(drop.dataset.drop));
    });

    nav.addEventListener('pointerleave', closeAll);
    nav.addEventListener('focusout', (event) => {
      if (!nav.contains(event.relatedTarget)) closeAll();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll();
    });
  }
}

customElements.define('work-nav', WorkNav);