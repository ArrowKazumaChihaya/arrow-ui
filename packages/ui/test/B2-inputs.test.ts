import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArCheckboxGroup from "../src/components/ArCheckboxGroup.vue";
import ArRadioGroup from "../src/components/ArRadioGroup.vue";
import ArSwitch from "../src/components/ArSwitch.vue";
import ArTimeInput from "../src/components/ArTimeInput.vue";
import ArTimeRange from "../src/components/ArTimeRange.vue";
import ArDateRange from "../src/components/ArDateRange.vue";
import ArDatePicker from "../src/components/ArDatePicker.vue";
import ArTimePicker from "../src/components/ArTimePicker.vue";
import ArRate from "../src/components/ArRate.vue";
import ArSlider from "../src/components/ArSlider.vue";
import ArColorSwatches from "../src/components/ArColorSwatches.vue";
import ArColorPicker from "../src/components/ArColorPicker.vue";
import ArWeekdayPicker from "../src/components/ArWeekdayPicker.vue";
import ArPills from "../src/components/ArPills.vue";
import ArTransfer from "../src/components/ArTransfer.vue";
import ArUpload from "../src/components/ArUpload.vue";
import { hexToHsv, hsvToHex, normalizeHex } from "../src/components/color";
import { addMonths, inclusiveDays } from "../src/components/date";
import { parseTime } from "../src/components/time";

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("ArCheckboxGroup", () => {
  const options = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "c", label: "C", disabled: true },
  ];
  it("「すべて」は一部なら indeterminate、押すと押せるものだけ全部", async () => {
    const w = mount(ArCheckboxGroup, { props: { modelValue: ["a"], options, label: "店舗", checkAll: true } });
    const all = w.get('[data-part="all"]');
    expect(all.attributes("data-state")).toContain("indeterminate");
    await all.get("input").setValue(true);
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["a", "b"]]);
  });
  it("選択肢を押すと options の順に並べて出す", async () => {
    const w = mount(ArCheckboxGroup, { props: { modelValue: ["b"], options, label: "店舗" } });
    await w.findAll('[data-part="list"] input')[0]!.setValue(true);
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["a", "b"]]);
  });
});

describe("ArRadioGroup の button 型・ArSwitch の文字", () => {
  it("button 型でも中は本物のラジオで、丸の印は出さない", async () => {
    const w = mount(ArRadioGroup, { props: { modelValue: "d", type: "button", label: "単位", options: [{ value: "d", label: "日" }, { value: "w", label: "週" }] } });
    expect(w.attributes("data-type")).toBe("button");
    expect(w.find('[data-part="mark"]').exists()).toBe(false);
    await w.findAll("input")[1]!.trigger("change");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["w"]);
  });
  it("スイッチの文字は入・切を両方置き（幅が変わらない）、見た目の状態を出す", () => {
    const w = mount(ArSwitch, { props: { modelValue: true, label: "公開", onText: "公開", offText: "非公開" } });
    expect(w.get('[data-part="on"]').text()).toBe("公開");
    expect(w.get('[data-part="off"]').text()).toBe("非公開");
    expect(w.attributes("data-state")).toContain("on");
    expect(w.attributes("data-text")).toBeDefined();
  });
});

describe("ArTimeInput の追加・ArTimeRange", () => {
  it("overnight なら 29:00 を受ける（ふだんは読めない）", async () => {
    expect(parseTime("2900")).toBeUndefined();
    expect(parseTime("2900", 47)).toBe("29:00");
    const w = mount(ArTimeInput, { props: { modelValue: { time: null, day: "same" }, overnight: true } });
    await w.get("input").setValue("29");
    await w.get("input").trigger("blur");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([{ time: "29:00", day: "same" }]);
  });
  it("note を渡すと入力の代わりに文字を出す", () => {
    const w = mount(ArTimeInput, { props: { modelValue: { time: null, day: "same" }, note: "打刻と同じ", dayShift: true } });
    expect(w.find("input").exists()).toBe(false);
    expect(w.get('[data-part="note"]').text()).toBe("打刻と同じ");
    expect(w.attributes("data-state")).toContain("note");
  });
  it("範囲：翌日開始・未入力と、変更した側だけの通知を保持する", async () => {
    const w = mount(ArTimeRange, {
      props: { modelValue: { start: "25:00", end: "29:00" }, overnight: true, startOvernight: true },
    });
    const start = w.get('[data-part="start"] input');
    await start.setValue("26:30");
    await start.trigger("blur");
    expect(w.emitted("update:start")?.at(-1)).toEqual(["26:30"]);
    expect(w.emitted("update:end")).toBeUndefined();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([{ start: "26:30", end: "29:00" }]);
    const end = w.get('[data-part="end"] input');
    await end.setValue("");
    await end.trigger("blur");
    expect(w.emitted("update:end")?.at(-1)).toEqual([null]);
    expect(w.emitted("update:start")).toHaveLength(1);
  });
  it("範囲：終わりが始まり以前なら赤くして直し方を出す", () => {
    const w = mount(ArTimeRange, { props: { modelValue: { start: "09:00", end: "08:30" } } });
    expect(w.attributes("data-state")).toContain("invalid");
    expect(w.get('[data-part="error"]').text()).toContain("終了は開始より後");
  });
});

