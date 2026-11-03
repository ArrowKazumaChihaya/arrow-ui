import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArTimeInput from "../src/components/ArTimeInput.vue";
import ArDurationInput from "../src/components/ArDurationInput.vue";
import ArItem from "../src/components/ArItem.vue";
import ArSubItem from "../src/components/ArSubItem.vue";
import ArDateTimeInput from "../src/components/ArDateTimeInput.vue";
import ArDateInput from "../src/components/ArDateInput.vue";
import ArButton from "../src/components/ArButton.vue";
import ArSelect from "../src/components/ArSelect.vue";
import ArAutoComplete from "../src/components/ArAutoComplete.vue";
import ArField from "../src/components/ArField.vue";
import ArSwitch from "../src/components/ArSwitch.vue";
import ArUpload from "../src/components/ArUpload.vue";
import ArColorPicker from "../src/components/ArColorPicker.vue";
import { classicDesign } from "../../ui-design-classic/src/index";
import { remixDesign } from "../../ui-design-remix/src/index";

/** デザインの中に置いて mount する（forms を読むため）。 */
function inDesign(design: typeof classicDesign, comp: unknown, props: Record<string, unknown> = {}, slots?: Record<string, () => unknown>) {
  const App = defineComponent(() => () => h(ArUiProvider, { design, scope: "self" }, () => h(comp as never, props, slots as never)));
  return mount(App, { attachTo: document.body });
}
const tick = () => new Promise((r) => setTimeout(r, 0));

describe("X1：ArTimeInput の形（classic は時と分の箱）", () => {
  it("classic：時と分が別々の箱と「:」、前日は「前」の文字のリンク", () => {
    const w = inDesign(classicDesign, ArTimeInput, { modelValue: { time: "23:00", day: "prev" }, dayShift: true, label: "出勤" });
    const root = w.get('[data-ar="time-input"]');
    expect(root.attributes("data-fields")).toBe("split");
    expect((w.get('[data-part="hour"]').element as HTMLInputElement).value).toBe("23");
    expect((w.get('[data-part="minute"]').element as HTMLInputElement).value).toBe("00");
    expect(w.get('[data-part="separator"]').text()).toBe(":");
    const t = w.get('[data-part="day-toggle"]');
    expect(t.attributes("data-kind")).toBe("link");
    expect(t.text()).toBe("前");
    w.unmount();
  });
  it("remix：今までどおり1つの箱", () => {
    const w = inDesign(remixDesign, ArTimeInput, { modelValue: { time: "09:30", day: "same" } });
    expect(w.get('[data-ar="time-input"]').attributes("data-fields")).toBe("single");
    expect((w.get('[data-part="input"]').element as HTMLInputElement).value).toBe("09:30");
    w.unmount();
  });
  it("split：時を2桁打つと分へ進み、箱から出ると HH:mm を出す（値の受け渡しは single と同じ）", async () => {
    const got: unknown[] = [];
    const w = inDesign(classicDesign, ArTimeInput, { modelValue: { time: null, day: "same" }, "onUpdate:modelValue": (v: unknown) => got.push(v) });
    const hour = w.get('[data-part="hour"]');
    const minute = w.get('[data-part="minute"]');
    (hour.element as HTMLInputElement).focus();
    await hour.setValue("9");
    expect((hour.element as HTMLInputElement).value).toBe("09");
    await tick();
    expect(document.activeElement).toBe(minute.element);
    await minute.setValue("3");
    await minute.trigger("keydown", { key: "Enter" });
    expect(got.at(-1)).toEqual({ time: "09:03", day: "same" });
    w.unmount();
  });
  it("split：前日の切り替えを押すと day が prev になる", async () => {
    const got: unknown[] = [];
    const w = inDesign(classicDesign, ArTimeInput, { modelValue: { time: "23:00", day: "same" }, dayShift: true, "onUpdate:modelValue": (v: unknown) => got.push(v) });
    await w.get('[data-part="day-toggle"]').trigger("click");
    expect(got.at(-1)).toEqual({ time: "23:00", day: "prev" });
    w.unmount();
  });
  it("select：時と分のプルダウン（先頭に「未選択」）。両方そろうと値を出す", async () => {
    const got: unknown[] = [];
    const w = inDesign(classicDesign, ArTimeInput, { modelValue: { time: "09:30", day: "same" }, select: true, minuteStep: 5, "onUpdate:modelValue": (v: unknown) => got.push(v) });
    const selects = w.findAll('[data-ar="select"]');
    expect(selects).toHaveLength(2);
    expect(selects[0]!.text()).toContain("09");
    await selects[1]!.trigger("click");
    await tick();
    const opts = [...document.querySelectorAll<HTMLElement>('[data-ar="select-panel"] [data-part="option"]')];
    expect(opts[0]!.textContent).toContain("未選択");
    expect(opts).toHaveLength(1 + 12);
    opts.find((o) => o.textContent?.trim() === "45")!.click();
    await nextTick();
    expect(got.at(-1)).toEqual({ time: "09:45", day: "same" });
    w.unmount();
  });
});

