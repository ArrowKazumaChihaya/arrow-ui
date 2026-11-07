import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import {
  ArAlert,
  ArDrawer,
  ArMessageHost,
  ArModal,
  ArNotificationHost,
  ArPopconfirm,
  ArProgress,
  ArResult,
  ArSkeleton,
  ArSpin,
  ArToast,
  useArConfirm,
  useArMessage,
  useArNotification,
} from "../src/index";

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("ArAlert 1.1", () => {
  it("種類ごとのアイコン・操作・帯", () => {
    const w = mount(ArAlert, { props: { tone: "neutral", title: "この日のシフトは編集できません", banner: true }, slots: { default: "勤怠ロックの期間です", action: "<button>解除</button>" } });
    expect(w.attributes("data-tone")).toBe("neutral");
    expect(w.attributes("data-banner")).toBeDefined();
    expect(w.attributes("data-titled")).toBe("");
    expect(w.get('[data-part="action"]').text()).toBe("解除");
    expect(mount(ArAlert, { props: { icon: false } }).find('[data-part="icon"]').exists()).toBe(false);
  });
});

describe("ArModal 1.1", () => {
  const base = { title: "イベントを追加", teleportTo: null };
  it("ok-text で足にキャンセルと主なボタン。キャンセルは閉じ、主なボタンは ok だけ", async () => {
    const w = mount(ArModal, { props: { ...base, open: true, okText: "追加する", footerNote: "概算です" }, attachTo: document.body });
    const buttons = w.findAll('[data-part="footer-end"] [data-ar="button"]');
    expect(buttons.map((b) => b.text())).toEqual(["キャンセル", "追加する"]);
    expect(w.get('[data-part="footer-start"] [data-part="note"]').text()).toBe("概算です");
    await buttons[1]!.trigger("click");
    expect(w.emitted("ok")).toHaveLength(1);
    expect(w.emitted("update:open")).toBeUndefined();
    await buttons[0]!.trigger("click");
    expect(w.emitted("cancel")).toHaveLength(1);
    expect(w.emitted("update:open")?.[0]).toEqual([false]);
    w.unmount();
  });
  it("戻る・終わった手順を押して戻る", async () => {
    const w = mount(ArModal, {
      props: { ...base, open: true, steps: ["対象", "曜日と時間", "確認"], currentStep: 2, stepsClickable: true, backText: "戻る" },
      attachTo: document.body,
    });
    await w.get('[data-part="footer-start"] [data-ar="button"]').trigger("click");
    expect(w.emitted("back")).toHaveLength(1);
    await w.findAll('button[data-part="step-label"]')[0]!.trigger("click");
    expect(w.emitted("update:currentStep")?.[0]).toEqual([0]);
    expect(w.findAll('button[data-part="step-label"]')).toHaveLength(2);
    w.unmount();
  });
  it("手順・タブの切替では本文の先頭へ戻り、通常の更新ではスクロール位置を保つ", async () => {
    const w = mount(ArModal, {
      props: { ...base, open: true, currentStep: 0, scrollKey: "new" },
      slots: { default: "<p>入力内容</p>" },
      attachTo: document.body,
    });
    const body = w.get<HTMLElement>('[data-part="body"]').element;
    body.scrollTop = 300;
    await w.setProps({ title: "入力中" });
    expect(body.scrollTop).toBe(300);
    await w.setProps({ currentStep: 1 });
    expect(body.scrollTop).toBe(0);
    body.scrollTop = 200;
    await w.setProps({ scrollKey: "status" });
    expect(body.scrollTop).toBe(0);
    w.unmount();
  });
  it("編集の確認は緑の保存ボタンで確定できる", async () => {
    const w = mount(ArModal, { props: { ...base, open: true, variant: "confirm", okText: "保存", okTone: "edit" }, attachTo: document.body });
    const save = w.get('[data-ok]');
    expect(save.attributes("data-tone")).toBe("edit");
    await save.trigger("click");
    expect(w.emitted("ok")).toHaveLength(1);
    w.unmount();
  });
  it("confirm は alertdialog で、左に印があり × を出さない", () => {
    const w = mount(ArModal, { props: { ...base, open: true, variant: "confirm", okText: "削除する", okTone: "danger" }, attachTo: document.body });
    expect(w.find('[role="alertdialog"]').exists()).toBe(true);
    expect(w.get('[data-part="icon"]').attributes("data-tone")).toBe("warn");
    expect(w.find('[data-part="close"]').exists()).toBe(false);
    w.unmount();
  });
});

describe("useArConfirm", () => {
  it("主なボタンで true、やめるで false", async () => {
    let confirm!: ReturnType<typeof useArConfirm>;
    const Host = defineComponent({ setup: () => ((confirm = useArConfirm()), () => h("div")) });
    const w = mount(Host, { attachTo: document.body });
    const p1 = confirm({ title: "シフトを削除しますか？", tone: "danger", okText: "削除する" });
    await nextTick();
    const ok = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-ar-confirm-host] [data-ar="button"]')).find((b) => b.textContent?.includes("削除する"));
    expect(ok).toBeTruthy();
    ok!.click();
    await expect(p1).resolves.toBe(true);
    const p2 = confirm({ title: "隠しますか？" });
    await nextTick();
    const cancel = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-ar-confirm-host] [data-ar="button"]')).find((b) => b.textContent?.includes("やめる"));
    cancel!.click();
    await expect(p2).resolves.toBe(false);
    w.unmount();
  });
});

