import { buildKeyVisual } from '../components/key-visual.js';

/**
 * STORYブロック。
 * キービジュアル ＋ 本文 ＋ 任意のリンクボタン。
 * link が無いデータではボタンごと出さない。
 */
export function renderStory({ data, resolve }) {
  const visuals = (data.visuals ?? []).map(resolve);

  // キービジュアル → 本文 → ボタン の順に、少しずつ遅らせて出す
  return `
    ${visuals.length ? buildKeyVisual(visuals, 'scale') : ''}

    <div class="block-text" data-reveal style="--reveal-delay: 120ms">
      ${toParagraphs(data.text)}
    </div>

    ${
      data.link
        ? `<a class="go-button" href="${data.link.href}" target="_blank" rel="noopener noreferrer"
              data-reveal style="--reveal-delay: 220ms">
             <span class="go-button__label">${data.link.label ?? 'GO'}</span>
           </a>`
        : ''
    }
  `;
}

/** 改行を段落に変換する。データ側では普通に改行を書けばよい */
export const toParagraphs = (text = '') =>
  text
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`)
    .join('');
