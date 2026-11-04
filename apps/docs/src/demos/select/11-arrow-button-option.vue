<!-- 今の ARROW の使い方：選択肢の中のボタン | 今の Select の button 付きの選択肢（BranchSelectorInner の「店舗を追加」・ShiftgroupSelector の「グループを追加」）は actions で出す。選択肢ではないので値にならず、押すと action（今の @click）。tone（add→primary）と width（今の style の width）を渡せる。↑↓ で選択肢の続きとしてボタンへ移り、Enter で押せる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArSelect } from "@s_and_a/arrow-ui";
const branch = ref<string | number | null>(0);
const group = ref<string | number | null>(null);
const log = ref("—");
</script>

<template>
<div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; min-height: 320px">
  <div>
    <small>店舗（width 130px のボタン）</small><br />
    <ArSelect
      v-model="branch"
      :options="[{ value: 0, label: '全店舗' }, { value: 1, label: '渋谷店' }, { value: 2, label: '新宿店' }, { value: 3, label: '池袋サンシャインシティ店' }]"
      :actions="[{ value: 'add_branch', label: '店舗を追加', icon: 'plus', width: 130 }]"
      label="店舗"
      style="width: 220px"
      @action="(v) => (log = `action：${v}`)"
    />
  </div>
  <div>
    <small>グループ（行いっぱい・未選択あり）</small><br />
    <ArSelect
      v-model="group"
      null-option
      placeholder="未選択"
      :options="[{ value: 0, label: 'すべてのグループ' }, { value: 5, label: 'キッチン' }, { value: 6, label: 'ホール' }]"
      :actions="[{ value: 'add_shiftgroup', label: 'グループを追加', icon: 'plus' }]"
      label="グループ"
      style="width: 200px"
      @action="(v) => (log = `action：${v}`)"
    />
  </div>
  <p style="flex-basis: 100%; margin: 0; font-size: 12px">店舗：{{ branch }} ／ グループ：{{ group ?? "未選択" }} ／ {{ log }}</p>
</div>
</template>
