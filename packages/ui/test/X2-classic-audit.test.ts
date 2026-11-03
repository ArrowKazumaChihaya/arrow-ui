import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArPeriodNav from "../src/components/ArPeriodNav.vue";
import ArTabs from "../src/components/ArTabs.vue";
import ArPagination from "../src/components/ArPagination.vue";
import ArCalendar from "../src/components/ArCalendar.vue";
import ArAppHeader from "../src/components/ArAppHeader.vue";
import ArTable from "../src/components/ArTable.vue";
import ArModal from "../src/components/ArModal.vue";
import ArThumbnail from "../src/components/ArThumbnail.vue";
import { classicDesign } from "../../ui-design-classic/src/index";
import { remixDesign } from "../../ui-design-remix/src/index";
import type { ArDesign } from "../src/design";

/** デザインを当てて1つの部品を描く。 */
function inDesign(design: ArDesign, comp: unknown, props: Record<string, unknown> = {}) {
  const App = defineComponent(() => () => h(ArUiProvider, { design, scope: "self" }, () => h(comp as never, props)));
  return mount(App, { attachTo: document.body });
}

describe("X2：classic の監査で足した形と動き", () => {
  it("ArPeriodNav：arrows=false で前へ・次へを出さない、inverse で data-inverse", () => {
    const w = mount(ArPeriodNav, { props: { label: "2026年11月", arrows: false } });
    expect(w.findAll('[data-part="arrow"]')).toHaveLength(0);
    expect(w.get('[data-ar="period-nav"]').attributes("data-arrows")).toBe("none");
    const v = mount(ArPeriodNav, { props: { label: "0002 山田 太郎", inverse: true, nextDisabled: true } });
    expect(v.get('[data-ar="period-nav"]').attributes("data-inverse")).toBe("");
    expect(v.findAll('[data-part="arrow"]')).toHaveLength(2);
    expect(v.get('[data-dir="next"]').attributes("disabled")).toBeDefined();
  });

  it("ArTabs：alert の項目は文字の右に注意の印（読み上げの名前つき）", () => {
    const w = mount(ArTabs, {
      props: { modelValue: "a", label: "表示", variant: "band", items: [{ key: "a", label: "カレンダー", alert: true }, { key: "b", label: "一覧" }] },
    });
    const marks = w.findAll('[data-part="alert"]');
    expect(marks).toHaveLength(1);
    expect(marks[0]!.attributes("aria-label")).toBe("要確認");
  });

  it("ArPagination：simple は入力欄に打って Enter でそのページへ", async () => {
    const w = mount(ArPagination, { props: { page: 3, total: 120, pageSize: 10, simple: true } });
    expect(w.findAll('[data-part="page"]')).toHaveLength(0);
    expect(w.get('[data-part="last"]').text()).toBe("12");
    const input = w.get('[data-part="jump"]');
    (input.element as HTMLInputElement).value = "7";
    await input.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:page")?.[0]).toEqual([7]);
  });

  it("ArCalendar：range を渡すと期間を含む週だけを並べ、期間の外は前後の月と同じ扱い", () => {
    const w = mount(ArCalendar, {
      props: { month: "2026-11", modelValue: "2026-11-05", range: { start: "2026-11-02", end: "2026-11-28" }, showHeader: false },
    });
    const cells = w.findAll('[data-part="cell"]');
    expect(cells).toHaveLength(28);
    expect(w.get('[data-date="2026-11-01"]').attributes("data-state")).toContain("adjacent");
    expect(w.get('[data-date="2026-11-02"]').attributes("data-state") ?? "").not.toContain("adjacent");
  });

  it("ArCalendar：classic は 1 日を「11/1」と月を添えて書く（期間の外も）", () => {
    const props = { month: "2026-11", range: { start: "2026-11-02", end: "2026-11-28" }, showHeader: false };
    const c = inDesign(classicDesign, ArCalendar, props);
    expect(c.get('[data-date="2026-11-01"] [data-part="day"]').text()).toBe("11/1");
    c.unmount();
    const r = inDesign(remixDesign, ArCalendar, props);
    expect(r.get('[data-date="2026-11-01"] [data-part="day"]').text()).toBe("1");
    r.unmount();
  });

  it("ArAppHeader：領域のタブ・畳む・子のメニュー・ピルの一覧", async () => {
    const w = mount(ArAppHeader, {
      attachTo: document.body,
      props: {
        menus: [{ key: "emp", label: "社員情報", children: [{ key: "list", label: "社員一覧" }] }],
        pills: [{ key: "todo", label: "やることリスト", tone: "todo", items: [{ key: "t1", label: "住民税改定" }] }],
        domains: [{ key: "hr", label: "人事・労務" }, { key: "ex", label: "経費精算" }],
        domain: "hr",
        collapsible: true,
      },
    });
    await w.findAll('[data-part="domain"]')[1]!.trigger("click");
    expect(w.emitted("domain")?.[0]).toEqual(["ex"]);
    await w.get('[data-part="toggle"]').trigger("click");
    expect(w.emitted("update:collapsed")?.[0]).toEqual([true]);
    await w.get('[data-part="item"]').trigger("pointerenter");
    await nextTick();
    expect(w.get('[data-part="submenu"]').text()).toContain("社員一覧");
    await w.get('[data-part="submenu-item"]').trigger("click");
    expect(w.emitted("navigate")?.[0]?.[0]).toBe("list");
    await w.get('[data-part="pill"]').trigger("pointerenter");
    await nextTick();
    await w.get('[data-part="pill-item"]').trigger("click");
    expect(w.emitted("pill-item")?.[0]).toEqual(["todo", "t1"]);
    await w.setProps({ collapsed: true });
    expect(w.find('[data-part="domains"]').exists()).toBe(false);
    expect(w.find('[data-part="expand"]').exists()).toBe(true);
    w.unmount();
  });

  it("ArTable：classic は見出しのチェックの左に「全選択」", () => {
    const props = { columns: [{ key: "a", title: "A" }], rows: [{ id: 1, a: "x" }], rowKey: "id", caption: "表", selectable: true };
    const c = inDesign(classicDesign, ArTable, props);
    expect(c.get('[data-part="select-text"]').text()).toBe("全選択");
    c.unmount();
    const r = inDesign(remixDesign, ArTable, props);
    expect(r.find('[data-part="select-text"]').exists()).toBe(false);
    r.unmount();
  });

  it("ArModal：classic の足のボタンは 2 文字の漢字に空白（antd と同じ「登 録」）、印の名前を data-icon に出す", async () => {
    const props = { open: true, title: "登録", okText: "登録", teleportTo: null, icon: "help" };
    const c = inDesign(classicDesign, ArModal, props);
    await nextTick();
    expect(c.get("[data-ok]").text()).toBe("登 録");
    expect(c.get('[data-part="icon"]').attributes("data-icon")).toBe("help");
    c.unmount();
    const r = inDesign(remixDesign, ArModal, props);
    await nextTick();
    expect(r.get("[data-ok]").text()).toBe("登録");
    r.unmount();
  });

  it("ArThumbnail：classic の切り抜きは「ファイル未選択」と真ん中の登録（足のボタンなし）", async () => {
    const c = inDesign(classicDesign, ArThumbnail, { modelValue: null, editable: true });
    await c.get('[data-part="camera"]').trigger("click");
    await nextTick();
    const ed = document.querySelector('[data-ar="thumbnail-editor"]')!;
    expect(ed.getAttribute("data-form")).toBe("arrow");
    expect(ed.querySelector('[data-part="file"]')?.textContent).toBe("ファイル未選択");
    expect(ed.querySelector('[data-part="submit"]')).not.toBeNull();
    c.unmount();
  });
});
