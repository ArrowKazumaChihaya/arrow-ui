<script setup lang="ts">
import { computed } from "vue";
import { highlight } from "./highlight";
const props = defineProps<{ code: string; file?: string }>();
const html = computed(() => highlight(props.code.trim()));
</script>

<template>
  <figure class="codeblock">
    <figcaption v-if="file">{{ file }}</figcaption>
    <pre class="code"><code v-html="html" /></pre>
  </figure>
</template>
