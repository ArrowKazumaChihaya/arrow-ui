<script setup lang="ts">
/**
 * ArMapPreview 1.0 — 地図の見本（ピンと打刻範囲の円）。会社情報の店舗の GPS。
 * 地図そのものは製品が default slot で渡す。無ければ見本の地の絵（道と区画）。読み上げは「{住所} を中心に半径{r}メートルの打刻範囲を表す地図」。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArMapPreviewLabels, ArMapPreviewProps } from "./ArMapPreview.contract";

const props = withDefaults(defineProps<ArMapPreviewProps>(), {
  radius: null,
  radiusPx: undefined,
  restriction: "strict",
  latitude: null,
  longitude: null,
  address: undefined,
  caption: undefined,
  source: "地図（Google マップ）",
  width: "560px",
  height: "250px",
  labels: () => ({}),
});
defineSlots<{ default?: () => unknown }>();
const L = computed<ArMapPreviewLabels>(() => ({
  caption: "半径 {r}m の打刻範囲",
  captionEmpty: "打刻範囲を入れると円が出ます",
  aria: "{place} を中心に半径{r}メートルの打刻範囲を表す地図",
  ariaNoRange: "{place} の位置を表す地図",
  place: "住所",
  ...props.labels,
}));
const r = computed(() => Number(props.radius) || 0);
const ok = computed(() => r.value >= 10 && r.value <= 9999);
const showRange = computed(() => ok.value && props.restriction !== "none");
/** キャンバスと同じ見本の大きさ：40 + log10(r)×62（56〜210px）。 */
const size = computed(() => props.radiusPx ?? Math.round(Math.min(210, Math.max(56, 40 + Math.log10(Math.max(r.value, 10)) * 62))));
const cap = computed(() => props.caption ?? (ok.value ? L.value.caption.replace("{r}", String(r.value)) : L.value.captionEmpty));
const place = computed(() => props.address || (props.latitude != null && props.longitude != null ? `${props.latitude}, ${props.longitude}` : L.value.place));
const aria = computed(() => (showRange.value ? L.value.aria.replace("{r}", String(r.value)) : L.value.ariaNoRange).replace("{place}", place.value));
const title = computed(() => (props.latitude != null && props.longitude != null ? `${props.latitude}, ${props.longitude}` : undefined));
</script>

<template>
  <div
    data-ar="map-preview"
    data-part="root"
    :data-restriction="restriction"
    role="img"
    :aria-label="aria"
    :title="title"
    :style="{ width, height }"
  >
    <div data-part="map">
      <slot>
        <div data-part="sample" aria-hidden="true">
          <span data-part="block" data-kind="park" />
          <span data-part="block" data-kind="building" />
          <span data-part="road" data-kind="1" />
          <span data-part="road" data-kind="2" />
          <span data-part="road" data-kind="3" />
          <span data-part="road" data-kind="4" />
        </div>
      </slot>
    </div>
    <span v-if="showRange" data-part="range" aria-hidden="true" :style="{ width: `${size}px`, height: `${size}px` }" />
    <ArIcon line name="pin" data-part="pin" />
    <span v-if="cap" data-part="caption" aria-hidden="true">{{ cap }}</span>
    <span v-if="source" data-part="source" aria-hidden="true">{{ source }}</span>
  </div>
</template>
