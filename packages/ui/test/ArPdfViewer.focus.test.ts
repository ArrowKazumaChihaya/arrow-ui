import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArPdfViewer from "../src/components/ArPdfViewer.vue";
import classicDesign from "@s_and_a/arrow-ui-design-classic";
import remixDesign from "@s_and_a/arrow-ui-design-remix";

describe("PDF design switching", () => {
  it("retains page and zoom, and moves removed-control focus to the paper viewport", async () => {
    const design = ref(remixDesign);
    const wrapper = mount({ render: () => h(ArUiProvider, { design: design.value, scope: "self" }, () => h(ArPdfViewer, { pageCount: 2 })) }, { attachTo: document.body });
    await wrapper.get('[data-part="next"]').trigger("click");
    const zoom = wrapper.get<HTMLButtonElement>('[data-part="zoom-in"]');
    zoom.element.focus();
    await zoom.trigger("click");
    design.value = classicDesign;
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(wrapper.get('[data-part="viewport"]').element);
    expect(wrapper.get('[data-part="counter"]').text()).toBe("2 / 2");
    expect(wrapper.find('[data-part="zoom"]').exists()).toBe(false);
    design.value = remixDesign;
    await nextTick();
    expect(wrapper.get('[data-part="zoom-value"]').text()).toBe("125%");
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    design.value = classicDesign;
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(outside);
    wrapper.unmount();
    outside.remove();
  });
});
