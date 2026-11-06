<script setup lang="ts">
/**
 * ArThumbnail 1.2 — 顔写真などの画像（丸／四角）と、右下のカメラのボタン。
 * ボタンでポップアップを開き、画像を選んで（押す・落とす）、ドラッグで動かし、＋−・ホイールで拡大縮小、左右に90°回して切り抜く。
 * 切り抜きは canvas だけで行う（ほかのライブラリは使わない）。キーボードでは枠にフォーカスして矢印で動かし、＋−で拡大縮小。
 * 1.1：v-model:open・dialogOnly・freeCrop（四隅のつまみで範囲を変え、PNG の File を file で渡す。矢印で動かし、Shift＋矢印で大きさ）・accept・placeholder・aspect。
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import ArButton from "./ArButton.vue";
import ArModal from "./ArModal.vue";
import ArImage from "./ArImage.vue";
import ArIcon from "./ArIcon.vue";
import type { ArThumbnailProps } from "./ArThumbnail.contract";
import { useDesignForm } from "../provider/context";

const props = withDefaults(defineProps<ArThumbnailProps>(), {
  shape: "square",
  size: 120,
  editable: true,
  cropWidth: 300,
  cropHeight: 300,
  quality: 1,
  fit: "contain",
  maxFileBytes: undefined,
  maxImagePixels: undefined,
  alt: "",
  preview: false,
  open: undefined,
  dialogOnly: false,
  closeOnSave: true,
  freeCrop: false,
  accept: undefined,
  placeholder: "person",
  aspect: "square",
  labels: () => ({
    change: "画像を変える",
    title: "画像のアップロード",
    hint: "下の枠を押すと画像を選べます。\n選んだあと、ドラッグで動かし、＋−で大きさを変えて切り抜きます。\npng・jpeg・gif の画像だけ使えます。",
    choose: "画像を選ぶ",
    remove: "画像を消す",
    zoomIn: "大きく",
    zoomOut: "小さく",
    rotateLeft: "左に回す",
    rotateRight: "右に回す",
    area: "切り抜く範囲。矢印のキーで動かし、＋とーで大きさを変える",
    cancel: "キャンセル",
    ok: "登録",
    empty: "ここを押して画像を選ぶ（ドラッグして落としてもよい）",
  }),
});
const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  "update:open": [open: boolean];
  file: [file: File];
  "invalid-image": [reason: "type" | "bytes" | "pixels" | "load"];
}>();

const open = ref(false);
/** 受け付ける拡張子（input の accept と、選んだファイルの名前の確かめ）。 */
const acceptAttr = computed(() =>
  props.accept?.length
    ? props.accept.map((x) => `.${x.replace(/^\./, "")}`).join(",")
    : "image/png,image/jpeg,image/gif",
);
const extOk = (name: string) =>
  !props.accept?.length ||
  props.accept.some(
    (x) =>
      x.replace(/^\./, "").toLowerCase() ===
      name.split(".").pop()?.toLowerCase(),
  );
/** 画面の箱：aspect="crop" は幅 size・高さは切り抜く比。 */
const boxStyle = computed(() => ({
  "--ar-thumbnail-size": `${props.size}px`,
  "--ar-thumbnail-ratio": props.aspect === "crop" ? `${props.cropWidth} / ${props.cropHeight}` : "1",
  ...(props.aspect === "crop"
    ? {
        "--ar-thumbnail-height": `${Math.round((props.size * props.cropHeight) / props.cropWidth)}px`,
      }
    : {}),
}));
/** freeCrop の範囲（元の画素で）。 */
const crop = ref({ x: 0, y: 0, w: 0, h: 0 });
const baseName = ref("image");
/** 形（ArDesign.forms.ArThumbnail.editor）。arrow は今の ARROW の画像のアップロードの並び。 */
const editor = useDesignForm<"tools" | "arrow">(
  "ArThumbnail",
  "editor",
  "tools",
);
/** 選んだファイルの名前（editor="arrow" で出す）。 */
const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
/** 編集中の画像。 */
const src = ref<string | null>(null);
const natural = ref({ w: 0, h: 0 });
const img = ref<HTMLImageElement | null>(null);
const rotate = ref(0);
const scale = ref(1);
const ox = ref(0);
const oy = ref(0);
let objectUrl: string | null = null;
let imageWork = 0;
const pendingUrls = new Set<string>();
const imageLoading = ref(false);

