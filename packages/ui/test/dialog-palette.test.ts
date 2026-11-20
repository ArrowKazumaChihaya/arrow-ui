import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ArModal from "../src/components/ArModal.vue";

describe("ArModal のテーマ色の引き継ぎ", () => {
  it("開いた状態で作られた（v-if で出した）モーダルも、置いた場所のテーマ色を出す先へ引き継ぐ", async () => {
    const Host = defineComponent({
      setup: () => () =>
        h("div", { "data-ar-palette": "orange" }, [h(ArModal, { open: true, title: "通知の詳細" }, () => "本文")]),
    });
    const w = mount(Host, { attachTo: document.body });
    await nextTick();
    await nextTick();
    const panel = document.body.querySelector('[data-ar="modal"]');
    expect(panel?.closest("[data-ar-palette]")?.getAttribute("data-ar-palette")).toBe("orange");
    w.unmount();
  });
});
