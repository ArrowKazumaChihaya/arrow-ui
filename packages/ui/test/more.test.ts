import { mount } from "@vue/test-utils";
import ArTextInput from "../src/components/ArTextInput.vue";
import ArSelect from "../src/components/ArSelect.vue";
import ArCheckbox from "../src/components/ArCheckbox.vue";
import ArRadioGroup from "../src/components/ArRadioGroup.vue";
import ArSwitch from "../src/components/ArSwitch.vue";
import ArTabs from "../src/components/ArTabs.vue";
import ArCard from "../src/components/ArCard.vue";
import ArAlert from "../src/components/ArAlert.vue";
import ArTag from "../src/components/ArTag.vue";

describe("ArTextInput", () => {
  it("打つたびに update:modelValue、確定で change", async () => {
    const w = mount(ArTextInput, { props: { modelValue: "", label: "タイトル", suffix: "分" } });
    const input = w.get("input");
    await input.setValue("朝礼");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["朝礼"]);
    await w.setProps({ modelValue: "朝礼" });
    await input.trigger("blur");
    expect(w.emitted("change")?.[0]).toEqual(["朝礼"]);
    expect(input.attributes("aria-label")).toBe("タイトル");
    expect(w.get('[data-part="suffix"]').text()).toBe("分");
  });
});

describe("ArSelect", () => {
  const options = [
    { value: 1, label: "渋谷店" },
    { label: "大阪", options: [{ value: 3, label: "梅田店" }] },
  ];
  it("ネイティブの select を使わず、押す所は combobox", () => {
    const w = mount(ArSelect, { props: { modelValue: 1, options, label: "店舗" } });
    expect(w.find("select").exists()).toBe(false);
    expect(w.get('[data-ar="select"]').attributes("role")).toBe("combobox");
    expect(w.get('[data-part="value"]').text()).toBe("渋谷店");
  });
  it("未選択は placeholder を出し、empty の状態", () => {
    const w = mount(ArSelect, { props: { modelValue: null, options, placeholder: "選んでください", label: "店舗" } });
    expect(w.get('[data-ar="select"]').attributes("data-state")).toContain("empty");
    expect(w.get('[data-part="placeholder"]').text()).toBe("選んでください");
  });
});

describe("ArCheckbox・ArRadioGroup・ArSwitch", () => {
  it("チェックの切り替えと一部の状態", async () => {
    const w = mount(ArCheckbox, { props: { modelValue: false, indeterminate: true }, slots: { default: "すべて" } });
    expect((w.get("input").element as HTMLInputElement).indeterminate).toBe(true);
    expect(w.attributes("data-state")).toContain("indeterminate");
    await w.get("input").setValue(true);
    expect(w.emitted("update:modelValue")?.[0]).toEqual([true]);
  });
  it("ラジオは同じ name のまとまりで、選んだ値を出す", async () => {
    const w = mount(ArRadioGroup, {
      props: { modelValue: 1, label: "対象", options: [{ value: 1, label: "次の回だけ" }, { value: 2, label: "すべて" }] },
    });
    expect(w.attributes("role")).toBe("radiogroup");
    const [a, b] = w.findAll("input");
    expect(a?.attributes("name")).toBe(b?.attributes("name"));
    await b?.trigger("change");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([2]);
  });
  it("スイッチは role=switch で、読み込み中は押せない", async () => {
    const w = mount(ArSwitch, { props: { modelValue: false, label: "公開する" } });
    expect(w.attributes("role")).toBe("switch");
    expect(w.attributes("aria-checked")).toBe("false");
    await w.trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([true]);
    await w.setProps({ loading: true });
    await w.trigger("click");
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });
});

describe("ArTabs", () => {
  const items = [
    { key: "cal", label: "カレンダー" },
    { key: "table", label: "テーブル", count: 3 },
    { key: "view", label: "閲覧", disabled: true },
  ];
  it("選んでいるタブだけ Tab で止まり、←→で移る（使えないタブは飛ばす）", async () => {
    const w = mount(ArTabs, { props: { modelValue: "cal", items, label: "表示", variant: "band" }, attachTo: document.body });
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0]?.attributes("tabindex")).toBe("0");
    expect(tabs[1]?.attributes("tabindex")).toBe("-1");
    expect(tabs[0]?.attributes("aria-selected")).toBe("true");
    await tabs[0]?.trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["table"]);
    await tabs[0]?.trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("update:modelValue")?.[1]).toEqual(["table"]);
    expect(w.get('[data-part="count"]').text()).toBe("3");
    w.unmount();
  });
});

describe("ArCard・ArAlert・ArTag", () => {
  it("カードは見出し・操作・タブ・本文の部位を持つ", () => {
    const w = mount(ArCard, {
      props: { title: "シフト詳細", icon: "users", variant: "band", headingLevel: 2 },
      slots: { default: "本文", actions: "操作", tabs: "タブ" },
    });
    expect(w.get("h2").text()).toBe("シフト詳細");
    expect(w.attributes("data-variant")).toBe("band");
    expect(w.get('[data-part="actions"]').text()).toBe("操作");
    expect(w.get('[data-part="tabs"]').text()).toBe("タブ");
  });
  it("お知らせは種類で読み上げ方を変え、閉じられる", async () => {
    const w = mount(ArAlert, { props: { tone: "danger", closable: true }, slots: { default: "エラーの2行は取り込まれません" } });
    expect(w.attributes("role")).toBe("alert");
    await w.get('[data-part="close"]').trigger("click");
    expect(w.emitted("close")).toHaveLength(1);
    expect(mount(ArAlert, { props: { tone: "info" } }).attributes("role")).toBe("status");
  });
  it("札は種類を属性で出す", () => {
    const w = mount(ArTag, { props: { tone: "ok", icon: "check" }, slots: { default: "提出済" } });
    expect(w.attributes("data-tone")).toBe("ok");
    expect(w.text()).toBe("提出済");
  });
});
