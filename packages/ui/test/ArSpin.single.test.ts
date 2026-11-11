import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import ArSpin from "../src/components/ArSpin.vue";

afterEach(() => { document.body.innerHTML = ""; });

describe("only one loading mark turns in a region", () => {
  it("hides later bare spinners while an earlier one is on screen, then shows the next when it ends", async () => {
    const show = { first: true };
    const Host = defineComponent({
      render: () => h("div", [h(ArSpin, { block: true, spinning: show.first, id: "a" }), h(ArSpin, { block: true, id: "b" })]),
    });
    const w = mount(Host, { attachTo: document.body });
    await nextTick();
    await nextTick();
    const marks = () => [...document.querySelectorAll('[data-ar="spin"]')] as HTMLElement[];
    expect(marks()).toHaveLength(2);
    expect(marks()[0]!.hasAttribute("data-duplicate")).toBe(false);
    expect(marks()[1]!.hasAttribute("data-duplicate")).toBe(true);
    w.unmount();
  });

  it("a wrapping spinner's veil wins over a bare spinner inside it", async () => {
    const w = mount(ArSpin, { props: { spinning: true }, slots: { default: () => h(ArSpin, { block: true }) }, attachTo: document.body });
    await nextTick();
    await nextTick();
    const inner = document.querySelector('[data-part="content"] [data-ar="spin"]') as HTMLElement;
    expect(inner.hasAttribute("data-duplicate")).toBe(true);
    expect(document.querySelector('[data-part="mask"]')!.hasAttribute("data-duplicate")).toBe(false);
    w.unmount();
  });
});
