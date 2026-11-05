<script setup lang="ts">
/**
 * ArApprovalFlow 1.2 — 承認の流れ。済み・あなたの番・まだ・停滞・差し戻し・飛ばしたを段ごとに。
 * row は横の札を › でつなぎ（設定の承認フロー）、list は番号の丸と状態の札の縦の一覧（勤怠・社員情報の承認）。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import { useDesignForm } from "../provider/context";
import type { ArApprovalFlowLabels, ArApprovalFlowProps, ArApprovalStep } from "./ArApprovalFlow.contract";

const props = withDefaults(defineProps<ArApprovalFlowProps>(), {
  layout: "list",
  start: undefined,
  startIcon: "note",
  labels: () => ({}),
});
defineSlots<{ step?(p: { step: ArApprovalStep; index: number }): unknown; details?(p: { step: ArApprovalStep; index: number }): unknown; append?(): unknown }>();
/** 形（ArDesign.forms.ArApprovalFlow.list）：row なら list も横の札で出す。 */
const listForm = useDesignForm<"list" | "row">("ArApprovalFlow", "list", "list");
const form = computed(() => (props.layout === "list" && listForm.value === "row" ? "row" : props.layout));
const L = computed<ArApprovalFlowLabels>(() => ({
  done: "承認済",
  current: "あなたの番",
  todo: "まだ",
  denied: "差し戻し",
  skipped: "スキップ",
  blocked: "承認者の確認待ち",
  flow: "承認の流れ",
  ...props.labels,
}));
const statusOf = (s: ArApprovalStep) => s.status ?? L.value[s.state];
const keyOf = (s: ArApprovalStep, i: number) => s.key ?? i;
</script>

<template>
  <ol data-ar="approval-flow" data-part="root" :data-layout="form" :data-detailed="$slots.details ? '' : undefined" :aria-label="L.flow">
    <li v-if="start" data-part="item" data-state="start">
      <span data-part="start"><ArIcon line :name="startIcon" size="sm" />{{ start }}</span>
    </li>
    <li v-for="(s, i) in steps" :key="keyOf(s, i)" data-part="item" :data-state="s.state" :aria-current="s.state === 'current' ? 'step' : undefined">
      <span v-if="start || i > 0" data-part="sep" aria-hidden="true"><ArIcon line name="cr" size="sm" /></span>
      <span data-part="mark" :data-state="s.state" aria-hidden="true"><template v-if="s.state === 'done'">✓</template><template v-else-if="s.state === 'denied'">×</template><template v-else-if="s.state === 'blocked'">!</template><template v-else>{{ i + 1 }}</template></span>
      <slot name="step" :step="s" :index="i">
        <div data-part="step" :data-state="s.state">
          <div data-part="body">
            <span data-part="title"><ArIcon v-if="s.state === 'done'" line name="check" size="sm" />{{ s.title }}</span>
            <span v-if="s.who" data-part="who">{{ s.who }}</span>
          </div>
          <span v-if="statusOf(s)" data-part="status" :data-state="s.state">{{ statusOf(s) }}</span>
          <div v-if="$slots.details" data-part="details"><slot name="details" :step="s" :index="i" /></div>
        </div>
      </slot>
    </li>
    <li v-if="$slots.append" data-part="item" data-state="append">
      <span data-part="sep" aria-hidden="true"><ArIcon line name="cr" size="sm" /></span>
      <span data-part="append"><slot name="append" /></span>
    </li>
  </ol>
</template>
