<script setup lang="ts">
/**
 * ArDrawer 1.1 — 横から出る板（placement="bottom" でスマホの下から出る一覧）。幕は ink の42%、頭は白、足は bg-2。
 * ARROW のシフト画面では日の詳細は横から出さない（配置を変えない）。設定の細かい項目などに使う。
 * 開くと中の最初の入力にフォーカスし、Tab は中で回る。閉じると開く前の場所に戻す。
 */
import { computed, ref } from "vue";
import { useArUi, useId } from "../provider/context";
import { useDialog } from "../internal/dialog";
import ArIcon from "./ArIcon.vue";
import ArButton from "./ArButton.vue";
import type { ArDrawerProps } from "./ArDrawer.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArDrawerProps>(), {
  zIndex: undefined,
  icon: undefined,
  placement: "right",
  width: undefined,
  height: undefined,
  closable: true,
  closeOnScrim: true,
  teleportTo: "body",
  contained: false,
  labels: () => ({ close: "閉じる" }),
});
const emit = defineEmits<{ "update:open": [open: boolean]; close: [] }>();

const id = useId("ar-drawer");
const ui = useArUi();
const target = computed(() => (props.teleportTo === "body" && ui?.portal.value ? ui.portal.value : (props.teleportTo ?? "body")));
const panel = ref<HTMLElement | null>(null);
const len = (v: number | string) => (typeof v === "number" ? `${v}px` : v);
const panelStyle = computed(() => {
  if (props.placement === "bottom") return props.height === undefined ? undefined : { height: len(props.height) };
  return props.width === undefined ? undefined : { width: len(props.width) };
});

function close() {
  emit("update:open", false);
  emit("close");
}
const { onKeydown, palette } = useDialog({
  open: () => props.open,
  panel,
  initial: () => panel.value?.querySelector<HTMLElement>('[data-part="body"]'),
  escapable: () => props.closable,
  onEscape: close,
  lockScroll: () => !props.contained,
});
</script>

<template>
  <Teleport :to="target" :disabled="teleportTo === null || contained" defer>
    <Transition name="ar-drawer">
      <div
        v-if="open"
        v-bind="$attrs"
        data-ar="drawer"
        data-part="root"
        :data-placement="placement"
        :data-contained="contained || undefined"
        :data-ar-palette="palette"
        :style="zIndex != null ? { zIndex } : undefined"
        @keydown="onKeydown"
      >
        <div data-part="scrim" aria-hidden="true" @click="closeOnScrim && close()" />
        <div ref="panel" data-part="panel" role="dialog" aria-modal="true" :aria-labelledby="`${id}-title`" tabindex="-1" :style="panelStyle">
          <header data-part="header">
            <ArIcon v-if="icon" :name="icon" size="sm" data-part="icon" />
            <h2 :id="`${id}-title`" data-part="title">{{ title }}</h2>
            <div v-if="$slots.extra" data-part="extra"><slot name="extra" /></div>
            <ArButton v-if="closable" data-part="close" tone="muted" icon="x" :size="placement === 'bottom' ? 'lg' : 'md'" :label="labels.close" @click="close" />
          </header>
          <div data-part="body"><slot /></div>
          <footer v-if="$slots.footer" data-part="footer"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