describe("ArDateRange・ArDatePicker", () => {
  it("範囲入力でも不正日付の補正禁止・入力中の更新・翻訳を保つ", async () => {
    const w = mount(ArDateRange, { props: {
      modelValue: { start: "2026-02-01", end: "2026-11-30" },
      id: "publication-period",
      labels: { start: "Start ", end: "End ", separator: "–", days: (n: number) => `${n} days`, reversed: "Check the end date" },
      inputProps: { invalidDate: "message", updateOnInput: true, pad: "zero", showWeekday: false, labels: { year: "Year", month: "Month", day: "Day", weekdays: [], invalidDate: "Invalid date" } },
    } });
    expect(w.get('#publication-period').attributes("role")).toBe("combobox");
    expect(w.findAll('#publication-period')).toHaveLength(1);
    await w.get('[aria-label="Start Day"]').setValue("31");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([{ start: null, end: "2026-11-30" }]);
    expect(w.text()).toContain("Invalid date");
    expect(w.get<HTMLInputElement>('[aria-label="Start Day"]').element.value).toBe("31");
    expect(w.get<HTMLInputElement>('[aria-label="End Day"]').element.value).toBe("30");
    w.unmount();
  });
  it("日数と、逆の範囲の間違い", () => {
    expect(inclusiveDays("2026-11-01", "2026-11-30")).toBe(30);
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    const ok = mount(ArDateRange, { props: { modelValue: { start: "2026-11-01", end: "2026-11-30" } } });
    expect(ok.get('[data-part="days"]').text()).toBe("30日間");
    const bad = mount(ArDateRange, { props: { modelValue: { start: "2026-11-30", end: "2026-11-01" } } });
    expect(bad.get('[data-part="error"]').text()).toContain("終わりの日");
  });
  it("パネル：日を押して「決める」で出す。←→で日を動かせる", async () => {
    const w = mount(ArDatePicker, { props: { modelValue: "2026-10-21", inline: true } });
    expect(w.findAll('[data-part="day"]').length % 7).toBe(0);
    expect(w.get('[data-date="2026-10-21"]').attributes("data-state")).toContain("selected");
    await w.get('[data-date="2026-10-21"]').trigger("keydown", { key: "ArrowRight" });
    await w.get('[data-date="2026-10-22"]').trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await w.get('[data-part="foot"] [data-tone="primary"]').trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["2026-10-22"]);
  });
  it("範囲：2回押すと始まりと終わり（逆に押しても並べ替える）。間は in-range", async () => {
    const w = mount(ArDatePicker, { props: { modelValue: { start: null, end: null }, range: true, inline: true, confirm: false } });
    await w.get('[data-date="' + w.findAll('[data-part="day"]:not([data-state~="outside"])')[9]!.attributes("data-date") + '"]').trigger("click");
    const first = w.findAll('[data-part="day"]:not([data-state~="outside"])');
    await first[4]!.trigger("click");
    const v = w.emitted("update:modelValue")?.[0]?.[0] as { start: string; end: string };
    expect(v.start < v.end).toBe(true);
    expect(v.start).toBe(first[4]!.attributes("data-date"));
  });
  it("入力欄の右のボタンでパネルを開く（ブラウザの日付の部品は使わない）", async () => {
    const w = mount(ArDatePicker, { props: { modelValue: "2026-10-21", label: "日付" }, attachTo: document.body });
    expect(w.find('input[type="date"]').exists()).toBe(false);
    await w.get('[data-part="trigger"]').trigger("click");
    await tick();
    expect(document.querySelector('[data-ar="date-picker-panel"]')).not.toBeNull();
    expect(w.emitted("update:open")?.[0]).toEqual([true]);
    w.unmount();
  });
});

describe("ArTimePicker・ArRate・ArSlider", () => {
  it("時刻のパネル：時と分を選んで決める", async () => {
    const w = mount(ArTimePicker, { props: { modelValue: "09:00", inline: true, minuteStep: 10 } });
    expect(w.findAll('[data-col="m"] [data-part="cell"]')).toHaveLength(6);
    await w.get('[data-col="h"]').trigger("keydown", { key: "ArrowDown" });
    await w.findAll('[data-col="m"] [data-part="cell"]')[3]!.trigger("click");
    await w.get('[data-part="foot"] [data-tone="primary"]').trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["10:30"]);
  });
  it("評価：押すと値、同じ値をもう一度で 0、←→で動く", async () => {
    const w = mount(ArRate, { props: { modelValue: 3, label: "評価" } });
    await w.findAll('[data-part="star"]')[3]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([4]);
    await w.findAll('[data-part="star"]')[2]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[1]).toEqual([0]);
    await w.trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("update:modelValue")?.[2]).toEqual([2]);
    expect(w.attributes("role")).toBe("slider");
  });
  it("スライダー：キーで step、範囲は逆転しない、目盛りだけに止まる", async () => {
    const w = mount(ArSlider, { props: { modelValue: [4, 6], range: true, min: 0, max: 10, label: "表示時間" } });
    const [a] = w.findAll('[data-part="handle"]');
    expect(a!.attributes("aria-valuemax")).toBe("6");
    await a!.trigger("keydown", { key: "End" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual([[6, 6]]);
    const m = mount(ArSlider, { props: { modelValue: 5, step: null, marks: [{ value: 5 }, { value: 10 }, { value: 30 }], min: 5, max: 30, label: "間隔" } });
    await m.get('[data-part="handle"]').trigger("keydown", { key: "ArrowRight" });
    expect(m.emitted("change")?.[0]).toEqual([10]);
  });
});

