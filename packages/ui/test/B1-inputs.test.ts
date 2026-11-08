import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive, ref } from "vue";
import ArTextInput from "../src/components/ArTextInput.vue";
import ArTextarea from "../src/components/ArTextarea.vue";
import ArSelect from "../src/components/ArSelect.vue";
import ArAutoComplete from "../src/components/ArAutoComplete.vue";
import ArCascader from "../src/components/ArCascader.vue";
import ArTreeSelect from "../src/components/ArTreeSelect.vue";
import ArMentions from "../src/components/ArMentions.vue";
import ArInputNumber from "../src/components/ArInputNumber.vue";
import ArStepper from "../src/components/ArStepper.vue";
import ArField from "../src/components/ArField.vue";
import ArForm from "../src/components/ArForm.vue";
import type { ArFieldControlProps } from "../src/components/ArField.contract";
import { fold, splitByReading, splitMatch } from "../src/internal/options";
import { formatNumber, parseNumber } from "../src/internal/number";

const body = () => document.body;
const q = (sel: string) => body().querySelector(sel) as HTMLElement | null;
const qa = (sel: string) => [...body().querySelectorAll(sel)] as HTMLElement[];
afterEach(() => {
  document.body.innerHTML = "";
});

describe("候補の道具", () => {
  it("ひらがな・カタカナ・全角半角を同じに比べ、合った所を分ける", () => {
    expect(fold("サトウ")).toBe("さとう");
    expect(splitMatch("さとう 美咲", "サト")).toEqual([
      { text: "さと", match: true },
      { text: "う 美咲", match: false },
    ]);
    expect(splitByReading("佐藤 大地", "さとう だいち", "さと")).toEqual([
      { text: "佐藤", match: true },
      { text: " ", match: false },
      { text: "大地", match: false },
    ]);
  });
  it("数を読む・カンマで見せる", () => {
    expect(parseNumber("１,２００")).toBe(1200);
    expect(parseNumber("abc")).toBeNull();
    expect(formatNumber(1234567.5, true, 1)).toBe("1,234,567.5");
  });
});

describe("ArTextInput", () => {
  it("パスワードは目のボタンで見せる・隠す", async () => {
    const w = mount(ArTextInput, { props: { modelValue: "secret", type: "password", label: "パスワード" } });
    expect(w.get("input").attributes("type")).toBe("password");
    await w.get('[data-part="reveal"]').trigger("click");
    expect(w.get("input").attributes("type")).toBe("text");
    expect(w.get('[data-part="reveal"]').attributes("aria-pressed")).toBe("true");
  });
  it("消すボタン・文字数・探す（Enter で search）", async () => {
    const w = mount(ArTextInput, { props: { modelValue: "朝礼", type: "search", clearable: true, showCount: true, maxlength: 10, label: "探す" } });
    expect(w.get('[data-part="count"]').text()).toBe("2 / 10");
    expect(w.find('[data-part="prefix"][data-kind="icon"]').exists()).toBe(true);
    await w.get("input").trigger("keydown", { key: "Enter" });
    expect(w.emitted("search")?.[0]).toEqual(["朝礼"]);
    await w.get('[data-part="clear"]').trigger("click");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([""]);
  });
  it("aria-describedby などは中の input に渡る", () => {
    const w = mount(ArTextInput, { props: { modelValue: "" }, attrs: { "aria-describedby": "x-help", class: "c" } });
    expect(w.get("input").attributes("aria-describedby")).toBe("x-help");
    expect(w.classes()).toContain("c");
  });
});

describe("ArTextarea", () => {
  it("打つと update:modelValue、文字数を出す", async () => {
    const w = mount(ArTextarea, { props: { modelValue: "abc", showCount: true, maxlength: 200, label: "備考" } });
    expect(w.get('[data-part="count"]').text()).toBe("3 / 200");
    await w.get("textarea").setValue("abcd");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["abcd"]);
  });
});

