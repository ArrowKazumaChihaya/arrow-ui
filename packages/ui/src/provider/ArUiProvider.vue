<script setup lang="ts">
/**
 * ArUiProvider 1.0
 * アプリに1つ置く。デザイン のトークンとテーマ色を html に配り、宣言した部品がそろっているかを確かめる。
 * どの デザイン を使うかは製品が起動時に決めて渡す（利用者が選ぶ仕組みは持たない）。
 */
import { computed, onBeforeUnmount, provide, toRef, watch } from "vue";
import type { ArPaletteName } from "@arrow/ui-tokens";
import type { ArDesign } from "../design";
import { checkRequirements, formatProblems, type ArRequirements } from "../requirements";
import { arUiContextKey } from "./context";
import { designCss } from "./css";

const props = withDefaults(
  defineProps<{
    design: ArDesign;
    /** 画面全体の既定のテーマ色。ページごとの色は ArThemeScope で変える。 */
    palette?: ArPaletteName;
    /** 製品の arrow-ui.requires.ts。渡すと起動時に確かめ、足りなければ画面を出さない。 */
    requires?: ArRequirements;
  }>(),
  { palette: "blue", requires: undefined },
);

provide(arUiContextKey, { design: toRef(props, "design"), palette: toRef(props, "palette") });

const check = computed(() =>
  props.requires ? checkRequirements(props.requires, { designs: [props.design] }) : { ok: true, problems: [] },
);
const message = computed(() => formatProblems(check.value));

const hasDom = typeof document !== "undefined";
let styleEl: HTMLStyleElement | null = null;

watch(
  () => props.design,
  (design) => {
    if (!hasDom) return;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-ar-tokens", "");
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = designCss(design);
    document.documentElement.setAttribute("data-ar-design", design.id);
    void design.styles?.();
  },
  { immediate: true },
);

watch(
  () => props.palette,
  (p) => hasDom && document.documentElement.setAttribute("data-ar-palette", p),
  { immediate: true },
);

watch(
  check,
  (c) => {
    if (!c.ok) console.error(`[ArUiProvider] ${message.value}`);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  styleEl?.remove();
  styleEl = null;
});
</script>

<template>
  <slot v-if="check.ok" />
  <div v-else data-ar="requirements-error" role="alert">
    <strong>ARROW UI：宣言した部品がそろっていないため、画面を出せません。</strong>
    <pre>{{ message }}</pre>
  </div>
</template>
