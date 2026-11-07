import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import ArSectionMenu from "../src/components/ArSectionMenu.vue";
import ArSelect from "../src/components/ArSelect.vue";

describe("section menu scroll position", () => {
  it.each([false, true])("selects the final existing section at the scroll boundary (nested: %s)", async (nested) => {
    const host = document.createElement("div");
    document.body.append(host);
    if (nested) host.style.overflowY = "auto";
    const top = vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
    const height = vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(window.innerHeight + 500);
    Object.defineProperties(host, {
      scrollHeight: { value: 800 },
      clientHeight: { value: 300 },
    });
    const w = mount(ArSectionMenu, {
      props: {
        scroll: true,
        items: [
          { key: "first-section", label: "最初" },
          { key: "last-section", label: "末尾" },
          { key: "missing-section", label: "非表示" },
        ],
      },
      slots: { default: () => [h("section", { id: "first-section" }), h("section", { id: "last-section" })] },
      attachTo: host,
    });
    const first = vi.spyOn(w.get("#first-section").element, "getBoundingClientRect").mockReturnValue({ top: -100 } as DOMRect);
    const last = vi.spyOn(w.get("#last-section").element, "getBoundingClientRect").mockReturnValue({ top: 200 } as DOMRect);
    const scroll = async () => {
      (nested ? host : document).dispatchEvent(new Event("scroll"));
      await nextTick();
    };
    try {
      await scroll();
      expect(w.getComponent(ArSelect).props("modelValue")).toBe("first-section");
      if (nested) host.scrollTop = 500;
      else top.mockReturnValue(500);
      await scroll();
      expect(w.getComponent(ArSelect).props("modelValue")).toBe("last-section");
      if (nested) host.scrollTop = 300;
      else top.mockReturnValue(300);
      await scroll();
      expect(w.getComponent(ArSelect).props("modelValue")).toBe("first-section");
    } finally {
      w.unmount();
      first.mockRestore(); last.mockRestore(); top.mockRestore(); height.mockRestore();
      host.remove();
    }
  });
});
