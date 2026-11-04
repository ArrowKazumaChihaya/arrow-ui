<!-- 切り詰め | 枠に入らない文字を「…」で切る。切れているときだけ、指を置く・Tab で止まると全文を吹き出しで出す。 -->
<script setup lang="ts">
import { ArEllipsis, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3">
  <div style="width: 160px; padding: 6px 8px; border: 1px dashed #ccd">
    <ArEllipsis text="ARROW事業部 東京営業所 渋谷第二店舗" />
  </div>
  <div style="width: 160px; padding: 6px 8px; border: 1px dashed #ccd">
    <ArEllipsis text="渋谷店" />
  </div>
  <div style="width: 220px; padding: 6px 8px; border: 1px dashed #ccd">
    <ArEllipsis :lines="2" placement="bottom">午後は通院のため早めに上がりたいです。夜は 19 時以降なら入れます。来週の水曜も同じです。</ArEllipsis>
  </div>
</ArStack>
</template>
