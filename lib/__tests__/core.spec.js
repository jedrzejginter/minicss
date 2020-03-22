const { escapeClassName, formatCalc, hexToRgb, makeRule, makeSelector, ungroupCssVal } = require('../core');

describe('escapeClassName', () => {
  it('should escape simple class name', () => {
    expect(escapeClassName('Ai(fe)')).toBe('Ai\\(fe\\)');
  });

  it('should escape with state flag', () => {
    expect(escapeClassName('Bgc(red):h')).toBe('Bgc\\(red\\)\\:h');
  });

  it('should escape with media breakpoint prefix', () => {
    expect(escapeClassName('sm:W(100px)')).toBe('sm\\:W\\(100px\\)');
  });

  it('should escape chars in value', () => {
    expect(escapeClassName('W(100%)')).toBe('W\\(100\\%\\)');
  });

  it('should escape multiple values', () => {
    expect(escapeClassName('Bd(1,solid,black)')).toBe('Bd\\(1\\,solid\\,black\\)');
  });

  it('should escape using calc(..)', () => {
    expect(escapeClassName('W([100%-5rem]*14)')).toBe('W\\(\\[100\\%-5rem\\]\\*14\\)');
  });

  it('should escape groups delimiter', () => {
    expect(escapeClassName('Bxsh(inset,0,0,0,red|10,20,30,black)'))
      .toBe('Bxsh\\(inset\\,0\\,0\\,0\\,red\\|10\\,20\\,30\\,black\\)');
  });

  it('should escape possible, user-customized chars', () => {
    expect(escapeClassName('C($my-var)')).toBe('C\\(\\$my-var\\)');
    expect(escapeClassName('C(@myVar)')).toBe('C\\(\\@myVar\\)');
  });
});

describe('formatCalc', () => {
  it('should add spaces', () => {
    expect(formatCalc('100%-1rem')).toBe('100% - 1rem')
  });

  it('should transform brackets', () => {
    expect(formatCalc('[100%-1rem]')).toBe('(100% - 1rem)')
  });

  it('should recognize "*" as multiplication', () => {
    expect(formatCalc('[100%-1rem]*3')).toBe('(100% - 1rem) * 3')
  });

  it('should recognize "/" as division', () => {
    expect(formatCalc('[100%-1rem]/3')).toBe('(100% - 1rem) / 3')
  });

  it('should keep negative values without spaces', () => {
    expect(formatCalc('-50px+13px')).toBe('-50px + 13px');
    expect(formatCalc('-50px*-3')).toBe('-50px * -3');
  });

  it('should work for complex example', () => {
    expect(formatCalc('-33%*[12+4*17rem]/[[5pt-12px]*7.5*[981.3px-13rem/0.44]]'))
      .toBe('-33% * (12 + 4 * 17rem) / ((5pt - 12px) * 7.5 * (981.3px - 13rem / 0.44))');
  });
});

describe('hexToRgb', () => {
  it('should work for hex in standard format', () => {
    expect(hexToRgb('007a19')).toStrictEqual({ r: 0, g: 122, b: 25 });
  });

  it('should work for hex in short format', () => {
    expect(hexToRgb('f45')).toStrictEqual({ r: 255, g: 68, b: 85 });
  });
});

describe('makeRule', () => {
  it('should create a simple css rule', () => {
    expect(makeRule({ properties: ['width'], values: [10] })).toBe('width:10');
  });

  it('should work for multiple values', () => {
    expect(makeRule({
      properties: ['box-shadow'],
      values: ['inset 0 0 10px black', '0 3px 15px #049']
    })).toBe('box-shadow:inset 0 0 10px black,0 3px 15px #049');
  });

  it('should work for multiple properties', () => {
    expect(makeRule({
      properties: ['padding-left', 'padding-right'],
      values: ['0 4rem']
    })).toBe('padding-left:0 4rem;padding-right:0 4rem');
  });
});

describe('makeSelector', () => {
  it('should create simple class selector', () => {
    expect(makeSelector({ className: 'my-class', state: 'default' })).toBe('.my-class')
  });

  it('should work without "state" passed', () => {
    expect(makeSelector({ className: 'my-class' })).toBe('.my-class')
  });

  it('should work with non-default state', () => {
    expect(makeSelector({ className: 'my-class', state: 'focus' })).toBe('.my-class:focus')
  });

  it('should work for escaped class names', () => {
    expect(makeSelector({ className: 'C\\(red\\)\\:h', state: 'hover' }))
      .toBe('.C\\(red\\)\\:h:hover')
  });
});

describe('ungroupCssVal', () => {
  it('should return one group', () => {
    expect(ungroupCssVal('1,solid,#00a')).toStrictEqual(['1,solid,#00a']);
  });

  it('should return all groups', () => {
    expect(ungroupCssVal('inset,0,0,10px,black|-9px,10rem,15px,0,#000'))
      .toStrictEqual(['inset,0,0,10px,black', '-9px,10rem,15px,0,#000']);
  });
});
