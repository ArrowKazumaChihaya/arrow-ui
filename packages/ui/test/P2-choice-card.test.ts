import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import ArChoiceCard from "../src/components/ArChoiceCard.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

const Group = defineComponent({
  setup() {
    const v = ref<string>("b");
    return () =>
      h("div", { role: "radiogroup" }, [
        h(ArChoiceCard, { title: "A", value: "a", modelValue: v.value, "onUpdate:modelValue": (x: unknown) => (v.value = x as string) }),
        h(ArChoiceCard, { title: "B", value: "b", modelValue: v.value, "onUpdate:modelValue": (x: unknown) => (v.value = x as string) }),
        h(ArChoiceCard, { title: "C", value: "c", modelValue: v.value, disabled: true, "onUpdate:modelValue": (x: unknown) => (v.value = x as string) }),
        h(ArChoiceCard, { title: "D", value: "d", modelValue: v.value, "onUpdate:modelValue": (x: unknown) => (v.value = x as string) }),
      ]);
  },
});

describe("ArChoiceCard", () => {
  it("組では role=radio。押すと v-model が変わり、選ばれた札だけ Tab で止まる", async () => {
    const w = mount(Group, { attachTo: document.body });
    const cards = () => w.findAll('[data-ar="choice-card"]');
    expect(cards()[1]!.attributes("aria-checked")).toBe("true");
    expect(cards()[0]!.attributes("tabindex")).toBe("-1");
    expect(cards()[1]!.attributes("tabindex")).toBe("0");
    await cards()[0]!.trigger("click");
    expect(cards()[0]!.attributes("aria-checked")).toBe("true");
    expect(cards()[0]!.attributes("data-state")).toBe("on");
  });
  it("←→ で隣（選べない札は飛ばす）へ動いて選ぶ", async () => {
    const w = mount(Group, { attachTo: document.body });
    const cards = () => w.findAll('[data-ar="choice-card"]');
    await cards()[1]!.trigger("keydown", { key: "ArrowRight" });
    expect(cards()[3]!.attributes("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(cards()[3]!.element);
    await cards()[3]!.trigger("keydown", { key: "ArrowRight" });
    expect(cards()[0]!.attributes("aria-checked")).toBe("true");
  });
  it("option はふつうのボタンで select を出す。理由・札を出す", async () => {
    const w = mount(ArChoiceCard, { props: { variant: "option", title: "入社メールを送信", icon: "mail", tag: "推奨", tagTone: "ok", description: "説明" } });
    expect(w.attributes("role")).toBeUndefined();
    expect(w.attributes("aria-pressed")).toBeUndefined();
    expect(w.get('[data-part="tag"]').attributes("data-tone")).toBe("ok");
    await w.trigger("click");
    expect(w.emitted("select")).toEqual([[undefined]]);
    const d = mount(ArChoiceCard, { props: { title: "Aプラン", disabled: true, reason: "変更できません" } });
    expect(d.get('[data-part="reason"]').text()).toBe("変更できません");
    await d.trigger("click");
    expect(d.emitted("select")).toBeUndefined();
  });
});
