import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";
import { remixDesign } from "../../ui-design-remix/src/index";
import type { ArDesign } from "../src/design";
import ArTable from "../src/components/ArTable.vue";
import ArTreeSelect from "../src/components/ArTreeSelect.vue";
import ArPeriodNav from "../src/components/ArPeriodNav.vue";
import ArPeriodBox from "../src/components/ArPeriodBox.vue";
import ArThumbnail from "../src/components/ArThumbnail.vue";
import ArUpload from "../src/components/ArUpload.vue";
import ArColorPicker from "../src/components/ArColorPicker.vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import type { ArTableColumn } from "../src/components/ArTable.contract";

/** デザインの形（forms）だけを変えて1つの部品を描く。 */
function withForms(forms: ArDesign["forms"], comp: unknown, props: Record<string, unknown> = {}) {
  const design = { ...remixDesign, forms } as ArDesign;
  const App = defineComponent(() => () => h(ArUiProvider, { design, scope: "self" }, () => h(comp as never, props)));
  return mount(App, { attachTo: document.body });
}

type Row = { id: number | "new"; name: string; pattern?: string; bs: string[]; be: string[]; start: string | null };
const rows: Row[] = [
  { id: "new", name: "", bs: [], be: [], start: null },
  { id: 1, name: "末永 修也", pattern: "通常勤務1", bs: ["12:00"], be: ["13:00"], start: "09:00" },
  { id: 2, name: "新里 匠", pattern: "通常勤務2", bs: ["13:00", "17:30"], be: ["13:45", "18:00"], start: "10:00" },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "名前", avatar: true, sub: (r) => (r.pattern ? { text: r.pattern, color: "#4C5FC4" } : undefined) },
  { key: "start", title: "開始", group: "shift", edit: (r) => r.id === "new", editor: "time" },
  { key: "bs", title: "休始", group: "break", lines: true },
  { key: "be", title: "休終", group: "break", lines: true },
];