/** A newer selection or a closed editor owns the image; stale work cannot restore it. */
function cancelImageWork(): number {
  imageWork += 1;
  imageLoading.value = false;
  for (const url of pendingUrls) URL.revokeObjectURL(url);
  pendingUrls.clear();
  return imageWork;
}
function releasePending(url: string): void {
  if (pendingUrls.delete(url)) URL.revokeObjectURL(url);
}
function isCurrentImageWork(work: number): boolean {
  return open.value && work === imageWork;
}

/** 画面の枠（いちばん長い辺を 280px にそろえる）。 */
const frame = computed(() => {
  const k = 280 / Math.max(props.cropWidth, props.cropHeight);
  return {
    w: Math.round(props.cropWidth * k),
    h: Math.round(props.cropHeight * k),
  };
});
const rotated = computed(() =>
  rotate.value % 180 === 0
    ? natural.value
    : { w: natural.value.h, h: natural.value.w },
);
const fitScale = (mode: "contain" | "cover") => {
  const r = rotated.value;
  if (!r.w || !r.h) return 1;
  const sx = frame.value.w / r.w;
  const sy = frame.value.h / r.h;
  return mode === "contain" ? Math.min(sx, sy) : Math.max(sx, sy);
};
const minScale = computed(() => fitScale("contain"));
const maxScale = computed(() => fitScale("cover") * 4);
function clamp() {
  scale.value = Math.min(maxScale.value, Math.max(minScale.value, scale.value));
  const lx = Math.abs(rotated.value.w * scale.value - frame.value.w) / 2;
  const ly = Math.abs(rotated.value.h * scale.value - frame.value.h) / 2;
  ox.value = Math.min(lx, Math.max(-lx, ox.value));
  oy.value = Math.min(ly, Math.max(-ly, oy.value));
}
function reset() {
  rotate.value = 0;
  scale.value = fitScale(props.fit);
  ox.value = 0;
  oy.value = 0;
  clamp();
}

function revoke() {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
}
onBeforeUnmount(() => {
  cancelImageWork();
  revoke();
});
function startEdit() {
  cancelImageWork();
  revoke();
  src.value = props.modelValue;
  imageLoading.value = !!src.value;
  fileName.value = "";
  natural.value = { w: 0, h: 0 };
  open.value = true;
}
function onImageLoad(e: Event) {
  const el = e.target as HTMLImageElement;
  if (!open.value || el !== img.value) return;
  imageLoading.value = false;
  natural.value = { w: el.naturalWidth, h: el.naturalHeight };
  reset();
  if (props.freeCrop)
    crop.value = { x: 0, y: 0, w: el.naturalWidth, h: el.naturalHeight };
}
function onImageError(): void {
  if (!open.value) return;
  imageLoading.value = false;
  emit("invalid-image", "load");
}

