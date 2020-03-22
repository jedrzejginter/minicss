const { extractor } = require('../extractor');

describe('extractor', () => {
  it('should skip parsing for non-functional class names', () => {
    expect(extractor('util')).toBe(null);
    expect(extractor('Util')).toBe(null);
    expect(extractor('Util()')).toBe(null);
  });

  it('should work for simple class names', () => {
    const o = extractor('C(red)');

    expect(o.properties).toStrictEqual(['color']);
    expect(o.values).toStrictEqual(['red']);
  });

  it('should work with state flags', () => {
    const o = extractor('Bgc(#000):h');

    expect(o.properties).toStrictEqual(['background-color']);
    expect(o.values).toStrictEqual(['#000']);
    expect(o.state).toBe('hover');
  });

  it('should work with media breakpoints', () => {
    const o = extractor('md:W(100px)');

    expect(o.properties).toStrictEqual(['width']);
    expect(o.values).toStrictEqual(['100px']);
    expect(o.media).toBe('768px');
  });

  it('should work with multi-property class names', () => {
    const o = extractor('Px(16)');

    expect(o.properties).toStrictEqual(['padding-left', 'padding-right']);
    expect(o.values).toStrictEqual(['1rem']);
  });

  it('should work with value groups', () => {
    const o = extractor('Bxsh(inset,0,0,10px,#000|0,-3px,0,red)');

    expect(o.properties).toStrictEqual(['box-shadow']);
    expect(o.values).toStrictEqual(['inset 0 0 10px #000', '0 -3px 0 red']);
  });

  it('should work for complex rules', () => {
    const o = extractor('Bxsh(inset,0,-50%*[12px-33%/12],10,#fff.74|0,0,10rem,red)');

    expect(o.properties).toStrictEqual(['box-shadow']);
    expect(o.values).toStrictEqual([
      'inset 0 calc(-50% * (12px - 33% / 12)) 0.625rem rgba(255,255,255,0.74)',
      '0 0 10rem red',
    ]);
  });
});
