/**
 * 吹き出し（ArTooltip・ArPopover）の基準の要素を扱う小さな道具（ライブラリの中だけで使う）。
 * 基準は default slot の中身。aria-* はその中の最初の操作できる要素に付ける。
 */
const FOCUSABLE =
  'a[href],button,input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

/** 包みの中の最初の操作できる要素。なければ包みそのもの。 */
export function triggerTarget(wrap: HTMLElement | null): HTMLElement | null {
  if (!wrap) return null;
  return wrap.querySelector<HTMLElement>(FOCUSABLE) ?? wrap;
}

/** 属性を付ける・外す（undefined なら外す）。 */
export function setAria(el: HTMLElement | null, name: string, value: string | undefined) {
  if (!el) return;
  if (value === undefined) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

/** 乗せる・外すの遅れを持つタイマー。 */
export function delayed() {
  let t: ReturnType<typeof setTimeout> | undefined;
  return {
    run(ms: number, fn: () => void) {
      clearTimeout(t);
      if (ms <= 0) fn();
      else t = setTimeout(fn, ms);
    },
    clear() {
      clearTimeout(t);
    },
  };
}
