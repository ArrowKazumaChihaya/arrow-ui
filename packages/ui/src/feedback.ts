/**
 * 知らせる仕組み（関数で出すもの）。
 * - useArConfirm()：確かめの小さなポップアップ（ArModal の confirm）を出し、押した答えを Promise で返す。
 * - useArMessage()：上の真ん中に短く出る言葉。製品が ArMessageHost を Provider の中に1つ置く。
 * - useArNotification()：右上に出る白いカード。製品が ArNotificationHost を Provider の中に1つ置く。
 */
import { defineComponent, getCurrentInstance, h, provide, ref, render, shallowReactive, type ComponentInternalInstance } from "vue";
import { arUiContextKey, useArUi } from "./provider/context";
import ArModal from "./components/ArModal.vue";
import type { ArIconName } from "./icons";

/* ---------------- 確かめ ---------------- */

export interface ArConfirmOptions {
  title: string;
  /** 何が起きるかを1〜2行で（例：「佐藤 美咲さんの10月21日のシフトを削除します。元に戻せません。」）。 */
  description?: string;
  /** danger：削除など戻せない操作（主なボタンが赤）。warn：注意（既定）。info：案内。 */
  tone?: "warn" | "danger" | "info";
  /** 左の印。既定は alert（info のときは info）。 */
  icon?: ArIconName;
  /** 主なボタンの文字。何が起きるかを書く（「削除する」「隠す」）。 */
  okText?: string;
  cancelText?: string;
  /** 幅（px）。既定 380。 */
  width?: number;
  /** 主なボタンを押したときの処理。Promise を返すと終わるまで読み込み中にし、失敗したら閉じない。 */
  onOk?: () => unknown;
}

function paletteOf(inst: ComponentInternalInstance | null): string | undefined {
  const el = (inst?.subTree?.el ?? inst?.vnode.el) as Node | null | undefined;
  const host = el && (el.nodeType === 1 ? (el as Element) : el.parentElement);
  return (host?.closest?.("[data-ar-palette]") as HTMLElement | null)?.dataset.arPalette;
}

/** 確かめのポップアップを出す関数を返す（部品の setup の中で呼ぶ）。答えは「はい」で true。 */
export function useArConfirm(): (options: ArConfirmOptions) => Promise<boolean> {
  const ui = useArUi();
  const inst = getCurrentInstance();
  return (o) =>
    new Promise<boolean>((resolve) => {
      if (typeof document === "undefined") return resolve(false);
      const el = document.createElement("div");
      el.setAttribute("data-ar-confirm-host", "");
      const palette = paletteOf(inst);
      if (palette) el.setAttribute("data-ar-palette", palette);
      (ui?.portal.value ?? document.body).appendChild(el);
      const open = ref(true);
      const busy = ref(false);
      let settled = false;
      const finish = (v: boolean) => {
        if (settled) return;
        settled = true;
        open.value = false;
        resolve(v);
        setTimeout(() => {
          render(null, el);
          el.remove();
        }, 0);
      };
      const ok = async () => {
        if (!o.onOk) return finish(true);
        busy.value = true;
        try {
          await o.onOk();
          finish(true);
        } catch {
          busy.value = false;
        }
      };
      const tone = o.tone ?? "warn";
      const Root = defineComponent({
        setup() {
          if (ui) provide(arUiContextKey, ui);
          return () =>
            h(ArModal, {
              open: open.value,
              title: o.title,
              description: o.description,
              variant: "confirm",
              icon: o.icon ?? (tone === "info" ? "info" : "alert"),
              iconTone: tone,
              width: o.width ?? 380,
              okText: o.okText ?? (tone === "danger" ? "削除する" : "OK"),
              okTone: tone === "danger" ? "danger" : "primary",
              okLoading: busy.value,
              cancelText: o.cancelText ?? "やめる",
              teleportTo: null,
              onOk: ok,
              onClose: () => finish(false),
            });
        },
      });
      const vnode = h(Root);
      if (inst) vnode.appContext = inst.appContext;
      render(vnode, el);
    });
}

/* ---------------- メッセージ ---------------- */

export type ArMessageTone = "ok" | "info" | "warn" | "danger" | "loading";
export interface ArMessageOptions {
  content: string;
  tone?: ArMessageTone;
  /** 出しておく秒数。0 で消えない（既定 3、loading は 0）。 */
  duration?: number;
  /** 同じ key で出し直すと、その場で中身を入れ替える（「送っています…」→「送りました」など）。 */
  key?: string;
}
export interface ArMessageEntry {
  key: string;
  content: string;
  tone: ArMessageTone;
}
let msgSeq = 0;
/** 出ている言葉の一覧（ArMessageHost が読む）。 */
export const arMessageStore = shallowReactive<ArMessageEntry[]>([]);
const msgTimers = new Map<string, ReturnType<typeof setTimeout>>();

function closeMessage(key: string) {
  clearTimeout(msgTimers.get(key));
  msgTimers.delete(key);
  const i = arMessageStore.findIndex((m) => m.key === key);
  if (i >= 0) arMessageStore.splice(i, 1);
}
function openMessage(o: ArMessageOptions): () => void {
  const key = o.key ?? `ar-msg-${++msgSeq}`;
  const tone = o.tone ?? "info";
  const entry: ArMessageEntry = { key, content: o.content, tone };
  const i = arMessageStore.findIndex((m) => m.key === key);
  if (i >= 0) arMessageStore.splice(i, 1, entry);
  else arMessageStore.push(entry);
  clearTimeout(msgTimers.get(key));
  const sec = o.duration ?? (tone === "loading" ? 0 : 3);
  if (sec > 0) msgTimers.set(key, setTimeout(() => closeMessage(key), sec * 1000));
  return () => closeMessage(key);
}

