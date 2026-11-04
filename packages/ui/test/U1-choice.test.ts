import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import ArRadioGroup from "../src/components/ArRadioGroup.vue";
import ArCheckbox from "../src/components/ArCheckbox.vue";
import ArCheckboxGroup from "../src/components/ArCheckboxGroup.vue";
import ArChoiceCard from "../src/components/ArChoiceCard.vue";
import ArFlagGroup from "../src/components/ArFlagGroup.vue";
import { arUiContextKey } from "../src/provider/context";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("U1：選ぶ部品の統一", () => {
  it("ArRadioGroup：各選択肢は ArRadio（data-ar=radio・data-part=item）。形を省くと card、size・description・columns を渡す", async () => {
    const w = mount(ArRadioGroup, {
      props: { modelValue: false, label: "保険料", size: "lg", columns: 2, options: [{ value: false, label: "なし" }, { value: true, label: "あり", description: "書類を出す" }] },
    });
    expect(w.attributes("data-variant")).toBe("card");
    expect(w.attributes("data-columns")).toBe("2");
    const items = w.findAll('[data-part="item"]');
    expect(items.map((i) => i.attributes("data-ar"))).toEqual(["radio", "radio"]);
    expect(items[0]!.attributes("data-variant")).toBe("card");
    expect(items[0]!.attributes("data-size")).toBe("lg");
    expect(items[1]!.get('[data-part="description"]').text()).toBe("書類を出す");
    expect(items[1]!.get("input").attributes("aria-describedby")).toBe(items[1]!.get('[data-part="description"]').attributes("id"));
    await items[1]!.get("input").trigger("change");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("ArRadioGroup：デザインの forms で既定の形を変えられる（classic は plain）。variant を書けばそれが勝つ", () => {
    const ctx = { design: ref({ forms: { ArRadioGroup: { variant: "plain" } } }), palette: ref("blue"), portal: ref(null) };
    const opts = [{ value: 1, label: "A" }];
    const plain = mount(ArRadioGroup, { props: { modelValue: 1, label: "x", options: opts }, global: { provide: { [arUiContextKey as symbol]: ctx } } });
    expect(plain.attributes("data-variant")).toBe("plain");
    const card = mount(ArRadioGroup, { props: { modelValue: 1, label: "x", options: opts, variant: "card" }, global: { provide: { [arUiContextKey as symbol]: ctx } } });
    expect(card.get('[data-part="item"]').attributes("data-variant")).toBe("card");
  });

  it("ArChoiceCard の radio は ArRadio の card（本物のラジオ）。v-model と select を出し、←→ で隣の札を選ぶ", async () => {
    const Group = defineComponent({
      setup() {
        const v = ref<boolean>(false);
        return () =>
          h("div", { role: "radiogroup" }, [
            h(ArChoiceCard, { variant: "radio", title: "なし", value: false, modelValue: v.value, "onUpdate:modelValue": (x: unknown) => (v.value = x as boolean) }),
            h(ArChoiceCard, { variant: "radio", title: "あり", value: true, modelValue: v.value, "onUpdate:modelValue": (x: unknown) => (v.value = x as boolean) }),
          ]);
      },
    });
    const w = mount(Group, { attachTo: document.body });
    const roots = () => w.findAll('[data-ar="radio"]');
    expect(roots()[0]!.attributes("data-variant")).toBe("card");
    expect(roots()[0]!.attributes("data-size")).toBe("lg");
    expect(roots()[0]!.attributes("data-state")).toContain("checked");
    await roots()[0]!.get("input").trigger("keydown", { key: "ArrowRight" });
    expect(roots()[1]!.attributes("data-state")).toContain("checked");
  });

  it("ArCheckbox：card・size・description。decorative は input を持たず読み上げから隠す", () => {
    const c = mount(ArCheckbox, { props: { modelValue: true, variant: "card", size: "sm", description: "説明" }, slots: { default: "名前" } });
    expect(c.attributes("data-variant")).toBe("card");
    expect(c.attributes("data-size")).toBe("sm");
    expect(c.get('[data-part="description"]').text()).toBe("説明");
    const d = mount(ArCheckbox, { props: { modelValue: false, indeterminate: true, decorative: true } });
    expect(d.element.tagName).toBe("SPAN");
    expect(d.find("input").exists()).toBe(false);
    expect(d.attributes("aria-hidden")).toBe("true");
    expect(d.find('[data-kind="dash"]').exists()).toBe(true);
  });

  it("ArCheckboxGroup・ArFlagGroup：variant・size を各 ArCheckbox に渡す", async () => {
    const g = mount(ArCheckboxGroup, { props: { modelValue: ["a"], label: "x", variant: "plain", size: "lg", options: [{ value: "a", label: "A", description: "d" }, { value: "b", label: "B" }] } });
    const boxes = g.findAll('[data-ar="checkbox"]');
    expect(boxes.map((b) => [b.attributes("data-variant"), b.attributes("data-size")])).toEqual([["plain", "lg"], ["plain", "lg"]]);
    await boxes[1]!.get("input").setValue(true);
    expect(g.emitted("update:modelValue")?.[0]).toEqual([["a", "b"]]);
    const f = mount(ArFlagGroup, { props: { modelValue: 1, size: "sm", options: [{ value: 1, label: "日" }] } });
    expect(f.get('[data-ar="checkbox"]').attributes("data-size")).toBe("sm");
    expect(f.get('[data-ar="checkbox"]').attributes("data-variant")).toBe("plain");
  });
});
