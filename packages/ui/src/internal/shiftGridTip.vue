<script setup lang="ts">
/**
 * ArShiftGrid の吹き出し（ライブラリの中だけ）。マスは数百あるので、吹き出しは1つだけ持ち、乗せたマスへ動かす。
 * 表の本体と別の部品にして、吹き出しが動いても表を描き直さない。
 */
import { ref, shallowRef } from "vue";
import ArFloat from "./ArFloat.vue";
import type { TipRow } from "./shiftGrid";

const props = defineProps<{ form: string }>();
const anchor = shallowRef<HTMLElement | null>(null);
const rows = ref<TipRow[]>([]);
const below = ref(false);

function show(el: HTMLElement, r: TipRow[], placeBelow = false) {
  anchor.value = el;
  rows.value = r;
  below.value = placeBelow;
}
function hide() {
  anchor.value = null;
}
defineExpose({ show, hide, anchor });
</script>

<template>
  <ArFloat
    :open="!!anchor && rows.length > 0"
    :anchor="anchor"
    :placement="below ? 'bottom-start' : 'top-start'"
    :offset="4"
    :close-on-outside="false"
    ar="shift-grid-tip"
    role="tooltip"
    @close="hide"
  >
    <div v-for="(r, i) in rows" :key="i" data-part="tip-row" :data-head="r.label ? undefined : ''" :data-form="props.form">
      <span v-if="r.label" data-part="tip-label">{{ r.label }}</span>
      <template v-if="props.form === 'section' && r.label">
        <span v-for="(v, j) in r.values" :key="j" data-part="tip-value">{{ v }}</span>
      </template>
      <span v-else data-part="tip-value">{{ r.values.join("、") }}</span>
    </div>
  </ArFloat>
</template>
