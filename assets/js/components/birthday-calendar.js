import {
  indexByDate,
  formatBirthday,
  weekdays,
  weekdayOf,
  countInMonth,
  nextBirthday,
  daysUntil,
  pickForDate,
} from '../lib/birthday.js';
import { thumbHtml } from '../lib/image-fallback.js';
import { buildStand, initStands } from './stand-image.js';
import { openCharacter } from './character-modal.js';
import { setupDialogAnimation } from '../lib/dialog-anim.js';

/**
 * 誕生日暦。
 *
 * 「探すための表」ではなく「眺めるための暦」として作っている。
 * 誕生日がある日はその人を、無い日は日付から決まる別の1人を出すので、
 * どの日を開いても必ず誰かの絵が出る。
 * 割り当ては日付から決まるため、同じ日は何度開いても同じ人になる。
 */

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function createBirthdayCalendar(root, characters) {
  const index = indexByDate(characters);
  const today = new Date();
  const year = today.getFullYear();

  const state = {
    month: today.getMonth() + 1,
    day: today.getDate(),
    pick: 0, // 同じ日に複数いる場合、何人目を大きく出すか
  };

  root.innerHTML = `
    <div class="bd">
      <div class="bd__calendar" data-bd-calendar></div>
      <div class="bd__stage" data-bd-stage></div>
    </div>
  `;

  const calendarMount = root.querySelector('[data-bd-calendar]');
  const stageMount = root.querySelector('[data-bd-stage]');

  const draw = () => {
    calendarMount.innerHTML = renderCalendar(state, index, characters, year, today);
    stageMount.innerHTML = renderStage(state, index, characters, year, today);
    initStands(stageMount);
    watchArt(stageMount);
  };

  root.addEventListener('click', (event) => {
    const step = event.target.closest('[data-month-step]');
    if (step) {
      const next = state.month + Number(step.dataset.monthStep);
      state.month = ((next - 1 + 12) % 12) + 1;
      state.day = 1;
      state.pick = 0;
      return draw();
    }

    const cell = event.target.closest('[data-day]');
    if (cell) {
      state.day = Number(cell.dataset.day);
      state.pick = 0;
      return draw();
    }

    const swap = event.target.closest('[data-pick]');
    if (swap) {
      state.pick = Number(swap.dataset.pick);
      return draw();
    }

    const more = event.target.closest('[data-character]');
    if (more) openCharacter(more.dataset.character);
  });

  draw();

  // 開き直したときに今日へ戻すための入口
  return {
    reset() {
      const now = new Date();
      state.month = now.getMonth() + 1;
      state.day = now.getDate();
      state.pick = 0;
      draw();
    },
  };
}

/* ================= ポップアップ ================= */

let dialog = null;
let calendar = null;

/** 中身は初回だけ組み立て、以降は今日の日付に戻して開き直す */
export function openBirthdayCalendar(characters) {
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'bd-modal';
    dialog.innerHTML = `
      <button class="bd-modal__close" type="button" aria-label="閉じる">×</button>
      <div class="bd-modal__body"></div>
    `;

    const close = setupDialogAnimation(dialog);
    dialog.querySelector('.bd-modal__close').addEventListener('click', close);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close();
    });

    document.body.append(dialog);
    calendar = createBirthdayCalendar(dialog.querySelector('.bd-modal__body'), characters);
  } else {
    calendar?.reset();
  }

  dialog.showModal();
}

/* ================= 左：暦 ================= */

