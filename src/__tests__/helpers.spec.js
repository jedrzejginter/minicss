const { clearModifier, makeCssVal } = require('../helpers');

describe('clearModifier', () => {
  it('should work for state modifier', () => {
    expect(clearModifier(':h')).toBe('h');
  });

  it('should work for media query modifier', () => {
    expect(clearModifier('>7:')).toBe('>7');
  });
});

describe('makeCssVal', () => {
  it('should return integer for digits-only value', () => {
    expect(makeCssVal('0')).toBe(0);
    expect(makeCssVal('10')).toBe(10);
  });

  it('should return integer for negative-like value', () => {
    expect(makeCssVal('-5')).toBe(-5);
  });

  it('should return percentage', () => {
    expect(makeCssVal('50%')).toBe('50%');
    expect(makeCssVal('-100%')).toBe('-100%');
  });

  it('should return calc(..) expression', () => {
    expect(makeCssVal('10%-50')).toBe('calc(10% - 50)');
    expect(makeCssVal('10%-(50*3)')).toBe('calc(10% - (50 * 3))');
    expect(makeCssVal('-100%+20-3rem')).toBe('calc(-100% + 20 - 3rem)');
    expect(makeCssVal('-100%-20')).toBe('calc(-100% - 20)');
  });
});
