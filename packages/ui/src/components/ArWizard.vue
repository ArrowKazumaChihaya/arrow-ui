<script setup lang="ts">
import {computed, watch} from 'vue';
import ArSteps from './ArSteps.vue';
import ArButton from './ArButton.vue';
import type { ArWizardProps, ArWizardEmits } from './ArWizard.contract';
const props=withDefaults(defineProps<ArWizardProps>(), {disabled:false, scrollOnChange:true, labels:()=>({steps:'手順',prev:'戻る',next:'次へ'})});
const emit=defineEmits<ArWizardEmits>();
const current=computed(()=>props.options.findIndex(item=>item.value===props.value));
const option=computed(()=>{
  const selected=props.options[current.value];
  if (!selected) throw new TypeError('ArWizard requires an option matching value');
  return selected;
});
const items=computed(()=>props.options.map(item=>({title:item.label})));
watch(()=>props.value,()=>{if(props.scrollOnChange && typeof document!=='undefined') document.body.scrollTo?.({top:0});});
</script>
<template>
  <section data-ar="wizard" data-part="root">
    <div data-part="steps"><ArSteps :items="items" :current="current" :label="labels.steps" /></div>
    <p data-part="summary" aria-live="polite">{{current+1}} / {{options.length}} — {{option?.label}}</p>
    <div data-part="content"><slot /></div>
    <div v-if="!disabled && option" data-part="actions">
      <ArButton v-if="option.isPrev!==false" tone="secondary" size="lg" @click="emit('prev')">{{option.prevText ?? labels.prev}}</ArButton>
      <ArButton v-if="option.isNext!==false" tone="primary" size="lg" @click="emit('next')">{{option.nextText ?? labels.next}}</ArButton>
    </div>
  </section>
</template>
