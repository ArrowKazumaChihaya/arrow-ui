/**
 * ポップアップ・ドロワー・確かめの共通の動き（ライブラリの中だけで使う）。
 * - 開くと中の最初の入力にフォーカスし、Tab は中で回る。閉じると開く前の場所に戻す。
 * - 開いている間は後ろのページを動かさない（html に data-ar-modal-open。重ねて開いても数える）。
 * - 置いた場所のテーマ色（data-ar-palette）を出す先へ引き継ぐ。
 */
import { getCurrentInstance, nextTick, onBeforeUnmount, ref, watch, type Ref } from "vue";

import { acquireOverlayLayer, releaseOverlayLayer } from "./overlay";

export const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

let openCount = 0;
const openDialogs: symbol[] = [];
function lock(on: boolean) {
  if (typeof document === "undefined") return;
  openCount = Math.max(0, openCount + (on ? 1 : -1));
  if (openCount > 0) document.documentElement.setAttribute("data-ar-modal-open", "");
  else document.documentElement.removeAttribute("data-ar-modal-open");
}

/** 部品を置いた場所（Teleport の前）の要素から、テーマ色の名前を読む。 */
export function usePlacedPalette() {
  const inst = getCurrentInstance();
  return (): string | undefined => {
    const el = inst?.vnode.el as Node | null | undefined;
    const host = el && (el.nodeType === 1 ? (el as Element) : el.parentElement);
    return (host?.closest?.("[data-ar-palette]") as HTMLElement | null)?.dataset.arPalette;
  };
}

export function useDialog(opts: {
  open: () => boolean;
  panel: Ref<HTMLElement | null>;
  /** 最初にフォーカスする場所を探す範囲（なければ panel）。 */
  initial?: () => HTMLElement | null | undefined;
  /** Esc で閉じてよいか。 */
  escapable: () => boolean;
  onEscape: () => void;
  /** 後ろのページを止めるか（その場に出すときは止めない）。 */
  lockScroll?: () => boolean;
  zIndex?: () => number | undefined;
  baseLayer?: number;
}) {
  const palette = ref<string | undefined>(undefined);
  const layer = ref<number | undefined>(undefined);
  const readPalette = usePlacedPalette();
  let returnTo: HTMLElement | null = null;
  let locked = false;
  const dialogId = Symbol("dialog");

  function focusables(): HTMLElement[] {
    const p = opts.panel.value;
    return p ? Array.from(p.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((e) => !e.closest("[inert]")) : [];
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.defaultPrevented) return;
    if (e.key === "Escape") {
      if (!opts.escapable()) return;
      e.stopPropagation();
      opts.onEscape();
      return;
    }
    if (e.key !== "Tab") return;
    const list = focusables();
    if (!list.length) {
      e.preventDefault();
      return;
    }
    const first = list[0] as HTMLElement;
    const last = list.at(-1) as HTMLElement;
    if (!opts.panel.value?.contains(document.activeElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && (document.activeElement === first || document.activeElement === opts.panel.value)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // A conditional editor can remove its focused button. The browser then focuses body,
  // outside the panel's key handler. Keep Escape and Tab working for the top dialog.
  function onDocumentKeydown(e: KeyboardEvent) {
    if (openDialogs.at(-1) !== dialogId || !opts.open()) return;
    if (document.activeElement === document.body || document.activeElement === document.documentElement)
      onKeydown(e);
  }

  function release() {
    releaseOverlayLayer(dialogId);
    const index = openDialogs.indexOf(dialogId);
    if (index >= 0) openDialogs.splice(index, 1);
    if (typeof document !== "undefined") document.removeEventListener("keydown", onDocumentKeydown);
    if (locked) lock(false);
    locked = false;
  }

  watch(
    opts.open,
    async (open) => {
      if (typeof document === "undefined") return;
      if (open) {
        if (!openDialogs.includes(dialogId)) openDialogs.push(dialogId);
        layer.value = opts.lockScroll?.() === false
          ? opts.zIndex?.()
          : acquireOverlayLayer(dialogId, opts.baseLayer, opts.zIndex?.());
        document.addEventListener("keydown", onDocumentKeydown);
        palette.value = readPalette();
        returnTo = document.activeElement as HTMLElement | null;
        if (opts.lockScroll?.() !== false && !locked) {
          lock(true);
          locked = true;
        }
        await nextTick();
        if (!opts.open()) return;
        const scope = opts.initial?.() ?? null;
        const first = scope ? Array.from(scope.querySelectorAll<HTMLElement>(FOCUSABLE))[0] : undefined;
        (first ?? opts.panel.value)?.focus();
      } else {
        release();
        returnTo?.focus?.();
        returnTo = null;
      }
    },
    { immediate: true },
  );
  onBeforeUnmount(release);

  return { onKeydown, palette, focusables, layer };
}