/** 先頭の数バイトで画像の種類を確かめる（拡張子は信じない）。 */
async function sniff(file: File): Promise<boolean> {
  const b = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return hex === "89504e47" || hex === "47494638" || hex.startsWith("ffd8ff");
}
async function load(file: File | undefined | null) {
  if (!file || !open.value) return;
  const work = cancelImageWork();
  if (!extOk(file.name)) return emit("invalid-image", "type");
  if (props.maxFileBytes && file.size > props.maxFileBytes)
    return emit("invalid-image", "bytes");
  imageLoading.value = true;
  try {
    const valid = await sniff(file);
    if (!isCurrentImageWork(work)) return;
    if (!valid) {
      imageLoading.value = false;
      return emit("invalid-image", "type");
    }
  } catch {
    if (isCurrentImageWork(work)) {
      imageLoading.value = false;
      emit("invalid-image", "load");
    }
    return;
  }
  const url = URL.createObjectURL(file);
  pendingUrls.add(url);
  const probe = new Image();
  probe.onload = () => {
    if (!isCurrentImageWork(work)) return releasePending(url);
    if (
      props.maxImagePixels &&
      probe.naturalWidth * probe.naturalHeight > props.maxImagePixels
    ) {
      releasePending(url);
      imageLoading.value = false;
      emit("invalid-image", "pixels");
      return;
    }
    pendingUrls.delete(url);
    revoke();
    objectUrl = url;
    natural.value = { w: 0, h: 0 };
    src.value = url;
    fileName.value = file.name;
    baseName.value = file.name.replace(/\.[^.]+$/, "") || "image";
  };
  probe.onerror = () => {
    releasePending(url);
    if (isCurrentImageWork(work)) {
      imageLoading.value = false;
      emit("invalid-image", "load");
    }
  };
  probe.src = url;
}
function removeImage(): void {
  cancelImageWork();
  revoke();
  src.value = null;
  natural.value = { w: 0, h: 0 };
  fileName.value = "";
}
function finishSave(): void {
  if (props.closeOnSave) open.value = false;
}
function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  void load(input.files?.[0]);
  input.value = "";
}
const dragOver = ref(false);
function onDrop(e: DragEvent) {
  dragOver.value = false;
  void load(e.dataTransfer?.files?.[0]);
}

// ドラッグで動かす
let drag: { x: number; y: number; ox: number; oy: number; id: number } | null =
  null;
function onPointerDown(e: PointerEvent) {
  if (!src.value || props.freeCrop) return;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  drag = {
    x: e.clientX,
    y: e.clientY,
    ox: ox.value,
    oy: oy.value,
    id: e.pointerId,
  };
}
function onPointerMove(e: PointerEvent) {
  if (!drag || drag.id !== e.pointerId) return;
  ox.value = drag.ox + e.clientX - drag.x;
  oy.value = drag.oy + e.clientY - drag.y;
  clamp();
}
function onPointerUp() {
  drag = null;
}
function zoom(f: number) {
  scale.value *= f;
  clamp();
}
function onWheel(e: WheelEvent) {
  if (!src.value || props.freeCrop) return;
  e.preventDefault();
  zoom(e.deltaY < 0 ? 1.08 : 1 / 1.08);
}
function turn(deg: number) {
  if (props.freeCrop) return void turnSource(deg);
  rotate.value = (rotate.value + deg + 360) % 360;
  scale.value = fitScale(props.fit);
  ox.value = 0;
  oy.value = 0;
  clamp();
}
function onFrameKey(e: KeyboardEvent) {
  if (!src.value) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.value?.click();
    }
    return;
  }
  if (props.freeCrop) return onCropKey(e);
  const step = e.shiftKey ? 30 : 10;
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  };
  if (e.key in moves) {
    e.preventDefault();
    ox.value += moves[e.key]![0];
    oy.value += moves[e.key]![1];
    clamp();
  } else if (e.key === "+" || e.key === "=") {
    e.preventDefault();
    zoom(1.1);
  } else if (e.key === "-") {
    e.preventDefault();
    zoom(1 / 1.1);
  }
}
const pictureStyle = computed(() => ({
  width: `${natural.value.w}px`,
  height: `${natural.value.h}px`,
  marginLeft: `${-natural.value.w / 2}px`,
  marginTop: `${-natural.value.h / 2}px`,
  transform: `translate(${ox.value}px, ${oy.value}px) rotate(${rotate.value}deg) scale(${scale.value})`,
}));

function submit() {
  if (imageLoading.value || (src.value && !natural.value.w)) return;
  if (props.freeCrop) return submitFree();
  if (!open.value) return;
  cancelImageWork();
  if (!src.value || !img.value || !natural.value.w) {
    emit("update:modelValue", null);
    finishSave();
    return;
  }
  const cw = Math.round(props.cropWidth * props.quality);
  const ch = Math.round(props.cropHeight * props.quality);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const f = cw / frame.value.w;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cw, ch);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.translate(cw / 2 + ox.value * f, ch / 2 + oy.value * f);
  ctx.rotate((rotate.value * Math.PI) / 180);
  ctx.scale(scale.value * f, scale.value * f);
  ctx.drawImage(img.value, -natural.value.w / 2, -natural.value.h / 2);
  emit("update:modelValue", canvas.toDataURL("image/png"));
  finishSave();
}
watch(
  open,
  (o) => {
    if (!o) removeImage();
  },
  { flush: "sync" },
);

