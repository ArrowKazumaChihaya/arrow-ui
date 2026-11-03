import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArItem from "../src/components/ArItem.vue";
import ArChangedValue from "../src/components/ArChangedValue.vue";
import ArSaveBar from "../src/components/ArSaveBar.vue";
import ArExample from "../src/components/ArExample.vue";
import ArApprovalFlow from "../src/components/ArApprovalFlow.vue";
import ArTable from "../src/components/ArTable.vue";
import { classicDesign } from "../../ui-design-classic/src/index";
import { remixDesign } from "../../ui-design-remix/src/index";

function inDesign(design: typeof classicDesign, comp: unknown, props: Record<string, unknown> = {}, slots?: Record<string, unknown>) {
  const App = defineComponent(() => () => h(ArUiProvider, { design, scope: "self" }, () => h(comp as never, props, slots as never)));
  return mount(App, { attachTo: document.body });
}

describe("P1：ArItem 1.1（行・？・間違い・未登録・変更あり）", () => {
  it("間違いは入力の aria-invalid と aria-describedby に結ぶ。変更ありで「元に戻す」が revert を出す", async () => {
    const w = mount(ArItem, {
      props: { title: "法定外残業", variant: "row", error: "25以上の数字にしてください", info: "25%以上", changed: true, caption: "補足" },
      slots: { default: ((c: Record<string, string>) => h("input", { ...c, "data-test": "x" })) as never },
    });
    const root = w.get('[data-ar="item"]');
    expect(root.attributes("data-variant")).toBe("row");
    expect(root.attributes("data-state")).toContain("changed");
    expect(root.attributes("data-state")).toContain("invalid");
    const input = w.get('[data-test="x"]');
    expect(input.attributes("aria-invalid")).toBe("true");
    const ids = input.attributes("aria-describedby")!.split(" ");
    expect(ids).toContain(w.get('[data-part="error"]').attributes("id"));
    expect(ids).toContain(w.get('[data-part="caption"]').attributes("id"));
    expect(w.get('[data-part="changed"]').text()).toBe("変更あり");
    await w.get('[data-part="aside"] [data-ar="button"]').trigger("click");
    expect(w.emitted("revert")).toHaveLength(1);
  });
  it("未登録は値の代わりに「未登録」と理由の札。？は help を出す", async () => {
    const w = mount(ArItem, { props: { title: "整理番号", unregistered: "源泉徴収票に必要です", help: "税務署から届く番号です" }, slots: { default: () => h("span", { "data-test": "v" }, "x") } });
    expect(w.find('[data-test="v"]').exists()).toBe(false);
    expect(w.get('[data-part="unregistered-text"]').text()).toBe("未登録");
    expect(w.get('[data-part="unregistered-why"]').text()).toBe("源泉徴収票に必要です");
    const help = w.get('[data-part="help"]');
    expect(help.attributes("aria-label")).toBe("整理番号の説明");
    await help.trigger("click");
    expect(w.emitted("help")).toHaveLength(1);
  });
});

describe("P1：ArChangedValue 1.1（表・一覧）", () => {
  const items = [
    { label: "シフト提出", before: "店舗/部署ごとに提出", after: "全ての店舗/部署に一括提出" },
    { label: "シフトサマリー計算期間", before: "月単位", after: "給与計算期間" },
  ];
  it("items を渡すと「項目｜変更前｜変更後」の表", () => {
    const w = mount(ArChangedValue, { props: { items } });
    expect(w.get('[data-ar="changed-value"]').attributes("data-layout")).toBe("table");
    expect(w.findAll("thead th").map((x) => x.text())).toEqual(["項目", "変更前", "変更後"]);
    const rows = w.findAll('tbody [data-part="row"]');
    expect(rows).toHaveLength(2);
    expect(rows[0]!.get('[data-part="label"]').text()).toBe("シフト提出");
    expect(rows[0]!.get('[data-part="before"]').element.tagName).toBe("S");
    expect(rows[0]!.get('[data-part="after"]').text()).toBe("全ての店舗/部署に一括提出");
  });
  it("list は1列の一覧。items がなければ今までの文の中の形", () => {
    const w = mount(ArChangedValue, { props: { items, layout: "list" } });
    expect(w.findAll('[data-part="row"]')).toHaveLength(2);
    expect(w.get('[data-part="head-cell"]').text()).toBe("項目（変更前 → 変更後）");
    const v = mount(ArChangedValue, { props: { before: "1,100円", after: "1,200円" } });
    expect(v.get('[data-ar="changed-value"]').attributes("data-state")).toBe("changed");
  });
});

