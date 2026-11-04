<!-- ロック中・権限の帯 | neutral は操作できないことを知らせる灰の帯。見出しと小さな説明で、なぜか・どうすれば直せるかを書く。 -->
<script setup lang="ts">
import { ArAlert, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3">
  <ArAlert tone="neutral" title="この日のシフトは編集できません">勤怠ロックの期間です（10月15日までの勤怠が締められています。変更するには勤怠ページで締めを解除します）</ArAlert>
  <ArAlert tone="neutral" icon="info">シフトだけ編集できる権限です。出勤・退勤（打刻）は見るだけです。</ArAlert>
  <ArAlert tone="neutral">勤怠ロック中のため、この日は編集できません</ArAlert>
</ArStack>
</template>
