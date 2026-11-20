import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArColorPicker from "../src/components/ArColorPicker.vue";

describe("ArColorPicker の見本の横の文字", () => {
  it("決まった色は色の名前、決まった色にない色は「自由な色」、未選択は未選択と出す（カラーコードは出さない）", () => {
    const value = (modelValue: string | null) =>
      mount(ArColorPicker, { props: { modelValue, label: "色" } }).find('[data-part="value"]').text();
    expect(value("#D2457A")).toBe("桃");
    expect(value("#d2457a")).toBe("桃");
    expect(value("#123456")).toBe("自由な色");
    expect(value(null)).toBe("未選択");
  });
});
