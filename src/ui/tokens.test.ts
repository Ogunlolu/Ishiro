import { contrastRatio } from './contrast';
import { minTouchTarget, palettes, type ColorScheme } from './tokens';

const schemes: ColorScheme[] = ['light', 'dark'];

describe('contrastRatio', () => {
  it('matches known reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    // #767676 on white is the well-known "just passes AA" grey.
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
  });

  it('does not depend on argument order', () => {
    expect(contrastRatio('#111111', '#FF4F8B')).toBe(contrastRatio('#FF4F8B', '#111111'));
  });

  it('rejects colours it cannot read', () => {
    expect(() => contrastRatio('red', '#FFFFFF')).toThrow();
  });
});

describe.each(schemes)('%s palette', (scheme) => {
  const p = palettes[scheme];

  it.each([
    ['ink on paper', p.ink, p.paper],
    ['secondary text on paper', p.secondary, p.paper],
    ['button text on Guava', p.onGuava, p.guava],
  ])('%s has at least 4.5:1 contrast', (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the Guava button visible against the page', () => {
    // WCAG 1.4.11: interface components need at least 3:1 against what is around them.
    expect(contrastRatio(p.guava, p.paper)).toBeGreaterThanOrEqual(3);
  });

  it('always puts Ink text on Guava', () => {
    expect(p.onGuava).toBe('#111111');
    expect(p.guava).toBe('#FF4F8B');
  });
});

it('keeps the touch target baseline at 44 points or more', () => {
  expect(minTouchTarget).toBeGreaterThanOrEqual(44);
});
