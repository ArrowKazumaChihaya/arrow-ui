<script setup lang="ts">
/**
 * ArUpload 1.0 — ファイルを置く・選ぶ（Excel登録と同じ形）。置き場は淡いテーマ色の点線。
 * 一覧：済みは緑のチェック、途中はテーマ色の進み具合、失敗は赤と理由。送る処理は親が行い、files に状態を入れる。
 * 置き場は Enter・Space でファイルを選ぶ画面を開く。
 */
import { computed, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArButton from "./ArButton.vue";
import { useDesignForm } from "../provider/context";
import type { ArIconName } from "../icons";
import type { ArUploadFile, ArUploadProps } from "./ArUpload.contract";

const props = withDefaults(defineProps<ArUploadProps>(), {
  files: () => [],
  accept: undefined,
  maxSize: undefined,
  multiple: false,
  listType: "text",
  hint: undefined,
  buttonTone: "primary",
  buttonSize: "md",
  disabled: false,
  label: undefined,
  labels: () => ({
    drop: "ファイルをここに置く",
    or: "または",
    pick: "選ぶ",
    add: "追加",
    remove: "消す",
    retry: "もう一度",
    tooLarge: "大きすぎます",
    wrongType: "形式が違います",
  }),
});
const emit = defineEmits<{
  select: [files: File[]];
  reject: [items: { file: File; reason: string }[]];
  remove: [file: ArUploadFile];
}>();

const trigger = useDesignForm<"drop" | "button">("ArUpload", "trigger", "drop");
const input = ref<HTMLInputElement | null>(null);
const over = ref(false);
const pick = () => !props.disabled && input.value?.click();

function accepts(f: File): boolean {
  if (!props.accept) return true;
  const name = f.name.toLowerCase();
  return props.accept.split(",").some((raw) => {
    const a = raw.trim().toLowerCase();
    if (a.startsWith(".")) return name.endsWith(a);
    if (a.endsWith("/*")) return f.type.startsWith(a.slice(0, -1));
    return f.type === a;
  });
}
function take(list: FileList | null | undefined) {
  if (!list || props.disabled) return;
  const files = [...list].slice(0, props.multiple ? undefined : 1);
  const ok: File[] = [];
  const ng: { file: File; reason: string }[] = [];
  for (const f of files) {
    if (!accepts(f)) ng.push({ file: f, reason: props.labels.wrongType });
    else if (props.maxSize && f.size > props.maxSize) ng.push({ file: f, reason: props.labels.tooLarge });
    else ok.push(f);
  }
  if (ok.length) emit("select", ok);
  if (ng.length) emit("reject", ng);
}
function onDrop(e: DragEvent) {
  over.value = false;
  take(e.dataTransfer?.files);
}
function onChange(e: Event) {
  take((e.target as HTMLInputElement).files);
  (e.target as HTMLInputElement).value = "";
}
function iconOf(f: ArUploadFile): ArIconName {
  if (f.status === "error") return "alert";
  return /\.(xlsx?|csv)$/i.test(f.name) ? "xls" : /\.(png|jpe?g|gif|heic|webp)$/i.test(f.name) ? "image" : "file";
}
const state = computed(() => [over.value && "dragover", props.disabled && "disabled"].filter(Boolean).join(" ") || undefined);
</script>

<template>
  <div data-ar="upload" data-part="root" :data-list="listType" :data-state="state" role="group" :aria-label="label">
    <input ref="input" data-part="input" type="file" hidden :accept="accept" :multiple="multiple" :disabled="disabled" @change="onChange" />
    <template v-if="listType === 'text' && trigger === 'button'">
      <ArButton
        data-part="button"
        :tone="buttonTone"
        :size="buttonSize"
        icon="upload"
        block
        :disabled="disabled"
        :aria-label="label ? `${label}：${labels.choose ?? 'ファイルを選択'}` : undefined"
        @click="pick"
        >{{ labels.choose ?? "ファイルを選択" }}</ArButton
      >
      <p data-part="chosen" aria-live="polite">{{ files.length ? files.map((f) => f.name).join("、") : (labels.none ?? "ファイル未選択") }}</p>
    </template>
    <template v-else-if="listType === 'text'">
      <div
        data-part="drop"
        role="button"
        :tabindex="disabled ? -1 : 0"
        :aria-disabled="disabled || undefined"
        :aria-label="`${label ?? ''}${labels.drop}${hint ? `（${hint}）` : ''}`"
        @click="pick"
        @keydown.enter.prevent="pick"
        @keydown.space.prevent="pick"
        @dragover.prevent="over = !disabled"
        @dragleave="over = false"
        @drop.prevent="onDrop"
      >
        <ArIcon name="upload" data-part="icon" />
        <b data-part="title">{{ labels.drop }}</b>
        <span data-part="hint">{{ labels.or }} <span data-part="pick">{{ labels.pick }}</span><template v-if="hint">（{{ hint }}）</template></span>
      </div>
      <ul v-if="files.length" data-part="files" role="list">
        <li v-for="f in files" :key="f.id" data-part="file" :data-status="f.status" role="listitem">
          <div data-part="row">
            <ArIcon :name="iconOf(f)" size="sm" data-part="kind" />
            <span data-part="name" :title="f.name">{{ f.name }}<template v-if="f.status === 'error' && f.error">（{{ f.error }}）</template></span>
            <ArIcon v-if="f.status === 'done'" name="check" size="sm" data-part="status" :label="'済み'" />
            <small v-else-if="f.status === 'uploading'" data-part="status">{{ Math.round(f.percent ?? 0) }}%</small>
            <button v-if="f.status !== 'uploading'" type="button" data-part="remove" :aria-label="`${f.name}を${labels.remove}`" :title="labels.remove" @click="emit('remove', f)">
              <ArIcon name="trash" size="sm" />
            </button>
          </div>
          <div
            v-if="f.status === 'uploading'"
            data-part="bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round(f.percent ?? 0)"
            :aria-label="f.name"
          >
            <i :style="{ width: `${f.percent ?? 0}%` }" />
          </div>
        </li>
      </ul>
    </template>
    <div v-else data-part="cards">
      <div v-for="f in files" :key="f.id" data-part="card" :data-status="f.status">
        <img v-if="f.url" :src="f.url" :alt="f.name" />
        <span v-else data-part="card-name">{{ f.name }}</span>
        <button type="button" data-part="remove" :aria-label="`${f.name}を${labels.remove}`" :title="labels.remove" @click="emit('remove', f)">
          <ArIcon name="x" size="sm" />
        </button>
      </div>
      <button
        type="button"
        data-part="add"
        :disabled="disabled"
        :aria-label="`${label ?? ''}${labels.add}`"
        @click="pick"
        @dragover.prevent="over = !disabled"
        @dragleave="over = false"
        @drop.prevent="onDrop"
      >
        <ArIcon name="plus" size="sm" />{{ label ?? labels.add }}
      </button>
    </div>
  </div>
</template>