describe("P1：ArSaveBar", () => {
  it("件数・項目名・直すところ。押すと save・discard・jump", async () => {
    const w = inDesign(remixDesign, ArSaveBar, { count: 2, items: ["法定外残業", "法定休日"], errorCount: 2 });
    expect(w.get('[data-part="count"]').text()).toBe("未保存の変更 2件");
    expect(w.get('[data-part="items"]').text()).toBe("法定外残業・法定休日");
    const btns = w.findAll('[data-ar="button"]');
    expect(btns.map((b) => b.text())).toEqual(["直すところ 2件", "変更を取り消す", "この内容で保存"]);
    await btns[0]!.trigger("click");
    await btns[1]!.trigger("click");
    await btns[2]!.trigger("click");
    const bar = w.findComponent(ArSaveBar);
    expect(bar.emitted("jump")).toHaveLength(1);
    expect(bar.emitted("discard")).toHaveLength(1);
    expect(bar.emitted("save")).toHaveLength(1);
    w.unmount();
  });
  it("classic は「キャンセル」「実行」だけ（件数は読み上げにだけ残す）", () => {
    const w = inDesign(classicDesign, ArSaveBar, { count: 1 });
    expect(w.get('[data-ar="save-bar"]').attributes("data-summary")).toBe("hidden");
    expect(w.findAll('[data-ar="button"]').map((b) => b.text())).toEqual(["キャンセル", "実行"]);
    w.unmount();
  });
});

describe("P1：ArExample", () => {
  it("box は見出しと「項目｜値」、inline は入力と結果", () => {
    const w = mount(ArExample, { props: { title: "時給1,100円の例", rows: [{ label: "法定外残業", value: "1,320円", tone: "accent" }] } });
    expect(w.get('[data-part="title"]').text()).toBe("時給1,100円の例");
    expect(w.get('[data-part="label"]').text()).toBe("法定外残業");
    expect(w.get('[data-part="value"]').attributes("data-tone")).toBe("accent");
    const v = mount(ArExample, { props: { variant: "inline", result: "勤務 09:00〜17:10" }, slots: { default: () => h("input", { "data-test": "i" }) } });
    expect(v.get('[data-part="title"]').text()).toBe("例で確かめる");
    expect(v.find('[data-part="inputs"] [data-test="i"]').exists()).toBe(true);
    expect(v.get('[data-part="result"]').attributes("aria-live")).toBe("polite");
    expect(v.get('[data-part="result"]').text()).toBe("勤務 09:00〜17:10");
  });
});

describe("P1：ArApprovalFlow", () => {
  const steps = [
    { title: "店長の承認", who: "末永 修也", state: "done" as const },
    { title: "人事の承認", who: "千速 一真", state: "current" as const },
    { title: "最終承認", who: "原 裕太", state: "todo" as const },
  ];
  it("list：番号の丸と状態の札。いまの番に aria-current", () => {
    const w = inDesign(remixDesign, ArApprovalFlow, { steps });
    const items = w.findAll('[data-part="item"]');
    expect(items).toHaveLength(3);
    expect(items[0]!.get('[data-part="mark"]').text()).toBe("✓");
    expect(items[1]!.attributes("aria-current")).toBe("step");
    expect(items.map((i) => i.get('[data-part="status"]').text())).toEqual(["承認済", "あなたの番", "まだ"]);
    w.unmount();
  });
  it("row：先頭の「申請」と › でつなぐ。classic は list も横の札", () => {
    const w = inDesign(remixDesign, ArApprovalFlow, { steps, layout: "row", start: "申請" });
    expect(w.get('[data-part="start"]').text()).toBe("申請");
    expect(w.findAll('[data-part="sep"]')).toHaveLength(3);
    w.unmount();
    const c = inDesign(classicDesign, ArApprovalFlow, { steps });
    expect(c.get('[data-ar="approval-flow"]').attributes("data-layout")).toBe("row");
    c.unmount();
  });
});

