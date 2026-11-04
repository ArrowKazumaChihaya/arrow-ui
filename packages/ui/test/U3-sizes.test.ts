import { mount } from "@vue/test-utils";
import type { Component } from "vue";
import ArDateInput from "../src/components/ArDateInput.vue";
import ArDateRange from "../src/components/ArDateRange.vue";
import ArDatePicker from "../src/components/ArDatePicker.vue";
import ArDateTimeInput from "../src/components/ArDateTimeInput.vue";
import ArYearInput from "../src/components/ArYearInput.vue";
import ArYearMonthInput from "../src/components/ArYearMonthInput.vue";
import ArMonthDayInput from "../src/components/ArMonthDayInput.vue";
import ArDurationInput from "../src/components/ArDurationInput.vue";
import ArZipInput from "../src/components/ArZipInput.vue";
import ArTextarea from "../src/components/ArTextarea.vue";
import ArStepper from "../src/components/ArStepper.vue";
import ArTimeInput from "../src/components/ArTimeInput.vue";

// 大きさの段（sm・md・lg）を足した部品：既定は md、渡した段が根の data-size に出る。
const cases: [string, Component, Record<string, unknown>][] = [
  ["ArDateInput", ArDateInput, { modelValue: "2026-11-04" }],
  ["ArDateRange", ArDateRange, { modelValue: { start: "2026-11-01", end: "2026-11-30" } }],
  ["ArDatePicker", ArDatePicker, { modelValue: "2026-11-04" }],
  ["ArDateTimeInput", ArDateTimeInput, { modelValue: "2026-11-03 09:00:00" }],
  ["ArYearInput", ArYearInput, { modelValue: 2026 }],
  ["ArYearMonthInput", ArYearMonthInput, { modelValue: "2026-10" }],
  ["ArMonthDayInput", ArMonthDayInput, { modelValue: "04-01" }],
  ["ArDurationInput", ArDurationInput, { modelValue: 90 }],
  ["ArZipInput", ArZipInput, { modelValue: "150-0041" }],
  ["ArTextarea", ArTextarea, { modelValue: "" }],
  ["ArStepper", ArStepper, { modelValue: 2 }],
];

describe("大きさの段", () => {
  it.each(cases)("%s は既定で md、size を根の data-size に出す", (_n, comp, props) => {
    expect(mount(comp, { props }).attributes("data-size")).toBe("md");
    for (const size of ["sm", "lg"]) expect(mount(comp, { props: { ...props, size } }).attributes("data-size")).toBe(size);
  });

  it("日付の範囲・日付の選択は中の日付の入力にも段を渡す", () => {
    for (const comp of [ArDateRange, ArDatePicker]) {
      const w = mount(comp, { props: { modelValue: comp === ArDateRange ? { start: null, end: null } : null, size: "lg" } });
      const inner = w.findAll('[data-ar="date-input"]');
      expect(inner.length).toBeGreaterThan(0);
      for (const i of inner) expect(i.attributes("data-size")).toBe("lg");
    }
  });

  it("日時の入力は日付と時刻の両方に段を渡し、時刻のプルダウンも同じ段になる", () => {
    const w = mount(ArDateTimeInput, { props: { modelValue: "2026-11-03 09:00:00", size: "sm" } });
    expect(w.find('[data-ar="date-input"]').attributes("data-size")).toBe("sm");
    expect(w.find('[data-ar="time-input"]').attributes("data-size")).toBe("sm");
    for (const s of w.findAll('[data-ar="time-input"] [data-ar="select"]')) expect(s.attributes("data-size")).toBe("sm");
  });

  it("時刻の select の形はプルダウンも時刻と同じ段（既定 md）", () => {
    const w = mount(ArTimeInput, { props: { modelValue: { time: "09:00", day: "same" }, select: true } });
    const sel = w.findAll('[data-ar="select"]');
    expect(sel.length).toBe(2);
    for (const s of sel) expect(s.attributes("data-size")).toBe("md");
  });

  it("郵便番号は中の入力に段を渡す", () => {
    const w = mount(ArZipInput, { props: { modelValue: null, size: "lg" } });
    expect(w.find('[data-ar="text-input"]').attributes("data-size")).toBe("lg");
  });
});
