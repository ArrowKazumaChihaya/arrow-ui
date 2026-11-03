import { mount } from "@vue/test-utils";
import ArPunchButton from "../src/components/ArPunchButton.vue";

describe("ArPunchButton", () => {
  it("kind の名前・色・大きさが既定で決まり、押すと punch を出す", async () => {
    const w = mount(ArPunchButton, { props: { kind: "in" } });
    expect(w.get('[data-part="label"]').text()).toBe("出勤");
    expect(w.attributes("data-ar-palette")).toBe("blue");
    expect(w.attributes("data-size")).toBe("lg");
    await w.get("button").trigger("click");
    expect(w.emitted("punch")).toEqual([["in"]]);
    const b = mount(ArPunchButton, { props: { kind: "break-out" } });
    expect(b.get('[data-part="label"]').text()).toBe("休憩終了");
    expect(b.attributes("data-ar-palette")).toBe("green");
    expect(b.attributes("data-size")).toBe("sm");
  });
  it("押せないときは理由をボタンの説明にし、押しても何も出さない", async () => {
    const w = mount(ArPunchButton, { props: { kind: "out", disabled: true, reason: "出勤してから押せます" } });
    const btn = w.get("button");
    expect(btn.attributes("disabled")).toBeDefined();
    const id = btn.attributes("aria-describedby")!;
    expect(w.get(`#${id}`).text()).toBe("出勤してから押せます");
    await btn.trigger("click");
    expect(w.emitted("punch")).toBeUndefined();
  });
  it("記録中は aria-busy で押せない", () => {
    const w = mount(ArPunchButton, { props: { kind: "in", loading: true } });
    expect(w.get("button").attributes("aria-busy")).toBe("true");
    expect(w.attributes("data-state")).toBe("loading");
  });
});
