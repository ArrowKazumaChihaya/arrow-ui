<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import ArMenu from './ArMenu.vue';
import ArSelect from './ArSelect.vue';
import type { ArSelectValue, ArSelectOption } from './ArSelect.contract';
import type { ArMenuItem } from './ArMenu.contract';
import type { ArSectionMenuProps, ArSectionMenuEmits } from './ArSectionMenu.contract';
const props=withDefaults(defineProps<ArSectionMenuProps>(),{label:'項目',scroll:false,scrollOffset:50});
const emit=defineEmits<ArSectionMenuEmits>();
const position=ref<string>();
const selected=computed(()=>props.scroll ? position.value : props.value);
const options=computed(()=>{
 const result:ArSelectOption[]=[];
 const visit=(items:readonly ArMenuItem[],prefix='')=>{for(const item of items){if(item.type==='divider')continue; if(item.children?.length)visit(item.children,`${prefix}${item.label} > `);else result.push({value:item.key,label:prefix+item.label,disabled:item.disabled});}};
 visit(props.items);return result;
});
function select(key:ArSelectValue | ArSelectValue[] | null){
 if(typeof key!=='string')return;
 if(props.scroll){document.getElementById(key)?.scrollIntoView({behavior:'smooth',block:'start'});position.value=key;}
 else emit('update:value',key);
}
let opened:string[]=[];
function onOpen(keys:string[]){const key=keys.find(k=>!opened.includes(k));opened=keys; if(key){const item=props.items.find(i=>i.type!=='divider' && i.key===key);if(item && item.type!=='divider')select(item.children?.find(i=>i.type!=='divider')?.key ?? null);}}
function updatePosition(){
 if(!props.scroll)return;
 let nearest:string|undefined;let distance=Infinity;
 for(const item of options.value){const section=document.getElementById(String(item.value));if(!section)continue;const next=Math.abs(section.getBoundingClientRect().top-props.scrollOffset);if(next<distance){distance=next;nearest=String(item.value);}}
 position.value=nearest;
}
onMounted(()=>{updatePosition();document.addEventListener('scroll',updatePosition,true);});
onBeforeUnmount(()=>document.removeEventListener('scroll',updatePosition,true));
</script>
<template>
 <div data-ar="section-menu" data-part="root">
  <nav data-part="navigation" :aria-label="label" :data-sticky="scroll || undefined">
   <div data-part="desktop"><ArMenu mode="inline" :items="items" :selected="selected" :label="label" @select="select" @update:open-keys="onOpen" /></div>
   <div data-part="mobile"><ArSelect :model-value="selected ?? null" :options="options" :label="label" @update:model-value="select" /></div>
  </nav>
  <div data-part="content"><slot /></div>
 </div>
</template>
