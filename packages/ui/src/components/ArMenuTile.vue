<script setup lang="ts">
/**
 * ArMenuTile 1.0 — メニュー画面のタイル。テーマ色の四角に線のアイコン、下に名前、右上に件数（と名前の下の赤い一言）。
 * 並べ方（7列・4列など）は使う側の ArGrid が決める。読み上げは「名前（一言）」、件数は「〜件」と読む。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArMenuTileProps } from "./ArMenuTile.contract";

const props = withDefaults(defineProps<ArMenuTileProps>(), {
  palette: undefined,
  count: undefined,
  note: undefined,
  variant: "card",
  size: "md",
  href: undefined,
  disabled: false,
});
const emit = defineEmits<{ click: [event: MouseEvent] }>();

const countText = computed(() => {
  const c = props.count;
  if (c === undefined || c === null || c === "" || c === 0) return "";
  if (typeof c === "number") return c > 99 ? "99+" : String(c);
  return c;
});
const aria = computed(() => {
  const extra = [props.note, countText.value && /^\d/.test(countText.value) ? `${countText.value}件` : ""].filter(Boolean).join("・");
  return extra ? `${props.label}（${extra}）` : undefined;
});
function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  emit("click", e);
}
</script>

<template>
  <component
    :is="href && !disabled ? 'a' : 'button'"
    data-ar="menu-tile"
    data-part="root"
    :data-variant="variant"
    :data-size="size"
    :data-state="disabled ? 'disabled' : undefined"
    :data-ar-palette="palette"
    :type="href && !disabled ? undefined : 'button'"
    :href="href && !disabled ? href : undefined"
    :disabled="!href && disabled ? true : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-label="aria"
    @click="onClick"
  >
    <span data-part="icon" :data-icon="icon">
      <ArIcon :name="icon" />
      <span v-if="countText" data-part="count" aria-hidden="true">{{ countText }}</span>
    </span>
    <span data-part="label">{{ label }}</span>
    <span v-if="note" data-part="note">{{ note }}</span>
  </component>
</template>
