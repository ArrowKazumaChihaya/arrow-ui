import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArFormatIcon from "../src/components/ArFormatIcon.vue";

describe("ArFormatIcon", () => {
  it("形式ごとの色と文字、名前があれば読み上げる", () => {
    const w = mount(ArFormatIcon, { props: { format: "CSV", size: 22, label: "CSV" } });
    expect(w.attributes("data-format")).toBe("CSV");
    expect(w.attributes("role")).toBe("img");
    expect(w.attributes("aria-label")).toBe("CSV");
    expect(w.get("text").text()).toBe("CSV");
    expect(w.attributes("style")).toContain("22px");
    const excel = mount(ArFormatIcon, { props: { format: "Excel" } });
    expect(excel.get("text").text()).toBe("XLS");
    expect(excel.attributes("aria-hidden")).toBe("true");
  });
});
