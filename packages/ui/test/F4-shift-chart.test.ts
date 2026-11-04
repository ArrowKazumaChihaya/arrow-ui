import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArShiftChart from "../src/components/ArShiftChart.vue";
import { applyOp, fitRange, hourly, newSpan, shortSpans, workMinutes } from "../src/internal/shiftChartTime";

const H = (h: number, m = 0) => h * 60 + m;
const rows = () => [
  { key: 1, name: "千速 一真", color: "#D2483F", shifts: [{ id: 11, start: H(13), end: H(22) }], breaks: [{ id: 21, start: H(17), end: H(18) }] },
  { key: 2, name: "末永 修也", shifts: [{ id: 12, start: H(9), end: H(18) }] },
  { key: 3, name: "松田 照恵", available: [{ start: H(10), end: H(15) }] },
];

describe("shiftChartTime（時間の計算）", () => {
  it("移動は間隔の目盛りに乗り、長さと中の休憩を保つ", () => {
    const o = { shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] };
    const t = applyOp(o, { kind: "move", index: 0 }, 37, 15);
    expect(t.shifts[0]).toEqual({ start: H(13, 30), end: H(22, 30) });
    expect(t.breaks[0]).toEqual({ start: H(17, 30), end: H(18, 30) });
  });
  it("両端は間隔より短くならず、休憩はシフトの中へ押される", () => {
    const o = { shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] };
    expect(applyOp(o, { kind: "end", index: 0 }, -H(20), 15).shifts[0]).toEqual({ start: H(13), end: H(13, 15) });
    const t = applyOp(o, { kind: "start", index: 0 }, H(4, 30), 15);
    expect(t.shifts[0]!.start).toBe(H(17, 30));
    expect(t.breaks[0]).toEqual({ start: H(17, 30), end: H(18, 30) });
  });
  it("休憩の移動と伸縮はシフトの中だけ", () => {
    const o = { shifts: [{ start: H(9), end: H(18) }], breaks: [{ start: H(12), end: H(13) }] };
    expect(applyOp(o, { kind: "break-move", index: 0 }, H(10), 15).breaks[0]).toEqual({ start: H(17), end: H(18) });
    expect(applyOp(o, { kind: "break-end", index: 0 }, 30, 15).breaks[0]).toEqual({ start: H(12), end: H(13, 30) });
    expect(applyOp(o, { kind: "break-start", index: 0 }, H(2), 15).breaks[0]).toEqual({ start: H(12, 45), end: H(13) });
  });
  it("となりのシフトに重ならない", () => {
    const o = { shifts: [{ start: H(9), end: H(12) }, { start: H(17), end: H(21) }], breaks: [] };
    expect(applyOp(o, { kind: "end", index: 0 }, H(8), 15).shifts[0]!.end).toBe(H(17));
  });
  it("空いた行のドラッグ・範囲・人数と不足", () => {
    expect(newSpan(H(10, 7), H(9), 15)).toEqual({ start: H(9), end: H(10) });
    expect(newSpan(H(10), H(10, 2), 15)).toEqual({ start: H(10), end: H(10, 15) });
    expect(fitRange([{ start: H(9), end: H(22) }])).toEqual([H(8), H(23)]);
    const people = [
      { shifts: [{ start: H(9), end: H(18) }], breaks: [{ start: H(12), end: H(13) }] },
      { shifts: [{ start: H(13), end: H(22) }], breaks: [] },
    ];
    const needs = [{ start: H(9), end: H(22), count: 2 }];
    const h = hourly(people, needs, [H(11), H(14)]);
    expect(h.map((x) => [x.count, x.need, x.short])).toEqual([[1, 2, 1], [0, 2, 2], [2, 2, 0]]);
    expect(shortSpans(people, needs, [H(11), H(14)])).toEqual([{ start: H(11), end: H(12), count: 1 }, { start: H(12), end: H(13), count: 2 }]);
    expect(workMinutes(people[0]!)).toBe(H(8));
  });
});

