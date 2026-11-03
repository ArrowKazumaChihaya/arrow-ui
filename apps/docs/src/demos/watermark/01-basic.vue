<!-- 透かし | 給与・書類の画面に。中身の上に、うすい文字を斜めに並べる（押す操作は下に通る）。配列で行を重ねられる。 -->
<script setup lang="ts">
import { ArWatermark } from "@arrow/ui";
</script>

<template>
<ArWatermark content="ARROW 社外秘" style="border-radius: 12px; box-shadow: inset 0 0 0 1px #E6EBF0; background: #fff">
  <div style="padding: 16px; font-size: 13px; line-height: 1.7; color: #4A5562">
    <b style="color: #1F2933">給与明細 2026年10月</b><br />支給額 ¥248,300 ／ 控除額 ¥41,820<br />差引支給額 ¥206,480
  </div>
</ArWatermark>
</template>
