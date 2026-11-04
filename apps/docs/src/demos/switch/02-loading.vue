<!-- 保存中 | 押したら保存まで行うので、保存中は loading（つまみの中で回る印、押せない）。横の文字はラベルとして親が出す。 -->
<script setup lang="ts">
import { ArSwitch, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const on = ref(false);
const saving = ref(false);
function change(v: boolean) {
  saving.value = true;
  setTimeout(() => {
    on.value = v;
    saving.value = false;
  }, 1200);
}
const rows = ref([
  { label: "カラーで印刷", on: true },
  { label: "休憩時間", on: false },
]);
</script>

<template>
<ArCluster :gap="6">
  <label class="row"><ArSwitch :model-value="on" :loading="saving" label="この日を公開する" @update:model-value="change" /><span class="demo-note">{{ saving ? "保存中" : on ? "公開中" : "非公開" }}</span></label>
  <ArSwitch :model-value="true" loading label="保存中" />
  <ArSwitch :model-value="false" loading label="保存中" />
  <ArSwitch :model-value="true" size="sm" loading label="保存中" />
  <div class="list">
    <label v-for="r in rows" :key="r.label" class="item">{{ r.label }}<ArSwitch v-model="r.on" :label="r.label" /></label>
  </div>
</ArCluster>
</template>

<style scoped>
.row { display: inline-flex; align-items: center; gap: 8px; }
.list { display: flex; flex-direction: column; gap: 8px; width: 300px; }
.item { display: flex; align-items: center; justify-content: space-between; font-size: 13.5px; }
</style>
