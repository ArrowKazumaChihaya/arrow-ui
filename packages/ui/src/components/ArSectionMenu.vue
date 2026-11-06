<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import ArMenu from './ArMenu.vue';
import ArSelect from './ArSelect.vue';
import ArCard from './ArCard.vue';
import ArStack from '../layout/ArStack.vue';
import ArTextInput from './ArTextInput.vue';
import ArEmpty from './ArEmpty.vue';
import { fold } from '../internal/options';
import type { ArSelectValue, ArSelectOption } from './ArSelect.contract';
import type { ArMenuItem } from './ArMenu.contract';
import type { ArSectionMenuProps, ArSectionMenuEmits } from './ArSectionMenu.contract';
const props=withDefaults(defineProps<ArSectionMenuProps>(),{label:'項目',scroll:false,scrollOffset:50,searchable:false,searchPlaceholder:'項目を探す',emptyText:'該当する項目はありません'});
const emit=defineEmits<ArSectionMenuEmits>();
const position=ref<string>();
const search=ref('');
const query=computed(()=>props.searchable ? fold(search.value.trim()) : '');
function filterItems(items:readonly ArMenuItem[], parentLabel=''):ArMenuItem[]{
 return items.flatMap(item=>{
  if(item.type==='divider')return [];
  const path=parentLabel+' '+(item.label ?? '');
  if(fold(path).includes(query.value))return [item];
  const children=item.children ? filterItems(item.children,path) : [];
  return children.length ? [{...item,children}] : [];
 });
}
const visibleItems=computed(()=>query.value ? filterItems(props.items) : props.items);
function parentKeys(items:readonly ArMenuItem[]):string[]{
 return items.flatMap(item=>item.children?.length ? [item.key,...parentKeys(item.children)] : []);
}
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
const opened=ref<string[]>([]);
function selectedParents(items:readonly ArMenuItem[], key:string|undefined):string[]{
 for(const item of items){
  if(item.key===key)return [];
  if(!item.children?.length)continue;
  const nested=selectedParents(item.children,key);
  if(item.children.some(child=>child.key===key) || nested.length)return [item.key,...nested];
 }
 return [];
}
watch([selected,()=>props.items],()=>{
 opened.value=[...new Set([...opened.value,...selectedParents(props.items,selected.value)])];
},{immediate:true});
const menuOpenKeys=computed(()=>query.value ? parentKeys(visibleItems.value) : opened.value);
function findItem(items:readonly ArMenuItem[],key:string):ArMenuItem|undefined{
 for(const item of items){
  if(item.key===key)return item;
  const nested=item.children ? findItem(item.children,key) : undefined;
  if(nested)return nested;
 }
 return undefined;
}
function onOpen(keys:string[]){
 if(query.value)return;
 const key=keys.find(k=>!opened.value.includes(k));opened.value=keys;
 if(!key)return;
 const item=findItem(props.items,key);
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
   <div data-part="desktop">
    <ArCard v-if="title || searchable" :title="title ?? label" :icon="icon" variant="band" size="sm">
     <ArStack :gap="2">
      <ArTextInput v-if="searchable" v-model="search" type="search" clearable block :label="searchPlaceholder" :placeholder="searchPlaceholder" />
      <ArEmpty v-if="!visibleItems.length" icon="search" :text="emptyText" />
      <ArMenu v-else mode="inline" :items="visibleItems" :selected="selected" :open-keys="menuOpenKeys" :label="label" :bordered="false" @select="select" @update:open-keys="onOpen" />
     </ArStack>
    </ArCard>
    <ArMenu v-else mode="inline" :items="items" :selected="selected" :open-keys="menuOpenKeys" :label="label" @select="select" @update:open-keys="onOpen" />
   </div>
   <div data-part="mobile"><ArSelect block :model-value="selected ?? null" :options="options" :label="label" :searchable="searchable || undefined" :search-placeholder="searchPlaceholder" :empty-text="emptyText" @update:model-value="select" /></div>
  </nav>
  <div data-part="content"><slot /></div>
 </div>
</template>
