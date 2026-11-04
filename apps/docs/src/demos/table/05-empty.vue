<!-- 行がないとき | emptyText に次の一手を書く。emptyIcon で線のアイコン。#empty で中身を差し替えられる。 -->
<script setup lang="ts">
import { ArTable } from "@s_and_a/arrow-ui";
const columns = [{ key: "name", title: "名前" }, { key: "start", title: "開始" }, { key: "end", title: "終了" }, { key: "note", title: "備考" }];
</script>

<template>
<div style="display: grid; gap: 20px">
  <ArTable :columns="columns" :rows="[]" row-key="name" caption="勤務メンバー" empty-text="この日のシフトはまだありません。上の「シフト追加」から登録できます" />
  <ArTable :columns="columns" :rows="[]" row-key="name" caption="勤務可能な人" variant="board" empty-icon="inbox" empty-text="この日に出勤できると出している人はいません" />
</div>
</template>
