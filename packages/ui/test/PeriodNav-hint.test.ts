import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import ArPeriodNav from "../src/components/ArPeriodNav.vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import { remixDesign } from "../../ui-design-remix/src/index";

afterEach(() => {
  document.body.innerHTML = "";
});

function host(props: Record<string, unknown>) {
  return defineComponent({
    render: () => h(ArUiProvider, { design: remixDesign, scope: "self" }, () => h(ArPeriodNav, { label: "2026年11月25日支給", ...props })),
  });
}

describe("ArPeriodNav：hint（計算期間など）を真ん中の文字に乗せたときに出す", () => {
  it("文字に乗せると、その文字を指す1行の吹き出しを出し、外すと消す", async () => {
    const w = mount(host({ hint: "計算期間 2026/10/21 〜 2026/11/20", pickable: true }), { attachTo: document.body });
    const label = w.get('[data-part="label"]');
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await label.trigger("mouseenter");
    await nextTick();
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip?.textContent).toContain("計算期間 2026/10/21 〜 2026/11/20");
    expect(tip?.querySelector('[data-part="panel"]')?.hasAttribute("data-wide")).toBe(true);
    // 吹き出しは「前へ」のボタンではなく、真ん中の文字を指す（読み上げの説明もこの文字に付く）。
    expect(label.attributes("aria-describedby")).toBe(tip?.id);
    expect(w.get('[data-dir="prev"]').attributes("aria-describedby")).toBeUndefined();
    await label.trigger("mouseleave");
    await nextTick();
    await new Promise((r) => setTimeout(r, 150));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    w.unmount();
  });

  it("hint が無ければ吹き出しを作らず、並びも変えない", async () => {
    const w = mount(host({}), { attachTo: document.body });
    await w.get('[data-part="label"]').trigger("mouseenter");
    await nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    expect(w.findAll('[data-ar="tooltip"]')).toHaveLength(0);
    w.unmount();
  });
});
