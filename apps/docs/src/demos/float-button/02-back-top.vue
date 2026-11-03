<!-- 上へ戻る | back-top は visibility-height（既定 400px）より下へスクロールしたときだけ出て、押すとページの上へ戻る。ここではいつも見えるように -1 にしている。 -->
<script setup lang="ts">
import { ArFloatButton } from "@arrow/ui";
</script>

<template>
<ArFloatButton back-top :visibility-height="-1" />
</template>
