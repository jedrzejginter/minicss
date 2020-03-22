const { mapState, statesMapObject } = require('../state');

describe('statesMapObject', () => {
  test('should remain unchanged', () => {
    expect(statesMapObject).toMatchSnapshot();
  });
});

describe('mapState', () => {
  it('should fall back to "default"', () => {
    expect(mapState('')).toBe('default');
  });

  it('should correctly recognize "a" as "active"', () => {
    expect(mapState('a')).toBe('active');
  });

  it('should correctly recognize "c" as "checked"', () => {
    expect(mapState('c')).toBe('checked');
  });

  it('should correctly recognize "d" as "disabled"', () => {
    expect(mapState('d')).toBe('disabled');
  });

  it('should correctly recognize "e" as "empty"', () => {
    expect(mapState('e')).toBe('empty');
  });

  it('should correctly recognize "f" as "focus"', () => {
    expect(mapState('f')).toBe('focus');
  });

  it('should correctly recognize "h" as "hover"', () => {
    expect(mapState('h')).toBe('hover');
  });

  it('should correctly recognize "v" as "visited"', () => {
    expect(mapState('v')).toBe('visited');
  });
});