describe("P1：ArTable 1.1（集計表）", () => {
  type Row = { id: string; name: string; a: number; b: number; s: number[] };
  const rows: Row[] = [
    { id: "x", name: "末永", a: 100, b: 200, s: [1, 2, 3] },
    { id: "y", name: "松田", a: 300, b: 400, s: [4, 5, 6] },
  ];
  const columns = [
    { key: "name", title: "氏名", sticky: true },
    { key: "a", title: "基本給", group: "g", show: "open" as const, numeric: true, edit: true },
    { key: "b", title: "残業手当", group: "g", show: "open" as const, numeric: true },
    { key: "sum", title: "支給", group: "g", show: "closed" as const, numeric: true, value: (r: Row) => r.a + r.b, delta: () => ({ text: "+10（前月比）", tone: "warn" as const }) },
    { key: "s", title: "3段", stack: true },
    { key: "end", title: "反映", sticky: "end" as const, rowSpan: (_r: Row, i: number) => (i === 0 ? 2 : 0) },
  ];
  const groups = [{ key: "g", title: "支給", collapsible: true }];
  it("閉じたまとまりは1段の見出しの開くボタン。押すと update:openGroups", async () => {
    const w = mount(ArTable as never, { props: { columns, rows, rowKey: "id", caption: "給与", columnGroups: groups, openGroups: [] } } as never);
    expect(w.findAll("thead tr")).toHaveLength(1);
    const t = w.get('[data-part="group-toggle"]');
    expect(t.attributes("aria-expanded")).toBe("false");
    await t.trigger("click");
    expect(w.emitted("update:openGroups")![0]).toEqual([["g"]]);
    expect(w.get('[data-part="delta"]').attributes("data-tone")).toBe("warn");
  });
  it("開くと2段の見出し（上の段は colspan、ほかの列は rowspan=2）。入力は v-model:edits、直した欄は changed", async () => {
    const w = mount(ArTable as never, { props: { columns, rows, rowKey: "id", caption: "給与", columnGroups: groups, openGroups: ["g"], edits: { "x:a": "150" }, invalidCells: ["y:a"] } } as never);
    const trs = w.findAll("thead tr");
    expect(trs).toHaveLength(2);
    expect(trs[0]!.get("th[data-group-cell]").attributes("colspan")).toBe("2");
    expect(trs[0]!.get("th").attributes("rowspan")).toBe("2");
    expect(trs[1]!.findAll("th").map((x) => x.text())).toEqual(["基本給", "残業手当"]);
    const inputs = w.findAll('[data-part="cell-input"]');
    expect((inputs[0]!.element as HTMLInputElement).value).toBe("150");
    expect(inputs[0]!.attributes("data-state")).toBe("changed");
    expect(inputs[1]!.attributes("data-state")).toBe("invalid");
    await inputs[1]!.setValue("350");
    expect(w.emitted("update:edits")!.at(-1)).toEqual([{ "x:a": "150", "y:a": "350" }]);
  });
  it("右に止める列・行をまたぐセル・3段", () => {
    const w = mount(ArTable as never, { props: { columns, rows, rowKey: "id", caption: "給与", columnGroups: groups } } as never);
    expect(w.get('th[data-sticky="end"]').attributes("data-sticky-edge")).toBe("end");
    expect(w.get('th[data-sticky="start"]').attributes("data-sticky-edge")).toBe("start");
    const body = w.findAll('tbody [data-part="row"]');
    expect(body[0]!.findAll('td[data-sticky="end"]')).toHaveLength(1);
    expect(body[0]!.get('td[data-sticky="end"]').attributes("rowspan")).toBe("2");
    expect(body[1]!.findAll('td[data-sticky="end"]')).toHaveLength(0);
    expect(body[0]!.findAll('[data-part="stack"] > span').map((x) => x.text())).toEqual(["1", "2", "3"]);
  });
});
