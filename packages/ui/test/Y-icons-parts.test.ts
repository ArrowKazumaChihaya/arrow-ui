import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArIcon from "../src/components/ArIcon.vue";
import ArTable from "../src/components/ArTable.vue";
import ArTreeTable from "../src/components/ArTreeTable.vue";
import ArDateView from "../src/components/ArDateView.vue";
import ArDocumentBlock from "../src/components/ArDocumentBlock.vue";
import ArLogoSpin from "../src/components/ArLogoSpin.vue";
import { defineDesign, type ArDesign } from "../src/design";
import { icons } from "../src/icons";
import { classicDesign } from "../../ui-design-classic/src/index";
import { remixDesign } from "../../ui-design-remix/src/index";

/** デザインを当てて1つの部品を描く。 */
function inDesign(design: ArDesign, comp: unknown, props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const App = defineComponent(() => () => h(ArUiProvider, { design, scope: "self" }, () => h(comp as never, props, slots as never)));
  return mount(App, { attachTo: document.body });
}

describe("Y：デザインが持つアイコンの絵", () => {
  it("classic は今の ARROW の絵を描き、remix は線のアイコンのまま", () => {
    const c = inDesign(classicDesign, ArIcon, { name: "pointer" });
    const svg = c.get('[data-ar="icon"]');
    expect(svg.attributes("data-source")).toBe("design");
    expect(svg.attributes("viewBox")).toBe("0 0 512 512");
    expect(svg.attributes("fill")).toBe("currentColor");
    expect(svg.html()).not.toContain("<style");
    c.unmount();
    const r = inDesign(remixDesign, ArIcon, { name: "pointer" });
    expect(r.get('[data-ar="icon"]').attributes("data-source")).toBeUndefined();
    expect(r.get('[data-ar="icon"]').attributes("viewBox")).toBe("0 0 24 24");
    r.unmount();
  });

  it("line を付けると classic でも線で描く（部品の中の印）", () => {
    const c = inDesign(classicDesign, ArIcon, { name: "check", line: true });
    expect(c.get('[data-ar="icon"]').attributes("data-source")).toBeUndefined();
    expect(c.get('[data-ar="icon"]').attributes("stroke")).toBe("currentColor");
    c.unmount();
  });

  it("classic の絵の名前はすべてライブラリのアイコンの名前で、<style> を含まない", () => {
    for (const [name, svg] of Object.entries(classicDesign.icons ?? {})) {
      expect(Object.keys(icons)).toContain(name);
      expect(svg).toMatch(/^<svg viewBox="[^"]+">/);
      expect(svg).not.toMatch(/<style|<script|\sclass=/);
    }
    expect(classicDesign.icons?.unlock).toBeTruthy();
  });

  it("defineDesign は形の崩れた絵や <style> の入った絵を受け付けない", () => {
    const bad = { ...remixDesign, id: "bad", icons: { x: '<svg viewBox="0 0 1 1"><style>.a{}</style></svg>' } } as ArDesign;
    expect(() => defineDesign(bad)).toThrow(/<style>/);
    const bad2 = { ...remixDesign, id: "bad2", icons: { x: "<path d='M0 0'/>" } } as ArDesign;
    expect(() => defineDesign(bad2)).toThrow(/viewBox/);
  });
});

type R = { id: number; name: string };
const rows: R[] = [
  { id: 1, name: "早番" },
  { id: 2, name: "遅番" },
  { id: 3, name: "夜勤" },
];

