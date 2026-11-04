import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ArCalendar from '../src/components/ArCalendar.vue';

describe('calendar勤務時間', () => {
  it('日付の読み上げ末尾を利用側の言語に合わせる', () => {
    const calendar = mount(ArCalendar, { props: {
      month: '2026-11', showHeader: false,
      labels: { weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], year: '/', month: '/', day: '', yearSelect: 'Year', modeSwitch: 'View' },
    } });
    expect(calendar.get('[data-date="2026-11-04"]').attributes('aria-label')).toBe('2026/11/4');
    calendar.unmount();
  });
  for (const variant of ['board', 'sheet'] as const) {
    it(`${variant}: 分割勤務・翌日終了を省略せず読み上げ、日付の選択を維持する`, async () => {
      const calendar = mount(ArCalendar, {
        props: {
          variant, month: '2026-11', showHeader: false,
          timeRanges: [
            { date: '2026-11-04', start: '09:00', end: '12:00', label: '本店 09:00〜12:00' },
            { date: '2026-11-04', start: '21:00', end: '26:00' },
            { date: '2026-12-01', start: '10:00', end: '18:00' },
          ],
        },
      });
      const day = calendar.get('[data-date="2026-11-04"]');
      expect(day.attributes('aria-label')).toBe('2026年11月4日 本店 09:00〜12:00、21:00〜26:00');
      expect(day.findAll('[data-part="time-start"]').map(node => node.text())).toEqual(['09:00', '21:00']);
      expect(day.findAll('[data-part="time-end"]').map(node => node.text())).toEqual(['12:00', '26:00']);
      expect(calendar.get('[data-date="2026-12-01"]').find('[data-part="times"]').exists()).toBe(false);
      await day.trigger('keydown', { key: 'Enter' });
      expect(calendar.emitted('update:modelValue')?.at(-1)).toEqual(['2026-11-04']);
      await calendar.setProps({ timeRanges: [] });
      expect(day.attributes('aria-label')).toBe('2026年11月4日');
      expect(day.find('[data-part="times"]').exists()).toBe(false);
      calendar.unmount();
    });
  }
});
