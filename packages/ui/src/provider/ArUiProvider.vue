<script setup lang="ts">
/**
 * ArUiProvider 1.1
 * アプリに1つ置く。デザインのトークンとテーマ色を配り、宣言した部品がそろっているかを確かめる。
 * どのデザインを使うかは製品が起動時に決めて渡す（利用者が選ぶ仕組みは持たない）。
 * scope="self" にすると、html ではなくこの部品の中だけにデザインを当てる（説明の画面で2つのデザインを並べるときなど）。
 */
import { computed, onBeforeUnmount, provide, ref, toRef, watch } from "vue";
import type { ArPaletteName } from "@arrow/ui-tokens";
import type { ArDesign } from "../design";
import { checkRequirements, formatProblems, type ArRequirements } from "../requirements";
import { arUiContextKey, useId } from "./context";
import { designCss } from "./css";

const props = withDefaults(
  defineProps<{
    design: ArDesign;
    /** 画面全体の既定のテーマ色。ページごとの色は ArThemeScope で変える。 */
    palette?: ArPaletteName;
    /** 製品の arrow-ui.requires.ts。渡すと起動時に確かめ、足りなければ画面を出さない。 */
    requires?: ArRequirements;
    /** document：html 全体に当てる（製品）。self：この部品の中だけに当てる。 */
    scope?: "document" | "self";
  }>(),
  { palette: "blue", requires: undefined, scope: "document" },
);

const scopeId = useId("ar-scope");
const self = computed(() => props.scope === "self");
const portal = ref<HTMLElement | null>(null);
provide(arUiContextKey, { design: toRef(props, "design"), palette: toRef(props, "palette"), portal });

const check = computed(() =>
  props.requires ? checkRequirements(props.requires, { designs: [props.design] }) : { ok: true, problems: [] },
);
const message = computed(() => formatProblems(check.value));

const hasDom = typeof document !== "undefined";
let styleEl: HTMLStyleElement | null = null;

watch(
  [() => props.design, self],
  ([design, isSelf]) => {
    if (!hasDom) return;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-ar-tokens", isSelf ? scopeId : "");
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = designCss(design, isSelf ? scopeId : undefined);
    if (!isSelf) document.documentElement.setAttribute("data-ar-design", design.id);
    void design.styles?.();
  },
  { immediate: true },
);

watch(
  [() => props.palette, self],
  ([p, isSelf]) => hasDom && !isSelf && document.documentElement.setAttribute("data-ar-palette", p),
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
  <div v-if="!check.ok" data-ar="requirements-error" role="alert">
    <strong>ARROW UI：宣言した部品がそろっていないため、画面を出せません。</strong>
    <pre>{{ message }}</pre>
  </div>
  <div
    v-else-if="self"
    data-ar="ui-scope"
    :data-ar-scope="scopeId"
    :data-ar-design="design.id"
    :data-ar-palette="palette"
  >
    <slot />
    <div ref="portal" data-part="portal" />
  </div>
  <slot v-else />
</template>
