import { renderStory } from './story.js';
import { renderWorld, bindWorld } from './world.js';
import { renderCharacter, bindCharacter } from './character.js';

/**
 * セクションidと描画処理の対応表。
 * 独自のブロックを増やすときは、ここに1行足して renderer を書く。
 */
export const SECTION_RENDERERS = {
  story: renderStory,
  world: renderWorld,
  character: renderCharacter,
};

/**
 * 描画後に操作を登録する必要があるブロックだけ、ここに登録する。
 * work-detail.js が該当セクションの要素を渡して呼ぶ。
 */
export const SECTION_BINDERS = {
  world: bindWorld,
  character: bindCharacter,
};
