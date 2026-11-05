import { mount } from "@vue/test-utils";
import ArParagraph from "../src/components/ArParagraph.vue";

describe("ArParagraph free text", () => {
  it("retains the original text and can switch line preservation without remounting", async () => {
    const content = "経路の説明\n  乗り換え後の行";
    const wrapper = mount(ArParagraph, { slots: { default: () => content } });
    const element = wrapper.element;
    expect(element.textContent).toBe(content);
    expect(wrapper.attributes("data-preserve-lines")).toBeUndefined();
    await wrapper.setProps({ preserveLines: true });
    expect(wrapper.element).toBe(element);
    expect(wrapper.attributes("data-preserve-lines")).toBe("true");
    expect(element.textContent).toBe(content);
    await wrapper.setProps({ ellipsis: true });
    expect(wrapper.attributes("data-ellipsis")).toBe("line");
    await wrapper.setProps({ ellipsis: 2 });
    expect(wrapper.attributes("data-ellipsis")).toBe("rows");
    await wrapper.setProps({ preserveLines: false });
    expect(wrapper.attributes("data-preserve-lines")).toBeUndefined();
    expect(element.textContent).toBe(content);
    wrapper.unmount();
  });
});
