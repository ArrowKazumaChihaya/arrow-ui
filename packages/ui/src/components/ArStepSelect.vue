<script setup lang="ts">
/**
 * ArStepSelect 1.0 — 段階式の選択。上から段の箱を並べ、間に「下へ進む」矢印。済みの段は丸にチェック、今の段は枠を強める、次の段は番号。
 * 上の道しるべの札（「種類 給与関連 › 書類 給与明細書 › …」）を押すとその段へ戻る（jump を出し、箱へスクロールしてフォーカス）。
 */
import { computed, ref } from "vue";
import { useId } from "../provider/context";
import ArIcon from "./ArIcon.vue";
import type { ArStepSelectProps, ArStepSelectStep } from "./ArStepSelect.contract";

const props = withDefaults(defineProps<ArStepSelectProps>(), { crumbs: true, connectors: true, labels: () => ({}) });
const emit = defineEmits<{ jump: [key: string] }>();
const id = useId("ar-steps");
const boxes = ref<Record<string, HTMLElement | null>>({});

const items = computed(() => {
  const firstTodo = props.steps.findIndex((s) => !(s.status ? s.status === "done" : s.done));
  return props.steps.map((s, i) => ({
    ...s,
    no: i + 1,
    st: (s.status ?? (s.done ? "done" : i === firstTodo && props.steps.length > 1 ? "current" : "next")) as "done" | "current" | "next",
  }));
});
const crumbItems = computed(() => items.value.filter((s) => s.crumbValue !== undefined && s.crumbValue !== ""));
const showCrumbs = computed(() => props.crumbs && crumbItems.value.length > 1);

function jump(s: ArStepSelectStep) {
  emit("jump", s.key);
  const el = boxes.value[s.key];
  if (el) {
    el.scrollIntoView?.({ block: "start", behavior: "smooth" });
    el.focus({ preventScroll: true });
  }
}
</script>

<template>
  <div data-ar="step-select" data-part="root">
    <nav v-if="showCrumbs" data-part="crumbs" :aria-label="labels.crumbs ?? '選んだもの'">
      <template v-for="(c, i) in crumbItems" :key="c.key">
        <ArIcon v-if="i > 0" name="cr" line data-part="separator" />
        <button
          type="button"
          data-part="crumb"
          :data-state="i === crumbItems.length - 1 ? 'now' : undefined"
          :aria-current="i === crumbItems.length - 1 ? 'step' : undefined"
          :title="`${c.crumbLabel ?? ''}：${c.crumbValue}`"
          @click="jump(c)"
        >
          <small v-if="c.crumbLabel" data-part="crumb-label">{{ c.crumbLabel }}</small>{{ c.crumbValue }}
        </button>
      </template>
    </nav>
    <template v-for="(s, i) in items" :key="s.key">
      <div v-if="connectors && i > 0" data-part="connector" aria-hidden="true"><ArIcon name="cd" line /><ArIcon name="cd" line /><ArIcon name="chevrons" /></div>
      <section
        :ref="(el) => (boxes[s.key] = el as HTMLElement | null)"
        data-part="step"
        :data-state="s.st"
        :aria-labelledby="`${id}-${s.key}`"
        :aria-current="s.st === 'current' ? 'step' : undefined"
        tabindex="-1"
      >
        <div data-part="head">
          <span data-part="marker" :aria-label="s.st === 'done' ? (labels.done ?? '済み') : s.st === 'current' ? (labels.current ?? '今の段') : undefined" role="img">
            <ArIcon v-if="s.st === 'done'" name="check" line />
            <template v-else>{{ s.no }}</template>
          </span>
          <h3 :id="`${id}-${s.key}`" data-part="title">{{ s.title }}</h3>
          <span v-if="s.count" data-part="count">{{ s.count }}</span>
          <div v-if="$slots[`extra-${s.key}`]" data-part="extra"><slot :name="`extra-${s.key}`" /></div>
        </div>
        <div v-if="$slots[`step-${s.key}`]" data-part="body"><slot :name="`step-${s.key}`" /></div>
      </section>
    </template>
  </div>
</template>
