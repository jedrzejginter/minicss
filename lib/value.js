const valMapObject = {
  b: (p) => p === 'font-weight' ? 'bold' : 'bottom',
  c: (p) => /^font(\-.+)?$/.test(p) ?  'condensed' : 'center',
  fe: () => "flex-end",
  i: (p) => p === 'font-style' ? 'italic' : 'inherit',
  n: p => (p === "background-repeat" ? "no-repeat" : "none"),
  nr: () => "no-repeat",
  r: (p) => p === 'position' ? 'relative' : 'right',
  s: p => {
    if (p === 'position') {
      return 'static';
    }

    return /^border(\-.+)?$/.test(p) ? "solid" : "start";
  },
  st: () => "stretch",
};

module.exports.reverseVal = function reverseVal(v, p) {
  return valMapObject[v] ? valMapObject[v](p) : v;
};