describe("ArShiftChart", () => {
  it("バーはパターンの色・読み上げは「名前 時刻〜時刻」、休憩とつまみを出す", () => {
    const w = mount(ArShiftChart, { props: { rows: rows(), range: [H(8), H(23)] as [number, number] } });
    const bars = w.findAll('[data-part="bar"]');
    expect(bars).toHaveLength(2);
    expect(bars[0]!.attributes("aria-label")).toBe("千速 一真 13:00〜22:00");
    expect(bars[0]!.attributes("style")).toContain("--ar-shift-chart-bar: #D2483F");
    expect(bars[0]!.text()).toBe("13:00–22:00");
    expect(w.findAll('[data-part="break"]')).toHaveLength(1);
    expect(w.findAll('[data-part="handle"]')).toHaveLength(4);
    expect(w.find('[data-part="available"]').text()).toContain("提出 10:00–15:00");
  });
  it("キーボード：← → で動かし Enter で change、Escape で戻す", async () => {
    const w = mount(ArShiftChart, { props: { rows: rows(), range: [H(8), H(23)] as [number, number] } });
    const bar = () => w.findAll('[data-part="bar"]')[0]!;
    await bar().trigger("keydown", { key: "ArrowRight" });
    await bar().trigger("keydown", { key: "ArrowRight", shiftKey: true });
    expect(bar().attributes("aria-label")).toBe("千速 一真 13:15〜22:30");
    await bar().trigger("keydown", { key: "Enter" });
    const ev = w.emitted("change")![0]![0] as { shifts: unknown[]; breaks: unknown[]; keyboard: boolean };
    expect(ev.shifts).toEqual([{ id: 11, start: H(13, 15), end: H(22, 30) }]);
    expect(ev.breaks).toEqual([{ id: 21, start: H(17, 15), end: H(18, 15) }]);
    expect(ev.keyboard).toBe(true);
    await bar().trigger("keydown", { key: "ArrowLeft" });
    await bar().trigger("keydown", { key: "Escape" });
    expect(bar().attributes("aria-label")).toBe("千速 一真 13:00〜22:00");
    expect(w.emitted("change")).toHaveLength(1);
  });
  it("ドラッグで移動し、離すと change", async () => {
    const w = mount(ArShiftChart, { props: { rows: rows(), range: [H(8), H(23)] as [number, number] }, attachTo: document.body });
    const track = w.findAll('[data-part="track"]')[1]!.element as HTMLElement;
    track.getBoundingClientRect = () => ({ left: 0, width: 900, top: 0, height: 46, right: 900, bottom: 46, x: 0, y: 0, toJSON: () => ({}) });
    await w.findAll('[data-part="bar"]')[1]!.trigger("pointerdown", { clientX: 100, button: 0 });
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 160 }));
    await nextTick();
    expect(w.findAll('[data-part="bar"]')[1]!.attributes("aria-label")).toBe("末永 修也 10:00〜19:00");
    window.dispatchEvent(new MouseEvent("pointerup", { clientX: 160 }));
    await nextTick();
    const ev = w.emitted("change")![0]![0] as { shifts: unknown[]; part: string; action: string };
    expect(ev.shifts).toEqual([{ id: 12, start: H(10), end: H(19) }]);
    expect([ev.part, ev.action]).toEqual(["shift", "move"]);
    w.unmount();
  });
  it("シフトのない行：Enter で add、提出の枠は Enter で take", async () => {
    const w = mount(ArShiftChart, { props: { rows: rows(), range: [H(8), H(23)] as [number, number] } });
    const track = w.findAll('[data-part="track"]')[2]!;
    expect(track.attributes("role")).toBe("button");
    await track.trigger("keydown", { key: "Enter" });
    expect((w.emitted("add")![0]![0] as { span: unknown }).span).toEqual({ start: H(10), end: H(15) });
    await w.find('[data-part="available"]').trigger("keydown", { key: "Enter" });
    expect((w.emitted("take")![0]![0] as { span: unknown }).span).toEqual({ start: H(10), end: H(15) });
  });
  it("読み取り専用：つまみ・操作の行・押せる枠を出さない", () => {
    const w = mount(ArShiftChart, { props: { rows: rows(), readonly: true } });
    expect(w.findAll('[data-part="handle"]')).toHaveLength(0);
    expect(w.find('[data-part="toolbar"]').exists()).toBe(false);
    expect(w.find('[data-part="bar"]').attributes("tabindex")).toBeUndefined();
    expect(w.findAll('[data-part="track"]')[2]!.attributes("role")).toBeUndefined();
  });
  it("人数・募集・不足の行とまとめ", () => {
    const w = mount(ArShiftChart, {
      props: { rows: rows(), range: [H(9), H(12)] as [number, number], needs: [{ start: H(9), end: H(12), count: 2 }] },
    });
    const cells = w.findAll('[data-kind="count"] [data-part="cell"]');
    expect(cells.map((c) => c.find("b").text())).toEqual(["1", "1", "1"]);
    expect(cells[0]!.attributes("data-tone")).toBe("short");
    expect(w.find('[data-kind="short"]').text()).toContain("1人");
    expect(w.find('[data-part="summary"]').attributes("data-tone")).toBe("danger");
    expect(w.find('[data-part="summary-status"]').text()).toBe("募集より少ない時間 3時間");
  });
  it("シフトに合わせる・表示の範囲・間隔を返す", async () => {
    const w = mount(ArShiftChart, { props: { rows: rows() } });
    const fit = w.findAll("button").find((b) => b.text() === "シフトに合わせる")!;
    await fit.trigger("click");
    expect(w.emitted("update:range")![0]).toEqual([[H(8), H(23)]]);
  });
  it("ほかの店舗：切り替えで行を出し入れする", async () => {
    const w = mount(ArShiftChart, {
      props: { rows: [...rows(), { key: 9, name: "他 店子", others: [{ label: "渋谷店", start: H(10), end: H(15) }] }], othersToggle: true, others: false, readonly: true },
    });
    expect(w.text()).not.toContain("他 店子");
    await w.setProps({ others: true });
    expect(w.find('[data-part="other"]').text()).toContain("渋谷店");
  });
});
