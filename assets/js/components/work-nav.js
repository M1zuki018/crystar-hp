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

    // 要素自身と window に付ける登録は一度だけ。
    // render() は data-current が変わるたびに走るので、ここに置くと二重登録になる
    if (!this.isBound) {
      this.isBound = true;
      this.setupSameWorkScroll();
      this.setupGlobalKeys();
    }
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
   * いま開いている作品と同じ作品のリンクを押した場合は、
   * ページを読み込み直さずにその場でスクロールする。
   * 別の作品なら通常どおり遷移させる。
   */
  setupSameWorkScroll() {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';

    const scrollTo = (id) => {
      // id が無い（作品タブ本体）ときはページ先頭へ
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return false;

      // 位置合わせは CSS の scroll-margin-top（--header-stack-h）が担当する
      target.scrollIntoView({ behavior, block: 'start' });
      return true;
    };

    this.addEventListener('click', (event) => {
      const link = event.target.closest('.work-nav__drop-link, .work-tab');
      if (!link || !link.href) return;

      // このリンクがどの作品のものかを、囲んでいる要素から判定する
      const holder = link.closest('[data-drop], [data-work]');
      const code = holder?.dataset.drop ?? holder?.dataset.work;
      if (!code || code !== this.dataset.current) return; // 別作品 → 通常遷移

      const id = new URL(link.href, location.href).hash.slice(1);
      if (!scrollTo(id)) return; // 対象が見つからないときは通常遷移に任せる

      event.preventDefault();
      // 戻る操作で元の位置に帰れるよう、URLも更新しておく
      history.pushState(null, '', id ? `#${id}` : location.pathname + location.search);
      this.closeAll?.();
    });

    // 戻る・進むでハッシュが変わったときも同じように移動する
    window.addEventListener('popstate', () => {
      const id = location.hash.slice(1);
      if (id) scrollTo(id);
    });
  }

  /** Escapeで閉じる。document への登録なので一度だけ行う */
  setupGlobalKeys() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.closeAll?.();
    });
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
    this.closeAll = closeAll; // 同じ作品内のスクロール後にも閉じられるようにする

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
  }
}

customElements.define('work-nav', WorkNav);