function renderCalendar(state, index, characters, year, today) {
  const { month } = state;

  const firstDow = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const count = countInMonth(index, month);

  const blanks = Array.from({ length: firstDow }, () => '<li class="bd-cell bd-cell--blank"></li>');

  const cells = Array.from({ length: lastDate }, (_, i) => {
    const day = i + 1;
    const list = index.get(`${month}-${day}`) ?? [];

    const isToday = month === today.getMonth() + 1 && day === today.getDate();
    const isSelected = day === state.day;

    // 誕生日の印。イメージカラーで小さく灯す
    const mark = list.length
        ? `<span class="bd-day__mark" style="--char-color: ${list[0].color ?? 'var(--c-crys)'}"></span>`
        : '';

    const classes = [
      'bd-day',
      list.length ? 'has-birthday' : '',
      isToday ? 'is-today' : '',
      isSelected ? 'is-selected' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return `
      <li class="bd-cell">
        <button class="${classes}" type="button" data-day="${day}"
                aria-label="${month}月${day}日${list.length ? `（誕生日 ${list.length}人）` : ''}"
                ${isSelected ? 'aria-current="date"' : ''}>
          <span class="bd-day__num">${day}</span>
          ${mark}
        </button>
      </li>
    `;
  });

  const next = nextBirthday(index, today);

  return `
    <header class="bd-head">
      <p class="bd-head__en">${MONTHS_EN[month - 1]}</p>

      <div class="bd-head__row">
        <button class="bd-head__step" type="button" data-month-step="-1" aria-label="前の月">‹</button>
        <p class="bd-head__month">
          <span class="bd-head__num">${month}</span><span class="bd-head__unit">月</span>
        </p>
        <button class="bd-head__step" type="button" data-month-step="1" aria-label="次の月">›</button>
        <p class="bd-head__count">${count ? `Birthdays ${count}` : ''}</p>
      </div>
    </header>

    <ul class="bd-week">
      ${weekdays().map((w) => `<li>${w}</li>`).join('')}
    </ul>

    <ul class="bd-grid">
      ${blanks.join('')}
      ${cells.join('')}
    </ul>

    ${
      next
          ? `<p class="bd-upcoming">
             <span class="bd-upcoming__label">Next</span>
             ${formatBirthday(next)}
             <span class="bd-upcoming__names">${next.list.map((c) => c.name).join('・')}</span>
             <span class="bd-upcoming__remain">${
              daysUntil(next, today) === 0 ? '今日' : `あと${daysUntil(next, today)}日`
          }</span>
           </p>`
          : ''
  }
  `;
}

/* ================= 右：その日の1枚 ================= */

function renderStage(state, index, characters, year, today) {
  const { month, day } = state;

  const list = index.get(`${month}-${day}`) ?? [];
  const isBirthday = list.length > 0;

  // 誕生日がいなければ、日付から決まる「その日のキャラクター」を出す
  const person = isBirthday
      ? list[Math.min(state.pick, list.length - 1)]
      : pickForDate(characters, month, day);

  if (!person) return '<p class="char-empty">キャラクターが登録されていません</p>';

  const isToday = month === today.getMonth() + 1 && day === today.getDate();

  // 同じ日に複数いる場合の切り替え
  const swaps =
      list.length > 1
          ? `<ul class="bd-stage__swaps">
           ${list
              .map(
                  (c, i) => `
             <li>
               <button class="bd-stage__swap${i === state.pick ? ' is-active' : ''}" type="button"
                       data-pick="${i}" aria-label="${c.name}">
                 ${thumbHtml(c, 'char-thumb--round')}
               </button>
             </li>
           `
              )
              .join('')}
         </ul>`
          : '';

  return `
    <figure class="bd-stage" style="--char-color: ${person.color ?? 'var(--c-crys)'}">
      <div class="bd-stage__art" data-bd-art data-character-id="${person.id}">
        ${person.stand ? buildStand(person.stand, `${person.name}の立ち絵`) : thumbHtml(person, 'bd-stage__fallback')}
      </div>

      <div class="bd-stage__overlay">
        <header class="bd-stage__top">
          <p class="bd-stage__kicker">
            ${isBirthday ? 'Birthday' : "Today's Character"}
            ${isToday ? '<span class="bd-stage__today">TODAY</span>' : ''}
          </p>
          <p class="bd-stage__date">
            <span class="bd-stage__day">${day}</span>
            <span class="bd-stage__month">${MONTHS_EN[month - 1]}</span>
            <span class="bd-stage__dow">${weekdayOf(year, month, day)}</span>
          </p>
        </header>

        <figcaption class="bd-stage__caption">
          ${swaps}
          <p class="bd-stage__meta">${[person.workTitle, person.groupLabel].filter(Boolean).join(' / ')}</p>
          ${person.alphabet ? `<p class="bd-stage__alphabet">${person.alphabet}</p>` : ''}
          <h3 class="bd-stage__name">${person.name}</h3>
          ${
      isBirthday && person.birthday
          ? `<p class="bd-stage__note">${formatBirthday({ month, day })} 生まれ</p>`
          : ''
  }

          <button class="more-button" type="button" data-character="${person.id}">
            <span>MORE</span>
          </button>
        </figcaption>
      </div>
    </figure>
  `;
}

/**
 * 立ち絵が読み込めなかった場合の差し替え。
 * 暦は「必ず絵が出る」ことが前提なので、頭文字の面に置き換えて空白を作らない。
 */
function watchArt(root) {
  const art = root.querySelector('[data-bd-art]');
  const img = art?.querySelector('.stand__img');
  if (!img) return;

  img.addEventListener(
      'error',
      () => {
        const name = art.closest('.bd-stage')?.querySelector('.bd-stage__name')?.textContent ?? '';
        art.innerHTML = thumbHtml({ name, color: 'var(--char-color)' }, 'bd-stage__fallback');
      },
      { once: true }
  );
}