<!-- 大きさと状態 | size="sm" はスマホ（四角54）。件数が100以上なら「99+」。href を渡すとリンク、disabled は押せない（未契約の機能など）。 -->
<script setup lang="ts">
import { ArMenuTile } from "@arrow/ui";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start">
    <div style="display: grid; grid-template-columns: repeat(4, 84px); gap: 6px 4px">
      <ArMenuTile size="sm" label="シフト" icon="cal" palette="blue" />
      <ArMenuTile size="sm" label="勤怠" icon="brief" palette="green" :count="12" />
      <ArMenuTile size="sm" label="給与" icon="calc" palette="yellow" />
      <ArMenuTile size="sm" label="社員一覧" icon="users" palette="teal" :count="128" />
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 84px); gap: 6px 4px">
      <ArMenuTile size="sm" variant="plain" label="シフト" icon="cal" palette="blue" />
      <ArMenuTile size="sm" variant="plain" label="GPS打刻" icon="pin" palette="green" />
      <ArMenuTile size="sm" variant="plain" label="勤怠" icon="brief" palette="green" :count="2" note="エラー 2日" />
      <ArMenuTile size="sm" variant="plain" label="お知らせ" icon="speaker" palette="orange" :count="2" note="新着 2" />
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 110px); gap: 10px 8px">
      <ArMenuTile label="マイページ" icon="switch-user" palette="teal" href="#menu-tile" />
      <ArMenuTile label="経費精算" icon="yen" palette="teal" disabled />
      <ArMenuTile label="ご利用ガイド" icon="help" palette="teal" />
    </div>
  </div>
</template>
