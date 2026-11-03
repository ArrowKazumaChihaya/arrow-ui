import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArRichTextEditor from "../src/components/ArRichTextEditor.vue";
import ArVariablePanel from "../src/components/ArVariablePanel.vue";
import { plainHtml, sanitizeHtml } from "../src/internal/richText";

const groups = [
  { key: "co", label: "会社情報", items: [{ key: "company_name", label: "会社名" }, { key: "company_tel", label: "電話番号" }] },
  { key: "emp", label: "社員情報", items: [{ key: "employee_name", label: "社員名" }, { key: "employee_joined", label: "入社年月日", keywords: ["入った日"] }] },
];

describe("sanitizeHtml / plainHtml", () => {
  it("危ないタグと属性を消す", () => {
    const out = sanitizeHtml('<p onclick="x()" style="color:red;background:url(javascript:1)">a<script>alert(1)</script><iframe src="//e"></iframe><a href="javascript:alert(1)">b</a><img src=x onerror=y></p>');
    expect(out).toBe('<p style="color:red">a<a>b</a></p>');
  });
  it("plain は文字と <br> だけ", () => {
    expect(plainHtml("<p>一行目</p><p>二行目<b>太</b></p>")).toBe("一行目<br>二行目太");
    expect(plainHtml("a<br>b <script>x</script>")).toBe("a<br>b ");
  });
});

describe("ArRichTextEditor", () => {
  it("v-model の HTML を消毒して出し、変数は札に見せる（値はただの文字）", async () => {
    const w = mount(ArRichTextEditor, { props: { modelValue: '<p>{{ $employee_name }} 様<script>x</script></p>', label: "本文" }, attachTo: document.body });
    await nextTick();
    const content = w.find('[data-part="content"]');
    expect(content.attributes("role")).toBe("textbox");
    expect(content.find('[data-part="token"]').text()).toBe("{{ $employee_name }}");
    expect(content.html()).not.toContain("script");
    expect(w.find('[data-part="count"]').text()).toBe("文字数 : 22");
    (content.element as HTMLElement).insertAdjacentHTML("beforeend", "<b>追加</b>");
    await content.trigger("input");
    const v = w.emitted("update:modelValue")!.at(-1)![0] as string;
    expect(v).toContain("{{ $employee_name }}");
    expect(v).not.toContain("data-part");
    w.unmount();
  });
  it("ツールバーは ←→ で道具を移り、Tab で止まるのは1つ", async () => {
    const w = mount(ArRichTextEditor, { props: { modelValue: "", toolbar: ["bold", "italic", "|", "undo"] }, attachTo: document.body });
    const tools = w.findAll('[data-part="tool"]');
    expect(tools.map((t) => t.attributes("tabindex"))).toEqual(["0", "-1", "-1"]);
    (tools[0]!.element as HTMLElement).focus();
    await tools[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(tools[1]!.element);
    expect(w.find('[data-part="separator"]').exists()).toBe(true);
    w.unmount();
  });
  it("inline の変数のパネルを開き、押すと insert-variable", async () => {
    const w = mount(ArRichTextEditor, { props: { modelValue: "こんにちは", plain: true, toolbar: ["variables", "|", "undo", "redo"], variables: groups }, attachTo: document.body });
    await w.find('[data-tool="variables"]').trigger("click");
    expect(w.emitted("update:variablesOpen")![0]).toEqual([true]);
    const panel = w.find('[data-part="variables"] [data-ar="variable-panel"]');
    expect(panel.attributes("data-layout")).toBe("chips");
    await panel.find('[data-part="item"]').trigger("click");
    expect(w.emitted("insert-variable")![0]).toEqual(["{{ $company_name }}"]);
    const v = w.emitted("update:modelValue")!.at(-1)![0] as string;
    expect(v).toContain("{{ $company_name }}");
    w.unmount();
  });
  it("menu の変数：まとまりを開くと一覧", async () => {
    const w = mount(ArRichTextEditor, { props: { modelValue: "", toolbar: ["variables"], variables: groups, variablesPlacement: "menu" }, attachTo: document.body });
    await w.find('[data-tool="variables"]').trigger("click");
    await nextTick();
    const menu = document.body.querySelector('[data-ar="rich-text-menu"]')!;
    expect(menu.querySelectorAll('[data-kind="group"]').length).toBe(2);
    (menu.querySelector('[data-group="emp"] [data-kind="group"]') as HTMLElement).click();
    await nextTick();
    const items = menu.querySelectorAll('[data-group="emp"] [data-kind="variable"]');
    expect(items.length).toBe(2);
    (items[0] as HTMLElement).click();
    await nextTick();
    expect(w.emitted("insert-variable")![0]).toEqual(["{{ $employee_name }}"]);
    w.unmount();
  });
  it("上限を越えると invalid と赤い数", async () => {
    const w = mount(ArRichTextEditor, { props: { modelValue: "<p>あいうえおかきくけこ</p>", maxLength: 5 } });
    await nextTick();
    expect(w.attributes("data-state")).toContain("invalid");
    expect(w.find('[data-part="count"]').attributes("data-state")).toBe("over");
    expect(w.find('[data-part="count"]').text()).toBe("文字数 : 10 / 5");
  });
});

describe("ArVariablePanel", () => {
  it("探すと合うものだけ、押すと insert", async () => {
    const w = mount(ArVariablePanel, { props: { groups, title: "ARROWの変数" } });
    expect(w.findAll('[data-part="item"]').length).toBe(4);
    await w.find('[data-part="search-input"]').setValue("入った");
    expect(w.findAll('[data-part="item"]').map((i) => i.text())).toEqual(["入社年月日"]);
    await w.find('[data-part="item"]').trigger("click");
    expect(w.emitted("insert")![0]![0]).toBe("{{ $employee_joined }}");
    await w.find('[data-part="search-input"]').setValue("ない言葉");
    expect(w.find('[data-part="empty"]').text()).toBe("「ない言葉」に合う変数はありません");
  });
  it("chips はタブを ←→ で選び直す", async () => {
    const w = mount(ArVariablePanel, { props: { groups, layout: "chips" }, attachTo: document.body });
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0]!.attributes("aria-selected")).toBe("true");
    expect(tabs[0]!.find('[data-part="tab-count"]').text()).toBe("2");
    await tabs[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:tab")![0]).toEqual(["emp"]);
    expect(w.findAll('[data-part="item"]').map((i) => i.text())).toEqual(["社員名", "入社年月日"]);
    w.unmount();
  });
});
