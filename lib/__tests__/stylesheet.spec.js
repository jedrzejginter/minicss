const { makeCssStyles, extractFromClassNames } = require('../stylesheet');

describe('makeCssStyles', () => {
  it('should create valid css styles', () => {
    expect(makeCssStyles({
      className: 'C(#000)',
      properties: ['color'],
      values: ['#000'],
    })).toBe('.C\\(\\#000\\){color:#000}')
  });
});

describe('extractFromClassNames', () => {
  it('should extract many class names', () => {
    const e = extractFromClassNames('C(red) Bgc(#000):h xl:W(100%*[4rem-2px])');

    expect(e[0]).toStrictEqual({ className: 'C(red)', properties: ['color'], values: ['red'], state: null, media: null })
    expect(e[1]).toStrictEqual({ className: 'Bgc(#000):h', properties: ['background-color'], values: ['#000'], state: 'hover', media: null })
    expect(e[2]).toStrictEqual({ className: 'xl:W(100%*[4rem-2px])', properties: ['width'], values: ['calc(100% * (4rem - 2px))'], state: null, media: '1440px' })
  });
});
