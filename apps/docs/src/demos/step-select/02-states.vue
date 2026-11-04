<!-- 済み・今・次 | status で段の状態を決めて渡すこともできる。道しるべを出さないときは :crumbs="false"、矢印を出さないときは :connectors="false"。 -->
<script setup lang="ts">
import { ArStepSelect, ArThemeScope } from "@s_and_a/arrow-ui";
</script>

<template>
  <ArThemeScope palette="pink">
    <div style="max-width: 640px">
      <ArStepSelect
        :steps="[
          { key: 'a', title: '集計したい内容を選択してください', status: 'done' },
          { key: 'b', title: '対象年月を選択してください', status: 'current' },
          { key: 'c', title: '対象部署/店舗を選択してください(複数選択可)', status: 'next', count: '2店舗' },
        ]"
      />
    </div>
  </ArThemeScope>
</template>