describe("Y：ArTable の行の並べ替え", () => {
  it("つまみで Alt+↓ を押すと1つ下へ動かし update:rows と reorder を出す", async () => {
    const w = mount(ArTable, { props: { columns: [{ key: "name", title: "名称" }], rows, rowKey: "id", caption: "勤務種別", sortableRows: true } as never });
    const handles = w.findAll('[data-part="drag-handle"]');
    expect(handles).toHaveLength(3);
    await handles[0]!.trigger("keydown", { key: "ArrowDown", altKey: true });
    expect((w.emitted("update:rows")![0]![0] as R[]).map((r) => r.id)).toEqual([2, 1, 3]);
    expect(w.emitted("reorder")![0]![0]).toEqual({ key: 1, from: 0, to: 1 });
    // いちばん上で Alt+↑ は動かない
    await handles[0]!.trigger("keydown", { key: "ArrowUp", altKey: true });
    expect(w.emitted("reorder")).toHaveLength(1);
    // Alt なしの矢印は何もしない
    await handles[1]!.trigger("keydown", { key: "ArrowDown" });
    expect(w.emitted("reorder")).toHaveLength(1);
  });

  it("つまみをつかんで別の行の下へ落とすと、その後ろへ動かす", async () => {
    const w = mount(ArTable, { props: { columns: [{ key: "name", title: "名称" }], rows, rowKey: "id", caption: "勤務種別", sortableRows: true } as never });
    const trs = w.findAll('[data-part="row"]');
    await w.findAll('[data-part="drag-handle"]')[0]!.trigger("mousedown");
    await trs[0]!.trigger("dragstart", { dataTransfer: { setData() {}, effectAllowed: "" } });
    await trs[2]!.trigger("dragover", { clientY: 0 });
    await trs[2]!.trigger("drop");
    expect(w.emitted("reorder")![0]![0]).toEqual({ key: 1, from: 0, to: 2 });
  });

  it("つまみの置き場所はデザインが決める（remix は専用の列、classic は1列目の頭）", () => {
    const props = { columns: [{ key: "name", title: "名称" }], rows, rowKey: "id", caption: "表", sortableRows: true };
    const r = inDesign(remixDesign, ArTable, props);
    expect(r.findAll('td[data-col="drag"] [data-part="drag-handle"]')).toHaveLength(3);
    r.unmount();
    const c = inDesign(classicDesign, ArTable, props);
    expect(c.findAll('td[data-col="drag"]')).toHaveLength(0);
    expect(c.findAll('td:not([data-col]) > [data-part="drag-handle"]')).toHaveLength(3);
    c.unmount();
  });
});

type T = { id: number; name: string; children?: T[] };
const tree: T[] = [
  { id: 1, name: "本社", children: [{ id: 11, name: "営業部" }, { id: 12, name: "総務部" }] },
  { id: 2, name: "渋谷店" },
];
const cols = [{ key: "name", title: "店舗名" }];

describe("Y：ArTreeTable", () => {
  it("既定ですべて開き、深さ・開け閉めを読み上げに出す。開け閉めのボタンで閉じる", async () => {
    const w = mount(ArTreeTable, { props: { columns: cols, rows: tree, rowKey: "id", caption: "店舗" } as never });
    const trs = w.findAll('tbody[data-part="body"] > [data-part="row"]');
    expect(trs.map((t) => t.attributes("aria-level"))).toEqual(["1", "2", "2", "1"]);
    expect(trs[0]!.attributes("aria-expanded")).toBe("true");
    expect(w.get('[role="treegrid"]').attributes("aria-label")).toBe("店舗");
    await w.get('[data-part="toggle"][data-state="open"]').trigger("click");
    expect(w.findAll('tbody[data-part="body"] > [data-part="row"]')).toHaveLength(2);
    expect(w.emitted("update:expanded")![0]![0]).toEqual([]);
  });

  it("キーボード：← で閉じ、→ で開く", async () => {
    const w = mount(ArTreeTable, { props: { columns: cols, rows: tree, rowKey: "id", caption: "店舗" } as never, attachTo: document.body });
    const first = w.get('[data-part="row"]');
    await first.trigger("keydown", { key: "ArrowLeft" });
    expect(w.findAll('tbody[data-part="body"] > [data-part="row"]')).toHaveLength(2);
    await w.get('[data-part="row"]').trigger("keydown", { key: "ArrowRight" });
    expect(w.findAll('tbody[data-part="body"] > [data-part="row"]')).toHaveLength(4);
    w.unmount();
  });

  it("つまみで Alt+→ を押すと、すぐ上の行の子にした木を update:rows で渡す", async () => {
    const w = mount(ArTreeTable, { props: { columns: cols, rows: tree, rowKey: "id", caption: "店舗", draggable: true } as never });
    const handle = w.findAll('[data-part="drag-handle"]').find((x) => x.attributes("data-key") === "12")!;
    await handle.trigger("keydown", { key: "ArrowRight", altKey: true });
    expect(w.emitted("drop")![0]![0]).toEqual({ key: 12, target: 11, position: "inside" });
    const next = w.emitted("update:rows")![0]![0] as T[];
    expect(next[0]!.children!.map((c) => c.id)).toEqual([11]);
    expect(next[0]!.children![0]!.children!.map((c) => c.id)).toEqual([12]);
    expect(tree[0]!.children).toHaveLength(2); // 元のデータは変えない
  });

  it("Alt+← で親の後ろへ出し、自分の下の行の中へは動かせない", async () => {
    const w = mount(ArTreeTable, { props: { columns: cols, rows: tree, rowKey: "id", caption: "店舗", draggable: true } as never });
    const h11 = w.findAll('[data-part="drag-handle"]').find((x) => x.attributes("data-key") === "11")!;
    await h11.trigger("keydown", { key: "ArrowLeft", altKey: true });
    const next = w.emitted("update:rows")![0]![0] as T[];
    expect(next.map((r) => r.id)).toEqual([1, 11, 2]);
    const h1 = w.findAll('[data-part="drag-handle"]').find((x) => x.attributes("data-key") === "1")!;
    await h1.trigger("keydown", { key: "ArrowLeft", altKey: true }); // 親がない
    expect(w.emitted("update:rows")).toHaveLength(1);
  });

  it("classic は開け閉めを四角の −／＋（toggle box）にする", () => {
    const c = inDesign(classicDesign, ArTreeTable, { columns: cols, rows: tree, rowKey: "id", caption: "店舗" });
    expect(c.findAll('[data-part="toggle-box"]')).toHaveLength(1);
    c.unmount();
    const r = inDesign(remixDesign, ArTreeTable, { columns: cols, rows: tree, rowKey: "id", caption: "店舗" });
    expect(r.findAll('[data-part="toggle-box"]')).toHaveLength(0);
    r.unmount();
  });
});

