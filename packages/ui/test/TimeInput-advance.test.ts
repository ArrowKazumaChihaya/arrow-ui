import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import ArTimeInput from "../src/components/ArTimeInput.vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import { remixDesign } from "../../ui-design-remix/src/index";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ArTimeInput：4桁そろったら確定して次の入力へ移る", () => {
  it("「1200」と打つと 12:00 を確定し、次に Tab で止まる所へフォーカスが移る", async () => {
    const Host = defineComponent({
      render: () => h(ArUiProvider, { design: remixDesign, scope: "self" }, () => h("div", [h(ArTimeInput, { modelValue: { time: null, day: "same" } }), h("input", { id: "next" })])),
    });
    const w = mount(Host, { attachTo: document.body });
    const input = w.get('input[data-part="input"]');
    await input.setValue("1200");
    await nextTick();
    await nextTick();
    const time = w.findComponent(ArTimeInput);
    expect(time.emitted("commit")?.[0]?.[0]).toEqual({ time: "12:00", day: "same" });
    expect(document.activeElement?.id).toBe("next");
    w.unmount();
  });

  it("3桁や読めない値では移らない", async () => {
    const Host = defineComponent({
      render: () => h(ArUiProvider, { design: remixDesign, scope: "self" }, () => h("div", [h(ArTimeInput, { modelValue: { time: null, day: "same" } }), h("input", { id: "next" })])),
    });
    const w = mount(Host, { attachTo: document.body });
    await w.get('input[data-part="input"]').setValue("120");
    await w.get('input[data-part="input"]').setValue("9999");
    await nextTick();
    expect(document.activeElement?.id).not.toBe("next");
    w.unmount();
  });
});
