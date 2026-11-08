import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArSpin from "../src/components/ArSpin.vue";

afterEach(() => { vi.restoreAllMocks(); });

describe("wrapping spinner focus", () => {
  function setup() {
    const wrapper = mount(ArSpin, {
      props: { spinning: false },
      slots: { default: () => h("button", "Continue") },
      attachTo: document.body,
    });
    const control = wrapper.get("button").element;
    vi.spyOn(control, "getClientRects").mockReturnValue([{}] as unknown as DOMRectList);
    control.focus();
    return { wrapper, control };
  }
  it("restores the keyboard target after inert removed focus, without scrolling", async () => {
    const { wrapper, control } = setup();
    await wrapper.setProps({ spinning: true });
    expect(wrapper.get('[data-part="content"]').attributes()).toHaveProperty("inert");
    control.blur(); // jsdom does not implement inert's focus removal.
    const focus = vi.spyOn(control, "focus");
    await wrapper.setProps({ spinning: false });
    await nextTick();
    expect(document.activeElement).toBe(control);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    wrapper.unmount();
  });
  it("does not steal focus from another control", async () => {
    const { wrapper } = setup();
    const outside = document.createElement("button");
    document.body.append(outside);
    await wrapper.setProps({ spinning: true });
    outside.focus();
    await wrapper.setProps({ spinning: false });
    await nextTick();
    expect(document.activeElement).toBe(outside);
    wrapper.unmount(); outside.remove();
  });
  it.each(["removed", "disabled", "hidden", "inert"])("does not restore an unavailable %s target", async (state) => {
    const { wrapper, control } = setup();
    await wrapper.setProps({ spinning: true });
    control.blur();
    if (state === "removed") control.remove();
    if (state === "disabled") control.disabled = true;
    if (state === "hidden") control.hidden = true;
    if (state === "inert") wrapper.element.setAttribute("inert", "");
    await wrapper.setProps({ spinning: false });
    await nextTick();
    expect(document.activeElement).not.toBe(control);
    wrapper.unmount();
  });
});
