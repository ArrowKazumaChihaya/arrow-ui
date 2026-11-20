import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArPeriodBox from "../src/components/ArPeriodBox.vue";

describe("ArPeriodBox：カスタムがないとき", () => {
  it("日付を打つ欄を出さず、月の切り替えと期間の文字（曜日・日数）を出す", async () => {
    const w = mount(ArPeriodBox, {
      props: { modelValue: { mode: "month", start: "2026-11-01", end: "2026-11-30" }, modes: ["month", "half"], label: "募集する期間" },
    });
    expect(w.find('[data-part="range"]').exists()).toBe(false);
    expect(w.find("input").exists()).toBe(false);
    expect(w.find('[data-part="period"]').text()).toBe("11月1日（日）〜11月30日（月）30日間");
    await w.find('[data-part="nav"] button:last-of-type').trigger("click");
    expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual({ mode: "month", start: "2026-12-01", end: "2026-12-31" });
  });

  it("半月は前半・後半で選ぶ", async () => {
    const w = mount(ArPeriodBox, {
      props: { modelValue: { mode: "half", start: "2026-11-01", end: "2026-11-15" }, modes: ["month", "half"], label: "期間" },
    });
    expect(w.find('[data-part="period"]').text()).toBe("11月1日（日）〜11月15日（日）15日間");
    const halves = w.findAll('[data-part="fixed"] [data-ar="segmented"] button');
    await halves.at(-1)!.trigger("click");
    expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual({ mode: "half", start: "2026-11-16", end: "2026-11-30" });
  });

  it("カスタムを選べるときは今までどおり日付を打てる", () => {
    const w = mount(ArPeriodBox, {
      props: { modelValue: { mode: "month", start: "2026-11-01", end: "2026-11-30" }, label: "期間" },
    });
    expect(w.find('[data-part="range"]').exists()).toBe(true);
    expect(w.find('[data-part="fixed"]').exists()).toBe(false);
  });
});
