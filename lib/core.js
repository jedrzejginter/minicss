module.exports.formatCalc = function formatCalc(x) {
  return x
    .replace(/([\-\+\[\]\*\/])/g, " $1 ")
    .replace(/\[\s?/g, "(")
    .replace(/\s?\]/g, ")")
    .replace(/^\s\-\s?/g, "-")
    .replace(/\s{2,}/g, " ")
    .replace(/([\*\/\+\-])\s\-\s(\d)/g, "$1 -$2")
    .replace(/\(\s+\(/g, "((")
    .replace(/\)\s+\)/g, "))")
    .trim();
}

module.exports.escapeClassName = function escapeClassName(c) {
  return c.replace(/([^\da-z_\-])/gi, "\\$1");
}

module.exports.makeRule = function makeRule(o) {
  const v = o.values.join(',');
  return o.properties.map((p) => p + ':' + v).join(';')
}

module.exports.hexToRgb = function hexToRgb(hex) {
  const longHex = hex.length === 3 ? hex.split('').map((v) => v+v).join('') : hex;
  const [r, g, b] = longHex.match(/.{2}/g);

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
  };
}

module.exports.makeSelector = function makeSelector(o) {
  let stateSuffix = '';

  if (o.state && o.state !== 'default') {
    stateSuffix = ':' + o.state;
  }

  return '.' + o.className + stateSuffix;
};

module.exports.ungroupCssVal = function ungroupCssVal(v) {
  return v.split("|").map(x => x.trim());
}
