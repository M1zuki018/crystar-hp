import { VISUAL_INTERVAL } from '../../data/works.config.js';
import { openLightbox } from './lightbox.js';

/**
 * キービジュアル。大きい1枚＋下のサムネイルで切り替える。
 * 複数枚あるときは VISUAL_INTERVAL 間隔で自動送りし、大きい方を押すと拡大表示する。
 *
 * 画像リストは属性で渡す（配列なのでJSON化してURLエンコードしている）：
 *   <key-visual data-images="..."></key-visual>
 * 生成には buildKeyVisual() を使うと安全。
 */
class KeyVisual extends HTMLElement {
  connectedCallback() {
    this.images = decodeImages(this.dataset.images);
    if (!this.images.length) return;

    this.index = 0;
    this.render();
    this.bind();
    this.startAuto();
  }

  disconnectedCallback() {
    this.stopAuto();
  }

  render() {
    const isSingle = this.images.length === 1;

    this.innerHTML = `
      <div class="kv">
        <button class="kv__main" type="button" aria-label="キービジュアルを拡大表示">
          ${this.images
            .map(
              (src, i) => `
            <img class="kv__img${i === 0 ? ' is-active' : ''}" src="${src}" alt=""
                 loading="${i === 0 ? 'eager' : 'lazy'}">
          `
            )
            .join('')}
        </button>

        ${
          isSingle
            ? ''
            : `
        <ul class="kv__thumbs">
          ${this.images
            .map(
              (src, i) => `
            <li>
              <button class="kv__thumb${i === 0 ? ' is-active' : ''}" type="button"
                      data-index="${i}" aria-label="${i + 1}枚目を表示">
                <img src="${src}" alt="" loading="lazy">
              </button>
            </li>
          `
            )
            .join('')}
        </ul>`
        }
      </div>
    `;
  }

  bind() {
    // 大きいビジュアルを押したら拡大表示
    this.querySelector('.kv__main').addEventListener('click', () => {
      openLightbox(this.images[this.index]);
    });

    // サムネイルで切り替え
    this.querySelectorAll('.kv__thumb').forEach((button) => {
      button.addEventListener('click', () => {
        this.show(Number(button.dataset.index));
        this.startAuto(); // 手動操作したらタイマーを引き直す
      });
    });

    // カーソルが乗っている間は自動送りを止める
    this.addEventListener('pointerenter', () => this.stopAuto());
    this.addEventListener('pointerleave', () => this.startAuto());
  }

  /** n枚目を表示する */
  show(n) {
    this.index = (n + this.images.length) % this.images.length;

    this.querySelectorAll('.kv__img').forEach((img, i) => {
      img.classList.toggle('is-active', i === this.index);
    });
    this.querySelectorAll('.kv__thumb').forEach((button, i) => {
      button.classList.toggle('is-active', i === this.index);
    });
  }

  startAuto() {
    this.stopAuto();
    if (this.images.length < 2) return;
    // 動きを減らす設定のときは自動送りしない
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.timer = setInterval(() => this.show(this.index + 1), VISUAL_INTERVAL);
  }

  stopAuto() {
    clearInterval(this.timer);
  }
}

customElements.define('key-visual', KeyVisual);

/* ---- 生成・受け渡し用のヘルパー ---- */

/** 画像リストを属性に載せられる文字列に変換する */
export const buildKeyVisual = (images) =>
  `<key-visual data-images="${encodeURIComponent(JSON.stringify(images))}"></key-visual>`;

const decodeImages = (raw) => {
  if (!raw) return [];
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return [];
  }
};
