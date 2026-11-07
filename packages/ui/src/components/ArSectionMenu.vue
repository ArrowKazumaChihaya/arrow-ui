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
const navigation=ref<HTMLElement>();
const mobileNavigation=ref<HTMLElement>();
const navigationInset=ref(0);
const scrollInset=computed(()=>Math.max(props.scrollOffset,navigationInset.value));
let navigationObserver:ResizeObserver|undefined;
function measureNavigation(){
 const nav=navigation.value;const mobile=mobileNavigation.value;
 navigationInset.value=nav && mobile && getComputedStyle(mobile).display!=='none'
  ? nav.getBoundingClientRect().height+(parseFloat(getComputedStyle(nav).top)||0)+8 : 0;
}

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
 let last:string|undefined;let lastTop=-Infinity;
 for(const item of options.value){
  const section=document.getElementById(String(item.value));if(!section)continue;
  const top=section.getBoundingClientRect().top;
  if(top>lastTop){lastTop=top;last=String(item.value);}
  if(top<=scrollInset.value+1 && top>currentTop){currentTop=top;current=String(item.value);}
  else if(top>scrollInset.value+1 && top<upcomingTop){upcomingTop=top;upcoming=String(item.value);}
 }
 // Short final sections cannot reach the sticky heading when the page runs out of space.
 // Use the actual scroll container, including a modal body, rather than the document alone.
 let scroller=navigation.value?.parentElement;
 while(scroller && !(/auto|scroll/.test(getComputedStyle(scroller).overflowY) && scroller.scrollHeight>scroller.clientHeight))scroller=scroller.parentElement;
 const atEnd=scroller
  ? scroller.scrollTop>0 && scroller.scrollTop+scroller.clientHeight>=scroller.scrollHeight-2
  : window.scrollY>0 && window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-2;
 position.value=atEnd ? last ?? current ?? upcoming : current ?? upcoming;
}
onMounted(()=>{
 measureNavigation();updatePosition();document.addEventListener('scroll',updatePosition,true);
 window.addEventListener('resize',measureNavigation);
 if(typeof ResizeObserver!=='undefined' && navigation.value){navigationObserver=new ResizeObserver(measureNavigation);navigationObserver.observe(navigation.value);}
});
onBeforeUnmount(()=>{
 document.removeEventListener('scroll',updatePosition,true);window.removeEventListener('resize',measureNavigation);navigationObserver?.disconnect();
});
</script>
<template>
 <div data-ar="section-menu" data-part="root" :data-scroll="scroll || undefined" :style="scroll ? { '--ar-section-menu-scroll-offset': `${scrollInset}px` } : undefined">
  <nav ref="navigation" data-part="navigation" :aria-label="label" :data-sticky="scroll || undefined">
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
   <div ref="mobileNavigation" data-part="mobile"><ArSelect block :model-value="selected ?? null" :options="options" :label="label" :searchable="searchable || undefined" :search-placeholder="searchPlaceholder" :empty-text="emptyText" @select="select" /></div>
  </nav>
  <div data-part="content"><slot /></div>
 </div>
</template>
