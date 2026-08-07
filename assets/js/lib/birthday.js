/**
 * 誕生日まわりの共通処理。
 *
 * データ側の表記は揺れやすいので、よくある書き方をまとめて解釈する。
 *   '3月14日' / '03-14' / '3/14' / '2001-03-14'
 * どれも { month: 3, day: 14 } になる。解釈できないものは null（＝非公開扱い）。
 */

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export function parseBirthday(raw) {
  if (!raw) return null;

  const text = String(raw).trim();
  const matched =
      text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/) || // 3月14日
      text.match(/^(?:\d{4}[-/.])?(\d{1,2})[-/.](\d{1,2})$/); // 03-14 / 3/14 / 2001-03-14

  if (!matched) return null;

  const month = Number(matched[1]);
  const day = Number(matched[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { month, day };
}

/** 表示用の文字列 */
export const formatBirthday = ({ month, day }) => `${month}月${day}日`;

/** 曜日の見出し */
export const weekdays = () => [...WEEK];

/** 日付から曜日名 */
export const weekdayOf = (year, month, day) => WEEK[new Date(year, month - 1, day).getDay()];

/**
 * 「月 → 日 → その日が誕生日のキャラクター」の索引を作る。
 * 誕生日が読み取れないキャラクターは含まれない。
 */
export function indexByDate(characters) {
  const index = new Map();

  characters.forEach((character) => {
    const date = parseBirthday(character.birthday);
    if (!date) return;

    const key = `${date.month}-${date.day}`;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push({ ...character, birthdayDate: date });
  });

  return index;
}

/** その月に誕生日がある人数 */
export const countInMonth = (index, month) =>
    [...index.entries()]
        .filter(([key]) => Number(key.split('-')[0]) === month)
        .reduce((sum, [, list]) => sum + list.length, 0);

/**
 * 今日から見て、次に誕生日を迎えるキャラクター。
 * 同じ日が複数いる場合はまとめて返す。
 */
export function nextBirthday(index, today = new Date()) {
  const entries = [...index.entries()].map(([key, list]) => {
    const [month, day] = key.split('-').map(Number);
    return { month, day, list };
  });

  if (!entries.length) return null;

  const todayValue = (today.getMonth() + 1) * 100 + today.getDate();

  // 今日以降で最も近い日。年内に無ければ翌年の先頭に回る
  const sorted = entries.sort((a, b) => a.month * 100 + a.day - (b.month * 100 + b.day));
  return sorted.find(({ month, day }) => month * 100 + day >= todayValue) ?? sorted[0];
}

/** その日までの残り日数 */
export function daysUntil({ month, day }, today = new Date()) {
  const year = today.getFullYear();
  const base = new Date(year, today.getMonth(), today.getDate());
  let target = new Date(year, month - 1, day);

  if (target < base) target = new Date(year + 1, month - 1, day);

  return Math.round((target - base) / 86400000);
}

/**
 * 誕生日のいない日に割り当てる「その日のキャラクター」。
 * 日付から決まる並びなので、同じ日を開けば必ず同じ人が出る。
 * 素数を掛けて散らしているため、日が変わると顔ぶれもよく入れ替わる。
 */
export function pickForDate(characters, month, day) {
  if (!characters.length) return null;

  const seed = month * 37 + day * 11;
  return characters[seed % characters.length];
}