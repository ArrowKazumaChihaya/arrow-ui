import { mount } from "@vue/test-utils";
import { defineComponent, h, withDirectives, type Directive } from "vue";
import ArSelect from "../src/components/ArSelect.vue";
import ArTreeSelect from "../src/components/ArTreeSelect.vue";
import ArAutoComplete from "../src/components/ArAutoComplete.vue";

describe("selection control layout directives", () => {
  for (const [name, renderControl] of [
    ["select", () => h(ArSelect, { modelValue: null, options: [{ value: 1, label: "Store" }] })],
    ["tree-select", () => h(ArTreeSelect, { modelValue: null, options: [{ value: 1, label: "Store" }] })],
    ["auto-complete", () => h(ArAutoComplete, { modelValue: "", options: ["Store"] })],
  ] as const) {
    it(`${name} applies updates to the existing control root without a fragment warning`, async () => {
      const warnings: string[] = [];
      const layout: Directive<HTMLElement, string> = {
        mounted(element, binding) { element.style.width = binding.value; },
        updated(element, binding) { element.style.width = binding.value; },
      };
      const host = defineComponent({
        props: { width: { type: String, default: "120px" } },
        setup: (props) => () => withDirectives(renderControl(), [[layout, props.width]]),
      });
      const wrapper = mount(host, { global: { config: { warnHandler: message => warnings.push(message) } } });
      const root = wrapper.get(`[data-ar="${name}"]`).element;
      expect(root.getAttribute("style")).toContain("width: 120px");
      await wrapper.setProps({ width: "240px" });
      expect(wrapper.get(`[data-ar="${name}"]`).element).toBe(root);
      expect(root.getAttribute("style")).toContain("width: 240px");
      expect(warnings).toEqual([]);
      wrapper.unmount();
    });
  }
});
