<script setup lang="ts">
import ArIcon from "./ArIcon.vue";
import type { ArAuthPanelProps } from "./ArAuthPanel.contract";
withDefaults(defineProps<ArAuthPanelProps>(), { logoAlt: "ARROW", companyCodeLabel: "会社ID", icon: "lock" });
</script>
<template>
  <section data-ar="auth-panel" data-part="root">
    <img v-if="logo" data-part="logo" :src="logo" :alt="logoAlt" />
    <div data-part="card">
      <h1 data-part="heading"><ArIcon :name="icon" size="sm" />{{ title }}</h1>
      <div data-part="body">
        <div v-if="companyName || companyCode" data-part="company">
          <span data-part="initial" aria-hidden="true"
            ><ArIcon v-if="companyIcon" :name="companyIcon" size="sm" /><template v-else>{{
              companyName?.slice(0, 1)
            }}</template></span
          >
          <div>
            <div data-part="company-name">{{ companyName }}</div>
            <div v-if="companyCode" data-part="company-code">{{ companyCodeLabel }}：{{ companyCode }}</div>
          </div>
        </div>
        <slot />
      </div>
    </div>
    <div v-if="$slots.footer" data-part="footer"><slot name="footer" /></div>
  </section>
</template>
