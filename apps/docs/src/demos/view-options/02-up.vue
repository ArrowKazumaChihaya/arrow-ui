<!-- 表の下に置く（上に開く） | 表の #below に置くときは placement="top-start"。見出しのないまとまりも使える。 -->
<script setup lang="ts">
import { ArViewOptions } from "@arrow/ui";
import { ref } from "vue";
const shown = ref(["av", "time", "note"]);
</script>

<template>
<div style="padding-top: 300px">
  <ArViewOptions
    v-model="shown"
    placement="top-start"
    title="勤務可能な人の表に出すもの"
    :groups="[{ options: [
      { key: 'av', label: 'サムネ', description: '頭文字の丸（写真があれば写真）', sample: { text: '千', background: '#E3EEFA', color: '#1F5F99' } },
      { key: 'code', label: '社員コード', description: '名前の上に小さく', sample: { text: 'S1001', background: '#F3F6F9', color: '#7B8794' } },
      { key: 'time', label: '希望の時間', description: '開始と終了' },
      { key: 'note', label: '備考', description: '従業員が書いたひとこと' },
    ] }]"
  />
  <ArViewOptions v-model="shown" disabled :groups="[{ options: [{ key: 'av', label: 'サムネ' }] }]" style="margin-left: 12px" />
</div>
</template>