describe("ArSelect（ネイティブの select を使わない）", () => {
  const options = [
    { value: 1, label: "渋谷店", keywords: "しぶや" },
    { label: "大阪", options: [{ value: 3, label: "梅田店" }, { value: 4, label: "難波店", disabled: true }] },
    { value: 5, label: "新宿店", keywords: "しんじゅく" },
  ];
  it("押すと開き、↓ Enter で選ぶ。値の型（数）のまま出す", async () => {
    const w = mount(ArSelect, { props: { modelValue: 1, options, label: "店舗" }, attachTo: body() });
    expect(w.find("select").exists()).toBe(false);
    const root = w.get('[data-ar="select"]');
    expect(root.attributes("role")).toBe("combobox");
    await root.trigger("click");
    await flushPromises();
    expect(root.attributes("aria-expanded")).toBe("true");
    expect(qa('[data-ar="select-panel"] [role="option"]')).toHaveLength(4);
    expect(q('[data-part="group-label"]')?.textContent).toBe("大阪");
    expect(q('[role="option"][aria-selected="true"]')?.textContent).toContain("渋谷店");
    await root.trigger("keydown", { key: "ArrowDown" });
    await root.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual([3]);
    expect(root.attributes("aria-expanded")).toBe("false");
    w.unmount();
  });
  it("使えない項目は飛ばし、文字を打つとその文字で始まる項目へ", async () => {
    const w = mount(ArSelect, { props: { modelValue: 3, options, label: "店舗" }, attachTo: body() });
    const root = w.get('[data-ar="select"]');
    await root.trigger("click");
    await root.trigger("keydown", { key: "ArrowDown" });
    expect(root.attributes("aria-activedescendant")).toBe(qa('[role="option"]')[3]?.id);
    await root.trigger("keydown", { key: "し" });
    expect(root.attributes("aria-activedescendant")).toBe(qa('[role="option"]')[0]?.id);
    await root.trigger("keydown", { key: "Escape" });
    w.unmount();
  });
  it("複数は札で並べ、多いと +n。札の × で外す", async () => {
    const w = mount(ArSelect, { props: { modelValue: [1, 3, 5], options, multiple: true, maxTags: 2, label: "店舗" } });
    expect(w.findAll('[data-part="tag"]').map((t) => t.text())).toEqual(["渋谷店", "梅田店", "+1"]);
    await w.get('[data-part="tag-remove"]').trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([[3, 5]]);
  });
  it("7つ以上は探す欄が出て、打つと絞れる", async () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ value: i, label: `店舗${i}` }));
    const w = mount(ArSelect, { props: { modelValue: null, options: many, label: "店舗" }, attachTo: body() });
    await w.get('[data-ar="select"]').trigger("click");
    await flushPromises();
    const search = q('[data-ar="select-panel"] input') as HTMLInputElement;
    expect(search).not.toBeNull();
    search.value = "7";
    search.dispatchEvent(new Event("input"));
    await nextTick();
    expect(qa('[role="option"]')).toHaveLength(1);
    w.unmount();
  });
});

describe("ArAutoComplete", () => {
  it("読みでも合い、Enter で選ぶ", async () => {
    const Host = defineComponent(() => {
      const v = ref("");
      return () =>
        h(ArAutoComplete, {
          modelValue: v.value,
          "onUpdate:modelValue": (x: string) => (v.value = x),
          options: [{ value: 1, label: "佐藤 大地", keywords: "さとう だいち" }, { value: 2, label: "田中 健" }],
          avatar: true,
          label: "名前",
        });
    });
    const w = mount(Host, { attachTo: body() });
    const input = w.get("input");
    (input.element as HTMLInputElement).focus();
    await input.setValue("さと");
    await flushPromises();
    const opts = qa('[role="option"]');
    expect(opts).toHaveLength(1);
    expect(q('[data-part="match"]')?.textContent).toBe("佐藤");
    expect(q('[data-part="avatar"]')?.textContent).toBe("佐");
    await input.trigger("keydown", { key: "Enter" });
    expect((input.element as HTMLInputElement).value).toBe("佐藤 大地");
    w.unmount();
  });
});

describe("ArCascader", () => {
  const options = [
    { value: "a", label: "ARROW事業部", children: [{ value: "t", label: "東京", children: [{ value: "s", label: "渋谷店" }, { value: "i", label: "池袋店", disabled: true }] }] },
    { value: "h", label: "本社" },
  ];
  it("道筋を出し、→ Enter で次の段へ進んで選ぶ", async () => {
    const w = mount(ArCascader, { props: { modelValue: null, options, label: "店舗" }, attachTo: body() });
    const root = w.get('[data-ar="cascader"]');
    await root.trigger("click");
    await flushPromises();
    expect(qa('[data-part="column"]')).toHaveLength(1);
    await root.trigger("keydown", { key: "ArrowRight" });
    await root.trigger("keydown", { key: "ArrowRight" });
    expect(qa('[data-part="column"]')).toHaveLength(3);
    await root.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["a", "t", "s"]]);
    await w.setProps({ modelValue: ["a", "t", "s"] });
    expect(root.text()).toContain("ARROW事業部 / 東京 / 渋谷店");
    w.unmount();
  });
});

