const { clearModifier } = require('../helpers');

describe('clearModifier', () => {
  it('works', () => {
    expect(clearModifier(':h')).toBe('h');
  });
});
