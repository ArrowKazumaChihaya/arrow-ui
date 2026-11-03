<script setup lang="ts">
/**
 * ArModal 1.0 — ポップアップ。
 * 開くと中の最初の入力にフォーカスし、Tab は中で回る。閉じると開く前の場所にフォーカスを戻す。
 */
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useId } from "../provider/context";
import ArIcon from "./ArIcon.vue";
import type { ArModalProps } from "./ArModal.contract";

const props = withDefaults(defineProps<ArModalProps>(), {
  description: undefined,
  size: "md",
  steps: undefined,
  currentStep: 0,
  closable: true,
  closeOnScrim: false,
  teleportTo: "body",
  labels: () => ({ close: "閉じる", step: "手順" }),
});
const emit = defineEmits<{ "update:open": [open: boolean]; close: [] }>();

const id = useId("ar-modal");
const panel = ref<HTMLElement | null>(null);
let returnTo: HTMLElement | null = null;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function focusables(): HTMLElement[] {
  return panel.value ? Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
}

function close() {
  emit("update:open", false);
  emit("close");
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.closable) {
    e.stopPropagation();
    close();
    return;
  }
  if (e.key !== "Tab") return;
  const list = focusables();
  if (!list.length) return;
  const first = list[0] as HTMLElement;
  const last = list.at(-1) as HTMLElement;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (open) => {
    if (typeof document === "undefined") return;
    if (open) {
      returnTo = document.activeElement as HTMLElement | null;
      document.documentElement.setAttribute("data-ar-modal-open", "");
      await nextTick();
      const body = panel.value?.querySelector<HTMLElement>('[data-part="body"]');
      const target = (body && Array.from(body.querySelectorAll<HTMLElement>(FOCUSABLE))[0]) ?? panel.value;
      target?.focus();
    } else {
      document.documentElement.removeAttribute("data-ar-modal-open");
      returnTo?.focus?.();
      returnTo = null;
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  if (props.open && typeof document !== "undefined") document.documentElement.removeAttribute("data-ar-modal-open");
});
</script>

<template>
  <Teleport :to="teleportTo ?? 'body'" :disabled="teleportTo === null">
    <div v-if="open" data-ar="modal" data-part="root" :data-size="size" @keydown="onKeydown">
      <div data-part="scrim" aria-hidden="true" @click="closeOnScrim && close()" />
      <div
        ref="panel"
        data-part="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${id}-title`"
        :aria-describedby="description ? `${id}-desc` : undefined"
        tabindex="-1"
      >
        <header data-part="header">
          <div>
            <h2 :id="`${id}-title`" data-part="title">{{ title }}</h2>
            <p v-if="description" :id="`${id}-desc`" data-part="description">{{ description }}</p>
          </div>
          <button v-if="closable" type="button" data-part="close" :aria-label="labels.close" @click="close">
            <ArIcon name="x" />
          </button>
        </header>
        <ol v-if="steps?.length" data-part="steps" :aria-label="labels.step">
          <li
            v-for="(s, i) in steps"
            :key="s"
            data-part="step"
            :data-state="i < currentStep ? 'done' : i === currentStep ? 'current' : undefined"
            :aria-current="i === currentStep ? 'step' : undefined"
          >
            <span data-part="step-mark" aria-hidden="true"><ArIcon v-if="i < currentStep" name="check" size="sm" /><template v-else>{{ i + 1 }}</template></span>{{ s }}
          </li>
        </ol>
        <div data-part="body"><slot /></div>
        <footer v-if="$slots.footer" data-part="footer"><slot name="footer" /></footer>
      </div>
    </div>
  </Teleport>
</template>
