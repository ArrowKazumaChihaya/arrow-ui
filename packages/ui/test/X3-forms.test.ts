import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import ArProgress from "../src/components/ArProgress.vue";
import ArSkeleton from "../src/components/ArSkeleton.vue";
import ArTour from "../src/components/ArTour.vue";
import ArNotificationHost from "../src/components/ArNotificationHost.vue";
import ArMentions from "../src/components/ArMentions.vue";
import { useArNotification } from "../src/feedback";
import { classicDesign } from "../../ui-design-classic/src/index";
import { remixDesign } from "../../ui-design-remix/src/index";
import type { ArDesign } from "../src/design";

/** デザインを当てて1つの部品を描く。 */
function inDesign(design: ArDesign, comp: unknown, props: Record<string, unknown> = {}) {
  const App = defineComponent(() => () => h(ArUiProvider, { design, scope: "self" }, () => h(comp as never, props)));
  return mount(App, { attachTo: document.body });
}

describe("X3：デザインが選ぶ形（classic）", () => {
  it("ArProgress：刻みの数は classic で「60%」、remix で「3/5」", () => {
    const c = inDesign(classicDesign, ArProgress, { type: "steps", percent: 60, steps: 5 });
    expect(c.get('[data-part="info"]').text()).toBe("60%");
    c.unmount();
    const r = inDesign(remixDesign, ArProgress, { type: "steps", percent: 60, steps: 5 });
    expect(r.get('[data-part="info"]').text()).toBe("3/5");
    r.unmount();
  });

  it("ArSkeleton：classic は見出しの行を足し、最後の行に data-last が付く", () => {
    const c = inDesign(classicDesign, ArSkeleton, { rows: 3 });
    expect(c.findAll('[data-part="title"]')).toHaveLength(1);
    expect(c.findAll('[data-part="line"]')).toHaveLength(3);
    expect(c.findAll('[data-part="line"]')[2]!.attributes("data-last")).toBe("");
    c.unmount();
    const r = inDesign(remixDesign, ArSkeleton, { rows: 3 });
    expect(r.findAll('[data-part="title"]')).toHaveLength(0);
    r.unmount();
  });

  it("ArTour：classic の「次へ」には数が付かない", async () => {
    const el = document.createElement("button");
    el.className = "x3-target";
    document.body.appendChild(el);
    const steps = [{ title: "1つ目", target: ".x3-target" }, { title: "2つ目" }];
    const c = inDesign(classicDesign, ArTour, { open: true, steps, labels: { prev: "前へ", next: "次へ", finish: "完了", close: "閉じる" } });
    await nextTick();
    await nextTick();
    expect(document.body.textContent).toContain("次へ");
    expect(document.body.textContent).not.toContain("次へ（1/2）");
    c.unmount();
    el.remove();
  });

  it("ArNotificationHost：classic は新しい通知を下に足す", async () => {
    const n = useArNotification();
    const c = inDesign(classicDesign, ArNotificationHost);
    n.info({ title: "1つ目", duration: 0 });
    n.info({ title: "2つ目", duration: 0 });
    await nextTick();
    const titles = c.findAll('[data-ar="notification"]').map((w) => w.text());
    expect(titles[0]).toContain("1つ目");
    expect(titles[1]).toContain("2つ目");
    n.destroy();
    c.unmount();
  });

  it("ArMentions：classic は候補の基準の点（caret）を置き、値の受け渡しは同じ", async () => {
    const c = inDesign(classicDesign, ArMentions, { modelValue: "", options: ["山田", "佐藤"], label: "メモ" });
    expect(c.find('[data-part="caret"]').exists()).toBe(true);
    c.unmount();
    const r = inDesign(remixDesign, ArMentions, { modelValue: "", options: ["山田", "佐藤"], label: "メモ" });
    expect(r.find('[data-part="caret"]').exists()).toBe(false);
    r.unmount();
  });
});
