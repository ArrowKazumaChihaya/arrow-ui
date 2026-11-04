import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import ArOtpInput from "../src/components/ArOtpInput.vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import { h } from "vue";
import classicDesign from "@s_and_a/arrow-ui-design-classic";
import remixDesign from "@s_and_a/arrow-ui-design-remix";

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

function mountOtp(props: Record<string, unknown>) {
  const w = mount(ArOtpInput, {
    props: { "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }), ...props } as never,
    attachTo: document.body,
  });
  return w;
}

describe("ArOtpInput", () => {
  it("6つの箱に1桁ずつ。打つと次の箱へ、全部入ると complete", async () => {
    const w = mountOtp({ modelValue: "" });
    const cells = w.findAll('[data-part="cell"]');
    expect(cells).toHaveLength(6);
    expect(cells[0]!.attributes("autocomplete")).toBe("one-time-code");
    expect(cells[2]!.attributes("aria-label")).toBe("認証コード 3桁目");
    for (const [i, d] of [..."482193"].entries()) {
      (cells[i]!.element as HTMLInputElement).value = d;
      await cells[i]!.trigger("input");
      await nextTick();
    }
    expect(w.props("modelValue")).toBe("482193");
    expect(w.emitted("complete")).toEqual([["482193"]]);
  });
  it("数字以外は入らず、貼り付けで全部の箱に入る", async () => {
    const w = mountOtp({ modelValue: "" });
    const cells = w.findAll('[data-part="cell"]');
    (cells[0]!.element as HTMLInputElement).value = "a";
    await cells[0]!.trigger("input");
    expect(w.props("modelValue")).toBe("");
    await cells[0]!.trigger("paste", { clipboardData: { getData: () => "コード：482 193" } });
    await nextTick();
    expect(w.props("modelValue")).toBe("482193");
    expect(w.emitted("complete")).toHaveLength(1);
  });
  it("Backspace で消して前の箱へ、←→ で動く", async () => {
    const w = mountOtp({ modelValue: "482" });
    const cells = w.findAll('[data-part="cell"]');
    (cells[3]!.element as HTMLInputElement).focus();
    await cells[3]!.trigger("keydown", { key: "Backspace" });
    expect(w.props("modelValue")).toBe("48");
    expect(document.activeElement).toBe(cells[2]!.element);
    await cells[2]!.trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(cells[1]!.element);
  });
  it("再送は秒数を数え、0 になると押せて resend を出し、また待つ", async () => {
    vi.useFakeTimers();
    const w = mountOtp({ modelValue: "", resendable: true, resendIn: 2, cooldown: 5 });
    const btn = () => w.get('[data-part="resend"]');
    expect(btn().text()).toBe("認証コードを再送（あと2秒）");
    expect(btn().attributes("disabled")).toBeDefined();
    vi.advanceTimersByTime(2000);
    await nextTick();
    expect(btn().text()).toBe("認証コードを再送");
    await btn().trigger("click");
    expect(w.emitted("resend")).toHaveLength(1);
    await nextTick();
    expect(btn().text()).toBe("認証コードを再送（あと5秒）");
  });
  it("keeps a partial code and digit focus when switching between single and split fields", async () => {
    const design = ref(classicDesign);
    const value = ref("482");
    const w = mount({ render: () => h(ArUiProvider, { design: design.value, scope: "self" }, () => h(ArOtpInput, { modelValue: value.value, "onUpdate:modelValue": (v: string) => (value.value = v) })) }, { attachTo: document.body });
    const single = w.get<HTMLInputElement>('[data-part="input"]');
    single.element.focus();
    single.element.setSelectionRange(1, 2);
    design.value = remixDesign;
    await nextTick();
    await nextTick();
    const cells = w.findAll<HTMLInputElement>('[data-part="cell"]');
    expect(cells.map((cell) => cell.element.value).join("")).toBe("482");
    expect(document.activeElement).toBe(cells[1]?.element);
    await cells[1]?.setValue("9");
    await nextTick();
    expect(value.value).toBe("492");
    cells[2]?.element.focus();
    design.value = classicDesign;
    await nextTick();
    await nextTick();
    const restored = w.get<HTMLInputElement>('[data-part="input"]');
    expect(restored.element.value).toBe("492");
    expect(document.activeElement).toBe(restored.element);
    expect([restored.element.selectionStart, restored.element.selectionEnd]).toEqual([2, 3]);
    restored.element.blur();
    design.value = remixDesign;
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(document.body);
    w.unmount();
  });
  it("classic は1つの欄（placeholder 000000）で、値の受け渡しは同じ", async () => {
    let val = "";
    const w = mount({ render: () => h(ArUiProvider, { design: classicDesign, scope: "self" }, () => h(ArOtpInput, { modelValue: val, "onUpdate:modelValue": (v: string) => (val = v) })) }, { attachTo: document.body });
    await nextTick();
    const input = w.get('[data-part="input"]');
    expect(w.findAll('[data-part="cell"]')).toHaveLength(0);
    expect(input.attributes("placeholder")).toBe("000000");
    (input.element as HTMLInputElement).value = "48-21";
    await input.trigger("input");
    expect(val).toBe("4821");
  });
});