/* ---- freeCrop：画像全体を枠に入れ、範囲を四隅のつまみで変える ---- */
/** 画面での倍率と、枠の中の画像の位置。 */
const view = computed(() => {
  const n = natural.value;
  if (!n.w || !n.h) return { k: 1, left: 0, top: 0 };
  const k = Math.min(frame.value.w / n.w, frame.value.h / n.h);
  return {
    k,
    left: (frame.value.w - n.w * k) / 2,
    top: (frame.value.h - n.h * k) / 2,
  };
});
const freeStyle = computed(() => ({
  width: `${natural.value.w * view.value.k}px`,
  height: `${natural.value.h * view.value.k}px`,
  left: `${view.value.left}px`,
  top: `${view.value.top}px`,
}));
const cropStyle = computed(() => {
  const { k, left, top } = view.value;
  const c = crop.value;
  return {
    left: `${left + c.x * k}px`,
    top: `${top + c.y * k}px`,
    width: `${c.w * k}px`,
    height: `${c.h * k}px`,
  };
});
/** 範囲を画像の中に収める（いちばん小さくて 16 画素）。 */
function setCrop(c: { x: number; y: number; w: number; h: number }) {
  const n = natural.value;
  const min = Math.min(16, n.w, n.h);
  const w = Math.min(n.w, Math.max(min, c.w));
  const h = Math.min(n.h, Math.max(min, c.h));
  crop.value = {
    x: Math.min(n.w - w, Math.max(0, c.x)),
    y: Math.min(n.h - h, Math.max(0, c.y)),
    w,
    h,
  };
}
let cropDrag: {
  mode: string;
  x: number;
  y: number;
  c: { x: number; y: number; w: number; h: number };
  id: number;
} | null = null;
function onCropDown(e: PointerEvent, mode: string) {
  e.stopPropagation();
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  cropDrag = {
    mode,
    x: e.clientX,
    y: e.clientY,
    c: { ...crop.value },
    id: e.pointerId,
  };
}
function onCropMove(e: PointerEvent) {
  if (!cropDrag || cropDrag.id !== e.pointerId) return;
  const k = view.value.k || 1;
  const dx = (e.clientX - cropDrag.x) / k;
  const dy = (e.clientY - cropDrag.y) / k;
  const c = cropDrag.c;
  const m = cropDrag.mode;
  if (m === "move") return setCrop({ ...c, x: c.x + dx, y: c.y + dy });
  let { x, y, w, h } = c;
  if (m.includes("w")) {
    const nx = Math.max(0, Math.min(x + w - 16, x + dx));
    w += x - nx;
    x = nx;
  }
  if (m.includes("e")) w = Math.min(natural.value.w - x, w + dx);
  if (m.includes("n")) {
    const ny = Math.max(0, Math.min(y + h - 16, y + dy));
    h += y - ny;
    y = ny;
  }
  if (m.includes("s")) h = Math.min(natural.value.h - y, h + dy);
  setCrop({ x, y, w, h });
}
function onCropUp() {
  cropDrag = null;
}
function onCropKey(e: KeyboardEvent) {
  const step = 10 / (view.value.k || 1);
  const d: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  };
  if (!(e.key in d)) return;
  e.preventDefault();
  const [dx, dy] = d[e.key]!;
  const c = crop.value;
  setCrop(
    e.shiftKey
      ? { ...c, w: c.w + dx, h: c.h + dy }
      : { ...c, x: c.x + dx, y: c.y + dy },
  );
}
/** 元の画像を回した画像に置き換える（範囲は全体に戻す）。 */
function turnSource(deg: number) {
  if (!img.value || !natural.value.w || !open.value) return;
  const work = cancelImageWork();
  const { w, h } = natural.value;
  const canvas = document.createElement("canvas");
  canvas.width = h;
  canvas.height = w;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.translate(h / 2, w / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(img.value, -w / 2, -h / 2);
  canvas.toBlob((blob) => {
    if (!isCurrentImageWork(work) || !blob) return;
    revoke();
    objectUrl = URL.createObjectURL(blob);
    src.value = objectUrl;
  }, "image/png");
}
function submitFree() {
  if (!src.value || !img.value || !natural.value.w || !open.value) return;
  const work = cancelImageWork();
  const c = crop.value;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(c.w));
  canvas.height = Math.max(1, Math.round(c.h));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img.value,
    c.x,
    c.y,
    c.w,
    c.h,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const name = `${baseName.value}.png`;
  canvas.toBlob((blob) => {
    if (!isCurrentImageWork(work)) return;
    if (!blob) return emit("invalid-image", "load");
    emit("file", new File([blob], name, { type: "image/png" }));
    finishSave();
  }, "image/png");
}
/** v-model:open（今の isEditting）：製品が開けたら中身をそろえて開き、閉じたら閉じる。 */
watch(
  () => props.open,
  (o) => {
    if (o === undefined || o === open.value) return;
    if (o) startEdit();
    else open.value = false;
  },
  { immediate: true },
);
watch(open, (o) => {
  if (props.open !== undefined && o !== props.open) emit("update:open", o);
});
defineExpose({ edit: startEdit });
</script>

