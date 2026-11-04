<!-- パンくず | 区切りは「/」か「›」。今のページは太字。menu を渡した項目は cd のアイコンが付き、押すと同じ階層のほかの人・店舗へ移れる。 -->
<script setup lang="ts">
import { ArBreadcrumb, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const last = ref("");
</script>

<template>
<ArStack :gap="3">
  <ArBreadcrumb :items="[{ label: 'ホーム', icon: 'home', iconOnly: true, href: '#breadcrumb' }, { label: '設定', href: '#breadcrumb' }, { label: '店舗', href: '#breadcrumb' }, { label: '渋谷店' }]" />
  <ArBreadcrumb
    separator="›"
    :items="[{ label: '社員情報', href: '#breadcrumb' }, { label: '佐藤 美咲', menu: [{ key: 'sato', label: '佐藤 美咲' }, { key: 'nakaguchi', label: '中口 万由香' }, { key: 'matsuda', label: '松田 照恵' }] }, { label: '雇用契約' }]"
    @select="(_, k) => (last = k)"
  />
  <span v-if="last" style="font-size: 12.5px; color: #66727F">選んだ人：{{ last }}</span>
</ArStack>
</template>
