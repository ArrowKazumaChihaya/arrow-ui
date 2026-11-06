import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import ArSelect from "../src/components/ArSelect.vue";
import ArAvatar from "../src/components/ArAvatar.vue";

afterEach(() => { document.body.innerHTML = ""; });

describe("person selection", () => {
  it("shows the same photo in the selected value and the grouped list, and searches employee codes", async () => {
    const person = { value: 17, label: "山田 太郎", avatar: "山", avatarSrc: "/person-17.png", avatarSeed: 17, keywords: "ヤマダ A017", description: "渋谷店" };
    const w = mount(ArSelect, { props: { modelValue: 17, options: [{ label: "東京", options: [person] }], searchable: true }, attachTo: document.body });
    expect(w.get('[data-part="value"] img').attributes("src")).toBe("/person-17.png");
    await w.setProps({ modelValue: null });
    await w.get('[data-ar="select"]').trigger("click");
    await flushPromises();
    const input = document.body.querySelector("input")!;
    input.value = "A017";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await nextTick();
    const option = document.body.querySelector('[role="option"]')!;
    expect(option.querySelector("img")?.getAttribute("src")).toBe("/person-17.png");
    expect(option.textContent).toContain("渋谷店");
    option.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([17]);
    w.unmount();
  });

  it("falls back to initials after an image error and retries when the person changes", async () => {
    const w = mount(ArAvatar, { props: { name: "山田", src: "/missing.png" } });
    expect(w.get("img").attributes()).toMatchObject({ loading: "lazy", decoding: "async", referrerpolicy: "no-referrer" });
    await w.get("img").trigger("error");
    expect(w.find("img").exists()).toBe(false);
    expect(w.text()).toBe("山");
    await w.setProps({ name: "佐藤", src: "/sato.png" });
    expect(w.get("img").attributes("src")).toBe("/sato.png");
    await w.setProps({ src: undefined });
    expect(w.text()).toBe("佐");
    w.unmount();
  });

  it("supports a photo without initials in a flat list", async () => {
    const w = mount(ArSelect, { props: { modelValue: "17", options: [{ value: "17", label: "山田", avatarSrc: "/17.png" }] }, attachTo: document.body });
    await w.get('[data-ar="select"]').trigger("click");
    await flushPromises();
    expect(document.body.querySelector('[role="listbox"]')?.getAttribute("data-kind")).toBe("people");
    expect(document.body.querySelector('[role="option"] img')?.getAttribute("src")).toBe("/17.png");
    w.unmount();
  });
});