<template>
  <span
    data-ar="thumbnail"
    data-part="root"
    :data-shape="shape"
    :data-aspect="aspect === 'crop' ? 'crop' : undefined"
    :data-dialog-only="dialogOnly || undefined"
    :data-state="modelValue ? undefined : 'empty'"
    :style="boxStyle"
  >
    <template v-if="!dialogOnly">
      <span v-if="modelValue && preview" data-part="image">
        <ArImage :src="modelValue" :alt="alt" width="100%" height="100%" :fit="fit" />
      </span>
      <img v-else-if="modelValue" data-part="image" :src="modelValue" :alt="alt" />
      <span
        v-else-if="placeholder === 'picture'"
        data-part="silhouette"
        data-kind="picture"
        :role="alt ? 'img' : undefined"
        :aria-label="alt || undefined"
        ><ArIcon name="image" data-part="silhouette-line" /><svg
          data-part="silhouette-fill"
          viewBox="0 0 800 800"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M656.3 186.4c-47.2 0-85.4 38.2-85.4 85.4s38.2 85.4 85.4 85.4 85.4-38.2 85.4-85.4-38.1-85.4-85.4-85.4zM250.5 261.2 58.3 613.6h512.5L410.7 325.3l-64.1 96.1z"
          /></svg
      ></span>
      <span
        v-else
        data-part="silhouette"
        :role="alt ? 'img' : undefined"
        :aria-label="alt || undefined"
        ><ArIcon name="user" data-part="silhouette-line" /><svg
          data-part="silhouette-fill"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="8" r="4.6" fill="currentColor" />
          <path
            d="M2.6 22c.4-4.8 4.4-7.6 9.4-7.6s9 2.8 9.4 7.6z"
            fill="currentColor"
          /></svg
      ></span>
    </template>
    <button
      v-if="editable && !dialogOnly"
      type="button"
      data-part="camera"
      :aria-label="labels.change"
      :title="labels.change"
      @click="startEdit"
    >
      <ArIcon name="camera" data-part="camera-icon" />
    </button>
    <ArModal
      v-model:open="open"
      :title="labels.title"
      size="sm"
      :width="editor === 'arrow' ? 500 : undefined"
    >
      <div
        data-ar="thumbnail-editor"
        data-part="root"
        :data-form="editor"
        :data-free="freeCrop || undefined"
      >
        <p data-part="hint">{{ labels.hint }}</p>
        <div
          data-part="frame"
          :data-shape="shape"
          :data-state="
            [src ? 'has-image' : 'empty', dragOver && 'drag-over']
              .filter(Boolean)
              .join(' ')
          "
          :style="{
            '--ar-thumbnail-frame-w': `${frame.w}px`,
            '--ar-thumbnail-frame-h': `${frame.h}px`,
          }"
          tabindex="0"
          role="group"
          :aria-label="src ? labels.area : labels.empty"
          @click="!src && fileInput?.click()"
          @keydown="onFrameKey"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel="onWheel"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="onDrop"
        >
          <img
            v-if="src"
            ref="img"
            data-part="picture"
            :src="src"
            alt=""
            draggable="false"
            :style="freeCrop ? freeStyle : pictureStyle"
            @load="onImageLoad"
            @error="onImageError"
          />
          <span v-else data-part="empty"
            ><ArIcon name="upload" /><span>{{ labels.choose }}</span></span
          >
          <span v-if="src && !freeCrop" data-part="mask" aria-hidden="true" />
          <span
            v-if="src && freeCrop && natural.w"
            data-part="crop"
            :style="cropStyle"
            @pointerdown="onCropDown($event, 'move')"
            @pointermove="onCropMove"
            @pointerup="onCropUp"
            @pointercancel="onCropUp"
          >
            <span
              v-for="pos in ['nw', 'ne', 'sw', 'se']"
              :key="pos"
              data-part="crop-handle"
              :data-pos="pos"
              aria-hidden="true"
              @pointerdown="onCropDown($event, pos)"
              @pointermove="onCropMove"
              @pointerup="onCropUp"
              @pointercancel="onCropUp"
            />
          </span>
        </div>
        <template v-if="editor === 'arrow'">
          <p data-part="file">
            {{ fileName || (labels.noFile ?? "ファイル未選択") }}
          </p>
          <div data-part="tools">
            <ArButton
              tone="primary"
              icon="undo"
              :label="labels.rotateLeft"
              :disabled="!src"
              @click="turn(-90)"
            />
            <ArButton
              tone="primary"
              icon="redo"
              :label="labels.rotateRight"
              :disabled="!src"
              @click="turn(90)"
            />
          </div>
          <div data-part="submit">
            <ArButton
              tone="primary"
              size="xl"
              :disabled="(freeCrop && !src) || Boolean(src && !natural.w)"
              :loading="imageLoading"
              @click="submit"
              >{{ labels.ok }}</ArButton
            >
          </div>
        </template>
        <div v-else data-part="tools">
          <template v-if="!freeCrop">
            <ArButton
              size="sm"
              icon="minus"
              :label="labels.zoomOut"
              :disabled="!src"
              @click="zoom(1 / 1.15)"
            />
            <ArButton
              size="sm"
              icon="plus"
              :label="labels.zoomIn"
              :disabled="!src"
              @click="zoom(1.15)"
            />
          </template>
          <ArButton
            size="sm"
            icon="undo"
            :label="labels.rotateLeft"
            :disabled="!src"
            @click="turn(-90)"
          />
          <ArButton
            size="sm"
            icon="redo"
            :label="labels.rotateRight"
            :disabled="!src"
            @click="turn(90)"
          />
          <span data-part="tools-gap" />
          <ArButton size="sm" icon="upload" @click="fileInput?.click()">{{
            labels.choose
          }}</ArButton>
          <ArButton
            size="sm"
            tone="danger-subtle"
            icon="trash"
            :label="labels.remove"
            :disabled="!src"
            @click="removeImage"
          />
        </div>
        <input
          ref="fileInput"
          type="file"
          :accept="acceptAttr"
          data-part="file"
          hidden
          @change="onFile"
        />
      </div>
      <template v-if="editor !== 'arrow'" #footer>
        <ArButton @click="open = false">{{ labels.cancel }}</ArButton>
        <ArButton tone="primary" :disabled="(freeCrop && !src) || Boolean(src && !natural.w)" :loading="imageLoading" @click="submit">{{
          labels.ok
        }}</ArButton>
      </template>
    </ArModal>
  </span>
</template>
