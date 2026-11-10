import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref, shallowRef } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArTimeInput from "../src/components/ArTimeInput.vue";
import type { ArTimeValue } from "../src/components/ArTimeInput.contract";
import { classicDesign } from "../../ui-design-classic/src/index";
import { remixDesign } from "../../ui-design-remix/src/index";

function setup(split: boolean, time: string | null) {
  const design = shallowRef(split ? classicDesign : remixDesign);
  const value = ref<ArTimeValue>({ time, day: "same" });
  const changes: ArTimeValue[] = [];
  const Host = defineComponent(() => () => h(ArUiProvider, { design: design.value, scope: "self" }, () => h(ArTimeInput, {
    modelValue: value.value, overnight: true,
    "onUpdate:modelValue": (next: ArTimeValue) => { value.value = next; changes.push(next); },
  })));
  const wrapper = mount(Host, { attachTo: document.body });
  return { wrapper, design, value, changes };
}
const inputValue = (node: { element: Element }) => (node.element as HTMLInputElement).value;

describe("time input drafts across design shapes", () => {
  for (const initial of [null, "09:00"]) {
    it(`retains committed split input from ${initial} without remounting`, async () => {
      const { wrapper, design, value } = setup(true, initial);
      const root = wrapper.get('[data-ar="time-input"]').element;
      const hour = wrapper.get('[data-part="hour"]');
      (hour.element as HTMLInputElement).focus();
      await hour.setValue("10");
      await wrapper.get('[data-part="minute"]').setValue("15");
      await nextTick();
      expect(value.value.time).toBe("10:15");
      design.value = remixDesign;
      await nextTick();
      expect(inputValue(wrapper.get('[data-part="input"]'))).toBe("10:15");
      expect(wrapper.get('[data-ar="time-input"]').element).toBe(root);
      wrapper.unmount();
    });
  }
  it("retains a committed single input in split fields", async () => {
    const { wrapper, design, value } = setup(false, null);
    await wrapper.get('input').setValue("2515");
    await wrapper.get('input').trigger("keydown", { key: "Enter" });
    expect(value.value.time).toBe("25:15");
    design.value = classicDesign;
    await nextTick();
    expect(inputValue(wrapper.get('[data-part="hour"]'))).toBe("25");
    expect(inputValue(wrapper.get('[data-part="minute"]'))).toBe("15");
    wrapper.unmount();
  });
  for (const draft of ["123", "12:", "invalid"]) {
    it(`retains an uncommitted ${draft} draft and focus through a round trip`, async () => {
      const { wrapper, design, changes } = setup(false, "09:00");
      const input = wrapper.get('input');
      (input.element as HTMLInputElement).focus();
      await input.setValue(draft);
      design.value = classicDesign;
      await nextTick();
      await nextTick();
      expect(wrapper.get('[data-ar="time-input"]').element.contains(document.activeElement)).toBe(true);
      design.value = remixDesign;
      await nextTick();
      await nextTick();
      expect(inputValue(wrapper.get('[data-part="input"]'))).toBe(draft);
      expect(changes).toEqual([]);
      wrapper.unmount();
    });
  }
});
