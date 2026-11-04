<!-- 形 | 右から出る板。幕は ink の42%、頭は白（アイコン＋題＋閉じる）、足は bg-2。contained で親の中に出せる。ARROW のシフト画面では日の詳細は横から出さない（配置を変えない）。 -->
<script setup lang="ts">
import { ArDrawer, ArButton, ArField, ArSelect, ArTextInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const open = ref(true);
const store = ref("shibuya");
const memo = ref("");
</script>

<template>
<div style="position: relative; height: 300px; border-radius: 12px; overflow: hidden; background: #EEF2F6">
  <div style="padding: 14px; font-size: 13px; color: #66727F">画面</div>
  <ArDrawer v-model:open="open" contained title="佐藤 美咲" icon="user" @close="open = true">
    <ArField label="所属" v-slot="f">
      <ArSelect v-model="store" :id="f.id" block :options="[{ value: 'shibuya', label: '渋谷店' }, { value: 'shinjuku', label: '新宿店' }]" />
    </ArField>
    <ArField label="メモ" v-slot="f"><ArTextInput v-model="memo" :id="f.id" block /></ArField>
    <template #footer>
      <ArButton>キャンセル</ArButton>
      <ArButton tone="primary">保存する</ArButton>
    </template>
  </ArDrawer>
</div>
</template>
