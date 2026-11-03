<script setup lang="ts">
/**
 * ArThemeScope 1.0
 * 中の部品のテーマ色（accent 系）を、指定した組に切り替える。
 * どのページにどの組を当てるかは製品のレイアウト層が決める。
 */
import type { ArPaletteName } from "@arrow/ui-tokens";

withDefaults(defineProps<{ palette: ArPaletteName; as?: string }>(), { as: "div" });
</script>

<template>
  <component :is="as" data-ar="theme-scope" :data-ar-palette="palette"><slot /></component>
</template>
