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
const nextLabel=computed(()=>{
  if(option.value.nextText !== undefined) return option.value.nextText;
  const destination=props.nextValue === undefined
    ? props.options[current.value+1]
    : props.options.find(item=>item.value===props.nextValue);
  return destination && props.labels.nextStep
    ? props.labels.nextStep.replace('{step}', destination.label)
    : props.labels.next;
});
watch(()=>props.value,()=>{
 if(props.scrollOnChange && typeof document!=='undefined')
  (document.scrollingElement ?? document.documentElement).scrollTo?.({top:0});
},{flush:'post'});
</script>
<template>
  <section data-ar="wizard" data-part="root">
    <div data-part="steps"><ArSteps :items="items" :current="current" :label="labels.steps" size="mini" /></div>
    <p data-part="summary" aria-live="polite">{{current+1}} / {{options.length}} — {{option?.label}}</p>
    <div data-part="content"><slot /></div>
    <div v-if="!disabled && option" data-part="actions">
      <ArButton v-if="option.isPrev!==false" tone="secondary" size="lg" @click="emit('prev')">{{option.prevText ?? labels.prev}}</ArButton>
      <ArButton v-if="option.isNext!==false" tone="primary" size="lg" @click="emit('next')">{{nextLabel}}</ArButton>
    </div>
  </section>
</template>
