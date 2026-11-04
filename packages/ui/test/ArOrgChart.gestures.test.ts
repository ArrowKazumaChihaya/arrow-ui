import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import ArOrgChart from "../src/components/ArOrgChart.vue";

const nodes = [{ key: "a", label: "本部", children: [{ key: "b", label: "店舗" }] }];
function setup(wheelMode: "pan" | "zoom" = "pan") {
  const wrapper = mount(ArOrgChart, { props: { nodes, wheelMode } });
  const viewport = wrapper.get('[data-part="viewport"]');
  Object.defineProperty(viewport.element, "getBoundingClientRect", { value: () => ({ left: 0, top: 0, width: 500, height: 400 }) });
  Object.defineProperty(wrapper.get('[data-part="canvas"]').element, "offsetTop", { value: 40 });
  return { wrapper, viewport, style: () => wrapper.get('[data-part="canvas"]').attributes("style") };
}

describe("organization chart navigation", () => {
  it("pans ordinary wheel movement and anchors modified wheel zoom to the pointer", async () => {
    const { wrapper, viewport, style } = setup();
    await nextTick();
    await viewport.trigger("wheel", { deltaX: 20, deltaY: 40 });
    expect(style()).toContain("-20px), -40px) scale(1)");
    await viewport.trigger("wheel", { deltaY: -1, ctrlKey: true, clientX: 350, clientY: 140 });
    expect(style()).toContain("-32px), -54px) scale(1.1)");
    wrapper.unmount();
  });
  it("keeps the default wheel-zoom behavior", async () => {
    const { wrapper, viewport } = setup("zoom");
    await nextTick();
    await viewport.trigger("wheel", { deltaY: -1 });
    expect(wrapper.emitted("update:zoom")?.at(-1)).toEqual([1.1]);
    wrapper.unmount();
  });
  it("supports a two-pointer pinch and subsequent one-finger pan without selecting a node", async () => {
    const { wrapper, viewport, style } = setup();
    await nextTick();
    await viewport.trigger("pointerdown", { pointerId: 1, button: 0, clientX: 200, clientY: 140 });
    await viewport.trigger("pointerdown", { pointerId: 2, button: 0, clientX: 300, clientY: 140 });
    await viewport.trigger("pointermove", { pointerId: 2, clientX: 400, clientY: 140 });
    expect(style()).toContain("50px), -100px) scale(2)");
    await viewport.trigger("pointerup", { pointerId: 2 });
    await viewport.trigger("pointermove", { pointerId: 1, clientX: 210, clientY: 150 });
    expect(style()).toContain("60px), -90px) scale(2)");
    await viewport.trigger("pointerup", { pointerId: 1 });
    await wrapper.get('[data-part="node"]').trigger("click", { detail: 1 });
    expect(wrapper.emitted("select")).toBeUndefined();
    await wrapper.get('[data-part="node"]').trigger("click", { detail: 0 });
    expect(wrapper.emitted("select")?.length).toBe(1);
    wrapper.unmount();
  });
  it("opens newly fetched branches while preserving explicitly collapsed ones", async () => {
    const wrapper = mount(ArOrgChart, { props: { nodes: [] } });
    await wrapper.setProps({ nodes });
    expect(wrapper.findAll('[data-part="node"]').length).toBe(2);
    await wrapper.get('[data-part="toggle"]').trigger("click");
    await wrapper.setProps({ nodes: [...nodes, { key: "c", label: "支部", children: [{ key: "d", label: "店舗2" }] }] });
    expect(wrapper.findAll('[data-part="name"]').map((n) => n.text())).toEqual(["本部", "支部", "店舗2"]);
    wrapper.unmount();
  });
});
