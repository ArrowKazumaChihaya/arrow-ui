<!-- 多い店舗（30人以上） | search に数を渡すと、行がその数以上のときだけ従業員の検索の欄を出す（かな・社員番号は keywords で当てる）。maxHeight で表の高さを区切ると、見出しと名前の列は止まったまま中でスクロールする。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArShiftViewTable } from "@s_and_a/arrow-ui";
import { branches, crowdPeople, crowdShifts, halfDates, today } from "./_data";

const query = ref("");
</script>

<template>
  <ArShiftViewTable
    v-model:query="query"
    :dates="halfDates"
    :rows="crowdPeople"
    :shifts="crowdShifts"
    :branches="branches"
    :own-branch-ids="[1]"
    :today="today"
    :search="30"
    :max-height="460"
    :note="`ARROW事業部　${crowdPeople.length}名`"
  />
</template>
