module.exports = (v, { property }) => {
  switch (v) {
    case 'b': {
      // Fw(b) -> font-weight: bold;
      if (property === 'font-weight') {
        return 'bold';
      }

      // Ai(b) -> align-items: bottom;
      return 'bottom';
    }
    case 'c': {
      return 'center';
    }
    case 's': {
      // Bd(1,s,crimson) -> border: 1px solid;
      // Bds(s) -> border-style: solid;
      if (property === 'border' || property === 'border-style') {
        return 'solid';
      }

      // Ai(s) -> align-items: start;
      return 'start';
    }
    case 'fe': {
      return 'flex-end';
    }
    case 'fs': {
      return 'flex-start';
    }
  }

  return v;
};
