<script setup lang="ts">
/**
 * ArUiProvider 1.0
 * アプリに1つ置く。skin のトークンとテーマ色を html に配り、宣言した部品がそろっているかを確かめる。
 * どの skin を使うかは製品が起動時に決めて渡す（利用者が選ぶ仕組みは持たない）。
 */
import { computed, onBeforeUnmount, provide, toRef, watch } from "vue";
import type { ArPaletteName } from "@arrow/ui-tokens";
import type { ArSkin } from "../skin";
import { checkRequirements, formatProblems, type ArRequirements } from "../requirements";
import { arUiContextKey } from "./context";
import { skinCss } from "./css";

const props = withDefaults(
  defineProps<{
    skin: ArSkin;
    /** 画面全体の既定のテーマ色。ページごとの色は ArThemeScope で変える。 */
    palette?: ArPaletteName;
    /** 製品の arrow-ui.requires.ts。渡すと起動時に確かめ、足りなければ画面を出さない。 */
    requires?: ArRequirements;
  }>(),
  { palette: "blue", requires: undefined },
);

provide(arUiContextKey, { skin: toRef(props, "skin"), palette: toRef(props, "palette") });

const check = computed(() =>
  props.requires ? checkRequirements(props.requires, { skins: [props.skin] }) : { ok: true, problems: [] },
);
const message = computed(() => formatProblems(check.value));

const hasDom = typeof document !== "undefined";
let styleEl: HTMLStyleElement | null = null;

watch(
  () => props.skin,
  (skin) => {
    if (!hasDom) return;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-ar-tokens", "");
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = skinCss(skin);
    document.documentElement.setAttribute("data-ar-skin", skin.id);
    void skin.styles?.();
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
