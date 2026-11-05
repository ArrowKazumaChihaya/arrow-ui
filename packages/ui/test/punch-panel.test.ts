import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import ArPunchPanel from '../src/components/ArPunchPanel.vue';

it('supports a separate date without changing the legacy timestamp contract', async () => {
  const wrapper = mount(ArPunchPanel, {props: {title: 'GPS', timestamp: '2026/11/6 12:00:00'}});
  expect(wrapper.get('[data-part="clock"]').text()).toBe('2026/11/6 12:00:00');
  expect(wrapper.find('[data-part="date"]').exists()).toBe(false);
  await wrapper.setProps({dateLabel: '2026/11/6 (Fri)', timestamp: '12:00:01'});
  expect(wrapper.get('[data-part="date"]').text()).toBe('2026/11/6 (Fri)');
  expect(wrapper.get('[data-part="clock"]').text()).toBe('12:00:01');
  expect(wrapper.attributes('data-date-separated')).toBe('true');
  wrapper.unmount();
});
