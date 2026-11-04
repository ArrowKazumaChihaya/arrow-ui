import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ArSectionMenu from '../src/components/ArSectionMenu.vue';
import ArSelect from '../src/components/ArSelect.vue';
import ArMenu from '../src/components/ArMenu.vue';

const items = [
  { key: 'company', label: '会社', children: [
    { key: 'locked', label: '制限あり', locked: true },
    { key: 'group', label: '設定', children: [{ key: 'allowed', label: '基本' }] },
  ] },
  { key: 'disabled-parent', label: '利用不可', disabled: true, children: [{ key: 'child', label: '詳細' }] },
];
describe('section navigation permissions', () => {
  it('keeps locked and inherited disabled entries unavailable in mobile options', () => {
    const wrapper = mount(ArSectionMenu, { props: { items } });
    const options = wrapper.getComponent(ArSelect).props('options');
    expect(options).toEqual([
      { value: 'locked', label: '会社 > 制限あり', disabled: true, icon: 'lock' },
      { value: 'allowed', label: '会社 > 設定 > 基本', disabled: false, icon: undefined },
      { value: 'child', label: '利用不可 > 詳細', disabled: true, icon: undefined },
    ]);
    wrapper.getComponent(ArSelect).vm.$emit('update:modelValue', 'locked');
    wrapper.getComponent(ArSelect).vm.$emit('update:modelValue', 'child');
    expect(wrapper.emitted('update:value')).toBeUndefined();
    wrapper.getComponent(ArSelect).vm.$emit('update:modelValue', 'allowed');
    expect(wrapper.emitted('update:value')).toEqual([['allowed']]);
    wrapper.unmount();
  });
  it('opening a desktop group selects its first usable leaf, never a locked or group key', () => {
    const wrapper = mount(ArSectionMenu, { props: { items } });
    wrapper.getComponent(ArMenu).vm.$emit('update:openKeys', ['company']);
    expect(wrapper.emitted('update:value')).toEqual([['allowed']]);
    wrapper.getComponent(ArMenu).vm.$emit('update:openKeys', ['company', 'disabled-parent']);
    expect(wrapper.emitted('update:value')).toEqual([['allowed']]);
    wrapper.unmount();
  });
});
