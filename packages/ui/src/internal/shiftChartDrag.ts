/**
 * ArShiftChart のドラッグのしくみ（ポインターの動きを分に直し、shiftChartTime の計算で時間を作り直す）。
 * マウス・ペン・指のどれでも動く。押して 3px 動かすまではドラッグにしない（押しただけは「押した」）。
 * 動かしている間は state.current を描き、離したときに onEnd（変わっていれば）を呼ぶ。Escape で取り消す。
 */
import { onBeforeUnmount, shallowRef } from "vue";
import { applyOp, newSpan, type ShiftChartOp, type ShiftChartSpan, type ShiftChartTimes } from "./shiftChartTime";

export type ShiftChartDragKind = "op" | "new" | "take";

export interface ShiftChartDragState {
  /** 行の鍵。 */
  key: string | number;
  kind: ShiftChartDragKind;
  /** kind="op" のときの操作（移動・両端・休憩）。 */
  op?: ShiftChartOp;
  /** 押したときの時間。 */
  origin: ShiftChartTimes;
  /** 今の時間（kind="op"）。 */
  current: ShiftChartTimes;
  /** 新しく作っている時間帯（kind="new" と "take"）。 */
  draft?: ShiftChartSpan;
  /** kind="take" のときの提出の枠。 */
  frame?: ShiftChartSpan;
  /** 3px 以上動かしたか。 */
  moved: boolean;
  x0: number;
  left: number;
  width: number;
  anchor: number;
}

export interface ShiftChartDragOptions {
  range: () => readonly [number, number];
  step: () => number;
  limit: () => readonly [number, number];
  /** 離したとき（Escape で取り消したときは呼ばない）。 */
  onEnd: (state: ShiftChartDragState) => void;
}

export function useShiftChartDrag(o: ShiftChartDragOptions) {
  const state = shallowRef<ShiftChartDragState | null>(null);

  const minutesAt = (s: ShiftChartDragState, x: number) => {
    const r = o.range();
    return r[0] + ((x - s.left) / Math.max(1, s.width)) * (r[1] - r[0]);
  };

  function move(e: PointerEvent) {
    const s = state.value;
    if (!s) return;
    const dx = e.clientX - s.x0;
    const moved = s.moved || Math.abs(dx) >= 3;
    if (!moved) return;
    const r = o.range();
    const delta = (dx / Math.max(1, s.width)) * (r[1] - r[0]);
    if (s.kind === "op" && s.op) {
      state.value = { ...s, moved, current: applyOp(s.origin, s.op, delta, o.step(), o.limit()) };
    } else {
      state.value = { ...s, moved, draft: newSpan(s.anchor, minutesAt(s, e.clientX), o.step(), o.limit()) };
    }
  }
  function stop() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", cancel);
    window.removeEventListener("keydown", key, true);
  }
  function up() {
    const s = state.value;
    stop();
    state.value = null;
    if (s) o.onEnd(s);
  }
  function cancel() {
    stop();
    state.value = null;
  }
  function key(e: KeyboardEvent) {
    if (e.key !== "Escape") return;
    e.preventDefault();
    e.stopPropagation();
    cancel();
  }

  /**
   * ドラッグを始める。track は帯の場所（幅と左の位置を測る）。
   * 左のボタン（指・ペンはそのまま）だけ。
   */
  function begin(
    e: PointerEvent,
    track: HTMLElement,
    target: { key: string | number; kind: ShiftChartDragKind; op?: ShiftChartOp; origin: ShiftChartTimes; frame?: ShiftChartSpan },
  ) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const rect = track.getBoundingClientRect();
    e.preventDefault();
    e.stopPropagation();
    const base: ShiftChartDragState = {
      key: target.key,
      kind: target.kind,
      op: target.op,
      origin: target.origin,
      current: target.origin,
      frame: target.frame,
      moved: false,
      x0: e.clientX,
      left: rect.left,
      width: rect.width,
      anchor: 0,
    };
    base.anchor = minutesAt(base, e.clientX);
    state.value = base;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", key, true);
  }

  onBeforeUnmount(stop);
  return { state, begin, cancel };
}
