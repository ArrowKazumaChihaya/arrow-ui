<!-- 郵便番号 | 数字だけを受け付け、3桁のあとに「-」を入れる。7桁そろうと lookup（製品が渡す関数）で住所を引く。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArZipInput, ArTextInput, ArField, ArStack } from "@s_and_a/arrow-ui";
const zip = ref<string | null>("150-0041");
const address = ref("東京都渋谷区神南");
// 見本の住所の表（製品では郵便番号の API を呼ぶ）
const book: Record<string, string> = { "150-0041": "東京都渋谷区神南", "160-0022": "東京都新宿区新宿", "530-0001": "大阪府大阪市北区梅田" };
const lookup = (z: string) => new Promise<string | null>((ok) => setTimeout(() => ok(book[z] ?? null), 500));
const z2 = ref<string | null>(null);
</script>

<template>
<ArStack :gap="4">
  <ArField label="郵便番号" help="160-0022・530-0001 で住所が入ります" v-slot="p">
    <ArZipInput :id="p.id" v-model="zip" :lookup="lookup" @address="address = $event" />
  </ArField>
  <ArField label="住所" v-slot="p">
    <ArTextInput :id="p.id" v-model="address" style="width: 360px" />
  </ArField>
  <ArZipInput v-model="z2" label="住所を引かない郵便番号" />
  <ArZipInput model-value="999-9999" invalid label="間違い" />
  <ArZipInput model-value="150-0041" disabled label="使えない" />
</ArStack>
</template>
