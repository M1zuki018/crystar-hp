import { WORKS } from '../../data/works.config.js';
import { loadAllCharacters } from '../lib/work-data.js';
import { registerCharacters } from '../components/character-modal.js';
import { createCharacterBrowser } from '../components/character-browser.js';
import { openBirthdayCalendar } from '../components/birthday-calendar.js';

/**
 * キャラクターページ。
 * 全作品のキャラクターを1つにまとめ、作品タブと検索バーで絞り込む。
 * 誕生日カレンダーは紹介の下のボタンから、ポップアップで開く。
 */

const mount = document.querySelector('[data-char-browser]');
const birthdayButton = document.querySelector('[data-birthday-open]');

if (mount) init();

async function init() {
  const characters = await loadAllCharacters();

  registerCharacters(characters);

  // タブは「ALL＋キャラクターが1人以上いる作品」だけを出す
  const works = WORKS.filter(
    (work) => work.home !== false && characters.some((c) => c.workCode === work.code)
  );

  createCharacterBrowser(mount, {
    characters,
    groups: [
      { id: 'all', label: 'ALL' },
      ...works.map((work) => ({ id: work.code, label: work.title ?? work.label })),
    ],
    groupKey: 'workCode',
    search: true,
  });

  birthdayButton?.addEventListener('click', () => openBirthdayCalendar(characters));
}
