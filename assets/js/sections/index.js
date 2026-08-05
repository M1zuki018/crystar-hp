import { renderStory } from './story.js';
import { renderWorld } from './world.js';

/**
 * セクションidと描画処理の対応表。
 * 独自のブロックを増やすときは、ここに1行足して renderer を書く。
 */
export const SECTION_RENDERERS = {
  story: renderStory,
  world: renderWorld,
};
