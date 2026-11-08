import { mount } from "@vue/test-utils";
import { clampDate, daysInMonth, weekdayOf } from "../src/components/date";
// jsdom には scrollIntoView がない（年のプルダウンが使う）
Element.prototype.scrollIntoView ??= function () {};
import ArDateInput from "../src/components/ArDateInput.vue";

describe("日付の計算", () => {
  it("月の日数（うるう年）", () => {
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2026, 11)).toBe(30);
  });
  it("曜日", () => expect(weekdayOf(2026, 10, 21)).toBe(3));
  it("31日を2月にすると末日", () => expect(clampDate(2026, 2, 31)).toBe("2026-02-28"));
});

describe("ArDateInput", () => {
  it("値を年・月・日に分けて出し、曜日を出す", () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-18" } });
    expect(w.get('[data-part="year"]').text()).toBe("2026");
    expect(w.find("select").exists()).toBe(false);
    expect((w.get('[data-part="month"]').element as HTMLInputElement).value).toBe("10");
    expect((w.get('[data-part="day"]').element as HTMLInputElement).value).toBe("18");
    const wd = w.get('[data-part="weekday"]');
    expect(wd.text()).toBe("（日）");
    expect(wd.attributes("data-kind")).toBe("sun");
  });

  it("日を直して確定すると YYYY-MM-DD を出す（全角も読む）", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-18" } });
    const d = w.get('[data-part="day"]');
    await d.setValue("２１");
    await d.trigger("blur");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["2026-10-21"]);
  });

  it("末日を越えた日は末日に寄せる", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-01-31" } });
    const m = w.get('[data-part="month"]');
    await m.setValue("2");
    await m.trigger("blur");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["2026-02-28"]);
  });

  it("どれかが空なら null", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-18" } });
    const d = w.get('[data-part="day"]');
    await d.setValue("");
    await d.trigger("blur");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([null]);
  });

  it("年はプルダウン（ネイティブの select ではない）で、選ぶとすぐ出す", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-18", minYear: 2024, maxYear: 2028 }, attachTo: document.body });
    const y = w.get('[data-part="year"]');
    expect(y.attributes("role")).toBe("combobox");
    await y.trigger("keydown", { key: "ArrowDown" });
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(5);
    await y.trigger("keydown", { key: "ArrowDown" });
    await y.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["2027-10-18"]);
    w.unmount();
  });
});


describe("ArDateInput live segmented entry", () => {
  it("keeps a one-digit day draft through model echo and accepts the second digit", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-08", pad: "zero", updateOnInput: true,
      "onUpdate:modelValue": value => { void w.setProps({modelValue: value}); } } });
    const day = w.get<HTMLInputElement>('[data-part="day"]');
    await day.setValue("1");
    expect(day.element.value).toBe("1");
    await day.setValue("15");
    expect(w.props("modelValue")).toBe("2026-10-15");
    await day.setValue("3");
    await day.trigger("blur");
    expect(day.element.value).toBe("03");
    w.unmount();
  });
  it("advances 2-9 to day, but waits for a second digit after 1", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-08", pad: "zero" }, attachTo: document.body });
    const month = w.get<HTMLInputElement>('[data-part="month"]');
    const day = w.get<HTMLInputElement>('[data-part="day"]');
    month.element.focus();
    await month.setValue("1");
    expect(document.activeElement).toBe(month.element);
    await month.setValue("12");
    expect(document.activeElement).toBe(day.element);
    expect(day.element.selectionStart).toBe(0);
    expect(day.element.selectionEnd).toBe(2);
    month.element.focus();
    await month.setValue("２");
    expect(document.activeElement).toBe(day.element);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["2026-02-08"]);
    w.unmount();
  });
});
