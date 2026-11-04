<script setup lang="ts">
/**
 * ArTransfer 1.0 — 左右の一覧の間で項目を移す（シフト募集の相手・権限の割り当て）。
 * 両方の一覧でチェックした項目を、間の ＞ ＜ で移す。見出しのチェックは「見えている分をすべて」。
 * 人数が多いときは表から選ぶ（Excel登録の従業員選択と同じ）方を優先する。
 */
import { computed, ref } from "vue";
import ArButton from "./ArButton.vue";
import ArCheckbox from "./ArCheckbox.vue";
import ArEmpty from "./ArEmpty.vue";
import ArIcon from "./ArIcon.vue";
import type { ArTransferProps, ArTransferValue, ArTransferItem } from "./ArTransfer.contract";

const props = withDefaults(defineProps<ArTransferProps>(), {
  titles: () => ["未選択", "選んだもの"] as const,
  unit: "",
  searchable: true,
  disabled: false,
  labels: () => ({ search: "探す", toRight: "右へ移す", toLeft: "左へ移す", empty: "ありません" }),
});
const emit = defineEmits<{ "update:modelValue": [value: ArTransferValue[]] }>();

const checked = ref<[Set<ArTransferValue>, Set<ArTransferValue>]>([new Set(), new Set()]);
const query = ref(["", ""]);
const norm = (s: string) => s.normalize("NFKC").toLowerCase();
const sides = computed(() => {
  const right = new Set(props.modelValue);
  const by = (side: 0 | 1) =>
    props.items.filter((it) => right.has(it.value) === (side === 1) && (!query.value[side] || norm(`${it.label} ${it.keywords ?? ""}`).includes(norm(query.value[side]!))));
  return [by(0), by(1)] as const;
});
const counts = computed(() => {
  const right = new Set(props.modelValue);
  const r = props.items.filter((it) => right.has(it.value)).length;
  return [props.items.length - r, r];
});
const movable = (side: 0 | 1) => sides.value[side].filter((it) => !it.disabled && checked.value[side].has(it.value));
const isOn = (side: 0 | 1, it: ArTransferItem) => checked.value[side].has(it.value);
function toggle(side: 0 | 1, it: ArTransferItem, on: boolean) {
  const s = new Set(checked.value[side]);
  if (on) s.add(it.value);
  else s.delete(it.value);
  checked.value[side] = s;
}
function headState(side: 0 | 1) {
  const list = sides.value[side].filter((it) => !it.disabled);
  const n = list.filter((it) => checked.value[side].has(it.value)).length;
  return { all: list.length > 0 && n === list.length, some: n > 0 && n < list.length, none: list.length === 0 };
}
function toggleAll(side: 0 | 1, on: boolean) {
  const s = new Set(checked.value[side]);
  for (const it of sides.value[side]) if (!it.disabled) on ? s.add(it.value) : s.delete(it.value);
  checked.value[side] = s;
}
function move(from: 0 | 1) {
  const items = movable(from).map((it) => it.value);
  const right = new Set(props.modelValue);
  for (const v of items) from === 0 ? right.add(v) : right.delete(v);
  checked.value[from] = new Set();
  emit("update:modelValue", props.items.map((it) => it.value).filter((v) => right.has(v)));
}
</script>

<template>
  <div data-ar="transfer" data-part="root" role="group" :aria-label="label" :data-state="disabled ? 'disabled' : undefined">
    <template v-for="side in ([0, 1] as const)" :key="side">
      <div data-part="list" :data-side="side === 0 ? 'left' : 'right'" role="group" :aria-label="titles[side]">
        <div data-part="head">
          <ArCheckbox
            :model-value="headState(side).all"
            :indeterminate="headState(side).some"
            :disabled="disabled || headState(side).none"
            :label="`${titles[side]}をすべて選ぶ`"
            @update:model-value="(on: boolean) => toggleAll(side, on)"
          />
          <span data-part="title">{{ titles[side] }}</span>
          <small data-part="count">{{ checked[side].size ? `${checked[side].size}/` : "" }}{{ counts[side] }}{{ unit }}</small>
        </div>
        <div data-part="body">
          <label v-if="searchable" data-part="search">
            <ArIcon line name="search" size="sm" />
            <input v-model="query[side]" type="search" :placeholder="labels.search" :aria-label="`${titles[side]}を${labels.search}`" :disabled="disabled" />
          </label>
          <div data-part="items" role="list">
            <div
              v-for="it in sides[side]"
              :key="String(it.value)"
              data-part="item"
              role="listitem"
              :data-state="[isOn(side, it) && 'checked', it.disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
            >
              <ArCheckbox :model-value="isOn(side, it)" :disabled="disabled || it.disabled" @update:model-value="(on: boolean) => toggle(side, it, on)">
                {{ it.label }}
              </ArCheckbox>
            </div>
            <ArEmpty v-if="!sides[side].length" data-part="empty" size="sm" icon="inbox" :text="labels.empty" />
          </div>
        </div>
      </div>
      <div v-if="side === 0" data-part="actions">
        <ArButton tone="primary" size="sm" icon="cr" :label="labels.toRight" :disabled="disabled || !movable(0).length" @click="move(0)" />
        <ArButton tone="secondary" size="sm" icon="cl" :label="labels.toLeft" :disabled="disabled || !movable(1).length" @click="move(1)" />
      </div>
    </template>
  </div>
</template>
