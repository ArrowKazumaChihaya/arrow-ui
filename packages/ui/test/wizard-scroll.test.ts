import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ArWizard from '../src/components/ArWizard.vue';

const original = Object.getOwnPropertyDescriptor(document, 'scrollingElement');
it('names the next destination while preserving explicit completion actions and legacy labels', async () => {
  const wrapper = mount(ArWizard, { props: {
    value: 1,
    options: [{value: 1, label: 'Income'}, {value: 5, label: 'Review', nextText: 'Submit'}],
    labels: {steps: 'Steps', prev: 'Back', next: 'Next', nextStep: 'Next ({step})'},
    scrollOnChange: false,
  }});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Next (Review)');
  await wrapper.get('[data-tone="primary"]').trigger('click');
  expect(wrapper.emitted('next')).toHaveLength(1);
  await wrapper.setProps({value: 5});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Submit');
  await wrapper.setProps({value: 1, labels: {steps: 'Steps', prev: 'Back', next: 'Next'}});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Next');
  wrapper.unmount();
});
afterEach(() => {
  vi.restoreAllMocks();
  if (original) Object.defineProperty(document, 'scrollingElement', original);
  else Reflect.deleteProperty(document, 'scrollingElement');
});

it('names the consumer-selected destination when optional steps are skipped', async () => {
  const wrapper = mount(ArWizard, {props: {
    value: 1, nextValue: 3,
    options: [{value: 1, label: 'Eligibility'}, {value: 2, label: 'Amount'}, {value: 3, label: 'Review', nextText: 'Submit'}],
    labels: {steps: 'Steps', prev: 'Back', next: 'Next', nextStep: 'Next ({step})'},
    scrollOnChange: false,
  }});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Next (Review)');
  await wrapper.setProps({nextValue: 2});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Next (Amount)');
  await wrapper.setProps({value: 3, nextValue: 4});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Submit');
  await wrapper.setProps({value: 1, nextValue: 99});
  expect(wrapper.get('[data-tone="primary"]').text()).toBe('Next');
  expect(wrapper.emitted('next')).toBeUndefined();
  wrapper.unmount();
});

it.each(['html', 'body'] as const)('scrolls the actual %s document scroller after a step change', async tag => {
  const scroller = tag === 'html' ? document.documentElement : document.body;
  const scroll = vi.fn();
  Object.defineProperty(document, 'scrollingElement', { configurable: true, get: () => scroller });
  Object.defineProperty(scroller, 'scrollTo', { configurable: true, value: scroll });
  const wrapper = mount(ArWizard, { props: { value: 1, options: [{value:1,label:'First'}, {value:2,label:'Second'}] } });
  expect(scroll).not.toHaveBeenCalled();
  await wrapper.setProps({value:2});
  expect(scroll).toHaveBeenCalledExactlyOnceWith({top:0});
  expect(wrapper.get('[data-part="summary"]').text()).toContain('Second');
  await wrapper.setProps({scrollOnChange:false,value:1});
  expect(scroll).toHaveBeenCalledTimes(1);
  wrapper.unmount();
  Reflect.deleteProperty(scroller,'scrollTo');
});

it('reveals the active step in the horizontal rail without moving the page when scrolling is disabled', async () => {
  const pageScroll = vi.fn();
  Object.defineProperty(document.documentElement, 'scrollTo', { configurable: true, value: pageScroll });
  const wrapper = mount(ArWizard, { props: {
    value: 1, scrollOnChange: false,
    options: [{value: 1, label: 'Start'}, {value: 2, label: 'Details'}, {value: 3, label: 'Review'}],
  }});
  const viewport = wrapper.get<HTMLElement>('[data-part="steps"]').element;
  Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 300 });
  Object.defineProperty(viewport, 'scrollWidth', { configurable: true, value: 600 });
  vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 0, 300, 40));
  vi.spyOn(wrapper.get('[data-part="step"]:last-child').element, 'getBoundingClientRect').mockImplementation(() => new DOMRect(510 - viewport.scrollLeft, 0, 100, 24));
  vi.spyOn(wrapper.get('[data-part="step"]:first-child').element, 'getBoundingClientRect').mockImplementation(() => new DOMRect(10 - viewport.scrollLeft, 0, 100, 24));
  await wrapper.setProps({value: 3});
  expect(viewport.scrollLeft).toBe(300);
  await wrapper.setProps({disabled: true});
  expect(viewport.scrollLeft).toBe(300);
  await wrapper.setProps({value: 1});
  expect(viewport.scrollLeft).toBe(0);
  expect(pageScroll).not.toHaveBeenCalled();
  wrapper.unmount();
  Reflect.deleteProperty(document.documentElement, 'scrollTo');
});

it('keeps backward navigation usable when only the next step is incomplete', async () => {
  const wrapper = mount(ArWizard, {props: {value: 2, options: [{value:1,label:'Pick'}, {value:2,label:'Details'}, {value:3,label:'Download'}], nextDisabled:true, scrollOnChange:false}});
  expect(wrapper.get('[data-tone="primary"]').attributes('disabled')).toBeDefined();
  await wrapper.get('[data-tone="secondary"]').trigger('click');
  expect(wrapper.emitted('prev')).toHaveLength(1);
  expect(wrapper.emitted('next')).toBeUndefined();
  await wrapper.setProps({nextDisabled:false});
  await wrapper.get('[data-tone="primary"]').trigger('click');
  expect(wrapper.emitted('next')).toHaveLength(1);
  wrapper.unmount();
});
