const { reverseVal } = require('../value');

describe('reverseVal', () => {
  it('should return input value for unrecognized shorthand', () => {
    expect(reverseVal('monospace')).toBe('monospace');
    expect(reverseVal('solid')).toBe('solid');
    expect(reverseVal('unset')).toBe('unset');
  });

  describe('"b"', () => {
    it('should default to "bottom"', () => {
      expect(reverseVal('b')).toBe('bottom');
    });

    it('should be "bold" for "font-weight"', () => {
      expect(reverseVal('b', 'font-weight')).toBe('bold');
    });
  });

  describe('"c"', () => {
    it('should default to "center"', () => {
      expect(reverseVal('c')).toBe('center');
    });

    it('should be "condensed" for "font-family"', () => {
      expect(reverseVal('c', 'font-family')).toBe('condensed');
    });
  });

  describe('"fe"', () => {
    it('should default to "flex-end"', () => {
      expect(reverseVal('fe')).toBe('flex-end');
    });
  });

  describe('"i"', () => {
    it('should default to "inherit"', () => {
      expect(reverseVal('i')).toBe('inherit');
    });

    it('should be "italic" for "font-style"', () => {
      expect(reverseVal('i', 'font-style')).toBe('italic');
    });
  });

  describe('"n"', () => {
    it('should default to "none"', () => {
      expect(reverseVal('n')).toBe('none');
    });

    it('should be "no-repeat" for "background-repeat" (as alias)', () => {
      expect(reverseVal('n', 'background-repeat')).toBe('no-repeat');
    });
  });

  describe('"nr"', () => {
    it('should default to "no-repeat"', () => {
      expect(reverseVal('nr')).toBe('no-repeat');
    });
  });

  describe('"r"', () => {
    it('should default to "right"', () => {
      expect(reverseVal('r')).toBe('right');
    });

    it('should be "relative" for "position"', () => {
      expect(reverseVal('r', 'position')).toBe('relative');
    });
  });

  describe('"s"', () => {
    it('should default to "start"', () => {
      expect(reverseVal('s')).toBe('start');
    });

    it('should be "solid" for "border-style"', () => {
      expect(reverseVal('s', 'border-style')).toBe('solid');
    });

    it('should be "static" for "position"', () => {
      expect(reverseVal('s', 'position')).toBe('static');
    });
  });

  describe('"st"', () => {
    it('should default to "stretch"', () => {
      expect(reverseVal('st')).toBe('stretch');
    });
  });
});