describe("Y：ArDateView・ArDocumentBlock・ArLogoSpin", () => {
  it.each(["", "not-a-date", "2026-13-01", "2026-02-30", new Date(NaN)])("ArDateView rejects invalid dates instead of displaying NaN: %s", (date) => {
    expect(() => mount(ArDateView, { props: { date }, global: { config: { warnHandler: () => {} } } })).toThrow(RangeError);
  });
  it("ArDateView：翻訳した書式と曜日を使い、短い表示の曜日を省略できる", async () => {
    const w = mount(ArDateView, { props: { date: "2026-11-03", format: "long", holiday: true, labels: { long: "{day}.{month}.{year}", short: "{day}/{month}", weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } } });
    expect(w.text()).toBe("03.11.2026(Tue)");
    expect(w.get('[data-part="weekday"]').attributes("data-tone")).toBe("sun");
    expect(w.attributes("datetime")).toBe("2026-11-03");
    await w.setProps({ format: "short", shortWeekday: false });
    expect(w.text()).toBe("03/11");
    expect(w.find('[data-part="weekday"]').exists()).toBe(false);
    w.unmount();
  });
  it("ArDateView：「11月05日(木)」、土曜は sat、日曜と祝日は sun", () => {
    const w = mount(ArDateView, { props: { date: "2026-11-05", format: "long" } });
    expect(w.text()).toBe("11月05日(木)");
    expect(w.get("time").attributes("datetime")).toBe("2026-11-05");
    expect(w.get('[data-part="weekday"]').attributes("data-tone")).toBeUndefined();
    expect(mount(ArDateView, { props: { date: "2026-11-07", format: "long" } }).get('[data-part="weekday"]').attributes("data-tone")).toBe("sat");
    expect(mount(ArDateView, { props: { date: "2026-11-08", format: "short" } }).text()).toBe("11/08(日)");
    expect(mount(ArDateView, { props: { date: "2026-11-03", holiday: true, format: "long" } }).get('[data-part="weekday"]').attributes("data-tone")).toBe("sun");
  });

  it("ArDocumentBlock：見出しと中身、arrow で矢印", () => {
    const w = mount(ArDocumentBlock, { props: { instruction: "確認してください" }, slots: { default: "中身" } });
    expect(w.get('[data-part="title"]').text()).toBe("確認してください");
    expect(w.find('[data-part="arrow"]').exists()).toBe(true);
    expect(mount(ArDocumentBlock, { props: { arrow: false } }).find('[data-part="arrow"]').exists()).toBe(false);
  });

  it("ArLogoSpin：読み込み中を読み上げ、ロゴは製品の SVG（slot）か画像（src）", () => {
    const w = mount(ArLogoSpin, { props: { motion: "circle" }, slots: { default: '<svg viewBox="0 0 10 10"><path data-logo="ring" d="M0 0h1"/></svg>' } });
    expect(w.attributes("role")).toBe("status");
    expect(w.attributes("aria-label")).toBe("読み込み中");
    expect(w.attributes("data-motion")).toBe("circle");
    expect(w.find('[data-logo="ring"]').exists()).toBe(true);
    const i = mount(ArLogoSpin, { props: { src: "/logo.svg", motion: "blink" } });
    expect(i.get("img").attributes("src")).toBe("/logo.svg");
  });
});

