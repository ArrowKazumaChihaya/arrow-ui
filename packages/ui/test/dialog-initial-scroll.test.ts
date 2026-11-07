import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArModal from "../src/components/ArModal.vue";

describe("dialog opening position", () => {
  it("keeps a long explanation at the start instead of focusing its offscreen link", async () => {
    const origin = document.createElement("button");
    document.body.append(origin);
    origin.focus();
    const restore = vi.spyOn(origin, "focus");
    const bounds = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const top = this.tagName === "A" ? 800 : 100;
      const height = this.tagName === "A" ? 24 : 300;
      return { x: 0, y: top, top, bottom: top + height, left: 0, right: 300, width: 300, height, toJSON: () => ({}) };
    });
    const w = mount(ArModal, {
      props: { open: false, title: "長い説明", teleportTo: null },
      slots: { default: '<p>最初に読む説明</p><a href="#reference">参考資料</a>' },
      attachTo: document.body,
    });
    try {
      await w.setProps({ open: true });
      await nextTick();
      const body = w.get<HTMLElement>('[data-part="body"]').element;
      expect(document.activeElement).toBe(body);
      expect(body.scrollTop).toBe(0);
      await w.setProps({ open: false });
      expect(document.activeElement).toBe(origin);
      expect(restore).toHaveBeenCalledWith({ preventScroll: true });
    } finally {
      w.unmount();
      bounds.mockRestore();
      restore.mockRestore();
      origin.remove();
    }
  });

  it("still focuses the visible first input without moving its scroll container", async () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const w = mount(ArModal, {
      props: { open: false, title: "編集", teleportTo: null },
      slots: { default: '<input aria-label="名前" />' },
      attachTo: document.body,
    });
    try {
      await w.setProps({ open: true });
      await nextTick();
      expect(document.activeElement).toBe(w.get("input").element);
      expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    } finally {
      w.unmount();
      focus.mockRestore();
    }
  });
});
