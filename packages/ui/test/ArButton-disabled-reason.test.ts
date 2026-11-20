import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArButton from "../src/components/ArButton.vue";

describe("ArButton の押せない理由", () => {
  it("押せない理由は、乗せたときにも出す（押して開く説明と同じ文）", () => {
    const w = mount(ArButton, {
      props: { icon: "trash", label: "削除", disabled: true, disabledReason: "社員に値が入っているため削除できません" },
    });
    expect(w.attributes("title")).toBe("社員に値が入っているため削除できません");
    expect(w.attributes("aria-disabled")).toBe("true");
  });

  it("理由がないときは、印だけのボタンは名前を出す", () => {
    const w = mount(ArButton, { props: { icon: "trash", label: "削除" } });
    expect(w.attributes("title")).toBe("削除");
  });
});
