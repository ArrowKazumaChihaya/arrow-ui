import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ArBottomNav from "../src/components/ArBottomNav.vue";

const items = [
  { key: "shift", label: "シフト", icon: "cal", children: [{ key: "view", label: "シフト" }, { key: "submit", label: "シフト提出" }] },
  { key: "att", label: "勤怠", icon: "clock" },
  { key: "menu", label: "メニュー", icon: "menu" },
] as const;

describe("ArBottomNav の子の段", () => {
  it("開いている間は幕を出して後ろを止め、押した項目だけを選んだ色にする", async () => {
    const w = mount(ArBottomNav, { props: { items: items as never, current: "menu" }, attachTo: document.body });
    const [shift, , menu] = w.findAll('[data-part="item"]');
    expect(menu!.attributes("data-state")).toBe("on");
    await shift!.trigger("click");
    await nextTick();
    expect(document.querySelector('[data-ar="bottom-nav-scrim"]')).not.toBeNull();
    expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(true);
    expect(menu!.attributes("data-state")).toBeUndefined();
    expect(shift!.attributes("data-state")).toBe("open");

    (document.querySelector('[data-ar="bottom-nav-scrim"]') as HTMLElement).click();
    await nextTick();
    expect(document.querySelector('[data-ar="bottom-nav-scrim"]')).toBeNull();
    expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(false);
    expect(menu!.attributes("data-state")).toBe("on");
    w.unmount();
  });

  it("開いたまま外されても、後ろを止めたままにしない", async () => {
    const w = mount(ArBottomNav, { props: { items: items as never }, attachTo: document.body });
    await w.findAll('[data-part="item"]')[0]!.trigger("click");
    await nextTick();
    w.unmount();
    expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(false);
  });
});