export interface ArMessageApi {
  open: (options: ArMessageOptions) => () => void;
  success: (content: string, duration?: number) => () => void;
  info: (content: string, duration?: number) => () => void;
  warning: (content: string, duration?: number) => () => void;
  error: (content: string, duration?: number) => () => void;
  loading: (content: string, duration?: number) => () => void;
  /** key を渡すとその1つ、渡さなければすべて消す。 */
  destroy: (key?: string) => void;
}
const messageApi: ArMessageApi = {
  open: openMessage,
  success: (content, duration) => openMessage({ content, duration, tone: "ok" }),
  info: (content, duration) => openMessage({ content, duration, tone: "info" }),
  warning: (content, duration) => openMessage({ content, duration, tone: "warn" }),
  error: (content, duration) => openMessage({ content, duration, tone: "danger" }),
  loading: (content, duration) => openMessage({ content, duration, tone: "loading" }),
  destroy: (key) => (key ? closeMessage(key) : [...arMessageStore].forEach((m) => closeMessage(m.key))),
};
/** 上の真ん中に短く出す。元に戻せる操作には ArToast（「元に戻す」つき）を使う。 */
export function useArMessage(): ArMessageApi {
  return messageApi;
}

/* ---------------- 通知 ---------------- */

export interface ArNotificationAction {
  label: string;
  /** primary：塗り。subtle：テーマ色の淡い面（既定）。plain：文字だけ（あとで など）。 */
  tone?: "primary" | "subtle" | "plain";
  /** 押したときの処理。false を返すと通知を閉じない。 */
  onClick?: () => unknown;
}
export interface ArNotificationOptions {
  title: string;
  description?: string;
  /** 印の色。info はテーマ色、ok 緑、warn 橙、danger 赤。 */
  tone?: "info" | "ok" | "warn" | "danger";
  icon?: ArIconName;
  /** 出しておく秒数。0 で消えない（既定 4.5）。残り時間はテーマ色の線で出る。 */
  duration?: number;
  actions?: ArNotificationAction[];
  key?: string;
  closable?: boolean;
  onClose?: () => void;
}
export interface ArNotificationEntry extends ArNotificationOptions {
  key: string;
  duration: number;
  paused: boolean;
}
let ntfSeq = 0;
/** 出ている通知の一覧（ArNotificationHost が読む）。 */
export const arNotificationStore = shallowReactive<ArNotificationEntry[]>([]);
const ntfTimers = new Map<string, { t?: ReturnType<typeof setTimeout>; left: number; at: number }>();

function closeNotification(key: string) {
  const t = ntfTimers.get(key);
  clearTimeout(t?.t);
  ntfTimers.delete(key);
  const i = arNotificationStore.findIndex((n) => n.key === key);
  if (i < 0) return;
  const [n] = arNotificationStore.splice(i, 1);
  n?.onClose?.();
}
function startTimer(key: string, ms: number) {
  ntfTimers.set(key, { t: setTimeout(() => closeNotification(key), ms), left: ms, at: Date.now() });
}
function setPaused(key: string, paused: boolean) {
  const i = arNotificationStore.findIndex((n) => n.key === key);
  const t = ntfTimers.get(key);
  const n = arNotificationStore[i];
  if (!n || !t || n.paused === paused) return;
  if (paused) {
    clearTimeout(t.t);
    t.left = Math.max(0, t.left - (Date.now() - t.at));
  } else startTimer(key, t.left);
  arNotificationStore.splice(i, 1, { ...n, paused });
}
function openNotification(o: ArNotificationOptions): () => void {
  const key = o.key ?? `ar-ntf-${++ntfSeq}`;
  const duration = o.duration ?? 4.5;
  const entry: ArNotificationEntry = { tone: "info", closable: true, ...o, key, duration, paused: false };
  const i = arNotificationStore.findIndex((n) => n.key === key);
  if (i >= 0) arNotificationStore.splice(i, 1, entry);
  else arNotificationStore.unshift(entry);
  clearTimeout(ntfTimers.get(key)?.t);
  ntfTimers.delete(key);
  if (duration > 0) startTimer(key, duration * 1000);
  return () => closeNotification(key);
}

export interface ArNotificationApi {
  open: (options: ArNotificationOptions) => () => void;
  success: (options: Omit<ArNotificationOptions, "tone">) => () => void;
  info: (options: Omit<ArNotificationOptions, "tone">) => () => void;
  warning: (options: Omit<ArNotificationOptions, "tone">) => () => void;
  error: (options: Omit<ArNotificationOptions, "tone">) => () => void;
  destroy: (key?: string) => void;
}
const notificationApi: ArNotificationApi = {
  open: openNotification,
  success: (o) => openNotification({ ...o, tone: "ok" }),
  info: (o) => openNotification({ ...o, tone: "info" }),
  warning: (o) => openNotification({ ...o, tone: "warn" }),
  error: (o) => openNotification({ ...o, tone: "danger" }),
  destroy: (key) => (key ? closeNotification(key) : [...arNotificationStore].forEach((n) => closeNotification(n.key))),
};
/** 右上に白いカードを出す。 */
export function useArNotification(): ArNotificationApi {
  return notificationApi;
}

/** ArNotificationHost の中だけで使う（ライブラリの外には出さない）。 */
export const notificationInternals = { close: closeNotification, setPaused };
