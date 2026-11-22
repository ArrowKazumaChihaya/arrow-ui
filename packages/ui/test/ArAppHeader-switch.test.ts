import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArAppHeader from "../src/components/ArAppHeader.vue";

const menus = [
  { key: "payroll", label: "給与計算", children: [{ key: "payment", label: "給与" }] },
  { key: "employee", label: "社員情報", children: [{ key: "list", label: "社員一覧" }] },
];
function items(w: ReturnType<typeof mount>) {
  const found = w.findAll('[data-part="item"]');
  const [payroll, employee] = [found[0], found[1]];
  if (!payroll || !employee) throw new Error("menu items");
  return [payroll, employee] as const;
}
/** jsdom には PointerEvent が無いので、マウスの印を付けた MouseEvent で代える。 */
function pointer(type: string): Event {
  const event = new MouseEvent(type, { bubbles: type === "pointerdown" });
  Object.defineProperty(event, "pointerType", { value: "mouse" });
  return event;
}
const enter = (el: Element) => el.dispatchEvent(pointer("pointerenter"));

describe("ArAppHeader の子メニューの切り替え", () => {
  it("押して開いたまま別の項目へ移って押すと、1回で別の子メニューが開く", async () => {
    const w = mount(ArAppHeader, { props: { menus }, attachTo: document.body });
    const [payroll, employee] = items(w);
    enter(payroll.element);
    await payroll.trigger("click");
    expect(payroll.attributes("aria-expanded")).toBe("true");
    enter(employee.element);
    employee.element.dispatchEvent(pointer("pointerdown"));
    (employee.element as HTMLElement).focus();
    await employee.trigger("click");
    expect(employee.attributes("aria-expanded")).toBe("true");
    expect(payroll.attributes("aria-expanded")).toBe("false");
    w.unmount();
  });

  it("Escape で、フォーカスが項目に無くても開いた一覧を閉じる", async () => {
    const w = mount(ArAppHeader, { props: { menus }, attachTo: document.body });
    const [payroll] = items(w);
    await payroll.trigger("click");
    expect(payroll.attributes("aria-expanded")).toBe("true");
    document.body.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await w.vm.$nextTick();
    expect(payroll.attributes("aria-expanded")).toBe("false");
    w.unmount();
  });
});