describe("色・曜日・札", () => {
  it("色の計算", () => {
    expect(normalizeHex("8e6bc4")).toBe("#8E6BC4");
    expect(normalizeHex("#abc")).toBe("#AABBCC");
    expect(normalizeHex("xyz")).toBeNull();
    expect(hsvToHex(hexToHsv("#8E6BC4"))).toBe("#8E6BC4");
  });
  it("色の丸：選んだ色だけ aria-checked、←→で次の色", async () => {
    const w = mount(ArColorSwatches, { props: { modelValue: "#8e6bc4", label: "色" } });
    const sw = w.findAll('[data-part="swatch"]');
    expect(sw[0]!.attributes("aria-checked")).toBe("true");
    expect(sw[0]!.attributes("tabindex")).toBe("0");
    await sw[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["#2F6BDA"]);
  });
  it("色の選択：開いて決まった色を押すとすぐ値が変わる", async () => {
    const w = mount(ArColorPicker, { props: { modelValue: "#8E6BC4", label: "色" }, attachTo: document.body });
    await w.get('[data-part="chip"]').trigger("click");
    await tick();
    (document.querySelectorAll('[data-ar="color-picker-panel"] [data-part="swatch"]')[2] as HTMLElement).click();
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["#2E9A6B"]);
    w.unmount();
  });
  it("曜日：押すたびに切り替わり、日〜土・祝の順で出す", async () => {
    const w = mount(ArWeekdayPicker, { props: { modelValue: [3, 1], label: "曜日" } });
    const days = w.findAll('[data-part="day"]');
    expect(days).toHaveLength(8);
    expect(days[0]!.attributes("data-kind")).toBe("sun");
    expect(days[7]!.attributes("data-kind")).toBe("sun");
    expect(days[6]!.attributes("data-kind")).toBe("sat");
    await days[7]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([[1, 3, "holiday"]]);
  });
  it("札：1つ選ぶ・いくつでも", async () => {
    const options = [{ value: "a", label: "全員" }, { value: "b", label: "末永" }];
    const one = mount(ArPills, { props: { modelValue: "a", options, label: "人" } });
    await one.findAll("button")[1]!.trigger("click");
    expect(one.emitted("update:modelValue")?.[0]).toEqual(["b"]);
    const many = mount(ArPills, { props: { modelValue: ["b"], options, multiple: true, label: "人" } });
    await many.findAll("button")[0]!.trigger("click");
    expect(many.emitted("update:modelValue")?.[0]).toEqual([["a", "b"]]);
  });
});

describe("ArTransfer・ArUpload", () => {
  it("左でチェックして ＞ で右へ移す", async () => {
    const items = [{ value: 1, label: "田中" }, { value: 2, label: "山本" }, { value: 3, label: "鈴木" }];
    const w = mount(ArTransfer, { props: { modelValue: [3], items, label: "相手" } });
    const left = w.get('[data-side="left"]');
    expect(left.findAll('[data-part="item"]')).toHaveLength(2);
    await left.findAll('[data-part="item"] input')[1]!.setValue(true);
    await nextTick();
    await w.get('[data-part="actions"] [data-tone="primary"]').trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([[2, 3]]);
  });
  it("アップロード：形式と大きさで分け、select と reject を出す。失敗は理由を出す", async () => {
    const w = mount(ArUpload, {
      props: { accept: ".xlsx", maxSize: 10, multiple: true, files: [{ id: 1, name: "写真.heic", status: "error", error: "形式が違います" }] },
    });
    expect(w.get('[data-status="error"]').text()).toContain("形式が違います");
    const ok = new File(["1"], "a.xlsx");
    const big = new File(["12345678901"], "b.xlsx");
    const ng = new File(["1"], "c.pdf");
    const input = w.get('input[type="file"]').element as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [ok, big, ng] });
    await w.get('input[type="file"]').trigger("change");
    expect(w.emitted("select")?.[0]).toEqual([[ok]]);
    expect((w.emitted("reject")?.[0]?.[0] as { reason: string }[]).map((r) => r.reason)).toEqual(["大きすぎます", "形式が違います"]);
  });
});
