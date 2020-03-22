const { mapBreakpoint, mediaMapObject } = require('../media');

describe('mediaMapObject', () => {
  it('should has all breakpoints', () => {
    expect(Object.keys(mediaMapObject).sort())
      .toStrictEqual(['lg', 'md', 'sm', 'xl', 'xs'].sort());
  });
});

describe('mapBreakpoint', () => {
  it('should return null for unrecognized breakpoint', () => {
    expect(mapBreakpoint('')).toBe(null);
  });

  it('should return "375px" for "xs"', () => {
    expect(mapBreakpoint('xs')).toBe('375px');
  });

  it('should return "425px" for "sm"', () => {
    expect(mapBreakpoint('sm')).toBe('425px');
  });

  it('should return "768px" for "md"', () => {
    expect(mapBreakpoint('md')).toBe('768px');
  });

  it('should return "1024px" for "lg"', () => {
    expect(mapBreakpoint('lg')).toBe('1024px');
  });

  it('should return "1440px" for "xl"', () => {
    expect(mapBreakpoint('xl')).toBe('1440px');
  });

  describe('with customization', () => {
    it('should support overwriting core values', () => {
      expect(mapBreakpoint('sm', { sm: '102rem' })).toBe('102rem');
    });

    it('should support custom breakpoint name', () => {
      expect(mapBreakpoint('small', { small: '102rem' })).toBe('102rem');
    });
  });
});