describe("useArMessage・ArMessageHost", () => {
  it("出す・同じ key で入れ替える・消える", async () => {
    vi.useFakeTimers();
    const message = useArMessage();
    const w = mount(ArMessageHost);
    message.open({ key: "s", tone: "loading", content: "送っています…" });
    await nextTick();
    expect(w.findAll('[data-ar="message"]')).toHaveLength(1);
    expect(w.get('[data-ar="message"]').attributes("data-tone")).toBe("loading");
    message.open({ key: "s", tone: "ok", content: "送りました" });
    await nextTick();
    expect(w.findAll('[data-ar="message"]')).toHaveLength(1);
    expect(w.text()).toContain("送りました");
    vi.advanceTimersByTime(3100);
    await nextTick();
    expect(w.findAll('[data-ar="message"]')).toHaveLength(0);
    vi.useRealTimers();
    w.unmount();
  });
});

describe("useArNotification・ArNotificationHost", () => {
  it("操作を押すと処理して閉じる。マウスが乗っている間は消えない", async () => {
    vi.useFakeTimers();
    const notification = useArNotification();
    const w = mount(ArNotificationHost);
    const seen: string[] = [];
    notification.info({ title: "提出がありました", duration: 2, actions: [{ label: "見る", onClick: () => seen.push("見る") }] });
    await nextTick();
    const card = w.get('[data-ar="notification"]');
    await card.trigger("mouseenter");
    vi.advanceTimersByTime(3000);
    await nextTick();
    expect(w.findAll('[data-ar="notification"]')).toHaveLength(1);
    await w.get('[data-part="action"]').trigger("click");
    await Promise.resolve();
    await nextTick();
    expect(seen).toEqual(["見る"]);
    expect(w.findAll('[data-ar="notification"]')).toHaveLength(0);
    vi.useRealTimers();
    w.unmount();
  });
});

describe("ArToast", () => {
  it("元に戻すで undo と閉じる", async () => {
    const w = mount(ArToast, { props: { open: true, message: "削除しました", undoText: "元に戻す", duration: 0 } });
    await w.get('[data-part="undo"]').trigger("click");
    expect(w.emitted("undo")).toHaveLength(1);
    expect(w.emitted("update:open")?.[0]).toEqual([false]);
  });
});

describe("ArDrawer", () => {
  it("dialog として名前を持ち、Esc と幕で閉じる", async () => {
    const w = mount(ArDrawer, { props: { open: true, title: "佐藤 美咲", teleportTo: null }, attachTo: document.body });
    const dlg = w.get('[role="dialog"]');
    expect(w.get(`#${dlg.attributes("aria-labelledby")}`).text()).toBe("佐藤 美咲");
    await w.get('[data-ar="drawer"]').trigger("keydown", { key: "Escape" });
    await w.get('[data-part="scrim"]').trigger("click");
    expect(w.emitted("close")).toHaveLength(2);
    w.unmount();
  });
});

describe("ArPopconfirm", () => {
  it("きっかけを押すと開き、主なボタンで confirm", async () => {
    const w = mount(ArPopconfirm, { props: { title: "隠しますか？", okText: "隠す" }, slots: { default: "<button>隠す…</button>" }, attachTo: document.body });
    await w.get('[data-ar="popconfirm-trigger"]').trigger("click");
    await tick();
    const pop = document.querySelector('[data-ar="popconfirm"]');
    expect(pop?.getAttribute("role")).toBe("alertdialog");
    const ok = Array.from(pop!.querySelectorAll<HTMLButtonElement>('[data-ar="button"]')).find((b) => b.textContent?.includes("隠す"));
    ok!.click();
    await nextTick();
    expect(w.emitted("confirm")).toHaveLength(1);
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    w.unmount();
  });
});

describe("ArProgress・ArResult・ArSkeleton・ArSpin", () => {
  it("進み具合を progressbar で出し、100% で終わり", () => {
    const w = mount(ArProgress, { props: { percent: 100 } });
    expect(w.attributes("role")).toBe("progressbar");
    expect(w.attributes("aria-valuenow")).toBe("100");
    expect(w.attributes("data-status")).toBe("success");
    expect(mount(ArProgress, { props: { type: "steps", percent: 60, steps: 5 } }).findAll('[data-part="step"][data-state="on"]')).toHaveLength(3);
  });
  it("結果は数の status で大きな数を出す", () => {
    expect(mount(ArResult, { props: { status: "404", title: "ページが見つかりません" } }).get('[data-part="code"]').text()).toBe("404");
    expect(mount(ArResult, { props: { title: "送りました" } }).find('[data-part="badge"]').exists()).toBe(true);
  });
  it("スケルトンは loading=false で中身を出す。スピンは中身を押せなくする", () => {
    expect(mount(ArSkeleton, { props: { loading: false }, slots: { default: "<p>中身</p>" } }).html()).toContain("中身");
    const s = mount(ArSpin, { props: { tip: "読み込み中" }, slots: { default: "<p>表</p>" } });
    expect(s.attributes("aria-busy")).toBe("true");
    expect(s.get('[data-part="content"]').attributes("inert")).toBeDefined();
    expect(s.get('[role="status"]').attributes("aria-label")).toBe("読み込み中");
  });
});
