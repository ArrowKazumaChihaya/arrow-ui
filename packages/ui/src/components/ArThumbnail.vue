<script setup lang="ts">
/**
 * ArThumbnail 1.0 — 顔写真などの画像（丸／四角）と、右下のカメラのボタン。
 * ボタンでポップアップを開き、画像を選んで（押す・落とす）、ドラッグで動かし、＋−・ホイールで拡大縮小、左右に90°回して切り抜く。
 * 切り抜きは canvas だけで行う（ほかのライブラリは使わない）。キーボードでは枠にフォーカスして矢印で動かし、＋−で拡大縮小。
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import ArButton from "./ArButton.vue";
import ArModal from "./ArModal.vue";
import ArIcon from "./ArIcon.vue";
import type { ArThumbnailProps } from "./ArThumbnail.contract";

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
const emit = defineEmits<{ "update:modelValue": [value: string | null]; "invalid-image": [reason: "type" | "bytes" | "pixels" | "load"] }>();

const open = ref(false);
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

/** 画面の枠（いちばん長い辺を 280px にそろえる）。 */
const frame = computed(() => {
  const k = 280 / Math.max(props.cropWidth, props.cropHeight);
  return { w: Math.round(props.cropWidth * k), h: Math.round(props.cropHeight * k) };
});
const rotated = computed(() => (rotate.value % 180 === 0 ? natural.value : { w: natural.value.h, h: natural.value.w }));
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
onBeforeUnmount(revoke);
function startEdit() {
  revoke();
  src.value = props.modelValue;
  natural.value = { w: 0, h: 0 };
  open.value = true;
}
function onImageLoad(e: Event) {
  const el = e.target as HTMLImageElement;
  natural.value = { w: el.naturalWidth, h: el.naturalHeight };
  reset();
}

/** 先頭の数バイトで画像の種類を確かめる（拡張子は信じない）。 */
async function sniff(file: File): Promise<boolean> {
  const b = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return hex === "89504e47" || hex === "47494638" || hex.startsWith("ffd8ff");
}
async function load(file: File | undefined | null) {
  if (!file) return;
  if (props.maxFileBytes && file.size > props.maxFileBytes) return emit("invalid-image", "bytes");
  if (!(await sniff(file))) return emit("invalid-image", "type");
  const url = URL.createObjectURL(file);
  const probe = new Image();
  probe.onload = () => {
    if (props.maxImagePixels && probe.naturalWidth * probe.naturalHeight > props.maxImagePixels) {
      URL.revokeObjectURL(url);
      emit("invalid-image", "pixels");
      return;
    }
    revoke();
    objectUrl = url;
    src.value = url;
  };
  probe.onerror = () => {
    URL.revokeObjectURL(url);
    emit("invalid-image", "load");
  };
  probe.src = url;
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
let drag: { x: number; y: number; ox: number; oy: number; id: number } | null = null;
function onPointerDown(e: PointerEvent) {
  if (!src.value) return;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  drag = { x: e.clientX, y: e.clientY, ox: ox.value, oy: oy.value, id: e.pointerId };
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
  if (!src.value) return;
  e.preventDefault();
  zoom(e.deltaY < 0 ? 1.08 : 1 / 1.08);
}
function turn(deg: number) {
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
  const step = e.shiftKey ? 30 : 10;
  const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
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
  if (!src.value || !img.value || !natural.value.w) {
    emit("update:modelValue", null);
    open.value = false;
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
  open.value = false;
}
watch(open, (o) => {
  if (!o) {
    revoke();
    src.value = null;
  }
});
defineExpose({ edit: startEdit });
</script>

<template>
  <span
    data-ar="thumbnail"
    data-part="root"
    :data-shape="shape"
    :data-state="modelValue ? undefined : 'empty'"
    :style="{ '--ar-thumbnail-size': `${size}px` }"
  >
    <img v-if="modelValue" data-part="image" :src="modelValue" :alt="alt" />
    <span v-else data-part="silhouette" :role="alt ? 'img' : undefined" :aria-label="alt || undefined"
      ><ArIcon name="user" data-part="silhouette-line" /><svg data-part="silhouette-fill" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4.6" fill="currentColor" /><path d="M2.6 22c.4-4.8 4.4-7.6 9.4-7.6s9 2.8 9.4 7.6z" fill="currentColor" /></svg
    ></span>
    <button v-if="editable" type="button" data-part="camera" :aria-label="labels.change" :title="labels.change" @click="startEdit">
      <ArIcon name="camera" data-part="camera-icon" />
    </button>
    <ArModal v-model:open="open" :title="labels.title" size="sm">
      <div data-ar="thumbnail-editor" data-part="root">
        <p data-part="hint">{{ labels.hint }}</p>
        <div
          data-part="frame"
          :data-shape="shape"
          :data-state="[src ? 'has-image' : 'empty', dragOver && 'drag-over'].filter(Boolean).join(' ')"
          :style="{ '--ar-thumbnail-frame-w': `${frame.w}px`, '--ar-thumbnail-frame-h': `${frame.h}px` }"
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
          <img v-if="src" ref="img" data-part="picture" :src="src" alt="" draggable="false" :style="pictureStyle" @load="onImageLoad" />
          <span v-else data-part="empty"><ArIcon name="upload" /><span>{{ labels.choose }}</span></span>
          <span v-if="src" data-part="mask" aria-hidden="true" />
        </div>
        <div data-part="tools">
          <ArButton size="sm" icon="minus" :label="labels.zoomOut" :disabled="!src" @click="zoom(1 / 1.15)" />
          <ArButton size="sm" icon="plus" :label="labels.zoomIn" :disabled="!src" @click="zoom(1.15)" />
          <ArButton size="sm" icon="undo" :label="labels.rotateLeft" :disabled="!src" @click="turn(-90)" />
          <ArButton size="sm" icon="redo" :label="labels.rotateRight" :disabled="!src" @click="turn(90)" />
          <span data-part="tools-gap" />
          <ArButton size="sm" icon="upload" @click="fileInput?.click()">{{ labels.choose }}</ArButton>
          <ArButton size="sm" tone="danger-subtle" icon="trash" :label="labels.remove" :disabled="!src" @click="src = null" />
        </div>
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/gif" data-part="file" hidden @change="onFile" />
      </div>
      <template #footer>
        <ArButton @click="open = false">{{ labels.cancel }}</ArButton>
        <ArButton tone="primary" @click="submit">{{ labels.ok }}</ArButton>
      </template>
    </ArModal>
  </span>
</template>
