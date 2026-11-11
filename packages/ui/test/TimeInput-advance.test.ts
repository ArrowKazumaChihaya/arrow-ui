import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import ArTimeInput from "../src/components/ArTimeInput.vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import { remixDesign } from "../../ui-design-remix/src/index";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

/** jsdom has no layout: give each element a rect and make it count as rendered. */
function layout(rects: Map<Element, [number, number]>) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const [left, top] = rects.get(this) ?? [0, 0];
    return { left, top, right: left + 60, bottom: top + 30, width: 60, height: 30, x: left, y: top, toJSON: () => ({}) } as DOMRect;
  });
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function () {
    return [{}] as unknown as DOMRectList;
  });
}

function host(children: () => unknown[]) {
  return defineComponent({
    render: () => h(ArUiProvider, { design: remixDesign, scope: "self" }, () => h("div", children() as never)),
  });
}
const time = () => h(ArTimeInput, { modelValue: { time: null, day: "same" } });

describe("ArTimeInput：4桁そろったら確定して次の入力へ移る", () => {
  it("「1200」と打つと 12:00 を確定し、次に Tab で止まる所へフォーカスが移る", async () => {
    const w = mount(host(() => [time(), h("input", { id: "next" })]), { attachTo: document.body });
    layout(new Map());
    await w.get('input[data-part="input"]').setValue("1200");
    await nextTick();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(w.findComponent(ArTimeInput).emitted("commit")?.[0]?.[0]).toEqual({ time: "12:00", day: "same" });
    expect(document.activeElement?.id).toBe("next");
    w.unmount();
  });

  it("3桁や読めない値では移らない", async () => {
    const w = mount(host(() => [time(), h("input", { id: "next" })]), { attachTo: document.body });
    await w.get('input[data-part="input"]').setValue("120");
    await w.get('input[data-part="input"]').setValue("9999");
    await nextTick();
    expect(document.activeElement?.id).not.toBe("next");
    w.unmount();
  });

  it("DOM の順ではなく画面の並び（行ごと・左から右）で次の時刻へ移り、移った先はそのまま打てる", async () => {
    // DOM order is column by column (start1, start2, end1, end2) like stacked cells of a table.
    const w = mount(host(() => [time(), time(), time(), time()]), { attachTo: document.body });
    const inputs = w.findAll('input[data-part="input"]').map((x) => x.element as HTMLInputElement);
    layout(new Map<Element, [number, number]>([[inputs[0]!, [0, 0]], [inputs[1]!, [0, 40]], [inputs[2]!, [100, 0]], [inputs[3]!, [100, 40]]]));
    inputs[0]!.focus();
    await w.findAll('input[data-part="input"]')[0]!.setValue("0900");
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(document.activeElement).toBe(inputs[2]);
    await w.findAll('input[data-part="input"]')[2]!.setValue("1800");
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(document.activeElement).toBe(inputs[1]);
    w.unmount();
  });

  it("Tab と Shift+Tab も同じ並びで進む", async () => {
    const w = mount(host(() => [time(), time(), time(), time()]), { attachTo: document.body });
    const inputs = w.findAll('input[data-part="input"]').map((x) => x.element as HTMLInputElement);
    layout(new Map<Element, [number, number]>([[inputs[0]!, [0, 0]], [inputs[1]!, [0, 40]], [inputs[2]!, [100, 0]], [inputs[3]!, [100, 40]]]));
    inputs[0]!.focus();
    await w.findAll('input[data-part="input"]')[0]!.trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(inputs[2]);
    await w.findAll('input[data-part="input"]')[2]!.trigger("keydown", { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(inputs[0]);
    w.unmount();
  });

  it("空のまま Backspace で、ひとつ前の時刻の箱へ戻り入っている文字を全選択にする", async () => {
    const w = mount(host(() => [h(ArTimeInput, { modelValue: { time: "09:00", day: "same" } }), time()]), { attachTo: document.body });
    const inputs = w.findAll('input[data-part="input"]').map((x) => x.element as HTMLInputElement);
    layout(new Map<Element, [number, number]>([[inputs[0]!, [0, 0]], [inputs[1]!, [100, 0]]]));
    inputs[1]!.focus();
    await w.findAll('input[data-part="input"]')[1]!.trigger("keydown", { key: "Backspace" });
    expect(document.activeElement).toBe(inputs[0]);
    expect(inputs[0]!.selectionStart).toBe(0);
    expect(inputs[0]!.selectionEnd).toBe(inputs[0]!.value.length);
    w.unmount();
  });
});