describe("X1：ArDurationInput（1 時間 30 分）", () => {
  it("分の値を時間と分の箱に分け、時間は0を詰めない。確定で分を出す", async () => {
    const got: unknown[] = [];
    const w = mount(ArDurationInput, { props: { modelValue: 90, "onUpdate:modelValue": (v: unknown) => got.push(v) }, attachTo: document.body });
    expect((w.get('[data-part="hour"]').element as HTMLInputElement).value).toBe("1");
    expect((w.get('[data-part="minute"]').element as HTMLInputElement).value).toBe("30");
    expect(w.findAll('[data-part="unit"]').map((u) => u.text())).toEqual(["時間", "分"]);
    await w.get('[data-part="hour"]').setValue("2");
    await w.get('[data-part="hour"]').trigger("keydown", { key: "Enter" });
    expect(got.at(-1)).toBe(150);
    w.unmount();
  });
});

describe("X1：ArItem・ArSubItem（項目の行）", () => {
  it("ArItem：項目名・必須・補足・詳細。スロットの id で入力と結ぶ", async () => {
    const w = mount(ArItem, {
      props: { title: "打刻の丸め", required: true, info: "15分単位で丸めます", detail: true, titleWidth: "160px" },
      slots: { default: (c: { id: string }) => h("input", { id: c.id, "data-test": "x" }) },
    });
    const root = w.get('[data-ar="item"]');
    expect(root.attributes("style")).toContain("--ar-item-title: 160px");
    const label = w.get('[data-part="label"]');
    expect(label.text()).toContain("打刻の丸め");
    expect(label.attributes("for")).toBe(w.get('[data-test="x"]').attributes("id"));
    expect(w.find('[data-part="required"]').exists()).toBe(true);
    expect(w.get('[data-part="info-text"]').text()).toBe("15分単位で丸めます");
    await w.get('[data-part="detail"]').trigger("click");
    expect(w.emitted("detail")).toHaveLength(1);
  });
  it("ArSubItem：項目名が上、show-title=false なら入力だけ", () => {
    const a = mount(ArSubItem, { props: { title: "開始時刻", required: true }, slots: { default: () => h("span", "x") } });
    expect(a.get('[data-part="label"]').text()).toContain("開始時刻");
    const b = mount(ArSubItem, { props: { title: "開始時刻", showTitle: false }, slots: { default: () => h("span", "x") } });
    expect(b.find('[data-part="title"]').exists()).toBe(false);
  });
});

describe("X1：ArDateTimeInput・ArDateInput（classic の形）", () => {
  it("ArDateTimeInput：日付と時刻から \"YYYY-MM-DD HH:mm:ss\" を作る", async () => {
    const w = inDesign(classicDesign, ArDateTimeInput, { modelValue: "2026-11-03 09:00:00" });
    expect((w.get('[data-part="month"]').element as HTMLInputElement).value).toBe("11");
    expect((w.get('[data-part="day"]').element as HTMLInputElement).value).toBe("03");
    expect(w.findAll('[data-ar="time-input"] [data-ar="select"]')).toHaveLength(2);
    w.unmount();
  });
  it("ArDateInput classic：ありえない日は「無効な日付」で値は null", async () => {
    const got: unknown[] = [];
    const w = inDesign(classicDesign, ArDateInput, { modelValue: "2026-02-28", "onUpdate:modelValue": (v: unknown) => got.push(v) });
    const d = w.get('[data-part="day"]');
    await d.setValue("31");
    await d.trigger("blur");
    expect(got.at(-1)).toBe(null);
    expect(w.get('[data-part="error"]').text()).toBe("無効な日付");
    expect((d.element as HTMLInputElement).value).toBe("31");
    w.unmount();
  });
});

