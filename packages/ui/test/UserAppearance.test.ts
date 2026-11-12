import { execFileSync } from "node:child_process";
import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import { designCss } from "../src/provider/css";
import { remixDesign } from "../../ui-design-remix/src/index";
import { contrast } from "../../ui-design-remix/src/tones";
import { transformCss } from "../../../scripts/scale-font-sizes.mjs";

afterEach(() => {
  document.documentElement.removeAttribute("data-ar-tone");
  document.documentElement.style.removeProperty("--ar-font-scale");
  document.head.querySelectorAll("style[data-ar-tokens]").forEach((el) => el.remove());
});

describe("利用者が選ぶ見え方：文字の大きさ", () => {
  it("CSS の文字の大きさ（px）は、すべて倍率（--ar-font-scale）に追従している（印刷を除く）", () => {
    expect(() => execFileSync(process.execPath, ["scripts/scale-font-sizes.mjs", "--check"], { stdio: "pipe" })).not.toThrow();
  });

  it("font-size と font の大きさ・行の高さだけを変え、書体の名前や em・0 は変えない", () => {
    expect(transformCss("a{font:600 11.5px/1.5 var(--ar-font-family)}")).toBe(
      "a{font:600 calc(11.5px * var(--ar-font-scale, 1))/1.5 var(--ar-font-family)}",
    );
    expect(transformCss("a{font-size:0;font:inherit;font-size:1.2em;width:12px}")).toBe("a{font-size:0;font:inherit;font-size:1.2em;width:12px}");
    // 何度実行しても同じ
    const once = transformCss("a{font-size:13px}");
    expect(transformCss(once)).toBe(once);
  });

  it("文字の大きさのトークンも倍率を掛けて配る", () => {
    expect(designCss(remixDesign)).toContain("--ar-font-size-body:calc(13.5px * var(--ar-font-scale, 1))");
  });

  it("fontScale を渡すと html に倍率を置き、標準（1）や範囲外では置かない", async () => {
    const scale = ref(1.2);
    const w = mount({ render: () => h(ArUiProvider, { design: remixDesign, fontScale: scale.value }, () => h("p", "本文")) });
    expect(document.documentElement.style.getPropertyValue("--ar-font-scale")).toBe("1.2");
    scale.value = 1;
    await nextTick();
    expect(document.documentElement.style.getPropertyValue("--ar-font-scale")).toBe("");
    scale.value = 3;
    await nextTick();
    expect(document.documentElement.style.getPropertyValue("--ar-font-scale")).toBe("");
    w.unmount();
  });
});

describe("利用者が選ぶ見え方：色合い", () => {
  it("remix は あざやか・くっきり の色合いを持ち、色合いとテーマ色の組み合わせで上書きする", () => {
    const css = designCss(remixDesign);
    expect(remixDesign.tones?.vivid?.label).toBe("あざやか");
    expect(remixDesign.tones?.clear?.label).toBe("くっきり");
    expect(css).toContain('[data-ar-tone="clear"]{--ar-color-text:#111827');
    expect(css).toContain('[data-ar-tone="vivid"][data-ar-palette="blue"],[data-ar-tone="vivid"] [data-ar-palette="blue"]{--ar-accent:');
  });

  it("くっきりは白抜きの文字が 4.5:1 以上、あざやかは標準より読みにくくならない", () => {
    for (const [name, base] of Object.entries(remixDesign.palettes)) {
      const clear = remixDesign.tones!.clear!.palettes![name as keyof typeof remixDesign.palettes]!;
      const vivid = remixDesign.tones!.vivid!.palettes![name as keyof typeof remixDesign.palettes]!;
      expect(contrast(clear.accent!, "#FFFFFF"), name).toBeGreaterThanOrEqual(4.5);
      expect(contrast(vivid.accent!, "#FFFFFF") + 0.01, name).toBeGreaterThanOrEqual(contrast(base.accent, "#FFFFFF"));
      // 淡い地の上の文字（accent-ink）は、どの色合いでも 4.5:1 以上
      expect(contrast(vivid["accent-ink"]!, vivid["accent-muted"]!), name).toBeGreaterThanOrEqual(4.5);
      expect(contrast(clear["accent-ink"]!, clear["accent-muted"]!), name).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("tone を渡すと html に色合いを置き、無い名前や standard では外す", async () => {
    const tone = ref<string | undefined>("vivid");
    const w = mount({ render: () => h(ArUiProvider, { design: remixDesign, tone: tone.value }, () => h("p", "本文")) });
    expect(document.documentElement.getAttribute("data-ar-tone")).toBe("vivid");
    tone.value = "standard";
    await nextTick();
    expect(document.documentElement.hasAttribute("data-ar-tone")).toBe(false);
    tone.value = "no-such-tone";
    await nextTick();
    expect(document.documentElement.hasAttribute("data-ar-tone")).toBe(false);
    w.unmount();
  });
});
