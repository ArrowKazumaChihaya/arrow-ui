import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ArShiftChart from "../src/components/ArShiftChart.vue";
import ArSelect from "../src/components/ArSelect.vue";

describe("ArShiftChart の「シフトに合わせる」", () => {
  it("押すとボタンに少しのあいだ印を付け（選択欄の枠と同じ見た目）、時間の範囲は光らせない", async () => {
    vi.useFakeTimers();
    const w = mount(ArShiftChart, { props: { rows: [] } as never, attachTo: document.body });
    const fit = w.find('[data-part="fit"]');
    expect(fit.exists()).toBe(true);
    await fit.trigger("click");
    vi.advanceTimersByTime(50);
    await nextTick();
    expect(w.find('[data-part="fit"]').attributes("data-flash")).toBe("");
    expect(w.find('[data-part="range"]').attributes("data-state")).toBeUndefined();
    vi.advanceTimersByTime(800);
    await nextTick();
    expect(w.find('[data-part="fit"]').attributes("data-flash")).toBeUndefined();
    w.unmount();
    vi.useRealTimers();
  });

  it("表示する時間の選択欄は短く、一覧に検索欄を出さない（時刻を選ぶだけなので）", () => {
    const w = mount(ArShiftChart, { props: { rows: [] } as never });
    const selects = w.findAllComponents(ArSelect).filter((c) => c.element.closest('[data-part="range"]'));
    expect(selects).toHaveLength(2);
    for (const select of selects) expect(select.props("searchable")).toBe(false);
  });
});
