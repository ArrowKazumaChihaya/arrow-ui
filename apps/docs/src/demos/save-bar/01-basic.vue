<!-- 保存バー | 保存していない変更の件数と項目名、「変更を取り消す」「この内容で保存」。直すところがあれば件数とそこへ飛ぶボタン（error-count・jump）。 -->
<script setup lang="ts">
import { ArSaveBar, ArStack } from "@arrow/ui";
import { ref } from "vue";
const log = ref("—");
</script>

<template>
<ArStack :gap="4">
  <div style="width: 1084px; max-width: 100%">
    <ArSaveBar :count="3" :items="['シフトサマリー計算期間', 'シフト提出', 'シフト管理対象']" @save="log = '保存'" @discard="log = '取り消し'" />
  </div>
  <div style="width: 1084px; max-width: 100%">
    <ArSaveBar :count="2" :items="['法定外残業', '法定休日']" :error-count="2" @jump="log = '最初の間違いへ移る'" @save="log = '保存'" @discard="log = '取り消し'" />
  </div>
  <div style="width: 1084px; max-width: 100%">
    <ArSaveBar :count="1" :items="['勤怠丸め']" saving />
  </div>
</ArStack>
<p class="demo-note">押したもの：{{ log }}</p>
</template>
