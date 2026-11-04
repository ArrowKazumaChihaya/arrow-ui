import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

describe('legacy input isolation', () => {
  for (const file of [
    'packages/ui/src/styles/product-layout.css',
    'packages/ui/src/styles/product-print.css',
    'packages/ui-design-classic/src/parts/product/box.css',
  ]) {
    it(`${file} hides legacy custom inputs without hiding native library controls`, () => {
      const host = document.createElement('div');
      host.setAttribute('data-ar-design', 'classic');
      host.setAttribute('data-ui-fixed', '');
      host.className = 'check_wrap';
      host.innerHTML = '<input type="radio" data-part="input"><input type="checkbox" data-part="input"><input type="radio"><input type="checkbox">';
      const [radio, checkbox, legacyRadio, legacyCheckbox] = Array.from(host.querySelectorAll('input'));
      const hiddenSelectors: string[] = [];
      postcss.parse(readFileSync(file, 'utf8')).walkRules(rule => {
        if (rule.selector.includes('input') && rule.nodes.some(node => node.type === 'decl' && node.prop === 'display' && node.value === 'none')) hiddenSelectors.push(rule.selector);
      });
      expect(hiddenSelectors.some(selector => radio!.matches(selector))).toBe(false);
      expect(hiddenSelectors.some(selector => checkbox!.matches(selector))).toBe(false);
      expect(hiddenSelectors.some(selector => legacyRadio!.matches(selector))).toBe(true);
      expect(hiddenSelectors.some(selector => legacyCheckbox!.matches(selector))).toBe(true);
    });
  }
});
