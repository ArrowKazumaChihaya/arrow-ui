<!-- しめきりまでの残り | target までの残りを1秒ごとに数える。残りが warnWithin（既定3日）より少ないと橙。0 になると finish。見た目は ArStatistic。 -->
<script setup lang="ts">
import { ArCountdown } from "@s_and_a/arrow-ui";
const soon = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 32 * 60 + 10) * 1000;
const later = Date.now() + 9 * 24 * 3600 * 1000;
</script>

<template>
<div style="display: flex; gap: 34px; flex-wrap: wrap">
  <ArCountdown title="提出のしめきりまで" :target="soon" />
  <ArCountdown title="給与の確定まで" :target="later" />
  <ArCountdown title="本日の締めまで" :target="Date.now() + 3 * 3600 * 1000" format="HH時間mm分" />
</div>
</template>
