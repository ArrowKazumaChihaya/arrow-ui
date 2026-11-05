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
function flattenItems(items:readonly ArMenuItem[],prefix='',ancestorDisabled=false):ArSelectOption[]{
 const result:ArSelectOption[]=[];
 for(const item of items){
  if(item.type==='divider')continue;
  const disabled=ancestorDisabled || !!item.disabled || !!item.locked;
  if(item.children?.length)result.push(...flattenItems(item.children,`${prefix}${item.label} > `,disabled));
  else result.push({value:item.key,label:prefix+item.label,disabled,icon:item.locked?'lock':item.icon});
 }
 return result;
}
const options=computed(()=>flattenItems(props.items));
function select(key:ArSelectValue | ArSelectValue[] | null){
 if(typeof key!=='string')return;
 const option=options.value.find(item=>item.value===key);
 if(!option || option.disabled)return;
 if(props.scroll){document.getElementById(key)?.scrollIntoView({behavior:'smooth',block:'start'});position.value=key;}
 else emit('update:value',key);
}
let opened:string[]=[];
function onOpen(keys:string[]){
 const key=keys.find(k=>!opened.includes(k));opened=keys;
 if(!key)return;
 const item=props.items.find(i=>i.type!=='divider' && i.key===key);
 if(!item || item.type==='divider' || item.disabled || item.locked)return;
 const candidate=flattenItems(item.children ?? [item]).find(option=>!option.disabled);
 select(candidate?.value ?? null);
}
function updatePosition(){
 if(!props.scroll)return;
 let current:string|undefined;let currentTop=-Infinity;
 let upcoming:string|undefined;let upcomingTop=Infinity;
 for(const item of options.value){
  const section=document.getElementById(String(item.value));if(!section)continue;
  const top=section.getBoundingClientRect().top;
  if(top<=props.scrollOffset && top>currentTop){currentTop=top;current=String(item.value);}
  else if(top>props.scrollOffset && top<upcomingTop){upcomingTop=top;upcoming=String(item.value);}
 }
 position.value=current ?? upcoming;
}
onMounted(()=>{updatePosition();document.addEventListener('scroll',updatePosition,true);});
onBeforeUnmount(()=>document.removeEventListener('scroll',updatePosition,true));
</script>
<template>
 <div data-ar="section-menu" data-part="root">
  <nav data-part="navigation" :aria-label="label" :data-sticky="scroll || undefined">
   <div data-part="desktop"><ArMenu mode="inline" :items="items" :selected="selected" :label="label" @select="select" @update:open-keys="onOpen" /></div>
   <div data-part="mobile"><ArSelect block :model-value="selected ?? null" :options="options" :label="label" @update:model-value="select" /></div>
  </nav>
  <div data-part="content"><slot /></div>
 </div>
</template>
