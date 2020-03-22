const { decorateCssVal } = require('../css-value');

describe('decorateCssVal', () => {
  it('should return input when not matched as any special case', () => {
    expect(decorateCssVal('bottom')).toBe('bottom');
    expect(decorateCssVal('1px solid #000')).toBe('1px solid #000');
  });

  it('should not recognize hyphen values as calc()', () => {
    expect(decorateCssVal('flex-start')).toBe('flex-start');
  });

  it('should not recognize negative values with unit as calc()', () => {
    expect(decorateCssVal('-3px')).toBe('-3px');
  });

  describe('numeric values', () => {
    it('should return "0" for "0"', () => {
      expect(decorateCssVal('0')).toBe('0');
    });

    it('should add rem for non-zero integer', () => {
      expect(decorateCssVal('8')).toBe('0.5rem');
      expect(decorateCssVal('16')).toBe('1rem');
    });

    it('should add rem for non-zero float', () => {
      expect(decorateCssVal('8.6')).toBe('0.5375rem');
    });

    it('should skip unit for "flex-grow" or "flex-shrink"', () => {
      expect(decorateCssVal('1', 'flex-grow')).toBe('1');
      expect(decorateCssVal('0', 'flex-shrink')).toBe('0');
    });

    it('should skip unit for "order"', () => {
      expect(decorateCssVal('4', 'order')).toBe('4');
    });

    it('should skip unit for "z-index"', () => {
      expect(decorateCssVal('10', 'z-index')).toBe('10');
    });
  });

  describe('hex color', () => {
    it('should recognize 0x as hex value', () => {
      expect(decorateCssVal('0xfff')).toBe('#fff');
      expect(decorateCssVal('0x00aaff')).toBe('#00aaff');
    });
  });

  describe('hex color with alpha', () => {
    it('should transform hex color (using #) with opacity to rgba', () => {
      expect(decorateCssVal('#000.5')).toBe('rgba(0,0,0,0.5)');
    });

    it('should transform hex color (using 0x) with opacity to rgba', () => {
      expect(decorateCssVal('0x000.5')).toBe('rgba(0,0,0,0.5)');
    });
  });

  describe('calc() expressions', () => {
    // TODO:
    // Here we have a single piece of code that is responsibe for two things.
    it('should recognize expression that requires calc(..) and format it', () => {
      expect(decorateCssVal('100%-5rem')).toBe('calc(100% - 5rem)');
    });
  });
});
