import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { describe, expect, it } from "vitest";
import ArImage from "../src/components/ArImage.vue";
import ArModal from "../src/components/ArModal.vue";

describe("画像プレビューと説明ダイアログ", () => {
  it("プレビューを閉じても親のスクロール制限を維持し、画像ボタンへ戻る", async () => {
    const modal = mount(ArModal, {
      props: { open: true, title: "書類の説明" },
      slots: { default: () => h(ArImage, { src: "/document.png", alt: "支払金額" }) },
      attachTo: document.body,
    });
    try {
      await nextTick();
      const image = modal.findComponent(ArImage);
      const trigger = image.get<HTMLButtonElement>("button");
      trigger.element.focus();
      await trigger.trigger("click");
      await nextTick();
      const viewer = document.querySelector<HTMLElement>('[data-ar="image"][data-part="viewer"]');
      expect(viewer).not.toBeNull();
      expect(viewer?.contains(document.activeElement)).toBe(true);
      viewer?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await nextTick();
      expect(document.querySelector('[data-ar="image"][data-part="viewer"]')).toBeNull();
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(true);
      expect(document.activeElement).toBe(trigger.element);
      expect(modal.emitted("update:open")).toBeUndefined();
      await trigger.trigger("keydown", { key: "Escape" });
      expect(modal.emitted("update:open")).toEqual([[false]]);
      await modal.setProps({ open: false });
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(false);
    } finally {
      modal.unmount();
    }
  });

  it("最初から開いた画像も数え、複数表示の片方を閉じても残りを維持する", async () => {
    const first = mount(ArImage, { props: { src: "/first.png", alt: "一枚目", previewOpen: true }, attachTo: document.body });
    const second = mount(ArImage, { props: { src: "/second.png", alt: "二枚目", previewOpen: true }, attachTo: document.body });
    try {
      await nextTick();
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(true);
      await first.setProps({ previewOpen: false });
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(true);
      second.unmount();
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(false);
    } finally {
      first.unmount();
      second.unmount();
    }
  });
});
