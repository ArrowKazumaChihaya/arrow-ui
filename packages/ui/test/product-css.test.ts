import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { describe, expect, it } from 'vitest';

const productRoot = resolve('packages/ui-design-classic/src/parts/product');
const classicFiles = readdirSync(productRoot).filter(file => file.endsWith('.css'));

describe('product stylesheet isolation', () => {
  it.each(classicFiles)('%s uses valid selectors inside the classic provider and a fallback layer', file => {
    const css = postcss.parse(readFileSync(resolve(productRoot, file), 'utf8'));
    expect(css.first?.type).toBe('atrule');
    expect(css.first && 'name' in css.first && css.first.name).toBe('layer');
    css.walkRules(rule => {
      if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;
      const selectors = selectorParser().astSync(rule.selector);
      for (const selector of selectors.nodes) {
        const gates: string[] = [];
        selector.walkAttributes(attribute => {
          if (attribute.attribute === 'data-ar-design') gates.push(attribute.value ?? '');
        });
        expect(gates, rule.selector).toContain('classic');
        expect(rule.selector).not.toContain('html:not');
      }
    });
  });
  it('keeps fallback geometry below component controls in the cascade', () => {
    const css = postcss.parse(readFileSync(resolve('packages/ui/src/styles/product-layout.css'), 'utf8'));
    expect(css.first?.type).toBe('atrule');
    expect(css.first && 'params' in css.first && css.first.params).toBe('arrow-product-layout');
    css.walkRules(rule => { selectorParser().astSync(rule.selector); });
  });
  it('excludes fixed documents from every remix product appearance rule', () => {
    const css = postcss.parse(readFileSync(resolve('packages/ui-design-remix/src/parts/_product.css'), 'utf8'));
    css.walkRules(rule => {
      if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;
      for (const selector of selectorParser().astSync(rule.selector).nodes) {
        expect(selector.toString()).toContain(':not([data-ui-fixed], [data-ui-fixed] *)');
      }
    });
  });
  it('keeps attendance error rows red for direct and grouped hover', () => {
    const css = postcss.parse(readFileSync(resolve('packages/ui-design-remix/src/parts/_product.css'), 'utf8'));
    const directHover = css.nodes.find(node =>
      node.type === 'rule' && node.selector.includes('tbody tr:hover'),
    );
    const groupedHover = css.nodes.find(node =>
      node.type === 'rule' && node.selector.includes('tr[data-group-hover="on"]'),
    );
    const errorHover = css.nodes.find(node =>
      node.type === 'rule' && node.selector.includes('tr.error') && node.selector.includes(':hover'),
    );

    expect(directHover?.type === 'rule' ? directHover.selector : '').toContain('.error');
    expect(groupedHover?.type === 'rule' ? groupedHover.selector : '').toContain(':not(.error)');
    expect(errorHover?.type === 'rule' ? errorHover.toString() : '').toContain(
      'var(--ar-color-danger)',
    );
  });
});