describe("F2：製品からの指摘（ArTable・ArTreeSelect・ArPeriodNav・ArPeriodBox・ArThumbnail・ArUpload・ArColorPicker）", () => {
  it("ArTable：cell-<key> の Default で既定の表示（丸・名前・色の四角の sub）をそのまま描ける", () => {
    const w = mount(ArTable<Row>, {
      props: { columns, rows, rowKey: "id", caption: "勤務メンバー", variant: "board" },
      slots: {
        "cell-name": ({ row, Default }: { row: Row; Default: unknown }) =>
          row.id === "new" ? h("select", { "data-test": "add" }) : h(Default as never),
      },
    });
    expect(w.find('[data-test="add"]').exists()).toBe(true);
    const persons = w.findAll('td>[data-part="person"]');
    expect(persons).toHaveLength(2);
    expect(persons[0]!.find('[data-part="sub-mark"]').attributes("style")).toContain("background");
    expect(persons[0]!.text()).toContain("末永 修也");
  });

  it("ArTable：lines の列は行を段の tr に分け、段のない列は rowspan で段をまたぐ", () => {
    const w = mount(ArTable<Row>, { props: { columns, rows, rowKey: "id", caption: "表", columnGroups: [{ key: "shift", title: "シフト" }, { key: "break", title: "休憩" }] } });
    const trs = w.findAll('tbody[data-part="body"]>tr[data-part="row"]');
    // new(1段)・1(1段)・2(2段)
    expect(trs).toHaveLength(4);
    expect(trs[2]!.attributes("data-line")).toBe("0");
    expect(trs[3]!.attributes("data-line")).toBe("1");
    expect(trs[3]!.attributes("data-line-last")).toBe("");
    const nameTd = trs[2]!.findAll("td")[0]!;
    expect(nameTd.attributes("rowspan")).toBe("2");
    expect(trs[3]!.findAll("td").map((t) => t.text())).toEqual(["17:30", "18:00"]);
    // 2段の見出し
    expect(w.findAll('thead>tr')).toHaveLength(2);
    expect(w.findAll("th[data-group-cell]").map((t) => t.text())).toEqual(["シフト", "休憩"]);
  });

  it("ArTable：editor=time は表の中に時刻の入力を出し、v-model:edits に { time, day } を入れる", async () => {
    const w = mount(ArTable<Row>, { props: { columns, rows, rowKey: "id", caption: "表" } });
    const ed = w.find('[data-part="cell-editor"][data-editor="time"]');
    expect(ed.exists()).toBe(true);
    const input = ed.find("input");
    await input.setValue("0930");
    await input.trigger("blur");
    await input.trigger("keydown", { key: "Enter" });
    const ev = w.emitted("update:edits");
    expect(ev?.length).toBeGreaterThan(0);
    const last = ev!.at(-1)![0] as Record<string, unknown>;
    expect(Object.keys(last)).toContain("new:start");
    expect(last["new:start"]).toMatchObject({ day: "same" });
  });

  it("ArTable：editor=select・text と lead（「〜」）", () => {
    type R = { id: number; p: number | null; memo: string; end: string };
    const cols: ArTableColumn<R>[] = [
      { key: "p", title: "パターン", edit: true, editor: "select", options: [{ value: 1, label: "通常勤務1" }] },
      { key: "memo", title: "メモ", edit: true, editor: "text" },
      { key: "end", title: "", lead: "〜" },
    ];
    const w = mount(ArTable<R>, { props: { columns: cols, rows: [{ id: 1, p: 1, memo: "a", end: "19:00" }], rowKey: "id", caption: "表" } });
    expect(w.find('[data-part="cell-editor"][data-editor="select"]').text()).toContain("通常勤務1");
    expect(w.find('input[data-part="cell-input"][data-editor="text"]').element).toHaveProperty("value", "a");
    expect(w.find('[data-part="lead"]').text()).toBe("〜");
  });

  it("ArTable：並べ替えは v-model:sort（製品が状態を持つ）", async () => {
    const w = mount(ArTable<Row>, { props: { columns: [{ key: "name", title: "名前", sortable: true }], rows, rowKey: "id", caption: "表", sort: { key: "name", order: "asc" } } });
    await w.find('th button[data-part="sort"]').trigger("click");
    expect(w.emitted("update:sort")![0]).toEqual([{ key: "name", order: "desc" }]);
  });

  it("ArTreeSelect：子店舗を含める（v-model:includeChildren）・操作のボタン・未選択の行・選べない見出し", async () => {
    const tree = [
      { value: 1, label: "ARROW事業部", children: [{ value: 11, label: "渋谷店" }] },
      { value: 9, label: "見出し", selectable: false, children: [{ value: 91, label: "新宿店" }] },
    ];
    const w = mount(ArTreeSelect, {
      props: { modelValue: 1, tree, includeChildren: true, nullOption: "未選択", actions: [{ value: "add", label: "部署/店舗追加" }], defaultExpandAll: true },
      attachTo: document.body,
    });
    expect(w.find('[data-part="include-mark"]').text()).toBe("子店舗を含む");
    await w.get('[data-ar="tree-select"]').trigger("click");
    await flushPromises();
    const panel = document.body.querySelector('[data-ar="tree-select-panel"]')!;
    const box = panel.querySelector<HTMLInputElement>('[data-part="include"] input')!;
    box.click();
    expect(w.emitted("update:includeChildren")![0]).toEqual([false]);
    const nodes = [...panel.querySelectorAll<HTMLElement>('[data-part="node"]')];
    expect(nodes[0]!.textContent).toContain("未選択");
    nodes[0]!.click();
    expect(w.emitted("update:modelValue")!.at(-1)).toEqual([null]);
    w.unmount();
  });

  it("ArTreeSelect：選べない見出しは押しても値にしない・操作は action", async () => {
    const tree = [{ value: 9, label: "見出し", selectable: false, children: [{ value: 91, label: "新宿店" }] }];
    const w = mount(ArTreeSelect, { props: { modelValue: null, tree, actions: [{ value: "add", label: "部署/店舗追加" }] }, attachTo: document.body });
    await w.get('[data-ar="tree-select"]').trigger("click");
    await flushPromises();
    const panel = document.body.querySelector('[data-ar="tree-select-panel"]')!;
    panel.querySelector<HTMLElement>('[data-part="node"]')!.click();
    expect(w.emitted("update:modelValue")).toBeUndefined();
    panel.querySelector<HTMLElement>('[data-part="action"] button')!.click();
    expect(w.emitted("action")![0]).toEqual(["add"]);
    w.unmount();
  });

  it("ArPeriodNav：date と holidays から曜日の札と祝日の色・名前を決める", () => {
    const w = mount(ArPeriodNav, { props: { label: "11月3日", date: "2026-11-03", holidays: { "2026-11-03": "文化の日" }, size: "lg" } });
    const wd = w.find('[data-part="weekday"]');
    expect(wd.text()).toBe("火");
    expect(wd.attributes("data-tone")).toBe("sun");
    expect(w.find('[data-part="holiday"]').text()).toBe("文化の日");
    const sat = mount(ArPeriodNav, { props: { label: "11月7日", date: "2026-11-07", holidays: ["2026-11-03"] } });
    expect(sat.find('[data-part="weekday"]').attributes("data-tone")).toBe("sat");
    const plain = mount(ArPeriodNav, { props: { label: "11月4日", date: "2026-11-04", holidays: ["2026-11-03"] } });
    expect(plain.find('[data-part="weekday"]').attributes("data-tone")).toBeUndefined();
  });

  it("ArPeriodBox：1か月・半月にそろえ、合わない日付はカスタムに。適用は apply", async () => {
    const w = mount(ArPeriodBox, { props: { modelValue: { mode: "month", start: "2026-11-01", end: "2026-11-30" }, label: "期間", applyText: "適用" } });
    const seg = w.findAll('[data-ar="segmented"] [role="radio"]');
    await seg[1]!.trigger("click");
    expect(w.emitted("update:modelValue")![0]).toEqual([{ mode: "half", start: "2026-11-01", end: "2026-11-15" }]);
    await w.find('[data-part="apply"] button').trigger("click");
    expect(w.emitted("apply")![0]).toEqual([{ mode: "month", start: "2026-11-01", end: "2026-11-30" }]);
  });

  it("ArPeriodBox：classic の形（nav）は月の切り替えと前半・後半", async () => {
    const w = withForms({ ArPeriodBox: { layout: "nav" } }, ArPeriodBox, { modelValue: { mode: "half", start: "2026-11-16", end: "2026-11-30" }, label: "期間", applyText: "適用" });
    const box = w.findComponent(ArPeriodBox);
    expect(box.attributes("data-layout")).toBe("nav");
    await box.find('[data-part="arrow"][data-dir="next"]').trigger("click");
    expect(box.emitted("update:modelValue")![0]).toEqual([{ mode: "half", start: "2026-12-16", end: "2026-12-31" }]);
    expect(box.find('[data-part="apply-arrow"]').exists()).toBe(true);
    expect(box.text()).not.toContain("カスタム");
    w.unmount();
  });

  it("ArThumbnail：v-model:open で開け閉め、dialogOnly は画像を出さない、aspect=crop は比の高さ", async () => {
    const w = mount(ArThumbnail, { props: { modelValue: null, open: false, dialogOnly: true, teleportTo: null } as never });
    expect(w.find('[data-part="silhouette"]').exists()).toBe(false);
    expect(w.find('[data-part="camera"]').exists()).toBe(false);
    const c = mount(ArThumbnail, { props: { modelValue: null, size: 300, aspect: "crop", cropWidth: 300, cropHeight: 189, placeholder: "picture" } });
    expect(c.attributes("style")).toContain("--ar-thumbnail-height: 189px");
    expect(c.find('[data-part="silhouette"]').attributes("data-kind")).toBe("picture");
    const o = mount(ArThumbnail, { props: { modelValue: null } });
    await o.find('[data-part="camera"]').trigger("click");
    expect(o.emitted("update:open")).toBeUndefined();
  });

  it("ArUpload（button の形）：選んだあとは「ファイルを変更」と「選択中: 名前」", () => {
    const w = withForms({ ArUpload: { trigger: "button" } }, ArUpload, { files: [{ id: 1, name: "shift.xlsx", status: "done" }], accept: ".xlsx" });
    expect(w.find('[data-part="button"]').text()).toContain("ファイルを変更");
    expect(w.find('[data-part="chosen"]').text()).toBe("選択中: shift.xlsx");
    w.unmount();
  });

  it("ArColorPicker：palette=arrow（classic）は colors を省くと今の48色", async () => {
    const w = withForms({ ArColorPicker: { panel: "dialog", palette: "arrow" } }, ArColorPicker, { modelValue: null, label: "色" });
    await w.get('[data-ar="color-picker"] button').trigger("click");
    await flushPromises();
    expect(document.body.querySelectorAll('[data-ar="color-swatches"] [data-part="swatch"]').length).toBe(48);
    w.unmount();
  });
});
