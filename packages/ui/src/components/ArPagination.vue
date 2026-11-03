<script setup lang="ts">
/**
 * ArPagination 1.0 — ページ送り。今のページはテーマ色。件数の選択はセレクト。表の下・右寄せに置く。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import ArSelect from "./ArSelect.vue";
import type { ArPaginationProps } from "./ArPagination.contract";

const props = withDefaults(defineProps<ArPaginationProps>(), {
  pageSize: 20,
  pageSizeOptions: () => [10, 20, 50, 100],
  showSizeChanger: false,
  showTotal: false,
  size: "md",
  disabled: false,
  hideOnSinglePage: false,
  labels: () => ({}),
});
const emit = defineEmits<{ "update:page": [page: number]; "update:pageSize": [size: number]; change: [page: number, pageSize: number] }>();
const L = computed(() => ({
  nav: props.labels.nav ?? "ページ送り",
  prev: props.labels.prev ?? "前のページ",
  next: props.labels.next ?? "次のページ",
  page: props.labels.page ?? ((n: number) => `${n}ページ`),
  perPage: props.labels.perPage ?? ((n: number) => `${n}件／ページ`),
  total: props.labels.total ?? ((n: number) => `全 ${n.toLocaleString("ja-JP")} 件`),
}));
const last = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const cur = computed(() => Math.min(Math.max(1, props.page), last.value));
/** 7ページまでは全部。それより多ければ 1 … 前後 … 最後。 */
const list = computed<(number | "prev-more" | "next-more")[]>(() => {
  const n = last.value;
  const c = cur.value;
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  if (c <= 4) return [1, 2, 3, 4, 5, "next-more", n];
  if (c >= n - 3) return [1, "prev-more", n - 4, n - 3, n - 2, n - 1, n];
  return [1, "prev-more", c - 1, c, c + 1, "next-more", n];
});
function go(p: number) {
  const v = Math.min(Math.max(1, p), last.value);
  if (props.disabled || v === cur.value) return;
  emit("update:page", v);
  emit("change", v, props.pageSize);
}
const sizeOptions = computed(() => props.pageSizeOptions.map((n) => ({ value: n, label: L.value.perPage(n) })));
function setSize(v: unknown) {
  const s = Number(v);
  if (!s || s === props.pageSize) return;
  const p = Math.min(cur.value, Math.max(1, Math.ceil(props.total / s)));
  emit("update:pageSize", s);
  if (p !== props.page) emit("update:page", p);
  emit("change", p, s);
}
</script>

<template>
  <nav
    v-if="!(hideOnSinglePage && last <= 1)"
    data-ar="pagination"
    data-part="root"
    :data-size="size"
    :data-state="disabled ? 'disabled' : undefined"
    :aria-label="L.nav"
  >
    <button type="button" data-part="prev" :disabled="disabled || cur <= 1" :aria-label="L.prev" :title="L.prev" @click="go(cur - 1)">
      <ArIcon name="cl" size="sm" />
    </button>
    <template v-for="p in list" :key="p">
      <span v-if="typeof p === 'string'" data-part="ellipsis" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        data-part="page"
        :data-state="p === cur ? 'selected' : undefined"
        :disabled="disabled"
        :aria-label="L.page(p)"
        :aria-current="p === cur ? 'page' : undefined"
        @click="go(p)"
      >{{ p }}</button>
    </template>
    <button type="button" data-part="next" :disabled="disabled || cur >= last" :aria-label="L.next" :title="L.next" @click="go(cur + 1)">
      <ArIcon name="cr" size="sm" />
    </button>
    <span v-if="showSizeChanger" data-part="size">
      <ArSelect :model-value="pageSize" :options="sizeOptions" size="sm" :disabled="disabled" label="1ページの件数" @update:model-value="setSize" />
    </span>
    <span v-if="showTotal" data-part="total">{{ L.total(total) }}</span>
  </nav>
</template>