describe("ArTreeSelect", () => {
  const tree = [
    { value: "sales", label: "営業部", children: [{ value: "tokyo", label: "東京営業所" }, { value: "osaka", label: "大阪営業所" }] },
    { value: "admin", label: "管理部" },
  ];
  it("一部だけ選んでいる親は indeterminate（mixed）。親をチェックすると下が全部入る", async () => {
    const w = mount(ArTreeSelect, { props: { modelValue: ["tokyo"], tree, multiple: true, label: "部署" }, attachTo: body() });
    await w.get('[data-ar="tree-select"]').trigger("click");
    await flushPromises();
    const nodes = qa('[role="treeitem"]');
    expect(nodes[0]?.getAttribute("aria-checked")).toBe("mixed");
    expect(nodes[1]?.getAttribute("aria-checked")).toBe("true");
    nodes[0]?.click();
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["tokyo", "osaka"]]);
    expect(w.findAll('[data-part="tag"]').map((t) => t.text())).toEqual(["東京営業所"]);
    await w.setProps({ variant: "selbox" });
    expect(w.text()).toContain("東京営業所");
    await w.setProps({ showPath: true });
    expect(w.text()).toContain("営業部 / 東京営業所");
    w.unmount();
  });
  it("← → で閉じる・開く", async () => {
    const w = mount(ArTreeSelect, { props: { modelValue: null, tree, label: "部署" }, attachTo: body() });
    const root = w.get('[data-ar="tree-select"]');
    await root.trigger("click");
    expect(qa('[role="treeitem"]')).toHaveLength(2);
    await root.trigger("keydown", { key: "ArrowRight" });
    expect(qa('[role="treeitem"]')).toHaveLength(4);
    await root.trigger("keydown", { key: "ArrowLeft" });
    expect(qa('[role="treeitem"]')).toHaveLength(2);
    w.unmount();
  });
});

describe("ArMentions", () => {
  it("@ のあとに打つと候補が出て、選ぶと「@名前 」が入る", async () => {
    const Host = defineComponent(() => {
      const v = ref("");
      return () => h(ArMentions, { modelValue: v.value, "onUpdate:modelValue": (x: string) => (v.value = x), options: ["田中 健", "佐藤 美咲"], label: "本文" });
    });
    const w = mount(Host, { attachTo: body() });
    const ta = w.get("textarea");
    const el = ta.element as HTMLTextAreaElement;
    el.value = "こんにちは @田";
    el.setSelectionRange(el.value.length, el.value.length);
    await ta.trigger("input");
    await flushPromises();
    expect(qa('[role="option"]')).toHaveLength(1);
    await ta.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(el.value).toBe("こんにちは @田中 健 ");
    expect(w.find('[data-part="mention"]').text()).toBe("@田中 健");
    w.unmount();
  });
});

describe("ArInputNumber・ArStepper", () => {
  it("↑↓で刻み、確定で範囲に収めてカンマで見せる", async () => {
    const w = mount(ArInputNumber, { props: { modelValue: 1200, step: 10, max: 2000, label: "時給" } });
    const input = w.get("input");
    expect((input.element as HTMLInputElement).value).toBe("1,200");
    await input.trigger("keydown", { key: "ArrowUp" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual([1210]);
    await input.trigger("focus");
    await input.setValue("5000");
    await input.trigger("blur");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([2000]);
    expect(input.attributes("role")).toBe("spinbutton");
  });
  it("最小では − が押せない。＋で増える", async () => {
    const w = mount(ArStepper, { props: { modelValue: 1, min: 1, label: "人数" } });
    expect(w.get('[data-part="decrement"]').attributes("disabled")).toBeDefined();
    await w.get('[data-part="increment"]').trigger("pointerdown", { button: 0 });
    await w.get('[data-part="increment"]').trigger("pointerup");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([2]);
  });
});

describe("ArForm と ArField", () => {
  it("送ると rules で確かめ、間違いを ArField に出す。必須の札も自動", async () => {
    const model = reactive({ title: "" });
    const w = mount(ArForm, {
      props: { model, rules: { title: [{ required: true }] }, summary: true },
      slots: {
        default: () =>
          h(ArField, { label: "タイトル", name: "title" }, { default: (p: ArFieldControlProps) => h(ArTextInput, { ...p, modelValue: model.title }) }),
      },
      attachTo: body(),
    });
    expect(w.find('[data-part="required"]').exists()).toBe(true);
    await w.get("form").trigger("submit");
    await flushPromises();
    expect(w.emitted("invalid")?.[0]).toEqual([{ title: "タイトルを入れてください" }]);
    expect(w.get('[data-ar="field"] [data-part="error"]').text()).toContain("タイトルを入れてください");
    expect(w.get('[data-part="summary"]').text()).toContain("1件");
    expect(w.get("input").attributes("aria-invalid")).toBe("true");
    model.title = "朝礼";
    await flushPromises();
    expect(w.find('[data-ar="field"] [data-part="error"]').exists()).toBe(false);
    await w.get("form").trigger("submit");
    await flushPromises();
    expect(w.emitted("submit")).toHaveLength(1);
    w.unmount();
  });
  it("横に並べる（layout を ArField に配る）", () => {
    const w = mount(ArForm, {
      props: { model: {}, layout: "inline" },
      slots: { default: () => h(ArField, { label: "店舗名" }, { default: (p: ArFieldControlProps) => h("input", p) }) },
    });
    expect(w.get('[data-ar="field"]').attributes("data-layout")).toBe("inline");
    expect(w.get('[data-ar="field"]').attributes("data-label-size")).toBe("md");
    expect(w.find('[data-part="required"]').exists()).toBe(false);
  });
});
