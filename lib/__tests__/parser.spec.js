const { parseFnClassName } = require('../parser');

describe('parseFnClassName', () => {
  it('should skip parsing for non-functional class names', () => {
    expect(parseFnClassName('my-class')).toBe(null);
  });

  it('should parse simple class name', () => {
    expect(parseFnClassName('C(red)')).toStrictEqual(
      { property: 'C', value: 'red', media: undefined, state: undefined },
    );
  });

  it('should parse class name with state', () => {
    expect(parseFnClassName('W(100%):h')).toEqual(
      expect.objectContaining({ state: 'h' }),
    );
  });

  it('should parse class name with media flag', () => {
    expect(parseFnClassName('xl:Pos(r)')).toStrictEqual(
      { property: 'Pos', media: 'xl', value: 'r', state: undefined },
    );
  });

  it('should parse class name with media and state', () => {
    expect(parseFnClassName('sm:M(10):f')).toStrictEqual(
      { property: 'M', media: 'sm', value: '10', state: 'f' },
    );
  });
});
