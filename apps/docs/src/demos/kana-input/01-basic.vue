<!-- 氏名とフリガナ | 姓・名に分けて入れ、「姓 名」の1つの文字で受け渡す。フリガナはひらがなで打っても確定でカタカナに直る。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArKanaInput, ArField, ArStack } from "@arrow/ui";
const name = ref<string | null>("千速 一真");
const kana = ref<string | null>("チハヤ カズマ");
const name2 = ref<string | null>(null);
const kana2 = ref<string | null>(null);
</script>

<template>
<ArStack :gap="5">
  <ArField label="氏名" required v-slot="p">
    <ArKanaInput :id="p.id" v-model:name="name" v-model:kana="kana" label="氏名" />
  </ArField>
  <div style="font-size: 12px">name：{{ name ?? "null" }} ／ kana：{{ kana ?? "null" }}</div>
  <ArKanaInput v-model:name="name2" v-model:kana="kana2" label="新しい人の氏名" kana-invalid />
  <ArKanaInput :name="'末永 修也'" :kana="'スエナガ シュウヤ'" disabled label="使えない" />
  <ArKanaInput :name="'新里 匠'" :show-kana="false" label="フリガナなし" />
</ArStack>
</template>
