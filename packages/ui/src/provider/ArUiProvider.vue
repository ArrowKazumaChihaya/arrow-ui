<script setup lang="ts">
/**
 * ArUiProvider 1.2
 * アプリに1つ置く。デザインのトークンとテーマ色を配り、宣言した部品がそろっているかを確かめる。
 * どのデザインを使うかは製品が起動時に決めて渡す（利用者が選ぶ仕組みは持たない）。
 * 1.2：tone（色合い）と fontScale（文字の大きさの倍率）を渡すと、利用者が選んだ見え方にする（部品の形は変えない）。
 * scope="self" にすると、html ではなくこの部品の中だけにデザインを当てる（説明の画面で2つのデザインを並べるときなど）。
 */
import { computed, onBeforeUnmount, provide, ref, toRef, watch } from "vue";
import type { ArPaletteName } from "@s_and_a/arrow-ui-tokens";
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
    /** 色合い（デザインの tones の名前）。省くか "standard" なら標準の色。 */
    tone?: string;
    /** 文字の大きさの倍率（1 が標準）。部品の文字の大きさだけを変え、枠の形は変えない。 */
    fontScale?: number;
  }>(),
  { palette: "blue", requires: undefined, scope: "document", tone: undefined, fontScale: 1 },
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

/** 色合いの名前。デザインに無い名前は標準として扱う。 */
const toneName = computed(() => (props.tone && props.design.tones?.[props.tone] ? props.tone : undefined));
/** 文字の倍率。読めない値・極端な値は標準へ戻す。 */
const fontScaleValue = computed(() =>
  Number.isFinite(props.fontScale) && props.fontScale >= 0.75 && props.fontScale <= 1.5 ? props.fontScale : 1,
);

watch(
  [toneName, fontScaleValue, self],
  ([tone, scale, isSelf]) => {
    if (!hasDom || isSelf) return;
    const html = document.documentElement;
    if (tone) html.setAttribute("data-ar-tone", tone);
    else html.removeAttribute("data-ar-tone");
    if (scale === 1) html.style.removeProperty("--ar-font-scale");
    else html.style.setProperty("--ar-font-scale", String(scale));
  },
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
  if (hasDom && !self.value) {
    document.documentElement.removeAttribute("data-ar-tone");
    document.documentElement.style.removeProperty("--ar-font-scale");
  }
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
    :data-ar-tone="toneName"
    :style="fontScaleValue === 1 ? undefined : { '--ar-font-scale': String(fontScaleValue) }"
  >
    <slot />
    <div ref="portal" data-part="portal" />
  </div>
  <slot v-else />
</template>
