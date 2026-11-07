import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArPdfViewer from "../src/components/ArPdfViewer.vue";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("PDF paper width", () => {
  it("fits the viewport at 100% and keeps the same base width when magnified", async () => {
    let available = 1200;
    let resize = () => {};
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect() {}
    });
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("data-part") === "viewport" ? available : Math.min(759, available);
    });
    const wrapper = mount(ArPdfViewer, { props: { fitWidth: 759 } });
    await nextTick();
    expect(wrapper.get<HTMLElement>('[data-part="paper"]').element.style.width).toBe("759px");
    available = 271;
    resize();
    await nextTick();
    expect(wrapper.get<HTMLElement>('[data-part="paper"]').element.style.width).toBe("271px");
    await wrapper.get('[data-part="zoom-in"]').trigger("click");
    expect(wrapper.get<HTMLElement>('[data-part="paper"]').element.style.width).toBe("271px");
    expect(wrapper.get('[data-part="zoom-value"]').text()).toBe("125%");
    wrapper.unmount();
  });
  it("updates a canvas slot's width without resetting page or applying zoom twice", async () => {
    let width = 759;
    let resize = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect = disconnect;
    });
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("data-part") === "paper" ? width : 0;
    });
    const wrapper = mount(ArPdfViewer, {
      props: { pageCount: 2 },
      slots: { page: ({ page, width }) => h("canvas", { "data-page": page, width }) },
    });
    await nextTick();
    expect(wrapper.get("canvas").attributes("width")).toBe("759");
    await wrapper.get('[data-part="next"]').trigger("click");
    await wrapper.get('[data-part="zoom-in"]').trigger("click");
    width = 271;
    resize();
    await nextTick();
    expect(wrapper.get("canvas").attributes()).toMatchObject({ width: "271", "data-page": "2" });
    expect(wrapper.get('[data-part="zoom-value"]').text()).toBe("125%");
    width = 759;
    resize();
    await nextTick();
    expect(wrapper.get("canvas").attributes("width")).toBe("759");
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("leaves width unset for a hidden paper and disconnects when switching to an iframe", async () => {
    const disconnect = vi.fn();
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect = disconnect; });
    const wrapper = mount(ArPdfViewer, {
      slots: { page: ({ width }) => h("canvas", { width }) },
    });
    await nextTick();
    expect(wrapper.get("canvas").attributes("width")).toBeUndefined();
    await wrapper.setProps({ src: "/sample.pdf" });
    await nextTick();
    expect(disconnect).toHaveBeenCalled();
    expect(wrapper.find("canvas").exists()).toBe(false);
    wrapper.unmount();
  });
});
