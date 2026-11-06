<script setup lang="ts">
/**
 * ArItem 1.1 — 項目の行（設定の画面の1行）。左に項目名（幅 titleWidth・必須の印・？の説明・項目名の下の補足）、
 * 右に入力と、その下の間違い・補足・「詳細」。row の形では行の上に区切りの線、右に「変更あり／元に戻す」。
 * 中の入力とは default スロットの値（id・aria-*）を v-bind して結ぶ。項目名を押すと入力へ。
 */
import { computed, nextTick, useSlots } from "vue";
import { useId } from "../provider/context";
import ArIcon from "./ArIcon.vue";
import ArButton from "./ArButton.vue";
import ArPopover from "./ArPopover.vue";
import type { ArItemControlProps, ArItemProps } from "./ArItem.contract";

const props = withDefaults(defineProps<ArItemProps>(), {
  title: undefined,
  required: false,
  requiredText: "必須",
  info: undefined,
  detail: false,
  detailHref: undefined,
  detailText: "詳細",
  titleWidth: "200px",
  id: undefined,
  variant: "form",
  help: undefined,
  helpLabel: undefined,
  caption: undefined,
  error: undefined,
  unregistered: false,
  unregisteredText: "未登録",
  changed: false,
  changedText: "変更あり",
  revertable: true,
  revertText: "元に戻す",
  highlight: false,
});
const emit = defineEmits<{ detail: [event: MouseEvent]; help: [event: MouseEvent]; revert: [event: MouseEvent] }>();
defineSlots<{ default?(props: ArItemControlProps): unknown; title?(): unknown; info?(): unknown; aside?(): unknown }>();
const slots = useSlots();
const auto = useId("ar-item");
const id = computed(() => props.id ?? auto);
const labelId = `${auto}-label`;
const infoId = `${auto}-info`;
const errorId = `${auto}-error`;
const captionId = `${auto}-caption`;
const hasInfo = computed(() => !!(props.info || slots.info || props.detail || props.detailHref));
const describedBy = computed(() =>
  [props.error && errorId, props.caption && captionId, hasInfo.value && infoId].filter(Boolean).join(" ") || undefined,
);
const control = computed<ArItemControlProps>(() => ({
  id: id.value,
  "aria-labelledby": labelId,
  ...(describedBy.value ? { "aria-describedby": describedBy.value } : {}),
  ...(props.required ? { "aria-required": "true" as const } : {}),
  ...(props.error ? { "aria-invalid": "true" as const } : {}),
}));
const unregWhy = computed(() => (typeof props.unregistered === "string" && props.unregistered ? props.unregistered : ""));
const state = computed(
  () => [props.changed && "changed", props.error && "invalid", props.highlight && "highlight", props.unregistered && "unregistered"].filter(Boolean).join(" ") || undefined,
);
const hasAside = computed(() => props.changed || !!slots.aside);
function onLabelClick(e: MouseEvent) {
  const el = document.getElementById(id.value);
  if (!el || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(el.tagName)) return;
  e.preventDefault();
  focusControl(el);
}
function focusControl(el: HTMLElement): void {
  if (el.matches(":disabled") || el.getAttribute("aria-disabled") === "true") return;
  if (el.tabIndex >= 0 && el.getAttribute("aria-disabled") !== "true") {
    el.focus();
    return;
  }
  // Radio/flag groups carry the field id on their container. Focus the first
  // usable control, as ArField does, instead of a non-focusable wrapper.
  const controls = el.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex="-1"])',
  );
  Array.from(controls).find((control) => control.getAttribute("aria-disabled") !== "true" && control.getClientRects().length > 0)?.focus();
}
async function onRevert(e: MouseEvent): Promise<void> {
  const trigger = e.currentTarget;
  emit("revert", e);
  await nextTick();
  // A reverted row removes its action. Keep keyboard users at that field,
  // but preserve focus deliberately moved by the consumer (for example to a dialog).
  if (props.changed || (document.activeElement !== document.body && document.activeElement !== trigger)) return;
  const el = document.getElementById(id.value);
  if (el) focusControl(el);
}
</script>

<template>
  <div data-ar="item" data-part="root" :data-variant="variant" :data-state="state" :style="{ '--ar-item-title': titleWidth }">
    <div data-part="title">
      <label :id="labelId" data-part="label" :for="id" @click="onLabelClick"
        ><span data-part="label-text"><slot name="title">{{ title }}</slot></span
        ><span v-if="required" data-part="required">{{ requiredText }}</span></label
      ><ArPopover v-if="help" :title="title" :content="help" placement="bottom" :label="helpLabel ?? `${title ?? ''}の説明`"
        ><button type="button" data-part="help" :aria-label="helpLabel ?? `${title ?? ''}の説明`" @click="emit('help', $event)">
          <ArIcon line name="help" size="sm" /></button
      ></ArPopover>
      <small v-if="caption" :id="captionId" data-part="caption">{{ caption }}</small>
    </div>
    <div data-part="content">
      <span v-if="unregistered" data-part="unregistered"
        ><span data-part="unregistered-text">{{ unregisteredText }}</span
        ><span v-if="unregWhy" data-part="unregistered-why">{{ unregWhy }}</span></span
      >
      <slot v-else v-bind="control" />
      <p v-if="error" :id="errorId" data-part="error" role="alert"><ArIcon line name="alert" size="sm" />{{ error }}</p>
      <p v-if="hasInfo" :id="infoId" data-part="info">
        <span v-if="info || $slots.info" data-part="info-text"><slot name="info">{{ info }}</slot></span>
        <a v-if="detailHref" data-part="detail" :href="detailHref" target="_blank" rel="noopener"
          ><ArIcon v-if="variant === 'row'" line name="info" size="sm" />{{ detailText }}</a
        >
        <button v-else-if="detail" type="button" data-part="detail" @click="emit('detail', $event)">
          <ArIcon v-if="variant === 'row'" line name="info" size="sm" />{{ detailText }}
        </button>
      </p>
    </div>
    <div v-if="hasAside" data-part="aside">
      <slot name="aside">
        <span data-part="changed">{{ changedText }}</span>
        <ArButton v-if="revertable" tone="muted" size="sm" icon="undo" @click="onRevert">{{ revertText }}</ArButton>
      </slot>
    </div>
  </div>
</template>
