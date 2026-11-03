<!-- アイコンだけのボタン | アイコンだけのボタンには必ず付ける。Tab で移るとすぐ出て、Escape で消える。説明は aria-describedby で読み上げる。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArTooltip } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="2" align="center">
  <ArTooltip title="変更"><ArButton tone="muted" icon="pen" label="変更" /></ArTooltip>
  <ArTooltip title="複製"><ArButton tone="muted" icon="layers" label="複製" /></ArTooltip>
  <ArTooltip title="印刷"><ArButton tone="muted" icon="print" label="印刷" /></ArTooltip>
  <ArTooltip title="削除（元に戻せません）"><ArButton tone="danger-ghost" icon="trash" label="削除" /></ArTooltip>
</ArCluster>
</template>
