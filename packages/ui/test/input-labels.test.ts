import { mount } from "@vue/test-utils";
import ArTextInput from "../src/components/ArTextInput.vue";
import ArTextarea from "../src/components/ArTextarea.vue";

describe.each([ArTextInput, ArTextarea])("explicit input label with a DOM id", (component) => {
  it("keeps an explicit accessible name when the control has its own id", () => {
    const w = mount(component, { props: { modelValue: "", id: "additional-amount", label: "Monthly limit" } });
    expect(w.get("input,textarea").attributes("aria-label")).toBe("Monthly limit");
    expect(w.get("input,textarea").attributes("id")).toBe("additional-amount");
  });
  it("lets an explicit aria-label override the label prop", () => {
    const w = mount(component, { props: { modelValue: "", id: "amount", label: "Amount" }, attrs: { "aria-label": "Custom amount" } });
    expect(w.get("input,textarea").attributes("aria-label")).toBe("Custom amount");
  });
  it("does not override an external field label when no label is supplied", () => {
    const w = mount(component, { props: { modelValue: "", id: "field-control" }, attrs: { "aria-labelledby": "field-label" } });
    expect(w.get("input,textarea").attributes("aria-label")).toBeUndefined();
    expect(w.get("input,textarea").attributes("aria-labelledby")).toBe("field-label");
  });
});
