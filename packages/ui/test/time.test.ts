import { mount } from "@vue/test-utils";
import { addMinutes, parseTime } from "../src/components/time";
import ArTimeInput from "../src/components/ArTimeInput.vue";

describe("parseTime", () => {
  it.each([
    ["930", "09:30"],
    ["0930", "09:30"],
    ["9", "09:00"],
    ["17", "17:00"],
    ["9:5", "09:05"],
    ["１７：３０", "17:30"],
    [" 1730 ", "17:30"],
  ])("%s → %s", (input, out) => expect(parseTime(input)).toBe(out));
  it("空は null", () => expect(parseTime("")).toBeNull());
  it.each(["2460", "24:00", "9:60", "abc", "12345"])("%s は読めない", (s) => expect(parseTime(s)).toBeUndefined());
  it("分を足すと日をまたいで回る", () => {
    expect(addMinutes("23:55", 10)).toBe("00:05");
    expect(addMinutes("00:00", -5)).toBe("23:55");
  });
});

describe("ArTimeInput", () => {
  const value = { time: "09:00", day: "same" as const };

  it("確定するまで値を出さず、確定で整えて出す", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: value } });
    const input = w.get('[data-part="input"]');
    await input.setValue("1730");
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await input.trigger("blur");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([{ time: "17:30", day: "same" }]);
    expect(w.emitted("commit")).toHaveLength(1);
    expect((input.element as HTMLInputElement).value).toBe("17:30");
  });

  it("Enter でも確定する", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: value } });
    const input = w.get('[data-part="input"]');
    await input.setValue("8");
    await input.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual([{ time: "08:00", day: "same" }]);
  });

  it("読めない文字は値を変えず、間違いの状態にする", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: value } });
    const input = w.get('[data-part="input"]');
    await input.setValue("25:00");
    await input.trigger("blur");
    expect(w.emitted("update:modelValue")).toBeUndefined();
    expect(w.emitted("invalid")?.[0]).toEqual(["25:00"]);
    expect(w.get('[data-ar="time-input"]').attributes("data-state")).toContain("invalid");
    expect(input.attributes("aria-invalid")).toBe("true");
  });

  it("dayShift なら［当日⇄前日］が出て、押すたびに切り替わる。Tab では止まらない", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: value, dayShift: true, label: "出勤" } });
    const toggle = w.get('[data-part="day-toggle"]');
    expect(toggle.attributes("tabindex")).toBe("-1");
    expect(toggle.text()).toBe("当日");
    await toggle.trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([{ time: "09:00", day: "prev" }]);
    await w.setProps({ modelValue: { time: "09:00", day: "prev" } });
    expect(w.get('[data-part="day-toggle"]').text()).toBe("前日");
    expect(w.get('[data-ar="time-input"]').attributes("data-state")).toContain("prev");
    expect(w.get('[data-part="day-toggle"]').attributes("aria-pressed")).toBe("true");
  });

  it("空欄で選んだ前日を、分数モデルのnull往復後の入力にも使う", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: { time: null, day: "same" }, dayShift: true } });
    await w.get('[data-part="day-toggle"]').trigger("click");
    // The application's minute adapter cannot represent prev for a null time.
    await w.setProps({ modelValue: { time: null, day: "same" } });
    expect(w.get('[data-part="day-toggle"]').text()).toBe("前日");
    await w.get('[data-part="input"]').setValue("23:00");
    await w.get('[data-part="input"]').trigger("blur");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([{ time: "23:00", day: "prev" }]);
    await w.setProps({ modelValue: { time: "23:00", day: "prev" } });
    await w.setProps({ modelValue: { time: null, day: "same" } });
    expect(w.get('[data-part="day-toggle"]').text()).toBe("当日");
    w.unmount();
  });

  it("dayShift でなければ切り替えを出さず、day は常に same", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: { time: null, day: "prev" } } });
    expect(w.find('[data-part="day-toggle"]').exists()).toBe(false);
    await w.get('[data-part="input"]').setValue("10");
    await w.get('[data-part="input"]').trigger("blur");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([{ time: "10:00", day: "same" }]);
  });

  it("↑↓で step 分ずつ動く", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: value, step: 15 } });
    const input = w.get('[data-part="input"]');
    await input.trigger("keydown", { key: "ArrowUp" });
    expect((input.element as HTMLInputElement).value).toBe("09:15");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowDown" });
    expect((input.element as HTMLInputElement).value).toBe("08:45");
  });

  it("外から値が変わると表示も変わる（入力中でなければ）", async () => {
    const w = mount(ArTimeInput, { props: { modelValue: value } });
    await w.setProps({ modelValue: { time: "12:34", day: "same" } });
    expect((w.get('[data-part="input"]').element as HTMLInputElement).value).toBe("12:34");
  });
});
