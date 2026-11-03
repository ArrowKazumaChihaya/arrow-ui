import { mount } from "@vue/test-utils";
import { clampDate, daysInMonth, weekdayOf } from "../src/components/date";
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
    expect((w.get('[data-part="year"]').element as HTMLSelectElement).value).toBe("2026");
    expect((w.get('[data-part="month"]').element as HTMLInputElement).value).toBe("10");
    expect((w.get('[data-part="day"]').element as HTMLInputElement).value).toBe("18");
    const wd = w.get('[data-part="weekday"]');
    expect(wd.text()).toBe("(日)");
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

  it("年はセレクトで、選ぶとすぐ出す", async () => {
    const w = mount(ArDateInput, { props: { modelValue: "2026-10-18", minYear: 2024, maxYear: 2028 } });
    const y = w.get('[data-part="year"]');
    expect(y.findAll("option")).toHaveLength(5);
    await y.setValue("2027");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["2027-10-18"]);
  });
});
