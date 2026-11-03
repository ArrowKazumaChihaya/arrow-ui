<script setup lang="ts">
/**
 * ArLayout 1.0 — 画面の枠。ヘッダー・横のメニュー（Sider）・中身・フッター。
 * ヘッダーの下にテーマ色の線、Sider の地は淡い灰、中身の地は bg（まとまりは白いカードを置く）。
 */
import { computed } from "vue";
import type { ArLayoutProps } from "./ArLayout.contract";

const props = withDefaults(defineProps<ArLayoutProps>(), { siderWidth: 200, siderPlacement: "start", bordered: false, fill: false });
const style = computed(() => ({ "--ar-layout-sider": `${props.siderWidth}px` }));
</script>

<template>
  <div
    data-ar="layout"
    data-part="root"
    :data-has-sider="$slots.sider ? siderPlacement : undefined"
    :data-has-header="$slots.header ? '' : undefined"
    :data-has-footer="$slots.footer ? '' : undefined"
    :data-bordered="bordered || undefined"
    :data-fill="fill || undefined"
    :style="style"
  >
    <header v-if="$slots.header" data-part="header"><slot name="header" /></header>
    <aside v-if="$slots.sider" data-part="sider"><slot name="sider" /></aside>
    <main data-part="content"><slot /></main>
    <footer v-if="$slots.footer" data-part="footer"><slot name="footer" /></footer>
  </div>
</template>
