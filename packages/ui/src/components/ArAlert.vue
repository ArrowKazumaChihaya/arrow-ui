<script setup lang="ts">
/** ArAlert 1.0 — 画面の中のお知らせ。間違いは danger、注意は warn、終わったことは ok、案内は info。 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArAlertProps } from "./ArAlert.contract";

const props = withDefaults(defineProps<ArAlertProps>(), { tone: "info", title: undefined, closable: false, closeLabel: "閉じる" });
const emit = defineEmits<{ close: [] }>();
const icon = computed<ArIconName>(() => ({ info: "info", ok: "check", warn: "alert", danger: "alert" } as const)[props.tone]);
</script>

<template>
  <div data-ar="alert" data-part="root" :data-tone="tone" :role="tone === 'danger' || tone === 'warn' ? 'alert' : 'status'">
    <ArIcon :name="icon" data-part="icon" />
    <div data-part="content">
      <strong v-if="title" data-part="title">{{ title }}</strong>
      <div data-part="body"><slot /></div>
    </div>
    <button v-if="closable" type="button" data-part="close" :aria-label="closeLabel" @click="emit('close')">
      <ArIcon name="x" size="sm" />
    </button>
  </div>
</template>
