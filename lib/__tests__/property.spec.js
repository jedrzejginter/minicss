const { propMapObject, reverseProp } = require('../property');

describe('reverseProp', () => {
  it('should fall back to "unknown"', () => {
    expect(reverseProp('')).toBe('unknown');
  });

  it('should map "Ai" as "align-items"', () => {
    expect(reverseProp('Ai')).toBe('align-items');
  });

  it('should map "Ap" as "appearance"', () => {
    expect(reverseProp('Ap'))
      .toStrictEqual(["-moz-appearance", "-webkit-appearance", "appearance"]);
  });

  it('should map "Bd" to "border"', () => {
    expect(reverseProp('Bd')).toBe("border");
  });

  it('should map "Bdc" to "border-color"', () => {
    expect(reverseProp('Bdc')).toBe("border-color");
  });

  it('should map "Bdrs" to "border-radius"', () => {
    expect(reverseProp('Bdrs')).toBe('border-radius');
  });

  it('should map "Bds" to "border-style"', () => {
    expect(reverseProp('Bds')).toBe("border-style");
  });

  it('should map "Bgc" to "background-color"', () => {
    expect(reverseProp('Bgc')).toBe('background-color');
  });

  it('should map "Bgi" to "background-image"', () => {
    expect(reverseProp('Bgi')).toBe("background-image");
  });

  it('should map "Bgr" to "background-repeat"', () => {
    expect(reverseProp('Bgr')).toBe("background-repeat");
  });

  it('should map "Bxsh" to "box-shadow"', () => {
    expect(reverseProp('Bxsh')).toBe("box-shadow");
  });

  it('should map "C" to "color"', () => {
    expect(reverseProp('C')).toBe("color");
  });

  it('should map "F" to "font"', () => {
    expect(reverseProp('F')).toBe('font');
  });

  it('should map "Ff" to "font-family"', () => {
    expect(reverseProp('Ff')).toBe('font-family');
  });

  it('should map "Fs" to "font-style"', () => {
    expect(reverseProp('Fs')).toBe('font-style');
  });

  it('should map "Fw" to "font-weight"', () => {
    expect(reverseProp('Fw')).toBe('font-weight');
  });

  it('should map "Fxg" to "flex-grow"', () => {
    expect(reverseProp('Fxg')).toBe('flex-grow');
  });

  it('should map "Fz" to "font-size"', () => {
    expect(reverseProp('Fz')).toBe('font-size');
  });

  it('should map "Jc" to "justify-content"', () => {
    expect(reverseProp('Jc')).toBe("justify-content");
  });

  it('should map "Justify" to "justify-content"', () => {
    expect(reverseProp('Justify')).toBe("justify-content");
  });

  it('should map "M" to "margin"', () => {
    expect(reverseProp('M')).toBe("margin");
  });

  it('should map "Op" to "opacity"', () => {
    expect(reverseProp('Op')).toBe('opacity');
  });

  it('should map "Ord" to "order"', () => {
    expect(reverseProp('Ord')).toBe('order');
  });

  it('should map "P" to "padding"', () => {
    expect(reverseProp('P')).toBe('padding');
  });

  it('should map "Pos" to "position"', () => {
    expect(reverseProp('Pos')).toBe('position');
  });

  it('should map "Px" to ""padding-left", "padding-right""', () => {
    expect(reverseProp('Px')).toStrictEqual(["padding-left", "padding-right"]);
  });

  it('should map "T" to "top"', () => {
    expect(reverseProp('T')).toBe("top");
  });

  it('should map "W" to "width"', () => {
    expect(reverseProp('W')).toBe("width");
  });

  it('should map "Z" to "z-index"', () => {
    expect(reverseProp('Z')).toBe('z-index');
  });

});
