<script setup lang="ts">
/**
 * ArPunchButton 1.0 — 打刻の大きいボタン（出勤・退勤・休憩開始・休憩終了）。
 * 押せないときは灰色にして、下に理由（今の状態）を書く。押すと punch を出す（確認・記録は使う側）。
 */
import { computed } from "vue";
import { useDesignForm, useId } from "../provider/context";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArPunchButtonProps } from "./ArPunchButton.contract";

const props = withDefaults(defineProps<ArPunchButtonProps>(), {
  label: undefined,
  icon: undefined,
  palette: undefined,
  size: undefined,
  disabled: false,
  reason: undefined,
  loading: false,
});
const emit = defineEmits<{ punch: [kind: ArPunchButtonProps["kind"]] }>();
const iconForm = useDesignForm<"line" | "punch">("ArPunchButton", "icons", "line");
const id = useId("ar-punch");

const names = { in: "出勤", out: "退勤", "break-in": "休憩開始", "break-out": "休憩終了" } as const;
const lineIcons: Record<ArPunchButtonProps["kind"], ArIconName> = { in: "walk", out: "out", "break-in": "coffee", "break-out": "check" };
const punchIcons: Partial<Record<ArPunchButtonProps["kind"], ArIconName>> = { in: "punchin", out: "punchout" };

const isBreak = computed(() => props.kind === "break-in" || props.kind === "break-out");
const iconName = computed<ArIconName | undefined>(() => props.icon ?? (iconForm.value === "punch" ? punchIcons[props.kind] : lineIcons[props.kind]));
const pal = computed(() => props.palette ?? (props.kind === "in" || props.kind === "break-in" ? "blue" : "green"));
const sz = computed(() => props.size ?? (isBreak.value ? "sm" : "lg"));
const off = computed(() => props.disabled || props.loading);
const state = computed(() => [props.disabled && "disabled", props.loading && "loading"].filter(Boolean).join(" ") || undefined);

function onClick() {
  if (!off.value) emit("punch", props.kind);
}
</script>

<template>
  <div data-ar="punch-button" data-part="root" :data-kind="kind" :data-size="sz" :data-state="state" :data-ar-palette="pal">
    <button
      type="button"
      data-part="button"
      :disabled="off"
      :aria-busy="loading ? 'true' : undefined"
      :aria-describedby="reason ? `${id}-reason` : undefined"
      @click="onClick"
    >
      <ArIcon v-if="iconName" :name="iconName" data-part="icon" />
      <span data-part="label">{{ label ?? names[kind] }}</span>
    </button>
    <p v-if="reason" :id="`${id}-reason`" data-part="reason">{{ reason }}</p>
  </div>
</template>
