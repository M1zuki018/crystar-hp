/**
 * <dialog> を閉じるときにアニメーションを挟むための小さな仕組み。
 *
 * dialog.close() は即座に非表示にするため、そのままでは閉じる動きを入れられない。
 * 閉じる指示をいったん受け止め、.is-closing を付けて再生を待ってから閉じる。
 *
 * 使い方：
 *   const close = setupDialogAnimation(dialog);
 *   ボタンや背景クリックからは dialog.close() ではなく close() を呼ぶ。
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function setupDialogAnimation(dialog, duration = 220) {
  const close = () => {
    if (reduced) return dialog.close();
    if (dialog.classList.contains('is-closing')) return; // 二重に走らせない

    dialog.classList.add('is-closing');
    setTimeout(() => {
      dialog.classList.remove('is-closing');
      dialog.close();
    }, duration);
  };

  // Escapeキーはブラウザが直接閉じにいくので、いったん止めて同じ経路に流す
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  return close;
}
