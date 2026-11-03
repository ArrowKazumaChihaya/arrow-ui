<!-- 意味の色と飾り | type は意味の色。mark・code・kbd・del・underline・strong を組み合わせられる。 -->
<script setup lang="ts">
import { ArText, ArLink, ArParagraph } from "@arrow/ui";
</script>

<template>
<ArParagraph>本文 13.5px。<ArText type="secondary">secondary</ArText>・<ArText type="success">success</ArText>・<ArText type="warning">warning</ArText>・<ArText type="danger">danger</ArText>・<ArText type="disabled">disabled</ArText>・<ArText mark>mark</ArText>・<ArText code>code</ArText>・<ArText kbd>Enter</ArText>・<ArText del>del</ArText>・<ArText underline>underline</ArText>・<ArText strong>strong</ArText>・<ArLink href="#text">link</ArLink></ArParagraph>
</template>
