import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArDropdown from "../src/components/ArDropdown.vue";
import ArMenu from "../src/components/ArMenu.vue";
import ArPagination from "../src/components/ArPagination.vue";
import ArSteps from "../src/components/ArSteps.vue";
import ArBreadcrumb from "../src/components/ArBreadcrumb.vue";
import ArAnchor from "../src/components/ArAnchor.vue";
import type { ArMenuItem } from "../src/components/ArMenu.contract";

const ops: ArMenuItem[] = [
  { key: "g", type: "group", label: "登録する", children: [{ key: "recruit", label: "シフト募集", icon: "mega", description: "従業員に希望シフトを出してもらう" }] },
  { key: "pub", label: "公開期間設定", locked: true },
  { key: "hr", type: "divider" },
  { key: "del", label: "シフト一括削除", icon: "trash", danger: true },
];

describe("ArDropdown", () => {
  it("押すと menu が出て、↓で移り Enter で選ぶ。権限なしは選べない", async () => {
    const w = mount(ArDropdown, { props: { items: ops, label: "操作", variant: "ops", icon: "hand" }, attachTo: document.body });
    const trigger = w.get('[data-part="trigger"]');
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    await trigger.trigger("click");
    await nextTick();
    await nextTick();
    const menu = document.querySelector('[data-ar="dropdown-menu"]')!;
    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.querySelector('[data-part="group"]')?.textContent).toBe("登録する");
    expect(menu.querySelector('[data-part="list"]')?.hasAttribute("data-rich")).toBe(true);
    const items = menu.querySelectorAll<HTMLElement>('[role="menuitem"]');
    expect(items[1]!.getAttribute("aria-disabled")).toBe("true");
    items[1]!.click();
    expect(w.emitted("select")).toBeUndefined();
    items[2]!.click();
    expect(w.emitted("select")?.[0]?.[0]).toBe("del");
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    w.unmount();
  });
  it("split は左のボタンで click、右でメニュー", async () => {
    const w = mount(ArDropdown, { props: { items: ops, label: "保存", variant: "split", tone: "primary" }, attachTo: document.body });
    const btns = w.findAll('[data-ar="button"]');
    await btns[0]!.trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
    await btns[1]!.trigger("click");
    expect(w.emitted("update:open")?.[0]).toEqual([true]);
    w.unmount();
  });
});

describe("ArMenu", () => {
  const items: ArMenuItem[] = [
    { key: "shift", label: "シフト", icon: "cal" },
    { key: "pay", label: "給与賞与", icon: "calc", children: [{ key: "slip", label: "給与明細" }, { key: "bonus", label: "賞与明細" }] },
    { key: "nencho", label: "年調", locked: true },
  ];
  it("inline：親を押すと開き、子を選ぶと selected。上の段の選択は level 0", async () => {
    const w = mount(ArMenu, { props: { items, selected: "shift", label: "ページ" } });
    expect(w.get('[data-key="shift"]').attributes("aria-current")).toBe("page");
    expect(w.get('[data-key="shift"]').attributes("data-level")).toBe("0");
    expect(w.find('[data-key="slip"]').exists()).toBe(false);
    await w.get('[data-key="pay"]').trigger("click");
    expect(w.emitted("update:openKeys")?.[0]).toEqual([["pay"]]);
    expect(w.get('[data-key="slip"]').attributes("data-level")).toBe("1");
    await w.get('[data-key="slip"]').trigger("click");
    expect(w.emitted("update:selected")?.[0]).toEqual(["slip"]);
    await w.get('[data-key="nencho"]').trigger("click");
    expect(w.emitted("select")).toHaveLength(1);
  });
  it("選んでいる子の親は最初から開いている。←で親へ戻る", async () => {
    const w = mount(ArMenu, { props: { items, selected: "bonus", label: "ページ" }, attachTo: document.body });
    expect(w.get('[data-key="pay"]').attributes("aria-expanded")).toBe("true");
    expect(w.get('[data-key="pay"]').attributes("data-state")).toContain("active");
    await w.get('[data-key="bonus"]').trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement?.getAttribute("data-key")).toBe("pay");
    w.unmount();
  });
  it("horizontal は menubar", () => {
    const w = mount(ArMenu, { props: { items, mode: "horizontal", label: "サービス" } });
    expect(w.attributes("role")).toBe("menubar");
  });
});

describe("ArPagination", () => {
  it("1 … 4 5 6 … 20 と並び、押すと update:page と change", async () => {
    const w = mount(ArPagination, { props: { page: 5, total: 386, pageSize: 20 } });
    expect(w.findAll('[data-part="page"]').map((b) => b.text())).toEqual(["1", "4", "5", "6", "20"]);
    expect(w.findAll('[data-part="ellipsis"]')).toHaveLength(2);
    expect(w.get('[aria-current="page"]').text()).toBe("5");
    await w.get('[data-part="next"]').trigger("click");
    expect(w.emitted("update:page")?.[0]).toEqual([6]);
    expect(w.emitted("change")?.[0]).toEqual([6, 20]);
  });
  it("最初のページでは前へが押せない。1ページだけなら隠せる", () => {
    const w = mount(ArPagination, { props: { page: 1, total: 30, pageSize: 20, showTotal: true } });
    expect(w.get('[data-part="prev"]').attributes("disabled")).toBeDefined();
    expect(w.get('[data-part="total"]').text()).toBe("全 30 件");
    const h = mount(ArPagination, { props: { page: 1, total: 5, hideOnSinglePage: true } });
    expect(h.find('[data-ar="pagination"]').exists()).toBe(false);
  });
});

describe("ArSteps", () => {
  it("current から状態を決め、clickable なら済んだ手順へ戻れる", async () => {
    const w = mount(ArSteps, { props: { current: 1, clickable: true, size: "mini", items: [{ title: "期間" }, { title: "確認" }, { title: "送る" }] } });
    const steps = w.findAll('[data-part="step"]');
    expect(steps.map((s) => s.attributes("data-status"))).toEqual(["finish", "process", "wait"]);
    expect(steps[1]!.attributes("aria-current")).toBe("step");
    expect(w.findAll('[data-part="connector"]')).toHaveLength(2);
    await steps[0]!.get("button").trigger("click");
    expect(w.emitted("update:current")?.[0]).toEqual([0]);
    expect(steps[2]!.find("button").exists()).toBe(false);
  });
  it("status=error で今の手順を赤に", () => {
    const w = mount(ArSteps, { props: { current: 0, status: "error", items: [{ title: "送る" }] } });
    expect(w.get('[data-part="step"]').attributes("data-status")).toBe("error");
    expect(w.get('[data-part="icon"]').text()).toBe("!");
  });
});

describe("ArBreadcrumb・ArAnchor", () => {
  it("最後の項目は今のページ", () => {
    const w = mount(ArBreadcrumb, { props: { items: [{ label: "設定", href: "/s" }, { label: "渋谷店" }] } });
    expect(w.get('[aria-current="page"]').text()).toBe("渋谷店");
    expect(w.findAll('[data-part="separator"]')).toHaveLength(1);
  });
  it("Anchor は押した項目を今いるところにする", async () => {
    const w = mount(ArAnchor, { props: { items: [{ key: "a", href: "#a", label: "基本" }, { key: "b", href: "#b", label: "契約" }] } });
    expect(w.findAll('[data-part="link"]')[0]!.attributes("aria-current")).toBe("location");
    await w.findAll('[data-part="link"]')[1]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["b"]);
  });
});
