<!-- 選択肢の中に部品を置く | #label で名前の所に部品（札など）、#extra で選択肢の下に表や入力（type="radio" のとき）。extra はラジオの外なので、中の入力を押してもラジオは切り替わらない。checked で選んだ選択肢だけ出し分けられる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArRadioGroup, ArSelect, ArTag, ArTextInput } from "@s_and_a/arrow-ui";
const how = ref<string>("split");
const branch = ref<string | null>("shibuya");
const memo = ref("");
</script>

<template>
<div style="max-width: 560px">
  <ArRadioGroup
    v-model="how"
    direction="vertical"
    label="出力のしかた"
    :options="[{ value: 'zip', label: '店舗ごとに分けて ZIP で出す' }, { value: 'split', label: '1つの CSV にまとめる' }, { value: 'one', label: '1店舗だけ出す' }]"
  >
    <template #label="{ option }">
      {{ option.label }}<ArTag v-if="option.value === 'split'" size="sm" tone="accent" style="margin-left: 8px">おすすめ</ArTag>
    </template>
    <template #extra="{ option, checked }">
      <div v-if="option.value === 'split' && checked" style="font-size: 12px; line-height: 1.6">
        <ArTextInput v-model="memo" size="sm" placeholder="ファイル名の頭（任意）" label="ファイル名の頭" style="width: 240px" />
      </div>
      <div v-else-if="option.value === 'one' && checked">
        <ArSelect v-model="branch" size="sm" :options="[{ value: 'shibuya', label: '渋谷店' }, { value: 'shinjuku', label: '新宿店' }]" label="店舗" style="width: 180px" />
      </div>
    </template>
  </ArRadioGroup>
  <p style="margin: 8px 0 0; font-size: 12px">how：{{ how }} ／ branch：{{ branch }} ／ memo：{{ memo || "—" }}</p>
</div>
</template>
