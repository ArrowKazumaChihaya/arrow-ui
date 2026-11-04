<!-- まとまりの見出し | 四角い箱のアイコン・見出し・件数の札。#actions に見出しの横の操作（ArButton subtle）、#end に右端のもの（ArField layout="toolbar" ＋ ArSegmented）。collapsible なら見出しを押して下を開け閉めできる。 -->
<script setup lang="ts">
import { ArButton, ArField, ArSectionHead, ArSegmented, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const mode = ref("time");
const open = ref(true);
</script>

<template>
<ArStack :gap="5" style="max-width: 780px">
  <ArSectionHead title="勤務メンバー" icon="users" count="4名">
    <template #actions><ArButton tone="subtle" icon="calc">日毎人件費</ArButton></template>
    <template #end>
      <ArField label="表示モード" layout="toolbar">
        <ArSegmented v-model="mode" label="表示モード" :options="[{ value: 'time', label: '時間帯' }, { value: 'note', label: '備考', count: 2 }, { value: 'chart', label: 'チャート' }]" />
      </ArField>
    </template>
  </ArSectionHead>
  <div>
    <ArSectionHead v-model:open="open" title="勤務可能な人" icon="inbox" count="2名" collapsible controls="sh-demo-avail" />
    <p v-show="open" id="sh-demo-avail" style="margin: 12px 0 0; font-size: 13px">（ここに勤務可能な人の表）</p>
  </div>
  <ArSectionHead title="イベント" icon="note" count="0件">
    <template #actions><ArButton tone="subtle" icon="repeat">繰り返しイベント</ArButton></template>
  </ArSectionHead>
  <ArSectionHead title="アイコンも件数もない見出し" />
</ArStack>
</template>
