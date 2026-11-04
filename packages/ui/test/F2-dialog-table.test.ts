import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArTable from "../src/components/ArTable.vue";
import ArRadio from "../src/components/ArRadio.vue";
import ArRadioGroup from "../src/components/ArRadioGroup.vue";
import type { ArTableColumn, ArTableTimeRange } from "../src/components/ArTable.contract";

type P = { id: number | string; name: string; shift: ArTableTimeRange[]; rest: ArTableTimeRange[] };
const rows: P[] = [
  { id: 1, name: "通常勤務1", shift: [{ start: "10:00", end: "19:00" }], rest: [] },
  { id: 2, name: "中抜け", shift: [{ start: "09:00", end: "13:00" }, { start: "17:00", end: "21:00" }], rest: [] },
];
const columns: ArTableColumn<P>[] = [
  { key: "name", title: "パターン名", editor: "text" },
  { key: "shift", title: "シフト", editor: "time-range" },
  { key: "rest", title: "休憩", editor: "time-range" },
];

describe("F2：ダイアログの表（ArTable 1.3）と無効のラジオ", () => {
  it("time-range は1つの列に時間の組を段で出し、ほかの列は段をまたぐ", () => {
    const w = mount(ArTable<P>, { props: { columns, rows, rowKey: "id", caption: "シフトパターン", blank: "なし" } });
    const trs = w.findAll('tbody[data-part="body"]>tr[data-part="row"]');
    expect(trs).toHaveLength(3);
    expect(trs[1]!.text()).toContain("09:00〜13:00");
    expect(trs[2]!.text()).toContain("17:00〜21:00");
    expect(trs[0]!.text()).toContain("なし");
    expect(w.find('[data-part="cell-editor"]').exists()).toBe(false);
  });

  it("editing の行だけ入力になり、最後の組の下に空の組。× で組を消すと edits に入る", async () => {
    const w = mount(ArTable<P>, { props: { columns, rows, rowKey: "id", caption: "表", editing: [2] } });
    const editors = w.findAll('[data-part="cell-editor"][data-editor="time-range"]');
    // 中抜け：シフト 2組＋空1、休憩 空1（段は3つ）
    expect(editors).toHaveLength(4);
    expect(w.findAll('tbody>tr[data-part="row"]')).toHaveLength(4);
    expect(w.find('input[data-part="cell-input"][data-editor="text"]').element).toHaveProperty("value", "中抜け");
    await w.find('[data-part="line-remove"]').trigger("click");
    const ed = w.emitted("update:edits")!.at(-1)![0] as Record<string, ArTableTimeRange[]>;
    expect(ed["2:shift"]).toHaveLength(1);
    expect(ed["2:shift"]![0]).toMatchObject({ start: { time: "17:00" }, end: { time: "21:00" } });
  });

  it("確定は commit（空の組は除く）、取り消しは cancel とその行の edits を消す。Esc・Ctrl+Enter でも", async () => {
    const edits = { "2:name": "中抜け2", "1:name": "別の行" };
    const w = mount(ArTable<P>, { props: { columns, rows, rowKey: "id", caption: "表", editing: [2], edits } });
    const btns = w.findAll('[data-part="actions"][data-kind="edit"] button');
    expect(btns).toHaveLength(2);
    await btns[1]!.trigger("click");
    const c = w.emitted("commit")![0]![0] as { key: number; values: Record<string, unknown> };
    expect(c.key).toBe(2);
    expect(c.values.name).toBe("中抜け2");
    expect(c.values.shift).toHaveLength(2);
    expect(c.values.rest).toEqual([]);
    await btns[0]!.trigger("click");
    expect(w.emitted("cancel")).toHaveLength(1);
    expect(w.emitted("update:edits")!.at(-1)).toEqual([{ "1:name": "別の行" }]);
    const tr = w.findAll('tbody>tr[data-part="row"]')[1]!;
    await tr.trigger("keydown", { key: "Escape" });
    expect(w.emitted("cancel")).toHaveLength(2);
    await tr.trigger("keydown", { key: "Enter", ctrlKey: true });
    expect(w.emitted("commit")).toHaveLength(2);
  });

  it("並べ替え（sortableRows）は reorder と update:rows。入力の行があるあいだは、つまみを押せない", async () => {
    const w = mount(ArTable<P>, { props: { columns, rows, rowKey: "id", caption: "表", sortableRows: true } });
    await w.find('[data-part="drag-handle"]').trigger("keydown", { key: "ArrowDown", altKey: true });
    expect(w.emitted("reorder")![0]).toEqual([{ key: 1, from: 0, to: 1 }]);
    expect((w.emitted("update:rows")![0]![0] as P[]).map((r) => r.id)).toEqual([2, 1]);
    await w.setProps({ editing: [1] });
    expect(w.find('[data-part="drag-handle"]').attributes("disabled")).toBeDefined();
  });

  it("ArRadioGroup：無効のまとまり・無効の項目は、押しても・change が届いても値を出さない", async () => {
    const options = [{ value: "a", label: "A" }, { value: "b", label: "B", disabled: true }];
    const g = mount(ArRadioGroup, { props: { modelValue: "a", options, label: "選ぶ" } });
    const inputs = g.findAll("input");
    await g.findAll("label")[1]!.trigger("click");
    inputs[1]!.element.dispatchEvent(new Event("change"));
    expect(g.emitted("update:modelValue")).toBeUndefined();
    const all = mount(ArRadioGroup, { props: { modelValue: null, options, label: "選ぶ", disabled: true } });
    all.findAll("input")[0]!.element.dispatchEvent(new Event("change"));
    await all.findAll("label")[0]!.trigger("click");
    expect(all.emitted("update:modelValue")).toBeUndefined();
    // 使える項目は出す
    const ok = mount(ArRadioGroup, { props: { modelValue: "b", options: [{ value: "a", label: "A" }, { value: "b", label: "B" }], label: "選ぶ" } });
    ok.findAll("input")[0]!.element.dispatchEvent(new Event("change"));
    expect(ok.emitted("update:modelValue")![0]).toEqual(["a"]);
  });

  it("ArRadio：無効は押しても・change が届いても値を出さない", async () => {
    const r = mount(ArRadio, { props: { modelValue: "x", value: "y", disabled: true, label: "y" } });
    await r.find("label").trigger("click");
    r.find("input").element.dispatchEvent(new Event("change"));
    expect(r.emitted("update:modelValue")).toBeUndefined();
    const on = mount(ArRadio, { props: { modelValue: "x", value: "y", label: "y" } });
    on.find("input").element.dispatchEvent(new Event("change"));
    expect(on.emitted("update:modelValue")![0]).toEqual(["y"]);
  });
});