describe("X1：ArButton・ArSelect・ArAutoComplete・ArField・ArSwitch・ArUpload・ArColorPicker の足したもの", () => {
  it("ArButton：disabledReason なら押せない見た目のまま押せて、理由のダイアログを出す", async () => {
    const w = mount(ArButton, { props: { tone: "danger", disabled: true, disabledReason: "締め済みのため削除できません" }, slots: { default: () => "削除" }, attachTo: document.body });
    const b = w.get('[data-ar="button"]');
    expect(b.attributes("aria-disabled")).toBe("true");
    expect(b.attributes("disabled")).toBeUndefined();
    await b.trigger("click");
    await tick();
    expect(document.body.textContent).toContain("締め済みのため削除できません");
    expect(w.emitted("click")).toBeUndefined();
    w.unmount();
  });
  it("ArButton：新しい種類と大きさ（edit・dark・overlay・xl）は data-tone・data-size に出る", () => {
    const w = mount(ArButton, { props: { tone: "edit", size: "xl" }, slots: { default: () => "編集" } });
    expect(w.attributes("data-tone")).toBe("edit");
    expect(w.attributes("data-size")).toBe("xl");
  });
  it("ArSelect：null-option の「未選択」を選ぶと null、actions のボタンで action を出す", async () => {
    const got: unknown[] = [];
    const w = mount(ArSelect, {
      props: { modelValue: "a", options: [{ value: "a", label: "A" }], nullOption: "未選択", actions: [{ value: "new", label: "新規作成" }], "onUpdate:modelValue": (v: unknown) => got.push(v) },
      attachTo: document.body,
    });
    await w.get('[data-ar="select"]').trigger("click");
    await tick();
    const rows = [...document.querySelectorAll<HTMLElement>('[data-ar="select-panel"] [data-part="option"]')];
    expect(rows[0]!.getAttribute("data-kind")).toBe("null");
    rows[0]!.click();
    expect(got.at(-1)).toBe(null);
    await w.get('[data-ar="select"]').trigger("click");
    await tick();
    document.querySelector<HTMLElement>('[data-ar="select-panel"] [data-part="action"] button')!.click();
    expect(w.emitted("action")?.[0]).toEqual(["new"]);
    w.unmount();
  });
  it("ArSelect：classic は既定で探す欄を出さない（7つ以上でも）", async () => {
    const options = Array.from({ length: 10 }, (_, i) => ({ value: i, label: `店${i}` }));
    const w = inDesign(classicDesign, ArSelect, { modelValue: null, options });
    await w.get('[data-ar="select"]').trigger("click");
    await tick();
    expect(document.querySelector('[data-ar="select-panel"] [data-part="search"]')).toBeNull();
    w.unmount();
  });
  it("ArAutoComplete：打つと合う候補が出る。reset-option の「リセット」で空にする", async () => {
    const Host = defineComponent({
      data: () => ({ v: "" }),
      render() {
        return h(ArAutoComplete, {
          modelValue: this.v,
          "onUpdate:modelValue": (x: string) => (this.v = x),
          options: ["朝礼", "店長会議"],
          resetOption: true,
          label: "名前",
        });
      },
    });
    const w = mount(Host, { attachTo: document.body });
    const input = w.get("input");
    await input.setValue("朝");
    await tick();
    const rows = [...document.querySelectorAll<HTMLElement>('[data-ar="select-panel"] [data-part="option"]')].map((r) => r.textContent?.trim());
    expect(rows).toEqual(["リセット", "朝礼"]);
    document.querySelector<HTMLElement>('[data-ar="select-panel"] [data-part="option"]')!.click();
    await nextTick();
    expect((input.element as HTMLInputElement).value).toBe("");
    w.unmount();
  });
  it("ArField：layout=\"horizontal\" は inline（ラベルが左）と同じ", () => {
    const w = mount(ArField, { props: { label: "氏名", layout: "horizontal", labelWidth: "25%" }, slots: { default: () => h("input") } });
    expect(w.attributes("data-layout")).toBe("inline");
    expect(w.attributes("style")).toContain("--ar-field-label: 25%");
  });
  it("ArSwitch：tone・two-way・左右の印と文字", () => {
    const w = mount(ArSwitch, { props: { modelValue: false, label: "表示", tone: "accent", twoWay: true }, slots: { before: () => "一覧", after: () => "暦", default: () => "有効" } });
    expect(w.attributes("data-tone")).toBe("accent");
    expect(w.attributes("data-two-way")).toBe("true");
    expect(w.get('[data-part="before"]').text()).toBe("一覧");
    expect(w.get('[data-part="caption"]').text()).toBe("有効");
  });
  it("ArUpload：classic はボタンと「ファイル未選択」", () => {
    const w = inDesign(classicDesign, ArUpload, { label: "ファイル" });
    expect(w.find('[data-part="drop"]').exists()).toBe(false);
    expect(w.get('[data-ar="upload"]>[data-ar="button"]').text()).toContain("ファイルを選択");
    expect(w.get('[data-part="chosen"]').text()).toBe("ファイル未選択");
    w.unmount();
  });
  it("ArColorPicker：readonly は押せない見本だけ。classic はダイアログで選んで閉じる", async () => {
    const r = mount(ArColorPicker, { props: { modelValue: "#2196F3", readonly: true, label: "色" } });
    expect(r.find("button").exists()).toBe(false);
    const got: unknown[] = [];
    const w = inDesign(classicDesign, ArColorPicker, {
      modelValue: null,
      label: "色",
      custom: false,
      groupSize: 2,
      colors: [
        { value: "#E03838", label: "赤" },
        { value: "#E66464", label: "赤2" },
        { value: "#2196F3", label: "青" },
      ],
      "onUpdate:modelValue": (v: unknown) => got.push(v),
    });
    await w.get('[data-part="chip"]').trigger("click");
    await tick();
    expect(document.querySelectorAll('[data-ar="color-picker-dialog"] [data-part="group"]')).toHaveLength(2);
    document.querySelectorAll<HTMLElement>('[data-ar="color-picker-dialog"] [data-part="swatch"]')[2]!.click();
    expect(got.at(-1)).toBe("#2196F3");
    w.unmount();
  });
});
