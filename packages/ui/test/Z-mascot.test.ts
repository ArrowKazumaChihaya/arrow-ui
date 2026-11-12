import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ArMascot from "../src/components/ArMascot.vue";
import { scopeMascotSvg } from "../src/components/ArMascot.artwork";
import type { ArMascotArtwork } from "../src/components/ArMascot.contract";

const artwork: ArMascotArtwork = {
  id: "test",
  svg: '<svg viewBox="0 0 10 10" class="t"><defs><linearGradient id="fill"><stop offset="0"/></linearGradient></defs><path class="body" fill="url(#fill)" d="M0 0h1"/></svg>',
  css: '.t[data-motion="wave"] .body{animation-name:t-wave}@keyframes t-wave{to{opacity:.5}}',
  motions: { idle: { seconds: 4, loop: true, expression: "normal" }, wave: { seconds: 2, loop: false, expression: "happy" }, walk: { seconds: 1, loop: true } },
};

afterEach(() => {
  vi.useRealTimers();
  document.head.querySelectorAll("style[data-ar-mascot-css]").forEach((node) => node.remove());
});

describe("Z：ArMascot", () => {
  it("名前を読み上げ、絵を入れ、待機の動きから始める", () => {
    const w = mount(ArMascot, { props: { artwork, label: "シフトくん" }, attachTo: document.body });
    expect(w.attributes("role")).toBe("img");
    expect(w.attributes("aria-label")).toBe("シフトくん");
    const svg = w.get("svg");
    expect(svg.attributes("data-motion")).toBe("idle");
    expect(svg.attributes("data-expression")).toBe("normal");
    expect(svg.attributes("style")).toContain("--duration: 4s");
    expect(w.attributes("data-once")).toBeUndefined();
    expect(document.head.querySelector('style[data-ar-mascot-css="test"]')?.textContent).toBe(artwork.css);
    w.unmount();
  });

  it("1回だけの動きは、終わると motionend を知らせて待機へ戻る", async () => {
    vi.useFakeTimers();
    const w = mount(ArMascot, { props: { artwork, label: "x", motion: "wave" }, attachTo: document.body });
    expect(w.get("svg").attributes("data-motion")).toBe("wave");
    expect(w.get("svg").attributes("data-expression")).toBe("happy");
    await w.vm.$nextTick();
    expect(w.attributes("data-once")).toBe("true");
    vi.advanceTimersByTime(1999);
    expect(w.emitted("motionend")).toBeUndefined();
    vi.advanceTimersByTime(1);
    await w.vm.$nextTick();
    expect(w.emitted("motionend")).toEqual([["wave"]]);
    expect(w.get("svg").attributes("data-motion")).toBe("idle");
    expect(w.attributes("data-once")).toBeUndefined();
    w.unmount();
  });

  it("繰り返す動きは戻らない。知らない名前は待機。replay で同じ動きをもう一度再生する", async () => {
    vi.useFakeTimers();
    const w = mount(ArMascot, { props: { artwork, label: "x", motion: "walk" }, attachTo: document.body });
    vi.advanceTimersByTime(10000);
    expect(w.get("svg").attributes("data-motion")).toBe("walk");
    expect(w.get("svg").attributes("data-expression")).toBeUndefined();
    await w.setProps({ motion: "unknown" });
    expect(w.get("svg").attributes("data-motion")).toBe("idle");
    await w.setProps({ motion: "wave" });
    vi.advanceTimersByTime(2000);
    await w.vm.$nextTick();
    expect(w.get("svg").attributes("data-motion")).toBe("idle");
    await w.setProps({ replay: 1 });
    expect(w.get("svg").attributes("data-motion")).toBe("wave");
    await w.setProps({ loop: true });
    vi.advanceTimersByTime(10000);
    expect(w.get("svg").attributes("data-motion")).toBe("wave");
    expect(w.emitted("motionend")).toHaveLength(1);
    w.unmount();
  });

  it("id に部品ごとの接頭辞を付け、同じ絵を2つ出しても参照が混ざらない", () => {
    const a = scopeMascotSvg(artwork);
    const b = scopeMascotSvg(artwork);
    const id = /id="([^"]+)"/.exec(a)?.[1];
    expect(id).toMatch(/^ar-mascot-test-\d+-fill$/);
    expect(a).toContain(`url(#${id})`);
    expect(/id="([^"]+)"/.exec(b)?.[1]).not.toBe(id);
  });

  it.each([
    '<svg><script>alert(1)</script></svg>',
    '<svg onload="alert(1)"></svg>',
    '<svg><a href="javascript:alert(1)"/></svg>',
    '<svg><image href="https://example.com/x.png"/></svg>',
    '<div></div>',
  ])("危ない内容・SVG でない内容は表示しない: %s", (svg) => {
    expect(scopeMascotSvg({ ...artwork, svg })).toBe("");
    const w = mount(ArMascot, { props: { artwork: { ...artwork, svg }, label: "x" } });
    expect(w.find("svg").exists()).toBe(false);
  });

  it("絵を入れ替えると、新しい絵に動きを付ける。size は幅になる", async () => {
    const w = mount(ArMascot, { props: { artwork, label: "x", size: 64 }, attachTo: document.body });
    expect(w.attributes("style")).toContain("--ar-mascot-size: 64px");
    const other: ArMascotArtwork = { ...artwork, id: "other", svg: '<svg viewBox="0 0 5 5" class="o"><path d="M0 0h1"/></svg>' };
    await w.setProps({ artwork: other, motion: "walk" });
    await Promise.resolve();
    expect(w.get("svg").classes()).toContain("o");
    expect(w.get("svg").attributes("data-motion")).toBe("walk");
    expect(document.head.querySelector('style[data-ar-mascot-css="other"]')).not.toBeNull();
    w.unmount();
  });
});
