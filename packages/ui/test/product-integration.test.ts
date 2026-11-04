import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ArPageHeading from '../src/components/ArPageHeading.vue';
import ArCard from '../src/components/ArCard.vue';
import ArTabs from '../src/components/ArTabs.vue';
import ArTreeTable from '../src/components/ArTreeTable.vue';
import ArDateInput from '../src/components/ArDateInput.vue';
import ArAuthPanel from '../src/components/ArAuthPanel.vue';
import ArTableHeader from '../src/components/ArTableHeader.vue';
import ArTextInput from '../src/components/ArTextInput.vue';
import ArTextarea from '../src/components/ArTextarea.vue';
import { UiTableCell, UiTableRow, filterStructuralLayout, filterControlLayout } from '../src/product';
import { captureArUiContext, useArUi } from '../src/provider/context';
import ArUiProvider from '../src/provider/ArUiProvider.vue';
import { remixDesign } from '@arrow/ui-design-remix';
import { classicDesign } from '@arrow/ui-design-classic';

interface TestRow { key: number; name: string; children?: TestRow[] }

describe('product integration contracts', () => {
 it('renders a semantic page heading and suffix through the same public component', () => {
  const wrapper=mount(ArPageHeading,{props:{title:'勤怠一覧'},slots:{default:()=>h('small','補足')}});
  expect(wrapper.element.tagName).toBe('H2');
  expect(wrapper.get('[data-part=label]').text()).toBe('勤怠一覧');
  expect(wrapper.get('[data-part=suffix]').text()).toBe('補足');
  expect(wrapper.attributes('data-type')).toBe('bar');
 });
 it('renders product card title content in an accessible heading', () => {
  const wrapper=mount(ArCard,{props:{title:'fallback'},slots:{title:()=>[h('span','保険料'),h('small','補足')],default:'本文'}});
  expect(wrapper.get('h2').text()).toBe('保険料補足');
  expect(wrapper.get('[data-part=body]').text()).toBe('本文');
 });
 it('keeps tab counts and alerts in the public tab keyboard interaction', async () => {
  const wrapper=mount(ArTabs,{props:{modelValue:'table',label:'勤怠',items:[{key:'table',label:'一覧'},{key:'remarks',label:'備考',count:3,alert:true}]}});
  const tabs=wrapper.findAll('[role=tab]');
  expect(tabs[1]?.text()).toContain('備考3');
  expect(tabs[1]?.get('[role=img]').attributes('aria-label')).toBe('要確認');
  await tabs[0]?.trigger('keydown',{key:'ArrowRight'});
  expect(wrapper.emitted('update:modelValue')).toEqual([['remarks']]);
 });
 it('preserves explicit accessible names on native text controls, including fields with an id', () => {
  for (const control of [ArTextInput, ArTextarea]) {
   const wrapper=mount(control,{props:{modelValue:'draft',id:'named-field',label:'fallback'},attrs:{'aria-label':'編集中の入力','aria-describedby':'help'}});
   const field=wrapper.get('input,textarea');
   expect(field.attributes('aria-label')).toBe('編集中の入力');
   expect(field.attributes('aria-describedby')).toBe('help');
   wrapper.unmount();
  }
 });
 it('carries a reactive provider into imperative dialogs without private Vue instance fields', async () => {
  const selected=ref(remixDesign);
  let restore=()=>{};
  const Capture=defineComponent({setup(){restore=captureArUiContext();return()=>null;}});
  const host=mount(defineComponent({setup:()=>()=>h(ArUiProvider,{design:selected.value,palette:'teal',scope:'self'},()=>h(Capture))}));
  const target=document.createElement('div');
  const Probe=defineComponent({setup(){const ui=useArUi();return()=>h('p',`${ui?.design.value.id}:${ui?.palette.value}`);}});
  const dialog=createApp(defineComponent({setup(){restore();return()=>h(Probe);}}));
  dialog.mount(target);
  expect(target.textContent).toBe('remix:teal');
  selected.value=classicDesign;await nextTick();
  expect(target.textContent).toBe('classic:teal');
  dialog.unmount();host.unmount();
 });
 it('keeps data geometry while refusing legacy decorative overrides', () => {
  expect(filterStructuralLayout({ width:'700px', '--table-width':'700px', '--shift-table-row-height':'36px', '--padding-index':2, color:'red', borderRadius:'90px', '--radius':'90px', '--color':'red' })).toEqual({width:'700px','--table-width':'700px','--shift-table-row-height':'36px','--padding-index':2});
  expect(filterControlLayout({width:'80px',marginLeft:'8px',maxHeight:'400px',padding:'7px',textAlign:'right',lineHeight:'20px',gap:'8px'})).toEqual({width:'80px',marginLeft:'8px',maxHeight:'400px'});
 });
 it('renders existing row slots as valid cells with one set of library tree controls', async () => {
  const selected=vi.fn();
  const wrapper=mount(ArTreeTable<TestRow>, {
   props:{ rows:[{key:1,name:'本店',children:[{key:2,name:'支店',children:[]}]}], rowKey:'key', columns:[{key:'name',title:'店舗'}], caption:'店舗一覧', draggable:true },
   slots:{cells:({row})=>h(UiTableRow,{},()=>[h(UiTableCell,{},()=>h('button',{onClick:()=>selected(row.key)},row.name)),h(UiTableCell,{},()=>String(row.key))])},
  });
  expect(wrapper.findAll('tbody > tr')).toHaveLength(2);
  expect(wrapper.findAll('tbody > tr > td')).toHaveLength(4);
  expect(wrapper.find('td tr').exists()).toBe(false);
  expect(wrapper.findAll('[data-part="drag-handle"]')).toHaveLength(2);
  await wrapper.get('tbody > tr > td [data-part="content"] button').trigger('click');
  expect(selected).toHaveBeenCalledWith(1);
  await wrapper.get('[data-part="toggle"]').trigger('click');
  expect(wrapper.findAll('tbody > tr')).toHaveLength(1);
  wrapper.unmount();
 });
 it.each(['td', 'span'])('normalizes native %s slot content without displaying VNodes as text', async (tag) => {
  const selected=vi.fn();
  const wrapper=mount(ArTreeTable<TestRow>,{
   props:{rows:[{key:1,name:'本店',children:[{key:2,name:'支店',children:[]}]}],rowKey:'key',columns:[{key:'name',title:'店舗'}],caption:'店舗一覧'},
   slots:{cells:({row})=>h(tag,{onClick:()=>selected(row.key)},row.name)},
  });
  expect(wrapper.findAll('tbody > tr > td')).toHaveLength(2);
  expect(wrapper.findAll('[data-part="content"]').map(cell=>cell.text())).toEqual(['本店','支店']);
  await wrapper.get(tag === 'span' ? '[data-part="content"] > span' : '[data-part="content"]').trigger('click');
  expect(selected).toHaveBeenCalledWith(1);
  await wrapper.setProps({rows:[{key:3,name:'変更後'}]});
  expect(wrapper.text()).not.toContain('支店');
  expect(wrapper.get('[data-part="content"]').text()).toBe('変更後');
  wrapper.unmount();
 });
 it('honors product reparent restrictions for keyboard moves without changing source rows', async () => {
  const rows=[{key:1,name:'本店'},{key:2,name:'支店'}];
  const wrapper=mount(ArTreeTable<TestRow>,{props:{rows,rowKey:'key',columns:[{key:'name',title:'店舗'}],caption:'店舗',draggable:true,allowDrop:drop=>drop.position!=='inside'}});
  const handle=wrapper.get('[data-part="drag-handle"][data-key="2"]');
  await handle.trigger('keydown',{key:'ArrowRight',altKey:true});
  expect(wrapper.emitted('drop')).toBeUndefined();
  await handle.trigger('keydown',{key:'ArrowUp',altKey:true});
  expect(wrapper.emitted('drop')).toEqual([[{key:2,target:1,position:'before'}]]);
  expect(rows.map(row=>row.key)).toEqual([1,2]);
  wrapper.unmount();
 });
 it('retains partial dates and rejects impossible dates before emitting a complete valid date', async () => {
  const value=ref<string|null>(null);
  const Host=defineComponent({setup:()=>()=>h(ArDateInput,{modelValue:value.value,'onUpdate:modelValue':next=>value.value=next,initialYear:2026,updateOnInput:true,invalidDate:'message',showWeekday:false})});
  const wrapper=mount(Host);
  await wrapper.get('input[data-part="month"]').setValue('2');
  expect(value.value).toBeNull();
  expect(wrapper.get<HTMLInputElement>('input[data-part="month"]').element.value).toBe('2');
  await wrapper.get('input[data-part="day"]').setValue('31');
  expect(value.value).toBeNull();
  expect(wrapper.find('[role="alert"]').exists()).toBe(true);
  await wrapper.get('input[data-part="day"]').setValue('28');
  await nextTick();
  expect(value.value).toBe('2026-02-28');
  expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  value.value=null;await nextTick();
  expect(wrapper.get<HTMLInputElement>('input[data-part="day"]').element.value).toBe('');
  wrapper.unmount();
 });
 it.each(["abc", "0", "13", "99"])("marks malformed month %s invalid while retaining the edit and clearing the complete value", async text => {
  const value=ref<string|null>("2026-02-03");
  const Host=defineComponent({setup:()=>()=>h(ArDateInput,{modelValue:value.value,'onUpdate:modelValue':next=>value.value=next,updateOnInput:true,invalidDate:'message'})});
  const wrapper=mount(Host);
  const month=wrapper.get<HTMLInputElement>('input[data-part="month"]');
  await month.setValue(text);
  expect(value.value).toBeNull();
  expect(month.element.value).toBe(text);
  expect(month.attributes('aria-invalid')).toBe('true');
  expect(wrapper.get('[role="alert"]').text()).toBe('無効な日付');
  await month.setValue("2");
  expect(value.value).toBe('2026-02-03');
  expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  wrapper.unmount();
 });
 it('keeps authentication actions in the consumer and exposes sortable headers as buttons',async()=>{
  const submit=vi.fn();
  const panel=mount(ArAuthPanel,{props:{title:'ログイン',companyName:'テスト会社',companyCode:'test'},slots:{default:()=>h('form',{onSubmit:submit},h('button',{type:'submit'},'ログイン'))}});
  expect(panel.get('h1').text()).toBe('ログイン');
  expect(panel.get('[data-part="company-code"]').text()).toContain('test');
  await panel.get('form').trigger('submit');expect(submit).toHaveBeenCalledOnce();
  const header=mount(ArTableHeader,{props:{sortable:true,sort:'desc'},slots:{default:'名前'}});
  expect(header.attributes('aria-sort')).toBe('descending');
  await header.get('button').trigger('click');expect(header.emitted('activate')).toHaveLength(1);
  panel.unmount();header.unmount();
 });
});
